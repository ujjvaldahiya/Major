import { useWalletInfo } from "@components/hooks/web3"
import { useWeb3 } from "@components/providers"
import { Button } from "@components/ui/common"
import Image from "next/dist/client/image"

export default function WalletBar() {
  const { requireInstall } = useWeb3()
  const { account, network } = useWalletInfo()

  return (
    <section className="text-white bg-indigo-600 rounded-lg">
      <div className="p-8">
        <h1 className="text-base xs:text-xl break-words">Hello, {account.data}</h1>
        <h2 className="subtitle mb-5 text-sm xs:text-base">I hope you are having a great day!</h2>
        <div className="flex justify-between items-center">
          <div className="sm:flex sm:justify-center lg:justify-start">
            <Button 
              className="mr-2 text-sm xs:text-lg p-2"
              variant="white">
              <div className="flex items-center">
                <Image 
                  layout="fixed"
                  height="35"
                  width="35"
                  src="/small-eth.webp"
                />
                <span className="text-xl font-bold"> 
                  Price Trends
                </span>
              </div>
            </Button>
          </div>
          <div>
            { network.hasInitialResponse && !network.isSupported && 
              <div className="bg-red-400 p-4 rounded-lg">
                <div>
                  Connected to the wrong Network
                </div>
                <div>
                  Connect to: {` `}
                  <strong className="text-2xl">
                    {network.target}
                  </strong>
                </div>
              </div>
            }
            { requireInstall && 
              <div className="bg-yellow-500 p-4 rounded-lg">
                <div>
                  Cannot connect to a Network
                </div>
                <div> 
                  Please install {` `}
                  <strong className="text-2xl">
                    MetaMask
                  </strong>
                </div>
              </div>
            } 
            { network.data &&
              <div>
                <span>Currently on </span>
                <strong className="text-2xl">{network.data}</strong>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  )
}
