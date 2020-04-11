const cmds = [
    require('./cmd/prob.js'),
    require('./cmd/add.js'),
    require('./cmd/init.js'),
    require('./cmd/user.js'),
    require('./cmd/users.js'),
    require('./cmd/quest.js'),
    require('./cmd/newquest.js'),
    require('./cmd/random.js'),
]

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
