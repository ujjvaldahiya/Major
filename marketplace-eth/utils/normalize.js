export const COURSE_STATES = {
    0: "Purchased",
    1: "Activated",
    2: "Deactivated"
}

export const REQUEST_STATES = {
    0: "Active",
    1: "Accepted",
    2: "Completed"
}

export const normalizeOwnedCourse = web3 => (course, ownedCourse) => {
    return {
        ...course,
        ItemId: ownedCourse.id,
        proof: ownedCourse.proof,
        owner: ownedCourse.owner,
        price: web3.utils.fromWei(ownedCourse.price),
        state: COURSE_STATES[ownedCourse.state]
    }
}

export const normalizeRequest = web3 => (request) => {
    return {
        ...request,
        ItemId: request.id,
        proof: request.proof,
        owner: request.owner,
        price: web3.utils.fromWei(request.price),
        state: REQUEST_STATES[request.state]
    }
}