import { Client, Events } from "discord.js";
import { commands } from "../SlashCommands";
import { functionRandomActivity } from "../utils/randomActivities";
import { downloadActivities, getActivities } from "../utils/updateActivities";

const randomActivity = getActivities('randomActivity');
const guilds: any[] = [];

module.exports =
{
    name: Events.ClientReady,
    once: true,
    async execute(client: Client)
	{
        if (!client.user || !client.application) return;

		if(!client.application?.commands) await client.application.commands.set(commands);

		client.guilds.cache.forEach(guild => {
			guilds.push(guild)
		});
		
		setTimeout(() =>
		{
			downloadActivities();
		
			if(!client||!client.user) return;
			console.log(`Рандомные активности:\n`);

			for (let e of randomActivity)
			{
				console.log(`${e[0]} - ${randomActivity.indexOf(e)}`);
			};
	
			console.log(`Готово! The Abissia готова к работе в The Void, мое имя ${client.user.tag}\n`);
	
			functionRandomActivity(client, guilds);
	
			setInterval(() => {
				functionRandomActivity(client, guilds);
			}, 80000);
		}, 5000);
    }
}