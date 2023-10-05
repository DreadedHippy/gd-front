import { createContext, createSignal, useContext } from "solid-js";
import { createStore } from "solid-js/store"
// import { CartItem } from "../models/carItem.model";

export const UserContext = createContext();

export function CartContextProvider(props: any) {
	const [username, setUsername] = createSignal("");

	return (
		<UserContext.Provider value={{username, setUsername}}>
			{props.children}
		</UserContext.Provider>
	)
}

export function useCartContext() {
	return useContext(UserContext)!;
}