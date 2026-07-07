import { createClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  
  // Get the logged in user server-side
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { data: products, error } = await supabase
    .from('products')
    .select('*');

  if (error) console.log(error);

  return new Response(JSON.stringify(products), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}