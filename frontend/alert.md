**중요** 
- package-lock.json 충돌 주의:
- 프론트와 백엔드가 각자의 폴더(frontend/, backend/) 안에 있는 package.json만 건드리면 충돌날 일이 없습니다. 절대 루트 경로에서 npm install 하지 마세요.
- front 내부로 이동하고, npm istall 진행

main 브랜치 보호:
- 절대로 main 브랜치에서 직접 작업하거나 git push origin main을 하지 마세요. 실수로 코드가 꼬이면 팀 전체가 멈춥니다.
- 새 브랜치를 만들어 작업 
- notion 참고

자주 공유하기:
- 완성되지 않았어도 하루에 한 번은 PR을 올리거나 커밋해서 코드를 공유하세요.
- 커밋시의 메세지 포멧 지켜 주세요. notion 참고

** 해당 md 파일은 위 내용이 익숙해지고 나면 지워도 무방합니다.