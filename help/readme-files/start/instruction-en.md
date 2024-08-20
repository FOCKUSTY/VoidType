# Instructions
## Instructions for launching the bot and the main files

- We have a `src` folder that contains files, we will not touch the folders for now.
- At the moment we have 5 files.
1. `discord.bot.ts`
2. `telegram.bot.ts`
3. `index.config.ts`
4. `index.constants.ts`
5. `start.bot.ts`

### discord.bot.ts
- This file contains the bot itself and its code.
- I will not analyze each file in detail, the more files I analyze, the less comments I will write.
- Let's analyze the code:
```ts
// Import methods and objects
// Formatter - Helper object for formatting messages
// Colors - Helper object for displaying colored messages
// ICL - Listener object for slash commands to be used by users
// ML - Listener object for modal users to be used
import Formatter, { Colors } from 'utility/service/formatter.service';
import ICL from 'discord/events/interaction-create.listener';
import ML from 'discord/events/modal.listener';

// Import additional material
// config - Our config.json
// Debug - Helper object for debugging
import { config } from 'config';
import { Debug } from 'develop/debug.develop';

// Import functions for installing bot commands
// WriteCommands - Outputs formatted commands to the console
// DeployEvents - Loads commands into the bot (In Discord)
import { WriteCommands } from 'discord/deploy.commands';
import { DeployEvents } from 'discord/deploy.events';

// Import modules from node.js to view files and folders
// path - helps find the path to files/folders
// fs - reads files/folders
import path from 'path';
import fs from 'fs';

// Import main modules
import {
    Client as DiscordClient,
    Collection,
    Events,
    GatewayIntentBits,
    Partials
} from 'discord.js';

// Import a custom Discord object to make things easier
import Discord from 'discord/utility/service/discord.service';

// Set up the client
const Client = new DiscordClient({
	intents:
	[
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildPresences
	],
	partials:
	[
		Partials.Channel
	],
});


Debug.Console.clear();
Debug.Log([Formatter.Color('Program Start', Colors.magenta)]);

// Set up commands and cooldowns
const Commands = new Collection();
const Cooldowns = new Collection();

// Path for the folder and the folder itself with the commands
const foldersPath = path.join(__dirname, 'discord/commands');
const commandsFolder = fs.readdirSync(foldersPath);

// Path for the folder and the folder itself with listeners
const eventsPath = path.join(__dirname, 'discord/events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

WriteCommands(Commands, Client, foldersPath, commandsFolder);
DeployEvents(Client, eventsPath, eventFiles);

// Create a user interaction listener
Client.on(Events.InteractionCreate, async interaction => {
    ICL.InteractionCreate(interaction, Commands, Cooldowns);
    ML.ModalListener(interaction);
});

// Login our bot
const Login = async () => {
	// Set uo Client object into Discord
	Discord.client = Client;

	await Client
		.login(config.clientToken)
		.catch((e) => Debug.Error(e));
}

// Export
export {
    Commands,
    Login as LoginDiscord
};

export default Client;
```

### telegram.bot.ts

```ts
// Import a custom interaction type
import { Interaction } from './types/telegram/interaction.type';

// Import the main module
import { Telegraf } from 'telegraf';

// Import additional material
// config - Our config.json
// DeployCommands installs commands into the bot
import { config } from 'config';
import { DeployCommands } from './telegram/deploy.commands';

// Import listener functions
import MessageListener from './telegram/events/message.listener';
import SlashCommandsListener from './telegram/events/slash-commands.listener';

// Import a custom object
import Telegram from './telegram/utility/service/telegram.service';

import path from 'path';
import fs from 'fs';

const Client = new Telegraf(config.telegramToken);

Client.on('message', async (message: Interaction) => {
    MessageListener(message);
    SlashCommandsListener(message);
});

const commandsPath = path.join(__dirname, 'telegram/commands');
const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

DeployCommands(Client, commandsPath, commandsFiles);

const Login = async () => {
    Telegram.client = Client;
    await Client.launch();

    process.once('SIGINT', () =>
        Client.stop('SIGINT'));

    process.once('SIGTERM', () =>
        Client.stop('SIGTERM'));
};

export {
    Login as LoginTelegram
};

export default Client;
```

### index.config.ts

```ts
// Import config and settings for the bot import config from '../config.json';
import settings from '../settings.json';

// Export
export {
    config,
    settings
}
```

### index.constant.ts

```ts
// Import version from package.json
import { version } from '../package.json';

const THEVOIDs_CONSTANTS: any = {
    "THEVOIDSBOT_REVERSE_GENDER": 'девушка',
    "THEVOIDSBOT_NREVERSE": 'The Void',
    "THEVOIDSBOT_REVERSE": 'The Abyssia',
    "THEVOIDSBOT_LOVE": 'Kristy',
    "THEVOIDSBOT_REVERSE_LOVE": 'The Void',
    "THEVOID_LOVE": 'Kristy',
    "THEVOID": 'Меня',
    "typend_A": '',
    "typend_B": 'ым',
    "version": version
};

// Export an object
export {
    THEVOIDs_CONSTANTS
};
```

### start.bot.ts

```ts
// Import functions from files
import { LoginDiscord } from './discord.bot';
import { LoginTelegram } from './telegram.bot';

// Announcements BOT runtime environment (Can be 'discrod'|'telegram'|'all')
const bot = process.env.BOT || 'discord';

// anonymous async function
(async () => {
    switch (bot) {
        case 'discord':
            LoginDiscord();
            break;
            
        case 'telegram':
            LoginTelegram();
            break;
            
        default:
            LoginDiscord();
            LoginTelegram();
            break;
    };
})();
```

- I would also like to look at the scripts in `package.json`.
### package.json > scripts
```json
"scripts": {
    "slash": "tsx watch src/discord/slash.commands.ts",
    "dev": "set NODE_ENV=dev && set BOT=all && tsx watch src/start.bot.ts",
    "telegram": "set NODE_ENV=dev && set BOT=telegram && tsx watch src/start.bot.ts",
    "discord": "set NODE_ENV=dev && set BOT=discord && tsx watch src/start.bot.ts",

    "builded-slash": "node src/discrd/slash.commands.ts",
    "builded": "set NODE_ENV=prod && set BOT=all && node dist/start.bot.js",
    "start": "set NODE_ENV=prod && pnpm run build && pnpm run builded",
    "build": "tsup src/**"
}
```

1. `slash`
 - Run slash commands to load.
2. `dev`
 - Run uncompiled code in `dev` environment.
3. `telegram`
 - Run only telegram bot in `dev` environment.
4. `discord`
 - Run only discord bot in `dev` environment.
5. `builded-slash`
 - Run download of compiled slash code commands.
6. `builded`
 - Run compiled code in `prod` environment.
7. `start`
 - Run the compiler and compiled code in `prod` environment.
8. `build`
 - Run the compiler.

- Let's look at the commands used in scripts .
 - `tsx watch` - Run pure `ts` code.
 - `set NODE_ENV` - Set `NODE_ENV` to `.env` (The value is specified via `=VALUE`).
 - `set BOT` - Same as ` NODE_ENV`.
 - `&&` - Logical "AND", helps to run several scripts in one.
 - `tsup` - Run compiler `src/**` - means: "In the `src` folder and in other folders".

- I think , there will be no more questions.
- You can parse the code in the folder yourself, the hardest part will be understanding:
 - `discord`
 - `telegram`
 - `utility`
 
- Good luck, happy hacking!