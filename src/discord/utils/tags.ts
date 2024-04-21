import { Sequelize, DataTypes, where } from 'sequelize';
import { debug } from 'dev@console';

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

const settedVoiceChannels = sequelize.define('settedvoicechannel',
{
    guildid:
    {
        type: DataTypes.STRING,
        unique: true
    },
    channelid:
    {
        type: DataTypes.STRING,
        unique: true
    }
});

const deleteTable = async (table: any) =>
{
    await table.drop();
    return;
};

const showAllTables = async() =>
{
    console.log(sequelize)
}

const addNewVoiceCreateChannel = async(data = {guildId: '', channelId: '',}) =>
{
    try
    {
        let NVCCexistsData = {text: '', type: '', error: null, isExists: false};

        await getVoiceCreateChannel({guildId: data.guildId, findType:'findOne'}).then(vcc =>
        {
            if(vcc?.text && vcc?.type === 'successed' && !!vcc?.error)
                NVCCexistsData = {text: `Канал в такой гильдии уже существует, попробуйте удалить или обновить`, type: 'error', error: null, isExists: true};
        })

        if(NVCCexistsData.isExists)
            return NVCCexistsData;

        const VCC = await settedVoiceChannels.create
        ({
            guildid: data.guildId,
            channelid: data.channelId
        });

        settedVoiceChannels.sync();

        return {text: `Канал ${data.channelId} в ${data.guildId} был добавлен`, type: 'successed'}
    }
    catch (err)
    {
        console.log(err);

        return {text: `Возможная ошибка на стороне сервера`, type: 'error', error: err };
    }
};

const deleteVoiceCreateChannel = async (data = {guildId: ''}) =>
{
    try
    {
        const dVCC = await settedVoiceChannels.destroy({ where: { guildid: data.guildId } });

        settedVoiceChannels.sync();

        return {text: `В ${data.guildId} был удален канал!`, type: 'successed'};
    }
    catch (err)
    {
        console.log(err);

        return {text: 'Возможная ошибка на стороне сервера', type: 'error', error: err};
    };
}

const updateVoiceCreateChannel = async (data = {guildId: '', channelId: ''}) =>
{
    try
    {
        const uVCC = await settedVoiceChannels.update
        ({
            channelid: data.channelId
        },

        {where: {guildid: data.guildId}});

        settedVoiceChannels.sync();

        return {text: `В ${data.guildId} был обновлен канал!`, type: 'successed'};
    }
    catch (err)
    {
        console.log(err);

        return {text: 'Возможная ошибка на стороне сервера', type: 'error', error: err};
    };
};

const getVoiceCreateChannel = async (data = {guildId: '', findType: ''}) =>
{
    try
    {
        if(data.findType==='findAll')
            {
                const
                    tagList = await settedVoiceChannels.findAll({ attributes: ['guildid'] }),
                    tagString = tagList.map((t: any) => t.guildid).join('\n') || 'Нет тегов';
                
                return await {text: tagString, type: 'successed'};
            }
            else if(data.findType==='findOne')
            {
                const tag = await settedVoiceChannels.findOne({ where: { guildid: data.guildId } });
                
                return await {text: tag, type: 'successed'};
            }
    }
    catch (err: any)
    {
        console.log(err);
        return {text: 'Возможная ошибка на стороне сервера', type: 'error', error: err};
    }
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

const getLogGuild = async (findType='findAll', logId?: string) =>
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
    
        debug([
        `Тег идеи успешно добавлен\n
        Название: ${title}\n
        Описание: ${detail}\n
        Отправил: ${user.username}\n
        С сервера: ${guild?.name}`
        ], log)
    }
    catch (err)
    {
        debug(['Ошибка с добавлением тега\n', err], true, false, true);
    }
};

const getUserTagOutDB = async (findType='findAll', tagName?: any) =>
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
    settedVoiceChannels,

    addNewVoiceCreateChannel,
    updateVoiceCreateChannel,
    deleteVoiceCreateChannel,
    getVoiceCreateChannel,

    addUserTagToDB,
    getUserTagOutDB,
    
    addNewLogGuild,
    getLogGuild,

    deleteTable,
    updateGuildLog
};