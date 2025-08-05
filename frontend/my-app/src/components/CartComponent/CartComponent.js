import './CartComponent.css';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const getTotal = () =>
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleImageClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleBuyNow = () => {
    if (user) {
      navigate('/checkout');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item, index) => (
          <div key={`${item._id}-${item.size}-${index}`} className="cart-item">
            <img
              src={item.image}
              alt={item.name}
              onClick={() => handleImageClick(item._id)}
              style={{ cursor: 'pointer' }}
            />
            <div className="cart-details">
              <h4>{item.name}</h4>
              <p>Size: <strong>{item.size}</strong></p>
              <p>₹{item.price}</p>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item._id, item.size, parseInt(e.target.value))
                }
              />
              <button onClick={() => removeFromCart(item._id, item.size)}>Remove</button>
            </div>
          </div>
        ))
      )}

      {cartItems.length > 0 && (
        <div className="cart-total">
          <h3>Total: ₹{getTotal()}</h3>
          <button className="buy-now-btn" onClick={handleBuyNow}>BUY NOW</button>
        </div>
      )}
    </div>
  );
}

export default Cart;