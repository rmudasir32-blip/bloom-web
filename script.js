document.addEventListener('DOMContentLoaded', () => {
  // FAQ Accordion
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = header.nextElementSibling;
      const isActive = item.classList.contains('active');
      
      // Close all other accordion items
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.accordion-content').style.maxHeight = null;
        }
      });
      
      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // Contact Form Validation & Submission Animation
  const contactForm = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameField = document.getElementById('name');
      const emailField = document.getElementById('email');
      const messageField = document.getElementById('message');
      
      const name = nameField.value.trim();
      const email = emailField.value.trim();
      const message = messageField.value.trim();
      
      // Simple email validation regex
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!name || !email || !message) {
        showFeedback('Please fill in all fields.', 'error');
        return;
      }
      
      if (!emailPattern.test(email)) {
        showFeedback('Please enter a valid email address.', 'error');
        emailField.focus();
        return;
      }
      
      // Disable inputs and show loading state
      setFormDisabled(true);
      submitBtn.innerText = 'Sending message...';
      
      // Simulate network request
      setTimeout(() => {
        setFormDisabled(false);
        submitBtn.innerText = 'Send Message';
        showFeedback('Thank you! Your message has been sent successfully. We usually reply within 24 hours.', 'success');
        contactForm.reset();
      }, 1500);
    });
  }
  
  function showFeedback(text, type) {
    feedback.innerText = text;
    feedback.className = `form-feedback ${type}`;
    feedback.style.display = 'block';
  }
  
  function setFormDisabled(disabled) {
    const inputs = contactForm.querySelectorAll('input, textarea, button');
    inputs.forEach(input => {
      input.disabled = disabled;
    });
  }
  
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('.nav-links a:not(.btn-cta)');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerHeight = document.querySelector('header').offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Active navigation tracking on scroll
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + document.querySelector('header').offsetHeight + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = '#' + section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === current) {
        link.classList.add('active');
      }
    });
  });
});
