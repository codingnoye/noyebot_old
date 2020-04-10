const {RichEmbed} = require('discord.js')
const randint = (min, max) => Math.floor(Math.random() * (max - min)) + min

const content = [
    '언젠가는.',
    '그럼.',
    '그래.',
    '아마도.',
    '물론.',
    '아니',
    '안 돼.',
    '안 돼.',
    '그것도 안 돼.',
    '아닐걸.',
    '다시 물어봐.',
    '가만히 있어.',
]

const magic = (msg) =>
    msg.channel.send('마법의 소라고동: ' + content[randint(0, content.length)], {
        file: 'https://i.imgur.com/KwefLw8.jpg',
    })

// 패키지 구현
const package = {
    desc: `마법의 소라고동님은 모든 것을 알고 계십니다.`,

    onLoad() {},

    onGuildLoad(gid) {},

    onGuildQuit(gid) {},

    onMsg(msg) {
        if (msg.content.startsWith('마법의 소라고동님 ')) magic(msg)
    },

    onCmd(msg, params) {
        if (params[0] == 'magic') {
            magic(msg)
            return true
        }
        return false
    },

    async onQuit() {},

    help(msg) {
        const prefix = bot.guilds[msg.guild.id].prefix

        const embed = new RichEmbed()
            .setTitle(`마법의 소라고동`)
            .setColor(0x428bca)
            .setDescription(`마법의 소라고동님은 모든 것을 알고 계십니다.`)
            .addField(
                `\`${prefix}magic <question>\``,
                "답을 알려줍니다. '마법의 소라고동님 <질문>'으로도 가능합니다."
            )

        msg.channel.send({embed})
    },

    helpSimple(msg, embed) {
        const prefix = bot.guilds[msg.guild.id].prefix
        embed.addField(
            `소라고동: ${this.desc}`,
            `\`${prefix}magic <question>\`\n답을 알려줍니다. \'마법의 소라고동님 <질문>\'으로도 가능합니다.`
        )
    },
}

module.exports = package
