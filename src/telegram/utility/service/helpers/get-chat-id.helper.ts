import { Interaction } from "src/types/telegram/interaction.type";
import { Telegraf } from "telegraf";

const GetChatId = async (Client: Telegraf, msg: Interaction): Promise<number|string> => {
    const chatId = await msg.chat.id;
    const fromId = msg.from?.id;

    if(fromId)
        Client.telegram.sendMessage(fromId, chatId);
    else
        Client.telegram.sendMessage(chatId, chatId);

    return chatId;
};

export default GetChatId;