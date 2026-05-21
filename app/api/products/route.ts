import { supabase } from "@/lib/supabase";

export async function GET() {
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