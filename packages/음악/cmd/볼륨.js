module.exports = {
    func: (msg, params) => {
        const music = bot.packages['음악']
        const gid = msg.guild.id
        const guild = music.guilds[gid]
        const param = params.join(' ')
        guild.volume = parseInt(param) / 100
        if (guild.control) {
            guild.control.setVolumeLogarithmic(guild.volume)
        }
        msg.channel.send('볼륨이 변경되었습니다.')
    },
    keyword: '볼륨',
    help: '볼륨을 조절합니다. 0~100범위에서 선택해 주세요.',
    args: 'volume',
}
