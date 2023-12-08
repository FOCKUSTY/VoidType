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

        await client.application.commands.set(commands);

		client.guilds.cache.forEach(guild => {
			guilds.push(guild)
		});
			
			downloadActivities();	
			console.log(`Рандомные активности:`.bold + `\n`);
			for (let e of randomActivity) {
				console.log(`${e[0]} - ${randomActivity.indexOf(e)}`);
			};

			console.log(`Всего ${actLength()} Активность(и)(ей)`);
			
            for(let el of actLengths) {
				console.log(`Всего ${el[0]} ${el[1]}`);
				actDownload += Number(el[0]);
			};

			console.log(`Всего загружено: ${actDownload} разных(ые) активности(ей)`);
			console.log();
	
			functionRandomActivity(client, guilds);
	
			setInterval(() => {
				functionRandomActivity(client, guilds);
			}, 60000);

            console.log(`Готово! The Abissia готова к работе в The Void, мое имя ${client.user.tag}\n`);

    }
}