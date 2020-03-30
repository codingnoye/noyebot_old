Noyebot
=======
적당히 쓸만한 디코 봇
# 시작하기
준비물: `node`, `npm`
* `git clone https://github.com/codingnoye/noyebot`으로 봇을 가져온다.
* `cd noyebot`으로 디렉토리에 들어간다.
* `npm install`로 node 의존성을 설치한다. 
* [디코 개발자 포탈](https://discordapp.com/developers/applications/)로 가서 봇을 만들고 토큰을 가져와 `config.js`에 넣는다.
* 봇을 디스코드 서버에 초대한다.
* `npm start`로 봇을 실행한다. 
# 폴더 구조
* `data/` : 데이터 저장 영역, `src/store.js`에서 관리한다.
  * `data/config.js` : 설정 파일
* `packages/` : 패키지 영역
* `src/` : 소스 영역
* `index.js` : 엔트리 포인트
# 패키지 추가하기
`packages/패키지명/main.js`가 특정 형식의 객체를 export하면 된다.
```js
module.exports = {
    desc: '패키지 설명',
    // 패키지가 로드될 때 호출
    onLoad () {},
    // 새로운 서버가 인식되거나 새로운 서버에서 활성화될때 호출
    onGuildLoad (gid) {},
    // 서버에서 비활성화될 때 호출
    onGuildQuit (gid) {},
    // 서버에 메시지가 왔을 때 호출
    onMsg (msg) {},
    // 명령어가 호출되었을 때 호출
    onCmd (msg, params) {
        return false
        // true를 반환하면 이 패키지에서 명령어를 인식했다는 의미
    },
    // 봇이 종료될 때 호출
    async onQuit () {},
    // help 명령어 사용 시 호출
    help (msg) {},
    // 전체 도움말 조회 시 호출
    helpSimple (embed) {}
}
```

간단한 예시가 필요하면 `packages/소라고동`에서 간단한 '마법의 소라고동' 예시를, 좀 더 자세한 예시가 필요하면 `packages/레벨`에서 기본 명령어 예시를 보자.

# 구조
몇 개의 global 객체들을 위주로 작동한다.
* `bot`: 패키지(packages`<Object>`)와 전역 설정(config`<Object>`), 서버별 설정(guilds`<Object>`)을 담고 있다.
* `store`: 저장할 필요가 있는 데이터들을 관리할 수 있다. `store.load(dataName)` `<Method>`와 `store.save(dataName)` `<Method>`로 불러오고 저장한다.
* `client`: discord.js의 client다. 
## bot 객체의 필드
* guilds: 서버별 설정 객체. `bot.guilds[서버id]`으로 접근이 가능하고, `data/guilds/[서버id].json`의 형태로 저장된다.
* packages: 패키지의 main.js에서 반환받은 객체들. `bot.packages[패키지이름]`으로 접근이 가능하다.
* config: `data/config.js`의 내용이다.
* store: `src/store.js`다. 저장이 필요한 정보를 save/load할 수 있다.

## store.js
저장이 필요한 객체들을 관리한다.

전역에서 `store`로 접근할 수 있고, `store.load('파일명')`을 호출하면 `data/파일명.json`을 가져온다.

만약 이미 한 번 이상 불러온 정보라면, 파일로부터 가져오지 않고 앞서 불러온 정보의 참조를 전달한다. 어디서든 `store.load('baekjoon/서버id')`를 호출한다면 `data/baekjoon/서버id.json`에서 가져온 같은 객체를 주는 것이 보장된다. 없는 파일이면 (해당 경로와) 빈 파일을 생성해 가져온다.

`store.save('파일명')`을 호출하면, 해당 파일명을 통해서 load했던 객체를 다시 해당 파일에 저장한다.

# 기타
* 디스코드 `코딩노예 #1483`
* PR 해주세요