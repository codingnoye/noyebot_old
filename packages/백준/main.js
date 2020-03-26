const checker = require('./checker.js')
const commands = require('./commands.js')
const worker = {}
const {RichEmbed} = require('discord.js')
const package =  {
    desc: `백준 문제를 풀면 알려줍니다.`,

    onLoad () {},

    onGuildLoad (gid) {
        const check = checker(gid)
        this.guild[gid] = store.load(`백준/${gid}`)
        if (this.guild[gid].hasOwnProperty('target')) {
            worker[gid] = {
                problem: setInterval(check.problem, 15000),
                levelup: setInterval(check.levelup, 15000)
            }
        }   
    },

    onGuildQuit (gid) {
        clearInterval(worker[gid].problem)
        clearInterval(worker[gid].levelup)
    },

    onMsg (msg) {},

    onCmd (msg, params) {
        if (params[0] == 'bj')
            return commands.call(msg, params[1], params.slice(2))
        else
            return false
    },

    async onQuit () {},

    help (msg) {
        const prefix = bot.guilds[msg.guild.id].prefix

        const embed = new RichEmbed().setColor(0x428BCA)
        .setTitle(`백준 패키지 도움말`)
        .setDescription(`${this.desc}`)

        for (const keyword of commands.keywords){
            const help = commands.help[keyword]
            if (help.args)
                embed.addField(`\`${prefix}bj ${keyword} ${help.args.split(' ').map(x=>'<'+x+'>').join(' ')}\``, help.desc)
            else 
                embed.addField(`\`${prefix}bj ${keyword}\``, help.desc)
        }
         
        msg.channel.send({embed})
    },

    helpSimple (msg, embed) {
        const prefix = bot.guilds[msg.guild.id].prefix
        const helps = []

        for (const keyword of commands.keywords) {
            const help = commands.help[keyword]
            if (help.args)
                helps.push(`\`${prefix}bj ${keyword} ${help.args.split(' ').map(x=>'<'+x+'>').join(' ')}\`\n${help.desc}`)
            else
                helps.push(`\`${prefix}bj ${keyword}\`\n${help.desc}`)
        }
            
        embed.addField(`백준: ${this.desc}`, `${helps.join('\n')}`)
    },

    guild: {},
    quest: {}
}
module.exports = package