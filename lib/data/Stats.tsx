
export type Stats = {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalSales: number;
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function getstats(slug: string): Promise<Stats> {
  try {
    const res = await fetch(`${baseUrl}/api/stores/${slug}/stats`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      const errorPayload = await res.text();
      console.error('Failed to fetch stats:', res.status, errorPayload);
      throw new Error('Failed to fetch stats');
    }

    const stats = await res.json();
    return stats;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }

}