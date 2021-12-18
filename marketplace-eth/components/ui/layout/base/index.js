import { Navbar, Footer } from "@components/ui/common"

export default function BaseLayout({children}) {
    return (
    <>
      <div className="relative max-w-7xl mx-auto px-4">
        <Navbar />
        <div className="fit">
          {children}
        </div>
      </div>
      <Footer />
    </>
    )
}