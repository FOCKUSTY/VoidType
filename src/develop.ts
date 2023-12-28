import { EmbedBuilder, Client, GatewayIntentBits, Events, ActivityType, Sticker } from 'discord.js';
// import { color, title, authorName, iconURL, footerText, description } from `./developing.json`;
import { format } from 'date-fns';
import { Random } from "random-js";
import sqlite3 from 'sqlite3';
import { 
  jsonActivities, jsonJokes,
  jsonGuildActivities, jsonNames,
  jsonKristyActivities, jsonRandomNameActivities,
  jsonDownload, 
  jsonObjectIdeas 
} from '../../VoidDataBase/data.json';
import { version } from '../package.json';
const developFields = [
    {name: `Как Вы можете помочь ?`, value: `Поддержать нас !`, inline: true},
    {name: `Как нас поддержать ?`, value: `Просто зайди на наш сервер **[The Void](<https://discord.gg/5MJrRjzPec>)** !`, inline: true}
];
const date = new Date();
const hat = `# :tophat:\n##`;
const random = new Random();
let dateForm;
let downloadAct = false;
const simpleArr: any[] = [];
let id: any;

let someMin = 0;
let someMax = 0;

const actType: string[] = [`Играет`, `Стримит`, `Слушает`, `Смотрит`, `Кастомный`, `Соревнуется`]
const aT: string[] = [`Играет в `, `Стримит `, `Слушает `, `Смотрит `, ``, `Соревнуется в `]
let guildTexts: any[] = [];
let texts: any = [];
let texts1: any[] = [];
let randNum: any[] = [];
let randNumGuild: any[] = [];
let randNumName: any[] = [];
let randNames: any[] = [];
let rand_Num: any[] = [];
let rand_NumGuild: any[] = [];
let rand_NumName: any[] = [];
let kristyAct: boolean = false;
let tbool2: boolean = false;
let tbool: boolean|string = false;
let execute: boolean = false;
let arrT_Name: any[] = [];
const NULL_ARRAY: any[] = [];
let end: string;
let historyArray: any[];

let warn_botsay: string = 'Переписка уже идет'
const kristyId: string = '1164228812217790565'
const logChannelId: string = `1171197868909015102`;
const logGuildId: string = `1169284741846016061`;

const kristyActs = []

export const ideaDB = new sqlite3.Database('./ideadb.sqlite');
ideaDB.serialize(() => {
  try {
    ideaDB.run("CREATE TABLE IF NOT EXISTS ideas (name TEXT, username, TEXT, globalname TEXT, description TEXT, guildname TEXT);");
  } catch (error) {
    console.error(error);
  }
});

export const addRowIdeaDB = (name?: string, username?: string, globalname?: string, description?: string, guildname?: string) => {
  if (name===undefined||name===null) name = 'Названия нет';
  if (username===undefined||username===null) username = 'Бот?';
  if (globalname===undefined||globalname===null) globalname = 'Бот?';
  if (description===undefined||description===null) description = 'Описания нет';
  if (guildname===undefined||guildname===null) guildname = 'Личные сообщения';

  try {
    const row = ideaDB.prepare(`INSERT INTO ideas(name, username, globalname, description, guildname) \
                                VALUES (?, ?, ?, ?, ?), \
                                ("${name}", "${username}", "${globalname}", "${description}", "${guildname}")`);
    
    row.run();
    row.finalize();
  } catch (e) {
    console.log(`Идея не была доставлена`)
    debug(e, true, this, true, true, true)
  }
};

/*  -------------- Доделать --------------  */
export const getIdeaRows = () => {
  const rows = ideaDB.prepare('SELECT * FROM ideas');
  rows.run();
  rows.finalize();
  console.log(rows)
};
/*  -------------- Доделать --------------  */

