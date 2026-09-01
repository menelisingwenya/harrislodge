import { useState, Fragment } from 'react';
import { ThemeProvider } from 'styled-components';
import { harrisTheme } from '@/theme';
import { BranchProvider, useBranch } from '@/context/BranchContext';
import { AuthProvider } from '@/context/AuthContext';
import { Header, HeroBanner, BRAND_CONTACT } from '@/components/layout/Header';
import { RoomListing } from '@/components/rooms/RoomListing';
import { BranchDetail } from '@/components/branches/BranchDetail';
import { ConferenceListing } from '@/components/conference/ConferenceListing';
import { LuxuryBookingModal } from '@/components/bookings/LuxuryBookingModal';
import type { Room } from '@/types/database';
import { Icon } from '@iconify/react';
import styled from 'styled-components';

type SectionName = 'home' | 'rooms' | 'branches' | 'conference' | 'services' | 'about' | 'contact' | 'news';

/* ============================================================
   PAGE LAYOUT & SECTION STYLES
   ============================================================ */

/* ── 1. WELCOME SECTION (DUAL-IMAGE & EDITORIAL COPY) ── */
const WelcomeSection = styled.section`
  padding: 5rem 0 4rem;
  background: #FFFFFF;

  @media (max-width: 768px) {
    padding: 3rem 0 2.5rem;
  }
`;

const WelcomeContainer = styled.div`
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 4.5rem;
  align-items: center;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  @media (max-width: 640px) {
    padding: 0 1rem;
    gap: 2rem;
  }
`;

const WelcomeImageGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;

  .img-card {
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0, 106, 86, 0.08);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 400ms ease;
      &:hover {
        transform: scale(1.04);
      }
    }
  }

  .tall {
    height: 380px;
    @media (max-width: 560px) { height: 220px; }
  }

  .offset {
    height: 380px;
    margin-top: 2rem;
    @media (max-width: 560px) {
      margin-top: 0;
      height: 220px;
    }
  }
`;

const WelcomeContent = styled.div`
  h2 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.8rem, 3.5vw, 2.75rem);
    line-height: 1.2;
    color: #006A56;
    margin-bottom: 1.25rem;
    font-weight: 700;
  }

  .lead-text {
    font-family: ${harrisTheme.fontFamily.sans};
    font-size: 16px;
    font-weight: 600;
    color: #006A56;
    line-height: 28px;
    margin-bottom: 1.25rem;
  }

  p {
    font-family: ${harrisTheme.fontFamily.sans};
    font-size: 15px;
    font-weight: 400;
    line-height: 27.75px;
    color: rgba(26, 46, 30, 0.75);
    margin-bottom: 1.25rem;
  }
`;

const GoldActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #D97E26;
  color: #FFFFFF;
  padding: 0.75rem 2rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 2px;
  margin-top: 0.5rem;
  transition: all ${harrisTheme.transitions.base};

  &:hover {
    background: #006A56;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 106, 86, 0.35);
  }
`;

/* ── 2. ROOMS AND SUITS SHOWCASE ── */
const RoomsSection = styled.section`
  padding: 5rem 0;
  background: #FAFCFB;
  border-top: 1px solid rgba(0, 106, 86, 0.06);

  @media (max-width: 768px) {
    padding: 3rem 0;
  }
`;

const RoomsContainer = styled.div`
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 1.5rem;

  @media (max-width: 640px) {
    padding: 0 1rem;
  }
`;

const RoomsHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1.5rem;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }

  .title-group {
    h2 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: clamp(1.8rem, 3vw, 2.5rem);
      color: #006A56;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .sub {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.9rem;
      color: #555555;

      &::after {
        content: '';
        display: inline-block;
        width: 40px;
        height: 2px;
        background: #D97E26;
      }
    }
  }

  .nav-arrows {
    display: flex;
    gap: 0.5rem;

    button {
      width: 40px;
      height: 40px;
      border: 1px solid #d5e5e1;
      background: #FFFFFF;
      color: #006A56;
      display: grid;
      place-items: center;
      border-radius: 2px;
      transition: all ${harrisTheme.transitions.base};

      &:hover {
        background: #006A56;
        color: #FFFFFF;
        border-color: #006A56;
      }
    }
  }
`;

const RoomsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.75rem;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const LuxuryRoomCard = styled.div`
  background: #FFFFFF;
  border-radius: 3px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 106, 86, 0.05);
  display: flex;
  flex-direction: column;
  transition: all ${harrisTheme.transitions.slow};
  border: 1px solid rgba(0, 106, 86, 0.08);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 106, 86, 0.14);
  }

  .card-media {
    position: relative;
    height: 220px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 500ms ease;
    }

    &:hover img {
      transform: scale(1.06);
    }
  }

  .card-body {
    padding: 1.5rem 1.25rem 1.25rem;
    display: flex;
    flex-direction: column;
    flex: 1;

    h3 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.25rem;
      font-weight: 700;
      color: #006A56;
      margin-bottom: 0.5rem;
    }

    p {
      font-family: ${harrisTheme.fontFamily.sans};
      font-size: 14.5px;
      color: rgba(26, 46, 30, 0.75);
      line-height: 24px;
      margin-bottom: 1.25rem;
      flex: 1;
    }

    .footer-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #eef5f3;

      .price-tag {
        font-size: 1.15rem;
        font-weight: 700;
        color: #006A56;
        font-family: 'Playfair Display', Georgia, serif;

        span {
          display: block;
          font-size: 0.7rem;
          color: #777777;
          font-family: ${harrisTheme.fontFamily.sans};
          font-weight: 400;
        }
      }

      .btn-details {
        background: #D97E26;
        color: #FFFFFF;
        padding: 0.5rem 1.25rem;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        border-radius: 2px;
        transition: all ${harrisTheme.transitions.base};

        &:hover {
          background: #006A56;
        }
      }
    }
  }
`;

/* ── 3. OUR SERVICES & FEATURES (DARK HARRIS TEAL SECTION) ── */
const ServicesDarkSection = styled.section`
  background: #00382E;
  color: #FFFFFF;
  padding: 5rem 0;
  position: relative;
  overflow: hidden;
  border-top: 1px solid rgba(255, 255, 255, 0.06);

  @media (max-width: 768px) {
    padding: 3rem 0;
  }
`;

const ServicesContainer = styled.div`
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  @media (max-width: 640px) {
    padding: 0 1rem;
  }
`;

const ServicesAmbientImage = styled.div`
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  height: 480px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 960px) {
    height: 300px;
  }
  @media (max-width: 480px) {
    height: 220px;
  }
`;

const ServicesContent = styled.div`
  h2 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.8rem, 3vw, 2.75rem);
    color: #FFFFFF;
    font-weight: 700;
    margin-bottom: 0.75rem;
  }

  .subtext {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.75;
    margin-bottom: 2.5rem;
    max-width: 540px;
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem 1.5rem;

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem 1rem;
    }
    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  }
`;

const ServiceItem = styled.div`
  .service-icon {
    color: #D97E26;
    margin-bottom: 0.75rem;
    display: inline-block;
  }

  h4 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.1rem;
    color: #FFFFFF;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.82rem;
    color: rgba(255, 255, 255, 0.75);
    line-height: 1.6;
  }
`;

/* ── 3.5. OUR HOTELS / LODGES SHOWCASE SECTION ── */
const OurHotelsSection = styled.section`
  padding: 4.5rem 0 5rem;
  background: #FFFFFF;
  border-top: 1px solid rgba(0, 106, 86, 0.08);
  border-bottom: 1px solid rgba(0, 106, 86, 0.08);

  @media (max-width: 768px) {
    padding: 3rem 0 3.5rem;
  }
