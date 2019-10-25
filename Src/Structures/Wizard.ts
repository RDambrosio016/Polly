import { Message, MessageCollector, User, MessageEmbed, TextChannel } from 'discord.js'
import { presets } from '../Data';
import { stripIndents } from 'common-tags'
import { poll } from '../../typings';
import BasePoll from './Poll';

// A utility class for accepting user input to create a poll, the base class is for quick polls

export default class Wizard {
    public message: Message
    public channel: TextChannel
    public data: poll
    private _cmdMessage: Message
    private _embed: MessageEmbed
    private _canceled: boolean = false
    private _description: string
    private _filter: (Message) => boolean
    private _title: string
    private _options: string[]

    constructor(channel, cmdMsg) {
        this.channel = channel
        this._cmdMessage = cmdMsg
        this._filter = (msg) => msg.author.id === this._cmdMessage.author.id && msg.guild;
        this._embed = new MessageEmbed()
            .setAuthor(cmdMsg.author.tag, cmdMsg.author.displayAvatarURL({format: "png"}))
            .setDescription("Please enter a title for your poll, make it brief and not over 1000 characters (Extra spaces will be trimmed).")
            .setFooter("Type cancel to cancel the command")
            .setColor([190, 29, 44])
    }

    public async exec(): Promise<BasePoll> {
        this.message = await this.channel.send(this._embed)
        await this._awaitTitle()
        await this._awaitPreset()
        return new BasePoll(this._title, this._cmdMessage.author.id, this._cmdMessage.guild.id, this._options)
    }

    private async _handleError(errorString: string): Promise<void> {
        if(!this._embed.description.includes(errorString))
            await this.message.edit(this._embed.setDescription(this._embed.description += `\n\u2008\n ⚠ ${errorString} ⚠`))
    }

    private async _finalize(): Promise<BasePoll> {
        await this.message.delete().catch(() => {})
        return new BasePoll(this._title, this._cmdMessage.author.id, this._cmdMessage.guild.id, this._options)
    }

    private async _cancel(collector: MessageCollector): Promise<void> {
        if(!collector.ended) collector.stop()
        await this.message.delete().catch(() => {})
        await this.message.channel.send("Command has been canceled").catch(() => {})
    }

    private async _awaitTitle() {
        if(this._canceled) return;
        let collector: MessageCollector = this.message.channel.createMessageCollector(this._filter, {time: 60000})
        return new Promise((resolve, reject) => {
            collector.on('collect', async ({content}) => {
                if(content.toLowerCase() == "cancel") return this._cancel(collector)
                if(content.trim().length > 1000 || content.trim().length < 10) {
                        await this._handleError("Please enter a title 10 to 1000 characters long")
                }
                else {
                    resolve(await this.message.edit(this._embed.addField("Title", content.trim(), true)))
                    this._title = content.trim();
                    collector.stop("Correct_Title");
                }
            })
        })
    }

    private async _awaitPreset(){
        if(this._canceled) return;
        let collector: MessageCollector = this.message.channel.createMessageCollector(this._filter, {time: 60000})

        await this.message.edit(this._embed.setDescription(stripIndents`
            Enter a preset for your poll options: \n\u2008\n
            ${presets.map(i => `${presets.indexOf(i) + 1}: ${i}`).join("\n")} \n
            You can also input between 2 and 15 custom options (50 chars max each) separated by commas:\n \`this, that, the other thing\``))

        return new Promise((resolve, reject) => {
            collector.on('collect', async ({content}) => {
                if(content.toLowerCase() === "cancel") return this._canceled === true
                if(presets[parseInt(content) - 1]) {
                    resolve(await this.message.edit(this._embed.addField("Options", presets[parseInt(content) - 1], true)))
                    this._options = presets[parseInt(content) - 1].split(",")
                    collector.stop("Correct_Options")
                }
                else {
                    let options = content.split(/\,+/)
                    if(options.length === 1 || options.length > 15)
                        return await this._handleError("Please enter a valid number of options")
                    for(let i of options) {
                        if(i.length > 50)
                            return await this._handleError("Options must be a max of 50 characters each")
                    }
                    resolve(await this.message.edit(this._embed.addField("Options", content, true)))
                    this._options = options
                    collector.stop("Correct_Options")
                }
            })

            collector.on("end", (collected, reason) => {
                if(reason === "time") return this._cancel(collector)
            })
        })
    }

}