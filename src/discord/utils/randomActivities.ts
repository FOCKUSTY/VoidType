import { skip, debug } from './developConsole'
import { shuffle } from './shuffle'
import { ActivityType, Client } from 'discord.js'
import { getActivities, funcKristyAct } from './updatejson'
import { pseudoRandomNumber } from './pseudoRandom'
import { copy } from './copyArray'
import { checkNumber } from './stages'
import { oneTimeFunction, OneTime } from './OneTimeFunction'
import { User, getUser, getUsers, setUser, setUsernames, getRandomUserInformation } from './user'
import { checkKristyStatus } from './activity'
import { kristyGuildId, kristyId, authorId } from '../../../config.json'

const
  actTypes =
  {
    play:   {   type: ActivityType.Playing    },
    stream: {   type: ActivityType.Streaming  },
    listen: {   type: ActivityType.Listening  },
    watch:  {   type: ActivityType.Watching   },
    cust:   {   type: ActivityType.Custom     },
    comp:   {   type: ActivityType.Competing  },
  },
  
  actType =
  [
    `Играет`,
    `Стримит`,
    `Слушает`,
    `Смотрит`,
    `Кастомный`,
    `Соревнуется`
  ];

const fs = require('node:fs')
const path = require('node:path');

let
  randomActivityHistory: any[] = [],
  randomAnimeTitles: any[] = [],
  randNum: any[]       = [],
  randNames: any[]     = [],
  randNumName: any[]   = [],
  randNumGuild: any[]  = [],
  guildTexts: any[]    = [],
  texts: any = [];

let countOfFunctionActivate = 0;

let
  guildActivities =   getActivities('guildActivities'),
  namesActivities =   getActivities('namesActivities'),
  randomActivity  =   getActivities('randomActivity'),
  randomNames     =   getActivities('randomNames');

const setRandomnessActivity = (client: { user: { setActivity: (arg0: string, arg1: any) => void } }, textActivity=false, log=true) => 
{
    try
    {
      if(!client||!client.user) return;
      
      const i = pseudoRandomNumber(0, randomActivity.length-1, 10, 2, randomActivityHistory, undefined, undefined, true, true, true);
      let randomAct = randomActivity[i][0];
      const randomActType = randomActivity[i][1];
      const numRandomActType = actType[randomActivity[i][1]?.type];

      if(randomAct.indexOf('${rAnimeTitle}') != -1)
      {
        const pathToTitle = path.join('../../../VoidDataBase/titles.json');
        const file = (fs.readFileSync(pathToTitle, {encoding: 'utf8'}));

        let json: { [x: string]: any };
        let animeNames: any;

        JSON.stringify(file, (key, value) =>
        {
          json = eval(` ${json} = ${value}`);
          animeNames = json['animeNames'];
        });

        const rAnimeTitle = animeNames[pseudoRandomNumber(0, animeNames.length-1, 1, 2, randomAnimeTitles, undefined, undefined, true, true)];
        randomAct = randomAct.replace('${rAnimeTitle}', `${rAnimeTitle}`);
      };

      if(log) debug(`Рандомная активность: ${i} из "${randomActivity.length}"`);
      if(log) debug(`Активность изменена на: ${randomAct}, тип: "${numRandomActType}"`);

      if(textActivity) return [randomAct, numRandomActType];

      client.user.setActivity(`${randomAct}`, randomActType);
    }
    catch (err)
    {
      debug([err, true]);
    }
};

const setRandomnessGuildActivity = (client: { user: { setActivity: (arg0: string, arg1: any) => void } }, guilds: string | any[], textActivity=false, log=true) =>
{
  try
  {
    if(!client||!client.user) return;

    let rGuild = pseudoRandomNumber(0, guilds.length-1, 3, 1, randNumGuild);
    const rGuildName = guilds[rGuild]?.name;

    funcGuildTexts(rGuildName);

    const randNum = pseudoRandomNumber(0, guildTexts.length-1, undefined, undefined, undefined, undefined, undefined, true, true);
    
    const text = guildTexts[randNum][0];
    const textAct = guildTexts[randNum][1];
    const textActType = guildTexts[randNum][2];
    
    if(log) debug(`Рандомный сервер: ${rGuildName} (${rGuild}) из "${guilds.length}"`);
    if(log) debug(`Активность изменена на: ${text} тип: "${textActType}"`);
    
    if(textActivity) return [text, textActType];

    client.user.setActivity(`${text}`, textAct);
  }
  catch (err)
  {
    debug([err, true]);
  };
}

const setGuildsLengthActivity = (client: { user: { setActivity: (arg0: string, arg1: { type: ActivityType }) => void } }, guilds: string | any[], textActivity=false, log=true) =>
{
  try
  {
    if(!client||!client.user) return;
    let text = `Я уже на ${guilds.length}`
    
    const stages =
    {
      one: ['сервере', 'серверах', 'серверах']
    };
    
    text = `${text} ${ checkNumber(guilds.length, stages) }`;
    
    if(log) debug(`Активность изменена на: ${text}, тип: ${actType[4]}`);
    
    if(textActivity) return [text, 'Кастомный'];

    client.user.setActivity(`${text}`, actTypes.cust);
  }
  catch (err)
  {
    debug([err, true]);
  }
}

