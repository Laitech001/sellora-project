import { supabase } from "@/lib/supabase"

type Store = {
  id: string
  name: string
  slug: string
  phone_number: number
  address: string
  business_type: string
  user_id: string
}

export async function getStoreBySlug( slug: string): Promise<Store | null> {
  
  try {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error("Can't fetch store:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}