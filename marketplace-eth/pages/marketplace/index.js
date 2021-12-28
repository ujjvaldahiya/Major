import { CourseList } from "@components/ui/course"
import { BaseLayout } from "@components/ui/layout"
import { getAllCourses } from "@content/courses/fetcher"
import { useWalletInfo } from "@components/hooks/web3"
import { CourseCard } from "@components/ui/course"
import { Button } from "@components/ui/common"
import { OrderModal } from "@components/ui/order"
import { useState } from "react"
import { MarketHeader } from "@components/ui/marketplace"

export default function Marketplace({courses}) {
    const { canPurchaseCourse } = useWalletInfo()
    const [selectedCourse, setSelectedCourse] = useState(null)

    return (
        <>
        <div className="py-4">
          <MarketHeader/>
        </div>
        <CourseList courses={courses}>
          {
            course => 
            <CourseCard
              key={course.id}
              disabled={!canPurchaseCourse} 
              course={course}
              Footer={() => 
                <div className="mt-4">
                  <Button 
                    onClick={() => setSelectedCourse(course)}
                    disabled={!canPurchaseCourse}
                    variant="lightIndigo">
                    Purchase
                  </Button>
                </div>
              } 
            />
          }
        </CourseList>
        { selectedCourse &&
          <OrderModal 
            course={selectedCourse}
            onClose={() => setSelectedCourse(null)}
          />
        } 
        </>
  )
}

export function getStaticProps() {
  const {data} = getAllCourses()
  return {
    props: {
      courses: data
    }
  }
}

Marketplace.Layout = BaseLayout