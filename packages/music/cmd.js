const ytdl = require('ytdl-core')
module.exports = (bot, youtube) => {
    const sing = async (gid, channel) => {
        const music = bot.packages['음악']
        const guild = music.guilds[gid]
        if (!guild.connection)
            guild.connection = await channel.join()
        guild.control = guild.connection.playStream(ytdl(guild.queue[0].url, { quality: 'highestaudio', filter: 'audioonly' }))
    }
    const join = async (bot, msg, gid) => {
        const music = bot.packages['음악']
        const guild = music.guilds[gid]
        if (!guild.channel) {
            if (msg.member.voiceChannel) {
                guild.channel = msg.member.voiceChannel
                return true
            } else {
                msg.channel.send('음악을 재생할 보이스채널에 들어간 후 다시 시도해 주세요.')
                return false
            }
        } else if (guild.channel != msg.member.voiceChannel) {
            if (msg.member.voiceChannel) {
                guild.queue.length = 0
                if (guild.control) guild.control.end()
                guild.channel.leave()
                guild.channel = msg.member.voiceChannel
                return true
            }
        } else {
            return true
        }
    }
    const play = async (gid) => {
        const music = bot.packages['음악']
        const guild = music.guilds[gid]
        guild.playing = true
        await sing(gid, guild.channel)
        guild.control.on('end', () => {
            if (guild.queue.length > 1) {
                if (guild.playing) {
                    guild.queue.shift()
                    play(gid)
                }
            } else {
                guild.queue.length = 0
                guild.control.destroy()
                guild.channel.leave()
                guild.playing = false
                guild.connection = null
            }
        })
    }
    return {
        듣기: {
            func : async (msg, param) => {
                const music = bot.packages['음악']
                const gid = msg.guild.id
                const guild = music.guilds[gid]

                if (!await join(bot, msg, gid)) return

                if (guild.queue.length == 0) {
                    guild.queue.push(await youtube.search(param))
                    msg.channel.send(`${guild.queue[0].channel}의 **${guild.queue[0].title}**을 재생합니다.`)
                    play(gid)
                } else {
                    guild.queue.push(await youtube.search(param))
                    msg.channel.send(`${guild.queue[guild.queue.length-1].channel}의 **${guild.queue[guild.queue.length-1].title}**이 재생목록에 추가되었습니다.`)
                }
            },
            keyword : '듣기',
            help : '유튜브에서 곡을 검색해 재생목록 뒤에 추가합니다.',
            args : 'song'
        },
        먼저듣기: {
            func : async (msg, param) => {
                const music = bot.packages['음악']
                const gid = msg.guild.id
                const guild = music.guilds[gid]

                if (!await join(bot, msg, gid)) return
                if (guild.control) {
                    guild.playing = false
                    guild.control.destroy()
                }
                guild.queue.unshift(await youtube.search(param))
                msg.channel.send(`${guild.queue[0].channel}의 **${guild.queue[0].title}**을 재생합니다.`)
                play(gid)                
                guild.playing = true
            },
            keyword : '먼저듣기',
            help : '유튜브에서 곡을 검색해 재생목록 가장 앞에 추가합니다.',
            args : 'song'
        },
        재생: {
            func : (msg, param) => {
                const music = bot.packages['음악']
                const gid = msg.guild.id
                const guild = music.guilds[gid]
                if (guild.playing) {
                    msg.channel.send('이미 재생중입니다.')
                } else if (guild.queue.length > 0) {
                    guild.playing = true
                    guild.control.resume()
                } else {
                    msg.channel.send('재생할 곡이 없습니다.')
                }
            },
            keyword : '재생',
            help : '재생목록에 있는 음악을 재생합니다.'
        },
        일시정지: {
            func : (msg, param) => {
                const music = bot.packages['음악']
                const gid = msg.guild.id
                const guild = music.guilds[gid]
                if (!guild.playing) {
                    msg.channel.send('재생중이 아닙니다.')
                } else {
                    guild.playing = false
                    guild.control.pause()
                }
            },
            keyword : '일시정지',
            help : '재생 중인 음악을 멈춥니다.'
        },
        중지: {
            func : (msg, param) => {
                const music = bot.packages['음악']
                const gid = msg.guild.id
                const guild = music.guilds[gid]
                guild.queue.length = 0
                guild.control.destroy()
                guild.channel.leave()
                guild.playing = false
                guild.connection = null
                msg.channel.send('재생을 중지합니다.')
            },
            keyword : '중지',
            help : '재생 중인 음악을 없애고 멈춥니다.'
        },
        재생목록: {
            func : (msg, param) => {
                const music = bot.packages['음악']
                const gid = msg.guild.id
                const guild = music.guilds[gid]

                const embed = new bot.Discord.RichEmbed()
                .setTitle(`재생목록`)
                .setColor(0x428BCA)
                .setDescription(`'${bot.setting[gid].prefix}다음곡'으로 곡을 넘길 수 있어요.`)

                let i = 0
                for (song of guild.queue) {
                    embed.addField(`by ${song.channel}`, `🎵 ${(i==0)?'[현재 곡]':`[ ${i} ]`} ${song.title}`)
                    i += 1
                }
                msg.channel.send({embed})
            },
            keyword : '재생목록',
            help : '현재 곡과 재생목록을 확인합니다.'
        },
        다음곡: {
            func : (msg, param) => {
                const music = bot.packages['음악']
                const gid = msg.guild.id
                const guild = music.guilds[gid]
                guild.control.end()
            },
            keyword : '다음곡',
            help : '재생목록의 다음 곡으로 넘깁니다.'
        },
        볼륨: {
            func : (msg, param) => {
                const music = bot.packages['음악']
                const gid = msg.guild.id
                const guild = music.guilds[gid]
                guild.volume = parseInt(param)/100
                if (guild.control) {
                    guild.control.setVolumeLogarithmic(guild.volume)
                }
                msg.channel.send('볼륨이 변경되었습니다.')
            },
            keyword : '볼륨',
            help : '볼륨을 조절합니다. 0~100범위에서 선택해 주세요.',
            args : 'volume'
        }
    }
}
