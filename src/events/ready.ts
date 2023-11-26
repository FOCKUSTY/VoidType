import { Client, Events } from "discord.js";
import { commands } from "../SlashCommands";

export = {
    name: Events.ClientReady,
    once: true,
    async execute(client: Client) {
        if (!client.user || !client.application) {
            return;
        };

        await client.application.commands.set(commands);

		console.log(`Готово! The Void готов к работе, как ${client.user.tag}\n`);
    }
}