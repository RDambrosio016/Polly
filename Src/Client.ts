import { AkairoClient, CommandHandler, ListenerHandler } from "discord-akairo"
import * as path from "path"
import PGClient from './Structures/PostgresClient';

export default class PollyClient extends AkairoClient {
    public commandHandler: CommandHandler
    public listenerHandler: ListenerHandler
    public PGClient: PGClient
    public constructor() {
        super({
            ownerID: '148830717617373184', 
        }, {
            disableEveryone: true
        })
    }

    public async setup() {
        this.commandHandler = new CommandHandler(this, {
            directory: path.join(__dirname, 'Commands'),
            prefix:'+',
            allowMention: true,
            handleEdits: true,
            commandUtil: true
        })
        this.listenerHandler = new ListenerHandler(this, {
            directory: path.join(__dirname, 'Listeners')
        })
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.setEmitters({
          commandHandler: this.commandHandler,
          listenerHandler: this.listenerHandler,
        });
        try {
            this.commandHandler.loadAll()
            this.listenerHandler.loadAll()
        } catch (err) {
            console.warn('Some of the modules failed to load')
        }
        await this.login(process.env.TOKEN)
        this.PGClient = await new PGClient().connect();
        return this
    }
}