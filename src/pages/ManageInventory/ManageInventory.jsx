import './ManageInventory.css'
import {useContext, useState} from "react";
import {AppContext} from "../../context/AppContext.jsx";
import SearchBox from "../../components/SearchBox/SearchBox.jsx";
import Item from "../../components/Item/Item.jsx";
import UpdateInventoryModal from "../../components/UpdateInventoryModal/UpdateInventoryModal.jsx";
// (optional) toast
import toast from "react-hot-toast";
// you’ll need a service endpoint that updates stock:
import { updateItemStock } from "../../service/ItemService.js";
// implement updateItemStock(itemId, newStock) => PATCH/POST to backend

const ManageInventory = () => {
    const { itemsData, setItemsData } = useContext(AppContext);
    const [searchText, setSearchText] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const filtered = itemsData.filter(i =>
        i.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const openModal = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };
    const closeModal = () => setShowModal(false);

    const handleModalSubmit = async (item, formValues) => {
        // formValues is a plain object with only fields the user set (e.g., { stockQuantity: 42, price: 9.99, ... })
        const formData = new FormData();
        formData.append("item", JSON.stringify(formValues)); // must match @RequestPart("item")

        try {
            const resp = await updateItemStock(item.itemId, formData);
            if (resp.status === 200 || resp.status === 201) {
                setItemsData(prev =>
                    prev.map(x => x.itemId === item.itemId ? resp.data : x)
                );
                toast.success("Inventory updated");
                setShowModal(false);
                return true;
            } else {
                toast.error("Failed to update stock");
                return false;
            }
        } catch (e) {
            console.error(e);
            toast.error("Unable to update stock");
            return false;
        }
    };

    return (
        <div className="p-3 manage-inventory-page">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div></div>
                <div><SearchBox onSearch={setSearchText} /></div>
            </div>

            <div className="row g-3" style={{ height: "75vh", overFlowX: "hidden", overflowY: "auto" }}>
                {filtered.map((item) => (
                    <div key={item.itemId} className="col-md-4 col-sm-6">
                        <div className="mi-tile">
                            <Item
                                itemName={item.name}
                                itemPrice={item.price}
                                itemImage={item.imgUrl}
                                itemId={item.itemId}
                                stockQty={item.stockQty ?? item.stockQuantity}
                                lowStockThreshold={item.lowStockThreshold}
                                isManageInventory={true}
                            />
                            <button
                                className="btn btn-outline-warning mi-update-btn"
                                onClick={() => openModal(item)}
                            >
                                Update Inventory
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <UpdateInventoryModal
                show={showModal}
                item={selectedItem}
                onClose={closeModal}
                onSubmit={handleModalSubmit}
            />
        </div>

    );
};

export default ManageInventory;