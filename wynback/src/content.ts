// All copy for the site lives here so it can be checked and swapped in one place.
// Lines marked DRAFT were written for this build because the live site could not be
// reached from the build machine; confirm or replace them before launch.

export const BOOKING_URL = "https://calendar.app.google/tjezLnaDgZ53Dhc78";

// One list, used by the steps, the pricing and the board, so they can never disagree again.
export const MILESTONES = [12, 18, 24, 36, 48, 60] as const;
export const milestoneList = MILESTONES.join(", ").replace(/, (\d+)$/, " and $1");

// Paste the 60-second film here: an .mp4 path in /public, or a YouTube / Vimeo embed URL.
export const VIDEO_SRC = "";

// DRAFT: the public contact email, if there is one. Left empty, it is not shown.
export const CONTACT_EMAIL = "";

export const nav = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#roi", label: "ROI" },
  { href: "/#faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export const hero = {
  // The page's h1. 40 characters, two lines at every width.
  title: "Your past customers are your next sales.",
  // DRAFT, tightened from the brief.
  line: `Wynback writes to everyone you've sold a car to, at ${milestoneList} months of ownership, about the car they bought from you.`,
  specLeft: "12 to 60 months",
  specRight: "Under 10 minutes a month",
};

// The hero object: three of the emails Wynback writes, crossfaded. Sample data.
export const heroEmails = [
  {
    months: 12,
    dealer: "Kirkgate Motors",
    to: "Hannah",
    car: "2021 Kia Sportage 1.6 GDi",
    subject: "A year in the Sportage",
    body: [
      "Hi Hannah, it's a year this week since you drove the Sportage off our forecourt.",
      "Hope it's been everything you wanted. If anything's niggling, or it's due a look-over, just reply and we'll sort a time.",
    ],
    sign: "Dave, Kirkgate Motors",
  },
  {
    months: 36,
    dealer: "Kirkgate Motors",
    to: "Sarah",
    car: "2019 Ford Focus 1.0 EcoBoost",
    subject: "Three years in the Focus",
    body: [
      "Hi Sarah, three years ago this month you picked up the Focus from us.",
      "If you're starting to think about what's next, we'd happily give you a figure for it first, before you try anywhere else.",
    ],
    sign: "Dave, Kirkgate Motors",
  },
  {
    months: 60,
    dealer: "Kirkgate Motors",
    to: "Mr Patel",
    car: "2018 Skoda Octavia Estate",
    subject: "Five years with the Octavia",
    body: [
      "Mr Patel, five years with the Octavia. That's a car that's been looked after.",
      "We've a few estates coming in this month. If you'd like first look before they're listed, reply and I'll send them over.",
    ],
    sign: "Dave, Kirkgate Motors",
  },
];

export const video = {
  title: "Wynback in 60 seconds",
  line: "The whole thing, start to finish: your sales list goes in, personal emails go out, replies come back to you.",
  fallbackAction: "See it live on a demo",
};

// DRAFT founder story. Written in the founder's voice from the brief; replace with the real story.
// Words wrapped in [[ ]] are highlighted; the last paragraph is the link to book.
export const founder = {
  heading: "Why Wynback exists",
  paragraphs: [
    "Every dealer I talk to says the same thing. The car leaves the forecourt and the customer [[goes quiet]]. Not because they were unhappy. Because nobody kept in touch.",
    "Three, four years later they're ready to change, and they buy from whoever happens to be in front of them that week. [[Usually not you.]] Meanwhile you're paying [[portals and auctions]] to find customers and cars you've already had once.",
    "I built Wynback to fix that one thing. It writes to every customer you've sold to, at the moments that matter in ownership, about [[their actual car]], in a voice that sounds like your showroom, not a call centre. Replies come to [[your own inbox]]. Your team just approves.",
    "And when a salesperson moves on, the relationship stays with [[the business, not the individual]].",
  ],
  close: "Give me 20 minutes and I'll show you it working on your own list.",
  sign: "Founder, Wynback",
};

// DRAFT: the four leaks, rewritten from the brief. Confirm the wording against the live site.
export const leaks = {
  heading: "Four leaks on every forecourt",
  items: [
    {
      name: "The handover goes quiet",
      line: "After the keys change hands, most dealers never write again. Silence is how a happy customer becomes someone else's.",
    },
    {
      name: "The part-ex goes elsewhere",
      line: "When they're ready to change, they trade in wherever they buy. A car you sold, know and could have bought back ends up in a rival's stock.",
    },
    {
      name: "You buy stock at auction",
      line: "So you pay buyer's fees and transport for cars you'd have had first refusal on, with none of the history you already know.",
    },
    {
      name: "The salesperson takes the contacts",
      line: "When your best salesperson moves on, their customers move with them. The relationship belonged to a person, not the business.",
    },
  ],
};

export const steps = {
  heading: "Three steps, ten minutes",
  intro: "Nothing to learn and nothing to build. You send the list once; after that it runs every month and you approve what goes out.",
  items: [
    {
      name: "Upload your sales",
      body: "Export past sales from your DMS as a CSV: name, email, the car and the date sold. No integration on day one, and we set it up for free.",
    },
    {
      name: "We write to every customer",
      body: `At ${milestoneList} months of ownership, Wynback writes each customer an email about their own car, with a soft, natural reason to get back in touch.`,
    },
    {
      name: "You approve, they reply to you",
      body: "Your team reads the month's emails and clicks approve. Replies land in your own inbox, ready to become a part-ex, a service or a sale.",
    },
  ],
  close: "That's it. No campaigns to build, no lists to manage. Most dealers spend under 10 minutes a month keeping it running.",
  action: "See it in action: book a demo",
};

