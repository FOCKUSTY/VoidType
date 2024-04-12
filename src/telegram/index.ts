import { Telegraf } from 'telegraf';
import { telegramToken } from '../../config.json';
import { deployCommands } from './deploy-commands-telegram';
import { messageListener } from './utility/messageListener';
import { message } from 'telegraf/filters';
const { setBot } = require('../utility/bots')

const client = new Telegraf(telegramToken);

deployCommands(client)

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

client.on('message', async message =>
{
	messageListener(message)
})

client.launch();