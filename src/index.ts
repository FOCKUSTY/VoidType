import { Client, Guild } from "discord.js";
import { config } from "./config";
// import { deployCommands } from "./deploy-commands";
import interactionCreate from "./events/interaction-create";
import ready from "./events/ready";

const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

interactionCreate(client);
ready(client);

client.login(config.DISCORD_TOKEN);