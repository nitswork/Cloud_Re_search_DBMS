import React, { useEffect, useState } from 'react';
import './UserList.css';
import { CiTrash } from "react-icons/ci";

import API,{ deleteUserById,fetchAllUsers } from '../../api';

const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
        try {
            const res = await fetchAllUsers();
            setUsers(res.data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await deleteUserById(id);
            setUsers(prev => prev.filter(user => user._id !== id));
        } catch (err) {
            console.error('Error deleting user:', err);
            alert('Failed to delete user.');
        }
    };

    return (
            <div className="user-list-container">
            <h2>All Registered Users</h2>
            <div className="user-table-wrapper">
                <table className="user-table">
                <thead>
                    <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                    users.map((user, idx) => (
                        <tr key={idx}>
                        <td>{user.name || '—'}</td>
                        <td>{user.username || '—'}</td>
                        <td>{user.role || 'User'}</td>
                        <td>
                            <button className="admin-delete-button" onClick={() => handleDelete(user._id)}>
                                <center> <CiTrash className="admin-trash-icon" /></center>
                            </button>
                        </td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan="4" className="no-users">
                        No users found.
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
            </div>
    );
};

export default UserList;
