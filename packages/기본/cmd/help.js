const {RichEmbed} = require('discord.js')

module.exports = {
    func: (msg, params) => {
        const gid = msg.guild.id
        if (params.length == 0) {
            const embed = new RichEmbed()
                .setColor(0x428bca)
                .setTitle(`${bot.config.botname} 전체 도움말`)
            for (const packageName of bot.guilds[gid].enabled) {
                const package = bot.packages[packageName]
                package.helpSimple(msg, embed)
            }
            msg.channel.send({embed})
        } else if (params.length == 1) {
            if (bot.guilds[gid].enabled.includes(params[0])) {
                const package = bot.packages[params[0]]
                package.help(msg)
            } else {
                msg.channel.send(`${params[0]} 패키지를 찾을 수 없습니다.`)
            }
        }
    },
    keyword: 'help',
    help: '도움말을 확인합니다.',
    args: '?packageName',
}
