import { Client, Events } from "discord.js";
import { guildCommands, globalCommands } from "../SlashCommands";
import { functionRandomActivity } from "../utils/randomActivities";
import { downloadActivities, getActivities } from "../utils/updateActivities";
import { setDevelop } from "../utils/develop";
import { Tags, logMessagesSchema } from '../utils/tags'
import { readAllMessageFromIdeaChannel } from '../utils/ideaMethods'

const randomActivity = getActivities('randomActivity');
const guilds: any[] = [];

module.exports =
{
    name: Events.ClientReady,
    once: true,
    async execute(client: Client)
	{
        if (!client.user || !client.application) return;

		// if(!client.application?.commands) await client.application.commands.set(commands);

		Tags.sync();
		logMessagesSchema.sync();

		readAllMessageFromIdeaChannel(client);

		client.guilds.cache.forEach(guild => {
			guilds.push(guild)
		});
		
		setDevelop(client)

		setTimeout(() =>
		{
			downloadActivities();
		
			if(!client||!client.user) return;
			console.log(`Рандомные активности:\n`);

			for (let el of randomActivity)
			{
				console.log(`${el[0]} - ${randomActivity.indexOf(el)}`);
			};
	
			console.log(`Готово! The Abissia готова к работе в The Void, мое имя ${client.user.tag}\n`);
	
			functionRandomActivity(client, guilds);
	
			setInterval(() => {
				functionRandomActivity(client, guilds);
			}, 80000);
		}, 5000);
    }
}