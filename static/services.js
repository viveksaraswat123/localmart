// services.js — Handles smooth reveal animations, navbar behavior, parallax and back-to-top
(function(){
  'use strict';

  // Helper: staggered reveal using IntersectionObserver
  const revealObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target;
        const index = Number(el.dataset.index || 0);
        // stagger by index
        setTimeout(()=> el.classList.add('revealed'), index * 120);
        revealObserver.unobserve(el);
      }
    });
  },{threshold: 0.12});

  // Observe each service card
  document.addEventListener('DOMContentLoaded', ()=>{
    const cards = document.querySelectorAll('.service-card');
    cards.forEach((c,i)=>{
      // ensure data-index exists
      if(!c.dataset.index) c.dataset.index = i;
      // initially set tiny transform for nicer motion
      c.style.opacity = 0;
      c.style.transform = 'translateY(24px)';
      revealObserver.observe(c);
    });

    // Also reveal larger sections (hero, cta, footer)
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
        }
      });
    },{threshold:0.12});
    sections.forEach(s=>sectionObserver.observe(s));

    // Navbar compacting on scroll
    const nav = document.querySelector('nav');
    const onScroll = ()=>{
      if(window.scrollY > 48) nav.classList.add('nav-scrolled'); else nav.classList.remove('nav-scrolled');
      // Back-to-top button show
      const topBtn = document.querySelector('.back-to-top');
      if(topBtn){
        if(window.scrollY > 420) topBtn.classList.add('show'); else topBtn.classList.remove('show');
      }
    };
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();

    // Parallax micro-interaction on hero heading
    const hero = document.querySelector('.hero');
    if(hero){
      const heading = hero.querySelector('h1');
      hero.addEventListener('mousemove', (e)=>{
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) - rect.width/2;
        const y = (e.clientY - rect.top) - rect.height/2;
        heading.style.transform = `translate(${x*0.02}px, ${y*0.02}px)`;
      });
      hero.addEventListener('mouseleave', ()=>{ heading.style.transform='none'; });
    }

    // Back to top behavior
    const topBtn = document.querySelector('.back-to-top');
    if(topBtn){
      topBtn.addEventListener('click', ()=>{
        window.scrollTo({top:0, behavior:'smooth'});
      });
    }

    // Smooth scroll for internal anchor links (if any)
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click', (e)=>{
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
      });
    });

    // keyboard focus animation restore
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Tab') document.body.classList.add('user-tabbing');
    });
  });

})();
