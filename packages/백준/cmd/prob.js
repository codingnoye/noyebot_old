const crawler = require('../crawler.js')
const {RichEmbed} = require('discord.js')
const solved = require('../solved.js')
const comma = require('../../../lib/util').comma

module.exports = {
    func: async (msg, params) => {
        const param = params.join(' ')
        if (param.length) {
            const solvedData = await solved.problem(param)
            const problemData = await crawler.problem(param)
            const embed = new RichEmbed()
                .setTitle(`**${problemData.title}** ${solvedData.emoji}`)
                .setURL(`https://www.acmicpc.net/problem/${param}`)
                .setDescription(
                    `${comma(problemData.users)}명 (${problemData.users_percent})`,
                    true
                )
                .setColor(solved.color[Math.floor((solvedData.level - 1) / 5)])
            msg.channel.send(embed)
        } else {
            msg.channel.send('인자를 입력하세요.')
        }
    },
    keyword: 'prob',
    help: '백준 문제를 공유합니다.',
    args: 'num',
}
