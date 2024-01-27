import { EmbedBuilder, Client } from 'discord.js';

const developFields: any =
[
    {
        name: `Как Вы можете помочь ?`,
        value: `Поддержать нас !`,
        inline: true
    },

    {
        name: `Как нас поддержать ?`,
        value: `Просто зайди на наш сервер **[The Void](<https://discord.gg/5MJrRjzPec>)** !`,
        inline: true
    }
];

let
  iconURL: string = 'https://cdn.discordapp.com/icons/1169284741846016061/63ff0e27c4c5de492894df065ef72266.png',
  authorName: string = 'The Void',
  footerText: string = 'id: 1169284741846016061',
  description: string = 'Эта функция пока что находится в разработке...',
  title: string = 'Функция в разработке...',
  color: number =  0x161618;

let
  developEmbed: EmbedBuilder,
  developClient: Client;


const setDevelop = async (client: Client) =>
{
  if(!client||!client.user) return;
  if (client)
  {
    const userId = await client.user.id
    const userAvatar = await client.user.avatar
    iconURL = `https://cdn.discordapp.com/avatars/${userId}/${userAvatar}.png`;
    authorName = await client.user.username;
  };
      
  developEmbed = new EmbedBuilder()
    .setColor(color)
    .setTitle(`${title}`)
    .setAuthor({name: `${authorName}`, iconURL: `${iconURL}`})
    .setDescription(`${description}`)
    .setThumbnail(`${iconURL}`)
    .setFields(developFields)
    .setTimestamp()
    .setFooter({text: `${footerText}`, iconURL: `${iconURL}`});
};
  
const getDevelop = (getter = 'developEmbed') =>
{
  switch (getter) {

    case 'developEmbed':
      return developEmbed;
    
    case 'iconURL':
      return iconURL;
    
    case 'authorName':
      return authorName;
  
    default:
      return developEmbed;
  }
};

const setDevelopClient = (client: Client) =>
{
  developClient = client;
};

const getDevelopClient = () =>
{
  return developClient;
};

export
{
  setDevelop,
  getDevelop,
  setDevelopClient,
  getDevelopClient,
  iconURL,
  authorName,
  footerText,
  description,
  title,
  color,
}