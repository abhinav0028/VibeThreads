import { useEffect, useState } from 'react';
import axios from 'axios';
import './NewArrival.css';

function NewArrival() {
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/products?sort=newest&limit=20')
      .then((res) => setNewArrivals(res.data))
      .catch((err) => console.error('Failed to fetch new arrivals:', err));
  }, []);

  return (
    <div className="new-arrivals">
      <h2>New Arrivals</h2>
      <div className="product-grid">
        {newArrivals.map(product => (
          <div 
            key={product._id}
            className="product-card-2"
            onClick={() => window.location.href = `/product/${product._id}`}
          >
            <div className="product-image-container-2">
              <img src={product.image} alt={product.name} className='product-images'/>
            </div>
            <h4>{product.name}</h4>
            <p>₹{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewArrival;