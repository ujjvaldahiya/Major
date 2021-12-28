import { Button, Message } from "@components/ui/common";
import OwnedCourseCard from "@components/ui/course/card/ownedCourseCard";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";

export default function OwnedOrders() {
    return (
        <>
            <div className="py-4">
                <MarketHeader/>
            </div>
            <section className="grid grid-cols-1">
                <OwnedCourseCard>
                    <Message>
                        Purchased.
                    </Message>
                    <Button>
                        Watch the course
                    </Button>
                </OwnedCourseCard>
            </section>
        </>
    )
}

OwnedOrders.Layout = BaseLayout