"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

export const EditListerProfile = ({ thisLister }) => {
  const router = useRouter();
  const cropperRef = useRef(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    bannerPicture: thisLister.bannerPicture || "",
    city: thisLister.city,
    state: thisLister.state,
    description: thisLister.description,
    instructions: thisLister.instructions || "",
    services: thisLister.services?.length ? thisLister.services : [{ name: "", price: "", subcategories: [{ name: "", price: "" }] }],
  });
  const [imagePreview, setImagePreview] = useState(thisLister.bannerPicture);
  const [rawImageFile, setRawImageFile] = useState(null);
  const [cropData, setCropData] = useState(null);
  const [error, setError] = useState(null);

  const addService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, { name: "", price: "", subcategories: [] }],
    }));
  };
  
  const removeService = (index) => {
    const updated = [...formData.services];
    updated.splice(index, 1);
    setFormData({ ...formData, services: updated });
  };
  
  const addSubcategory = (serviceIndex) => {
    const newServices = [...formData.services];
    if (!newServices[serviceIndex].subcategories) {
      newServices[serviceIndex].subcategories = [];
    }
    newServices[serviceIndex].subcategories.push({ name: "", price: "" });
    setFormData({ ...formData, services: newServices });
  };
  
  const removeSubcategory = (serviceIndex, subIndex) => {
    const newServices = [...formData.services];
    newServices[serviceIndex].subcategories.splice(subIndex, 1);
    setFormData({ ...formData, services: newServices });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);
    setRawImageFile(file);
  };

  const getCroppedImage = () => {
    if (cropperRef.current?.cropper) {
      const canvas = cropperRef.current.cropper.getCroppedCanvas();
      const croppedImage = canvas.toDataURL("image/jpeg");
      setCropData(croppedImage);
      setImagePreview(croppedImage);
      setFormData((prev) => ({ ...prev, bannerPicture: croppedImage }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteLister = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this lister?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/listers/deleteLister`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listerId: thisLister._id }),
      });

      const result = await res.json();
      if (res.ok) {
        alert("Your lister account has been deleted.");
        router.push("/browse");
      } else {
        alert(result.message || "Failed to delete lister.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting lister.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);
    try {
      let finalBannerURL = formData.bannerPicture;

      if (finalBannerURL !== thisLister.bannerPicture && finalBannerURL.startsWith("data:image")) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", finalBannerURL);
        formDataUpload.append("upload_preset", "ml_default");

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: "POST",
          body: formDataUpload,
        });

        const uploadData = await uploadRes.json();
        finalBannerURL = uploadData.secure_url;
      }

      const res = await fetch(`/api/listers/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bannerPicture: finalBannerURL,
          listerId: thisLister._id,
          city: formData.city,
          state: formData.state,
          description: formData.description,
          instructions: formData.instructions,
          services: formData.services,
        }),
      });

      if (res.ok) {
        alert("Your Lister Account has been updated!");
        router.refresh();
      } else {
        console.log("Update failed.");
      }
    } catch (err) {
      console.error("Error updating lister:", err);
      alert("Update failed.");
    }
  };

  return (
    <div className="p-4 text-sm md:tex-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center justify-center">
            <div>
                <label className="block text-sm font-medium text-center">
                Current Banner Picture:
                <div className="flex justify-center mt-2">
                    <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    //   onChange={handleImageUpload}
                    className="hidden"
                    id="upload-input"
                    />
                    <label htmlFor="upload-input" className="btn btn-primary cursor-pointer">
                        Upload New
                    </label>
                </div>
                </label>
                {rawImageFile && (
                <>
                    <Cropper
                    src={imagePreview}
                    style={{ height: 300, width: "100%" }}
                    aspectRatio={16 / 9}
                    guides={true}
                    viewMode={1}
                    ref={cropperRef}
                    />
                    <button type="button" onClick={getCroppedImage}>
                        Save Crop
                    </button>
                </>
                )}
                {imagePreview && !rawImageFile && (
                <img src={imagePreview} alt="Banner preview" className="w-full h-48 object-cover mt-2" />
                )}
            </div>

            <div className="w-full">
                <label className="font-medium">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="border border-black/25 p-2 w-full text-xs md:text-sm" required />
            </div>
            <div className="w-full">
                <label className="font-medium">State</label>
                <select name="state" value={formData.state} onChange={handleChange} className="border border-black/25 p-2 rounded w-full text-xs md:text-sm" required>
                <option value="">Select State</option>
                {["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"].map((state) => (
                    <option key={state} value={state}>{state}</option>
                ))}
                </select>
            </div>
            <div className="w-full">
                <label className="block text-sm font-medium">About Me</label>
                <textarea name="description" placeholder="Brief description of your services. This will be your bio." maxLength={300} value={formData.description} onChange={handleChange} className="border border-black p-2 rounded w-full min-h-80" required />
                <div className="text-sm text-gray-500 text-right">{formData.description.length}/300 Characters</div>
            </div>
            <div className="w-full">
                <label className="font-medium">Instructions</label>
                <input type="text" name="instructions" value={formData.instructions} onChange={handleChange} className="border border-black/25 p-2 w-full text-xs md:text-sm" />
            </div>

            <div className="w-full">
                {/* Services Section */}
                <div className="w-full">
                <h3 className="text-md font-semibold">Your current services</h3>
                {formData.services.map((service, serviceIndex) => (
                    <div key={serviceIndex} className="bg-[#ABEEFF] p-3 rounded my-2">

                    {/* Service Name */}
                    <input
                        type="text"
                        placeholder="Service (e.g., Haircuts)"
                        value={service.name}
                        onChange={(e) => {
                        const newServices = [...formData.services];
                        newServices[serviceIndex].name = e.target.value;
                        setFormData({ ...formData, services: newServices });
                        }}
                        className="border border-black p-2 rounded w-full"
                        // required
                    />

                    {/* Service Price */}
                    <input
                        type="text"
                        placeholder="Service Price"
                        value={service.price}
                        onChange={(e) => {
                        const newServices = [...formData.services];
                        newServices[serviceIndex].price = e.target.value;
                        setFormData({ ...formData, services: newServices });
                        }}
                        className="border border-black p-2 rounded w-full mt-2"
                    />

                    {/* Subcategories */}
                    {service.subcategories?.length > 0 && (
                        <div className="mt-2">
                        <h4 className="text-md font-semibold">Complementary services for {service?.name}</h4>
                        {service.subcategories.map((subcategory, subIndex) => (
                            <div key={subIndex} className="flex space-x-2 mt-2">
                            <input
                                type="text"
                                placeholder="Add-on service"
                                value={subcategory.name}
                                onChange={(e) => {
                                const newServices = [...formData.services];
                                newServices[serviceIndex].subcategories[subIndex].name = e.target.value;
                                setFormData({ ...formData, services: newServices });
                                }}
                                className="border border-black p-2 rounded w-1/2"
                            />
                            <input
                                type="text"
                                placeholder="Price"
                                value={subcategory.price}
                                onChange={(e) => {
                                const newServices = [...formData.services];
                                newServices[serviceIndex].subcategories[subIndex].price = e.target.value;
                                setFormData({ ...formData, services: newServices });
                                }}
                                className="border border-black p-2 rounded w-1/2"
                            />
                            <button
                                type="button"
                                onClick={() => removeSubcategory(serviceIndex, subIndex)}
                                className="text-red-500"
                            >
                                Remove
                            </button>
                            </div>
                        ))}
                        </div>
                    )}

                    {/* Add/Remove Buttons */}
                    <div className="flex justify-between mt-2">
                        <button
                        type="button"
                        onClick={() => addSubcategory(serviceIndex)}
                        className="btn text-sm"
                        >
                        Add a complementary service
                        </button>
                        <button
                        type="button"
                        onClick={() => removeService(serviceIndex)}
                        className="btn btn-primary bg-red-500 text-sm"
                        >
                        Remove Service
                        </button>
                    </div>
                    </div>
                ))}
                <div className="flex justify-between items-center pt-2">
                    <button
                    type="button"
                    onClick={addService}
                    className="btn btn-primary text-sm"
                    >
                    Add another service
                    </button>
                </div>
                </div>
            </div>

            <div className="flex justify-between w-full">
                <button type="button" className="btn bg-red-500 text-white" onClick={handleDeleteLister}>
                    Delete Lister
                </button>

                <button type="submit" className="btn btn-primary">
                    Save Changes
                </button>
            </div>
        </form>
    </div>
  );
};
