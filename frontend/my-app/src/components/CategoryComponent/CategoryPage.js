import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CategoryPage.css';

function CategoryPages() {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!categoryName) return;
  
    const decodedCategory = decodeURIComponent(categoryName);
  
    axios
      .get(`http://localhost:8080/api/products?category=${decodedCategory}`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Error fetching products:', err));
  }, [categoryName]);
  
  return (
    <div className="category-page">
      <h2>{decodeURIComponent(categoryName)} Collection</h2>
      <div className="category-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="product-card"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <img src={product.image} alt={product.name} />
              <h4>{product.name}</h4>
              <p>₹{product.price}</p>
            </div>
          ))
        ) : (
          <p className="no-products">No products found in this category.</p>
        )}
      </div>
    </div>
  );
}

export default CategoryPages;