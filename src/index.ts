import { Client, Events, GatewayIntentBits, Collection, Interaction, Guild, InteractionType, EmbedBuilder, TextChannel } from "discord.js";
// import { Tags } from "./develop";
import fs from 'node:fs';
import path from 'node:path';
import { config } from "./config";
import { intCreate } from './events/interaction-create';
import { modalSubmit } from "./events/modals";

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
  ],
});

const Commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders)
{
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
	for (const file of commandFiles)
  {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command)
    {
      Commands.set(command.data.name, command)
			client.application?.commands.set(command.data.name, command);
		}
    else
    {
      if(!(filePath==='F:\\VoidBotTs\\src\\commands\\utility\\download.ts'))
      {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
      }
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));

(async () =>
{
  console.log('Начало обновления обработчиков событий')
  for (const file of eventFiles)
  {
    const filePath = path.join(eventsPath, file);
    const event = await require(filePath);
    if (event.once)
    {
      client.once(event.name, (...args) => event.execute(...args));
    }
    else
    {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
  console.log('Конец обновления обработчиков событий')
})();

client.on(Events.InteractionCreate, int => modalSubmit(int));
client.on(Events.InteractionCreate, async(interaction: Interaction) => intCreate(Commands, interaction));

client.login(config.DISCORD_TOKEN);