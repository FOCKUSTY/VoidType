import { Events, ActivityType, REST, Client } from 'discord.js'
import { functionRandomActivity } from '../utils/randomActivities'
import { getActivities, downloadActivities } from '../utils/updatejson'
import { setGMPlaying } from '../utils/music'
import { setDevelopClient, setDevelop, getDiscordUser } from '../utils/develop'
import { setUsernames, getAmount } from '../utils/user'
import { Tags, logMessagesSchema, deleteTable, sequelize } from '../utils/tags'
import { checkNumber } from '../utils/stages'
import { skip } from '../utils/developConsole'
import { changeComma } from '../utils/changeComma'
import { readAllMessageFromIdeaChannel } from '../utils/ideaMethods'
import { checkKristyNickname } from '../utils/checkNickname'
import { setActivity } from '../utils/activity'
import { config } from '../config'
import { setBot } from '../../utility/bots'
	
import fs from 'fs'
import path from 'node:path'

const guilds: any[] = [];

const rest = new REST().setToken(config.token);

module.exports =
{
	name: Events.ClientReady,
	once: true,
	async execute(client: Client)
	{
		if(!client.user) return;

		// deleteTable(logMessagesSchema);

		Tags.sync();
		logMessagesSchema.sync();

		setDevelop(client);
		setGMPlaying(client);
		setDevelopClient(client);
		setUsernames(client);
		readAllMessageFromIdeaChannel(client);

		setBot('The Void Discord', true);

		client.user.setPresence({ activities: [ { name: 'The Void' } ], status: 'idle' });
		client.user.setActivity('The Void Community~', { type: ActivityType.Playing });
		
		client.guilds.cache.forEach((guild: any) => {	guilds.push(guild)	});

		try
		{			
			setTimeout(async () =>
			{
				downloadActivities();

				const randomActivity = getActivities('randomActivity');

				console.log(`Рандомные активности:`.bold + `\n`);
				for ( let el of randomActivity )
				{
					console.log(`${el[0]}` + ` - ${`${randomActivity.indexOf(el)}`}`);
				};

				const dumplingCount = getAmount('totalUsers');
				const serversCount = getAmount('totalGuilds');
				const botsCount = getAmount('totalBots');

				const dumplingCountNumeral = checkNumber(dumplingCount, {dumpling: ['пельмень', 'пельменя', 'пельменей']});
				const serversCountNumeral = checkNumber(serversCount, {servers: ['сервер', 'сервера', 'серверов']});
				const botsCountNumeral = checkNumber(botsCount, {spareParts: ['запчасть', 'запчасти', 'запчастей']});

				const dumplingsCountFromEachServer = Math.round(dumplingCount/serversCount*10)/10;
				const botsCountNumberalFromEachServer = Math.round(botsCount/serversCount*10)/10;

				const dumplingsCountFromEachServerNumeral = checkNumber(dumplingsCountFromEachServer, {dumpling: ['пельмень', 'пельменя', 'пельменей']})
				const botsCountNumberalFromEachServerNumeral = checkNumber(botsCountNumberalFromEachServer, {spareParts: ['запчасть', 'запчасти', 'запчастей']})

				skip();
				
				console.log(`Всего собрано ${dumplingCount} ${dumplingCountNumeral} с ${serversCount} ${serversCountNumeral}`);
				console.log(`Также собрано ${botsCount} ${botsCountNumeral} с ${serversCount} ${serversCountNumeral}`)
				console.log(`В среднем с каждого сервера ${changeComma(dumplingsCountFromEachServer)} ${dumplingsCountFromEachServerNumeral}, а также ${changeComma(botsCountNumberalFromEachServer)} ${botsCountNumberalFromEachServerNumeral}`);
				
				skip();

				if(client.user) console.log(`Готово! The Void готов к работе, как ${client.user.tag}\n`);

				setTimeout(() =>
				{
					setActivity(client, 'Собираю пельмени...', 'actTypes.cust');
					
					setTimeout(() => { setActivity( client, `Собрал! Всего собрано ${dumplingCount} ${dumplingCountNumeral} с ${serversCount} ${serversCountNumeral}`, 'actTypes.cust' ) }, 3000);
					setTimeout(() => { setActivity( client, `Также подсчитано ${botsCount} ${botsCountNumeral} с ${serversCount} ${serversCountNumeral}`, 'actTypes.cust') }, 10000);
					setTimeout(() => { setActivity( client, `В среднем ${changeComma(dumplingsCountFromEachServer)} ${dumplingsCountFromEachServerNumeral} и ${changeComma(botsCountNumberalFromEachServer)} ${botsCountNumberalFromEachServerNumeral}`, 'actTypes.cust') }, 15000);
				}, 1000);

				setTimeout(() =>
				{					
					functionRandomActivity(client, guilds, false, true);
					checkKristyNickname(client, true);
				}, 20000);

				setInterval(async () => { checkKristyNickname(client, false) }, 600000);
				setInterval(async () => { functionRandomActivity(client, guilds, false, true) }, 60000);
			}, 5000);
		}
		catch (err)
		{
			console.log(err)
		}

	},
};