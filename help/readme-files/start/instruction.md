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
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildPresences
	],
	partials: [
		Partials.Channel
	],
});

Debug.Console.clear();
Debug.Log([Formatter.Color('Начало программы', Colors.magenta)]);

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
    // Путь до команд
	const foldersPath = path.join(__dirname, 'discord/commands');
	const commandsFolder = fs.readdirSync(foldersPath);

    // Путь до событий
	const eventsPath = path.join(__dirname, 'discord/events');
	const eventFiles = fs.readdirSync(eventsPath)
		.filter(file => file.endsWith('.js') || file.endsWith('.ts'));

    // Загрузка команд и прослушивателей событий
	WriteCommands(Commands, Client, foldersPath, commandsFolder);
	new DeployEvents(eventsPath, eventFiles).execute();

    // Логиним нашего бота
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

const Login = async () => {
    const commandsPath = path.join(__dirname, 'telegram/commands');
    const commandsFiles = fs.readdirSync(commandsPath)
        .filter(file => file.endsWith('.js') || file.endsWith('.ts'));

    DeployCommands(Client, commandsPath, commandsFiles);

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
import path from 'path';

// Импорт конфига и настроек для бота
import config from '../config.json';
import settings from '../settings.json';

// Создание рут-папки
const TheVoidDir = path.resolve('../../');

// Создание объекта
const pathData = {
    TheVoidDir
};

// Эскпорт
export {
    config,
    settings,
    pathData
};
```

### index.constant.ts

```ts
// Импорт версии с package.json
import { version } from '../package.json';

const THEVOIDs_CONSTANTS: { [key: string]: string } = {
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
    "dev:slash": "tsx watch src/discord/slash.commands.ts",
    
    "dev": "set NODE_ENV=dev&& set BOT=all&& tsx watch src/start.bot.ts",
    "dev:telegram": "set NODE_ENV=dev&& set BOT=telegram&& tsx watch src/start.bot.ts",
    "dev:discord": "set NODE_ENV=dev&& set BOT=discord&& tsx watch src/start.bot.ts",

    "start:slash": "node dist/the-void-bots/VoidType/src/discrd/slash.commands.ts",
    "start:builded": "set NODE_ENV=prod&& set BOT=all&& node dist/the-void-bots/VoidType/src/start.bot.js",
    "start": "set NODE_ENV=prod&& pnpm run build && pnpm run start:builded",
    
    "build": "tsc && tsc-alias"
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
1. `tsx watch` - Запуск чистого `ts` кода.
2. `set NODE_ENV` - Установка в `.env` `NODE_ENV` (Значение указывается через `=ЗНАЧЕНИЕ`).
3. `set BOT` - Тоже самое, что и `NODE_ENV`.
4. `&&` - Логическое "И", помогает запускать несколько скриптов в одном.
5. `tsc` - Запуск компилятора.

- Думаю, вопросов больше не возникнет.
- Вы можете сами разобрать код в папка, сложнее всего будет понять:
`discord`
`telegram`
`utility`
 
- Удачи, счастливого взлома!