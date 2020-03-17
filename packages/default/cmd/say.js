module.exports = {
    func : (bot, msg, param) => {
        if (param.length != 0) {
            msg.channel.send(`${param}`)
            msg.delete()
        } else {
            msg.channel.send("인자를 입력해 주세요.")
        }
    },
    keyword : 'say',
    help : '메시지를 대신 말합니다.',
    args : 'message'
}