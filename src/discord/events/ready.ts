import { Events, ActivityType, REST, Client } from 'discord.js'
import { functionRandomActivity } from '../utils/randomActivities'
import { getActivities, downloadActivities } from '../utils/updatejson'
import { setGMPlaying } from '../utils/music'
import { setDevelopClient, setDevelop, getDiscordUser } from '../utils/develop'
import { setUsernames, getAmount } from '../utils/user'
import { sequelize } from '../utils/tags'
import { checkNumber } from '../utils/stages'
import { skip } from '../utils/developConsole'
import { changeComma } from '../utils/changeComma'
import { debug } from '../utils/developConsole';
import { readAllMessageFromIdeaChannel } from '../utils/ideaMethods'
import { checkKristyNickname } from '../utils/checkNickname'
import { setActivity } from '../utils/activity'
import { config } from '../config'
import { setBot } from '../../utility/bots'
	
import fs from 'fs'
import path from 'node:path'

const devDebug = true;

const guilds: any[] = [];

const rest = new REST().setToken(config.token);

export =
{
	name: Events.ClientReady,
	once: true,
	async execute(client: Client)
	{
		if(!client.user)
			return;

		// deleteTable(logMessagesSchema);

		sequelize.sync();

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
				if(!client.user)
					return;

				downloadActivities();

				const randomActivity = getActivities('randomActivity');

				debug([`Рандомные активности:\n`], devDebug, false, false);
				
				for (let el of randomActivity)
					debug([`${el[0]} - ${`${randomActivity.indexOf(el)}`}`], devDebug, false, false);

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
				
				debug([`Всего собрано ${dumplingCount} ${dumplingCountNumeral} с ${serversCount} ${serversCountNumeral}`], devDebug, false, false);
				debug([`Также собрано ${botsCount} ${botsCountNumeral} с ${serversCount} ${serversCountNumeral}`], devDebug, false, false);
				debug([`В среднем с каждого сервера ${changeComma(dumplingsCountFromEachServer)} ${dumplingsCountFromEachServerNumeral}, а также ${changeComma(botsCountNumberalFromEachServer)} ${botsCountNumberalFromEachServerNumeral}`], devDebug, false, false);
				
				skip();

				debug([`Готово! The Void готов к работе, как ${client.user.tag}\n`], true, true, false);

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