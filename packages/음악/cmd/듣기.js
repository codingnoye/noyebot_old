const singer = require('../singer.js')
const youtube = require('../youtube.js')

module.exports = {
    func: async (msg, params) => {
        const music = bot.packages['음악']
        const gid = msg.guild.id
        const guild = music.guilds[gid]
        const param = params.join(' ')

        if (!(await singer.join(msg, gid))) return

        if (guild.queue.length == 0) {
            guild.queue.push(await youtube.search(param))
            msg.channel.send(
                `${guild.queue[0].channel}의 **${guild.queue[0].title}** 들려드릴게요.`
            )
            singer.play(gid)
        } else {
            guild.queue.push(await youtube.search(param))
            msg.channel.send(
                `${guild.queue[guild.queue.length - 1].channel}의 **${
                    guild.queue[guild.queue.length - 1].title
                }**이 재생목록에 추가되었습니다.`
            )
        }
    },
    keyword: '듣기',
    help: '유튜브에서 곡을 검색해 재생목록 뒤에 추가합니다.',
    args: 'song',
}
