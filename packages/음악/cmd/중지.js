module.exports = {
    func : (msg, param) => {
        const music = bot.packages['음악']
        const gid = msg.guild.id
        const guild = music.guilds[gid]
        guild.queue.length = 0
        guild.control.destroy()
        guild.channel.leave()
        guild.playing = false
        guild.connection = null
        msg.channel.send('재생을 중지합니다.')
    },
    keyword : '중지',
    help : '재생 중인 음악을 없애고 멈춥니다.'
}