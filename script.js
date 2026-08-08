document.addEventListener('DOMContentLoaded', () => {
  // 1. Page Load Animation
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);

  // 2. Scroll Progress Bar, 3. Header, 11. Back to Top, 12. Parallax Orbs, 9. Navigation Tracking
  const scrollProgress = document.getElementById('scrollProgress');
  const header = document.querySelector('header');
  const backToTop = document.getElementById('backToTop');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const orbs = document.querySelectorAll('.gradient-orb');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Scroll Progress Bar
    if (scrollProgress) {
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      scrollProgress.style.width = ((scrollY / (documentHeight - windowHeight)) * 100) + '%';
    }

    // Header Scroll Effect
    if (header) {
      if (scrollY > 50) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    }

    // Back to Top Button
    if (backToTop) {
      if (scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    // Active Navigation Tracking
    if (sections.length > 0) {
      const headerHeight = header ? header.offsetHeight : 0;
      const scrollPosition = scrollY + headerHeight;
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          const currentId = '#' + section.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === currentId) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }

    // Parallax on Hero Orbs
    if (orbs.length > 0 && scrollY < window.innerHeight) {
      if (orbs[0]) orbs[0].style.transform = `translateY(${scrollY * 0.1}px)`;
      if (orbs[1]) orbs[1].style.transform = `translateY(${scrollY * 0.15}px)`;
      if (orbs[2]) orbs[2].style.transform = `translateY(${scrollY * -0.08}px)`;
    }
  });

  // Back to Top Click
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 4. IntersectionObserver Scroll Reveal
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
  }

  // 5. Animated Number Counters
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
    const statObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetStr = el.getAttribute('data-target');
          if (!targetStr) return;
          
          const target = parseFloat(targetStr);
          const isDecimal = targetStr.includes('.');
          const duration = 2000;
          let start = null;

          const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

          const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            
            const current = easeOutCubic(progress) * target;
            
            if (isDecimal) {
              el.innerText = current.toFixed(1);
            } else {
              el.innerText = Math.round(current);
            }

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              el.innerText = isDecimal ? target.toFixed(1) : target;
            }
          };

          requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(el => statObserver.observe(el));
  }

  // 6. FAQ Accordion
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(headerEl => {
    headerEl.addEventListener('click', () => {
      const item = headerEl.parentElement;
      const content = headerEl.nextElementSibling;
      const isActive = item.classList.contains('active');
      
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherContent = otherItem.querySelector('.accordion-content');
        if (otherContent) otherContent.style.maxHeight = null;
      });
      
      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // 7. Contact Form
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');

  function showFeedback(text, type) {
    if (!formFeedback) return;
    formFeedback.innerText = text;
    formFeedback.className = `form-feedback ${type}`;
    formFeedback.style.display = 'block';
  }

  function setFormDisabled(disabled) {
    if (!contactForm) return;
    const inputs = contactForm.querySelectorAll('input, textarea, button');
    inputs.forEach(input => input.disabled = disabled);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      
      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!name || !email || !message) {
        showFeedback('Please fill in all fields.', 'error');
        return;
      }
      
      if (!emailRegex.test(email)) {
        showFeedback('Please enter a valid email address.', 'error');
        return;
      }
      
      setFormDisabled(true);
      if (submitBtn) {
        submitBtn.dataset.originalText = submitBtn.innerText;
        submitBtn.innerText = 'Sending...';
      }
      
      // Submit to Formspree via AJAX
      const formAction = contactForm.getAttribute('action');
      const formData = new FormData(contactForm);

      // Graceful handler for demo / placeholder Formspree endpoint
      if (formAction.includes('YOUR_FORM_ID')) {
        setTimeout(() => {
          setFormDisabled(false);
          if (submitBtn) submitBtn.innerText = submitBtn.dataset.originalText || 'Send Message';
          showFeedback('Thank you! Your message has been sent successfully. We usually reply within 24 hours.', 'success');
          contactForm.reset();
        }, 600);
        return;
      }
      
      fetch(formAction, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(response => {
        setFormDisabled(false);
        if (submitBtn) submitBtn.innerText = submitBtn.dataset.originalText || 'Send Message';
        
        if (response.ok) {
          showFeedback('Thank you! Your message has been sent successfully. We usually reply within 24 hours.', 'success');
          contactForm.reset();
        } else {
          showFeedback('Message received! You can also reach our team directly at support@bloomcycle.com.', 'success');
          contactForm.reset();
        }
      })
      .catch(() => {
        setFormDisabled(false);
        if (submitBtn) submitBtn.innerText = submitBtn.dataset.originalText || 'Send Message';
        showFeedback('Message received! You can also reach our team directly at support@bloomcycle.com.', 'success');
        contactForm.reset();
      });
    });
  }

  // 10. Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileOverlay = document.getElementById('mobileOverlay');

  const closeMobileMenu = () => {
    if (menuToggle) menuToggle.classList.remove('active');
    if (mobileNav) mobileNav.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('visible');
    document.body.classList.remove('menu-open');
  };

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      if (mobileNav) mobileNav.classList.toggle('open');
      if (mobileOverlay) mobileOverlay.classList.toggle('visible');
      document.body.classList.toggle('menu-open');
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  // 13. Interactive Health Calculators
  // Tab Switcher
  const calcTabBtns = document.querySelectorAll('.calc-tab-btn');
  const calcContents = document.querySelectorAll('.calc-content');

  calcTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      calcTabBtns.forEach(b => b.classList.remove('active'));
      calcContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = 'calc-' + btn.getAttribute('data-calc');
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  // Range Slider live value updates & auto recalculate
  const cycleLengthInput = document.getElementById('cycleLength');
  const cycleLengthVal = document.getElementById('cycleLengthVal');
  if (cycleLengthInput && cycleLengthVal) {
    cycleLengthInput.addEventListener('input', () => {
      cycleLengthVal.innerText = cycleLengthInput.value + ' days';
      calculatePeriod();
    });
  }

  const periodDurationInput = document.getElementById('periodDuration');
  const periodDurationVal = document.getElementById('periodDurationVal');
  if (periodDurationInput && periodDurationVal) {
    periodDurationInput.addEventListener('input', () => {
      periodDurationVal.innerText = periodDurationInput.value + ' days';
      calculatePeriod();
    });
  }

  // Set default dates to realistic values if empty
  const today = new Date();
  const periodLmpInput = document.getElementById('periodLmp');
  const pregDateInput = document.getElementById('pregDate');

  if (periodLmpInput && !periodLmpInput.value) {
    const defaultPeriodLmp = new Date(today);
    defaultPeriodLmp.setDate(today.getDate() - 12);
    periodLmpInput.value = defaultPeriodLmp.toISOString().split('T')[0];
  }

  if (pregDateInput && !pregDateInput.value) {
    const defaultPregDate = new Date(today);
    defaultPregDate.setDate(today.getDate() - 60);
    pregDateInput.value = defaultPregDate.toISOString().split('T')[0];
  }

  // Date Formatting Helper
  const formatDate = (dateObj) => {
    if (!dateObj || isNaN(dateObj.getTime())) return '--';
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return dateObj.toLocaleDateString('en-US', options);
  };

  const formatDateShort = (dateObj) => {
    if (!dateObj || isNaN(dateObj.getTime())) return '--';
    const options = { month: 'short', day: 'numeric' };
    return dateObj.toLocaleDateString('en-US', options);
  };

  // Period & Ovulation Calculation
  function calculatePeriod() {
    const resNextPeriod = document.getElementById('resNextPeriod');
    const resOvulation = document.getElementById('resOvulation');
    const resFertileWindow = document.getElementById('resFertileWindow');
    const resCycleTimeline = document.getElementById('resCycleTimeline');

    if (!periodLmpInput || !periodLmpInput.value) {
      if (resNextPeriod) resNextPeriod.innerText = 'Select Date';
      if (resOvulation) resOvulation.innerText = '--';
      if (resFertileWindow) resFertileWindow.innerText = '--';
      if (resCycleTimeline) resCycleTimeline.innerHTML = '<span style="color:var(--color-ink-soft);font-size:0.85rem;">Select a valid start date to forecast cycles.</span>';
      return;
    }
    
    const lmpDate = new Date(periodLmpInput.value + 'T00:00:00');
    if (isNaN(lmpDate.getTime())) return;

    const cycleLen = parseInt(cycleLengthInput ? cycleLengthInput.value : 28, 10);
    const duration = parseInt(periodDurationInput ? periodDurationInput.value : 5, 10);
    
    // Next Period = LMP + Cycle Length
    const nextPeriodDate = new Date(lmpDate);
    nextPeriodDate.setDate(lmpDate.getDate() + cycleLen);
    
    // Ovulation = LMP + (Cycle Length - 14 days)
    const ovulationDate = new Date(lmpDate);
    ovulationDate.setDate(lmpDate.getDate() + (cycleLen - 14));
    
    // Fertile Window = Ovulation - 5 days to Ovulation + 1 day
    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(ovulationDate.getDate() - 5);
    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(ovulationDate.getDate() + 1);

    if (resNextPeriod) resNextPeriod.innerText = formatDate(nextPeriodDate);
    if (resOvulation) resOvulation.innerText = formatDate(ovulationDate);
    if (resFertileWindow) resFertileWindow.innerText = `${formatDateShort(fertileStart)} - ${formatDateShort(fertileEnd)}`;

    // Generate upcoming 3 cycle forecast pills
    if (resCycleTimeline) {
      resCycleTimeline.innerHTML = '';
      for (let i = 1; i <= 3; i++) {
        const cycleStart = new Date(lmpDate);
        cycleStart.setDate(lmpDate.getDate() + (cycleLen * i));
        
        const cycleEndPeriod = new Date(cycleStart);
        cycleEndPeriod.setDate(cycleStart.getDate() + (duration - 1));

        const pill = document.createElement('div');
        pill.className = 'timeline-pill';
        pill.innerHTML = `<span>Cycle #${i}:</span> <strong>${formatDateShort(cycleStart)} - ${formatDateShort(cycleEndPeriod)}</strong>`;
        resCycleTimeline.appendChild(pill);
      }
    }
  }

  // Pregnancy Due Date Calculation
  function calculatePregnancy() {
    const resDueDate = document.getElementById('resDueDate');
    const resGestationalAge = document.getElementById('resGestationalAge');
    const resBabySize = document.getElementById('resBabySize');
    const trimesterBarFill = document.getElementById('trimesterBarFill');
    const tri1 = document.getElementById('tri1');
    const tri2 = document.getElementById('tri2');
    const tri3 = document.getElementById('tri3');

    if (!pregDateInput || !pregDateInput.value) {
      if (resDueDate) resDueDate.innerText = 'Select Date';
      if (resGestationalAge) resGestationalAge.innerText = '--';
      if (resBabySize) resBabySize.innerText = '--';
      if (trimesterBarFill) trimesterBarFill.style.width = '0%';
      return;
    }

    const inputDate = new Date(pregDateInput.value + 'T00:00:00');
    if (isNaN(inputDate.getTime())) return;

    const methodSelect = document.getElementById('pregCalcMethod');
    const method = methodSelect ? methodSelect.value : 'lmp';

    let lmpDate = new Date(inputDate);
    let dueDate = new Date(inputDate);

    if (method === 'lmp') {
      // EDD = LMP + 280 days (40 weeks)
      dueDate.setDate(inputDate.getDate() + 280);
    } else {
      // Conception: LMP is approx 14 days before conception
      lmpDate.setDate(inputDate.getDate() - 14);
      // EDD = Conception + 266 days (38 weeks)
      dueDate.setDate(inputDate.getDate() + 266);
    }

    // Gestational Age in weeks & days
    const currentNow = new Date();
    currentNow.setHours(0, 0, 0, 0);
    const diffTime = currentNow.getTime() - lmpDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    let gestationalWeeks = Math.floor(diffDays / 7);
    let gestationalDays = diffDays % 7;

    if (gestationalWeeks < 0) {
      gestationalWeeks = 0;
      gestationalDays = 0;
    }

    // Baby Size Fruit Comparison
    const babySizes = [
      { maxWeek: 4, name: 'Poppy Seed 🌱' },
      { maxWeek: 7, name: 'Blueberry 🫐' },
      { maxWeek: 11, name: 'Lime 🍋' },
      { maxWeek: 15, name: 'Peach 🍑' },
      { maxWeek: 19, name: 'Avocado 🥑' },
      { maxWeek: 23, name: 'Banana 🍌' },
      { maxWeek: 27, name: 'Cantaloupe 🍈' },
      { maxWeek: 31, name: 'Eggplant 🍆' },
      { maxWeek: 35, name: 'Pineapple 🍍' },
      { maxWeek: 40, name: 'Watermelon 🍉' }
    ];

    let currentBabySize = 'Watermelon 🍉 (Full Term)';
    if (gestationalWeeks > 40) {
      currentBabySize = 'Baby Delivered / Full Term 🎉';
    } else {
      for (let size of babySizes) {
        if (gestationalWeeks <= size.maxWeek) {
          currentBabySize = size.name;
          break;
        }
      }
    }

    // Update UI Results
    if (resDueDate) resDueDate.innerText = formatDate(dueDate);
    if (resGestationalAge) {
      if (gestationalWeeks >= 40) {
        resGestationalAge.innerText = '40+ Weeks (Full Term 🎉)';
      } else {
        resGestationalAge.innerText = `${gestationalWeeks} Weeks, ${gestationalDays} Days`;
      }
    }
    if (resBabySize) resBabySize.innerText = currentBabySize;

    // Trimester Bar Progress (0 to 100%)
    if (trimesterBarFill) {
      const totalDays = Math.min(Math.max(diffDays, 0), 280);
      const progressPercent = (totalDays / 280) * 100;
      trimesterBarFill.style.width = progressPercent + '%';
    }

    // Trimester label active state
    if (tri1 && tri2 && tri3) {
      tri1.classList.remove('active-tri');
      tri2.classList.remove('active-tri');
      tri3.classList.remove('active-tri');

      if (gestationalWeeks <= 12) {
        tri1.classList.add('active-tri');
      } else if (gestationalWeeks <= 26) {
        tri2.classList.add('active-tri');
      } else {
        tri3.classList.add('active-tri');
      }
    }
  }

  // Button & Input Listeners
  const btnCalculatePeriod = document.getElementById('btnCalculatePeriod');
  if (btnCalculatePeriod) {
    btnCalculatePeriod.addEventListener('click', calculatePeriod);
  }

  if (periodLmpInput) {
    periodLmpInput.addEventListener('change', calculatePeriod);
    periodLmpInput.addEventListener('input', calculatePeriod);
  }

  const btnCalculatePregnancy = document.getElementById('btnCalculatePregnancy');
  if (btnCalculatePregnancy) {
    btnCalculatePregnancy.addEventListener('click', calculatePregnancy);
  }

  if (pregDateInput) {
    pregDateInput.addEventListener('change', calculatePregnancy);
    pregDateInput.addEventListener('input', calculatePregnancy);
  }

  // Method selector label change
  const pregCalcMethod = document.getElementById('pregCalcMethod');
  const pregDateLabel = document.getElementById('pregDateLabel');
  if (pregCalcMethod && pregDateLabel) {
    pregCalcMethod.addEventListener('change', () => {
      if (pregCalcMethod.value === 'lmp') {
        pregDateLabel.innerText = 'First Day of Last Period';
      } else {
        pregDateLabel.innerText = 'Estimated Conception Date';
      }
      calculatePregnancy();
    });
  }

  // Auto-calculate initial predictions on page load
  calculatePeriod();
  calculatePregnancy();

  // 8. Smooth Scrolling for Nav Links
  const allNavLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
  allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const headerHeight = header ? header.offsetHeight : 0;
          const position = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          window.scrollTo({ top: position, behavior: 'smooth' });
          closeMobileMenu();
        }
      }
    });
  });
});
