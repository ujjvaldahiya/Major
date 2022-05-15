import { Button } from "@components/ui/common";
import { CourseFilter } from "@components/ui/course";
import OwnedCourseCard from "@components/ui/course/card/ownedCourseCard";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";

export default function ManageOrders() {
    return (
        <>
            <MarketHeader/>
            <CourseFilter/>
            <section className="grid grid-cols-1">
                {/*<OwnedCourseCard>
                <div className="flex mr-2 relative rounded-md">
                    <div className="pr-1">
                        <input
                        type="text"
                        name="account"
                        id="account"
                        className="w-96 pr-1 focus:ring-indigo-500 border focus:border-indigo-500 block pl-7 p-4 sm:text-sm rounded-md"
                        placeholder="0x2341ab..." />
                    </div>
                    <Button>
                    Verify
                    </Button>
                </div>
                </OwnedCourseCard>*/}
            </section>
        </>
    )
}

ManageOrders.Layout = BaseLayout