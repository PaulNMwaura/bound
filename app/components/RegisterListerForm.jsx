"use client";

import { useState } from "react";
import UnavailableDaysCalendar from "@/app/components/SelectionCalendar"; 
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const _id = 0;

export default function ApplyLister() {
  const {data: session } = useSession();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    picture: "",
    firstname: "",
    lastname: "",
    email: session?.user?.email || "",
    city: "",
    state: "",
    description: "",
    services: [{ name: "", price: "", subcategories: [{ name: "", price: "" }] }],
    unavailableDays: [],
  });

  const router = useRouter();

  // Handles text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handles image upload
  const handleImageUpload = (e) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, picture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
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

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resListerExists = await fetch("api/listerExists", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
      });

      const {lister} = await resListerExists.json();

      if(lister) {
          setError("You are already registered as a listerS.");
          return;
      }

      const response = await fetch("/api/registerLister", {
        cache: "no-store",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Registration successful!");
        // formData.reset();
        setFormData({
          picture: "",
          firstname: "",
          lastname: "",
          email: session?.user?.email || "",
          city: "",
          state: "",
          description: "",
          services: [{ name: "", subcategories: [{ name: "", price: "" }] }],
          unavailableDays: [],
        });
        router.replace(`viewLister/${_id}`)
      } else {
        alert("Failed to register.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="h-full flex justify-center items-center overflow-hidden">
      <div className="mx-auto bg-white p-6">
        <h2 className="text-2xl font-bold mb-4">Register as a Lister</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="md:flex md:flex-row md:gap-8">
            <div>
            {/* Profile Picture Upload */}
            <label className="block text-sm font-medium">
              Profile Picture:
              <input type="file" accept="image/*" onChange={handleImageUpload} className="block mt-2" />
            </label>
            {formData.picture && <img src={formData.picture} alt="Preview" className="w-24 h-24 mt-2 rounded-full" />}

            {/* Name Fields */}
            <div className="w-full flex justify-between space-x-4 mt-5 pb-4">
              <div className="w-full">
                <label className="block text-sm font-medium">First Name</label>
                <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} className="border border-black p-2 rounded w-full" required />
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium">Last Name</label>
                <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} className="border border-black p-2 rounded w-full" required />
              </div>
            </div>
            {/* 
            <div className="flex space-x-4 pb-4">
              <div className="w-full">
                <label className="block text-sm font-medium">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="border border-black p-2 rounded w-full" required />
              </div>
            </div> */}

            {/* City and State */}
            <div className="flex space-x-4">
              <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="border border-black p-2 rounded w-full" required />
              <select name="state" value={formData.state} onChange={handleChange} className="border border-black p-2 rounded w-full" required>
                <option value="">Select State</option>
                {["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"].map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea name="description" placeholder="Brief description of your services" value={formData.description} onChange={handleChange} className="border border-black p-2 rounded w-full h-96" required />
            </div>
          </div>
          <div>
            
            {/* Services Section */}
            <div>
              <h3 className="text-lg font-semibold">What services are you looking to offer?</h3>
              {formData.services.map((service, serviceIndex) => (
                <div key={serviceIndex} className="bg-[#98F5F9]/25 p-3 rounded my-2">
                  
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

              <button type="button" onClick={addService} className="btn btn-primary mt-2">
                Add another service
              </button>
            </div>

            {/* Calendar Component to Select Unavailable Days */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-center">Set your availability</h3>
              <UnavailableDaysCalendar
                unavailableDays={formData.unavailableDays}
                onUnavailableDaysChange={handleUnavailableDaysChange} // Pass function to handle day click
              />
            </div>
            <h3 className="mt-4 mb-5 text-center">Services and availability can be changed at anytime from your page settings.</h3>
            {/* Submit Button */}
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full">
              Register
            </button>
            {error && (
              <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                {error}
              </div>
            )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
