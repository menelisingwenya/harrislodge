import styled from 'styled-components';
import { harrisTheme } from '@/theme';
import { useBranch } from '@/context/BranchContext';
import { Icon } from '@iconify/react';
import { BRAND_CONTACT } from '@/lib/brand';
import { useState, useEffect } from 'react';

/* ============================================================
   TOP UTILITY BAR — Deep Harris Tone
   ============================================================ */
const TopBarRoot = styled.div`
  background: #00382E;
  color: #FFFFFF;
  font-size: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  position: relative;
  z-index: 50;
`;

const TopBarInner = styled.div`
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 1.5rem;
  min-height: 38px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    padding: 0.35rem 1rem;
  }
`;

const TopBarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;

  .help-label {
    @media (max-width: 480px) {
      display: none;
    }
  }

  a {
    color: #FFFFFF;
    text-decoration: none;
    font-weight: 600;
    transition: color ${harrisTheme.transitions.base};
    &:hover { color: #D97E26; }
  }
`;

const TopBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;

  a, button {
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.75rem;
    font-weight: 400;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    transition: color ${harrisTheme.transitions.base};

    &:hover { color: #D97E26; }
  }

  .divider {
    width: 1px;
    height: 12px;
    background: rgba(255, 255, 255, 0.25);
  }

  @media (max-width: 768px) {
    .hide-mobile { display: none; }
  }
`;

const BranchSelect = styled.select`
  background: #004D3F;
  color: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 3px;
  padding: 2px 6px;
  font-size: 0.72rem;
  cursor: pointer;
  outline: none;
  max-width: 140px;

  &:focus {
    border-color: #D97E26;
  }
`;

/* ============================================================
   MAIN NAVIGATION — Crisp white luxury header with Harris logo
   ============================================================ */
const MainNavRoot = styled.header<{ $scrolled: boolean }>`
  position: sticky;
  top: 0;
  z-index: 45;
  background: #FFFFFF;
  box-shadow: ${(p) =>
    p.$scrolled
      ? '0 4px 20px rgba(0, 106, 86, 0.08)'
      : '0 1px 0 rgba(0, 0, 0, 0.06)'};
  transition: all ${harrisTheme.transitions.slow};
`;

const MainNavInner = styled.div`
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 78px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;

  @media (max-width: 640px) {
    padding: 0 1rem;
    height: 68px;
  }
`;

const BrandLogo = styled.a`
  text-decoration: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0;
  margin: 0;

  .logo-img {
    height: 62px;
    width: auto;
    max-width: 320px;
    object-fit: contain;
    display: block;
    transition: transform ${harrisTheme.transitions.base};
  }

  &:hover .logo-img {
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    .logo-img {
      height: 48px;
    }
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 1080px) {
    display: none;
  }
`;

const NavDropdownWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;

  &:hover .dropdown-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    pointer-events: auto;
  }

  &:hover .nav-chevron {
    transform: rotate(180deg);
  }
`;

const NavLinkItem = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 0.85rem;
  font-size: 0.88rem;
  font-weight: ${(p) => (p.$active ? '600' : '500')};
  color: ${(p) => (p.$active ? '#006A56' : '#1e293b')};
  position: relative;
  transition: all ${harrisTheme.transitions.base};
  letter-spacing: 0.01em;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: transparent;
  border: none;
  cursor: pointer;

  .nav-chevron {
    transition: transform 200ms ease;
    color: #64748B;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0.85rem;
    right: 0.85rem;
    height: 2px;
    background: ${(p) => (p.$active ? '#006A56' : '#D97E26')};
    transform: scaleX(${(p) => (p.$active ? 1 : 0)});
    transform-origin: center;
    transition: transform 200ms ease;
  }

  &:hover {
    color: #006A56;
    .nav-chevron {
      color: #006A56;
    }
    &::after {
      transform: scaleX(1);
    }
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 250px;
  background: #FFFFFF;
  border-radius: 6px;
  box-shadow: 0 16px 36px rgba(0, 41, 33, 0.14);
  border: 1px solid rgba(0, 106, 86, 0.08);
  padding: 0.25rem 0;
  opacity: 0;
  visibility: hidden;
  transform: translateY(8px);
  transition: all 200ms ease;
  pointer-events: none;
  z-index: 60;
  margin-top: 4px;
`;

const DropdownItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.95rem 1.4rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #002921;
  background: transparent;
  border: none;
  border-bottom: 1px solid #F1F5F4;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 180ms ease;
  font-family: inherit;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #F4FAF7;
    color: #006A56;
    padding-left: 1.65rem;
  }
`;

const ContactPillBtn = styled.button`
  background: transparent;
  color: #002921;
  border: 1.5px solid #002921;
  padding: 0.55rem 1.6rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 200ms ease;

  &:hover {
    background: #006A56;
    border-color: #006A56;
    color: #FFFFFF;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 106, 86, 0.25);
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BookNowBtn = styled.button`
  background: #D97E26;
  color: #FFFFFF;
  padding: 0.65rem 1.6rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 2px;
  border: none;
  cursor: pointer;
  transition: all ${harrisTheme.transitions.base};

  &:hover {
    background: #006A56;
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(0, 106, 86, 0.35);
  }
`;

const MobileMenuBtn = styled.button`
  display: none;
  color: #006A56;
  background: transparent;
  border: none;
  cursor: pointer;
  @media (max-width: 1080px) {
    display: grid;
    place-items: center;
  }
`;

/* Mobile Drawer */
const MobileDrawer = styled.div<{ $open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(320px, 85vw);
  background: #FFFFFF;
  box-shadow: -4px 0 30px rgba(0, 0, 0, 0.2);
  z-index: 60;
  transform: translateX(${(p) => (p.$open ? '0' : '100%')});
  transition: transform ${harrisTheme.transitions.slow};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

/* ============================================================
   HERO BANNER & FLOATING AVAILABILITY SEARCH BAR
   ============================================================ */
const HeroWrapper = styled.div`
  position: relative;
  padding-bottom: 3.5rem;
`;

const HeroRoot = styled.section`
  position: relative;
  min-height: 550px;
  display: flex;
  align-items: center;
  background: #002921;
  overflow: hidden;

  @media (max-width: 768px) {
    min-height: 460px;
  }
`;

const HeroBackground = styled.div`
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
      to right,
      rgba(0, 106, 86, 0.82) 0%,
      rgba(0, 106, 86, 0.5) 50%,
      rgba(0, 106, 86, 0.18) 100%
    ),
    url('/images/home/hero_pool.jpg');
  background-size: cover;
  background-position: center right;
  z-index: 1;
`;

const HeroContainer = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1360px;
  margin: 0 auto;
  padding: 4rem 1.5rem 6rem;
  width: 100%;
`;

const HeroHeadline = styled.h1`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2.4rem, 5.5vw, 4.2rem);
  font-weight: 700;
  color: #FFFFFF;
  line-height: 1.12;
  margin-bottom: 1.25rem;
  max-width: 650px;
  letter-spacing: -0.01em;
`;

const HeroSubtext = styled.p`
  font-size: clamp(0.95rem, 1.6vw, 1.05rem);
  color: rgba(255, 255, 255, 0.95);
  max-width: 520px;
  line-height: 1.75;
  margin-bottom: 2rem;
  font-weight: 300;
`;

const KnowMoreBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #D97E26;
  color: #FFFFFF;
  padding: 0.75rem 2rem;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-radius: 2px;
  transition: all ${harrisTheme.transitions.base};

  &:hover {
    background: #006A56;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 106, 86, 0.4);
  }
`;

const FloatingAvailabilityBar = styled.div`
  position: relative;
  z-index: 20;
  max-width: 1140px;
  margin: -3rem auto 0;
  padding: 0 1.5rem;
`;

const AvailabilityCard = styled.div`
  background: #FFFFFF;
  border-radius: 4px;
  box-shadow: 0 15px 40px -10px rgba(0, 106, 86, 0.14);
  padding: 1.5rem 1.75rem;
  display: grid;
  grid-template-columns: 1.15fr 1.15fr 140px 140px 180px auto;
  gap: 1rem;
  align-items: flex-end;
  border: 1px solid rgba(0, 106, 86, 0.1);

  @media (max-width: 1100px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  @media (max-width: 640px) {
    padding: 1.25rem 1rem;
    grid-template-columns: 1fr;
    gap: 0.85rem;
  }
`;

const SearchField = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.45rem;
  width: 100%;

  label {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: #006A56;
    text-transform: uppercase;
    line-height: 1;
    margin: 0;
    white-space: nowrap;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    height: 44px;
    padding: 0 0.85rem;
    border: 1px solid #d5e5e1;
    border-radius: 3px;
    background: #FAFCFB;
    color: #333333;
    font-size: 0.85rem;
    box-sizing: border-box;
    cursor: pointer;
    width: 100%;
    transition: all ${harrisTheme.transitions.base};

    &:hover {
      border-color: #006A56;
    }

    &:focus-within {
      border-color: #006A56;
      background: #FFFFFF;
      box-shadow: 0 0 0 1px #006A56;
    }

    input, select {
      border: none;
      background: transparent;
      outline: none;
      width: 100%;
      height: 100%;
      font-size: 0.85rem;
      color: #333333;
      font-family: inherit;
      cursor: pointer;
    }

    input[type="date"]::-webkit-calendar-picker-indicator {
      display: none !important;
      -webkit-appearance: none !important;
      appearance: none !important;
      opacity: 0;
      width: 0;
      height: 0;
    }

    select {
      appearance: none;
      -webkit-appearance: none;
    }
  }
`;

const CheckAvailBtn = styled.button`
  background: #D97E26;
  color: #FFFFFF;
  padding: 0 1.65rem;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: 2px;
  white-space: nowrap;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  box-sizing: border-box;
  width: 100%;
  transition: all ${harrisTheme.transitions.base};

  &:hover {
    background: #006A56;
    box-shadow: 0 4px 15px rgba(0, 106, 86, 0.35);
  }
`;

/* ============================================================
   MAIN EXPORT: HEADER
   ============================================================ */
export type NavSectionName = 'home' | 'rooms' | 'branches' | 'conference' | 'services' | 'about' | 'contact' | 'news';

export interface HeaderProps {
  currentSection?: NavSectionName;
  onNavigate?: (section: NavSectionName) => void;
  onOpenBookingDrawer?: (initialData?: any) => void;
}

export function Header({
  currentSection = 'home',
  onNavigate,
  onOpenBookingDrawer,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { branches, currentBranch, setCurrentBranchById } = useBranch();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* 1. Superheader / Top Bar */}
      <TopBarRoot>
        <TopBarInner>
          <TopBarLeft>
            <Icon icon="mdi:phone" width={14} height={14} style={{ color: '#D97E26' }} />
            <span>Need help? Call us now : </span>
            <a href="tel:+263772667410">
              +263 77 266 7410
            </a>
          </TopBarLeft>

          <TopBarRight>
            {/* Social Links */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem' }}>
              <a
                href="https://www.facebook.com/profile.php?id=100086628752969"
                target="_blank"
                rel="noopener noreferrer"
                title="Harris Lodges on Facebook"
                aria-label="Visit Harris Lodges on Facebook"
                style={{ display: 'grid', placeItems: 'center' }}
              >
                <Icon icon="mdi:facebook" width={16} height={16} />
              </a>
              <a
                href="https://www.instagram.com/harris_lodges_zw/?hl="
                target="_blank"
                rel="noopener noreferrer"
                title="Harris Lodges Instagram"
                aria-label="Follow Harris Lodges on Instagram"
                style={{ display: 'grid', placeItems: 'center' }}
              >
                <Icon icon="mdi:instagram" width={16} height={16} />
              </a>
              <a
                href="https://www.instagram.com/harris_entertainment_zw/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                title="Harris Entertainment Instagram"
                aria-label="Follow Harris Entertainment on Instagram"
                style={{ display: 'grid', placeItems: 'center' }}
              >
                <Icon icon="mdi:music-circle-outline" width={16} height={16} />
              </a>
              <a
                href={`mailto:${BRAND_CONTACT.generalEmail}`}
                title={`Email Us (${BRAND_CONTACT.generalEmail})`}
                aria-label="Send email to Harris Lodges"
                style={{ display: 'grid', placeItems: 'center' }}
              >
                <Icon icon="mdi:email-outline" width={16} height={16} />
              </a>
            </div>

            <span className="divider hide-mobile" />

            <button type="button" onClick={() => onNavigate?.('about')} className="hide-mobile">
              Our Story
            </button>
            <span className="divider hide-mobile" />
            <button type="button" onClick={() => onNavigate?.('news')} className="hide-mobile">
              News &amp; Events
            </button>
            <span className="divider hide-mobile" />

            {/* Branch Selector */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Icon icon="mdi:map-marker" width={14} height={14} style={{ color: '#D97E26' }} />
              <BranchSelect
                value={currentBranch?.id ?? ''}
                onChange={(e) => setCurrentBranchById(e.target.value)}
                title="Select a Harris Lodge Branch location"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name.replace(/^Harris\s+/i, '')}
                  </option>
                ))}
              </BranchSelect>
            </div>
          </TopBarRight>
        </TopBarInner>
      </TopBarRoot>

      {/* 2. Main Navigation Bar */}
      <MainNavRoot $scrolled={scrolled}>
        <MainNavInner>
          <BrandLogo
            onClick={() => {
              onNavigate?.('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            title="Harris Lodge - Back to Home"
          >
            <img
              src="/images/logo.png"
              alt="Harris Lodge - Group of Hotels & Lodges"
              className="logo-img"
            />
          </BrandLogo>

          <NavLinks>
            <NavLinkItem
              $active={currentSection === 'home'}
              onClick={() => {
                onNavigate?.('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Home
            </NavLinkItem>

            {/* Rooms & Suites Dropdown */}
            <NavDropdownWrapper>
              <NavLinkItem
                $active={currentSection === 'rooms'}
                onClick={() => {
                  onNavigate?.('rooms');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Rooms &amp; Suites
                <Icon icon="mdi:chevron-down" width={16} height={16} className="nav-chevron" />
              </NavLinkItem>

              <DropdownMenu className="dropdown-menu">
                <DropdownItem
                  onClick={() => {
                    onNavigate?.('rooms');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span>All Rooms &amp; Suites</span>
                  <Icon icon="mdi:arrow-right" width={14} height={14} style={{ color: '#D97E26' }} />
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    onNavigate?.('rooms');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span>Standard Room</span>
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    onNavigate?.('rooms');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span>Deluxe Room</span>
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    onNavigate?.('rooms');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span>Executive Room</span>
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    onNavigate?.('conference');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span>Conference Rooms</span>
                </DropdownItem>
              </DropdownMenu>
            </NavDropdownWrapper>

            {/* News Dropdown (Screenshot Accurate) */}
            <NavDropdownWrapper>
              <NavLinkItem
                $active={currentSection === 'news'}
                onClick={() => {
                  onNavigate?.('news');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                News
                <Icon icon="mdi:chevron-down" width={16} height={16} className="nav-chevron" />
              </NavLinkItem>

              <DropdownMenu className="dropdown-menu">
                <DropdownItem
                  onClick={() => {
                    onNavigate?.('news');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span>Journal &amp; Stories</span>
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    onNavigate?.('news');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span>Events Calendar</span>
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    onNavigate?.('news');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span>Press Releases</span>
                </DropdownItem>
              </DropdownMenu>
            </NavDropdownWrapper>

            {/* About Us */}
            <NavLinkItem
              $active={currentSection === 'about'}
              onClick={() => {
                onNavigate?.('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              About Us
            </NavLinkItem>

            {/* Contact Pill Button */}
            <ContactPillBtn
              onClick={() => {
                onNavigate?.('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              CONTACT
            </ContactPillBtn>
          </NavLinks>

          <NavActions>
            <MobileMenuBtn onClick={() => setMobileOpen(true)} aria-label="Open mobile menu">
              <Icon icon="mdi:menu" width={26} height={26} />
            </MobileMenuBtn>
          </NavActions>
        </MainNavInner>
      </MainNavRoot>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 55,
          }}
        />
      )}
      <MobileDrawer $open={mobileOpen}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <BrandLogo onClick={() => { onNavigate?.('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileOpen(false); }}>
            <img src="/images/logo.png" alt="Harris Lodge Logo" className="logo-img" style={{ height: 46 }} />
          </BrandLogo>
          <button onClick={() => setMobileOpen(false)} aria-label="Close mobile menu" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#002921' }}>
            <Icon icon="mdi:close" width={24} height={24} />
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavLinkItem $active={currentSection === 'home'} onClick={() => { onNavigate?.('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileOpen(false); }}>
            Home
          </NavLinkItem>
          <NavLinkItem $active={currentSection === 'rooms'} onClick={() => { onNavigate?.('rooms'); window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileOpen(false); }}>
            Rooms &amp; Suites
          </NavLinkItem>
          <NavLinkItem $active={currentSection === 'conference'} onClick={() => { onNavigate?.('conference'); window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileOpen(false); }}>
            Conference &amp; Events
          </NavLinkItem>
          <NavLinkItem $active={currentSection === 'services'} onClick={() => { onNavigate?.('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileOpen(false); }}>
            Guest Services
          </NavLinkItem>
          <NavLinkItem $active={currentSection === 'news'} onClick={() => { onNavigate?.('news'); window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileOpen(false); }}>
            News &amp; Events
          </NavLinkItem>
          <NavLinkItem $active={currentSection === 'about'} onClick={() => { onNavigate?.('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileOpen(false); }}>
            About Us
          </NavLinkItem>
          <NavLinkItem $active={currentSection === 'contact'} onClick={() => { onNavigate?.('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileOpen(false); }}>
            Contact &amp; Locations
          </NavLinkItem>
        </nav>

        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#006A56', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Icon icon="mdi:map-marker" width={14} height={14} style={{ color: '#D97E26' }} />
            <span>Select Branch Location</span>
          </label>
          <BranchSelect
            value={currentBranch?.id ?? ''}
            onChange={(e) => setCurrentBranchById(e.target.value)}
            style={{ width: '100%', maxWidth: '100%', padding: '0.5rem', background: '#00382E' }}
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name.replace(/^Harris\s+/i, '')}
              </option>
            ))}
          </BranchSelect>

          <a
            href={`tel:${currentBranch?.contact_phone ?? BRAND_CONTACT.centralPhone}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1rem',
              borderRadius: '4px',
              border: '1px solid #006A56',
              color: '#006A56',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            <Icon icon="mdi:phone" width={18} height={18} style={{ color: '#D97E26' }} />
            <span>Call {currentBranch?.contact_phone ?? BRAND_CONTACT.centralPhone}</span>
          </a>
        </div>

        <BookNowBtn onClick={() => { onOpenBookingDrawer?.(); setMobileOpen(false); }} style={{ width: '100%', textAlign: 'center', padding: '0.85rem' }}>
          Book Now
        </BookNowBtn>
      </MobileDrawer>
    </>
  );
}

