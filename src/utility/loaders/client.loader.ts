import { Client as DiscordClient } from "discord.js";

import { objects } from "utility/loaders/objects.loader";
import Filter from "utility/service/filter.service";
import Formatter, { Colors } from "utility/service/formatter.service";
import Logger from 'logger/index.logger';
import { Debug } from "develop/debug.develop";

const filter = new Filter(undefined);

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

    private readonly UsersLoader = async(Client: DiscordClient) => {
        const size = Client.users.cache.filter(u => !u.bot).size;

        this.Logger(`Загрузка ${size} ` + Formatter.RuWords(size, ['пользователя', 'пользователей']), Colors.yellow);

        Client.users.cache.forEach(user => {
            const name = filter.userFilter(user);
            
            if(name) users.push(name);
        });

        if(size-users.length > 0)
            this.Logger(`Отсеивание ${size-users.length} ${Formatter.RuWords(size-users.length, ['пользователя', 'пользователей'])}`, Colors.yellow);

        this.Logger(`Загрузка ${users.length} ${Formatter.RuWords(users.length, ['пользователя', 'пользователей'])} успешна`, Colors.green);
    };

    private readonly GuildsLoader = async(Client: DiscordClient) => {
        const size = Client.guilds.cache.size;

        this.Logger(`Загрузка ${size} ` + Formatter.RuWords(size, ['гильдии', 'гильдий']), Colors.yellow);
        
        Client.guilds.cache.forEach(guild => {
            const name = filter.guildFilter(guild);
            
            if(name) guilds.push(name);
        });

        if(size-guilds.length > 0)
            this.Logger(`Отсеивание ${size-guilds.length} ${Formatter.RuWords(size-guilds.length, ['гильдии', 'гильдий'])}`, Colors.yellow);

        this.Logger(`Загрузка ${guilds.length} ${Formatter.RuWords(guilds.length, ['гильдии', 'гильдий'])} успешна`, Colors.green);
    };

    public readonly execute = async (Client: DiscordClient) => {
        this.UsersLoader(Client);
        this.GuildsLoader(Client);

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