# Инструкция
## Инструкция по клонированию репозитория и дальнейшей установке

- Склонируйте репозиторий.

```
git clone https://github.com/FOCKUSTY/VoidType.git
```

- И загрузить все библиотеки:

```
npm i
```

- Дальше найдите `.env.example`
- Можете просто убрать `.exapmle` из название и заметить на Ваши значения.

- Мы получаем такой `.env` файл.

```
CLIENT_TOKEN=
CLIENT_ID=

TELEGRAM_TOKEN=

IDEA_CHANNEL_ID=

CHANGELOG_TELEGRAM_CHANNEL_ID=
CHANGELOG_DISCORD_CHANNEL_ID=

GUILD_ICON_URL=

GUILD_ID=
AUTHOR_ID=
FRIEND_ID=
```

### `CLIENT_TOKEN` & `CLIENT_ID` бота

- После берем id бота.

<picture>
    <img src="../../pictures/app.png">
</picture>

- После id берем токен, для этого переходим в bot.

<picture>
    <img src="../../pictures/token.png">
</picture>

- После вставляем полученный значения в `.env`.

### `TELEGRAM_TOKEN`

- Заходим в telegram.
- Находим бота BotFather или переходим по [ссылке](https://t.me/BotFather).
- Нажимаем на кнопку ЗАПУСТИТЬ

<picture>
    <img src="../../pictures/bot-father-start.png">
</picture>

- Вводим команду /newbot

<picture>
    <img src="../../pictures/bot-father-newbot.png">
</picture>

- Пишем имя бота в следующем формате: `НАЗВАНИЕ-БОТА_bot`.

<picture>
    <img src="../../pictures/bot-father-newbot-name.png">
</picture>

- После копируем token бота, который нам выдали и вставляем в `.env`.

### `CHANGELOG_TELEGRAM_CHANNEL_ID` & `CHANGELOG_DISCORD_CHANNEL_ID` & `GUILD_ID` & `AUTHOR_ID`

- Вот здесь страшно.
- Для начала получем `channelId` из discord.
- Для этого заходим в настройки.

<picture>
    <img src="../../pictures/discord-settings.png">
</picture>

- Переходим в расширенный настройки.

<picture>
    <img src="../../pictures/discord-advanced-settings.png">
</picture>

- Включаем режим разработчика.

<picture>
    <img src="../../pictures/discord-develop-mode-settings.png">
</picture>

- Выходим из настроек и нажимаем правой кнопкой по любому чату, после копируем id канала.

<picture>
    <img src="../../pictures/discord-channel-id.png">
</picture>

- Теперь скопируем authorId и guildId.

<picture>
    <img src="../../pictures/discord-guild-id.png">
</picture>

<picture>
    <img src="../../pictures/discord-author-id.png">
</picture>

- Насчет `FRIEND_ID` это, можно сказать, друг, так что Вы можете скопировать id своего друга или вообще убрать это из `.env`. Дальнейшие действия за Вами.

<picture>
    <img src="../../pictures/discord-user-id.png">
</picture>

- Что насчет telegram группы, Вы можете просто скопировать ссылку на группу.
- Также можно написать через символ @, вот пример: `@BottomlessHat`.

<picture>
    <img src="../../pictures/telegram-group-id.png">
</picture>

- Я бы мог и больше рассказать, но дальше, я думаю, что Вы и сами поймёте
- Поздравляем, мы взяли все значения, теперь можете их вставлять в `.env` !
- Можете прочитать [инструкцию по запуску](../start/instruction.md)