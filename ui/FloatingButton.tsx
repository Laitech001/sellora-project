"use client";

type buttonProps = {
  children: React.ReactNode;
  onClick: () => void;
}

export default function FloatingButton({ children, onClick }: buttonProps) {

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 bg-primary-500 text-white p-3 rounded-full shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition"
    >
      {children}
    </button>
  );
}