import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'Kr';
  const serviceKey = process.env.SERVICE_KEY; // Vercel에서 설정할 변수

  // 문서에 명시된 기본 URL 구성 
  const url = `http://apis.data.go.kr/6260000/RecommendedService/getRecommended${lang}?serviceKey=${serviceKey}&numOfRows=100&pageNo=1&resultType=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: '데이터 로딩 실패' }, { status: 500 });
  }
}
