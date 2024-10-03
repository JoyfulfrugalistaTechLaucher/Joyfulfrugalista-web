import { NextResponse } from 'next/server';
import axios from 'axios';
import { DateTime } from 'luxon';

const URL = 'https://joyful-429b0-default-rtdb.asia-southeast1.firebasedatabase.app/';

export async function GET(request: Request, context: { params: { userId: string } }) {
    const { userId } = context.params;  // 从 context 获取 userId

    try {
        console.log("Fetching data for Id:", userId);
        const response = await axios.get(`${URL}/users/${userId}.json`);

        const userData = response.data;

        // Check whether there is task data
        if (!userData || !userData.task) {
            console.log('No task field found for this user.');
            return new NextResponse(null, { status: 204 });
        }

        // Get additional information
        const addInfoResponse = await axios.get(`${URL}/addInfo/${userId}.json`);
        const addInfoData = addInfoResponse.data;

        // If there is no content
        if (!addInfoData) {
            return new NextResponse(null, { status: 204 });
        }

        // Get the current Sydney time
        const currentSydneyTime = DateTime.now().setZone('Australia/Sydney').toISODate() || DateTime.now().toISODate();

        // Group records and calculate the total amount by month
        const groupedByMonth: any = {};

        Object.entries(addInfoData).forEach(([recordId, recordData]: [string, any]) => {
            const recordDate = DateTime.fromISO(recordData.date, { zone: 'Australia/Sydney' }).toISODate();

            if (recordDate == null) {
                return;
            }

            // Data statistics are performed according to the current time and the recording time
            const month = recordDate.slice(0, 7); // Get month info, e.g. '2024-08'

            // Initialize the grouping
            if (!groupedByMonth[month]) {
                groupedByMonth[month] = {};
            }

            // Summarize amounts by category
            const category = recordData.category;
            groupedByMonth[month][category] = (groupedByMonth[month][category] || 0) + parseFloat(recordData.moneyAdded);
        });

        // Returns the data in the desired format
        const responsePayload = {
            userId,
            groupedByMonth  // Returns statistics grouped by month
        };

        // Returns user data
        return NextResponse.json(responsePayload);


    } catch (error) {
        // Log error msg
        console.error('Error fetching user data:', error);
        return new NextResponse('Failed to fetch user data', { status: 500 });
    }
}
