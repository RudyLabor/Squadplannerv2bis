/**
 * 🔔 API Route for Vercel Cron - Send Reminders
 * Calls Supabase Edge Function
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Verify cron secret
  const cronSecret = req.headers['authorization'];
  if (cronSecret !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseFunctionUrl = `${supabaseUrl}/functions/v1/send-reminders`;

    const response = await fetch(supabaseFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Edge function failed: ${response.statusText}`);
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      result: data,
    });
  } catch (error: any) {
    console.error('Cron error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
