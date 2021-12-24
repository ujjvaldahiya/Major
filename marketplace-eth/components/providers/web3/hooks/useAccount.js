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
            return accounts[0]
        }
    )

    useEffect(() => {
        provider&&
        provider.on("accountsChanged", 
        accounts => mutate(accounts[0] ?? null))
    }, [provider])

    return { 
        account: {
            data,
            isAdmin: (
                data && 
                adminAddresses[web3.utils.keccak256(data)]) 
                ?? false,
            mutate, 
            ...rest
        } 
    }
} 