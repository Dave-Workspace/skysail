/* =========================================================
   SKYSAIL SHARED MAIN.JS — SAFE PAGE-AWARE VERSION
   ---------------------------------------------------------
   This file keeps the existing functionality but isolates
   page-specific features so a missing section/form/plugin
   cannot stop the rest of the site's JavaScript.
   ========================================================= */


/* ===== Extracted inline script #1 ===== */
window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-Y404KZ61CH');


/* ===== Extracted inline script #2 ===== */
(function () {
    'use strict';

    const steps = document.querySelectorAll('.step');
    const flow = document.querySelector('.flow');
    const processSection = document.querySelector('.process');

    // This animation is page/section specific. If the section is not
    // present on the current page, safely skip it instead of crashing
    // the shared main.js file.
    if (!steps.length || !flow || !processSection) return;

        // Detect if device has hover capability
        const hasHoverCapability = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

        let isHovered = false;
        let isInView = false;
        let isMobilePaused = false;
        let animationTimeouts = [];
        let isAnimating = false;

        // Helper: clear all timeouts
        function clearAllTimeouts() {
            animationTimeouts.forEach(t => clearTimeout(t));
            animationTimeouts = [];
        }

        // Reset steps (hide all)
        function resetSteps() {
            clearAllTimeouts();
            clearTypingTimeouts();
            steps.forEach(step => {
                step.style.opacity = 0;
                step.querySelector('.icon').classList.remove('show');
                step.querySelector('.big-number').classList.remove('show');
                step.querySelector('.content').classList.remove('show');
            });
        }

        // Show all instantly
        function showAllSteps() {
            clearAllTimeouts();
            steps.forEach(step => {
                step.style.opacity = 1;
                step.querySelector('.icon').classList.add('show');
                step.querySelector('.big-number').classList.add('show');
                step.querySelector('.content').classList.add('show');
            });
        }

        // Typing + jump animation for step 4
        function typeAndJump(span, text, done) {
            // Stop any ongoing typing animation on this specific span
            if (span._typingTimeouts) {
                span._typingTimeouts.forEach(t => clearTimeout(t));
            }
            span._typingTimeouts = [];

            span.textContent = '';
            span.style.display = 'inline-block';
            span.style.whiteSpace = 'normal';
            span.style.borderRight = '2px solid #1e90ff';

            const chars = text.split('');
            let i = 0;

            function typeNext() {
                if (i < chars.length) {
                    span.textContent += chars[i];
                    i++;
                    const t = setTimeout(typeNext, 80);
                    span._typingTimeouts.push(t);
                } else {
                    span.style.borderRight = 'none';
                    span.style.animation = 'jump 0.5s ease forwards';
                    const t = setTimeout(() => {
                        span.style.animation = '';
                        if (done) done();
                    }, 500);
                    span._typingTimeouts.push(t);
                }
            }

            typeNext();
        }

        function clearTypingTimeouts() {
            document.querySelectorAll('.typing-bounce').forEach(span => {
                if (span._typingTimeouts) {
                    span._typingTimeouts.forEach(t => clearTimeout(t));
                    span._typingTimeouts = [];
                }
            });
        }

        // Animate one step (sequential show)
        function animateStepWithTyping(step, previousSteps = [], callback) {
            steps.forEach(s => s.style.opacity = 0);
            previousSteps.forEach(s => s.style.opacity = 1);

            step.style.opacity = 1;
            const icon = step.querySelector('.icon');
            const number = step.querySelector('.big-number');
            const content = step.querySelector('.content');
            const typingSpan = step.querySelector('.typing-bounce');

            icon.classList.remove('show');
            number.classList.remove('show');
            content.classList.remove('show');

            animationTimeouts.push(setTimeout(() => icon.classList.add('show'), 200));
            animationTimeouts.push(setTimeout(() => number.classList.add('show'), 600));
            animationTimeouts.push(setTimeout(() => content.classList.add('show'), 1000));

            let totalStepTime = 2200;
            if (typingSpan) {
                const text = typingSpan.getAttribute('data-text') || typingSpan.textContent.trim();
                typingSpan.setAttribute('data-text', text);
                animationTimeouts.push(setTimeout(() => {
                    typeAndJump(typingSpan, text, callback);
                }, 1200));
                totalStepTime = Math.max(totalStepTime, text.length * 80 + 2000);
            } else {
                animationTimeouts.push(setTimeout(callback, totalStepTime));
            }
        }

        // Sequential flow controller
        function animateFlowSequentially(i = 0, previous = []) {
            if (!isInView || (hasHoverCapability && isHovered) || isMobilePaused) {
                isAnimating = false;
                return;
            }

            isAnimating = true;

            if (i >= steps.length) {
                // wait longer for typing animation to finish
                animationTimeouts.push(setTimeout(() => {
                    if (!((hasHoverCapability && isHovered) || isMobilePaused) && isInView) {
                        resetSteps();
                        animateFlowSequentially(0, []);
                    } else {
                        isAnimating = false;
                    }
                }, 3500));
                return;
            }

            animateStepWithTyping(steps[i], previous, () => {
                previous.push(steps[i]);
                animateFlowSequentially(i + 1, previous);
            });
        }

        // Start new full animation cycle cleanly
        function startAnimationLoop() {
            if (!isInView || isAnimating) return;
            clearAllTimeouts();
            clearTypingTimeouts();
            resetSteps();
            // Small delay before starting to ensure clean transition
            setTimeout(() => {
                if (isInView && !((hasHoverCapability && isHovered) || isMobilePaused)) {
                    animateFlowSequentially();
                }
            }, 100);
        }

        // Observer for visibility - FIXED to always restart animation
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    isInView = true;
                    // Reset animation state when coming into view
                    isAnimating = false;
                    if (!isMobilePaused && (!hasHoverCapability || !isHovered)) {
                        startAnimationLoop();
                    }
                } else {
                    isInView = false;
                    isAnimating = false;
                    clearAllTimeouts();
                    clearTypingTimeouts();
                    resetSteps();
                }
            });
        }, { threshold: 0.3 });

        observer.observe(processSection);

        // Only enable hover effects on devices with hover capability
        if (hasHoverCapability) {
            // Hover: show all + only typing runs
            flow.addEventListener('mouseenter', () => {
                isHovered = true;
                clearAllTimeouts();
                clearTypingTimeouts();
                showAllSteps();

                const typingSpan = document.querySelector('.typing-bounce');
                if (typingSpan) {
                    const text = typingSpan.getAttribute('data-text') || typingSpan.textContent.trim();
                    typeAndJump(typingSpan, text);
                }
            });

            function restartAnimation() {
                clearAllTimeouts();
                clearTypingTimeouts();
                resetSteps();
                isAnimating = false;
                requestAnimationFrame(() => startAnimationLoop());
            }

            // On mouse leave: restart full cycle cleanly
            flow.addEventListener('mouseleave', () => {
                isHovered = false;
                if (!isMobilePaused && isInView) restartAnimation();
            });
        } else {
            // For touch devices: show all steps statically (no animation)
            showAllSteps();

            // Run typing effect once for touch devices
            const typingSpan = document.querySelector('.typing-bounce');
            if (typingSpan) {
                const text = typingSpan.getAttribute('data-text') || typingSpan.textContent.trim();
                typeAndJump(typingSpan, text);
            }
        }

        // Mobile tap toggle - only for touch devices
        if (!hasHoverCapability) {
            flow.addEventListener('touchstart', (e) => {
                e.preventDefault();

                // Toggle paused state
                isMobilePaused = !isMobilePaused;

                // Always clear everything first — no leftover animations or typing
                clearAllTimeouts();
                clearTypingTimeouts();
                isAnimating = false;

                if (isMobilePaused) {
                    // FIRST TAP — show everything instantly (paused state)
                    showAllSteps();

                    // Run typing effect (if present)
                    const typingSpan = document.querySelector('.typing-bounce');
                    if (typingSpan) {
                        const text = typingSpan.getAttribute('data-text') || typingSpan.textContent.trim();
                        typeAndJump(typingSpan, text);
                    }
                } else if (isInView) {
                    // SECOND TAP — restart animation cleanly from the beginning
                    resetSteps();
                    requestAnimationFrame(() => {
                        startAnimationLoop(); // fresh animation cycle
                    });
                }
            });
        }


})();

