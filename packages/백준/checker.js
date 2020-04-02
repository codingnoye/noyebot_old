const solved = require('./solved.js')
const crawler = require('./crawler.js')
const {RichEmbed} = require('discord.js')
const quest = require('./cmd/quest.js')

const levelColor = [0xa75618,0x4e608d,0xffae00,0x00ffa1,0x00afff,0xff0042]

const levelTorole = (level) => {
    const roles = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Ruby"]
    if (level == 0) return "@everyone"
    else {
        level--
        return roles[level / 5]
    }
}

const checker = (gid) => {
    const guild = store.load(`백준/${gid}`)
    return {
        // 문제 체커
        problem: async () => {
            const solutions = await crawler.school(guild.target)
            // 문제 알림
            for (const solution of solutions.filter(solution => solution.id > guild.lastcheck)) {
                guild.lastcheck = (guild.lastcheck<solution.id)?solution.id:guild.lastcheck
                if (guild.users.includes(solution.user)) {
                    const user = solution.user
                    const problem = solution.problem
                    const name = solution.name
                    const solvedData = await solved.problem(problem) 
                    const channel = client.channels.get(guild.channel)

                    const embed = new RichEmbed()
                    .setTitle(`**${user}**(${channel.guild.members.get(guild.uid[user]).displayName})이 ${problem}번 문제를 풀었습니다!`)
                    .setDescription(`${problem}번 문제 : ${name}`)
                    .addField('나도 풀러 가기', `https://www.acmicpc.net/problem/${problem}`)
                    .addField('Solved.ac', '**' + solvedData.tier + '**')
                    if (solvedData.kudeki_level > 0) {
                        embed.attachFile(`packages/백준/res/k${solvedData.kudeki_level}.png`)
                        .setThumbnail(`attachment://k${solvedData.kudeki_level}.png`)
                        .setColor(solved.kcolor)
                    } else {
                        embed.attachFile(`packages/백준/res/${solvedData.level}.png`)
                        .setThumbnail(`attachment://${solvedData.level}.png`)
                        .setColor(solved.color[Math.floor((solvedData.level-1)/5)])
                    }
                    channel.send(embed)

                    const 백준 = bot.packages.백준
                    const 레벨 = bot.packages.레벨
                    
                    if (bot.guilds[gid].enabled.includes('레벨') && 백준.guild[gid].hasOwnProperty('quest')) {
                        if (백준.guild[gid].quest.list.includes(problem)) {
                            if (!백준.guild[gid].quest.cleared[problem].includes(user)) {
                                if (!백준.guild[gid].quest.first_cleared.includes(user)) {
                                    console.log(`${user}가 경험치를 ${quest.table[solvedData.level]+3000}xp 얻었습니다.`)
                                    const embed = new RichEmbed().setColor(0x428BCA)
                                    .addField('오늘의 첫 퀘스트 완료!', `${user}가 경험치를 ${quest.table[solvedData.level]}+3000 얻었습니다.`)
                                    레벨.earnXP(gid, guild.uid[user], quest.table[solvedData.level]+3000)
                                    백준.guild[gid].quest.first_cleared.push(user)
                                    channel.send(embed)
                                } else {
                                    console.log(`${user}가 경험치를 ${quest.table[solvedData.level]}xp 얻었습니다.`)
                                    const embed = new RichEmbed().setColor(0x428BCA)
                                    .addField('퀘스트 완료!', `${user}가 경험치를 ${quest.table[solvedData.level]} 얻었습니다.`)
                                    레벨.earnXP(gid, guild.uid[user], quest.table[solvedData.level])
                                    channel.send(embed)
                                }
                                백준.guild[gid].quest.cleared[problem].push(user)
                            }
                        }
                    }
                }
                store.save(`백준/${gid}`)
            }
        },
        // 레벨업 체커
        levelup: async () => {
            for (const username of guild.users) {
                solved.user(username).then(userdata => {
                    const user = userdata.user
                    if (guild.level[user] == null) {
                        guild.level[user] = userdata.level
                    } else if (userdata.level > guild.level[user]) {
                        // 레벨업 메시지
                        const channel = client.channels.get(guild.channel)
                        const embed = new RichEmbed()
                        .setTitle(`**${user}**(${channel.guild.members.get(guild.uid[user]).displayName})님의 승급을 축하해주세요!`)
                        .setColor(levelColor[Math.floor((userdata.level-1)/5)])
                        .setDescription(`**${user}**(${channel.guild.members.get(guild.uid[user]).displayName})님이 **${userdata.tier}**으로 승급하셨습니다.`)
                        .attachFile(`packages/백준/res/${userdata.level}.png`)
                        .setThumbnail(`attachment://${userdata.level}.png`)
    
                        channel.send(embed)

                        // 실제 레벨업
                        guild.level[user] = userdata.level
                        store.save(`벡준/${gid}`)
                    }
                })
            }
        },
        // 역할 체커
        role: async () => {
            const guildInfo = client.guilds.get(gid)
            const channel = client.channels.get(guild.channel)
            const uids = guild.uid
            const levels = guild.level
            const roleTable = {}
            const memberRoles = {}
            let level = 0
            let nextRoleId = ""
            let roleId = ""

            for (let [_, rid] of guildInfo.roles) {
                if (["Bot", "Bot(Developing)", "SLAVE", "@everyone"].includes(rid.name)) continue;
                roleTable[rid.id] = rid.name;
            }

            for (let [_, mid] of guildInfo.members) {
                if (mid.user.bot) continue;
                memberRoles[mid.id] = mid._roles
            }

            for (let [name, uid] of Object.entries(uids)) {
                level = levels[name]
                
                for (let [rid, role] of Object.entries(roleTable)) {
                    if (role == levelTorole(level)) nextRoleId = rid;
                }

                for (let role of memberRoles[uid]) {
                    if (!roleTable.hasOwnProperty(role)) continue
                    else {
                        roleId = role
                    }
                }

                if (roleId != nextRoleId) {
                    const displayName = guildInfo.members.get(uid).displayName
                    const embed = new RichEmbed()
                    .setTitle(`**${displayName}**님의 등급이 조정됩니다!`)
                    .setColor(levelColor[Math.floor((level-1)/5)])
                    .setDescription(`이제부터 **${displayName}(${name})**님의 등급은 **${levelTorole(level)}**입니다.`)
                    .setFooter("앞으로 더 많은 백준 문제들을 풀어주세요!")

                    channel.send(embed)

                    if (roleId != "") {
                        guildInfo.members.get(uid).removeRole(roleId).catch(console.error)
                    }
                    guildInfo.members.get(uid).addRole(nextRoleId).catch(console.error)
                }
            }
        }
    }
}

module.exports = checker