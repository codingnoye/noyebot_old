const rp = require('request-promise-native')
const comma = require('../../lib/util.js').comma

const prefix = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ruby']
const number = ['V', 'IV', 'III', 'II', 'I']
const kuteki_number = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']

const toClass = (num, decoration) => {
    let decoTable = ['', 's', 'g']

    return `c${num}${decoTable[decoration]}`
}

module.exports = {
    problem: async (problem) => {
        const data = JSON.parse(await rp(`https://api.solved.ac/problem_level.php?id=${problem}`))
        const emoji = client.emojis.find(
            (emoji) =>
                emoji.name ===
                (data.level == 0
                    ? 'unranked'
                    : prefix[Math.floor((data.level - 1) / 5)].toLowerCase() +
                      (5 - ((data.level - 1) % 5)))
        )
        return {
            num: problem,
            tier:
                data.level == 0
                    ? 'Unranked'
                    : prefix[Math.floor((data.level - 1) / 5)] + ' ' + number[(data.level - 1) % 5],
            level: data.level,
            kudeki_level: data.kudeki_level,
            emoji: emoji ? emoji : '',
        }
    },
    user: async (user) => {
        const data = JSON.parse(await rp(`https://api.solved.ac/user_information.php?id=${user}`))
        const emoji = client.emojis.find(
            (emoji) =>
                emoji.name ===
                (data.level == 0
                    ? 'unranked'
                    : prefix[Math.floor((data.level - 1) / 5)].toLowerCase() +
                      (5 - ((data.level - 1) % 5)))
        )
        return {
            user: data.user_id,
            tier:
                data.level == 0
                    ? 'Unranked'
                    : prefix[Math.floor((data.level - 1) / 5)] + ' ' + number[(data.level - 1) % 5],
            // tierSimple: (data.level == 0) ? 'unranked' : prefix[Math.floor((data.level-1)/5)].toLowerCase() + (data.level-1)%5,
            level: data.level,
            rawXp: data.exp,
            xp: comma(data.exp),
            solved: data.solved,
            submission: data.boj_submission_count,
            class: toClass(data.class, data.class_decoration),
            emoji: emoji ? emoji : '',
        }
    },
    color: [0xa75618, 0x4e608d, 0xffae00, 0x00ffa1, 0x00afff, 0xff0042],
    kcolor: 0x9c62d3,
    //tierEmoji: (tierSimple) => {return client.emojis.find(emoji => emoji.name === tierSimple)}
}
