<<<<<<< HEAD
# Lint Dashboard

A modern customer feedback analytics dashboard built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern UI**: Built with Radix UI components and Tailwind CSS
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Works on desktop and mobile devices
- **Authentication**: Sign in/Sign up flows with Supabase
- **Dashboard Analytics**: Customer insights and reports
- **Vercel Ready**: Optimized for deployment on Vercel

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Database**: Supabase
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd lint-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy with Vercel**
   ```bash
   npx vercel --prod
   ```

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Main page
│   └── components/          # React components
│       ├── auth/            # Authentication components
│       ├── dashboard/       # Dashboard components
│       ├── layout/          # Layout components
│       └── ui/              # UI components
├── styles/                  # Additional styles
├── utils/                   # Utility functions
└── supabase/               # Supabase functions (serverless)
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Tailwind CSS

The project uses Tailwind CSS with custom design tokens. Configuration is in `tailwind.config.js`.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Customization

### Colors and Design Tokens

The project uses a custom color palette defined in `styles/globals.css`. You can modify these to match your brand.

### Components

All UI components are in `components/ui/` and can be customized as needed.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
