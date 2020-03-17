const rp = require('request-promise-native')
const cheerio = require('cheerio')
module.exports = {
    func : (bot, msg, param)=>{
        const solved = bot.packages['baekjoon'].solved
        const RichEmbed = bot.Discord.RichEmbed
        if (param.length) {
            (async ()=>{
                const probdata = await solved.problem(param)
                const data = await rp(`https://www.acmicpc.net/problem/${param}`)
                const $ = cheerio.load(data)
                const embed = new RichEmbed()
                .setTitle('**' + $('title').text() + '**')
                .setDescription(`[나도 풀러 가기](https://www.acmicpc.net/problem/${param}) >`)
                .addField('정답', $('td:nth-child(4)').text() + ' (' + $('td:nth-child(6)').text() + ')', true)
                if (probdata.kudeki_level > 0) {
                    embed.attachFile(`packages/baekjoon/res/k${probdata.kudeki_level}.png`)
                    .setThumbnail(`attachment://k${probdata.kudeki_level}.png`)
                    .setColor(solved.kcolor)
                } else {
                    embed.attachFile(`packages/baekjoon/res/${probdata.level}.png`)
                    .setThumbnail(`attachment://${probdata.level}.png`)
                    .setColor(solved.color[Math.floor((probdata.level-1)/5)])
                }
                msg.channel.send(embed)
            })()
        } else {
            msg.channel.send('인자를 입력하세요.')
        }
    },
    keyword : 'bj',
    help : '백준 문제를 공유합니다.',
    args : 'num'
}