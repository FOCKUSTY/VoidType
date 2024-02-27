import { functionRandomActivity } from './randomActivities';
import { OneTime } from './OneTimeFunction';
import { checkKristyStatus } from '../utils/activity';
import { clientId, kristyId, channelWithKristyChattingId, authorId } from '../../../config.json';

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

	constructor(name: string, delay: number, func: any, value: any)
	{
		this.name = name;
		this.delay = delay;
		this.func = func;
		this.value = value
		this.timeOut;
	};

	setTimer()
	{
		this.timeOut = setTimeout(() => { this.func(...this.value) }, this.delay);
	};

	clearTimer()
	{
		clearTimeout(this.timeOut);
	};

}

let chattingWithKristyTimer = new Timer('chattingWithKristyTimer', 10000, setBooleanChatting, false);

const getBooleanChatting = () =>
{
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

const chattingWithKristy = async (m: { channel: { id: string; }; mentions: { users: { get: (arg0: string) => undefined; }; }; author: { id: string; }; guild: { members: { fetch: (arg0: string) => any; }; }; client: { channels: { cache: { get: (arg0: any) => { (): any; new(): any; sendTyping: { (): void; new(): any; }; }; }; }; }; content: any; reply: (arg0: string) => any; }) =>
{
	setBooleanChatting(true);

	chattingWithKristyTimer.clearTimer();	
	chattingWithKristyTimer.setTimer();

	if(m.channel?.id!=`${channelWithKristyChattingId}`) return;
	if(m.mentions.users.get(`${clientId}`)===undefined) return;
	if(!getBooleanChatting()) return;
	// if(m.author.id!=`${authorId}`) return;
	if(m.author.id ===`${kristyId}` || m.author.id ===`${authorId}`)
	{
		const kristyUser = await m.guild?.members?.fetch(`${authorId}`);
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
					checkKristyStatus(null, `${m.content}`.toLocaleLowerCase(), true)
						.then(async (text: any) =>
						{
							if(!!text)
							{
								await m.reply(`${actType.get(`${text[1]}`)} ${text[0]}`);
								replyed = true;
								return;
							};
						})
						.catch((err) => { console.error(err) })

					setTimeout(async () =>
					{
						if(!replyed) await m.reply(`${actType.get(`${message[1]}`)} ${message[0]}`);
					}, 1000);

				})
				.catch(function(err) { console.log(err) } );
			count = 0;
		}, 2000);
	}
	else return;
}

module.exports =
{
	chattingWithKristy,
	getBooleanChatting,
	setBooleanChatting
}