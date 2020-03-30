const commands = require('./commands.js')
const {RichEmbed} = require('discord.js')

const package = {
    desc: `${bot.config.botname} 기본 기능`,

    onLoad () {},

    onGuildLoad (gid) {},
    
    onGuildQuit (gid) {},

    onMsg (msg) {
        // 기본 호출자+help에는 항상 반응함
        if (msg.content == `${bot.config.defaultPrefix}help`) {
            commands.call('help', msg, [])
        }
    },

    onCmd (msg, params) {
        return commands.call(msg, params[0], params.slice(1))
    },

    async onQuit () {},

    help (msg) {
        const prefix = bot.guilds[msg.guild.id].prefix

        const embed = new RichEmbed().setColor(0x428BCA)
        .setTitle(`${bot.config.botname} 기본 도움말`)
        .setDescription(`${this.desc}`)

        for (const keyword of commands.keywords){
            const help = commands.help[keyword]
            if (help.args)
                embed.addField(`\`${prefix}${keyword} ${help.args.split(' ').map(x=>'<'+x+'>').join(' ')}\``, help.desc)
            else 
                embed.addField(`\`${prefix}${keyword}\``, help.desc)
        }
         
        msg.channel.send({embed})
    },

    helpSimple (msg, embed) {
        const prefix = bot.guilds[msg.guild.id].prefix
        const helps = []

        for (const keyword of commands.keywords) {
            const help = commands.help[keyword]
            if (help.args)
                helps.push(`\`${prefix}${keyword} ${help.args.split(' ').map(x=>'<'+x+'>').join(' ')}\`\n${help.desc}`)
            else
                helps.push(`\`${prefix}${keyword}\`\n${help.desc}`)
        }
            
        embed.addField(`${bot.config.botname} 기본 도움말`, `${helps.join('\n')}`)
    }
}
module.exports = package