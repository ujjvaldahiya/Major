import { useEffect } from "react"
import useSWR from "swr"

const adminAddresses = {
    "0xcf226b732aaba06b5491a06679bec7004cfc754d71df4a53b1648645f14e15e5": true
}

export const handler = (web3, provider) => () => {
    const {data, mutate, ...rest} = useSWR(() => 
        web3 ? "web3/accounts" : null,
        async () => {
            const accounts = await web3.eth.getAccounts()
            const account = accounts[0]

            if(!account){
                throw new Error("Cannot retrieve an account. Refresh your browser.")
            }
            return account
        }
    )

    useEffect(() => {
        const mutator = (accounts) => mutate(accounts[0] ?? null)
        provider?.on("accountsChanged",mutator)
        return () => {
            provider?.removeListener("accountsChanged", mutator)
        }
    }, [provider])

    return { 
        data,
        isAdmin: (
            data && 
            adminAddresses[web3.utils.keccak256(data)]) 
            ?? false,
        mutate, 
        ...rest
    }
} 