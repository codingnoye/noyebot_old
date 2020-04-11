const events = {
    async onMsg(msg) {
        // 봇의 메시지는 무시
        if (msg.author.bot) return

        // DM 미지원
        if (msg.guild == null) {
            msg.channel.send('현재 DM은 지원하지 않습니다.')
            return
        }

        const gid = msg.guild.id

        // 로드되지 않은 서버
        if (!bot.guilds.hasOwnProperty(gid)) {
            // 저장된 파일로부터 로드
            bot.guilds[gid] = store.load(`guilds/${gid}`)

            // prefix가 없으면 기본값으로 지정
            if (!bot.guilds[gid].hasOwnProperty('prefix')) {
                bot.guilds[gid].prefix = bot.config.defaultPrefix
                store.save(`guilds/${gid}`)
            }

            // enabled가 없으면 기본값으로 지정
            if (!bot.guilds[gid].hasOwnProperty('enabled')) {
                bot.guilds[gid].enabled = bot.config.defaultEnabled.slice()
                store.save(`guilds/${gid}`)
            }

            // 적용된 패키지들의 onGuildLoad로 전달
            for (const packageName of bot.guilds[gid].enabled) {
                bot.packages[packageName].onGuildLoad(gid)
            }
        }

        const prefix = bot.guilds[gid].prefix

        // 메시지 전달
        if (msg.content.startsWith(prefix)) {
            const params = msg.content.replace(prefix, '').split(' ')
            let worked = false
            // 명령어의 경우 적용된 패키지들의 onCmd로 전달
            for (const packageName of bot.guilds[gid].enabled)
                if (bot.packages[packageName].onCmd(msg, params) == true) worked = true
            // 어떤 패키지에서도 인식하지 못한 경우
            if (!worked) msg.channel.send(`'${params.join(' ')}'을(를) 이해할 수 없습니다.`)
        } else {
            // 명령어가 아니면 적용된 패키지들의 onMsg로 전달
            for (const packageName of bot.guilds[gid].enabled) {
                bot.packages[packageName].onMsg(msg)
            }
        }
    },
    async onKill() {
        debug.log('\n종료 작업 중...', debug.level.imp)
        const promises = []
        for (const packageName in bot.packages) promises.push(bot.packages[packageName].onQuit())
        await Promise.all(promises)
        debug.log('종료 전 모든 작업 완료', debug.level.imp)
        client.destroy()
        process.exit()
    },
    onPromiseError(reason, p) {
        console.log('Promise 에러: ', p)
        console.log(reason)
    },
}

module.exports = events
