'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Sparkles,
  Heart,
  TrendingUp,
  Moon,
  Clock,
  ChevronDown,
  ChevronUp,
  Star,
  MessageSquare,
  Award,
  Zap
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function Home() {
  const [quantity, setQuantity] = useState(1);
  const basePrice = 1499; // ₹1499 base product price

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      q: "சர்வமங்கல ரக்ஷை என்றால் என்ன?",
      a: "சர்வமங்கல ரக்ஷை என்பது முருகப்பெருமானுக்கு அர்ப்பணிக்கப்பட்ட வேத மந்திரங்கள், பிரார்த்தனைகள் மற்றும் புனித சடங்குகளால் ஆற்றலூட்டப்பட்ட தெய்வீக கவசம். இது எதிர்மறை சக்திகளிலிருந்து பாதுகாத்து, நேர்மறை சக்தி, செழிப்பு, நம்பிக்கை மற்றும் மன அமைதியை கொண்டு வருகிறது.",
    },
    {
      q: "புனித ரக்ஷை எவ்வாறு ஆற்றலூட்டப்படுகிறது?",
      a: "ஒவ்வொரு புனித ரக்ஷையும் சாஸ்திர விதிகளின்படி பக்தியுள்ள அர்ச்சகர்களால் பாரம்பரிய பிராண பிரதிஷ்டை செய்யப்படுகிறது. முருகன் வேல் வழிபாடு மற்றும் கந்த சஷ்டி கவசம் உள்ளிட்ட சிறப்பு பிரார்த்தனைகள் மூலம் தெய்வீக பாதுகாப்பு சக்தி ஊட்டப்படுகிறது.",
    },
    {
      q: "ஜோதிட அட்டையில் என்ன இருக்கும்?",
      a: "ஒவ்வொரு ஆர்டரிலும் வாடிக்கையாளரின் பிறப்பு விவரங்களிலிருந்து தயாரிக்கப்பட்ட ஒரு இலவச தனிப்பட்ட ஜோதிட அட்டை இணைக்கப்படுகிறது. இந்த அட்டையில் உங்கள் ராசி பகுப்பாய்வு, பிறந்த நட்சத்திரம், தனிப்பட்ட ஆன்மீக வழிகாட்டுதல், சுப தகவல்கள் மற்றும் வாழ்க்கையில் தடைகளை நீக்க பரிந்துரைக்கப்பட்ட பிரார்த்தனைகள் அடங்கும்.",
    },
    {
      q: "என் குடும்பத்தினருக்கும் ஜோதிட அட்டை வாங்கலாமா?",
      a: "ஆம்! ஒவ்வொரு ஆர்டரிலும் உங்களுக்கு ஒரு இலவச ஜோதிட அட்டை வழங்கப்படுகிறது. மேலும் checkout-ல் உங்கள் குடும்பத்தினர் அல்லது அன்பானவர்களுக்கு 5 கூடுதல் தனிப்பட்ட அட்டைகள் வரை ₹500 மட்டுமே சேர்க்கலாம்.",
    },
    {
      q: "என்ன கட்டண முறைகள் உள்ளன?",
      a: "நாங்கள் இரண்டு கட்டண முறைகளை வழங்குகிறோம்: (1) Razorpay மூலம் ₹1499 முழு ஆன்லைன் கட்டணம் (கிரெடிட்/டெபிட் கார்டு, UPI, நெட் பேங்கிங், வாலட்). (2) கேஷ் ஆன் டெலிவரி (COD) — ஆன்லைனில் ₹300 முன்பணம் செலுத்தி, மீதி ₹1499 டெலிவரி சமயம் வழங்கலாம். COD மொத்தம் ₹1,299.",
    },
    {
      q: "எங்கெல்லாம் டெலிவரி கிடைக்கும், எவ்வளவு நேரம் ஆகும்?",
      a: "இந்தியா முழுவதும் டெலிவரி செய்கிறோம். உங்கள் இருப்பிடத்தைப் பொறுத்து பொதுவாக 5-7 வணிக நாட்களில் டெலிவரி கிடைக்கும். ஆர்டர் அனுப்பப்பட்டதும் tracking விவரங்கள் மின்னஞ்சல் மூலம் அனுப்பப்படும்.",
    }
  ];

  const benefits = [
    { icon: <ShieldCheck className="w-6 h-6 text-gold-accent" />, title: "தெய்வீக பாதுகாப்பு", desc: "எதிர்மறை சக்திகள் மற்றும் திருஷ்டியிலிருந்து பாதுகாக்கும் வலிமையான கவசம்." },
    { icon: <Sparkles className="w-6 h-6 text-gold-accent" />, title: "நேர்மறை சக்தி", desc: "நேர்மறை அதிர்வுகளை ஈர்த்து, மன குழப்பத்தை நீக்கி தெளிவை தருகிறது." },
    { icon: <Zap className="w-6 h-6 text-gold-accent" />, title: "முருகனின் ஆசிகள்", desc: "தைரியம் அளிக்கும் முருகப்பெருமானுக்கு அர்ப்பணிக்கப்பட்ட பிரார்த்தனைகளால் நிறைந்தது." },
    { icon: <TrendingUp className="w-6 h-6 text-gold-accent" />, title: "செழிப்பு & வளர்ச்சி", desc: "புதிய ஆன்மீக மற்றும் பொருளாதார வழிகளை திறக்க உங்கள் சக்தி களங்களை சீரமைக்கிறது." },
    { icon: <Heart className="w-6 h-6 text-gold-accent" />, title: "மன அமைதி", desc: "நரம்பு மண்டலத்தை அமைதிப்படுத்தி, ஆழமான உள்ளார்ந்த நம்பிக்கையையும் அமைதியினையும் ஏற்படுத்துகிறது." },
    { icon: <Award className="w-6 h-6 text-gold-accent" />, title: "உண்மையான சடங்குகள்", desc: "பாரம்பரிய ஹோமம் கோயில் தரங்களைப் பயன்படுத்தி தனித்தனியாக ஆற்றலூட்டப்பட்டது." },
  ];

  const testimonials = [
    {
      name: "செந்தில் குமார்",
      location: "சென்னை, தமிழ்நாடு",
      rating: 5,
      text: "சர்வமங்கல ரக்ஷையை பயன்படுத்த தொடங்கியதிலிருந்து மன அமைதியும் தைரியமும் கிடைத்தது.ஜோதிட அட்டை மிகவும் துல்லியமாக இருந்தது, என் தினசரி பூஜையை சரிவரச் செய்ய உதவியது. மனமாரப் பரிந்துரைக்கிறேன்!",
    },
    {
      name: "பிரியா நாயர்",
      location: "கொச்சி, கேரளா",
      rating: 5,
      text: "பேக்கேஜிங் மிகவும் அழகாகவும் உயர்தரமாகவும் உள்ளது. என் பெற்றோருக்கு கூடுதல் அட்டைகள் வாங்கினேன், வழிகாட்டுதல் மிகவும் பயனுள்ளதாக இருந்தது. புனித ரக்ஷை உண்மையிலேயே நேர்மறை சக்தியை கொண்டு வருகிறது.",
    },
    {
      name: "ரமேஷ் சர்மா",
      location: "பெங்களூரு, கர்நாடகா",
      rating: 5,
      text: "முதலில் சந்தேகமாக இருந்தேன், ஆனால் புனித ரக்ஷையின் தரமும் என் நட்சத்திர பகுப்பாய்வும் என்னை முழுமையாக நம்பிக்கையாளனாக்கியது. கோயிலிலிருந்து நேரடியாக ஆசீர்வாதம் பெற்றது போல் உணர்ந்தேன்.",
    }
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': 'Sarvamanghala Rakshai — Homam Sacred Ritual Herbal Product',
    'image': 'https://sarvamanghalarakshai.com/rakshai-product.png',
    'description': 'Sacred Homam ritual herbal product (divine protection product) blessed through special Lord Murugan prayers and rituals. Includes one free personalized Astro Card based on birth details.',
    'sku': 'SMR-001',
    'offers': {
      '@type': 'Offer',
      'url': 'https://sarvamanghalarakshai.com',
      'priceCurrency': 'INR',
      'price': '999',
      'availability': 'https://schema.org/InStock',
      'priceValidUntil': '2027-12-31'
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-charcoal-dark font-sans-outfit">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-maroon-dark text-white overflow-hidden py-20 lg:py-32 border-b border-gold-accent/40">
        {/* Sacred BG Motif overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--maroon-light)_0%,_transparent_70%)] opacity-35" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(128,0,32,0.6)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(128,0,32,0.6)_1px,_transparent_1px)] bg-[size:32px_32px] opacity-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-accent/15 border border-gold-accent/40 text-gold-accent text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 animate-pulse-slow" />
              புனித ஹோமம்
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif-cinzel leading-tight tracking-wide text-white">
              முருகன் அருளால் எதிரிகளை வென்று வெற்றி பெறலாம் <span className="text-gold-accent">Sarvamanghala Rakshai</span>
            </h1>

            <p className="text-lg text-gray-200 font-light max-w-xl mx-auto lg:mx-0 leading-relaxed">
              முருகனின் அருளை உங்கள் வாழ்வில் பெற்றிடுங்கள். பாரம்பரிய முறைப்படி ஹோமம் செய்யப்பட்டு, திவ்ய சக்தி நிறைந்த இந்த ரக்க்ஷய் மற்றும் உங்கள் ஜன்ம நட்சத்திரத்திற்கு ஏற்றவாறு கணக்கிடப்பட்ட இலவச தனிப்பட்ட அஸ்ட்ரோ கார்டு (Astro Card) மூலம் நற்பலன்களை அடையுங்கள்.
            </p>

            {/* Ratings Summary */}
            <div className="flex items-center justify-center lg:justify-start gap-1 text-gold-accent py-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
              <span className="text-sm text-gray-300 ml-2 font-medium">(4.9/5 from 1,200+ devotees)</span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <Link
                href="/checkout"
                className="px-8 py-4 bg-gold-accent hover:bg-gold-light text-deep-maroon font-bold font-serif-cinzel tracking-wider rounded text-center shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:-translate-y-0.5 transition-all duration-300 border border-gold-dark"
              >
                Shop Now • ₹{basePrice}
              </Link>
              <a
                href="#about-section"
                className="px-8 py-4 bg-transparent hover:bg-white/10 text-white font-semibold rounded text-center border border-white/40 transition-all duration-300"
              >
                Learn More
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/15 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <p className="text-xl font-bold font-serif-cinzel text-gold-accent">100%</p>
                <p className="text-xs text-gray-400">Prana Pratishta Energized</p>
              </div>
              <div className="text-center lg:text-left border-x border-white/15 px-4">
                <p className="text-xl font-bold font-serif-cinzel text-gold-accent">Free</p>
                <p className="text-xs text-gray-400">Personalized Astro Card</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-xl font-bold font-serif-cinzel text-gold-accent">India</p>
                <p className="text-xs text-gray-400">Free Shipping Nationwide</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Image / Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center relative"
          >
            <div className="relative w-full max-w-[480px] aspect-square rounded-2xl overflow-hidden border-2 border-gold-accent shadow-[0_15px_40px_rgba(0,0,0,0.6)] group">
              <Image
                src="/rakshai-product.png"
                alt="Sarvamanghala Rakshai Homam Sacred Ritual Herbal Product"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Highlight badge overlay */}
              <div className="absolute top-4 right-4 bg-saffron-orange text-white text-xs font-bold uppercase tracking-wider py-1.5 px-3 rounded shadow-lg">
                Lord Murugan Blessings
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Arupadai Veedu Section */}
      <section id="arupadai-veedu" className="py-20 bg-sand-bg border-b border-gold-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-cinzel text-deep-maroon text-center">
            ஆறுபடை வீடு
          </h2>
          <p className="text-center mt-4 text-gray-600 max-w-2xl mx-auto">
            Our Rakshai paste is energized through Homam rituals invoking blessings from all six sacred abodes of Lord Murugan.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {/* Card 1 */}
            <div className="bg-white p-4 rounded-xl border border-gold-accent/20 shadow-sm hover:shadow-md transition-shadow text-center">
              <Image src="/temples/thiruchendur.png" alt="Thiruchendur Shanmugar" width={300} height={300} className="rounded-lg shadow-md mx-auto hover:scale-105 transition-transform" unoptimized />
              <p className="mt-2 font-bold text-gold-accent font-serif-cinzel">Thiruchendur Shanmugar</p>
            </div>
            {/* Card 2 */}
            <div className="bg-white p-4 rounded-xl border border-gold-accent/20 shadow-sm hover:shadow-md transition-shadow text-center">
              <Image src="/temples/thiruparankundram.png" alt="Thiruparankundram Murugan" width={300} height={300} className="rounded-lg shadow-md mx-auto hover:scale-105 transition-transform" unoptimized />
              <p className="mt-2 font-bold text-gold-accent font-serif-cinzel">Thiruparankundram Murugan</p>
            </div>
            {/* Card 3 */}
            <div className="bg-white p-4 rounded-xl border border-gold-accent/20 shadow-sm hover:shadow-md transition-shadow text-center">
              <Image src="/temples/pazhamudircholai.png" alt="Pazhamudircholai Murugan" width={300} height={300} className="rounded-lg shadow-md mx-auto hover:scale-105 transition-transform" unoptimized />
              <p className="mt-2 font-bold text-gold-accent font-serif-cinzel">Pazhamudircholai Murugan</p>
            </div>
            {/* Card 4 */}
            <div className="bg-white p-4 rounded-xl border border-gold-accent/20 shadow-sm hover:shadow-md transition-shadow text-center">
              <Image src="/temples/palani.png" alt="Palani Aandavar" width={300} height={300} className="rounded-lg shadow-md mx-auto hover:scale-105 transition-transform" unoptimized />
              <p className="mt-2 font-bold text-gold-accent font-serif-cinzel">Palani Aandavar</p>
            </div>
            {/* Card 5 */}
            <div className="bg-white p-4 rounded-xl border border-gold-accent/20 shadow-sm hover:shadow-md transition-shadow text-center">
              <Image src="/temples/thiruthani.png" alt="Thiruthani Murugan" width={300} height={300} className="rounded-lg shadow-md mx-auto hover:scale-105 transition-transform" unoptimized />
              <p className="mt-2 font-bold text-gold-accent font-serif-cinzel">Thiruthani Murugan</p>
            </div>
            {/* Card 6 */}
            <div className="bg-white p-4 rounded-xl border border-gold-accent/20 shadow-sm hover:shadow-md transition-shadow text-center">
              <Image src="/temples/swamimalai.png" alt="Swamimalai Murugan" width={300} height={300} className="rounded-lg shadow-md mx-auto hover:scale-105 transition-transform" unoptimized />
              <p className="mt-2 font-bold text-gold-accent font-serif-cinzel">Swamimalai Murugan</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about-section" className="py-20 bg-sand-bg border-b border-gold-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold font-serif-cinzel text-deep-maroon">
              மனம், உடல், ஆன்மாவிற்கு ஆற்றல் மிகுந்த பாதுகாப்பு
            </h2>
            <p className="text-gray-600 leading-relaxed font-light">
              சர்வமங்கல ரக்ஷை ஒரு புனித ரக்க்ஷய்  — தெய்வீக பாதுகாப்பின் ஊடகம். தமிழ்நாட்டின் பாரம்பரிய முருகன் கோயில்களில் தனித்தனியாக ஆசீர்வதிக்கப்பட்டு, வேல் (ஆன்மீக ஈட்டி) தெய்வீக சக்தியை கொண்டு செல்ல குறிப்பிட்ட பாதுகாப்பு ஸ்தோத்திரங்கள் மற்றும் பிரார்த்தனைகளால் ஆற்றலூட்டப்பட்டது.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((b, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-xl border border-gold-accent/20 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="p-3 bg-deep-maroon rounded-lg w-fit mb-5 shadow-sm">
                  {b.icon}
                </div>
                <h3 className="font-serif-cinzel font-bold text-lg text-deep-maroon mb-2">{b.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Astro Card Explainer Section */}
      <section className="py-20 bg-white border-b border-gold-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Card Mockup */}
          <div className="order-2 lg:order-1 flex justify-center">
            <div className="relative w-full max-w-[440px] aspect-[5/7] rounded-xl overflow-hidden border border-gold-accent shadow-xl">
              <Image
                src="/astro-card-mockup.png"
                alt="Personalized Vedic Astro Card Mockup"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-saffron-orange/10 border border-saffron-orange/30 text-saffron-orange text-xs font-bold uppercase rounded-full">
              <Moon className="w-3.5 h-3.5" />
              ஒவ்வொரு ஆர்டரிலும் இலவசமாக!
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-serif-cinzel text-deep-maroon">
              உங்களுக்கென தனிப்பட்ட ஜோதிட அட்டை
            </h2>

            <p className="text-gray-600 font-light leading-relaxed">
              ஒவ்வொரு சர்வமங்கல ரக்ஷை ஆர்டரிலும் உங்கள் பிறந்த நேரம், தேதி, இடம் ஆகியவற்றின் அடிப்படையில் வேத நிபுணர்களால் தனிப்பட்ட முறையில் தயாரிக்கப்பட்ட **முற்றிலும் இலவச ஜோதிட அட்டை** இணைக்கப்படுகிறது!
            </p>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="mt-1 flex items-center justify-center w-5 h-5 rounded-full bg-gold-accent/20 text-gold-dark font-bold text-xs shrink-0">✓</div>
                <div>
                  <h4 className="font-serif-cinzel font-bold text-sm text-charcoal-dark">ராசி & நட்சத்திர பலன் பகுப்பாய்வு</h4>
                  <p className="text-xs text-gray-500">உங்கள் பிறந்த நட்சத்திரம் மற்றும் ஆளும் கிரகங்களின் ஆழமான உண்மைகளை அறியுங்கள்.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-1 flex items-center justify-center w-5 h-5 rounded-full bg-gold-accent/20 text-gold-dark font-bold text-xs shrink-0">✓</div>
                <div>
                  <h4 className="font-serif-cinzel font-bold text-sm text-charcoal-dark">தனிப்பட்ட வழிகாட்டுதல்</h4>
                  <p className="text-xs text-gray-500">கிரக தோஷங்களை நீக்கி வெற்றியை ஈர்க்கும் முக்கிய ஆலோசனைகள்.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-1 flex items-center justify-center w-5 h-5 rounded-full bg-gold-accent/20 text-gold-dark font-bold text-xs shrink-0">✓</div>
                <div>
                  <h4 className="font-serif-cinzel font-bold text-sm text-charcoal-dark">ஆன்மீக பரிந்துரைகள்</h4>
                  <p className="text-xs text-gray-500">அதிர்ஷ்டத்தை அதிகரிக்க உரிய பிரார்த்தனைகள், வண்ணங்கள் மற்றும் திசைகள்.</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-sand-bg border-l-4 border-gold-accent rounded text-sm text-gray-700">
              <span className="font-semibold text-deep-maroon">குடும்ப பாதுகாப்பு:</span> உங்கள் முழு குடும்பத்தையும் பாதுகாக்க விரும்புகிறீர்களா? checkout-ல் குடும்ப உறுப்பினர்களுக்கு கூடுதல் ஜோதிட அட்டைகளை வெறும் **₹500 மட்டுமே** சேர்க்கலாம்!
            </div>
          </div>
        </div>
      </section>

      {/* Product Purchase Section */}
      <section className="py-20 bg-sand-bg border-b border-gold-accent/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border-2 border-gold-accent overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-2">

            {/* Gallery/Display */}
            <div className="relative min-h-[300px] md:min-h-full">
              <Image
                src="/rakshai-product.png"
                alt="Blessed Sarvamanghala Rakshai Homam Herbal Product"
                fill
                className="object-cover"
              />
            </div>

            {/* Config & Checkout CTA */}
            <div className="p-8 flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-2xl font-bold font-serif-cinzel text-deep-maroon">
                  Sarvamanghala Rakshai Package
                </h3>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mt-1">
                  1 புனித ரக்ஷை + 1 இலவச ஜோதிட அட்டை
                </p>

                <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                  முருகப்பெருமான் திருவடியில் ஆற்றலூட்டப்பட்ட புனித ரக்ஷையால் தெய்வீக பாதுகாப்பு பெறுங்கள். வாழ்க்கையில் தடைகளை நீக்கி, மன அழுத்தத்தை குறைத்து, உடல் மற்றும் ஆன்மீக பாதுகாப்பை உறுதிப்படுத்துங்கள்!
                </p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-serif-cinzel text-deep-maroon">₹{basePrice * quantity}</span>
                  <span className="text-xs text-gray-400 line-through">₹{1999 * quantity}</span>
                  <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">SAVE 50%</span>
                </div>

                <p className="text-xs text-gray-400 mt-1">GST உட்பட. இந்தியா முழுவதும் இலவச டெலிவரி.</p>

                {/* Payment options badge */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-xs bg-green-50 text-green-700 font-semibold px-2.5 py-1 rounded border border-green-200">
                    💳 Online: ₹1499
                  </span>
                  <span className="text-xs bg-orange-50 text-orange-700 font-semibold px-2.5 py-1 rounded border border-orange-200">
                    🚚 COD: ₹1,299 (₹300 advance)
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-charcoal-dark">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 font-bold text-gray-600 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-sm font-bold w-12 text-center bg-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 font-bold text-gray-600 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Order Button */}
              <Link
                href={{
                  pathname: '/checkout',
                  query: { qty: quantity }
                }}
                className="w-full py-4 bg-gold-accent hover:bg-gold-light text-deep-maroon text-center font-bold font-serif-cinzel tracking-wider rounded border border-gold-dark shadow-md hover:shadow-lg transition-all duration-300"
              >
                Proceed to Checkout
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white border-b border-gold-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold font-serif-cinzel text-deep-maroon">பக்தர்களின் அனுபவங்கள்</h2>
            <p className="text-gray-500 text-sm mt-2 font-light">முருகனின் புனித ரக்ஷை இந்தியா முழுவதும் எண்ணற்ற குடும்பங்களில் அமைதியும் செழிப்பும் கொண்டு வந்துள்ளது — இதோ அவர்களின் அனுபவங்கள்.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-sand-bg border border-gold-accent/15 p-6 rounded-xl relative shadow-sm hover:shadow-md transition-shadow">
                <div className="flex text-gold-accent gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">&quot;{t.text}&quot;</p>
                <div>
                  <h4 className="font-bold text-sm text-charcoal-dark">{t.name}</h4>
                  <p className="text-xs text-gray-400">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 bg-sand-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-serif-cinzel text-deep-maroon">அடிக்கடி கேட்கப்படும் கேள்விகள்</h2>
            <p className="text-gray-500 text-sm mt-2">ஆற்றலூட்டல், பயன்பாடு மற்றும் ஆர்டர்கள் பற்றிய கேள்விகளுக்கு இங்கே பதில்கள் காணுங்கள்.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg border border-gold-accent/20 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4 flex justify-between items-center text-left font-serif-cinzel font-bold text-sm sm:text-base text-deep-maroon hover:bg-gold-accent/5 transition-colors focus:outline-none"
                >
                  <span>{faq.q}</span>
                  {openFaqIndex === idx ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>

                {openFaqIndex === idx && (
                  <div className="px-6 pb-5 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhatsAppButton />
      <Footer />
    </div>
  );
}
