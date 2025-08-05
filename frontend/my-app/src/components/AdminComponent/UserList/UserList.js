import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import './UserList.css'; // Update path if this file is in a nested folder

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
    fetchUsers(storedToken);
  }, []);

  const fetchUsers = async (authToken) => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8080/api/user/fetch', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Failed to fetch users:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (email) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete('http://localhost:8080/api/user/delete', {
        data: { condition_obj: { email } },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchUsers(token);
    } catch (err) {
      console.error('Delete failed:', err.response?.data || err.message);
    }
  };

  const handleVerify = async (email) => {
    try {
      await axios.patch('http://localhost:8080/api/user/update', {
        condition_obj: { email },
        content_obj: { status: 1 }
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchUsers(token);
    } catch (err) {
      console.error('Verification failed:', err.response?.data || err.message);
    }
  };

  return (
    <div className="admin-content">
     <AdminSidebar />
      <h2 className="admin-heading">Manage Users</h2>

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.mobile}</td>
                <td>{user.role}</td>
                <td>{user.status === 1 ? 'Verified' : 'Not Verified'}</td>
                <td>
                  {user.status === 0 && (
                    <button className="btn-sm green" onClick={() => handleVerify(user.email)}>Verify</button>
                  )}
                  <button className="btn-sm red" onClick={() => handleDelete(user.email)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;
