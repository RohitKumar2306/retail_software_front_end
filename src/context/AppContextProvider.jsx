import {useEffect, useState} from "react";
import {fetchCategories} from "../service/CategoryService.js";
import {AppContext} from "./AppContext.jsx";

export const AppContextProvider = (props) => {

    const [categories, setCategories] = useState([]);

    useEffect(() => {

        async function loadData() {
            const response = await fetchCategories();
            setCategories(response);
        }
        loadData();
    }, []);

    const contextValue = {

        categories,
        setCategories
    }

    return <AppContext.Provider value={contextValue}>
        {props.children}
    </AppContext.Provider>
}