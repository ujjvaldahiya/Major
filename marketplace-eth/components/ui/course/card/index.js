import Image from "next/dist/client/image"
import Link from "next/link"

export default function Card({course, disabled, Footer}) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden md:max-w-2xl">
        <div className="flex h-full">
        <div className="flex-1 h-full" style={{width: '100%', height: '100%', position: 'relative'}}>
            <Image 
            className={`object-cover ${disabled && "filter grayscale"}`} 
            src={course.coverImage}
            layout="fill" 
            alt={course.title}
            />
        </div>
        <div className="p-8 pb-4 flex-2">
            <div 
            className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            {course.type}
            </div>
            <Link href={`/courses/${course.slug}`}>
            <a 
                className="h-12 block mt-1 text-sm sm:text-lg leading-tight font-medium text-black hover:underline">
                {course.title}
            </a>
            </Link>
            <p 
            className="mt-2 text-sm sm:text-base text-gray-500">
            {course.description.substring(0,90)}...
            </p>
            {
              Footer &&
              <Footer />
            }
        </div>
        </div>
    </div>
  )
}
