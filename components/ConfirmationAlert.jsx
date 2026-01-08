import { FiX, FiCheck } from "react-icons/fi";

export const ConfirmationAlert = ({ message, openAlert, error }) => {
    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center text-black text-xs md:text-lg">
            <div className="w-80 p-4 bg-white rounded-md shadow-md">
                
                {/* Icon */}
                <div className="flex justify-center mb-3">
                    {error ? (
                        <div className="w-fit h-fit p-2 rounded-full bg-black">
                            <FiX className="text-red-400 md:text-4xl" />
                        </div>
                    ) : (
                        <div className="w-fit h-fit p-2 rounded-full bg-black">
                            <FiCheck className="text-green-500 md:text-4xl" />
                        </div>

                    )}
                </div>

                {/* Message */}
                <div className="text-center">
                    {message}
                </div>

                {/* Action */}
                <div className="mt-5 flex justify-center">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => openAlert(false)}
                    >
                        Okay
                    </button>
                </div>
            </div>
        </div>
    );
};
