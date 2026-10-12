import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiCheck, HiArrowRight, HiOutlineShoppingBag } from 'react-icons/hi2';
import api from '../../services/api';
import './OrderSuccess.css';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then((res) => setOrder(res.data.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="order-success-page" id="order-success-view">
        <div className="container-editorial order-success-loading">
          <div className="skeleton-line skeleton-title shimmer" />
          <div className="skeleton-line shimmer" />
          <div className="skeleton-line skeleton-short shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div className="order-success-page" id="order-success-view">
      <div className="container-editorial order-success-content">
        <div className="success-icon-circle">
          <HiCheck size={36} />
        </div>

        <span className="editorial-eyebrow">Order Confirmed</span>
        <h1 className="editorial-section-title success-title">
          THANK YOU FOR YOUR ORDER
        </h1>

        {order ? (
          <>
            <p className="editorial-body success-desc">
              Your order <strong>#{order.order_number}</strong> has been placed successfully.
              You will receive a confirmation shortly.
            </p>

            <div className="success-details-card">
              <div className="success-detail-row">
                <span className="detail-label">Order Number</span>
                <span className="detail-value">{order.order_number}</span>
              </div>
              <div className="success-detail-row">
                <span className="detail-label">Items</span>
                <span className="detail-value">{order.items?.length || 0} products</span>
              </div>
              <div className="success-detail-row">
                <span className="detail-label">Total</span>
                <span className="detail-value detail-total">৳{parseFloat(order.total).toFixed(2)}</span>
              </div>
              <div className="success-detail-row">
                <span className="detail-label">Payment</span>
                <span className="detail-value">Cash on Delivery</span>
              </div>
              <div className="success-detail-row">
                <span className="detail-label">Shipping To</span>
                <span className="detail-value">
                  {order.shipping_name}, {order.shipping_city}
                </span>
              </div>
            </div>
          </>
        ) : (
          <p className="editorial-body success-desc">
            Your order has been placed. Check your account for details.
          </p>
        )}

        <div className="success-actions">
          <Link to="/account/orders" className="btn-editorial">
            <HiOutlineShoppingBag size={16} />
            <span>View My Orders</span>
          </Link>
          <Link to="/shop" className="btn-editorial-outline">
            <span>Continue Shopping</span>
            <HiArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