/* ===== Extracted inline script #3 ===== */
// Map Icon Animation Controller - IMPROVED
        (function () {
            const mapSection = document.querySelector('.map-section');
            const mapIcons = document.querySelectorAll('.map-icon');

            // Function to animate icons
            function animateMapIcons() {
                mapIcons.forEach((icon, index) => {
                    const delay = icon.getAttribute('data-delay') || 0;

                    // Remove any existing animation classes first
                    icon.classList.remove('map-icon-animate');

                    // Force reflow to restart animation
                    void icon.offsetWidth;

                    // Add animation class with delay
                    setTimeout(() => {
                        icon.classList.add('map-icon-animate');
                    }, parseInt(delay));
                });
            }

            // Function to reset icons (hide them immediately)
            function resetMapIcons() {
                mapIcons.forEach(icon => {
                    icon.classList.remove('map-icon-animate');
                });
            }

            // Intersection Observer to detect when section is in view
            const mapObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Section is in view - play animation
                        animateMapIcons();
                    } else {
                        // Section is out of view - immediately hide icons
                        resetMapIcons();
                    }
                });
            }, {
                threshold: 0.2, // Trigger when 20% of section is visible
                rootMargin: '0px'
            });

            // Start observing the map section
            if (mapSection) {
                mapObserver.observe(mapSection);
            }
        })();


/* ===== Extracted inline script #4 ===== */
// Stats Counter Animation Controller - Repeats on scroll
        (function () {
            const statsSection = document.querySelector('.stats-section');
            if (!statsSection) return;

            const statsHeader = statsSection.querySelector('.stats-header');
            const statsDescription = statsSection.querySelector('.stats-description');
            const statItems = statsSection.querySelectorAll('.stat-item');
            const statNumbers = statsSection.querySelectorAll('.stat-number');
            let hasAnimated = false;

            // Counter animation function
            function animateCounter(element) {
                const target = parseInt(element.getAttribute('data-target')) || 0;
                const suffix = element.getAttribute('data-suffix') || '';
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    element.textContent = Math.floor(current) + suffix;
                }, 16);
            }

            // Intersection Observer
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting && !hasAnimated) {
                            hasAnimated = true;

                            // Animate header
                            if (statsHeader) {
                                setTimeout(() => {
                                    statsHeader.classList.add('animate-in');
                                }, 100);
                            }

                            // Animate description
                            if (statsDescription) {
                                setTimeout(() => {
                                    statsDescription.classList.add('animate-in');
                                }, 300);
                            }

                            // Animate stat items with stagger
                            statItems.forEach((item, index) => {
                                setTimeout(() => {
                                    item.classList.add('animate-in');
                                }, 500 + (index * 150)); // Start after description, stagger 150ms
                            });

                            // Animate counters after items appear
                            statNumbers.forEach((stat, index) => {
                                setTimeout(() => {
                                    animateCounter(stat);
                                }, 1000 + (index * 200)); // Start after items, stagger 200ms
                            });

                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.2,
                    rootMargin: '0px 0px -50px 0px'
                }
            );

            observer.observe(statsSection);
        })();


/* ===== Extracted inline script #5 ===== */
(function () {
    'use strict';
// RCIC Timeline JavaScript with GIF Animation Support - FIXED SIZE
        const rcicTimelineNodes = document.querySelectorAll('.rcic-timeline-node');
        const rcicTimelineProgress = document.getElementById('rcicTimelineProgress');

        // RCIC timeline is page-specific. Do nothing when the page does not
        // contain the required timeline elements.
        if (!rcicTimelineNodes.length || !rcicTimelineProgress) return;
        let rcicCurrentStep = 0;
        let rcicAutoPlayInterval;
        const rcicIsMobile = () => window.innerWidth <= 768;

        // Store original PNG sources for each node
        const rcicNodeImageData = [];
        rcicTimelineNodes.forEach((node) => {
            const img = node.querySelector('.rcic-node-img');

            // Keep array indexes aligned even if one node has no image.
            if (!img) {
                rcicNodeImageData.push(null);
                return;
            }

            const pngSrc = img.src;
            const gifSrc = pngSrc.replace(/\.png$/i, '.gif');
            rcicNodeImageData.push({ img, pngSrc, gifSrc, animating: false });
        });

        function playNodeAnimation(stepIndex) {
            const nodeData = rcicNodeImageData[stepIndex];

            // Skip safely when the current node has no image.
            if (!nodeData || !nodeData.img) return;

            // Skip if already animating
            if (nodeData.animating) return;

            nodeData.animating = true;
            const img = nodeData.img;

            // Add class for GIF styling and switch to GIF
            img.classList.add('is-gif');
            img.src = nodeData.gifSrc;

            // Wait for GIF to play once (adjust timing as needed)
            setTimeout(() => {
                img.classList.remove('is-gif');
                img.src = nodeData.pngSrc;
                nodeData.animating = false;
            }, 2000);
        }

        function updateRcicTimeline(stepIndex, instant = false) {
            rcicCurrentStep = stepIndex;

            // Remove active class from all nodes
            rcicTimelineNodes.forEach(node => node.classList.remove('active'));

            // Add active class to current and previous nodes
            for (let i = 0; i <= stepIndex; i++) {
                rcicTimelineNodes[i].classList.add('active');
            }

            // Play animation for the current active node
            playNodeAnimation(stepIndex);

            // Update progress line
            const totalSteps = rcicTimelineNodes.length;
            const progressPercent = totalSteps > 1
                ? (stepIndex / (totalSteps - 1)) * 100
                : 100;

            if (instant) {
                rcicTimelineProgress.style.transition = 'none';
            } else {
                rcicTimelineProgress.style.transition = 'width 0.3s ease-in-out, height 0.6s ease-in-out';
            }

            if (rcicIsMobile()) {
                rcicTimelineProgress.style.width = '4px';
                rcicTimelineProgress.style.height = `${progressPercent}%`;
            } else {
                rcicTimelineProgress.style.width = `${progressPercent}%`;
                rcicTimelineProgress.style.height = '4px';
            }

            if (instant) {
                void rcicTimelineProgress.offsetWidth;
                rcicTimelineProgress.style.transition = 'width 0.3s ease-in-out, height 0.6s ease-in-out';
            }
        }

        function startRcicAutoPlay() {
            stopRcicAutoPlay();
            rcicAutoPlayInterval = setInterval(() => {
                rcicCurrentStep = (rcicCurrentStep + 1) % rcicTimelineNodes.length;
                updateRcicTimeline(rcicCurrentStep);
            }, 3000);
        }

        function stopRcicAutoPlay() {
            if (rcicAutoPlayInterval) {
                clearInterval(rcicAutoPlayInterval);
            }
        }

        // Click handler for timeline nodes
        rcicTimelineNodes.forEach((node, index) => {
            node.addEventListener('click', () => {
                stopRcicAutoPlay();
                updateRcicTimeline(index);
                setTimeout(() => startRcicAutoPlay(), 5000);
            });
        });

        // Initialize timeline
        updateRcicTimeline(0, true);
        startRcicAutoPlay();

        // Handle resize
        window.addEventListener('resize', () => {
            updateRcicTimeline(rcicCurrentStep, true);
        });
})();


/* ===== Extracted inline script #6 ===== */
// Map Location Labels Controller - SEPARATE from icon animation
        (function () {
            const mapIcons = document.querySelectorAll('.map-icon');

            // Create and append labels to each map icon
            mapIcons.forEach(icon => {
                const location = icon.getAttribute('data-location');
                if (location) {
                    const label = document.createElement('div');
                    label.className = 'map-location-label';
                    label.textContent = location;
                    icon.appendChild(label);
                }
            });

            // Labels will automatically animate with icons via CSS
            // (when .map-icon-animate class is added by the existing script)
        })();


