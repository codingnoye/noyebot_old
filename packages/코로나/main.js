const {RichEmbed} = require('discord.js')
const commands = [require('./cmd/korea.js'), require('./cmd/global.js')]

const cmds = {}
for (const cmd of commands) {
    cmds[cmd.keyword] = cmd.func
}

const package = {
    desc: `코로나 정보를 알려줍니다.`,

    onLoad() {},

    onGuildLoad(gid) {},

    onGuildQuit(gid) {},

    onMsg(msg) {},

    onCmd(msg, params) {
        if (params[0] == '코로나') {
            const param = params.slice(1).join(' ')
            if (cmds.hasOwnProperty(param)) {
                cmds[param](msg)
            } else if (!param.length) {
                msg.channel.send('인자를 입력하세요.')
            } else {
                msg.channel.send('인자가 올바르지 않습니다.')
            }
            return true
        }
        return false
    },

    async onQuit() {},

    help(msg) {
        const prefix = bot.guilds[msg.guild.id].prefix

        const embed = new RichEmbed()
            .setTitle(`실시간 코로나 현황`)
            .setColor(0x428bca)
            .setDescription(`현재 코로나-19 확산에 따른 실시간 상황 알리미입니다.`)
            .addField(`\`${prefix}코로나 국내\``, '국내 코로나-19 상황을 알려줍니다.')
            .addField(`\`${prefix}코로나 국외\``, '국외 코로나-19 상황을 알려줍니다.')
            .setFooter('출처 : http://coronamap.site/')

        msg.channel.send({embed})
    },

    helpSimple(msg, embed) {
        const prefix = bot.guilds[msg.guild.id].prefix
        const helps = []
        helps.push(`\`${prefix}코로나 국내\`\n국내 코로나-19 상황을 알려줍니다.`)
        helps.push(`\`${prefix}코로나 국외\`\n국외 코로나-19 상황을 알려줍니다.`)

        embed.addField(`코로나: ${this.desc}`, `${helps.join('\n')}`)
    },
}

module.exports = package
