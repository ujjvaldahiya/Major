import { useEthPrice } from "@components/hooks/useEthPrice";
import { Modal, Button } from "@components/ui/common";
import { useState, useEffect } from "react";

const defaultOrder = {
    price: "",
    email: "",
    confirmationEmail: ""
}

const _createFormState = (isDisabled = false, message = "") => ({
    isDisabled,
    message
})

const createFormState = ({price, email, confirmationEmail}, hasAgreedTOS, isNewPurchase) => {
    if(!price || Number(price)<= 0){
        return _createFormState(true, "Price is not valid.")
    }

    if(isNewPurchase) {
        if(confirmationEmail.length == 0 || email.length == 0){
            return _createFormState(true)
        }
        else if(email!==confirmationEmail){
            return _createFormState(true, "Email addresses do not match.")
        }
    }
    
    if(!hasAgreedTOS){
        return _createFormState(true, "You need to agree to the terms of service.")
    }

    return _createFormState()
}

export default function OrderModal({course, onClose, onSubmit, isNewPurchase}) {
    const [isOpen, setIsOpen] = useState(false)
    const [order, setOrder] = useState(defaultOrder)
    const [enablePrice, setEnablePrice] = useState(false)
    const [hasAgreedTOS, setHasAgreedTOS] = useState(false)
    const { eth } = useEthPrice()
    useEffect(() => {
       if (!!course) {
           setIsOpen(true)
           setOrder({
               ...defaultOrder,
               price: eth.perItem
           })
       } 
    },[course])

    const closeModal = () => {
        setIsOpen(false)
        setOrder(defaultOrder)
        setEnablePrice(false)
        setHasAgreedTOS(false)
        onClose()
    }

    const formState = createFormState(order, hasAgreedTOS, isNewPurchase)

    return (
        <Modal isOpen={isOpen}>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
                <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="mb-7 text-lg font-bold leading-6 text-gray-900" id="modal-title">
                    {course.title}
                </h3>
                <div className="mt-1 relative rounded-md">
                    <div className="mb-1">
                    <label className="mb-2 font-bold">Price (ETH)</label>
                    <div className="text-xs text-gray-700 flex">
                        <label className="flex items-center mr-2">
                        <input
                            checked={enablePrice}
                            onChange={({target: {checked}}) => {
                                setOrder({
                                    ...order,
                                    price: checked ? order.price : eth.perItem
                                })
                                setEnablePrice(checked)
                            }}
                            type="checkbox"
                            className="form-checkbox"
                        />
                        </label>
                        <span>Adjust Price</span>
                    </div>
                    </div>
                    <input
                        disabled={!enablePrice}
                        value={order.price}
                        onChange={({target : {value}}) => {
                            if(isNaN(value)) { return; }
                            setOrder({
                                ...order,
                                price: value
                            })
                        }}
                        type="text"
                        name="price"
                        id="price"
                        className="disabled:opacity-50 w-80 mb-1 border focus:ring-indigo-500 focus:border-indigo-500 block pl-7 p-4 sm:text-sm rounded-md"
                    />
                    <p className="text-xs text-gray-700 pb-2">
                    Price will be verified at the time of the order. If the price is too low, order can be declined (+- 2% slippage is allowed)
                    </p>
                </div>
                { isNewPurchase &&
                  <>
                    <div className="mt-2 relative rounded-md">
                        <div className="mb-1">
                        <label className="mb-2 font-bold">Email</label>
                        </div>
                        <input
                            onChange={({target: {value}}) => {
                                setOrder({
                                    ...order,
                                    email: value.trim()
                                })
                            }}
                            type="email"
                            name="email"
                            id="email"
                            className="w-80 border focus:ring-indigo-500 focus:border-indigo-500 block pl-7 p-4 sm:text-sm rounded-md"
                            placeholder="x@y.com"
                        />
                        <p className="text-xs text-gray-700 mt-1 pb-2">
                        It&apos;s important to fill your correct email address, otherwise the order cannot be verified. Your personal data is not stored anywhere.
                        </p>
                    </div>
                    <div className="my-2 relative rounded-md">
                        <div className="mb-1">
                        <label className="mb-2 font-bold">Confirm Email</label>
                        </div>
                        <input
                            onChange={({target: {value}}) => {
                                setOrder({
                                    ...order,
                                    confirmationEmail: value.trim()
                                })
                            }}
                            type="email"
                            name="confirmationEmail"
                            id="confirmationEmail"
                            className="w-80 focus:ring-indigo-500 border focus:border-indigo-500 block pl-7 p-4 sm:text-sm rounded-md" placeholder="x@y.com" 
                        />
                    </div>
                  </>
                }
                <div className="text-xs text-gray-700 flex">
                    <label className="flex items-center mr-2">
                    <input
                        checked={hasAgreedTOS}
                        onChange={({target: {checked}}) => {
                            setHasAgreedTOS(checked)
                        }}
                        type="checkbox"
                        className="form-checkbox" />
                    </label>
                    <span className="py-2">I accept Cryptonite's &apos;terms of service&apos; and agree that the order can be rejected in case the data provided above is incorrect.</span>
                </div>
                {
                    formState.message && 
                    <div className="p-4 my-3 mr-4 text-red-700 bg-red-200 rounded-lg text-sm">
                        {formState.message}
                    </div>
                }
                </div>
            </div>
            </div>
            <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex">
                <div className="pr-1">
                    <Button
                        disabled={formState.isDisabled}
                        onClick={() => {
                            onSubmit(order, course)
                        }}
                    >
                        Submit
                    </Button>
                </div>
            <Button
                onClick={closeModal}
                variant="red">
                Cancel
            </Button>
            </div>
        </div>
        </Modal>
    )
}