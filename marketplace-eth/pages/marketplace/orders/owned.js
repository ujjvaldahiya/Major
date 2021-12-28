import OwnedCourseCard from "@components/ui/course/card/ownedCourseCard";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";

export default function OwnedOrders() {
    return (
        <>
            <div className="py-4">
                <MarketHeader/>
            </div>
            <OwnedCourseCard/>
        </>
    )
}

OwnedOrders.Layout = BaseLayout