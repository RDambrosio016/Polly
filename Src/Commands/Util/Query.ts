import { Command } from "discord-akairo";
import PollyClient from "../../Client";

export default class Query extends Command {
    constructor() {
        super("query", {
            ownerOnly: true,
            aliases: ["query"],
            args: [
                {
                    id: "query",
                    match: "content"
                }
            ]
        })
    }

    public exec(message, args) {
        let client = <PollyClient>this.client
        client.PGClient.db.query(args.query, (err, res) => {
            if(err) {
                if(err.length > 1950)
                    err = err.substring(0, 1950)
                return message.util.send(err, {code: true})
            } else {
                res = JSON.stringify(res)
                if(res.length > 1950)
                    res = res.substring(0, 1950)
                return message.util.send(res, {code: "json"})
            }
        })
    }
}