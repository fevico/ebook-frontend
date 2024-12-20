import { AxiosError } from "axios"
import toast from "react-hot-toast"

interface ApiError{
    error?: string
    message?: string
    errors?: Record<string, string[]>
}

export const parseError = (error: unknown) => {
    if(error instanceof AxiosError){
        const data = error.response?.data as ApiError
        if(data.errors){
         // it means it is an array of error
         const messages = Object.values(data.errors).map((err)=> Object.values(err)).flat()
        return messages.map((msg) => {
            toast(msg, {position: "top-right"})
         })
        }
        if(data.error){
         // it means it is a single error of a string
         return toast(data.error, {position: "top-right"})
        }
        if(data.message){
         // it means it is a single error of a string
         return toast(data.message, {position: "top-right"})
        }
       }
       if(error instanceof Error){
        return toast(error.message, {position: "top-right"})
    }
     toast("Something went wrong, please try again later", {position: "top-right"})

}

export const calculateDiscount = (price: {mrp: string, sale: string}) => {
    const {mrp, sale} = price
    const mrpNumber = Number(mrp)
    const saleNumber = Number(sale)

   return Math.round(((mrpNumber - saleNumber) / mrpNumber) * 100)
}

export const formatPrice = (amount: number) => {
   const formatter =  new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    })
   return  formatter.format(amount)

}

export const debounce = <T extends unknown[]>(func: (...args: T) => void, time: number) => {
    let timeoutId: number;
    return (...args: T) => {
        // clearing previous timeout and setting new timeout
        clearTimeout(timeoutId)
        // register the new timeout 
       timeoutId = setTimeout(() =>{
            func(...args)
        }, time)
    }
}