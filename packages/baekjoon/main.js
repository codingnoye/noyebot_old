const checker = require('./checker.js')
const solved = require('./solved.js')

// command 모듈들
const commands = [
    require('./cmd/bj.js'),
    require('./cmd/bjinit.js'),
    require('./cmd/bjadd.js'),
    require('./cmd/bjusers.js')
]

// 실제 명령어들이 들어가는 객체
const cmds = {}
for (const cmd of commands) {
    cmds[cmd.keyword] = cmd.func
}

const control = {}

// 패키지 구현
const package = (bot) => {
    return {
        name: `백준`,
        desc: `백준 문제를 풀면 알려줍니다.`,

        // 패키지가 로드될 때 호출
        onLoad () {},

        // 새로운 서버가 인식되거나 활성화될 때 호출
        onGuildLoad (msg, gid) {
            const check = checker(bot, gid)
            this.guild[gid] = bot.store.load(`baekjoon/${gid}`)
            if (this.guild[gid].hasOwnProperty('target')) {
                control[gid] = {
                    problem: setInterval(check.problem, 15000),
                    levelup: setInterval(check.levelup, 15000)
                }
            }   
        },

        // 서버에서 비활성화 될 때 호출
        onGuildQuit (gid) {
            clearInterval(control[gid].problem)
            clearInterval(control[gid].levelup)
        },

        // 서버에 메시지가 왔을 때 호출
        onMsg (msg) {},

        // 명령어가 호출되었을 때 호출
        onCmd (msg, keyword, param) {
            if (cmds.hasOwnProperty(keyword)) {
                cmds[keyword](bot, msg, param)
                return true
            }
            return false
        },

        // 봇 종료 시 호출. 비동기 함수이고 모든 패키지에서 시행될 때까지 기다림.
        async onQuit () {},

        // 다른 패키지에서 접근할 수 있는 객체, 자유로운 이름으로 작성 가능
        guild: {},
        solved: solved(bot),

        // 도움말
        help (msg) {
            const pre = bot.setting[msg.guild.id].prefix

            const embed = new bot.Discord.RichEmbed()
            .setTitle(`백준`)
            .setColor(0x428BCA)
            .setDescription(`백준 패키지 도움말입니다.`)

            for (const cmd of commands)
                if (cmd.args)
                    embed.addField(`${pre}${cmd.keyword} ${cmd.args.split(' ').map(x=>'<'+x+'>').join(' ')}`, cmd.help)
                else 
                    embed.addField(`${pre}${cmd.keyword}`, cmd.help)
            
            msg.channel.send({embed})
        }
    }
}
module.exports = package