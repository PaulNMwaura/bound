"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import cloudinary from "@/lib/cloudinary";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css'; 
import { signOut, useSession } from "next-auth/react";

const DEFAULT_IMAGE = "https://res.cloudinary.com/djreop8la/image/upload/v1744851332/default-avatar_pc0ltx.jpg";

// function capitalizeFirst(str) {
//   if (!str) return "";
//   return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
// }

function validatePassword (string) {
    const disallowed = ["\"", "`", "\\", "/", "<", ">", "&", " ", ";", "\n", "\r"];
    return disallowed.filter(char => string.includes(char));
}

export const EditProfile = ({isLister, thisLister}) => {
    const {data: session, status, update} = useSession();

    if(!session || status == "loading") return <div className="heads-up">Loading...</div>

    const [formData, setFormData] = useState({
        username: session.user.username || "",
        firstname: session.user.firstname || "",
        lastname: session.user.lastname || "",
        password: "",
        profilePicture: session.user.profilePicture || "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imagePreview, setImagePreview] = useState(session.user.profilePicture);
    const [rawImageFile, setRawImageFile] = useState(null);
    const [cropData, setCropData] = useState(null);
    const cropperRef = useRef(null);
    const fileInputRef = useRef(null);
    const router = useRouter();

    const handleFileSelect = (e) => {
        if (e.target.files) {
            const file = e.target.files[0];
            if(file) {
                const imageURL = URL.createObjectURL(file);
                setImagePreview(imageURL); // This shows up in Cropper
            }
            return;
        }
    };

    const handleImageUpload = (e) => {
        if (e.target.files) {
          const file = e.target.files[0];
          const imageUrl = URL.createObjectURL(file);
          setImagePreview(imageUrl);
          setRawImageFile(file);
        }
    };

    const handleImageRemove = () => {
        // Reset to default image
        setFormData((prevData) => ({
            ...prevData,
            profilePicture: DEFAULT_IMAGE,
        }));
        setImagePreview(DEFAULT_IMAGE); // Reset preview to default image
        setCropData(null);
        setRawImageFile(null);
        setError("");
        if (fileInputRef.current) fileInputRef.current.value = null;
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    async function checkIfLister(id) {
        const res = await fetch(`/api/listers/findByUserId?id=${id}`);
        
        if (res.status === 404) {
            return false; // not a lister
        }
    
        const data = await res.json();
        return data.lister ? data.lister : false; // if lister is found, return the lister data
    }


    const handleDeleteUser = async () => {
        // Get user's profile picture and ID
        const profilePicture = session.user.profilePicture;
        const userId = session.user.id;
    
        const isActiveLister = await checkIfLister(session.user.id); // Check if this user's lister's account still exists

        if(isLister && isActiveLister) {
            setError("Delete your lister's profile first.\nYou can do so in the \"Edit Lister Profile\" tab above"); 
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
        if (!confirmDelete) return;
        
        try {
            
            // If profile picture is not the default, extract publicId from the URL
            let publicId = null;
            if (profilePicture && profilePicture !== DEFAULT_IMAGE) {
                const regex = /\/v[0-9]+\/(.*)\.(jpg|jpeg|png)/;
                const match = profilePicture.match(regex);
                if (match) {
                    publicId = match[1]; // Extract publicId
                }
            }

    
            // Make the API call to delete the user
            const res = await fetch(`/api/deleteUser`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ publicId, userId }),
            });
    
            const response = await res.json();
            if (res.ok) {
                await signOut({redirect: false});
                alert(response.message || "Your account has been deleted successfully.");
                setLoading(true);
                router.push("/");
            } else {
                alert(response.message || "An error occurred while deleting your account.");
            }
        } catch (error) {
            console.error("Error during user deletion:", error);
            alert("Something went wrong. Please try again later.");
        }
    };
    

    const handleReset = ({newUsername, newFirstname, newLastname, newProfilePicture}) => {
        useSession();
        setFormData({
            username: newUsername || "",
            firstname: newFirstname || "",
            lastname: newLastname || "",
            password: "",
            profilePicture: newProfilePicture || "",
        });
        setImagePreview(newProfilePicture);
        setRawImageFile(null);
        setError("");
        if (fileInputRef.current) fileInputRef.current.value = null;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      const { username, firstname, lastname, password, profilePicture } =
        formData;

      let invalidChar = validatePassword(password);
      if (invalidChar.length > 0) {
        setError(
          `Invalid password. Cannot contain "${invalidChar.join(", ")}".`
        );
        setFormData((prev) => ({ ...prev, password: "" }));
        return;
      }
      try {
        let finalImageURL = profilePicture;

        // If the image is not the default and not already uploaded, upload to Cloudinary
        if (
          profilePicture !== DEFAULT_IMAGE &&
          profilePicture.startsWith("data:image")
        ) {
          const cloudinaryFormData = new FormData();
          cloudinaryFormData.append("file", profilePicture);
          cloudinaryFormData.append("upload_preset", "ml_default");

          const uploadRes = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: cloudinaryFormData,
            }
          );

          const uploadData = await uploadRes.json();
          finalImageURL = uploadData.secure_url;
        }

        //Update user
        const res = await fetch(`/api/update/${session.user.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            firstname,
            lastname,
            password,
            profilePicture: finalImageURL,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const sessionUpdate = await update({
            ...session,
            user: {
              ...session.user,
              username: data.user.username,
              firstname: data.user.firstname,
              lastname: data.user.lastname,
              profilePicture: data.user.profilePicture,
            },
          });

          if(isLister) {
            //Update associated lister
            const res = await fetch(`/api/listers/update`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                listerId: thisLister._id,
                username: data.user.username,
                firstname: data.user.firstname,
                lastname: data.user.lastname,
                profilePicture: data.user.profilePicture,
              }),
            });

            if(!res.ok)
              return;
          }


          if (sessionUpdate.ok) {
            handleReset({
              newUsername: data.user.username,
              newFirstname: data.user.firstname,
              newLastname: data.user.lastname,
              newProfilePicture: data.user.profilePicture,
            });
          }
          // router.refresh(); // refresh page
        } else {
          console.log("User update failed.");
        }
      } catch (error) {
        console.log("Error during update:", error);
      }
    }; 

    if(loading) return <div className="heads-up">Loading...</div>;

    return (
      <div className="p-4 text-sm md:tex-lg">
        <form className="flex flex-col items-center">

          {/* Profile Picture */}
          <div className="flex flex-col justify-center items-center">
            <label className="block text-sm font-medium text-center">
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
                <label htmlFor="upload-input" className="btn btn-primary cursor-pointer">
                    Upload New
                </label>
              </div>
            </label>
            {formData.profilePicture != DEFAULT_IMAGE && (
                <button type="button" className="mt-3 btn bg-red-500 text-white" onClick={handleImageRemove}>Remove</button>
            )}

            {/* Show default or cropped image preview */}
            {!rawImageFile && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Default profile picture preview"
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
                  className="mt-2 btn btn-primary"
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
          <div className="w-full mb-4 mt-4">
            <label className="block text-sm font-medium">Username</label>
            <input
              name="username"
              type="text"
              value={formData.username}
              className="w-full border rounded px-3 py-2 mt-1"
              onChange={handleChange}
            />
          </div>

          <div className="w-full mb-4">
            <label className="block text-sm font-medium">First Name</label>
            <input
              name="firstname"
              type="text"
              value={formData.firstname}
              className="w-full border rounded px-3 py-2 mt-1"
              onChange={handleChange}
            />
          </div>

          <div className="w-full mb-4">
            <label className="block text-sm font-medium">Last Name</label>
            <input
              name="lastname"
              type="text"
              value={formData.lastname}
              className="w-full border rounded px-3 py-2 mt-1"
              onChange={handleChange}
            />
          </div>

          <div className="w-full mb-4">
            <label className="block text-sm font-medium">New Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              maxLength={64}
              className="w-full border rounded px-3 py-2 mt-1"
              onChange={handleChange}
            />
          </div>

          <div className="w-full flex justify-between items-center">
            <button
                type="button"
                className="bg-red-500 text-white  px-4 py-2 rounded"
                onClick={handleDeleteUser}
            >
                Delete Account
            </button>
            <button
                type="button"
                className="btn-primary px-4 py-2 rounded"
                onClick={handleSubmit}
            >
                Save changes
            </button>
          </div>

          {error && (
            <div className="whitespace-pre-line bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2 text-center">
              {error}
            </div>
          )}
        </form>
      </div>
    );
}