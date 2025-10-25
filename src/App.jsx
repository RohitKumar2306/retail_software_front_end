import Menubar from "./components/Menubar/Menubar.jsx";
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import ManageItems from "./pages/ManageItems/ManageItems.jsx";
import ManageCategory from "./pages/ManageCategory/ManageCategory.jsx";
import ManageUsers from "./pages/ManageUsers/ManageUsers.jsx";
import Explore from "./pages/Explore/Explore.jsx";
import {Toaster} from "react-hot-toast";
import Login from "./pages/Login/Login.jsx";
import OrderHistory from "./pages/OrderHistory/OrderHistory.jsx";
import {useContext} from "react";
import {AppContext} from "./context/AppContext.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import ManageInventory from "./pages/ManageInventory/ManageInventory.jsx";

const App = () => {
    const location = useLocation();
    const {auth} = useContext(AppContext);

    const LoginRoute = ({element}) => {
        if (auth.token) {
            return <Navigate to='/dashboard' replace />
        }
        return element;
    }

    const ProtectedRoute = ({element, allowedRoutes}) => {
        if (!auth.token) {
            return <Navigate to='/login' replace />;
        }
        if (allowedRoutes && !allowedRoutes.includes(auth.role)) {
            return <Navigate to='/dashboard' replace />;
        }
        return element;
    }

    return (
        <div>
            {location.pathname !== "/login" && <Menubar />}
            <Toaster />
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/explore" element={<Explore />} />
                //Admin-Only Routes
                <Route path="/items" element={<ProtectedRoute element={<ManageItems />} allowedRoutes={['ROLE_ADMIN']} />} />
                <Route path="/categories" element={<ProtectedRoute element={<ManageCategory />} allowedRoutes={['ROLE_ADMIN']} />} />
                <Route path="/users" element={<ProtectedRoute element={<ManageUsers />} allowedRoutes={['ROLE_ADMIN']} />} />
                <Route path="/manage_inventory" element={<ProtectedRoute element={<ManageInventory />} allowedRoutes={['ROLE_ADMIN']} />} />
                <Route path="/login" element={<LoginRoute element={<Login />}/>} />
                <Route path="/orders_history" element={<OrderHistory />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default App;