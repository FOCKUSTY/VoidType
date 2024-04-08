import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'

const words: any =
{
    "a": 'ф',
    "b": 'и',
    "c": 'с',
    "d": 'в',
    "e": 'у',
    "f": 'а',
    "g": 'п',
    "h": 'р',
    "i": 'ш',
    "j": 'о',
    "k": 'л',
    "l": 'д',
    "m": 'ь',
    "n": 'т',
    "o": 'щ',
    "p": 'з',
    "q": 'й',
    "r": 'к',
    "s": 'ы',
    "t": 'е',
    "u": 'г',
    "v": 'м',
    "w": 'ц',
    "x": 'ч',
    "y": 'н',
    "z": 'я',
    ";": 'ж',
    "'": 'э',
    "[": 'х',
    "]": 'ъ',
    "?": ',',
    "\"": 'э',
    "|": '/',
    "}": 'Ъ',
    "{": 'Х',
    ":": ':',
    ">": 'Ю',
    "<": 'Б',
    "@": '"',
    "#": '№',
    "$": ';',
    "^": ':',
    "&": '?',
    ' ': ' '
}

module.exports =
{
    cooldown: 5,
    data: new SlashCommandBuilder()
	.setName('layoutchanger')
	.setDescription('Команда, меняющая Ваш неправильный текст на другую раскладку !')
    .setNameLocalizations({ru:'сменщик-раскладки',"en-US":'layoutchanger'})
    .setDescriptionLocalizations({
        ru:'Команда, меняющая Ваш неправильный текст на другую раскладку',
        "en-US":'A command that changes your incorrect text to a different layout'
        })
    .addStringOption(o=>o.setName('text').setDescription('Ваш неправльный текст')
        .setNameLocalizations({ru:'текст',"en-US":'text'})
        .setDescriptionLocalizations({ru:'Ваш неправльный текст', "en-US":'Your wrong text'})
        .setRequired(true)),
        async execute(interaction: any)
        {
        
        let
            message = interaction.options.getString('text'),
            output = '',
            isCapitalLetter = false;

        messageCicle: for(let char of message)
        {
            if(char != char.toLowerCase()) isCapitalLetter = true;
            char = char.toLocaleLowerCase()
            
            const letter = words[char];
            if(!letter)
            {
                output += char;
                continue messageCicle
            }
            
            if(!isCapitalLetter) output += `${letter}`;
            else output += `${letter}`.toUpperCase();

            isCapitalLetter = false;
        };

        await interaction.reply({
		content: `${output}`,
		ephemeral: true});

	},
};