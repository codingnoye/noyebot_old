const commands = require('./commands.js')
const {RichEmbed} = require('discord.js')
const cmds = {}
for (const cmd in commands) {
    cmds[commands[cmd].keyword] = commands[cmd].func
}
const package = {
    desc: `음악을 들려줍니다.`,

    onLoad () {},

    onGuildLoad (gid) {
        if (!this.guilds.hasOwnProperty(gid)) {
            this.guilds[gid] = {
                queue: [],
                channel: null,
                textChannel: null,
                playing: false,
                connection: null,
                control: null,
                volume: 0.5,
                loop: true
            }
        }
    },

    onGuildQuit (gid) {},

    onMsg (msg) {},

    onCmd (msg, params) {
        return commands.call(msg, params[0], params.slice(1))
    },

    async onQuit () {
        for (let gid in this.guilds) {
            const guild = this.guilds[gid]
            if (guild.channel) await guild.channel.leave()
        }
    },

    guilds: {},

    help (msg) {
        const prefix = bot.guilds[msg.guild.id].prefix
        const embed = new RichEmbed().setColor(0x428BCA)
        .setTitle(`음악 패키지 도움말`)
        .setDescription(`${this.desc}`)

        for (const keyword of commands.keywords){
            const help = commands.help[keyword]
            if (help.args)
                embed.addField(`\`${prefix}${keyword} ${help.args.split(' ').map(x=>'<'+x+'>').join(' ')}\``, help.desc)
            else 
                embed.addField(`\`${prefix}${keyword}\``, help.desc)
        }
         
        msg.channel.send({embed})
    },

    helpSimple (msg, embed) {
        const prefix = bot.guilds[msg.guild.id].prefix
        const helps = []

        for (const keyword of commands.keywords) {
            const help = commands.help[keyword]
            if (help.args)
                helps.push(`\`${prefix}${keyword} ${help.args.split(' ').map(x=>'<'+x+'>').join(' ')}\`\n${help.desc}`)
            else
                helps.push(`\`${prefix}${keyword}\`\n${help.desc}`)
        }
            
        embed.addField(`음악: ${this.desc}`, `${helps.join('\n')}`)
    }
}
module.exports = package