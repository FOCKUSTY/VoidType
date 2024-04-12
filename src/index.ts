import {
	Client,
	Collection,
	Events,
	GatewayIntentBits,
	Partials,
} from 'discord.js';

import { modalSubmit } from './discord/events/modals';
import { skip } from './discord/utils/developConsole';

import {
	authorId,
	kristyId,
	telegramToken,
	token
} from '../config.json';

import { Random } from 'random-js';
import { Telegraf } from 'telegraf';
import { intCreate } from './discord/events/interaction-create';
import { checkKristyStatus } from './discord/utils/activity';
import { indexDeployCommands } from './discord/utils/deployCommands';
import { messageCreateLog, messageDeleteLog, messageUpdateLog } from './discord/utils/logging/messageLog';
import { sendMessageLog } from './discord/utils/messageLog';
import { deployCommands } from './telegram/deploy-commands-telegram';
import { messageListener } from './telegram/utility/messageListener';

import fs from 'node:fs';
import path from 'node:path';
import { setBot } from './utility/bots';
import { buttonsListener } from './discord/events/buttonsListener';
const r = new Random();
const actH = [];

const client = new Client({
	intents:
	[
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildPresences
	],
	partials:
	[
		Partials.Channel
	],
});

const tClient = new Telegraf(telegramToken);

const Commands = new Collection();
const globalfoldersPathText = 'discord/globalCommands';
const globalfoldersPath = path.join(__dirname, globalfoldersPathText);
const globalcommandFolders = fs.readdirSync(globalfoldersPath);

const guildFoldersPathText = 'discord/guildCommands';
const guildFoldersPath = path.join(__dirname, guildFoldersPathText);
const guildCommandFolders = fs.readdirSync(guildFoldersPath);

const telegramFoldersPathText = 'telegram/commands';
const telegramFoldersPath = path.join(__dirname, telegramFoldersPathText);
const telegramCommandFolders = fs.readdirSync(telegramFoldersPath);

console.log(`Мои команды:`);
indexDeployCommands(globalcommandFolders, globalfoldersPath, client, Commands);

skip();

console.log('Мои команды гильдии:');
indexDeployCommands(guildCommandFolders, guildFoldersPath, client, Commands);

skip();

console.log('Мои telegram команды:');
deployCommands(tClient, telegramCommandFolders, telegramFoldersPath);

const eventsPath = path.join(__dirname, 'discord/events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));

for (const file of eventFiles)
{
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);

	if (event.once)
		client.once(event.name, (...args) => event.execute(...args));
	
	else
		client.on(event.name, (...args) => event.execute(...args));
}

client.on(Events.InteractionCreate, async interaction =>
{
	intCreate(Commands, interaction);
	modalSubmit(interaction);
	buttonsListener(interaction)
});

client.on(Events.MessageCreate, (message) => messageCreateLog(message));
client.on(Events.MessageUpdate, (m, nm) => messageUpdateLog(m, nm, sendMessageLog));
client.on(Events.MessageDelete, (m) => messageDeleteLog(m, sendMessageLog));

let oldActivity: any;

client.on(Events.PresenceUpdate, (oldPresence, newPresence) =>
{
	if(newPresence.userId === kristyId || newPresence.userId === authorId)
	{
		for(let activity of newPresence.activities)
		{
			if(activity.name === 'Custom Status')
			{
				if(oldActivity != activity.state)
				{
					oldActivity = activity.state;
					checkKristyStatus(client, `${activity.state}`.toLocaleLowerCase());
				}
				else return;
			}
		};
	}
	else return;
});

process.once('exit', () => setBot('The Void Discord', false) );

process.once('SIGINT', () =>
{
    tClient.stop('SIGINT')
});

process.once('SIGTERM', () =>
{
    tClient.stop('SIGTERM')
});

client.login(token);

tClient.on('message', async message => messageListener(message) );

tClient.launch();