import { Storage } from './Storage'
import { GitProvider, SnippetId, Snippet } from './GitProvider';

export class GitlabStorage implements Storage<Promise<string>,string> {

    private path: string;
    private gitProvider: GitProvider;

    constructor(provider: GitProvider, path: string) {
        this.gitProvider = provider
        this.path = path
    }

    async read(): Promise<string> {
        return this.gitProvider.Snippets.content(await this.resolveId()).then(_ => _)
    }

    async write(content: string) {
        const id = await this.resolveId()
        if (id !== null)
            this.gitProvider.Snippets.edit(id, { content })
        else 
            this.gitProvider.Snippets.create(this.path, "", content, "private")
    }

    private async resolveId(): Promise<SnippetId> {
        const snippet = <Snippet>await this.gitProvider
            .Snippets.all({ public: false }).then(s => s.find(s => s.title === this.path))
        if (typeof snippet === 'undefined')
            return null
        return snippet.id
    }
}