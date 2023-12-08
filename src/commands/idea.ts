import { SlashCommandBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ModalBuilder, CommandInteraction, ModalActionRowComponentBuilder } from 'discord.js';
import { Random } from "random-js";
import { objectIdeas } from '../develop';
const random = new Random();
let booleanVar = false;

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
	.setName('idea')
	.setDescription('Предложить свою идею !')
    .setNameLocalizations({ru:'идея',"en-US":'idea'})
    .setDescriptionLocalizations({ru:'Предложить свою идею',"en-US":'Suggest your idea'}),
    async execute(interaction: CommandInteraction) {
/*     bannedUsers.forEach(async bannedUser => {
        if(interaction.user.id === bannedUser.id) {
            booleanVar = true;
            await interaction.reply({content: `Вы находитесь в черном списке`, ephemeral: true})
            return;
        }
    }) */
        if(booleanVar===false) {
    const modal = new ModalBuilder()
        .setCustomId(`ideaModal`)
        .setTitle(`Ваша идея`);

    let ideaPH: string = `Добавить Валю в команду The Void Community`
    let ideaDetailPH: string = `Хочу, чтобы Валя был администратором на The Void Community!!!!`

/*     let randomNumber: number = random.integer(0, objectIdeas.length-1);
    ideaPH = objectIdeas[randomNumber].idea
    ideaDetailPH = objectIdeas[randomNumber].ideaDetail */

    modal.addComponents(
        new ActionRowBuilder<ModalActionRowComponentBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('ideaTitle')
                .setLabel("Напишите Вашу идею")
                .setStyle(TextInputStyle.Short)
                .setMaxLength(256)
                .setRequired(true)
                .setPlaceholder(`${ideaPH}`)
            ),
        new ActionRowBuilder<ModalActionRowComponentBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('ideaDetails')
                .setLabel("Опишите идею в деталях")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setMaxLength(3000)
                .setPlaceholder(`${ideaDetailPH}`)
            )
    )
    
    await interaction.showModal(modal);}

	},
};