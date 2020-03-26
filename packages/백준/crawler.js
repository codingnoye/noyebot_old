const rp = require('request-promise-native')
const cheerio = require('cheerio')
const _ = require('underscore')
module.exports = {
    async problem (problemId) {
        const data = await rp(`https://www.acmicpc.net/problem/${problemId}`)
        const $ = cheerio.load(data)
        const problem = {
            title: $('title').text(),
            users: $('td:nth-child(4)').text(),
            users_percent: $('td:nth-child(6)').text()
        }
        return problem
    },
    async school (schoolId) {
        const data = await rp(`https://www.acmicpc.net/status?result_id=4&school_id=${schoolId}`)
        const $ = cheerio.load(data)
        const solutions = []
        $('tr').each((index, item) => {
            if (index == 0) return
            const solutionId = parseInt($(item).find('td:nth-child(1)').text())
            const user = $(item).find('td:nth-child(2)').text()
            const problem = parseInt($(item).find('td:nth-child(3)').text())
            const name = $(item).find('td:nth-child(3) .problem_title').attr('title')
            const solution = {id: solutionId, user: user, problem: problem, name: name}
            solutions.push(solution)
        })
        return solutions
    },
    async user (userId) {
        const data = await rp(`https://solved.ac/${userId}/solved`)
        const $ = cheerio.load(data)
        const problems = []
        $('.stick_to_top+ .std .tooltip').each((index, item) => {
            const problem = parseInt($(item).clone().children().remove().end().text())
            problems.push(problem)
        })
        return problems
    },
    async quest (users, count=500, min='s5', max='p1', n='5') {
        const temp = []
        for (const user of users) {
            temp.push(`solved_by%3A${user}`)
        }
        const query = `tier%3A${min}..${max}%20solved%3A${count}..%20!(${temp.join('%20')})`
        const data = await rp(`https://solved.ac/search/${query}`)
        const $ = cheerio.load(data)
        const problems = []
        $('.problem_id').each((index, item) => {
            const problem = parseInt($(item).text())
            problems.push(problem)
        })
        return _.sample(problems, parseInt(n))
    }
}