const
    users = new Map(),
    guilds = new Map();

const setUser = async(client: any, guildId: string, userId: string, userName: string) =>
{
    const guild  = await client.guilds.fetch(`${guildId}`);
    const member = await guild.members.fetch(`${userId}`);
    users.set(userName, member)
    return;
};

const getUser = async(userName: string) =>
{
    return await users.get(userName);
};

const getUsers = async() =>
{
    return await users;
}

class User
{
    userId: string;
    userName: string;
    globalName: string;
    guildId: string;
    user: any

    constructor (userId: string, userName: string, globalName: string, guildId: string)
    {
        this.userId = userId;
        this.userName = userName;
        this.globalName = globalName;
        this.guildId = guildId;
        this.user = undefined;
    };

    async setUser(client: any)
    {
        const guild  = await client.guilds.fetch(`${this.guildId}`)
        const member = await guild.members.fetch(`${this.userId}`);
        this.user = member;
        return;
    };

    async getUser()
    {
        return await this.user;
    };
};

class Guild
{
    guildId: string;
    guildName: string;
    guild: any;
    constructor(guildId: string, guildName: string)
    {
        this.guildId = guildId;
        this.guildName = guildName;
        this.guild = undefined;
    };

    async setGuild(client: any)
    {
        const guild = client?.guilds.fetch(`${this.guildId}`);
        this.guild = guild;
    };

    async getGuild()
    {
        return await this.guild;
    };
}

export
{
    User,
    Guild,
    setUser,
    getUser,
    getUsers
}