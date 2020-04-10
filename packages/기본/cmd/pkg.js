const {RichEmbed} = require('discord.js')

module.exports = {
    func: (msg, params) => {
        const gid = msg.guild.id
        const pre = bot.guilds[gid].prefix
        if (params.length == 0) {
            const embed = new RichEmbed()
                .setTitle(`패키지 목록`)
                .setColor(0x428bca)
                .setDescription(`${bot.config.botname}에 적용 가능한 패키지 목록입니다.`)

            for (const packageName of bot.guilds[gid].enabled) {
                const package = bot.packages[packageName]
                embed.addField(
                    `**[${package.name}]**${
                        bot.guilds[gid].enabled.includes(packageName) ? ' - 적용됨' : ''
                    }`,
                    `${package.desc}`
                )
            }

            for (const packageName in bot.packages) {
                const package = bot.packages[packageName]
                if (bot.guilds[gid].enabled.includes(packageName)) continue
                embed.addField(`**[${package.name}]**`, `${package.desc}`)
            }

            embed.addField(
                `패키지 관리`,
                `패키지는 추가한 순서대로 작동합니다.\n\`${pre}pkg enable <패키지이름>\`으로 활성화할 수 있습니다.\n\`${pre}pkg disable <패키지이름>\`으로 비활성화할 수 있습니다.\n\`${pre}pkg reset\`으로 기본 패키지 상태로 되돌릴 수 있습니다.\n\`${pre}help <패키지명>\`으로 기본 패키지 도움말을 볼 수 있습니다.`
            )

            msg.channel.send({embed})
        } else {
            if (!msg.member.hasPermission('ADMINISTRATOR')) {
                msg.channel.send(`이 명령어는 관리자 권한이 필요합니다.`)
                return
            }
            switch (params[0]) {
                case 'enable':
                    if (params.length == 1) {
                        msg.channel.send('활성화할 패키지의 이름을 입력해주세요.')
                    } else {
                        if (bot.packages.hasOwnProperty(params[1])) {
                            if (!bot.guilds[gid].enabled.includes(params[1])) {
                                bot.guilds[gid].enabled.push(params[1])
                                bot.packages[params[1]].onGuildLoad(gid)
                                store.save(`guilds/${gid}`)
                                msg.channel.send(`[${params[1]}] 패키지가 활성화되었습니다.`)
                            } else {
                                msg.channel.send(`이미 활성화된 패키지입니다.`)
                            }
                        } else {
                            msg.channel.send(`[${params[1]}] 패키지를 찾을 수 없습니다.`)
                        }
                    }
                    break
                case 'disable':
                    if (params.length == 1) {
                        msg.channel.send('비활성화할 패키지의 이름을 입력해주세요.')
                    } else {
                        if (bot.packages.hasOwnProperty(params[1])) {
                            const idx = bot.guilds[gid].enabled.indexOf(params[1])
                            if (idx != -1) {
                                bot.guilds[gid].enabled.splice(idx, 1)
                                bot.packages[params[1]].onGuildQuit(gid)
                                store.save(`guilds/${gid}`)
                                msg.channel.send(`[${params[1]}] 패키지가 비활성화되었습니다.`)
                            } else {
                                msg.channel.send(`이미 비활성화된 패키지입니다.`)
                            }
                        } else {
                            msg.channel.send(`[${params[1]}] 패키지를 찾을 수 없습니다.`)
                        }
                    }
                    break
                case 'reset':
                    bot.guilds[gid].enabled = bot.config.defaultEnabled.slice()
                    store.save(`guilds/${gid}`)
                    msg.channel.send(`적용 패키지를 초기화했습니다.`)
                    break
                default:
                    msg.channel.send(`이해할 수 없습니다.`)
            }
        }
    },
    keyword: 'pkg',
    help: '서버에 적용 가능한 패키지 목록을 봅니다. 패키지를 관리할 수 있습니다.',
    args: '?enable|remove|reset',
}
