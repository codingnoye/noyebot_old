module.exports = {
    func: (msg, param) => {
        const music = bot.packages['음악']
        const gid = msg.guild.id
        const guild = music.guilds[gid]
        if (guild.playing) {
            msg.channel.send('이미 재생중입니다.')
        } else if (guild.queue.length > 0) {
            guild.playing = true
            guild.control.resume()
        } else {
            msg.channel.send('재생할 곡이 없습니다.')
        }
    },
    keyword: '재생',
    help: '재생목록에 있는 음악을 재생합니다.',
}
