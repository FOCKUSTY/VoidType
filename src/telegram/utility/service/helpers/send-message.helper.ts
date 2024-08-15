import { Telegraf } from "telegraf";

const SendMessage = async (Client: Telegraf, chatId: number|string, msg: string) => {
    return await Client.telegram.sendMessage(chatId, msg);
};

export default SendMessage;