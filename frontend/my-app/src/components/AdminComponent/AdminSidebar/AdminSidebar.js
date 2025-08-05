// /src/components/AdminComponent/AdminSidebar/AdminSidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../AdminDashboard/AdminDashboard.css'; // ✅ Corrected relative path

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <h3>Admin Panel</h3>
      <ul>
        <li><NavLink to="/admin/dashboard" activeClassName="active-link">Dashboard</NavLink></li>
        <li><NavLink to="/admin/products" activeClassName="active-link">Products</NavLink></li>
        <li><NavLink to="/admin/add-product" activeClassName="active-link">Add Product</NavLink></li>
        <li><NavLink to="/admin/orders" activeClassName="active-link">Orders</NavLink></li>
        <li><NavLink to="/admin/users" activeClassName="active-link">Users</NavLink></li>
        <li><NavLink to="/admin/categories" activeClassName="active-link">Categories</NavLink></li>
        <li><NavLink to="/" activeClassName="active-link">Back</NavLink></li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
