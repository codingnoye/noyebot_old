const cmds = [
    require('./cmd/듣기.js'),
    require('./cmd/먼저듣기.js'),
    require('./cmd/재생.js'),
    require('./cmd/일시정지.js'),
    require('./cmd/중지.js'),
    require('./cmd/재생목록.js'),
    require('./cmd/다음곡.js'),
    require('./cmd/볼륨.js'),
    require('./cmd/반복.js')
]
const keywords = []
const func = {}
const help = {}

for (const cmd of cmds) {
    keywords.push(cmd.keyword)
    func[cmd.keyword] = cmd.func
    help[cmd.keyword] = {
        desc: cmd.help,
        args: cmd.args
    }
}

const commands = {
    call (msg, keyword, payload) {
        if (keywords.includes(keyword)) {
            bot.packages.음악.guilds[msg.guild.id].textChannel = msg.channel
            func[keyword](msg, payload)
            return true
        } else {
            return false
        }
    },
    keywords: keywords,
    func: func,
    help: help
}
module.exports = commands