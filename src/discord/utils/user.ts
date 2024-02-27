import { pseudoRandomNumber } from './pseudoRandom'

const
    users = new Map(),
    guilds = new Map(),
    userInformations = new Map(),
    userInformationsCache = [],
    userInformationsHistoryArray: any[] = [];

let
    totalUsers: number = 0,
    totalBots: number = 0,
    totalGuilds: number = 0;

const getAmount = (value='totalusers') =>
{
    value = value.toLocaleLowerCase()
    if(value==='totalusers') return totalUsers;
    else if(value==='totalbots') return totalBots;
    else if(value==='totalguilds') return totalGuilds;
    else return totalGuilds;
};

const setUsernames = async(client: any, guildIds: any[]) =>
{
    if(guildIds.length===0) for(let guild of await client.guilds.cache) guildIds.push(guild.id);

    guildCicle: for (let guildId of guildIds)
    {
        const guild   = await client.guilds.fetch(`${guildId}`);
        const members = await guild.members.cache;
        
        totalGuilds+=1;
        let guildUser;

        userCicle: for(let member of members)
        {
            guildUser = await guild.members.fetch(`${member[1].user.id}`);
            
            if(guildUser?.user?.bot)
            {
                totalBots+=1;
                continue userCicle;
            };

            totalUsers+=1;
            
            if(!guildUser?.presence?.status) continue userCicle;

            if(guildUser.user.globalName) userInformations.set(`${guildUser.user.id}`, [`${guildUser.user.globalName}`, [`${guild.id}`, `${guild.name}`]]);
            else userInformations.set(`${guildUser.user.id}`, [`${guildUser.user.username}`, [`${guild.id}`, `${guild.name}`]]);
        };
    };
    for(let i of userInformations) userInformationsCache.push(i);
};

const getUsernames = (isCache=false) =>
{
    if(isCache) return [...userInformations];
    else if(!isCache) return [...userInformations];
};

const getRandomUserInformation = (info='username') =>
{
    const randomNumber = pseudoRandomNumber(0, userInformations.size-1, 2, 3, userInformationsHistoryArray, undefined, undefined, true, true, true);
    const key = Array.from(userInformations.keys())[randomNumber];
    
    info = info.toLocaleLowerCase();
    
    try
    {
        switch (info)
        {
            
            case 'username':
                return userInformations.get(key)[0];
            
            case 'userid':
                return key
            
            case 'guildid':
                return userInformations.get(key)[1][0];
            
            case 'guildname':
                return userInformations.get(key)[1][1];
            
            case 'userid-guildid':
                return [key, userInformations.get(key)[1][0]];
            
            case 'userid-guildid-username':
                return [key, userInformations.get(key)[1][0], userInformations.get(key)[0]];
            
            case 'userid-guildid-username-guildname':
                return [key, userInformations.get(key)[1][0], userInformations.get(key)[0], userInformations.get(key)[1][1]];
        
            default:
                return userInformations.get(key)[0];;
        };
        
    }
    catch (err)
    {
        console.log(err)
        console.log(userInformations)
        console.log(key)   
    }
};

const setUser = async(client: any, guildId:string, userId:string, userName: undefined | string = undefined) =>
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
    user: any;

    constructor (userId:string, userName:string, globalName:string, guildId:string)
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
    guildId: string
    guildName: string
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
    getUsers,
    setUsernames,
    getUsernames,
    getRandomUserInformation,
    getAmount
}