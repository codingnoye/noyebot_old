const cmds = [require('./cmd/global.js'), require('./cmd/korea.js')]
const keywords = []
const func = {}
const help = {}

for (const cmd of cmds) {
    keywords.push(cmd.keyword)
    func[cmd.keyword] = cmd.func
    help[cmd.keyword] = {
        desc: cmd.help,
        args: cmd.args,
    }
}

const commands = {
    call(msg, keyword, payload) {
        if (keywords.includes(keyword)) {
            func[keyword](msg, payload)
            return true
        } else {
            return false
        }
    },
    keywords: keywords,
    func: func,
    help: help,
}

module.exports = commands
