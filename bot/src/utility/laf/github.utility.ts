import { Env } from "@voidy/develop/dist";

import { Repo, GitHubApi as Service } from "@voidy/types/dist/utils/github.type";

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
        const now = Date.parse(new Date().toISOString());
        const last_commit = Date.parse(`${repository.pushed_at}`);

        if (now - last_commit < dateOffset)
            return false;

        return true;
    }
}

export default GitHubApi;
