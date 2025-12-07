# 🎬 Cinematic Scroll Portfolio

Portfolio website modern dengan efek scroll cinematic yang terinspirasi dari Apple, dibangun menggunakan Next.js 16 dan Framer Motion.

## ✨ Fitur Utama

- **Cinematic Scroll Effects** - Animasi parallax dan blur yang smooth saat scroll
- **Image Sequence Animation** - Efek frame-by-frame berbasis canvas seperti Apple
- **Typing Animation** - Efek mengetik pada hero section
- **Floating Particles** - Partikel animasi yang mengambang
- **Glass Morphism UI** - Desain modern dengan efek kaca
- **Horizontal Scroll Bridge** - Transisi horizontal yang unik
- **Fully Responsive** - Tampilan optimal di semua perangkat
- **Smooth Navigation** - Navigasi dengan scroll halus

## 🛠️ Tech Stack

| Teknologi     | Versi  |
| ------------- | ------ |
| Next.js       | 16.0.7 |
| React         | 19.2.0 |
| Framer Motion | 12.x   |
| Tailwind CSS  | 4.x    |
| TypeScript    | 5.x    |
| Radix UI      | Latest |
| Lucide Icons  | Latest |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm / bun

### Installation

```bash
# Clone repository
git clone <repository-url>
cd cinematic-scroll-portfolio

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Build Production

```bash
npm run build
npm start
```

## 📁 Struktur Proyek

```
cinematic-scroll-portfolio/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Halaman utama
│   └── globals.css         # Global styles
├── components/
│   ├── Navigation.tsx      # Navigasi
│   ├── HeroSection.tsx     # Hero dengan image sequence
│   ├── TransitionSection.tsx
│   ├── AboutSection.tsx    # Tentang saya
│   ├── HorizontalScrollBridge.tsx
│   ├── ExperienceSection.tsx # Pengalaman kerja
│   ├── CoolingSection.tsx
│   ├── ContactSection.tsx  # Form kontak
│   ├── ImageSequenceCanvas.tsx # Canvas animation
│   └── ui/                 # UI components
├── hooks/
│   └── use-toast.ts        # Toast notification hook
├── lib/
│   └── utils.ts            # Utility functions
└── public/                 # Static assets
```

## 🎨 Kustomisasi

### Mengubah Informasi Personal

Edit `components/HeroSection.tsx` untuk mengubah nama dan title:

```tsx
const fullText = "Your Title Here";
// ...
<span className="text-gradient">Your Name</span>;
```

### Mengubah Image Sequence

Ganti URL di `ImageSequenceCanvas` component dengan URL gambar sequence Anda sendiri.

### Mengubah Warna Tema

Edit variabel CSS di `app/globals.css` untuk menyesuaikan color scheme.

## 📝 Scripts

| Command         | Deskripsi                   |
| --------------- | --------------------------- |
| `npm run dev`   | Jalankan development server |
| `npm run build` | Build untuk production      |
| `npm start`     | Jalankan production server  |
| `npm run lint`  | Jalankan ESLint             |

## 👤 Author

**Vicky Mosafan**  
Fullstack Developer

## 📄 License

MIT License - Silakan gunakan dan modifikasi sesuai kebutuhan.

---

⭐ Jika proyek ini membantu, berikan star di repository!
