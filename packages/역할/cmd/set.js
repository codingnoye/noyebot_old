const {RichEmbed} = require('discord.js')
const getter = require('../getter.js')

const getRoleId = (role, rInfos) => {
    let roleId = ''

    for (let [id, rInfo] of rInfos) {
        if (role == rInfo.name) {
            roleId = id
            break
        }
    }

    return roleId
}

const isCmdInRoles = (role, roleTable) => {
    let check = false

    for (let [id, name] of Object.entries(roleTable)) {
        if (role == name) {
            check = true
            break
        }
    }

    return check
}

const isTargetInMembers = (target, mInfos) => {
    let check = false

    for (let [id, mInfo] of mInfos) {
        if (target == mInfo.displayName) {
            check = true
            break
        }
    }

    return check
}

const main = (msg, params) => {
    if (params.length != 2) {
        msg.channel.send('인자의 개수가 올바르지 않습니다.')
        return
    }

    const channel = msg.channel
    const gInfo = msg.guild
    const mInfos = channel.members
    const rInfos = gInfo.roles
    const target = params[0]
    const cmd = params[1]

    if (!isTargetInMembers(target, mInfos)) {
        channel.send('이 채널에 존재하지 않는 유저입니다.')
        return
    }

    if (!['+', '-'].includes(cmd[0])) {
        channel.send('인자는 + 또는 -로 시작해야합니다.')
        return
    }

    const roleTable = getter.getRoleTable(gInfo)
    const targetId = getter.getMemberId(target, channel)
    const targetRoleIds = mInfos.get(targetId)._roles
    const sign = cmd[0]
    const role = cmd.slice(1)
    const roleId = getter.getRoleId(role, gInfo)

    if (!isCmdInRoles(role, roleTable)) {
        channel.send('이 서버에 존재하지 않는 역할입니다.')
        return
    }

    if (rInfos.get(roleId).hasPermission('ADMINISTRATOR')) {
        channel.send('관리자 역할은 변경하실 수 없습니다.')
        return
    }

    const hasTargetRole = targetRoleIds.includes(roleId)

    if (sign == '+') {
        if (hasTargetRole) {
            channel.send(`**${target}**님은 이미 **${role}** 역할을 가지고 있습니다.`)
            return
        }
        mInfos.get(targetId).addRole(roleId)
        channel.send(`**${target}**님은 이제 **${role}** 역할을 가집니다.`)
    } else {
        if (!hasTargetRole) {
            channel.send(`**${target}**님은 **${role}** 역할을 가지고 있지 않습니다.`)
            return
        }
        mInfos.get(targetId).removeRole(roleId)
        channel.send(`**${target}**님은 이제 **${role}** 역할이 없어집니다.`)
    }
}

module.exports = {
    func: main,
    keyword: 'set',
    help: '(관리자) 해당 채널 내의 유저들의 역할을 조정합니다',
    args: 'userName +[role]|-[role]',
}
