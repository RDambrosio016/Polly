import * as pg from 'pg'
import { user, poll, guild } from '../../typings'
import { readFileSync }from "fs"
import { Collection } from "discord.js"

export default class PGClient {
    public db: pg.Client;
    public connected: boolean = false
    public pollCache: Collection<string, poll>
    public guildCache: Collection<string, guild>
    private _addPollSQL: string = readFileSync("Sql/addPoll.sql").toString()
    private _addSettingsSQL: string = readFileSync("Sql/addSettings.sql").toString()
    private _addGuildSQL: string = readFileSync("Sql/addGuild.sql").toString()
    private _removeGuildSQL: string = readFileSync("Sql/removeGuild.sql").toString()

    constructor() {
        this.db = new pg.Client({
            user: process.env.PG_USER,
            password: process.env.PG_PASSWORD,
            database: "polly",
            port: process.env.PG_PORT,
            connectionString: process.env.PG_CONSTRING
        })
    }

    public async connect(): Promise<this> {
        await this.db.connect().catch(console.error)
        this.connected = true
        this.pollCache = new Collection()
        this.guildCache = new Collection()

        for(let i of (await this.db.query("SELECT * FROM polls")).rows) {
            this.pollCache.set(i.id, i)
        }
        for(let i of (await this.db.query("SELECT * FROM guilds")).rows) {
            this.guildCache.set(i.id, i)
        }
        return this;
    }

    public async addPoll(poll: poll): Promise<void> {
        await this.db.query(this._addPollSQL, [
            poll.closed, poll.options, poll.id, poll.guild, poll.creator, poll.title
        ])
        await this.db.query(this._addSettingsSQL, [
            poll.settings.poll_id, poll.settings.anonymousVotes, poll.settings.customPrompts, poll.settings.numOptions, poll.settings.endTimestamp
        ])
        this.pollCache.set(poll.id, poll)
    }

    public async addGuild(guild: guild): Promise<void> {
        await this.db.query(this._addGuildSQL, [
            guild.id, guild.prefix, guild.creationPermissions
        ])
        this.guildCache.set(guild.id, guild)
    }

    public async removeGuild(id: string): Promise<void> {
        await this.db.query(this._removeGuildSQL, [
            id
        ])
        this.guildCache.delete(id)
    }

}

