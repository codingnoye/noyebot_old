const level = require('../levelSystem.js')
const comma = require('../../../lib/util.js').comma
const {RichEmbed} = require('discord.js')
module.exports = {
    func : (msg, params) => {
        const 레벨 = bot.packages.레벨
        const gid = msg.guild.id
        const guild = 레벨.guilds[gid]
        if (!guild.hasOwnProperty('channel')) {
            msg.channel.send(`${bot.guilds[gid].prefix}levelinit 을 통해 알림 채널 설정 후 사용해주세요.`)
        } else {
            const embed = new RichEmbed()
            .setColor(0x428BCA)
            .setTitle("레벨 스코어보드")
            const rawUsers = []
            for (const uid in guild.xp) {
                const rawXP = guild.xp[uid]
                const lv = level.getLevel(rawXP)
                rawUsers.push([uid, lv, rawXP])
            }
            const users = rawUsers.sort((a, b) => b[2] - a[2])
            for (const user of users) {
                const uid = user[0]
                const name = msg.channel.members.get(uid).displayName
                const lv = user[1]
                const rawXP = user[2]
                embed.addField(`**Lv. ${lv}** (${Math.round((rawXP-level.xpTable[lv-1])/(level.xpTable[lv]-level.xpTable[lv-1])*100)}%)`, `**${name}**\n${comma(rawXP-level.xpTable[lv-1])}xp / ${(comma(level.xpTable[lv]-level.xpTable[lv-1]))}xp\nTotal ${comma(rawXP)}xp`)
            }
            msg.channel.send({embed})
        }
    },
    keyword : 'level',
    help : '유저들의 레벨과 경험치를 확인합니다.'
}