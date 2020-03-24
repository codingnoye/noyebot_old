const rp = require("request-promise-native");
const cheerio = require("cheerio")

const korea = (bot, msg) => {
    rp.get({url: "http://ncov.mohw.go.kr/"}, function(err, response, body) {
        const $ = cheerio.load(body)
        let status = {}
        let regions = {}

        $("ul.liveNum li").each((i, ele) => {
            status[$(ele).children(".tit").text().trim()] = $(ele).children(".num").text().trim()
        })

        $("#main_maplayout button").each((i, ele) => {
            regions[$(ele).children(".name").text().trim()] = $(ele).children(".num").text().trim()
        })
        
        let statusEmbed = new bot.Discord.RichEmbed()
        .setTitle("실시간 코로나 상황")
        .setColor(0xff0000)
        .setDescription("전국 상태별 인원수")
        .setTimestamp()
        .setURL("http://ncov.mohw.go.kr/")

        for (let key in status) {
            statusEmbed.addField(key, status[key], true)
        }

        let regionsEmbed = new bot.Discord.RichEmbed()
        .setColor(0xff0000)
        .setDescription("전국 지역별 인원수")
        .setTimestamp()
        .setURL("http://ncov.mohw.go.kr/")

        for (let key in regions) {
            regionsEmbed.addField(key, regions[key], true)
        }

        msg.channel.send(statusEmbed)
        msg.channel.send(regionsEmbed)
    })
}

module.exports = {
    func : korea,
    keyword : "국내"
}