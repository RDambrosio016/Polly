import { Listener } from 'discord-akairo';
import PollyClient from '../Client';
import { Guild } from 'discord.js'

export default class GuildCreateListener extends Listener {
    constructor() {
        super("guildCreate", {
            emitter: "client",
            event: "guildCreate"
        })
    }
    
    public async exec(guild: Guild) {
        let client = this.client as PollyClient
        await client.PGClient.addGuild({
            id: guild.id,
            prefix: "p!",
            pollMasterRole: null,
            creationPermissions: 0
        })
        console.log("Added new guild")
    }
}