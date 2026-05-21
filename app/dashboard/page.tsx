import { createClient } from "@/lib/supabaseServer"
import { redirect } from "next/navigation"
import { OnboardingHeader } from "@/components/dashboard/layout"
import { StoreList } from '@/components/dashboard/others'
import { Card, Button} from "@/ui"

export default async function Dashboard() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  // If no user, redirect to login
  if (!user || error) {
    redirect("/signup");
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <OnboardingHeader />

      {user && (
        <div>user.email</div>
      )}

      <div className=' bg-white p-2 border border-gray-200 rounded-md m-4 '>
      
        <Card className='flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-lg mb-2'>
  
          <h1 className="text-2xl font-bold text-gray-800">Your Stores</h1>

          <Button>
            Create Store
          </Button>
        </Card>

        <StoreList />

      </div>
    </div>
  )
}