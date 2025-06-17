import { NextResponse } from 'next/server';
import axios from 'axios';
import { DateTime } from 'luxon';
import { log } from 'console';
import { RawRecord } from '@/app/interface';
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
      console.error(`No task found for user: ${userId}`);
      return new NextResponse(null, { status: 204 });}

    //fetch goal and the day of setting the goal
    const { task } = userData;
    const { goal, setDate } = task;

    //fetch add info
    const addInfoResponse = await axios.get(`${FB_URL}/addInfo/${userId}.json`);
    const addInfoData = addInfoResponse.data;

    //handle no content
    if (!addInfoData) {
      console.error(`No add info found for user: ${userId}`);
      return new NextResponse(null, { status: 204 });
    }

    //convert UTC to sydney
    const setDateSydney = DateTime.fromISO(setDate, { zone: 'Australia/Sydney' });
    if(setDateSydney == null) {
      console.error(`Failed to get the goal-setting date for user: ${userId}`);
      return new NextResponse(null, { status: 204 });
    }

    const currentSydneyTime = DateTime.now().setZone('Australia/Sydney');

    console.log("Current Sydney Date:", currentSydneyTime);
    console.log("setdate:", setDateSydney);

    //Filter records based on setDate and compute total saving
    let totalSaved = 0;

    Object.entries(addInfoData)
      .forEach(([recordId, rawRecord]) => {
        const record = rawRecord as RawRecord;
        if(record == null || record.date === '') {
          return;
        }
        const recordDate = DateTime.fromISO(
          record.date, { zone: 'Australia/Sydney'});

        // Only consider records on/earlier than current Sydney date
        if (recordDate.valueOf() >= setDateSydney.valueOf()
          && recordDate.valueOf() <= currentSydneyTime.valueOf()) {
            totalSaved += record.saved || 0;  // Accumulate total money added
          }
      });

    // Return the result
    const responsePayload = {
      userId,
      goal,
      totalSaved,
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
