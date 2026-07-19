import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, MotionConfig, animate, inView, motion, useReducedMotion } from "framer-motion";
import { Toaster, toast } from "sonner";
import {
  Menu, X, ArrowRight, MapPin, Phone, Mail, Clock,
  Search, ChevronDown, ChevronUp, Globe, Award, Users,
  TrendingUp, Leaf, BookOpen, Heart, Building,
  Linkedin, Twitter, Instagram,
  CheckCircle, Calendar,
} from "lucide-react";
import founderImage from '../assets/founder.webp';
import Logo from '../assets/logo.webp'

type Page = "home" | "events" | "about" | "contact";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[0-9\s().-]{7,20}$/;

async function submitJson(endpoint: string, body: Record<string, unknown>) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15_000);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "We could not save your details. Please try again.");
    return result;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("The request timed out. Please check your connection and try again.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

function NewsletterForm({
  source,
  dark = false,
  compact = false,
}: {
  source: string;
  dark?: boolean;
  compact?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionId = useRef<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(cleanEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitJson("/.netlify/functions/subscribe", {
        email: cleanEmail,
        source,
        submissionId: submissionId.current || (submissionId.current = crypto.randomUUID()),
        website: "",
      });
      setEmail("");
      submissionId.current = null;
      toast.success("You're subscribed to the Luxentra newsletter.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Subscription failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={compact ? "flex flex-col gap-2" : "flex flex-col sm:flex-row gap-3 max-w-md mx-auto"}>
      <input
        type="email"
        value={email}
        onChange={event => setEmail(event.target.value)}
        placeholder="Your email address"
        required
        maxLength={254}
        autoComplete="email"
        aria-label="Email address"
        className={`${compact ? "py-2.5" : "flex-1 py-3"} ${dark ? "bg-[#F7F4EF]/10 border-[#F7F4EF]/20 text-[#F7F4EF] placeholder:text-[#F7F4EF]/30 focus:border-[#C4973A]" : "bg-white border-[#1A1A18]/15 text-[#1A1A18] placeholder:text-[#1A1A18]/30 focus:border-[#1C3D2E]"} border text-sm px-4 focus:outline-none transition-colors`}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className={`${dark ? "bg-[#C4973A] text-[#1C3D2E] hover:bg-[#F7F4EF]" : "bg-[#1C3D2E] text-[#F7F4EF] hover:bg-[#C4973A] hover:text-[#1C3D2E]"} text-sm font-semibold px-6 ${compact ? "py-2.5" : "py-3"} transition-colors whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {isSubmitting ? "Subscribing…" : "Subscribe"}
      </button>
    </form>
  );
}

// ---- DATA ----

type SDGGoal = { num: number; title: string; color: string; image?: string };


type Contribution = {num: string; label: string}

const OUR_CONTRIBUTIONS: Contribution[] = [
              { num: "2+", label: "Events Delivered" },
              { num: "2+", label: "Organizations" },
              { num: "100+", label: "Participants" },
              { num: "2+", label: "Cities" },
            ]

const SDG_GOALS: SDGGoal[] = [
  { num: 1, title: "No Poverty", color: "#E5243B", image: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-01.jpg" },
  { num: 2, title: "Zero Hunger", color: "#DDA63A", image: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-02.jpg" },
  { num: 3, title: "Good Health", color: "#4C9F38" , image: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-03.jpg"},
  { num: 4, title: "Quality Education", color: "#C5192D", image: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-04.jpg" },
  { num: 5, title: "Gender Equality", color: "#FF3A21", image: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-05.jpg" },
  { num: 6, title: "Clean Water", color: "#26BDE2", image: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-06.jpg" },
  { num: 7, title: "Clean Energy", color: "#FCC30B" , image: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-07.jpg"},
  { num: 8, title: "Decent Work", color: "#A21942", image: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-08.jpg" },
  { num: 9, title: "Innovation", color: "#FD6925" , image: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-09.jpg"},
  { num: 10, title: "Reduced Inequalities", color: "#DD1367" , image: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-10.jpg"},
  { num: 11, title: "Sustainable Cities", color: "#FD9D24" , image  : "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-11.jpg"},
  { num: 12, title: "Responsible Consumption", color: "#BF8B2E", image: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-12.jpg" },
  { num: 13, title: "Climate Action", color: "#3F7E44", image: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-13.jpg" },
  { num: 14, title: "Life Below Water", color: "#0A97D9", image:"https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-14.jpg" },
  { num: 15, title: "Life on Land", color: "#56C02B", image: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-15.jpg" },
  { num: 16, title: "Peace & Justice", color: "#00689D", image: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-16.jpg" },
  { num: 17, title: "Partnerships", color: "#19486A", image: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-17.jpg" },
];

const HERO_BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1800&h=1100&fit=crop&auto=format";

const NAV_ITEMS: { label: string; page: Page }[] = [
  { label: "Home", page: "home" },
  { label: "Events", page: "events" },
  { label: "About", page: "about" },
  { label: "Contact", page: "contact" },
];

const UPCOMING_EVENTS = [
  {
    id: 1,
    title: "ESG Leadership Summit 2025",
    date: "March 15, 2025",
    location: "The Leela Palace, New Delhi",
    description: "A premier gathering of sustainability leaders and corporate decision-makers shaping India's ESG agenda.",
    category: "Corporate",
    duration: "2 Days",
    audience: "C-Suite & Board Members",
    image: "photo-1540575467063-178a50c2df87",
  },
  {
    id: 2,
    title: "SDG Campus Engagement Drive",
    date: "April 3, 2025",
    location: "IIT Bombay, Mumbai",
    description: "Mobilizing student communities around the 2030 Agenda through workshops, hackathons, and panel discussions.",
    category: "Education",
    duration: "3 Days",
    audience: "Students & Faculty",
    image: "photo-1504384308090-c894fdcc538d",
  },
  {
    id: 3,
    title: "POSH Compliance Workshop",
    date: "April 22, 2025",
    location: "Taj MG Road, Bengaluru",
    description: "Certified training program for HR leaders and internal committees on workplace safety and POSH regulations.",
    category: "Workshops",
    duration: "1 Day",
    audience: "HR & Legal Teams",
    image: "photo-1517048676732-d65bc937f952",
  },
];

const ALL_EVENTS = [
  ...UPCOMING_EVENTS,
  {
    id: 4,
    title: "CSR Impact Conference",
    date: "May 10, 2025",
    location: "HICC, Hyderabad",
    description: "Connecting CSR practitioners with communities and implementation partners to amplify social impact.",
    category: "CSR",
    duration: "1 Day",
    audience: "CSR & Foundation Leaders",
    image: "photo-1528605248644-14dd04022da1",
  },
  // {
  //   id: 5,
  //   title: "Green Innovation Hackathon",
  //   date: "May 28, 2025",
  //   location: "T-Hub, Hyderabad",
  //   description: "48-hour intensive challenge bringing together engineers and entrepreneurs to solve climate tech problems.",
  //   category: "Education",
  //   duration: "48 Hours",
  //   audience: "Students & Startups",
  //   image: "photo-1504384308090-c894fdcc538d",
  // },
  // {
  //   id: 6,
  //   title: "NGO Leadership Capacity Program",
  //   date: "June 5, 2025",
  //   location: "India Habitat Centre, New Delhi",
  //   description: "Intensive capacity-building retreat for NGO directors focusing on governance, fundraising, and program design.",
  //   category: "NGO",
  //   duration: "3 Days",
  //   audience: "NGO Leadership",
  //   image: "photo-1531545514256-b1400bc00f31",
  // },
  // {
  //   id: 7,
  //   title: "Municipal SDG Review Forum",
  //   date: "June 18, 2025",
  //   location: "Pune Municipal Corporation",
  //   description: "Collaborative forum bringing together elected officials and urban planners to review city-level SDG progress.",
  //   category: "Government",
  //   duration: "1 Day",
  //   audience: "Government Officials",
  //   image: "photo-1577563908411-5077b6dc7624",
  // },
  // {
  //   id: 8,
  //   title: "Women in Leadership Summit",
  //   date: "July 12, 2025",
  //   location: "The Oberoi, Mumbai",
  //   description: "Celebrating and advancing women's leadership across sectors with mentorship, panels, and networking.",
  //   category: "Corporate",
  //   duration: "1 Day",
  //   audience: "Senior Women Leaders",
  //   image: "photo-1573496359142-b8d87734a5a2",
  // },
  // {
  //   id: 9,
  //   title: "Responsible Business Workshop",
  //   date: "July 30, 2025",
  //   location: "IIMA Campus, Ahmedabad",
  //   description: "Deep-dive on circular economy models, sustainable supply chains, and responsible business practices.",
  //   category: "Workshops",
  //   duration: "1 Day",
  //   audience: "Business Leaders & MBA Students",
  //   image: "photo-1434030216411-0b793f4b4173",
  // },
];

const EVENT_CATEGORIES = ["All", "Corporate", "Education", "CSR", "Workshops"];

const TESTIMONIALS = [
  {
    quote: "Luxentra transformed our annual sustainability summit into a genuinely inspiring experience. The attention to SDG alignment was exceptional — every session moved the needle.",
    author: "Priya Mehta",
    role: "Chief Sustainability Officer, Tata Consultancy Services",
  },
  {
    quote: "Our campus SDG drive reached over 3,000 students across five departments. The depth of content and quality of facilitation was outstanding.",
    author: "Prof. R. Krishnamurthy",
    role: "Dean, School of Management, IIM Ahmedabad",
  },
  {
    quote: "The POSH training program was thorough, legally current, and delivered with real sensitivity. Our teams felt heard, not lectured to.",
    author: "Ananya Bhatt",
    role: "Head of Human Resources, Infosys BPM",
  },
];

const TEAM = [
  { name: "Arjun Kapoor", role: "Founder & CEO", image: "photo-1507003211169-0a1dd7228f2d" },
  { name: "Nandita Sharma", role: "Director, Sustainability", image: "photo-1573496359142-b8d87734a5a2" },
  { name: "Rohan Verma", role: "Head of Events", image: "photo-1500648767791-00dcc994a43e" },
  { name: "Meera Joshi", role: "CSR Practice Lead", image: "photo-1544005313-94ddf0286df2" },
];

const JOURNEY = [
  { year: "2026", title: "Founded in Chennai", desc: "Luxentra Events is established with a mandate to design purposeful corporate events." },
  { year: "2026", title: "SDG Integration", desc: "Pioneered India's first SDG-mapped event methodology for corporate clients." },
  // { year: "2026", title: "Digital Pivot", desc: "Transitioned to hybrid events, reaching 10× more participants during the pandemic." },
  { year: "2026", title: "Campus Network", desc: "Launched the Campus SDG Engagement program across 2+ educational institutions." },
  // { year: "2026", title: "Government Partnerships", desc: "Signed partnerships with three state governments for municipal SDG programs." },
  // { year: "2026", title: "Pan-India Presence", desc: "Expanded to 25 cities and delivered a cumulative 150+ events." },
];

const FAQ_ITEMS = [
  { q: "What types of organizations do you work with?", a: "We work with corporates, educational institutions, government bodies, NGOs, and international organizations. Our clients range from Fortune 500 companies to grassroots nonprofits across India." },
  { q: "How do you align events with the UN SDGs?", a: "Each event is mapped to relevant SDGs from the outset. We design content, speakers, and outcomes to advance specific goals, and provide post-event impact reports with SDG indicators and evidence." },
  { q: "What is your typical event planning timeline?", a: "For large-scale conferences and summits, we recommend an 8–12 week lead time. Workshops and training programs can often be arranged within 3–4 weeks." },
  { q: "Do you handle virtual and hybrid events?", a: "Yes. We design and produce virtual, hybrid, and in-person events with full production support, streaming, and platform management included." },
  { q: "Can you help with post-event impact measurement?", a: "Absolutely. Impact measurement is a core part of our offering. We develop custom metrics aligned to SDG indicators and deliver detailed impact reports." },
];

const CLIENT_LOGOS = [
  "Singapore Business Network", "Women Leadership Forum", "Singapore Business Network", "Women Leadership Forum", "Singapore Business Network", "Women Leadership Forum"
];

const FOUNDER_HIGHLIGHTS = [
  "Established strong business connections in Singapore and South Asia.",
  "Successfully expanding businesses into international markets.",
  "Organized 15+ impactful events in the last two years.",
  "Signed 85+ MOUs across India and Singapore.",
];

const WOMEN_EMPOWERMENT_HIGHLIGHTS = [
  "Delivered 40+ presentations on the POSH Act across Tamil Nadu.",
  "Educated 15,000+ students on workplace safety and gender equality.",
  "Invited as a chief guest at several colleges to inspire and motivate students.",
  "Received the ‘Iconic SathyaPriya Chidambaram’ memento from Government Arts and Science College, Karur, for ensuring women’s safety at the workplace on International Women’s Day 2023.",
  "Officially empanelled by the Ministry of Women and Child Development (MWCD) as a POSH Enabler and Consultant for Women Empowerment.",
];

const SDG_GRID_VARIANTS = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.065, delayChildren: 0.08 } },
};

const SDG_CARD_VARIANTS = {
  hidden: { opacity: 0, x: -56, scale: 0.94 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// ---- SHARED COMPONENTS ----

function SectionLabel({ label, center }: { label: string; center?: boolean }) {
  return (
    <div className={`flex items-center gap-3 mb-4 ${center ? "justify-center" : ""}`}>
      <div className="w-8 h-px bg-[#C4973A]" />
      <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C4973A]">{label}</span>
    </div>
  );
}

function Header({ currentPage, onNavigate }: { currentPage: Page; onNavigate: (p: Page) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const onHero = currentPage === "home" && !scrolled && !mobileOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        onHero ? "bg-transparent" : "bg-[#F7F4EF] border-b border-[#1A1A18]/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        <button
          onClick={() => { onNavigate("home"); setMobileOpen(false); }}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className={`flex  items-center justify-center transition-colors ${onHero ? "bg-[#C4973A]" : "bg-[#1C3D2E]"}`}>
            <img src={Logo} alt="log-image" className={`w-12 h-6 transition-colors ${onHero ? "text-[#1C3D2E]" : "text-[#C4973A]"}`} />
          </div>
          <span
            className={`font-['Playfair_Display'] text-lg font-semibold tracking-wider uppercase transition-colors ${
              onHero ? "text-[#F7F4EF]" : "text-[#1A1A18]"
            }`}
          >
            Luxentra Events
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map(item => (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`text-sm font-medium tracking-wide transition-colors pb-0.5 ${
                currentPage === item.page
                  ? `border-b border-[#C4973A] ${onHero ? "text-[#C4973A]" : "text-[#1C3D2E]"}`
                  : onHero
                  ? "text-[#F7F4EF]/70 hover:text-[#F7F4EF]"
                  : "text-[#1A1A18]/60 hover:text-[#1C3D2E]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => { onNavigate("contact"); setMobileOpen(false); }}
            className={`hidden md:flex items-center gap-2 text-sm font-medium px-5 py-2.5 transition-colors ${
              onHero
                ? "border border-[#F7F4EF]/50 text-[#F7F4EF] hover:bg-[#F7F4EF]/10"
                : "bg-[#1C3D2E] text-[#F7F4EF] hover:bg-[#C4973A] hover:text-[#1C3D2E]"
            }`}
          >
            Book Consultation <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            className={`md:hidden transition-colors ${onHero ? "text-[#F7F4EF]" : "text-[#1A1A18]"}`}
            onClick={() => setMobileOpen(v => !v)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#F7F4EF] border-t border-[#1A1A18]/10 px-6 pt-4 pb-8">
          <nav className="flex flex-col">
            {NAV_ITEMS.map(item => (
              <button
                key={item.page}
                onClick={() => { onNavigate(item.page); setMobileOpen(false); }}
                className={`text-left text-base py-3 border-b border-[#1A1A18]/8 font-medium transition-colors ${
                  currentPage === item.page ? "text-[#1C3D2E]" : "text-[#1A1A18]/60"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <button
            onClick={() => { onNavigate("contact"); setMobileOpen(false); }}
            className="mt-6 w-full bg-[#1C3D2E] text-[#F7F4EF] text-sm font-semibold py-3"
          >
            Book Consultation
          </button>
        </div>
      )}
    </header>
  );
}
//bg-[#C4973A] 
function Footer({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <footer className="bg-[#1C3D2E] text-[#F7F4EF]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-5">
            <div className="flex items-center justify-center"> 
              <img src={Logo} alt="Logo" className="w-12 h-6" object-contain />
            </div>
            <span className="font-['Playfair_Display'] text-lg font-semibold tracking-wider uppercase">Luxentra Events</span>
          </div>
          <p className="text-sm text-[#F7F4EF]/55 leading-relaxed mb-6">
            Designing purpose-driven events aligned with the UN Sustainable Development Goals.
          </p>
          <div className="flex gap-2">
            {[Linkedin, Twitter, Instagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-8 h-8 border border-[#F7F4EF]/20 flex items-center justify-center hover:border-[#C4973A] hover:text-[#C4973A] transition-colors text-[#F7F4EF]/60"
              >
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold tracking-[0.18em] uppercase text-[#C4973A] mb-5">Quick Links</h4>
          <ul className="space-y-3">
            {NAV_ITEMS.map(item => (
              <li key={item.page}>
                <button
                  onClick={() => onNavigate(item.page)}
                  className="text-sm text-[#F7F4EF]/60 hover:text-[#F7F4EF] transition-colors"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold tracking-[0.18em] uppercase text-[#C4973A] mb-5">SDG Resources</h4>
          <ul className="space-y-3">
            {[{name: "UN SDG Overview", url:"https://sdgs.un.org/goals"}, {name: "SDG Tracker", url:"https://sdgindiaindex.niti.gov.in/#/ranking"}, {name: "Voluntary National Reviews", url:"https://hlpf.un.org/vnrs"}].map(link => (
              <li key={link.name}>
                <a href={link.url} target="_blank" className="text-sm text-[#F7F4EF]/60 hover:text-[#F7F4EF] transition-colors">{link.name}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold tracking-[0.18em] uppercase text-[#C4973A] mb-5">Newsletter</h4>
          <p className="text-sm text-[#F7F4EF]/55 mb-4 leading-relaxed">
            Event updates and SDG insights delivered monthly.
          </p>
          <NewsletterForm source="footer" dark compact />
        </div>
      </div>

      <div className="border-t border-[#F7F4EF]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap gap-5 text-xs text-[#F7F4EF]/45">
            <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> admin@luxentraevents.com</span>
            <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> +91 79045 04176</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Chennai, India</span>
          </div>
          <p className="text-xs text-[#F7F4EF]/30">© 2025 Luxentra Events Private Limited. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// ---- HOME PAGE ----

function HomePage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen bg-[#1C3D2E] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_BACKGROUND_IMAGE}
            alt="Corporate conference audience"
            className="w-full h-full object-cover object-center opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#102F23]/95 via-[#1C3D2E]/72 to-[#1C3D2E]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#102F23]/55 via-transparent to-[#102F23]/20" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-24 grid lg:grid-cols-2 gap-16 items-center w-full">
          <div>
            <SectionLabel label="Events for Impact" />
            <h1 className="font-['Playfair_Display'] text-5xl lg:text-6xl xl:text-7xl font-bold text-[#F7F4EF] leading-[1.07] mb-6">
              Designing Events<br />
              <em className="not-italic text-[#C4973A]">That Move the</em><br />
              World Forward
            </h1>
            <p className="text-lg text-[#F7F4EF]/70 leading-relaxed mb-10 max-w-md">
              We focus on purpose-driven corporate, educational, and sustainability events aligned with the UN 2030 Agenda.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate("events")}
                className="flex items-center gap-2 bg-[#C4973A] text-[#1C3D2E] font-semibold px-7 py-3.5 hover:bg-[#F7F4EF] transition-colors"
              >
                Explore Events <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate("contact")}
                className="flex items-center gap-2 border border-[#F7F4EF]/40 text-[#F7F4EF] font-medium px-7 py-3.5 hover:border-[#C4973A] hover:text-[#C4973A] transition-colors"
              >
                Book Consultation
              </button>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-2 gap-4">
            {OUR_CONTRIBUTIONS.map(s => (
              <div key={s.label} className="border border-[#F7F4EF]/12 p-6 bg-[#F7F4EF]/6 backdrop-blur-sm">
                <div className="font-['Playfair_Display'] text-3xl font-bold text-[#C4973A]">{s.num}</div>
                <div className="text-xs text-[#F7F4EF]/50 mt-1 tracking-[0.12em] uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#F7F4EF]/30">
          <span className="text-[9px] tracking-[0.25em] uppercase">Scroll</span>
          <div className="w-px h-10 bg-[#F7F4EF]/20" />
        </div>
      </section>

      {/* Why Luxentra Section */}
      <section className="py-24 bg-[#F7F4EF]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-6">
            <div>
              <SectionLabel label="Why Choose Us" />
              <h2 className="font-['Playfair_Display'] text-4xl font-bold text-[#1A1A18]">Why Luxentra Events</h2>
            </div>
            <p className="max-w-xs text-sm text-[#1A1A18]/50 leading-relaxed lg:pb-1">
              India's specialist in events designed around the United Nations 2030 Agenda for Sustainable Development.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Globe, title: "SDG-Aligned Events", desc: "Every event is mapped to specific UN SDGs, with content designed to drive measurable impact." },
              { icon: Building, title: "Corporate Events", desc: "From leadership summits to shareholder conferences, we design events that project purpose." },
              { icon: BookOpen, title: "Educational Programs", desc: "Campus drives and student programs building the next generation of sustainability leaders." },
              { icon: TrendingUp, title: "Social Audits", desc: "Post-event reports with outcomes mapped to SDG indicators — evidence you can act on." },
            ].map((f, i) => (
              <div
                key={i}
                className="group bg-white border border-black/6 p-8 hover:border-[#C4973A]/60 hover:shadow-md transition-all duration-300 cursor-default"
              >
                <div className="w-10 h-10 bg-[#1C3D2E]/8 flex items-center justify-center mb-6 group-hover:bg-[#1C3D2E] transition-colors">
                  <f.icon className="w-5 h-5 text-[#1C3D2E] group-hover:text-[#C4973A] transition-colors" />
                </div>
                <h3 className="font-['Playfair_Display'] text-lg font-semibold text-[#1A1A18] mb-3">{f.title}</h3>
                <p className="text-sm text-[#1A1A18]/55 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Organize Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-14">
            <SectionLabel label="Our Services" />
            <h2 className="font-['Playfair_Display'] text-4xl font-bold text-[#1A1A18]">What We Organize</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: Building, title: "Corporate Conferences", desc: "Purpose-driven corporate gatherings with executive programming." },
              { icon: Award, title: "Leadership Summits", desc: "Curated summits for C-suite and board-level decision-makers." },
              { icon: TrendingUp, title: "ESG Events", desc: "Connecting ESG practitioners, investors, and policymakers." },
              { icon: Globe, title: "SDG Workshops", desc: "Translating UN Goals into organizational action." },
              { icon: BookOpen, title: "Campus Events", desc: "Student-focused programs on global challenges." },
              { icon: Heart, title: "POSH Training", desc: "Certified workplace safety compliance programs." },
              { icon: Users, title: "Employee Engagement", desc: "Programs connecting teams to the company's social mission." },
              { icon: Leaf, title: "CSR Campaigns", desc: "End-to-end CSR event design and execution." },
              { icon: TrendingUp, title: "Hackathons", desc: "Innovation challenges solving sustainability problems." },
              { icon: Award, title: "Innovation Challenges", desc: "Structured competitions driving breakthrough thinking." },
            ].map((item, i) => (
              <div
                key={i}
                className="group border border-[#1A1A18]/8 p-6 hover:bg-[#1C3D2E] transition-all duration-300 cursor-default"
              >
                <div className="w-9 h-9 bg-[#F7F4EF] flex items-center justify-center mb-4 group-hover:bg-[#C4973A]/20 transition-colors">
                  <item.icon className="w-4 h-4 text-[#1C3D2E] group-hover:text-[#C4973A] transition-colors" />
                </div>
                <h3 className="text-base font-semibold text-[#1A1A18] group-hover:text-[#F7F4EF] mb-2 transition-colors">{item.title}</h3>
                <p className="text-sm text-[#1A1A18]/50 group-hover:text-[#F7F4EF]/60 leading-relaxed transition-colors">{item.desc}</p>
                {/* <div className="mt-3 flex items-center gap-1 text-[#C4973A] text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn More <ArrowRight className="w-3 h-3" />
                </div> */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SDG Section */}
      <section className="py-24 bg-[#1C3D2E]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              {/* <SectionLabel label="UN 2030 Agenda" /> */}
              <h2 className="font-['Playfair_Display'] text-4xl font-bold text-[#F7F4EF] mb-6">
                Sustainable<br />Development Goals
              </h2>
              <p className="text-sm text-[#F7F4EF]/60 leading-relaxed mb-8 max-w-sm">
                Every Luxentra event is anchored in one or more of the 17 UN Sustainable Development Goals. We help organizations translate global ambitions into measurable local action.
              </p>
              <button
                onClick={() => onNavigate("about")}
                className="flex items-center gap-2 border border-[#C4973A] text-[#C4973A] text-sm font-medium px-6 py-3 hover:bg-[#C4973A] hover:text-[#1C3D2E] transition-colors"
              >
                Learn About Our Approach <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div>
              <motion.div
                className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 mb-1.5"
                variants={SDG_GRID_VARIANTS}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.18 }}
              >
                {SDG_GOALS.map(sdg => (
                  <motion.div
                    key={sdg.num}
                    variants={SDG_CARD_VARIANTS}
                    whileHover={{ y: -7, scale: 1.025 }}
                    className="sdg-tile aspect-square flex flex-col cursor-default rounded-sm shadow-sm"
                    style={{
                      backgroundColor: sdg.color,
                      backgroundImage: sdg.image ? `linear-gradient(rgba(0,0,0,.1), rgba(0,0,0,.15)), url(${sdg.image})` : undefined, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
                    }}
                    // title={`SDG ${sdg.num}: ${sdg.title}`}
                  >
                    {/* <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-1 text-center">
                      <span className="text-white font-bold text-sm sm:text-base leading-none">{sdg.num}</span>
                      <span className="text-white/90 text-[6px] leading-tight mt-1 hidden sm:block">{sdg.title}</span>
                    </div> */}
                  </motion.div>
                ))}
                {/* <div className="aspect-square col-span-3 bg-[#F7F4EF]/8 border border-[#F7F4EF]/15 flex flex-col items-center justify-center">
                  <div className="font-['Playfair_Display'] text-2xl font-bold text-[#C4973A]">2030</div>
                  <div className="text-[#F7F4EF]/50 text-[8px] uppercase tracking-[0.15em] mt-0.5">Agenda</div>
                </div> */}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section className="py-24 bg-[#F7F4EF]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-14 text-center">
            <SectionLabel label="How We Work" center />
            <h2 className="font-['Playfair_Display'] text-4xl font-bold text-[#1A1A18]">Our Process</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
            {[
              { num: "01", title: "Discover", desc: "We begin with deep listening — understanding your organization's mission, audience, and impact goals." },
              { num: "02", title: "Plan", desc: "Our team co-designs an event blueprint aligned to specific SDGs and your stakeholder expectations." },
              { num: "03", title: "Execute", desc: "From logistics to facilitation, we deliver every element with precision and intentionality." },
              { num: "04", title: "Measure Impact", desc: "Post-event, we produce a detailed impact report mapping outcomes to measurable SDG indicators." },
            ].map((step, i) => (
              <div
                key={i}
                className={`bg-white p-8 border-t-2 relative ${i === 0 ? "border-[#C4973A]" : "border-[#1C3D2E]"}`}
              >
                <div className="font-['Playfair_Display'] text-4xl font-bold text-[#1C3D2E]/12 mb-3">{step.num}</div>
                <h3 className="font-['Playfair_Display'] text-lg font-semibold text-[#1A1A18] mb-3">{step.title}</h3>
                <p className="text-sm text-[#1A1A18]/55 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      {/* <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <SectionLabel label="What's Happening" />
              <h2 className="font-['Playfair_Display'] text-4xl font-bold text-[#1A1A18]">Upcoming Events</h2>
            </div>
            <button
              onClick={() => onNavigate("events")}
              className="flex items-center gap-2 text-sm font-medium text-[#1C3D2E] hover:text-[#C4973A] transition-colors"
            >
              View All Events <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {UPCOMING_EVENTS.map(evt => (
              <div key={evt.id} className="group border border-black/6 overflow-hidden hover:shadow-md transition-all duration-300">
                <div className="aspect-video bg-[#E8E3DA] overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/${evt.image}?w=600&h=340&fit=crop&auto=format`}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block text-[9px] font-semibold tracking-[0.18em] uppercase text-[#C4973A] border border-[#C4973A]/40 px-2 py-0.5 mb-4">
                    {evt.category}
                  </span>
                  <h3 className="font-['Playfair_Display'] text-lg font-semibold text-[#1A1A18] mb-2 leading-snug">{evt.title}</h3>
                  <div className="flex flex-col gap-1 mb-3 text-xs text-[#1A1A18]/45">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {evt.date}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {evt.location}</span>
                  </div>
                  <p className="text-sm text-[#1A1A18]/55 leading-relaxed mb-5">{evt.description}</p>
                  <button className="flex items-center gap-1.5 text-sm font-semibold text-[#1C3D2E] hover:text-[#C4973A] transition-colors">
                    Register Now <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Client Logos Section */}
      <section className="py-16 bg-[#F7F4EF] border-y border-black/6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <p className="text-center text-[12px] font-semibold tracking-[0.25em] uppercase text-[#1A1A18]/60 mb-10">
            Event Partners
          </p>
          <div className="partner-marquee" aria-label="Event partners">
            <div className="partner-marquee-track">
            {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((logo, index) => (
              <span
                key={`${logo}-${index}`}
                className="partner-logo text-sm font-semibold tracking-wide text-[#C4973A] hover:text-[#1C3D2E] transition-colors cursor-default uppercase"
                aria-hidden={index >= CLIENT_LOGOS.length}
              >
                {logo}
              </span>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-14">
            <SectionLabel label="What Clients Say" />
            <h2 className="font-['Playfair_Display'] text-4xl font-bold text-[#1A1A18]">Testimonials</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-[#F7F4EF] p-8 flex flex-col">
                <div className="font-['Playfair_Display'] text-5xl text-[#C4973A] leading-none mb-4 select-none">"</div>
                <p className="text-sm text-[#1A1A18]/68 leading-relaxed flex-1 font-['Playfair_Display'] italic">{t.quote}</p>
                <div className="mt-6 pt-5 border-t border-[#1A1A18]/8">
                  <div className="font-semibold text-sm text-[#1A1A18]">{t.author}</div>
                  <div className="text-xs text-[#1A1A18]/45 mt-0.5">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-[#1C3D2E]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#F7F4EF]/10 border border-[#F7F4EF]/10">
            {OUR_CONTRIBUTIONS.map(s => (
              <div key={s.label} className="py-12 px-8 text-center">
                <div className="font-['Playfair_Display'] text-5xl font-bold text-[#C4973A] mb-2">{s.num}</div>
                <div className="text-xs text-[#F7F4EF]/45 tracking-[0.18em] uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-[#F7F4EF]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <SectionLabel label="Stay Informed" center />
          <h2 className="font-['Playfair_Display'] text-3xl font-bold text-[#1A1A18] mb-4">
            Get Event Updates & SDG Insights
          </h2>
          <p className="text-sm text-[#1A1A18]/50 mb-8 leading-relaxed">
            Monthly updates on upcoming events, impact stories, and SDG resources for sustainability practitioners.
          </p>
          <NewsletterForm source="home" />
        </div>
      </section>
    </>
  );
}

// ---- EVENTS PAGE ----

function EventsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 6;

  const filtered = ALL_EVENTS.filter(e => {
    const matchCat = activeCategory === "All" || e.category === activeCategory;
    const matchSearch =
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-20 bg-[#1C3D2E] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=1440&h=500&fit=crop&auto=format"
            alt="Conference stage"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <SectionLabel label="Our Events" />
          <h1 className="font-['Playfair_Display'] text-5xl font-bold text-[#F7F4EF] mb-4">Events & Programs</h1>
          <p className="text-[#F7F4EF]/60 text-base max-w-xl leading-relaxed">
            Explore our portfolio of purpose-driven events across corporate, educational, government, and civil society sectors.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="bg-white border-b border-black/8 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2 border border-[#1A1A18]/12 px-4 py-2.5 w-full sm:w-56">
            <Search className="w-4 h-4 text-[#1A1A18]/30 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search events..."
              className="text-sm bg-transparent text-[#1A1A18] placeholder:text-[#1A1A18]/30 focus:outline-none w-full"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {EVENT_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                className={`text-xs font-medium px-3 py-1.5 transition-colors ${
                  activeCategory === cat
                    ? "bg-[#1C3D2E] text-[#F7F4EF]"
                    : "border border-[#1A1A18]/15 text-[#1A1A18]/55 hover:border-[#1C3D2E] hover:text-[#1C3D2E]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <section className="py-16 bg-[#F7F4EF]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <p className="text-sm text-[#1A1A18]/40 mb-8">
            {filtered.length} event{filtered.length !== 1 ? "s" : ""} found
          </p>

          {paginated.length === 0 ? (
            <div className="text-center py-24 text-[#1A1A18]/30 text-sm">No events match your search.</div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
              {paginated.map(evt => (
                <motion.article
                  layout
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  key={evt.id}
                  className="group bg-white border border-black/6 overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <div className="aspect-video bg-[#E8E3DA] overflow-hidden">
                    <img
                      src={`https://images.unsplash.com/${evt.image}?w=600&h=340&fit=crop&auto=format`}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block text-[9px] font-semibold tracking-[0.18em] uppercase text-[#C4973A] border border-[#C4973A]/40 px-2 py-0.5 mb-3">
                      {evt.category}
                    </span>
                    <h3 className="font-['Playfair_Display'] text-lg font-semibold text-[#1A1A18] mb-2 leading-snug">{evt.title}</h3>
                    {/* <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-xs text-[#1A1A18]/40">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {evt.date}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {evt.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {evt.duration}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {evt.audience}</span>
                    </div> */}
                    <p className="text-sm text-[#1A1A18]/55 leading-relaxed mb-5">{evt.description}</p>
                    {/* <button className="flex items-center gap-1.5 text-sm font-semibold text-[#1C3D2E] hover:text-[#C4973A] transition-colors">
                      Learn More <ArrowRight className="w-3.5 h-3.5" />
                    </button> */}
                  </div>
                </motion.article>
              ))}
              </AnimatePresence>
            </motion.div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-9 h-9 text-sm font-medium transition-colors ${
                    currentPage === p
                      ? "bg-[#1C3D2E] text-[#F7F4EF]"
                      : "border border-[#1A1A18]/15 text-[#1A1A18]/50 hover:border-[#1C3D2E] hover:text-[#1C3D2E]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

// ---- ABOUT PAGE ----

function AboutPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-20 bg-[#1C3D2E] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1440&h=500&fit=crop&auto=format"
            alt="Team collaboration"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <SectionLabel label="Our Story" />
          <h1 className="font-['Playfair_Display'] text-5xl font-bold text-[#F7F4EF] mb-4">About Luxentra</h1>
          <p className="text-[#F7F4EF]/60 text-base max-w-xl leading-relaxed">
            Founded in 2026, Luxentra Events focus on purpose-driven events aligned with the United Nations Sustainable Development Goals.
          </p>
        </div>
      </section>

      {/* Who We Are / Mission / Vision / Values */}
      <section className="py-24 bg-[#F7F4EF]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <SectionLabel label="Who We Are" />
              <h2 className="font-['Playfair_Display'] text-4xl font-bold text-[#1A1A18] mb-6">
                Events That Create<br />Lasting Impact
              </h2>
              <p className="text-sm text-[#1A1A18]/60 leading-relaxed mb-4">
                Luxentra Events was founded on a simple conviction: that events are one of the most powerful instruments for organizational transformation. When designed with intention, a single gathering can shift mindsets, forge partnerships, and catalyze action toward a more sustainable world.
              </p>
              <p className="text-sm text-[#1A1A18]/60 leading-relaxed">
                We work at the intersection of corporate responsibility, education, and public policy — designing programs that align organizational goals with the UN 2030 Agenda and the 17 Sustainable Development Goals.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { label: "Mission", content: "To create events that bridge organizational ambition and measurable sustainability impact — for every client, every time." },
                { label: "Vision", content: "A world where every organizational gathering advances the 2030 Agenda and leaves communities better than it found them." },
                { label: "Values", content: "Purpose over prestige. Measurement over impressions. Inclusion over exclusivity. Evidence over assumption." },
              ].map(item => (
                <div key={item.label} className="bg-white border border-black/6 p-6">
                  <div className="text-[9px] font-semibold tracking-[0.22em] uppercase text-[#C4973A] mb-2">{item.label}</div>
                  <p className="text-sm text-[#1A1A18]/65 leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <SectionLabel label="Leadership" />
          <h2 className="font-['Playfair_Display'] text-4xl font-bold text-[#1A1A18] mb-12">Our Founder</h2>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="aspect-[4/5] bg-[#E8E3DA] overflow-hidden max-w-sm">
              <img
                src={founderImage}
                alt="Founder portrait"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="pt-2">
              <h3 className="font-['Playfair_Display'] text-3xl font-bold text-[#1A1A18] mb-1">SathyaPriya Chidambaram</h3>
              <p className="text-sm text-[#C4973A] font-semibold tracking-wide mb-2">Director — Luxentra Private Ltd</p>
              <p className="text-xs uppercase tracking-[0.14em] text-[#1C3D2E]/65 mb-7">POSH Consultant · Motivational Speaker · 17+ Years of Experience</p>
              <div className="space-y-3 mb-8">
                {FOUNDER_HIGHLIGHTS.map(a => (
                  <div key={a} className="flex items-center gap-2.5 text-sm text-[#1A1A18]/60">
                    <CheckCircle className="w-4 h-4 text-[#1C3D2E] shrink-0" />
                    {a}
                  </div>
                ))}
              </div>
              <h4 className="font-['Playfair_Display'] text-xl font-semibold text-[#1A1A18] mb-4">Women Empowerment &amp; Advocacy</h4>
              <div className="space-y-3 mb-8">
                {WOMEN_EMPOWERMENT_HIGHLIGHTS.map(a => (
                  <div key={a} className="flex items-start gap-2.5 text-sm text-[#1A1A18]/60 leading-relaxed">
                    <CheckCircle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                    {a}
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                {[Linkedin, Twitter].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 border border-[#1A1A18]/15 flex items-center justify-center hover:border-[#1C3D2E] hover:text-[#1C3D2E] transition-colors text-[#1A1A18]/45"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-24 bg-[#F7F4EF]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <SectionLabel label="Our History" />
          <h2 className="font-['Playfair_Display'] text-4xl font-bold text-[#1A1A18] mb-14">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-[#1C3D2E]/15 lg:left-1/2" />
            <div className="space-y-10">
              {JOURNEY.map((j, i) => (
                <div
                  key={i}
                  className={`relative flex flex-col lg:flex-row gap-8 lg:gap-0 ${i % 2 === 0 ? "" : "lg:flex-row-reverse"}`}
                >
                  <div
                    className="absolute w-3 h-3 rounded-full bg-[#C4973A] top-1 left-4 -translate-x-1/2 lg:left-1/2 ring-4 ring-[#F7F4EF]"
                  />
                  <div
                    className={`lg:w-1/2 pl-10 lg:pl-0 ${
                      i % 2 === 0 ? "lg:text-right lg:pr-16" : "lg:pl-16"
                    }`}
                  >
                    <div className="text-xs font-bold tracking-[0.2em] uppercase text-[#C4973A] mb-1">{j.year}</div>
                    <h3 className="font-['Playfair_Display'] text-lg font-semibold text-[#1A1A18] mb-1">{j.title}</h3>
                    <p className="text-base text-[#1A1A18]/55 leading-relaxed">{j.desc}</p>
                  </div>
                  <div className="hidden lg:block lg:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <SectionLabel label="Our People" />
          <h2 className="font-['Playfair_Display'] text-4xl font-bold text-[#1A1A18] mb-12">The Team</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map(m => (
              <div key={m.name} className="group">
                <div className="aspect-square bg-[#E8E3DA] overflow-hidden mb-4">
                  <img
                    src={`https://images.unsplash.com/${m.image}?w=320&h=320&fit=crop&auto=format`}
                    alt={m.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-semibold text-sm text-[#1A1A18]">{m.name}</h3>
                <p className="text-xs text-[#1A1A18]/45 mt-0.5">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Impact Stats */}
      {/* <section className="py-20 bg-[#1C3D2E]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <SectionLabel label="Our Impact" center />
            <h2 className="font-['Playfair_Display'] text-4xl font-bold text-[#F7F4EF]">Measuring What Matters</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#F7F4EF]/10 border border-[#F7F4EF]/10">
            {[
              { num: "150+", label: "Events Delivered" },
              { num: "100+", label: "Organizations" },
              { num: "1M+", label: "Participants" },
              { num: "17", label: "SDGs Addressed" },
            ].map(s => (
              <div key={s.label} className="py-12 px-8 text-center">
                <div className="font-['Playfair_Display'] text-5xl font-bold text-[#C4973A] mb-2">{s.num}</div>
                <div className="text-xs text-[#F7F4EF]/45 tracking-[0.18em] uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Why Sustainability Matters */}
      <section className="py-24 bg-[#F7F4EF]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <SectionLabel label="UN 2030 Agenda" center />
          <h2 className="font-['Playfair_Display'] text-4xl font-bold text-[#1A1A18] mb-4">Why Sustainability Matters</h2>
          <p className="text-sm text-[#1A1A18]/55 max-w-2xl mx-auto leading-relaxed mb-12">
            The UN's 17 Sustainable Development Goals are the world's shared blueprint for peace, prosperity, and a healthy planet. Luxentra Events connects organizational gatherings to this global framework — making every event count toward 2030.
          </p>
          <motion.div
            className="grid grid-cols-6 sm:grid-cols-9 gap-1.5 max-w-3xl mx-auto mb-10"
            variants={SDG_GRID_VARIANTS}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.14 }}
          >
            {SDG_GOALS.map(sdg => (
              <motion.div
                key={sdg.num}
                variants={SDG_CARD_VARIANTS}
                whileHover={{ y: -7, scale: 1.025 }}
                className="sdg-tile aspect-square flex flex-col cursor-default rounded-sm shadow-sm text-center"
                style={{
                  backgroundColor: sdg.color,
                  backgroundImage: sdg.image ? `linear-gradient(rgba(0,0,0,.1), rgba(0,0,0,.15)), url(${sdg.image})` : undefined, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
                }}
                // title={`SDG ${sdg.num}: ${sdg.title}`}
              >
                {/* <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-1">
                  <span className="text-white font-bold text-sm">{sdg.num}</span>
                  <span className="text-white/90 text-[6px] leading-tight px-0.5 hidden sm:block">{sdg.title}</span>
                </div> */}
              </motion.div>
            ))}
          </motion.div>
          <button
            onClick={() => onNavigate("contact")}
            className="inline-flex items-center gap-2 bg-[#1C3D2E] text-[#F7F4EF] text-sm font-medium px-7 py-3.5 hover:bg-[#C4973A] hover:text-[#1C3D2E] transition-colors"
          >
            Work With Us <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </>
  );
}

// ---- CONTACT PAGE ----

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "", company: "", email: "", phone: "", org: "", subject: "", message: "",
  });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [errors, setErrors] = useState<Partial<Record<"name" | "email" | "phone", string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionId = useRef<string | null>(null);

  const handleChange = (key: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData(f => ({ ...f, [key]: e.target.value }));
      if (key === "name" || key === "email" || key === "phone") {
        setErrors(current => ({ ...current, [key]: undefined }));
      }
    };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();
    const nextErrors: typeof errors = {};
    if (name.length < 2 || !/[\p{L}]/u.test(name)) nextErrors.name = "Please enter your full name.";
    if (!EMAIL_PATTERN.test(email)) nextErrors.email = "Please enter a valid email address.";
    if (!PHONE_PATTERN.test(phone) || phone.replace(/\D/g, "").length < 7) nextErrors.phone = "Please enter a valid phone number.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await submitJson("/.netlify/functions/contact", {
        ...formData,
        name,
        email,
        phone,
        submissionId: submissionId.current || (submissionId.current = crypto.randomUUID()),
        website: "",
      });
      setFormData({ name: "", company: "", email: "", phone: "", org: "", subject: "", message: "" });
      submissionId.current = null;
      setErrors({});
      toast.success("Thank you! We will contact you soon.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Your message could not be sent. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-36 pb-20 bg-[#1C3D2E]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <SectionLabel label="Get in Touch" />
          <h1 className="font-['Playfair_Display'] text-5xl font-bold text-[#F7F4EF] mb-4">Contact Us</h1>
          <p className="text-[#F7F4EF]/60 text-base max-w-xl leading-relaxed">
            Whether you want to explore an event brief, book a consultation, or simply learn more — we'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-24 bg-[#F7F4EF]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-5 gap-16">
          {/* Info column */}
          <div className="lg:col-span-2">
            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1A1A18] mb-8">Our Office</h2>
            <div className="space-y-5 mb-8">
              {[
                { Icon: MapPin, label: "Address", value: "3rd Floor\nUnit No.23\n Hamid Complex\nAnna Salai, Chennai 600006, India" },
                { Icon: Phone, label: "Phone", value: "+91 79045 04176" },
                { Icon: Mail, label: "Email", value: "admin@luxentraevents.com" },
                { Icon: Clock, label: "Working Hours", value: "Mon – Fri: 9:00 AM – 6:00 PM\nSat: 10:00 AM – 2:00 PM" },
              ].map(item => (
                <div key={item.label} className="flex gap-4">
                  <div className="w-10 h-10 bg-[#1C3D2E] flex items-center justify-center shrink-0">
                    <item.Icon className="w-4 h-4 text-[#C4973A]" />
                  </div>
                  <div>
                    <div className="text-[9px] font-semibold tracking-[0.18em] uppercase text-[#1A1A18]/38 mb-0.5">{item.label}</div>
                    <div className="text-sm text-[#1A1A18]/70 whitespace-pre-line leading-relaxed">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            {/* <div className="aspect-[4/3] bg-[#DDD8CF] border border-[#1A1A18]/8 flex items-center justify-center">
              <div className="text-center text-[#1A1A18]/28">
                <MapPin className="w-8 h-8 mx-auto mb-2" />
                <p className="text-xs font-medium">Google Maps</p>
                <p className="text-xs">Chennai, India</p>
              </div>
            </div> */}
          </div>

          {/* Form column */}
          <div className="lg:col-span-3">
            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1A1A18] mb-8">Send a Message</h2>
            <form onSubmit={handleFormSubmit} noValidate className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { key: "name", label: "Full Name", placeholder: "Your name", type: "text" },
                { key: "company", label: "Company / Organization", placeholder: "Your organization", type: "text" },
                { key: "email", label: "Email Address", placeholder: "your@email.com", type: "email" },
                { key: "phone", label: "Phone Number", placeholder: "+91 00000 00000", type: "tel" },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-[9px] font-semibold tracking-[0.18em] uppercase text-[#1A1A18]/45 mb-2">
                    {field.label}{["name", "email", "phone"].includes(field.key) && <span className="text-red-700"> *</span>}
                  </label>
                  <input
                    type={field.type}
                    value={formData[field.key as keyof typeof formData]}
                    onChange={handleChange(field.key as keyof typeof formData)}
                    placeholder={field.placeholder}
                    required={["name", "email", "phone"].includes(field.key)}
                    maxLength={field.key === "email" ? 254 : field.key === "phone" ? 20 : 100}
                    autoComplete={field.key === "name" ? "name" : field.key === "email" ? "email" : field.key === "phone" ? "tel" : "organization"}
                    aria-invalid={Boolean(errors[field.key as keyof typeof errors])}
                    aria-describedby={errors[field.key as keyof typeof errors] ? `${field.key}-error` : undefined}
                    className={`w-full bg-white border ${errors[field.key as keyof typeof errors] ? "border-red-600" : "border-[#1A1A18]/12"} text-[#1A1A18] placeholder:text-[#1A1A18]/25 text-sm px-4 py-3 focus:outline-none focus:border-[#1C3D2E] transition-colors`}
                  />
                  {errors[field.key as keyof typeof errors] && (
                    <p id={`${field.key}-error`} className="mt-1.5 text-xs text-red-700" role="alert">{errors[field.key as keyof typeof errors]}</p>
                  )}
                </div>
              ))}

              <div className="sm:col-span-2">
                <label className="block text-[9px] font-semibold tracking-[0.18em] uppercase text-[#1A1A18]/45 mb-2">
                  Organization Type
                </label>
                <select
                  value={formData.org}
                  onChange={handleChange("org")}
                  className="w-full bg-white border border-[#1A1A18]/12 text-[#1A1A18] text-sm px-4 py-3 focus:outline-none focus:border-[#1C3D2E] transition-colors appearance-none"
                >
                  <option value="">Select organization type</option>
                  {["Corporate", "Educational Institution", "NGO", "Government", "International Organization", "Other"].map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[9px] font-semibold tracking-[0.18em] uppercase text-[#1A1A18]/45 mb-2">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={handleChange("subject")}
                  placeholder="How can we help?"
                  maxLength={150}
                  className="w-full bg-white border border-[#1A1A18]/12 text-[#1A1A18] placeholder:text-[#1A1A18]/25 text-sm px-4 py-3 focus:outline-none focus:border-[#1C3D2E] transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[9px] font-semibold tracking-[0.18em] uppercase text-[#1A1A18]/45 mb-2">Message</label>
                <textarea
                  rows={5}
                  value={formData.message}
                  onChange={handleChange("message")}
                  placeholder="Tell us about your event brief, timeline, and goals..."
                  maxLength={3000}
                  className="w-full bg-white border border-[#1A1A18]/12 text-[#1A1A18] placeholder:text-[#1A1A18]/25 text-sm px-4 py-3 focus:outline-none focus:border-[#1C3D2E] transition-colors resize-none"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-[#1C3D2E] text-[#F7F4EF] text-sm font-semibold px-8 py-3.5 hover:bg-[#C4973A] hover:text-[#1C3D2E] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Sending…" : "Send Message"} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Why Contact Us
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <SectionLabel label="Why Reach Out" center />
            <h2 className="font-['Playfair_Display'] text-4xl font-bold text-[#1A1A18]">Why Contact Us</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Globe, title: "SDG Events", desc: "Free initial consultation to map your organizational goals to specific UN SDGs." },
              { icon: Award, title: "Custom Event Design", desc: "Every program is designed from scratch around your brief, audience, and impact goals." },
              { icon: TrendingUp, title: "Measurable Outcomes", desc: "We commit to post-event impact measurement aligned to SDG indicators." },
              { icon: Users, title: "Trusted by Leaders", desc: "100+ organizations trust us with their most important sustainability programs." },
            ].map((f, i) => (
              <div key={i} className="bg-[#F7F4EF] p-8">
                <div className="w-10 h-10 bg-[#1C3D2E] flex items-center justify-center mb-5">
                  <f.icon className="w-5 h-5 text-[#C4973A]" />
                </div>
                <h3 className="font-['Playfair_Display'] text-lg font-semibold text-[#1A1A18] mb-2">{f.title}</h3>
                <p className="text-sm text-[#1A1A18]/55 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* FAQ Accordion */}
      <section className="py-24 bg-[#F7F4EF]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <SectionLabel label="Common Questions" center />
            <h2 className="font-['Playfair_Display'] text-4xl font-bold text-[#1A1A18]">FAQs</h2>
          </div>
          <div className="flex flex-col gap-2">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="border border-[#1A1A18]/8 bg-white">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                >
                  <span className="font-['Playfair_Display'] text-base font-semibold text-[#1A1A18]">{item.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-[#C4973A] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#1A1A18]/35 shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 pt-0 text-sm text-[#1A1A18]/60 leading-relaxed border-t border-[#1A1A18]/6 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-[#1C3D2E]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <SectionLabel label="Stay Informed" center />
          <h2 className="font-['Playfair_Display'] text-3xl font-bold text-[#F7F4EF] mb-4">
            Sign Up for Our Newsletter
          </h2>
          <p className="text-sm text-[#F7F4EF]/55 mb-8 leading-relaxed">
            Event announcements, SDG insights, and sustainability resources — monthly.
          </p>
          <NewsletterForm source="contact" dark />
        </div>
      </section>
    </>
  );
}

// ---- MAIN APP ----

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section"));
    if (reduceMotion) {
      sections.forEach(section => {
        section.style.opacity = "1";
        section.style.transform = "none";
      });
      return;
    }

    sections.forEach((section, index) => {
      if (index === 0) return;
      section.style.opacity = "0";
      section.style.transform = "translate3d(0, 42px, 0)";
    });

    let lastScrollY = window.scrollY;
    let scrollingUp = false;
    const detectDirection = () => {
      scrollingUp = window.scrollY < lastScrollY;
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", detectDirection, { passive: true });

    const stopObservers = sections.slice(1).map(section =>
      inView(
        section,
        () => {
          animate(
            section,
            { opacity: [0, 1], y: [42, 0] },
            { duration: 0.78, ease: [0.22, 1, 0.36, 1] },
          );
          return () => {
            if (scrollingUp) {
              animate(
                section,
                { opacity: 0, y: 34 },
                { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
              );
            }
          };
        },
        { amount: 0.12, margin: "0px 0px -8% 0px" },
      ),
    );

    return () => {
      window.removeEventListener("scroll", detectDirection);
      stopObservers.forEach(stop => stop());
    };
  }, [currentPage, reduceMotion]);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <MotionConfig reducedMotion="user">
    <div className="premium-shell min-h-screen bg-[#F7F4EF] font-['DM_Sans',sans-serif]">
      <Header currentPage={currentPage} onNavigate={navigate} />
      <main>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentPage}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: reduceMotion ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            {currentPage === "home" && <HomePage onNavigate={navigate} />}
            {currentPage === "events" && <EventsPage />}
            {currentPage === "about" && <AboutPage onNavigate={navigate} />}
            {currentPage === "contact" && <ContactPage />}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer onNavigate={navigate} />
      <Toaster position="top-right" richColors closeButton />
    </div>
    </MotionConfig>
  );
}
