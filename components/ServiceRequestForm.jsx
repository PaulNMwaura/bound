"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ServiceRequestForm({ session }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstname: "",
        lastname:  "",
        email: "",
        date: "",
        time: "",
        note: "",
        services: [],
    });
    const handleChange = (e) => {
        const { name, value, options, multiple } = e.target;
        if (multiple) {
            // collect selected options as an array
            const selected = Array.from(options)
                .filter((o) => o.selected)
                .map((o) => o.value);
            setFormData((prev) => ({ ...prev, [name]: selected }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };
    const closePopup = () => {
        setFormData({
            firstname: "",
            lastname: "",
            email: "",
            date: "",
            time: "",
            note: "",
            services: [],
        });
        router.push("?", { scroll: false });
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <div
        className="fixed inset-0 backdrop-blur-md bg-black/2 flex items-center justify-center z-10"
        onClick={closePopup}
        >
            <form
            className="bg-white shadow-[0_35px_35px_rgba(0,0,0,0.25)] rounded-sm w-fit h-fit flex flex-col gap-2 items-center py-7 px-10 text-black"
            onClick={(e) => e.stopPropagation()}
            >
                <strong>
                    This will post a public request for listers to view and pick up
                </strong>

                {/* Services */}
                <div className="flex flex-col space-y-2">
                <label className="font-medium">What service/s are requesting</label>
                <select
                    name="services"
                    multiple
                    className="border border-black/25 p-2 w-[300px] text-xs h-fit"
                    value={formData.services}
                    onChange={handleChange}
                    required
                >
                    {/* {lister.services.map((service, index) => (
                    <option key={index} value={service.name} className="p-1 text-black">
                        {service.name}
                    </option>
                    ))} */}
                </select>
                <p className="text-[10px] text-gray-500">
                    Hold <kbd>Ctrl</kbd> (or <kbd>Cmd</kbd> on Mac) to select multiple.
                </p>
                </div>

                {/* Date */}
                <div className="flex flex-col space-y-2">
                <label className="font-medium">When would you like this to be done?</label>
                <input
                    type="date"
                    name="date"
                    min={today}
                    className="border border-black/25 p-2 w-[300px] text-xs"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />
                </div>

                {/* Time */}
                <div className="flex flex-col space-y-2">
                <label className="font-medium">At what time?</label>
                <input
                    disabled={!formData.date}
                    type="time"
                    name="time"
                    className="border border-black/25 p-2 w-[300px] text-xs"
                    value={formData.time}
                    onChange={handleChange}
                    required
                />
                </div>

                {/* Notes */}
                <div className="flex flex-col space-y-2">
                <label className="font-medium">Any additional information?</label>
                <textarea
                    name="notes"
                    maxLength="300"
                    className="border border-black/25 p-2 w-[300px] h-[100px] text-xs"
                    value={formData.notes || ""}
                    onChange={handleChange}
                />
                </div>

                {/* Actions */}
                <div className="mt-auto pt-1 w-full flex justify-between">
                <button type="button" className="text-black font-medium" onClick={closePopup}>
                    Close
                </button>
                <button type="submit" className="btn btn-primary">
                    Post
                </button>
                </div>
            </form>
        </div>
    );
}
