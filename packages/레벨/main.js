const level = require('./levelSystem.js')
const commands = require('./commands.js')
const {RichEmbed} = require('discord.js')
const comma = require('../../lib/util.js').comma

const package = {
    desc: `레벨을 관리합니다.`,

    onLoad () {},

    onGuildLoad (gid) {
        this.guilds[gid] = store.load(`레벨/${gid}`)
        if (!this.guilds[gid].hasOwnProperty('xp')) {
            this.guilds[gid].xp = {}
            this.guilds[gid].lv = {}
            store.save(`레벨/${gid}`)
        }   
    },

    onGuildQuit (gid) {},

    onMsg (msg) {},

    onCmd (msg, params) {
        return commands.call(msg, params[0], params.slice(1))
    },

    async onQuit () {},
    
    help (msg) {
        const prefix = bot.guilds[msg.guild.id].prefix

        const embed = new RichEmbed().setColor(0x428BCA)
        .setTitle(`레벨 패키지 도움말`)
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
            
        embed.addField(`레벨: ${this.desc}`, `${helps.join('\n')}`)
    },

    guilds: {},

    earnXP (gid, uid, ammount) {
        if (this.guilds[gid].xp.hasOwnProperty(uid))
            this.guilds[gid].xp[uid] += ammount
        else
            this.guilds[gid].xp[uid] = ammount
        this.levelUpCheck(gid, uid)
        store.save(`레벨/${gid}`)
    },

    levelUpCheck (gid, uid) {
        if (!this.guilds[gid].lv.hasOwnProperty(uid))
            this.guilds[gid].lv[uid] = 1
        const newLv = level.getLevel(this.guilds[gid].xp[uid])
        const rawXP = this.guilds[gid].xp[uid]
        if (this.guilds[gid].lv[uid] < newLv) {
            const channel = client.channels.get(this.guilds[gid].channel)
            const embed = new RichEmbed().setColor(0x428BCA)
            .setTitle(`레벨 업!`)
            .addField(`**Lv. ${this.guilds[gid].lv[uid]}** -> **Lv. ${newLv}** (${(rawXP-level.xpTable[newLv-1])/(level.xpTable[newLv]-level.xpTable[newLv-1])*100}%)`, `**${channel.guild.members.get(uid).nickname}**\n${comma(rawXP)}xp / ${(comma(level.xpTable[newLv]))}xp`)
            channel.send(embed)

            this.guilds[gid].lv[uid] = newLv
        }
        store.save(`레벨/${gid}`)
    }
}

module.exports = package