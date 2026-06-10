'use client'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose?: () => void
  children: React.ReactNode
  className?: string
  variant?: 'dark' | 'light'
}

export default function Modal({ isOpen, onClose, children, className, variant = 'dark' }: ModalProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isMounted || !isOpen) return null;

  return createPortal(
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm ${className}`} 
      onClick={onClose} // Clicking backdrop closes modal
    >
      <div 
        className={`rounded-lg p-6 relative max-w-lg w-full max-h-[90vh] mx-4 shadow-xl overflow-y-auto hide-scrollbar ${variant === 'dark' ? 'bg-card text-gray-200' : 'bg-white text-gray-800'}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
        >
          &times;
        </button>
        <div className="mt-2">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}