module.exports = {
    func: (msg, params) => {
        const music = bot.packages['음악']
        const gid = msg.guild.id
        const guild = music.guilds[gid]
        if (guild.control) guild.control.end()
        else msg.channel.send('재생중이 아닙니다.')
    },
    keyword: '다음곡',
    help: '재생목록의 다음 곡으로 넘깁니다.',
}
