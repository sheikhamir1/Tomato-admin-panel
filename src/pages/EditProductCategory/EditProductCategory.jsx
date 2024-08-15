import React, { useState, useEffect } from "react";
import "./EditProductCategory.css";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const EditProductCategory = () => {
  const product_category_url =
    process.env.REACT_APP_BACKEND_API_URL_PRODUCT_CATEGORY_URL;
  const { id } = useParams();
  const [productcat, setProductCat] = useState({
    id: "",
    productCategory: "",
    productCategoryDescription: "",
    imageUrl: "",
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchProductCategory(id);
  }, [id]);

  const fetchProductCategory = async (categoryId) => {
    try {
      const response = await fetch(
        `${product_category_url}/getProductCategoryById?id=${categoryId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const productCategory = data.data[0]; // Assuming only one category is retrieved
        setProductCat(productCategory);
        // Download the image and convert it to a file
        const imageUrl = productCategory.imageUrl;
        if (imageUrl) {
          const imageResponse = await fetch(imageUrl);
          const imageBlob = await imageResponse.blob();
          const imageFile = new File(
            [imageBlob],
            "product_category_image.jpg",
            { type: imageBlob.type }
          );
          setImage(imageFile);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching product categories:", error);
      toast.error("Error fetching product categories");
    }
  };

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setProductCat((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
          productCategory: productcat.productCategory,
          productCategoryDescription: productcat.productCategoryDescription,
          fileBase64Encoded: Array.from(new Uint8Array(fileData)),
        };

        try {
          const response = await fetch(
            `${product_category_url}/updateProductCategory?id=${id}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestData),
            }
          );

          const result = await response.json();

          if (result.success) {
            toast.success(result.message);
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          console.error("Error uploading file:", error);
          toast.error("Failed to upload the product category.");
        }
      };

      reader.readAsArrayBuffer(image);
    } catch (error) {
      console.error("Error reading file:", error);
      toast.error("Failed to read the file.");
    }
  };

  return (
    <div className="setup2">
      <div className="editProductCategory">
        <form className="edit-form" onSubmit={onSubmitHandler}>
          <div className="form-title">
            <h2>Edit Product Category</h2>
          </div>
          <div className="add-img-upload">
            <label htmlFor="image">
              <div className="img-preview">
                <img
                  src={image ? URL.createObjectURL(image) : productcat.imageUrl}
                  alt="Product Category"
                />
              </div>
              <div className="upload-btn1">Change Image</div>
            </label>
            <input onChange={onImageChange} type="file" id="image" hidden />
          </div>
          <div className="form-group">
            <label htmlFor="productCategory">Product Category Name</label>
            <input
              value={productcat.productCategory}
              type="text"
              name="productCategory"
              id="productCategory"
              onChange={onInputChange}
              placeholder="Enter the product category name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="productCategoryDescription">
              Product Category Description
            </label>
            <textarea
              value={productcat.productCategoryDescription}
              name="productCategoryDescription"
              id="productCategoryDescription"
              rows="6"
              onChange={onInputChange}
              placeholder="Enter a description for the product category"
            />
          </div>
          <button type="submit" className="edit-btn1">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProductCategory;
// _____  _  __
// / ____|| |/ /
// | (___  | ' /
//  \___ \ |  <
//  ____) || . \
// |_____/ |_|\_\

// 👨‍💻 web site Created by Amir Sohail Sheikh
