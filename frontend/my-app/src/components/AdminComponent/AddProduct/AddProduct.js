import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import './AddProduct.css'; // ✅ Correct path based on your folder structure

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    countInStock: '',
    category: '',
    image: null,
  });
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');

  // ✅ Load token and categories
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) setToken(storedToken);

    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/categories/');
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err.response?.data || err.message);
      }
    };

    fetchCategories();
  }, []);

  // ✅ Input change handler
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage('Authentication token not found. Please log in.');
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'image') {
        if (formData.image) data.append('productImage', formData.image); // Backend field: productImage
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      await axios.post('http://localhost:8080/api/products/create', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setMessage('✅ Product added successfully!');
      setFormData({ name: '', description: '', price: '', countInStock: '', category: '', image: null });
    } catch (err) {
      setMessage('❌ Error adding product');
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="admin-content">
       <AdminSidebar />
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit} className="admin-form" encType="multipart/form-data">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
        <input type="number" name="countInStock" placeholder="Stock" value={formData.countInStock} onChange={handleChange} required />
        
        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <input type="file" name="image" onChange={handleImageChange} accept="image/*" required />
        <button type="submit">Add Product</button>
      </form>

      {message && <p style={{ marginTop: '10px', color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
};

export default AddProduct;
