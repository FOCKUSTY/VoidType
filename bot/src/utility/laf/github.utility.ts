import { Env } from "@voidy/develop/dist";
import Formatter from "f-formatter";

import { Repo, GitHubApi as Service } from "@voidy/types/dist/utils/github.type";

const formatter = new Formatter();

class GitHubApi extends Service {
    public async getRepositories(ignoredRepo: string[] = [".github"]): Promise<Repo[]> {
        const data: Repo[] = await (await fetch(Env.get("GITHUB_REPOS_URL"), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authentication: Env.get("GITHUB_ACCESS_TOKEN")
            }
        })).json();

        return data.filter((r: Repo) => !ignoredRepo.includes(r.name));
    }

    /**
     * @param getRepository - A some repository
     * @param dateOffset - A date offset in seconds
     */
    public repositoryCommited(repository: Repo, dateOffset: number): boolean {
        const now = formatter.date.Timestamp(new Date(), "miliseconds");
        const last_commit = formatter.date.Timestamp(repository.pushed_at, "miliseconds");

        if (last_commit - now < dateOffset)
            return false;

        return true;
    }
}

export default GitHubApi;
