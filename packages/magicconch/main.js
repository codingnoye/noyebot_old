const randint = (min, max) => 
    Math.floor(Math.random() * (max-min)) + min

const content = [
    "언젠가는.","그럼.","그래.","아마도.","물론.",
    "아니","안 돼.","안 돼.","그것도 안 돼.","아닐걸.",
    "다시 물어봐.","가만히 있어."
]

const magic = (msg) => 
    msg.channel.send("마법의 소라고동: "+content[randint(0, content.length)], {file: 'https://i.imgur.com/KwefLw8.jpg'})

// 패키지 구현
const package = (bot) => {
    return {
        name: `소라고동`,
        desc: `마법의 소라고동님은 모든 것을 알고 계십니다.`,

        // 패키지가 로드될 때 호출
        onLoad () {},

        // 새로운 서버가 인식될 때 호출
        onGuildLoad (msg, gid) {},

        // 서버에서 비활성화 될 때 호출
        onGuildQuit (gid) {},

        // 서버에 메시지가 왔을 때 호출
        onMsg (msg) {
            if (msg.content.startsWith('마법의 소라고동님 '))
                magic(msg)
        },

        // 명령어가 호출되었을 때 호출
        onCmd (msg, keyword, param) {
            if (keyword == 'magic') {
                magic(msg)
                return true
            }
            return false
        },

        // 봇 종료 시 호출. 비동기 함수이고 모든 패키지에서 시행될 때까지 기다림.
        async onQuit () {},

        // 도움말
        help (msg) {
            const prefix = bot.setting[msg.guild.id].prefix

            const embed = new bot.Discord.RichEmbed()
            .setTitle(`마법의 소라고동`)
            .setColor(0x428BCA)
            .setDescription(`마법의 소라고동님은 모든 것을 알고 계십니다.`)
            .addField(`${prefix}magic <question>`, '답을 알려줍니다. \'마법의 소라고동님 <질문>\'으로도 가능합니다.')
            
            msg.channel.send({embed})
        }
    }
}
module.exports = package