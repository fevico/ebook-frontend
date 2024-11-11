import { useContext } from "react"
import { CartContext } from "../contex/CartProvider"

const useCart = () => useContext(CartContext)

export default useCart