import './globals.css'
import './styles/figma/tokens.css'
import './styles/figma/fonts.css'
import './styles/figma/figma.css'
import { DM_Sans, Crimson_Text } from "next/font/google"

const dmSans = DM_Sans({ 
  subsets: ["latin"], 
  display: "swap", 
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"]
});
const crimson = Crimson_Text({ 
  subsets: ["latin"], 
  display: "swap", 
  variable: "--font-display",
  weight: ["400", "600", "700"]
});

export const metadata = {
  title: 'Lint Dashboard',
  description: 'Customer feedback analytics dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${crimson.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
