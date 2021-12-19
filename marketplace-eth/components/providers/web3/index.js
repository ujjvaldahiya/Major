import detectEthereumProvider from "@metamask/detect-provider"
import Web3 from "web3"
import React from "react"

export { default as EthRates } from "./ethRates"
export { default as WalletBar } from "./walletbar"

const {createContext, useContext} = require("react")

const Web3Context = createContext(null)

export default function Web3Provider({children}) {
    const [web3Api, setWeb3Api] = React.useState({
        provider: null,
        web3: null,
        contract: null,
        isLoading: false
    })
    React.useEffect(() => {
        const loadProvider = async () => {
            const provider = await detectEthereumProvider()
            if(provider){
                const web3 = new Web3(provider)
                setWeb3Api({
                    provider,
                    web3,
                    contract: null,
                    isLoading: true
                })
            } else {
                setWeb3Api(api => ({...api, isLoading:true}))
                console.error("Please install MetaMask.")
            }
        }

        loadProvider()
    }, [])

    const _web3Api = React.useMemo(() => {
        return {
            ...web3Api,
            connect: () => console.log("Trying to connect"),
            test: () => console.log("Hello World")
        }
    }, [web3Api])

    return (
        <Web3Context.Provider value={web3Api}>
            {children}
        </Web3Context.Provider>
    )
}

export function useWeb3() {
    return useContext(Web3Context)
}