module.exports = {
  func : (msg, params) => {
      const music = bot.packages['음악']
      const gid = msg.guild.id
      const guild = music.guilds[gid]
      if (!guild.playing) {
          msg.channel.send('재생중이 아닙니다.')
      } else {
          guild.playing = false
          guild.control.pause()
      }
  },
  keyword : '일시정지',
  help : '재생 중인 음악을 멈춥니다.'
}