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
// ICL - Listener object for slash commands to be used by users
// ML - Listener object for modal users to be used
import ICL from "discord/events/interaction-create.listener";
import ML from "discord/events/modal.listener";

// Import additional material
// config - Our config.json
// Debug - Helper object for debugging
import { Debug } from "develop/debug.develop";
import { config } from "./index.config";

// Import functions for installing bot commands
// Deployer - Helper object for working with command deployment (and more)
// DeployEvents - Event loader
import Deployer from "discord/deploy.commands";
import DeployEvents from "discord/deploy.events";

// Import modules from node.js to view files and folders
// path - helps find the path to files/folders
// fs - reads files/folders
import path from "path";
import fs from "fs";

// Import main modules
import {
    Client as DiscordClient,
    Collection,
    Events,
    GatewayIntentBits,
    Partials
} from 'discord.js';

// Setting up the client
const Client = new DiscordClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences
    ],
    partials: [Partials.Channel]
});

// Setting up the command and cooldown collections
const Commands = new Collection();
const Cooldowns = new Collection();

// Interaction listener
Client.on(Events.InteractionCreate, async interaction => {
    ICL.InteractionCreate(interaction, Commands, Cooldowns);
    ML.ModalListener(interaction);
});

// Login our bot
const Login = async () => {
    // Read the commands folder
    const foldersPath = path.join(__dirname, "discord/commands");
    const commandsFolder = fs.readdirSync(foldersPath);

    // Read the events folder
    const eventsPath = path.join(__dirname, "discord/events");
    const eventFiles = fs
        .readdirSync(eventsPath)
        .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

    // Install loaders
    new Deployer(foldersPath, commandsFolder).write(Client, Commands);
    new DeployEvents(eventsPath, eventFiles).execute();

    // Login
    await Client.login(config.clientToken).catch((e) => Debug.Error(e));
};

// Export
export { Commands, Login as LoginDiscord };

export default Client;
```

### telegram.bot.ts
```ts
// Import the main module
import { Telegraf } from 'telegraf';

// Import a custom interaction type
import type { Interaction } from './types/telegram/interaction.type';

// Import additional material
// config - Our config.json
// DeployCommands installs commands into the bot
import { config } from 'config';
import { DeployCommands } from './telegram/deploy.commands';

// Import listener functions
import MessageListener from './telegram/events/message.listener';
import SlashCommandsListener from './telegram/events/slash-commands.listener';

import path from 'path';
import fs from 'fs';

const Client = new Telegraf(config.telegramToken);

Client.on('message', async (message: Interaction) => {
    MessageListener(message);
    SlashCommandsListener(message);
});

const Login = async() => {
    const commandsPath = path.join(__dirname, "telegram/commands");
    const commandsFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

    DeployCommands(Client, commandsPath, commandsFiles);

    await Client.launch();

    process.once("SIGINT", () => Client.stop("SIGINT"));
    process.once("SIGTERM", () => Client.stop("SIGTERM"));
};

export { Login as LoginTelegram };

export default Client;
```

### index.config.ts
```ts
// Import config and settings for the bot
import config from '../config.json';
import settings from '../settings.json';

// Export
export { config,settings };
```

### index.constant.ts
```ts
// Import initializer
import { Constants } from "@thevoid";
import { version } from "../package.json";

const THEVOIDs_CONSTANTS: { [key: string]: string } = {
    "THEVOIDSBOT_REVERSE_GENDER": "girl",
    "THEVOIDSBOT_NREVERSE": "The Void",
    "THEVOIDSBOT_REVERSE": "The Abyssia",
    "THEVOIDSBOT_LOVE": "Kristy",
    "THEVOIDSBOT_REVERSE_LOVE": "The Void",
    "THEVOID_LOVE": "Kristy",
    "THEVOID": "Me"
    "typend_A": "",
    "typend_B": "ym",
    "version": version
};

// Initialization
new Constants(THEVOIDs_CONSTANTS).execute();

export { THEVOIDs_CONSTANTS };

```

### start.bot.ts
```ts
// Initialize constants
import "src/index.constants";

import Logger from "fock-logger";
import Formatter, { Colors } from "f-formatter";

import loggers from "./loggers.names";
import { Debug } from "develop/debug.develop";

import { LoginDiscord } from './discord.bot';
import { LoginTelegram } from './telegram.bot';

Debug.Console.clear();
Debug.Log([new Formatter().Color("Start of program", Colors.magenta)]);

// BOT runtime declarations (Can be 'discrod'|'telegram'|'all')
const bot = process.env.BOT || 'discord';

for (const name in loggers) {
    const logger = loggers[name] ;

    new Logger(name, logger.colors).execute(`Hello, I'm ${name}!`);
}

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

- I would also like to consider the scripts in `package.json `.

### package.json > scripts
```json
"scripts": {
    "dev:slash": "nodemon src/discord/slash.commands.ts",
    "dev": "set NODE_ENV=dev&& set BOT=all&& nodemon src/start.bot.ts",
    "dev:telegram": "set NODE_ENV=dev&& set BOT=telegram&& nodemon src/start.bot.ts",
    "dev:discord": "set NODE_ENV=dev&& set BOT=discord&& nodemon src/start.bot.ts",
    "start:slash": "node -r tsconfig-paths/register dist/src/discord/slash.commands.js",
    "start:built": "set NODE_ENV=prod&& set BOT=all&& node -r tsconfig-paths/register dist/src/start.bot.js",
    "start": "set NODE_ENV=prod&& pnpm run build && pnpm run start:slash && pnpm run start:built",
    "build": "tsc"
}
```

1. `dev:slash`
- Launch slash command update
2. `dev`
- Launch bot in `dev` environment
3. `dev:telegram`
- Launch telegram bot in `dev` environment
4. `dev :discord`
- Start discord bot in `dev` environment
5. `start:slash`
- Start slash command update
6. `start:built`
- Start compiled code
7. `start`
- Start compiler and compiled code
8. `build`
- Start compilation

- Let's look at the commands used in scripts.
1. `nodemon` - Run pure `ts` code.
2. `set NODE_ENV` - Set `NODE_ENV` in `.env` (The value is specified via `=VALUE`).
3. `set BOT` - Same thing , as `NODE_ENV`.
4. `&&` - Logical "AND", helps to run several scripts in one.
5. `tsc` - Run the compiler.
6. `-r tsconfig-paths/register` - Something with ways, cool stuff

- I think there will be no more questions.
- You can parse the code in the folder yourself, the hardest thing will be to understand:
`discord`
`telegram`
`utility`

- Good luck, happy hacking!