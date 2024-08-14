import { Interaction } from './types/telegram/interaction.type';
import { Telegraf } from 'telegraf';
import { config } from 'config';
import { DeployCommands } from './telegram/deploy.commands';
import MessageListener from './telegram/events/message.listener';
import SlashCommandsListener from './telegram/events/slash-commands.listener';

const Client = new Telegraf(config.telegramToken);

Client.on('message', async (message: Interaction) => {
    MessageListener(message);
    SlashCommandsListener(message);
});

DeployCommands(Client);

const Login = async () =>
{
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