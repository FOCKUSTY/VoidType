import { Debug } from "develop/debug.develop";
import { Interaction } from "src/types/telegram/interaction.type";

const options = new Map<string|number, any[]>()
const saved = new Map<string, { key: string, value: string }[]>();

const MessageListener = async (message: Interaction) => {
    if((message.text && message.text.startsWith('/')) || !message.from?.id)
        return;

    const userId = message.from.id;

    const replyOptions = options.get(userId);

    if(!replyOptions)
        return;

    for(const i in replyOptions) {
        const index = Number(i);
        const option: {
            id: number|string,
            option: string,
            error: string,
            text: string,

            function: (...args: any) => any,
            addArgs: any[]
        } = replyOptions[index];

        if(message.message.message_id - 2 === option.id)
        {
            const savedOptions = saved.get(`${userId}`) || [];

            saved.set(`${userId}`,
                [...savedOptions, { key: option.option, value: message.message.text }]);
        };

        if(message.message.message_id === option.id) {
            return await message.reply(option.text);
        }
        else if(index === replyOptions.length-1) {
            options.delete(userId);

            const savedOptions = saved.get(`${userId}`) || [];
            const args = savedOptions.map(element => element.value);

            const res = await option.function(...args, ...option.addArgs);
            
            if(res.type === 1)
                return await message.reply(option.text.replace('%SUCCESS%', res.text));
            else
                return await message.reply(option.error.replace('%ERROR%', res.text));
        };
    };
};

export {
    options
};

export default MessageListener;