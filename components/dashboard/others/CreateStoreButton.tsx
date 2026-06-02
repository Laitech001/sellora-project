'use client'

import { useState } from 'react'
import { Button } from '@/ui'
import CreateStoreModal from './CreateStoreModal'

export default function CreateStoreButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // open modal function
  const handleModalOpen = () => {
    setIsModalOpen(true);
  }

  return (
    <>
      <Button
        variant='gradient'
        onClick={handleModalOpen}
      >
        Create Store
      </Button>

      <CreateStoreModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}