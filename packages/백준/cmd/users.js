const solved = require('../solved.js')
const {RichEmbed} = require('discord.js')

module.exports = {
    func: async (msg, params) => {
        const gid = msg.guild.id
        const guild = store.load(`백준/${gid}`)
        if (!guild.hasOwnProperty('target')) {
            msg.channel.send(
                `${bot.guilds[gid].prefix}bjinit을 통해 학교 등록 후 사용해주세요. 자세한 것은 도움말을 참고해주세요.`
            )
            return
        }
        const embed = new RichEmbed()
            .setColor(0x428bca)
            .setTitle('백준 사용자 목록')
            .setDescription('알림을 받는 사용자들의 목록입니다.')
        const rawUsers = []
        for (const username of guild.users) {
            const userdata = await solved.user(username)
            rawUsers.push([username, userdata])
        }
        const users = rawUsers.sort((a, b) => b[1].rawXp - a[1].rawXp)
        for (const user of users) {
            const username = user[0]
            const userdata = user[1]
            embed.addField(
                `${userdata.solved} 문제 (${userdata.xp} xp)`,
                `**${userdata.tier}** ${userdata.emoji}\n**${username}** ${
                    msg.guild.members.get(guild.uid[username]).displayName
                }`
            )
        }
        msg.channel.send({embed})
    },
    keyword: 'users',
    help: '백준 체크 리스트에 등록된 사용자들을 확인합니다.',
}
