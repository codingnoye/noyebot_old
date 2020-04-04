const rp = require('request-promise-native')
const comma = require('../../lib/util.js').comma

const prefix = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ruby']
const number = ['V', 'IV', 'III', 'II', 'I']
const kuteki_number = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']

const toClass = (num, decoration) => {
    let decoTable = ["", "s", "g"]

    return `c${num}${decoTable[decoration]}`
}

module.exports = {
    problem: async (problem) => {
        const data = JSON.parse(await rp(`https://api.solved.ac/problem_level.php?id=${problem}`))
        return {
            num: problem,
            tier: (data.level == 0) ? 'Unranked' : prefix[Math.floor((data.level-1)/5)] + ' ' + number[(data.level-1) % 5] + (data.kudeki_level == 0?'':' / Kudeki '+kuteki_number[data.kudeki_level-1]),
            level: data.level,
            kudeki_level: data.kudeki_level
        }
    },
    user: async (user) => {
        const data = JSON.parse(await rp(`https://api.solved.ac/user_information.php?id=${user}`))
        return {
            user: data.user_id,
            tier: (data.level == 0) ? 'Unranked' : prefix[Math.floor((data.level-1)/5)] + ' ' + number[(data.level-1) % 5],
            level: data.level,
            rawXp: data.exp,
            xp: comma(data.exp),
            solved: data.solved,
            submission : data.boj_submission_count,
            class : toClass(data.class, data.class_decoration)
        }
    },
    color: [0xa75618,0x4e608d,0xffae00,0x00ffa1,0x00afff,0xff0042],
    kcolor: 0x9C62D3
}