`;

const OurHotelsContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
  text-align: center;

  @media (max-width: 640px) {
    padding: 0 1rem;
  }

  h2.section-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.8rem, 3.5vw, 2.75rem);
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #00382E;
    margin-bottom: 3rem;
    position: relative;
    display: inline-block;

    &::after {
      content: '';
      position: absolute;
      bottom: -12px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 3px;
      background: #D97E26;
      border-radius: 2px;
    }
  }
`;

const MarqueeContainer = styled.div`
  overflow: hidden;
  position: relative;
  width: 100%;
  padding: 1rem 0;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 90px;
    z-index: 2;
    pointer-events: none;
  }

  &::before {
    left: 0;
    background: linear-gradient(to right, #FFFFFF, transparent);
  }

  &::after {
    right: 0;
    background: linear-gradient(to left, #FFFFFF, transparent);
  }
`;

const MarqueeTrack = styled.div`
  display: flex;
  width: max-content;
  align-items: center;
  gap: 2.25rem;
  animation: scrollLeft 45s linear infinite;

  &:hover {
    animation-play-state: paused;
  }

  @keyframes scrollLeft {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }
`;

const MarqueeSeparator = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0 0.5rem;

  .sep-pin {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(217, 126, 38, 0.08);
    border: 1px dashed rgba(217, 126, 38, 0.4);
    color: #D97E26;
    transition: all 200ms ease;
  }
`;

const HotelBrandCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-width: 140px;
  cursor: pointer;
  flex-shrink: 0;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  transition: transform 250ms ease, background 200ms ease;

  &:hover {
    transform: translateY(-4px);
    background: rgba(0, 106, 86, 0.03);
    .brand-main,
    .branch-subname {
      color: #006A56 !important;
    }
  }

  .hotel-logo-box {
    width: 64px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.45rem;

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }

  .brand-main {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #D97E26;
    text-transform: uppercase;
    line-height: 1.2;
    transition: color 200ms ease;
  }

  .branch-subname {
    font-size: 0.82rem;
    font-weight: 700;
    margin-top: 0.2rem;
    line-height: 1.25;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    transition: opacity 200ms ease, transform 200ms ease;
  }

  .branch-location-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.68rem;
    font-weight: 600;
    color: #006A56;
    margin-top: 0.35rem;
    background: #F4FAF7;
    border: 1px solid rgba(0, 106, 86, 0.15);
    padding: 0.15rem 0.55rem;
    border-radius: 50px;
    letter-spacing: 0.02em;
  }
`;

const HOTEL_SHOWCASE_BRANCHES = [
  { id: 'branch-northend', fullName: 'Harris Northend', subName: 'Northend', color: '#A82222', location: 'Northend District' },       // Deep Wine / Crimson
  { id: 'branch-sunone', fullName: 'Harris Sunone', subName: 'Sunone', color: '#E07A18', location: 'Sunone Plaza' },           // Warm Amber
  { id: 'branch-prime', fullName: 'Harris Prime', subName: 'Prime', color: '#007A63', location: 'Commercial Centre' },             // Rich Emerald
  { id: 'branch-zim-harris', fullName: 'Zim Harris', subName: 'Zim Harris', color: '#C4841D', location: 'Central Gateway' },     // Golden Sand
  { id: 'branch-qatha', fullName: 'Harris Qatha', subName: 'Qatha', color: '#7E48BE', location: 'Qatha Precinct' },             // Royal Purple
  { id: 'branch-clark', fullName: 'Harris Clark', subName: 'Clark', color: '#216BB5', location: 'Heritage Quarter' },             // Heritage Blue
  { id: 'branch-romney-park', fullName: 'Harris Romney Park', subName: 'Romney Park', color: '#277A50', location: 'Romney Park Drive' }, // Forest Green
  { id: 'branch-silver-sands', fullName: 'Harris Silver Sands', subName: 'Silver Sands', color: '#C4591E', location: 'Silver Sands Bay' }, // Coral Terracotta
  { id: 'branch-london', fullName: 'Harris London', subName: 'London', color: '#8A5214', location: 'London View' },           // English Ochre
  { id: 'branch-villa', fullName: 'Harris Villa', subName: 'Villa', color: '#A3661C', location: 'Villa Sanctuary' },             // Tuscan Bronze
  { id: 'branch-executive', fullName: 'Harris Executive', subName: 'Executive', color: '#00594B', location: 'Diplomatic Sector' }, // Deep Teal
  { id: 'branch-suburbs', fullName: 'Harris Suburbs', subName: 'Suburbs', color: '#486581', location: 'Suburbs Retreat' },       // Slate Indigo
];

const GoogleReviewBadge = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.85rem;
  background: #FAFCFB;
  border: 1px solid rgba(0, 106, 86, 0.18);
  border-radius: 50px;
  padding: 0.6rem 1.4rem;
  text-decoration: none;
  margin-top: 2.25rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
  transition: all ${harrisTheme.transitions.base};

  &:hover {
    transform: translateY(-2px);
    border-color: #D97E26;
    box-shadow: 0 8px 24px rgba(217, 126, 38, 0.15);
    .reviews-count {
      color: #D97E26;
    }
  }

  .rating-stars {
    display: flex;
    align-items: center;
    gap: 0.4rem;

    .score {
      font-weight: 800;
      font-size: 0.95rem;
      color: #00382E;
    }

    .stars {
      display: flex;
      align-items: center;
      gap: 2px;
    }
  }

  .divider {
    width: 1px;
    height: 16px;
    background: rgba(0, 106, 86, 0.2);
  }

  .reviews-count {
    font-size: 0.85rem;
    font-weight: 700;
    color: #006A56;
    transition: color 200ms ease;
  }
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  text-align: left;
`;

const TestimonialCard = styled.div`
  background: #FFFFFF;
  border: 1px solid rgba(0, 106, 86, 0.1);
  border-radius: 6px;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0, 106, 86, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 250ms ease, box-shadow 250ms ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 32px rgba(0, 106, 86, 0.1);
    border-color: rgba(217, 126, 38, 0.3);
  }

  .quote {
    font-size: 0.92rem;
    line-height: 1.7;
    color: #333333;
    margin-bottom: 1.5rem;
    font-style: italic;
  }

  .author-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #f0f5f3;
    padding-top: 1rem;

    .author-info {
      h5 {
        font-size: 0.92rem;
        font-weight: 700;
        color: #00382E;
        margin: 0;
      }
      span {
        font-size: 0.75rem;
        color: #777777;
      }
    }
  }
`;

const PageHeroSection = styled.section<{ $bgImage: string }>`
  position: relative;
  min-height: 320px;
  background-image: linear-gradient(
      180deg,
      rgba(0, 41, 33, 0.72) 0%,
      rgba(0, 41, 33, 0.88) 100%
    ),
    url(${(p) => p.$bgImage});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #ffffff;
  padding: 4.5rem 1.5rem 3.5rem;
  margin-bottom: 2rem;

  .hero-content {
    max-width: 820px;
    margin: 0 auto;

    .eyebrow {
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #D97E26;
      display: inline-block;
      margin-bottom: 0.75rem;
    }

    h1 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: clamp(2.3rem, 4.5vw, 3.4rem);
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 0.85rem;
      line-height: 1.15;
    }

    p {
      font-size: 1.05rem;
      color: rgba(255, 255, 255, 0.88);
      line-height: 1.6;
      max-width: 640px;
      margin: 0 auto;
    }

    .breadcrumbs {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.82rem;
      color: rgba(255, 255, 255, 0.65);
      margin-top: 1.25rem;

      button {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.85);
        cursor: pointer;
        padding: 0;
        font-size: 0.82rem;
        transition: color 150ms ease;

        &:hover {
          color: #D97E26;
        }
      }

      .current {
        color: #D97E26;
        font-weight: 600;
      }
    }
  }
