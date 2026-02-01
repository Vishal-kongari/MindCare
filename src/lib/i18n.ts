import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            "nav": {
                "chat": "Chat Support",
                "resources": "Resources",
                "book": "Book Session",
                "community": "Community",
                "login": "Log In",
                "signup": "Get Started"
            },
            "hero": {
                "badge": "Trusted by Students",
                "title": "Mental Wellness",
                "titleHigh": "Made Accessible",
                "subtitle": "Break free from stigma and access personalized mental health support. Our AI-powered platform connects you with professional counselors, peer communities, and evidence-based resources designed for student life.",
                "ctaPrimary": "Start Your Journey",
                "ctaSecondary": "Watch Demo",
                "stats": {
                    "anonymous": "100% Anonymous",
                    "anonymousDesc": "Your privacy protected",
                    "support": "24/7 Support",
                    "supportDesc": "Always available",
                    "community": "Peer Community",
                    "communityDesc": "Connect with peers",
                    "satisfaction": "Satisfaction",
                    "counselors": "Expert Counselors",
                    "available": "Available"
                }
            },
            "login": {
                "title": "Log In",
                "subtitle": "Enter your credentials to access your account",
                "email": "Email Address",
                "password": "Password",
                "forgot": "Forgot password?",
                "submit": "Log In",
                "new": "New here?",
                "create": "Create an account",
                "welcome": "Welcome back. Log in to continue your journey."
            },
            "footer": {
                "brand": "MindCare",
                "tagline": "Mental Health Support",
                "desc": "Empowering students with accessible, confidential mental health support. Your wellbeing is our priority.",
                "quick": "Quick Links",
                "support": "Support",
                "contact": "Contact Us",
                "rights": "All rights reserved.",
                "made": "Made with ❤️ for students everywhere."
            },
            "signup": {
                "mainTitle": "Create your account",
                "mainSubtitle": "Choose your role to get a tailored experience",
                "header": "Sign Up",
                "desc": "Select your role and fill in the required details",
                "role_student": "Student",
                "role_counselor": "Counselor",
                "role_campus": "On-Campus",
                "email": "Email Address",
                "password": "Create Password",
                "phone": "Phone Number",
                "institution": "Institution",
                "guardian": "Guardian Name",
                "guardianPhone": "Guardian Phone",
                "hobbies": "Hobbies / Interests",
                "course": "Currently Pursuing",
                "fullname": "Full Name",
                "brief": "Brief Information",
                "btn_student": "Create Student Account",
                "btn_counselor": "Create Counselor Account",
                "btn_campus": "Create On-Campus Account",
                "login_prompt": "Already have an account?",
                "login_link": "Log in"
            },
            "features": {
                "ai_chat": { "title": "AI Chat Support", "desc": "Get instant, personalized coping strategies for anxiety, stress, and burnout with our AI-powered mental health assistant.", "action": "Start Chatting" },
                "booking": { "title": "Confidential Booking", "desc": "Book anonymous sessions with on-campus counsellors or verified helplines through our secure platform.", "action": "Book Session" },
                "resources": { "title": "Resource Library", "desc": "Access curated videos, articles, and guides on academic stress, mindfulness, and mental wellness.", "action": "Explore Resources" },
                "community": { "title": "Peer Community", "desc": "Connect with fellow students in a safe, moderated environment with trained volunteer support.", "action": "Join Community" },
                "crisis": { "title": "Crisis Detection", "desc": "Our advanced system identifies crisis situations and immediately connects you with professional help.", "action": "Learn More" },
                "live": { "title": "Live Sessions", "desc": "Attend weekend webinars and live sessions with licensed psychologists and wellness experts.", "action": "View Schedule" },
                "gamification": { "title": "Wellness Gamification", "desc": "Earn points and badges for self-care activities, journaling, and helping peers in the community.", "action": "Start Journey" },
                "tools": { "title": "Stress Relief Tools", "desc": "Personalized recommendations for hobbies, relaxation techniques, and activities based on your needs.", "action": "Get Recommendations" }
            },
            "testimonials": {
                "title": "Stories of Hope",
                "subtitle": "Hear from students who have transformed their mental wellness journey with MindCare.",
                "verified": "Verified Student",
                "t1": { "quote": "The AI chat helped me calm down before my finals. It felt like someone was actually listening.", "name": "Sarah J." },
                "t2": { "quote": "Booking a counselor was so easy and private. I finally got the help I was afraid to ask for.", "name": "Rahul M." },
                "t3": { "quote": "The peer community made me realize I'm not alone in my struggles. Highly recommend!", "name": "Priya K." }
            },
            "dashboard": {
                "student": {
                    "welcome": "Welcome back",
                    "title": "Student Dashboard",
                    "goals": { "title": "Weekly Goals", "mindfulness": "Mindfulness Sessions", "checkins": "Daily Check-ins", "peer": "Peer Support" },
                    "progress": { "title": "Progress", "score": "Wellness Score" },
                    "quick": { "title": "Quick Actions", "chat": "Start AI Chat", "book": "Book Session", "resources": "Browse Resources" },
                    "live": { "title": "Live Sessions", "book": "Book a Live Session", "view": "View Available Counselors" }
                },
                "counselor": {
                    "title": "Counselor Dashboard",
                    "all_bookings": "All Bookings",
                    "active_students": "Active Students",
                    "kpi": "KPIs",
                    "recent_messages": "Recent Messages",
                    "caseload": "Caseload Snapshot",
                    "tasks": "Today’s Tasks"
                }
            }
        }
    },
    hi: {
        translation: {
            "nav": {
                "chat": "चैट सहायता",
                "resources": "संसाधन",
                "book": "सत्र बुक करें",
                "community": "समुदाय",
                "login": "लॉग इन",
                "signup": "शुरू करें"
            },
            "hero": {
                "badge": "छात्रों द्वारा विश्वसनीय",
                "title": "मानसिक कल्याण",
                "titleHigh": "सुलभ बनाया गया",
                "subtitle": "कलंक से मुक्त हों और व्यक्तिगत मानसिक स्वास्थ्य सहायता प्राप्त करें। हमारा एआई-संचालित मंच आपको पेशेवर परामर्शदाताओं, सहकर्मी समुदायों और छात्र जीवन के लिए डिज़ाइन किए गए साक्ष्य-आधारित संसाधनों से जोड़ता है।",
                "ctaPrimary": "अपनी यात्रा शुरू करें",
                "ctaSecondary": "डेमो देखें",
                "stats": {
                    "anonymous": "100% गुमनाम",
                    "anonymousDesc": "आपकी गोपनीयता सुरक्षित",
                    "support": "24/7 सहायता",
                    "supportDesc": "हमेशा उपलब्ध",
                    "community": "सहकर्मी समुदाय",
                    "communityDesc": "साथियों से जुड़ें",
                    "satisfaction": "संतुष्टि",
                    "counselors": "विशेषज्ञ परामर्शदाता",
                    "available": "उपलब्ध"
                }
            },
            "login": {
                "title": "लॉग इन",
                "subtitle": "अपने खाते का उपयोग करने के लिए अपना विवरण दर्ज करें",
                "email": "ईमेल पता",
                "password": "पासवर्ड",
                "forgot": "पासवर्ड भूल गए?",
                "submit": "लॉग इन करें",
                "new": "यहाँ नए हैं?",
                "create": "खाता बनाएं",
                "welcome": "वापसी पर स्वागत है। अपनी यात्रा जारी रखने के लिए लॉग इन करें।"
            },
            "footer": {
                "brand": "माइंडकेयर",
                "tagline": "मानसिक स्वास्थ्य सहायता",
                "desc": "छात्रों को सुलभ, गोपनीय मानसिक स्वास्थ्य सहायता के साथ सशक्त बनाना। आपकी भलाई हमारी प्राथमिकता है।",
                "quick": "त्वरित लिंक",
                "support": "समर्थन",
                "contact": "संपर्क करें",
                "rights": "सर्वाधिकार सुरक्षित।",
                "made": "❤️ के साथ छात्रों के लिए बनाया गया।"
            },
            "signup": {
                "mainTitle": "खाता बनाएं",
                "mainSubtitle": "एक अनुरूप अनुभव प्राप्त करने के लिए अपनी भूमिका चुनें",
                "header": "साइन अप",
                "desc": "अपनी भूमिका चुनें और आवश्यक विवरण भरें",
                "role_student": "छात्र",
                "role_counselor": "परामर्शदाता",
                "role_campus": "परिसर पर",
                "email": "ईमेल पता",
                "password": "पासवर्ड बनाएं",
                "phone": "फ़ोन नंबर",
                "institution": "संस्थान",
                "guardian": "अभिभावक का नाम",
                "guardianPhone": "अभिभावक का फ़ोन",
                "hobbies": "शौक / रुचियां",
                "course": "वर्तमान पाठ्यक्रम",
                "fullname": "पूरा नाम",
                "brief": "संक्षिप्त जानकारी",
                "btn_student": "छात्र खाता बनाएं",
                "btn_counselor": "परामर्शदाता खाता बनाएं",
                "btn_campus": "परिसर खाता बनाएं",
                "login_prompt": "क्या आपके पास पहले से एक खाता मौजूद है?",
                "login_link": "लॉग इन करें"
            },
            "features": {
                "ai_chat": { "title": "एआई चैट सहायता", "desc": "चिंता, तनाव और बर्नआउट के लिए तत्काल, व्यक्तिगत मुकाबला रणनीतियां प्राप्त करें।", "action": "चैट शुरू करें" },
                "booking": { "title": "गोपनीय बुकिंग", "desc": "हमारे सुरक्षित मंच के माध्यम से ऑन-कैंपस परामर्शदाताओं या सत्यापित हेल्पलाइन के साथ गुमनाम सत्र बुक करें।", "action": "सत्र बुक करें" },
                "resources": { "title": "संसाधन पुस्तकालय", "desc": "शैक्षणिक तनाव, माइंडफुलनेस और मानसिक कल्याण पर क्यूरेटेड वीडियो, लेख और गाइड तक पहुंचें।", "action": "संसाधन खोजें" },
                "community": { "title": "सहकर्मी समुदाय", "desc": "प्रशिक्षित स्वयंसेवक सहायता के साथ सुरक्षित, संचालित वातावरण में साथी छात्रों के साथ जुड़ें।", "action": "समुदाय में शामिल हों" },
                "crisis": { "title": "संकट का पता लगाना", "desc": "हमारी उन्नत प्रणाली संकट की स्थितियों की पहचान करती है और आपको तुरंत पेशेवर मदद से जोड़ती है।", "action": "और जानें" },
                "live": { "title": "लाइव सत्र", "desc": "लाइसेंस प्राप्त मनोवैज्ञानिकों और कल्याण विशेषज्ञों के साथ सप्ताहांत वेबिनार और लाइव सत्र में भाग लें।", "action": "अनुसूची देखें" },
                "gamification": { "title": "कल्याण गेमिफिकेशन", "desc": "स्व-देखभाल गतिविधियों, जर्नलिंग और समुदाय में साथियों की मदद करने के लिए अंक और बैज अर्जित करें।", "action": "यात्रा शुरू करें" },
                "tools": { "title": "तनाव राहत उपकरण", "desc": "आपकी आवश्यकताओं के आधार पर शौक, विश्राम तकनीकों और गतिविधियों के लिए व्यक्तिगत सिफारिशें।", "action": "सिफारिशें प्राप्त करें" }
            },
            "testimonials": {
                "title": "आशा की कहानियां",
                "subtitle": "उन छात्रों से सुनें जिन्होंने माइंडकेयर के साथ अपनी मानसिक कल्याण यात्रा को बदला है।",
                "verified": "सत्यापित छात्र",
                "t1": { "quote": "एआई चैट ने मुझे मेरी फाइनल परीक्षाओं से पहले शांत होने में मदद की। ऐसा लगा जैसे कोई वास्तव में सुन रहा है।", "name": "सारा जे." },
                "t2": { "quote": "काउंसलर बुक करना इतना आसान और निजी था। मुझे आखिरकार वह मदद मिली जिसके लिए मैं पूछने से डर रहा था।", "name": "राहुल एम." },
                "t3": { "quote": "सहकर्मी समुदाय ने मुझे महसूस कराया कि मैं अपने संघर्षों में अकेला नहीं हूं। अत्यधिक अनुशंसित!", "name": "प्रिया के." }
            },
            "dashboard": {
                "student": {
                    "welcome": "वापसी पर स्वागत है",
                    "title": "छात्र डैशबोर्ड",
                    "goals": { "title": "साप्ताहिक लक्ष्य", "mindfulness": "माइंडफुलनेस सत्र", "checkins": "दैनिक चेक-इन", "peer": "सहकर्मी सहायता" },
                    "progress": { "title": "प्रगति", "score": "कल्याण स्कोर" },
                    "quick": { "title": "त्वरित कार्रवाई", "chat": "एआई चैट शुरू करें", "book": "सत्र बुक करें", "resources": "संसाधन ब्राउज़ करें" },
                    "live": { "title": "लाइव सत्र", "book": "लाइव सत्र बुक करें", "view": "उपलब्ध परामर्शदाता देखें" }
                },
                "counselor": {
                    "title": "परामर्शदाता डैशबोर्ड",
                    "all_bookings": "सभी बुकिंग",
                    "active_students": "सक्रिय छात्र",
                    "kpi": "KPIs",
                    "recent_messages": "हाल के संदेश",
                    "caseload": "केसलोड स्नैपशॉट",
                    "tasks": "आज के कार्य"
                }
            }
        }
    },
    ta: {
        translation: {
            "nav": {
                "chat": "அரட்டை ஆதரவு",
                "resources": "வளங்கள்",
                "book": "அமர்வு பதிவு",
                "community": "சமூகம்",
                "login": "உள்நுழை",
                "signup": "தொடங்கவும்"
            },
            "hero": {
                "badge": "மாணவர்களால் நம்பப்படுகிறது",
                "title": "மனநலம்",
                "titleHigh": "எளிதில் கிடைக்கிறது",
                "subtitle": "களங்கத்திலிருந்து விடுபட்டு தனிப்பட்ட மனநல ஆதரவைப் பெறுங்கள். எங்களின் AI-இயங்கும் தளம் உங்களை தொழில்முறை ஆலோசகர்கள், சக சமூகங்கள் மற்றும் மாணவர் வாழ்க்கைக்காக வடிவமைக்கப்பட்ட ஆதாரங்களுடன் இணைக்கிறது.",
                "ctaPrimary": "உங்கள் பயணத்தைத் தொடங்குங்கள்",
                "ctaSecondary": "டெமோவைப் பாருங்கள்",
                "stats": {
                    "anonymous": "100% அநாமதேய",
                    "anonymousDesc": "உங்கள் தனியுரிமை பாதுகாக்கப்படுகிறது",
                    "support": "24/7 ஆதரவு",
                    "supportDesc": "எப்போதும் கிடைக்கும்",
                    "community": "சக சமூகம்",
                    "communityDesc": "நண்பர்களுடன் இணையுங்கள்",
                    "satisfaction": "திருப்தி",
                    "counselors": "நிபுணத்துவ ஆலோசகர்கள்",
                    "available": "கிடைக்கும்"
                }
            },
            "login": {
                "title": "உள்நுழை",
                "subtitle": "உங்கள் கணக்கை அணுக உங்கள் நற்சான்றிதழ்களை உள்ளிடவும்",
                "email": "மின்னஞ்சல் முகவரி",
                "password": "கடவுச்சொல்",
                "forgot": "கடவுச்சொல்லை மறந்துவிட்டீர்களா?",
                "submit": "உள்நுழையவும்",
                "new": "புதியவரா?",
                "create": "கணக்கை உருவாக்கவும்",
                "welcome": "மீண்டும் வருக. உங்கள் பயணத்தைத் தொடர உள்நுழையவும்."
            },
            "footer": {
                "brand": "மைண்ட்கேர்",
                "tagline": "மனநல ஆதரவு",
                "desc": "மாணவர்களுக்கு அணுகக்கூடிய, ரகசியமான மனநல ஆதரவை வழங்குதல். உங்கள் நல்வாழ்வே எங்கள் முன்னுரிமை.",
                "quick": "விரைவான இணைப்புகள்",
                "support": "ஆதரவு",
                "contact": "தொடர்பு கொள்ள",
                "rights": "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
                "made": "மாணவர்களுக்காக ❤️ உடன் உருவாக்கப்பட்டது."
            },
            "signup": {
                "mainTitle": "உங்கள் கணக்கை உருவாக்கவும்",
                "mainSubtitle": "தனிப்பயனாக்கப்பட்ட அனுபவத்தைப் பெற உங்கள் பங்கைத் தேர்வுசெய்யவும்",
                "header": "பதிவு செய்யவும்",
                "desc": "உங்கள் பங்கைத் தேர்ந்தெடுத்து தேவையான விவரங்களை நிரப்பவும்",
                "role_student": "மாணவர்",
                "role_counselor": "ஆலோசகர்",
                "role_campus": "வளாகத்தில்",
                "email": "மின்னஞ்சல் முகவரி",
                "password": "கடவுச்சொல்லை உருவாக்கவும்",
                "phone": "தொலைபேசி எண்",
                "institution": "நிறுவனம்",
                "guardian": "பாதுகாவலர் பெயர்",
                "guardianPhone": "பாதுகாவலர் தொலைபேசி",
                "hobbies": "பொழுதுபோக்குகள் / ஆர்வங்கள்",
                "course": "தற்போது படிப்பது",
                "fullname": "முழு பெயர்",
                "brief": "சுருக்கமான தகவல்",
                "btn_student": "மாணவர் கணக்கை உருவாக்கவும்",
                "btn_counselor": "ஆலோசகர் கணக்கை உருவாக்கவும்",
                "btn_campus": "வளாகக் கணக்கை உருவாக்கவும்",
                "login_prompt": "ஏற்கனவே கணக்கு உள்ளதா?",
                "login_link": "உள்நுழையவும்"
            },
            "features": {
                "ai_chat": { "title": "AI அரட்டை ஆதரவு", "desc": "கவலை, மன அழுத்தம் ஆகியவற்றிற்கான உடனடி, தனிப்பயனாக்கப்பட்ட உத்திகளைப் பெறுங்கள்.", "action": "அரட்டையைத் தொடங்கவும்" },
                "booking": { "title": "ரகசிய முன்பதிவு", "desc": "வளாக ஆலோசகர்கள் அல்லது சரிபார்க்கப்பட்ட உதவி எண்களுடன் அநாமதேய அமர்வுகளை பதிவு செய்யவும்.", "action": "அமர்வு பதிவு" },
                "resources": { "title": "வள நூலகம்", "desc": "கல்வி மன அழுத்தம், நினைவாற்றல் மற்றும் மனநலம் குறித்த வீடியோக்கள் மற்றும் கட்டுரைகளை அணுகவும்.", "action": "வளங்களை ஆராயுங்கள்" },
                "community": { "title": "சக சமூகம்", "desc": "பாதுகாப்பான சூழலில் சக மாணவர்களுடன் இணையுங்கள்.", "action": "சமூகம் சேரவும்" },
                "crisis": { "title": "நெருக்கடி கண்டறிதல்", "desc": "சிரமமான சூழ்நிலைகளை கண்டறிந்து உடனடியாக தொழில்முறை உதவியுடன் இணைக்கிறது.", "action": "மேலும் அறிக" },
                "live": { "title": "நேரலை அமர்வுகள்", "desc": "வார இறுதி வெபினார்கள் மற்றும் நேரலை அமர்வுகளில் கலந்து கொள்ளுங்கள்.", "action": "அட்டவணையைப் பார்க்கவும்" },
                "gamification": { "title": "நல்வாழ்வு விளையாட்டு", "desc": "சுய பாதுகாப்பு நடவடிக்கைகளுக்கு புள்ளிகள் மற்றும் பேட்ஜ்களைப் பெறுங்கள்.", "action": "பயணத்தைத் தொடங்கவும்" },
                "tools": { "title": "மன அழுத்த நிவாரண கருவிகள்", "desc": "உங்கள் தேவைகளின் அடிப்படையில் பொழுதுபோக்குகள் மற்றும் செயல்பாடுகளுக்கான பரிந்துரைகள்.", "action": "பரிந்துரைகளைப் பெறுங்கள்" }
            },
            "testimonials": {
                "title": "நம்பிக்கை கதைகள்",
                "subtitle": "மைண்ட்கேர் மூலம் தங்கள் வாழ்க்கையை மாற்றிய மாணவர்களின் கதைகளைக் கேளுங்கள்.",
                "verified": "சரிபார்க்கப்பட்ட மாணவர்",
                "t1": { "quote": "தேர்வுகளுக்கு முன் அமைதியாக இருக்க AI அரட்டை உதவியது.", "name": "சாரா ஜெ." },
                "t2": { "quote": "ஆலோசகரை முன்பதிவு செய்வது மிகவும் எளிதானது மற்றும் தனிப்பட்டதாகும்.", "name": "ராகுல் எம்." },
                "t3": { "quote": "சக சமூகம் நான் தனியாக இல்லை என்பதை உணர வைத்தது.", "name": "பிரியா கே." }
            },
            "dashboard": {
                "student": {
                    "welcome": "மீண்டும் வருக",
                    "title": "மாணவர் கட்டுப்பாட்டகம்",
                    "goals": { "title": "வாராந்திர இலக்குகள்", "mindfulness": "நினைவாற்றல் அமர்வுகள்", "checkins": "தினசரி பதிவுகள்", "peer": "சக ஆதரவு" },
                    "progress": { "title": "முன்னேற்றம்", "score": "நல்வாழ்வு மதிப்பெண்" },
                    "quick": { "title": "விரைவான செயல்கள்", "chat": "AI அரட்டையைத் தொடங்கவும்", "book": "அமர்வு பதிவு", "resources": "வளங்களை ஆராயுங்கள்" },
                    "live": { "title": "நேரலை அமர்வுகள்", "book": "நேரலை அமர்வை பதிவு செய்யவும்", "view": "கிடைக்கும் ஆலோசகர்களைப் பார்க்கவும்" }
                },
                "counselor": {
                    "title": "ஆலோசகர் கட்டுப்பாட்டகம்",
                    "all_bookings": "அனைத்து பதிவுகள்",
                    "active_students": "செயலில் உள்ள மாணவர்கள்",
                    "kpi": "KPIs",
                    "recent_messages": "சமீபத்திய செய்திகள்",
                    "caseload": "வழக்கு விபரம்",
                    "tasks": "இன்றைய பணிகள்"
                }
            }
        }
    },
    te: {
        translation: {
            "nav": {
                "chat": "చాట్ మద్దతు",
                "resources": "వనరులు",
                "book": "సెషన్ బుక్ చేయండి",
                "community": "కమ్యూనిటీ",
                "login": "లాగిన్",
                "signup": "ప్రారంభించండి"
            },
            "hero": {
                "badge": "విద్యార్థుల నమ్మకం",
                "title": "మానసిక ఆరోగ్యం",
                "titleHigh": "అందరికీ అందుబాటులో",
                "subtitle": "అపోహల నుండి బయటపడండి మరియు వ్యక్తిగత మానసిక ఆరోగ్య మద్దతును పొందండి. మా AI-ఆధారిత ప్లాట్‌ఫారమ్ మిమ్మల్ని ప్రొఫెషనల్ కౌన్సిలర్లు, పీర్ కమ్యూనిటీలు మరియు విద్యార్థి జీవితం కోసం రూపొందించిన వనరులతో కలుపుతుంది.",
                "ctaPrimary": "మీ ప్రయాణాన్ని ప్రారంభించండి",
                "ctaSecondary": "డెమో చూడండి",
                "stats": {
                    "anonymous": "100% అనామక",
                    "anonymousDesc": "మీ గోప్యత సురక్షితం",
                    "support": "24/7 మద్దతు",
                    "supportDesc": "ఎల్లప్పుడూ అందుబాటులో",
                    "community": "పీర్ కమ్యూనిటీ",
                    "communityDesc": "స్నేహితులతో కనెక్ట్ అవ్వండి",
                    "satisfaction": "సంతృప్తి",
                    "counselors": "నిపుణులైన కౌన్సిలర్లు",
                    "available": "అందుబాటులో"
                }
            },
            "login": {
                "title": "లాగిన్",
                "subtitle": "మీ ఖాతాను యాక్సెస్ చేయడానికి మీ వివరాలను నమోదు చేయండి",
                "email": "ఇమెయిల్ చిరునామా",
                "password": "పాస్వర్డ్",
                "forgot": "పాస్వర్డ్ మర్చిపోయారా?",
                "submit": "లాగిన్ చేయండి",
                "new": "ఇక్కడ కొత్తవారా?",
                "create": "ఖాతాను సృష్టించండి",
                "welcome": "తిరిగి స్వాగతం. మీ ప్రయాణాన్ని కొనసాగించడానికి లాగిన్ అవ్వండి."
            },
            "footer": {
                "brand": "మైండ్‌కేర్",
                "tagline": "మానసిక ఆరోగ్య మద్దతు",
                "desc": "విద్యార్థులకు అందుబాటులో ఉండే, రహస్య మానసిక ఆరోగ్య మద్దతును అందించడం. మీ శ్రేయస్సు మా ప్రాధాన్యత.",
                "quick": "త్వరిత లింకులు",
                "support": "మద్దతు",
                "contact": "మమ్మల్ని సంప్రదించండి",
                "rights": "అన్ని హక్కులూ ప్రత్యేకించబడ్డాయి.",
                "made": "విద్యార్థుల కోసం ❤️ తో తయారు చేయబడింది."
            },
            "signup": {
                "mainTitle": "మీ ఖాతాను సృష్టించండి",
                "mainSubtitle": "తగిన అనుభవాన్ని పొందడానికి మీ పాత్రను ఎంచుకోండి",
                "header": "సైన్ అప్",
                "desc": "మీ పాత్రను ఎంచుకోండి మరియు అవసరమైన వివరాలను పూరించండి",
                "role_student": "విద్యార్థి",
                "role_counselor": "కౌన్సిలర్",
                "role_campus": "క్యాంపస్‌లో",
                "email": "ఇమెయిల్ చిరునామా",
                "password": "పాస్వర్డ్ సృష్టించండి",
                "phone": "ఫోను నంబరు",
                "institution": "సంస్థ",
                "guardian": "సంరక్షకుని పేరు",
                "guardianPhone": "సంరక్షకుని ఫోన్",
                "hobbies": "అలవాట్లు / ఆసక్తులు",
                "course": "ప్రస్తుతం చదువుచున్నది",
                "fullname": "పూర్తి పేరు",
                "brief": "సంక్షిప్త సమాచారం",
                "btn_student": "విద్యార్థి ఖాతాను సృష్టించండి",
                "btn_counselor": "కౌన్సిలర్ ఖాతాను సృష్టించండి",
                "btn_campus": "ఆన్-క్యాంపస్ ఖాతాను సృష్టించండి",
                "login_prompt": "ఇప్పటికే ఖాతా ఉందా?",
                "login_link": "లాగిన్"
            },
            "features": {
                "ai_chat": { "title": "AI చాట్ మద్దతు", "desc": "ఆందోళన మరియు ఒత్తిడి కోసం తక్షణమే పరిష్కారాలను పొందండి.", "action": "చాట్ ప్రారంభించండి" },
                "booking": { "title": "రహస్య బుకింగ్", "desc": "కౌన్సిలర్లతో రహస్య సెషన్లను బుక్ చేసుకోండి.", "action": "సెషన్ బుక్ చేయండి" },
                "resources": { "title": "వనరుల లైబ్రరీ", "desc": " మానసిక ఆరోగ్యంపై వీడియోలు మరియు కథనాలను యాక్సెస్ చేయండి.", "action": "వనరులను అన్వేషించండి" },
                "community": { "title": "పీర్ కమ్యూనిటీ", "desc": "సురక్షిత వాతావరణంలో తోటి విద్యార్థులతో కనెక్ట్ అవ్వండి.", "action": "కమ్యూనిటీలో చేరండి" },
                "crisis": { "title": "సంక్షోభ గుర్తింపు", "desc": "మా సిస్టమ్ సంక్షోభ పరిస్థితులను గుర్తించి వెంటనే సహాయం అందిస్తుంది.", "action": "మరింత తెలుసుకోండి" },
                "live": { "title": "లైవ్ సెషన్లు", "desc": "నిపుణులతో వారాంతపు వెబినార్లలో పాల్గొనండి.", "action": "షెడ్యూల్ చూడండి" },
                "gamification": { "title": "వెల్నెస్ గేమ్స్", "desc": "స్వీయ సంరక్షణ కార్యకలాపాల కోసం పాయింట్లు మరియు బ్యాడ్జీలను సంపాదించండి.", "action": "ప్రయాణం ప్రారంభించండి" },
                "tools": { "title": "ఒత్తిడి ఉపశమన సాధనాలు", "desc": "మీ అవసరాల ఆధారంగా కార్యకలాపాల కోసం సిఫార్సులు.", "action": "సిఫార్సులు పొందండి" }
            },
            "testimonials": {
                "title": "ఆశాజనక కథలు",
                "subtitle": " మైండ్‌కేర్‌తో తమ జీవితాన్ని మార్చుకున్న విద్యార్థుల మాటలు.",
                "verified": "ధృవీకరించబడిన విద్యార్థి",
                "t1": { "quote": "పరీక్షలకు ముందు ప్రశాంతంగా ఉండటానికి AI చాట్ నాకు సహాయపడింది.", "name": "సారా జె." },
                "t2": { "quote": "కౌన్సిలర్‌ను బుక్ చేయడం చాలా సులభం మరియు రహస్యంగా ఉంది.", "name": "రాహుల్ ఎం." },
                "t3": { "quote": "నేను ఒంటరిగా లేనని పీర్ కమ్యూనిటీ నాకు ధైర్యం ఇచ్చింది.", "name": "ప్రియా కె." }
            },
            "dashboard": {
                "student": {
                    "welcome": "తిరిగి స్వాగతం",
                    "title": "విద్యార్థి డాష్‌బోర్డ్",
                    "goals": { "title": "వారపు లక్ష్యాలు", "mindfulness": "మైండ్‌ఫుల్‌నెస్ సెషన్‌లు", "checkins": "రోజువారీ చెక్-ఇన్‌లు", "peer": "పీర్ సపోర్ట్" },
                    "progress": { "title": "పురోగతి", "score": "వెల్నెస్ స్కోర్" },
                    "quick": { "title": "త్వరిత చర్యలు", "chat": "AI చాట్ ప్రారంభించండి", "book": "సెషన్ బుక్ చేయండి", "resources": "వనరులను చూడండి" },
                    "live": { "title": "లైవ్ సెషన్లు", "book": "లైవ్ సెషన్ బుక్ చేయండి", "view": "అందుబాటులో ఉన్న కౌన్సిలర్లను చూడండి" }
                },
                "counselor": {
                    "title": "కౌన్సిలర్ డాష్‌బోర్డ్",
                    "all_bookings": "అన్ని బుకింగ్‌లు",
                    "active_students": "యాక్టివ్ విద్యార్థులు",
                    "kpi": "KPIs",
                    "recent_messages": "ఇటీవలి సందేశాలు",
                    "caseload": "కేస్‌లోడ్ స్నాప్‌షాట్",
                    "tasks": "ఈనాటి పనులు"
                }
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
