// THIS IS THE FORM COMPONENT OF THE APPLY LISTER PAGE //
"use client";

import UnavailableDaysCalendar from "@/components/AvailabilitySelectionCalendar";
import ListerSetInstructions from "@/components/ListerSetInstructions";
import { useState, useRef } from "react";
import cloudinary from "@/lib/cloudinary";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css'; 
import { useRouter } from "next/navigation";


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
        profilePicture: session.user.profilePicture || "",
        city: "",
        state: "",
        description: "",
        services: [{ name: "", price: "", subcategories: [{ name: "", price: "" }] }],
        instructions: "",
        unavailableDays: [],
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
        formData.profilePicture = session?.user?.profilePicture || "",
        formData.city = "",
        formData.state = "",
        formData.description = "",
        formData.services = [{ name: "", price: "", subcategories: [{ name: "", price: "" }] }],
        formData.instructions = "",
        formData.unavailableDays = []
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

        const {userId, username, firstname, lastname, city, state, description, profilePicture, services} = formData;

        const noDeclaredServices = services.some(service => !service.name.trim());

        if(!userId || !firstname || !lastname || !city || !state || !description || !profilePicture || noDeclaredServices) {
            if(!city) {
                setError("Please input the city you operate within.");
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
        <section className="md:container bg-white text-black pt-4 pb-20 md:rounded-lg md:mt-5">
            <form className="px-2">
                {/* Photo Upload */}
                <div className="flex flex-col justify-center items-center">
                    <label className="block text-sm font-medium">
                    Banner Picture:
                    <div className="flex justify-center">
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} className="fixed opacity-0 h-10 w-[75px] bg-red-500 block" />
                        <button className="btn btn-primary">Upload</button>
                    </div>
                    </label>
                    {/* Image Preview */}
                    {imagePreview && !cropData && (
                        <div>
                            <Cropper
                                src={imagePreview}
                                style={{ height: 400, width: "100%" }}
                                initialAspectRatio={16 / 9}
                                aspectRatio={16 / 9}
                                guides={true}
                                ref={cropperRef}
                            />
                            <button type="button" onClick={getCroppedImage} className="mt-2 btn btn-primary">Save Crop</button>
                        </div>
                    )}

                    {/* Display Cropped Image */}
                    {cropData && (
                        <div className="mt-2">
                            <img src={cropData} alt="Cropped Image" className="w-[400px] h-[225px] object-cover"/>
                        </div>
                    )}
                </div>

                <div className="md:mt-2 md:px-4 md:py-4 md:rounded-t-lg md:rounded-br-lg">
                    <div className="flex flex-col md:flex-row  md:justify-between gap-1">
                        <div className="w-full">
                            <label className="font-medium">firstname</label>
                            <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} className="border border-black/25 p-2 w-full text-xs" required />
                        </div>
                        <div className="w-full">
                            <label className="font-medium">lastname</label>
                            <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} className="border border-black/25 p-2 w-full text-xs" required />
                        </div>
                        <div className="w-full">
                            <label className="font-medium">city</label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} className="border border-black/25 p-2 w-full text-xs" required />
                        </div>
                        <div className="w-full">
                            <label className="font-medium">state</label>
                            <select name="state" value={formData.state} onChange={handleChange} className="border border-black/25 p-2 rounded w-full text-xs" required>
                            <option value="">Select State</option>
                            {["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"].map((state) => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between gap-4">
                    <div className="w-full md:px-4 md:rounded-b-lg">
                        <label className="block text-sm font-medium">About Me</label>
                        <textarea name="description" placeholder="Brief description of your services. This will be your bio." maxLength={300} value={formData.description} onChange={handleChange} className="border border-black p-2 rounded w-full min-h-80" required />
                        <div className="text-sm text-gray-500 text-right mb-2">{formData.description.length}/300 Characters</div>
                    </div>

                    {/* Service Section */}
                    <div className="w-full md:pr-4">
                        <h3 className="text-md font-semibold">What services are you looking to offer?</h3>
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
                                required
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

                            {/* Subcategories - Only Show If There Is At Least One */}
                            {service.subcategories.length > 0 && (
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

                            {/* Buttons */}
                            <div className="flex justify-between mt-2">
                                <div>
                                <button
                                    type="button"
                                    onClick={() => addSubcategory(serviceIndex)}
                                    className="btn text-sm "
                                >
                                    Add a complementary service
                                </button>
                                </div>
                                <div>
                                <button
                                    type="button"
                                    onClick={() => removeService(serviceIndex)}
                                    className="btn btn-primary bg-red-500 text-sm"
                                >
                                    Remove Service
                                </button>
                                </div>
                            </div>
                            </div>
                        ))}
                        <div className="flex justify-between items-center pt-2">
                            <button type="button" onClick={addService} className="btn btn-primary text-sm">Add another service</button>
                            <button type="button" className="btn border border-black text-sm" onClick={() => setShowInstructionsForm(true)}>Add service instructions</button>
                        </div>
                    </div>
                </div>


                {/* Calendar Component to Select Unavailable Days */}
                <div className="mt-4">
                    <h3 className="text-lg font-semibold text-center py-2">Set your availability for this month</h3>
                    <UnavailableDaysCalendar unavailableDays={formData.unavailableDays} onUnavailableDaysChange={handleUnavailableDaysChange} />
                </div>
                <h3 className="mt-4 mb-5 text-center font-normal">Once registered, you can always change or update your selections in your page profile settings accessible through the dashboard</h3>
                
                {/* Submit Button */}
                <div className="flex flex-col">
                    <button type="submit" className="bg-black text-white px-4 py-2 rounded mt-4 w-[45%] place-self-center" onClick={handleSubmit}>{submitting ? 'Please wait...' : 'Register'}</button>
                    <button onClick={handleReset} className="p-2 place-self-start">Clear All</button>
                </div>
                {error && (
                <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                    {error}
                </div>
                )}
            </form>
            {showInstructionsForm && (
                <ListerSetInstructions setShowInstructionsForm={setShowInstructionsForm} setFormData={setFormData} />
            )}
        </section>
    );
};