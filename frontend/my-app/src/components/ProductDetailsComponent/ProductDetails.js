import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactStars from 'react-rating-stars-component';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './ProductDetails.css';
import '../HeaderComponent/Header.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [suggested, setSuggested] = useState([]);

  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8080/api/products/${id}`)
        .then(res => setProduct(res.data))
        .catch(err => console.error('Error fetching product:', err));

      axios.get(`http://localhost:8080/api/reviews/${id}`)
        .then(res => setReviews(res.data))
        .catch(err => console.error('Error fetching reviews:', err));

      axios.get('http://localhost:8080/api/products')
        .then(res => {
          const filtered = res.data.filter(p => p._id !== id);
          const randomSuggestions = filtered.sort(() => 0.5 - Math.random()).slice(0, 4);
          setSuggested(randomSuggestions);
        })
        .catch(err => console.error('Error fetching suggested products:', err));
    }
  }, [id]);

  const stockStatus = product?.countInStock >= 10
    ? 'In stock'
    : product?.countInStock > 0
    ? 'Low stock'
    : 'Out of stock';

  const handleAddToCart = () => {
    if (!size) {
      alert('Please select a size.');
      return;
    }
    addToCart(product, size, quantity);
    alert('Added to cart!');
  };

  const handleBuyNow = () => {
    if (!size) {
      alert('Please select a size before buying.');
      return;
    }
    addToCart(product, size, quantity);

    if (user) {
      navigate('/checkout');
    } else {
      navigate('/login');
    }
  };

  const submitReview = async () => {
    if (!user) {
      alert('Please login to write a review');
      return;
    }

    if (!rating || !comment.trim()) {
      alert('Please provide a rating and comment');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:8080/api/reviews',
        {
          productId: id,
          rating,
          description: comment
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setReviews([...reviews, res.data]);
      setRating(0);
      setComment('');
      alert('Review submitted!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting review');
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <main className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-detail-left">
          <img
            src={product.image}
            alt={product.name}
            className="product-detail-image"
          />
        </div>

        <div className="product-detail-right">
          <h3 className="brand-name">VIBE THREAD CLOTHING</h3>
          <h2 className="product-title">{product.name}</h2>
          <p className="product-price">₹{product.price.toLocaleString()}</p>

          <div className="product-size">
            <span>Size:</span>
            {['Small', 'Medium', 'Large', 'Extra-Large'].map((s) => (
              <button
                key={s}
                className={`size-btn ${size === s ? 'selected' : ''}`}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="quantity-selector">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>

          <div className="product-buttons">
            <button className="add-to-cart-btn" onClick={handleAddToCart}>ADD TO CART</button>
            <button className="buy-now-btn" onClick={handleBuyNow}>BUY IT NOW</button>
          </div>

          <ul className="product-features">
            {product.description?.split('\n').map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>

          <p className="product-note">
            Note: Artisan stitched and screen printed, crafted by human hands :)
          </p>

          <p className="stock-status">{stockStatus}</p>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="review-section">
        <h3>Customer Reviews</h3>
        {reviews.length === 0 && <p>No reviews yet.</p>}

        {reviews.map((r, index) => (
          <div key={index} className="review-box">
            <strong>{r.user?.name || 'Anonymous'}</strong>
            <ReactStars value={r.rating} edit={false} size={20} isHalf={true} activeColor="#ffd700" />
            <p style={{ display: 'flex' }}>{r.description}</p>
          </div>
        ))}

        <div className="review-form">
          <h4>Write a Review</h4>
          <ReactStars
            count={5}
            value={rating}
            onChange={(newRating) => setRating(newRating)}
            size={24}
            activeColor="#ffd700"
          />
          <textarea
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
          />
          <button onClick={submitReview}>Submit Review</button>
        </div>
      </div>

      {/* You May Also Like */}
      <div className="suggested-products">
        <h3>You may also like</h3>
        <div className="suggested-grid">
          {suggested.map((item) => (
            <div key={item._id} className="suggested-card" onClick={() => navigate(`/product/${item._id}`)}>
              <img src={item.image} alt={item.name} />
              <h4>{item.name}</h4>
              <p>₹{item.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default ProductDetail;
