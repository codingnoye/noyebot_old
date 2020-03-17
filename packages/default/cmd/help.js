module.exports = {
    func : (bot, msg, param)=>{
        bot.packages['기본'].help(msg)
        for (packageName in bot.packages) {
            if (packageName == '기본') continue
            const package = bot.packages[packageName]
            package.help(msg)
        }
    },
    keyword : 'help',
    help : '도움말을 확인합니다.'
}