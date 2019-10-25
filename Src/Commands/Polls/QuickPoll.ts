import { Command } from 'discord-akairo'
import Wizard from '../../Structures/Wizard';

export default class QuickPoll extends Command {

    constructor() {
        super("quickPoll", {
            aliases: ["quickpoll", "quick"],
            channel: 'guild',
            clientPermissions: ["SEND_MESSAGES"]
        })
    }

    public async exec(message, args) {
        await new Wizard(message.channel, message).exec()
    }
}