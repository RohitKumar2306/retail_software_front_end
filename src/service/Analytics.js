import axios from "axios";

const AUTH = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
const BASE = "http://localhost:8080/api/v1.0";

export const fetchSpend = (windowDays) =>
    axios.get(`${BASE}/analytics/spend`, { params: { window: windowDays }, ...AUTH });

export const downloadSpendCsv = async (windowDays) => {
    const res = await axios.get(`${BASE}/analytics/spend/export`, {
        params: { window: windowDays },
        responseType: "blob",
        ...AUTH,
    });
    // create a temporary download
    const url = window.URL.createObjectURL(new Blob([res.data], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `spend_${windowDays}d.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
};