import { Client } from "postmark";

const postmarkClient = new Client(process.env.POSTMARK_API_TOKEN);

export default postmarkClient;