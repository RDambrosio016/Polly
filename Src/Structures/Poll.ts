import { poll, vote } from "../../typings";
import uuid from 'uuid/v4'
import { MessageEmbed } from 'discord.js'
import PGClient from './PostgresClient';

export default class BasePoll {
    public poll: poll
    private _id: string
    private _dbClient: PGClient

    constructor(
        dbclient: PGClient,
        title: string, 
        creator: string, 
        guild: string, 
        options: string[], 
        anonymousVotes: boolean = false, 
        customPrompts: string[] | null,
        numOptions: number,
        endTimestamp: string | null
        ) {
        this._dbClient = dbclient
        this._id = uuid()
        this.poll = {
            title: title,
            creator: creator,
            guild: guild,
            votes: null,
            options: options,
            closed: false,
            id: this._id,
            settings: {
                poll_id: this._id,
                anonymousVotes: anonymousVotes,
                customPrompts: customPrompts,
                numOptions: numOptions,
                endTimestamp: endTimestamp
            }
        }
        console.log(this.poll)
    }

    public async save() {
        await this._dbClient.addPoll(this.poll)
    }

    public get embed() {
        return;
    }
}
