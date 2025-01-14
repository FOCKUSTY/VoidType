import { CommandInteraction, SlashCommandBuilder } from "discord.js";

class Command<T = void> {
    private readonly _error = {
        content:
            "По какой-то причине у данной команды не было записано функции для её исполенения.\n" +
            "Если Вы видите это сообщение, срочно обратитесь к нам: https://discord.gg/5MJrRjzPec",
        ephemeral: true
    }
    private readonly _data: SlashCommandBuilder;
    private readonly _cooldown: number = 5;

    public constructor(cooldown?: number) {
        this._data = new SlashCommandBuilder();
        this._cooldown = cooldown || 5;
    }

    private async init(interaction: CommandInteraction): Promise<T|void> { await interaction.reply(this._error) };

    public get cooldown(): number {
        return this._cooldown;
    }

    public get data(): SlashCommandBuilder {
        return this._data;
    }
    
    public get execute(): (interaction: CommandInteraction) => Promise<T|void> {
        return this.init;
    }

    public set execute(execute: (interaction: CommandInteraction) => Promise<T|void>) {
        this.init = execute;
    }
};

export default Command; 