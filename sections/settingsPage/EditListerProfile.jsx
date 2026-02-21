"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ConfirmationAlert } from "@/components/ConfirmationAlert";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

function capitalizeFirst(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const EditListerProfile = ({ thisLister }) => {
  const router = useRouter();
  const cropperRef = useRef(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    bannerPicture: thisLister.bannerPicture || "",
    language: thisLister.language,
    city: thisLister.city,
    state: thisLister.state,
    description: thisLister.description,
    instructions: thisLister.instructions || "",
    services: thisLister.services?.length ? thisLister.services : [{ name: "", price: "", subcategories: [{ name: "", price: "" }] }],
    availability: thisLister.availability || {
      monday: [{ start: "", end: "" }],
      tuesday: [{ start: "", end: "" }],
      wednesday: [{ start: "", end: "" }],
      thursday: [{ start: "", end: "" }],
      friday: [{ start: "", end: "" }],
      saturday: [{ start: "", end: "" }],
      sunday: [{ start: "", end: "" }],
    },
    timeSlotInterval: thisLister.timeSlotInterval,
  });

  const [imagePreview, setImagePreview] = useState(thisLister.bannerPicture);
  const [rawImageFile, setRawImageFile] = useState(null);
  const [cropData, setCropData] = useState(null);
  const [message, setMessage] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const addTimeBlock = (day) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: [...prev.availability[day], { start: "09:00", end: "17:00" }],
      },
    }));
  };

  const removeTimeBlock = (day, index) => {
    const updatedBlocks = [...formData.availability[day]];
    updatedBlocks.splice(index, 1);

    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: updatedBlocks,
      },
    }));
  };

  const updateTimeBlock = (day, index, field, value) => {
    const updatedBlocks = [...formData.availability[day]];
    updatedBlocks[index][field] = value;

    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: updatedBlocks,
      },
    }));
  };

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
        if (name == "language" || name == "city")
            setFormData((prev) => ({ ...prev, [name]: capitalizeFirst(value)}));
        else
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
        setMessage("Your lister account has been deleted.")
        // alert("Your lister account has been deleted.");
      } else {
        setMessage(result.message || "Failed to delete lister.");
        // alert(result.message || "Failed to delete lister.");
      }
    } catch (err) {
      setMessage("Error deleting lister.");
      // alert("Error deleting lister.");
    }
    location.reload();
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
          language: formData.language,
          city: formData.city,
          state: formData.state,
          description: formData.description,
          instructions: formData.instructions,
          services: formData.services,
          availability: formData.availability,
          timeSlotInterval: formData.timeSlotInterval,
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
                <label className="font-medium">Language</label>
                <input type="text" name="language" value={formData.language} onChange={handleChange} className="border border-black p-2 rounded w-full text-xs md:text-sm" required />
            </div>
            <div className="w-full">
                <label className="font-medium">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="border border-black p-2 rounded w-full text-xs md:text-sm" required />
            </div>
            <div className="w-full">
                <label className="font-medium">State</label>
                <select name="state" value={formData.state} onChange={handleChange} className="border border-black p-2 rounded w-full text-xs md:text-sm" required>
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
                <input type="text" name="instructions" value={formData.instructions} onChange={handleChange} className="border border-black rounded p-2 w-full text-xs md:text-sm" />
            </div>

            <div className="w-full">
                {/* Services Section */}
                <div className="w-full">
                <h3 className="text-md text-center font-semibold">Change services</h3>
                {formData.services.map((service, serviceIndex) => (
                    <div key={serviceIndex} className="bg-[#ABEEFF] p-3 rounded my-2">

                    {/* Service Name */}
                    <input
                        type="text"
                        placeholder="Service Category"
                        value={service.type}
                        onChange={(e) => {
                        const newServices = [...formData.services];
                        newServices[serviceIndex].name = e.target.value;
                        setFormData({ ...formData, services: newServices });
                        }}
                        className="border border-black p-2 rounded w-full"
                        // required
                    />

                    {/* Subcategories */}
                    {service.subcategories?.length > 0 && (
                        <div className="mt-2">
                        <h4 className="text-md font-semibold">Complementary services for {service?.type}</h4>
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

            <div className="w-full">
              <h3 className="text-md text-center font-semibold mb-2">Change Availability</h3>

              <div className="w-full pb-3">
                <label className="font-medium">Appointment time slot interval (in minutes)</label>
                <input type="number" name="timeSlotInterval" max={6000} min={0} value={formData.timeSlotInterval} onChange={handleChange} className="border border-black rounded p-2 w-full text-xs md:text-sm" />
              </div>

              {days.map((day) => (
                <div key={day} className="mb-4 p-3 border rounded">
                  <h4 className="font-medium capitalize mb-2">{day}</h4>

                  {formData.availability[day]?.length === 0 && (
                    <p className="text-sm text-gray-500">Not available</p>
                  )}

                  {formData.availability[day]?.map((block, index) => (
                    <div key={index} className="flex gap-2 items-center mb-2">
                      <input
                        type="time"
                        value={block.start}
                        onChange={(e) =>
                          updateTimeBlock(day, index, "start", e.target.value)
                        }
                        className="border p-1 rounded"
                      />

                      <span>-</span>

                      <input
                        type="time"
                        value={block.end}
                        onChange={(e) =>
                          updateTimeBlock(day, index, "end", e.target.value)
                        }
                        className="border p-1 rounded"
                      />

                      <button
                        type="button"
                        onClick={() => removeTimeBlock(day, index)}
                        className="text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addTimeBlock(day)}
                    className="text-blue-500 text-sm"
                  >
                    Add Time Block
                  </button>
                </div>
              ))}
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
        {openAlert && (
          <ConfirmationAlert message={message} openAlert={openAlert} />
        )}
    </div>
  );
};
