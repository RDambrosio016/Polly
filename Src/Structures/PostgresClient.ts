import * as pg from 'pg'
import { user, poll } from '../../typings'

export default class PGClient {
    public db: pg.Client;
    public connected: boolean = false
    constructor() {
        this.db = new pg.Client({
            user: process.env.PG_USER,
            password: process.env.PG_PASSWORD,
            database: "polly",
            port: process.env.PG_PORT,
            connectionString: process.env.PG_CONSTRING
        })
    }
    public async connect() {
        await this.db.connect().catch(console.error)
        this.connected = true
        return this;
    }
    public async query(query: string) {
        return this.db.query(query)
    }

    public static async addPoll(poll: poll) {
        
    }
    public async queryUsers(count?: boolean, idQuery?: string, guildIdQuery?: string) {
        if(count) 
            return this.db.query(`SELECT COUNT(*) FROM users`)
        else if(idQuery)
            return this.db.query(`SELECT * FROM users WHERE id = ?`, [idQuery])
        else if(guildIdQuery)
            return this.db.query(`SELECT * FROM users WHERE ANY (guilds) = ?`, [guildIdQuery])
        else 
            return this.db.query(`SELECT * FROM users`)
    }
}

// (async() => {
//     await new PGClient()
// })()
