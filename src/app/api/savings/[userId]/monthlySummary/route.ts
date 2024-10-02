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

        // Check if user has task data
        if (!userData || !userData.task) {
            console.log('No task field found for this user.');
            return new NextResponse(null, { status: 204 });
        }

        // Fetch add info
        const addInfoResponse = await axios.get(`${URL}/addInfo/${userId}.json`);
        const addInfoData = addInfoResponse.data;

        // Handle no content
        if (!addInfoData) {
            return new NextResponse(null, { status: 204 });
        }

        // Fetch the date the goal was set
        const { task } = userData;
        const { setDate } = task;
        const setDateSydney = DateTime.fromISO(setDate, { zone: 'Australia/Sydney' }).toISODate();
        if (setDateSydney == null) {
            return new NextResponse(null, { status: 204 });
        }
        const currentSydneyTime = DateTime.now().setZone('Australia/Sydney').toISODate() || DateTime.now().toISODate();

        // Filter records based on setDate and compute total saving
        const groupedByMonth: any = {};  // For grouping records by month

        Object.entries(addInfoData).forEach(([recordId, recordData]: [string, any]) => {
            const recordDate = DateTime.fromISO(recordData.date, { zone: 'Australia/Sydney' }).toISODate();

            if (recordDate == null) {
                return;
            }

            // Only consider records where the date is on or before the current Sydney date
            if (recordDate >= setDateSydney && recordDate <= currentSydneyTime) {

                // Extract month (e.g., '2024-08')
                const month = recordDate.slice(0, 7);

                // Initialize if not exists
                if (!groupedByMonth[month]) {
                    groupedByMonth[month] = {};
                }

                // 按类型汇总金额
                const category = recordData.category;
                groupedByMonth[month][category] = (groupedByMonth[month][category] || 0) + parseFloat(recordData.moneyAdded);
            }
        });

        // Return the result with the required format
        const responsePayload = {
            userId,
            groupedByMonth  // Returns data containing only the userId and aggregated by month
        };

        // Returning user data
        return NextResponse.json(responsePayload);

    } catch (error) {
        // Detailed logging of error messages
        console.error('Error fetching user data:', error);
        return new NextResponse('Failed to fetch user data', { status: 500 });
    }
}
