const level = require('../levelSystem.js')
const comma = require('../../../lib/util.js').comma
const {RichEmbed} = require('discord.js')

module.exports = {
    func: (msg, params) => {
        const 레벨 = bot.packages.레벨
        const gid = msg.guild.id
        const guild = 레벨.guilds[gid]
        if (!guild.hasOwnProperty('channel')) {
            msg.channel.send(
                `${bot.guilds[gid].prefix}levelinit 을 통해 알림 채널 설정 후 사용해주세요.`
            )
        } else {
            const embed = new RichEmbed().setColor(0x428bca)
            const uid = msg.author.id
            const name = msg.channel.members.get(uid).displayName
            const rawXP = guild.xp[uid]
            const lv = level.getLevel(rawXP)
            embed.setTitle(`${name}`)
            embed.addField(
                `**Lv. ${lv}** (${Math.round(
                    ((rawXP - level.xpTable[lv - 1]) /
                        (level.xpTable[lv] - level.xpTable[lv - 1])) *
                        100
                )}%)`,
                `${comma(rawXP - level.xpTable[lv - 1])}xp / ${comma(
                    level.xpTable[lv] - level.xpTable[lv - 1]
                )}xp\nTotal ${comma(rawXP)}xp`
            )

            msg.channel.send({embed})
        }
    },
    keyword: 'mylevel',
    help: '자신의 레벨과 경험치를 확인합니다.',
}
