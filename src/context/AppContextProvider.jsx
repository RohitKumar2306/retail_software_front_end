import {useEffect, useState} from "react";
import {AppContext} from "./AppContext.jsx";
import {fetchCategories} from "../service/CategoryService.js";
import {fetchItems} from "../service/ItemService.js";
import toast from "react-hot-toast";

export const AppContextProvider = (props) => {

    const [categories, setCategories] = useState([]);
    const [itemsData, setItemsData] = useState([]);
    const [auth, setAuth] = useState({token: null, role: null});
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (item) => {
        // Find stock for this itemId (fallback 0 if unknown)
        const stockQuantity = itemsData.find(i => i.itemId === item.itemId)?.stockQuantity ?? 0;
        if (stockQuantity <= 0) {
            // Out of stock: do nothing
            return;
        }

        setCartItems(prev => {
            // Prefer matching by itemId (unique) to avoid name collisions
            const idx = prev.findIndex(ci => ci.itemId === item.itemId);
            const currentQty = idx >= 0 ? prev[idx].quantity : 0;

            // How many more can we add without exceeding stock?
            const allowedMore = Math.max(0, stockQuantity - currentQty);
            if (allowedMore <= 0) {
                toast.error("Maximum amount reached")
                return prev;
            }

            const addQty = Math.min(1, allowedMore); // you add one at a time in UI

            if (idx >= 0) {
                const next = [...prev];
                next[idx] = { ...next[idx], quantity: currentQty + addQty };
                return next;
            }
            return [...prev, { ...item, quantity: addQty }];
        });
    };

    const removeFromCart = (itemId) => {
        setCartItems(cartItems.filter(item => item.itemId !== itemId));
    }

    /*const updateQuantity = (itemId, newQuantity) => {
        setCartItems(cartItems.map(item => item.itemId === itemId ? {...item, quantity: newQuantity} : item));
    }*/

    const updateQuantity = (itemId, newQuantity) => {
        // Clamp requested quantity to [1, stockQty]
        const stockQuantity = itemsData.find(i => i.itemId === itemId)?.stockQuantity ?? 0;
        const clamped = Math.max(1, Math.min(newQuantity, stockQuantity || 0));

        setCartItems(cartItems.map(item => item.itemId === itemId ? {...item, quantity: clamped} : item));
    };

    useEffect(() => {
        // don’t run this effect for these roles
        const blockedRoles = new Set(['ROLE_STOCK_CLERK', 'ROLE_GUEST']); // <- your list

        const norm = (r) => (r || '').trim().toUpperCase().startsWith('ROLE_') ? r.trim().toUpperCase()
            : `ROLE_${(r || '').trim().toUpperCase()}`;

        if (!auth.token) return;                 // no token → skip
        if (blockedRoles.has(norm(auth.role))) return; // role is blocked → skip

        (async function loadData() {
            try {
                if (localStorage.getItem('role') && localStorage.getItem('token')) {
                    setAuthData(localStorage.getItem('token'), localStorage.getItem('role'));
                }
                const [cats, items] = await Promise.all([fetchCategories(), fetchItems()]);
                setCategories(cats.data);
                setItemsData(items.data);
            } catch (err) {
                console.error('Failed to load categories:', err);
            }
        })();
    }, [auth.token, auth.role]); // include role so guard works reliably


    const setAuthData = (token, role) => {
        setAuth({token, role});
    }

    const clearCart = () => {
        setCartItems([]);
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
        updateQuantity,
        clearCart
    }

    return <AppContext.Provider value={contextValue}>
        {props.children}
    </AppContext.Provider>;
}