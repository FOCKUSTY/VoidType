import { Env } from "@voidy/develop/dist";

type Repo = {
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
        "followers_url": string,
        "following_url": string,
        "gists_url": string,
        "starred_url": string,
        "subscriptions_url": string,
        "organizations_url": string,
        "repos_url": string,
        "events_url": string,
        "received_events_url": string,
        "type": string,
        "site_admin": boolean
    },
    "private": boolean,
    "html_url": string,
    "description": string,
    "fork": boolean,
    "url": string
}[];

class GitHubApi {
    public async getRepositories(ignoredRepo: string[] = [".github"]): Promise<Repo> {
        const data: Repo = await (await fetch(Env.get("GITHUB_REPOS_URL"), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authentication: Env.get("GITHUB_ACCESS_TOKEN")
            }
        })).json();

        return data.filter(r => !ignoredRepo.includes(r.name));
    }
}

export default GitHubApi;
