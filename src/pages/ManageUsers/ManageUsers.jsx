import "./ManageUsers.css"
import UserForm from "../../components/UserForm/UserForm.jsx";
import UserList from "../../components/UserList/UserList.jsx";


const ManageUsers = () => {
    return (
        <div className="users-container text-light">
            <div className="left-column">
                <UserForm />
            </div>

            <div className="right-column">
                <UserList />
            </div>
        </div>
    )
}

export default ManageUsers;