import * as pg from 'pg'
import { user, poll, guild } from '../../typings'
import { readFileSync }from "fs"
import { Collection, MessageEmbed } from 'discord.js';

export default class PGClient {
    public db: pg.Client;
    public connected: boolean = false
    public pollCache: Collection<string, poll>
    public guildCache: Collection<string, guild>
    private _UUIDRegex: RegExp = /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/g
    private _queryPollSQL: string = readFileSync("Sql/QueryPoll.sql").toString()

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
        await this.db.query(`INSERT INTO polls (closed, options, id, guild, creator, title)
        VALUES ($1, $2, $3, $4, $5, $6);`, [
            poll.closed, poll.options, poll.id, poll.guild, poll.creator, poll.title
        ])
        await this.db.query(`INSERT INTO settings (poll_id, anonymousvotes, customprompts, numoptions, endtimestamp)
        VALUES($1, $2, $3, $4, $5)`, [
            poll.settings.poll_id, poll.settings.anonymousVotes, poll.settings.customPrompts, poll.settings.numOptions, poll.settings.endTimestamp
        ])
        this.pollCache.set(poll.id, poll)
    }

    public async addGuild(guild: guild): Promise<void> {
        await this.db.query(`INSERT INTO guilds (id, prefix, creationpermissions)
        VALUES($1, $2, $3)`, [
            guild.id, guild.prefix, guild.creationPermissions
        ])
        this.guildCache.set(guild.id, guild)
    }

    public async removeGuild(id: string): Promise<void> {
        await this.db.query(`DELETE FROM guilds WHERE id = $1`, [
            id
        ])
        this.guildCache.delete(id)
    }

    // public async removePoll(): Promise<MessageEmbed> {

    // }

    private async parsePollInputData(data: string): Promise<Object> {
        return new Promise(async (resolve, reject) => {
            if(this._UUIDRegex.test(data)) {
                let result = await this.db.query(`SELECT * FROM polls WHERE`)
            }
        })
    }
}

