import { NextResponse } from 'next/server';
import axios from 'axios';
import { DateTime } from 'luxon';

const URL = 'https://joyful-429b0-default-rtdb.asia-southeast1.firebasedatabase.app/';

export async function GET(request: Request, context: { params: { userId: string } }) {
    const { userId } = context.params;  // From context to get userId

    try {
        console.log("Fetching data for Id:", userId);
        const response = await axios.get(`${URL}/users/${userId}.json`);

        const userData = response.data;

        // Checking for task data
        if (!userData || !userData.task) {
            console.log('No task field found for this user.');
            return new NextResponse(null, { status: 204 });
        }

        // Get addInfo
        const addInfoResponse = await axios.get(`${URL}/addInfo/${userId}.json`);
        const addInfoData = addInfoResponse.data;

        // If there is no info
        if (!addInfoData) {
            return new NextResponse(null, { status: 204 });
        }

        const currentSydneyTime = DateTime.now().setZone('Australia/Sydney').toISODate() || DateTime.now().toISODate();

        // Records grouped by month and total amount calculated
        const groupedByMonth: any = {};  // For grouping records by month

        Object.entries(addInfoData).forEach(([recordId, recordData]: [string, any]) => {
            const recordDate = DateTime.fromISO(recordData.date, { zone: 'Australia/Sydney' }).toISODate();

            if (recordDate == null) {
                return;
            }

            // Records by month
            const month = recordDate.slice(0, 7);

            // Initialise month grouping (if none exists)
            if (!groupedByMonth[month]) {
                groupedByMonth[month] = {};
            }

            // Summary amounts by category
            const category = recordData.category;
            groupedByMonth[month][category] = (groupedByMonth[month][category] || 0) + parseFloat(recordData.moneyAdded);
        });

        // Return monthly results
        const responsePayload = {
            userId,
            groupedByMonth  
        };

        // Returning user data
        return NextResponse.json(responsePayload);

    } catch (error) {
        // Detailed logging of error msg
        console.error('Error fetching user data:', error);
        return new NextResponse('Failed to fetch user data', { status: 500 });
    }
}
