const checker = require('../checker.js')
module.exports = {
    func : (msg, params)=>{
        if (!msg.member.hasPermission('ADMINISTRATOR')) {
            msg.channel.send(`이 명령어는 관리자 권한이 필요합니다.`)
            return
        }
        const param = params.join(' ')
        const gid = msg.guild.id
        const cid = msg.channel.id
        const guild = store.load(`백준/${gid}`)
        if (param.length) {
            msg.channel.send('이 채널에 백준 알림을 전송합니다.')
            guild.target = parseInt(param)
            guild.channel = cid
            guild.users = []
            guild.uid = {}
            guild.level = {}
            guild.lastcheck = -1
            store.save(`백준/${gid}`)
            bot.packages.백준.onGuildLoad(gid)
        } else {
            msg.channel.send('대상 단체 id를 입력해 주세요.')
        }
    },
    keyword : 'init',
    help : '(관리자) 현재 채널을 백준 알림을 받을 채널로 설정하고, 크롤링할 단체 ID를 입력받습니다.',
    args : 'targetID'
}