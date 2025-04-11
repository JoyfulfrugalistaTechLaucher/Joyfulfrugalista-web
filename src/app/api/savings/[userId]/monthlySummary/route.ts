import { NextResponse } from 'next/server';
import axios from 'axios';
import { DateTime } from 'luxon';
import { FB_URL } from '@/app/constants';
import { SavingsRecord } from '@/app/interface';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  // Await the params promise to get the userId
  const resolvedParams = await params;
  const userId = resolvedParams.userId;

  try {
    console.log("Fetching data for Id:", userId);
    const response = await axios.get(`${FB_URL}/users/${userId}.json`);

    const userData = response.data;

    // Checking for task data
    if (!userData || !userData.task) {
      console.log('No task field found for this user.');
      return new NextResponse(null, { status: 204 });
    }

    // Get addInfo
    const addInfoResponse = await axios.get(`${FB_URL}/addInfo/${userId}.json`);
    const addInfoData = addInfoResponse.data;

    // If there is no info
    if (!addInfoData) {
      return new NextResponse(null, { status: 204 });
    }

    const currentSydneyTime = DateTime.now().setZone('Australia/Sydney').toISODate()
      || DateTime.now().toISODate();

    // Records grouped by month and total amount calculated
    const groupedByMonth: { [month: string]: { [category: string]: number } } = {};

    Object.entries(addInfoData)
      .forEach(([recordId, recordData]) => {
        const record = recordData as SavingsRecord;
        const recordDate = record.date.toISOString().split('T')[0];

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
      const category = record.category;
        groupedByMonth[month][category] = (groupedByMonth[month][category] || 0)
          + record.saved;
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
