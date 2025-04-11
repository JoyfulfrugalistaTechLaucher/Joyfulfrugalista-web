import { NextResponse } from 'next/server';
import axios from 'axios';
import { DateTime } from 'luxon';
import { log } from 'console';
import { SavingsRecord } from '@/app/interface';
import { FB_URL } from '@/app/constants';

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

    // Check if user has task data
    if (!userData || !userData.task) {
      console.log('No task field found for this user.');
      return new NextResponse(null, { status: 204 });}

    //fetch goal and the day of setting the goal
    const { task } = userData;
    const { goal, setDate } = task;

    //fetch add info
    const addInfoResponse = await axios.get(`${FB_URL}/addInfo/${userId}.json`);
    const addInfoData = addInfoResponse.data;

    //handle no content
    if (!addInfoData) {
      return new NextResponse(null, { status: 204 });
    }
    //console.log(addInfoData);

    //convert UTC to sydney
    const setDateSydney = DateTime.fromISO(setDate, { zone: 'Australia/Sydney' }).toISODate();
    if(setDateSydney == null) {
      return new NextResponse(null, { status: 204 });
    }
    const currentSydneyTime = DateTime.now().setZone('Australia/Sydney').toISODate()
      || DateTime.now().toISODate();

    console.log("Current Sydney Date:", currentSydneyTime);
    console.log("setdate:", setDateSydney);

    //Filter records based on setDate and compute total saving
    let totalMoneyAdded = 0;
    const filteredRecords = [];

    Object.entries(addInfoData)
      .forEach(([recordId, recordData]) => {
        const record = recordData as SavingsRecord;
        const recordDate = record.date.toISOString().split('T')[0];

        // Although it can return error message, now I just skip it.
        if(recordDate == null) {
          return;
        }
        //console.log(recordData);
        // Only consider records where the date is on or before the current Sydney date
        if (recordDate >= setDateSydney && recordDate <= currentSydneyTime) {
          filteredRecords.push({
            id: recordId,
            ...record,
          });
          console.log(record);

          totalMoneyAdded += record.saved || 0;  // Accumulate total money added
        }
      });

    // Return the result
    const responsePayload = {
      userId,
      goal,
      totalMoneyAdded,
      setDateSydney

    };

    // 返回用户数据
    return NextResponse.json(responsePayload);

    // 返回用户数据

  } catch (error) {
    // 详细记录错误信息
    console.error('Error fetching user data:', error);
    return new NextResponse('Failed to fetch user data', { status: 500 });
  }
}
