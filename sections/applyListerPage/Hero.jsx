// THIS IS THE FORM COMPONENT OF THE APPLY LISTER PAGE //
"use client";

import ListerAvailabilityEditor from "@/components/ListerAvailabilityEditor";
import ListerSetInstructions from "@/components/ListerSetInstructions";
import { useState, useRef } from "react";
import cloudinary from "@/lib/cloudinary";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css'; 
import { useRouter } from "next/navigation";

function capitalizeFirst(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const Hero = ({session, status}) => {
    const [error, setError] = useState("");
    const [showInstructionsForm, setShowInstructionsForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        userId: session?.user?.id || "",
        bannerPicture: session.user.bannerPicture || "",
        username: session.user.username || "",
        firstname: session.user.firstname || "",
        lastname: session.user.lastname || "",
        email: session.user.email || "",
        language: "",
        profilePicture: session.user.profilePicture || "",
        city: "",
        state: "",
        description: "",
        services: [{ type: "", price: "", subcategories: [{ name: "", price: "", description: "" }] }],
        instructions: "",
        availability: {
            monday: [{ start: "", end: "" }],
            tuesday: [{ start: "", end: "" }],
            wednesday: [{ start: "", end: "" }],
            thursday: [{ start: "", end: "" }],
            friday: [{ start: "", end: "" }],
            saturday: [{ start: "", end: "" }],
            sunday: [{ start: "", end: "" }],
        },
        timeSlotInterval: "",
    });
    const [imagePreview, setImagePreview] = useState(null);
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
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name == "language" || name == "city")
            setFormData((prev) => ({ ...prev, [name]: capitalizeFirst(value)}));
        else
            setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const getCroppedImage = () => {
        if (cropperRef.current && cropperRef.current.cropper) {
          const canvas = cropperRef.current.cropper.getCroppedCanvas();
      
          canvas.toBlob(async (blob) => {
            const formData = new FormData();
            formData.append("file", blob);
            formData.append("upload_preset", "ml_default");
      
            try {
              const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: "POST",
                body: formData,
              });
      
              const data = await res.json();
              if (data.secure_url) {
                setFormData((prev) => ({
                  ...prev,
                  bannerPicture: data.secure_url, // ✅ Clean URL stored
                }));
                setCropData(data.secure_url); // for preview display
              }
            } catch (err) {
              console.error("Error uploading cropped image", err);
              setError("Image upload failed.");
            }
          }, "image/jpeg");
        }
    };
    const handleReset = () => {
        formData.bannerPicture = "",
        formData.userId = session?.user?.id || "",
        formData.username = session.user.username || "",
        formData.firstname = session?.user?.firstname || "",
        formData.lastname = session?.user?.lastname || "",
        formData.email = session?.user?.email || "",
        formData.language = "",
        formData.profilePicture = session?.user?.profilePicture || "",
        formData.city = "",
        formData.state = "",
        formData.description = "",
        formData.services = [{ type: "", price: "", subcategories: [{ name: "", price: "", description: "" }] }],
        formData.instructions = "",
        formData.availability = {
            monday: [{ start: "", end: "" }],
            tuesday: [{ start: "", end: "" }],
            wednesday: [{ start: "", end: "" }],
            thursday: [{ start: "", end: "" }],
            friday: [{ start: "", end: "" }],
            saturday: [{ start: "", end: "" }],
            sunday: [{ start: "", end: "" }],
        },
        formData.timeSlotInterval = "",
        setImagePreview(null);
        setCropData(null);
        setError("");
        if (fileInputRef.current)
            fileInputRef.current.value = null;
    };

    // Handles adding a new service
    const addService = () => {
        setFormData((prev) => ({
        ...prev,
        services: [...prev.services, { name: "", price: "", subcategories: [] }],
        }));
    };

    // Handles removing a service
    const removeService = (index) => {
        setFormData((prev) => ({
        ...prev,
        services: prev.services.filter((_, i) => i !== index),
        }));
    };

    // Handles adding a new subcategory
    const addSubcategory = (serviceIndex) => {
        setFormData((prev) => {
        const newServices = [...prev.services];
        newServices[serviceIndex] = {
            ...newServices[serviceIndex],
            subcategories: [...newServices[serviceIndex].subcategories, { name: "", price: "" }]
        };
        return { ...prev, services: newServices };
        });
    };
    

    // Handles removing a subcategory
    const removeSubcategory = (serviceIndex, subIndex) => {
        setFormData((prev) => {
        const newServices = [...prev.services];
        newServices[serviceIndex].subcategories = newServices[serviceIndex].subcategories.filter((_, i) => i !== subIndex);
        return { ...prev, services: newServices };
        });
    };

    // Handles unavailable days from calendar selection
    const handleUnavailableDaysChange = (days) => {
        setFormData((prev) => ({
        ...prev,
        unavailableDays: days,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(submitting) return;

        const {userId, username, firstname, lastname, language, city, state, description, profilePicture, services} = formData;

        const noDeclaredServices = services.some(service => !service.type.trim());

        if(!userId || !firstname || !lastname || !city || !state || !description || !profilePicture || noDeclaredServices) {
            if(!city) {
                setError("Please enter the name of the city you operate within.");
                return;
            }
            else if(!state) {
                setError("Please select the state you operate within.");
                return;
            }
            else if(!description) {
                setError("Please provide a description of what services you provide, and what is required of your client for you to perfom said services.");
                return;
            }
            else if(noDeclaredServices) {
                setError("Please list at least one service.");
                return;
            } else {
                setError("Missing one or more required fields.");
            }
            return;
        }

        const hasAtLeastOneAvailableDay = Object.values(formData.availability)
        .some(day => day.length > 0);

        if (!hasAtLeastOneAvailableDay) {
            setError("Please set at least one available day.");
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch("/api/listers/registerLister", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
    
            if (res.ok) {
                const data = await res.json();
                router.replace(`/profile/${data.lister.username}`);
            }    
        } catch (err) {
            console.error("Error registering lister:", err);
            setSubmitting(false);
            setError("There was an issue submitting your form. Please try again.");
        }
    };

    return (
        <section className="max-w-7xl mx-auto bg-white text-black py-6">
            <form className="space-y-8 px-4 md:px-8">

            {/* Banner */}
            <div className="sectionStyle">
                <h2 className="text-lg font-semibold mb-4">
                Banner Picture
                </h2>

                <div className="flex flex-col items-center gap-4">

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                />

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => fileInputRef.current?.click()}
                >
                    Upload Banner
                </button>

                {imagePreview && !cropData && (
                    <div className="w-full">
                    <Cropper
                        src={imagePreview}
                        style={{ height: 400, width: "100%" }}
                        initialAspectRatio={16 / 9}
                        aspectRatio={16 / 9}
                        guides={true}
                        ref={cropperRef}
                    />

                    <button
                        type="button"
                        onClick={getCroppedImage}
                        className="btn btn-primary mt-4"
                    >
                        Save Crop
                    </button>
                    </div>
                )}

                {cropData && (
                    <img
                    src={cropData}
                    alt=""
                    className="
                        w-full
                        max-w-3xl
                        aspect-video
                        object-cover
                        rounded-xl
                        border
                        border-zinc-200
                    "
                    />
                )}
                </div>
            </div>

            {/* Personal Information */}
            <div className="sectionStyle">
                <h2 className="text-lg font-semibold mb-6">
                Personal Information
                </h2>

                <div className="grid md:grid-cols-5 gap-4">

                <div>
                    <label className="block text-sm font-medium mb-1">
                    First Name
                    </label>

                    <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    className="inputStyle"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                    Last Name
                    </label>

                    <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    className="inputStyle"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                    Language
                    </label>

                    <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="inputStyle"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                    City
                    </label>

                    <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="inputStyle"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                    State
                    </label>

                    <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="inputStyle"
                    >
                    <option value="">Select State</option>
                    {["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"].map((state) => (
                        <option key={state} value={state}>{state}</option>
                    ))}
                    </select>
                </div>
                </div>
            </div>

            {/* About Me */}
            <div className="sectionStyle">
                <h2 className="text-lg font-semibold mb-4">
                About Me
                </h2>

                <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength={500}
                placeholder="Brief description of your services..."
                className="textareaStyle min-h-72"
                />

                <div className="text-xs text-zinc-500 text-right mt-2">
                {formData.description.length}/500 Characters
                </div>
            </div>

            {/* Services */}
            <div className="sectionStyle">
                <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">
                    Services
                </h2>

                <button
                    type="button"
                    onClick={addService}
                    className="btn btn-primary"
                >
                    Add Service Category
                </button>
                </div>

                {formData.services.map((service, serviceIndex) => (
                <div
                    key={serviceIndex}
                    className="
                    border
                    border-zinc-200
                    bg-white
                    rounded-xl
                    p-5
                    mb-4
                    "
                >
                    <input
                    type="text"
                    placeholder="Service Category"
                    value={service.type}
                    className="inputStyle"
                    />

                    {service.type && (
                    <div className="mt-4 space-y-4">

                        {service.subcategories.map((subcategory, subIndex) => (
                        <div
                            key={subIndex}
                            className="
                            border
                            border-zinc-200
                            rounded-lg
                            p-4
                            "
                        >
                            <div className="grid md:grid-cols-2 gap-3">

                            <input
                                placeholder="Name"
                                value={subcategory.name}
                                className="inputStyle"
                            />

                            <input
                                type="number"
                                placeholder="Price"
                                value={subcategory.price}
                                className="inputStyle"
                            />
                            </div>

                            <textarea
                            value={subcategory.description}
                            placeholder="Describe what a client should expect"
                            className="textareaStyle mt-3"
                            />

                            <div className="flex justify-end mt-3">
                            <button
                                type="button"
                                className="text-sm text-red-600"
                            >
                                Remove
                            </button>
                            </div>
                        </div>
                        ))}

                        <div className="flex justify-between">
                        <button
                            type="button"
                            className="secondaryButton"
                        >
                            Add Service Option
                        </button>

                        <button
                            type="button"
                            className="text-red-600 text-sm"
                        >
                            Remove Category
                        </button>
                        </div>
                    </div>
                    )}
                </div>
                ))}

                <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowInstructionsForm(true)}
                >
                Add Service Instructions
                </button>
            </div>

            {/* Availability */}
            <div className="sectionStyle">
                <h2 className="text-lg font-semibold mb-4">
                Availability
                </h2>

                <ListerAvailabilityEditor
                availability={formData.availability}
                setFormData={setFormData}
                />
            </div>

            {/* Time Slot Interval */}
            <div className="sectionStyle">
                <label className="block text-sm font-medium mb-2">
                Appointment Time Slot Interval (Minutes)
                </label>

                <input
                type="number"
                name="timeSlotInterval"
                value={formData.timeSlotInterval}
                onChange={handleChange}
                className="inputStyle"
                />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-zinc-200 pt-6">

                <button
                type="button"
                onClick={handleReset}
                className="text-sm text-zinc-500 hover:text-black"
                >
                Clear All
                </button>

                <button
                type="submit"
                onClick={handleSubmit}
                className="btn btn-primary"
                >
                {submitting ? "Please wait..." : "Register"}
                </button>
            </div>

            {error && (
                <div
                className="
                    bg-red-50
                    border
                    border-red-200
                    text-red-700
                    px-4
                    py-3
                    rounded-lg
                "
                >
                {error}
                </div>
            )}

            </form>

            {showInstructionsForm && (
            <ListerSetInstructions
                setShowInstructionsForm={setShowInstructionsForm}
                setFormData={setFormData}
            />
            )}
        </section>
    );
};