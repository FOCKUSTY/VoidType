import { Interaction } from "src/types/telegram/interaction.type";
import { Telegraf } from "telegraf";
import { Debug } from "src/develop/debug.develop";

import SendMessage from "./helpers/send-message.helper";
import GetChatId from "./helpers/get-chat-id.helper";

import Client from "src/telegram.bot";

class Telegram {
    private _client: Telegraf = Client;

    public SendMessage = (chatId: number|string, message: string|string[]) => {
        if(!this._client)
            return Debug.Error('Client is not defined');

        return SendMessage(this._client, chatId, message);
    };

    public GetChatId = (message: Interaction) => {
        if(!this._client)
            return Debug.Error('Client is not defined');

        return GetChatId(this._client, message);
    };

    get client (): Telegraf {
        return this._client;
    };
};

export default Telegram;