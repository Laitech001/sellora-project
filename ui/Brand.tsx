
export default function BrandLogo() {
  return (
    <div 
      className="h-10 w-10 bg-linear-to-br from-primary-500 to-accent-500 text-xl lg:text-2xl text-white font-bold flex justify-around items-center rounded-lg"
    >
      S
    </div>
  )
}

export const BrandLogoName = () => {
  return (
    <div className="flex items-center gap-2">
      <div 
        className="h-10 w-10 bg-linear-to-br from-primary-500 to-accent-500 text-xl lg:text-2xl text-white font-bold flex justify-around items-center rounded-lg"
      >
        S
      </div>
      <h1 className="text-xl lg:text-2xl font-bold text-white">Sellora</h1>
    </div>
  )
}