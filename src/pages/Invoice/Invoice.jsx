import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";
import "./Invoice.css"; // Ensure you have a CSS file for styling

const InvoicePage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [billingStatus, setBillingStatus] = useState(null); // New state for billing status
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders by status
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/orders/getOrdersByStatus?status=Accepted`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        const orders = data.data || [];

        // Find the specific order by ID
        const foundOrder = orders.find(
          (order) => order.orderId === parseInt(orderId, 10)
        );
        setOrder(foundOrder || {});
      } catch (error) {
        setError("Failed to fetch order details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [orderId]);

  // Fetch billing status by order ID
  useEffect(() => {
    const fetchBillingStatus = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/orders/${orderId}/billingStatus`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch billing status");
        }

        const data = await response.json();
        // console.log("Billing status:", data);

        setBillingStatus(data.status || "Unknown"); // Store the billing status
      } catch (error) {
        setError("Failed to fetch billing status");
        console.error(error);
      }
    };

    if (orderId) {
      fetchBillingStatus();
    }
  }, [orderId]);

  const handleGeneratePDF = () => {
    const element = document.getElementById("invoice");
    const options = {
      filename: `invoice-${orderId}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().from(element).set(options).save();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  if (!order) return <div>No order found</div>;

  return (
    <div className="invoice-container">
      <div id="invoice" className="invoice">
        <h1>Invoice</h1>
        <h2>Order ID: {order.orderId}</h2>
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
        {/* Display the fetched billing status */}
        <p>
          <strong>Payment Status:</strong> {billingStatus}
        </p>

        {/* Order Items */}
        <div className="order-items">
          <h4>Order Items:</h4>
          {order.orderItems && order.orderItems.length > 0 ? (
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
                    <td>{(item.quantity * item.unitPrice).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No items in this order</p>
          )}
        </div>
      </div>
      <button onClick={handleGeneratePDF} className="generate-pdf-button">
        Download invoice
      </button>
    </div>
  );
};

export default InvoicePage;
// // _____  _  __
// // / ____|| |/ /
// // | (___  | ' /
// //  \___ \ |  <
// //  ____) || . \
// // |_____/ |_|\_\

// // 👨‍💻 web site Created by Amir Sohail Sheikh
