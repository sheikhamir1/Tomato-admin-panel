import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Routes, Route } from "react-router-dom";
import AddProducts from "./pages/AddProducts/AddProducts";
import ListItems from "./pages/ProductList/ProductList";
import { Orders } from "./pages/Orders/Orders";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductCategory from "./pages/ProductCategoryList/ProductCategoryList";
import AddNewProduct from "./pages/AddNewProductCategory/AddNewProductCategory";
import EditProductCategory from "./pages/EditProductCategory/EditProductCategory";
import EditProduct from "./pages/EditProduct/EditProduct";
import Login from "./pages/Login/Login";
import InvoicePage from "./pages/Invoice/Invoice";

// _____  _  __
// / ____|| |/ /
// | (___  | ' /
//  \___ \ |  <
//  ____) || . \
// |_____/ |_|\_\

// 👨‍💻 web site Created by Amir Sohail Sheikh

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/productCategory" element={<ProductCategory />} />
          <Route
            path="/productCategory/addNewProductCategory"
            element={<AddNewProduct />}
          />
          <Route
            path="/productCategory/editProductCategory/:id"
            element={<EditProductCategory />}
          />
          <Route path="/product" element={<ListItems />} />
          <Route path="/product/addProduct" element={<AddProducts />} />
          <Route path="/product/editProduct/:id" element={<EditProduct />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/invoice/:orderId" element={<InvoicePage />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
