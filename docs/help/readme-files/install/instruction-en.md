# Instructions
## Instructions for cloning the repository and further installation

- Clone the repository.

```
git clone https://github.com/FOCKUSTY/VoidType.git
```

- And download all the libraries:

```
npm i
```

- Then find `.env.example`.
- You can simply remove `.exapmle` from the name and note your values.

- We get such a `.env` file.

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

### bot's `CLIENT_TOKEN` & `CLIENT_ID`

- Then take the bot id.

<picture>
    <img src="../../pictures/app.png">
</picture>

- After the id, take the token, for this, go to bot.

<picture>
    <img src="../../pictures/token.png">
</picture>

- Then insert the received values ​​into `.env`.

### `TELEGRAM_TOKEN`

- Go to telegram.
- Find the BotFather bot or follow the [link](https://t.me/BotFather).
- Click the START button

<picture>
    <img src="../../pictures/bot-father-start.png">
</picture>

- Enter the command /newbot

<picture>
    <img src="../../pictures/bot-father-newbot.png">
</picture>

- Write the bot name in the following format: `BOT-NAME_bot`.

<picture>
    <img src="../../pictures/bot-father-newbot-name.png">
</picture>

- Then copy the bot token that was given to us and paste it into `.env`.

### `CHANGELOG_TELEGRAM_CHANNEL_ID` & `CHANGELOG_DISCORD_CHANNEL_ID` & `GUILD_ID` & `AUTHOR_ID`

- This is where it gets scary.
- First, get `channelId` from discord.
- To do this, go to the settings.

<picture>
    <img src="../../pictures/discord-settings.png">
</picture>

- Go to advanced settings.

<picture>
    <img src="../../pictures/discord-advanced-settings.png">
</picture>

- Enable developer mode.

<picture>
    <img src="../../pictures/discord-develop-mode-settings.png">
</picture>

- Exit settings and right-click on any chat, then copy channel id.

<picture>
    <img src="../../pictures/discord-channel-id.png">
</picture>

- Now copy authorId and guildId.

<picture>
    <img src="../../pictures/discord-guild-id.png">
</picture>

<picture>
    <img src="../../pictures/discord-author-id.png">
</picture>

- About FRIEND_ID this is, one might say, a friend, so you can copy your friend's id or even remove it from `.env`. Further actions are up to you.

<picture>
    <img src="../../pictures/discord-user-id.png">
</picture>

- What about the telegram group, you can just copy the link to the group.
- You can also write through the @ symbol, here is an example: `@BottomlessHat`.

<picture>
    <img src="../../pictures/telegram-group-id.png">
</picture>

- I will can tell more, but I think that you can youself
- Congratulations, we got all the values, now you can insert them into `.env` !
- You can read [the launch instructions](../start/instruction-en.md)