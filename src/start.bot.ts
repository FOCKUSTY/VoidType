import { LoginDiscord } from './discord.bot';
import { LoginTelegram } from './telegram.bot';

const enviroment = process.env.NODE_ENV || 'discord';

(async () => {
    switch (enviroment) {
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