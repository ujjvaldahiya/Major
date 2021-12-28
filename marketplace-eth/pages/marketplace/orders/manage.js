import OwnedCourseCard from "@components/ui/course/card/ownedCourseCard";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";

export default function ManageOrders() {
    return (
        <>
            <div className="py-4">
                <MarketHeader/>
            </div>
            <OwnedCourseCard/>
        </>
    )
}

ManageOrders.Layout = BaseLayout