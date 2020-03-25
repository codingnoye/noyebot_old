// 중앙 처리 및 데이터 관리
const fs = require('fs')
const debug = require('./lib/debug.js')

// main 함수
const main = function (bot) {
    const client = bot.client

    // 패키지 로드
    const allUrl = fs.readdirSync('packages/')
        for (const url of allUrl) {
            const package = require('../packages/' + url + '/main.js')(bot)
            package.onLoad()
            bot.packages[package.name] = package
        }

    // on msessage 이벤트
    client.on("message", async msg => {
        if (!msg.author.bot) {
            if (msg.guild != null){
                const gid = msg.guild.id

                // 서버 인식
                if ((typeof bot.setting[gid]) == 'undefined') { // 로드되지 않은 서버라면 로드
                    bot.setting[gid] = bot.store.load(`guilds/${gid}`)
                    // prefix가 없으면 기본값으로 지정
                    if (!bot.setting[gid].hasOwnProperty('prefix')) {
                        bot.setting[gid].prefix = bot.config.defaultPrefix
                        bot.store.save(`guilds/${gid}`)
                    }
                    // enabled가 없으면 기본값으로 지정
                    if (!bot.setting[gid].hasOwnProperty('enabled')) {
                        bot.setting[gid].enabled = bot.config.defaultEnabled.slice()
                        bot.store.save(`guilds/${gid}`)
                    }
                    // 적용된 패키지들로 보냄
                    for (const packageName of bot.setting[gid].enabled) {
                        bot.packages[packageName].onGuildLoad(msg, msg.guild.id)
                    }
                }
                const prefix = bot.setting[gid].prefix

                // 메시지를 플러그인 모듈로 보내기
                if (msg.content.startsWith(prefix)) {
                    // 명령어 메시지
                    const parts = msg.content.replace(prefix, '').split(" ")
                    const keyword = parts[0]
                    const param = parts.slice(1).join(" ")
                    let worked = false
                    for (const packageName of bot.setting[gid].enabled) {
                        if (bot.packages[packageName].onCmd(msg, keyword, param) == true)
                            worked = true
                    }
                    if (!worked)
                        msg.channel.send(`'${keyword} ${param}'을(를) 이해할 수 없습니다.`)
                } else {
                    // 일반 메시지
                    for (const packageName of bot.setting[gid].enabled) {
                        bot.packages[packageName].onMsg(msg)
                    }
                }
                
            } 
            else {
                debug.log(`dm : ${msg.content}`)
                msg.channel.send('현재 DM은 지원하지 않습니다.')
            }
        }
    })

    // 종료 시 작업
    process.on('SIGINT', function() {
        debug.log('')
        debug.log("종료 작업 중...", debug.level.imp)
        const promArr = []
        for (let packageName in bot.packages) {
            const package = bot.packages[packageName]
            promArr.push(package.onQuit())
        }
        Promise.all(promArr).then(() => {
        debug.log("종료 전 모든 작업 완료", debug.level.imp)
        bot.client.destroy()
        process.exit()
        })
    })

    // 임시 에러 로거
    process.on('unhandledRejection', (reason, p) => {
        console.log('Promise 에러: ', p);
        console.log(reason)
    })

    bot.client.user.setStatus('online')
    bot.client.user.setPresence({
        game: {
            name: `${bot.config.defaultPrefix}help　 　 　 　 　 　 　 　 　 　 .`,
            type: "Playing"
        }
    });
}
module.exports = main