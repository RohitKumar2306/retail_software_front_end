import axios from "axios";

export const addCategory = async (category) => {
    return await axios.post("http://localhost:8080/api/v1.0/categories", category);
}

export const deleteCategory = async (categoryId) => {
    return await axios.delete(`http://localhost:8080/api/v1.0/categories/${categoryId}`);
}

export const fetchCategories = async () => {
    const res = await axios.get("http://localhost:8080/api/v1.0/categories");
    return res.data;
}