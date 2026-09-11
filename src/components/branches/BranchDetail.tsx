import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import { useBranch } from '@/context/BranchContext';
import { BRAND_CONTACT } from '@/lib/brand';
import type { Branch, Room } from '@/types/database';

/* ============================================================
   BRANCH SPECIFIC METADATA & RICH GALLERY DATA
   ============================================================ */

export interface BranchExtendedInfo {
  id: string;
  tagline: string;
  description: string;
  rating: number;
  reviewsCount: number;
  heroImage: string;
  features: string[];
  gallery: {
    url: string;
    title: string;
    category: 'exterior' | 'rooms' | 'gardens' | 'conference' | 'amenities';
  }[];
}

export const BRANCH_EXTENDED_DATA: Record<string, BranchExtendedInfo> = {
  'branch-northend': {
    id: 'branch-northend',
    tagline: 'Serene suburban sanctuary with lush botanical gardens and executive suites',
    description:
      'Harris Northend is nestled in the quiet, prestigious Northend district of Bulawayo. Known for its expansive manicured gardens, private verandas, and peaceful ambiance, it is the premier choice for executive travelers, diplomatic delegates, and families seeking refined relaxation.',
    rating: 4.9,
    reviewsCount: 48,
    heroImage: '/images/home/welcome_villa.jpg',
    features: [
      'Lush Landscaped Botanical Gardens',
      '24/7 Solar & Silent Generator Power',
      'High-Speed Enterprise Fiber WiFi',
      'Dedicated Executive Boardroom',
      'Outdoor Swimming Pool & Sun Patio',
      'Secure Monitored Perimeter & Parking',
      'Full Daily Housekeeping & Room Service',
      'Private Airport Transfer on Request',
    ],
    gallery: [
      { url: '/images/home/welcome_villa.jpg', title: 'Main Villa Exterior & Garden Grounds', category: 'exterior' },
      { url: '/images/home/room_deluxe.jpg', title: 'Executive Master Bedroom Suite', category: 'rooms' },
      { url: '/images/home/room_junior_suite.jpg', title: 'Deluxe Garden View Room', category: 'rooms' },
      { url: '/images/home/room_standard.jpg', title: 'Standard Comfort Room', category: 'rooms' },
      { url: '/images/home/hero_pool.jpg', title: 'Swimming Pool & Sun Loungers', category: 'amenities' },
      { url: '/images/home/conference_hall.jpg', title: 'Northend Corporate Conference Hall', category: 'conference' },
      { url: '/images/home/welcome_beach.jpg', title: 'Garden Dining Patio & Veranda', category: 'gardens' },
      { url: '/images/home/services_bedroom.jpg', title: 'Guest Lounge & Sitting Area', category: 'rooms' },
    ],
  },
  'branch-sunone': {
    id: 'branch-sunone',
    tagline: 'Vibrant, sun-drenched hospitality with prime central accessibility',
    description:
      'Conveniently situated at Sunone Plaza, Harris Sunone blends contemporary style with maximum convenience. Featuring bright airy rooms, fast connectivity, and seamless access to central Bulawayo attractions, it is ideal for on-the-go professionals and holidaymakers.',
    rating: 4.8,
    reviewsCount: 36,
    heroImage: '/images/home/hero_pool.jpg',
    features: [
      'Prime Central Access & Transportation',
      'Sunlit Swimming Pool & Deck',
      '24/7 Backup Power & Water Reserves',
      'Fiber Internet in Every Room',
      'Conference & Workshop Facilities',
      '24/7 Front Desk Concierge',
      'Complimentary Secure Parking',
      'Onsite Refreshment & Dining Lounge',
    ],
    gallery: [
      { url: '/images/home/hero_pool.jpg', title: 'Poolside Terrace & Sun Deck', category: 'amenities' },
      { url: '/images/home/room_deluxe.jpg', title: 'Sunone Deluxe Suite', category: 'rooms' },
      { url: '/images/home/welcome_beach.jpg', title: 'Outdoor Patio Seating', category: 'exterior' },
      { url: '/images/home/room_standard.jpg', title: 'Standard Double Room', category: 'rooms' },
      { url: '/images/home/conference_hall.jpg', title: 'Multi-purpose Seminar Room', category: 'conference' },
      { url: '/images/home/services_bedroom.jpg', title: 'Guest Sitting Room', category: 'rooms' },
    ],
  },
  'branch-prime': {
    id: 'branch-prime',
    tagline: 'Sophisticated corporate and diplomatic hub in Prime Commercial Centre',
    description:
      'Harris Prime stands as a benchmark of modern refinement in Bulawayo’s commercial sector. Designed specifically for executives, diplomats, and international visitors, it offers quiet workspaces, premium bedding, and state-of-the-art meeting spaces.',
    rating: 4.9,
    reviewsCount: 52,
    heroImage: '/images/home/room_junior_suite.jpg',
    features: [
      'Dedicated Work Desks & Fiber WiFi',
      'VIP Concierge & Fast-Track Check-In',
      'High-Tech Conference & Boardroom',
      'Silent Power Backup (100% Uptime)',
      '24/7 CCTV & Private Gated Compound',
      'Executive Dining & Breakfast Area',
      'Laundry & Dry Cleaning Service',
      'Airport & City Chauffeur Available',
    ],
    gallery: [
      { url: '/images/home/room_junior_suite.jpg', title: 'Executive Premier Suite', category: 'rooms' },
      { url: '/images/home/boardroom.jpg', title: 'Prime Executive Boardroom', category: 'conference' },
      { url: '/images/home/room_deluxe.jpg', title: 'Deluxe King Suite', category: 'rooms' },
      { url: '/images/home/welcome_villa.jpg', title: 'Prime Compound & Grounds', category: 'exterior' },
      { url: '/images/home/conference_hall.jpg', title: 'Banqueting & Event Hall', category: 'conference' },
      { url: '/images/home/room_standard.jpg', title: 'Standard Business Room', category: 'rooms' },
    ],
  },
  'branch-zim-harris': {
    id: 'branch-zim-harris',
    tagline: 'Authentic Zimbabwean heritage charm with modern sanctuary comfort',
    description:
      'Zim Harris pays tribute to rich local hospitality and warm Zimbabwean traditions. Surrounded by indigenous trees and tranquil courtyards, guests enjoy authentic charm paired with plush modern amenities.',
    rating: 4.8,
    reviewsCount: 41,
    heroImage: '/images/home/welcome_beach.jpg',
    features: [
      'Traditional Heritage-Inspired Architecture',
      'Tranquil Garden Courtyard & Patios',
      'Full 24/7 Power & Water Redundancy',
      'High-Speed Wi-Fi Throughout',
      'Conference & Group Gathering Spaces',
      'Artisanal Breakfast & Catering Options',
      '24/7 Monitored Onsite Security',
      'Dedicated Tour & Excursion Desk',
    ],
    gallery: [
      { url: '/images/home/welcome_beach.jpg', title: 'Heritage Courtyard & Veranda', category: 'exterior' },
      { url: '/images/home/room_deluxe.jpg', title: 'Zim Harris Deluxe Suite', category: 'rooms' },
      { url: '/images/home/room_family.jpg', title: 'Spacious Family Accommodation', category: 'rooms' },
      { url: '/images/home/hero_pool.jpg', title: 'Swimming Pool & Garden Lawn', category: 'amenities' },
      { url: '/images/home/conference_hall.jpg', title: 'Community & Event Hall', category: 'conference' },
    ],
  },
  'branch-qatha': {
    id: 'branch-qatha',
    tagline: 'Intimate boutique hideaway offering secluded peace and tailored care',
    description:
      'A cozy boutique lodge located in Qatha Precinct, offering a quiet, personal, and restorative environment. Perfect for long stays, quiet reading, or romantic getaways with attentive personalized hospitality.',
    rating: 4.8,
    reviewsCount: 29,
    heroImage: '/images/home/services_bedroom.jpg',
    features: [
      'Intimate Boutique Setting',
      'Private Verandas & Balconies',
      'Uninterrupted 24/7 Solar Power',
      'Fiber Internet & Streaming Support',
      'Peaceful Landscaped Garden Corners',
      'Personalized Concierge & Host Care',
      'Gated Compound with 24/7 Guards',
      'Self-Catering & Dining Options',
    ],
    gallery: [
      { url: '/images/home/services_bedroom.jpg', title: 'Boutique Master Suite', category: 'rooms' },
      { url: '/images/home/welcome_villa.jpg', title: 'Qatha Garden Grounds', category: 'exterior' },
      { url: '/images/home/room_standard.jpg', title: 'Standard Serene Bedroom', category: 'rooms' },
      { url: '/images/home/welcome_beach.jpg', title: 'Outdoor Reading Patio', category: 'gardens' },
      { url: '/images/home/room_deluxe.jpg', title: 'Deluxe Ensuite Bathroom & Suite', category: 'rooms' },
    ],
  },
  'branch-clark': {
    id: 'branch-clark',
    tagline: 'Classic architectural grace in the serene Clark Heritage Quarter',
    description:
      'Located in the historic Clark neighborhood, Harris Clark combines high ceilings, classic colonial charm, and shaded avenues with modern fiber internet, air conditioning, and premium mattresses for restful sleep.',
    rating: 4.9,
    reviewsCount: 38,
    heroImage: '/images/home/welcome_villa.jpg',
    features: [
      'Classic High-Ceiling Architecture',
      'Shaded Garden Lawns & Patios',
      'Corporate Meeting & Boardroom Facilities',
      '24/7 Solar Backup & Water Tanks',
      'Fast Fiber Wireless Network',
      'Secure Gated Vehicle Parking',
      'Friendly 24/7 Reception Team',
      'Airport Pick-up Available',
    ],
    gallery: [
      { url: '/images/home/welcome_villa.jpg', title: 'Clark Historic Villa Grounds', category: 'exterior' },
      { url: '/images/home/room_junior_suite.jpg', title: 'Clark Junior Suite', category: 'rooms' },
      { url: '/images/home/boardroom.jpg', title: 'Clark Meeting Boardroom', category: 'conference' },
      { url: '/images/home/room_standard.jpg', title: 'Comfort Standard Room', category: 'rooms' },
      { url: '/images/home/hero_pool.jpg', title: 'Pool & Garden Lounge', category: 'amenities' },
    ],
  },
  'branch-romney-park': {
    id: 'branch-romney-park',
    tagline: 'Expansive parkland views, fresh air, and spacious family suites',
    description:
      'Overlooking lush parkland in Romney Park, this branch is known for fresh breezes, broad lawns, and expansive multi-bedroom suites ideal for large groups, wedding parties, and holiday retreats.',
    rating: 4.9,
    reviewsCount: 44,
    heroImage: '/images/home/room_family.jpg',
    features: [
      'Parkland Surroundings & Walking Paths',
      'Spacious Family & Executive Suites',
      'Banqueting & Conference Venue',
      '24/7 Full Power & Hot Water Backup',
      'High-Speed Wi-Fi Across Property',
      'Swimming Pool & BBQ Terrace',
      'Child-Friendly Enclosed Gardens',
      '24/7 Security Patrol & CCTV',
    ],
    gallery: [
      { url: '/images/home/room_family.jpg', title: 'Romney Park Family Suite', category: 'rooms' },
      { url: '/images/home/welcome_villa.jpg', title: 'Parkland Estate View', category: 'exterior' },
      { url: '/images/home/conference_hall.jpg', title: 'Grand Banqueting & Event Hall', category: 'conference' },
      { url: '/images/home/room_deluxe.jpg', title: 'Deluxe Parkland Suite', category: 'rooms' },
      { url: '/images/home/hero_pool.jpg', title: 'Swimming Pool & Lawn Grounds', category: 'amenities' },
    ],
  },
  'branch-silver-sands': {
    id: 'branch-silver-sands',
    tagline: 'Sun-drenched holiday resort atmosphere with sparkling pool and palms',
    description:
      'Step into a tropical resort-style getaway at Harris Silver Sands. Palm trees, crystal blue waters, and breezy cocktail verandas create a rejuvenating vacation experience right in Bulawayo.',
    rating: 4.8,
    reviewsCount: 33,
    heroImage: '/images/home/hero_pool.jpg',
    features: [
      'Resort Swimming Pool & Sunbathing Deck',
      'Tropical Garden Verandas',
      '24/7 Solar & Generator Support',
      'High-Speed Guest WiFi',
      'Poolside Beverage & Breakfast Area',
      'Air-Conditioned Luxury Suites',
      'Secure Gated Parking with CCTV',
      '24/7 Front Desk & Concierge',
    ],
    gallery: [
      { url: '/images/home/hero_pool.jpg', title: 'Silver Sands Pool & Deck', category: 'amenities' },
      { url: '/images/home/welcome_beach.jpg', title: 'Palm Veranda & Loungers', category: 'gardens' },
      { url: '/images/home/room_deluxe.jpg', title: 'Silver Sands Deluxe Suite', category: 'rooms' },
      { url: '/images/home/room_standard.jpg', title: 'Cozy Resort Standard Room', category: 'rooms' },
      { url: '/images/home/welcome_villa.jpg', title: 'Resort Exterior Compound', category: 'exterior' },
    ],
  },
  'branch-london': {
    id: 'branch-london',
    tagline: 'English-inspired elegance with tailored refinement along London Road',
    description:
      'Harris London combines timeless British understated elegance with warm Zimbabwean hospitality. Featuring manicured boxwood hedges, tasteful artwork, and cozy reading parlours.',
    rating: 4.9,
    reviewsCount: 40,
    heroImage: '/images/home/room_deluxe.jpg',
    features: [
      'English Courtyard & Manicured Hedges',
      'Executive Suites with Plush Bedding',
      'Boardroom & Executive Meeting Facility',
      'Uninterrupted 24/7 Power Supply',
      'Fiber Internet & Workstations',
      'Quiet Residential Location',
      'Dedicated 24/7 Security & CCTV',
      'Artisanal Coffee & Tea Service',
    ],
    gallery: [
      { url: '/images/home/room_deluxe.jpg', title: 'London Road Master Deluxe Suite', category: 'rooms' },
      { url: '/images/home/welcome_villa.jpg', title: 'English Courtyard Estate', category: 'exterior' },
      { url: '/images/home/conference_hall.jpg', title: 'Corporate Boardroom', category: 'conference' },
      { url: '/images/home/room_junior_suite.jpg', title: 'London Junior Suite', category: 'rooms' },
      { url: '/images/home/hero_pool.jpg', title: 'Swimming Pool & Sun Deck', category: 'amenities' },
    ],
  },
  'branch-villa': {
    id: 'branch-villa',
    tagline: 'Exclusive private villa ambiance with terrace dining and lush seclusion',
    description:
      'Harris Villa offers a secluded luxury villa experience. Featuring sweeping sun terraces, lush bougainvillea gardens, and bespoke personalized dining, it is ideal for intimate retreats and executive VIPs.',
    rating: 4.9,
    reviewsCount: 57,
    heroImage: '/images/home/welcome_villa.jpg',
    features: [
      'Private Luxury Villa Setting',
      'Sunlit Panoramic Dining Terraces',
      'Executive Conference & Dining Hall',
      '24/7 Solar & Power Redundancy',
      'High-Speed Enterprise Internet',
      'Landscaped Gardens & Fountain Patio',
      'Gated Compound with 24/7 Guards',
      'VIP Airport Limousine & Chauffeur',
    ],
    gallery: [
      { url: '/images/home/welcome_villa.jpg', title: 'Villa Grand Facade & Lawns', category: 'exterior' },
      { url: '/images/home/welcome_beach.jpg', title: 'Terrace Dining & Fountain Patio', category: 'gardens' },
      { url: '/images/home/room_deluxe.jpg', title: 'Villa Luxury King Suite', category: 'rooms' },
      { url: '/images/home/room_junior_suite.jpg', title: 'Junior Suite with Garden Balcony', category: 'rooms' },
      { url: '/images/home/conference_hall.jpg', title: 'Villa Private Banquet Hall', category: 'conference' },
      { url: '/images/home/hero_pool.jpg', title: 'Secluded Pool & Deck', category: 'amenities' },
    ],
  },
  'branch-executive': {
    id: 'branch-executive',
    tagline: 'The pinnacle of luxury in Bulawayo’s diplomatic and financial corridor',
    description:
      'Harris Executive is our flagship luxury hotel, engineered for top-tier executives, diplomats, and international dignitaries. Enjoy bespoke butler service, marble bathrooms, and ultra-high-speed encrypted connectivity.',
    rating: 5.0,
    reviewsCount: 65,
    heroImage: '/images/home/boardroom.jpg',
    features: [
      'Presidential & Executive Suites',
      'Diplomatic Boardroom with 4K AV',
      'Dedicated 24/7 Concierge & Butler',
      'Dual Grid + Solar 100% Power Backup',
      'Secure Monitored Underground Parking',
      'Marble Ensuites & Deep Soaking Baths',
      'High-Security Compound & Access Control',
      'Private Airport Transfer Service',
    ],
    gallery: [
      { url: '/images/home/boardroom.jpg', title: 'Executive High-Tech Boardroom', category: 'conference' },
      { url: '/images/home/room_junior_suite.jpg', title: 'Executive Presidential Suite', category: 'rooms' },
      { url: '/images/home/room_deluxe.jpg', title: 'Deluxe Marble Ensuite Room', category: 'rooms' },
      { url: '/images/home/welcome_villa.jpg', title: 'Executive Tower Grounds', category: 'exterior' },
      { url: '/images/home/hero_pool.jpg', title: 'Executive Swimming Pool & Spa', category: 'amenities' },
      { url: '/images/home/conference_hall.jpg', title: 'Diplomatic Summit Hall', category: 'conference' },
    ],
  },
};

