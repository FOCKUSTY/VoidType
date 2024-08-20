import SayTelegramMessage from "./say-telegram-message.modal";
import SayMessage from "./say-message.modal";
import Update from "./update.modal";

const customIds = {
    sayModal: {
        id: 'say-modal',
        components: {
            sayMessage: 'say-message',
            sayChannel: 'say-channel'
        },
        execute: SayMessage
    },
    sayTelegramModal: {
        id: 'say-telegram-modal',
        components: {
            sayTelegramMessage: 'say-telegram-message',
            sayTelegramChannel: 'say-telegram-channel'
        },
        execute: SayTelegramMessage
    },
    updateModal: {
        id: 'update-modal',
        components: {
            version: 'update-version',
            ruText: 'update-ru-text',
            enText: 'update-en-text'
        },
        execute: Update
    }
};

export default customIds;