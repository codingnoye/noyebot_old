const Youtube = require('youtube-node')
const apikey = require('./apikey.js')
const promisify = require('util').promisify

const youtube = new Youtube()
youtube.setKey(apikey)
youtube.addParam('order', 'relevance')
youtube.addParam('type', 'video')

search = promisify(youtube.search)

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

module.exports = (bot) => {
    return {
        async search (keyword) {
            const songs = await search(keyword, 1)
            return parser(songs)[0]
        }
    }
}