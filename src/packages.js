const fs = require('fs')
module.exports = {
    load (packageName) {
        const package = require('../packages/' + packageName + '/main.js')
        package.name = packageName
        package.onLoad()
        bot.packages[packageName] = package
    },
    loadAll() {
        const packageNames = fs.readdirSync('packages/')
        for (const packageName of packageNames) {
            this.load(packageName)
        }
    }
}