const setRandomnessNameActivity = (client: { user: { setActivity: (arg0: string, arg1: { type: ActivityType }) => void } }, textActivity=false, log=true) =>
{
  try
  {
    if(!client||!client.user) return;
    let randomNumberName = pseudoRandomNumber(0, randomNames.length-1, 30, 20, randNumName);
    
    const rName = randomNames[randomNumberName];
    texts = nameTexts(rName, texts);
    const randomTextNumber = pseudoRandomNumber(0, texts.length-1, undefined, undefined, undefined, undefined, undefined, true, true);
    
    let text = texts[randomTextNumber];
  
    if(log)
    {
      debug(`Рандомное число: ${randomNumberName} из "${randomNames.length}"`);
      debug(`Рандомное число: ${randomTextNumber} из "${texts.length}"`);
      debug(`Рандомное текст: ${text}`);
      debug(`Активность изменена на: ${text}, тип: "${actType[4]}"`);
    };

    if(textActivity) return [text, 'Кастомный'];

    client.user.setActivity(`${text}`, { type: ActivityType.Custom });
  }
  catch (err)
  {
    debug([err, true]);
  };
};

const functionRandomActivity = async (client: any, guilds: any[], textActivity=false, log=true) =>
{
  try
  {
    if(countOfFunctionActivate>=10)
    {
      guildActivities = getActivities('guildActivities');
      namesActivities = getActivities('namesActivities');
      randomActivity  = getActivities('randomActivity');
      randomNames     = getActivities('randomNames');
      
      countOfFunctionActivate = 0;
    };
    
    countOfFunctionActivate+=1 
  }
  catch (err)
  {
    console.error(err);
  }

  try
  {
    if(!client||!client.user) return;
    
    funcKristyAct(client, log);
    
    let rNum = pseudoRandomNumber(0, 100, 10, 2, randNum);
    
    if(log) debug(`Рандомное число: ${rNum} из "100"`);
    
    if(rNum>=15)
    {
      if(textActivity) return await setRandomnessActivity(client, textActivity, log);
      else
      {
        if(rNum>=90)
        {
          let count = 0;
          const setActivity = async (): Promise<void> =>
          {
            const userInformation = await getRandomUserInformation('userId-guildId-username-guildName')
            const guild = await client.guilds.fetch(`${userInformation[1]}`);
            const user = await guild.members.fetch(`${userInformation[0]}`);
            const activities = user?.presence?.activities
            
            count+=1;
            if(count<20) if(!activities[0]?.name || activities[0]?.name === 'Custom Status') return setActivity();
            
            if(log)
            {
              debug(`Название гильдии: ${userInformation[3]}`);
              debug(`Имя пользователя: ${userInformation[2]}`);
              skip();
            };
    
            if(activities[0]?.name)
            {
              client.user.setActivity(`${activities[0]?.name}`);
              
              if(log)
              {
                debug(`Рандомная активность: ${activities[0]?.name}`);
                skip();
              }
            }
            else
            {
              setRandomnessActivity(client, textActivity, log);
            }
            count = 0;
          };
          setActivity();
        }
        else setRandomnessActivity(client, textActivity, log);
      }
    }
    else if (rNum<10)
    {
      if(rNum>=5) 
      {
        if(textActivity) return await setGuildsLengthActivity(client, guilds, textActivity, log);
        else setGuildsLengthActivity(client, guilds, textActivity, log);
      }
      else
      {
        if(textActivity) return await setRandomnessGuildActivity(client, guilds, textActivity, log);
        else setRandomnessGuildActivity(client, guilds, textActivity, log);
      }
    }
    else
    {
      if(textActivity) return await setRandomnessNameActivity(client, textActivity, log);
      else setRandomnessNameActivity(client, textActivity, log);
    }
    if(log) skip();
  }
  catch (err)
  {
    skip(2);
    debug( 'Произошла ошибка при смене активности.' );
    client.user.setActivity( 'Произошла ошибка при смене активности.' );
    debug([err, true]);
    skip(2);
  };
};

const funcGuildTexts = (guildName: any) =>
{
  guildTexts.length = 0
  guildTexts = copy(guildActivities);
  
  for(let i in guildTexts) guildTexts[i][0] = guildTexts[i][0].replaceAll('rGuildName', `${guildName}`)
};

const nameTexts = ( rName: any, arr: any[], bool=false ) =>
{
  arr.length = 0;
  arr = copy(namesActivities);
  
  const r = pseudoRandomNumber(0, randomNames.length-1, 10, 10, randNames, undefined, undefined, true, true);
  const rNameTwo = randomNames[r];
  for (let i in arr) arr[i] = arr[i].replace('${rName}', `${rName}`).replace('${rNameTwo}', `${rNameTwo}`);
  
  if(bool) return arr.length;
  else return arr;
};

export
{
  setRandomnessActivity,
  setRandomnessGuildActivity,
  setGuildsLengthActivity,
  setRandomnessNameActivity,
  functionRandomActivity,
}