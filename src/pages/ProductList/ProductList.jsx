import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "./ProductList.css";

const ListItems = () => {
  const product_url = process.env.REACT_APP_BACKEND_API_URL_PRODUCT_URL;
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchList = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${product_url}/getAllProduct`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setList(data.data);
      } else {
        toast.error(data.message || "Failed to fetch products.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error fetching products");
    }
  };

  const removeProduct = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${product_url}/deleteProduct/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message);
        fetchList();
      } else {
        toast.error(data.message || "Failed to delete product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product");
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Filter the list based on the search term
  const filteredList = list.filter((item) =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="product-list-container">
      <div className="search-add-bar">
        <input
          className="search-input"
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <Link to="/product/addProduct">
          <button className="add-product-btn">Add Product</button>
        </Link>
      </div>
      {filteredList.length === 0 ? (
        <div className="no-products-found">
          <p>No products found.</p>
        </div>
      ) : (
        <div className="product-table">
          <div className="product-table-header">
            <div className="product-column">Image</div>
            <div className="product-column">Name</div>
            <div className="product-column">Price</div>
            <div className="product-column">Stock</div>
            <div className="product-column actions-column">Actions</div>
          </div>
          {filteredList.map((item, index) => (
            <div key={index} className="product-row">
              <div className="product-column">
                <img src={item.imageUrl} alt={item.productName} />
              </div>
              <div className="product-column">
                <p>{item.productName}</p>
              </div>
              <div className="product-column">
                <p>₹{item.productPrice}</p>
              </div>
              <div className="product-column">
                <p>{item.productStock}</p>
              </div>
              <div className="product-column actions-column">
                <Link to={`/product/editProduct/${item.id}`}>
                  <button className="edit-btn">Edit</button>
                </Link>
                <button
                  onClick={() => removeProduct(item.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListItems;
