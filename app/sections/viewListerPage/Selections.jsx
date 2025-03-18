export const Selections = ({selectedServices, selectedDate, selectedTime, handleAppointmentRequest, id, firstname, lastname}) =>{
    return (
        <section className="hidden md:block md:mt-10 lg:mt-0 md:min-w-full lg:min-w-[150px]">
            <div className="container bg-[#F3F3F3] rounded-xl pt-5 pb-10 px-4">
                <div className="flex lg:flex-col justify-between items-center gap-10">
                    {/* Service Selected (Might have to turn this to a component!!) */}
                    <div className="w-full text-center">
                        <p className="text-xs font-semibold">Selected Service/s</p>
                        <div className="w-full h-fit outline outline-1 text-black text-xs py-5 px-1 mt-1 rounded-lg">
                            {selectedServices.length > 0 ? selectedServices.map((service, index) => (
                            <div key={index} className="font-normal">
                                {service}
                            </div>
                            )):(
                            <p> No services selected currently</p>
                            )}
                        </div>
                    </div>

                    {/* Selected Date */}
                    <div className="w-full text-center">
                        <p className="text-xs font-semibold">Selected date</p>
                        <div className="w-full h-fit outline outline-1 text-black text-xs py-5 px-1 mt-1 rounded-lg">
                        {selectedDate ? (
                            <div className="font-normal">
                            {new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                            </div>
                        ):(
                            <p> No date selected currently</p>
                        )}
                        </div>
                    </div>

                    {/* Time selected */}
                    <div className="w-full text-center">
                        <p className="text-xs font-semibold">Selected Time</p>
                        <div className="w-full h-fit outline outline-1 text-black text-xs py-5 px-1 mt-1 rounded-lg">
                            {selectedTime ? (
                            <div className="font-normal">
                                {selectedTime}
                            </div>
                            ):(
                            <p> No time selected currently</p>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Request appointment button */}
                <div className="flex mt-10 justify-center">
                    <button onClick={() => handleAppointmentRequest(id, firstname, lastname, selectedDate, selectedTime, selectedServices, {setSuccess, setError})} className="btn btn-primary text-xs">Request An Appointment</button>
                </div>
            </div>
        </section>
    )
};