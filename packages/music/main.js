// 패키지 구현
const package = (bot) => {
    const youtube = require('./youtube.js')(bot)
    const commands = require('./cmd.js')(bot, youtube)
    const cmds = {}
    for (cmd in commands) {
        cmds[commands[cmd].keyword] = commands[cmd].func
    }
    return {
        name: `음악`,
        desc: `음악을 들려줍니다.`,

        // 패키지가 로드될 때 호출
        onLoad () {},

        // 새로운 서버가 인식될 때 호출
        onGuildLoad (msg, gid) {
            if (!this.guilds.hasOwnProperty(gid)) {
                this.guilds[gid] = {
                    queue: [],
                    channel: null,
                    playing: false,
                    connection: null,
                    control: null,
                    volume: 0.5
                }
            }
        },

        // 서버에서 비활성화 될 때 호출
        onGuildQuit (gid) {},

        // 서버에 메시지가 왔을 때 호출
        onMsg (msg) {},

        // 명령어가 호출되었을 때 호출
        onCmd (msg, keyword, param) {
            if (cmds.hasOwnProperty(keyword)) {
                cmds[keyword](msg, param)
                return true
            }
            return false
        },

        // 봇 종료 시 호출. 비동기 함수이고 모든 패키지에서 시행될 때까지 기다림.
        async onQuit () {
            for (let gid in this.guilds) {
                const guild = this.guilds[gid]
                if (guild.channel) await guild.channel.leave()
            }
        },

        // 다른 패키지에서 접근할 수 있는 객체, 자유로운 이름으로 작성 가능
        guilds: {},

        // 도움말
        help (msg) {
            const pre = bot.setting[msg.guild.id].prefix

            const embed = new bot.Discord.RichEmbed()
            .setTitle(`노래`)
            .setColor(0x428BCA)
            .setDescription(`노래를 들려드립니다.`)

            for (cmd in commands)
                if (commands[cmd].args)
                    embed.addField(`${pre}${commands[cmd].keyword} ${commands[cmd].args.split(' ').map(x=>'<'+x+'>').join(' ')}`, commands[cmd].help)
                else 
                    embed.addField(`${pre}${commands[cmd].keyword}`, commands[cmd].help)
            
            msg.channel.send({embed})
        }
    }
}
module.exports = package