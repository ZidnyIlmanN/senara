"use client";

import React, { useState } from 'react';
import { useCart } from './CartContext';
import { useLanguage } from '../context/LanguageContext';

function AccordionItem({ title, content, isOpen, onClick }) {
  return (
    <div className="border-b border-[#18281a]/20">
      <button
        className="w-full py-4 flex justify-between items-center text-left"
        onClick={onClick}
      >
        <span className="font-['Playfair_Display'] text-[18px] md:text-[20px] text-[#18281a]">{title}</span>
        <span className="text-[24px] font-light text-[#18281a]">{isOpen ? '−' : '+'}</span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[200px] pb-4 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="font-['Manrope'] text-[13px] md:text-[14px] leading-[1.6] text-[#434842]">
          {content}
        </p>
      </div>
    </div>
  );
}

function FeaturedProductSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openAccordion, setOpenAccordion] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const products = [
    {
      id: 'brightening-face-wash',
      name: 'Brightening Face Wash',
      cardTitle: 'Face Wash',
      price: 87000,
      oldPrice: 115000,
      reviews: 58,
      image: '/images/detailed/senara-detailed-facewash.webp',
      watermark: 'Cleanse',
      description: t('featured.products.brightening-face-wash.description'),
      accordions: [
        {
          title: t('featured.accordion.ingredients'),
          content: "ekstrak ananas comocus, ekstrak glycyrrhiza glabra, ekstrak rodophyta, ekstrak centella asiatica, ekstrak bellis parennis, niacinamide dll."
        },
        {
          title: t('featured.accordion.shipping'),
          content: t('featured.accordion.shippingContent')
        },
        {
          title: t('featured.accordion.application'),
          content: t('featured.products.brightening-face-wash.applicationContent')
        }
      ]
    },
    {
      id: 'ananas-glow-whitening-serum',
      name: 'Ananas Glow Whitening Serum',
      cardTitle: 'Glow Serum',
      price: 127000,
      oldPrice: 165000,
      reviews: 124,
      image: '/images/detailed/senara-detailed-serum.webp',
      watermark: 'Glow',
      description: t('featured.products.ananas-glow-whitening-serum.description'),
      accordions: [
        {
          title: t('featured.accordion.ingredients'),
          content: "ekstrak ananas comocus, ekstrak glycyrrhiza glabra, ekstrak rodophyta, ekstrak centella asiatica, ekstrak bellis parennis, niacinamide dll."
        },
        {
          title: t('featured.accordion.shipping'),
          content: t('featured.accordion.shippingContent')
        },
        {
          title: t('featured.accordion.application'),
          content: t('featured.products.ananas-glow-whitening-serum.applicationContent')
        }
      ]
    },
    {
      id: 'glow-toner',
      name: 'Glow Toner',
      cardTitle: 'Glow Toner',
      price: 87000,
      oldPrice: 115000,
      reviews: 89,
      image: '/images/detailed/senara-detailed-toner.webp',
      watermark: 'Tone',
      description: t('featured.products.glow-toner.description'),
      accordions: [
        {
          title: t('featured.accordion.ingredients'),
          content: "ekstrak ananas comocus, ekstrak glycyrrhiza glabra, ekstrak rodophyta, ekstrak centella asiatica, ekstrak bellis parennis, niacinamide dll."
        },
        {
          title: t('featured.accordion.shipping'),
          content: t('featured.accordion.shippingContent')
        },
        {
          title: t('featured.accordion.application'),
          content: t('featured.products.glow-toner.applicationContent')
        }
      ]
    },
    {
      id: 'lightening-day-cream',
      name: 'Lightening Day Cream',
      cardTitle: 'Day Cream',
      price: 109000,
      oldPrice: 145000,
      reviews: 76,
      image: '/images/detailed/senara-detailed-cream.webp',
      watermark: 'Protect',
      description: t('featured.products.lightening-day-cream.description'),
      accordions: [
        {
          title: t('featured.accordion.ingredients'),
          content: "ekstrak ananas comocus, ekstrak glycyrrhiza glabra, ekstrak rodophyta, ekstrak centella asiatica, ekstrak bellis parennis, niacinamide dll."
        },
        {
          title: t('featured.accordion.shipping'),
          content: t('featured.accordion.shippingContent')
        },
        {
          title: t('featured.accordion.application'),
          content: t('featured.products.lightening-day-cream.applicationContent')
        }
      ]
    },
    {
      id: 'luminous-night-cream',
      name: 'Luminous Night Cream',
      cardTitle: 'Night Cream',
      price: 119000,
      oldPrice: 155000,
      reviews: 93,
      image: '/images/detailed/senara-detailed-cream.webp',
      watermark: 'Repair',
      description: t('featured.products.luminous-night-cream.description'),
      accordions: [
        {
          title: t('featured.accordion.ingredients'),
          content: "ekstrak ananas comocus, ekstrak glycyrrhiza glabra, ekstrak rodophyta, ekstrak centella asiatica, ekstrak bellis parennis, niacinamide dll."
        },
        {
          title: t('featured.accordion.shipping'),
          content: t('featured.accordion.shippingContent')
        },
        {
          title: t('featured.accordion.application'),
          content: t('featured.products.luminous-night-cream.applicationContent')
        }
      ]
    }
  ];

  const product = products[currentSlide];

  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setOpenAccordion(0);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    goToSlide(currentSlide === 0 ? products.length - 1 : currentSlide - 1);
  };

  const nextSlide = () => {
    goToSlide(currentSlide === products.length - 1 ? 0 : currentSlide + 1);
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

  return (
    <section className="relative bg-[#dce1d5] min-h-[700px] md:min-h-[800px] py-[80px] md:py-[120px] overflow-hidden flex items-center">
      {/* Watermark Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
        <span
          className="font-['Playfair_Display'] italic text-[25vw] md:text-[20vw] text-white/30 leading-none transition-all duration-500"
          style={{ whiteSpace: 'nowrap' }}
          key={product.watermark}
        >
          {product.watermark}
        </span>
      </div>

      <div className="container max-w-[1280px] mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Left Column: Text & Accordion */}
        <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <h2 className="font-['Playfair_Display'] text-[36px] md:text-[56px] lg:text-[64px] text-[#18281a] mb-10 md:mb-16">
            <em className="italic">{t('featured.title_em')}</em>{t('featured.title')}
          </h2>

          <div className="max-w-[480px]">
            {product.accordions.map((acc, index) => (
              <AccordionItem
                key={`${currentSlide}-${index}`}
                title={acc.title}
                content={acc.content}
                isOpen={openAccordion === index}
                onClick={() => setOpenAccordion(openAccordion === index ? -1 : index)}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Visuals & Floating Card */}
        <div className="relative mt-10 lg:mt-0 h-[450px] md:h-[550px] lg:h-[600px] flex items-center justify-center">
          {/* Main Product Image */}
          <img
            src={product.image}
            alt={product.name}
            className={`relative z-10 w-[100%] md:w-[110%] lg:w-[120%] max-w-[550px] object-contain transition-all duration-500 -translate-x-6 md:-translate-x-16 lg:-translate-x-24 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
          />

          {/* Floating Product Card */}
          <div className={`absolute bottom-4 md:bottom-10 right-0 md:-right-6 lg:-right-10 z-20 bg-white p-6 md:p-8 w-[280px] md:w-[320px] shadow-2xl transition-all duration-500 ${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
            <div className="flex items-center gap-1 mb-2">
              <div className="flex text-[#bd8033]">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
              <span className="font-['Manrope'] text-[11px] md:text-[12px] text-[#434842] ml-2">( {product.reviews} {t('featured.reviews')} )</span>
            </div>

            <h3 className="font-['Playfair_Display'] italic text-[26px] md:text-[32px] text-[#18281a] mb-2">
              {product.cardTitle}
            </h3>

            <div className="flex items-baseline gap-3 mb-3">
              <span className="font-['Manrope'] font-bold text-[22px] md:text-[24px] text-[#18281a]">Rp {product.price.toLocaleString('id-ID')}</span>
              <span className="font-['Manrope'] text-[14px] md:text-[16px] text-gray-400 line-through">Rp {product.oldPrice.toLocaleString('id-ID')}</span>
            </div>

            <p className="font-['Manrope'] text-[12px] md:text-[13px] text-[#434842] leading-[1.6] mb-5">
              {product.description}
            </p>

            <button
              onClick={handleAddToCart}
              className="w-full bg-[#18281a] text-white py-3 md:py-4 font-['Manrope'] font-medium text-[13px] md:text-[14px] flex justify-center items-center gap-2 hover:bg-[#2d3e2f] transition-colors active:scale-[0.98]"
            >
              {t('featured.addToBag')}
              <span className="material-symbols-outlined text-[18px]">shopping_basket</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slide Navigation */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 md:gap-6">
        <button
          onClick={prevSlide}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#18281a]/40 flex items-center justify-center text-[#18281a] hover:bg-[#18281a] hover:text-white transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
        </button>

        <div className="flex gap-2">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                  ? 'w-8 bg-[#18281a]'
                  : 'w-2 bg-[#18281a]/30 hover:bg-[#18281a]/50'
                }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#18281a] flex items-center justify-center text-white hover:bg-[#2d3e2f] transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
        </button>
      </div>

      {/* Slide Counter */}
      <div className="absolute top-8 md:top-12 right-8 md:right-12 z-20 font-['Manrope'] text-[13px] text-[#18281a]/60">
        <span className="font-bold text-[#18281a] text-[18px]">{String(currentSlide + 1).padStart(2, '0')}</span>
        <span className="mx-1">/</span>
        <span>{String(products.length).padStart(2, '0')}</span>
      </div>
    </section>
  );
}

export default FeaturedProductSection;
