import { BaseLayout } from "@components/ui/layout";
import { RequestCard } from "@components/ui/requests";
import { getAllRequests } from "@content/requests/fetcher";
import { RequestList } from "@components/ui/requests";
import { WalletBar } from "@components/ui/web3";
import { EthRates } from "@components/ui/web3";
import { Button } from "@components/ui/common";
import { useState } from "react";
import { useWeb3 } from "@components/providers";
import { useWalletInfo } from "@components/hooks/web3";
import { withToast } from "@utils/toast";
import Image from "next/image";

export default function Lend({requests}) {
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [upi, setUpi] = useState("");
  const [pin, setPin] = useState(null);
  const { web3, contract } = useWeb3();
  const { account } = useWalletInfo();
  const [showNew, setShowNew] = useState(false);

  const [cardDuration, setCardDuration] = useState("");
  const [cardPrice, setCardPrice] = useState("")
  const [interest, setInterest] = useState(8);
  const [buttonDisable, setButtonDisable] = useState(false);
  const Alert = () => {
    setButtonDisable(true);
    alert("Contract Accepted")
  }
  
  const createRequest = async (order) => {
    event.preventDefault();
    if(duration<0 || duration>10) {
      alert("Duration should be between 1-10 Years")
      return
    }
    if(!upi.includes("@")){
      alert("Invalid UPI");
      return;
    }
    if(price<0 || price>10){
      alert("Invalid ETH Price")
      return;
    }
    const hexRequestId = web3.utils.utf8ToHex(pin)
    console.log(hexRequestId);
    console.log(account);
    console.log(account.data);
    const orderHash = web3.utils.soliditySha3(
      {
        type: "bytes16", value: hexRequestId
      },
      {
        type: "address", value: account.data
      }
    )
    const value = web3.utils.toWei(String(price))

    withToast(_createRequest(hexRequestId, orderHash, value))
    setCardPrice(price);
    setCardDuration(duration)
    setPrice("");
    setDuration("");
    setUpi("");
    setPin("");
  }

  const _createRequest = async (hexRequestId, proof, value) => {
  
    if(duration==1){
      setInterest(12);
      console.log("A");
    } else if(duration>1&&duration<=5){
      setInterest(10);
      console.log("b", interest);
    } else {
      setInterest(8);
      console.log("c");
    }
    try {
      const result = await contract.methods.createRequest(
        duration,
        interest,
        proof
      ).send({
        from: account.data,
        value: value
      })
      setShowNew(true);
      return result
    } catch(error) {
      setShowNew(false);
      console.log(error);
      throw new Error(error.message)
    }
  }

const renderCard = () => {
   return <div className="bg-white rounded-xl border overflow-hidden md:max-w-2xl">
        <div className="flex h-full">
        <div className="newCard flex-1 h-full" style={{width: '100%', height: '100%', position: 'relative'}} >
            <Image 
            className="object-cover"
            src="https://d33wubrfki0l68.cloudfront.net/ae2b4b26b9f7d08031864faea2f17265d0f948c9/a7b9f/static/655aaefb744ae2f9f818095a436d38b5/e1ebd/eth-diamond-purple-purple.png"
            layout="fill" 
            alt={cardPrice}
            />
        </div>
        <div className="p-4 pb-4 flex-2">
            <div className="h-8 block mt-1 text-sm sm:text-lg leading-tight font-medium text-indigo-600">
              {cardPrice} ETH
            </div>
            <div className="h-8 block mt-1 text-sm sm:text-lg leading-tight font-medium bg-gray-100 text-black rounded-md">
              Interest Rate: {interest}
            </div>
            <div className="h-8 block mt-1 text-sm sm:text-lg leading-tight font-medium text-black">
              Duration: {cardDuration}
            </div>
            <div className="h-8 block mt-1 text-sm sm:text-lg leading-tight font-medium bg-gray-100 text-black rounded-md">
              Date Created: 18-05-2022
            </div>
            <div className="mt-2">
              <Button variant="lightIndigo"
                onClick={Alert} disabled={buttonDisable}>
                Accept
              </Button>
            </div>
        </div>
        </div>
    </div>
}
    return (
      <>
        <div className="pt-4 pb-2">
          <WalletBar />
        </div>
        <EthRates />
        <div className="lendingFormDiv border rounded-md">
          <form className={"LendingForm"} onSubmit = {createRequest}>
            <header className="font-bold">
              <h3>Create Loan Request</h3>
            </header>
            <label htmlFor="Price">Price(ETH)</label>
            <h3></h3>
            <input
              id="Price"
              type="text"
              required = {true}
              onChange={e => setPrice(e.target.value)}
              value = {price}
            />
            <label htmlFor="UPI">UPI ID</label>
            <input
              id="UPI"
              type="text"
              required = {true}
              onChange={e => setUpi(e.target.value)}
              value = {upi}
            />
            <label htmlFor="Pin">Transaction Verification Pin</label>
            <input
              id="Pin"
              type="text"
              required = {true}
              onChange={e => setPin(e.target.value)}
              value = {pin}
            />
            <label htmlFor="Duration">Duration(Years)</label>
            <input
              id="Duration"
              type="text"
              required = {true}
              onChange={e => setDuration(e.target.value)}
              value = {duration}
            />
            <Button type="submit">Request</Button>
          </form>
        </div>
        {
          showNew &&
          <div>
          <h1 className="my-8 text-3xl font-bold"> New Request</h1>
            {
              renderCard()
            }
          </div>
        }
        <h1 className="my-8 text-3xl font-bold"> Active Requests</h1>
        <RequestList requests={requests}>
        {
            request => <RequestCard
            key={request.id} 
            request={request} 
            Footer = {() => {
              return (
                <div className="mt-2">
                  <Button variant="lightIndigo"
                    onClick={Alert}>
                    Accept
                  </Button>
                </div>
              )
            }}
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