import SayTelegramMessage from "./say-telegram-message.modal";
import SayMessage from "./say-message.modal";

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
    }
};

export default customIds;