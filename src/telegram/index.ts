import { Telegraf } from 'telegraf';

import { deployCommands } from 't@deploy-commands';
import { messageListener } from 't@l-msg';
import { setBot } from 'utility/bots';

import config from 'config';
import fs from 'node:fs';
import path from 'path';
import { setDevelopClient } from './utility/develop';

const client = new Telegraf(config.telegramToken);

const telegramFoldersPathText = 'commands';
const telegramFoldersPath = path.join(__dirname, telegramFoldersPathText);
const telegramCommandFolders = fs.readdirSync(telegramFoldersPath);

deployCommands(client, telegramCommandFolders, telegramFoldersPath);

process.once('SIGINT', () =>
{
    client.stop('SIGINT')
});

process.once('SIGTERM', () =>
{
    client.stop('SIGTERM')
});

process.once('exit', () => setBot('The Void Telegram', false) );

setBot('The Void Telegram', true);
setDevelopClient(client);

let nextIdDate = new Date().getTime();

client.hears('Я хочу узнать id канала', async(message): Promise<'error'|0> =>
{
    try
    {
        const now = new Date().getTime();
        const isAuthor: boolean = message.from.id === Number(config.telegramAuthorId)

        if(nextIdDate > now && !isAuthor)
            return 'error';
        
        if(!isAuthor)
            await message.reply(`Ваш Id канала: ${message.chat.id}\nСледующее использование команды через час`);
        else
            await message.reply(`Ваш Id канала, сэр: ${message.chat.id}`);

        return 0;
    }
    catch (error)
    {
        console.log(error);
        return 'error';
    }
    finally
    {
        if(message.from.id != Number(config.telegramAuthorId))
            nextIdDate += 3600000;
    };
});

client.on('message', async (message) =>
{
	messageListener(message)
});

client.launch();