function guildCheck(
    client: Client,
    text: string,
    guilds: string | any[],
    guildsLength: string | any[],
    nums: string[]) {

    if(guilds.length>=10) {if(!client||!client.user) return;

    let one = guildsLength[guildsLength.length-2];
    let two = guildsLength[guildsLength.length-1];

    for (const num of nums) {
        if (`${num}`===one) {
            if (`${two}`===`1`) {
                end=`е`;
                text = `Я уже на ${guildsLength} сервер${end} !`;
                console.log(`${text}`);
                client.user.setActivity(`${text}`, actTypes.cust);
            }
        } else {
            client.user.setActivity(`${text}`, actTypes.cust);
            return;
        }
    }
  }
};

    export function textbool(bool:boolean|string = 'now') {
      let boolean: boolean|string = tbool;
      if(bool==='now') return boolean;
      
      if(boolean===true&&bool===true) return warn_botsay;
      boolean = bool;
      tbool = bool
      return boolean;
    };

  let jsonActivitiesD: any = jsonActivities;
  export const randomActivity: any[] = [];

  export function downloadActivities() {

      for (let i in jsonKristyActivities) for(let el in actTypes) if(jsonKristyActivities[i][1]===`actTypes.${el}`) jsonKristyActivities[i][1] = actTypes[el];

      for (let i in jsonGuildActivities)  { for(let el in actTypes) { const index = actTypes[el].type;
          if(jsonGuildActivities[i][1]===`actTypes.${el}`) jsonGuildActivities[i][1] = actTypes[el];
          if(jsonGuildActivities[i][2]===`\${actType[${index}]}`) jsonGuildActivities[i][2] = actType[index];
      }};

      for (let el in jsonActivitiesD) {const elem = jsonActivitiesD[el];
        for(let i in elem) {
          elem[i][0] = elem[i][0].replace('${version}', `${version}`);
          
          for(let type in actTypes) {
            if(elem[i][1]===`actTypes.${type}`) elem[i][1] = actTypes[type]
          };
          
          randomActivity.push(elem[i])
        }}; skip(1);
  };

  export function copy (obj: any) {
      function copyProps (clone: any) {
          for (let key in obj) {
              if (Object.prototype.hasOwnProperty.call(obj, key)) {
                  clone[key] = copy(obj[key]);
              }
          }
      }
  
      /**
      * Создание иммутабельной копии объекта
      * @return {Object}
      */
      function cloneObj () {
          let clone = {};
          copyProps(clone);
          return clone;
      }
  
      /**
      * Создание иммутабельной копии массива
      * @return {Array}
      */
      function cloneArr () {
          return obj.map(function (item: any) {
              return copy(item);
          });
      }
  
      /**
      * Создание иммутабельной копии Map
      * @return {Map}
      */
      function cloneMap () {
          let clone = new Map();
          for (let [key, val] of obj) {
              clone.set(key, copy(val));
          }
          return clone;
      }
  
      /**
      * Создание иммутабельной копии Set
      * @return {Set}
      */
      function cloneSet () {
          let clone = new Set();
          for (let item of obj) {
              clone.add(copy(item));
          }
          return clone;
      }
  
      /**
      * Создание иммутабельной копии функции
      * @return {Function}
      */
      function cloneFunction (this: any) {
          let clone = obj.bind(this);
          copyProps(clone);
          return clone;
      } 
  
      // Получение типа объекта
      let type = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
  
      // Возвращаем копию в зависимости от типа исходных данных
      if (type === 'object') return cloneObj();
      if (type === 'array') return cloneArr();
      if (type === 'map') return cloneMap();
      if (type === 'set') return cloneSet();
      if (type === 'function') return cloneFunction();
  
      return obj;
  }

    export const actTypes: any = {
      play: {type: ActivityType.Playing},
      stream: {type: ActivityType.Streaming},
      listen: {type: ActivityType.Listening},
      watch: {type: ActivityType.Watching},
      cust: {type: ActivityType.Custom},
      comp: {type: ActivityType.Competing},
    };
    export const botSaying: boolean = false;
    export const jokes: string[] = jsonJokes;
    export const randomActivities: any = jsonActivitiesD;
    export const guildActivities: any = jsonGuildActivities;
    export const namesActivities: any = jsonRandomNameActivities;
    export const arrKristyAct: any = jsonKristyActivities;
    
  export async function funcKristyAct(client: any) {
      // const kristyUser = await guild.members?.fetch(`877154902244216852`);
      // const guild = await client?.guilds?.fetch('1169284741846016061');
      const guild = await client?.guilds?.fetch('1053295032762908782');
      const kristyUser = await guild?.members?.fetch(`${kristyId}`);
      const kristyStatus = kristyUser?.presence?.status;
      
      if(kristyStatus===undefined||kristyStatus===null||kristyStatus==='offline') {
        console.log('Kristy не в сети');
        for (const el of arrKristyAct) {
          const index = randomActivity.indexOf(el);
          if(index < 0) continue;
          randomActivity.splice(index, 1);
        };
        kristyAct = false;
        return;
      };

      if(kristyAct) return;

      console.log('Загружаю Kristy активности...'); skip();

      console.log('Все Kristy активности'); skip();

      for (const el of arrKristyAct) {
        randomActivity.push(el);
        console.log(`${el[0]} - ${arrKristyAct.indexOf(el)}`);
      };

      console.log(`\nУспешно загружено ${arrKristyAct.length} Kristy активность(и)(ей)`);

      shuffle(randomActivity);
      kristyAct = true;
  };

  export function funcGuildTexts(rGuildName: any, rGuildId: string = '0', bool=false) {guildTexts = copy(guildActivities);
      for(let i in guildTexts) {  guildTexts[i][0] = guildTexts[i][0].replaceAll('rGuildName', `${rGuildName}`) };
      if(bool===true) return guildTexts.length;
  };

  export function nameTexts( rName: any, arr: any[], bool=false ) {
    arr = copy(namesActivities);
    
    const r = pseudoRandomNumber(0, randomNames.length-1, 10, 10, randNames, null, true, true, true);
    const rNameTwo = randomNames[r];
    for (let i in arr) arr[i] = arr[i].replace('${rName}', `${rName}`).replace('${rNameTwo}', `${rNameTwo}`);
    
    if(bool) return arr.length;
    else return arr;
  };

  export function historyRandom(num: number, min=0, max=100, arr: any[], n=3, dOaF=1, pseudoRandom=false) {
    let iMin;
    let iMax;

    function check() {
      for(let i of arr) {
        iMin = i-dOaF;
        iMax = i+dOaF;
        if(num===i||(num>iMin&&num<iMax)){
          debug(`Область определения от ${iMin} до ${iMax}`, false);
          debug(`Число: ${num}`, false);
          if(!pseudoRandom) num = random.integer(min, max)
          else num = pseudoRandomNumber(min, max, n, dOaF, arr, null, false, false, false);
          debug(`Новое число: ${num}`, false);
          console.log();
        };
      };
    };

    for (let someNum of arr) { check() } check();
    arr.push(num);

    if(arr.length>n) {
      arr.shift();
      arr.shift();
    };

    return num;
  };
  
  export const randomNames: string[] = jsonNames;

  export const actLengths: any[] = [
    [randomNames.length, 'Имен'],
    [funcGuildTexts(`null`, `null`, true), 'Активности серверов'],
    [nameTexts(`null`, arrT_Name, true), 'Активностей имен'],
  ];

    /*  ------------------------------------------------- Доделать (Возможны ошибки) -------------------------------------------------  */
  
    function checkMinus(num: number) {
      if (num < 0) return -num
      else return num;
    };
  
    function checkInfinity(num: number, func: any) {
      if(num === Infinity || num === -Infinity) func()
      else return;
    }
  
    function checkNull(num: number, plusRandom=false) {
      if(num===0) {
        if(!plusRandom) return num + 1
        else return num + Math.round(Math.random()*1000);
      } else return num;
    };
  
    function chanceBetween( chance=50, funcOne: any, funcTwo: any, num=random.integer(0,100) ) {
      if(num < chance) funcOne()
      else funcTwo();
    };
    
    function pseudoRandomNumber(min=0, max=100, n=3, m=2, arr=historyArray, yourArr?: any[]|undefined|null, history=true, chanceNull=true, chanceMax=true) {        
      someMin = checkMinus(checkNull(min, false));
      someMax = checkMinus(checkNull(max, true));
      let oRNum = checkNull(Math.round((Math.random() * someMax) + (Math.random() * (-someMax))), true);
      let tRNum = checkNull(Math.round((Math.random() * someMax) + (Math.random() * (-someMax))), true);
  
      function checkEqual() {
        if(someMin===someMax) {
          someMin = 1;
          someMax = Math.random()*1000;
        checkEqual()}} checkEqual();
  
        let someNumber: number = Math.random();
  
        let string: string = `${someNumber}`;
        let num: number = Number(string.slice(Math.round(string.length/2), Math.round(string.length/2 + `${someMax}`.length)));
  
        if(max > 1255121) someNumber = Math.round(oRNum * tRNum * someNumber)
        else someNumber = Math.round(oRNum * tRNum * someNumber * (10**(`${someNumber}`.length)) / num);
      
        let period = 1;
        let periodMax = 10;
        function someFunc() {
          period++;
          let somePeriod = periodMax ** period;
          someNumber = Math.round(oRNum * tRNum * (Math.random() * (100/somePeriod)));
        }
        checkInfinity(someNumber, someFunc);
  
        string = `${someNumber}`;
        num = Number(string.slice(Math.ceil(string.length/2), Math.floor(string.length/2 + (`${someMax}`.length))));
        
        function checkMax() {
          if(someMax<10 && num>=someMax && num<=100) {
            num -= 1;
            checkMax();
          }
          else if(num>=someMax) {
            num = checkMinus(checkNull(num, true)) - checkMinus(checkNull(someMax, true));
            checkMax();
          }
        } checkMax();
        
        num = Math.round(checkMinus(num));
        
        if(chanceNull) {
          function one() {num = num-num};
          function two() {num = num};
  
          chanceBetween(3, one, two, pseudoRandomNumber(0, 100, n, m, arr, null, false, false, false));
        };
        if(chanceMax) {
          let minusNumber: number;
          function three() {return minusNumber = Math.round(Math.random()*10)};
          function four() {return minusNumber = 0};
          chanceBetween(40, three, four, pseudoRandomNumber(0, 100, n, m, arr, null, false, false, false));
  
          function one_() {num=max - minusNumber};
          function two_() {num=num};
          chanceBetween(10, one_, two_, pseudoRandomNumber(0, 100, n, m, arr, null, false, false, false));
        };
  
        if(history) num = historyRandom(num, min, max, arr, n, m, false);
        if(Number.isNaN(num) || num===null || num===undefined) num = pseudoRandomNumber(min, max, n, m, arr, null, false, true, true);
  
        checkMax();

        return checkMinus(num);
    };
  
    /*  ------------------------------------------------- Доделать (Возможны ошибки) -------------------------------------------------  */

  export function checkNumber(num: number, i: number|string|any, stages: object|any) {
    const txt: string = `${num}`;
    const cO: number|string|any = txt[txt.length-1];
    const cT: number|string|any = txt[txt.length-2];
    let someStage;
    if(typeof(i)===('number'||!'string')) someStage = stages[Object.keys(stages)[i]];
    else eval(`someStage = stages.${i}`);
  
    if ((num==1) || (cO==1 && cT!=1)) return `${someStage[0]}`
    else if ((cO==1 && cT==1) || (cO==0) || (cT==1)) return `${someStage[1]}`
    else if (cO<5) return `${someStage[2]}`
    else return `${someStage[1]}`;
  };

  export function randomText(
        guilds: string | any[],
        ) {
      let activityText;
      let rNum = random.integer(0, 100);
      rNum = historyRandom(rNum, 0, 100, rand_Num, 5, 3);
  
      if(rNum>=15) {
          const i = random.integer(0, randomActivity.length-1);
          const randomAct = randomActivity[i][0];
          const randomActType = randomActivity[i][1];
          const numRandomActType = aT[randomActivity[i][1].type];

          activityText = `${numRandomActType}${randomAct}`
          return activityText;
      }
          else if(rNum<10) {
                  let rGuild = random.integer(0, guilds.length-1);
                  rGuild = historyRandom(rGuild, 0, guilds.length-1, rand_NumGuild, 4, 2)

                  const rGuildName = guilds[rGuild].name;
                  funcGuildTexts(rGuildName, guilds[rGuild].id);
                  const randNum = random.integer(0, guildTexts.length-1);
                  const text = guildTexts[randNum][0];
                  const textAct = guildTexts[randNum][1];
                  const textActType = aT[actType.indexOf(guildTexts[randNum][2])]
                  activityText = `${textActType}${text}`
                  return activityText
              
      } else {
          let rn = random.integer(0, randomNames.length-1);
          rn = historyRandom(rn, 0, randomNames.length-1, rand_NumName, 5, 4)

          const rName = randomNames[rn];

          texts1 = [];
          texts1.push(
            `Имя ${rName} очень красивое...`,
            `Мне нравится имя ${rName}`,
            `Вас зовут ${rName} ?`,
            `Привет, ${rName} !`,
            `${rName} - Красивое имя !`,
        )

          const randNum = random.integer(0, texts1.length-1);
          let text = texts1[randNum];

          activityText = `${text}`
          return activityText
      }
  };

  function setRandomnessActivity(client: Client) {  if(!client||!client.user) return;
    const i = pseudoRandomNumber(0, randomActivity.length-1, undefined, undefined, undefined, null, false, true, true);
    // const i = random.integer(0, randomActivity.length-1);
    const randomAct = randomActivity[i][0];
    const randomActType = randomActivity[i][1];
    const numRandomActType = actType[randomActivity[i][1]?.type];

    client.user.setActivity(`${randomAct}`, randomActType);

    debug(`Рандомная активность: ${i} из "${randomActivity.length}"`, false);
    debug(`Активность изменена на: ${randomAct}, тип: "${numRandomActType}"`, false);
  }

  function setRandomnessGuildActivity(this: any, client: Client, guilds: any[]) {  if(!client||!client.user) return;

    let rGuild = pseudoRandomNumber(0, guilds.length-1, 2, 1, randNumGuild)
    function check() {
      if(rGuild >= guilds.length) {
        rGuild-=1;
      check()}}; check();
    const rGuildName = guilds[rGuild]?.name;
    funcGuildTexts(rGuildName, guilds[rGuild].id);
    const randNum = pseudoRandomNumber(0, guildTexts.length-1, undefined, undefined, undefined, null, false, true, true);
    const text = guildTexts[randNum][0];
    const textAct = guildTexts[randNum][1];
    const textActType = guildTexts[randNum][2];
    
    client.user.setActivity(`${text}`, textAct);
    debug(`Рандомный сервер: ${rGuildName} (${rGuild}) из "${guilds.length}"`, false);
    debug(`Активность изменена на: ${text} тип: "${textActType}"`, false);
  }

  function setGuildsLengthActivity(client: Client, guilds: any[]) { if(!client||!client.user) return;
    let text = `Я уже на ${guilds.length}`
    const stages = {
      one: ['сервере', 'серверах', 'серверах']
    };
    
    for(let i in stages) text = `${text} ${checkNumber(guilds.length, i, stages)}`;
    debug(`Активность изменена на: ${text}, тип: ${actType[4]}`, false);
    client.user.setActivity(`${text}`, actTypes.cust);
  }

  function setRandomnessNameActivity(client: Client) {  if(!client||!client.user) return;
    let rn = pseudoRandomNumber(0, randomNames.length-1, 10, 20, randNumName);
    /*           let rn = random.integer(0, randomNames.length-1);
    rn = historyRandom(rn, 0, randomNames.length-1, randNumName, 10, 20) */
    
    const rName = randomNames[rn];
    texts = nameTexts(rName, texts, false);
    const ranNumber = pseudoRandomNumber(0, texts.length-1, undefined, undefined, undefined, null, false, true, true);
    
    let text = texts[ranNumber];
    
    debug(`Рандомное число: ${rn} из "${randomNames.length}"`, false);
    debug(`Рандомное число: ${ranNumber} из "${texts.length}"`, false);
    debug(`Рандомное текст: ${text}`, false);
    debug(`Активность изменена на: ${text}, тип: "${actType[4]}"`, false);
    client.user.setActivity(`${text}`, {type: ActivityType.Custom});
  }

  export function functionRandomActivity(this: any, client: Client, guilds: any[]) {if(!client||!client.user) return;
    try { funcKristyAct(client)  }
    catch(e) {  console.log(e);  };

    try {
      let rNum = pseudoRandomNumber(0, 100, 5, 4, randNum);
  
      debug(`Рандомное число: ${rNum} из "100"`, false);
    
      if(rNum>=15) setRandomnessActivity(client);
      else if(rNum<10) {
        if(rNum>=5) setGuildsLengthActivity(client, guilds)
        else setRandomnessGuildActivity(client, guilds);
      } else setRandomnessNameActivity(client);
      skip()
    } catch (err) {

      skip(2);
      debug(err, true, this, true, true, true)
      skip(2);

      client.user.setActivity('Произошла ошибка при смене активности.', {type: ActivityType.Custom});
    }
  };

  export function actLength(arr=randomActivity): number {
      return arr.length
  }
    
  export function debug(msg: string | any = '', dev: boolean=true, someThis?: any, log: boolean=true, trace: boolean=true, th: boolean=false)
    {
      if(dev) {
        if(log) console.log(msg);
        if(trace) console.trace(msg);
        if(th) console.log(someThis);
      } else {
        console.log(msg);
      }
  };
  
    function skip (value=1) { for (let i = 0; i < value; i++) console.log() };
      
	export function dateCheck(
        date: string | number | Date,
        guild: null | undefined)
    {
      if(guild!=undefined||guild!=null) {
			  dateForm = new Date(date);
			  dateForm = format(dateForm, `dd.MM.yyyy HH:mm:ss`);
			return dateForm} else return;
    }

  export const objectIdeas: object[] = jsonObjectIdeas
  export const download: string[] = jsonDownload;

  export function shuffle (arr: any[]) {
    let currentIndex: any = arr.length, randomIndex;
      
    while (currentIndex > 0) {
      
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      
      [arr[currentIndex], arr[randomIndex]] = [
        arr[randomIndex], arr[currentIndex]];
    }
      
    return arr;
  };

  export function sendMsgLogs(
    m: { attachments: {
        forEach: (arg0: (attachment: any) => void) => void;
        size: number; map: (arg0: (att: any) => string) => any[]; };
        author: { bot: any; username: any; id: any; avatarURL: () => string | undefined; defaultAvatarURL: string | undefined; };
        content: string | any[];
        client: { channels: { cache: { get: (arg0: string) => any; }; };
        guilds: { cache: { get: (arg0: string) => { (): any; new(): any; name: any; }; }; }; };
        url: any;
        guild: { iconURL: () => string | null; };
        guildId: any;
        channel: { name: any; url: any; }; }, reason: string,
    m2: { content: string | any[]; attachments: { size: number; map: (arg0: (att: any) => string) => any[]; };
    }) {
        let attachmentName;
        let attachmentUrl;
        let attachmentProxyUrl;
        let color;
    
        m.attachments.forEach(attachment => {
            attachmentName = attachment.name
            attachmentUrl = attachment.url
            attachmentProxyUrl = attachment.proxyURL
        });
      
        switch (reason) {
          case "send":
            reason = "отправлено";
            color = "#7fdf7f";
            break;
      
          case "update":
            reason = "обновлено";
            color = "#7f7f7f";
            break;
      
          case "delete":
            reason = "удалено";
            color = "#df7f7f";
            break;
      
          default:
            reason = "||`{ошибка в коде}`||"
            color = "#7f7f7f"
            break;
        }
      
        if (m.author.bot) return;
    
        let msg: any;
        let msgAdd: any;
        let msg2: any;
        let msg2Add: any;
    
        if(m.content.length>=1000) {
            msg = m.content.slice(0, 1000);
            msgAdd = m.content.slice(1000, m.content.length);
        } else {
            msg = m.content.slice(0, m.content.length);
        }
        if(m2) {
            if(m2.content.length>=1000) {
                msg2 = m2.content.slice(0, 1000);
                msg2Add = m2.content.slice(1000, m2.content.length);
            } else {
                msg2 = m2.content.slice(0, m2.content.length);
            }
        }
    
        const fields = [
            {
              name: `${m2 ? "Старое с" : "С"}одержание`,
              value: `\`\`\`${msg ? msg
                .replaceAll("```", "<code>")
                .replaceAll("`", "\"")
                :
                "<Пусто>"
                }\`\`\``,
              inline: false,
            },
          ];
          if (m.attachments.size > 0) {
            fields.push({
              name: `${m2 ? "Старые в" : "В"}ложения`,
              value: m.attachments
                .map((att) => `\`\`\`${att.url}\`\`\``)
                .join(`\n&&\n`),
              inline: false,
            });
          }
        
          if (m2) {
            fields.push({
              name: "Новое содержание",
              value: `\`\`\`${msg2 ? msg2
                .replaceAll("```", "<code>")
                .replaceAll("`", "\"")
                :
                "<Пусто>"
                }\`\`\``,
              inline: false,
            });
            if (m2.attachments.size > 0) {
              fields.push({
                name: "Новые вложения",
                value: `${m2.attachments
                  .map((att) => `\`\`\`${att.url}\`\`\``)
                  .join(`\n&&\n`)}`,
                inline: false,
              });
            }
          }
          if(msgAdd) {
            fields.push({
                name: "Дополнительное содержание",
                value: `\`\`\`${msgAdd ? msgAdd
                    .replaceAll("```", "<code>")
                    .replaceAll("`", "\"")
                    :
                    "<Пусто>"
                }\`\`\``,
                inline: false
            })
          }
          if(msg2Add) {
            fields.push({
                name: "Дополнительное содержание",
                value: `\`\`\`${msg2Add ? msg2Add
                    .replaceAll("```", "<code>")
                    .replaceAll("`", "\"")
                    :
                    "<Пусто>"
                }\`\`\``,
                inline: false
            })
          }
    
          try {
            (m.client.channels.cache.get(logChannelId)).send({
                embeds: [new EmbedBuilder()
                  .setColor(1)
                  .setAuthor({
                    name: `${m.author.username} (${m.author.id})`,
                    iconURL: m.author.avatarURL() ? m.author.avatarURL() : m.author.defaultAvatarURL
                  })
                  .setTitle(`${m.client.guilds.cache.get(logGuildId)?.name}`)
                  .setDescription(
                    `**[Сообщение](${m.url})** было ${reason} от ${m.author} (${m.url})\n
                    **На сервере:** ${m.guild}\n**Id сервера: **${m.guildId}\n
                    **В канале:** **[${m.channel.name}](${m.channel.url})** (${m.channel.url})`
                    )
                  .setThumbnail(m.guild?.iconURL())
                  .setTimestamp()
                  .addFields(fields)
                ]
              });
          } catch (error) {
            console.log(error)
          }
  }