const commands = [
    require("./cmd/korea.js"),
    require("./cmd/global.js")
]

const cmds = {}
for (cmd of commands) {
    cmds[cmd.keyword] = cmd.func
}

const package = (bot) => {
    return {
        name: 'corona',
        // 패키지가 로드될 때 호출
        onLoad () {},
        // 새로운 서버가 인식될 때 호출
        onGuildLoad (msg, gid) {},
        // 서버에 메시지가 왔을 때 호출
        onMsg (msg) {},
        // 명령어가 호출되었을 때 호출
        onCmd (msg, keyword, param) {
            if (keyword == "코로나") {
                if (cmds.hasOwnProperty(param)) {
                    cmds[param](bot, msg)
                } else if (!param.length) {
                    msg.channel.send("인자를 입력하세요.")
                } else {
                    msg.channel.send("인자가 올바르지 않습니다.")
                }
                return true
            }
            return false // true를 반환하면 이 패키지에서 명령어를 인식했다는 의미
        },
        // help 명령어 사용 시 호출
        help (msg) {
            const prefix = bot.setting[msg.guild.id].prefix

            const embed = new bot.Discord.RichEmbed()
            .setTitle(`실시간 코로나 현황`)
            .setColor(0x428BCA)
            .setDescription(`현재 코로나-19 확산에 따른 실시간 상황 알리미입니다.`)
            .addField(`${prefix}코로나 국내`, "국내 코로나-19 상황을 알려줍니다.")
            .addField(`${prefix}코로나 국외`, "국외 코로나-19 상황을 알려줍니다.")
            .setFooter("출처 : http://coronamap.site/")
            
            msg.channel.send({embed})
        }
    }
}

module.exports = package