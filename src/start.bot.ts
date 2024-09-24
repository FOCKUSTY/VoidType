import { LoginDiscord } from './discord.bot';
import { LoginTelegram } from './telegram.bot';

import Constants from 'loaders/utils/constants.service';
import { THEVOIDs_CONSTANTS } from "src/index.constants";

const bot = process.env.BOT || 'discord';

new Constants(THEVOIDs_CONSTANTS).execute();

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