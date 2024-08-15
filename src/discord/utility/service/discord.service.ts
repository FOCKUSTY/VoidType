import { Client as DiscordClient } from "discord.js";
import { Debug } from "develop/debug.develop";

import SendMessage from "./helpers/send-message.helper";

class Discord {
    private _client?: DiscordClient;

    public SendMessage = (channelId: string, message: string, Client?: DiscordClient) => {
        if(!Client && !this._client)
            return Debug.Error('Client is not defined');

        if(Client)
            return SendMessage(Client, channelId, message);
        
        if(this._client)
            return SendMessage(this._client, channelId, message);
    }

    public set client (Client: DiscordClient) {
        this._client = Client;
    };
};

export default new Discord;