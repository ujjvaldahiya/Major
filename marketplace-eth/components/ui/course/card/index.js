import Image from "next/dist/client/image"
import Link from "next/link"
import { AnimateKeyframes } from "react-simple-animate"

export default function Card({course, disabled, Footer, state}) {
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
            <div className="flex items-center">
              <div 
              className="uppercase mr-2 tracking-wide text-sm text-indigo-500 font-semibold">
              {course.type}
              </div>
              <div>
                {
                  state === "Activated" && 
                  <div className="text-xs text-white bg-green-500 p-1 px-3 rounded-full">
                    Activated
                  </div>
                }
                {
                  state === "Deactivated" && 
                  <div className="text-xs text-white bg-red-400 p-1 px-3 rounded-full">
                    Deactivated
                  </div>
                }
                {
                  state === "Purchased" && 
                  <AnimateKeyframes
                    play
                    duration={2}
                    keyframes={["opacity: 0.2", "opacity: 1"]}
                    iterationCount="infinite">
                    <div className="text-xs text-white bg-yellow-400 p-1 px-3 rounded-full">
                      Pending
                    </div>
                </AnimateKeyframes>
                }
              </div>
            </div>
            <Link href={`/courses/${course.slug}`}>
            <a 
                className="h-12 block mt-1 text-sm sm:text-lg leading-tight font-medium text-black hover:underline">
                {course.title}
            </a>
            </Link>
            <p 
            className="mt-2 mb-3 text-sm sm:text-base text-gray-500">
            {course.description.substring(0,90)}...
            </p>
            {
              Footer &&
              <div className="mt-2">
                <Footer />
              </div>
            }
        </div>
        </div>
    </div>
  )
}
