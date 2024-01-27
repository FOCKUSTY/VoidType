import
{
    SlashCommandBuilder,
    PermissionFlagsBits,
    ModalActionRowComponentBuilder,
    CommandInteraction,
    ChannelType,
    TextInputBuilder,
    TextInputStyle,
    ModalBuilder, 
    ActionRowBuilder
} from 'discord.js';

import { setChannel, setBool } from '../../events/modals';

export =
{
    cooldown: 5,
    data: new SlashCommandBuilder()	.setName('say')	.setDescription('Сообщение с помощью бота!')
    .setNameLocalizations({ru:'отправить',"en-US":'say'})
    .setDescriptionLocalizations({ru:'Сообщение с помощью бота',"en-US":'Message using a bot'})
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels & PermissionFlagsBits.ManageMessages)
    .addChannelOption(option =>
        option
            .setName(`channel`)
            .setDescription(`Канал на который вы хотите отправить сообщение`)
            .setNameLocalizations({ru:'канал',"en-US":'channel'})
            .setDescriptionLocalizations({ru:'Канал на который вы хотите отправить сообщение',"en-US":'The channel you want to send a message to'})
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText))
    .addBooleanOption(option =>
        option
        .setName(`embed`).setDescription('Сообщение в виде embed? (Вложенный текст)').setRequired(true)
        .setNameLocalizations({ru:'вложение',"en-US":'embed'})
        .setDescriptionLocalizations({ru:'embed сообщение? (Вложенный текст)',"en-US":'embed message?'})),
    async execute(interaction: CommandInteraction)
    {

        const int = interaction;
        const channel: any = int.options.get(`channel`)?.value;
        const bool: any = int.options.get('embed')?.value;
        console.log(channel)
    
        setChannel(channel, int);
        setBool(bool)

        const modal = new ModalBuilder().setCustomId(`sayModal`).setTitle(`Ваше сообщение !`);

        let ideaDetailPH: string = `Хочу, чтобы Валя был администратором на The Void Community!!!!`

        if(bool)
        {
            modal.addComponents(
                new ActionRowBuilder<ModalActionRowComponentBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                        .setCustomId('message')
                        .setLabel("Ваше сообщение")
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                        .setMaxLength(4000)
                        .setPlaceholder(`${ideaDetailPH}`)
                    )
            );
            await int.showModal(modal)

        }
        else
        {
            modal.addComponents(
                new ActionRowBuilder<ModalActionRowComponentBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                        .setCustomId('message')
                        .setLabel("Ваше сообщение")
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                        .setMaxLength(2000)
                        .setPlaceholder(`${ideaDetailPH}`)
                    )
            );
            await int.showModal(modal)
        }

/*         if(!(channel?.permissionsFor(interaction.client.user.id).has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]))) {
            await int.reply({
            content:
            `Сообщение не было доставлено на Ваш канал, возможны причины:\nВаш канал не является текстовым каналом\nУ меня не достаточно прав отправить сообщение на Ваш канал`,
            ephemeral: true});
            return
        }
        if(bool) {
            const embed = new EmbedBuilder()
            .setColor(0x161618)
            .setAuthor({name: `${int?.user?.globalName||int?.user?.username}`, iconURL: `${int.user.avatarURL()}` })
            .setTitle(`${int?.guild?.name}`)
            .setDescription(`${msg.replaceAll(`\\n`, `\n`)}`)
            .setTimestamp()

            channel.send({embeds:[embed]})
        } else {
            channel.send(`${msg.replaceAll(`\\n`, `\n`)}`)
        }
        
        try {

        const embed = new EmbedBuilder()
        .setColor(0x161618)
        .setAuthor({name: `The Void`, iconURL: `https://cdn.discordapp.com/icons/1169284741846016061/63ff0e27c4c5de492894df065ef72266.png`})
        .setTitle(`Сообщение:`)
        .setDescription(`${msg.replaceAll(`\\n`, `\n`)}`)
        .setTimestamp()
        
        await int.reply({
		content: `Сообщение было доставлено на: ${channel}`,
		embeds: [embed], ephemeral: true});

    } catch (err) {
        
        await int.reply({
        content:
        `Сообщение не было доставлено на Ваш канал, возможны причины:\nВаш канал не является текстовым каналом\nУ меня не достаточно прав отправить сообщение на Ваш канал\n## Ошибка:\n\`\`\`${err}\`\`\``,
        ephemeral: true});
    } */
	},
};