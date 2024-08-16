import React, { useState } from "react";
import { toast } from "react-toastify";
// Import your CSS and assets if needed
import "./AddNewProductCategory.css";
import { assets } from "../../assets/assets";

const AddNewProductCategory = () => {
  const product_category_url =
    process.env.REACT_APP_BACKEND_API_URL_PRODUCT_CATEGORY_URL;

  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "image/jpeg") {
      // Check if the selected file is a JPEG image
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
          productCategory: data.name,
          productCategoryDescription: data.description,
          fileBase64Encoded: Array.from(new Uint8Array(fileData)),
        };

        try {
          const response = await fetch(
            `${product_category_url}/addNewProductCategory`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestData),
            }
          );

          const responseData = await response.json();
          // console.log("Response:", responseData);

          if (responseData.success) {
            setData({ name: "", description: "" });
            setImage(null);
            toast.success(responseData.message);
          } else {
            toast.error(responseData.message);
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
    <div className="setup">
      <div className="addProductCategory">
        <form className="form-container" onSubmit={onSubmitHandler}>
          <div className="image-upload-container">
            <label htmlFor="image" className="image-upload-label">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Selected"
                  className="image-preview"
                />
              ) : (
                <div className="image-placeholder">Upload Image</div>
              )}
            </label>
            <input
              onChange={onImageChange}
              type="file"
              id="image"
              className="image-upload-input"
              hidden
            />
          </div>
          <div className="input-group">
            <label htmlFor="name" className="input-label">
              Product Category Name
            </label>
            <input
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              id="name"
              name="name"
              required
              placeholder="Type Product Category Name"
              className="text-input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="description" className="input-label">
              Product Category Description
            </label>
            <textarea
              onChange={onChangeHandler}
              value={data.description}
              id="description"
              name="description"
              rows="6"
              placeholder="Write Description of the product Category here"
              className="textarea-input"
            />
          </div>
          <button type="submit" className="submit-button">
            Add Product Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewProductCategory;
// _____  _  __
// / ____|| |/ /
// | (___  | ' /
//  \___ \ |  <
//  ____) || . \
// |_____/ |_|\_\

// 👨‍💻 web site Created by Amir Sohail Sheikh
