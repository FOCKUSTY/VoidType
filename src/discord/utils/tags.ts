import { Sequelize, DataTypes } from 'sequelize';
import { debug, skip } from './developConsole';

const sequelize = new Sequelize('database', 'user', 'password',
{
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Tags = sequelize.define('tags',
{
    name:
    {
        type: DataTypes.STRING,
        unique: true,
    },
    username: DataTypes.STRING,
    globalname: DataTypes.STRING,
    description: DataTypes.TEXT,
    guildname: DataTypes.TEXT,
});

const logMessagesSchema = sequelize.define('logmessagesschema',
{
    guildid:
    {
        type: DataTypes.STRING,
        unique: true
    },
    optiondelete: DataTypes.BOOLEAN,
    optionupdate: DataTypes.BOOLEAN,
    guildname: DataTypes.STRING,
    channellogid: DataTypes.STRING,
    islogenable: DataTypes.BOOLEAN
})

const deleteTable = async (table: any) =>
{
    await table.drop();
    return;
};

const showAllTables = async() =>
{
    console.log(sequelize)
}

const addNewLogGuild = async (guildid: string, optiondelete: boolean, optionupdate: boolean, guildname: string, channellogid: string, islogenable: boolean, log=true) =>
{
    try
    {        
        const logGuild = await logMessagesSchema.create
        ({
            guildid: `${guildid}`,
            optiondelete: optiondelete,
            optionupdate: optionupdate,
            guildname: `${guildname}`,
            channellogid: `${channellogid}`,
            islogenable: `${islogenable}`
        });

        if(log) console.log(`Канал логирования был добавлен\nГильдия: ${guildname} - ${guildid}\nКанал: ${channellogid}\nОпции:\n`, optiondelete, optionupdate);
    }
    catch (err)
    {
        console.log(err);
    }
}

const updateGuildLog = async (guildid: string,  optiondelete: boolean, optionupdate: boolean, channellogid: string, islogenable: boolean, log=true) =>
{
    try
    {
        const updatedLog = await logMessagesSchema.update
            ({
                optiondelete: optiondelete,
                optionupdate: optionupdate,
                channellogid: channellogid,
                islogenable: islogenable,
            },

            { where: { guildid: guildid } }
        );
    }
    catch (err)
    {
        console.log(err)
    }
};

const getLogGuild = async (findType='findAll', logId: string) =>
{
    if(findType==='findAll')
    {
        const
            tagList = await logMessagesSchema.findAll({ attributes: ['guildid'] }),
            tagString = tagList.map((t: any) => t.guildid).join('\n') || 'Нет тегов';
        
        return await tagString;
    }
    else if(findType==='findOne')
    {
        const tag = await logMessagesSchema.findOne({ where: { guildid: logId } });
        
        return await tag;
    }
}

const addUserTagToDB = async (title: string, user: { username: string; globalName: string; }, detail: string, guild: { name: string; }, log=true) =>
{
    try
    {
        const tag = await Tags.create
        ({
            name: title,
            username: user.username,
            globalname: user.globalName,
            description: detail,
            guildname: guild?.name||`Не на сервере`
        });
    
        if(log) console.log(
        `Тег идеи успешно добавлен\n
        Название: ${title}\n
        Описание: ${detail}\n
        Отправил: ${user.username}\n
        С сервера: ${guild?.name}`
        )
    }
    catch (err)
    {
        if(log) console.log('Ошибка с добавлением тега');
        if(log) console.log(err);
    }
};

const getUserTagOutDB = async (findType='findAll', tagName: any) =>
{
    if(findType==='findAll')
    {
        const
            tagList = await Tags.findAll({ attributes: ['name'] }),
            tagString = tagList.map((t: any) => t.name).join('\n') || 'Нет тегов';
        
        return await tagString;
    }
    else if(findType==='findOne')
    {
        const tag = await Tags.findOne({ where: { name: tagName } });
        
        return await tag;
    }
}

export
{
    sequelize,

    Tags,
    logMessagesSchema,

    addUserTagToDB,
    getUserTagOutDB,
    
    addNewLogGuild,
    getLogGuild,

    deleteTable,
    updateGuildLog
};