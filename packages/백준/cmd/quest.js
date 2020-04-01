const {RichEmbed} = require('discord.js')
const nquest = require('../nquest.js')
const solved = require('../solved.js')
const moment = require('moment')

const quest = async function(msg) {
    const table = nquest.table
    const gid = msg.guild.id
    const guild = store.load(`백준/${gid}`)
    const quest = guild.quest
    const today = moment().format('MM-DD')

    const solvedData = await Promise.all(quest.list.map((n)=>solved.problem(n)))
    solvedData.sort((a, b) => b.level - a.level)

    const embed = new RichEmbed()
    .setColor(0x428BCA)
    .setTitle(`**${today}** 오늘의 퀘스트`)
    .setDescription("퀘스트 목록입니다.")
    for (const problem of solvedData) {
        embed.addField(`**${problem.tier}**`, `**${problem.num}번 문제** ${table[problem.level]}XP\nhttps://www.acmicpc.net/problem/${problem.num}`)
    }
    embed.addField(`**추가 경험치**`, `오늘의 첫 퀘스트 클리어: 3000XP`)
    embed.addField(`**문제 선정 조건**`, `실버 5 ~ 플레 1, 여기에 푼 사람이 없고 500명 이상 푼 문제 중 랜덤`)

    msg.channel.send({embed})
}

module.exports = {
    keyword : 'quest',
    func : quest,
    help : '오늘의 퀘스트 목록을 보여줍니다.'
}
