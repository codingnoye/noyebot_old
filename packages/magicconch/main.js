// command 모듈들
const commands = [
    require('./cmd/magic.js')
]

// 실제 명령어들이 들어가는 객체
const cmds = {}
for (cmd of commands) {
    cmds[cmd.keyword] = cmd.func
}

// 패키지 구현
const package = (bot) => {
    return {
        name: `마법의 소라고동`,
        desc: `무엇이든 물어보세요`,

        // 패키지가 로드될 때 호출
        onLoad () {},

        // 새로운 서버가 인식될 때 호출
        onGuildLoad (msg, gid) {},

        // 서버에 메시지가 왔을 때 호출
        onMsg (msg) {
            if (msg.content.startsWith('마법의 소라고동님 ')) {
                cmds['magic'](bot, msg, '')
            }
        },

        // 명령어가 호출되었을 때 호출
        onCmd (msg, keyword, param) {
            if (cmds.hasOwnProperty(keyword)) {
                cmds[keyword](bot, msg, param)
                return true
            }
            return false
        },

        // 다른 패키지에서 접근할 수 있는 객체, 자유로운 이름으로 작성 가능
        api: {},

        // 도움말
        help (msg) {
            const pre = bot.setting[msg.guild.id].prefix

            const embed = new bot.Discord.RichEmbed()
            .setTitle(`마법의 소라고동`)
            .setColor(0x428BCA)
            .setDescription(`무엇이든 물어보세요.`)

            for (cmd of commands)
                if (cmd.args)
                    embed.addField(`${pre}${cmd.keyword} ${cmd.args.split(' ').map(x=>'<'+x+'>').join(' ')}`, cmd.help)
                else 
                    embed.addField(`${pre}${cmd.keyword}`, cmd.help)
            
            msg.channel.send({embed})
        }
    }
}
module.exports = package