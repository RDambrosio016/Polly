import { Command } from 'discord-akairo';
import PollyClient from '../../../Client';

export default class deletePoll extends Command {

    constructor() {
        super("deletePoll", {
            aliases: ["delpoll", "deletepoll", "del"],
            channel: 'guild',
            clientPermissions: ["SEND_MESSAGES"],
            args: [
                {
                    id: "data",
                    match: "content"
                },
                {
                    id: "allFlag",
                    match: "flag",
                    flag: "--all"
                }
            ]
        })
    }

    public async exec() {
        let client: PollyClient = this.client as PollyClient
        
    }
}