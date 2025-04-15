import ChatBox from "@/components/ChatBox";

export const OpenMessage = ({ reciverId }) => {
    return (
        <div className="w-full h-screen flex justify-center items-center">
            <ChatBox otherUserId={reciverId} />
        </div>
    )
}