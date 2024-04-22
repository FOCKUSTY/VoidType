# VoidType

## The Void - This is just a simple bot!
- The Void Bot aims to increase the author's experience in JavaScript and TypeScript.
- In addition, The Void is slowly developing a story and, possibly, a mini-plot.

### How to understand the code?
- It’s not difficult to understand the code, many functions are divided into files, of course, there are no comments, but all the names of variables and functions have a specific meaning, sometimes there are abbreviations, but usually they are accompanied by comments from the author.

### How to create your own bot?
- First you need to create a bot on the [discord.dev](https://discord.com/developers/applications) website.

<picture>
    <img alt="Show in discord dev a new app" src="./help/newapp.png">
</picture>

- Then we take the bot id.

<picture>
    <img src="./help/app.png">
</picture>

- After id we take a token, for this we go to bot.

<picture>
    <img src="./help/token.png">
</picture>

- When you have done everything, you can launch the bot on the server. To do this, go to OAuth2 and select application.commands in OAuth2 URL Generator and copy

<picture>
    <img src="./help/OAuth2.png">
</picture>

<picture>
    <img src="./help/OAuth2URLGenerator.png">
</picture>

- As a result, we follow the link that you copied and the bot is on our server.
- You can figure out the code yourself.
- Write on the command line:

```
npm init
npm i
npm i discord.js
```

- Create a config.json file and write in it:

```json
{
    "token": "YOUR-TOKEN",
    "id": "YOUR-APP-ID"
}
```

# If you coding on JavaScript:

- Create index.js file and write:

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

# If you coding on TypeScript:

- Create index.ts file and write:

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

- Create tsconfig.json:
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

- Add to package.json:
```json
  "devDependencies": {
    "@types/node": "^20.10.5",
    "ts-node": "^10.9.2",
    "tsup": "^7.2.0",
    "tsx": "^4.1.1",
    "typescript": "^5.3.3"
  }
```

- And write to terminal:
```
npm i 
```