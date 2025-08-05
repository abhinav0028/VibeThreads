import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Order.css';
import { useAuth } from '../../context/AuthContext';

function MyOrders() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [cancelModal, setCancelModal] = useState({ open: false, orderId: '', reason: '' });
  const [customReason, setCustomReason] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/orders/myorders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to load orders:', err);
      }
    };

    if (user) fetchOrders();
  }, [user]);

  const handleCancelOrder = async () => {
    try {
      const finalReason = cancelModal.reason === 'Other' ? customReason : cancelModal.reason;
      await axios.put(
        `http://localhost:8080/api/orders/cancel/${cancelModal.orderId}`,
        { reason: finalReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Order cancelled');
      setCancelModal({ open: false, orderId: '', reason: '' });
      setCustomReason('');
      // Refresh orders
      const res = await axios.get('http://localhost:8080/api/orders/myorders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      alert('Failed to cancel order');
      console.error(err);
    }
  };

  const pendingOrders = orders.filter(order => !order.isDelivered && !order.isCancelled);
  const deliveredOrders = orders.filter(order => order.isDelivered);
  const displayedOrders = activeTab === 'pending' ? pendingOrders : deliveredOrders;

  return (
    <div className="my-orders">
      <h2>My Orders</h2>

      {/* Tabs */}
      <div className="tab-buttons">
        <button className={activeTab === 'pending' ? 'active' : ''} onClick={() => setActiveTab('pending')}>Current Orders</button>
        <button className={activeTab === 'delivered' ? 'active' : ''} onClick={() => setActiveTab('delivered')}>Past Orders</button>
      </div>

      {displayedOrders.length === 0 ? (
        <p>No {activeTab === 'pending' ? 'current' : 'past'} orders found.</p>
      ) : (
        <div className="orders-list">
          {displayedOrders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header"><strong>Order ID:</strong> {order._id}</div>
              <div><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</div>
              <div><strong>Status:</strong> {order.isDelivered ? 'Delivered' : order.isCancelled ? 'Cancelled' : 'Pending'}</div>
              <div><strong>Payment:</strong> {order.isPaid ? 'Paid' : 'Not Paid'}</div>
              <div><strong>Total:</strong> ₹{order.totalAmount}</div>

              <details className="order-details">
                <summary>View Products</summary>
                {order.products.map((item, index) => (
                  <div key={index} className="product-detail">
                    <img src={item.product?.image} alt={item.product?.name} />
                    <div>
                      <p><strong>{item.product?.name}</strong></p>
                      <p>Size: {item.size} | Qty: {item.quantity}</p>
                      <p>Price: ₹{item.product?.price}</p>
                    </div>
                  </div>
                ))}
              </details>

              <div className="shipping-info">
                <h4>Shipping Info</h4>
                <p>{order.address?.fullName}</p>
                <p>{order.address?.street}, {order.address?.city}</p>
                <p>{order.address?.state}, {order.address?.postalCode}</p>
              </div>

              {!order.isDelivered && !order.isCancelled && (
                <button className="cancel-btn" onClick={() =>
                  setCancelModal({ open: true, orderId: order._id, reason: '' })
                }>Cancel Order</button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModal.open && (
        <div className="cancel-modal">
          <div className="cancel-box">
            <h3>Why are you cancelling?</h3>
            <select value={cancelModal.reason} onChange={(e) =>
              setCancelModal({ ...cancelModal, reason: e.target.value })
            }>
              <option value="">-- Select Reason --</option>
              <option value="Changed my mind">Changed my mind</option>
              <option value="Ordered by mistake">Ordered by mistake</option>
              <option value="Found cheaper elsewhere">Found cheaper elsewhere</option>
              <option value="Other">Other</option>
            </select>

            {cancelModal.reason === 'Other' && (
              <input
                type="text"
                placeholder="Write your reason..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            )}

            <div className="modal-actions">
              <button onClick={handleCancelOrder}>Submit</button>
              <button onClick={() => setCancelModal({ open: false, orderId: '', reason: '' })}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyOrders;
