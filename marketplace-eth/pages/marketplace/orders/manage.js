import { useAdmin, useManagedCourses } from "@components/hooks/web3";
import { useWeb3 } from "@components/providers";
import { Button, Message } from "@components/ui/common";
import { CourseFilter, ManagedCourseCard } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { normalizeOwnedCourse } from "@utils/normalize";
import { useState } from "react";
import { withToast } from "@utils/toast";

const VerificationInput = ({onVerify}) => {
  const [ email, setEmail ] = useState("")

  return (
    <div className="flex mr-2 relative rounded-md">
      <input
        value={email}
        onChange={({target: {value}}) => setEmail(value)}
        type="text"
        name="account"
        id="account"
        className="w-96 focus:ring-indigo-500 border mr-2 focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
        placeholder="0x2341ab..." />
      <Button
        onClick={() => {
          onVerify(email)
        }}
      >
        Verify
      </Button>
    </div>
  )
}

export default function ManagedCourses() {
  const [ proofedOwnership, setProofedOwnership ] = useState({})
  const [ searchedCourse, setSearchedCourse ] = useState(null)
  const [ filters, setFilters ] = useState({state: "All"})
  const { web3, contract } = useWeb3()
  const { account } = useAdmin({redirectTo: "/marketplace"})
  const { managedCourses } = useManagedCourses(account)

  const verifyCourse = (email, {hash, proof}) => {
    if(!email) {
      return
    }
    const emailHash = web3.utils.sha3(email)
    const proofToCheck = web3.utils.soliditySha3(
      { type: "bytes32", value: emailHash },
      { type: "bytes32", value: hash }
    )

    proofToCheck === proof ?
      setProofedOwnership({
        ...proofedOwnership,
        [hash]: true
      }) :
      setProofedOwnership({
        ...proofedOwnership,
        [hash]: false
      })
  }

  const changeCourseState = async (courseHash, method) => {
    try {
      const result =  await contract.methods[method](courseHash).send({
        from: account.data
      })
      return result
    } catch(e){
      throw new Error(e.message)
    }
  }

  const activateCourse = async courseHash => {
    withToast(changeCourseState(courseHash, "activateItem"))
  }

  const deactivateCourse = async courseHash => {
    withToast(changeCourseState(courseHash, "deActivateItem"))
  }

  const searchCourse = async hash => {
    const re = /[0-9A-Fa-f]{6}/g;

    if(hash && hash.length === 66 &&re.test(hash)) {
        const course = await contract.methods.getItemByHash(hash).call()
        if(course.owner !== "0x0000000000000000000000000000000000000000"){
          const normalized = normalizeOwnedCourse(web3)({hash}, course)
          setSearchedCourse(normalized)
          return
        }
    }
    setSearchedCourse(null)
  }

  const renderCard = (course) => {
    return (
      <ManagedCourseCard
        key={course.ItemId}
        course={course}>
        <VerificationInput
          onVerify={email => {
            verifyCourse(email, {
              hash: course.hash,
              proof: course.proof
            })
          }}
        />
        { proofedOwnership[course.hash] &&
          <div className="mt-2">
            <Message>
              Verified!
            </Message>
          </div>
        }
        { proofedOwnership[course.hash] === false &&
          <div className="mt-2">
            <Message type="danger">
              Wrong Proof!
            </Message>
          </div>
        }
        { course.state === "Purchased" &&
          <div className="mt-2">
            <Button 
              onClick={() => activateCourse(course.hash)}
              variant="green">
              Activate
            </Button>
            <Button 
            onClick={() => deactivateCourse(course.hash)}
              variant="red" 
              className="ml-2">
              Deactivate
            </Button>
          </div>
        }
      </ManagedCourseCard>
    )
  }

  const filteredCourses = managedCourses.data?.filter((course) => {
    if(filters.state === "All") {
      return true
    }
    return course.state === filters.state
    }).map(course =>
      renderCard(course)
    )

  if (!account.isAdmin) {
    return null
  }

  return (
    <>
      <MarketHeader />
      <CourseFilter 
        onFilterSelect={(value) => setFilters({state: value})}
        onSearchSubmit={searchCourse}
      />
      <section className="grid grid-cols-1">
        {
          searchedCourse && 
          <div>
            <h1 className="text-2xl font-bold p-5">Result</h1>
            {
              renderCard(searchedCourse)
            }
          </div>
        }
        <h1 className="text-2xl font-bold p-5">All Orders</h1>
        { 
          filteredCourses
        }
        {
          filteredCourses?.length === 0 && 
          <div  className="w-1/2">
            <Message type="warning">
              No orders to display
            </Message>
          </div>
        }
      </section>
    </>
  )
}

ManagedCourses.Layout = BaseLayout