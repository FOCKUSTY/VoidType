import { Interaction } from "src/types/telegram/interaction.type";
import { Debug } from "develop/debug.develop";

const options = new Map<string|number, any[]>()

const MessageListener = async (message: Interaction) => {
    if((message.text && message.text.startsWith('/')) || !message.from?.id)
        return;

    const replyOptions = options.get(message.from.id);

    if(!replyOptions)
        return;

    for(const index in replyOptions) {
        const option = replyOptions[index];

        if(Number(index) === replyOptions.length-1)
        {
            return await message.reply(option.text);
        }
        else if(message.message.message_id === option.id)
        {
            return await message.reply(option.text);
        };
    };
};

export {
    options
};

export default MessageListener;