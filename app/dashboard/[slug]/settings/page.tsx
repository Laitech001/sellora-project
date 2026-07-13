// app/dashboard/[slug]/settings/page.tsx (Server Component)
import { SettingsPage } from "@/components/dashboard/settings";
import { getStoreBySlug } from "@/lib/data/store";

export default async function SettingsRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  
  if (!store) return <div>Store not found</div>;

  return (
    <SettingsPage
      store={{
        name: store.name,
        whatsappNumber: store.whatsapp_number,
        email: store.email,
        phoneNumber: store.whatsapp_number,
        logoUrl: store.logo_url,
        slug: store.slug,
      }}
      onSave={async (data) => {
        "use server"; // or wire to a client-side fetch to your PATCH route
      }}
    />
  );
}