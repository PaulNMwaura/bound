import { UserMessages } from "@/sections/messagesPage/UserMessages";
import { OpenMessage } from "@/sections/messagesPage/OpenMessage";



export default async function Messages({params}) {
    const {id} = await params;

    return (
        <div className="flex flex-row">
            <OpenMessage reciverId={id}/>
        </div>
    )
}