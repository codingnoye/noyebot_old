const crawler = require('../crawler.js')
const {RichEmbed} = require('discord.js')
const solved = require('../solved.js')
module.exports = {
    func : async (msg, params)=>{
        const param = params.join(' ')
        if (param.length) {
            const solvedData = await solved.problem(param)
            const problemData = await crawler.problem(param)
            const embed = new RichEmbed()
            .setTitle('**' + problemData.title + '**')
            .setDescription(`[나도 풀러 가기](https://www.acmicpc.net/problem/${param}) >`)
            .addField('정답', `${problemData.users} (${problemData.users_percent})`, true)
            if (solvedData.kudeki_level > 0) {
                embed.attachFile(`packages/백준/res/k${solvedData.kudeki_level}.png`)
                .setThumbnail(`attachment://k${solvedData.kudeki_level}.png`)
                .setColor(solved.kcolor)
            } else {
                embed.attachFile(`packages/백준/res/${solvedData.level}.png`)
                .setThumbnail(`attachment://${solvedData.level}.png`)
                .setColor(solved.color[Math.floor((solvedData.level-1)/5)])
            }
            msg.channel.send(embed)
        } else {
            msg.channel.send('인자를 입력하세요.')
        }
    },
    keyword : 'prob',
    help : '백준 문제를 공유합니다.',
    args : 'num'
}