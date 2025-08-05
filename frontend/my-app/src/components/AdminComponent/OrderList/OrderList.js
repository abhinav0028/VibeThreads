import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import '../AdminDashboard/AdminDashboard.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) setToken(storedToken);
  }, []);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is not logged in or not admin
    if (!user || user.role !== 'admin') {
      navigate('/login'); // redirect to login
    }
  }, [user, navigate]);

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8080/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsDelivered = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/orders/${id}/deliver`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
    } catch (err) {
      console.error('Error marking as delivered:', err.response?.data || err.message);
    }
  };

  const markAsPaid = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/orders/${id}/pay`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
    } catch (err) {
      console.error('Error marking as paid:', err.response?.data || err.message);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />
      <div className="admin-content">
        <h2>Order List</h2>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Address</th>
                <th>Paid</th>
                <th>Delivered</th>
                <th>Cancelled</th>
                <th>Order Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user?.name || order.user?.email || 'N/A'}</td>
                  <td>₹{order.totalAmount}</td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    {order.address ? (
                      <>
                        {order.address.fullName}, {order.address.street},<br />
                        {order.address.city}, {order.address.state}, {order.address.postalCode},<br />
                        {order.address.country}
                      </>
                    ) : 'N/A'}
                  </td>
                  <td>{order.isPaid ? 'Yes' : 'No'}</td>
                  <td>{order.isDelivered ? 'Yes' : 'No'}</td>
                  <td>
                    {order.isCancelled ? (
                      <span style={{ color: 'red', fontWeight: 'bold' }}>Cancelled<br />
                        <small>{order.cancelReason}</small>
                      </span>
                    ) : (
                      'No'
                    )}
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    {order.isCancelled ? (
                      <span style={{ color: 'gray' }}>No Actions</span>
                    ) : (
                      <>
                        {!order.isPaid && (
                          <button onClick={() => markAsPaid(order._id)} className="btn-sm green">
                            Mark Paid
                          </button>
                        )}
                        {!order.isDelivered && (
                          <button onClick={() => markAsDelivered(order._id)} className="btn-sm green">
                            Mark Delivered
                          </button>
                        )}
                        {order.isPaid && order.isDelivered && (
                          <span style={{ color: 'green', fontWeight: 'bold' }}>Completed</span>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrderList;
