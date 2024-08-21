import { Client as DiscordClient, EmbedBuilder } from "discord.js";
import { Debug } from "develop/debug.develop";

import SendMessage from "./helpers/send-message.helper";

import Client from "src/discord.bot";

class Discord {
    private _client: DiscordClient = Client;

    public SendMessage = async (channelId: string, message: string|EmbedBuilder[]) => {
        if(!this._client)
            return Debug.Error('Client is not defined');

        return await SendMessage(this._client, channelId, message);
    };

    public SendMessageToTelegram = async (channelId: string, message: string, telegramName: string) => {
        if(!this._client)
            return Debug.Error('Client is not defined');

        return await SendMessage(this._client, channelId, `Отправлено из Telegram от ${telegramName} \n${message}`);
    };

    get client(): DiscordClient {
        return this._client;
    };
};

export default Discord;