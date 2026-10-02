export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/profile.php?id=100086628752969',
  instagramLodges: 'https://www.instagram.com/harris_lodges_zw/?hl=en',
  instagramEntertainment: 'https://www.instagram.com/harris_entertainment_zw/?hl=en',
} as const;

export const BRAND_ASSETS = {
  logo: '/images/logo.png',
} as const;

export const BRAND_CONTACT = {
  centralPhone: '+263 77 266 7410',
  whatsappNumber: '+263 77547 7464',
  whatsappUrl: 'https://wa.me/263775477464',
  generalEmail: 'harrislodges1@gmail.com',
  enquiriesEmail: 'harrislodges1@gmail.com',
  newsletterEmail: 'harrislodges1@gmail.com',
  headquarters: 'Harris Group HQ · Bulawayo, Zimbabwe',
} as const;

export const NAV_LINKS = [
  { key: 'home', label: 'Home', icon: 'mdi:home-outline' },
  { key: 'rooms', label: 'Rooms', icon: 'mdi:bed-king-outline' },
  { key: 'conference', label: 'Conferences', icon: 'mdi:presentation' },
  { key: 'blog', label: 'Stories', icon: 'mdi:newspaper-variant-outline' },
  { key: 'contact', label: 'Contact', icon: 'mdi:card-account-mail-outline' },
] as const;

export const FOOTER_QUICK = [
  { key: 'investors', label: 'Investors' },
  { key: 'careers', label: 'Careers' },
  { key: 'press', label: 'Press Room' },
  { key: 'sustainability', label: 'Sustainability' },
  { key: 'loyalty', label: 'Loyalty Programme' },
  { key: 'news', label: 'News' },
  { key: 'tenders', label: 'Tenders' },
  { key: 'contact', label: 'Contact Us' },
] as const;

export const FEATURED_OFFERS = [
  {
    id: 'winter-warmer',
    eyebrow: 'WINTER WARMER',
    title: 'Snuggle up this season at Harris Lodges',
    copy: 'Save up to 25% on 2+ night stays across all branches when you book before the end of spring.',
    cta: 'Book winter warmer',
    tone: 'cozy',
  },
  {
    id: 'weekend-escape',
    eyebrow: 'WEEKEND ESCAPE',
    title: 'Your gateway to Zimbabwe',
    copy: 'Stay Friday to Sunday and enjoy a complimentary late checkout at 2pm on departure.',
    cta: 'Reserve weekend',
    tone: 'sun',
  },
  {
    id: 'conference-deal',
    eyebrow: 'MEETINGS & EVENTS',
    title: 'Full-day conference package',
    copy: 'Book 8+ hours and we include free Wi-Fi, setup assistance and a 50% discount on decor.',
    cta: 'Enquire now',
    tone: 'olive',
  },
] as const;

export const SIX_REASONS = [
  {
    icon: 'mdi:earth',
    title: 'A gateway to Zimbabwe',
    copy: 'Three branches strategically placed for business and leisure — from downtown to the airport and gardens.',
  },
  {
    icon: 'mdi:briefcase-outline',
    title: 'Great for business',
    copy: 'Purpose-built conference rooms, dedicated Wi-Fi, and front-desk support for any meeting format.',
  },
  {
    icon: 'mdi:heart-outline',
    title: 'Memories are made here',
    copy: 'Child-friendly properties, tranquil gardens, and the warmest welcome in Zimbabwean hospitality.',
  },
  {
    icon: 'mdi:shield-check-outline',
    title: 'Clean & secure',
    copy: 'On-site security, housekeeping and 24/7 front desk across every Harris branch.',
  },
  {
    icon: 'mdi:silverware-fork-knife',
    title: 'Self-catering freedom',
    copy: 'Room-only stays with kitchenettes in selected categories. Bring your own or use local partners.',
  },
  {
    icon: 'mdi:account-group-outline',
    title: 'Personalised service',
    copy: 'From airport transfers to anniversary surprises — the front desk designs it around you.',
  },
] as const;

export const STORIES = [
  {
    id: 's1',
    tag: 'LIFESTYLE',
    title: '72 hours in Bulawayo — a Harris Lodge city guide',
    excerpt:
      'Art galleries, coffee bars, cafe culture and sunset views. Here is our curated weekend itinerary when you stay with us in Bulawayo.',
  },
  {
    id: 's2',
    tag: 'OFFERS',
    title: 'Spring special: stay 3 nights, pay for 2 at Harris Gardens',
    excerpt:
      'Blooms in the garden, long sunny lunches and a complimentary upgrade to Upper Standard when you book a 3-night break this September.',
  },
  {
    id: 's3',
    tag: 'MEETINGS',
    title: 'Why corporates choose Harris for their year-end conferences',
    excerpt:
      'Flexible layouts, AV included, per-person packages and a dedicated events liaison — everything you need for a memorable year-end function.',
  },
] as const;
