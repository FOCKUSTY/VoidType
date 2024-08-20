import { Interaction } from "src/types/telegram/interaction.type";
import { Telegraf } from "telegraf";
import { Debug } from "src/develop/debug.develop";

import SendMessage from "./helpers/send-message.helper";
import GetChatId from "./helpers/get-chat-id.helper";

class Telegram {
    private _client?: Telegraf;

    public SendMessage = (chatId: number|string, message: string|string[], Client?: Telegraf) => {
        if(!Client && !this._client)
            return Debug.Error('Client is not defined');

        if(Client)
            return SendMessage(Client, chatId, message);
        
        if(this._client)
            return SendMessage(this._client, chatId, message);
    };

    public GetChatId = (message: Interaction, Client?: Telegraf) => {
        if(!Client && !this._client)
            return Debug.Error('Client is not defined');

        if(Client)
            return GetChatId(Client, message);
        
        if(this._client)
            return GetChatId(this._client, message);
    };

    set client (Client: Telegraf) {
        this._client = Client;
    };

    get client (): Telegraf|undefined {
        return this._client;
    };
};

export default new Telegram;