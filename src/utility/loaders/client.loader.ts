import { Client as DiscordClient } from "discord.js";

import { objects } from "utility/loaders/objects.loader";
import { Colors } from "utility/service/formatter.service";
import loggers from 'logger/index.logger';

class ClientLoaderClass {
    private _guilds: string[] = [];
    private _users: string[] = [];
    private _names: string[] = [];

    public execute = async (Client: DiscordClient) => {
        Client.users.cache.forEach(user =>
            this._users.push(user.globalName || user.username));
        loggers.Loader.execute('Загрузка пользователей успешна', Colors.green);
        
        Client.guilds.cache.forEach(guild =>
            this._guilds.push(guild.name));
        loggers.Loader.execute('Загрузка гильдий успешна', Colors.green);

        this._names = objects.names;
    };

    public get guilds() {
        return this._guilds;
    };

    public get users() {
        return this._users;
    };

    public get names() {
        return this._names;
    };

    public Get = (getter: 'user'|'guild'|'name'): string[] => {
        if(getter === 'user')
            return this._users;
        else if(getter === 'guild')
            return this._guilds;
        else
            return this._names;
    };
};

const ClientLoader = new ClientLoaderClass();

export default ClientLoader;