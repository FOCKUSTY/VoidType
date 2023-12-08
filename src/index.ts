import { Client, Events, GatewayIntentBits, Collection, Interaction, Guild, InteractionType, EmbedBuilder, TextChannel } from "discord.js";
// import { Tags } from "./develop";
import fs from 'node:fs';
import path from 'node:path';
import { config } from "./config";
import { intCreate } from './events/interaction-create'

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const commands = new Collection();
const filesPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(filesPath).filter(file => file.endsWith('.ts'));

(async () => {
  for (const file of commandFiles) {
    const filePath = path.join(filesPath, file);
    const command = await require(filePath);
    if ('data' in command && 'execute' in command) {
      commands.set(command.data.name, command);
    } else {
      if(filePath==='D:\\VoidBotTs\\src\\commands\\download.ts') continue;
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
})();

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));

(async () => {
  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = await require(filePath);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
})();

client.on(Events.InteractionCreate, async int => {
	const user = int.user.globalName;
	const userAvatar = `https://cdn.discordapp.com/avatars/${int.user.id}/${int.user.avatar}.png`;
	let iconURL;
	if(int.guild!=undefined||int.guild!=null) {
		iconURL = `https://cdn.discordapp.com/icons/${int?.guild?.id}/${int?.guild?.icon}.png`
	} else {
		iconURL = `https://cdn.discordapp.com/avatars/${int.user.id}/${int.user.avatar}.png`
	}
	
	if(int.type === InteractionType.ModalSubmit) {

		const ideaTitle = int.fields.getTextInputValue(`ideaTitle`);
		const ideaDetails = int.fields.getTextInputValue(`ideaDetails`);

			const embed = new EmbedBuilder()
			.setColor(0x161618)
			.setAuthor({name: `${user}`, iconURL: `${userAvatar}`})
			.setTitle(`${ideaTitle}`)
			.setThumbnail(`${iconURL}`)
			.setDescription(`${ideaDetails}`)
			.setFields(
				{name: `Пользователь:`, value: `<@${int.user.id}>`, inline: true},
				{name: `\n`, value: `\n`, inline: true},
				{name: `Сервер:`, value: `${int.guild?.name||`Не на сервере`}`, inline: true}
			)
			.setTimestamp();

      (client.channels.cache.get("1171051517910986752") as TextChannel).send({content: ``, embeds: [embed]});
      
			int.reply({content: `Ваша идея была доставлена!`, embeds: [embed], ephemeral: true});

			console.log(`Идея была доставлена\nИдея: ${ideaTitle}\nОписание: ${ideaDetails}\nНаписал: ${user} (${int.user.id})\nС сервера: ${int.guild?.name||`Не на сервере`} (${int.guild?.id||``})\n`);
			
/* 			try {
				const tag = await Tags.create({
					name: ideaTitle,
					username: int.user.username,
					globalname: int.user.globalName,
					description: ideaDetails,
					guildname: int?.guild?.name||`Не на сервере`
				});
        console.log(tag)
        // console.log(`Тег идеи успешно добавлен\nНазвание: ${tag.name}\nОписание: ${tag.description}\nОтправил: ${tag.username}\nС сервера: ${tag.guildname}`)
			} catch (error) {
				console.log(`Ошибка с добавление тега\n${error}`)
			} */
		};
})


client.on(Events.InteractionCreate, async(interaction: Interaction) => intCreate(commands, interaction))

client.login(config.DISCORD_TOKEN);