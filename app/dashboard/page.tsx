import { createClient } from "@/lib/supabaseServer"
import { OnboardingHeader } from "@/components/dashboard/layout"
import DisplayStores from "@/components/dashboard/others/DisplayStores";
import CreateStoreButton from "@/components/dashboard/others/CreateStoreButton";

export default async function Dashboard() {
  const supabase = await createClient();

  interface Store {
    id: string;
    user_id: string;
    name: string;
    slug: string;
    whatsapp_number: string;
    business_type: string;
    address: string | null;
    created_at: string;
  }

  const { data: { user }, error } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const { data: stores, error: storesError} = await supabase
    .from('stores')
    .select('*')
    .eq('user_id', user.id)

  if (storesError) {
    console.error('Error fetching stores:', storesError);
    return;
  }

  const typedStores = stores as Store[] | null;
  
  return (
    <div className="bg-slate-900 min-h-screen">
      <OnboardingHeader />

      <div className='min-h-screen bg-slate-800 p-2 border border-transparent rounded-md m-4 '>
        <div className='flex justify-between items-center p-4 bg-transparent text-white border-b border-slate-500 mb-2'>

          <h1 className="text-2xl font-bold">Your Stores</h1>

          <CreateStoreButton />
        </div>

        {
          stores && stores.length > 0 ? (
            <DisplayStores stores={typedStores}/>
          ) : (

            <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-white">

              <p className="text-lg mb-4">You haven't created any stores yet.</p>
              <CreateStoreButton />

            </div>
          )
        }
      </div>
    </div>
  )
}