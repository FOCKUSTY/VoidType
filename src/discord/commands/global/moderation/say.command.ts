import { Debug } from 'develop/debug.develop';
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
import { objects } from 'utility/loaders/objects.loader';
import customIds from 'utility/modal/custom-ids.modal';
import { booleans, channels } from 'utility/modal/say-message.modal';
import PseudoRandom from 'utility/service/pseudo-random.service';

const history: number[] = [];

export =
{
    cooldown: 5,
    data: new SlashCommandBuilder()	.setName('say')	.setDescription('Сообщение с помощью бота!')
    .setNameLocalizations({ru:'отправить',"en-US":'say'})
    .setDescriptionLocalizations({ru:'Сообщение с помощью бота',"en-US":'Message using a bot'})
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels & PermissionFlagsBits.ManageMessages)
    .addChannelOption(option =>
        option
            .setName('channel')
            .setDescription('Канал на который вы хотите отправить сообщение')
            .setNameLocalizations({ru:'канал',"en-US":'channel'})
            .setDescriptionLocalizations({
                ru:'Канал на который вы хотите отправить сообщение',
                "en-US":'The channel you want to send a message to'
            })
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText))
    .addBooleanOption(option =>
        option
        .setName('embed').setDescription('Сообщение в виде embed? (Вложенный текст)')
        .setRequired(true)
        .setNameLocalizations({ru:'вложение',"en-US":'embed'})
        .setDescriptionLocalizations({
            ru:'embed сообщение? (Вложенный текст)',
            "en-US":'embed message?'
        })),
    async execute(interaction: CommandInteraction)
    {
        if(!interaction.guild)
            return await interaction.reply({ content: 'Вы находитесь не в гильдии', ephemeral: true });

        const channelId: any = interaction.options.get('channel')?.value;
        const channel = interaction.guild.channels.cache.get(channelId);
        const bool: any = interaction.options.get('embed')?.value;
        const components = customIds.sayModal.components;

        if(!channel)
            return await interaction.reply({ content: 'Не удалось найти гильдию', ephemeral: true })

        booleans.set(interaction.user.id, bool);
        channels.set(interaction.user.id, channel);

        const modal = new ModalBuilder().setCustomId(customIds.sayModal.id).setTitle('Ваше сообщение !');
        const randomNumber = PseudoRandom.Number(0, objects.idea.length-1, history, objects.idea);
        const placeholder = objects.idea[randomNumber].ideaDetail;

        modal.addComponents(
            new ActionRowBuilder<ModalActionRowComponentBuilder>()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId(components.sayMessage)
                        .setLabel("Ваше сообщение")
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                        .setMaxLength(bool ? 4000 : 2000)
                        .setPlaceholder(placeholder)
                )
        );

        await interaction.showModal(modal);
    }
};