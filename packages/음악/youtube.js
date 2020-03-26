const Youtube = require('youtube-node')
const promisify = require('util').promisify

const parser = (data) => {
    const res = []
    for (song of data.items) {
        res.push({
            title: song.snippet.title,
            desc: song.snippet.description,
            channel: song.snippet.channelTitle,
            url: 'https://www.youtube.com/watch?v='+song.id.videoId
        })
    }
    return res
}

const youtube = new Youtube()
youtube.setKey(bot.config.youtubeKey)
youtube.addParam('order', 'relevance')
youtube.addParam('type', 'video')
const search = promisify(youtube.search)

module.exports = {
    async search (keyword) {
        const songs = await search(keyword, 1)
        return parser(songs)[0]
    }
}
