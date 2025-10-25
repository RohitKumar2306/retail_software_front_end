import './OrderHistory.css';
import {useEffect, useState} from "react";
import {latestOrders} from "../../service/OrderService.js";
import ReceiptPopUp from "../../components/ReceiptPopUp/ReceiptPopUp.jsx";

const OrderHistory = () => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showReceipt, setShowReceipt] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await latestOrders();
                setOrders(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, []);

    const formatItems = (items) => {
        return items.map((item) => `${item.name} x ${item.quantity}`).join(', ');
    }

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    const openReceipt = (order) => {
        // ReceiptPopUp expects "subtotal" (lowercase) but DTO has "subTotal"
        const normalized = { ...order, subtotal: order.subTotal };
        setSelectedOrder(normalized);
        setShowReceipt(true);
    };
    const closeReceipt = () => setShowReceipt(false);
    const printReceipt = () => window.print();

    if (loading) {
        return <div className="text-center py-4">Loading Orders....</div>
    }

    if (orders.length === 0) {
        return <div className="text-center py-4">No orders found</div>
    }

    return (
        <div className="orders-history-container">
            <h2 className="mb-2 text-light">Order History</h2>
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                    <tr>
                        <th>Order Id</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map(order => (
                        <tr
                            key={order.orderId}
                            onClick={() => openReceipt(order)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => (e.key === 'Enter' ? openReceipt(order) : null)}
                        >
                            <td>{order.orderId}</td>
                            <td>
                                {order.customerName}
                                <br/>
                                <small className="text-muted">{order.phoneNumber}</small>
                            </td>
                            <td>{formatItems(order.items)}</td>
                            <td>${order.grandTotal.toFixed(2)}</td>
                            <td>{order.paymentMethod}</td>
                            <td>
                                <span className={`badge ${order.paymentDetails?.status === 'COMPLETED' ? 'bg-success' : 'bg-warning text-dark'}`}>{order.paymentDetails?.status || 'PENDING'}</span>
                            </td>
                            <td>{formatDate(order.createdAt)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {showReceipt && selectedOrder && (
                <ReceiptPopUp
                    orderDetails={selectedOrder}
                    onClose={closeReceipt}
                    onPrint={printReceipt}
                />
            )}

        </div>
    )
}

export default OrderHistory;