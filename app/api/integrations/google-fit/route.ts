import { NextResponse } from 'next/server';
import { GoogleFitClient } from '@/lib/integrations/googleFit';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const duration = parseInt(searchParams.get('duration') || '60', 10);
  const client = new GoogleFitClient();
  const telemetry = client.getMockTelemetry(Date.now() - duration * 1000, duration);

  return NextResponse.json({
    status: 'success',
    provider: 'Google Fit',
    data: telemetry,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { repCount, durationSeconds, telemetry } = body;
    const client = new GoogleFitClient();

    const analysis = client.correlateWithPoseData(
      repCount || 30,
      durationSeconds || 60,
      telemetry || client.getMockTelemetry(Date.now() - 60000, 60)
    );

    return NextResponse.json({
      status: 'success',
      verificationAnalysis: analysis,
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 400 });
  }
}
