const Discord = require('discord.js')
const client = new Discord.Client()
const debug = require('./lib/debug.js')
const config = require('./data/config.js')
const store = require('./src/store.js')
const events = require('./src/events.js')
const packages = require('./src/packages.js')

const bot = {
    guilds: {},
    packages: {},
    config: config,
}

global.bot = bot
global.debug = debug
global.store = store
global.client = client

// main 함수 (봇이 켜진 후 작동)
const main = async () => {
    // 패키지 로드
    packages.loadAll()

    // 메시지 왔을 때 처리
    client.on('message', events.onMsg)

    // 봇 상태 표시
    client.user.setStatus('online')
    client.user.setPresence({
        game: {
            name: `${bot.config.defaultPrefix}help　 　 　 　 　 　 　 　 　 　 .`,
            type: 'Playing',
        },
    })
}

// 종료 시 작업
process.on('SIGINT', events.onKill)

// Promise 에러 임시 디버그용
process.on('unhandledRejection', events.onPromiseError)

// ready 시 작업
client.on('ready', () => {
    debug.log('서버 시작', debug.level.imp)
    bot.client = client
    main()
})

// 로그인
client.login(config.token)
