import { poll, vote } from "../../typings";
import uuid from 'uuid/v4'
import { MessageEmbed } from 'discord.js'
import PGClient from './PostgresClient';

export default class BasePoll {
    public poll: poll

    constructor(title: string, creator: string, guild: string, options: string[]) {
        this.poll = {
            title: title,
            creator: creator,
            guild: guild,
            votes: null,
            options: options,
            id: uuid()
        }
        console.log(this.poll)
    }

    public get embed() {
        return;
    }
}
