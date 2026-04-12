import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'Kr';
  const serviceKey = process.env.SERVICE_KEY; // Vercel 환경변수에 넣을 키

  // API 명세서에 따른 호출 URL [cite: 21, 23]
  const url = `http://apis.data.go.kr/6260000/RecommendedService/getRecommended${lang}?serviceKey=${serviceKey}&numOfRows=100&pageNo=1&resultType=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: '데이터를 불러오지 못했습니다.' }, { status: 500 });
  }
}
