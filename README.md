# 트렌드 대시보드

유튜브 채널 콘텐츠 기획을 위해 매일 자동으로 트렌드를 모아주는 대시보드입니다.

- 🎬 유튜브 인기 급상승 (한국) — YouTube Data API v3
- 🔥 구글 급상승 검색어 (한국) — Google Trends 공식 RSS
- 📰 주요 뉴스 헤드라인 + 자동 키워드 추출 — Google 뉴스 RSS

매일 새벽(KST 06:30) GitHub Actions가 자동으로 데이터를 수집해서 저장소에 커밋하고,
Vercel이 그 커밋을 감지해 자동으로 재배포합니다. 서버/DB 비용이 들지 않습니다.

## 로컬 개발

```bash
npm install
cp env.example .env.local   # YOUTUBE_API_KEY 입력
npm run fetch:daily         # data/ 에 오늘자 리포트 생성
npm run dev                 # http://localhost:3000
```

## YouTube API 키 발급 (무료, 5분)

1. https://console.cloud.google.com/ 접속 (개인 구글 계정 권장)
2. 새 프로젝트 생성
3. "YouTube Data API v3" 검색 → 사용(Enable)
4. 사용자 인증 정보 → API 키 만들기 → 복사
5. (선택) 키 제한에서 "YouTube Data API v3"만 허용하도록 제한

## 배포 (Vercel + GitHub Actions)

1. 이 프로젝트를 GitHub 저장소로 푸시
   ```bash
   git add -A
   git commit -m "init"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
2. [vercel.com](https://vercel.com) 에서 해당 GitHub 저장소 Import → 기본 설정 그대로 Deploy
   - Vercel 프로젝트 설정 → Environment Variables 에 `YOUTUBE_API_KEY` 추가 (리포트 상세 페이지가 런타임에 필요할 수 있음)
3. GitHub 저장소 → Settings → Secrets and variables → Actions →
   `YOUTUBE_API_KEY` 시크릿 추가 (GitHub Actions가 매일 데이터 수집할 때 사용)
4. 이후로는 매일 자동으로:
   - GitHub Actions가 데이터 수집 → `data/YYYY-MM-DD.json` 커밋
   - Vercel이 그 커밋을 감지해 자동 재배포

수동으로 바로 한 번 실행해보고 싶다면 GitHub 저장소 → Actions → "Daily trend fetch" →
"Run workflow" 로 즉시 실행할 수 있습니다.

## 참고 / 제약사항

- Google 뉴스 RSS는 "개인적·비상업적 용도" 조건이 있습니다. 개인 콘텐츠 리서치 용도로만 사용하세요.
- 유튜브 트렌딩은 공식 YouTube Data API(`videos.list?chart=mostPopular`)를 사용합니다. 비공식 스크래핑은
  유튜브 봇 차단 정책 때문에 테스트 결과 안정적이지 않아 제외했습니다.
- 뉴스 키워드 추출은 간단한 빈도 기반 추출(형태소 분석기 미사용)이라 완벽하지 않을 수 있습니다.
