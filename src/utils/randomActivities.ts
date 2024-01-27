import { skip, debug } from './developConsole';
import { shuffle } from './shuffle';
import { ActivityType } from 'discord.js';
import { getActivities } from './updateActivities';
import { pseudoRandomNumber } from './pseudoRandom';
import { copy } from './copyArray';
import { checkNumber } from './stages';
import { oneTimeFunction, OnTime } from './OnTimeFunction';
import { User, getUser, getUsers, setUser } from './user';

const

  actTypes: any =
  {
    play:   {   type: ActivityType.Playing    },
    stream: {   type: ActivityType.Streaming  },
    listen: {   type: ActivityType.Listening  },
    watch:  {   type: ActivityType.Watching   },
    cust:   {   type: ActivityType.Custom     },
    comp:   {   type: ActivityType.Competing  },
  },
  
  actType: any =
  [
    `Играет`,
    `Стримит`,
    `Слушает`,
    `Смотрит`,
    `Кастомный`,
    `Соревнуется`
  ],
  
  guildActivities: any =   getActivities('guildActivities'),
  namesActivities: any =   getActivities('namesActivities'),
  randomActivity: any  =   getActivities('randomActivity'),
  arrKristyAct: any    =   getActivities('arrKristyAct'),
  randomNames: any     =   getActivities('randomNames'),

  kristyId: string     =   '1164228812217790565';

let
  kristyAct = new OnTime(false, 'kristyAct'),
  randomActivityHistory: any[] = [],
  randNum:      any[]  = [],
  randNames:    any[]  = [],
  randNumName:  any[]  = [],
  randNumGuild: any[]  = [],
  guildTexts:   any[]  = [],
  texts:        any    = [];

const funcKristyAct = async (client: any) =>
{

  // const kristyUser = await guild.members?.fetch(`877154902244216852`);
  const guild = await client?.guilds?.fetch('1053295032762908782');
  const kristyUser = await guild?.members?.fetch(`${kristyId}`);
  const kristyStatus = kristyUser?.presence?.status;
  
  if(kristyStatus === undefined || kristyStatus === null || kristyStatus === 'offline')
  {
    console.log('Kristy не в сети');
    for (let el of arrKristyAct)
    {
      const index = randomActivity.indexOf(el);
      if(index < 0) continue;
      randomActivity.splice(index, 1);
    };
    kristyAct.oneTimeFunction(false, true);
    return;
  };

  if(kristyAct.oneTimeFunction(false, false, true)) return;

  debug('Загружаю Kristy активности...')
  skip();

  debug('Все Kristy активности');
  skip();

  for (let el of arrKristyAct)
  {
    randomActivity.push(el);
    debug(`${el[0]} - ${arrKristyAct.indexOf(el)}`);
  };

  debug(`\nУспешно загружено ${arrKristyAct.length} Kristy активность(и)(ей)`);

  shuffle(randomActivity);
  kristyAct.oneTimeFunction(true);
};

const setRandomnessActivity = (client: any) => 
{
  try
  {
    if(!client||!client.user) return;
    const i = pseudoRandomNumber(0, randomActivity.length-1, 3, 2, randomActivityHistory, undefined, undefined, true, true, true);
    const randomAct = randomActivity[i][0];
    const randomActType = randomActivity[i][1];
    const numRandomActType = actType[randomActivity[i][1]?.type];
    client.user.setActivity(`${randomAct}`, randomActType);
    debug(`Рандомная активность: ${i} из "${randomActivity.length}"`);
    debug(`Активность изменена на: ${randomAct}, тип: "${numRandomActType}"`);
  }
  catch (err)
  {
    debug([err, true]);
  }
};

const setRandomnessGuildActivity = (client: any, guilds: any) =>
{
  try
  {
    if(!client||!client.user) return;

    let rGuild = pseudoRandomNumber(0, guilds.length-1, 2, 1, randNumGuild);
    const rGuildName = guilds[rGuild]?.name;

    funcGuildTexts(rGuildName);

    const randNum = pseudoRandomNumber(0, guildTexts.length-1, undefined, undefined, undefined, undefined, undefined, false, true, true);
    
    const text = guildTexts[randNum][0];
    const textAct = guildTexts[randNum][1];
    const textActType = guildTexts[randNum][2];
    client.user.setActivity(`${text}`, textAct);
    
    debug(`Рандомный сервер: ${rGuildName} (${rGuild}) из "${guilds.length}"`);
    debug(`Активность изменена на: ${text} тип: "${textActType}"`);
  }
  catch (err)
  {
    debug([err, true]);
  };
}

const setGuildsLengthActivity = (client: any, guilds: any) =>
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
    debug(`Активность изменена на: ${text}, тип: ${actType[4]}`);
    client.user.setActivity(`${text}`, actTypes.cust);
  }
  catch (err)
  {
    debug([err, true]);
  }
}

const setRandomnessNameActivity = (client: any) =>
{
  try
  {
    if(!client||!client.user) return;
    let randomNumberName = pseudoRandomNumber(0, randomNames.length-1, 10, 20, randNumName);
    
    const rName = randomNames[randomNumberName];
    texts = nameTexts(rName, texts);
    const randomTextNumber = pseudoRandomNumber(0, texts.length-1, 0, 0, undefined, undefined, undefined, undefined, true, true);
    
    let text = texts[randomTextNumber];
    
    debug(`Рандомное число: ${randomNumberName} из "${randomNames.length}"`);
    debug(`Рандомное число: ${randomTextNumber} из "${texts.length}"`);
    debug(`Рандомное текст: ${text}`);
    debug(`Активность изменена на: ${text}, тип: "${actType[4]}"`);
    client.user.setActivity(`${text}`, { type: ActivityType.Custom });
  }
  catch (err)
  {
    debug([err, true]);
  };
};

const functionRandomActivity = async (client: any, guilds: any) =>
{
  try
  {
    if(!client||!client.user) return;
    
    funcKristyAct(client);
    
    let rNum = pseudoRandomNumber(0, 100, 5, 4, randNum);
    shuffle(randomActivity);
    
    debug(`Рандомное число: ${rNum} из "100"`);
    
    if (rNum>=15) setRandomnessActivity(client);
    else if (rNum<10)
    {
      if(rNum>=5) setGuildsLengthActivity(client, guilds)
      else setRandomnessGuildActivity(client, guilds);
    }
    else setRandomnessNameActivity(client);
    skip();
  }
  catch (err)
  {
    skip(2);
    debug('Произошла ошибка при смене активности.');
    client.user.setActivity( `Произошла ошибка при смене активности.` );
    debug([err, true]);
    skip(2);
  };
};

const funcGuildTexts = (guildName: string) =>
{
  guildTexts.length = 0
  guildTexts = copy(guildActivities);
  
  for(let i in guildTexts) guildTexts[i][0] = guildTexts[i][0].replaceAll('rGuildName', `${guildName}`)
};

const nameTexts = ( rName: string, arr: any[], bool=false ) =>
{
  arr.length = 0;
  arr = copy(namesActivities);
  
  const r = pseudoRandomNumber(0, randomNames.length-1, 10, 10, randNames, undefined, undefined, true, true, true);
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