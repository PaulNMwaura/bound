"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const DEFAULT_IMAGE = "https://res.cloudinary.com/djreop8la/image/upload/v1744851332/default-avatar_pc0ltx.jpg";

function capitalizeInputMask (string) {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function validatePassword (string) {
  const disallowed = ["\"", "`", "\\", "/", "<", ">", "&", " ", ";", "\n", "\r"];
  return disallowed.filter(char => string.includes(char));
}


export default function RegisterForm() {
  const [imagePreview, setImagePreview] = useState(DEFAULT_IMAGE);
  const [formData, setFormData] = useState({
    profilePicture: DEFAULT_IMAGE,
    username: "",
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [cropData, setCropData] = useState(null);
  const [rawImageFile, setRawImageFile] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const router = useRouter();
  const cropperRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let maskedValue = "";
    if(name == "firstname" || name == "lastname")
      maskedValue = capitalizeInputMask(value);
    else
      maskedValue = value;
    setFormData((prev) => ({ ...prev, [name]: maskedValue }));
  };

  const handleImageUpload = (e) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setRawImageFile(file);
    }
  };

  const getCroppedImage = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      const canvas = cropperRef.current.cropper.getCroppedCanvas();
      const croppedImage = canvas.toDataURL("image/jpeg");
      setCropData(croppedImage);
      setImagePreview(croppedImage);
      setFormData((prev) => ({
        ...prev,
        profilePicture: croppedImage, // Set this for submission
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const {username, firstname, lastname, phone, email, password, profilePicture, acceptedTerms } = formData;
    
    if (!username || !firstname || !lastname || !phone || !email || !password) {
      setError("All fields are necessary.");
      return;
    }

    let invalidChar = validatePassword(password);
    if(invalidChar.length > 0){
      setError(`Invalid password. Cannot contain "${invalidChar.join(", ")}".`);
      setFormData(prev => ({...prev, password: ""}));
      return;
    }
    try {
      // Check if user exists
      const resUserExists = await fetch("api/validation/userExists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username }),  // Send both email and username
      });
  
      const data = await resUserExists.json();

      if (data.user) {
        if (data.user.email === email) {
          setError("Email already exists.");
        } else if (data.user.username === username) {
          setError("Username already exists.");
        }
        return;
      }
      
      let finalImageURL = profilePicture;
  
      // If the image is not the default and not already uploaded, upload to Cloudinary
      if (profilePicture !== DEFAULT_IMAGE && profilePicture.startsWith("data:image")) {
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append("file", profilePicture);
        cloudinaryFormData.append("upload_preset", "ml_default");
  
        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: "POST",
          body: cloudinaryFormData,
        });
  
        const uploadData = await uploadRes.json();
        finalImageURL = uploadData.secure_url;
      }
  
      // Register user
      const res = await fetch("api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          firstname,
          lastname,
          phone,
          email,
          password,
          profilePicture: finalImageURL,
          acceptedTerms,
        }),
      });
  
      if (res.ok) {
        e.target.reset();
        router.push("/verifyEmail");
      } else {
        console.log("User registration failed.");
      }
    } catch (error) {
      console.log("Error during registration:", error);
    }
  };  

  const handleReset = () => {
    setFormData({
      profilePicture: DEFAULT_IMAGE,
      username: "",
      firstname: "",
      lastname: "",
      phone: "",
      email: "",
      password: "",
      acceptedTerms: false,
    });
    setAcceptedTerms(false);
    setImagePreview(DEFAULT_IMAGE);
    setCropData(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white text-black dark:bg-black dark:text-white pt-6 pb-20">
      <div className="rounded-lg shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Create Account</h1>
        <form onSubmit={handleSubmit}>

          {/* Profile Picture */}
          <div className="flex flex-col justify-center items-center">
            <label className="block text-sm font-medium">
              Current Profile Picture:
              <div className="flex justify-center mt-2">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                  id="upload-input"
                />
                <label htmlFor="upload-input" className="btn btn-primary-alt cursor-pointer">
                  Upload New
                </label>
              </div>
            </label>

            {/* Show default or cropped image preview */}
            {!rawImageFile && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Default Preview"
                  className="w-40 h-40 object-cover rounded-full"
                />
              </div>
            )}

            {/* Show cropper ONLY if the user uploaded a new image */}
            {rawImageFile && !cropData && (
              <div className="mt-4 w-full">
                <Cropper
                  src={imagePreview}
                  style={{ height: 400, width: "100%" }}
                  initialAspectRatio={1}
                  aspectRatio={1}
                  guides={true}
                  viewMode={1}
                  ref={cropperRef}
                />
                <button
                  type="button"
                  onClick={getCroppedImage}
                  className="mt-2 btn btn-primary-alt"
                >
                  Save Crop
                </button>
              </div>
            )}

            {/* Show cropped result after saving */}
            {cropData && (
              <div className="mt-2">
                <img
                  src={cropData}
                  alt="Profile Preview"
                  className="w-40 h-40 object-cover rounded-full"
                />
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="mb-4 mt-4">
            <label className="block text-sm font-medium">Username</label>
            <input name="username" type="text" value={formData.username} className="w-full border rounded px-3 py-2 mt-1" onChange={handleChange} />
          </div>

          <div className="mb-4 mt-4">
            <label className="block text-sm font-medium">First Name</label>
            <input name="firstname" type="text" value={formData.firstname} className="w-full border rounded px-3 py-2 mt-1" onChange={handleChange} />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Last Name</label>
            <input name="lastname" type="text" value={formData.lastname} className="w-full border rounded px-3 py-2 mt-1" onChange={handleChange} />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Phone Number</label>
            <input name="phone" type="text" value={formData.phone} className="w-full border rounded px-3 py-2 mt-1" onChange={handleChange} />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Email</label>
            <input name="email" type="email" value={formData.email} className="w-full border rounded px-3 py-2 mt-1" onChange={handleChange} />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Password</label>
            <input name="password" type="password" value={formData.password} className="w-full border rounded px-3 py-2 mt-1" onChange={handleChange} />
          </div>

          <div className="flex items-start gap-2 mb-1">
            <input name="terms" type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(true)} className="mt-1"/>
            <label htmlFor="terms" className="text-sm">
              By checking, I agree to the{" "}
              <a
                href="/terms"
                target="_blank"
                className="text-blue-600 underline"
              >
                User Terms & Conditions
              </a>
              {" "}and affirm that I have reviewed the{" "}
              <a
                href="/privacy"
                target="_blank"
                className="text-blue-600 underline"
              >
                Privacy Policy
              </a>
            </label>
          </div>
          
          <button type="submit" className="btn-primary-alt px-4 py-2 rounded w-full disabled:opacity-50" disabled={!acceptedTerms}>
            Sign Up
          </button>

          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}

          <div className="flex justify-center items-center">
            <Link href="/login" className="text-sm lg:text-lg mt-3 font-bold">
              Already have an account? <span className="underline">Login</span>
            </Link>
          </div>
        </form>

        <div className="flex flex-row items-center justify-between">
          <button type="button" className="mt-4 text-sm dark:text-gray-300 dark:hover:text-gray-50 cursor-pointer" onClick={() => router.push("/")}>Cancel</button>
          <button type="button" className="mt-4 text-sm dark:text-gray-300 dark:hover:text-gray-50 cursor-pointer" onClick={handleReset}>Clear All</button>
        </div>
      </div>
    </div>
  );
}
