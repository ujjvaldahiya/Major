import { Button } from ".."
import { useRouter } from "next/router"



export default function Hero() {
  const router = useRouter()

  return (
    <section className="lg:2/6 text-left my-14">
      <div className="text-6xl font-semibold text-gray-900 leading-none">Cryptonite</div>
      <div className="mt-6 text-xl font-light text-true-gray-500 antialiased">A place to lend and spend your ether.</div>
      <div className="mt-5 sm:mt-8 flex lg:justify-start">
        <Button onClick={() => router.push("/marketplace")}
          className="mr-2 text-sm xs:text-lg p-2"
          variant="lightIndigo">
          Get Started
        </Button>
      </div>
    </section>
  )
}
