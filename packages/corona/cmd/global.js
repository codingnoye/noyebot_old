const rp = require("request-promise-native");
const cheerio = require("cheerio")

const global = (bot, msg) => {
    rp.get({url: "http://ncov.mohw.go.kr/bdBoardList_Real.do?brdId=1&brdGubun=14&ncvContSeq=&contSeq=&board_id=&gubun="}, function(err, response, body) {
        const $ = cheerio.load(body)
        let globalRegions = {}

        $(".mgt8 table.num tbody tr").each((i, ele) => {
            if (i <= 5) {
                globalRegions[$(ele).children("th").text().trim()] = {
                    감염자 : $(ele).children("td:nth-child(2)").text().trim(),
                    사망자 : $(ele).children("td:nth-child(3)").text().trim(),
                    사망률 : $(ele).children("td:nth-child(4)").text().trim()
                }
            }
        })

        let globalRegionsEmbed = new bot.Discord.RichEmbed()
        .setTitle("실시간 코로나 상황")
        .setColor(0xff0000)
        .setDescription("해외 주요 국가 비교\n\n**감염자 / 사망자 / 사망률**")
        .setTimestamp()
        .setURL("http://ncov.mohw.go.kr/")

        for (let key in globalRegions) {
            text = `${globalRegions[key]["감염자"]} / ${globalRegions[key]["사망자"]} / ${globalRegions[key]["사망률"]}`
            globalRegionsEmbed.addField(key, text)
        }

        msg.channel.send(globalRegionsEmbed)
    })
}

module.exports = {
    func : global,
    keyword : "국외"
}