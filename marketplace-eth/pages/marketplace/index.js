import { CourseList } from "@components/ui/course"
import { BaseLayout } from "@components/ui/layout"
import { getAllCourses } from "@content/courses/fetcher"
import { WalletBar } from "@components/providers/web3"
import { useAccount, useNetwork } from "@components/hooks/web3"
import { CourseCard } from "@components/ui/course"
import { Button } from "@components/ui/common"
import { OrderModal } from "@components/ui/order"
import { useState } from "react"

export default function Marketplace({courses}) {
    const { account } = useAccount()
    const { network } = useNetwork() 
    const [selectedCourse, setSelectedCourse] = useState(null)
    return (
        <>
        <div className="py-4">
          <WalletBar 
              address={account.data} 
              network={{
                  data: network.data,
                  target: network.target,
                  isSupported: network.isSupported,
                  hasInitialResponse: network.hasInitialResponse
              }}
          />
        </div>
        <CourseList courses={courses}>
          {
            course => <CourseCard
            key={course.id} 
            course={course}
            Footer={() => 
              <div className="mt-4">
                <Button 
                  onClick={() => setSelectedCourse(course)}
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