import { SlashCommandBuilder } from 'discord.js';
import { pseudoRandomNumber } from 'pseudo-random';
import { Random } from 'random-js';

const random = new Random();

const history: any[] = [];

export =
{
    cooldown: 5,
    data: new SlashCommandBuilder()
	.setName('8ball')
	.setDescription('Предсказание будущего !')
    .setNameLocalizations({ru:'шар', "en-US":'8ball'})
	.setDescriptionLocalizations({ru:'Предсказание будущего', "en-US":'Predicting the future'})
    .addStringOption(option =>
        option.setName('question').setDescription('Ваш вопрос').setRequired(true)
        .setNameLocalizations({ru:'вопрос', "en-US":'question'})
        .setDescriptionLocalizations({ru:'Ваш вопрос', "en-US":'Your question'})),
    async execute(interaction: any)
    {
        await interaction.reply({ content: `Предсказываю...`, ephemeral: true })

        let categoryes =
        [
            [
                'Бесспорно', 'Это было предрешено', 'Никаких сомнений', 'Определённо да', 'Можешь быть уверен в этом',
                'Думаю да...', 'Наверное...', 'Хорошие перспективы', 'Знаки говорят да...', 'Да'
            ],

            [
                'Звезд на небе не видно, попробуй позже', 'Спроси позже', 'Лучше не рассказывать',
                'Погода для предсказывание плохая', 'Сконцентрируйся и спроси опять'
            ],

            [
                'Даже не думай', 'Мой ответ нет',
                'По моим данным нет', 'Перспективы не очень хорошие'
            ]
        ];

        const
            rCategory = random.integer(0, categoryes.length-1),
            rNum = pseudoRandomNumber(0, categoryes[rCategory].length-1),
            text = categoryes[rCategory][rNum],
            question = interaction.options.get(`question`)?.value;

        setTimeout(async () =>
        {            
            await interaction.editReply({ content: `Ваш вопрос: ${question}\nМой ответ: ${text}`, ephemeral: true});
        }, 1000);
	},
};