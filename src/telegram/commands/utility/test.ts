export =
{
    name: 'test',
    async execute(interaction: any)
    {
        await interaction.reply('Test !');

        const chat = interaction.update.message.chat;
        const message = interaction.update.message;
        const from = interaction.update.message.from;
        const update = interaction.update;

        const data =
        {
            chat: chat,
            message: message,
            from: from,
            update: update
        };

        console.log(data);

        // setMessageId(chat.id, message.message_id + 2, from.id, 'пароль|one+ msg', 'Введите пароль');
    }
}