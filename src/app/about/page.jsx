"use client";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import FooterSection from '../../components/FooterSection';
import { useLanguage } from '../../context/LanguageContext';

const storyPoints = [
    {
        id: 'p1', year: '2024', month: 'Januari', date: 'Januari 2024',
        title: 'Awal Produksi',
        desc: '<strong>SENARA</strong> memulai langkah pertamanya dalam dunia skincare — proses produksi pertama dimulai, menandai lahirnya brand skincare berbasis sains dan kearifan lokal Indonesia.',
        media: [
            { type: 'image', src: '/images/About/activities/produksi-awal/produksi-awal-1.webp', caption: '' },
        ]
    },
    {
        id: 'p2', year: '2024', month: 'Mei', date: '21 Mei 2024',
        title: 'Wisuda Magister Owner',
        desc: 'Owner <strong>SENARA</strong>, <strong>apt. Ramna Ningsih, S.Si., C.Herbs., M.Farm</strong>, menyelesaikan pendidikan Magister Farmasi — memperkuat fondasi ilmiah di balik setiap produk <strong>SENARA</strong>.',
        media: [
            { type: 'image', src: '/images/About/activities/wisuda/wisuda-1.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/wisuda/wisuda-2.webp', caption: '' },
        ]
    },
    {
        id: 'p3', year: '2024', month: 'Agustus', date: '16 Agustus 2024',
        title: 'Penghargaan KEMENKUMHAM',
        desc: 'Owner <strong>SENARA</strong> mendapatkan penghargaan dari <strong>KEMENKUMHAM</strong> atas capaiannya dalam menciptakan produk berbasis sains dan kearifan lokal, sebuah pengakuan nasional yang membanggakan.',
        media: [
            { type: 'image', src: '/images/About/activities/penghargaan-kemenkumham/penghargaan-kemenkumham-1.webp', caption: '' },
        ]
    },
    {
        id: 'p4', year: '2025', month: 'Maret', date: '18 Maret 2025',
        title: 'Wawancara TV Lokal',
        desc: '<strong>SENARA</strong> tampil di layar kaca melalui wawancara di TV lokal Bekasi, memperkenalkan brand skincare lokal berbasis sains kepada audiens yang lebih luas.',
        media: [
            { type: 'video', src: '/images/About/activities/wawancara-tv/wawancara-tv-1.mp4', caption: '' },
        ]
    },
    {
        id: 'p5', year: '2025', month: 'Juni', date: '22 Juni 2025',
        title: 'Aksi Bela Palestina',
        desc: '<strong>SENARA</strong> berpartisipasi dalam kegiatan aksi bela Palestina. Antusiasme peserta aksi yang membeli produk <strong>SKINCARE SENARA</strong> menunjukkan dukungan nyata. Sekretaris <strong>APDESI</strong> turut mendukung produk dalam negeri <strong>SKINCARE SENARA</strong>.',
        media: [
            { type: 'image', src: '/images/About/activities/aksi-palestina/aksi-palestina-1.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/aksi-palestina/aksi-palestina-2.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/aksi-palestina/aksi-palestina-3.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/aksi-palestina/aksi-palestina-4.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/aksi-palestina/aksi-palestina-5.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/aksi-palestina/aksi-palestina-6.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/aksi-palestina/aksi-palestina-7.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/aksi-palestina/aksi-palestina-8.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/aksi-palestina/aksi-palestina-9.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/aksi-palestina/aksi-palestina-10.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/aksi-palestina/aksi-palestina-11.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/aksi-palestina/aksi-palestina-12.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/aksi-palestina/aksi-palestina-13.webp', caption: '' },
            { type: 'video', src: '/images/About/activities/aksi-palestina/aksi-palestina-1.mp4', caption: 'Sekretaris APDESI dukung produk dalam negeri SKINCARE SENARA' },
            { type: 'video', src: '/images/About/activities/aksi-palestina/aksi-palestina-2.mp4', caption: '' },
            { type: 'video', src: '/images/About/activities/aksi-palestina/aksi-palestina-3.mp4', caption: '' },
        ]
    },
    {
        id: 'p6', year: '2025', month: 'September', date: '4 September 2025',
        title: 'Bersama Ivan Gunawan',
        desc: 'Owner <strong>SENARA</strong> bersama <strong>Ivan Gunawan</strong> di studio <strong>Kompas TV</strong>, memperluas jangkauan dan brand awareness di tingkat nasional.',
        media: [
            { type: 'image', src: '/images/About/activities/ivan-gunawan-kompas/ivan-gunawan-kompas-1.webp', caption: '' },
        ]
    },
    {
        id: 'p7', year: '2025', month: 'September', date: '4–6 September 2025',
        title: 'International EXPO di JCC',
        desc: '<strong>SENARA</strong> hadir di kegiatan <strong>International EXPO</strong> di <strong>Jakarta Convention Center (JCC)</strong> dan menjadi sponsor resmi dalam acara internasional tersebut. Dalam acara bergengsi ini, <strong>SENARA</strong> mendapatkan kehormatan dan apresiasi dari <strong>Bpk. Rachmat Gobel</strong> (Anggota DPR RI, Wakil Ketua KADIN), <strong>Prof. Dr. Hamdan Zulfa</strong> (Mantan Hakim MK), serta mendapatkan kunjungan dari <strong>Duta Besar Rusia untuk Indonesia</strong> — membawa produk lokal ke panggung global.',
        media: [
            { type: 'image', src: '/images/About/activities/jcc-expo/jcc-expo-1.webp', caption: 'Mendapatkan kehormatan dan apresiasi dari Mantan Hakim MK Prof. Dr. Hamdan Zulfa' },
            { type: 'image', src: '/images/About/activities/jcc-expo/jcc-expo-2.webp', caption: 'Mendapatkan kehormatan dan apresiasi dari Bpk. Rachmat Gobel Anggota DPR RI, Wakil Ketua KADIN' },
            { type: 'image', src: '/images/About/activities/jcc-expo/jcc-expo-3.webp', caption: 'Mendapatkan kunjungan dari Duta Rusia untuk Indonesia' },
            { type: 'image', src: '/images/About/activities/jcc-expo/jcc-expo-4.webp', caption: 'Menjadi sponsor dalam Internasional expo di JCC' },
            { type: 'image', src: '/images/About/activities/jcc-expo/jcc-expo-5.webp', caption: 'Menteri KOMDIGI Mutia Hafidz berkunjung ke stand SENARA' },
            { type: 'image', src: '/images/About/activities/jcc-expo/jcc-expo-6.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/jcc-expo/jcc-expo-7.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/jcc-expo/jcc-expo-8.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/jcc-expo/jcc-expo-9.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/jcc-expo/jcc-expo-10.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/jcc-expo/jcc-expo-11.webp', caption: '' },
        ]
    },
];

