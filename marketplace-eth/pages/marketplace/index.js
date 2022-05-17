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
import { withToast } from "@utils/toast"

export default function Marketplace({courses}) {
    const { web3, contract, requireInstall } = useWeb3()
    const { hasWalletConnected, network, isConnecting, account } = useWalletInfo()
    const { ownedCourses } = useOwnedCourses(courses, account.data, network.data)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [ busyCourseId, setBusyCourseId] = useState(true)
    const [isNewPurchase, setIsNewPurchase] = useState(true)

    const purchaseCourse = async (order, course) => {
      const hexCourseId = web3.utils.utf8ToHex(course.id)

      const orderHash = web3.utils.soliditySha3(
        {
          type: "bytes16", value: hexCourseId
        },
        {
          type: "address", value: account.data
        }
      )

      const value = web3.utils.toWei(String(order.price))
      setBusyCourseId(course.id)
      
      if(isNewPurchase) {
        const emailHash = web3.utils.sha3(order.email)

        const proof = web3.utils.soliditySha3(
          { type: "bytes32", value: emailHash},
          { type: "bytes32", value: orderHash}
        )
        withToast(_purchaseCourse({hexCourseId, proof, value}, course))
      }
      else {
        withToast(_repurchaseCourse({courseHash: orderHash, value}, course))
      }
      
    }

    const _purchaseCourse = async ({hexCourseId, proof, value}, course) => {
      try {
        const result = await contract.methods.purchaseItem(
          hexCourseId,
          proof
        ).send({
          from: account.data,
          value
        })
        ownedCourses.mutate([
          ...ownedCourses.data, {
            ...course,
            proof,
            state: "Purchased",
            owner: account.data,
            price: value
          }
        ])
        return result
      } catch(error) {
        throw new Error(error.message)
      } finally{
        setBusyCourseId(null)
      }
    }

    const _repurchaseCourse = async ({courseHash, value}, course) => {
      try {
        const result = await contract.methods.repurchaseItem(
          courseHash
        ).send({
          from: account.data,
          value
        })
        const index = ownedCourses.data.findIndex(c => c.id === course.id)
        if(index>=0){
          ownedCourses.data[index] = "Purchased"
          ownedCourses.mutate(ownedCourses.data)
        } else {
          ownedCourses.mutate()
        }
        return result
      } catch(error) {
        throw new Error(error.message)
      } finally{
        setBusyCourseId(null)
      }
    }

    const cleanupModal = () => {
      setSelectedCourse(null)
      setIsNewPurchase(true)
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
                      <Button
                      variant="lightIndigo"
                      disabled={true}
                      size="sm">
                      Purchase
                    </Button>
                      )
                  }

                  const isBusy = busyCourseId === course.id
                  if(owned) {
                    return (
                      <>
                        <div className="flex">
                          <Button 
                            size="sm"
                            disabled={false}
                            variant="white">
                            Yours &#10004;
                          </Button>
                          {
                            owned.state === "Deactivated" && 
                            <Button className="ml-1"
                              size="sm"
                              onClick={() => {
                                setIsNewPurchase(false)
                                setSelectedCourse(course)
                              }}
                              disabled={isBusy}
                              variant="lightIndigo">
                              {
                                isBusy?
                                <div className="flex items-center">
                                  <Loader size="sm"/>
                                  <div className="ml-2">In Progress</div>
                                </div>:
                                <div>Activate</div>
                              }
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
                        disabled={!hasWalletConnected || isBusy}
                        variant="lightIndigo">
                        {
                          isBusy?
                          <div className="flex items-center">
                            <Loader size="sm"/>
                            <div className="ml-2">In Progress</div>
                          </div>:
                          <div>Purchase</div>
                        }
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
            isNewPurchase={isNewPurchase}
            onSubmit={(formData, course) => {
              purchaseCourse(formData, course)
              cleanupModal()
            }}
            onClose={cleanupModal}
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