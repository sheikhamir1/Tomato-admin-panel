// import React, { useEffect, useState } from 'react';
// import './AddProducts.css';
// import { assets } from '../../assets/assets';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const AddProducts = () => {

//     const product_url = process.env.REACT_APP_BACKEND_API_URL_PRODUCT_URL;
//     const product_category_url = process.env.REACT_APP_BACKEND_API_URL_PRODUCT_CATEGORY_URL;
//     const token = process.env.REACT_APP_TOKEN;

//   const [image, setImage] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [data,setData] = useState({
//     name: '',
//     price: '',
//     description: '',
//     category: '',
//     stock: ''
//   });

//   const onChangeHandler =(event) => {
//      const name=event.target.name;
//      const value=event.target.value;
//      setData(data=>({...data, [name]:value}));
//   }

//   const onImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file && file.type === 'image/jpeg') { // Check if the selected file is a JPEG image
//       setImage(file);
//     } else {
//       toast.error('Please select a .jpg file.');
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     debugger
//     try {
//       const response = await axios.get(`${product_category_url}/getAllProductCategory`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//       });
//       debugger
//       if (response.data.success) {
//         setCategories(response.data.data);
//                     if (response.data.data.length > 0) {
//                         setData(data => ({ ...data, category: response.data.data[0].id }));
//                     }
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.error('Error fetching product categories:', error);
//       toast.error('Error fetching product categories');
//     }
//   };

//   const onSubmitHandler = async (event) => {
//     debugger
//     event.preventDefault();
//     if (!image) {
//         toast.error('Please select an image file.');
//         return;
//       }
//       try {
//         const reader = new FileReader();
//         reader.onload = async (event) => {
//           const fileData = event.target.result;

//           const requestData = {
//             productName: data.name,
//             productDescription: data.description,
//             fileBase64Encoded: Array.from(new Uint8Array(fileData)),
//             productPrice: data.price,
//             productCategoryId: data.category,
//             productStock: data.stock

//           };

//           try {
//             const response = await axios.post(`${product_url}/addNewProduct`, requestData, {
//               headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//               },
//             });

//             if (response.data.success) {
//               setData({
//               name: '',
//               price: '',
//               description: '',
//               category: '',
//               stock: ''
//                 });
//               setImage(null);
//               toast.success(response.data.message);
//             } else {
//               toast.error(response.data.message);
//             }
//           } catch (error) {
//             console.error('Error uploading file:', error);
//             toast.error('Failed to upload the product.');
//           }
//         };

//         reader.readAsArrayBuffer(image);
//       } catch (error) {
//         console.error('Error reading file:', error);
//         toast.error('Failed to read the file.');
//       }
// }

//   return (
//     <div className='addItems'>
//         <form className='flex-col' onSubmit={onSubmitHandler}>
//             <div className="add-img-upload flex-col">
//                 <p>Upload Image</p>
//                 <label htmlFor="image">
//                     <img src={image?URL.createObjectURL(image):assets.upload_area} alt="" />
//                 </label>
//                 <input onChange={onImageChange} type="file" id="image" hidden required />
//             </div>
//             <div className="add-product-name flex-col">
//                 <p>Product Name</p>
//                 <input onChange={onChangeHandler} value={data.name} type="text" name="name" required placeholder='Type Product Name' />
//             </div>
//             <div className="add-product-description flex-col">
//                 <p>Product Description</p>
//                 <textarea onChange={onChangeHandler} value={data.description} name="description" rows='6' placeholder='Write Description of the product here' />
//             </div>
//             <div className="add-category-price">
//                 <div className="add-category flex-col">
//                     <p>Product Category</p>
//                     <select onChange={onChangeHandler} name="category" value={data.category}>
//                             {categories.map((category, index) => (
//                                 <option key={index} value={category.id}>{category.productCategory}</option>
//                             ))}
//                     </select>
//                 </div>
//                 <div className="add-price flex-col">
//                     <p>Product price</p>
//                     <input onChange={onChangeHandler} value={data.price} type="number" name="price" required placeholder='Rs 200' />
//                 </div>
//                 <div className="add-stock flex-col">
//                     <p>Product stock</p>
//                     <input onChange={onChangeHandler} value={data.stock} type="number" name="stock" required placeholder='100' />
//                 </div>
//             </div>
//             <button type='submit' className="add-btn">Add Product</button>
//         </form>
//     </div>
//   )

