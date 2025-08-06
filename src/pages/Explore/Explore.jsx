import './Explore.css'
import {useContext} from "react";
import {AppContext} from "../../context/AppContext.jsx";


const Explore = () => {
    const {categories} = useContext(AppContext);
    console.log(categories);
    return (
        <div className="explore-container text-light">
            <div className="left-column">
                <div className="first-row" style={{overflowY: 'auto'}}>

                </div>
                <hr className="horizontal-line"/>
                <div className="second-row" style={{overflowY: 'auto'}}>

                </div>
            </div>
            <div className="right-column d-flex flex-column">
                <div className="customer-form-container" style={{height: '15%'}}>

                </div>
                <hr className="my-3 text-light"/>
                <div className="cart-items-container" style={{height: '55%', overflowY: 'auto'}}>

                </div>
                <div className="cart-summary-container" style={{height: '30%'}}>

                </div>
            </div>
        </div>
    )
}

export default Explore;