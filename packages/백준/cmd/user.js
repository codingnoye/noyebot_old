const solved = require('../solved.js')
const {RichEmbed} = require('discord.js')

const main = async (msg, params) => {
    if (params.length != 1) {
        msg.channel.send('인자의 개수가 올바르지 않습니다.')
        return
    }

    const channel = msg.channel
    const target = params[0]
    const targetInfo = await solved.user(target).catch(() => {
        channel.send('존재하지 않는 유저입니다.')
        return
    })
    console.log(targetInfo.tierSimple)
    const embed = new RichEmbed()
        .setColor(solved.color[Math.floor((targetInfo.level - 1) / 5)])
        .setTitle(`**${targetInfo.user}**`)
        .setDescription(`**${targetInfo.tier}** ${targetInfo.emoji}`)
        .attachFile(`packages/백준/res/${targetInfo.class}.png`)
        .setThumbnail(`attachment://${targetInfo.class}.png`)
        .addBlankField()
        .addField(`**총 경험치**`, `${targetInfo.xp}XP`)
        .addField(`**푼 문제**`, `${targetInfo.solved}문제`, true)
        .setURL(`https://solved.ac/${targetInfo.user}`)

    channel.send(embed)
}

module.exports = {
    func: main,
    keyword: 'user',
    help: '백준 사용자 한 명을 확인합니다.',
    args: 'id',
}
