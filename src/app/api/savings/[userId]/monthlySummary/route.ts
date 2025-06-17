import { NextResponse } from 'next/server';
import axios from 'axios';
import { DateTime } from 'luxon';
import { FB_URL } from '@/app/constants';
import { RawRecord } from '@/app/interface';

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
      console.error(`No task found for user: ${userId}`);
      return new NextResponse(null, { status: 204 });
    }

    // Get addInfo
    const addInfoResponse = await axios.get(`${FB_URL}/addInfo/${userId}.json`);
    const addInfoData = addInfoResponse.data;

    // If there is no info
    if (!addInfoData) {
      console.error(`No add info found for user: ${userId}`);
      return new NextResponse(null, { status: 204 });
    }

    const currentSydneyTime = DateTime.now().setZone('Australia/Sydney').toISODate()
      || DateTime.now().toISODate();

    // Records grouped by month in the same year and total amount calculated
    const groupedByMonth: { [month: string]: { [category: string]: number } } = {};

    Object.entries(addInfoData)
      .forEach(([recordId, rawRecord]) => {
        const record = rawRecord as RawRecord;
        if (record == null || record.date === '') {
          return;
        }

        // Records by month in the same year
        const month = record.date.slice(0, 7);

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
