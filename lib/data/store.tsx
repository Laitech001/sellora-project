import { supabase } from "@/lib/supabase"

type Props = {
  slug: string
}

export async function getStoreBySlug({ slug }: Props) {

  console.log('searching for slug:', slug);
  
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