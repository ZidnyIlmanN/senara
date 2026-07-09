import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export async function POST(request) {
  try {
    const { phone, code } = await request.json();

    if (!phone || !code) {
      return NextResponse.json({ error: 'Nomor WhatsApp dan kode OTP wajib diisi.' }, { status: 400 });
    }

    // Find matching OTP
    const { data: otpRecord, error: dbError } = await supabaseAdmin
      .from('otp_codes')
      .select('*')
      .eq('phone', phone)
      .eq('code', code)
      .single();

    if (dbError || !otpRecord) {
      return NextResponse.json({ error: 'Kode OTP tidak valid.' }, { status: 400 });
    }

    // Check expiry
    if (new Date(otpRecord.expires_at) < new Date()) {
      // Delete expired OTP
      await supabaseAdmin.from('otp_codes').delete().eq('id', otpRecord.id);
      return NextResponse.json({ error: 'Kode OTP sudah kedaluwarsa. Silakan kirim ulang.' }, { status: 400 });
    }

    // Mark as verified
    await supabaseAdmin
      .from('otp_codes')
      .update({ verified: true })
      .eq('id', otpRecord.id);

    return NextResponse.json({ success: true, message: 'Kode OTP berhasil diverifikasi.' });
  } catch (err) {
    console.error('Verify OTP Error:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}
