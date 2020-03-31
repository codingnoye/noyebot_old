module.exports = {
    func : (msg, params) => {
        if (!msg.member.hasPermission('ADMINISTRATOR')) {
            msg.channel.send(`이 명령어는 관리자 권한이 필요합니다.`)
            return
        }
        const 레벨 = bot.packages.레벨
        const gid = msg.guild.id
        const guild = 레벨.guilds[gid]
        guild.channel = msg.channel.id
        store.save(`레벨/${gid}`)
        msg.channel.send(`이 채널을 알림 채널로 설정합니다.`)
    },
    keyword : 'levelinit',
    help : '(관리자) 해당 채널을 레벨 알림 채널로 설정합니다.'
}