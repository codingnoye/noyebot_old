const cmds = [
    require('./cmd/help.js'),
    require('./cmd/echo.js'),
    require('./cmd/say.js'),
    require('./cmd/prefix.js'),
    require('./cmd/set.js'),
    require('./cmd/setting.js'),
    require('./cmd/pkg.js')
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