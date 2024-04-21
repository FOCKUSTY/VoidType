import { functionRandomActivity } from './randomActivities';
import { OneTime } from './OneTimeFunction';
import { checkKristyStatus } from '../utils/activity';
import { debug } from 'dev@console';
import config from 'config';

let count = 0;
let trueWarnMessage = 'Общение и так началось...';
let falseWarnMessage = 'Общение и так закончено...';

let isChatting = false;

const guilds: any = [];

/* const actType =
{
  'Играет': `Играет в`,
  'Стримит': `Стримит`,
  'Слушает': `Слушает`,
  'Смотрит': `Смотрит`,
  'Кастомный': ``,
  'Соревнуется': `Соревнуется в`
}; */
const actType = new Map()
  .set('Играет',      `Играет в`)
  .set('Стримит',     `Стримит`)
  .set('Слушает',     `Слушает`)
  .set('Смотрит',     `Смотрит`)
  .set('Кастомный',   ``)
  .set('Соревнуется', `Соревнуется в`)

const setBooleanChatting = (boolean: boolean) =>
{
	if(isChatting === true && boolean === true) return trueWarnMessage;
	if(isChatting === false && boolean === false) return falseWarnMessage;

	isChatting = boolean;
};

class Timer
{
    name: string;
    delay: number;
    func: any;
    value: any[];
    timeOut: any;

	constructor(name: string, delay: number, func: any, ...value: any)
	{
		this.name = name;
		this.delay = delay;
		this.func = func;
		this.value = value
		this.timeOut;
	};

	setTimer()
	{
		this.timeOut = setTimeout(() =>
		{
			debug(['Function:', this.func], false);
			debug(['Value:', ...this.value], false);
			debug(['Delay:', this.delay], false);

			this.func(...this.value);
		}, this.delay);
	};

	clearTimer()
	{
		clearTimeout(this.timeOut);
	};

}

let chattingWithKristyTimer = new Timer('chattingWithKristyTimer', 10000, setBooleanChatting, [false]);

const getBooleanChatting = () =>
{
	debug(['isChatting:', isChatting], false);
	return isChatting;
};

const guildOneTime = new OneTime(false, 'guildsOneTime');

const setGuilds = (client: any) =>
{
	guildOneTime.oneTimeFunction(true, true, false);

	client.guilds.cache.forEach((guild: any) =>
	{
		guilds.push(guild);
	});
};

const chattingWithKristy = async (m: any) =>
{
	setBooleanChatting(true);

	chattingWithKristyTimer.clearTimer();	
	chattingWithKristyTimer.setTimer();

	if(m.channel?.id!=`${config.channelWithKristyChattingId}`) return;
	if(m.mentions.users.get(`${config.clientId}`)===undefined) return;
	if(!getBooleanChatting()) return;
	// if(m.author.id!=`${authorId}`) return;
	if(m.author.id ===`${config.kristyId}` || m.author.id ===`${config.authorId}`)
	{
		const kristyUser = await m.guild?.members?.fetch(`${config.authorId}`);
		// const kristyUser = await m.guild?.members?.fetch(`${kristyId}`);
		const kristyStatus = kristyUser.presence?.status;
		if(kristyStatus===undefined||kristyStatus===null||kristyStatus==='offline') return;
	
		count++;
		if(count>1) return;
	
		if(!guildOneTime.oneTimeFunction(true, true, true))
		{
			setGuilds(m.client);
		}
	
		const text = functionRandomActivity(m.client, guilds, true, false);
	
		m.client.channels.cache.get(m.channel.id).sendTyping();
	
		setTimeout(async () =>
		{
			let replyed = false;

			text
				.then(async function(message: any)
				{
					await checkKristyStatus(null, `${m.content}`.toLocaleLowerCase(), true)
						.then(async (text: any) =>
						{
							if(!!text)
							{
								debug([message[1], message[0]], false);
								debug([m.content, text], false);
								await m.reply(`${actType.get(`${text[1]}`)} ${text[0]}`);
								replyed = true;
								return;
							};
						})
						.catch((err) => { console.error(err) })

					setTimeout(async () =>
					{
						debug([message[1], message[0]], false)
						if(!replyed) await m.reply(`${actType.get(`${message[1]}`)} ${message[0]}`);
					}, 1000);

				})
				.catch(function(err) { console.log(err) } );
			count = 0;
		}, 2000);
	}
	else return;
}

export
{
	chattingWithKristy,
	getBooleanChatting,
	setBooleanChatting
}