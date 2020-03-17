const rp = require("request-promise-native");
const cheerio = require("cheerio")

const corona = (bot, msg) => {
    rp.get({url: "http://coronamap.site/"}, function(err, response, body) {
        const $ = cheerio.load(body)
        const state = {
            confirm : $(".confirm").next().text().trim(),
            cure : $(".cure").next().text().trim(),
            death : $(".death").next().text().trim()
        }
        
        const embed = new bot.Discord.RichEmbed()
        .setTitle("실시간 코로나 상황")
        .setColor(0xff0000)
        .setDescription("전국 상태별 인원수")
        .addField("확진", `${state.confirm}`)
        .addField("완치", `${state.cure}`)
        .addField("사망", `${state.death}`)

        msg.channel.send({embed})
    })
}

const package = (bot) => {
    return {
        name: 'corona',
        // 패키지가 로드될 때 호출
        onLoad () {},
        // 새로운 서버가 인식될 때 호출
        onGuildLoad (msg, gid) {},
        // 서버에 메시지가 왔을 때 호출
        onMsg (msg) {},
        // 명령어가 호출되었을 때 호출
        onCmd (msg, keyword, param) {
            if (keyword == "코로나") {
                corona(bot, msg)
                return true
            }
            return false // true를 반환하면 이 패키지에서 명령어를 인식했다는 의미
        },
        // help 명령어 사용 시 호출
        help (msg) {
            const prefix = bot.setting[msg.guild.id].prefix

            const embed = new bot.Discord.RichEmbed()
            .setTitle(`실시간 코로나 현황`)
            .setColor(0x428BCA)
            .setDescription(`현재 코로나-19 확산에 따른 실시간 상태별 인원수 알리미입니다.`)
            .addField(`${prefix}코로나`, '상태별 인원을 확인합니다.')
            .setFooter("출처 : http://coronamap.site/")
            
            msg.channel.send({embed})
        }
    }
}

module.exports = package