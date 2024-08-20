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
// Formatter - Объект-помощник для форматировки сообщений
// Colors - Объект-помощник для вывода цветных сообщений
// ICL - Объект-прослушиватель для использования пользователями slash команд
// ML - Объект-послушиватель для использования пользовательми модальников
import Formatter, { Colors } from 'utility/service/formatter.service';
import ICL from 'discord/events/interaction-create.listener';
import ML from 'discord/events/modal.listener';

// Импорт дополнительного материала
// config - Наш config.json
// Debug - Объект-помощник для отладки
import { config } from 'config';
import { Debug } from 'develop/debug.develop';

// Импорт функций для установки команд бота
// WriteCommands - Выводит отформатиранный команды в консоль
// DeployEvents - Загружает команды в бота (В Discord)
import { WriteCommands } from 'discord/deploy.commands';
import { DeployEvents } from 'discord/deploy.events';

// Импорт модулей из node.js для просмотра файлов и папок
// path - помогает найти путь до файлов/папок
// fs - читает файлы/папки
import path from 'path';
import fs from 'fs';

// Испорт главный модулей
import {
	Client as DiscordClient,
    Collection,
    Events,
    GatewayIntentBits,
    Partials
} from 'discord.js';

// Импорт самописного объекта Discord для облегчения работы
import Discord from 'discord/utility/service/discord.service';

// Установка клиента
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
Debug.Log([Formatter.Color('Начало программы', Colors.magenta)]);

// Установка команд и кулдаунов
const Commands = new Collection();
const Cooldowns = new Collection();

// Путь для папки и сама папка с командами
const foldersPath = path.join(__dirname, 'discord/commands');
const commandsFolder = fs.readdirSync(foldersPath);

// Путь для папки и сама папка с прослушивателями
const eventsPath = path.join(__dirname, 'discord/events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

WriteCommands(Commands, Client, foldersPath, commandsFolder);
DeployEvents(Client, eventsPath, eventFiles);

// Создаем прослушиватель взаимодействий пользователя
Client.on(Events.InteractionCreate, async interaction => {
    ICL.InteractionCreate(interaction, Commands, Cooldowns);
	ML.ModalListener(interaction);
});

// Логиним нашего бота
const Login = async () => {
	// Установка объекта Client в Discord
	Discord.client = Client;

	await Client
		.login(config.clientToken)
		.catch((e) => Debug.Error(e));
}

// Экспорт
export {
	Commands,
	Login as LoginDiscord
};

export default Client;
```

### telegram.bot.ts

```ts
// Импортируем самописный тип взаимодействия
import { Interaction } from './types/telegram/interaction.type';

// Импортируем главный модуль
import { Telegraf } from 'telegraf';

// Импорт дополнительного материала
// config - Наш config.json
// DeployCommands устанавливает команды в бота
import { config } from 'config';
import { DeployCommands } from './telegram/deploy.commands';

// Импорт функций-прослушивателей
import MessageListener from './telegram/events/message.listener';
import SlashCommandsListener from './telegram/events/slash-commands.listener';

// Импорт самописного объекта
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

const Login = async () =>
{
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
// Импорт конфига и настроек для бота
import config from '../config.json';
import settings from '../settings.json';

// Экспорт
export {
    config,
    settings
}
```

### index.constant.ts

```ts
// Импорт версии с package.json
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


// Экспорт объекта
export {
    THEVOIDs_CONSTANTS
};
```

### start.bot.ts
```ts
// Импорт функций из файлов
import { LoginDiscord } from './discord.bot';
import { LoginTelegram } from './telegram.bot';

// Объявления среды запуска BOT (Может быть 'discrod'|'telegram'|'all')
const bot = process.env.BOT || 'discord';

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
 - Запуск загрузки slash команд.
2. `dev`
 - Запуск не скомпилированного кода в среде `dev`.
3. `telegram`
 - Запуск только telegram бота в среде `dev`.
4. `discord`
 - Запуск только discord бота в среде `dev`.
5. `builded-slash`
 - Запуск загрузки скомпилированного кода slash команд.
6. `builded`
 - Запуск скомпилированного кода в среде `prod`.
7. `start`
 - Запуск компилятора и скомпилированного кода в серед `prod`.
8. `build`
 - Запуск компилятора.

- Рассмотрим команды, используемые в скриптах.
 - `tsx watch` - Запуск чистого `ts` кода.
 - `set NODE_ENV` - Установка в `.env` `NODE_ENV` (Значение указывается через `=ЗНАЧЕНИЕ`).
 - `set BOT` - Тоже самое, что и `NODE_ENV`.
 - `&&` - Логическое "И", помогает запускать несколько скриптов в одном.
 - `tsup` - Запуск компилятора `src/**` - значит: "В папке `src`и в других папках".

- Думаю, вопросов больше не возникнет.
- Вы можете сами разобрать код в папка, сложнее всего будет понять:
 - `discord`
 - `telegram`
 - `utility`
 
- Удачи, счастливого взлома!