const {RichEmbed} = require('discord.js')

module.exports = {
    func: (msg, params) => {
        const music = bot.packages['음악']
        const gid = msg.guild.id
        const guild = music.guilds[gid]

        const embed = new RichEmbed()
            .setTitle(`재생목록`)
            .setColor(0x428bca)
            .setDescription(`'${bot.guilds[gid].prefix}다음곡'으로 곡을 넘길 수 있어요.`)

        let i = 0
        for (const song of guild.queue) {
            embed.addField(
                `by ${song.channel}`,
                `🎵 ${i == 0 ? '[현재 곡]' : `[ ${i} ]`} ${song.title}`
            )
            i += 1
        }
        msg.channel.send({embed})
    },
    keyword: '재생목록',
    help: '현재 곡과 재생목록을 확인합니다.',
}