// }

// export default AddProducts

import React, { useEffect, useState } from "react";
import "./AddProducts.css";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";

const AddProducts = () => {
  const product_url = process.env.REACT_APP_BACKEND_API_URL_PRODUCT_URL;
  const product_category_url =
    process.env.REACT_APP_BACKEND_API_URL_PRODUCT_CATEGORY_URL;

  const [image, setImage] = useState(false);
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "image/jpeg") {
      setImage(file);
    } else {
      toast.error("Please select a .jpg file.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${product_category_url}/getAllProductCategory`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = await response.json();

      if (responseData.success) {
        setCategories(responseData.data);
        if (responseData.data.length > 0) {
          setData((data) => ({ ...data, category: responseData.data[0].id }));
        }
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.error("Error fetching product categories:", error);
      toast.error("Error fetching product categories");
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!image) {
      toast.error("Please select an image file.");
      return;
    }
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileData = event.target.result;
        const requestData = {
          productName: data.name,
          productDescription: data.description,
          fileBase64Encoded: Array.from(new Uint8Array(fileData)),
          productPrice: data.price,
          productCategoryId: data.category,
          productStock: data.stock,
        };

        try {
          const response = await fetch(`${product_url}/addNewProduct`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          });

          const responseData = await response.json();

          if (responseData.success) {
            setData({
              name: "",
              price: "",
              description: "",
              category: "",
              stock: "",
            });
            setImage(null);
            toast.success(responseData.message);
          } else {
            toast.error(responseData.message);
          }
        } catch (error) {
          console.error("Error uploading file:", error);
          toast.error("Failed to upload the product.");
        }
      };

      reader.readAsArrayBuffer(image);
    } catch (error) {
      console.error("Error reading file:", error);
      toast.error("Failed to read the file.");
    }
  };

  return (
    <div className="setup3">
      <div className="add-products-container">
        <form className="add-products-form" onSubmit={onSubmitHandler}>
          <div className="add-products-image-upload">
            <p>Upload Image</p>
            <label htmlFor="image">
              <img
                src={image ? URL.createObjectURL(image) : assets.upload_area}
                alt="Upload Area"
              />
            </label>
            <input
              onChange={onImageChange}
              type="file"
              id="image"
              hidden
              required
            />
          </div>
          <div className="add-products-field">
            <p>Product Name</p>
            <input
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              name="name"
              required
              placeholder="Type Product Name"
            />
          </div>
          <div className="add-products-field">
            <p>Product Description</p>
            <textarea
              onChange={onChangeHandler}
              value={data.description}
              name="description"
              rows="6"
              placeholder="Write Description of the product here"
            />
          </div>
          <div className="add-products-category-price-stock">
            <div className="add-products-field">
              <p>Product Category</p>
              <select
                onChange={onChangeHandler}
                name="category"
                value={data.category}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category.id}>
                    {category.productCategory}
                  </option>
                ))}
              </select>
            </div>
            <div className="add-products-field">
              <p>Product Price</p>
              <input
                onChange={onChangeHandler}
                value={data.price}
                type="number"
                name="price"
                required
                placeholder="Rs 200"
              />
            </div>
            <div className="add-products-field">
              <p>Product Stock</p>
              <input
                onChange={onChangeHandler}
                value={data.stock}
                type="number"
                name="stock"
                required
                placeholder="100"
              />
            </div>
          </div>
          <button type="submit" className="add-products-btn">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProducts;
