// siteprincipal/App.js
import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import ProductOffers from './components/ProductOffers';
import FrutosGoias from './components/FrutosGoias';
import Gallery from './components/Gallery';
import AboutUs from './pages/AboutUs';
import Products from './pages/Products';
import Contact from './pages/Contact';
import Local from './pages/Local';
import Login from './pages/Login';
import AdminPage from './pages/AdminPage';
import CardapioApp from '../cardapio/App';
import TrabalheConosco from '../trabalheconosco/pages/Home';
import FeedbackSection from './components/FeedbackSection';
import PromotionalBanner from './components/PromotionalBanner';

import './styles/global.css';

gsap.registerPlugin(ScrollTrigger);

function SitePrincipalContent() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';
  const isTrabalheConosco = location.pathname.startsWith('/trabalhe-conosco');
  const isCardapio = location.pathname.startsWith('/menu');
  const hideSiteChrome = isAdmin || isCardapio || isTrabalheConosco;

  useEffect(() => {
    if (!hideSiteChrome) {
      const sections = document.querySelectorAll('section:not(.hero)');
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: section,
              start: 'top 100%',
              end: 'top 20%',
              scrub: 0.2,
              toggleActions: 'play none none reverse',
            },
            duration: 1,
          }
        );
      });
    }
  }, [hideSiteChrome, location.pathname]);

  useEffect(() => {
    if (!hideSiteChrome) {
      const handleScroll = () => {
        const header = document.querySelector('header');
        const navLinks = document.querySelectorAll('header a');
        const burgerSpans = document.querySelectorAll('.burguer-span');
        const logo = document.querySelector('.logo img');

        if (window.scrollY > 50) {
          header.style.backgroundColor = '#465847';
          header.style.transition = 'background-color 0.8s';
          header.style.paddingBottom = '20px';
          navLinks.forEach(link => link.style.color = '#ffffff');
          burgerSpans.forEach(span => span.style.backgroundColor = '#ffffff');
          if (logo) logo.src = '/img/Logo-Branca.png';
        } else {
          header.style.backgroundColor = 'transparent';
          navLinks.forEach(link => link.style.color = '#000000');
          burgerSpans.forEach(span => span.style.backgroundColor = '#000000');
          if (logo) logo.src = '/img/LOGO.png';
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [hideSiteChrome, location.pathname]);

  return (
    <>
      {!hideSiteChrome && <Header />}
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <ProductOffers />
                <PromotionalBanner />
                {/* <FrutosGoias /> */}
                {/* <Gallery /> */}
                <FeedbackSection />
              </>
            }
          />
          <Route path="/products" element={<section><Products /></section>} />
          <Route path="/menu/*" element={<CardapioApp />} />
          <Route path="/about-us" element={<section><AboutUs /></section>} />
          <Route path="/trabalhe-conosco" element={<section><TrabalheConosco /></section>}/>
          <Route path="/contact" element={<section><Contact /></section>} />
          <Route path="/local" element={<section><Local /></section>} />
          <Route path="/login" element={<section><Login /></section>} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
      {!hideSiteChrome && (
        <div style={{ paddingTop: '32px' }}>
          <Footer />
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} style={{ zIndex: 99999 }} />
    </>
  );
}

export default SitePrincipalContent;
