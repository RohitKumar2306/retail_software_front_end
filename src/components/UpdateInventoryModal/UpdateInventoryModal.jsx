import {useContext, useState, useEffect} from "react";
import "./UpdateInventoryModal.css";
import {AppContext} from "../../context/AppContext.jsx";

const UpdateInventoryModal = ({ show, onClose, item, onSubmit }) => {
    const { categories } = useContext(AppContext);
    const {auth} = useContext(AppContext);

    const [loading, setLoading] = useState(false);

    const isAdmin = auth.role === "ROLE_ADMIN";
    const isManager = auth.role === "ROLE_MANAGER";
    const isStockClerk = auth.role === "ROLE_STOCK_CLERK";

    // Initialize fields (empty by default; placeholders show current values)
    const [data, setData] = useState({
        name: "",
        categoryId: "",
        price: "",
        description: "",
        stockQuantity: "",
        lowStockThreshold: ""
    });

    // When opening, reset form
    useEffect(() => {
        if (show) {
            setData({
                name: "",
                categoryId: "",
                price: "",
                description: "",
                stockQuantity: "",
                lowStockThreshold: ""
            });
            setLoading(false);
        }
    }, [show]);

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        // Build payload with only fields the user set
        const payload = {
            name: data.name || undefined,
            categoryId: data.categoryId || undefined,
            price: data.price !== "" ? Number(data.price) : undefined,
            description: data.description || undefined,
            stockQuantity: data.stockQuantity !== "" ? Number(data.stockQuantity) : undefined,
            lowStockThreshold: data.lowStockThreshold !== "" ? Number(data.lowStockThreshold) : undefined,
        };
        const cleaned = Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined));

        const ok = await onSubmit(item, cleaned); // 🔑 calls parent handler
        setLoading(false);
        // parent will close modal on success; no need to close here
    };

    if (!show) return null;

    const currentStock = item?.stockQuantity ?? 0;
    const currentPrice = item?.price ?? 0;
    const currentCategory = item?.categoryName ?? "Select a category";
    const currentDescription = item?.description ?? "";
    const currentThreshold = item?.lowStockThreshold ?? 5;

    return (
        <div className="inv-modal-overlay" role="dialog" aria-modal="true">
            <form onSubmit={handleSubmit}>
                <div className="inv-modal">
                    <div className="inv-modal-header">
                        <h5 className="mb-0">Update Inventory</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
                    </div>

                    <div className="inv-modal-body">
                        <div className="mb-3">
                            <label className="form-label">Item</label>
                            <div className="fw">{item?.name}</div>
                        </div>

                        {(isAdmin || isManager) && (
                            <div>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="categoryId">Category</label>
                                    <select
                                        name="categoryId"
                                        id="categoryId"
                                        className="form-control"
                                        onChange={onChangeHandler}
                                        value={data.categoryId}
                                    >
                                        <option value="">{currentCategory}</option>
                                        {categories.map((category) => (
                                            <option key={category.categoryId} value={category.categoryId}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3 mt-3">
                                    <label htmlFor="price" className="form-label">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        id="price"
                                        className="form-control"
                                        placeholder={String(currentPrice)}
                                        onChange={onChangeHandler}
                                        value={data.price}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="row mt-3">
                            <div className="col-6">
                                <label className="form-label" htmlFor="stockQuantity">New Stock</label>
                                <input
                                    type="number"
                                    name="stockQuantity"
                                    id="stockQuantity"
                                    min="0"
                                    value={data.stockQuantity}
                                    className="form-control"
                                    placeholder={String(currentStock)}
                                    onChange={onChangeHandler}
                                />
                            </div>
                            <div className="col-6">
                                <label className="form-label" htmlFor="lowStockThreshold">Low Stock Threshold</label>
                                <input
                                    type="number"
                                    name="lowStockThreshold"
                                    id="lowStockThreshold"
                                    min="0"
                                    value={data.lowStockThreshold}
                                    className="form-control"
                                    placeholder={String(currentThreshold)}
                                    onChange={onChangeHandler}
                                />
                            </div>
                        </div>

                        <div className="mb-3 mt-3">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea
                                rows={5}
                                name="description"
                                id="description"
                                className="form-control"
                                placeholder={currentDescription}
                                onChange={onChangeHandler}
                                value={data.description}
                            />
                        </div>
                    </div>

                    <div className="inv-modal-footer">
                        <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            className="btn btn-warning"
                            type="submit"
                            disabled={loading}
                            title={loading ? "Saving..." : "Save"}
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UpdateInventoryModal;