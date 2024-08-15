import { options } from "telegram/events/message.listener";
import { Interaction } from "types/telegram/interaction.type";

export = {
    name: 'send_message_to_discord',
    options: [
        'channelId',
        'message'
    ],
    async execute(interaction: Interaction) {
        const replyOptions = [
            {
                text: 'Введите id канала',
                id: interaction.message.message_id
            },
            {
                text: 'Введите сообщение',
                id: interaction.message.message_id + 2
            },
            {
                error: 'Не удалось отправить сообщение в Discord\nОшибка: %ERROR%',
                text: 'Сообщение было отправлено в Discord\nСообщение: %SUCCESS%',
            }
        ];

        options.set(interaction.from?.id!, replyOptions);

        await interaction.reply(replyOptions[0].text);
    }
};