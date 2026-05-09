// api/theme.js
export default async function handler(req, res) {
    // 💡 환경변수명을 BUSAN_API_KEY로 변경 적용
    const API_KEY = process.env.BUSAN_API_KEY; 
    
    const { pageNo = 1, numOfRows = 12 } = req.query;

    // 부산테마여행 국문 정보 엔드포인트
    const endpoint = 'https://apis.data.go.kr/6260000/RecommendedService/getRecommendedKr';
    const params = new URLSearchParams({
        serviceKey: API_KEY, // 수정된 키 사용
        pageNo: pageNo,
        numOfRows: numOfRows,
        resultType: 'json'
    });

    try {
        const response = await fetch(`${endpoint}?${params.toString()}`);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: '데이터를 가져오는 중 오류가 발생했습니다.' });
    }
}
