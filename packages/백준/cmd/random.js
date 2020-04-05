const {RichEmbed} = require('discord.js')
const solved = require('../solved.js')
const crawler = require('../crawler.js')
const table = {
    b : ["b5", "b4", "b3", "b2", "b1"],
    s : ["s5", "s4", "s3", "s2", "s1"],
    g : ["g5", "g4", "g3", "g2", "g1"],
    p : ["p5", "p4", "p3", "p2", "p1"],
    d : ["d5", "d4", "d3", "d2", "d1"],
    r : ["r5", "r4", "r3", "r2", "r1"]
}

const rangeRandom = async function(msg, params, name) {
    const problemNums = await crawler.quest([name], 0, table[params[0]][0], table[params[0]][4], 1)
    const solvedData = await solved.problem(problemNums[0])
    const problemData = await crawler.problem(problemNums[0])

    const embed = new RichEmbed()
    .setTitle('**' + problemData.title + '**')
    .setDescription(`[나도 풀러 가기](https://www.acmicpc.net/problem/${problemNums[0]}) >`)
    .addField('정답', `${problemData.users} (${problemData.users_percent})`, true)
    .attachFile(`packages/백준/res/${solvedData.level}.png`)
    .setThumbnail(`attachment://${solvedData.level}.png`)
    .setColor(solved.color[Math.floor((solvedData.level-1)/5)])

    msg.channel.send(embed)
}

const pointRandom = async function(msg, params, name) {
    const problemNums = await crawler.quest([name], 0, params[0], params[0], 1)
    const solvedData = await solved.problem(problemNums[0])
    const problemData = await crawler.problem(problemNums[0])

    const embed = new RichEmbed()
    .setTitle('**' + problemData.title + '**')
    .setDescription(`[나도 풀러 가기](https://www.acmicpc.net/problem/${problemNums[0]}) >`)
    .addField('정답', `${problemData.users} (${problemData.users_percent})`, true)
    .attachFile(`packages/백준/res/${solvedData.level}.png`)
    .setThumbnail(`attachment://${solvedData.level}.png`)
    .setColor(solved.color[Math.floor((solvedData.level-1)/5)])

    msg.channel.send(embed)
}

module.exports = {
    func : (msg, params) => {
        const gid = msg.guild.id
        const guild = store.load(`백준/${gid}`)
        const uid = msg.author.id
        let name = "";
        for (let key in guild["uid"]) {
            if (uid == guild["uid"][key]) {
                name = key;
            }
        }

        if (name == "") {
            msg.channel.send(`${bot.guilds[gid].prefix}bj add로 등록 한 후 사용해주세요.`)
            return
        }

        if (params.length == 1) {
            if (table.hasOwnProperty(params[0])){
                rangeRandom(msg, params, name)
                return
            }
            for (let key in table) {
                if (table[key].includes(params[0])) {
                    pointRandom(msg, params, name)
                    return
                }
            }
            msg.channel.send("인자의 랭크가 올바르지 않습니다.")
        }
        else {
            msg.channel.send("인자의 개수가 올바르지 않습니다.")
        }
    },
    keyword : 'random',
    help : '원하는 난이도의 문제 하나를 불러옵니다.',
    args : 'b|s|g|p|d|r,b5|b4|...|r2|r1'
}