import './Item.css'
import {useContext} from "react";
import {AppContext} from "../../context/AppContext.jsx";

const Item = ({itemName, itemPrice, itemImage, itemId, stockQty, lowStockThreshold, isManageInventory}) => {

    const {addToCart} = useContext(AppContext);

    const outOfStock = (stockQty ?? 0) <= 0;
    const lowStock = !outOfStock && stockQty <= (lowStockThreshold ?? 5);

    const handleAddToCart = () => {
        if (outOfStock) {
            return;
        }
        addToCart({
            name: itemName,
            price: itemPrice,
            quantity: 1,
            itemId: itemId,
        });
    }

    return (
        <div className="p-3 bg-dark rounded shadow-sm h-100 d-flex align-items-center item-card">
            <div style={{position: 'relative', marginRight: '15px'}}>
                <img src={itemImage} alt={itemName} className="item-image" />
            </div>
            <div className="flex-grow ms-2">
                <h6 className="mb-1 text-light item-name">{itemName}</h6>
                <p className="mb-0 fw-bold text-light">${itemPrice}</p>
                <div className="mt-1">
                    {outOfStock && <span className="item-badge out">Out of stock</span>}
                    {lowStock && !outOfStock && <span className="item-badge low">Only {stockQty} left</span>}
                    {!lowStock && !outOfStock && <span className="item-badge ok">In stock: {stockQty}</span>}
                </div>
            </div>
            {!isManageInventory && (
                <div className="d-flex flex-column justify-content-between align-items-center ms-3" style={{ height: '100%' }}>
                    <i className="bi bi-cart-plus fs-4" style={{ color: outOfStock ? '#666' : '#f2b22c' }} />
                    <button
                        className="btn btn-success btn-sm"
                        onClick={handleAddToCart}
                        disabled={outOfStock}
                        title={outOfStock ? 'Out of stock' : 'Add to cart'}
                        style={{ opacity: outOfStock ? 0.5 : 1, cursor: outOfStock ? 'not-allowed' : 'pointer' }}
                    >
                        <i className="bi bi-plus"></i>
                    </button>
                </div>
            )}
        </div>
    );
};
export default Item;