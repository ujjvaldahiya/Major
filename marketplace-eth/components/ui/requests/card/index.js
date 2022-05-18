import Image from "next/dist/client/image"
import Link from "next/link"

export default function Card({request, disabled, Footer}) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden md:max-w-2xl">
        <div className="flex h-full">
        <div className="flex-1 h-full" style={{width: '100%', height: '100%', position: 'relative'}}>
            <Image 
            className={`object-cover ${disabled && "filter grayscale"}`} 
            src={request.coverImage}
            layout="fill" 
            alt={request.title}
            />
        </div>
        <div className="p-4 pb-4 flex-2">
            <div className="h-8 block mt-1 text-sm sm:text-lg leading-tight font-medium text-indigo-600">
              {request.title}
            </div>
            <div className="h-8 block mt-1 text-sm sm:text-lg leading-tight font-medium bg-gray-100 text-black rounded-md">
              Interest Rate: {request.type}
            </div>
            <div className="h-8 block mt-1 text-sm sm:text-lg leading-tight font-medium text-black">
              Duration: {request.author}
            </div>
            <div className="h-8 block mt-1 text-sm sm:text-lg leading-tight font-medium bg-gray-100 text-black rounded-md">
              Date Created: {request.createdAt}
            </div>
            {
              Footer &&
              <Footer/>
            }
        </div>
        </div>
    </div>
  )
}
