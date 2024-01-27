import fs from 'node:fs';
import { ActivityType } from 'discord.js';

import
{
    jsonActivities,
    jsonGuildActivities,
    jsonJokes,
    jsonDownload,
    jsonRandomNameActivities,
    jsonNames,
    jsonObjectIdeas,
    jsonKristyActivities,
} from '../../../VoidDataBase/data.json';
 
import { version } from '../../package.json';
import { debug, skip } from './developConsole';
import { oneTimeFunction } from './OnTimeFunction';





let arrKristyAct: any = jsonKristyActivities,
    download: any = jsonDownload,
    guildActivities: any = jsonGuildActivities,
    jokes: any = jsonJokes,
    namesActivities: any = jsonRandomNameActivities,
    objectIdeas: any = jsonObjectIdeas,
    randomActivities: any = jsonActivities,
    randomNames: any = jsonNames;





const THEVOIDSARRAY: any =
    [
    
        [    'The Abyssia',  'THEVOIDSBOT_NREVERSE'     ],
        [    'The Void',     'THEVOIDSBOT_REVERSE'      ],
        [    'The Void',     'THEVOIDSBOT_LOVE'         ],
        [    'Kristy',       'THEVOIDSBOT_REVERSE_LOVE' ],
        [    'Kristy',       'THEVOID_LOVE'             ],
        [    'The Void',     'THEVOID'                  ],
        [    'а',            'typend_A'                 ],
        [    'ой',           'typend_B'                 ]
    
    ],

    randomActivity: any[] = [],

    dataVars: any =
    [
        [   'arrKristyAct',         'jsonKristyActivities'      ],
        [   'download',             'jsonDownload'              ],
        [   'guildActivities',      'jsonGuildActivities'       ],
        [   'randomActivities',     'jsonActivities'            ],
        [   'jokes',                'jsonJokes'                 ],
        [   'objectIdeas',          'jsonObjectIdeas'           ],
        [   'namesActivities',      'jsonRandomNameActivities'  ],
        [   'randomNames',          'jsonNames'                 ],
    ],

    dataFiles: any =
    [
        arrKristyAct,
        download,
        guildActivities,
        jokes,
        namesActivities,
        objectIdeas,
        randomActivities,
        randomNames,
    ],

    jsonFiles: any =
    [
        jsonKristyActivities,
        jsonDownload,
        jsonGuildActivities,
        jsonJokes,
        jsonRandomNameActivities,
        jsonObjectIdeas,
        jsonActivities,
        jsonNames,
    ],

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
    ];



const downloadActivities = () =>
{
    for(let i=0; i<jsonFiles.length-1;i++)
    {
        if(jsonFiles[i]===dataFiles[i]) dataFiles[i] = jsonFiles[i];
    };
  
    for (let i in arrKristyAct)
    {
        for(let el in actTypes)
        {
            if(arrKristyAct[i][1]===`actTypes.${el}`) arrKristyAct[i][1] = actTypes[el];
        };
    };
  
    for (let i in guildActivities)
    {
        for(let el in actTypes)
        {
            const index = actTypes[el].type;
            if(guildActivities[i][1] === `actTypes.${el}`) guildActivities[i][1] = actTypes[el];
            if(guildActivities[i][2] === `\${actType[${index}]}`) guildActivities[i][2] = actType[index];
        }
    };
  
    for (let el in randomActivities)
    {
        const elem = randomActivities[el];
        for(let i in elem)
        {
            elem[i][0] = elem[i][0].replace('${version}', `${version}`);
  
            for(let index in THEVOIDSARRAY) elem[i][0] = elem[i][0].replace(`\${${THEVOIDSARRAY[index][1]}}`, THEVOIDSARRAY[index][0]);
  
            for(let type in actTypes)
            {
              if(elem[i][1] === `actTypes.${type}`) elem[i][1] = actTypes[type];
            };
        
            randomActivity.push(elem[i]);
        };
    };
    skip(1);
};

const clearActivity = () =>
{
    randomActivity.length = 0;
};
  
const readActivityDB = () =>
{
  const path = '../../VoidDataBase/data.json';
  const file = (fs.readFileSync(path, {encoding: 'utf8'}));
  let json: any;

  JSON.stringify(file, (key, value) => { json = eval(` ${json} = ${value} `) } );

  jsonCicle: for (let el in json)
  {
    for(let elem of dataVars)
    {
      if(json[elem[1]]===undefined)
      {

        delete json[elem[1]];
        eval(`${elem[0]} = null`);
        continue jsonCicle;
        
      }
      
      else if(`${elem[1]}`===`${el}`)
      {
        
        eval(`${elem[0]} = json[el]`);
        continue jsonCicle;

      };
    };
  };
};
  
const updateActivities = (client: any) =>
{

  let length = randomActivity.length

  clearActivity();
  readActivityDB();
  downloadActivities();
  if(!!client && oneTimeFunction('kristyAct', false, false, true)) for (let el of arrKristyAct) randomActivity.push(el);
  debug('Были перезагружены активности');
  debug(`Общая длина составляет: ${randomActivity.length}\nБыла: ${length}`)

};

const getActivities = (variable='randomActivity') =>
{
    switch (variable)
    {
        case 'guildActivities':
            return guildActivities;

        case 'arrKristyAct':
            return arrKristyAct;

        case 'download':
            return download;

        case 'randomActivities':
            return randomActivities;

        case 'jokes':
            return jokes;

        case 'objectIdeas':
            return objectIdeas;

        case 'namesActivities':
            return namesActivities;

        case 'randomNames':
            return randomNames;
        
        case 'randomActivity':
            return randomActivity
    };
};

export
{
    downloadActivities,
    updateActivities,
    getActivities,
    dataVars,
};