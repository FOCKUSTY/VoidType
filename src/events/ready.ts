import { Client, Events } from "discord.js";
import { commands } from "../SlashCommands";
import { randomActivity, functionRandomActivity, actLengths, actLength, downloadActivities } from '../develop'

const guilds: any[] = [];
let actDownload = 0;

export = {
    name: Events.ClientReady,
    once: true,
    async execute(client: Client) {
        if (!client.user || !client.application) {
            return;
        };

		if(!client.application?.commands) await client.application.commands.set(commands);

		client.guilds.cache.forEach(guild => {
			guilds.push(guild)
		});
		
		setTimeout(() => { downloadActivities();
			if(!client||!client.user) return;
			console.log(`Рандомные активности:\n`);
			for (let e of randomActivity) {
				console.log(`${e[0]} - ${randomActivity.indexOf(e)}`);
			};
			console.log()

			console.log(`Всего ${actLength()} Активность(и)(ей)`);
			for(let el of actLengths) {
				console.log(`Всего ${`${el[0]}`} ${el[1]}`);
				actDownload += Number(el[0]);
			};

			console.log(`Всего загружено: ${actDownload} разных(ые) активности(ей)`);
			console.log();
	
			console.log(`Готово! The Abissia готова к работе в The Void, мое имя ${client.user.tag}\n`);
	
			functionRandomActivity(client, guilds);
	
			setInterval(() => {
				functionRandomActivity(client, guilds);
			}, 80000);
		}, 5000);
    }
}