type heroProps = {
  store: {
    id: string;
    name: string;
    slug: string;
  }
}

export default function Hero({ store }: heroProps) {
  return (
    <div className="w-full py-2 flex flex-col items-center justify-center rounded-lg bg-linear-to-r from-sky-100 via-40% to-primary-200">

        <div className="bg-primary-500/20 flex justify-center items-center px-4 py-1 rounded-full">
          <p className="text-primary-500 text-md font-semibold">
            {`Welcome to ${store.name} store`}
          </p>
        </div>

        <h1 className="text-center text-gray-800 text-xl md:text-2xl lg:text-4xl font-semibold max-w-xl mx-auto">
          Discover the best <br></br> products at the <span className="bg-linear-to-r from-sky-500 to-primary-500 bg-clip-text text-transparent">lowest prices</span>
        </h1>


    </div>
  )
}