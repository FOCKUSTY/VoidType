import { Interaction } from 'discord.js'

import {
		Events,
		Client,
		GatewayIntentBits,
		Collection,
	} from 'discord.js';
	
import { dateCheck } from '../utils/date';
 	
const
	date = new Date(),
	client = new Client({intents: [GatewayIntentBits.Guilds]});

export async function intCreate(commands: any, interaction: Interaction)
{
    if (!interaction.isChatInputCommand()) return;

    const int: any = interaction;

    const command = commands.get(interaction.commandName) as {
        execute: (interaction: Interaction) => Promise<void>;
    };

    if (!command)
    return console.error(
        `No command matching ${interaction.commandName} was found.`
    );

    const subcommands = [];
    for (let key in int.options) {
        const group = int.options[`_group`];
        const subcommand = int.options[`_subcommand`];
        const hoistedOptions = int.options[`_hoistedOptions`];
        if (int.options.hasOwnProperty(key)) {
            if(group!=null)
            {
                subcommands.push(`Группа: ${group}`);
            };
            if(subcommand!=null)
            {
                subcommands.push(`Подкоманда: ${subcommand}`);
            };
            if(hoistedOptions[0]?.name!=undefined)
            {
                for(let i in hoistedOptions) subcommands.push(`Опция: ${hoistedOptions[i]?.name}`);
            };
            if(group===null && subcommand===null && hoistedOptions[0]?.name===undefined)
            {
                subcommands.push(`Нет подкоманд`);
            };
            break;
        }
    };

console.log(
`Было замечено использование команды\n` +
`Название команды: ${int.commandName}\n` +
`${subcommands.join(`\n`)}\n` +
`Команду использовал: ${int.user} - ${int.user.username} (${int.user.globalName})\n` +
`Аккаунт создан с ${dateCheck(int.user.createdAt)||`Не известно`}\n` +
`На сервере: ${int?.guild||`Не на сервере`}\n`+
`Сервер создан с ${dateCheck(int?.guild?.createdAt)||`Не на сервере`}\n` +
`Участник на сервере с ${dateCheck(int?.member?.joinedAt)||`Не на сервере`}\n` +
`В канале: ${int?.channel||`Личные сообщения`} ${int?.channel?.name||`с ботом`}\n` +
`Время использования: <t:${Math.floor(int.createdTimestamp / 1000 - 35)}> (<t:${Math.floor(int.createdTimestamp / 1000 - 35)}:R>)\n` +
`Время в часах: ${date.toLocaleString()}\n`
);

    try
    {
        await command.execute(interaction);
    }
    catch (err)
    {
        await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
        });
        console.log(err)
    }
}