// api/theme.js
export default async function handler(req, res) {
    const API_KEY = process.env.BUSAN_API_KEY;
    const { pageNo = 1, numOfRows = 12 } = req.query;

    if (!API_KEY) {
        console.error("❌ 에러: BUSAN_API_KEY가 설정되지 않았습니다.");
        return res.status(500).json({ error: "API 키 설정 누락" });
    }

    const endpoint = 'https://apis.data.go.kr/6260000/RecommendedService/getRecommendedKr';
    const params = new URLSearchParams({
        serviceKey: API_KEY, // 여기에 '디코딩된 키'가 들어가야 함
        pageNo: pageNo,
        numOfRows: numOfRows,
        resultType: 'json'
    });

    try {
        const targetUrl = `${endpoint}?${params.toString()}`;
        console.log("🚀 요청 URL:", targetUrl); // 로그에서 실제 요청 주소 확인 가능

        const response = await fetch(targetUrl);
        const rawData = await response.text(); // 일단 텍스트로 받아서 확인

        // 만약 데이터가 XML(첫 글자가 <)로 왔다면 에러 메시지로 처리
        if (rawData.trim().startsWith('<')) {
            console.error("⚠️ 공공데이터포털에서 XML 에러를 보냈습니다:", rawData);
            return res.status(500).json({ error: "API 키 인증 오류 또는 포털 점검 중", detail: rawData });
        }

        const data = JSON.parse(rawData);
        res.status(200).json(data);
    } catch (error) {
        console.error("❌ 서버 내부 에러:", error);
        res.status(500).json({ error: "데이터 처리 중 오류 발생" });
    }
}
