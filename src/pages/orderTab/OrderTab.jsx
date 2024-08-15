import React, { useEffect, useState } from "react";
import "./OrderTab.css";

const OrderTabs = () => {
  const [selectedTab, setSelectedTab] = useState("Pending");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [discountType, setDiscountType] = useState({});
  const [discountAmount, setDiscountAmount] = useState({});

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const fetchOrdersByStatus = async (status) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8080/api/orders/getOrdersByStatus?status=${status}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setOrders(data.data || []);
    } catch (error) {
      setError("Failed to fetch orders");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/orders/${orderId}/status?status=${newStatus}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      alert(`Order ${orderId} status updated to ${newStatus}`);

      // Refetch orders after status update
      fetchOrdersByStatus(selectedTab);
    } catch (error) {
      console.error("Error updating order status", error);
    }
  };

  const applyDiscount = async (orderId, amount, type) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/orders/${orderId}/discount`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount, type }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to apply discount");
      }

      // Refetch orders after applying discount
      fetchOrdersByStatus(selectedTab);
    } catch (error) {
      console.error("Error applying discount", error);
    }
  };

  const handleDiscountChange = (orderId, e) => {
    const { name, value } = e.target;
    if (name === "discountType") {
      setDiscountType((prev) => ({ ...prev, [orderId]: value }));
    } else if (name === "discountAmount") {
      setDiscountAmount((prev) => ({ ...prev, [orderId]: value }));
    }
  };

  useEffect(() => {
    fetchOrdersByStatus(selectedTab);
  }, [selectedTab]);

  return (
    <div className="order-container">
      <div className="tabs-container">
        <button
          className={selectedTab === "Pending" ? "tab selected" : "tab"}
          onClick={() => handleTabClick("Pending")}
        >
          Pending
        </button>
        <button
          className={selectedTab === "Accepted" ? "tab selected" : "tab"}
          onClick={() => handleTabClick("Accepted")}
        >
          Accepted
        </button>
        <button
          className={selectedTab === "Rejected" ? "tab selected" : "tab"}
          onClick={() => handleTabClick("Rejected")}
        >
          Rejected
        </button>
        <button
          className={selectedTab === "Delivered" ? "tab selected" : "tab"}
          onClick={() => handleTabClick("Delivered")}
        >
          Delivered
        </button>
      </div>

      <div className="tab-content">
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && orders.length === 0 && (
          <div>No orders found.</div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="order-list">
            {orders.map((order) => (
              <div key={order.orderId} className="order-card">
                <div className="order-header">
                  <h3>Order ID: {order.orderId}</h3>
                  <p>
                    Status:{" "}
                    <span className={`status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </p>
                </div>
                <p>
                  <strong>Customer:</strong> {order.customerName}
                </p>
                <p>
                  <strong>Mobile:</strong> {order.customerMobile}
                </p>
                <p>
                  <strong>Order Date:</strong>{" "}
                  {new Date(order.orderDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Discount:</strong> ₹{order.discount || 0}
                </p>
                <p>
                  <strong>SubTotal Amount:</strong> ₹{order.subTotalAmount}
                </p>
                <p>
                  <strong>Total Amount:</strong> ₹{order.totalAmount}
                </p>

                {/* Order Items */}
                <div className="order-items">
                  <h4>Order Items:</h4>
                  {order.orderItems.length > 0 ? (
                    <table className="order-items-table">
                      <thead>
                        <tr>
                          <th>Product ID</th>
                          <th>Product Name</th>
                          <th>Quantity</th>
                          <th>Unit Price (₹)</th>
                          <th>Total Price (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.orderItems.map((item, index) => (
                          <tr key={index}>
                            <td>{item.productId}</td>
                            <td>{item.productName}</td>
                            <td>{item.quantity}</td>
                            <td>{item.unitPrice}</td>
                            <td>
                              {(item.quantity * item.unitPrice).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No items in this order</p>
                  )}
                </div>

                {/* Dropdown to Change Order Status */}
                <div className="change-status">
                  <label htmlFor={`status-${order.orderId}`}>
                    Change Status:
                  </label>
                  <select
                    id={`status-${order.orderId}`}
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.orderId, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                {/* Apply Discount Section (Visible only for Accepted orders) */}
                {order.status === "Accepted" && (
                  <div className="apply-discount">
                    <label htmlFor={`discount-type-${order.orderId}`}>
                      Discount Type:
                    </label>
                    <select
                      id={`discount-type-${order.orderId}`}
                      name="discountType"
                      value={discountType[order.orderId] || "PERCENTAGE"}
                      onChange={(e) => handleDiscountChange(order.orderId, e)}
                    >
                      <option value="PERCENTAGE">Percentage</option>
                      <option value="FIXED">Fixed Amount</option>
                    </select>

                    <label htmlFor={`discount-amount-${order.orderId}`}>
                      Amount:
                    </label>
                    <input
                      type="number"
                      id={`discount-amount-${order.orderId}`}
                      name="discountAmount"
                      min="0"
                      placeholder="Enter amount"
                      value={discountAmount[order.orderId] || ""}
                      onChange={(e) => handleDiscountChange(order.orderId, e)}
                    />

                    <button
                      onClick={() =>
                        applyDiscount(
                          order.orderId,
                          discountAmount[order.orderId],
                          discountType[order.orderId]
                        )
                      }
                    >
                      Apply Discount
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTabs;
// _____  _  __
// / ____|| |/ /
// | (___  | ' /
//  \___ \ |  <
//  ____) || . \
// |_____/ |_|\_\

// 👨‍💻 web site Created by Amir Sohail Sheikh