/* ===== Extracted inline script #7 ===== */
(function () {
            const blogWrapper = document.getElementById('blogWrapper');
            if (!blogWrapper) return;

            function replaceBtn(id) {
                const old = document.getElementById(id);
                if (!old) return null;
                const clone = old.cloneNode(true);
                old.parentNode.replaceChild(clone, old);
                return clone;
            }

            const blogLeftBtn = replaceBtn('blogScrollLeft');
            const blogRightBtn = replaceBtn('blogScrollRight');
            const blogDots = document.getElementById('blogDots');
            if (!blogDots) return;

            function getGap() {
                const style = window.getComputedStyle(blogWrapper);
                return parseFloat(style.gap || 0) || 0;
            }

            function getCardWidth() {
                const card = blogWrapper.querySelector('.blog-card');
                return card ? card.getBoundingClientRect().width : blogWrapper.clientWidth;
            }

            function getVisibleCount(cardWidth, gap) {
                return Math.max(1, Math.floor((blogWrapper.clientWidth + gap) / (cardWidth + gap)));
            }

            function clampScroll(x) {
                const max = blogWrapper.scrollWidth - blogWrapper.clientWidth;
                return Math.max(0, Math.min(x, max));
            }

            function buildDots() {
                const cards = blogWrapper.querySelectorAll('.blog-card');
                if (!cards.length || blogWrapper.scrollWidth <= blogWrapper.clientWidth + 1) {
                    blogDots.innerHTML = '';
                    return;
                }

                const cardWidth = getCardWidth();
                const gap = getGap();
                const visible = getVisibleCount(cardWidth, gap);
                const pages = Math.ceil(cards.length / visible);

                blogDots.innerHTML = '';
                for (let i = 0; i < pages; i++) {
                    const dot = document.createElement('button');
                    dot.className = 'blog-dot';
                    dot.onclick = () => {
                        blogWrapper.scrollTo({
                            left: clampScroll(i * visible * (cardWidth + gap)),
                            behavior: 'smooth'
                        });
                    };
                    blogDots.appendChild(dot);
                }

                updateActiveDot();
            }

            function updateActiveDot() {
                const dots = blogDots.children;
                if (!dots.length) return;

                const cardWidth = getCardWidth();
                const gap = getGap();
                const visible = getVisibleCount(cardWidth, gap);
                const pageWidth = visible * (cardWidth + gap);
                const index = Math.round(blogWrapper.scrollLeft / pageWidth);

                [...dots].forEach((d, i) => d.classList.toggle('active', i === index));
            }

            function scrollByPage(dir) {
                const cardWidth = getCardWidth();
                const gap = getGap();
                const visible = getVisibleCount(cardWidth, gap);
                blogWrapper.scrollTo({
                    left: clampScroll(blogWrapper.scrollLeft + dir * visible * (cardWidth + gap)),
                    behavior: 'smooth'
                });
            }

            blogLeftBtn?.addEventListener('click', () => scrollByPage(-1));
            blogRightBtn?.addEventListener('click', () => scrollByPage(1));
            blogWrapper.addEventListener('scroll', updateActiveDot, { passive: true });
            window.addEventListener('resize', buildDots);

            buildDots();
        })();


/* ===== Extracted inline script #8 ===== */
(function () {
            const faqSection = document.querySelector('.faq-section');
            if (!faqSection) return;

            const header = faqSection.querySelector('.faq-header');
            const items = Array.from(faqSection.querySelectorAll('.faq-item'));

            // If header image path is wrong (lowercase), attempt a safe fix
            const hdrImg = faqSection.querySelector('.why-heading-icon');
            if (hdrImg && hdrImg.src && hdrImg.src.indexOf('/images/') !== -1) {
                hdrImg.src = hdrImg.src.replace('/images/', '/Images/');
            }

            const io = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    // reveal header immediately
                    if (header) header.classList.add('animate-in');

                    // stagger reveal of faq items (similar feel to map icons)
                    items.forEach((item, i) => {
                        // small incremental delay so they cascade upward
                        window.setTimeout(() => item.classList.add('animate-in'), i * 120);
                    });

                    // only run once
                    obs.unobserve(entry.target);
                });
            }, {
                threshold: 0.12,
                rootMargin: '0px 0px -10% 0px'
            });

            io.observe(faqSection);
        })();


/* ===== Extracted inline script #9 ===== */
(function () {
            const webinarWrapper = document.getElementById('webinarWrapper');
            if (!webinarWrapper) return;

            function replaceBtn(id) {
                const old = document.getElementById(id);
                if (!old) return null;
                const clone = old.cloneNode(true);
                old.parentNode.replaceChild(clone, old);
                return clone;
            }

            const webinarLeftBtn = replaceBtn('webinarScrollLeft');
            const webinarRightBtn = replaceBtn('webinarScrollRight');
            const webinarDots = document.getElementById('webinarDots');
            if (!webinarDots) return;

            function getGap() {
                const style = window.getComputedStyle(webinarWrapper);
                return parseFloat(style.gap || 0) || 0;
            }

            function getCardWidth() {
                const card = webinarWrapper.querySelector('.webinar-card');
                return card ? card.getBoundingClientRect().width : webinarWrapper.clientWidth;
            }

            function getVisibleCount(cardWidth, gap) {
                return Math.max(1, Math.floor((webinarWrapper.clientWidth + gap) / (cardWidth + gap)));
            }

            function clampScroll(x) {
                const max = webinarWrapper.scrollWidth - webinarWrapper.clientWidth;
                return Math.max(0, Math.min(x, max));
            }

            function buildDots() {
                const cards = webinarWrapper.querySelectorAll('.webinar-card');
                if (!cards.length || webinarWrapper.scrollWidth <= webinarWrapper.clientWidth + 1) {
                    webinarDots.innerHTML = '';
                    return;
                }

                const cardWidth = getCardWidth();
                const gap = getGap();
                const visible = getVisibleCount(cardWidth, gap);
                const pages = Math.ceil(cards.length / visible);

                webinarDots.innerHTML = '';
                for (let i = 0; i < pages; i++) {
                    const dot = document.createElement('button');
                    dot.className = 'webinar-dot';
                    dot.onclick = () => {
                        webinarWrapper.scrollTo({
                            left: clampScroll(i * visible * (cardWidth + gap)),
                            behavior: 'smooth'
                        });
                    };
                    webinarDots.appendChild(dot);
                }

                updateActiveDot();
            }

            function updateActiveDot() {
                const dots = webinarDots.children;
                if (!dots.length) return;

                const cardWidth = getCardWidth();
                const gap = getGap();
                const visible = getVisibleCount(cardWidth, gap);
                const pageWidth = visible * (cardWidth + gap);
                const index = Math.round(webinarWrapper.scrollLeft / pageWidth);

                [...dots].forEach((d, i) => d.classList.toggle('active', i === index));
            }

            function scrollByPage(dir) {
                const cardWidth = getCardWidth();
                const gap = getGap();
                const visible = getVisibleCount(cardWidth, gap);
                webinarWrapper.scrollTo({
                    left: clampScroll(webinarWrapper.scrollLeft + dir * visible * (cardWidth + gap)),
                    behavior: 'smooth'
                });
            }

            webinarLeftBtn?.addEventListener('click', () => scrollByPage(-1));
            webinarRightBtn?.addEventListener('click', () => scrollByPage(1));
            webinarWrapper.addEventListener('scroll', updateActiveDot, { passive: true });
            window.addEventListener('resize', buildDots);

            buildDots();
        })();


