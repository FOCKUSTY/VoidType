import { Interaction } from "src/types/telegram/interaction.type";

const MessageListener = async (message: Interaction) => {
    if(message.text && message.text.startsWith('/'))
        return;
};

export default MessageListener;