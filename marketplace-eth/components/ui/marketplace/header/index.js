import { WalletBar, EthRates } from "@components/ui/web3"
import { Breadcrumbs } from "@components/ui/common"

const LINKS = [
    {
        href: "/marketplace",
        value: "Buy"
    },
    {
        href: "/marketplace/orders/owned",
        value: "My Orders"
    },
    {
        href: "/marketplace/orders/manage",
        value: "Manage Orders"
    }
]

export default function Header() {

    return (
        <>
        <WalletBar/>
        <EthRates/>
        <div className="flex flex-row-reverse pb-4 px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={LINKS}/>
        </div>
        </>
    )
}