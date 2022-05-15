import { useAccount, useOwnedCourses } from "@components/hooks/web3";
import { Button, Message } from "@components/ui/common";
import OwnedCourseCard from "@components/ui/course/card/ownedCourseCard";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { getAllCourses } from "@content/courses/fetcher";
import { useRouter } from "next/router";

export default function OwnedOrders({courses}) {
    const router = useRouter()
    const { account } = useAccount()
    const { ownedCourses } = useOwnedCourses(courses, account.data)

    return (
        <>
            <MarketHeader/>
            <section className="grid grid-cols-1">
                {
                    ownedCourses.data?.map(course => 
                        <OwnedCourseCard
                            key = {course.id}
                            course = {course}
                        >
                            {/*<Message>
                                Purchased.
                            </Message>*/}
                            <Button onClick={() => router.push(`/courses/${course.slug}`)}>
                                Watch
                            </Button>
                        </OwnedCourseCard>
                    )
                }
            </section>
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

OwnedOrders.Layout = BaseLayout