export const benefits = {
  headingLines: ["More sales.", "Cheaper stock."],
  intro: "Wynback is built to drive three outcomes: more sales, better retention and cheaper stock.",
  items: [
    {
      name: "More sales, not more ad spend",
      body: "Every email goes to someone who already knows and trusts your dealership. No portal fees, no click costs, no competing with every other dealer in your postcode.",
      terms: ["No portal fees", "No click costs", "Warm buyers"],
    },
    {
      name: "Buy back cars you sold",
      body: "Re-engaging past owners gives you first refusal on stock you understand. No auction premium, no transport, no surprises.",
      terms: ["First refusal", "Known history", "No auction fees"],
    },
    {
      name: "Stronger relationships",
      body: "A well-timed, personal email at the milestones that matter keeps you front of mind. Customers feel looked after, not sold to.",
      terms: ["Front of mind", "Looked after", "Repeat custom"],
    },
    {
      name: "Works while you sleep",
      body: "The system runs every month on its own. Your team reviews the emails and clicks approve; everything else is handled.",
      terms: ["Monthly", "Automatic", "Approve and go"],
    },
    {
      name: "No marketing skills needed",
      body: "The AI writes every email in a warm, human tone, naming the exact car the customer bought, with a soft, natural call to action.",
      terms: ["No copywriting", "Your voice", "Their car"],
    },
  ],
};

export type PlanId = "forecourt" | "showroom" | "supersite";

export const plans: {
  id: PlanId;
  name: string;
  monthly: number;
  stock: string;
  note?: string;
}[] = [
  { id: "forecourt", name: "Forecourt", monthly: 49, stock: "Up to 25 vehicles in stock" },
  { id: "showroom", name: "Showroom", monthly: 75, stock: "Up to 100 vehicles in stock", note: "Most popular" },
  { id: "supersite", name: "Supersite", monthly: 150, stock: "100+ vehicles in stock" },
];

export const ANNUAL_DISCOUNT = 0.2;

export const pricing = {
  heading: "Choose your trim",
  intro: "One extra sale usually pays for the whole year. Pick the plan that matches how many vehicles you keep in stock.",
  terms: "No setup fees. Cancel or change plans anytime.",
  includesHeading: "Every plan includes",
  includes: [
    "Free setup: we configure your milestone sequences, you don't touch anything",
    "Replies land in your own inbox, never a shared portal you have to check",
    `Fully automated ownership-milestone emails at ${MILESTONES.join("/")} months`,
    "Under 10 minutes a month of admin: no campaigns to build, no lists to manage",
    "Your data stays yours: export anytime, no lock-in",
    "Cancel anytime, no long contracts",
    "A simple dashboard: opens, replies and bookings, at a glance",
    "GDPR-compliant sending, with unsubscribes handled automatically",
    "CSV import to get started, no DMS integration needed on day one",
  ],
};

// The ROI model. The defaults reproduce the figures on the current site:
// 20 cars a month → 240 a year → 5% come back → 12 sales × £1,200 = £14,400 gross,
// minus Showroom at £75 × 12 = £900, leaves £13,500 net.
// DRAFT: confirm the 5% and £1,200 assumptions are the ones the live calculator uses.
export const roi = {
  heading: "What your past sales are worth",
  note: "You've already paid to win these customers once. Set your own numbers and see what your list could bring back in a year.",
  defaults: { carsPerMonth: 20, profitPerCar: 1200, winBackRate: 5, plan: "showroom" as PlanId },
  limits: { carsMin: 1, carsMax: 200, profitMin: 100, profitMax: 5000, rateMin: 1, rateMax: 20 },
};

// DRAFT answers: the questions are from the live site, the answers were written for this build.
export const faq = {
  heading: "Questions",
  items: [
    {
      q: "What kind of results can I expect?",
      a: "It depends on how many cars you've sold and how long you've been trading. The calculator above uses your own numbers; on the demo we'll run it against your actual sales list so you can judge it for yourself.",
    },
    {
      q: "What data do I need to upload?",
      a: "A CSV of past sales: the customer's name and email, the car (make, model, registration) and the date it was sold. Most DMS systems export that in a couple of clicks. We do the setup.",
    },
    {
      q: "How secure is my customer data?",
      a: "Your data is only used to send your emails. Sending is GDPR-compliant, unsubscribes are handled automatically, and you can export or remove your data at any time. It stays yours.",
    },
    {
      q: "Do I need marketing experience?",
      a: "No. The emails are written for you, in a warm, plain tone, about each customer's own car. Your team reads them and clicks approve. That's the whole job.",
    },
  ],
  more: "Still have questions? Get them answered in 20 minutes.",
  lead: "Straight answers to what dealers ask first. Anything else, ask us on the call.",
};

export const cta = {
  word: "Book",
  line: "20 minutes on a call. We'll show you Wynback running on your own sales list.",
};

export const footer = {
  about: "Milestone emails that win back past customers for UK independent car dealers.",
  contactLine: "Book 20 minutes",
  place: "United Kingdom",
};

export const contactPage = {
  title: "Talk to Wynback",
  line: "The quickest way is a 20-minute call. Pick a time that suits and we'll walk through Wynback on your own sales list.",
  agendaHeading: "What happens on the call",
  agenda: [
    { name: "Your numbers", body: "We run the ROI calculator against your real monthly sales and margins." },
    { name: "Your emails", body: "You see the emails Wynback would write to your own past customers, at each milestone." },
    { name: "Your setup", body: "If it makes sense, we take your CSV and set everything up. No fee, no contract." },
  ],
};
