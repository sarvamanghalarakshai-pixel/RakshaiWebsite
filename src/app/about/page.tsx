import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Sparkles, Shield, Heart, Anchor } from 'lucide-react';

export default function About() {
  const steps = [
    {
      title: "1. புனித பொருட்கள் தயாரிப்பு",
      desc: "உயர்தர புனித ரக்க்ஷய் மற்றும் இயற்கை பொருட்களை தேர்ந்தெடுக்கிறோம். இவை தூய தெய்வீக அதிர்வுகளை கொண்டு சாத்விக ஆன்மீக அடித்தளத்தை பிரதிநிதித்துவப்படுத்துகின்றன."
    },
    {
      title: "2. கோயில் சுத்திகரணம்",
      desc: "பொருட்கள் கோயில் வளாகத்திற்கு கொண்டு வரப்பட்டு சுத்திகரிக்கப்பட்டு திருவிளக்கு அருகில் வைக்கப்படுகின்றன. பாரம்பரிய அர்ச்சகர்களால் சிறப்பு சுத்திகரண சடங்குகள் நடத்தப்படுகின்றன."
    },
    {
      title: "3. பிராண பிரதிஷ்டை (சடங்கு ஆற்றலூட்டல்)",
      desc: "சுப நேரங்களில் அர்ச்சகர்கள் கந்த சஷ்டி கவசம், சுப்ரமண்ய புஜங்கம் மற்றும் புனித ஸ்தோத்திரங்களை ஓதுகின்றனர். தெய்வீக சக்தி புனித ரக்ஷையில் பிரவேசிப்பதாக தியானிக்கப்படுகிறது."
    },
    {
      title: "4. முருகனின் வேலில் அர்ப்பணம்",
      desc: "ரக்ஷைகள் முருகப்பெருமானின் வேல் திருவடியில் வைக்கப்படுகின்றன. ஒவ்வொரு ரக்ஷையும் ஞானம், வெற்றி மற்றும் பாதுகாப்பு சக்தியை உள்வாங்குகிறது."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-charcoal-dark font-sans-outfit">
      <Navbar />

      {/* Banner */}
      <section className="bg-maroon-dark text-white py-16 text-center border-b border-gold-accent/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--maroon-light)_0%,_transparent_75%)] opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-3">
          <h1 className="text-3xl sm:text-5xl font-bold font-serif-cinzel tracking-wider text-gold-accent">
            எங்கள் ஆன்மீக வேர்கள்
          </h1>
          <p className="text-sm sm:text-base text-gray-300 font-light max-w-2xl mx-auto">
            சர்வமங்கல ரக்ஷையின் பின்னால் உள்ள தொன்மையான சடங்குகள், ஆழமான பக்தி மற்றும் ஆன்மீக சக்தியை அறியுங்கள்.
          </p>
        </div>
      </section>

      {/* Body Content */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-cinzel text-deep-maroon">
              முருகப்பெருமானின் ஆசியால்
            </h2>
            <p className="text-gray-600 leading-relaxed font-light text-sm sm:text-base">
              முருகப்பெருமானின் புராணம் உயர்ந்த தைரியம், முழுமையான ஞானம், மற்றும் தீய சக்திகளின் (சுரப்பட்மன் என்ற பேயின்) மீது வெற்றியைக் குறிக்கிறது. அவரது வேல், அல்லது புனித வாள், பாதுகாப்பின் இறுதி கருவியாகும்.
            </p>
            <p className="text-gray-600 leading-relaxed font-light text-sm sm:text-base">
              இந்த தெய்வீக பாதுகாப்பு சக்தியுடன் உங்களை இணைக்க சர்வமங்கல ரக்ஷையை உருவாக்கினோம். இந்த புனித திலகத்தை அணிவது உங்கள் உள்ளார்ந்த வலிமை, மன தெளிவு மற்றும் சுற்றி இருக்கும் ஆசீர்வாத கவசத்தை நினைவூட்டும்.
            </p>
          </div>
          
          <div className="relative aspect-square w-full max-w-[400px] mx-auto rounded-2xl overflow-hidden border border-gold-accent shadow-lg">
            <Image
              src="/rakshai-product.png"
              alt="Murugan Prayer Altar and Blessed Sacred Paste"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Energization Flow */}
        <div className="space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-cinzel text-deep-maroon">
              ஆற்றலூட்டல் செயல்முறை
            </h2>
            <p className="text-sm text-gray-500 font-light">
              ஒவ்வொரு ரக்ஷையும் அனுப்பப்படுவதற்கு முன் நான்கு நிலை புனிதப்படுத்தல் சடங்கிற்கு உட்படுத்தப்படுகிறது.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-sand-bg border border-gold-accent/10 p-6 rounded-lg space-y-2">
                <h4 className="font-serif-cinzel font-bold text-base text-deep-maroon">{step.title}</h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="p-8 bg-maroon-dark text-white rounded-xl border border-gold-accent text-center space-y-6 max-w-3xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-deep-maroon via-maroon-light to-deep-maroon opacity-40" />
          <div className="relative z-10 space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold font-serif-cinzel text-gold-accent">
              உங்கள் குடும்பத்திற்கு தெய்வீக பாதுகாப்பை கொண்டு வாருங்கள்
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 font-light max-w-lg mx-auto">
              உண்மையான வழிபாட்டால் ஆற்றலூட்டப்பட்ட புனித திலகத்தை அணிவதன் அனுபவத்தை உணருங்கள். தனிப்பட்ட ஜோதிட வழிகாட்டல் அறிக்கையுடன் உங்களுக்கானதை பெறுங்கள்.
            </p>
            <div className="pt-2">
              <Link
                href="/checkout"
                className="inline-block px-8 py-3.5 bg-gold-accent hover:bg-gold-light text-deep-maroon font-bold font-serif-cinzel text-sm tracking-wider rounded border border-gold-dark shadow-md hover:-translate-y-0.5 transition-all"
              >
                உங்கள் புனித ரக்ஷையை பெறுங்கள்
              </Link>
            </div>
          </div>
        </div>

      </section>

      <WhatsAppButton />
      <Footer />
    </div>
  );
}
