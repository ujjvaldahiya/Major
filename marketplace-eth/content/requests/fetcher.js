import requests from "./index.json"

export const getAllRequests = () => {
    return {
        data: requests,
        requestMap: requests.reduce((a, c, i) => {
            a[c.id] = c
            a[c.id].index = i
            return a
        }, {})
    }
}