/* ============================================================
   STYLED COMPONENTS
   ============================================================ */

const PageContainer = styled.div`
  width: 100%;
  background: #FAFCFB;
  min-height: 100vh;
`;

const BranchHero = styled.section<{ $bgImage: string }>`
  position: relative;
  min-height: 480px;
  background: linear-gradient(180deg, rgba(0, 41, 33, 0.45) 0%, rgba(0, 41, 33, 0.88) 100%),
    url(${(p) => p.$bgImage}) center / cover no-repeat;
  color: #FFFFFF;
  display: flex;
  align-items: flex-end;
  padding: 5rem 1.5rem 4rem;

  @media (max-width: 768px) {
    min-height: 400px;
    padding: 4rem 1.25rem 3rem;
  }
`;

const HeroInner = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  width: 100%;

  .breadcrumbs {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.82rem;
    margin-bottom: 1rem;
    color: rgba(255, 255, 255, 0.8);

    button {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.8);
      cursor: pointer;
      padding: 0;
      font-size: inherit;
      &:hover {
        color: #D97E26;
      }
    }
    .current {
      color: #D97E26;
      font-weight: 600;
    }
  }

  .badge-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.85rem;
    flex-wrap: wrap;
  }

  .location-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    background: rgba(217, 126, 38, 0.25);
    border: 1px solid #D97E26;
    color: #FFAE58;
    padding: 0.35rem 0.85rem;
    border-radius: 50px;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    backdrop-filter: blur(4px);
  }

  .rating-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    background: rgba(255, 255, 255, 0.15);
    padding: 0.35rem 0.75rem;
    border-radius: 50px;
    font-size: 0.8rem;
    font-weight: 700;
    backdrop-filter: blur(4px);
  }

  h1 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(2.2rem, 5vw, 3.6rem);
    line-height: 1.15;
    margin-bottom: 0.75rem;
    color: #FFFFFF;
  }

  .tagline {
    font-size: clamp(1rem, 2vw, 1.25rem);
    color: rgba(255, 255, 255, 0.9);
    max-width: 780px;
    line-height: 1.5;
    margin-bottom: 1.75rem;
  }

  .cta-row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;
  }
