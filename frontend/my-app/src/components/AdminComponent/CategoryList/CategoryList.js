import React, { useEffect, useState } from 'react';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import '../AdminDashboard/AdminDashboard.css'; // Ensure this path is correct
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const AdminCategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [refresh, setRefresh] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is not logged in or not admin
    if (!user || user.role !== 'admin') {
      navigate('/login'); // redirect to login
    }
  }, [user, navigate]);

  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/categories/');
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err.response?.data || err.message);
      }
    };
    fetchCategories();
  }, [refresh]);

  // ✅ Add Category
  const handleAddCategory = async () => {
    const token = localStorage.getItem('token'); // ⬅ read token directly
    if (!newCategory.trim()) return;

    if (!token) {
      console.error('Authentication token not found.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:8080/api/categories/create',
        { name: newCategory.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewCategory('');
      setRefresh(prev => !prev); // Trigger re-fetch
    } catch (err) {
      console.error('Error adding category:', err.response?.data || err.message);
    }
  };

  // ✅ Delete Category
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
      
    if (!token) {
      console.error('Authentication token not found.');
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRefresh(prev => !prev); // Trigger re-fetch
    } catch (err) {
      console.error('Error deleting category:', err.response?.data || err.message);
    }
  };

  return (
    <div className="admin-content">
      <AdminSidebar />
      <h2>Manage Categories</h2>

      <div className="admin-form">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
        />
        <button onClick={handleAddCategory}>Add Category</button>
      </div>

      <ul className="admin-list" style={{ textAlign: "center" }}>
        {categories.length === 0 ? (
          <li>No categories found.</li>
        ) : (
          categories.map((cat) => (
            <li key={cat._id}>
              {cat.name}
              <button onClick={() => handleDelete(cat._id)} className="delete-btn">
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default AdminCategoryList;
