module.exports = {
    func : async (bot, msg, param)=>{
        const solved = bot.packages['baekjoon'].solved
        const RichEmbed = bot.Discord.RichEmbed
        const gid = msg.guild.id
        const guild = bot.store.load(`baekjoon/${gid}`)
        const embed = new RichEmbed()
        .setColor(0x428BCA)
        .setTitle("Baekjoon : 등록된 사용자")
        .setDescription("알림을 받는 사용자들의 목록입니다.")
        const rawUsers = []
        for (username in guild.users) {
            const alias = guild.users[username]
            const userdata = await solved.user(username)
            rawUsers.push([username, userdata])
        }
        const users = rawUsers.sort((a, b) => b[1].rawXp - a[1].rawXp)
        for (user of users) {
            const username = user[0]
            const alias = guild.users[username]
            const userdata = user[1]
            embed.addField(`**${username}**${alias==null?"":'('+alias+')'} : ${userdata.solved} 문제`, `**${ userdata.tier }** (${ userdata.xp } xp)`)
        }
        msg.channel.send({embed})
    },
    keyword : 'bjusers',
    help : '백준 체크 리스트에 등록된 사용자들을 확인합니다.'
}