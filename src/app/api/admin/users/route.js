import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export async function GET(request) {
  try {
    // Check if requester is an admin (Optional: add your admin check logic here)
    // For now, we assume this is protected by CMS layout or similar

    // Fetch all users using admin API
    const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersError) throw usersError;

    // Fetch completed orders for the current month
    const date = new Date();
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();

    const { data: ordersData, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('user_id, package_amount')
      .eq('status', 'completed')
      .gte('created_at', startOfMonth)
      .lte('created_at', endOfMonth);

    if (ordersError) throw ordersError;

    // Calculate total sales per user
    const salesMap = {};
    if (ordersData) {
      ordersData.forEach(order => {
        if (!salesMap[order.user_id]) salesMap[order.user_id] = 0;
        salesMap[order.user_id] += (order.package_amount || 0);
      });
    }

    // Merge sales data with users
    const usersWithSales = usersData.users.map(user => {
      return {
        ...user,
        currentSales: salesMap[user.id] || 0
      };
    });

    return NextResponse.json({ users: usersWithSales }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
