import './Dashboard.css'
import {useContext, useEffect, useState} from "react";
import {fetchDashboardData, fetchTopSellers} from "../../service/Dashboard.js";
import toast from "react-hot-toast";
import {AppContext} from "../../context/AppContext.jsx";
import LowStockWidget from "../../components/LowStockWidget/LowStockWidget.jsx";
import SpendingSnapshot from "../../components/SpendingSnapshot/SpendingSnapshot.jsx";


const Dashboard = () => {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [choice, setChoice] = useState("7");
    const [topSellers, setTopSellers] = useState();
    const { auth } = useContext(AppContext);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetchDashboardData();
                setData(response.data);
            } catch (error) {
                console.error(error);
                toast.error("Unable to fetch data");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    useEffect(() => {
        if (!choice) return;
        const loadTopSellers = async () => {
            try {
                const response = await fetchTopSellers(choice);
                setTopSellers(response.data);
            } catch (error) {
                toast.error("Unable to fetch top sellers data");
                console.error(error);
            }
        }
        loadTopSellers();
    }, [choice]);

    if (loading) {
        console.log(localStorage.getItem('role'))
        return <div className="loading">Loading...</div>;
    }

    if (!data) {
        return <div className="error">Failed to load the dashboard data...</div>;
    }

    return (
        <>
            {auth.role === "ROLE_ADMIN" ? (
                <div className="dashboard-wrapper">
                    <div className="dashboard-container">
                        <div className="stats-grid mt-2">
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="bi bi-currency-dollar"></i>
                                </div>
                                <div className="stat-content">
                                    <h3>Today's Sales</h3>
                                    <p>${data.todaySales.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="bi bi-cart-check"></i>
                                </div>
                                <div className="stat-content">
                                    <h3>Today's Orders</h3>
                                    <p>{data.todayOrderCount}</p>
                                </div>
                            </div>
                        </div>
                        <div className="recent-orders-card">
                            <div className="section-title">
                                <i className="bi bi-clock-history" />
                                    Recent Orders
                            </div>
                            <div className="orders-table-container">
                                <table className="orders-table">
                                    <thead>
                                    <tr>
                                        <th>Order Id</th>
                                        <th>Customer</th>
                                        <th>Amount</th>
                                        <th>Payment</th>
                                        <th>Status</th>
                                        <th>Time</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {data.recentOrders.map((order) => (
                                        <tr key={order.orderId}>
                                            <td>{order.orderId.substring(0, 8)}...</td>
                                            <td>{order.customerName}</td>
                                            <td>${order.grandTotal.toFixed(2)}</td>
                                            <td>
                                    <span className={`payment-method ${order.paymentMethod.toLowerCase()}`}>
                                        {order.paymentMethod}
                                    </span>
                                            </td>
                                            <td>
                                    <span className={`status-badge ${order.paymentDetails.status.toLowerCase()}`}>
                                        {order.paymentDetails.status}
                                    </span>
                                            </td>
                                            <td>
                                                {new Date(order.createdAt).toLocaleDateString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="recent-orders-card mt-4">
                            <div className="section-title">
                                <i className="bi bi-backpack" />
                                    Inventory Alerts
                            </div>
                            <div className="row g-3">
                                <div className="col-lg-6">
                                    <LowStockWidget
                                        threshold={5}
                                        outOfStock={true}
                                    />
                                </div>
                                <div className="col-lg-6">
                                    <LowStockWidget
                                        threshold={5}
                                        outOfStock={false}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* === Top Customers Card === */}
                        <div className="recent-orders-card mt-4">
                            <div className="section-header">
                                <div className="section-title">
                                    <i className="bi bi-bar-chart-line section-icon" />
                                    Top Customers
                                </div>

                                <div className="section-actions">
                                    <select
                                        id="top-sellers-select"
                                        className="dash-select"
                                        value={choice}
                                        onChange={(e) => setChoice(e.target.value)}
                                    >
                                        <option value="7">Weekly</option>
                                        <option value="30">Monthly</option>
                                    </select>
                                </div>
                            </div>

                            <div className="top-table-wrap">
                                {(!topSellers || topSellers.length === 0) ? (
                                    <div className="top-empty">No data for this period.</div>
                                ) : (
                                    <table className="orders-table">
                                        <thead>
                                        <tr>
                                            <th>Customer</th>
                                            <th className="text-start">Total Spent</th>
                                            <th className="text-start">Orders</th>
                                            <th className="text-start">Last Order</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {topSellers.map((row, idx) => (
                                            <tr key={row.username ?? idx}>
                                                <td>
                                                    <div className="cust-cell">
                                                        <div className="cust-avatar">{(row.username || 'N/A')[0]?.toUpperCase()}</div>
                                                        <div className="cust-name">{row.username || 'N/A'}</div>
                                                    </div>
                                                </td>
                                                <td className="text-start">
                                                    <span className="money">${Number(row.totalSpent).toFixed(2)}</span>
                                                </td>
                                                <td className="text-start">{row.ordersCount}</td>
                                                <td className="text-start">
                                                    {new Date(row.lastOrderAt).toLocaleString([], { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="stats-grid mt-2">
                    <div className="col-12">
                        <SpendingSnapshot defaultWindow={7} />
                    </div>
                </div>
                )
            }
        </>
    )
}

export default Dashboard;