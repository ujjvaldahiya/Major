import { useAccount, useOwnedCourse } from "@components/hooks/web3";
import { useWeb3 } from "@components/providers";
import { Message, Modal } from "@components/ui/common";
import { CourseHero, Curriculum, Keypoints } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { getAllCourses } from "@content/courses/fetcher";

export default function Course({course}) {
  const { isLoading } = useWeb3()
  const { account } = useAccount()
  const { ownedCourse } = useOwnedCourse(course, account.data)
  const courseState = ownedCourse.data?.state
  const isLocked = !courseState || courseState === "Purchased" || courseState === "Deactivated"

  return (
    <>
      <div className="py-4">
        <CourseHero 
            hasOwner = {!!ownedCourse.data}
            title = {course.title}
            description = {course.description}
            image = {course.coverImage}
        />
      </div>
      <Keypoints 
        points = {course.wsl}
      />
      {
        courseState && 
        <div className="max-w-5xl mx-auto">
          {
            courseState === "Deactivated"&&
              <Message type="danger">
                Item has been deactivated due to incorrect purchase data. 
                The functionality to watch the item has been temporarily disabled.
                <i className="block font-normal">For queries, please contact ujjvaldahiya14141@gmail.com</i>
              </Message>
          }
        </div>
      }
      <Curriculum 
        isLoading={isLoading}
        locked={isLocked}
        courseState={courseState}
      />
      <Modal />
    </>
  )
}

export function getStaticPaths() {
    const {data} = getAllCourses()

    return {
        paths: data.map(c => ({
            params: {
                slug: c.slug
            }
        })),
        fallback: false
    }
}

export function getStaticProps({params}) {
    const {data} = getAllCourses()
    const course = data.filter(c => c.slug=== params.slug)[0]
    return {
      props: {
        course
      }
    }
  }

Course.Layout = BaseLayout