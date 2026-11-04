/* Alfa Blue Box / Conceptual construction progression.
   Native scroll choreography, no third-party dependency. */
(() => {
  'use strict';
  const section = document.getElementById('construction');
  if (!section) return;
  const progressBar = document.getElementById('sequenceTimelineFill');
  const percentage = document.getElementById('sequencePercentage');
  const number = document.getElementById('constructionStepNumber');
  const eyebrow = document.getElementById('constructionStepEyebrow');
  const title = document.getElementById('constructionStepTitle');
  const description = document.getElementById('constructionStepDesc');
  const points = [...section.querySelectorAll('.sequence-point')];
  const steps = {
    ar: [
      ['الأساسات / FOUNDATION', 'كل صرح يبدأ بأساس.', 'تبدأ الرحلة بدراسة الموقع وتجهيزه وأعمال التأسيس طبقًا لنطاق المشروع.'],
      ['الهيكل / STRUCTURE', 'نبني الهيكل بدقة.', 'ترتفع العناصر الإنشائية طابقًا بعد طابق ضمن تصور بصري لمراحل التنفيذ.'],
      ['السقالات / SCAFFOLDING', 'دقّة في كل طابق.', 'الهيكل الخرساني ووسائل العمل المؤقتة تتشكّل في موقع التنفيذ.'],
      ['الواجهات / FACADE WORKS', 'العمل لا يزال جاريًا.', 'تركيب أجزاء الواجهة بجانب الهيكل المكشوف والرافعة والسقالات.']
    ],
    en: [
      ['FOUNDATIONS / 01', 'Every landmark starts below.', 'The visual journey begins with site preparation and foundation work according to project scope.'],
      ['STRUCTURE / 02', 'Precision, floor by floor.', 'The structural frame rises in a conceptual illustration of the construction process.'],
      ['SCAFFOLDING / 03', 'Construction in progress.', 'Temporary works, the reinforced frame and site equipment show how the structure takes shape.'],
      ['FACADE WORKS / 04', 'Still under construction.', 'Some glazing appears beside exposed concrete, cranes and temporary site structures.']
    ]
  };
  let lastStep = -1;
  let framePending = false;
  let progress = 0;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  function language() { return document.documentElement.lang === 'en' ? 'en' : 'ar'; }
  function updateStep(index) {
    index = clamp(index, 0, 3);
    const copy = steps[language()][index];
    if (lastStep !== index) {
      lastStep = index;
      section.dataset.stage = String(index);
      number.textContent = String(index + 1).padStart(2, '0');
      points.forEach((el, i) => {
        el.classList.toggle('active', i === index);
        if (i === index) el.setAttribute('aria-current', 'step');
        else el.removeAttribute('aria-current');
      });
      title.classList.remove('sequence-flash');
      void title.offsetWidth;
      title.classList.add('sequence-flash');
    }
    eyebrow.textContent = copy[0];
    title.textContent = copy[1];
    description.textContent = copy[2];
  }
  function refresh() {
    framePending = false;
    const bounds = section.getBoundingClientRect();
    const journey = Math.max(1, bounds.height - innerHeight);
    progress = clamp(-bounds.top / journey, 0, 1);
    section.style.setProperty('--fallback-reveal', `${Math.round((1-progress)*95)}%`);
    progressBar.style.width = `${Math.round(progress * 100)}%`;
    percentage.textContent = `${String(Math.round(progress * 100)).padStart(2, '0')}%`;
    const step = progress < 0.23 ? 0 : progress < 0.51 ? 1 : progress < 0.78 ? 2 : 3;
    updateStep(step);
    // Stage begins with exposed foundations and ends with full facade + crane.
    if (window.ABBSequence) window.ABBSequence.setProgress(progress);
  }
  function schedule() {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(refresh);
  }
  points.forEach((button, i) => button.addEventListener('click', () => {
    const target = [0.02, 0.33, 0.68, 0.99][i];
    const height = Math.max(1, section.offsetHeight - innerHeight);
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + target * height, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }));
  window.addEventListener('scroll', schedule, {passive: true});
  window.addEventListener('resize', schedule, {passive: true});
  window.addEventListener('abb-language-change', () => {
    lastStep = -1;
    schedule();
  });
  window.addEventListener('load', schedule);
  schedule();
})();
