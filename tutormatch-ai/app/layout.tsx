import "./globals.css";

export const metadata = {
  title: "TutorMatch AI",
  description: "AI-powered tutor matching",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}