/* ===== Extracted inline script #10 ===== */
(function () {
    'use strict';

    const panels = document.querySelectorAll('.panel');
    const container = document.getElementById('panelContainer');

    // Page-specific panel animation. Skip safely if this section is absent.
    if (!panels.length || !container) return;

    /* Disable everything on mobile */
        if (window.matchMedia('(max-width: 768px)').matches) {
            panels.forEach(panel => panel.classList.add('active'));
        } else {

            let currentIndex = 0;
            let intervalId = null;
            let animationStarted = false;

            function activatePanel(index) {
                panels.forEach(p => p.classList.remove('active'));
                panels[index].classList.add('active');
            }

            function startLoopAnimation() {
                if (intervalId) return; // prevent multiple intervals
                intervalId = setInterval(() => {
                    activatePanel(currentIndex);
                    currentIndex = (currentIndex + 1) % panels.length;
                }, 1800);
            }

            function stopLoopAnimation() {
                clearInterval(intervalId);
                intervalId = null;
            }

            const observer = new IntersectionObserver(
                entries => {
                    if (entries[0].isIntersecting && !animationStarted) {
                        animationStarted = true;
                        startLoopAnimation();
                    }
                },
                { threshold: 0.5 }
            );

            observer.observe(container);

            panels.forEach((panel, index) => {
                // Click: stop and activate selected
                panel.addEventListener('click', () => {
                    stopLoopAnimation();
                    currentIndex = index;
                    activatePanel(index);
                });

                // Hover: pause
                panel.addEventListener('mouseenter', () => {
                    stopLoopAnimation();
                });

                // Mouse out: resume
                panel.addEventListener('mouseleave', () => {
                    startLoopAnimation();
                });
            });
        }


})();

/* ===== Extracted inline event handlers ===== */
document.querySelectorAll('marquee').forEach(function (marquee) {
    marquee.addEventListener('mouseover', function () {
        this.stop();
    });
    marquee.addEventListener('mouseout', function () {
        this.start();
    });
});


/* =========================================================
   Study in Canada — page-specific JavaScript
   Shared site functionality remains in JS/script.js.
   ========================================================= */
(function () {
    "use strict";

    function initGoogleAnalytics() {
        if (window.__canboardsGAInitialized) return;

        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function () {
            window.dataLayer.push(arguments);
        };

        window.gtag("js", new Date());
        window.gtag("config", "G-Y404KZ61CH");
        window.__canboardsGAInitialized = true;
    }

    function initStudyPage() {
        // Preserve the original FAQ/category loader behavior.
        if (typeof window.loadCategoryPosts === "function") {
            window.loadCategoryPosts("Study Visa – FAQs", 10);
        }

        // Preserve marquee pause-on-hover behavior without inline HTML handlers.
        document.querySelectorAll('marquee[data-pause-on-hover="true"]').forEach(function (marquee) {
            marquee.addEventListener("mouseenter", function () {
                if (typeof marquee.stop === "function") marquee.stop();
            });

            marquee.addEventListener("mouseleave", function () {
                if (typeof marquee.start === "function") marquee.start();
            });
        });
    }

    initGoogleAnalytics();

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initStudyPage, { once: true });
    } else {
        initStudyPage();
    }
})();


/* =========================================================
   Work in Canada — page-specific JavaScript
   Shared site functionality remains in JS/script.js and JS/button.js.
   ========================================================= */
(function () {
    "use strict";

    function initGoogleAnalytics() {
        if (window.__canboardsGAInitialized) return;

        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function () {
            window.dataLayer.push(arguments);
        };

        window.gtag("js", new Date());
        window.gtag("config", "G-Y404KZ61CH");
        window.__canboardsGAInitialized = true;
    }

    function initWorkPage() {
        document.querySelectorAll('marquee[data-pause-on-hover="true"]').forEach(function (marquee) {
            marquee.addEventListener("mouseenter", function () {
                if (typeof marquee.stop === "function") marquee.stop();
            });

            marquee.addEventListener("mouseleave", function () {
                if (typeof marquee.start === "function") marquee.start();
            });
        });
    }

    initGoogleAnalytics();

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initWorkPage, { once: true });
    } else {
        initWorkPage();
    }
})();



// Visit Canada page JavaScript
(function () {
  'use strict';

  // Google Analytics bootstrap (guarded so it is not initialized twice).
  window.dataLayer = window.dataLayer || [];
  if (!window.__canboardsGtagInitialized) {
    window.__canboardsGtagInitialized = true;
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', 'G-Y404KZ61CH');
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Preserve the original marquee hover pause/resume behavior without inline events.
    document.querySelectorAll('marquee[data-marquee-pause]').forEach(function (marquee) {
      marquee.addEventListener('mouseenter', function () {
        if (typeof marquee.stop === 'function') marquee.stop();
      });
      marquee.addEventListener('mouseleave', function () {
        if (typeof marquee.start === 'function') marquee.start();
      });
    });

    const input = document.querySelector('#contact');
    const form = document.getElementById('VVIForm');

    if (!input || !form || typeof window.intlTelInput !== 'function') return;

    const iti = window.intlTelInput(input, {
      initialCountry: 'auto',
      separateDialCode: true,
      autoPlaceholder: 'aggressive',
      loadUtils: () => import('https://cdn.jsdelivr.net/npm/intl-tel-input@25.10.1/build/js/utils.js'),
      geoIpLookup: function (success, failure) {
        fetch('https://ipapi.co/json')
          .then(res => res.json())
          .then(data => success(data.country_code))
          .catch(() => failure());
      }
    });

    input.addEventListener('blur', async function () {
      if (!input.value.trim()) return;
      await iti.promiseUtilsLoaded;
      if (iti.isValidNumber()) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
      } else {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
      }
    });

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      await iti.promiseUtilsLoaded;

      let valid = true;
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        valid = false;
      }

      if (input.value.trim() && !iti.isValidNumber()) {
        input.classList.add('is-invalid');
        alert('Invalid number for selected country');
        valid = false;
      }

      if (!valid) return;

      if (typeof window.grecaptcha === 'undefined') {
        alert('Security verification is unavailable. Please try again later.');
        return;
      }

      try {
        const token = await window.grecaptcha.execute('6LcVCIIsAAAAAPlsdiUshWBeO-EL7Fl2FvSrkViL', { action: 'form_submit' });

        const data = {
          name: form.name.value,
          contact: input.value.trim() ? iti.getNumber() : '',
          email: form.email.value,
          age: form.age.value,
          notes: form.notes.value,
          recaptcha_token: token
        };

        const response = await fetch('vvi_send_email.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.status === 'success') {
          alert('Enquiry submitted successfully! Our team will contact you soon.');
          form.reset();
          form.classList.remove('was-validated');
          input.classList.remove('is-valid', 'is-invalid');
        } else {
          alert('Error: ' + (result.message || 'Unknown error'));
        }
      } catch (error) {
        console.error(error);
        alert('Error submitting form. Please try again later.');
      }
    });
  });
})();


/* Permanent Residency / Settle page — page-specific JavaScript only. */
(function () {
    'use strict';

    function initSettlePage() {
        // Preserve marquee pause/resume without inline event handlers.
        document.querySelectorAll('marquee[data-pause-on-hover="true"]').forEach(function (marquee) {
            marquee.addEventListener('mouseenter', function () {
                if (typeof marquee.stop === 'function') marquee.stop();
            });
            marquee.addEventListener('mouseleave', function () {
                if (typeof marquee.start === 'function') marquee.start();
            });
        });

        // Confined floating-dot animation used only by the Settle hero.
        const dots = document.querySelectorAll('.settle-page .hero-dot');
        if (!dots.length) return;

        dots.forEach(function (dot) {
            dot.animationData = {
                xPos: 0,
                yPos: 0,
                xSpeed: (Math.random() - 0.5) * 0.25,
                ySpeed: (Math.random() - 0.5) * 0.25,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 0.3,
                sinOffset: Math.random() * Math.PI * 2,
                amplitude: 2 + Math.random() * 5,
                frequency: 0.0006 + Math.random() * 0.001,
                maxX: 25,
                maxY: 25
            };
        });

        function animateDots(timestamp) {
            dots.forEach(function (dot) {
                const data = dot.animationData;

                data.xPos += data.xSpeed;
                data.yPos += data.ySpeed;

                if (Math.abs(data.xPos) > data.maxX) {
                    data.xSpeed *= -1;
                    data.xPos = Math.sign(data.xPos) * data.maxX;
                }

                if (Math.abs(data.yPos) > data.maxY) {
                    data.ySpeed *= -1;
                    data.yPos = Math.sign(data.yPos) * data.maxY;
                }

                const sinWaveX = Math.sin(timestamp * data.frequency + data.sinOffset) * data.amplitude;
                const sinWaveY = Math.cos(timestamp * data.frequency + data.sinOffset * 1.3) * data.amplitude;

                data.rotation += data.rotationSpeed;
                dot.style.transform = `translate(${data.xPos + sinWaveX}px, ${data.yPos + sinWaveY}px) rotate(${data.rotation}deg)`;
            });

            requestAnimationFrame(animateDots);
        }

        requestAnimationFrame(animateDots);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSettlePage, { once: true });
    } else {
        initSettlePage();
    }
})();




