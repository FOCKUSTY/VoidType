import { Sequelize, DataTypes, where } from 'sequelize';
import { debug } from './developConsole';
import { sequelize } from './tags';
import { dbTypes } from './classes';

const MTUOJ = sequelize.define('msgtouseronjoin',
{
    guildid:
    {
        type: DataTypes.STRING,
        unique: true
    },

    isenabled: DataTypes.BOOLEAN,
    text: DataTypes.TEXT
});

const getMTUOJ = async (guildId: string): Promise<{ text: string|any; type: dbTypes; error: any; }> =>
{
    try
    {
        const tag = await MTUOJ.findOne({ where: { guildid: guildId } });

        return { text: tag, type: 'successed', error: null };
    }
    catch (err)
    {
        debug(['Ошибка в messageToUserOnJoin.ts в discord/utils', err], false, false, true);

        return { text: 'Ошибка на стороне сервера', error: err, type: 'error' };
    };
};

const setMTUOJ = async (data: { guildId: string, isEnabled: boolean, text: string }) =>
{
    try
    {
        let MTUOJisExists = false;

        await getMTUOJ(data.guildId).then((gettedData: {text: string, type: dbTypes, error: any}) =>
        {
            if(gettedData?.text && gettedData?.type === 'successed' && !!gettedData?.error)
                MTUOJisExists = true;
        });

        if(MTUOJisExists)
            return {text: 'Такая гильдия уже записана, попробуйте удалить или обновить', type: 'error', error: 'guild is exists'};

        const createdMTUOJ = await MTUOJ.create
        ({
            guildid: data.guildId,
            isenabled: data.isEnabled,
            text: data.text
        });

        return { text: 'Гильдия успешно добавлена !', error: null, type: 'successed' };
    }
    catch (err)
    {
        debug(['Ошибка в messageToUserOnJoin.ts в discord/utils', err], false, false, true);
        return { text: 'Ошибка на стороне сервера', error: err, type: 'error' };
    };
};

const updateMTUOJ = async(data: { guildId: string, isEnabled: boolean, text: string }) =>
{
    try
    {
        const updatedMTUOJ = await MTUOJ.update
        ({
            isenabled: data.isEnabled,
            text: data.text
        },

        {where: {guildid: data.guildId}});

        MTUOJ.sync();

        return { text: 'Гильдия успешно изменена !', error: null, type: 'successed' };
    }
    catch (err)
    {
        debug(['Ошибка в messageToUserOnJoin.ts в discord/utils', err], false, false, true);
        return { text: 'Ошибка на стороне сервера', error: err, type: 'error' };
    };
};

const deleteMTUOJ = async(guildId: string) =>
{
    try
    {
        await MTUOJ.destroy({where: {guildid: guildId}});

        MTUOJ.sync();

        return { text: 'Гильдия успешно удалена !', error: null, type: 'successed' };
    }
    catch (err)
    {
        debug(['Ошибка в messageToUserOnJoin.ts в discord/utils', err], false, false, true);
        return { text: 'Ошибка на стороне сервера', error: err, type: 'error' };
    };
};

export
{
    MTUOJ,
    getMTUOJ,
    setMTUOJ,
    updateMTUOJ,
    deleteMTUOJ
};