import "./globals.css";

export const metadata = {
  title: "일본어 첫걸음",
  description: "히라가나와 가타카나부터 회화 놀이까지 따라가는 일본어 학습 앱",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