`;

const PrimaryGoldBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #D97E26;
  color: #FFFFFF;
  border: none;
  padding: 0.9rem 1.8rem;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(217, 126, 38, 0.35);
  transition: all 200ms ease;

  &:hover {
    background: #BF6A1B;
    transform: translateY(-2px);
    box-shadow: 0 10px 26px rgba(217, 126, 38, 0.45);
  }
`;

const SecondaryOutlineBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.12);
  color: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 0.9rem 1.6rem;
  border-radius: 4px;
  font-size: 0.92rem;
  font-weight: 600;
  text-decoration: none;
  backdrop-filter: blur(4px);
  transition: all 200ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: #FFFFFF;
    color: #FFFFFF;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  padding: 3.5rem 1.5rem 6rem;
`;

const SectionHeading = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #D97E26;
    margin-bottom: 0.4rem;
  }

  h2 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.8rem, 3vw, 2.5rem);
    color: #00382E;
    margin-bottom: 0.6rem;
  }

  p {
    color: rgba(26, 46, 30, 0.75);
    max-width: 680px;
    margin: 0 auto;
    font-size: 0.95rem;
    line-height: 1.6;
  }
`;

/* ── 2. Photo Gallery Showcase ── */
const GalleryFilterRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const GalleryFilterBtn = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.82rem;
  font-weight: ${(p) => (p.$active ? 700 : 500)};
  background: ${(p) => (p.$active ? '#006A56' : '#FFFFFF')};
  color: ${(p) => (p.$active ? '#FFFFFF' : '#00382E')};
  border: 1px solid ${(p) => (p.$active ? '#006A56' : 'rgba(0, 106, 86, 0.18)')};
  cursor: pointer;
  transition: all 180ms ease;

  &:hover {
    border-color: #006A56;
    background: ${(p) => (p.$active ? '#006A56' : '#F4FAF7')};
  }
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-bottom: 4rem;
`;

const GalleryCard = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  height: 240px;
  box-shadow: 0 4px 16px rgba(0, 106, 86, 0.08);
  border: 1px solid rgba(0, 106, 86, 0.1);
  cursor: pointer;
  group: true;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 400ms ease;
  }

  &:hover img {
    transform: scale(1.06);
  }

  .caption-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 40%, rgba(0, 41, 33, 0.92) 100%);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 1.25rem;
    color: #FFFFFF;
    transition: opacity 250ms ease;

    .cat-tag {
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #FFAE58;
      margin-bottom: 0.2rem;
    }
    .img-title {
      font-size: 0.9rem;
      font-weight: 600;
      line-height: 1.3;
    }
  }
`;

