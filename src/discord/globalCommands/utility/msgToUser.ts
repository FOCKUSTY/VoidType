import
{
    CommandInteraction,
    SlashCommandBuilder,
    ModalBuilder,
    ActionRowBuilder,
    ModalActionRowComponentBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";

import { setBoolToUser, setTypeToUser } from '../../events/modals';

export =
{
    data: new SlashCommandBuilder()
    .setName("msg-to-user")
    .setDescription("Сообщение пользователю при заходе на сервер !")
    .setNameLocalizations({ru:'сообщение-пользователю',"en-US":'msg-to-user'})
    .setDescriptionLocalizations({ru:'Сообщение пользователю при заходе на сервер !',"en-US":'Message to the user when logging into the server'})
    .addSubcommand(s=>s.setName('create').setDescription('Создать')
        .setNameLocalizations({"en-US":'create',ru:'создать'}).setDescriptionLocalizations({"en-US":'create',ru:'создать'})
        
        .addBooleanOption(o=>o.setName('switch').setDescription('Включить/выключить отправку сообщений').setRequired(true)
            .setNameLocalizations({"en-US":'switch',ru:'включить'}).setDescriptionLocalizations({"en-US":"Turn on/off send messages",ru:'Включить/выключить отправку сообщений'}))
    )

    .addSubcommand(s=>s.setName('update').setDescription('обновить')
        .setNameLocalizations({"en-US":'update',ru:'обновить'}).setDescriptionLocalizations({"en-US":'update',ru:'обновить'})
        
        .addBooleanOption(o=>o.setName('switch').setDescription('Включить/выключить отправку сообщений').setRequired(true)
            .setNameLocalizations({"en-US":'switch',ru:'включить'}).setDescriptionLocalizations({"en-US":"Turn on/off send messages",ru:'Включить/выключить отправку сообщений'}))
    )

    .addSubcommand(s=>s.setName('delete').setDescription('удалить')
        .setNameLocalizations({"en-US":'delete',ru:'удалить'}).setDescriptionLocalizations({"en-US":'delete',ru:'удалить'})
        
        .addBooleanOption(o=>o.setName('switch').setDescription('Включить/выключить отправку сообщений').setRequired(true)
            .setNameLocalizations({"en-US":'switch',ru:'включить'}).setDescriptionLocalizations({"en-US":"Turn on/off send messages",ru:'Включить/выключить отправку сообщений'}))
    ),
    async execute(interaction: any)
    {
        if(!interaction.guild)
            return await interaction.reply({content:'Вы находитесь не в гильдии', ephemeral: true});

        if(interaction.user.id != interaction.guild.ownerId)
            return await interaction.reply({continue:'Вы не имеете право использовать данную команду', ephemeral: true});
        
        const boolean: any = interaction.options.get('switch')?.value;
        const subcommand: string = interaction.options._subcommand;

        setBoolToUser(interaction.user.id, boolean);
        setTypeToUser(interaction.guild.id, subcommand);

        const modal = new ModalBuilder().setCustomId('MTUOJmodal').setTitle(`Ваше сообщение !`);

        modal.addComponents(
            new ActionRowBuilder<ModalActionRowComponentBuilder>()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId('text')
                        .setLabel("Ваше сообщение")
                        .setStyle(TextInputStyle.Paragraph).setRequired(true)
                        .setMaxLength(2000)));

        await interaction.showModal(modal);
    }
};