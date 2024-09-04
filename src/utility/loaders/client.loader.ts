import { Client as DiscordClient } from "discord.js";

import { objects } from "utility/loaders/objects.loader";
import { Colors } from "utility/service/formatter.service";
import Logger from 'logger/index.logger';

const guilds: string[] = [];
const users: string[] = [];
const names: string[] = [];

class ClientLoaderClass {
    private readonly Logger = new Logger('Loader').execute;

    private _guilds: string[] = [];
    private _users: string[] = [];
    private _names: string[] = [];
    
    constructor() {
        this._guilds = guilds;
        this._users = users;
        this._names = names;
    };

    public readonly execute = async (Client: DiscordClient) => {
        Client.users.cache.forEach(user =>
            users.push(user.globalName || user.username));
        this.Logger('Загрузка пользователей успешна', Colors.green);
        
        Client.guilds.cache.forEach(guild =>
            guilds.push(guild.name));
        this.Logger('Загрузка гильдий успешна', Colors.green);

        names.push(...objects.names);
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

export default ClientLoaderClass;