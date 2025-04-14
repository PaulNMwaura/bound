export default function unauthorized ({params}) {
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <p className="text-center">Oops! You're not supposed to be here. <br /> Please go back to your previous page, or sign back in</p>
        </div>
    )
}