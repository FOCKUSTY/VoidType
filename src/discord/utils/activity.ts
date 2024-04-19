import { ActivityType, Client } from "discord.js";
import { debug } from '../utils/developConsole';
  
import
    {
		token,
		channelWithKristyChattingId,
		authorId,
		logGuildId,
		logChannelId,
		kristyId,
		clientId,
		telegramToken
	} from '../../../config.json';

import fs from 'fs';
import path from 'node:path';

import { TheVoidReplies } from '../../../../VoidDataBase/replyesActivity.json';
const repliesPath = path.join('../../../VoidDataBase/replyesActivity.json');

const actTypes =
{
  play:   {   type: ActivityType.Playing    },
  stream: {   type: ActivityType.Streaming  },
  listen: {   type: ActivityType.Listening  },
  watch:  {   type: ActivityType.Watching   },
  cust:   {   type: ActivityType.Custom     },
  comp:   {   type: ActivityType.Competing  },
};

const actType = new Map()
    .set('actTypes.play',   `Играет`)
    .set('actTypes.stream', `Стримит`)
    .set('actTypes.listen', `Слушает`)
    .set('actTypes.watch',  `Смотрит`)
    .set('actTypes.cust',   `Кастомный`)
    .set('actTypes.comp',   `Соревнуется`);

/* const actType =
{
  'actTypes.play': `Играет`,
  'actTypes.stream': `Стримит`,
  'actTypes.listen': `Слушает`,
  'actTypes.watch': `Смотрит`,
  'actTypes.cust': `Кастомный`,
  'actTypes.comp': `Соревнуется`
}; */

const devDebug = true;

let repliesSync: any;

const setActivity = (client: any, activity = 'Привет!', activityType = 'actTypes.play') =>
{
  const actType = eval(activityType);

  debug([`Устанавливаю активность: "${activity}"`], devDebug, false, false);

  client.user.setActivity(`${activity}`, actType);
}

const checkKristyStatus = async (client: any, kristyActivity: string, textActivity=false) =>
{
  try
  {
    let json = fs.readFileSync(repliesPath);

    await eval(`repliesSync = ${json}`);

    debug([repliesSync, json], false);

    for(let reply in repliesSync.TheVoidReplies)
    {
      if(`${kristyActivity}`?.toLowerCase()?.indexOf(`${reply}`) != -1)
      {
        if(textActivity)
          return [ repliesSync.TheVoidReplies[reply][0], actType.get(repliesSync.TheVoidReplies[reply][1]) ];

        setTimeout(() => { setActivity(client, repliesSync.TheVoidReplies[reply][0], repliesSync.TheVoidReplies[reply][1]) }, 10000);
        return true;
      }
      else
        continue;
    };
    return false;
  }
  catch (err)
  {
    debug([err], true, false, true);
  }
}

const presenceListener = (newPresence: { userId: string; activities: any; }, oldActivity: any, client: any) =>
{
  if(newPresence.userId === kristyId || newPresence.userId === authorId)
	{
		for(let activity of newPresence.activities)
		{
			if(activity.name === 'Custom Status')
			{
				if(oldActivity != activity.state)
				{
					oldActivity = activity.state;
					checkKristyStatus(client, `${activity.state}`.toLocaleLowerCase());
				}
				else
          return;
			}
		};
	}
	else
    return;
}

export
{
  setActivity,
  checkKristyStatus,
  presenceListener
}