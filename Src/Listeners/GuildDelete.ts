import { Listener } from 'discord-akairo';
import { Guild } from 'discord.js';
import PollyClient from '../Client';

export default class GuildDelete extends Listener {
    constructor() {
        super("guildDelete", {
            emitter: "client",
            event: "guildDelete"
        })
    }

    public async exec(guild: Guild) {
        let client = this.client as PollyClient
        client.PGClient.removeGuild(guild.id)
    }
}