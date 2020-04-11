module.exports = {
    getMemberTable: (channel) => {
        const mInfos = channel.members
        const result = {}

        for (let [id, mInfo] of mInfos) {
            result[id] = mInfo.displayName
        }

        return result // name : id
    },
    getMemberId: (target, channel) => {
        const mInfos = channel.members
        let result = ''

        for (let [id, mInfo] of mInfos) {
            if (target == mInfo.displayName) {
                result = id
            }
        }

        return result // id
    },
    getRoleTable: (gInfo) => {
        const rInfos = gInfo.roles
        const result = {}

        for (let [id, rInfo] of rInfos) {
            if (rInfo.name == '@everyone') continue
            result[id] = rInfo.name
        }

        return result // name : id
    },
    getRoleId: (target, gInfo) => {
        const rInfos = gInfo.roles
        let result = ''

        for (let [id, rInfo] of rInfos) {
            if (target == rInfo.name) {
                result = id
            }
        }

        return result // id
    },
}