/* Other Services page-specific JavaScript.
   Shared site behavior remains in JS/script.js and JS/button.js. */

(function () {
    'use strict';

    // Google Analytics initialization, guarded against duplicate initialization.
    window.dataLayer = window.dataLayer || [];
    if (!window.__canboardsGtagInitialized) {
        window.gtag = window.gtag || function () {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', 'G-Y404KZ61CH');
        window.__canboardsGtagInitialized = true;
    }

    // Pause/resume announcement marquee without inline HTML event handlers.
    document.addEventListener('DOMContentLoaded', function () {
        var marquee = document.querySelector('.announcement-marquee marquee');
        if (!marquee) return;

        marquee.addEventListener('mouseenter', function () {
            if (typeof marquee.stop === 'function') marquee.stop();
        });

        marquee.addEventListener('mouseleave', function () {
            if (typeof marquee.start === 'function') marquee.start();
        });
    });
})();


/* IELTS & CELPIP Preparation — page-specific JavaScript.
   Shared behavior remains in JS/script.js and JS/button.js. */

(function () {
    'use strict';

    // Google Analytics initialization, guarded to avoid duplicate initialization.
    window.dataLayer = window.dataLayer || [];
    if (!window.__canboardsGtagInitialized) {
        window.gtag = window.gtag || function () {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', 'G-Y404KZ61CH');
        window.__canboardsGtagInitialized = true;
    }

    document.addEventListener('DOMContentLoaded', function () {
        // Announcement marquee: replace inline HTML handlers.
        var marquee = document.querySelector('.announcement-marquee marquee');
        if (marquee) {
            marquee.addEventListener('mouseenter', function () {
                if (typeof marquee.stop === 'function') marquee.stop();
            });
            marquee.addEventListener('mouseleave', function () {
                if (typeof marquee.start === 'function') marquee.start();
            });
        }

        // Sticky-card progress bar.
        var progress = document.getElementById('specialServicesBoxesStickyCardsProgressFill');
        var section = document.querySelector('.special-services-boxes-sticky-cards-section');
        if (!progress || !section) return;

        function updateProgress() {
            var rect = section.getBoundingClientRect();
            var viewport = window.innerHeight || document.documentElement.clientHeight;
            var total = section.offsetHeight - viewport;
            var passed = Math.max(0, Math.min(total, -rect.top));
            var percent = total > 0 ? (passed / total) * 100 : 0;
            progress.style.width = percent + '%';
        }

        updateProgress();
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress);
    });
})();



/* Statement of Purpose — page-specific JavaScript.
   Shared behavior remains in JS/script.js and JS/button.js. */

(function () {
    'use strict';

    window.dataLayer = window.dataLayer || [];

    // Guard against duplicate Google Analytics initialization.
    if (!window.__canboardsGtagInitialized) {
        window.gtag = window.gtag || function () {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', 'G-Y404KZ61CH');
        window.__canboardsGtagInitialized = true;
    }

    document.addEventListener('DOMContentLoaded', function () {
        // Announcement marquee — replaces inline onmouseover/onmouseout handlers.
        var marquee = document.querySelector('.announcement-marquee marquee');

        if (marquee) {
            marquee.addEventListener('mouseenter', function () {
                if (typeof marquee.stop === 'function') {
                    marquee.stop();
                }
            });

            marquee.addEventListener('mouseleave', function () {
                if (typeof marquee.start === 'function') {
                    marquee.start();
                }
            });
        }

        // Sticky-card progress bar.
        var progress = document.getElementById(
            'specialServicesBoxesStickyCardsProgressFill'
        );
        var section = document.querySelector(
            '.special-services-boxes-sticky-cards-section'
        );

        if (!progress || !section) return;

        function updateProgress() {
            var rect = section.getBoundingClientRect();
            var viewport = window.innerHeight || document.documentElement.clientHeight;
            var total = section.offsetHeight - viewport;
            var passed = Math.max(0, Math.min(total, -rect.top));
            var percent = total > 0 ? (passed / total) * 100 : 0;

            progress.style.width = percent + '%';
        }

        updateProgress();
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress);
    });
})();



/* Student Visa Application — page-specific JavaScript.
   Shared site behavior remains in JS/script.js and JS/button.js. */

(function () {
    'use strict';

    window.dataLayer = window.dataLayer || [];

    // Prevent duplicate GA initialization when another shared script already initialized it.
    if (!window.__canboardsGtagInitialized) {
        window.gtag = window.gtag || function () {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', 'G-Y404KZ61CH');
        window.__canboardsGtagInitialized = true;
    }

    document.addEventListener('DOMContentLoaded', function () {
        // Announcement marquee — replaces inline HTML event handlers.
        var marquee = document.querySelector('.announcement-marquee marquee');

        if (marquee) {
            marquee.addEventListener('mouseenter', function () {
                if (typeof marquee.stop === 'function') marquee.stop();
            });

            marquee.addEventListener('mouseleave', function () {
                if (typeof marquee.start === 'function') marquee.start();
            });
        }

        // Sticky-card progress bar.
        var progress = document.getElementById(
            'specialServicesBoxesStickyCardsProgressFill'
        );
        var section = document.querySelector(
            '.special-services-boxes-sticky-cards-section'
        );

        if (!progress || !section) return;

        function updateProgress() {
            var rect = section.getBoundingClientRect();
            var viewport = window.innerHeight || document.documentElement.clientHeight;
            var total = section.offsetHeight - viewport;
            var passed = Math.max(0, Math.min(total, -rect.top));
            var percent = total > 0 ? (passed / total) * 100 : 0;

            progress.style.width = percent + '%';
        }

        updateProgress();
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress);
    });
})();



/* Post-Graduation Work Permit — page-specific JavaScript.
   Shared behavior remains in JS/script.js and JS/button.js. */

(function () {
    'use strict';

    window.dataLayer = window.dataLayer || [];

    if (!window.__canboardsGtagInitialized) {
        window.gtag = window.gtag || function () {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', 'G-Y404KZ61CH');
        window.__canboardsGtagInitialized = true;
    }

    document.addEventListener('DOMContentLoaded', function () {
        var marquee = document.querySelector('.announcement-marquee marquee');

        if (marquee) {
            marquee.addEventListener('mouseenter', function () {
                if (typeof marquee.stop === 'function') marquee.stop();
            });
            marquee.addEventListener('mouseleave', function () {
                if (typeof marquee.start === 'function') marquee.start();
            });
        }

        var progress = document.getElementById(
            'specialServicesBoxesStickyCardsProgressFill'
        );
        var section = document.querySelector(
            '.special-services-boxes-sticky-cards-section'
        );

        if (!progress || !section) return;

        function updateProgress() {
            var rect = section.getBoundingClientRect();
            var viewport = window.innerHeight || document.documentElement.clientHeight;
            var total = section.offsetHeight - viewport;
            var passed = Math.max(0, Math.min(total, -rect.top));
            var percent = total > 0 ? (passed / total) * 100 : 0;
            progress.style.width = percent + '%';
        }

        updateProgress();
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress);
    });
})();



/* Study Permit Extension — page-specific JavaScript.
   Shared behavior remains in JS/script.js and JS/button.js. */

(function () {
    'use strict';

    window.dataLayer = window.dataLayer || [];

    if (!window.__canboardsGtagInitialized) {
        window.gtag = window.gtag || function () {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', 'G-Y404KZ61CH');
        window.__canboardsGtagInitialized = true;
    }

    document.addEventListener('DOMContentLoaded', function () {
        var marquee = document.querySelector('.announcement-marquee marquee');

        if (marquee) {
            marquee.addEventListener('mouseenter', function () {
                if (typeof marquee.stop === 'function') marquee.stop();
            });
            marquee.addEventListener('mouseleave', function () {
                if (typeof marquee.start === 'function') marquee.start();
            });
        }

        var progress = document.getElementById(
            'specialServicesBoxesStickyCardsProgressFill'
        );
        var section = document.querySelector(
            '.special-services-boxes-sticky-cards-section'
        );

        if (!progress || !section) return;

        function updateProgress() {
            var rect = section.getBoundingClientRect();
            var viewport = window.innerHeight || document.documentElement.clientHeight;
            var total = section.offsetHeight - viewport;
            var passed = Math.max(0, Math.min(total, -rect.top));
            var percent = total > 0 ? (passed / total) * 100 : 0;
            progress.style.width = percent + '%';
        }

        updateProgress();
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress);
    });
})();



/* temporary-resident-visa — page-specific JavaScript.
   Shared behavior remains in JS/script.js and JS/button.js. */

(function () {
    'use strict';

    window.dataLayer = window.dataLayer || [];

    if (!window.__canboardsGtagInitialized) {
        window.gtag = window.gtag || function () {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', 'G-Y404KZ61CH');
        window.__canboardsGtagInitialized = true;
    }

    document.addEventListener('DOMContentLoaded', function () {
        var marquee = document.querySelector('.announcement-marquee marquee');

        if (marquee) {
            marquee.addEventListener('mouseenter', function () {
                if (typeof marquee.stop === 'function') marquee.stop();
            });
            marquee.addEventListener('mouseleave', function () {
                if (typeof marquee.start === 'function') marquee.start();
            });
        }

        var progress = document.getElementById(
            'specialServicesBoxesStickyCardsProgressFill'
        );
        var section = document.querySelector(
            '.special-services-boxes-sticky-cards-section'
        );

        if (!progress || !section) return;

        function updateProgress() {
            var rect = section.getBoundingClientRect();
            var viewport = window.innerHeight || document.documentElement.clientHeight;
            var total = section.offsetHeight - viewport;
            var passed = Math.max(0, Math.min(total, -rect.top));
            var percent = total > 0 ? (passed / total) * 100 : 0;
            progress.style.width = percent + '%';
        }

        updateProgress();
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress);
    });
})();


/* atip-gcms-notes — page-specific JavaScript.
   Shared behavior remains in JS/script.js and JS/button.js. */

(function () {
    'use strict';

    window.dataLayer = window.dataLayer || [];

    // Guard against duplicate Google Analytics initialization.
    if (!window.__canboardsGtagInitialized) {
        window.gtag = window.gtag || function () {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', 'G-Y404KZ61CH');
        window.__canboardsGtagInitialized = true;
    }

    document.addEventListener('DOMContentLoaded', function () {
        // Announcement marquee: replaces inline HTML handlers.
        var marquee = document.querySelector('.announcement-marquee marquee');

        if (marquee) {
            marquee.addEventListener('mouseenter', function () {
                if (typeof marquee.stop === 'function') marquee.stop();
            });

            marquee.addEventListener('mouseleave', function () {
                if (typeof marquee.start === 'function') marquee.start();
            });
        }

        // Sticky-card progress bar.
        var progress = document.getElementById(
            'specialServicesBoxesStickyCardsProgressFill'
        );
        var section = document.querySelector(
            '.special-services-boxes-sticky-cards-section'
        );

        if (!progress || !section) return;

        function updateProgress() {
            var rect = section.getBoundingClientRect();
            var viewport = window.innerHeight || document.documentElement.clientHeight;
            var total = section.offsetHeight - viewport;
            var passed = Math.max(0, Math.min(total, -rect.top));
            var percent = total > 0 ? (passed / total) * 100 : 0;

            progress.style.width = percent + '%';
        }

        updateProgress();
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress);
    });
})();


/* Authorization & Legal Documents — page-specific JavaScript.
   Shared behavior remains in JS/script.js and JS/button.js. */

(function () {
    'use strict';

    window.dataLayer = window.dataLayer || [];

    if (!window.__canboardsGtagInitialized) {
        window.gtag = window.gtag || function () {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', 'G-Y404KZ61CH');
        window.__canboardsGtagInitialized = true;
    }

    document.addEventListener('DOMContentLoaded', function () {
        var marquee = document.querySelector('.announcement-marquee marquee');

        if (marquee) {
            marquee.addEventListener('mouseenter', function () {
                if (typeof marquee.stop === 'function') marquee.stop();
            });
            marquee.addEventListener('mouseleave', function () {
                if (typeof marquee.start === 'function') marquee.start();
            });
        }

        var progress = document.getElementById(
            'specialServicesBoxesStickyCardsProgressFill'
        );
        var section = document.querySelector(
            '.special-services-boxes-sticky-cards-section'
        );

        if (!progress || !section) return;

        function updateProgress() {
            var rect = section.getBoundingClientRect();
            var viewport = window.innerHeight || document.documentElement.clientHeight;
            var total = section.offsetHeight - viewport;
            var passed = Math.max(0, Math.min(total, -rect.top));
            var percent = total > 0 ? (passed / total) * 100 : 0;
            progress.style.width = percent + '%';
        }

        updateProgress();
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress);
    });
})();



/* Request a Fair Review — page-specific JavaScript.
   Shared behavior remains in JS/script.js and JS/button.js. */

(function () {
    'use strict';

    window.dataLayer = window.dataLayer || [];

    // Prevent duplicate Google Analytics initialization.
    if (!window.__canboardsGtagInitialized) {
        window.gtag = window.gtag || function () {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', 'G-Y404KZ61CH');
        window.__canboardsGtagInitialized = true;
    }

    document.addEventListener('DOMContentLoaded', function () {
        // Announcement marquee — replaces inline HTML handlers.
        var marquee = document.querySelector('.announcement-marquee marquee');

        if (marquee) {
            marquee.addEventListener('mouseenter', function () {
                if (typeof marquee.stop === 'function') marquee.stop();
            });

            marquee.addEventListener('mouseleave', function () {
                if (typeof marquee.start === 'function') marquee.start();
            });
        }

        // Sticky-card progress bar.
        var progress = document.getElementById(
            'specialServicesBoxesStickyCardsProgressFill'
        );
        var section = document.querySelector(
            '.special-services-boxes-sticky-cards-section'
        );

        if (!progress || !section) return;

        function updateProgress() {
            var rect = section.getBoundingClientRect();
            var viewport = window.innerHeight || document.documentElement.clientHeight;
            var total = section.offsetHeight - viewport;
            var passed = Math.max(0, Math.min(total, -rect.top));
            var percent = total > 0 ? (passed / total) * 100 : 0;

            progress.style.width = percent + '%';
        }

        updateProgress();
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress);
    });
})();


/* Process Fairness Letter — page-specific JavaScript.
   Shared behavior remains in JS/script.js and JS/button.js. */

(function () {
    'use strict';

    window.dataLayer = window.dataLayer || [];

    if (!window.__canboardsGtagInitialized) {
        window.gtag = window.gtag || function () {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', 'G-Y404KZ61CH');
        window.__canboardsGtagInitialized = true;
    }

    document.addEventListener('DOMContentLoaded', function () {
        var marquee = document.querySelector('.announcement-marquee marquee');

        if (marquee) {
            marquee.addEventListener('mouseenter', function () {
                if (typeof marquee.stop === 'function') marquee.stop();
            });
            marquee.addEventListener('mouseleave', function () {
                if (typeof marquee.start === 'function') marquee.start();
            });
        }

        var progress = document.getElementById(
            'specialServicesBoxesStickyCardsProgressFill'
        );
        var section = document.querySelector(
            '.special-services-boxes-sticky-cards-section'
        );

        if (!progress || !section) return;

        function updateProgress() {
            var rect = section.getBoundingClientRect();
            var viewport = window.innerHeight || document.documentElement.clientHeight;
            var total = section.offsetHeight - viewport;
            var passed = Math.max(0, Math.min(total, -rect.top));
            var percent = total > 0 ? (passed / total) * 100 : 0;
            progress.style.width = percent + '%';
        }

        updateProgress();
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress);
    });
})();



/* Super Visa — PAGE-SPECIFIC JAVASCRIPT ONLY.
   No unique JavaScript is required on this page.
   Shared header/menu, marquee, sticky-card progress and common interactions
   remain in the existing JS/main.js. */


/* Page-specific form/phone validation logic extracted from the original HTML. */
document.addEventListener("DOMContentLoaded", function () {

  const input = document.querySelector("#contact");
  const form = document.getElementById("PGPForm");

  // This form is page-specific. Never let a missing field/plugin break the
  // shared JavaScript used by every page.
  if (!input || !form || typeof window.intlTelInput !== "function") return;

  const iti = window.intlTelInput(input, {
    initialCountry: "auto",
    separateDialCode: true,
    autoPlaceholder: "aggressive",
    loadUtils: () =>
      import("https://cdn.jsdelivr.net/npm/intl-tel-input@25.10.1/build/js/utils.js"),
    geoIpLookup: function (success, failure) {
      fetch("https://ipapi.co/json")
        .then(res => res.json())
        .then(data => success(data.country_code))
        .catch(() => failure());
    }
  });

  // Validate phone on blur
  input.addEventListener("blur", async function () {

    if (!input.value.trim()) return;

    await iti.promiseUtilsLoaded;

    if (iti.isValidNumber()) {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
    } else {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
    }

  });

  // Form submit
  form.addEventListener("submit", async function (event) {

    event.preventDefault();

    await iti.promiseUtilsLoaded;

    let valid = true;

    // Check normal form validation
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      valid = false;
    }

    // Phone validation
    if (input.value.trim() && !iti.isValidNumber()) {
      input.classList.add("is-invalid");
      alert("Invalid number for selected country");
      valid = false;
    }

    if (!valid) return;

        // GET RECAPTCHA TOKEN
        if (typeof window.grecaptcha === "undefined" || typeof window.grecaptcha.execute !== "function") {
          alert("Security verification is unavailable. Please try again later.");
          return;
        }

        const token = await window.grecaptcha.execute("6LcVCIIsAAAAAPlsdiUshWBeO-EL7Fl2FvSrkViL", { action: "form_submit" });

    const data = {
      name: form.name.value,
      contact: input.value.trim() ? iti.getNumber() : "",
      email: form.email.value,
      age: form.age.value,
      notes: form.notes.value,
    recaptcha_token: token   // ← ADD THIS
    };

    fetch("sv_send_email.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {

      if (res.status === "success") {

        alert("Enquiry submitted successfully! Our team will contact you soon.");

        form.reset();
        form.classList.remove("was-validated");
        input.classList.remove("is-valid","is-invalid");

      } else {
        alert("Error: " + (res.message || "Unknown error"));
      }

    })
    .catch(err => {
      console.error(err);
      alert("Error submitting form. Please try again later.");
    });

  });

});

