import detectEthereumProvider from "@metamask/detect-provider"
import Web3 from "web3"
import React, { useState, useEffect, useMemo } from "react"

export { default as EthRates } from "./ethRates"
export { default as WalletBar } from "./walletbar"

const {createContext, useContext} = require("react")

const Web3Context = createContext(null)

export default function Web3Provider({children}) {
    const [web3Api, setWeb3Api] = useState({
        provider: null,
        web3: null,
        contract: null,
        isInitialized: false
    })
    
    useEffect(() => {
        const loadProvider = async () => {
    
        const provider = await detectEthereumProvider()
        if (provider) {
            const web3 = new Web3(provider)
            setWeb3Api({
              provider,
              web3,
              contract: null,
              isInitialized: true
            })
        } else {
            setWeb3Api(api => ({...api, isInitialized: true}))
            console.error("Please, install MetaMask.")
        }
    }
    
    loadProvider()
    }, [])

    const _web3Api = useMemo(() => {
        return {
            ...web3Api,
            isWeb3Loaded: web3Api.web3 != null,
            connect: web3Api.provider ? 
            async () => {
                try{
                    await web3Api.provider.request({method: "eth_requestAccounts"})
                } catch {
                    location.reload()
                }
            } :
            () => console.error("Cannot connect to MetaMask, try to reload your browser.")
        }
    }, [web3Api])

    return (
        <Web3Context.Provider value={_web3Api}>
            {children}
        </Web3Context.Provider>
    )
}

export function useWeb3() {
    return useContext(Web3Context)
}