const commands = require('./commands.js')
const {RichEmbed} = require('discord.js')
const baekjoon = require('./baekjoon.js')

const cmds = {}
for (const cmd in commands) {
    cmds[commands[cmd].keyword] = commands[cmd].func
}

const package = {
    desc: `역할을 관리합니다.`,

    onLoad () {},

    onGuildLoad (gid) {},

    onGuildQuit (gid) {},

    onMsg (msg) {},

    onCmd (msg, params) {
        if (params[0] == 'role') {
            if (!msg.member.hasPermission('ADMINISTRATOR')) {
                msg.channel.send(`이 명령어는 관리자 권한이 필요합니다.`)
                return true
            }
            return commands.call(msg, params[1], params.slice(2))
        } else return false
    },

    async onQuit () {},

    baekjoon: baekjoon,

    guilds: {},

    help (msg) {
        const prefix = bot.guilds[msg.guild.id].prefix
        const embed = new RichEmbed().setColor(0x428BCA)
        .setTitle(`역할 패키지 도움말`)
        .setDescription(`${this.desc}`)

        for (const keyword of commands.keywords){
            const help = commands.help[keyword]
            if (help.args)
                embed.addField(`\`${prefix}role ${keyword} ${help.args.split(' ').map(x=>'<'+x+'>').join(' ')}\``, help.desc)
            else 
                embed.addField(`\`${prefix}role ${keyword}\``, help.desc)
        }
         
        msg.channel.send({embed})
    },

    helpSimple (msg, embed) {
        const prefix = bot.guilds[msg.guild.id].prefix
        const helps = []

        for (const keyword of commands.keywords) {
            const help = commands.help[keyword]
            if (help.args)
                helps.push(`\`${prefix}role ${keyword} ${help.args.split(' ').map(x=>'<'+x+'>').join(' ')}\`\n${help.desc}`)
            else
                helps.push(`\`${prefix}role ${keyword}\`\n${help.desc}`)
        }
            
        embed.addField(`역할: ${this.desc}`, `${helps.join('\n')}`)
    }
}

module.exports = package