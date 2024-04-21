import { setMessageId } from 't@l-msg';
import { getBot } from 'utility/bots';

export =
{
    name: 'multi_account',
    async execute(interaction: any)
    {
        if(! getBot('The Void Discord') ) return await interaction.reply('Я не подключен к Discord');

        const options =
        {
            reply_markup:
            {
                keyboard:
                [
                    [   
                        {
                            text: "Добавить",
                            callback_data: "button_add_account"
                        },
                        {
                            text: "Изменить",
                            callback_data: "button_change_account"
                        },
                        {
                            text: "Удалить",
                            callback_data: "button_delete_account"
                        },
                       
                    ]
                ],
                
                resize_keyboard: true,
                one_time_keyboard: true
            }
        };

        await interaction.reply('Что Вы хотите сделать ?\n(Добавить, изменить или удалить ?)', options);

        const chat = interaction.update.message.chat;
        const message = interaction.update.message;
        const from = interaction.update.message.from;
        const update = interaction.update;

        const replyMessages =
        [
            'Введите Discord ID:',
            'Введите пароль:',
            'Введите свой telegram ID (Если Вы его не знаете, отправьте "Введите за меня" или любое другое сообщение)',
            'Введите одноразовый четырех значный код'
        ];

        const methods =
        [
            [ 'editType',    'multi' ],
            [ 'discord ID',  'multi' ],
            [ 'пароль',      'multi' ],
            [ 'telegram ID', 'multi' ],
            [ '4-code',      'multi' ]
        ];

        setMessageId(chat.id, message.message_id + 2, from.id, 'one+ msg', replyMessages, replyMessages.length, methods);
    }
};