`;

/* ── 4. LUXURY FOOTER ── */
const LuxuryFooter = styled.footer`
  background: #00241D;
  color: rgba(255, 255, 255, 0.8);
  padding: 5rem 0 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  h5 {
    font-family: 'Playfair Display', Georgia, serif;
    color: #FFFFFF;
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 1.25rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;

    a, button {
      color: rgba(255, 255, 255, 0.75);
      font-size: 0.85rem;
      text-decoration: none;
      transition: color ${harrisTheme.transitions.base};
      &:hover { color: #D97E26; }
    }
  }
`;

const FooterGrid = styled.div`
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: 1.15fr 0.75fr 1.65fr 1.25fr;
  gap: 2.75rem;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr 1fr;
    gap: 3rem 2.5rem;
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
`;

const FooterBottom = styled.div`
  max-width: 1360px;
  margin: 3.5rem auto 0;
  padding: 1.5rem 1.5rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
`;

/* ============================================================
   SHOWCASE ROOM DATA FOR HOMEPAGE (Using local home images)
   ============================================================ */
const HOMEPAGE_SHOWCASE_ROOMS = [
  {
    title: 'Standard Room',
    image: '/images/home/room_standard.jpg',
    description: 'Impeccably tailored comfort with bespoke furnishings, rainfall shower, high-speed Wi-Fi, and serene surroundings.',
    price: '$40',
    tier: 'standard',
  },
  {
    title: 'Deluxe Room',
    image: '/images/home/room_deluxe.jpg',
    description: 'Premier luxury accommodation offering panoramic views, dedicated lounge, deep soaking marble bath, and VIP concierge.',
    price: '$60',
    tier: 'deluxe',
  },
  {
    title: 'Executive Room',
    image: '/images/home/room_junior_suite.jpg',
    description: 'Our signature executive suite with dedicated private work study, lounge seating, VIP concierge access, and marble ensuite.',
    price: '$80',
    tier: 'double_executive',
  },
  {
    title: 'Conference Room',
    image: '/images/home/conference_hall.jpg',
    description: 'State-of-the-art corporate event & summit facility equipped with 4K laser displays, wireless audio, and dedicated banquet catering.',
    price: '$250',
    tier: 'conference',
  },
];

/* ============================================================
   MAIN APP COMPONENT
   ============================================================ */
function HarrisLodgeContent() {
  const [currentSection, setCurrentSection] = useState<SectionName>('home');
  const [bookingDrawerOpen, setBookingDrawerOpen] = useState(false);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<Room | null>(null);
  const [bookingPrefillDates, setBookingPrefillDates] = useState<{ checkIn?: string; checkOut?: string }>({});
  const { branches, currentBranch, currentBranchRooms, setCurrentBranchById } = useBranch();
  const [selectedMapBranchId, setSelectedMapBranchId] = useState<string>('branch-northend');
  const activeMapBranch = branches.find((b) => b.id === selectedMapBranchId) || branches[0];

  const handleOpenBooking = (room?: Room | null) => {
    setSelectedRoomForBooking(room ?? null);
    setBookingDrawerOpen(true);
  };

  const handleAvailabilitySearch = (params: {
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    branchId: string;
  }) => {
    setBookingPrefillDates({ checkIn: params.checkIn, checkOut: params.checkOut });
    setBookingDrawerOpen(true);
  };

  const handleShowcaseRoomClick = (roomIndex: number) => {
    const matchedRoom = currentBranchRooms[roomIndex % currentBranchRooms.length] || null;
    handleOpenBooking(matchedRoom);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#FFFFFF' }}>
      {/* 1. Header & Navigation */}
      <Header
        currentSection={currentSection}
        onNavigate={(section) => {
          setCurrentSection(section as SectionName);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenBookingDrawer={() => handleOpenBooking()}
      />

      {/* 2. Content Sections based on Current Tab */}
      {currentSection === 'home' && (
        <main>
          {/* A. Hero Banner & Floating Availability Bar */}
          <HeroBanner
            onBookRooms={() => handleOpenBooking()}
            onKnowMore={() => {
              setCurrentSection('about');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onCheckAvailability={handleAvailabilitySearch}
          />

          {/* B. Welcome Section */}
          <WelcomeSection id="about">
            <WelcomeContainer>
              <WelcomeImageGrid>
                <div className="img-card tall">
                  <img
                    src="/images/home/welcome_villa.jpg"
                    alt="Harris Lodge Resort Villa Patio and Gardens"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="img-card offset">
                  <img
                    src="/images/home/welcome_beach.jpg"
                    alt="Luxury Holiday Stays Terrace"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </WelcomeImageGrid>

              <WelcomeContent>
                <h2>Welcome to our Hotel<br />Harris Lodge</h2>
                <div className="lead-text">
                  Indulge in tranquility, timeless elegance, and heartfelt hospitality across our premier destinations.
                </div>
                <p>
                  Immerse yourself in exceptional hospitality tailored for unforgettable getaways, business retreats, and celebrations.
                  From our lush serene gardens to our prime central locations, Harris Lodge combines contemporary comfort with bespoke service.
                </p>
                <p>
                  Our dedicated staff ensures seamless attention to every detail—from private airport transfers and artisanal dining to state-of-the-art conference facilities.
                </p>
                <GoldActionBtn
                  onClick={() => {
                    setCurrentSection('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  title="Learn more About Harris Lodges"
                >
                  Know More
                  <Icon icon="mdi:arrow-right" width={16} height={16} />
                </GoldActionBtn>
              </WelcomeContent>
            </WelcomeContainer>
          </WelcomeSection>

          {/* C. Rooms and Suites Showcase */}
          <RoomsSection id="rooms">
            <RoomsContainer>
              <RoomsHeaderRow>
                <div className="title-group">
                  <h2>Rooms And Suits</h2>
                  <div className="sub">Pick a room that best suits your taste and budget</div>
                </div>
              </RoomsHeaderRow>

              <RoomsGrid>
                {HOMEPAGE_SHOWCASE_ROOMS.map((room) => (
                  <LuxuryRoomCard
                    key={room.title}
                    onClick={() => {
                      setCurrentSection('rooms');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{ cursor: 'pointer' }}
                    title={`Explore ${room.title} in Rooms & Suites`}
                  >
                    <div className="card-media">
                      <img src={room.image} alt={`${room.title} - Harris Lodges`} loading="lazy" decoding="async" />
                    </div>
                    <div className="card-body">
                      <h3>{room.title}</h3>
                      <p>{room.description}</p>
                      <div className="footer-row">
                        <div className="price-tag">
                          {room.price}
                          <span>Per Night</span>
                        </div>
                        <button
                          className="btn-details"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentSection('rooms');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          title="Explore Rooms & Suites"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </LuxuryRoomCard>
                ))}
              </RoomsGrid>
            </RoomsContainer>
          </RoomsSection>

          {/* D. Our Services & Features (Dark Section) */}
          <ServicesDarkSection id="services">
            <ServicesContainer>
              <ServicesAmbientImage>
                <img
                  src="/images/home/services_bedroom.jpg"
                  alt="Luxury Suite Interiors at Harris Lodges"
                  loading="lazy"
                  decoding="async"
                />
              </ServicesAmbientImage>

              <ServicesContent>
                <h2>Our Services &amp; Features</h2>
                <div className="subtext">
                  Experience seamless luxury crafted to elevate your stay with comprehensive amenities and personalized concierge care.
                </div>

                <div className="services-grid">
                  <ServiceItem>
                    <div className="service-icon">
                      <Icon icon="mdi:car-key" width={32} height={32} />
                    </div>
                    <h4>Car Rental</h4>
                    <p>Airport pickups, private chauffeur services, and executive vehicles on demand.</p>
                  </ServiceItem>

                  <ServiceItem>
                    <div className="service-icon">
                      <Icon icon="mdi:wifi" width={32} height={32} />
                    </div>
                    <h4>Free High-Speed WiFi</h4>
                    <p>Ultra-fast fiber connectivity accessible across all suites, gardens, and meeting halls.</p>
                  </ServiceItem>

                  <ServiceItem>
                    <div className="service-icon">
                      <Icon icon="mdi:television" width={32} height={32} />
                    </div>
                    <h4>Smart Flat-Screen TV</h4>
                    <p>High-definition television with premium satellite DSTV channels &amp; entertainment in every suite.</p>
                  </ServiceItem>

                  <ServiceItem>
                    <div className="service-icon">
                      <Icon icon="mdi:fridge-outline" width={32} height={32} />
                    </div>
                    <h4>In-Room Mini Fridge</h4>
                    <p>Personal refrigerator for chilled beverages, fresh refreshments, and in-room convenience.</p>
                  </ServiceItem>



                  <ServiceItem>
                    <div className="service-icon">
                      <Icon icon="mdi:presentation" width={32} height={32} />
                    </div>
                    <h4>Conference Halls</h4>
                    <p>Fully equipped corporate boardrooms and banqueting spaces with full AV support.</p>
                  </ServiceItem>

                  <ServiceItem>
                    <div className="service-icon">
                      <Icon icon="mdi:room-service-outline" width={32} height={32} />
                    </div>
                    <h4>24/7 Room Service</h4>
                    <p>Round-the-clock housekeeping, personalized assistance, and concierge care.</p>
                  </ServiceItem>
                </div>
              </ServicesContent>
            </ServicesContainer>
          </ServicesDarkSection>

          {/* 3.5. OUR HOTELS Showcase Section */}
          <OurHotelsSection>
            <OurHotelsContainer>
              <h2 className="section-title">OUR HOTELS</h2>
              <MarqueeContainer>
                <MarqueeTrack>
                  {[...HOTEL_SHOWCASE_BRANCHES, ...HOTEL_SHOWCASE_BRANCHES].map((hotel, idx) => (
                    <Fragment key={`${hotel.id}-${idx}`}>
                      <HotelBrandCard
                        onClick={() => {
                          setCurrentBranchById(hotel.id);
                          setCurrentSection('branches');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        title={`View ${hotel.fullName} Gallery, Rooms & Book`}
                      >
                        <div className="hotel-logo-box">
                          <img
                            src="/images/harris-lodge-logo-mark.png"
                            alt={hotel.fullName}
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.onerror = null;
                              target.src = '/images/logo.png';
                            }}
                          />
                        </div>
                        <div className="brand-main">HARRIS</div>
                        <div className="branch-subname" style={{ color: hotel.color }}>
                          {hotel.subName}
                        </div>
                      </HotelBrandCard>
                    </Fragment>
                  ))}
                </MarqueeTrack>
              </MarqueeContainer>

              <GoogleReviewBadge
                href="https://www.google.com/search?q=harris+lodge+bulawayo+reviews&sca_esv=cf5c3a640caff83a&biw=1280&bih=585&sxsrf=APpeQnsFxHs4fcsW5Z7eEZL7dMpw5NuCjw%3A1787230980042&ei=BPuGarqYAqL-7M8PsuSQ0AI&ved=0ahUKEwi6qsmdoq-WAxUiP_sDHTIyBCoQ4dUDCBA&uact=5&oq=harris+lodge+bulawayo+reviews"
                target="_blank"
                rel="noopener noreferrer"
                title="Read 233 Google reviews for Harris Lodge Bulawayo"
              >
                <Icon icon="logos:google-icon" width={22} height={22} />
                <div className="rating-stars">
                  <span className="score">4.8</span>
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <Icon key={i} icon="mdi:star" width={16} height={16} style={{ color: '#D97E26' }} />
                    ))}
                  </div>
                </div>
                <span className="divider" />
                <span className="reviews-count">233 Google reviews &rarr;</span>
              </GoogleReviewBadge>
            </OurHotelsContainer>
          </OurHotelsSection>
        </main>
      )}

      {/* Rooms Tab View */}
      {currentSection === 'rooms' && (
        <main style={{ padding: '0', width: '100%' }}>
          <RoomListing
            onBookRoom={(room) => handleOpenBooking(room)}
            onBookConference={() => {
              setSelectedRoomForBooking(null);
              setBookingDrawerOpen(true);
            }}
            onNavigate={(section) => {
              setCurrentSection(section);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </main>
      )}

      {/* Branches Tab View */}
      {currentSection === 'branches' && (
        <main style={{ padding: '0', width: '100%' }}>
          <BranchDetail
            branchId={currentBranch?.id}
            onBookRoom={(room) => handleOpenBooking(room)}
            onBookConference={(bId) => {
              if (bId) setCurrentBranchById(bId);
              setSelectedRoomForBooking(null);
              setBookingDrawerOpen(true);
            }}
            onNavigateHome={() => {
              setCurrentSection('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </main>
      )}

      {/* Conference Tab View */}
      {currentSection === 'conference' && (
        <main style={{ padding: '3rem 0 6rem', maxWidth: 1360, margin: '0 auto', width: '100%', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
          <ConferenceListing onBookConference={() => handleOpenBooking()} />
        </main>
      )}

      {/* Services Tab View */}
      {currentSection === 'services' && (
        <main style={{ padding: '4rem 0 6rem', maxWidth: 1360, margin: '0 auto', width: '100%', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2.8rem', color: '#006A56', marginBottom: '1rem' }}>
              Guest Services &amp; Amenities
            </h1>
            <p style={{ color: 'rgba(26, 46, 30, 0.75)', maxWidth: 600, margin: '0 auto', fontSize: '15px', lineHeight: '27.75px' }}>
              Discover the curated conveniences that make Harris Lodge your premier hospitality choice.
            </p>
          </div>
          <ServicesDarkSection style={{ borderRadius: '8px' }}>
            <ServicesContainer>
              <ServicesAmbientImage>
                <img
                  src="/images/home/services_bedroom.jpg"
                  alt="Luxury Suite Accommodations at Harris Lodges"
                  loading="lazy"
                  decoding="async"
                />
              </ServicesAmbientImage>
              <ServicesContent>
                <h2>Comprehensive Guest Services</h2>
                <div className="subtext">
                  Everything you need for a restorative holiday, executive retreat, or memorable conference.
                </div>
                <div className="services-grid">
                  <ServiceItem>
                    <div className="service-icon"><Icon icon="mdi:car-key" width={32} height={32} /></div>
                    <h4>Car Rental &amp; Transfers</h4>
                    <p>Dedicated airport pick-up and private tour chauffeuring.</p>
                  </ServiceItem>
                  <ServiceItem>
                    <div className="service-icon"><Icon icon="mdi:wifi" width={32} height={32} /></div>
                    <h4>Fiber High-Speed WiFi</h4>
                    <p>Enterprise connectivity everywhere on the property.</p>
                  </ServiceItem>
                  <ServiceItem>
                    <div className="service-icon"><Icon icon="mdi:television" width={32} height={32} /></div>
                    <h4>Smart Flat-Screen TV</h4>
                    <p>High-definition television with premium DSTV channels &amp; streaming.</p>
                  </ServiceItem>
                  <ServiceItem>
                    <div className="service-icon"><Icon icon="mdi:fridge-outline" width={32} height={32} /></div>
                    <h4>In-Room Mini Fridge</h4>
                    <p>Personal refrigerator for chilled beverages and refreshments.</p>
                  </ServiceItem>

                  <ServiceItem>
                    <div className="service-icon"><Icon icon="mdi:presentation" width={32} height={32} /></div>
                    <h4>Events &amp; Banquets</h4>
                    <p>Customizable halls for weddings, corporate summits, and workshops.</p>
                  </ServiceItem>
                  <ServiceItem>
                    <div className="service-icon"><Icon icon="mdi:room-service-outline" width={32} height={32} /></div>
                    <h4>Concierge Desk</h4>
                    <p>24/7 front desk ready to assist with reservations and local guides.</p>
                  </ServiceItem>
                </div>
              </ServicesContent>
            </ServicesContainer>
          </ServicesDarkSection>

          {/* 3.5. OUR HOTELS Showcase Section */}
          <OurHotelsSection style={{ borderRadius: '8px', marginTop: '3.5rem' }}>
            <OurHotelsContainer>
              <h2 className="section-title">OUR HOTELS</h2>
              <MarqueeContainer>
                <MarqueeTrack>
                  {[...HOTEL_SHOWCASE_BRANCHES, ...HOTEL_SHOWCASE_BRANCHES].map((hotel, idx) => (
                    <Fragment key={`serv-${hotel.id}-${idx}`}>
                      <HotelBrandCard
                        onClick={() => {
                          setCurrentBranchById(hotel.id);
                          setCurrentSection('branches');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        title={`View ${hotel.fullName} Gallery, Rooms & Book`}
                      >
                        <div className="hotel-logo-box">
                          <img
                            src="/images/harris-lodge-logo-mark.png"
                            alt={hotel.fullName}
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.onerror = null;
                              target.src = '/images/logo.png';
                            }}
                          />
                        </div>
                        <div className="brand-main">HARRIS</div>
                        <div className="branch-subname" style={{ color: hotel.color }}>
                          {hotel.subName}
                        </div>
                      </HotelBrandCard>
                    </Fragment>
                  ))}
                </MarqueeTrack>
              </MarqueeContainer>

              <GoogleReviewBadge
                href="https://www.google.com/search?q=harris+lodge+bulawayo+reviews&sca_esv=cf5c3a640caff83a&biw=1280&bih=585&sxsrf=APpeQnsFxHs4fcsW5Z7eEZL7dMpw5NuCjw%3A1787230980042&ei=BPuGarqYAqL-7M8PsuSQ0AI&ved=0ahUKEwi6qsmdoq-WAxUiP_sDHTIyBCoQ4dUDCBA&uact=5&oq=harris+lodge+bulawayo+reviews"
                target="_blank"
                rel="noopener noreferrer"
                title="Read 233 Google reviews for Harris Lodge Bulawayo"
              >
                <Icon icon="logos:google-icon" width={22} height={22} />
                <div className="rating-stars">
                  <span className="score">4.8</span>
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <Icon key={i} icon="mdi:star" width={16} height={16} style={{ color: '#D97E26' }} />
                    ))}
                  </div>
                </div>
                <span className="divider" />
                <span className="reviews-count">233 Google reviews &rarr;</span>
              </GoogleReviewBadge>
            </OurHotelsContainer>
          </OurHotelsSection>
        </main>
      )}

      {/* About Tab View */}
      {currentSection === 'about' && (
        <main style={{ padding: '0 0 6rem', width: '100%' }}>
          <PageHeroSection $bgImage="/images/home/welcome_villa.jpg">
            <div className="hero-content">
              <h1>About Harris Lodges</h1>
              <div className="breadcrumbs">
                <button onClick={() => setCurrentSection('home')}>Home</button>
                <span>/</span>
                <span className="current">About Us</span>
              </div>
            </div>
          </PageHeroSection>

          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem 0' }}>
            <WelcomeSection>
              <WelcomeContainer>
                <WelcomeImageGrid>
                  <div className="img-card tall">
                    <img src="/images/home/welcome_villa.jpg" alt="Harris Lodge Resort Villa" loading="lazy" decoding="async" />
                  </div>
                  <div className="img-card offset">
                    <img src="/images/home/welcome_beach.jpg" alt="Harris Lodge Sunset Terrace" loading="lazy" decoding="async" />
                  </div>
                </WelcomeImageGrid>
                <WelcomeContent>
                  <h2>The Story of Harris Lodge</h2>
                  <div className="lead-text">
                    Crafted with passion for authentic hospitality, comfort, and architectural elegance.
                  </div>
                  <p>
                    Harris Lodge was founded on a simple vision: to provide guests with sanctuary, luxury, and warmth.
                    Whether traveling for business or leisure, our guests enjoy thoughtfully curated rooms, tranquil gardens, and genuine care across all 12 destinations.
                  </p>
                  <GoldActionBtn onClick={() => setCurrentSection('rooms')}>
                    Explore Accommodations
                  </GoldActionBtn>
                </WelcomeContent>
              </WelcomeContainer>
            </WelcomeSection>

            {/* Our Hotels Marquee in About Us */}
            <OurHotelsSection style={{ borderRadius: '8px', margin: '4rem 0' }}>
              <OurHotelsContainer>
                <h2 className="section-title">OUR HOTELS &amp; LODGES</h2>
                <MarqueeContainer>
                  <MarqueeTrack>
                    {[...HOTEL_SHOWCASE_BRANCHES, ...HOTEL_SHOWCASE_BRANCHES].map((hotel, idx) => (
                      <Fragment key={`about-${hotel.id}-${idx}`}>
                        <HotelBrandCard
                          onClick={() => {
                            setCurrentBranchById(hotel.id);
                            setCurrentSection('branches');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          title={`View ${hotel.fullName} Gallery, Rooms & Book`}
                        >
                          <div className="hotel-logo-box">
                            <img
                              src="/images/harris-lodge-logo-mark.png"
                              alt={hotel.fullName}
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                target.onerror = null;
                                target.src = '/images/logo.png';
                              }}
                            />
                          </div>
                          <div className="brand-main">HARRIS</div>
                          <div className="branch-subname" style={{ color: hotel.color }}>
                            {hotel.subName}
                          </div>
                        </HotelBrandCard>
                      </Fragment>
                    ))}
                  </MarqueeTrack>
                </MarqueeContainer>
              </OurHotelsContainer>
            </OurHotelsSection>

            {/* Guest Reviews & Testimonials Section */}
            <div style={{ textAlign: 'center', marginTop: '4.5rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#D97E26', display: 'block', marginBottom: '0.5rem' }}>
                TESTIMONIALS &amp; REVIEWS
              </span>
              <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2.5rem', color: '#00382E', marginBottom: '0.75rem' }}>
                Celebrated by Travelers Across the Globe
              </h2>
              <p style={{ color: 'rgba(26, 46, 30, 0.75)', maxWidth: 620, margin: '0 auto', fontSize: '15px', lineHeight: 1.7 }}>
                Discover why hundreds of guests consistently rate Harris Lodge as their premier accommodation choice in Bulawayo and beyond.
              </p>

              <GoogleReviewBadge
                href="https://www.google.com/search?q=harris+lodge+bulawayo+reviews&sca_esv=cf5c3a640caff83a&biw=1280&bih=585&sxsrf=APpeQnsFxHs4fcsW5Z7eEZL7dMpw5NuCjw%3A1787230980042&ei=BPuGarqYAqL-7M8PsuSQ0AI&ved=0ahUKEwi6qsmdoq-WAxUiP_sDHTIyBCoQ4dUDCBA&uact=5&oq=harris+lodge+bulawayo+reviews"
                target="_blank"
                rel="noopener noreferrer"
                title="View 233 Google reviews for Harris Lodge Bulawayo"
              >
                <Icon icon="logos:google-icon" width={22} height={22} />
                <div className="rating-stars">
                  <span className="score">4.8</span>
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <Icon key={i} icon="mdi:star" width={16} height={16} style={{ color: '#D97E26' }} />
                    ))}
                  </div>
                </div>
                <span className="divider" />
                <span className="reviews-count">233 Google reviews &rarr;</span>
              </GoogleReviewBadge>

              <TestimonialsGrid>
                <TestimonialCard>
                  <div className="quote">
                    "Harris Lodge was exceptional from check-in to check-out. The executive rooms are impeccably clean, serene, and comfortable. Staff was warm, respectful, and attentive."
                  </div>
                  <div className="author-row">
                    <div className="author-info">
                      <h5>Tawanda Moyo</h5>
                      <span>Business Executive • Bulawayo</span>
                    </div>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[...Array(5)].map((_, i) => (
                        <Icon key={i} icon="mdi:star" width={15} height={15} style={{ color: '#D97E26' }} />
                      ))}
                    </div>
                  </div>
                </TestimonialCard>

                <TestimonialCard>
                  <div className="quote">
                    "We organized a two-day regional corporate summit in the conference facilities. Everything was seamless — from laser projections and high-speed fiber WiFi to refreshing coffee service."
                  </div>
                  <div className="author-row">
                    <div className="author-info">
                      <h5>Sarah Dube</h5>
                      <span>Conference Coordinator</span>
                    </div>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[...Array(5)].map((_, i) => (
                        <Icon key={i} icon="mdi:star" width={15} height={15} style={{ color: '#D97E26' }} />
                      ))}
                    </div>
                  </div>
                </TestimonialCard>

                <TestimonialCard>
                  <div className="quote">
                    "A peaceful, lush oasis with outstanding security, 24/7 power backup, and wonderful garden patios. Truly our favorite lodge whenever visiting Zimbabwe."
                  </div>
                  <div className="author-row">
                    <div className="author-info">
                      <h5>Blessing Ndlovu</h5>
                      <span>Vacation Guest • Verified Traveler</span>
                    </div>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[...Array(5)].map((_, i) => (
                        <Icon key={i} icon="mdi:star" width={15} height={15} style={{ color: '#D97E26' }} />
                      ))}
                    </div>
                  </div>
                </TestimonialCard>
              </TestimonialsGrid>
            </div>
          </div>
        </main>
      )}

      {/* Contact Tab View */}
      {currentSection === 'contact' && (
        <main style={{ padding: '0 0 6rem', width: '100%' }}>
          <PageHeroSection $bgImage="/images/home/welcome_beach.jpg">
            <div className="hero-content">
              <h1>Contact Harris Lodge</h1>
              <div className="breadcrumbs">
                <button onClick={() => setCurrentSection('home')}>Home</button>
                <span>/</span>
                <span className="current">Contact Us</span>
              </div>
            </div>
          </PageHeroSection>

          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '2rem 1.5rem 0' }}>
            <div style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: '6px', boxShadow: '0 10px 30px rgba(0, 106, 86, 0.08)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', border: '1px solid rgba(0, 106, 86, 0.1)', marginBottom: '4.5rem' }}>
            <div>
              <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.6rem', color: '#006A56', marginBottom: '1.5rem' }}>
                Central Reservations &amp; Headquarters
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '15px', color: 'rgba(26, 46, 30, 0.85)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon icon="mdi:phone" width={22} height={22} style={{ color: '#006A56' }} />
                  <span>{BRAND_CONTACT.centralPhone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon icon="mdi:email-outline" width={22} height={22} style={{ color: '#006A56' }} />
                  <a href={`mailto:${BRAND_CONTACT.generalEmail}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {BRAND_CONTACT.generalEmail}
                  </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon icon="mdi:map-marker-outline" width={22} height={22} style={{ color: '#006A56' }} />
                  <span>{BRAND_CONTACT.headquarters}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon icon="mdi:clock-outline" width={22} height={22} style={{ color: '#006A56' }} />
                  <span>Front Desk: 24/7 Service</span>
                </div>
              </div>
            </div>
            <div>
              <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.6rem', color: '#006A56', marginBottom: '1.5rem' }}>
                Send A Message
              </h3>
              <form onSubmit={(e) => { e.preventDefault(); alert('Thank you! Your message has been sent to Harris Lodge guest relations.'); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                  type="text"
                  placeholder="Your Full Name"
                  required
                  style={{ padding: '0.75rem 1rem', border: '1px solid #d5e5e1', borderRadius: '3px', outline: 'none', background: '#FAFCFB' }}
                />
                <input
                  type="email"
                  placeholder="Your Email Address"
                  required
                  style={{ padding: '0.75rem 1rem', border: '1px solid #d5e5e1', borderRadius: '3px', outline: 'none', background: '#FAFCFB' }}
                />
                <textarea
                  placeholder="How can we assist you with your booking?"
                  rows={4}
                  required
                  style={{ padding: '0.75rem 1rem', border: '1px solid #d5e5e1', borderRadius: '3px', outline: 'none', resize: 'vertical', background: '#FAFCFB' }}
                />
                <GoldActionBtn type="submit" style={{ alignSelf: 'flex-start' }}>
                  Send Message
                </GoldActionBtn>
              </form>
            </div>
          </div>

          {/* Interactive Google Map & Branch Locations Explorer */}
          <div>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#D97E26', display: 'block', marginBottom: '0.5rem' }}>
                EXPLORE BULAWAYO &amp; SURROUNDS
              </span>
              <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2.4rem', color: '#00382E', marginBottom: '0.5rem' }}>
                Google Map &amp; 12 Branch Locations
              </h2>
              <p style={{ color: 'rgba(26, 46, 30, 0.75)', maxWidth: 650, margin: '0 auto', fontSize: '15px', lineHeight: 1.6 }}>
                Click on any of our 12 Harris Lodge locations to load live navigation on Google Maps, find branch addresses, and get instant driving directions.
              </p>
            </div>

            {/* Branch pills selector */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem', justifyContent: 'center', marginBottom: '2rem' }}>
              {branches.map((b) => {
                const isSelected = b.id === (activeMapBranch?.id || 'branch-northend');
                return (
                  <button
                    key={b.id}
                    onClick={() => setSelectedMapBranchId(b.id)}
                    style={{
                      padding: '0.5rem 0.95rem',
                      borderRadius: '50px',
                      border: isSelected ? '1.5px solid #006A56' : '1px solid rgba(0, 106, 86, 0.2)',
                      background: isSelected ? '#006A56' : '#FAFCFB',
                      color: isSelected ? '#FFFFFF' : '#00382E',
                      fontSize: '0.82rem',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 200ms ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      boxShadow: isSelected ? '0 4px 12px rgba(0, 106, 86, 0.2)' : 'none',
                    }}
                  >
                    <Icon icon="mdi:map-marker" width={16} height={16} style={{ color: isSelected ? '#D97E26' : '#006A56' }} />
                    {b.name}
                  </button>
                );
              })}
            </div>

            {/* Map & Selected Branch Info Card */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.75rem',
                background: '#FFFFFF',
                borderRadius: '8px',
                padding: '1.5rem',
                border: '1px solid rgba(0, 106, 86, 0.12)',
                boxShadow: '0 12px 32px rgba(0, 106, 86, 0.06)',
                alignItems: 'stretch',
              }}
            >
              {/* Branch detail panel */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1rem' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: '#F4FAF7', padding: '0.35rem 0.75rem', borderRadius: '4px', marginBottom: '1rem', color: '#006A56', fontSize: '0.78rem', fontWeight: 700 }}>
                    <Icon icon="mdi:check-decagram" width={16} height={16} style={{ color: '#D97E26' }} />
                    Official Harris Destination
                  </div>
                  <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.75rem', color: '#00382E', marginBottom: '0.35rem' }}>
                    {activeMapBranch?.name || 'Harris Lodge'}
                  </h3>
                  <p style={{ color: '#666666', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                    {activeMapBranch?.location} • Bulawayo, Zimbabwe
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem', color: '#2C3E50' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                      <Icon icon="mdi:map-marker-radius-outline" width={20} height={20} style={{ color: '#006A56', flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <strong style={{ color: '#00382E' }}>Address:</strong><br />
                        {activeMapBranch?.address || 'Bulawayo, Zimbabwe'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                      <Icon icon="mdi:phone-in-talk-outline" width={20} height={20} style={{ color: '#006A56', flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <strong style={{ color: '#00382E' }}>Direct Phone:</strong><br />
                        {activeMapBranch?.contact_phone || BRAND_CONTACT.centralPhone}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                      <Icon icon="mdi:shield-check-outline" width={20} height={20} style={{ color: '#006A56', flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <strong style={{ color: '#00382E' }}>Amenities &amp; Security:</strong><br />
                        24/7 Security, Free Parking, Power Backup, Fiber WiFi
                      </div>
                    </div>
                    {activeMapBranch?.has_conference && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                        <Icon icon="mdi:presentation" width={20} height={20} style={{ color: '#D97E26', flexShrink: 0, marginTop: 2 }} />
                        <div>
                          <strong style={{ color: '#00382E' }}>Conference Facilities:</strong><br />
                          Available for corporate events &amp; banquets
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    onClick={() => {
                      if (activeMapBranch) setCurrentBranchById(activeMapBranch.id);
                      setCurrentSection('branches');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      background: '#006A56',
                      color: '#FFFFFF',
                      padding: '0.8rem 1.25rem',
                      borderRadius: '4px',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      transition: 'background 200ms ease',
                    }}
                  >
                    <Icon icon="mdi:camera-image" width={18} height={18} />
                    View {activeMapBranch?.name || 'Branch'} Gallery &amp; Suites &rarr;
                  </button>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${activeMapBranch?.name || 'Harris Lodge'} Bulawayo Zimbabwe`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      background: 'rgba(0, 106, 86, 0.08)',
                      color: '#006A56',
                      border: '1px solid rgba(0, 106, 86, 0.25)',
                      padding: '0.8rem 1.25rem',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '0.88rem',
                      transition: 'background 200ms ease',
                    }}
                  >
                    <Icon icon="mdi:directions" width={18} height={18} />
                    Get Driving Directions on Google Maps
                  </a>
                  <button
                    onClick={() => {
                      if (activeMapBranch) setCurrentBranchById(activeMapBranch.id);
                      handleOpenBooking();
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      background: '#D97E26',
                      color: '#FFFFFF',
                      padding: '0.8rem 1.25rem',
                      borderRadius: '4px',
                      border: 'none',
                      fontWeight: 600,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      transition: 'background 200ms ease',
                    }}
                  >
                    <Icon icon="mdi:calendar-check" width={18} height={18} />
                    Book Stay at {activeMapBranch?.name || 'this Branch'}
                  </button>
                </div>
              </div>

              {/* Interactive Google Maps Frame */}
              <div style={{ position: 'relative', minHeight: '420px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                <iframe
                  title={`Google Map - ${activeMapBranch?.name || 'Harris Lodge Bulawayo'}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '440px', width: '100%', height: '100%' }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(`${activeMapBranch?.name || 'Harris Lodge'}, Bulawayo, Zimbabwe`)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    )}

      {/* News & Events Tab View */}
      {currentSection === 'news' && (
        <main style={{ padding: '0 0 6rem', width: '100%' }}>
          <PageHeroSection $bgImage="/images/home/conference_hall.jpg">
            <div className="hero-content">
              <span className="eyebrow">STORIES, EVENTS &amp; PRESS</span>
              <h1>News &amp; Happenings</h1>
              <p>
                Stay connected with exclusive retreat announcements, cultural events, culinary spotlights, and live social updates from Harris Lodges.
              </p>
              <div className="breadcrumbs">
                <button onClick={() => setCurrentSection('home')}>Home</button>
                <span>/</span>
                <span className="current">News &amp; Events</span>
              </div>
            </div>
          </PageHeroSection>

          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem 0' }}>

          {/* Social Platforms Highlight Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #00382E 0%, #006A56 100%)',
              borderRadius: '6px',
              padding: '2.5rem',
              color: '#FFFFFF',
              marginBottom: '3.5rem',
              boxShadow: '0 12px 32px rgba(0, 106, 86, 0.15)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#D97E26', display: 'block', marginBottom: '0.5rem' }}>
                CONNECT WITH US
              </span>
              <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.75rem', marginBottom: '0.75rem' }}>
                Follow Our Official Channels
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
                Experience behind-the-scenes glimpses, live festival updates, and instant booking specials across our social media platforms.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <a
                href="https://www.facebook.com/profile.php?id=100086628752969"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '4px',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  transition: 'background 200ms ease',
                }}
              >
                <Icon icon="mdi:facebook" width={22} height={22} style={{ color: '#D97E26' }} />
                <span>Harris Lodges on Facebook</span>
                <Icon icon="mdi:arrow-top-right" width={16} height={16} style={{ marginLeft: 'auto', opacity: 0.7 }} />
              </a>

              <a
                href="https://www.instagram.com/harris_lodges_zw/?hl="
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '4px',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  transition: 'background 200ms ease',
                }}
              >
                <Icon icon="mdi:instagram" width={22} height={22} style={{ color: '#D97E26' }} />
                <span>@harris_lodges_zw (Instagram)</span>
                <Icon icon="mdi:arrow-top-right" width={16} height={16} style={{ marginLeft: 'auto', opacity: 0.7 }} />
              </a>

              <a
                href="https://www.instagram.com/harris_entertainment_zw/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '4px',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  transition: 'background 200ms ease',
                }}
              >
                <Icon icon="mdi:music-circle-outline" width={22} height={22} style={{ color: '#D97E26' }} />
                <span>@harris_entertainment_zw (Entertainment)</span>
                <Icon icon="mdi:arrow-top-right" width={16} height={16} style={{ marginLeft: 'auto', opacity: 0.7 }} />
              </a>
            </div>
          </div>

          {/* Stories & Press Releases Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            <div style={{ background: '#FFFFFF', border: '1px solid rgba(0, 106, 86, 0.1)', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0, 106, 86, 0.05)' }}>
              <div style={{ height: 200, overflow: 'hidden' }}>
                <img src="/images/home/welcome_villa.jpg" alt="Villa story" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D97E26', textTransform: 'uppercase', letterSpacing: '0.08em' }}>JOURNAL &amp; STORIES</span>
                <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.3rem', color: '#002921', margin: '0.5rem 0' }}>
                  A Heritage of Gracious Hospitality: Expanding to Westlands
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#555555', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Discover our architectural journey and vision behind the newly refreshed suites and tranquil garden grounds.
                </p>
                <button onClick={() => setCurrentSection('rooms')} style={{ background: 'transparent', border: 'none', color: '#006A56', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  READ FULL STORY &rarr;
                </button>
              </div>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid rgba(0, 106, 86, 0.1)', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0, 106, 86, 0.05)' }}>
              <div style={{ height: 200, overflow: 'hidden' }}>
                <img src="/images/home/conference_hall.jpg" alt="Events Calendar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D97E26', textTransform: 'uppercase', letterSpacing: '0.08em' }}>EVENTS CALENDAR</span>
                <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.3rem', color: '#002921', margin: '0.5rem 0' }}>
                  Upcoming Executive Summits &amp; Weekend Live Acoustic Evenings
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#555555', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Join us for curated business forums and cultural live music sessions hosted under the stars at Harris Gardens.
                </p>
                <button onClick={() => setCurrentSection('contact')} style={{ background: 'transparent', border: 'none', color: '#006A56', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  VIEW EVENT SCHEDULE &rarr;
                </button>
              </div>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid rgba(0, 106, 86, 0.1)', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0, 106, 86, 0.05)' }}>
              <div style={{ height: 200, overflow: 'hidden' }}>
                <img src="/images/home/room_deluxe.jpg" alt="Press Release" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D97E26', textTransform: 'uppercase', letterSpacing: '0.08em' }}>PRESS RELEASES</span>
                <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.3rem', color: '#002921', margin: '0.5rem 0' }}>
                  Harris Group of Hotels &amp; Lodges Achieves Excellence Recognition
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#555555', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Celebrating our distinguished guest satisfaction benchmarks and commitment to eco-conscious luxury retreat management.
                </p>
                <button onClick={() => setCurrentSection('about')} style={{ background: 'transparent', border: 'none', color: '#006A56', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  READ PRESS RELEASE &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    )}

      {/* 3. Luxury Footer */}
      <LuxuryFooter>
        <FooterGrid>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }}>
              <img
                src="/images/logo.png"
                alt="Harris Lodge - Group of Hotels & Lodges"
                style={{ height: 56, width: 'auto', borderRadius: 4, background: '#FFFFFF', padding: '6px 12px' }}
              />
            </div>
            <p style={{ fontSize: '15px', lineHeight: '26px', color: 'rgba(255, 255, 255, 0.8)', maxWidth: 320, marginBottom: '1.25rem' }}>
              Crafting timeless luxury, executive retreats, and memorable escapes across our signature branches with warm, attentive hospitality.
            </p>

            {/* Social Icons in Footer */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a
                href="https://www.facebook.com/profile.php?id=100086628752969"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#FFFFFF',
                  transition: 'background 200ms ease, color 200ms ease',
                }}
              >
                <Icon icon="mdi:facebook" width={18} height={18} />
              </a>
              <a
                href="https://www.instagram.com/harris_lodges_zw/?hl="
                target="_blank"
                rel="noopener noreferrer"
                title="Harris Lodges Instagram"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#FFFFFF',
                  transition: 'background 200ms ease, color 200ms ease',
                }}
              >
                <Icon icon="mdi:instagram" width={18} height={18} />
              </a>
              <a
                href="https://www.instagram.com/harris_entertainment_zw/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                title="Harris Entertainment Instagram"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#FFFFFF',
                  transition: 'background 200ms ease, color 200ms ease',
                }}
              >
                <Icon icon="mdi:music-circle-outline" width={18} height={18} />
              </a>
              <a
                href={`mailto:${BRAND_CONTACT.generalEmail}`}
                title={`Email Us (${BRAND_CONTACT.generalEmail})`}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#FFFFFF',
                  transition: 'background 200ms ease, color 200ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#D97E26';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                }}
              >
                <Icon icon="mdi:email-outline" width={18} height={18} />
              </a>
            </div>
          </div>

          <div>
            <h5>Quick Navigation</h5>
            <ul>
              <li><button onClick={() => { setCurrentSection('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</button></li>
              <li><button onClick={() => { setCurrentSection('rooms'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Rooms &amp; Suites</button></li>
              <li><button onClick={() => { setCurrentSection('news'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>News &amp; Events</button></li>
              <li><button onClick={() => { setCurrentSection('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Our Story</button></li>
              <li><button onClick={() => { setCurrentSection('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Contact Us</button></li>
            </ul>
          </div>

          <div style={{ width: '100%' }}>
            <h5 style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '1rem' }}>
              <Icon icon="mdi:map-marker-radius" width={18} height={18} style={{ color: '#D97E26' }} />
              <span>Our 12 Branches</span>
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.55rem 1.25rem', width: '100%' }}>
              {branches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setCurrentBranchById(b.id);
                    setCurrentSection('branches');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '0.15rem 0',
                    color: 'rgba(255, 255, 255, 0.8)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    textAlign: 'left',
                    fontSize: '13px',
                    lineHeight: '1.3',
                    transition: 'color 180ms ease, transform 180ms ease',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FFAE58';
                    e.currentTarget.style.transform = 'translateX(3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                  title={`Explore ${b.name} (${b.location}) — View Photos & Book`}
                >
                  <Icon icon="mdi:map-marker" width={14} height={14} style={{ color: '#D97E26', flexShrink: 0 }} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ width: '100%' }}>
            <h5>Connect &amp; Socials</h5>
            <ul>
              <li>
                <a
                  href="https://www.facebook.com/profile.php?id=100086628752969"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
                >
                  <Icon icon="mdi:facebook" width={18} height={18} style={{ color: '#D97E26', flexShrink: 0 }} />
                  <span>Facebook Page &rarr;</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/harris_lodges_zw/?hl="
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
                >
                  <Icon icon="mdi:instagram" width={18} height={18} style={{ color: '#D97E26', flexShrink: 0 }} />
                  <span>@harris_lodges_zw &rarr;</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/harris_entertainment_zw/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
                >
                  <Icon icon="mdi:music-circle-outline" width={18} height={18} style={{ color: '#D97E26', flexShrink: 0 }} />
                  <span>@harris_entertainment_zw &rarr;</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BRAND_CONTACT.generalEmail}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', wordBreak: 'break-all' }}
                >
                  <Icon icon="mdi:email-outline" width={18} height={18} style={{ color: '#D97E26', flexShrink: 0 }} />
                  <span>{BRAND_CONTACT.generalEmail}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${BRAND_CONTACT.centralPhone}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
                >
                  <Icon icon="mdi:phone" width={18} height={18} style={{ color: '#D97E26', flexShrink: 0 }} />
                  <span>Phone: {BRAND_CONTACT.centralPhone}</span>
                </a>
              </li>
            </ul>
          </div>
        </FooterGrid>

        <FooterBottom>
          <div>&copy; {new Date().getFullYear()} Harris Group of Hotels &amp; Lodges. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms &amp; Conditions</span>
            <span>Harris Hotel Management Engine</span>
          </div>
        </FooterBottom>
      </LuxuryFooter>

      {/* 4. Luxury Native Booking Engine Modal */}
      <LuxuryBookingModal
        isOpen={bookingDrawerOpen}
        onClose={() => {
          setBookingDrawerOpen(false);
          setSelectedRoomForBooking(null);
        }}
        initialDates={bookingPrefillDates}
        initialBranchId={currentBranch?.id}
        preselectedRoom={selectedRoomForBooking}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={harrisTheme}>
      <BranchProvider>
        <AuthProvider>
          <HarrisLodgeContent />
        </AuthProvider>
      </BranchProvider>
    </ThemeProvider>
  );
}
