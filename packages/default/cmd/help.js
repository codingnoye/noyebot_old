module.exports = {
    func : (bot, msg, param)=>{
        bot.packages['default'].help(msg)
        for (packageName in bot.packages) {
            if (packageName == 'default') continue
            const package = bot.packages[packageName]
            package.help(msg)
        }
    },
    keyword : 'help',
    help : '도움말을 확인합니다.'
}