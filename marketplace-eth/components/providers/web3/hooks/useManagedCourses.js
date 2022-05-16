import { normalizeOwnedCourse } from "@utils/normalize"
import useSWR from "swr"

export const handler = (web3, contract) => account => {
    const swrRes = useSWR(() => 
        (web3 &&
        contract &&
        account.data && account.isAdmin ) ? `web3/managedCourses/${account.data}` : null,
        async () => {
            const courses = []
            const courseCount = await contract.methods.getItemCount().call()
            for (let i = Number(courseCount)-1; i>=0; i--) {
                const itemHash = await contract.methods.getItemHashAtIndex(i).call()
                const item = await contract.methods.getItemByHash(itemHash).call()
                if(item){
                    const normalized = normalizeOwnedCourse(web3)({ hash:itemHash }, item)
                    courses.push(normalized)
                }
            }
            
            return courses
        }
    )
    return swrRes
}