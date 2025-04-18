import ChatBox from "@/components/ChatBox";

export const OpenMessage = ({ reciverId, session }) => {
    return (
        <div className="w-full h-screen">
            <ChatBox otherUserId={reciverId} session={session} />
        </div>
    )
}