import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { FileText, Compass, Star, Sunset, Sparkles } from 'lucide-react';

export default function AstroCardExplainer() {
  const sections = [
    {
      icon: <Star className="w-5 h-5 text-gold-accent" />,
      title: "1. ராசி & நட்சத்திர பகுப்பாய்வு",
      desc: "வேத ஜோதிடம் 27 நட்சத்திரங்களை கணக்கிடுகிறது. உங்கள் நட்சத்திரம் உங்கள் அடிப்படை குணநலன், மன நாட்டம் மற்றும் முதன்மை சக்தி களங்களை தீர்மானிக்கிறது. உங்கள் பிறந்த தேதி, நேரம் மற்றும் இடம் மூலம் இதை கணக்கிடுகிறோம்."
    },
    {
      icon: <Compass className="w-5 h-5 text-gold-accent" />,
      title: "2. திசை & சுப வழிகாட்டுதல்",
      desc: "உங்கள் தொழில், வசிப்பிடம் மற்றும் பிரார்த்தனைக்கு எந்த திசைகள் சாதகமானவை என்பதை அறியுங்கள். முக்கியமான பணிகளை தொடங்க வாரத்தில் எந்த நாட்கள் சுபமானவை என்பதை தெரிந்துகொள்ளுங்கள்."
    },
    {
      icon: <Sunset className="w-5 h-5 text-gold-accent" />,
      title: "3. ஆன்மீக பரிகாரங்கள்",
      desc: "கிரக தோஷங்களை நீக்க குறிப்பிட்ட ஆன்மீக பரிகாரங்கள்: பரிந்துரைக்கப்பட்ட மந்திரங்கள், அணிய வேண்டிய வண்ணங்கள், வழிபட வேண்டிய தெய்வங்கள் மற்றும் உங்கள் ஜாதகத்திற்கு ஏற்ற தர்ம செயல்கள்."
    },
    {
      icon: <FileText className="w-5 h-5 text-gold-accent" />,
      title: "4. சுப தகவல்கள்",
      desc: "உங்கள் தற்போதைய ஜோதிட சுழற்சியின் சுருக்கமான பகுப்பாய்வு — முடிவெடுப்பதில் விழிப்புணர்வுடனும் ஆன்மீக நம்பிக்கையுடனும் செயல்பட உதவுகிறது."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-charcoal-dark font-sans-outfit">
      <Navbar />

      {/* Hero Banner */}
      <section className="bg-maroon-dark text-white py-16 text-center border-b border-gold-accent/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--maroon-light)_0%,_transparent_75%)] opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-3">
          <h1 className="text-3xl sm:text-5xl font-bold font-serif-cinzel tracking-wider text-gold-accent">
            தனிப்பட்ட ஜோதிட வழிகாட்டுதல்
          </h1>
          <p className="text-sm sm:text-base text-gray-300 font-light max-w-2xl mx-auto">
            உங்கள் தனிப்பட்ட பிறப்பு விவரங்கள் உங்கள் ஆன்மீக பயணத்திற்கான தனிப்பயன் வழிகாட்டலை தயாரிக்க எவ்வாறு பயன்படுத்தப்படுகின்றன என்பதை அறியுங்கள்.
          </p>
        </div>
      </section>

      {/* Main Info */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Layout details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative w-full max-w-[440px] mx-auto rounded-xl overflow-hidden border border-gold-accent shadow-xl flex items-center justify-center">
            <Image
              src="/astro-card-mockup.png"
              alt="Beautifully crafted personalized Astro Card"
              width={440}
              height={330}
              className="w-full h-auto object-contain"
            />
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-1 bg-gold-accent/15 border border-gold-accent/35 text-gold-accent px-2.5 py-1 rounded-full text-xs font-semibold uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              உங்களுக்காக தனிப்பயனாக்கப்பட்டது
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-cinzel text-deep-maroon">
              ஜோதிட அட்டை என்றால் என்ன?
            </h2>
            
            <p className="text-gray-600 leading-relaxed font-light text-sm sm:text-base">
              வேத ஜோதிடம் கூறுகிறது — நம் பிறப்பு விவரங்கள் தனிப்பட்ட சக்தி வரைபட들을 பிரதிபலிக்கின்றன. சர்வமங்கல ரக்ஷை போன்ற புனித ரக்ஷையை அணியும்போது, உங்கள் கிரக அமைப்புடன் ஆன்மீக செயல்களை சீரமைப்பது அதன் பாதுகாப்பு விளைவுகளை மேலும் அதிகரிக்கிறது.
            </p>
            
            <p className="text-gray-600 leading-relaxed font-light text-sm sm:text-base">
              எங்கள் வேத அறிஞர்கள் உங்கள் பிறப்பு விவரங்களை (தேதி, நேரம், இடம்) ஆய்வு செய்து உங்கள் நட்சத்திரத்தை கணக்கிட்டு, தனிப்பயன் அட்டை தயாரித்து குறிப்பிட்ட வழிகாட்டல் எழுதுகிறார்கள்.
            </p>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-10 pt-4">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-cinzel text-deep-maroon">
              அட்டையில் என்ன இருக்கும்
            </h2>
            <p className="text-sm text-gray-500 font-light mt-1">
              தொன்மையான ஜோதிட ஞானத்தின் நான்கு பிரிவுகள்.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((sec, idx) => (
              <div key={idx} className="flex gap-4 p-6 bg-sand-bg border border-gold-accent/10 rounded-xl">
                <div className="p-3 bg-deep-maroon text-white rounded-lg h-fit">
                  {sec.icon}
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-serif-cinzel font-bold text-sm sm:text-base text-deep-maroon">{sec.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">{sec.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ box for pricing */}
        <div className="bg-sand-bg border-l-4 border-deep-maroon p-6 rounded-r-xl max-w-3xl mx-auto space-y-3 shadow-sm">
          <h4 className="font-serif-cinzel font-bold text-deep-maroon text-base">
            குடும்ப கூடுதல் அட்டைகள்
          </h4>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
            ஒவ்வொரு ஆர்டரிலும் வாங்குபவரின் விவரங்களின் அடிப்படையில் ஒரு (1) இலவச தனிப்பட்ட ஜோதிட அட்டை வழங்கப்படுகிறது. உங்கள் குழந்தைகள், வாழ்க்கைத் துணை அல்லது பெற்றோருக்கு பாதுகாப்பு மற்றும் தனிப்பயன் ஜோதிட அட்டைகள் வேண்டுமெனில் checkout-ல் கூடுதல் அட்டைகளை தேர்வு செய்யலாம்.
          </p>
          <p className="text-xs sm:text-sm text-deep-maroon font-bold">
            கூடுதல் அட்டைகள் தலா ₹500 கட்டணத்தில் தயாரிக்கப்படும் (அதிகபட்சம் 5 அட்டைகள்).
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/checkout"
            className="inline-block px-10 py-4 bg-gold-accent hover:bg-gold-light text-deep-maroon font-bold font-serif-cinzel tracking-wider rounded border border-gold-dark shadow-md hover:shadow-lg transition-all"
          >
            இப்போதே ஆர்டர் செய்து இலவச ஜோதிட அட்டை பெறுங்கள்
          </Link>
        </div>

      </section>

      <WhatsAppButton />
      <Footer />
    </div>
  );
}
