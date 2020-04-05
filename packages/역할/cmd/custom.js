const {RichEmbed} = require('discord.js')

const levelColor = [0xa75618,0x4e608d,0xffae00,0x00ffa1,0x00afff,0xff0042]

const levelTorole = (level) => {
    const roles = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Ruby"]
    if (level == 0) return "@everyone"
    else {
        level--
        return roles[level / 5]
    }
}

const main = async (msg, params) => {
    const gid = msg.guild.id;
    const 백준 = store.load(`백준/${gid}`)
    const guildInfo = client.guilds.get(gid)
    const channel = client.channels.get(백준.channel)
    const uids = 백준.uid
    const levels = 백준.level
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

module.exports = {
    func : main,
    keyword : "custom",
    help : "(관리자) 서버가 백준 역할을 가지고있다면 자동으로 역할을 조정해줍니다.",
    args : "on/off"
}