/* ── 3. Branch Highlights & Features ── */
const HighlightsSection = styled.div`
  background: #FFFFFF;
  border-radius: 10px;
  border: 1px solid rgba(0, 106, 86, 0.12);
  box-shadow: 0 10px 30px rgba(0, 106, 86, 0.06);
  padding: 2.5rem;
  margin-bottom: 4.5rem;
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 3rem;
  align-items: center;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    padding: 2rem 1.5rem;
  }

  .about-col {
    h3 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.8rem;
      color: #00382E;
      margin-bottom: 1rem;
    }
    p {
      color: #475569;
      font-size: 0.95rem;
      line-height: 1.7;
      margin-bottom: 1.5rem;
    }
  }

  .features-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.85rem;

    @media (max-width: 560px) {
      grid-template-columns: 1fr;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background: #F4FAF7;
      border: 1px solid rgba(0, 106, 86, 0.12);
      padding: 0.75rem 0.95rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      color: #00382E;

      svg {
        color: #D97E26;
        flex-shrink: 0;
      }
    }
  }
`;

/* ── 4. Rooms Available At This Branch ── */
const RoomsSectionWrap = styled.div`
  margin-bottom: 4.5rem;
`;

const RoomsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
`;

const RoomCard = styled.div`
  background: #FFFFFF;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(0, 106, 86, 0.12);
  box-shadow: 0 6px 20px rgba(0, 106, 86, 0.05);
  display: flex;
  flex-direction: column;
  transition: transform 250ms ease, box-shadow 250ms ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 106, 86, 0.12);
  }

  .room-img {
    height: 220px;
    position: relative;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .room-tier-badge {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: #006A56;
      color: #FFFFFF;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 0.35rem 0.75rem;
      border-radius: 3px;
    }

    .room-price-pill {
      position: absolute;
      bottom: 1rem;
      right: 1rem;
      background: rgba(0, 41, 33, 0.9);
      color: #FFAE58;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.15rem;
      font-weight: 700;
      padding: 0.35rem 0.85rem;
      border-radius: 4px;
      backdrop-filter: blur(4px);
    }
  }

  .room-info {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    flex: 1;

    h4 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.35rem;
      color: #00382E;
      margin-bottom: 0.35rem;
    }

    .room-specs {
      display: flex;
      gap: 1rem;
      font-size: 0.82rem;
      color: #64748B;
      margin-bottom: 0.85rem;

      span {
        display: flex;
        align-items: center;
        gap: 0.3rem;
      }
    }

    p {
      font-size: 0.88rem;
      color: #555555;
      line-height: 1.6;
      margin-bottom: 1.25rem;
      flex: 1;
    }

    .book-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.45rem;
      background: #006A56;
      color: #FFFFFF;
      border: none;
      padding: 0.75rem 1.25rem;
      border-radius: 4px;
      font-weight: 700;
      font-size: 0.88rem;
      cursor: pointer;
      transition: background 200ms ease;

      &:hover {
        background: #D97E26;
      }
    }
  }
