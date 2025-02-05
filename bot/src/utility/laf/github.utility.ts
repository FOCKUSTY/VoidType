import { Env } from "@voidy/develop/dist";
import Formatter from "f-formatter";

interface Repo {
    "id": number,
    "node_id": string,
    "name": string,
    "full_name": string,
    "owner": {
        "login": string,
        "id": number,
        "node_id": string,
        "avatar_url": string,
        "gravatar_id": string,
        "url": string,
        "html_url": string,
        "type": string,
        "site_admin": boolean
    },
    "private": boolean,
    "html_url": string,
    "description": string,
    "fork": boolean,
    "language": string,
    "forks_count": number,
    "stargazers_count": number,
    "watchers_count": number,
    "size": number,
    "default_branch": string,
    "open_issues_count": number,
    "is_template": boolean,
    "topics": string[],
    "has_issues": boolean,
    "has_projects": boolean,
    "has_wiki": boolean,
    "has_pages": boolean,
    "has_downloads": boolean,
    "archived": boolean,
    "disabled": boolean,
    "visibility": string,
    "pushed_at": Date,
    "created_at": Date,
    "updated_at": Date,
    "allow_rebase_merge": boolean,
    "forks": number,
    "open_issues": number,
    "watchers": number
};

const formatter = new Formatter();

class GitHubApi {
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
