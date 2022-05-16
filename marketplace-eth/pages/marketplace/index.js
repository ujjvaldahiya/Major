import { CourseList } from "@components/ui/course"
import { BaseLayout } from "@components/ui/layout"
import { getAllCourses } from "@content/courses/fetcher"
import { useOwnedCourses, useWalletInfo } from "@components/hooks/web3"
import { CourseCard } from "@components/ui/course"
import { Button, Loader } from "@components/ui/common"
import { OrderModal } from "@components/ui/order"
import { useState } from "react"
import { MarketHeader } from "@components/ui/marketplace"
import { useWeb3 } from "@components/providers"

export default function Marketplace({courses}) {
    const { web3, contract, requireInstall } = useWeb3()
    const { hasWalletConnected, network, isConnecting, account } = useWalletInfo()
    const { ownedCourses } = useOwnedCourses(courses, account.data, network.data)
    const [selectedCourse, setSelectedCourse] = useState(null)

    const purchaseCourse = async order => {
      const hexCourseId = web3.utils.utf8ToHex(selectedCourse.id)

      const orderHash = web3.utils.soliditySha3(
        {
          type: "bytes16", value: hexCourseId
        },
        {
          type: "address", value: account.data
        }
      )

      const emailHash = web3.utils.sha3(order.email)

      const proof = web3.utils.soliditySha3(
        { type: "bytes32", value: emailHash},
        { type: "bytes32", value: orderHash}
      )

      const value = web3.utils.toWei(String(order.price))

      try {
        await contract.methods.purchaseItem(
          hexCourseId,
          proof
        ).send({
          from: account.data,
          value
        })
      } catch {
        console.error("Purchase Item: Operation falied.")
      }

    }

    return (
        <>
        <MarketHeader/>
        <CourseList courses={courses}>
          {
            course => {
              const owned = ownedCourses.lookup[course.id]
              return (
              <CourseCard
                key={course.id}
                disabled={!hasWalletConnected} 
                course={course}
                state={owned?.state}
                Footer={() => {
                  if (requireInstall) {
                    return (
                      <Button
                        size="sm"
                        disabled={true}
                        variant="lightIndigo">
                        Install
                      </Button>
                    )
                  }
                  if(!ownedCourses.hasInitialResponse) {
                    return (
                      <div style={{height:"42px"}}></div>
                    )
                  }

                  if(owned) {
                    return (
                      <>
                        <div className="flex">
                          <Button 
                            onClick={() => alert("You are owner of this item.")}
                            size="sm"
                            disabled={false}
                            variant="white">
                            Yours &#10004;
                          </Button>
                          {
                            owned.state === "Deactivated" && 
                            <Button 
                              size="sm"
                              disabled={false}
                              variant="lightIndigo">
                              Activate
                            </Button>
                          }
                        </div>
                      </>
                    )
                  }

                  if(isConnecting) {
                    return (
                      <Button
                        size="sm"
                        disabled={true}
                        variant="lightIndigo">
                        <Loader/>
                      </Button>
                    )
                  }
                  return (
                      <Button 
                        onClick={() => setSelectedCourse(course)}
                        size="sm"
                        disabled={!hasWalletConnected}
                        variant="lightIndigo">
                        Purchase
                      </Button>
                    )
                  }
                } 
              />
            )}
          }
        </CourseList>
        { selectedCourse &&
          <OrderModal 
            course={selectedCourse}
            onSubmit={purchaseCourse}
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