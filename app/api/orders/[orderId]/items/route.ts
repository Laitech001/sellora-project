import { createClient } from '@/lib/supabaseServer';

type Params = {
  params: {
    orderId: string;
  };
};

export async function GET(_req: Request, { params }: Params) {
  const { orderId } = params;

  if (!orderId) {
    return Response.json({ error: 'Missing order ID' }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);

  if (error) {
    console.error('Failed to fetch order items:', error);
    return Response.json({ error: 'Failed to fetch order items' }, { status: 500 });
  }

  return Response.json(data ?? []);
}
