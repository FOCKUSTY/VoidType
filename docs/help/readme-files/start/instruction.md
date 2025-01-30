# Инструкция
## Инструкция по запуску бота и главным файлам

- У нас есть папка `src` в которой содержаться файлы, папки пока трогать не будем.
- На данный момент у нас 5 файлов.
1. `discord.bot.ts`
2. `telegram.bot.ts`
3. `index.config.ts`
4. `index.constants.ts`
5. `start.bot.ts`

### discord.bot.ts
- В этом файле содержиться сам бот и его код.
- Детально разбирать каждый файл не буду, чем больше файлов буду разбирать, тем меньше буду писать комментариев.
- Разберем код:
```ts
// Импорт методов и объектов
// ICL - Объект-прослушиватель для использования пользователями slash команд
// ML - Объект-послушиватель для использования пользовательми модальников
import ICL from "discord/events/interaction-create.listener";
import ML from "discord/events/modal.listener";

// Импорт дополнительного материала
// config - Наш config.json
// Debug - Объект-помощник для отладки
import { Debug } from "develop/debug.develop";
import { config } from "./index.config";

// Импорт функций для установки команд бота
// Deployer - Объект-помощник для работы с деплоем команд (и не только)
// DeployEvents - Загрузчик событий
import Deployer from "discord/deploy.commands";
import DeployEvents from "discord/deploy.events";

// Импорт модулей из node.js для просмотра файлов и папок
// path - помогает найти путь до файлов/папок
// fs - читает файлы/папки
import path from "path";
import fs from "fs";

// Испорт главный модулей
import {
	Client as DiscordClient,
    Collection,
    Events,
    GatewayIntentBits,
    Partials
} from 'discord.js';

// Установка клиента
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

// Установка коллекций команд и кулданоунов
const Commands = new Collection();
const Cooldowns = new Collection();

// Прослушиватель взаимодействия
Client.on(Events.InteractionCreate, async interaction => {
    ICL.InteractionCreate(interaction, Commands, Cooldowns);
	ML.ModalListener(interaction);
});

// Логиним нашего бота
const Login = async () => {
    // Чтение папки с командами
	const foldersPath = path.join(__dirname, "discord/commands");
	const commandsFolder = fs.readdirSync(foldersPath);

    // Чтение папки с событиями
	const eventsPath = path.join(__dirname, "discord/events");
	const eventFiles = fs
		.readdirSync(eventsPath)
		.filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

    // Установка загрузчиков
	new Deployer(foldersPath, commandsFolder).write(Client, Commands);
	new DeployEvents(eventsPath, eventFiles).execute();

    // Вход
	await Client.login(config.clientToken).catch((e) => Debug.Error(e));
};

// Экспорт
export { Commands, Login as LoginDiscord };

export default Client;
```

### telegram.bot.ts

```ts
// Импортируем главный модуль
import { Telegraf } from 'telegraf';

// Импортируем самописный тип взаимодействия
import type { Interaction } from './types/telegram/interaction.type';

// Импорт дополнительного материала
// config - Наш config.json
// DeployCommands устанавливает команды в бота
import { config } from 'config';
import { DeployCommands } from './telegram/deploy.commands';

// Импорт функций-прослушивателей
import MessageListener from './telegram/events/message.listener';
import SlashCommandsListener from './telegram/events/slash-commands.listener';

import path from 'path';
import fs from 'fs';

const Client = new Telegraf(config.telegramToken);

Client.on('message', async (message: Interaction) => {
    MessageListener(message);
    SlashCommandsListener(message);
});

const Login = async () => {
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
// Импорт конфига и настроек для бота
import config from '../config.json';
import settings from '../settings.json';

// Эскпорт
export { config,settings };
```

### index.constant.ts

```ts
// Импорт инциализатора
import { Constants } from "@thevoid";
import { version } from "../package.json";

const THEVOIDs_CONSTANTS: { [key: string]: string } = {
	"THEVOIDSBOT_REVERSE_GENDER": "девушка",
	"THEVOIDSBOT_NREVERSE": "The Void",
	"THEVOIDSBOT_REVERSE": "The Abyssia",
	"THEVOIDSBOT_LOVE": "Kristy",
	"THEVOIDSBOT_REVERSE_LOVE": "The Void",
	"THEVOID_LOVE": "Kristy",
	"THEVOID": "Меня",
	"typend_A": "",
	"typend_B": "ым",
	"version": version
};

// Инициализация
new Constants(THEVOIDs_CONSTANTS).execute();

export { THEVOIDs_CONSTANTS };

```

### start.bot.ts
```ts
// Инициализация констант
import "src/index.constants";

import Logger from "fock-logger";
import Formatter, { Colors } from "f-formatter";

import loggers from "./loggers.names";
import { Debug } from "develop/debug.develop";

import { LoginDiscord } from './discord.bot';
import { LoginTelegram } from './telegram.bot';

Debug.Console.clear();
Debug.Log([new Formatter().Color("Начало программы", Colors.magenta)]);

// Объявления среды запуска BOT (Может быть 'discrod'|'telegram'|'all')
const bot = process.env.BOT || 'discord';

for (const name in loggers) {
	const logger = loggers[name];

	new Logger(name, logger.colors).execute(`Hello, I'm ${name}!`);
}

// анонимная асинхронная функция
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

- Хотелось бы еще расмотреть скрипты в `package.json`.
### package.json > scripts
```json
"scripts": {
    "dev:slash": "nodemon src/discord/slash.commands.ts",
    "dev": "set NODE_ENV=dev&& set BOT=all&& nodemon src/start.bot.ts",
    "dev:telegram": "set NODE_ENV=dev&& set BOT=telegram&& nodemon src/start.bot.ts",
    "dev:discord": "set NODE_ENV=dev&& set BOT=discord&& nodemon src/start.bot.ts",
    "start:slash": "node -r tsconfig-paths/register dist/src/discord/slash.commands.js",
    "start:builded": "set NODE_ENV=prod&& set BOT=all&& node -r tsconfig-paths/register dist/src/start.bot.js",
    "start": "set NODE_ENV=prod&& pnpm run build && pnpm run start:slash && pnpm run start:builded",
    "build": "tsc"
}
```

1. `dev:slash`
- Запуск обновления slash-команд
2. `dev`
- Запуск бота в среде `dev`
3. `dev:telegram`
- Запуск телеграм-бота в среде `dev`
4. `dev:discord`
- Запуск дискорд-бота в среде `dev`
5. `start:slash`
- Запуск обновления slash-команд
6. `start:builded`
- Запуск скомпилированного кода
7. `start`
- Запуск компилятора и скомпилированного кода
8. `build`
- Запуск компиляции

- Рассмотрим команды, используемые в скриптах.
1. `nodemon` - Запуск чистого `ts` кода.
2. `set NODE_ENV` - Установка в `.env` `NODE_ENV` (Значение указывается через `=ЗНАЧЕНИЕ`).
3. `set BOT` - Тоже самое, что и `NODE_ENV`.
4. `&&` - Логическое "И", помогает запускать несколько скриптов в одном.
5. `tsc` - Запуск компилятора.
6. `-r tsconfig-paths/register` - Что-то с путями, крутая штука

- Думаю, вопросов больше не возникнет.
- Вы можете сами разобрать код в папка, сложнее всего будет понять:
`discord`
`telegram`
`utility`
 
- Удачи, счастливого взлома!