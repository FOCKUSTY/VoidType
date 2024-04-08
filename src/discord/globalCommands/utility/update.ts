import {
        SlashCommandBuilder,
        ChannelType,
        PermissionsBitField,
        TextInputStyle,
        TextInputBuilder,
        ActionRowBuilder,
        ModalBuilder
    } from 'discord.js'
    
import { setChannel, setBool, setVersionUpdate } from '../../events/modals'
import { getActivities } from '../../utils/updatejson'
import { pseudoRandomNumber } from '../../utils/pseudoRandom'

export =
{
    cooldown: 5,
    data: new SlashCommandBuilder()
	.setName('update')
	.setDescription('Написать обновление !')
    .setNameLocalizations({ru:'обновлние',"en-US":'update'})
    .setDescriptionLocalizations({ru:'Написать обновление !',"en-US":'Write update !'})

    .addBooleanOption(o=>o.setName(`embed`).setDescription('Сообщение в виде embed? (Вложенный текст)').setRequired(true)
        .setNameLocalizations({ru:'вложение',"en-US":'embed'})
        .setDescriptionLocalizations({ru:'embed сообщение? (Вложенный текст)',"en-US":'embed message?'}))

    .addStringOption(o=>o.setName(`version`).setDescription(`Версия обновления`).setRequired(true)
        .setNameLocalizations({ru:'версия',"en-US":'version'}).setDescriptionLocalizations({ru:'Версия обновления', "en-US":'Update version'}))
    
    .addChannelOption(o=>o.setName('channel').setDescription('Укажите канал').addChannelTypes(ChannelType.GuildText)
        .setNameLocalizations({ru:'канал', "en-US":'channel'}).setDescriptionLocalizations({ru:'Укажите канал', "en-US":'Indicate the channel'}))

    .addStringOption(o=>o.setName(`channelid`).setDescription(`Id канала (Если Вы не указали канал)`)
        .setNameLocalizations({ru:'id-канала',"en-US":'channel-id'})
        .setDescriptionLocalizations({ru:'Id канала (Если Вы не указали канал)', "en-US":'Channel id (If you haven\'t selected a channel)'})),
    
    async execute(int: any)
    {
        const objectIdeas = getActivities('objectIdeas');
        const client = int.client;
        const versionUpdate = int.options.getString('version');
        const bool = int.options.getBoolean('embed');

        let channel = client.channels.cache?.get(    int?.options?.getChannel('channel')?.id   || int?.options?.getString('channelid') || undefined );
        let guild = int.guild;
        
        if(!channel) return int.reply({content: `Вы должны указать хотя бы одну опцию`, ephemeral: true});
        if(int.user.id != guild.ownerId) return int.reply({content: `Вы должны быть владельцем сервера`, ephemeral: true});
        if(!(channel.permissionsFor(int.client.user.id).has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel])))
        {
            return await int.reply({
            content:
            `Сообщение не было доставлено на Ваш канал, возможны причины:\nВаш канал не является текстовым каналом\nУ меня не достаточно прав отправить сообщение на Ваш канал`,
            ephemeral: true});
        };

        const modal = new ModalBuilder()
            .setCustomId(`updateModal`)
            .setTitle(`Ваше обновление !`);

        let ideaDetailPH = objectIdeas[pseudoRandomNumber(0, objectIdeas.length-1, 1, 1, undefined, undefined, undefined, false, true, true)]['ideaDetail']

        setChannel(channel, int);
        setBool(bool);
        setVersionUpdate(versionUpdate);

        if(bool)
        {
            const msg = new TextInputBuilder()
                .setCustomId('message')
                .setLabel("Ваше сообщение")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setMaxLength(4000)
                .setPlaceholder(`${ideaDetailPH}`);
            
            const row: any = new ActionRowBuilder()
                .addComponents(msg);

            modal.addComponents(row);

            await int.showModal(modal);
        }
        else
        {
            const msg = new TextInputBuilder()
                .setCustomId('message')
                .setLabel("Ваше сообщение")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setMaxLength(2000)
                .setPlaceholder(`${ideaDetailPH}`);
    
            const row: any = new ActionRowBuilder()
                .addComponents(msg);
            
            modal.addComponents(row);

            await int.showModal(modal);
        };
    }
};