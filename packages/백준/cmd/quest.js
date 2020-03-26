const {RichEmbed} = require('discord.js')
const crawler = require('../crawler.js')
const solved = require('../solved.js')
const table = [1000, 
    1000, 1200, 1400, 1600, 1800, 
    2000, 2400, 2800, 3200, 3600, 
    4000, 4800, 5600, 6400, 7200, 
    8000, 9600, 11200, 12800, 14400, 
    16000, 19200, 22400, 25600, 28800, 
    32000, 38400, 44800, 51200, 57600]

module.exports = {
    table : table,
    func : async (msg, params)=>{
        const 백준 = bot.packages['백준']
        const gid = msg.guild.id
        const guild = store.load(`백준/${gid}`)

        if (bot.guilds[gid].enabled.includes('레벨')) {
            const embed = new RichEmbed()
            .setColor(0x428BCA)
            .setTitle("오늘의 퀘스트")
            .setDescription("퀘스트 목록입니다.")
            const problem_nums = await crawler.quest(guild.users)
            const cleared = {}
            for (const problem_num of problem_nums) {
                cleared[problem_num] = []
            }
            백준.quest[gid] = {
                first_cleared: [],
                cleared: cleared,
                list: problem_nums
            }

            const solvedData = await Promise.all(problem_nums.map((n)=>solved.problem(n)))
            solvedData.sort((a, b) => b.level - a.level)
            for (const problem of solvedData) {
                embed.addField(`**${problem.tier}**`, `**${problem.num}번 문제** ${table[problem.level]}XP\nhttps://www.acmicpc.net/problem/${problem.num}`)
            }
            embed.addField(`**추가 경험치**`, `오늘의 첫 퀘스트 클리어: 3000XP`)
            embed.addField(`**문제 선정 조건**`, `실버 4 ~ 플레 1, 여기에 푼 사람이 없고 500명 이상 푼 문제 중 랜덤`)
            msg.channel.send({embed})
        } else {
            msg.channel.send('레벨 패키지 활성화가 필요합니다.')
        }
    },
    keyword : 'quest',
    help : '새로운 백준 퀘스트를 받습니다. 이전의 퀘스트는 없어집니다.'
}