import { Telegraf } from 'telegraf';

import { deployCommands } from 't@deploy-commands';
import { messageListener } from 't@l-msg';
import { setBot } from 'utility/bots';

import config from 'config';

const client = new Telegraf(config.telegramToken);

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