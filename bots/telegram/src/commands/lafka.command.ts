import { Env } from "@voidy/develop/dist";

import { Services } from "@voidy/types/dist/all/services.type";
import { GitHubApi } from "@voidy/types/dist/utils/github.type";

import TelegramCommand from "@voidy/types/dist/commands/telegram-command.type";
import { Random } from "random-js";

import { MessageEntity } from "@telegraf/types/message";
import * as Telegraf from "telegraf";

const { FmtString } = Telegraf.Format;
const ids = (Env.data.TELEGRAM_TEAM_IDS || "").split(",");
const cats = [
    "Рыжий",
    "Персидский",
    "Голубой",
    "Серый",
    "Трёхйветный",
    "Сфинкс"
];

const dateOffset = 7 * 24 * 60 * 60 * 1000;
const dash = "—";

const getCat = () => cats[new Random().integer(0, cats.length-1)];

export default class Command extends TelegramCommand {
	public constructor(services: Services<{github: GitHubApi}>) {
		super({
            name: "lafka",
            async execute(interaction) {
                if (!interaction.from?.id)
                    return await interaction.reply("Произошла ошибка, кот ошибки: " + getCat() + " 1");

                if (!ids.includes(`${interaction.from.id}`))
                    return await interaction.reply("Произошла ошибка, кот ошибки: " + getCat() + " 2");

                const repositories = await services.github.getRepositories([".github"]);
                const repos = repositories
                    .filter(r => services.github.repositoryCommited(r, dateOffset))
                    .map(r => [r.name, r.html_url]);

                let text = "Держите Ваши репозитории:\n";
                const entities: MessageEntity[] = [];

                for (const repo of repos) {
                    text += (dash + " " + repo[0] + "\n");

                    entities.push({
                        offset: text.length - repo[0].length - 1,
                        length: repo[0].length,
                        type: "text_link",
                        url: repo[1],
                    });
                }

                return await interaction.reply(new FmtString(text, entities), {
                    link_preview_options: {
                        is_disabled: true,
                        show_above_text: true
                    }
                });
            },
		});
	}
}
