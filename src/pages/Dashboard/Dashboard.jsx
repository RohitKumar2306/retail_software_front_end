import './Dashboard.css'
import {useContext, useEffect, useState} from "react";
import {fetchDashboardData} from "../../service/Dashboard.js";
import toast from "react-hot-toast";
import {AppContext} from "../../context/AppContext.jsx";
import LowStockWidget from "../../components/LowStockWidget/LowStockWidget.jsx";


const Dashboard = () => {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
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

    if (loading) {
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
                            <h3 className="recent-orders-title">
                                <i className="bi bi-clock-history">
                                    Recent Orders
                                </i>
                            </h3>
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
                            <h3 className="recent-orders-title">
                                <i className="bi bi-clock-history">
                                    Inventory Alerts
                                </i>
                            </h3>
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
                    </div>
                </div>
            ) : (
                <div>User Activity</div>
                )
            }
        </>
    )
}

export default Dashboard;