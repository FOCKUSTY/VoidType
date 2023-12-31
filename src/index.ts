import { Client, Events, GatewayIntentBits, Collection, Interaction, Guild, InteractionType, EmbedBuilder, TextChannel } from "discord.js";
// import { Tags } from "./develop";
import fs from 'node:fs';
import path from 'node:path';
import { config } from "./config";
import { intCreate } from './events/interaction-create'
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

const commands = new Collection();
const filesPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(filesPath).filter(file => file.endsWith('.ts'));

(async () => {
  for (const file of commandFiles) {
    const filePath = path.join(filesPath, file);
    const command = await require(filePath);
    if ('data' in command && 'execute' in command) {
      commands.set(command.data.name, command);
    } else {
      if(filePath==='D:\\VoidBotTs\\src\\commands\\download.ts') continue;
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
})();

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));

(async () => {
  console.log('Начало обновления обработчиков событий')
  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = await require(filePath);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
  console.log('Конец обновления обработчиков событий')
})();

client.on(Events.InteractionCreate, int => modalSubmit(int))
client.on(Events.InteractionCreate, async(interaction: Interaction) => intCreate(commands, interaction))
/* client.on(Events.VoiceStateUpdate, (oldVS, VS) => {console.log(true)})
 */
client.login(config.DISCORD_TOKEN);