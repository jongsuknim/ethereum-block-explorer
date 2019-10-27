# ethereum-block-explorer
etherscan과 같은 기능을 지향하는 ethereum block explorer 프로젝트입니다.
현재 backend 만 구현되어 있는 상태입니다.

# 구동 환경 

* mongodb 동작시키고, MONGODB_URL 환경변수 설정 (예, mongodb://localhost:27017)
* infura 가입하고, INFURA_WS_URL 환경변수 설정 (예, wss://mainnet.infura.io/ws/v3/<INFURA_ID>)
* tsc 설치 (https://www.npmjs.com/package/typescript)

# 실행
module 설치
```
npm install
npm link typescript	
```

build
```
npm run build
```

start
```
npm run start
```

# 테스트
db-wrapper 모듈 unit-test 
```
npm run test
```
ethereum-wrapper 모듈 test
```
npm run start-testmode
```


