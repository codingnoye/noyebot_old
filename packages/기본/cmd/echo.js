module.exports = {
    func: (msg, params) => {
        const param = params.join(' ')
        if (param.length != 0) {
            msg.channel.send(param)
        } else {
            msg.channel.send('인자를 입력해 주세요.')
        }
    },
    keyword: 'echo',
    help: '말을 따라합니다.',
    args: 'message',
}
