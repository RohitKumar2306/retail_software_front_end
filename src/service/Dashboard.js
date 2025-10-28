import axios from "axios";

export const fetchDashboardData = async () => {
    return await axios.get("http://localhost:8080/api/v1.0/dashboard", {headers: {'Authorization': 'Bearer ' + localStorage.getItem("token")}});
}

export const fetchLowStock = async () => {
    return await axios.get(`http://localhost:8080/api/v1.0/dashboard/lowStock`, {headers: {'Authorization': 'Bearer ' + localStorage.getItem("token")}});
}

export const fetchOutOfStock = async () => {
    return await axios.get(`http://localhost:8080/api/v1.0/dashboard/outOfStock`, {headers: {'Authorization': 'Bearer ' + localStorage.getItem("token")}});
}

export const fetchTopSellers = async (time) => {
    return await axios.get(`http://localhost:8080/api/v1.0/dashboard/topSellers/${time}`, {headers: {'Authorization': 'Bearer ' + localStorage.getItem("token")}});
}