//document.querySelector('.accordion-header').addEventListener('click', function () {
//  const accordion = this.closest('.funds-accordion');
//  accordion.classList.toggle('open');
//});


/* =========================================================
   SKYSAIL TIMELINES
   Supports OLD + NEW timeline independently
   Uses the existing .pl1234x-* CSS
   ========================================================= */

(function () {
    'use strict';


    function initTimeline(timeline) {

        if (!timeline) return;


        const container =
            timeline.querySelector(
                '.pl1234x-timeline-container'
            );

        const base =
            timeline.querySelector(
                '.pl1234x-timeline-base'
            );

        const progress =
            timeline.querySelector(
                '.pl1234x-timeline-progress'
            );

        const nodes =
            Array.from(
                timeline.querySelectorAll(
                    '.pl1234x-timeline-node'
                )
            );

        const dots =
            Array.from(
                timeline.querySelectorAll(
                    '.pl1234x-node-dot'
                )
            );


        if (
            !container ||
            !base ||
            !progress ||
            nodes.length < 1
        ) {
            return;
        }


        let currentStep = 0;

        let autoPlayInterval = null;


        /* =====================================================
           IMAGE DATA
           PNG → GIF → PNG
           ===================================================== */

        const nodeImageData =
            nodes.map(function (node) {

                const img =
                    node.querySelector(
                        '.pl1234x-node-img'
                    );

                if (!img) {

                    return {
                        img: null,
                        pngSrc: '',
                        gifSrc: '',
                        animating: false
                    };

                }


                const pngSrc =
                    img.src;


                const gifSrc =
                    pngSrc.replace(
                        /\.png$/i,
                        '.gif'
                    );


                return {
                    img: img,
                    pngSrc: pngSrc,
                    gifSrc: gifSrc,
                    animating: false
                };

            });


        /* =====================================================
           ALIGN LINE
           ===================================================== */

        function alignLine() {

            if (
                dots.length < 2 ||
                window.innerWidth <= 768
            ) {
                return;
            }


            const containerRect =
                container.getBoundingClientRect();


            const firstDot =
                dots[0].getBoundingClientRect();


            const lastDot =
                dots[dots.length - 1]
                    .getBoundingClientRect();


            const start =
                (
                    (firstDot.left +
                    firstDot.right) / 2
                ) -
                containerRect.left;


            const end =
                (
                    (lastDot.left +
                    lastDot.right) / 2
                ) -
                containerRect.left;


            const width =
                Math.max(
                    0,
                    end - start
                );


            base.style.left =
                start + 'px';


            base.style.width =
                width + 'px';


            progress.style.left =
                start + 'px';


            base.style.height =
                '4px';


            progress.style.height =
                '4px';
        }


        /* =====================================================
           GIF ANIMATION
           ===================================================== */

        function playNodeAnimation(index) {

            const data =
                nodeImageData[index];


            if (
                !data ||
                !data.img ||
                !data.gifSrc ||
                data.animating
            ) {
                return;
            }


            data.animating = true;


            const img =
                data.img;


            img.src =
                data.gifSrc;


            setTimeout(function () {

                img.src =
                    data.pngSrc;


                data.animating =
                    false;

            }, 2000);
        }


        /* =====================================================
           UPDATE TIMELINE
           ===================================================== */

        function updateTimeline(
            stepIndex,
            instant
        ) {

            currentStep =
                Math.max(
                    0,
                    Math.min(
                        stepIndex,
                        nodes.length - 1
                    )
                );


            /* Active nodes */

            nodes.forEach(
                function (node, index) {

                    node.classList.toggle(
                        'active',
                        index <= currentStep
                    );

                }
            );


            /* GIF */

            playNodeAnimation(
                currentStep
            );


            /* Progress */

            const ratio =
                nodes.length > 1
                    ? currentStep /
                      (nodes.length - 1)
                    : 0;


            if (instant) {

                progress.style.transition =
                    'none';

            } else {

                progress.style.transition =
                    'width 0.6s ease-in-out';
            }


            if (
                window.innerWidth <= 768
            ) {

                progress.style.width =
                    '4px';

                progress.style.height =
                    ratio * 100 + '%';

            } else {

                const baseRect =
                    base.getBoundingClientRect();


                const containerRect =
                    container.getBoundingClientRect();


                const width =
                    baseRect.width;


                const left =
                    baseRect.left -
                    containerRect.left;


                progress.style.left =
                    left + 'px';


                progress.style.width =
                    width * ratio + 'px';


                progress.style.height =
                    '4px';
            }


            if (instant) {

                void progress.offsetWidth;

                progress.style.transition =
                    'width 0.6s ease-in-out';
            }
        }


        /* =====================================================
           AUTOPLAY
           ===================================================== */

        function stopAutoPlay() {

            if (autoPlayInterval) {

                clearInterval(
                    autoPlayInterval
                );

                autoPlayInterval =
                    null;
            }
        }


        function startAutoPlay() {

            stopAutoPlay();


            autoPlayInterval =
                setInterval(
                    function () {

                        currentStep =
                            (
                                currentStep + 1
                            ) %
                            nodes.length;


                        updateTimeline(
                            currentStep,
                            false
                        );

                    },
                    3000
                );
        }


        /* =====================================================
           CLICK
           ===================================================== */

        nodes.forEach(
            function (node, index) {

                node.addEventListener(
                    'click',
                    function () {

                        stopAutoPlay();


                        updateTimeline(
                            index,
                            false
                        );


                        setTimeout(
                            startAutoPlay,
                            5000
                        );

                    }
                );

            }
        );


        /* =====================================================
           RESIZE
           ===================================================== */

        let resizeTimer;


        function handleResize() {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(
                    function () {

                        alignLine();


                        updateTimeline(
                            currentStep,
                            true
                        );

                    },
                    120
                );
        }


        window.addEventListener(
            'resize',
            handleResize
        );


        /* =====================================================
           INITIAL
           ===================================================== */

        alignLine();


        updateTimeline(
            0,
            true
        );


        startAutoPlay();


        window.addEventListener(
            'load',
            function () {

                alignLine();


                updateTimeline(
                    currentStep,
                    true
                );

            }
        );

    }


    /* =========================================================
       INITIALIZE EACH TIMELINE SEPARATELY
       ========================================================= */

    function initAllTimelines() {

        const timelines =
            document.querySelectorAll(
                '.pl1234x-line-process'
            );


        timelines.forEach(
            function (timeline) {

                initTimeline(
                    timeline
                );

            }
        );
    }


    if (
        document.readyState ===
        'loading'
    ) {

        document.addEventListener(
            'DOMContentLoaded',
            initAllTimelines
        );

    } else {

        initAllTimelines();
    }


})();



 document.addEventListener("DOMContentLoaded", function () {
        
          const input = document.querySelector("#contact");
          const form = document.getElementById("enquiryForm");
        
          if (!input || !form || typeof window.intlTelInput !== "function") return;
        
          const iti = window.intlTelInput(input, {
            initialCountry: "auto",
            separateDialCode: true,
            autoPlaceholder: "aggressive",
            loadUtils: () =>
              import("https://cdn.jsdelivr.net/npm/intl-tel-input@25.10.1/build/js/utils.js"),
            geoIpLookup: function (success, failure) {
              fetch("https://ipapi.co/json")
                .then(res => res.json())
                .then(data => success(data.country_code))
                .catch(() => failure());
            }
          });
        
          // 🔹 Validate phone on blur
          input.addEventListener("blur", async function () {
        
            if (!input.value.trim()) {
              input.classList.remove("is-valid","is-invalid");
              return;
            }
        
            await iti.promiseUtilsLoaded;
        
            if (iti.isValidNumber()) {
              input.classList.remove("is-invalid");
              input.classList.add("is-valid");
            } else {
              input.classList.add("is-invalid");
              input.classList.remove("is-valid");
            }
        
          });
        
          // 🔹 Form submit validation
          form.addEventListener("submit", async function (event) {
        
            event.preventDefault();
        
            await iti.promiseUtilsLoaded;
        
            let valid = true;
        
            // Bootstrap validation
            if (!form.checkValidity()) {
              form.classList.add("was-validated");
              valid = false;
            }
        
            // Phone validation (only if filled)
            if (input.value.trim() !== "" && !iti.isValidNumber()) {
              input.classList.add("is-invalid");
              alert("Invalid number for selected country");
              valid = false;
            }
        
            // STOP submission
            if (!valid) {
              return;
            }
        
            // GET RECAPTCHA TOKEN
            if (typeof window.grecaptcha === "undefined" || typeof window.grecaptcha.execute !== "function") {
              alert("Security verification is unavailable. Please try again later.");
              return;
            }

            const token = await window.grecaptcha.execute("6LcVCIIsAAAAAPlsdiUshWBeO-EL7Fl2FvSrkViL", { action: "form_submit" });
        
            const data = {
              name: form.name.value,
              contact: input.value.trim() ? iti.getNumber() : "",
              email: form.email.value,
              level: form.level.value,
              field: form.mainProgram.value,
              program: form.program.value,
              province: form.province.value,
              city: form.city.value,
              notes: form.comment.value,
            recaptcha_token: token   // ← ADD THIS
            };
        
            fetch("course_send_email.php", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(res => {
        
              if (res.status === "success") {
        
                alert("Enquiry submitted successfully! Our team will contact you soon.");
        
                form.reset();
                form.classList.remove("was-validated");
                input.classList.remove("is-valid","is-invalid");
        
              } else {
                alert("Error: " + (res.message || "Unknown error"));
              }
        
            })
            .catch(err => {
              console.error(err);
              alert("Server error. Please try again later.");
            });
        
          });
        
        });



 /* =========================================
   SKYSAIL EMOJI BACK TO TOP
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const button = document.getElementById("skyBackToTop");

    // Back-to-top is optional. If the button is not on this page, skip it.
    if (!button) return;


    function checkScroll() {

        if (window.scrollY > 350) {

            button.classList.add("show");

        } else {

            button.classList.remove("show");

        }

    }


    window.addEventListener(
        "scroll",
        checkScroll,
        { passive: true }
    );


    button.addEventListener("click", function () {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });


    checkScroll();

});


document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       OFFICE CARDS — SCROLL REVEAL
    ====================================================== */

    const officeCards = document.querySelectorAll(
        ".skysail-office-card"
    );


    if ("IntersectionObserver" in window) {

        const cardObserver = new IntersectionObserver(
            function (entries, observer) {

                entries.forEach(function (entry) {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add(
                        "skysail-card-visible"
                    );

                    observer.unobserve(entry.target);

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -50px 0px"
            }
        );


        officeCards.forEach(function (card, index) {

            card.style.transitionDelay =
                `${index * 80}ms`;

            cardObserver.observe(card);

        });

    } else {

        officeCards.forEach(function (card) {

            card.classList.add(
                "skysail-card-visible"
            );

        });

    }


    /* =====================================================
       GOOGLE MAP LOAD STATE
    ====================================================== */

    const officeMaps = document.querySelectorAll(
        ".skysail-office-map"
    );


    officeMaps.forEach(function (mapContainer) {

        const iframe = mapContainer.querySelector("iframe");

        if (!iframe) {
            return;
        }


        iframe.addEventListener(
            "load",
            function () {

                mapContainer.classList.add(
                    "skysail-map-loaded"
                );

            }
        );


        /*
         * Fallback:
         * Google Maps can occasionally load from cache
         * without firing the expected event immediately.
         */

        setTimeout(function () {

            mapContainer.classList.add(
                "skysail-map-loaded"
            );

        }, 3500);

    });


    /* =====================================================
       EXTERNAL MAP LINKS
    ====================================================== */

    const mapButtons = document.querySelectorAll(
        ".skysail-map-button"
    );


    mapButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                button.classList.add(
                    "skysail-map-clicked"
                );

            }
        );

    });


    /* =====================================================
       TELEPHONE LINKS
    ====================================================== */

    const phoneLinks = document.querySelectorAll(
        'a[href^="tel:"]'
    );


    phoneLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                link.classList.add(
                    "skysail-phone-clicked"
                );

            }
        );

    });


    /* =====================================================
       WHATSAPP LINKS
    ====================================================== */

    const whatsappLinks = document.querySelectorAll(
        'a[href*="wa.me"]'
    );


    whatsappLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                link.classList.add(
                    "skysail-whatsapp-clicked"
                );

            }
        );

    });


    /* =====================================================
       COUNTRY SECTION REVEAL
    ====================================================== */

    const countrySections = document.querySelectorAll(
        ".skysail-offices-country"
    );


    if ("IntersectionObserver" in window) {

        const countryObserver = new IntersectionObserver(
            function (entries, observer) {

                entries.forEach(function (entry) {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add(
                        "skysail-country-visible"
                    );

                    observer.unobserve(entry.target);

                });

            },
            {
                threshold: 0.08
            }
        );


        countrySections.forEach(function (section) {

            countryObserver.observe(section);

        });

    }

});