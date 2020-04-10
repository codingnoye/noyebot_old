const quest = require('./quest.js')

module.exports = {
    keyword: 'newquest',
    func: async (msg, params) => {
        if (!msg.member.hasPermission('ADMINISTRATOR')) {
            msg.channel.send(`이 명령어는 관리자 권한이 필요합니다.`)
            return
        }
        const gid = msg.guild.id
        const guild = store.load(`백준/${gid}`)
        if (!guild.hasOwnProperty('target')) {
            msg.channel.send(`${bot.guild[gid].prefix}bj init으로 초기화 한 후 사용해주세요.`)
            return
        }
        await quest.newQuest(gid)
        await quest.questMessage(gid, msg.channel)
    },
    help: '(관리자) 오늘의 퀘스트를 새로 생성합니다.',
}