/* ============================================================
   HERO BANNER & SEARCH BAR EXPORT
   ============================================================ */
export interface HeroBannerProps {
  onBookRooms?: () => void;
  onExploreConference?: () => void;
  onKnowMore?: () => void;
  onCheckAvailability?: (searchParams: {
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    branchId: string;
  }) => void;
}

export function HeroBanner({
  onBookRooms,
  onKnowMore,
  onCheckAvailability,
}: HeroBannerProps) {
  const { branches, currentBranch, setCurrentBranchById } = useBranch();
  const [arrivalDate, setArrivalDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [departureDate, setDepartureDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState(currentBranch?.id ?? '');

  useEffect(() => {
    if (currentBranch?.id) {
      setSelectedBranch(currentBranch.id);
    }
  }, [currentBranch]);

  const handleSearch = () => {
    if (selectedBranch && selectedBranch !== currentBranch?.id) {
      setCurrentBranchById(selectedBranch);
    }
    if (onCheckAvailability) {
      onCheckAvailability({
        checkIn: arrivalDate,
        checkOut: departureDate,
        adults,
        children: childrenCount,
        branchId: selectedBranch || (currentBranch?.id ?? ''),
      });
    } else if (onBookRooms) {
      onBookRooms();
    }
  };

  return (
    <HeroWrapper>
      <HeroRoot>
        <HeroBackground aria-hidden="true" />
        <HeroContainer>
          <HeroHeadline>
            Spend Your Dream<br />Holidays with us
          </HeroHeadline>
          <HeroSubtext>
            Experience exceptional tranquility, refined luxury, and authentic Zimbabwean hospitality
            curated for your relaxation, conferences, and memorable getaways.
          </HeroSubtext>
          <KnowMoreBtn onClick={onKnowMore || onBookRooms} title="Learn more about Harris Lodges">
            Know More
            <Icon icon="mdi:arrow-right" width={16} height={16} />
          </KnowMoreBtn>
        </HeroContainer>
      </HeroRoot>

      {/* Floating Availability Bar */}
      <FloatingAvailabilityBar>
        <AvailabilityCard>
          <SearchField>
            <label htmlFor="hero-arrival-date">Arrival Date</label>
            <div
              className="input-wrapper"
              onClick={(e) => {
                const input = e.currentTarget.querySelector('input');
                if (input && 'showPicker' in input) {
                  try { (input as HTMLInputElement).showPicker(); } catch {}
                }
              }}
            >
              <input
                id="hero-arrival-date"
                aria-label="Select arrival date"
                type="date"
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
              />
              <Icon icon="mdi:calendar-outline" width={18} height={18} style={{ color: '#006A56', flexShrink: 0, pointerEvents: 'none' }} />
            </div>
          </SearchField>

          <SearchField>
            <label htmlFor="hero-departure-date">Departure Date</label>
            <div
              className="input-wrapper"
              onClick={(e) => {
                const input = e.currentTarget.querySelector('input');
                if (input && 'showPicker' in input) {
                  try { (input as HTMLInputElement).showPicker(); } catch {}
                }
              }}
            >
              <input
                id="hero-departure-date"
                aria-label="Select departure date"
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
              <Icon icon="mdi:calendar-outline" width={18} height={18} style={{ color: '#006A56', flexShrink: 0, pointerEvents: 'none' }} />
            </div>
          </SearchField>

          <SearchField>
            <label htmlFor="hero-adults-select">Adults</label>
            <div className="input-wrapper">
              <select
                id="hero-adults-select"
                aria-label="Select number of adults"
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
              >
                <option value={1}>1 Adult</option>
                <option value={2}>2 Adults</option>
                <option value={3}>3 Adults</option>
                <option value={4}>4 Adults</option>
              </select>
              <Icon icon="mdi:chevron-down" width={18} height={18} style={{ color: '#006A56', flexShrink: 0, pointerEvents: 'none' }} />
            </div>
          </SearchField>

          <SearchField>
            <label htmlFor="hero-children-select">Children</label>
            <div className="input-wrapper">
              <select
                id="hero-children-select"
                aria-label="Select number of children"
                value={childrenCount}
                onChange={(e) => setChildrenCount(Number(e.target.value))}
              >
                <option value={0}>0 Children</option>
                <option value={1}>1 Child</option>
                <option value={2}>2 Children</option>
                <option value={3}>3 Children</option>
              </select>
              <Icon icon="mdi:chevron-down" width={18} height={18} style={{ color: '#006A56', flexShrink: 0, pointerEvents: 'none' }} />
            </div>
          </SearchField>

          <SearchField>
            <label htmlFor="hero-branch-select">Branch / Location</label>
            <div className="input-wrapper">
              <Icon icon="mdi:map-marker" width={18} height={18} style={{ color: '#D97E26', flexShrink: 0, pointerEvents: 'none' }} />
              <select
                id="hero-branch-select"
                aria-label="Select lodge branch location"
                value={selectedBranch || (currentBranch?.id ?? '')}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name.replace(/^Harris\s+/i, '')}
                  </option>
                ))}
              </select>
              <Icon icon="mdi:chevron-down" width={18} height={18} style={{ color: '#006A56', flexShrink: 0, pointerEvents: 'none' }} />
            </div>
          </SearchField>

          <CheckAvailBtn onClick={handleSearch} aria-label="Check suite availability and rates">
            Check Availability
          </CheckAvailBtn>
        </AvailabilityCard>
      </FloatingAvailabilityBar>
    </HeroWrapper>
  );
}

export { BRAND_CONTACT };
