import Formatter, { Colors } from 'service/formatter.service';
import ICL from 'discord/events/interaction-create.listener';
import ML from 'discord/events/modal.listener';

import { config } from 'config';
import { Debug } from 'develop/debug.develop';

import { WriteCommands } from 'discord/deploy.commands';
import { DeployEvents } from 'discord/deploy.events';

import {
	Client as DiscordClient,
    Collection,
    Events,
    GatewayIntentBits,
    Partials
} from 'discord.js';

const Client = new DiscordClient({
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

Debug.Console.clear();
Debug.Log([Formatter.Color('Начало программы', Colors.magenta)]);

const Commands = new Collection();
const Cooldowns = new Collection();

WriteCommands(Commands, Client);
DeployEvents(Client);

Client.on(Events.InteractionCreate, async interaction => {
    ICL.InteractionCreate(interaction, Commands, Cooldowns);
	ML.ModalListener(interaction);
});

Client
	.login(config.clientToken)
	.catch((e) => Debug.Error(e));

export {
	Commands
}

export default Client;