// Generate carousel images from all activity photos in storyPoints
const carouselImages = storyPoints
    .flatMap(point => point.media)
    .filter(item => item.type === 'image')
    .map(item => item.src);

export default function AboutPage() {
    const { t } = useLanguage();
    
    // Localize storyPoints
    const localizedStoryPoints = storyPoints.map(point => {
        const translatedPoints = t('aboutPage.storyPoints') || [];
        const translatedPoint = translatedPoints.find(p => p.id === point.id) || {};
        return {
            ...point,
            ...translatedPoint,
            media: point.media.map((m, idx) => ({
                ...m,
                caption: translatedPoint[`caption${idx + 1}`] || m.caption || ''
            }))
        };
    });

    const [scrolled, setScrolled] = useState(0);
    const [activePoint, setActivePoint] = useState(localizedStoryPoints[0]);
    const [mediaIndex, setMediaIndex] = useState(0);
    const [mobileMediaIndices, setMobileMediaIndices] = useState({});
    const pointRefs = useRef([]);
    
    // Carousel Drag & Auto-scroll States
    const carouselRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftState, setScrollLeftState] = useState(0);
    const directionRef = useRef(1); // 1 = auto scroll left, -1 = auto scroll right
    const requestRef = useRef(null);

    // Auto-scroll animation loop for the carousel
    useEffect(() => {
        const animate = () => {
            if (carouselRef.current && !isDragging) {
                carouselRef.current.scrollLeft += directionRef.current * 0.5;
                
                // Infinite loop handling (assuming 3 sets of images)
                const singleSetWidth = carouselRef.current.scrollWidth / 3;
                if (singleSetWidth > 0) {
                    if (directionRef.current === 1 && carouselRef.current.scrollLeft >= singleSetWidth * 2) {
                        carouselRef.current.scrollLeft -= singleSetWidth;
                    } else if (directionRef.current === -1 && carouselRef.current.scrollLeft <= 0) {
                        carouselRef.current.scrollLeft += singleSetWidth;
                    }
                }
            }
            requestRef.current = requestAnimationFrame(animate);
        };
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [isDragging]);

    // Initial center position for carousel
    useEffect(() => {
        const initScroll = () => {
            if (carouselRef.current) {
                carouselRef.current.scrollLeft = carouselRef.current.scrollWidth / 3;
            }
        };
        // Wait briefly for layout and images to paint
        const timer = setTimeout(initScroll, 150);
        window.addEventListener('resize', initScroll);
        
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', initScroll);
        };
    }, []);

    useEffect(() => {
        // Intersection Observer for scroll animations (reveal-on-scroll)
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal-on-scroll').forEach(el => {
            revealObserver.observe(el);
        });

        // Intersection Observer for Story Line Points
        const storyObserver = new IntersectionObserver((entries) => {
            // Find the most intersecting entry
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const pointId = entry.target.getAttribute('data-id');
                    const point = localizedStoryPoints.find(p => p.id === pointId);
                    if (point) setActivePoint(point);
                }
            });
        }, {
            // Trigger exactly when the element crosses the middle 10% of the screen
            rootMargin: "-45% 0px -45% 0px",
            threshold: 0
        });

        pointRefs.current.forEach(ref => {
            if (ref) storyObserver.observe(ref);
        });

        // Parallax effect for hero
        const handleScroll = () => {
            setScrolled(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            revealObserver.disconnect();
            storyObserver.disconnect();
        };
    }, []);

    // Reset media index when active point changes
    useEffect(() => {
        setMediaIndex(0);
    }, [activePoint.id]);

    // Gallery navigation (desktop sticky)
    const activeMedia = activePoint.media || [];
    const handlePrevMedia = useCallback(() => {
        setMediaIndex(prev => (prev - 1 + activeMedia.length) % activeMedia.length);
    }, [activeMedia.length]);
    const handleNextMedia = useCallback(() => {
        setMediaIndex(prev => (prev + 1) % activeMedia.length);
    }, [activeMedia.length]);

    // Mobile gallery navigation (per-item)
    const getMobileIndex = (pointId) => mobileMediaIndices[pointId] || 0;
    const setMobileIndex = (pointId, idx) => {
        setMobileMediaIndices(prev => ({ ...prev, [pointId]: idx }));
    };
    const handleMobilePrev = useCallback((pointId, mediaLength) => {
        setMobileMediaIndices(prev => {
            const current = prev[pointId] || 0;
            return { ...prev, [pointId]: (current - 1 + mediaLength) % mediaLength };
        });
    }, []);
    const handleMobileNext = useCallback((pointId, mediaLength) => {
        setMobileMediaIndices(prev => {
            const current = prev[pointId] || 0;
            return { ...prev, [pointId]: (current + 1) % mediaLength };
        });
    }, []);

    // Helper to get unique years
    const uniqueYears = [...new Set(localizedStoryPoints.map(p => p.year))];

    const handleYearClick = (year) => {
        const firstPointIndex = localizedStoryPoints.findIndex(p => p.year === year);
        if (firstPointIndex !== -1 && pointRefs.current[firstPointIndex]) {
            pointRefs.current[firstPointIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Secara eksplisit set poin aktif saat diklik agar langsung responsif
            setActivePoint(localizedStoryPoints[firstPointIndex]);
        }
    };

    return (
        <div className="bg-[#fcf9f5] text-[#1c1c19] selection:bg-[#ffddb7] selection:text-[#2a1700]">
            <Navbar />

            <main>
                {/* Hero Section */}
                <section className="relative bg-[#fcf9f5] pt-24 pb-32 overflow-hidden">
                    <div className="container relative z-10 flex flex-col items-center text-center">
                        {/* Badge */}
                        <div className="inline-block bg-[#f8e8d5] text-[#2a1700] px-6 py-2 rounded-full font-['Manrope'] text-[14px] font-semibold tracking-wider mb-8">
                            {t('aboutPage.badge')}
                        </div>

                        {/* Headline with Decorative Accent */}
                        <div className="relative inline-block">
                            <h1 className="font-['Playfair_Display'] text-[40px] md:text-[64px] text-[#18281a] mb-6 max-w-4xl mx-auto leading-tight relative z-10">
                                {t('aboutPage.headline')} <br /> {t('aboutPage.headlineBr')}
                            </h1>
                            {/* Left Decorative Curve */}
                            <div className="absolute -left-12 top-1/2 -translate-y-1/2 hidden lg:block">
                                <svg className="text-[#18281a]/20" fill="none" height="40" viewBox="0 0 40 40" width="40">
                                    <path d="M5 35C5 35 15 25 35 35" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
                                </svg>
                            </div>
                            {/* Right Decorative Curve + Text */}
                            <div className="absolute -right-24 top-0 hidden lg:block">
                                <div className="relative">
                                    <svg className="text-[#18281a]" fill="none" height="60" viewBox="0 0 80 60" width="80">
                                        <path d="M10 50C30 30 50 40 70 10" fill="none" stroke="currentColor" strokeWidth="1"></path>
                                        <path d="M65 15L70 10L72 18" stroke="currentColor" strokeWidth="1"></path>
                                    </svg>
                                    <span className="absolute -top-4 -right-16 font-['Manrope'] text-[12px] italic text-[#18281a] rotate-12 whitespace-nowrap">{t('aboutPage.provenByScience')}</span>
                                </div>
                            </div>
                        </div>

                        <p className="font-['Manrope'] text-[18px] text-[#434842] max-w-2xl mx-auto mb-16 leading-relaxed">
                            {(typeof t('aboutPage.subtitle') === 'string' ? t('aboutPage.subtitle') : '').split('\n').map((line, i) => (
                                <React.Fragment key={i}>
                                    {line}
                                    {i === 0 && <br />}
                                </React.Fragment>
                            ))}
                        </p>
                    </div>

                    {/* Interactive Auto-Scrolling Carousel */}
                    <div 
                        ref={carouselRef}
                        className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-16 overflow-hidden flex px-[5vw] py-8 cursor-grab active:cursor-grabbing"
                        onMouseDown={(e) => {
                            setIsDragging(true);
                            setStartX(e.pageX - carouselRef.current.offsetLeft);
                            setScrollLeftState(carouselRef.current.scrollLeft);
                        }}
                        onMouseLeave={() => setIsDragging(false)}
                        onMouseUp={() => setIsDragging(false)}
                        onMouseMove={(e) => {
                            if (!isDragging) return;
                            e.preventDefault();
                            const x = e.pageX - carouselRef.current.offsetLeft;
                            const walk = (x - startX) * 2;
                            carouselRef.current.scrollLeft = scrollLeftState - walk;
                            
                            if (walk > 0) directionRef.current = -1; // Dragged right -> auto move right
                            else if (walk < 0) directionRef.current = 1; // Dragged left -> auto move left
                        }}
                        onTouchStart={(e) => {
                            setIsDragging(true);
                            setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
                            setScrollLeftState(carouselRef.current.scrollLeft);
                        }}
                        onTouchEnd={() => setIsDragging(false)}
                        onTouchCancel={() => setIsDragging(false)}
                        onTouchMove={(e) => {
                            if (!isDragging) return;
                            const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
                            const walk = (x - startX) * 2;
                            carouselRef.current.scrollLeft = scrollLeftState - walk;
                            
                            if (walk > 0) directionRef.current = -1;
                            else if (walk < 0) directionRef.current = 1;
                        }}
                    >
                        <div className="flex gap-6 w-max mx-auto items-center pointer-events-none">
                            {/* Render array duplicated 3 times to ensure infinite scrolling works seamlessly */}
                            {[...carouselImages, ...carouselImages, ...carouselImages].map((imgUrl, idx) => {
                                // Add some random rotation and translation to match the previous aesthetic
                                const rotations = ['-rotate-6', 'rotate-3', '-rotate-3', 'rotate-6', 'rotate-0'];
                                const sizes = ['w-40 h-64', 'w-48 h-72'];
                                const rot = rotations[idx % rotations.length];
                                const size = idx % 3 === 0 ? sizes[1] : sizes[0];

                                return (
                                    <div key={idx} className={`${size} rounded-full overflow-hidden ${rot} shadow-lg shrink-0 select-none pointer-events-none`}>
                                        <img className="w-full h-full object-cover" src={imgUrl} alt={`Carousel ${idx}`} draggable="false" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="text-center relative z-10">
                        {/* CTA Area */}
                        <div className="relative inline-block mt-4">
                            <a className="inline-block bg-[#ff7b63] text-white px-10 py-5 rounded-full font-['Manrope'] text-[14px] font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 tracking-wider uppercase" href="#roots">
                                {t('aboutPage.cta')}
                            </a>
                            {/* CTA Decorative Accent */}
                            <div className="absolute -left-20 -bottom-8 hidden lg:block">
                                <div className="relative flex flex-col items-center">
                                    <svg className="text-[#18281a]" fill="none" height="40" viewBox="0 0 60 40" width="60">
                                        <path d="M50 5C30 5 10 15 5 35" fill="none" stroke="currentColor" strokeWidth="1"></path>
                                        <path d="M10 30L5 35L1 28" stroke="currentColor" strokeWidth="1"></path>
                                    </svg>
                                    <span className="font-['Manrope'] text-[12px] italic text-[#18281a] -rotate-12 mt-1">{t('aboutPage.rootedInNature')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Roots Section */}
                <section className="py-[120px] container" id="roots">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[120px] items-center">
                        <div className="reveal-on-scroll">
                            <span className="font-['Manrope'] text-[14px] font-semibold text-[#815513] block mb-4 uppercase tracking-wider">{t('aboutPage.roots.label')}</span>
                            <h2 className="font-['Playfair_Display'] text-[36px] text-[#18281a] mb-6">{t('aboutPage.roots.title')}</h2>
                            <p className="font-['Manrope'] text-[16px] text-[#434842] mb-6 leading-relaxed">
                                {t('aboutPage.roots.desc')}
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <span className="material-symbols-outlined text-[#815513]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                                    <div>
                                        <h4 className="font-['Manrope'] text-[14px] font-semibold text-[#18281a]">{t('aboutPage.roots.feature1_title')}</h4>
                                        <p className="font-['Manrope'] text-sm text-[#747872]">{t('aboutPage.roots.feature1_desc')}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="material-symbols-outlined text-[#815513]" style={{ fontVariationSettings: "'FILL' 1" }}>science</span>
                                    <div>
                                        <h4 className="font-['Manrope'] text-[14px] font-semibold text-[#18281a]">{t('aboutPage.roots.feature2_title')}</h4>
                                        <p className="font-['Manrope'] text-sm text-[#747872]">{t('aboutPage.roots.feature2_desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative reveal-on-scroll">
                            <img className="w-full h-auto object-cover rounded-sm" alt="Pineapple Enzymes" src="/images/About/senara-core.webp" />
                            <div className="absolute -bottom-6 -left-6 bg-[#815513] text-white p-8 rounded-lg shadow-xl hidden lg:block">
                                <p className="font-['Playfair_Display'] text-[24px] italic">{t('aboutPage.roots.quote')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Process (Bento Grid Style) */}
                <section className="bg-[#f6f3ef] py-[120px]">
                    <div className="container">
                        <div className="text-center max-w-2xl mx-auto mb-16 reveal-on-scroll">
                            <span className="font-['Manrope'] text-[14px] font-semibold text-[#815513] block mb-4 tracking-wider uppercase">{t('aboutPage.process.label')}</span>
                            <h2 className="font-['Playfair_Display'] text-[36px] text-[#18281a] mb-6">{t('aboutPage.process.title')}</h2>
                            <p className="font-['Manrope'] text-[16px] text-[#747872]">{t('aboutPage.process.desc')}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
                            {/* Left: Large Feature Block */}
                            <div className="bg-white border border-[#c3c8c0]/30 rounded-xl overflow-hidden shadow-sm reveal-on-scroll flex flex-col group">
                                <div className="h-[450px] relative overflow-hidden">
                                    <img 
                                        alt={t('aboutPage.process.step1_title')} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                        src="/images/About/senara-journey1.webp"
                                    />
                                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm">
                                        <span className="font-['Manrope'] text-[12px] font-semibold text-[#18281a] uppercase tracking-wider">Step 01</span>
                                    </div>
                                </div>
                                <div className="p-8 lg:p-10 flex flex-col justify-between flex-grow gap-6">
                                    <div>
                                        <h3 className="font-['Playfair_Display'] text-[24px] text-[#18281a] mb-4">{t('aboutPage.process.step1_title')}</h3>
                                        <p className="font-['Manrope'] text-[16px] text-[#747872] leading-relaxed">
                                            {t('aboutPage.process.step1_desc')}
                                        </p>
                                    </div>
                                    <div className="w-12 h-1 bg-[#815513] rounded-full"></div>
                                </div>
                            </div>
                            
                            {/* Right: Stacked Smaller Blocks */}
                            <div className="flex flex-col gap-[24px]">
                                {/* Step 2 */}
                                <div className="bg-white border border-[#c3c8c0]/30 rounded-xl overflow-hidden shadow-sm reveal-on-scroll grid grid-cols-1 sm:grid-cols-5 h-full group" style={{ transitionDelay: '100ms' }}>
                                    <div className="p-8 lg:p-10 space-y-4 sm:col-span-3 flex flex-col justify-center">
                                        <span className="font-['Manrope'] text-[12px] font-semibold text-[#815513] uppercase tracking-widest">Step 02</span>
                                        <h3 className="font-['Playfair_Display'] text-[24px] text-[#18281a]">{t('aboutPage.process.step2_title')}</h3>
                                        <p className="font-['Manrope'] text-[16px] text-[#747872] leading-relaxed">
                                            {t('aboutPage.process.step2_desc')}
                                        </p>
                                    </div>
                                    <div className="sm:col-span-2 h-48 sm:h-full overflow-hidden">
                                        <img 
                                            alt={t('aboutPage.process.step2_title')} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                            src="/images/About/senara-journey2.webp"
                                        />
                                    </div>
                                </div>
                                
                                {/* Step 3 */}
                                <div className="bg-white border border-[#c3c8c0]/30 rounded-xl overflow-hidden shadow-sm reveal-on-scroll grid grid-cols-1 sm:grid-cols-5 h-full group" style={{ transitionDelay: '200ms' }}>
                                    <div className="sm:col-span-2 h-48 sm:h-full order-2 sm:order-1 overflow-hidden">
                                        <img 
                                            alt={t('aboutPage.process.step3_title')} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                            src="/images/About/senara-sustainability.webp" 
                                        />
                                    </div>
                                    <div className="p-8 lg:p-10 space-y-4 sm:col-span-3 flex flex-col justify-center order-1 sm:order-2">
                                        <span className="font-['Manrope'] text-[12px] font-semibold text-[#815513] uppercase tracking-widest">Step 03</span>
                                        <h3 className="font-['Playfair_Display'] text-[24px] text-[#18281a]">{t('aboutPage.process.step3_title')}</h3>
                                        <p className="font-['Manrope'] text-[16px] text-[#747872] leading-relaxed">
                                            {t('aboutPage.process.step3_desc')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sustainability Commitment */}
                <section className="relative py-[120px] overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img className="w-full h-full object-cover" alt="Sustainability Landscape" src="/images/About/senara-sustainability.webp" />
                        <div className="absolute inset-0 bg-[#18281a]/70 mix-blend-multiply"></div>
                    </div>
                    <div className="relative z-10 container text-white">
                        <div className="max-w-3xl">
                            <span className="font-['Manrope'] text-[14px] font-semibold text-white block mb-4 tracking-wider">{t('aboutPage.sustainability.label')}</span>
                            <h2 className="font-['Playfair_Display'] text-[36px] md:text-[64px] leading-tight mb-8">{t('aboutPage.sustainability.title')}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px]">
                                <div className="reveal-on-scroll">
                                    <h4 className="font-['Playfair_Display'] text-[24px] mb-2 text-white">{t('aboutPage.sustainability.feature1_title')}</h4>
                                    <p className="font-['Manrope'] text-[16px] text-white/80">{t('aboutPage.sustainability.feature1_desc')}</p>
                                </div>
                                <div className="reveal-on-scroll">
                                    <h4 className="font-['Playfair_Display'] text-[24px] mb-2 text-white">{t('aboutPage.sustainability.feature2_title')}</h4>
                                    <p className="font-['Manrope'] text-[16px] text-white/80">{t('aboutPage.sustainability.feature2_desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Meet the Founders */}
                <section className="py-[120px] container">
                    <div className="flex flex-col md:flex-row gap-[120px] items-center">
                        <div className="w-full md:w-1/2 reveal-on-scroll">
                            <div className="aspect-[4/5] bg-[#f0ede9] overflow-hidden rounded-sm relative group">
                                <img className="w-full h-full object-cover" alt="Founders Portrait" src="/images/About/senara-owner.webp" />
                                <div className="absolute inset-0 border-[24px] border-white/10 pointer-events-none"></div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 reveal-on-scroll">
                            <span className="font-['Manrope'] text-[14px] font-semibold text-[#815513] block mb-4 tracking-wider uppercase">{t('aboutPage.founder.label')}</span>
                            <h2 className="font-['Playfair_Display'] text-[36px] text-[#18281a] mb-6">{t('aboutPage.founder.name')}</h2>
                            <p className="font-['Manrope'] text-[18px] text-[#434842] mb-6 italic">{t('aboutPage.founder.quote')}</p>
                            <p className="font-['Manrope'] text-[16px] text-[#747872] mb-8 leading-relaxed">
                                {t('aboutPage.founder.desc')}
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="h-[1px] w-12 bg-[#815513]"></div>
                                <span className="font-['Manrope'] text-[14px] font-semibold text-[#18281a] uppercase tracking-widest">{t('aboutPage.founder.title')}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Story Line Section (Scroll Spy) */}
                <section className="py-[120px] bg-[#f6f3ef]" id="evolution">
                    <div className="container">
                        <div className="text-center max-w-3xl mx-auto mb-16 reveal-on-scroll">
                            <span className="font-['Manrope'] text-[14px] font-semibold text-[#815513] block mb-4 uppercase tracking-wider">{t('aboutPage.timeline.label')}</span>
                            <h2 className="font-['Playfair_Display'] text-[36px] text-[#18281a] mb-6">{t('aboutPage.timeline.title')}</h2>
                            <p className="font-['Manrope'] text-[16px] text-[#434842]">{t('aboutPage.timeline.desc')}</p>
                        </div>

                        {/* Year Navigation Indicators */}
                        <div className="flex justify-center gap-4 lg:gap-8 border-b border-[#c3c8c0]/30 mb-8 lg:mb-10 max-w-sm mx-auto overflow-x-auto sticky top-[90px] lg:top-[96px] z-40 bg-[#f6f3ef]/90 backdrop-blur-sm py-3 lg:py-3">
                            {uniqueYears.map((year) => (
                                <button
                                    key={year}
                                    onClick={() => handleYearClick(year)}
                                    className={`px-3 lg:px-4 font-['Manrope'] text-[14px] font-semibold transition-all duration-300 ${activePoint.year === year ? 'text-[#815513]' : 'text-[#747872] hover:text-[#18281a]'}`}
                                >
                                    {year}
                                    {/* Active underline indicator */}
                                    <div className={`h-[2px] mt-1.5 lg:mt-2 transition-all duration-300 ${activePoint.year === year ? 'bg-[#815513] w-full' : 'bg-transparent w-0'}`}></div>
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[48px] items-start relative">
                            {/* Left: Scrolling Activities */}
                            <div className="lg:col-span-6 relative pl-10 lg:pl-[60px] pb-8 lg:pb-[20vh] pt-4 lg:pt-[10vh]">
                                    {/* Vertical Timeline Line */}
                                    <div className="absolute left-[18px] lg:left-[30px] top-0 bottom-0 w-[2px] bg-[#c3c8c0]/50"></div>
                                    <div className="space-y-16 lg:space-y-[40vh]">
                                        {localizedStoryPoints.map((point, idx) => {
                                        const pointMedia = point.media || [];
                                        const mIdx = getMobileIndex(point.id);
                                        const currentMobileMedia = pointMedia[mIdx];

                                        return (
                                            <div
                                                key={point.id}
                                                data-id={point.id}
                                                data-year={point.year}
                                                ref={el => pointRefs.current[idx] = el}
                                                className={`transition-opacity duration-500 relative lg:${activePoint.id === point.id ? 'opacity-100' : 'opacity-30'}`}
                                            >
                                                {/* Timeline dot */}
                                                <div className={`absolute -left-[26px] lg:-left-[35px] top-2 w-3 h-3 rounded-full border-4 border-[#f6f3ef] transition-all duration-300 ${activePoint.id === point.id ? 'bg-[#815513] outline outline-1 outline-[#815513] z-10 scale-125' : 'bg-[#c3c8c0] scale-100'}`}></div>

                                                <span className="inline-block px-3 py-1 bg-[#815513]/10 text-[#815513] font-['Manrope'] text-[11px] lg:text-[12px] font-bold rounded-full mb-3 lg:mb-4">{point.date}</span>
                                                <h3 className="font-['Playfair_Display'] text-[24px] lg:text-[32px] text-[#18281a] mb-3 lg:mb-4">{point.title}</h3>
                                                <p 
                                                    className="font-['Manrope'] text-[15px] lg:text-[18px] text-[#434842] leading-relaxed [&>strong]:font-bold [&>strong]:text-[#18281a]" 
                                                    dangerouslySetInnerHTML={{ __html: point.desc }}
                                                />

                                                {/* Mobile Inline Gallery (visible only on mobile) */}
                                                {pointMedia.length > 0 && (
                                                    <div className="mt-5 lg:hidden">
                                                        {/* Konteks Dokumentasi (Luar Gambar) */}
                                                        {currentMobileMedia?.caption && (
                                                            <div className="bg-[#f8e8d5] px-4 py-3 rounded-t-xl w-full border-b border-[#e1d2bc]">
                                                                <p className="font-['Manrope'] text-[13px] font-medium text-[#2a1700] text-center leading-relaxed">
                                                                    {currentMobileMedia.caption}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Main media viewer */}
                                                        <div className={`relative overflow-hidden bg-[#f0ede9] aspect-[4/3] shadow-sm group ${currentMobileMedia?.caption ? 'rounded-b-xl' : 'rounded-xl'}`}>

                                                            {currentMobileMedia && (
                                                                currentMobileMedia.type === 'video' ? (
                                                                    <video
                                                                        key={`mobile-${point.id}-${mIdx}`}
                                                                        className="absolute inset-0 w-full h-full object-cover"
                                                                        src={currentMobileMedia.src}
                                                                        controls
                                                                        playsInline
                                                                        preload="metadata"
                                                                    />
                                                                ) : (
                                                                    <img
                                                                        key={`mobile-${point.id}-${mIdx}`}
                                                                        className="absolute inset-0 w-full h-full object-cover"
                                                                        alt={`${point.title} - ${mIdx + 1}`}
                                                                        src={currentMobileMedia.src}
                                                                    />
                                                                )
                                                            )}

                                                            {/* Navigation arrows */}
                                                            {pointMedia.length > 1 && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleMobilePrev(point.id, pointMedia.length)}
                                                                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center text-[#18281a] active:scale-90 transition-transform"
                                                                        aria-label="Previous"
                                                                    >
                                                                        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleMobileNext(point.id, pointMedia.length)}
                                                                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center text-[#18281a] active:scale-90 transition-transform"
                                                                        aria-label="Next"
                                                                    >
                                                                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                                                                    </button>

                                                                    {/* Counter / dots */}
                                                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1.5">
                                                                        {pointMedia.length <= 8 ? (
                                                                            pointMedia.map((_, dotIdx) => (
                                                                                <button
                                                                                    key={dotIdx}
                                                                                    onClick={() => setMobileIndex(point.id, dotIdx)}
                                                                                    className={`rounded-full transition-all duration-300 ${dotIdx === mIdx
                                                                                        ? 'w-5 h-1.5 bg-white'
                                                                                        : 'w-1.5 h-1.5 bg-white/50'
                                                                                        }`}
                                                                                    aria-label={`Media ${dotIdx + 1}`}
                                                                                />
                                                                            ))
                                                                        ) : (
                                                                            <span className="font-['Manrope'] text-[11px] text-white font-semibold">
                                                                                {mIdx + 1} / {pointMedia.length}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>

                                                        {/* Thumbnail strip (mobile) */}
                                                        {pointMedia.length > 1 && (
                                                            <div className="mt-1.5 flex gap-1.5 overflow-x-auto py-2 px-1 -mx-1 scrollbar-thin">
                                                                {pointMedia.map((item, tIdx) => (
                                                                    <button
                                                                        key={tIdx}
                                                                        onClick={() => setMobileIndex(point.id, tIdx)}
                                                                        className={`relative shrink-0 w-12 h-12 rounded-lg transition-all duration-200 ${tIdx === mIdx
                                                                            ? 'ring-2 ring-[#815513] ring-offset-2 ring-offset-[#f6f3ef] opacity-100 scale-[1.02]'
                                                                            : 'opacity-40 hover:opacity-80'
                                                                            }`}
                                                                    >
                                                                        <div className="w-full h-full rounded-lg overflow-hidden">
                                                                            {item.type === 'video' ? (
                                                                                <div className="w-full h-full bg-[#18281a]/80 flex items-center justify-center">
                                                                                    <span className="material-symbols-outlined text-white text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                                                                                </div>
                                                                            ) : (
                                                                                <img className="w-full h-full object-cover" alt={`Thumb ${tIdx + 1}`} src={item.src} />
                                                                            )}
                                                                        </div>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Right: Sticky Media Gallery */}
                            <div className="hidden lg:block lg:col-span-6 sticky top-[145px] lg:top-[180px] z-10">
                                <div className="rounded-lg overflow-hidden bg-[#f0ede9] w-full h-[340px] xl:h-[400px] 2xl:h-[440px] shadow-sm relative group">
                                    {/* Konteks Dokumentasi (Overlay) */}
                                    {activeMedia.length > 0 && activeMedia[mediaIndex] && activeMedia[mediaIndex].caption && (
                                        <div className="absolute top-0 inset-x-0 z-10 bg-gradient-to-b from-black/60 to-transparent pt-4 pb-8 px-6 pointer-events-none transition-opacity duration-300 flex justify-center">
                                            <p className="font-['Manrope'] text-[14px] xl:text-[15px] font-medium text-[#f6f3ef] drop-shadow-md text-center max-w-[90%] line-clamp-2">
                                                {activeMedia[mediaIndex].caption}
                                            </p>
                                        </div>
                                    )}

                                    {/* Current Media Item */}
                                    {activeMedia.length > 0 && activeMedia[mediaIndex] && (
                                        activeMedia[mediaIndex].type === 'video' ? (
                                            <video
                                                key={`${activePoint.id}-${mediaIndex}`}
                                                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                                                src={activeMedia[mediaIndex].src}
                                                controls
                                                playsInline
                                                preload="metadata"
                                            />
                                        ) : (
                                            <img
                                                key={`${activePoint.id}-${mediaIndex}`}
                                                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                                                alt={`${activePoint.title} - ${mediaIndex + 1}`}
                                                src={activeMedia[mediaIndex].src}
                                            />
                                        )
                                    )}

                                    {/* Gallery Navigation (only show if more than 1 item) */}
                                    {activeMedia.length > 1 && (
                                        <>
                                            {/* Prev Button */}
                                            <button
                                                onClick={handlePrevMedia}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center text-[#18281a] hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                                                aria-label="Previous media"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                            </button>
                                            {/* Next Button */}
                                            <button
                                                onClick={handleNextMedia}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center text-[#18281a] hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                                                aria-label="Next media"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                            </button>

                                            {/* Dot Indicators */}
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-3 py-2">
                                                {activeMedia.length <= 10 ? (
                                                    activeMedia.map((_, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => setMediaIndex(idx)}
                                                            className={`rounded-full transition-all duration-300 ${idx === mediaIndex
                                                                ? 'w-6 h-2 bg-white'
                                                                : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                                                                }`}
                                                            aria-label={`Go to media ${idx + 1}`}
                                                        />
                                                    ))
                                                ) : (
                                                    /* Counter for large media sets */
                                                    <span className="font-['Manrope'] text-[12px] text-white font-semibold tracking-wide">
                                                        {mediaIndex + 1} / {activeMedia.length}
                                                    </span>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Thumbnail Strip (for activities with multiple media) */}
                                {activeMedia.length > 1 && (
                                    <div className="mt-3 flex gap-2 overflow-x-auto py-2 px-1 scrollbar-thin">
                                        {activeMedia.map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setMediaIndex(idx)}
                                                className={`relative shrink-0 w-16 h-16 rounded-md transition-all duration-300 ${idx === mediaIndex
                                                    ? 'ring-2 ring-[#815513] ring-offset-2 ring-offset-[#f6f3ef] opacity-100 scale-[1.02]'
                                                    : 'opacity-50 hover:opacity-80'
                                                    }`}
                                            >
                                                <div className="w-full h-full rounded-md overflow-hidden">
                                                    {item.type === 'video' ? (
                                                        <div className="w-full h-full bg-[#18281a]/80 flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                                                        </div>
                                                    ) : (
                                                        <img className="w-full h-full object-cover" alt={`Thumbnail ${idx + 1}`} src={item.src} />
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Newsletter */}
                <section className="bg-[#815513]/5 py-[32px] border-y border-[#c3c8c0]/30 overflow-hidden">
                    <div className="container flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                        <div className="w-full">
                            <h3 className="font-['Playfair_Display'] text-[24px] text-[#18281a]">{t('aboutPage.newsletter.title')}</h3>
                            <p className="font-['Manrope'] text-[14px] text-[#747872]">{t('aboutPage.newsletter.desc')}</p>
                        </div>
                        <form className="flex flex-col sm:flex-row w-full md:w-auto gap-2" onSubmit={(e) => e.preventDefault()}>
                            <input className="bg-white border-[#c3c8c0] focus:border-[#815513] focus:ring-[#815513] rounded-sm px-4 py-3 flex-grow md:w-80 font-['Manrope'] text-[16px]" placeholder={t('aboutPage.newsletter.placeholder')} type="email" />
                            <button className="bg-[#18281a] text-white px-6 py-3 font-['Manrope'] text-[14px] font-semibold hover:bg-[#815513] transition-colors uppercase tracking-wider" type="submit">{t('aboutPage.newsletter.subscribe')}</button>
                        </form>
                    </div>
                </section>
            </main>

            <FooterSection />
        </div>
    );
}
