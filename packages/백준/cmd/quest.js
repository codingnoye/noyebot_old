const {RichEmbed} = require('discord.js')
const solved = require('../solved.js')
const moment = require('moment')
const crawler = require('../crawler.js')
const comma = require('../../../lib/util').comma
const table = [1000, 
    1000, 1200, 1400, 1600, 1800, 
    2000, 2400, 2800, 3200, 3600, 
    4000, 4800, 5600, 6400, 7200, 
    8000, 9600, 11200, 12800, 14400, 
    16000, 19200, 22400, 25600, 28800, 
    32000, 38400, 44800, 51200, 57600]

const newQuest = async (gid) => {
    const guild = store.load(`백준/${gid}`)

    const problem_nums = await crawler.quest(guild.users)
    const cleared = {}
    for (const problem_num of problem_nums) {
        cleared[problem_num] = []
    }

    guild.quest = {
        first_cleared : [],
        cleared : cleared,
        list : problem_nums
    }

    store.save(`백준/${gid}`)
}

const questMessage = async function(gid, channel) {
    const guild = store.load(`백준/${gid}`)
    if (!guild.hasOwnProperty('quest')) {
        await newQuest(gid)
    } else if (!guild.quest.hasOwnProperty('list')) {
        await newQuest(gid)
    }
    const quest = guild.quest
    const today = moment().format('MM-DD')

    const solvedData = await Promise.all(quest.list.map((n)=>solved.problem(n)))
    solvedData.sort((a, b) => b.level - a.level)

    const embed = new RichEmbed()
    .setColor(0x428BCA)
    .setTitle(`**${today}** 오늘의 퀘스트`)
    .setDescription("퀘스트 목록입니다.")
    for (const problem of solvedData) {
        embed.addField(`**${problem.tier}** ${problem.emoji}`, `**${problem.num}번 문제** ${comma(table[problem.level])}XP\nhttps://www.acmicpc.net/problem/${problem.num}`)
    }
    embed.addField(`**추가 경험치**`, `오늘의 첫 퀘스트 클리어: 3,000XP`)
    embed.addField(`**문제 선정 조건**`, `실버 5 ~ 플레 1, 여기에 푼 사람이 없고 500명 이상 푼 문제 중 랜덤`)

    return await channel.send({embed})
}

module.exports = {
    keyword : 'quest',
    func : async (msg, params) => {
        const gid = msg.guild.id
        const guild = store.load(`백준/${gid}`)
        if (!guild.hasOwnProperty('target')) {
            msg.channel.send(`${bot.guild[gid].prefix}bj init으로 초기화 한 후 사용해주세요.`)
            return
        }
        await questMessage(gid, msg.channel)
    },
    newQuest : newQuest,
    questMessage : questMessage,
    autoQuest : async (gid) => {
        const guild = store.load(`백준/${gid}`)
        const channel = client.channels.get(guild.channel)
        await newQuest(gid)
        const sended = await questMessage(gid, channel)
        sended.pin()
    },
    table: table,
    help : '오늘의 퀘스트 목록을 보여줍니다.'
}
