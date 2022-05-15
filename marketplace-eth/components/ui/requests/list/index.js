export default function List({requests, children}) {
  return (
    <section className="grid md:grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
      { requests.map(request => 
        children(request)
      ) 
      }
    </section>
  )
}
