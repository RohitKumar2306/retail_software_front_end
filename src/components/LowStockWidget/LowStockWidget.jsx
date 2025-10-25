import { useContext, useEffect, useState } from "react";
import { fetchLowStock, fetchOutOfStock } from "../../service/Dashboard.js";
import { AppContext } from "../../context/AppContext.jsx";
import UpdateInventoryModal from "../UpdateInventoryModal/UpdateInventoryModal.jsx";
import {fetchItems, updateItemStock} from "../../service/ItemService";
import toast from "react-hot-toast";
import "./LowStockWidget.css";
import Item from "../Item/Item.jsx";
import SearchBox from "../SearchBox/SearchBox.jsx";

const AdminLowStockWidget = ({ threshold = 5, outOfStock }) => {
    const { setItemsData } = useContext(AppContext);
    const [fetchData, setFetchData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const openModal = (item) => { setSelectedItem(item); setShowModal(true); };
    const closeModal = () => setShowModal(false);

    const load = async () => {
        setLoading(true);
        try {
            if (outOfStock) {
                const [fetchItems] = await Promise.all([
                    fetchOutOfStock()
                ]);
                setFetchData(fetchItems.data);
            } else {
                const [fetchItems] = await Promise.all([
                    fetchLowStock(threshold)
                ]);
                setFetchData(fetchItems.data);
            }
        } catch (e) {
            console.error(e);
            toast.error("Unable to load stock data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [threshold]);

    // Modal submit (same contract you used in ManageInventory)
    const handleModalSubmit = async (item, formValues) => {
        const fd = new FormData();
        fd.append("item", JSON.stringify(formValues));
        try {
            const resp = await updateItemStock(item.itemId, fd);
            if (resp.status === 200 || resp.status === 201) {
                // update global items list if present
                setItemsData(prev => prev.map(x => x.itemId === item.itemId ? resp.data : x));
                toast.success("Inventory updated");
                setShowModal(false);
                // refresh the low/out lists because counts may change
                load();
                return true;
            } else {
                toast.error("Failed to update item");
                return false;
            }
        } catch (e) {
            console.error(e);
            toast.error("Unable to update item");
            return false;
        }
    };

    if (loading) {
        return <div className="alsw-card">Loading stock…</div>;
    }

    return (
        <div className="inventory-grid">
            <section className="inv-card">
                <header className="inv-card-header center">
                    <div>
                        {outOfStock ?
                            <i className="inv-icon bi bi-slash-circle inv-icon-danger"></i> :
                            <i className="inv-icon inv-icon-warning bi bi-exclamation-triangle"></i>
                        }
                    </div>
                    <div className="inv-header-content">
                        <h4 className="inv-title">{outOfStock ? "Out of Stock" : "Low Stock"}</h4>
                        <span className="badge bg-warning text-dark">{fetchData.length}</span>
                    </div>
                </header>

                {fetchData.length === 0 ? (
                    <></>
                ) : (
                    <div className="inv-scroll">
                        <div className="row g-3">
                            {fetchData.map((item) => (
                                <div key={item.itemId} className="col-md-6 col-lg-4 col-sm-6">
                                    <div className="mi-tile">
                                        <Item
                                            itemName={item.name}
                                            itemPrice={item.price}
                                            itemImage={item.imgUrl}
                                            itemId={item.itemId}
                                            stockQty={item.stockQuantity}
                                            lowStockThreshold={item.lowStockThreshold}
                                            isManageInventory={true}
                                        />
                                        <button
                                            className="btn btn-warning mi-update-btn w-100"
                                            onClick={() => openModal(item)}
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            <UpdateInventoryModal
                show={showModal}
                item={selectedItem}
                onClose={closeModal}
                onSubmit={handleModalSubmit}
            />
        </div>
    );
};

export default AdminLowStockWidget;
