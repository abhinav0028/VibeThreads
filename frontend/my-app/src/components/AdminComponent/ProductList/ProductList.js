// /src/admin/ProductList.js
import { useEffect, useState } from 'react';
import axios from '../../../axios';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import { useNavigate } from 'react-router-dom';
import './ProductList.css';


function ProductList() {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProducts(products.filter((p) => p._id !== id));
      } catch (err) {
        console.error('Delete failed', err);
      }
    }
  };

  return (
    <div className="product-list-container">
       <AdminSidebar />
      <h2>All Products</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price (₹)</th>
            <th>Category</th>
            <th>In Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td><img src={p.image} alt={p.name} className="product-img" /></td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.category}</td>
              <td>{p.countInStock}</td>
              <td>
                
                <button onClick={() => handleDelete(p._id)} className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;