import {useEffect, useState} from "react";
import {AppContext} from "./AppContext.jsx";
import {fetchCategories} from "../service/CategoryService.js";
import {fetchItems} from "../service/ItemService.js";

export const AppContextProvider = (props) => {

    const [categories, setCategories] = useState([]);
    const [itemsData, setItemsData] = useState([]);
    const [auth, setAuth] = useState({token: null, role: null});
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (item) => {
        const existingItem = cartItems.find(cartItem => cartItem.name === item.name);
        console.log(existingItem);
        if (existingItem) {
            setCartItems(cartItems.map(cartItem => cartItem.name === item.name ? {...cartItem, quantity: cartItem.quantity + 1} : cartItem));
        } else {
            setCartItems([...cartItems, {...item, quantity: 1}]);
        }
    }

    const removeFromCart = (itemId) => {
        setCartItems(cartItems.filter(item => item.itemId !== itemId));
    }

    const updateQuantity = (itemId, newQuantity) => {
        setCartItems(cartItems.map(item => item.itemId === itemId ? {...item, quantity: newQuantity} : item));
    }

    useEffect(() => {
        async function loadData() {
            try {
                if (localStorage.getItem("role") && localStorage.getItem("token")) {
                    setAuthData(
                        localStorage.getItem("token"),
                        localStorage.getItem("role")
                    );
                }
                const response = await fetchCategories();
                const itemResponse = await fetchItems();
                setCategories(response.data);
                setItemsData(itemResponse.data);
            } catch (err) {
                console.error("Failed to load categories:", err);
            }
        }

        loadData();
    }, [auth.token]);

    const setAuthData = (token, role) => {
        setAuth({token, role});
    }

    const contextValue = {
        categories,
        setCategories,
        auth,
        setAuthData,
        itemsData,
        setItemsData,
        addToCart,
        cartItems,
        removeFromCart,
        updateQuantity
    }

    return <AppContext.Provider value={contextValue}>
        {props.children}
    </AppContext.Provider>;
}