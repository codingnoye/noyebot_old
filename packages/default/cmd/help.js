module.exports = {
    func : (bot, msg, param)=>{
        const gid = msg.guild.id
        for (const packageName of bot.setting[gid].enabled) {
            const package = bot.packages[packageName]
            package.help(msg)
        }
    },
    keyword : 'help',
    help : '도움말을 확인합니다.'
}