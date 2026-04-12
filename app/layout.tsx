import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Busan Vibe - 부산 테마 여행',
  description: '위치 기반 부산 테마 여행 정보 서비스',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
