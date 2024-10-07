import { Interaction } from './types/telegram/interaction.type';

import { Telegraf } from 'telegraf';

import { config } from 'config';
import { DeployCommands } from './telegram/deploy.commands';

import MessageListener from './telegram/events/message.listener';
import SlashCommandsListener from './telegram/events/slash-commands.listener';

import path from 'path';
import fs from 'fs';

const Client = new Telegraf(config.telegramToken);

Client.on('message', async (message: Interaction) => {
    SlashCommandsListener(message);
    MessageListener(message);
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