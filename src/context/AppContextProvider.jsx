import {useEffect, useState} from "react";
import {AppContext} from "./AppContext.jsx";
import {fetchCategories} from "../service/CategoryService.js";
import {fetchItems} from "../service/ItemService.js";

export const AppContextProvider = (props) => {

    const [categories, setCategories] = useState([]);
    const [itemsData, setItemsData] = useState([]);
    const [auth, setAuth] = useState({token: null, role: null});

    useEffect(() => {
        async function loadData() {
            try {
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
        setItemsData
    }

    return <AppContext.Provider value={contextValue}>
        {props.children}
    </AppContext.Provider>;
}