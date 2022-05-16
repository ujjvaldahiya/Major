import { useEffect } from "react"
import useSWR from "swr"

const adminAddresses = {
    "0xce19618ef7fc4f80c7d5bc7a16b6151e3147f9eeac1a8d4996cd20aa69fabf5a": true
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