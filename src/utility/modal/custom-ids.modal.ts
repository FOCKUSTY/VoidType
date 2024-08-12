import SayMessage from "./say-message.modal";

const customIds: any = {
    sayModal: {
        id: 'say-modal',
        components: {
            sayMessage: 'say-message'
        },
        execute: SayMessage
    }
};

export default customIds;