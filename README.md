# VoidType

## The Void - Это просто простой бот !
- The Void Bot нацелен на увеличение опыта автора в JavaScript и TypeScript.
- К тому же у The Void по тихоньку появляется история и, возможно, мини сюжет.

### Как разбираться в коде ?
- В коде разобраться не сложно, много функций разбито по файлам, конечно, комментарий нет, но все названия переменных и функций имеют конкретное значение, иногда встречаются сокращения, но обычно их сопровождают комментарии автора.

### Как создать своего бота ?
- Для начала нужно создать бота на [discord.dev](https://discord.com/developers/applications) сайте.

<picture>
    <img alt="Show in discord dev a new app" src="./help/newapp.png">
</picture>

- После берем id бота.

<picture>
    <img src="./help/app.png">
</picture>

- После id берем токен, для этого переходим в bot.

<picture>
    <img src="./help/token.png">
</picture>

- Когда Вы все сделали, можно запускать бота на сервер. Для этого переходим в OAuth2 и выбираем в OAuth2 URL Generator application.commands и копируем

<picture>
    <img src="./help/OAuth2.png">
</picture>

<picture>
    <img src="./help/OAuth2URLGenerator.png">
</picture>

- В итоге, переходим по ссылке, которую Вы скопировали и бот у нас на сервере.
- В коде вы можете разобраться сами, напишу кратко:
- Пишите в командной строке:

```
npm init
npm i
npm i discord.js
```

- Создайте config.json файл и впишите в него:

```json
{
    "token": "YOUR-TOKEN",
    "id": "YOUR-APP-ID"
}
```

# Если Вы кодите на JavaScript:

- Создайте index.js файл и впишите в него:

```js
const { Client, Collection, Events, GatewayIntentBits, Partials } = require('discord.js');
const { token } = require('./config.json');

/* 

YOUR-IMPORT-HERE

*/

const client = new Client({
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

/* 

YOUR-CODE-HERE

*/

client.login(token);
```

# Если Вы кодите на TypeScript:

- Создайте index.ts файл и впишите в него:

```ts
import { Client, Collection, Events, GatewayIntentBits, Partials } from 'discord.js';
import { token } from './config.json';

/* 

YOUR-IMPORT-HERE

*/

const client: Client = new Client({
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

/* 

YOUR-CODE-HERE

*/

client.login(token);
```

- Создайте tsconfig.json:
```json
{
    "compilerOptions": {
        "target": "ES2020",
        "module": "CommonJS",
        "rootDir": "../",
        "outDir": "./dist",
        "removeComments": true,
        "resolveJsonModule": true,
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,
        "strict": true,
        "strictNullChecks": true,
        "skipLibCheck": true, 
        "baseUrl": "./",
		"paths": {}
	},
    "include": ["./**/*.ts"]
}
```

- Добавьте в package.json:
```json
  "devDependencies": {
    "@types/node": "^20.10.5",
    "ts-node": "^10.9.2",
    "tsup": "^7.2.0",
    "tsx": "^4.1.1",
    "typescript": "^5.3.3"
  }
```

- И впишите в терминал:
```
npm i 
```