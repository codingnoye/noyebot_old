const randint = (min, max) => {
    return Math.floor(Math.random() * (max-min)) + min
}
const content = [
    "언젠가는.",
    "그럼.",
    "그래.",
    "아마도.",
    "물론.",

    "아니",
    "안 돼.",
    "안 돼.",
    "그것도 안 돼.",
    "아닐걸.",

    "다시 물어봐.",
    "가만히 있어."
]
module.exports = {
    func : (bot, msg, param) => {
        msg.channel.send("마법의 소라고동: "+content[randint(0, content.length)], {file: 'https://i.imgur.com/KwefLw8.jpg'})
    },
    keyword : 'magic',
    help : '답을 알려줍니다. \'마법의 소라고동님 <질문>\'으로도 가능합니다.',
    args : 'question'
}