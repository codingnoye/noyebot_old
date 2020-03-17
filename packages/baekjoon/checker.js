const rp = require('request-promise-native')
const cheerio = require('cheerio')
const solved = require('./solved.js')

const levelColor = [0xa75618,0x4e608d,0xffae00,0x00ffa1,0x00afff,0xff0042]

const checker = (bot, gid) => {
    const guild = bot.store.load(`baekjoon/${gid}`)
    const RichEmbed = bot.Discord.RichEmbed
    const solvedAPI = solved(bot)
    return {
        // 문제 체커
        problem: async () => {
            // 파싱
            const data = await rp(`https://www.acmicpc.net/status?result_id=4&school_id=${guild.target}`)
            const $ = cheerio.load(data)
            const solutions = []
            $('tr').each((index, item) => {
                if (index == 0) return
                const solutionId = parseInt($(item).find('td:nth-child(1)').text())
                const user = $(item).find('td:nth-child(2)').text()
                const problem = parseInt($(item).find('td:nth-child(3)').text())
                const name = $(item).find('td:nth-child(3) .problem_title').attr('title')
                const solution = {id: solutionId, user: user, problem: problem, name: name}
                solutions.push(solution)
            })
            // 문제 알림
            for (solution of solutions.filter(solution => solution.id > guild.lastcheck)) {
                guild.lastcheck = (guild.lastcheck<solution.id)?solution.id:guild.lastcheck
                if (guild.users.hasOwnProperty(solution.user)) {
                    const user = solution.user
                    const problem = solution.problem
                    const name = solution.name
                    const alias = guild.users[user]
                    const probdata = await solvedAPI.problem(problem) 

                    const embed = new RichEmbed()
                    .setTitle(`${user}${alias==null?"":'('+alias+')'}님이 ${problem}번 문제를 풀었습니다!`)

                    .setDescription(`${problem}번 문제 : ${name}`)
                    .addField('나도 풀러 가기', `https://www.acmicpc.net/problem/${problem}`)
                    .addField('Solved.ac', '**' + probdata.tier + '**')
                    if (probdata.kudeki_level > 0) {
                        embed.attachFile(`packages/baekjoon/res/k${probdata.kudeki_level}.png`)
                        .setThumbnail(`attachment://k${probdata.kudeki_level}.png`)
                        .setColor(solvedAPI.kcolor)
                    } else {
                        embed.attachFile(`packages/baekjoon/res/${probdata.level}.png`)
                        .setThumbnail(`attachment://${probdata.level}.png`)
                        .setColor(solvedAPI.color[Math.floor((probdata.level-1)/5)])
                    }
                    bot.client.channels.get(guild.channel).send(embed)
                }
                bot.store.save(`baekjoon/${gid}`)
            }
        },
        // 레벨업 체커
        levelup: async () => {
            for (user in guild.users) {
                const alias = guild.users[user]
                solvedAPI.user(user).then(userdata => {
                    if (guild.level[user] == null) {
                        guild.level[user] = userdata.level
                    } else if (userdata.level > guild.level[user]) {
                        // 레벨업 메시지
                        const alias = guild.users[user]
                        const embed = new RichEmbed()
                        .setTitle(`**${user}**${(alias != undefined) ? "("+alias+")" : ""} 님의 승급을 축하해주세요!`)
                        .setColor(levelColor[Math.floor((userdata.level-1)/5)])
                        .setDescription(`**${user}**${(alias != undefined) ?  "("+alias+")" : ""} 님이 **${userdata.tier}**으로 승급하셨습니다.`)
                        .attachFile(`packages/baekjoon/res/${userdata.level}.png`)
                        .setThumbnail(`attachment://${userdata.level}.png`)
    
                        bot.client.channels.get(guild.channel).send(embed)

                        // 실제 레벨업
                        guild.level[user] = userdata.level
                        bot.store.save(`baekjoon/${gid}`)
                    }
                })
            }
        }
    }
}

module.exports = checker