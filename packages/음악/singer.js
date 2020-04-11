const ytdl = require('ytdl-core')
const sing = async (gid, channel) => {
    const music = bot.packages['음악']
    const guild = music.guilds[gid]
    if (!guild.connection) guild.connection = await channel.join()
    guild.control = guild.connection.playStream(
        ytdl(guild.queue[0].url, {quality: 'highestaudio', filter: 'audioonly'})
    )
    guild.control.setVolumeLogarithmic(guild.volume)
}
const join = async (msg, gid) => {
    const music = bot.packages['음악']
    const guild = music.guilds[gid]
    if (!guild.channel) {
        if (msg.member.voiceChannel) {
            guild.channel = msg.member.voiceChannel
            return true
        } else {
            msg.channel.send('음악을 재생할 보이스채널에 들어간 후 다시 시도해 주세요.')
            return false
        }
    } else if (guild.channel != msg.member.voiceChannel) {
        if (msg.member.voiceChannel) {
            guild.queue.length = 0
            if (guild.control) guild.control.end()
            guild.channel.leave()
            guild.channel = msg.member.voiceChannel
            return true
        }
    } else {
        return true
    }
}
const play = async (gid) => {
    const music = bot.packages['음악']
    const guild = music.guilds[gid]
    guild.playing = true
    await sing(gid, guild.channel)
    guild.control.on('end', () => {
        if (guild.loop && guild.playing) guild.queue.push(guild.queue[0])
        if (guild.queue.length > 1) {
            if (guild.playing) {
                guild.queue.shift()
                guild.textChannel.send(
                    `${guild.queue[0].channel}의 **${guild.queue[0].title}** 들려드릴게요.`
                )
                play(gid)
            }
        } else {
            guild.queue.length = 0
            guild.control.destroy()
            guild.channel.leave()
            guild.playing = false
            guild.connection = null
        }
    })
}

module.exports = {
    sing: sing,
    join: join,
    play: play,
}
