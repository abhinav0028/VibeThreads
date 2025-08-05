import '../AdminSidebar/AdminSidebar.css';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from 'recharts';

function AdminDashboard() {
  const [salesData, setSalesData] = useState([]);
  const [coupon, setCoupon] = useState({
    code: '',
    discountPercent: 0,
    expiryDate: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is not logged in or not admin
    if (!user || user.role !== 'admin') {
      navigate('/login'); // redirect to login
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/orders/sales', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setSalesData(res.data);
      } catch (err) {
        console.error('Error fetching sales:', err);
      }
    };

    fetchSales();
  }, []);

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/coupons/create', coupon, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Coupon created successfully!');
      setCoupon({ code: '', discountPercent: 0, expiryDate: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to create coupon');
    }
  };

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />
      <div className="admin-main">
        <h1>Welcome to Admin Dashboard</h1>
        <p>Select a section from the sidebar to manage the store.</p>

        <div className="section">
          <h2>Monthly Sales Graph</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <CartesianGrid stroke="#ccc" />
              <Line type="monotone" dataKey="totalSales" stroke="#000" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="section">
          <h2>Create New Coupon</h2>
          <form className="coupon-form" onSubmit={handleCouponSubmit}>
            <input
              type="text"
              placeholder="Coupon Code"
              value={coupon.code}
              onChange={(e) => setCoupon({ ...coupon, code: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Discount %"
              value={coupon.discountPercent}
              onChange={(e) => setCoupon({ ...coupon, discountPercent: e.target.value })}
              required
            />
            <input
              type="date"
              value={coupon.expiryDate}
              onChange={(e) => setCoupon({ ...coupon, expiryDate: e.target.value })}
              required
            />
            <button type="submit">Create Coupon</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
