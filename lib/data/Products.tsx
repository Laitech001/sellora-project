import { supabase } from "../supabase"

export async function getProducts() {

  const { data, error} = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.log(error);
    return[];
  }

  console.log(data)

  return data;
}