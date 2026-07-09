import { cookies } from 'next/headers';

type Store = {
  id: string
  name: string
  slug: string
  whatsapp_number: string
  address: string
  business_type: string
  user_id: string
}

export async function getStoreBySlug( slug: string): Promise<Store | null> {

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const cookieStore = await cookies();

  try {
    const res = await fetch(`${baseUrl}/api/stores/${slug}/store`, {
      method: 'GET',
      headers: {
        cookie: cookieStore.toString(),
      },
      cache: 'no-store',
      })


    if (!res.ok) {
      console.error(`Error fetching store for slug ${slug}:`, res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    return data.store as Store | null;
  } catch (error) {
    console.error(error);
    return null;
  }
}