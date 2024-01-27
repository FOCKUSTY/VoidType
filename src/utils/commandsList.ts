const commands: string[] = [];

export const hat: string = ':tophat:';

export const setCommand = (commandName: string): void =>
{
    commands.push(`${hat} /${commandName}`);
    return;
};

export const getCommands = (): string[] =>
{
    return commands;
};