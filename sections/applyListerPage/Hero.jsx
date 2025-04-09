// THIS IS THE FORM COMPONENT OF THE APPLY LISTER PAGE //

import UnavailableDaysCalendar from "@/components/AvailabilitySelectionCalendar";
import { useState } from "react";
import { useSession } from "next-auth/react";

export const Hero = () => {
    const {data: session } = useSession();
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        picture: session?.user?.profilePicture ||"",
        firstname: session?.user?.firstname || "",
        lastname: session?.user?.lastname || "",
        email: session?.user?.email || "",
        city: "",
        state: "",
        description: "",
        services: [{ name: "", price: "", subcategories: [{ name: "", price: "" }] }],
        unavailableDays: [],
    });

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
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleReset = () => {
        formData.picture = session?.user?.profilePicture ||"",
        formData.firstname = session?.user?.firstname || "",
        formData.lastname = session?.user?.lastname || "",
        formData.email = session?.user?.email || "",
        formData.city = "",
        formData.state = "",
        formData.description = "",
        formData.services = [{ name: "", price: "", subcategories: [{ name: "", price: "" }] }],
        formData.unavailableDays = []
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

    return (
        <section className="md:container bg-white text-black pt-4 pb-20 md:rounded-lg md:mt-5">
            <form className="px-2">
                {/* Photo Upload */}
                <div className="flex flex-col justify-center items-center">
                    <label className="block text-sm font-medium">
                    Banner Picture:
                    <div className="flex justify-center">
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="fixed opacity-0 h-10 w-[75px] bg-red-500 block" />
                        <button className="btn btn-primary">Upload</button>
                    </div>
                    </label>
                    {formData.picture && <img src={formData.picture} alt="Preview" className="w-28 h-28 mt-2 object-cover rounded-full border-2" />}
                </div>

                <div className="md:mt-2 md:bg-[#D9D9D9] md:px-4 md:py-4 md:rounded-t-lg md:rounded-br-lg">
                    {/* <h2 className="font-medium text-sm">General Information</h2> */}
                    <div className="flex flex-col md:flex-row gap-1">
                        <div>
                            <label className="font-medium">firstname</label>
                            <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} className="border border-black/25 p-2 w-full text-xs" required />
                        </div>
                        <div>
                            <label className="font-medium">lastname</label>
                            <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} className="border border-black/25 p-2 w-full text-xs" required />
                        </div>
                        <div>
                            <label className="font-medium">city</label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} className="border border-black/25 p-2 w-full text-xs" required />
                        </div>
                        <div>
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
                    <div className="w-full md:bg-[#D9D9D9] md:px-4 md:rounded-b-lg">
                        <label className="block text-sm font-medium">About Me</label>
                        <textarea name="description" placeholder="Brief description of your services" value={formData.description} onChange={handleChange} className="border border-black p-2 rounded w-full min-h-80" required />
                    </div>

                    {/* Service Section */}
                    <div className="w-full">
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
                            <button className="btn border border-black text-sm">Add service instructions</button>
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
                    <button type="submit" className="bg-black text-white px-4 py-2 rounded mt-4 w-[45%] place-self-center">Register</button>
                    <button onClick={handleReset} className="p-2 place-self-start">Clear All</button>
                </div>
                {error && (
                <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                    {error}
                </div>
                )}
            </form>
        </section>
    );
};