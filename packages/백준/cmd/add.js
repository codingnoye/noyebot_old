module.exports = {
    func : (msg, params)=>{
        const gid = msg.guild.id
        const guild = store.load(`백준/${gid}`)

        if (!guild.hasOwnProperty('target')) {
            // init이 안된 경우
            msg.channel.send(`${bot.setting[gid].prefix}bjinit을 통해 학교 등록 후 사용해주세요. 자세한 것은 도움말을 참고해주세요.`)
        } else if (params.length == 2) {
            if (guild.users.includes(params[0])) {
                // 이미 add된 백준 id 주인 변경
                guild.uid[params[0]] = params[1]
                msg.channel.send(`백준 아이디 ${params[0]}는 이제 ${msg.guild.members.get(params[1]).nickname}님의 아이디입니다.`)
            } else {
                // 신규 사용자 (id 지정)
                guild.users.push(params[0])
                guild.level[params[0]] = null
                guild.uid[params[0]] = params[1]
                msg.channel.send(`${msg.guild.members.get(params[1]).nickname}님의 백준 아이디 ${params[0]}이 등록되었습니다.`)
            }
            store.save(`백준/${gid}`)
        } else if (params.length == 1) {
            if (guild.users.includes(params[0])) {
                // 이미 add된 사용자
                msg.channel.send(`이미 등록된 사용자입니다.`)
            } else {
                // 신규 사용자
                guild.users.push(params[0])
                guild.level[params[0]] = null
                guild.uid[params[0]] = msg.member.id
                msg.channel.send(`${msg.member.nickname}님의 백준 아이디 ${params[0]}이 등록되었습니다.`)
            }
            store.save(`백준/${gid}`)
        } else {
            msg.channel.send("인자의 개수가 올바르지 않습니다.")
        }
    },
    keyword : 'add',
    help : '백준 체크 리스트에 등록합니다.',
    args : 'id ?discord_id'
}