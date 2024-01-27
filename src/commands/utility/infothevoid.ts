import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";

export =
{
	data: new SlashCommandBuilder()
    .setName("thevoid")
    .setDescription("Информация о The Void !"),
    async execute(interaction: CommandInteraction) {

		const embed = new EmbedBuilder()
		.setColor(0x161618)
		.setTitle('Информация о сообществе The Void')
		.setAuthor({ name: `The Void`, iconURL: `https://cdn.discordapp.com/icons/1169284741846016061/63ff0e27c4c5de492894df065ef72266.png` })
		.setDescription(`
		## О The Void:
- The Void - Это сообщество, созданное <@877154902244216852> для объединения некоторых социальных сетей
- Главная задача The Void - захватить мир, в хорошем смысле !
 - Этот проект нацелен на объединение Discord, VK и Telegram в одно большое cообщество
 - Также, The Void развлекает и объединяет людей с общими интересами! С ними не скучно, честно !
- Bottomless Hat продвигает сообщество всеми силами! Присоединяйтесь к ним, чтобы помочь в развитии !
 - Взамен Вы получите новые знакомства (Возможно и вторую половинку)
 - А также возможность стать значимым человек в сообществе, кто знает, вдруг Вы привнесете больший вклад !

## О владельце:
- FOCKUSTY - Владелец сообщества The Void, а так же главных в нем серверов
 - Эти сервера называются Bottomless Hat, они есть в Discord, Вконтакте и Telegram
- Сайт и сообщество создал FOCKUSTY своими лапками/палками - Не самый отличный человек, но помните, он всегда говорит правду !
 - Этот человек может быть эгоистичен, но он никогда не отвернется от пользователей сообщества и в любых ситуациях попробует помочь ! Он любит всех !

## О The Void Community!
- The Void Community - это проект, который разрабатывает бота **[The Void](<https://discord.com/api/oauth2/authorize?client_id=1122199797449904179&scope=applications.commands>)**

В The Void есть три основных сервера:
## [Telegram](<https://t.me/BottomlessHat>)
## [Discord](<https://discord.gg/pw8HgBs2yE>)
## [Vk](<https://vk.com/bottomlesshat>)
# Как вступить ?
## Общее правило:
> Всё предельно просто !
> У вас должен быть Discord сервер, Telegram канал или VK группа
> Вы должны согласиться с [правилами](<https://thevoidservers.webflow.io/about>) сообщества
> Ваш Discord сервер (Telegram канал или VK группа) не должен содержать сексуальный контент (Иключение: Ограничение пользователей с помощью проверки возрастов)
> Ваше название Discord сервера (Telegram канала или VK группы) должен подходить под стилистику сообщества The Void
> Вы должны иметь хотя бы малую активность на сервер (В канале или группе)
> Вы должны модерировать свой сервер (Канал или группу)
## Discord:
> Вы должны иметь хорошую стилистику в Discord
> Вы должны иметь подключенное сообщество на Discord сервере
> У Вас должен быть собственная стилистика Discord сервера (Можно использовать стилистику Bottomless Hat)
> У Вас должны быть боты (Такие как: [JuniperBot](<https://juniper.bot>), [Gusic](<https://gusic.xyz>), [VoiceMaster](<https://voicemaster.xyz>) или их аналоги на Discord сервере Telegram. Последние два не обязательны)
## Telegram:
> Вы должы иметь канал с обсуждениями (Комментариями)
> Вы должны публиковать разные новости
## VK:
> Вы должны иметь оригинальную стилистику аватарки и шапки группы
> Группа должна хотя бы просто существовать
		`)
		.setThumbnail(`https://cdn.discordapp.com/icons/1169284741846016061/63ff0e27c4c5de492894df065ef72266.png`)
		.setTimestamp()
		.setFooter({ text: `Id: 1169284741846016061`, iconURL: `https://cdn.discordapp.com/icons/1169284741846016061/63ff0e27c4c5de492894df065ef72266.png` });

        await interaction.reply({ embeds: [embed], fetchReply: true, ephemeral: true});
    }
};