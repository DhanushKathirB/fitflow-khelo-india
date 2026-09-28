import { NextResponse } from 'next/server';
import { StravaClient } from '@/lib/integrations/strava';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const testType = (searchParams.get('test') as 'SPRINT_50M' | 'RUN_600M') || 'SPRINT_50M';
  const client = new StravaClient();
  const activity = client.getMockActivity(testType);

  return NextResponse.json({
    status: 'success',
    provider: 'Strava',
    activity,
  });
}
