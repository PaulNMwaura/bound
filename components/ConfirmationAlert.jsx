export const ConfirmationAlert = ({message, openAlert}) => {
    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center text-black text-xs md:text-lg">
            <div className="w-64 p-4 bg-white rounded-md shadow-md">
                <div>
                    {message}
                </div>
                <div className="mt-5 flex justify-center">
                    <button type="button" className="btn btn-primary" onClick={() => openAlert(false)}>Okay</button>
                </div>
            </div>
        </div>
    );
}