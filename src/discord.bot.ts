import ICL from 'discord/events/interaction-create.listener';
import ML from 'discord/events/modal.listener';

import { Debug } from 'develop/debug.develop';
import { config } from 'config';

import Deployer from 'discord/deploy.commands';
import DeployEvents from 'discord/deploy.events';

import path from 'path';
import fs from 'fs';

import {
	Client as DiscordClient,
    Collection,
    Events,
    GatewayIntentBits,
    Partials
} from 'discord.js';

const Client = new DiscordClient({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildPresences
	],
	partials: [
		Partials.Channel
	],
});

const Commands = new Collection();
const Cooldowns = new Collection();

Client.on(Events.InteractionCreate, async interaction => {
    ICL.InteractionCreate(interaction, Commands, Cooldowns);
	ML.ModalListener(interaction);
});

const Login = async () => {
	const foldersPath = path.join(__dirname, 'discord/commands');
	const commandsFolder = fs.readdirSync(foldersPath);

	const eventsPath = path.join(__dirname, 'discord/events');
	const eventFiles = fs.readdirSync(eventsPath)
		.filter(file => file.endsWith('.js') || file.endsWith('.ts'));

	new Deployer(foldersPath, commandsFolder).write(Client, Commands);
	new DeployEvents(eventsPath, eventFiles).execute();

	await Client
		.login(config.clientToken)
		.catch((e) => Debug.Error(e));
}

export {
	Commands,
	Login as LoginDiscord
};

export default Client;