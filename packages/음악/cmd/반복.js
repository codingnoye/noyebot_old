module.exports = {
    func : (msg, param) => {
        const music = bot.packages['음악']
        const gid = msg.guild.id
        const guild = music.guilds[gid]
        if (guild.loop) {
            guild.loop = false
            msg.channel.send('반복재생이 꺼졌습니다.')
        } else {
            guild.loop = true
            msg.channel.send('반복재생이 켜졌습니다.')
        }
        
    },
    keyword : '반복',
    help : '반복재생을 토글합니다.'
}