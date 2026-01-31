// Diehonnemense - Main Application JavaScript
// Handles navigation, animal gallery, modal, and animations

(function() {
    'use strict';

    // ===== DOM Elements =====
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const urgentGrid = document.getElementById('urgentGrid');
    const animalGrid = document.getElementById('animalGrid');
    const gratitudeGrid = document.getElementById('gratitudeGrid');
    const outreachGrid = document.querySelector('.outreach-grid');
    const modal = document.getElementById('animalModal');
    const modalOverlay = modal.querySelector('.modal-overlay');
    const modalClose = modal.querySelector('.modal-close');
    const newsletterForm = document.getElementById('newsletterForm');

    // Store loaded data
    let animalsData = [];
    let gratitudeData = [];
    let outreachesData = [];

    // ===== Navigation =====

    function handleNavScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    function toggleMobileMenu() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    function closeMobileMenu() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    function smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            const navHeight = navbar.offsetHeight;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - navHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    function initNavigation() {
        window.addEventListener('scroll', handleNavScroll);
        handleNavScroll();

        navToggle.addEventListener('click', toggleMobileMenu);

        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                closeMobileMenu();
                smoothScrollTo(target);
            });
        });

        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') &&
                !navMenu.contains(e.target) &&
                !navToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }

    // ===== Sensitive Content Overlay =====

    function createSensitiveOverlay() {
        return `
            <div class="sensitive-overlay">
                <div class="sensitive-overlay-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </div>
                <span class="sensitive-overlay-text">Sensitive Content</span>
                <span class="sensitive-overlay-hint">Click to reveal</span>
            </div>
        `;
    }

    function handleSensitiveClick(e, card) {
        if (e.target.closest('.sensitive-overlay')) {
            e.stopPropagation();
            card.classList.add('revealed');
        }
    }

    // ===== Urgent Animals Section =====

    function createUrgentCard(animal) {
        const card = document.createElement('div');
        card.className = `urgent-card${animal.sensitive ? ' sensitive' : ''}`;
        card.dataset.slug = animal.slug;

        const imagePath = animal.images[0] || '';

        card.innerHTML = `
            <img src="${imagePath}" alt="${animal.name}" class="urgent-card-image" loading="lazy">
            ${animal.sensitive ? createSensitiveOverlay() : ''}
            <div class="urgent-card-content">
                <h3 class="urgent-card-name">${animal.name}</h3>
                <span class="urgent-card-need">${animal.urgentNeed}</span>
                <p class="urgent-card-story">${animal.urgentReason}</p>
                <span class="urgent-card-cta">
                    Help ${animal.name}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </span>
            </div>
        `;

        if (animal.sensitive) {
            card.addEventListener('click', (e) => handleSensitiveClick(e, card));
        }

        card.addEventListener('click', (e) => {
            if (!animal.sensitive || card.classList.contains('revealed') || !e.target.closest('.sensitive-overlay')) {
                openModal(animal);
            }
        });

        return card;
    }

    function renderUrgentCards() {
        if (!urgentGrid) return;

        const urgentAnimals = animalsData.filter(animal => animal.urgent);

        urgentAnimals.forEach(animal => {
            const card = createUrgentCard(animal);
            urgentGrid.appendChild(card);
        });
    }

    // ===== Animal Gallery =====

    function createAnimalCard(animal) {
        const monthsAgo = ContentLoader.getMonthsSince(animal.rescueDate);
        const timeText = monthsAgo === 0 ? 'Recently rescued' :
                        monthsAgo === 1 ? 'Rescued 1 month ago' :
                        `Rescued ${monthsAgo} months ago`;

        const statusClass = animal.status === 'adopted' ? 'adopted' :
                           animal.status === 'foster' ? 'foster' : '';
        const statusText = animal.status === 'adopted' ? 'Found a Forever Home' :
                          animal.status === 'foster' ? 'In Loving Foster Care' : '';

        const imagePath = animal.images[0] || '';

        const card = document.createElement('div');
        const hasStatus = animal.status === 'adopted' || animal.status === 'foster';
        const isSensitive = animal.sensitive;
        card.className = `animal-card${hasStatus ? ' has-status' : ''}${isSensitive ? ' sensitive' : ''}`;
        card.dataset.slug = animal.slug;

        card.innerHTML = `
            <img src="${imagePath}" alt="${animal.name}" class="animal-card-image" loading="lazy">
            ${isSensitive ? createSensitiveOverlay() : ''}
            <div class="animal-card-overlay">
                <h3 class="animal-card-name">${animal.name}</h3>
                <p class="animal-card-meta">${timeText}</p>
            </div>
            ${statusText ? `<span class="animal-card-status ${statusClass}">${statusText}</span>` : ''}
        `;

        if (isSensitive) {
            card.addEventListener('click', (e) => handleSensitiveClick(e, card));
        }

        card.addEventListener('click', (e) => {
            if (!isSensitive || card.classList.contains('revealed') || !e.target.closest('.sensitive-overlay')) {
                openModal(animal);
            }
        });

        return card;
    }

    function renderAnimalCards() {
        if (!animalGrid) return;

        animalGrid.innerHTML = '';

        // Sort animals: available first, then foster, then adopted
        const sortedAnimals = [...animalsData].sort((a, b) => {
            const statusOrder = { 'available': 0, 'foster': 1, 'adopted': 2 };
            return (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
        });

        sortedAnimals.forEach((animal, index) => {
            const card = createAnimalCard(animal);
            card.style.animationDelay = `${Math.min(index * 0.05, 0.65)}s`;
            animalGrid.appendChild(card);
        });
    }

    // ===== Modal =====

    function openModal(animal) {
        const modalImage = document.getElementById('modalImage');
        const modalName = document.getElementById('modalName');
        const modalBreed = document.getElementById('modalBreed');
        const modalRescueDate = document.getElementById('modalRescueDate');
        const modalStory = document.getElementById('modalStory');
        const modalSituation = document.getElementById('modalSituation');
        const modalCtaName = document.getElementById('modalCtaName');
        const carouselDots = document.getElementById('carouselDots');

        // Set main image
        const mainImage = animal.images[0] || '';
        modalImage.src = mainImage;
        modalImage.alt = animal.name;

        // Set text content
        modalName.textContent = animal.name;
        modalBreed.textContent = animal.breed;
        modalRescueDate.textContent = `Rescued: ${ContentLoader.formatDate(animal.rescueDate)}`;
        modalStory.textContent = animal.story;
        modalSituation.textContent = animal.currentSituation;
        modalCtaName.textContent = animal.name;

        // Setup carousel dots for multiple images
        carouselDots.innerHTML = '';
        animal.images.forEach((img, index) => {
            const dot = document.createElement('span');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => {
                carouselDots.querySelectorAll('.carousel-dot').forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                modalImage.src = img;
            });
            carouselDots.appendChild(dot);
        });

        // Save scroll position and lock body
        const scrollY = window.scrollY;
        document.body.style.top = `-${scrollY}px`;
        document.body.dataset.scrollY = scrollY;

        // Update URL for deep linking
        updateUrlHash(animal.slug);

        // Show modal
        modal.classList.add('active');
        document.body.classList.add('modal-open');

        // Focus trap
        modalClose.focus();
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');

        // Restore scroll position instantly
        const scrollY = document.body.dataset.scrollY || 0;
        document.body.style.top = '';
        window.scrollTo({ top: parseInt(scrollY), behavior: 'instant' });

        // Clear the URL hash without scrolling
        if (window.location.hash.startsWith('#animal/')) {
            history.pushState('', document.title, window.location.pathname + window.location.search);
        }
    }

    // Deep linking - open animal from URL hash
    function checkUrlHash() {
        const hash = window.location.hash;
        if (hash.startsWith('#animal/')) {
            const slug = hash.replace('#animal/', '');
            const animal = animalsData.find(a => a.slug === slug);
            if (animal) {
                // Small delay to ensure page is rendered
                setTimeout(() => openModal(animal), 100);
            }
        }
    }

    // Update URL when opening modal
    function updateUrlHash(slug) {
        history.pushState(null, '', `#animal/${slug}`);
    }

    function initModal() {
        modalClose.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', closeModal);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // ===== Wall of Gratitude =====

    function createGratitudeCard(entry) {
        const card = document.createElement('div');
        const hasImage = entry.image;
        card.className = `gratitude-card${!hasImage ? ' simple' : ''}`;

        const formattedDate = ContentLoader.formatDate(entry.date, { year: 'numeric', month: 'long' });

        if (hasImage) {
            card.innerHTML = `
                <img src="${entry.image}" alt="${entry.name}" class="gratitude-card-image" loading="lazy">
                <div class="gratitude-card-content">
                    <h3 class="gratitude-card-name">${entry.name}</h3>
                    <p class="gratitude-card-date">${formattedDate}</p>
                    <p class="gratitude-card-description">${entry.description}</p>
                </div>
            `;
        } else {
            card.innerHTML = `
                <div class="gratitude-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </div>
                <div class="gratitude-card-content">
                    <h3 class="gratitude-card-name">${entry.name}</h3>
                    <p class="gratitude-card-date">${formattedDate}</p>
                    <p class="gratitude-card-description">${entry.description}</p>
                </div>
            `;
        }

        return card;
    }

    function renderGratitudeCards() {
        if (!gratitudeGrid) return;

        gratitudeGrid.innerHTML = '';

        // Sort by date, most recent first
        const sortedEntries = [...gratitudeData].sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        );

        sortedEntries.forEach(entry => {
            const card = createGratitudeCard(entry);
            gratitudeGrid.appendChild(card);
        });
    }

    // ===== Outreaches =====

    function getOutreachIcon(iconName) {
        const icons = {
            layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
            </svg>`,
            clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
            </svg>`,
            heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>`,
            users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>`
        };
        return icons[iconName] || icons.heart;
    }

    function createOutreachCard(outreach) {
        const card = document.createElement('div');
        card.className = 'outreach-card';

        card.innerHTML = `
            <div class="outreach-icon">
                ${getOutreachIcon(outreach.icon)}
            </div>
            <h3>${outreach.title}</h3>
            <p>${outreach.description}</p>
            <span class="outreach-stat">${outreach.statNumber} ${outreach.statLabel}</span>
        `;

        return card;
    }

    function renderOutreachCards() {
        if (!outreachGrid) return;

        outreachGrid.innerHTML = '';

        outreachesData.forEach(outreach => {
            const card = createOutreachCard(outreach);
            outreachGrid.appendChild(card);
        });
    }

    // ===== Scroll Animations =====

    function initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        document.querySelectorAll('.section-header, .urgent-card, .about-content, .outreach-card, .donation-card, .donation-bank, .gratitude-card').forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }

    // ===== Newsletter Form =====

    function initNewsletter() {
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('input[type="email"]').value;
                alert(`Thank you for subscribing! We'll send updates to ${email}`);
                newsletterForm.reset();
            });
        }
    }

    // ===== Smooth Scroll for All Anchor Links =====

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const target = this.getAttribute('href');
                if (target && target !== '#') {
                    e.preventDefault();
                    smoothScrollTo(target);
                }
            });
        });
    }

    // ===== Parallax Effect for Hero =====

    function initParallax() {
        const heroBackground = document.querySelector('.hero-background');

        window.addEventListener('scroll', () => {
            if (window.scrollY < window.innerHeight) {
                const scrolled = window.scrollY;
                heroBackground.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        });
    }

    // ===== Active Navigation Highlighting =====

    function initActiveNavHighlighting() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -80% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    // ===== Initialize Everything =====

    async function init() {
        // Initialize navigation first (doesn't depend on content)
        initNavigation();
        initModal();
        initNewsletter();
        initSmoothScroll();
        initParallax();
        initActiveNavHighlighting();

        // Load content from markdown files
        try {
            console.log('Loading content...');

            // Load all content in parallel
            const [animals, gratitude, outreaches] = await Promise.all([
                ContentLoader.loadAnimals(),
                ContentLoader.loadGratitude(),
                ContentLoader.loadOutreaches()
            ]);

            animalsData = animals;
            gratitudeData = gratitude;
            outreachesData = outreaches;

            console.log(`Loaded ${animals.length} animals, ${gratitude.length} gratitude entries, ${outreaches.length} outreaches`);

            // Render content
            renderUrgentCards();
            renderAnimalCards();
            renderGratitudeCards();
            renderOutreachCards();

            // Initialize scroll animations after content is rendered
            initScrollAnimations();

            // Check for deep link in URL
            checkUrlHash();

            // Handle browser back/forward
            window.addEventListener('popstate', () => {
                if (window.location.hash.startsWith('#animal/')) {
                    checkUrlHash();
                } else if (modal.classList.contains('active')) {
                    closeModal();
                }
            });

        } catch (error) {
            console.error('Error initializing content:', error);
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
