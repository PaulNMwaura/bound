export const ListersFound = ({count}) => {
    return (
        <div>
            <div className="flex justify-between font-thin">
                <div>
                    Listers found
                </div>
                <div>
                    {count ? count : "0"}
                </div>
            </div>
        </div>
    )
};