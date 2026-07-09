import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export async function POST(request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: 'Nomor WhatsApp wajib diisi.' }, { status: 400 });
    }

    // Normalize phone: convert 08xx to 628xx for WA API
    let waNumber = phone.replace(/\D/g, '');
    if (waNumber.startsWith('0')) {
      waNumber = '62' + waNumber.slice(1);
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

    // Delete any existing OTPs for this phone
    await supabaseAdmin
      .from('otp_codes')
      .delete()
      .eq('phone', phone);

    // Store OTP in database
    const { error: dbError } = await supabaseAdmin
      .from('otp_codes')
      .insert({
        phone,
        code,
        expires_at: expiresAt,
        verified: false,
      });

    if (dbError) {
      console.error('DB Error:', dbError);
      return NextResponse.json({ error: 'Gagal menyimpan kode OTP.' }, { status: 500 });
    }

    // Send OTP via Fonnte
    const fonnteToken = process.env.FONNTE_API_TOKEN;
    if (!fonnteToken) {
      console.error('FONNTE_API_TOKEN not set');
      return NextResponse.json({ error: 'Konfigurasi server belum lengkap.' }, { status: 500 });
    }

    const fonnteResponse = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': fonnteToken,
      },
      body: new URLSearchParams({
        target: waNumber,
        message: `*SENARA - Kode Verifikasi*\n\nKode OTP Anda: *${code}*\n\nBerlaku selama 5 menit.\nJangan bagikan kode ini kepada siapapun.`,
      }),
    });

    const fonnteResult = await fonnteResponse.json();

    if (!fonnteResponse.ok || fonnteResult.status === false) {
      console.error('Fonnte Error:', fonnteResult);
      return NextResponse.json({ error: 'Gagal mengirim kode OTP ke WhatsApp.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Kode OTP telah dikirim ke WhatsApp Anda.' });
  } catch (err) {
    console.error('Send OTP Error:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}
