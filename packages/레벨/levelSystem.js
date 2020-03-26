const xpTable = [
    0,
    1000,
    2000,
    3000,
    5000,
    7000,
    9000,
    12000,
    15000,
    18000,
    22000,
    26000,
    30000,
    36000,
    42000,
    48000,
    56000,
    64000,
    72000,
    82000,
    92000 //20
]
const getLevel = (xp) => {
    for (let i=0; i<xpTable.length-1; i++) {
        const needXP = xpTable[i]
        if (xp < needXP) {
            const level = i
            return level
        }
    }
    return 20
}
module.exports = {
    xpTable: xpTable,
    getLevel: getLevel
}