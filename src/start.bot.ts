import { LoginDiscord } from './discord.bot';
import { LoginTelegram } from './telegram.bot';

const bot = process.env.BOT || 'discord';

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