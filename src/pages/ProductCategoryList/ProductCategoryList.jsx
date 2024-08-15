import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./ProductCategoryList.css";

const ProductCategory = () => {
  const product_category_url =
    process.env.REACT_APP_BACKEND_API_URL_PRODUCT_CATEGORY_URL;

  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchList = async () => {
    try {
      const response = await fetch(
        `${product_category_url}/getAllProductCategory`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setList(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching product categories:", error);
      toast.error("Error fetching product categories");
    }
  };

  const removeProductCategory = async (categoryId) => {
    try {
      const response = await fetch(
        `${product_category_url}/deleteProductCategory/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        fetchList();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error deleting product categories:", error);
      toast.error("Error deleting product categories");
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
    item.productCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <div className="header">
        <input
          className="search-bar"
          type="text"
          placeholder="Search product categories..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <Link to="/productCategory/addNewProductCategory">
          <button className="add-category-btn">Add Product Category</button>
        </Link>
      </div>
      <div className="list-table">
        <div className="list-table-header">
          <b>Image</b>
          <b>Product Category</b>
          <b></b>
          <b></b>
          <b></b>
        </div>
        {filteredList.length === 0 ? (
          <div className="no-categories-msg">No product categories found.</div>
        ) : (
          filteredList.map((item, index) => (
            <div key={index} className="list-table-row">
              <img
                className="category-image"
                src={item.imageUrl}
                alt={item.productCategory}
              />
              <p className="category-name">{item.productCategory}</p>

              <Link to={`/productCategory/editProductCategory/${item.id}`}>
                <button className="edit-btn">Edit</button>
              </Link>
              <button
                onClick={() => removeProductCategory(item.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductCategory;
// _____  _  __
// / ____|| |/ /
// | (___  | ' /
//  \___ \ |  <
//  ____) || . \
// |_____/ |_|\_\

// 👨‍💻 web site Created by Amir Sohail Sheikh
