import { Client } from "discord.js";
import { Commands } from "../SlashCommands";

export default (client: Client): void => {
    client.on("ready", async () => {
        if (!client.user || !client.application) {
            return;
        }
        
        client.application.commands.set(Commands);

        console.log(`Готово ! ${client.user.username} готов к работе !`);
    });
};