`;

/* ── 5. Location & Map Section ── */
const MapSection = styled.div`
  background: #FFFFFF;
  border-radius: 10px;
  border: 1px solid rgba(0, 106, 86, 0.12);
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 106, 86, 0.06);
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  margin-bottom: 4.5rem;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }

  .map-details {
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    h3 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.6rem;
      color: #00382E;
      margin-bottom: 1.25rem;
    }

    .contact-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      font-size: 0.9rem;
      color: #334155;
      margin-bottom: 1.75rem;

      .item {
        display: flex;
        align-items: flex-start;
        gap: 0.65rem;
        svg {
          color: #006A56;
          flex-shrink: 0;
          margin-top: 2px;
        }
      }
    }

    .dir-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background: #006A56;
      color: #FFFFFF;
      padding: 0.8rem 1.4rem;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.9rem;
      transition: background 200ms ease;

      &:hover {
        background: #D97E26;
      }
    }
  }

  .map-frame {
    min-height: 380px;
    iframe {
      width: 100%;
      height: 100%;
      border: none;
      min-height: 380px;
    }
  }
`;



/* ============================================================
   MAIN BRANCH DETAIL COMPONENT
   ============================================================ */

export interface BranchDetailProps {
  branchId?: string;
  onBookRoom: (room?: Room | null) => void;
  onBookConference?: (branchId?: string) => void;
  onNavigateHome: () => void;
}

export function BranchDetail({
  branchId,
  onBookRoom,
  onBookConference,
  onNavigateHome,
}: BranchDetailProps) {
  const { branches, currentBranch, setCurrentBranchById } = useBranch();

  // Active branch resolution
  const activeBranch: Branch = useMemo(() => {
    if (branchId) {
      const found = branches.find((b) => b.id === branchId);
      if (found) return found;
    }
    return currentBranch || branches[0];
  }, [branchId, currentBranch, branches]);

  const extInfo = BRANCH_EXTENDED_DATA[activeBranch?.id] || BRANCH_EXTENDED_DATA['branch-northend'];

  // Gallery filter tab
  const [galleryTab, setGalleryTab] = useState<'all' | 'rooms' | 'exterior' | 'gardens' | 'amenities' | 'conference'>('all');

  const filteredGallery = useMemo(() => {
    if (galleryTab === 'all') return extInfo.gallery;
    return extInfo.gallery.filter((g) => g.category === galleryTab);
  }, [extInfo, galleryTab]);

  // Handle Switch to another branch
  const handleSelectBranch = (id: string) => {
    setCurrentBranchById(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PageContainer>
      {/* 1. Branch Hero Banner */}
      <BranchHero $bgImage={extInfo.heroImage}>
        <HeroInner>
          <div className="breadcrumbs">
            <button onClick={onNavigateHome}>Home</button>
            <span>/</span>
            <span>Branches</span>
            <span>/</span>
            <span className="current">{activeBranch.name}</span>
          </div>

          <div className="badge-row">
            <div className="location-pill">
              <Icon icon="mdi:map-marker" width={14} height={14} />
              <span>{activeBranch.location} · BULAWAYO</span>
            </div>
            <div className="rating-badge">
              <Icon icon="mdi:star" width={16} height={16} style={{ color: '#D97E26' }} />
              <span>{extInfo.rating} ({extInfo.reviewsCount} Google Reviews)</span>
            </div>
          </div>

          <h1>{activeBranch.name}</h1>
          <p className="tagline">{extInfo.tagline}</p>

          <div className="cta-row">
            <PrimaryGoldBtn onClick={() => onBookRoom(null)}>
              <Icon icon="mdi:calendar-check" width={18} height={18} />
              <span>Book Stay at {activeBranch.name}</span>
            </PrimaryGoldBtn>

            <SecondaryOutlineBtn
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${activeBranch.name} Bulawayo Zimbabwe`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon icon="mdi:directions" width={18} height={18} />
              <span>Google Maps Navigation</span>
            </SecondaryOutlineBtn>

            <SecondaryOutlineBtn href={`tel:${activeBranch.contact_phone || BRAND_CONTACT.centralPhone}`}>
              <Icon icon="mdi:phone" width={18} height={18} />
              <span>Call Front Desk</span>
            </SecondaryOutlineBtn>
          </div>
        </HeroInner>
      </BranchHero>

      <ContentWrapper>
        {/* 2. Photo Gallery: "How the branch looks" */}
        <SectionHeading>
          <span className="eyebrow">
            <Icon icon="mdi:camera-outline" width={16} height={16} />
            PHOTOGRAPHY &amp; TOURS
          </span>
          <h2>Explore {activeBranch.name}</h2>
          <p>
            Take a visual tour inside our accommodations, lush courtyards, swimming pools, executive lounges, and private meeting facilities.
          </p>
        </SectionHeading>

        <GalleryFilterRow>
          <GalleryFilterBtn $active={galleryTab === 'all'} onClick={() => setGalleryTab('all')}>
            All Photos ({extInfo.gallery.length})
          </GalleryFilterBtn>
          <GalleryFilterBtn $active={galleryTab === 'rooms'} onClick={() => setGalleryTab('rooms')}>
            Rooms &amp; Suites
          </GalleryFilterBtn>
          <GalleryFilterBtn $active={galleryTab === 'exterior'} onClick={() => setGalleryTab('exterior')}>
            Exterior &amp; Grounds
          </GalleryFilterBtn>
          <GalleryFilterBtn $active={galleryTab === 'gardens'} onClick={() => setGalleryTab('gardens')}>
            Gardens &amp; Patios
          </GalleryFilterBtn>
          <GalleryFilterBtn $active={galleryTab === 'amenities'} onClick={() => setGalleryTab('amenities')}>
            Pool &amp; Amenities
          </GalleryFilterBtn>
          {activeBranch.has_conference && (
            <GalleryFilterBtn $active={galleryTab === 'conference'} onClick={() => setGalleryTab('conference')}>
              Conference Halls
            </GalleryFilterBtn>
          )}
        </GalleryFilterRow>

        <GalleryGrid>
          {filteredGallery.map((img, i) => (
            <GalleryCard key={i} onClick={() => onBookRoom(null)} title={`Book a stay at ${activeBranch.name}`}>
              <img src={img.url} alt={img.title} loading="lazy" />
              <div className="caption-overlay">
                <span className="cat-tag">{img.category}</span>
                <span className="img-title">{img.title}</span>
              </div>
            </GalleryCard>
          ))}
        </GalleryGrid>

        {/* 3. Branch Highlights & Features */}
        <HighlightsSection>
          <div className="about-col">
            <h3>About {activeBranch.name}</h3>
            <p>{extInfo.description}</p>
            <PrimaryGoldBtn onClick={() => onBookRoom(null)} style={{ padding: '0.75rem 1.4rem', fontSize: '0.88rem' }}>
              <Icon icon="mdi:bed-king-outline" width={18} height={18} />
              Reserve This Branch
            </PrimaryGoldBtn>
          </div>

          <div>
            <h4 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.25rem', color: '#00382E', marginBottom: '1rem' }}>
              Branch Amenities &amp; Services
            </h4>
            <div className="features-grid">
              {extInfo.features.map((feat, i) => (
                <div key={i} className="feature-item">
                  <Icon icon="mdi:check-circle" width={18} height={18} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </HighlightsSection>

        {/* 4. Available Rooms at this Branch */}
        <RoomsSectionWrap>
          <SectionHeading>
            <span className="eyebrow">
              <Icon icon="mdi:bed-outline" width={16} height={16} />
              ACCOMMODATIONS AT THIS DESTINATION
            </span>
            <h2>Available Rooms &amp; Suites</h2>
            <p>
              Choose from our thoughtfully curated room tiers available at {activeBranch.name}, complete with rainfall showers, fiber WiFi, and luxury bedding.
            </p>
          </SectionHeading>

          <RoomsGrid>
            {/* Standard Room */}
            <RoomCard>
              <div className="room-img">
                <img src="/images/home/room_standard.jpg" alt="Standard Room" />
                <span className="room-tier-badge">Standard Room</span>
                <span className="room-price-pill">$40 / night</span>
              </div>
              <div className="room-info">
                <h4>Standard Double Room</h4>
                <div className="room-specs">
                  <span><Icon icon="mdi:account-outline" width={15} height={15} /> 2 Guests</span>
                  <span><Icon icon="mdi:bed-outline" width={15} height={15} /> 1 Queen Bed</span>
                  <span><Icon icon="mdi:wifi" width={15} height={15} /> Fiber WiFi</span>
                </div>
                <p>
                  Impeccably tailored comfort with bespoke furnishings, rainfall shower, garden tranquility, and 24/7 power backup.
                </p>
                <button
                  className="book-btn"
                  onClick={() =>
                    onBookRoom({
                      id: `room-std-${activeBranch.id}`,
                      branch_id: activeBranch.id,
                      room_type: 'standard',
                      room_number: '101',
                      price_per_night: 4000,
                      capacity: 2,
                      is_available: true,
                      description: 'Standard double room',
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                    } as Room)
                  }
                >
                  <Icon icon="mdi:calendar-check" width={16} height={16} />
                  Book Standard at {activeBranch.name}
                </button>
              </div>
            </RoomCard>

            {/* Deluxe Room */}
            <RoomCard>
              <div className="room-img">
                <img src="/images/home/room_deluxe.jpg" alt="Deluxe Room" />
                <span className="room-tier-badge" style={{ background: '#D97E26' }}>Deluxe Suite</span>
                <span className="room-price-pill">$60 / night</span>
              </div>
              <div className="room-info">
                <h4>Deluxe King Room</h4>
                <div className="room-specs">
                  <span><Icon icon="mdi:account-outline" width={15} height={15} /> 3 Guests</span>
                  <span><Icon icon="mdi:bed-outline" width={15} height={15} /> 1 King Bed</span>
                  <span><Icon icon="mdi:balcony" width={15} height={15} /> Garden Patio</span>
                </div>
                <p>
                  Premier luxury accommodation offering private veranda views, dedicated lounge seating, deep soaking tub, and VIP concierge.
                </p>
                <button
                  className="book-btn"
                  onClick={() =>
                    onBookRoom({
                      id: `room-dlx-${activeBranch.id}`,
                      branch_id: activeBranch.id,
                      room_type: 'deluxe',
                      room_number: '201',
                      price_per_night: 6000,
                      capacity: 3,
                      is_available: true,
                      description: 'Deluxe king room',
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                    } as Room)
                  }
                >
                  <Icon icon="mdi:calendar-check" width={16} height={16} />
                  Book Deluxe at {activeBranch.name}
                </button>
              </div>
            </RoomCard>

            {/* Executive Suite */}
            <RoomCard>
              <div className="room-img">
                <img src="/images/home/room_junior_suite.jpg" alt="Executive Suite" />
                <span className="room-tier-badge" style={{ background: '#00382E' }}>Executive Suite</span>
                <span className="room-price-pill">$80 / night</span>
              </div>
              <div className="room-info">
                <h4>Executive Master Suite</h4>
                <div className="room-specs">
                  <span><Icon icon="mdi:account-outline" width={15} height={15} /> 4 Guests</span>
                  <span><Icon icon="mdi:bed-outline" width={15} height={15} /> 2 King Beds</span>
                  <span><Icon icon="mdi:shield-crown-outline" width={15} height={15} /> VIP Lounge</span>
                </div>
                <p>
                  Our signature executive suite with dedicated private work study, lounge seating, VIP concierge access, and marble ensuite.
                </p>
                <button
                  className="book-btn"
                  onClick={() =>
                    onBookRoom({
                      id: `room-exec-${activeBranch.id}`,
                      branch_id: activeBranch.id,
                      room_type: 'double_executive',
                      room_number: '301',
                      price_per_night: 8000,
                      capacity: 4,
                      is_available: true,
                      description: 'Double executive suite',
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                    } as Room)
                  }
                >
                  <Icon icon="mdi:calendar-check" width={16} height={16} />
                  Book Executive at {activeBranch.name}
                </button>
              </div>
            </RoomCard>
          </RoomsGrid>
        </RoomsSectionWrap>

        {/* 5. Branch Location & Live Google Map */}
        <MapSection>
          <div className="map-details">
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D97E26', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>
                DIRECT ACCESS &amp; LOCATION
              </span>
              <h3>Location &amp; Directions</h3>
              <div className="contact-list">
                <div className="item">
                  <Icon icon="mdi:map-marker" width={22} height={22} />
                  <div>
                    <strong>Address:</strong><br />
                    {activeBranch.address || 'Bulawayo, Zimbabwe'} · {activeBranch.location}
                  </div>
                </div>
                <div className="item">
                  <Icon icon="mdi:phone-in-talk" width={22} height={22} />
                  <div>
                    <strong>Direct Branch Phone:</strong><br />
                    <a href={`tel:${activeBranch.contact_phone || BRAND_CONTACT.centralPhone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {activeBranch.contact_phone || BRAND_CONTACT.centralPhone}
                    </a>
                  </div>
                </div>
                <div className="item">
                  <Icon icon="mdi:email-outline" width={22} height={22} />
                  <div>
                    <strong>Direct Email:</strong><br />
                    <a href={`mailto:${BRAND_CONTACT.generalEmail}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {BRAND_CONTACT.generalEmail}
                    </a>
                  </div>
                </div>
                <div className="item">
                  <Icon icon="mdi:clock-time-four-outline" width={22} height={22} />
                  <div>
                    <strong>Front Desk &amp; Security:</strong><br />
                    24/7 Monitored Front Desk &amp; Secured Gate
                  </div>
                </div>
              </div>
            </div>

            <a
              className="dir-btn"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${activeBranch.name} Bulawayo Zimbabwe`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon icon="mdi:map-legend" width={18} height={18} />
              Open Live Google Maps Navigation
            </a>
          </div>

          <div className="map-frame">
            <iframe
              title={`Google Map - ${activeBranch.name}`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(`${activeBranch.name}, ${activeBranch.location}, Bulawayo, Zimbabwe`)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              loading="lazy"
              allowFullScreen
            />
          </div>
        </MapSection>
      </ContentWrapper>
    </PageContainer>
  );
}
