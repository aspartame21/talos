import { Plugin } from "../interfaces/Plugin"
import { GitClient } from "../interfaces/GitClient";
import { MergeRequestEvent } from "../interfaces/MergeRequestEvent";

export class Welcome implements Plugin<any, Promise<any>> {

    private client: GitClient

    constructor(client: GitClient) {
        this.client = client
    }

    handle(rx: MergeRequestEvent): Promise<any> {

        if (rx.object_kind !== "merge_request")
            return

        if (!rx.object_attributes.action || rx.object_attributes.action !== "open")
            return

        const message = `
            Hi @${rx.user.username}! Thanks for your MR.
            Once your changes are ready to be merged type \`/ready-for-review\` so that I can assign reviewers.
        `;

        return this.client.MergeRequestNotes
            .create(rx.project.id, rx.object_attributes.iid, message);
    }

}