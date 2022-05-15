import { BaseLayout } from "@components/ui/layout";
import { RequestCard } from "@components/ui/requests";
import { getAllRequests } from "@content/requests/fetcher";
import { RequestList } from "@components/ui/requests";

export default function Lend({requests}) {
    return (
      <>
        <div className="py-2"></div>
        <RequestList requests={requests}>
        {
            request => <RequestCard
            key={request.id} 
            request={request} 
            />
        }
        </RequestList>
      </>
    )
}
  
export function getStaticProps() {
    const {data} = getAllRequests()
    return {
        props: {
        requests: data
      }
    }
}
  
Lend.Layout = BaseLayout