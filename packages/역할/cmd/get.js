const {RichEmbed} = require("discord.js")
const getter = require("../getter.js")

const isTargetInMembers = (target, mInfos) => {
    let check = false

    for (let [id, mInfo] of mInfos) {
        if (target == mInfo.displayName) check = true
    }

    return check
}

const main = (msg, params) => {
    if (params.length != 1) {
        msg.channel.send("인자의 개수가 올바르지 않습니다.")
        return
    }
    
    const channel = msg.channel
    const gInfo = msg.guild
    const mInfos = channel.members
    const target = params[0]

    if (!isTargetInMembers(target, mInfos)) {
        channel.send("이 채널에 존재하지 않는 유저입니다.")
        return
    }

    const targetId = getter.getMemberId(target, channel)
    const roleTable = getter.getRoleTable(gInfo)
    const roleIds = mInfos.get(targetId)._roles
    const roles = roleIds.map(x => roleTable[x])

    channel.send(`${target}님의 역할은 **${roles.join(", ")}**입니다`)
}

module.exports = {
    func : main,
    keyword : "get",
    help : "(관리자) 해당 채널 내의 유저의 역할을 가져옵니다.",
    args : "userName"
}