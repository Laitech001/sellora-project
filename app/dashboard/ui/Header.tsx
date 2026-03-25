import { Bell, User,} from 'lucide-react'
import MenuButton from './MobileSidebar'

export default function Header() {

  return (
    <div className='w-full p-4 border-b border-gray-400'>
      {/* Desktop Header */}
      <div className='hidden md:flex justify-between items-center gap-6'>
        <h2>Welcome, Developer!</h2>

        <section className='flex gap-4 justify-center items-center'>
          <button>
            View Store
          </button>
    
          <button>
            <Bell />
          </button>

          <button>
            Profile
          </button>
        </section>
      </div>

      {/* Mobile Header */}
      <div className='md:hidden flex justify-between items-center overflow-x-hidden'>
        <MenuButton />

        <h2 className='text-xl font-semibold'>Welcome, Developer!</h2>

        <div className="flex items-center gap-4">
          <button>
            <Bell size={22}/>
          </button>

          <button>
            <User size={22}/>
          </button>
        </div>
          
      </div>
      
    </div>
  )
}