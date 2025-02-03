# VoidType

## Дополнительно
- [Commit system](./docs/help/readme-files/docs/commit.system-en.md)
- [Install instruction](./docs/help/readme-files/install/instruction-en.md)
- [Start instruction](./docs/help/readme-files/start/instruction-en.md)

## The Void - This is just a simple bot!
- The Void Bot is aimed at increasing the author's experience in JavaScript and TypeScript.
- In addition, The Void is slowly developing a story and, possibly, a mini-plot.

### How to understand the code?
- The code is not difficult to understand, many functions are divided into files, of course, there are no comments, but all the names of variables and functions have a specific meaning, sometimes there are abbreviations, but usually they are accompanied by comments from the author.

### How to create your own bot?
- First, you need to create a bot on the [discord.dev](https://discord.com/developers/applications) website.

<picture>
	<img alt="Show in discord dev a new app" src="./docs/help/pictures/newapp.png">
</picture>

- Then we take the bot ID.

<picture>
	<img src="./docs/help/pictures/app.png">
</picture>

- After id, take the token, for this, go to bot.

<picture>
	<img src="./docs/help/pictures/token.png">
</picture>

- When you have done everything, you can launch the bot on the server. To do this, go to OAuth2 and select in OAuth2 URL Generator application.commands and copy

<picture>
	<img src="./docs/help/pictures/OAuth2.png">
</picture>

<picture>
	<img src="./docs/help/pictures/OAuth2URLGenerator.png">
</picture>

- Finally, follow the link that you copied and the bot is on our server.
- You can figure out the code yourself, I'll write briefly:
1. You can copy this repository with the command:

```
	git clone https://github.com/FOCKUSTY/VoidType.git
```

- And download all the libraries:

```
	npm i
```

- Then find `.env.example`
- You can simply remove `.exapmle` from the name and note your values.
- If you can't figure it out yourself, you can go to [detailed instructions](./docs/help/readme-files/install/instruction-en.md).

2. Type in the command line:

```
	npm init
	npm i
	npm i discord.js
```

- Create a `.env` file and write the following in it, replacing `YOUR_DISCORD_CLIENT_TOKEN` and `YOUR_DISCORD_CLIENT_ID` with the bot token and id respectively:

```
CLIENT_TOKEN=YOUR_DISCORD_CLIENT_TOKEN
CLIENT_ID=YOUR_DISCORD_CLIENT_ID
```

# If you are coding in JavaScript:

- Create an index.js file and write in it:

```js
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { config } = require("dotenv");

config("./.env"); // or "../.env"

/*

YOUR-IMPORT-HERE

*/

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent
	],
	partials: [
		Partials.Channel
	],
});

/*

YOUR-CODE-HERE

*/

client.login(proccess.env.CLIENT_TOKEN!);
```

# If you are coding in TypeScript:

- Create an `index.ts` file and add to it:

```ts
import { Client, Collection, Events, GatewayIntentBits, Partials } from 'discord.js';
import { config } from "dotenv";

config("./.env"); // or "../.env"

/*

YOUR-IMPORT-HERE

*/

const client: Client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent
	],
	partials: [
		Partials.Channel
	],
});

/*

YOUR-CODE-HERE

*/

client.login(proccess.env.CLIENT_TOKEN!);
```

- Create `tsconfig.json`:
```json
{
	"compilerOptions": {
		"target": "ES2024",
		"module": "CommonJS",
		"rootDir": "./",
		"outDir": "./dist", // can be named build.
		"removeComments": true,
		"resolveJsonModule": true,
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"strict": true,
		"strictNullChecks": true,
		"skipLibCheck": true,
		"paths": {
			// "path-name": [ "your-paths", "another-path" ]
			// "folder-and-all-the-files-in-it/*": [ "another-folder/*", "another/*", "and-this-file.yea" ]
		}
	},
	"include": ["./**/*.ts"], // ALL TS-FILES IN A PROJECT. HAHAHAHAHAHAHHA.
	"exclude": [ "node_modules", "dist" ] // And don't forget...
}
```

- Add to `package.json`:
```json
  "devDependencies": {
    "@types/node": "^20.16.1",
    "dotenv": "^16.4.5",
    "nodemon": "^3.1.7",
    "ts-node": "^10.9.2",
    "tsc": "^2.0.4",
    "tsc-alias": "^1.8.10",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.5.4"
}
```

- And type in terminal:

```
	npm i
```