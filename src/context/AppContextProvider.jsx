import {useEffect, useState} from "react";
import {fetchCategories} from "../service/CategoryService.js";
import {AppContext} from "./AppContext.jsx";

export const AppContextProvider = (props) => {

    const [categories, setCategories] = useState([]);
    const [auth, setAuth] = useState({token: null, role: null});

    useEffect(() => {
        async function loadData() {
            try {
                const data = await fetchCategories(auth.token);
                setCategories(data);
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
        setAuthData
    }

    return <AppContext.Provider value={contextValue}>
        {props.children}
    </AppContext.Provider>;
}