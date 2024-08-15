import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import "./EditProduct.css";

const EditProduct = () => {
  const product_category_url =
    process.env.REACT_APP_BACKEND_API_URL_PRODUCT_CATEGORY_URL;
  const product_url = process.env.REACT_APP_BACKEND_API_URL_PRODUCT_URL;
  const { id } = useParams();

  const [productCategories, setProductCategories] = useState([]);
  const [product, setProduct] = useState({
    id: "",
    productName: "",
    productDescription: "",
    imageUrl: "",
    productPrice: "",
    productStock: "",
    productCategory: "",
  });

  const [image, setImage] = useState(null);

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
        setProductCategories(responseData.data);
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.error("Error fetching product categories:", error);
      toast.error("Error fetching product categories");
    }
  };

  const fetchProduct = async (productId) => {
    try {
      const response = await fetch(
        `${product_url}/getProductById?id=${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = await response.json();
      if (responseData.success) {
        const productData = responseData.data[0];
        setProduct({
          id: productData.id,
          productName: productData.productName,
          productDescription: productData.productDescription,
          imageUrl: productData.imageUrl,
          productPrice: productData.productPrice,
          productStock: productData.productStock,
          productCategory: productData.productCategory.id,
        });

        // Download the image and convert it to a file
        const imageUrl = productData.imageUrl;
        if (imageUrl) {
          const imageResponse = await fetch(imageUrl);
          const imageBlob = await imageResponse.blob();
          const imageFile = new File([imageBlob], "product_image.jpg", {
            type: imageBlob.type,
          });
          setImage(imageFile);
        }
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Error fetching product");
    }
  };

  useEffect(() => {
    fetchProduct(id);
    fetchCategories();
  }, [id]);

  const onInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setProduct((product) => ({ ...product, [name]: value }));
  };

  const onImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "image/jpeg") {
      setImage(file);
    } else {
      toast.error("Please select a .jpg file.");
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
          productName: product.productName,
          productDescription: product.productDescription,
          fileBase64Encoded: Array.from(new Uint8Array(fileData)),
          productPrice: product.productPrice,
          productCategoryId: product.productCategory,
          productStock: product.productStock,
        };

        try {
          const response = await fetch(
            `${product_url}/updateProduct?id=${id}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestData),
            }
          );

          const responseData = await response.json();

          if (responseData.success) {
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
    <div className="editItems">
      <form className="form-container" onSubmit={onSubmitHandler}>
        <div className="image-upload-container">
          <p className="upload-title">Upload Image</p>
          <label htmlFor="image" className="image-upload-label">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="Product Preview"
              className="preview-image"
            />
          </label>
          <input onChange={onImageChange} type="file" id="image" hidden />
        </div>
        <div className="input-group">
          <p className="input-label">Product Name</p>
          <input
            onChange={onInputChange}
            value={product.productName}
            type="text"
            name="productName"
            required
            placeholder="Type Product Name"
            className="input-field"
          />
        </div>
        <div className="input-group">
          <p className="input-label">Product Description</p>
          <textarea
            onChange={onInputChange}
            value={product.productDescription}
            name="productDescription"
            rows="6"
            placeholder="Write Description of the product here"
            className="input-field"
          />
        </div>
        <div className="category-price-container">
          <div className="category-select">
            <p className="input-label">Product Category</p>
            <select
              onChange={onInputChange}
              name="productCategory"
              value={product.productCategory}
              className="select-field"
            >
              {productCategories.map((category, index) => (
                <option key={index} value={category.id}>
                  {category.productCategory}
                </option>
              ))}
            </select>
          </div>
          <div className="price-input">
            <p className="input-label">Product Price</p>
            <input
              onChange={onInputChange}
              value={product.productPrice}
              type="number"
              name="productPrice"
              required
              placeholder="Rs 200"
              className="input-field"
            />
          </div>
          <div className="stock-input">
            <p className="input-label">Product Stock</p>
            <input
              onChange={onInputChange}
              value={product.productStock}
              type="number"
              name="productStock"
              required
              placeholder="100"
              className="input-field"
            />
          </div>
        </div>
        <button type="submit" className="submit-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
// _____  _  __
// / ____|| |/ /
// | (___  | ' /
//  \___ \ |  <
//  ____) || . \
// |_____/ |_|\_\

// 👨‍💻 web site Created by Amir Sohail Sheikh
