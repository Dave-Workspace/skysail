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


function runWhenDOMReady(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback(); // DOM already loaded
    }
}


const sheetScript = document.createElement('script');
sheetScript.src = 'https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js';

sheetScript.onload = () => {
    console.log('✅ SheetJS loaded!');

    runWhenDOMReady(() => {
        console.log('✅ DOM is ready');




        function formatDate(date) {
            if (!(date instanceof Date)) return date;
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        }

        function createHeaderCell(text, colIndex) {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell';
            cellDiv.textContent = text;

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'sort-btn';
            btn.dataset.col = colIndex;
            btn.setAttribute('aria-label', `Sort by ${text} ascending`);
            btn.textContent = '▲';

            cellDiv.appendChild(btn);
            return cellDiv;
        }


        console.log('Here ');

        window.readAndRender = async function readAndRender(filterKey, extraFilter, targetModalId) {
            const fileUrl = 'Upload/Draw.xlsx';

            try {
                const response = await fetch(fileUrl);
                if (!response.ok) {
                    throw new Error(`❌ Failed to fetch file. Status: ${response.status}`);
                }

                const arrayBuffer = await response.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });

                if (!rawData.length) return console.warn("Empty Excel data");

                const headers = rawData[0];
                const dataRows = rawData.slice(1); // skip header row

                // ✅ Filter rows if needed
                const filteredRows = dataRows.filter(row => {
                    if (!row) return false;
                    const firstCol = row[0];
                    if (filterKey && firstCol !== filterKey) return false;
                    if (extraFilter && !extraFilter(row)) return false;
                    return true;
                });

                // ✅ Sort by second column (index 1) as date descending
                filteredRows.sort((a, b) => {
                    const dateA = new Date(a[1]);
                    const dateB = new Date(b[1]);
                    return dateB - dateA; // Descending
                });

                // ✅ Clear existing content
                //const container = document.getElementById('dataTableDraws');
                const modal = document.getElementById(targetModalId);
                if (!modal) return console.error("Modal not found:", targetModalId);

                const container = modal.querySelector('.data-table');
                if (!container) return console.error("Data table not found in modal:", targetModalId);

                //if (!container) return console.error("Container not found");

                const headerDiv = container.querySelector('.header');


                const rowWrapperDiv = container.querySelector('.rows-wrapper');



                headerDiv.innerHTML = '';
                Array.from(container.querySelectorAll('.row')).forEach(row => row.remove());
                rowWrapperDiv.innerHTML = '';


                // ✅ Create header (skip first column)
                for (let i = 1; i < headers.length; i++) {
                    headerDiv.appendChild(createHeaderCell(headers[i], i - 1));
                }

                // ✅ Render rows
                for (const row of filteredRows) {
                    const rowDiv = document.createElement('div');
                    rowDiv.className = 'row';

                    for (let j = 1; j < headers.length; j++) {
                        let cellVal = row[j];

                        // ✅ Only format column B (index 1) as date
                        if (j === 1) {
                            const dateCandidate = new Date(cellVal);
                            if (!isNaN(dateCandidate)) {
                                cellVal = formatDate(dateCandidate);
                            }
                        }

                        const cellDiv = document.createElement('div');
                        cellDiv.className = 'cell';
                        cellDiv.textContent = cellVal || '';
                        rowDiv.appendChild(cellDiv);
                    }
                    rowWrapperDiv.appendChild(rowDiv);
                }

            } catch (err) {
                console.error("Error reading Excel:", err);
            }
        };






        //    document.addEventListener('DOMContentLoaded', () => {






        console.log("DOM loaded — initializing modals");

        // Open modals
        /*document.querySelectorAll("[data-modal-target]").forEach(btn => {
          btn.addEventListener("click", e => {
            e.preventDefault();
            console.log("Open modal button clicked:", btn);
            const modalId = btn.getAttribute("data-modal-target");
            const modal = document.getElementById(modalId);
            console.log("Opening modal:", modalId, modal);
            if (modal) {
              modal.classList.add("show");
              document.body.classList.add("modal-open");
            }
          });
        });*/

        document.body.addEventListener("click", function (e) {


            //    const dateInput = document.getElementById('appDate');
            //const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
            //dateInput.value = today;



            const btn = e.target.closest("[data-modal-target]");
            if (!btn) return;

            e.preventDefault();

            console.log("Open modal button clicked:", btn);
            const modalId = btn.getAttribute("data-modal-target");
            const modal = document.getElementById(modalId);
            console.log("Opening modal:", modalId, modal);
            if (modal) {
                modal.classList.add("show");
                document.body.classList.add("modal-open");

                if (modalId === "modal-age") {
                    initAgeCalculator();
                }

            } else {
                console.warn("Modal not found:", modalId);
            }



            // ✅ Scroll check after slight delay (for dynamic rows)
            setTimeout(() => {
                const rowsWrapper = modal.querySelector('.rows-wrapper');
                const header = modal.querySelector('.header');
                if (!rowsWrapper || !header) return;

                const hasScroll = rowsWrapper.scrollHeight > rowsWrapper.clientHeight;
                header.classList.toggle('scroll-visible', hasScroll);
            }, 100); // 100ms delay — tweak if needed


        });

        // Close modals
        /*document.querySelectorAll("[data-close]").forEach(btn => {
          btn.addEventListener("click", e => {
            e.preventDefault();
            console.log("Close modal button clicked:", btn);
            const modal = btn.closest(".modal");
            closeModal(modal);
          });
        });*/

        // ESC to close
        /*document.addEventListener("keydown", e => {
          if (e.key === "Escape") {
            document.querySelectorAll(".modal.show").forEach(modal => {
              closeModal(modal);
            });
          }
        });*/

        document.body.addEventListener("click", function (e) {
            const closeBtn = e.target.closest("[data-close]");
            if (!closeBtn) return;

            const modal = closeBtn.closest(".modal");
            if (modal) {
                modal.classList.remove("show");
                document.body.classList.remove("modal-open");
            }
        });

        // Optional: Close modal on outside click
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
                document.querySelectorAll(".modal.show").forEach(modal => {
                    modal.classList.remove("show");
                });
                document.body.classList.remove("modal-open");
            }
        });



        window.openDraws = function (event, filterKey, extraFilter = null) {
            event.preventDefault(); // Prevent default anchor behavior

            readAndRender(filterKey, extraFilter, "modal-draw").then(() => {
                const modal = document.getElementById("modal-draw");
                if (modal) {
                    initTable(modal);
                    modal.classList.add("show");
                    document.body.classList.add("modal-open");
                }
            });
        };


        function closeModal(modal) {
            if (!modal) return;
            console.log("Closing modal:", modal);
            modal.classList.remove("show");
            document.body.classList.remove("modal-open");

            const input = modal.querySelector(".search-input");
            const autocomplete = modal.querySelector(".autocomplete-list");
            if (input) input.value = "";
            if (autocomplete) autocomplete.style.display = "none";

            modal.querySelectorAll(".row").forEach(row => row.style.display = "flex");
            modal.querySelectorAll(".sort-btn").forEach(btn => {
                btn.textContent = "▲";
                btn.setAttribute('aria-label', btn.parentElement.textContent.trim() + ' ascending');
            });
            modal.querySelectorAll(".header .cell").forEach(cell => cell.classList.remove("highlighted"));
            if (modal._lastSort) {
                delete modal._lastSort;
            }
        }

        function initTable(modal) {
            if (!modal) {
                console.warn("initTable: modal is null");
                return;
            }
            console.log("Initializing table for modal:", modal);

            const input = modal.querySelector(".search-input");
            const autocompleteBox = modal.querySelector(".autocomplete-list");
            const dataTable = modal.querySelector(".data-table");
            const sortButtons = Array.from(dataTable.querySelectorAll(".sort-btn"));

            console.log("Found sort buttons:", sortButtons.length);

            const autocompleteItems = Array.from(dataTable.querySelectorAll(".row")).map(
                row => row.children[0].textContent.trim()
            );

            if (!modal._lastSort) {
                modal._lastSort = { col: null, order: null };
            }

            function getRows() {
                return Array.from(dataTable.querySelectorAll(".row"));
            }

            function highlightColumn(index) {
                modal.querySelectorAll(".header .cell").forEach((cell, i) => {
                    cell.classList.toggle("highlighted", i === index);
                });
            }

            function sortRows(columnIndex, order) {
                console.log("sortRows called:", columnIndex, order);
                const rows = getRows();
                rows.sort((a, b) => {
                    const aText = a.children[columnIndex].textContent.trim().toLowerCase();
                    const bText = b.children[columnIndex].textContent.trim().toLowerCase();
                    const aVal = isNaN(aText) ? aText : parseFloat(aText);
                    const bVal = isNaN(bText) ? bText : parseFloat(bText);
                    return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * (order === "asc" ? 1 : -1);
                });
                const rowsWrapper = dataTable.querySelector(".rows-wrapper");
                rowsWrapper.innerHTML = ""; // Optional: clear existing rows
                rows.forEach(row => rowsWrapper.appendChild(row));
                //rows.forEach(row => dataTable.appendChild(row));
                highlightColumn(columnIndex);
                modal._lastSort = { col: columnIndex, order };
                updateSortArrows(columnIndex, order);
            }

            function updateSortArrows(col, order) {
                sortButtons.forEach(btn => {
                    const btnCol = parseInt(btn.getAttribute("data-col"));
                    if (btnCol === col) {
                        btn.textContent = order === "asc" ? "▲" : "▼";
                        btn.setAttribute('aria-label', `Sort by ${btn.parentElement.textContent.trim()} ${order === "asc" ? 'ascending' : 'descending'}`);
                    } else {
                        btn.textContent = "▲";
                        btn.setAttribute('aria-label', `Sort by ${btn.parentElement.textContent.trim()} ascending`);
                    }
                });
            }

            sortButtons.forEach(btn => {
                btn.addEventListener("click", e => {
                    e.preventDefault();
                    console.log("Sort button click:", btn);
                    const col = parseInt(btn.getAttribute("data-col"));
                    let order = "asc";
                    if (modal._lastSort && modal._lastSort.col === col) {
                        order = modal._lastSort.order === "asc" ? "desc" : "asc";
                    }
                    sortRows(col, order);
                });
            });

            input.addEventListener("input", e => {
                e.preventDefault();
                console.log("Input event:", e.target.value);
                const value = e.target.value.toLowerCase();

                getRows().forEach(row => {
                    const rowText = row.textContent.toLowerCase();
                    row.style.display = rowText.includes(value) ? "flex" : "none";
                });

                if (value.length >= 3) {
                    const suggestions = autocompleteItems.filter(item =>
                        item.toLowerCase().includes(value)
                    );
                    showSuggestions(suggestions);
                } else {
                    autocompleteBox.style.display = "none";
                }

                if (modal._lastSort && modal._lastSort.col !== null) {
                    sortRows(modal._lastSort.col, modal._lastSort.order);
                }
            });

            function showSuggestions(matches) {
                autocompleteBox.innerHTML = "";
                if (matches.length === 0) {
                    autocompleteBox.style.display = "none";
                    return;
                }
                matches.forEach(match => {
                    const div = document.createElement("div");
                    div.className = "autocomplete-item";
                    div.textContent = match;
                    div.setAttribute("role", "option");
                    div.addEventListener("click", () => {
                        input.value = match;
                        autocompleteBox.style.display = "none";
                        input.dispatchEvent(new Event("input"));
                    });
                    autocompleteBox.appendChild(div);
                });
                autocompleteBox.style.display = "block";
            }
        }

        const stemModal = document.getElementById("modal-stem");
        initTable(stemModal);
        const healthModal = document.getElementById("modal-health");
        if (healthModal) initTable(healthModal);
        const tradeModal = document.getElementById("modal-trade");
        if (tradeModal) initTable(tradeModal);
        const transportModal = document.getElementById("modal-transport");
        if (transportModal) initTable(transportModal);
        const physiciansModal = document.getElementById("modal-physicians");
        if (physiciansModal) initTable(physiciansModal);
        const managersModal = document.getElementById("modal-managers");
        if (managersModal) initTable(managersModal);
        const researchersModal = document.getElementById("modal-researchers");
        if (researchersModal) initTable(researchersModal);
        const militaryModal = document.getElementById("modal-military");
        if (militaryModal) initTable(militaryModal);
        const educationModal = document.getElementById("modal-education");
        if (educationModal) initTable(educationModal);
        const drawModal = document.getElementById("modal-draw");
        if (drawModal) initTable(drawModal);




        /*document.body.addEventListener("click", function (e) {
            const btn = e.target.closest("[data-modal-target]");
            if (btn) {
              e.preventDefault();
              const modal = document.getElementById(btn.getAttribute("data-modal-target"));
              if (modal) {
                modal.classList.add("show");
                document.body.classList.add("modal-open");
                initAgeCalculator();
              }
            }
            if (e.target.matches(".close-btn, [data-close]")) {
              const modal = e.target.closest(".modal");
              if (modal) {
                modal.classList.remove("show");
                document.body.classList.remove("modal-open");
                removeDayGrid();
              }
            }
          });*/

        function populateMonths(selectId) {
            const select = document.getElementById(selectId);
            select.innerHTML = '<option value="">MM</option>';
            for (let m = 1; m <= 12; m++) {
                const opt = document.createElement("option");
                opt.value = m;
                opt.textContent = m.toString().padStart(2, "0");
                select.appendChild(opt);
            }
        }

        function getDaysInMonth(year, month) {
            if (!year || !month) return 31; // default 31 if month/year not set
            return new Date(year, month, 0).getDate();
        }

        function removeDayGrid() {
            const existing = document.querySelector(".grid-dropdown");
            if (existing) existing.remove();
        }

        function showDayGrid(inputId, monthId, yearId) {
            removeDayGrid();

            const input = document.getElementById(inputId);
            const month = parseInt(document.getElementById(monthId).value);
            const year = parseInt(document.getElementById(yearId).value);
            const daysCount = getDaysInMonth(year, month);

            const grid = document.createElement("div");
            grid.className = "grid-dropdown";

            for (let i = 1; i <= daysCount; i++) {
                const cell = document.createElement("div");
                cell.textContent = i.toString().padStart(2, "0");
                cell.addEventListener("click", () => {
                    input.value = cell.textContent;
                    input.classList.remove("invalid");
                    removeDayGrid();
                });
                grid.appendChild(cell);
            }

            const rect = input.getBoundingClientRect();
            grid.style.top = `${rect.bottom + window.scrollY + 4}px`;
            grid.style.left = `${rect.left + window.scrollX}px`;

            document.body.appendChild(grid);
        }

        function validateDay(dayInputId, monthInputId, yearInputId) {
            const dayInput = document.getElementById(dayInputId);
            const month = parseInt(document.getElementById(monthInputId).value);
            const year = parseInt(document.getElementById(yearInputId).value);
            const day = parseInt(dayInput.value);

            if (!day) {
                dayInput.classList.remove("invalid");
                return;
            }

            const maxDay = getDaysInMonth(year, month);

            if (day > maxDay) {
                // Invalid day for given month/year
                dayInput.value = "";
                dayInput.classList.add("invalid");
            } else {
                dayInput.classList.remove("invalid");
            }
        }

        function initAgeCalculator() {
            populateMonths("dob-month");
            populateMonths("app-month");

            const today = new Date();
            const appMonthEl = document.getElementById("app-month");
            const appYearEl = document.getElementById("app-year");
            const appDayEl = document.getElementById("app-day");

            // Autofill app date to today
            appMonthEl.value = today.getMonth() + 1;
            appYearEl.value = today.getFullYear();
            appDayEl.value = today.getDate().toString().padStart(2, "0");
            appDayEl.classList.remove("invalid");

            // Show grid dropdown for day inputs
            ["dob-day", "app-day"].forEach((dayId) => {
                const monthId = dayId.includes("dob") ? "dob-month" : "app-month";
                const yearId = dayId.includes("dob") ? "dob-year" : "app-year";

                const dayInput = document.getElementById(dayId);

                dayInput.addEventListener("focus", () => {
                    showDayGrid(dayId, monthId, yearId);
                });

                dayInput.addEventListener("blur", () => {
                    // Delay check so that a click on dropdown doesn't instantly close it
                    setTimeout(() => {
                        const dropdown = document.querySelector(".grid-dropdown");
                        if (!dropdown || !dropdown.matches(":hover")) {
                            removeDayGrid();
                        }
                    }, 100);
                });

                // Validate day on manual input (change or blur)
                dayInput.addEventListener("input", () => {
                    validateDay(dayId, monthId, yearId);
                });

                // Validate day when month or year changes
                document.getElementById(monthId).addEventListener("change", () => {
                    validateDay(dayId, monthId, yearId);
                });
                document.getElementById(yearId).addEventListener("change", () => {
                    validateDay(dayId, monthId, yearId);
                });
            });

            // Age calculation
            document.getElementById("calculateAgeBtn").addEventListener("click", () => {
                const dm = +document.getElementById("dob-month").value;
                const dd = +document.getElementById("dob-day").value;
                const dy = +document.getElementById("dob-year").value;

                const am = +document.getElementById("app-month").value;
                const ad = +document.getElementById("app-day").value;
                const ay = +document.getElementById("app-year").value;

                const resultEl = document.getElementById("ageResult");

                // Basic validation
                if (!dm || !dd || !dy || !am || !ad || !ay) {
                    resultEl.textContent = "❗ Please fill all fields with valid data.";
                    return;
                }

                const dob = new Date(dy, dm - 1, dd);
                const appDate = new Date(ay, am - 1, ad);

                if (dob > appDate) {
                    resultEl.textContent = "❌ DOB cannot be after Application Date.";
                    return;
                }

                let age = ay - dy;
                if (am < dm || (am === dm && ad < dd)) age--;

                //document.getElementById("age-input").value = age;

                const ageInput = document.getElementById('age-input');
                if (ageInput) {
                    ageInput.value = age;

                    // Trigger 'input' event so age-select logic runs
                    ageInput.dispatchEvent(new Event('input'));
                }


                closeModal(document.getElementById("modal-age"))

                resultEl.textContent = `✅ Calculated Age: ${age} years`;
            });
        }

        // Close day grid if clicking outside
        document.addEventListener("click", (e) => {
            if (
                !e.target.closest(".grid-dropdown") &&
                !e.target.matches("input[id$='-day']")
            ) {
                removeDayGrid();
            }
        });


        function setupStepByStepNavigation(form) {
            if (!form) return;

            const allSections = Array.from(form.querySelectorAll('.section'));
            if (!allSections.length) return;

            // For oinp-form, only consider visible sections
            // For others, consider all sections regardless of visibility
            const visibleSections = (form.id === 'oinp-form')
                ? allSections.filter(sec => sec.style.display !== 'none')
                : allSections;

            if (!visibleSections.length) return;

            // Initially hide all except the first visible section
            visibleSections.forEach((sec, i) => {
                sec.classList.toggle('hidden', i !== 0);
            });

            // Hide all other sections (not in visibleSections) for oinp-form (optional safety)
            if (form.id === 'oinp-form') {
                allSections.forEach(sec => {
                    if (!visibleSections.includes(sec)) {
                        sec.classList.add('hidden');
                    }
                });
            }

            // Remove any existing nav-buttons to prevent duplicates
            form.querySelectorAll('.nav-buttons').forEach(el => el.remove());

            const eligibilityBtn = form.querySelector('.show-eligibility-btn');
            if (eligibilityBtn) eligibilityBtn.classList.add('hidden');

            visibleSections.forEach((sec, i) => {
                const navDiv = document.createElement('div');
                navDiv.className = 'nav-buttons';

                const isFirst = i === 0;
                const isLast = i === visibleSections.length - 1;

                if (!isFirst) {
                    const prevBtn = document.createElement('button');
                    prevBtn.type = 'button';
                    prevBtn.textContent = 'Previous';
                    prevBtn.className = 'prev-btn';
                    prevBtn.style.float = 'left';
                    prevBtn.addEventListener('click', () => {
                        showOnlySection(visibleSections, i - 1);
                        if (eligibilityBtn) eligibilityBtn.classList.add('hidden');
                    });
                    navDiv.appendChild(prevBtn);
                }

                if (!isLast) {
                    const nextBtn = document.createElement('button');
                    nextBtn.type = 'button';
                    nextBtn.textContent = 'Next';
                    nextBtn.className = 'next-btn';
                    nextBtn.style.float = isFirst ? 'left' : 'right';
                    nextBtn.addEventListener('click', () => {
                        if (form.id === 'oinp-form' && i === 0) {
                            const firstSelect = sec.querySelector('select');
                            if (firstSelect && (!firstSelect.value || firstSelect.value === "0")) {
                                alert("Please select a value before continuing.");
                                firstSelect.focus();
                                return;
                            }
                        }

                        showOnlySection(visibleSections, i + 1);

                        if (eligibilityBtn && i + 1 === visibleSections.length - 1) {
                            eligibilityBtn.classList.remove('hidden');
                        } else if (eligibilityBtn) {
                            eligibilityBtn.classList.add('hidden');
                        }
                    });
                    navDiv.appendChild(nextBtn);
                }

                sec.querySelector('.section-content').appendChild(navDiv);
            });
        }

        function showOnlySection(sections, indexToShow) {
            sections.forEach((sec, i) => {
                sec.classList.toggle('hidden', i !== indexToShow);
            });
        }




        function expandSection(section) {
            const content = section.querySelector('.section-content');
            section.classList.remove('collapsed');

            // Clear previous inline style
            content.style.maxHeight = 'none';

            // Force reflow before setting the height
            const scrollHeight = content.scrollHeight;
            content.style.maxHeight = scrollHeight + 'px';

            // Ensure padding/margin is restored if controlled via CSS
            content.style.padding = ''; // or set explicit value
            content.style.margin = '';
        }

        function collapseSection(section) {
            const content = section.querySelector('.section-content');
            content.style.maxHeight = '0px';
            section.classList.add('collapsed');

            // Optional: also clear padding/margin
            content.style.padding = '0';
            content.style.margin = '0';
        }


        let lastHiddenForm = null;
        let lastShownDivs = [];

        document.addEventListener('click', function (e) {
            // Handle Show Eligibility button
            if (e.target && e.target.matches('.show-eligibility-btn')) {
                const form = e.target.closest('form');
                const targets = e.target.dataset.show?.split(',').map(s => s.trim()) || [];

                if (!form || targets.length === 0) return;

                // Hide form
                form.classList.add('hidden');
                lastHiddenForm = form;

                // Show mapped result divs
                lastShownDivs = [];
                targets.forEach(selector => {
                    const el = document.querySelector(selector);
                    if (el) {
                        el.classList.remove('hidden');
                        lastShownDivs.push(el);
                    }
                });

                // Show recalculate button
                document.getElementById('recalculateBtn')?.classList.remove('hidden');
            }

            // Handle Recalculate
            if (e.target && e.target.matches('#recalculateBtn')) {
                // Show the form again
                if (lastHiddenForm) {
                    lastHiddenForm.classList.remove('hidden');
                    lastHiddenForm = null;
                }

                // Hide shown result divs
                lastShownDivs.forEach(div => div.classList.add('hidden'));
                lastShownDivs = [];

                // Hide button
                e.target.classList.add('hidden');
            }
        });




        const pnpSelector = document.getElementById('pnpSelector');
        const totalPointsBox = document.getElementById('totalPointsBox');
        const sinpSubStream = document.getElementById('sinp_subStream');
        const sinpEmploymentOfferWrapper = document.getElementById('sinp_employmentOfferWrapper');

        const forms = {
            ainp: {
                form: document.getElementById('ainp-form'),
                maxPoints: 100,
                calculate: calculateAINPPoints,
                panel: document.getElementById('ainp-panel'),
            },
            nlpnp: {
                form: document.getElementById('nlpnp-form'),
                maxPoints: 100,
                calculate: calculateNLPNPPoints,
                panel: document.getElementById('nlpnp-panel'),
            },
            bcpnp: {
                form: document.getElementById('bcpnp-form'),
                maxPoints: 200,
                calculate: calculateBCPNPPoints,
                panel: document.getElementById('bcpnp-panel'),
            },
            sinp: {
                form: document.getElementById('sinp-form'),
                maxPoints: 100,
                calculate: calculateSINPPoints,
                toggleExtra: toggleSINPEmploymentOfferVisibility,
                panel: document.getElementById('sinp-panel'),
            },
            mpnp: {
                form: document.getElementById('mpnp-form'),
                maxPoints: 1000,
                calculate: calculateMPNPPoints,
                panel: document.getElementById('mpnp-panel'),
            },
            crs: {
                form: document.getElementById('crs-form'),
                maxPoints: 1200,
                calculate: calculateCRSPoints,
                unhideDiv: document.getElementById("divEligibility"),
                panel: document.getElementById('crs-panel'),
            },
            oinp: {
                form: document.getElementById('oinp-form'),
                /*maxPoints: 1200,*/
                maxPoints: 130,
                calculate: calculateOINPoints,
                panel: document.getElementById('oinp-panel'),
            }

        };



        /*document.getElementById('calculateAgeBtn').addEventListener('click', function () {
          const dobYear = parseInt(document.getElementById('dob-year').value, 10);
          const dobMonth = parseInt(document.getElementById('dob-month').value, 10) - 1; // JS months are 0-indexed
          const dobDay = parseInt(document.getElementById('dob-day').value, 10);
        
          const appYear = parseInt(document.getElementById('app-year').value, 10);
          const appMonth = parseInt(document.getElementById('app-month').value, 10) - 1;
          const appDay = parseInt(document.getElementById('app-day').value, 10);
        
          const resultEl = document.getElementById('ageResult');
          const ageInput = document.getElementById('age-input'); // Where the result goes
        
          if (
            isNaN(dobYear) || isNaN(dobMonth) || isNaN(dobDay) ||
            isNaN(appYear) || isNaN(appMonth) || isNaN(appDay)
          ) {
            resultEl.textContent = 'Please enter all date fields.';
            return;
          }
        
          const dob = new Date(dobYear, dobMonth, dobDay);
          const appDate = new Date(appYear, appMonth, appDay);
        
          if (dob > appDate) {
            resultEl.textContent = '❌ DOB cannot be after application date.';
            return;
          }
        
          // Calculate age
          let age = appYear - dobYear;
          if (
            appMonth < dobMonth ||
            (appMonth === dobMonth && appDay < dobDay)
          ) {
            age--; // Birthday hasn't occurred yet this year
          }
        
          resultEl.textContent = `Calculated Age: ${age} years`;
        
          // Fill age into age input (and let your other script do matching)
          ageInput.value = age;
          ageInput.dispatchEvent(new Event('input')); // trigger auto-selection
        });*/






        const languageTestMappings = {
            IELTS: {
                reading: {
                    '9.0': 10, '8.5': 10, '8.0': 10,
                    '7.5': 9,
                    '7.0': 9,
                    '6.5': 8,
                    '6.0': 7,
                    '5.5': 6,
                    '5.0': 6,
                    '4.5': 5,
                    '4.0': 5,
                    '3.5': 4,
                    '3.0': 3,
                    '2.5': 2,
                    '2.0': 1,
                    '1.0': 0
                },
                writing: {
                    '9.0': 10, '8.5': 10, '8.0': 10, '7.5': 10,
                    '7.0': 9,
                    '6.5': 8,
                    '6.0': 7,
                    '5.5': 6,
                    '5.0': 5,
                    '4.0': 4,
                    '3.5': 3,
                    '3.0': 2,
                    '2.5': 1,
                    '1.0': 0
                },
                speaking: {
                    '9.0': 10, '8.5': 10, '8.0': 10, '7.5': 10,
                    '7.0': 9,
                    '6.5': 8,
                    '6.0': 7,
                    '5.5': 6,
                    '5.0': 5,
                    '4.0': 4,
                    '3.5': 3,
                    '3.0': 2,
                    '2.5': 1,
                    '1.0': 0
                },
                listening: {
                    '9.0': 10, '8.5': 10,
                    '8.0': 9,
                    '7.5': 8,
                    '7.0': 7, '6.5': 7, '6.0': 7,
                    '5.5': 6,
                    '5.0': 5,
                    '4.5': 4,
                    '4.0': 3,
                    '3.5': 2,
                    '3.0': 1,
                    '2.0': 0
                }
            },

            CELPIP: {
                reading: {
                    '12': 10, '11': 10, '10': 10,
                    '9': 9,
                    '8': 8,
                    '7': 7,
                    '6': 6,
                    '5': 5,
                    '4': 4,
                    '3': 3,
                    '2': 2,
                    '1': 1,
                    '0': 0
                },
                writing: {
                    '12': 10, '11': 10, '10': 10,
                    '9': 9,
                    '8': 8,
                    '7': 7,
                    '6': 6,
                    '5': 5,
                    '4': 4,
                    '3': 3,
                    '2': 2,
                    '1': 1,
                    '0': 0
                },
                speaking: {
                    '12': 10, '11': 10, '10': 10,
                    '9': 9,
                    '8': 8,
                    '7': 7,
                    '6': 6,
                    '5': 5,
                    '4': 4,
                    '3': 3,
                    '2': 2,
                    '1': 1,
                    '0': 0
                },
                listening: {
                    '12': 10, '11': 10, '10': 10,
                    '9': 9,
                    '8': 8,
                    '7': 7,
                    '6': 6,
                    '5': 5,
                    '4': 4,
                    '3': 3,
                    '2': 2,
                    '1': 1,
                    '0': 0
                }
            },

            PTECORE: {
                reading: [
                    [88, 90, 10],
                    [78, 87, 9],
                    [69, 77, 8],
                    [60, 68, 7],
                    [51, 59, 6],
                    [42, 50, 5],
                    [33, 41, 4],
                    [24, 32, 3]
                ],
                writing: [
                    [90, 90, 10],
                    [88, 89, 9],
                    [79, 87, 8],
                    [69, 78, 7],
                    [60, 68, 6],
                    [51, 59, 5],
                    [41, 50, 4],
                    [32, 40, 3]
                ],
                listening: [
                    [89, 90, 10],
                    [82, 88, 9],
                    [71, 81, 8],
                    [60, 70, 7],
                    [50, 59, 6],
                    [39, 49, 5],
                    [28, 38, 4],
                    [18, 27, 3]
                ],
                speaking: [
                    [89, 90, 10],
                    [84, 88, 9],
                    [76, 83, 8],
                    [68, 75, 7],
                    [59, 67, 6],
                    [51, 58, 5],
                    [42, 50, 4],
                    [0, 41, 3]
                ]
            },

            TEF: {
                reading: [
                    [263, 300, 10],
                    [248, 262, 9],
                    [233, 247, 8],
                    [207, 232, 7],
                    [181, 206, 6],
                    [151, 180, 5],
                    [121, 150, 4]
                ],
                listening: [
                    [316, 360, 10],
                    [298, 315, 9],
                    [280, 297, 8],
                    [249, 279, 7],
                    [217, 248, 6],
                    [181, 216, 5],
                    [145, 180, 4]
                ],
                writing: [
                    [393, 450, 10],
                    [371, 392, 9],
                    [349, 370, 8],
                    [310, 348, 7],
                    [271, 309, 6],
                    [226, 270, 5],
                    [181, 225, 4]
                ],
                speaking: [
                    [393, 450, 10],
                    [371, 392, 9],
                    [349, 370, 8],
                    [310, 348, 7],
                    [271, 309, 6],
                    [226, 270, 5],
                    [181, 225, 4]
                ]
            },

            TCF: {
                reading: [
                    [549, Infinity, 10],
                    [524, 548, 9],
                    [499, 523, 8],
                    [453, 498, 7],
                    [406, 452, 6],
                    [375, 405, 5],
                    [342, 374, 4]
                    // below 342 → CLB 0 or 1
                ],

                writing: [
                    [16, Infinity, 10],
                    [14, 15, 9],
                    [12, 13, 8],
                    [10, 11, 7],
                    [7, 9, 6],
                    [6, 6, 5],
                    [4, 5, 4]
                    // lower values → 0 or 1
                ],

                listening: [
                    [549, Infinity, 10],
                    [523, 548, 9],
                    [503, 522, 8],
                    [458, 502, 7],
                    [398, 457, 6],
                    [369, 397, 5],
                    [331, 368, 4]
                    // below 331 → 0 or 1
                ],

                speaking: [
                    [16, Infinity, 10],
                    [14, 15, 9],
                    [12, 13, 8],
                    [10, 11, 7],
                    [7, 9, 6],
                    [6, 6, 5],
                    [4, 5, 4]
                    // lower → 0 or 1
                ]
            }
        };

        const programUsesPerSkillHidden = {

            mpnp: true,
            crs_language1: true,
            crs_language2: true,
            crs_spouse_language: true
        };

        const programToHiddenSelectId = {
            ainp: "language",
            ainp_secondary: "ainp_secondary_hidden",
            nlpnp: "nl_language",
            bcpnp: "bc_languageProficiency",
            bcpnp_secondary: "bc_secondary_hidden",
            sinp: "sinp_language1",
            sinp_secondary: "sinp_language2",
            mpnp: "mpnp",
            mpnp_secondary: "mpnp_language2",
            crs_language1: "crs_language1",
            crs_language2: "crs_language2",
            crs_spouse_language: "crs_spouse_language",
            oinp: "official_language_ability",
            oinp_secondary: "oinp_secondary_languages"

        };

        const primaryToSecondaryMap = {
            ainp: "ainp_secondary",
            bcpnp: "bcpnp_secondary",
            mpnp: "mpnp_secondary",
            crs_language1: "crs_language2",
            oinp: "oinp_secondary",
            sinp: "sinp_secondary"
        };

        const secondaryToPrimaryMap = Object.fromEntries(
            Object.entries(primaryToSecondaryMap).map(([primary, secondary]) => [secondary, primary])
        );

        const englishTests = ["IELTS", "CELPIP", "PTECORE"];
        const frenchTests = ["TEF", "TCF"];
        const allTests = [...englishTests, ...frenchTests];

        // ✅ STEP 2: Populate allowed test types
        function populateLanguageOptions(select, allowedTests, preserveValue = true) {
            const currentValue = preserveValue ? select.value : '';

            select.innerHTML = '<option value="">-- Select --</option>';
            allowedTests.forEach(test => {
                const option = document.createElement("option");
                option.value = test;
                option.textContent = test;
                select.appendChild(option);
            });

            // Reselect the current value if it still exists
            if (preserveValue && allowedTests.includes(currentValue)) {
                select.value = currentValue;
            }
        }


        document.querySelectorAll(".test-type").forEach(select => {
            select.addEventListener("change", function () {
                const test = this.value;
                const program = this.dataset.target;

                const isPrimary = primaryToSecondaryMap.hasOwnProperty(program);
                const isSecondary = secondaryToPrimaryMap.hasOwnProperty(program);


                // 🔁 If this is a primary test type, filter its paired secondary
                if (isPrimary) {
                    const secondaryProgram = primaryToSecondaryMap[program];
                    const secondarySelect = document.querySelector(`.test-type[data-target="${secondaryProgram}"]`);
                    if (secondarySelect) {
                        //secondarySelect.selectedIndex = 0;
                        //secondarySelect.dispatchEvent(new Event("change", { bubbles: true }));

                        if (englishTests.includes(test)) {
                            populateLanguageOptions(secondarySelect, frenchTests);
                        } else if (frenchTests.includes(test)) {
                            populateLanguageOptions(secondarySelect, englishTests);
                        } else {
                            populateLanguageOptions(secondarySelect, allTests);
                        }

                        // Reset selection AFTER options are repopulated
                        secondarySelect.selectedIndex = 0;
                        secondarySelect.dispatchEvent(new Event("change", { bubbles: true }));
                    }
                }

                // 🔁 If this is a secondary test type, check its primary
                if (isSecondary) {
                    const primaryProgram = secondaryToPrimaryMap[program];
                    const primarySelect = document.querySelector(`.test-type[data-target="${primaryProgram}"]`);
                    const primaryTest = primarySelect?.value || '';

                    if (englishTests.includes(primaryTest)) {
                        populateLanguageOptions(this, frenchTests);
                    } else if (frenchTests.includes(primaryTest)) {
                        populateLanguageOptions(this, englishTests);
                    } else {
                        populateLanguageOptions(this, allTests);
                    }
                }


                const hiddenSelectId = programToHiddenSelectId[program];
                const hiddenSelect = document.getElementById(hiddenSelectId);
                if (hiddenSelect) {
                    hiddenSelect.selectedIndex = 0;
                    hiddenSelect.dispatchEvent(new Event('change', { bubbles: true }));
                } else {
                    // For each skill, reset its hidden select
                    ['reading', 'writing', 'listening', 'speaking'].forEach(skill => {
                        const hidId = `${program}_${skill}`;
                        const hid = document.getElementById(hidId);
                        if (hid) {
                            hid.selectedIndex = 0;
                            hid.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    });
                }


                // Reset related radio buttons if needed
                if (program === "ainp_secondary") {
                    const radioName = "bilingual"; // adjust if needed
                    const radios = document.querySelectorAll(`input[name="${radioName}"]`);

                    radios.forEach(radio => {
                        radio.checked = false;
                    });
                }

                if (program === "bcpnp_secondary") {
                    const radioName = "bc_bilingualBonus"; // adjust if needed
                    const radios = document.querySelectorAll(`input[name="${radioName}"]`);

                    radios.forEach(radio => {
                        radio.checked = false;
                    });
                }

                const skillInputs = document.querySelector(`.skills-input[data-target="${program}"]`);

                // ✅ Custom logic when test is not selected and it's OINP
                if (test === "" && (program === "oinp" || program === "oinp_secondary")) {
                    //const knowledgeSelect = document.getElementById("knowledge_official_languages");
                    //if (knowledgeSelect) {
                    //  knowledgeSelect.value = '0';
                    //  knowledgeSelect.dispatchEvent(new Event("change", { bubbles: true }));
                    //}
                    const primaryCLB = parseInt(document.getElementById('official_language_ability')?.value || 0);
                    const secondaryCLB = parseInt(document.getElementById('oinp_secondary_languages')?.value || 0);
                    const knowledgeSelect = document.getElementById('knowledge_official_languages');


                    if (knowledgeSelect) {
                        let valueToSet = '0'; // Default fallback

                        if ((primaryCLB > 0 && secondaryCLB === 0) || (secondaryCLB > 0 && primaryCLB === 0)) {
                            // Only one language known
                            valueToSet = '5';
                        } else if (
                            primaryCLB > 0 && secondaryCLB > 0 &&
                            primaryCLB >= 6 && secondaryCLB >= 6 &&
                            (primaryCLB >= 7 || secondaryCLB >= 7)
                        ) {
                            // Both languages known, both at least 6, at least one 7 or more
                            valueToSet = '10';
                        } else if (
                            primaryCLB > 0 && secondaryCLB > 0 &&
                            (primaryCLB < 6 || secondaryCLB < 6)
                        ) {
                            // Both languages known but at least one is below 6
                            valueToSet = '5';
                        } else {
                            // All other cases: no valid knowledge
                            valueToSet = '0';
                        }

                        knowledgeSelect.value = valueToSet;

                        // Trigger change event for any reactive listeners
                        //hiddenSelect.dispatchEvent(new Event('change', { bubbles: true }));
                        knowledgeSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }


                if (!test || !languageTestMappings[test]) {
                    // Reset all score dropdowns
                    if (skillInputs) {
                        skillInputs.querySelectorAll(".score").forEach(scoreSelect => {
                            scoreSelect.innerHTML = '';
                            const skill = scoreSelect.dataset.skill;
                            const skillName = skill.charAt(0).toUpperCase() + skill.slice(1);
                            const defaultOption = document.createElement("option");
                            defaultOption.value = '0';
                            defaultOption.textContent = `-- Select ${skillName} Score --`;
                            scoreSelect.appendChild(defaultOption);
                        });
                    }
                    return;
                }

                skillInputs.querySelectorAll(".score").forEach(scoreSelect => {
                    const skill = scoreSelect.dataset.skill;
                    const skillMap = languageTestMappings[test][skill];
                    let scores = [];

                    if (Array.isArray(skillMap)) {
                        // For TEF/TCF (range mapping)
                        scores = skillMap.map(range => {
                            return {
                                value: range[0], // only the min
                                label: `${range[0]} - ${range[1] === Infinity ? '+' : range[1]}`
                            };
                        });
                    } else {
                        // For IELTS/CELPIP (simple score-to-CLB mapping)
                        scores = Object.keys(skillMap)
                            .sort((a, b) => parseFloat(b) - parseFloat(a)) // <-- descending order
                            .map(score => ({
                                value: score,
                                label: score
                            }));
                    }

                    // Clear and add default
                    scoreSelect.innerHTML = '';
                    const skillName = skill.charAt(0).toUpperCase() + skill.slice(1);
                    const defaultOption = document.createElement("option");
                    defaultOption.value = '0';
                    defaultOption.textContent = `-- Select ${skillName} Score --`;
                    scoreSelect.appendChild(defaultOption);

                    // Add score options
                    scores.forEach(({ value, label }) => {
                        const option = document.createElement("option");
                        option.value = value;
                        option.textContent = label;
                        scoreSelect.appendChild(option);
                    });

                    // Bind CLB update
                    scoreSelect.addEventListener("change", () => updateCLB(program, test));
                });
            });
        });


        function updateCLB(program, test) {
            const skillInputs = document.querySelector(`.skills-input[data-target="${program}"]`);
            const scores = {};
            let valid = true;

            skillInputs.querySelectorAll(".score").forEach(select => {
                const skill = select.dataset.skill;
                const value = select.value;
                if (!value) valid = false;
                scores[skill] = value;
            });

            if (!valid) return;

            // Build CLBs per skill
            const clbs = {};
            Object.keys(scores).forEach(skill => {
                const score = scores[skill];
                const mapping = languageTestMappings[test][skill];

                if (Array.isArray(mapping)) {
                    const scoreNum = parseFloat(score.split(',')[0]);
                    clbs[skill] = 0;
                    for (const [min, max, clb] of mapping) {
                        if (scoreNum >= min && scoreNum <= max) {
                            clbs[skill] = clb;
                            break;
                        }
                    }
                } else {
                    clbs[skill] = mapping[score] || 0;
                }
            });

            // ✅ Handle programs with per-skill hidden selects
            if (programUsesPerSkillHidden[program]) {
                Object.entries(clbs).forEach(([skill, clb]) => {
                    const hiddenSelectId = `${program}_${skill}`;
                    const hiddenSelect = document.getElementById(hiddenSelectId);
                    if (hiddenSelect) {
                        let found = false;
                        for (const option of hiddenSelect.options) {
                            const clbNumber = parseInt(option.textContent.trim());
                            if (!isNaN(clbNumber) && clbNumber === clb) {
                                option.selected = true;
                                hiddenSelect.dispatchEvent(new Event('change', { bubbles: true }));
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            hiddenSelect.selectedIndex = 0;
                            hiddenSelect.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    }
                });

                return; // Stop here, don't run single-select logic below
            }

            // ✅ Programs using a single hidden select
            const lowestCLB = Math.min(...Object.values(clbs));

            const hiddenSelect = document.getElementById(programToHiddenSelectId[program]);
            if (hiddenSelect) {
                let found = false;
                for (const option of hiddenSelect.options) {
                    const clbText = option.textContent.trim();
                    const clbNumber = parseInt(clbText);
                    if (!isNaN(clbNumber) && clbNumber === lowestCLB) {
                        option.selected = true;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    hiddenSelect.selectedIndex = 0;
                }

                // Dispatch change to trigger any dependent logic
                hiddenSelect.dispatchEvent(new Event('change', { bubbles: true }));
            }

            // Handle bilingual radio logic
            const primaryCLB = parseInt(document.getElementById('language')?.value || 0);
            const secondaryCLB = parseInt(document.getElementById('ainp_secondary_hidden')?.value || 0);

            const primaryCLBBC = parseInt(document.getElementById('bc_languageProficiency')?.value || 0);
            const secondaryCLBBC = parseInt(document.getElementById('bc_secondary_hidden')?.value || 0);

            let isBilingual = false;

            if (program === 'ainp') {
                isBilingual = (lowestCLB >= 4) && (secondaryCLB >= 4);
            } else if (program === 'ainp_secondary') {
                isBilingual = (lowestCLB >= 4) && (primaryCLB >= 4);
            }

            if (program === 'bcpnp') {
                isBilingual = (lowestCLB >= 4) && (secondaryCLBBC >= 4);
            } else if (program === 'bcpnp_secondary') {
                isBilingual = (lowestCLB >= 4) && (primaryCLBBC >= 4);
            }

            // Update AINP bilingual radio buttons
            if (program === 'ainp' || program === 'ainp_secondary') {
                const bilingualRadios = document.querySelectorAll('input[name="bilingual"]');
                bilingualRadios.forEach(radio => {
                    const shouldCheck = (isBilingual && radio.value === '3') || (!isBilingual && radio.value === '0');
                    if (shouldCheck) {
                        radio.checked = true;
                        radio.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                });
            }

            // Update BCPNP bilingual radio buttons
            if (program === 'bcpnp' || program === 'bcpnp_secondary') {
                const bilingualRadios = document.querySelectorAll('input[name="bc_bilingualBonus"]');
                bilingualRadios.forEach(radio => {
                    const shouldCheck = (isBilingual && radio.value === '10') || (!isBilingual && radio.value === '0');
                    if (shouldCheck) {
                        radio.checked = true;
                        radio.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                });
            }

            // Also handle default bilingual logic for sinp if needed
            if (program === 'ainp_secondary') {
                const bilingualRadios = document.querySelectorAll('input[name="bilingual"]');
                bilingualRadios.forEach(radio => {
                    radio.checked = (lowestCLB >= 4) ? (radio.value === '3') : (radio.value === '0');
                    radio.dispatchEvent(new Event('change', { bubbles: true }));
                });
            }

            if (program === 'bcpnp_secondary') {
                const bilingualRadios = document.querySelectorAll('input[name="bc_bilingualBonus"]');
                bilingualRadios.forEach(radio => {
                    radio.checked = (lowestCLB >= 4) ? (radio.value === '10') : (radio.value === '0');
                    radio.dispatchEvent(new Event('change', { bubbles: true }));
                });
            }


            // Handle OINP knowledge of official languages logic
            if (program === 'oinp' || program === 'oinp_secondary') {
                const primaryCLB = parseInt(document.getElementById('official_language_ability')?.value || 0);
                const secondaryCLB = parseInt(document.getElementById('oinp_secondary_languages')?.value || 0);
                const knowledgeSelect = document.getElementById('knowledge_official_languages');


                if (knowledgeSelect) {
                    let valueToSet = '0'; // Default fallback

                    if ((primaryCLB > 0 && secondaryCLB === 0) || (secondaryCLB > 0 && primaryCLB === 0)) {
                        // Only one language known
                        valueToSet = '5';
                    } else if (
                        primaryCLB > 0 && secondaryCLB > 0 &&
                        primaryCLB >= 6 && secondaryCLB >= 6 &&
                        (primaryCLB >= 7 || secondaryCLB >= 7)
                    ) {
                        // Both languages known, both at least 6, at least one 7 or more
                        valueToSet = '10';
                    } else if (
                        primaryCLB > 0 && secondaryCLB > 0 &&
                        (primaryCLB < 6 || secondaryCLB < 6)
                    ) {
                        // Both languages known but at least one is below 6
                        valueToSet = '5';
                    } else {
                        // All other cases: no valid knowledge
                        valueToSet = '0';
                    }

                    knowledgeSelect.value = valueToSet;

                    // Trigger change event for any reactive listeners
                    hiddenSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    knowledgeSelect.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }


        }











        function updateTotalBox(total, maxPoints = "") {
            totalPointsBox.innerHTML = `<div> Your score is : &nbsp;</div> <span id="totalPoints">${total}</span>${maxPoints ? ' / ' + maxPoints : ''}`;

            totalPointsBox.classList.remove('animate');
            void totalPointsBox.offsetWidth;  // Trigger reflow to restart animation
            totalPointsBox.classList.add('animate');
        }


        function resetForm(form) {
            if (!form) return;
            form.querySelectorAll('input, select').forEach(input => {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = false;
                } else {
                    input.value = '';
                }
            });
        }

        function hideAllForms(callback) {
            const activeForms = document.querySelectorAll('.form-transition.showing');
            let count = activeForms.length;

            if (count === 0 && callback) {
                callback();
                return;
            }

            let called = false;
            const onComplete = () => {
                if (called) return;
                called = true;
                if (callback) callback();
            };

            activeForms.forEach(form => {
                form.classList.remove('showing');
                form.classList.add('form-transition');

                const onTransitionEnd = (e) => {
                    if (e.propertyName === 'opacity') {
                        form.classList.add('hidden');
                        form.removeEventListener('transitionend', onTransitionEnd);
                        count--;
                        if (count === 0) onComplete();
                    }
                };

                form.addEventListener('transitionend', onTransitionEnd);

                // Fallback if transitionend doesn't fire within 300ms
                setTimeout(() => {
                    if (form.classList.contains('hidden')) {
                        count--;
                    } else {
                        form.classList.add('hidden');
                        count--;
                    }
                    form.removeEventListener('transitionend', onTransitionEnd);
                    if (count === 0) onComplete();
                }, 350);
            });
        }


        function toggleForms() {
            document.getElementById('recalculateBtn')?.classList.add('hidden');

            const val = pnpSelector.value;

            hideAllForms(() => {
                const selected = forms[val];
                if (!selected || !selected.form) return;

                const form = selected.form;

                // Prepare form for fade-in
                form.classList.remove('hidden');
                form.classList.add('form-transition');

                // Force reflow to restart animation
                void form.offsetWidth;

                form.classList.add('showing');
                //setupStepByStepNavigation(form);

                resetForm(form);
                if (selected.toggleExtra) selected.toggleExtra();

                selected.calculate();
                updateTotalBox(0, selected.maxPoints);
                collapseAllSections();
                Object.values(forms).forEach(({ panel }) => {
                    if (panel instanceof HTMLElement) {
                        panel.classList.add('hidden');
                        panel.classList.remove('active');
                    }
                });

                if (selected.panel instanceof HTMLElement) {
                    selected.panel.classList.remove('hidden');
                    selected.panel.classList.add('active');
                }

                // Show or hide additional element if defined (e.g., divEligibility)
                if (selected.unhideDiv instanceof HTMLElement) {
                    selected.unhideDiv.classList.remove('hidden');
                    const fwsPanel = document.getElementById("fws-panel-aside");
                    if (fwsPanel) fwsPanel.classList.remove('hidden');
                } else {
                    if (selected.unhideDiv instanceof HTMLElement) {
                        selected.unhideDiv.classList.add('hidden');  // <-- This won't run since unhideDiv is falsy here, so remove this line
                    }
                    document.getElementById("divEligibility").classList.add('hidden');
                    const fwsPanel = document.getElementById("fws-panel-aside");
                    if (fwsPanel) fwsPanel.classList.add('hidden');
                }
            });
        }

        function getVal(id) {
            const el = document.getElementById(id);
            return el ? parseInt(el.value) || 0 : 0;
        }

        function checkedValue(id) {
            const cb = document.getElementById(id);
            return (cb && cb.checked) ? parseInt(cb.value) || 0 : 0;
        }

        function getRadioVal(name) {
            const el = document.querySelector(`input[name="${name}"]:checked`);
            return el ? parseInt(el.value) : 0;
        }

        function calculateAINPPoints() {
            const getRadioVal = name => {
                const el = document.querySelector(`input[name="${name}"]:checked`);
                return el ? parseInt(el.value) : 0;
            };


            console.log("Running point reset script...");

            ['edu_ainp', 'lng_ainp', 'wrk_ainp', 'job_ainp', 'ada_ainp', 'age_ainp'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = 0;
                else console.log(`Element with ID "${id}" not found.`);
            });

            document.getElementById('edu_ainp').textContent = 0;
            document.getElementById('lng_ainp').textContent = 0;
            document.getElementById('wrk_ainp').textContent = 0;
            document.getElementById('job_ainp').textContent = 0;
            document.getElementById('ada_ainp').textContent = 0;
            document.getElementById('age_ainp').textContent = 0;


            const total =
                getVal('education') +
                getVal('educationLocation') +
                getVal('language') +
                getRadioVal('bilingual') +
                getVal('workExperience') +
                getVal('canadaExperience') +
                getVal('age') +
                getRadioVal('family') +
                getVal('jobOffer') +
                getVal('prioritySector') +
                getVal('jobLocation') +
                getVal('regulated');


            document.getElementById('edu_ainp').textContent = getVal('education') + getVal('educationLocation');
            document.getElementById('lng_ainp').textContent = getVal('language') + getRadioVal('bilingual');
            document.getElementById('wrk_ainp').textContent = getVal('workExperience') + getVal('canadaExperience');
            document.getElementById('job_ainp').textContent = getVal('jobOffer') + getVal('prioritySector') + getVal('jobLocation') + getVal('regulated');
            document.getElementById('ada_ainp').textContent = getRadioVal('family');
            document.getElementById('age_ainp').textContent = getVal('age');


            document.getElementById('tot_ainp').textContent = total;

            updateTotalBox(total, 100);
        }

        function calculateNLPNPPoints() {
            let total = 0;

            ['edu_nlpnp', 'wrk_nlpnp', 'lng_nlpnp', 'age_nlpnp', 'ada_nlpnp'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = 0;
                else console.log(`Element with ID "${id}" not found.`);
            });


            const workExp = getVal('nl_workExp');
            const bonusWorkExp = getVal('nl_bonusWorkExp');
            const cappedWorkExp = Math.min(workExp + bonusWorkExp, 20);
            total += getVal('nl_education');
            document.getElementById('edu_nlpnp').textContent = getVal('nl_education');

            total += cappedWorkExp;
            document.getElementById('wrk_nlpnp').textContent = cappedWorkExp;

            total += getVal('nl_language');
            document.getElementById('lng_nlpnp').textContent = getVal('nl_language');

            total += getVal('nl_age');
            document.getElementById('age_nlpnp').textContent = getVal('nl_age');


            let adaTotal = 0;
            document.querySelectorAll('#connectionGroup input.connection:checked').forEach(checkbox => {
                total += parseInt(checkbox.value) || 0;
                adaTotal += parseInt(checkbox.value) || 0;
            });

            document.getElementById('ada_nlpnp').textContent = adaTotal;

            document.getElementById('tot_nlpnp').textContent = total;

            updateTotalBox(total, 100);
        }

        function calculateBCPNPPoints() {
            let total = 0;

            ['wrk_bcpnp', 'edu_bcpnp', 'lng_bcpnp', 'wag_bcpnp', 'are_bcpnp'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = 0;
                else console.log(`Element with ID "${id}" not found.`);
            });


            total += getVal('bc_workExperience');
            total += document.getElementById('bc_additionalCanadaExperience').checked ? 10 : 0;
            total += document.getElementById('bc_currentlyWorkingBC').checked ? 10 : 0;

            document.getElementById('wrk_bcpnp').textContent = getVal('bc_workExperience') + (document.getElementById('bc_additionalCanadaExperience').checked ? 10 : 0) + (document.getElementById('bc_currentlyWorkingBC').checked ? 10 : 0);


            total += getVal('bc_educationLevel');
            total += getVal('bc_educationLocationBonus');
            total += document.getElementById('bc_professionalDesignationBonus').checked ? 5 : 0;

            document.getElementById('edu_bcpnp').textContent = getVal('bc_educationLevel') + getVal('bc_educationLocationBonus') + (document.getElementById('bc_professionalDesignationBonus').checked ? 5 : 0);

            total += getVal('bc_languageProficiency');
            //total += document.getElementById('bc_bilingualBonus').checked ? 10 : 0;
            total += getRadioVal('bc_bilingualBonus');

            document.getElementById('lng_bcpnp').textContent = getVal('bc_languageProficiency') + getRadioVal('bc_bilingualBonus');

            total += getVal('bc_wage');

            document.getElementById('wag_bcpnp').textContent = getVal('bc_wage');

            total += getVal('bc_areaEmployment');

            const regionalExperience = document.getElementById('bc_regionalExperience').checked ? 10 : 0;
            const bcGraduate = document.getElementById('bc_bcGraduate').checked ? 10 : 0;
            const regionalBonusCapped = Math.min(regionalExperience + bcGraduate, 10);

            total += regionalBonusCapped;

            document.getElementById('are_bcpnp').textContent = regionalBonusCapped + getVal('bc_areaEmployment');

            document.getElementById('tot_bcpnp').textContent = total;

            updateTotalBox(total, 200);
        }

        function calculateSINPPoints() {
            let total = 0;


            ['edu_sinp', 'wrk_sinp', 'lng_sinp', 'age_sinp', 'ada_sinp'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = 0;
                else console.log(`Element with ID "${id}" not found.`);
            });



            const subStream = getVal('sinp_subStream');



            total += getVal('sinp_education');
            document.getElementById('edu_sinp').textContent = getVal('sinp_education');


            total += getVal('sinp_workExp_5years');
            total += getVal('sinp_workExp_6to10years');
            document.getElementById('wrk_sinp').textContent = getVal('sinp_workExp_5years') + getVal('sinp_workExp_6to10years');

            total += getVal('sinp_language1');
            document.getElementById('lng_sinp').textContent = getVal('sinp_language1');

            total += getVal('sinp_age');
            document.getElementById('age_sinp').textContent = getVal('sinp_age');


            let adaptabilityTotal = 0;

            if (subStream === 1) {
                adaptabilityTotal += checkedValue('sinp_employmentOffer');
            } else {
                adaptabilityTotal += checkedValue('sinp_closeRelative');
            }
            adaptabilityTotal += checkedValue('sinp_pastWorkSK');
            adaptabilityTotal += checkedValue('sinp_pastStudySK');

            if (adaptabilityTotal > 30) adaptabilityTotal = 30;
            total += adaptabilityTotal;

            document.getElementById('ada_sinp').textContent = adaptabilityTotal;

            /*let secondLangPoints = getVal('sinp_language2');
            if (secondLangPoints > 5) secondLangPoints = 5;
            if (total < 100) {
              const spaceLeft = 100 - total;
              total += Math.min(secondLangPoints, spaceLeft);      
            }*/
            if (total > 100) total = 100;

            document.getElementById('tot_sinp').textContent = total;

            updateTotalBox(total, 100);
        }

        function toggleSINPEmploymentOfferVisibility() {
            if (!sinpSubStream) return;
            sinpEmploymentOfferWrapper.style.display = sinpSubStream.value === '1' ? 'block' : 'none';
            calculateSINPPoints();
        }


        function appendEligibilityCard(titleText, id, onClick, fancyClass = '') {
            // Get the container
            const grid = document.querySelector('.eligibility-grid');

            // Create card element
            const card = document.createElement('div');
            //card.className = 'card';

            // Create h3 element and set text
            const h3 = document.createElement('h3');
            //h3.textContent = titleText;
            h3.innerHTML = `<span>${titleText}</span>`;
            if (id) {
                h3.id = id;
            }
            
            h3.style.cursor = 'pointer';
            h3.style.width = '99%';
            //h3.style.color = 'blue';
            //h3.style.textDecoration = 'underline';
            if (fancyClass) h3.className = fancyClass;


            // ✅ Set data-modal-target attribute
            h3.setAttribute('data-modal-target', 'modal-draw');


            // Attach click handler if provided
            if (typeof onClick === 'function') {
                h3.addEventListener('click', onClick);
            }


            // Append h3 to card, and card to grid
            card.appendChild(h3);
            grid.appendChild(card);
        }

        function calculateMPNPPoints() {
            let total = 0;


            ['lng_mpnp', 'age_mpnp', 'wrk_mpnp', 'edu_mpnp', 'ada_mpnp', 'rsk_mpnp'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = 0;
                else console.log(`Element with ID "${id}" not found.`);
            });


            total += getVal('mpnp_listening');
            total += getVal('mpnp_speaking');
            total += getVal('mpnp_reading');
            total += getVal('mpnp_writing');
            total += getVal('mpnp_language2');
            document.getElementById('lng_mpnp').textContent = total;

            total += getVal('mpnp_age');
            document.getElementById('age_mpnp').textContent = getVal('mpnp_age');

            total += getVal('mpnp_workExperience');
            total += checkedValue('mpnp_licensingBonus');
            document.getElementById('wrk_mpnp').textContent = getVal('mpnp_workExperience') + checkedValue('mpnp_licensingBonus');

            total += getVal('mpnp_education');
            document.getElementById('edu_mpnp').textContent = getVal('mpnp_education');

            let adaptability_score = 0;
            let regional_bonus = 0;

            const has_job_offer = document.getElementById('mpnp_demandMB').checked;
            const has_close_relative = document.getElementById('mpnp_relativeMB').checked;
            const has_past_mb_work = document.getElementById('mpnp_workMB').checked;
            const has_mb_study_2plus = document.getElementById('mpnp_studyMB2').checked;
            const has_mb_study_1year = document.getElementById('mpnp_studyMB1').checked;
            const has_close_friend_or_distant_relative = document.getElementById('mpnp_friendMB').checked;
            const is_settling_outside_winnipeg = document.getElementById('mpnp_regionalMB').checked;

            if (has_job_offer) adaptability_score = 500;
            else if (has_close_relative) adaptability_score = 200;
            else if (has_past_mb_work) adaptability_score = 100;
            else if (has_mb_study_2plus) adaptability_score = 100;
            else if (has_mb_study_1year) adaptability_score = 50;
            else if (has_close_friend_or_distant_relative) adaptability_score = 50;

            if (is_settling_outside_winnipeg && [50, 100, 200].includes(adaptability_score)) {
                regional_bonus = 50;
            }

            const total_adaptability_score = Math.min(adaptability_score + regional_bonus, 500);
            total += total_adaptability_score;
            document.getElementById('ada_mpnp').textContent = total_adaptability_score;


            // Risk assessment (negative points)
            total += checkedValue('mpnp_workOtherProv');
            total += checkedValue('mpnp_studyOtherProv');
            total += checkedValue('mpnp_relativeOtherProv');
            total += checkedValue('mpnp_previousAppElsewhere');
            document.getElementById('rsk_mpnp').textContent = checkedValue('mpnp_workOtherProv') + checkedValue('mpnp_studyOtherProv') + checkedValue('mpnp_relativeOtherProv') + checkedValue('mpnp_previousAppElsewhere');

            if (total < 0) total = 0;

            document.getElementById('tot_mpnp').textContent = total;

            updateTotalBox(total, 1000);
        }

        function calculateCRSPoints() {
            const form = document.getElementById('crs-form');
            if (!form) return;


            const grid = document.querySelector('.eligibility-grid');
            // Clear previous contents
            grid.innerHTML = '';

            const maritalStatus = form.querySelector('input[name="crs_maritalStatus"]:checked')?.value;
            const spouseCheckbox = form.querySelector('input[name="crs_maritalFactor"]');
            const isMarried = maritalStatus === 'with';
            //const isMarried = maritalStatus === 'with' && spouseCheckbox?.checked;

            document.getElementById('hum_crs').textContent = 0;
            document.getElementById('spo_crs').textContent = 0;
            document.getElementById('ski_crs').textContent = 0;
            document.getElementById('add_crs').textContent = 0;


            if (isMarried) {
                document.getElementById('hmn_crs').textContent = 460;
                document.getElementById('smn_crs').textContent = 40;
            }
            else {
                document.getElementById('hmn_crs').textContent = 500;
                document.getElementById('smn_crs').textContent = "NA";
            }

            // Selector to distinguish between 'with' and 'single' data attributes (mostly for options)
            const selector = isMarried ? '[data-with]' : '[data-single]';

            // Helper: get numeric value from input/select by ID (ignores selector for inputs)
            const getInputValue = (id) => {
                const el = form.querySelector(`#${id}`);
                if (!el) return 0;

                if (el.tagName === 'SELECT') {
                    const option = el.options[el.selectedIndex];
                    if (!option) return 0;

                    const attr = isMarried ? 'data-with' : 'data-single';
                    // First check for data-with / data-single
                    const dataValue = option.getAttribute(attr);
                    if (dataValue !== null) {
                        return parseInt(dataValue) || 0;
                    }

                    // Fallback to value if data-attributes not found
                    return parseInt(option.value) || 0;
                }

                // Checkboxes
                if (el.type === 'checkbox') {
                    return el.checked ? parseInt(el.value) || 0 : 0;
                }

                // Input (number, text, etc.)
                return parseInt(el.value) || 0;
            };


            const getInputValueFSW = (id) => {
                const el = form.querySelector(`#${id}`);
                if (!el) return 0;

                if (el.tagName === 'SELECT') {
                    const option = el.options[el.selectedIndex];
                    if (!option) return 0;

                    const attr = 'data-fsw';
                    // First check for data-with / data-single
                    const dataValue = option.getAttribute(attr);
                    if (dataValue !== null) {
                        return parseInt(dataValue) || 0;
                    }

                    // Fallback to value if data-attributes not found
                    return parseInt(option.value) || 0;
                }

                // Checkboxes
                if (el.type === 'checkbox') {
                    return el.checked ? parseInt(el.value) || 0 : 0;
                }

                // Input (number, text, etc.)
                return parseInt(el.value) || 0;
            };




            // Get first language CLB values from four individual selects (#crs_firstLang_1..4)
            const getFirstLanguageCLBs = () => {
                const clbs = [];
                for (let i = 1; i <= 4; i++) {
                    const el = form.querySelector(`#crs_firstLang_${i}`);
                    if (!el) {
                        clbs.push(0);
                        continue;
                    }
                    // Here CLB is numeric value, e.g. 9,7,5
                    clbs.push(parseInt(el.value) || 0);
                }
                return clbs;
            };




            const getFirstLanguageCLBLabels = (form) => {

                const clbLabels = [];
                const selects = form.querySelectorAll('.crs_language1');

                selects.forEach(select => {
                    const index = select.selectedIndex;
                    if (index === -1) {
                        clbLabels.push(0); // nothing selected
                        return;
                    }
                    const selectedOption = select.options[index];
                    const label = selectedOption.textContent.replace('CLB', '').trim();
                    clbLabels.push(parseInt(label) || 0);
                });


                return clbLabels;
            };



            const getSecondLanguageCLBLabels = (form) => {

                const clbLabels = [];
                const selects = form.querySelectorAll('.crs_language2');

                selects.forEach(select => {
                    const index = select.selectedIndex;
                    if (index === -1) {
                        clbLabels.push(0); // nothing selected
                        return;
                    }
                    const selectedOption = select.options[index];
                    const label = selectedOption.textContent.replace('CLB', '').trim();
                    clbLabels.push(parseInt(label) || 0);
                });


                return clbLabels;
            };



            let total = 0;

            // === Core Points ===
            total += getInputValue('crs_age');

            console.log(document.getElementById('hum_crs'));
            document.getElementById('hum_crs').textContent = (parseInt(document.getElementById('hum_crs').textContent) || 0) + getInputValue('crs_age');
            document.getElementById('tot_crs').textContent = total;

            total += getInputValue('crs_education');
            document.getElementById('hum_crs').textContent = (parseInt(document.getElementById('hum_crs').textContent) || 0) + getInputValue('crs_education');
            document.getElementById('tot_crs').textContent = total;

            // Since you have individual first language components, sum their points using data attributes
            const firstLangPoints = (() => {
                let sum = 0;
                const selects = form.querySelectorAll('.crs_language1');
                const attr = isMarried ? 'data-with' : 'data-single';

                selects.forEach(select => {
                    const option = select.options[select.selectedIndex];
                    if (!option) return;
                    const val = option.getAttribute(attr);
                    if (val !== null) {
                        sum += parseInt(val) || 0;
                    }
                });

                return sum;
            })();

            total += firstLangPoints;
            document.getElementById('hum_crs').textContent = (parseInt(document.getElementById('hum_crs').textContent) || 0) + firstLangPoints;
            document.getElementById('tot_crs').textContent = total;



            // === Second Official Language Points (Max 22 if married, 24 if single) ===
            const secondLangPoints = (() => {
                let sum = 0;
                const selects = form.querySelectorAll('.crs_language2');
                const attr = isMarried ? 'data-with' : 'data-single';

                selects.forEach(select => {
                    const option = select.options[select.selectedIndex];
                    if (!option) return;
                    const val = option.getAttribute(attr);
                    if (val !== null) {
                        sum += parseInt(val) || 0;
                    }
                });

                const maxPoints = isMarried ? 22 : 24;
                return sum > maxPoints ? maxPoints : sum;
            })();
            total += secondLangPoints;

            document.getElementById('hum_crs').textContent = (parseInt(document.getElementById('hum_crs').textContent) || 0) + secondLangPoints;
            document.getElementById('tot_crs').textContent = total;



            total += getInputValue('crs_canWork');

            document.getElementById('hum_crs').textContent = (parseInt(document.getElementById('hum_crs').textContent) || 0) + getInputValue('crs_canWork');
            document.getElementById('tot_crs').textContent = total;



            if (isMarried) {

                total += getInputValue('crs_spouse_education');

                document.getElementById('spo_crs').textContent = (parseInt(document.getElementById('spo_crs').textContent) || 0) + getInputValue('crs_spouse_education');
                document.getElementById('tot_crs').textContent = total;


                // === Spouse First Language Points ===
                const spouseLangPoints = (() => {
                    let sum = 0;
                    const selects = form.querySelectorAll('.crs_spouse_language');

                    selects.forEach(select => {
                        const val = parseInt(select.value) || 0;
                        sum += val;
                    });

                    // Spouse language points are capped at 20
                    return sum > 20 ? 20 : sum;
                })();
                total += spouseLangPoints;

                document.getElementById('spo_crs').textContent = (parseInt(document.getElementById('spo_crs').textContent) || 0) + spouseLangPoints;
                document.getElementById('tot_crs').textContent = total;



                total += getInputValue('crs_spouse_work');

                document.getElementById('spo_crs').textContent = (parseInt(document.getElementById('spo_crs').textContent) || 0) + getInputValue('crs_spouse_work');

                document.getElementById('tot_crs').textContent = total;

            }

            // === SKILL TRANSFERABILITY (Max 100 - only best 2 combinations) ===
            const comboScores = [];
            const eduLevel = getInputValue('crs_education');
            const canadianExp = getInputValue('crs_canWork');
            const foreignExp = getInputValue('crs_foreignExp');
            const hasCert = form.querySelector('#crs_certQualification')?.checked || false;
            //const clbs = getCLBValues('crs_firstLang');
            const clbs = getFirstLanguageCLBLabels(form);
            const allCLB9 = clbs.every(clb => clb >= 9);
            const allCLB7 = clbs.every(clb => clb >= 7);
            const allCLB5 = clbs.every(clb => clb >= 5);
            const allCLB4 = clbs.every(clb => clb <= 4);


            let combo1 = 0; // Education + Language
            let combo2 = 0; // Education + Canadian Work Exp
            let combo3 = 0; // Foreign Exp + Language
            let combo4 = 0; // Foreign Exp + Canadian Work
            let combo5 = 0; // Cert + Language



            // 1. Education + Language
            /*if (eduLevel > 30) {
              if (allCLB9) combo1  = 50 ;
              else if (allCLB7) combo1 = 25;
            }*/

            // Define eduThreshold based on marital status
            let eduThreshold = isMarried ? 119 : 128;

            // 1. Education + Language
            if (eduLevel >= eduThreshold) {
                // Two or more post-secondary credentials (1 at least 3+ years)
                if (allCLB9) {
                    combo1 = 50;
                } else if (allCLB7) {
                    combo1 = 25;
                }
            } else if (eduLevel > 30) {
                // Single post-secondary credential
                if (allCLB9) {
                    combo1 = 25;
                } else if (allCLB7) {
                    combo1 = 13;
                }
            }


            // 2. Education + Canadian Work Exp
            /*if (eduLevel > 30) {
              if (canadianExp >= 46) combo2 = 50;
              else if (canadianExp >= 35) combo2 = 25;
            }*/

            // 2. Education + Canadian Work Exp
            if (eduLevel >= eduThreshold) {
                // Two+ post-secondary credentials (1 at least 3+ years)
                if (canadianExp >= 46) {
                    combo2 = 50;
                } else if (canadianExp >= 35) {
                    combo2 = 25;
                }
            } else if (eduLevel > 30) {
                // Single post-secondary credential
                if (canadianExp >= 46) {
                    combo2 = 25;
                } else if (canadianExp >= 35) {
                    combo2 = 13;
                }
            }



            // 3. Foreign Exp + Language
            if (foreignExp == 2) {
                if (allCLB9) combo3 = 50;
                else if (allCLB7) combo3 = 25;
            } else if (foreignExp == 1) {
                if (allCLB9) combo3 = 25;
                else if (allCLB7) combo3 = 13;
            }


            // 4. Foreign Exp + Canadian Work
            /*if (foreignExp >= 2 && canadianExp >= 46) combo4 = 50;
            else if (foreignExp >= 1 && canadianExp >= 35) combo4 = 25;*/

            if (foreignExp >= 2) {
                // 3+ years foreign experience
                if (canadianExp >= 46) {
                    combo4 = 50;
                } else if (canadianExp >= 35) {
                    combo4 = 25;
                }
            } else if (foreignExp === 1) {
                // 1-2 years foreign experience
                if (canadianExp >= 46) {
                    combo4 = 25;
                } else if (canadianExp >= 35) {
                    combo4 = 13;
                }
            }




            // 5. Certificate of Qualification + Language
            if (hasCert) {
                if (allCLB7) combo5 = 50;
                else if (allCLB5) combo5 = 25;
            }



            // Cap sum of combo1 and combo2 at 50
            const group1 = Math.min(combo1 + combo2, 50);



            // Cap sum of combo3 and combo4 at 50
            const group2 = Math.min(combo3 + combo4, 50);


            // Only best two of group1, group2, combo5 count
            const groupScores = [group1, group2, combo5];
            groupScores.sort((a, b) => b - a);


            // Sum the top 2 scores
            const transferPoints = groupScores[0] + groupScores[1];


            total += transferPoints;

            document.getElementById('ski_crs').textContent = (parseInt(document.getElementById('ski_crs').textContent) || 0) + transferPoints;
            document.getElementById('tot_crs').textContent = total;



            const clbsFr = getSecondLanguageCLBLabels(form);
            const allFrCLB9 = clbsFr.every(clb => clb >= 9);
            const allFrCLB7 = clbsFr.every(clb => clb >= 7);
            const allFrCLB5 = clbsFr.every(clb => clb >= 5);


            if (allFrCLB7) {
                if (allCLB5) {
                    document.getElementById('add_crs').textContent = parseInt(document.getElementById('add_crs').textContent, 10) + 50;
                    total += 50;
                }
                else if (allCLB4) {
                    document.getElementById('add_crs').textContent = parseInt(document.getElementById('add_crs').textContent, 10) + 25;

                    total += 25;
                }
            }
            document.getElementById('tot_crs').textContent = total;



            // Get education points from dropdown
            const eduPoints = parseInt(document.getElementById('crs_can_edu').value) || 0;

            // === ADDITIONAL POINTS (Max 600) ===
            let additionalPoints = eduPoints;

            form.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
                additionalPoints += parseInt(cb.value) || 0;
            });

            total += Math.min(additionalPoints, 600);

            document.getElementById('add_crs').textContent = Math.min((parseInt(document.getElementById('add_crs').textContent) || 0) + additionalPoints, 600);
            document.getElementById('tot_crs').textContent = total;




            /*if (document.getElementById('crs_certQualification').checked) {
            console.log("Inside :: " );
            console.log("total before :: " + total );
                
            if(allCLB7){ total += 50; }
            else if(allCLB5) {total += 25; }
            
            }
            console.log("outside total after :: " + total );
            */





            // === FINAL CAP ===
            if (total > 1200) total = 1200;


            //const fwsPoint = calculateFWSPoints();


            let totalFSW = 0;

            document.getElementById('edu_fsw').textContent = 0;
            document.getElementById('lng_fsw').textContent = 0;
            document.getElementById('wrk_fsw').textContent = 0;
            document.getElementById('age_fsw').textContent = 0;
            document.getElementById('emp_fsw').textContent = 0;
            document.getElementById('ada_fsw').textContent = 0;


            // === FSW Points ===
            totalFSW += getInputValueFSW('crs_education');





            document.getElementById('edu_fsw').textContent = (parseInt(document.getElementById('edu_fsw').textContent) || 0) + getInputValueFSW('crs_education');
            document.getElementById('tot_fsw').textContent = totalFSW;

            console.log("1 :: " + totalFSW);





            // Since you have individual first language components, sum their points using data attributes
            const firstLangPointsFSW = (() => {
                let sum = 0;
                const selects = form.querySelectorAll('.crs_language1');
                const attr = 'data-fsw';

                selects.forEach(select => {
                    const option = select.options[select.selectedIndex];
                    if (!option) return;
                    const val = option.getAttribute(attr);
                    if (val !== null) {
                        sum += parseInt(val) || 0;
                    }
                });

                return sum;
            })();

            totalFSW += firstLangPointsFSW;

            document.getElementById('lng_fsw').textContent = (parseInt(document.getElementById('lng_fsw').textContent) || 0) + firstLangPointsFSW;
            document.getElementById('tot_fsw').textContent = totalFSW;

            console.log("2 :: " + totalFSW);




            // Since you have individual second language components, sum their points using data attributes
            const secondLangPointsFSW = (() => {
                let sum = 0;
                const selects = form.querySelectorAll('.crs_language2');
                const attr = 'data-fsw';

                selects.forEach(select => {
                    const option = select.options[select.selectedIndex];
                    if (!option) return;
                    const val = option.getAttribute(attr);
                    if (val !== null) {
                        sum += parseInt(val) || 0;
                    }
                });

                return sum;
            })();

            totalFSW += secondLangPointsFSW;

            document.getElementById('lng_fsw').textContent = (parseInt(document.getElementById('lng_fsw').textContent) || 0) + secondLangPointsFSW;
            document.getElementById('tot_fsw').textContent = totalFSW;


            console.log("3 :: " + totalFSW);


            let workTotalYears = 0;


            workTotalYears += returnIntFromDropdown("crs_canWork");

            workTotalYears += returnIntFromDropdown("crs_foreignExp");

            if (workTotalYears === 1) {
                totalFSW += 9;
                document.getElementById('wrk_fsw').textContent = (parseInt(document.getElementById('wrk_fsw').textContent) || 0) + 9;
                document.getElementById('tot_fsw').textContent = totalFSW;

                console.log("4.1 :: " + totalFSW);


            } else if (workTotalYears === 2 || workTotalYears === 3) {
                totalFSW += 11;
                document.getElementById('wrk_fsw').textContent = (parseInt(document.getElementById('wrk_fsw').textContent) || 0) + 11;
                document.getElementById('tot_fsw').textContent = totalFSW;

                console.log("4.2 :: " + totalFSW);



            } else if (workTotalYears === 4 || workTotalYears === 5) {
                totalFSW += 13;

                document.getElementById('wrk_fsw').textContent = (parseInt(document.getElementById('wrk_fsw').textContent) || 0) + 13;
                document.getElementById('tot_fsw').textContent = totalFSW;

                console.log("4.3 :: " + totalFSW);


            } else if (workTotalYears >= 6) {
                totalFSW += 15;

                document.getElementById('wrk_fsw').textContent = (parseInt(document.getElementById('wrk_fsw').textContent) || 0) + 15;
                document.getElementById('tot_fsw').textContent = totalFSW;

                console.log("4.4 :: " + totalFSW);


            }


            totalFSW += getInputValueFSW('crs_age');

            document.getElementById('age_fsw').textContent = (parseInt(document.getElementById('age_fsw').textContent) || 0) + getInputValueFSW('crs_age');
            document.getElementById('tot_fsw').textContent = totalFSW;

            console.log("5 :: " + totalFSW);



            if (isSelectedAtOrAbove("crs_canWork", 1)) {
                totalFSW += 10;

                document.getElementById('emp_fsw').textContent = (parseInt(document.getElementById('emp_fsw').textContent) || 0) + 10;
                document.getElementById('tot_fsw').textContent = totalFSW;

                console.log("6 :: " + totalFSW);


            }


            let additionalPointFSW = 0;

            if (isMarried) {

                //Spouse studied in Canada (2+ years)   5
                if (getInputValue('crs_spouse_education') >= 7) {
                    additionalPointFSW += 5;
                }


                //Spouse has CLB 4+ in all language abilities   5
                const selects = document.querySelectorAll('.crs_spouse_language');
                let allValid = true;

                for (const select of selects) {
                    const index = select.selectedIndex;
                    if (index === -1) {
                        allValid = false;
                        break;
                    }
                    const selectedOption = select.options[index];
                    const label = selectedOption.textContent.replace('CLB', '').trim();
                    const clbValue = parseInt(label);
                    if (isNaN(clbValue) || clbValue < 4) {
                        allValid = false;
                        break;
                    }
                }

                if (allValid) {
                    additionalPointFSW += 5;
                }


                //Spouse worked in Canada (1+ year) 5
                if (getInputValue('crs_spouse_work') >= 5) {
                    additionalPointFSW += 5;
                }

            }

            //You studied in Canada (2+ years)  5
            if (isSelectedAtOrAbove("crs_can_edu", 3)) { additionalPointFSW += 5; }

            //You worked in Canada (1+ year)    10
            if (isSelectedAtOrAbove("crs_canWork", 3)) { additionalPointFSW += 10; }


            //Arranged employment in Canada 5
            const dropdownWork = document.getElementById("crs_canWork");
            // Make sure dropdown exists and something is selected
            if (dropdownWork && dropdownWork.selectedIndex >= 0) {
                // Check if "Valid Job Offer" is selected (index 1)
                if (dropdownWork.selectedIndex === 1) {
                    additionalPointFSW += 5;
                }
            }


            //You or spouse have a relative in Canada (18+, PR/citizen, close relative) 5
            const siblingCheckbox = document.getElementById("crs_sibling");
            if (siblingCheckbox && siblingCheckbox.checked) {
                additionalPointFSW += 5;
            }

            totalFSW += Math.min(additionalPointFSW, 10);

            document.getElementById('ada_fsw').textContent = (parseInt(document.getElementById('ada_fsw').textContent) || 0) + additionalPointFSW;
            document.getElementById('tot_fsw').textContent = totalFSW;

            console.log("7 :: " + totalFSW);

            if (totalFSW > 66 && (isSelectedAtOrAbove("crs_canWork", 3) || isSelectedAtOrAbove("crs_foreignExp", 2))) {
                document.getElementById('tot_fsw').style.color = "green";


                if (isChecked("crs_nomination")) {
                    appendEligibilityCard("Program-specific (PNP)", "PNP", () => {
                        readAndRender("CRS", (row) => {
                            const col5 = row[4] ? row[4].toString() : "";
                            return col5.includes("PNP");
                        }, "modal-draw").then(() => {
                            const modal = document.getElementById("modal-draw");
                            initTable(modal); // ✅ call AFTER content is rendered
                        });
                    },
                        "fancy-button pink-orange fancy-button clickable"
                    );

                }

                if (isSelectedAtOrAbove("crs_canWork", 3)) {
                    appendEligibilityCard("Program-specific (CEC)", "CEC", () => {
                        readAndRender("CRS", (row) => {
                            const col5 = row[4] ? row[4].toString() : "";
                            return col5.includes("CEC");
                        }, "modal-draw").then(() => {
                            const modal = document.getElementById("modal-draw");
                            initTable(modal); // ✅ call AFTER content is rendered
                        });
                    },
                        "fancy-button green-blue clickable"
                    );
                }

                if (isChecked("experience_transport")) {
                    appendEligibilityCard("Category‑based (Transport)", "Transport", () => {
                        readAndRender("CRS", (row) => {
                            const col5 = row[4] ? row[4].toString() : "";
                            return col5.includes("Transport");
                        }, "modal-draw").then(() => {
                            const modal = document.getElementById("modal-draw");
                            initTable(modal); // ✅ call AFTER content is rendered
                        });
                    },
                        "fancy-button teal-lime clickable"
                    );
                }

                if (isChecked("experience_physicians")) {
                    appendEligibilityCard("Category‑based (Physicians)", "Physicians", () => {
                        readAndRender("CRS", (row) => {
                            const col5 = row[4] ? row[4].toString() : "";
                            return col5.includes("Physicians");
                        }, "modal-draw").then(() => {
                            const modal = document.getElementById("modal-draw");
                            initTable(modal); // ✅ call AFTER content is rendered
                        });
                    },
                        "fancy-button teal-lime clickable"
                    );
                }

                if (isChecked("experience_managers")) {
                    appendEligibilityCard("Category‑based (Managers)", "Managers", () => {
                        readAndRender("CRS", (row) => {
                            const col5 = row[4] ? row[4].toString() : "";
                            return col5.toLowerCase().includes("managers");
                        }, "modal-draw").then(() => {
                            const modal = document.getElementById("modal-draw");
                            initTable(modal); // ✅ call AFTER content is rendered
                        });
                    },
                        "fancy-button teal-lime clickable"
                    );
                }

                if (isChecked("experience_researchers")) {
                    appendEligibilityCard("Category‑based (Researchers)", "Researchers", () => {
                        readAndRender("CRS", (row) => {
                            const col5 = row[4] ? row[4].toString() : "";
                            return col5.includes("Researchers");
                        }, "modal-draw").then(() => {
                            const modal = document.getElementById("modal-draw");
                            initTable(modal); // ✅ call AFTER content is rendered
                        });
                    },
                        "fancy-button teal-lime clickable"
                    );
                }

                if (isChecked("experience_military")) {
                    appendEligibilityCard("Category‑based (Military)", "Military", () => {
                        readAndRender("CRS", (row) => {
                            const col5 = row[4] ? row[4].toString() : "";
                            return col5.includes("Military");
                        }, "modal-draw").then(() => {
                            const modal = document.getElementById("modal-draw");
                            initTable(modal); // ✅ call AFTER content is rendered
                        });
                    },
                        "fancy-button teal-lime clickable"
                    );
                }

                if (isChecked("experience_stem")) {
                    appendEligibilityCard("Category‑based (STEM)", "STEM", () => {
                        readAndRender("CRS", (row) => {
                            const col5 = row[4] ? row[4].toString() : "";
                            return col5.includes("STEM");
                        }, "modal-draw").then(() => {
                            const modal = document.getElementById("modal-draw");
                            initTable(modal); // ✅ call AFTER content is rendered
                        });
                    },
                        "fancy-button purple-indigo clickable"
                    );
                }

                if (allFrCLB7 === true) {
                    appendEligibilityCard("Category‑based (French)", "French", () => {
                        readAndRender("CRS", (row) => {
                            const col5 = row[4] ? row[4].toString() : "";
                            return col5.includes("French");
                        }, "modal-draw").then(() => {
                            const modal = document.getElementById("modal-draw");
                            initTable(modal); // ✅ call AFTER content is rendered
                        });
                    },
                        "fancy-button coral-peach clickable"
                    );
                }

                if (isChecked("experience_education")) {
                    appendEligibilityCard("Category‑based (Education)", "Education", () => {
                        readAndRender("CRS", (row) => {
                            const col5 = row[4] ? row[4].toString() : "";
                            return col5.includes("Edu");
                        }, "modal-draw").then(() => {
                            const modal = document.getElementById("modal-draw");
                            initTable(modal); // ✅ call AFTER content is rendered
                        });
                    },
                        "fancy-button mint-aqua clickable"
                    );
                }

                if (isChecked("experience_healthcare")) {
                    appendEligibilityCard("Category‑based (Health / social services)", "Health", () => {
                        readAndRender("CRS", (row) => {
                            const col5 = row[4] ? row[4].toString() : "";
                            return col5.includes("Health");
                        }, "modal-draw").then(() => {
                            const modal = document.getElementById("modal-draw");
                            initTable(modal); // ✅ call AFTER content is rendered
                        });
                    },
                        "fancy-button rose-sky clickable"

                    );
                }

                if (isChecked("experience_trades")) {
                    appendEligibilityCard("Category‑based (Trade / skilled trades)", "Trade", () => {
                        readAndRender("CRS", (row) => {
                            const col5 = row[4] ? row[4].toString() : "";
                            return col5.includes("Trade");
                        }, "modal-draw").then(() => {
                            const modal = document.getElementById("modal-draw");
                            initTable(modal); // ✅ call AFTER content is rendered
                        });
                    },
                        "fancy-button sunset-haze clickable"
                    );
                }
            }
            else {
                document.getElementById('tot_fsw').style.color = "red";
            }



            console.log("totalFSW :: " + totalFSW);


            updateTotalBox(total, 1200);
        }


        function isChecked(id) {
            const el = document.getElementById(id);
            return el && el.checked;
        }

        function isSelectedAtOrAbove(dropdownId, minIndex) {
            const dropdown = document.getElementById(dropdownId);

            // If dropdown not found or nothing selected, return false
            if (!dropdown || dropdown.selectedIndex < 0) {
                return false;
            }

            // Check if selected index is >= minIndex
            return dropdown.selectedIndex >= minIndex;
        }

        function returnIntFromDropdown(dropdownId) {
            let total = 0;
            const dropdown = document.getElementById(dropdownId);
            if (!dropdown || dropdown.selectedIndex < 1) {
                console.log("No valid selection made.");
                return total;
            }

            const selectedOption = dropdown.options[dropdown.selectedIndex];
            const selectedText = selectedOption.text;
            const cleanedText = selectedText.replace(/\+/g, '').replace(/\s+/g, ' ').trim();
            const match = cleanedText.match(/^(\d+)/);

            if (match) {
                const returnValue = parseInt(match[1], 10);
                total += returnValue;
                console.log("Total:", total);
            } else {
                console.log("No numeric value to add.");
            }

            return total;
        }
        


/* ============================================================
   OINP WORKFORCE PRIORITY STREAM CALCULATOR
   This function is isolated to the OINP calculator.
   ============================================================ */

function calculateOINPoints() {

    const form = document.getElementById('oinp-form');

    if (!form) return;


    /* =========================================================
       HELPERS
       ========================================================= */

    const getValue = id => {

        const el = document.getElementById(id);

        if (!el || el.value === '') {
            return 0;
        }

        return Number(el.value) || 0;
    };


    const setPreview = (id, points) => {

        const el = document.getElementById(id);

        if (el) {
            el.textContent = `${points} points`;
        }
    };


    const setText = (id, value) => {

        const el = document.getElementById(id);

        if (el) {
            el.textContent = value;
        }
    };


    /* =========================================================
       APPLICANT TYPE
       ========================================================= */

    const applicantType =
        document.getElementById('applicantType')?.value || 'job';

    const isPhysician =
        applicantType === 'physician';


    /* =========================================================
       NOC / TEER
       ========================================================= */

    const teer =
        document.getElementById('teer')?.value || '';

    let teerPoints = 0;

    switch (teer) {

        case '0-1':
            teerPoints = 9;
            break;

        case '2-3':
            teerPoints = 6;
            break;

        case '4-5':
            teerPoints = 0;
            break;
    }


    /* =========================================================
       BROAD OCCUPATIONAL CATEGORY
       ========================================================= */

    const broadCategory =
        document.getElementById('broadCategory')?.value || '';

    let broadPoints = 0;

    switch (broadCategory) {

        case '3':
            broadPoints = 10;
            break;

        case '7':
            broadPoints = 8;
            break;

        case '2':
            broadPoints = 6;
            break;

        case '0-1-4-8-9':
            broadPoints = 4;
            break;

        case '5-6':
            broadPoints = 2;
            break;
    }


    setPreview('teerPoints', teerPoints);
    setPreview('broadPoints', broadPoints);


    /* =========================================================
       HOURLY WAGE
       ========================================================= */

    let wagePoints = 0;

    const wage = parseFloat(
        document.getElementById('hourlyWage')?.value
    );

    if (!isNaN(wage)) {

        if (wage >= 40) {
            wagePoints = 15;
        }
        else if (wage >= 35) {
            wagePoints = 12;
        }
        else if (wage >= 30) {
            wagePoints = 10;
        }
        else if (wage >= 25) {
            wagePoints = 8;
        }
        else if (wage >= 20) {
            wagePoints = 5;
        }
    }


    /* =========================================================
       EXPERIENCE
       ========================================================= */

    let experiencePoints = 0;


    if (isPhysician) {

        const physicianExperience =
            document.getElementById(
                'physicianExperience'
            )?.value || '';

        switch (physicianExperience) {

            case '24plus':
                experiencePoints = 18;
                break;

            case '13-24':
                experiencePoints = 15;
                break;

            case '6-12':
                experiencePoints = 12;
                break;

            case 'under6':
                experiencePoints = 0;
                break;
        }

        setPreview(
            'physicianExperiencePoints',
            experiencePoints
        );

    }
    else {

        const jobExperience =
            document.getElementById(
                'jobExperience'
            )?.value || '';


        /*
         * Less than six months in the job-offer position
         * uses general Ontario work experience.
         */

        if (jobExperience === 'under6') {

            const ontarioExperience =
                document.getElementById(
                    'ontarioExperience'
                )?.value || '';

            switch (ontarioExperience) {

                case '24plus':
                    experiencePoints = 12;
                    break;

                case '13-24':
                    experiencePoints = 9;
                    break;

                case '6-12':
                    experiencePoints = 6;
                    break;

                case 'under6':
                    experiencePoints = 0;
                    break;
            }

            setPreview(
                'ontarioExperiencePoints',
                experiencePoints
            );

        }
        else {

            switch (jobExperience) {

                case '24plus':
                    experiencePoints = 18;
                    break;

                case '13-24':
                    experiencePoints = 15;
                    break;

                case '6-12':
                    experiencePoints = 12;
                    break;

                case 'under6':
                    experiencePoints = 0;
                    break;
            }

            setPreview(
                'jobExperiencePoints',
                experiencePoints
            );
        }
    }


    /* =========================================================
       CANADIAN EARNINGS
       ========================================================= */

    const earnings =
        document.getElementById('earnings')?.value || '';

    let earningsPoints = 0;

    switch (earnings) {

        case '70k':
            earningsPoints = 8;
            break;

        case '50k':
            earningsPoints = 6;
            break;

        case '30k':
            earningsPoints = 4;
            break;

        case 'under30':
            earningsPoints = 0;
            break;
    }


    /* =========================================================
       LEGAL STATUS
       ========================================================= */

    let legalStatusPoints = 0;

    //if (!isPhysician) {

        const legalStatus =
            document.getElementById(
                'legalStatus'
            )?.value || '';

        switch (legalStatus) {

            case 'work':
                legalStatusPoints = 10;
                break;

            case 'study':
                legalStatusPoints = 5;
                break;

            case 'none':
                legalStatusPoints = 0;
                break;
        }
    //}


    /* =========================================================
       EMPLOYMENT TOTAL
       ========================================================= */

    let employmentTotalPoints = 0;

    if (isPhysician) {

        employmentTotalPoints =
            teerPoints +
            broadPoints +
            experiencePoints +
            earningsPoints+
            legalStatusPoints;

    }
    else {

        employmentTotalPoints =
            teerPoints +
            broadPoints +
            wagePoints +
            experiencePoints +
            earningsPoints +
            legalStatusPoints;
    }


    /* =========================================================
       EDUCATION
       ========================================================= */

    const educationPoints =
        getValue('oinp-education');

    const canadianCredentialsPoints =
        getValue('canadianCredentials');

    const educationTotalPoints =
        educationPoints +
        canadianCredentialsPoints;


    /*
     * IMPORTANT:
     *
     * Highest Level of Education is read directly from
     * #education.
     *
     * Example values from your new HTML:
     *
     * Doctorate = 10
     * Master's = 8
     * Bachelor's = 6
     * College/Trades = 5
     * Less than college = 0
     */

    setPreview(
        'educationPoints',
        educationPoints
    );

    setPreview(
        'credentialPoints',
        canadianCredentialsPoints
    );


    /* =========================================================
       LANGUAGE
       ========================================================= */

    const clbPoints =
        getValue('clb');

    const officialLanguagePoints =
        getValue('languages');

    const languageTotalPoints =
        clbPoints +
        officialLanguagePoints;


    /* =========================================================
       REGIONALIZATION
       ========================================================= */

    const regionalPoints =
        getValue('region');

    setPreview(
        'regionPoints',
        regionalPoints
    );


    /* =========================================================
       TOTAL
       ========================================================= */

    let total =
        employmentTotalPoints +
        educationTotalPoints +
        languageTotalPoints +
        regionalPoints;


    /*
     * Maximum:
     *
     * Job Offer Applicant = 130
     * Physician = 115
     */

    const maxPoints =
        isPhysician ? 115 : 130;


    if (total > maxPoints) {
        total = maxPoints;
    }


    /* =========================================================
       EXISTING OINP FACTOR PANEL
       ========================================================= */

    setText(
        'wrk_oinp',
        employmentTotalPoints
    );

    setText(
        'edu_oinp',
        educationTotalPoints
    );

    setText(
        'lng_oinp',
        languageTotalPoints
    );

    /*
     * NEW:
     * Regionalization now appears in the existing
     * OINP Factors table.
     */

    setText(
        'regional_oinp',
        regionalPoints
    );

    setText(
        'tot_oinp',
        total
    );


    /* =========================================================
       EXISTING TOP SCORE BOX
       ========================================================= */

    updateTotalBox(
        total,
        maxPoints
    );


    /* =========================================================
       PREVIEW FIELDS
       ========================================================= */

    setPreview(
        'wagePoints',
        wagePoints
    );

    setPreview(
        'earningsPoints',
        earningsPoints
    );

    setPreview(
        'legalStatusPoints',
        legalStatusPoints
    );

    setPreview(
        'clbPoints',
        clbPoints
    );

    setPreview(
        'languagePoints',
        officialLanguagePoints
    );
}


/* ============================================================
   OINP WORKFORCE PRIORITY - EVENT HANDLERS
   Isolated from all other calculators.
   ============================================================ */

(function initOINPWorkforceCalculator() {

    function init() {

        const form = document.getElementById('oinp-form');

        if (!form) return;


        const applicantType =
            document.getElementById('applicantType');

        const nocCode =
            document.getElementById('nocCode');

        const jobExperience =
            document.getElementById('jobExperience');

        const wageQuestion =
            document.getElementById('wageQuestion');

        const jobExperienceQuestion =
            document.getElementById('jobExperienceQuestion');

        const ontarioExperienceQuestion =
            document.getElementById('ontarioExperienceQuestion');

        const physicianExperienceQuestion =
            document.getElementById('physicianExperienceQuestion');

        const legalStatusQuestion =
            document.getElementById('legalStatusQuestion');

        const resetButton =
            document.getElementById('oinpResetButton');

        const printButton =
            document.getElementById('oinpPrintButton');


        /* -----------------------------------------------------
           NOC automatic TEER + broad category
           ----------------------------------------------------- */

        function updateNOC() {

            const code =
                nocCode.value.trim();

            const error =
                document.getElementById('nocError');

            if (error) {
                error.textContent = '';
            }


            if (code === '') {

                calculateOINPoints();
                return;
            }


            if (!/^\d{5}$/.test(code)) {

                if (error) {
                    error.textContent =
                        'Please enter a valid five-digit NOC code.';
                }

                calculateOINPoints();
                return;
            }


            const firstDigit =
                code.charAt(0);

            const secondDigit =
                code.charAt(1);


            /* TEER */

            const teer =
                document.getElementById('teer');

            if (
                secondDigit === '0' ||
                secondDigit === '1'
            ) {

                teer.value = '0-1';

            } else if (
                secondDigit === '2' ||
                secondDigit === '3'
            ) {

                teer.value = '2-3';

            } else if (
                secondDigit === '4' ||
                secondDigit === '5'
            ) {

                teer.value = '4-5';
            }


            /* Broad category */

            const broadCategory =
                document.getElementById('broadCategory');


            if (firstDigit === '3') {

                broadCategory.value = '3';

            } else if (firstDigit === '7') {

                broadCategory.value = '7';

            } else if (firstDigit === '2') {

                broadCategory.value = '2';

            } else if (
                firstDigit === '0' ||
                firstDigit === '1' ||
                firstDigit === '4' ||
                firstDigit === '8' ||
                firstDigit === '9'
            ) {

                broadCategory.value =
                    '0-1-4-8-9';

            } else if (
                firstDigit === '5' ||
                firstDigit === '6'
            ) {

                broadCategory.value =
                    '5-6';
            }


            calculateOINPoints();
        }


        /* -----------------------------------------------------
           Applicant type
           ----------------------------------------------------- */

        function updateApplicantType() {

            const type =
                applicantType.value;


            if (type === 'physician') {

                wageQuestion.classList.add('hidden');

                jobExperienceQuestion.classList.add('hidden');

                ontarioExperienceQuestion.classList.add('hidden');

                //legalStatusQuestion.classList.add('hidden');

                physicianExperienceQuestion.classList.remove('hidden');


            } else {

                wageQuestion.classList.remove('hidden');

                jobExperienceQuestion.classList.remove('hidden');

                legalStatusQuestion.classList.remove('hidden');

                physicianExperienceQuestion.classList.add('hidden');


                if (
                    jobExperience.value === 'under6'
                ) {

                    ontarioExperienceQuestion.classList.remove('hidden');

                } else {

                    ontarioExperienceQuestion.classList.add('hidden');
                }
            }


            calculateOINPoints();
        }


        /* -----------------------------------------------------
           Select changes
           ----------------------------------------------------- */

        form.querySelectorAll('select').forEach(
            function (select) {

                select.addEventListener(
                    'change',
                    function () {

                        if (
                            select === applicantType
                        ) {

                            updateApplicantType();

                        } else if (
                            select === jobExperience
                        ) {

                            updateApplicantType();

                        } else {

                            calculateOINPoints();
                        }
                    }
                );
            }
        );


        /* -----------------------------------------------------
           Wage
           ----------------------------------------------------- */

        const hourlyWage =
            document.getElementById('hourlyWage');

        if (hourlyWage) {

            hourlyWage.addEventListener(
                'input',
                calculateOINPoints
            );
        }


        /* -----------------------------------------------------
           NOC
           ----------------------------------------------------- */

        if (nocCode) {

            nocCode.addEventListener(
                'input',
                updateNOC
            );
        }


        /* -----------------------------------------------------
           Reset
           ----------------------------------------------------- */

        if (resetButton) {

            resetButton.addEventListener(
                'click',
                function () {

                    /*
                     * Only reset fields belonging to OINP.
                     * Other calculators are untouched.
                     */

                    form.querySelectorAll(
                        'input, select'
                    ).forEach(
                        function (element) {

                            if (
                                element.tagName === 'SELECT'
                            ) {

                                element.selectedIndex = 0;

                            } else {

                                element.value = '';
                            }
                        }
                    );


                    applicantType.value = 'job';


                    document.getElementById(
                        'nocError'
                    ).textContent = '';


                    updateApplicantType();

                    calculateOINPoints();
                }
            );
        }


        /* -----------------------------------------------------
           Print
           ----------------------------------------------------- */

        if (printButton) {

            printButton.addEventListener(
                'click',
                function () {

                    window.print();

                }
            );
        }


        /* -----------------------------------------------------
           Initial state
           ----------------------------------------------------- */

        if (applicantType) {

            applicantType.value = 'job';

            updateApplicantType();
        }

        calculateOINPoints();
    }


    /*
     * Your existing page may already be loaded when this
     * code executes, so support both situations.
     */

    if (document.readyState === 'loading') {

        document.addEventListener(
            'DOMContentLoaded',
            init
        );

    } else {

        init();
    }

})();


// Calculator 


        function isOINPSectionVisible(controlNameOrId) {
            const selector = `[id="${controlNameOrId}"], [name="${controlNameOrId}"]`;
            const control = document.querySelector(selector);

            if (!control) {
                console.warn("Control not found:", controlNameOrId);
                return false;
            }

            // Find nearest parent with class "oinp-section"
            const parentSection = control.closest('.oinp-section');

            if (!parentSection) {
                console.warn("Parent .oinp-section not found for:", controlNameOrId);
                return false;
            }

            // Check if it is visible (not display: none)
            const isVisible = window.getComputedStyle(parentSection).display !== 'none';
            return isVisible;
        }

        function toggleSpouseSection() {
            const isMarried = document.querySelector('input[name="crs_maritalStatus"]:checked')?.value === 'with';
            const spouseSection = document.getElementById('spouse-section');
            if (spouseSection) {
                //spouseSection.style.display = isMarried ? 'block' : 'none';
            }
        }


        function toggleMaritalSections() {
            const maritalStatus = document.querySelector('input[name="crs_maritalStatus"]:checked')?.value;
            const spouseFactorCheckbox = document.querySelector('input[name="crs_maritalFactor"]');
            const spouseSection = document.getElementById('spouse-section');
            const divMarriedFactor = document.getElementById('divMarriedFactor');
            if (maritalStatus === 'with') {
                // Show the checkbox when married
                //divMarriedFactor.style.display = 'block';
                //divMarriedFactor.classList.remove('hidden');

                // Show spouse section only if checkbox is checked
                //spouseSection.style.display = spouseFactorCheckbox.checked ? 'block' : 'none';
        spouseSection.classList.remove('hidden');
                /*if (spouseFactorCheckbox.checked) {
                    spouseSection.classList.remove('hidden');
                } else {
                    spouseSection.classList.add('hidden');
                }*/
            } else {
                // Hide both when not married
                //divMarriedFactor.style.display = 'none';
                //spouseSection.style.display = 'none';
                divMarriedFactor.classList.add('hidden');
                spouseSection.classList.add('hidden');
                // Also uncheck the checkbox if switching to single
                if (spouseFactorCheckbox) spouseFactorCheckbox.checked = false;
            }
        }

        function attachListeners(form, calcFunction) {
            if (!form) return;
            form.querySelectorAll('input, select').forEach(input => {
                input.addEventListener('change', calcFunction);
            });
        }

        function collapseAllSections() {
            const selected = forms[pnpSelector.value];
            if (!selected || !selected.form) return;

            selected.form.querySelectorAll('.section').forEach(section => {
                section.classList.add('collapsed');
            });
        }

        const stepByStepMode = false; // Set this based on dropdown or user choice

        if (!stepByStepMode) {

            document.querySelectorAll('.accordion-toggle').forEach(header => {
                header.addEventListener('click', () => {
                    const section = header.parentElement;
                    const wasCollapsed = section.classList.contains('collapsed');

                    const form = header.closest('form');
                    if (form) {
                        form.querySelectorAll('.section').forEach(sec => sec.classList.add('collapsed'));
                    }

                    // Re-open if it was collapsed
                    if (wasCollapsed) {
                        section.classList.remove('collapsed');


            setTimeout(() => {
                    const headerOffset = 140; // change if you have a sticky header
                    const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - headerOffset;

                    window.scrollTo({
                    top: sectionTop,
                    behavior: 'smooth'
                    });
                }, 300); // match this with your CSS transition duration

                    }
                });
            });

        }

        toggleForms();
        pnpSelector.addEventListener('change', toggleForms);

        Object.values(forms).forEach(({ form, calculate, toggleExtra }) => {
            attachListeners(form, calculate);
            if (toggleExtra) toggleExtra();
        });

        if (sinpSubStream) {
            sinpSubStream.addEventListener('change', toggleSINPEmploymentOfferVisibility);
        }

        // 👇 Marital status listener and initial toggle
        document.querySelectorAll('input[name="crs_maritalStatus"]').forEach(radio => {
            radio.addEventListener('change', () => {
                //toggleSpouseSection();
                toggleMaritalSections();
                calculateCRSPoints();
            });
        });

        // Run logic when checkbox is toggled
        /*document.querySelector('input[name="crs_maritalFactor"]').addEventListener('change', () => {
            toggleMaritalSections();
            calculateCRSPoints();
        });*/





        toggleSpouseSection();

        const calculatorTypeSelector = document.getElementById('calculatorType');
        const pnpDropdownWrapper = document.getElementById('pnpDropdownWrapper');

        function handleCalculatorTypeChange() {
            document.getElementById('recalculateBtn')?.classList.add('hidden');

            const type = calculatorTypeSelector.value;

            if (type === 'federal') {
                // Hide PNP selector wrapper
                pnpDropdownWrapper.style.display = 'none';

                // Temporarily add 'crs' option
                let crsOption = document.createElement('option');
                crsOption.value = 'crs';
                crsOption.text = 'CRS (Temporary)';
                crsOption.setAttribute('data-temp', 'true'); // mark it temporary
                pnpSelector.appendChild(crsOption);

                // Set value to 'crs' and trigger form toggle
                pnpSelector.value = 'crs';
                toggleForms();

                // Remove the temporary option after (optional delay)
                setTimeout(() => {
                    let tempOption = pnpSelector.querySelector('option[data-temp="true"]');
                    if (tempOption) tempOption.remove();
                }, 3000); // 1 second later or adjust as needed
            } else if (type === 'provincial') {
                // Show PNP selector
                pnpDropdownWrapper.style.display = 'block';

                // Set to default provincial value and trigger form
                pnpSelector.value = 'oinp';
                toggleForms();

            }
        }


        // Attach listener
        calculatorTypeSelector.addEventListener('change', handleCalculatorTypeChange);

        // Initialize based on current selection (default on page load)
        handleCalculatorTypeChange();


        const stickyBox = document.querySelector(".total-box");
        const mainContent = document.getElementById("main-content");

        if (!stickyBox || !mainContent) return;

        const fixedTop = 0;         // same as CSS sticky top
        const paddingBuffer = 30;     // stop a few pixels before touching

        function updateStickyPosition() {
               const isMobile = window.innerWidth <= 960;

            if (isMobile) {
                // Reset for mobile layout
                stickyBox.style.position = "static";
                stickyBox.style.top = "auto";
                stickyBox.style.bottom = "auto";
                stickyBox.style.width = "100%";
                return;
            }

            const boxHeight = stickyBox.offsetHeight;
            const mainContentRect = mainContent.getBoundingClientRect();
            const mainContentBottom = window.scrollY + mainContentRect.bottom;
            const stickyBoxBottom = window.scrollY + fixedTop + boxHeight;

            const scoreColumn = stickyBox.parentElement;
            const scoreColumnRect = scoreColumn.getBoundingClientRect();
            const scoreColumnOffsetTop = window.scrollY + scoreColumnRect.top;

            // If sticky box would overflow past main-content bottom
            if (stickyBoxBottom + paddingBuffer >= mainContentBottom) {
                //console.log(getComputedStyle(stickyBox).width)
                stickyBox.style.position = "absolute";
                stickyBox.style.top = (mainContentBottom - boxHeight - scoreColumnOffsetTop - paddingBuffer) + "px";
                stickyBox.style.bottom = "auto";
                //stickyBox.style.width = "100%"; //
                const scoreColumnWidth = (stickyBox.parentElement.offsetWidth + 850) + "px";
                stickyBox.style.width = scoreColumnWidth;
            } else {
                // console.log(getComputedStyle(stickyBox).width)
                stickyBox.style.removeProperty('position');
                stickyBox.style.removeProperty('top');
                stickyBox.style.removeProperty('bottom');
                stickyBox.style.removeProperty('width');
                const scoreColumnWidth = (stickyBox.parentElement.offsetWidth + 0) + "px";
                stickyBox.style.width = scoreColumnWidth;


            }
        }

        //window.addEventListener("scroll", updateStickyPosition);
        //window.addEventListener("resize", updateStickyPosition);

        const events = [
            "scroll",
            "resize",
            "click",
            "input",
            "keydown",
            "mouseover",
            "touchstart",
            "touchmove",
            "touchend"
        ];

        events.forEach(event => {
            //window.addEventListener(event, updateStickyPosition, { passive: true });
        });

        //updateStickyPosition(); // Initial run

    });


    const ageInput = document.getElementById('age-input');
    const ageSelect = document.getElementById('crs_age');

    ageInput.addEventListener('input', function () {
        const input = ageInput.value.trim();
        const age = parseInt(input, 10);
        if (isNaN(age)) return;

        let matchedOption = null;

        Array.from(ageSelect.options).forEach(option => {
            const label = option.textContent.trim();

            if (label.includes('–')) {
                // Handle ranges like "20–29"
                const [min, max] = label.split('–').map(num => parseInt(num, 10));
                if (age >= min && age <= max) {
                    matchedOption = option;
                }
            } else if (label.includes("or older")) {
                // Handle "47 or older"
                const min = parseInt(label); // "47 or older" → 47
                if (age >= min) {
                    matchedOption = option;
                }
            } else if (label.includes("or younger")) {
                // Handle "17 or younger"
                const max = parseInt(label); // "17 or younger" → 17
                if (age <= max) {
                    matchedOption = option;
                }
            } else {
                // Handle exact ages like "18", "45", etc.
                const optAge = parseInt(label, 10);
                if (optAge === age) {
                    matchedOption = option;
                }
            }
        });

        if (matchedOption) {
            ageSelect.value = matchedOption.value;
            ageSelect.dispatchEvent(new Event('change'));
        } else {
            ageSelect.value = "0";
            ageSelect.dispatchEvent(new Event('change'));
        }
    });

};
document.head.appendChild(sheetScript);


window.addEventListener("load", () => {
  setTimeout(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const target = document.getElementById(hash.substring(1));
    if (!target) return;

    const headerOffset = 140;
    const offsetTop =
      target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetTop,
      behavior: "smooth"
    });
  }, 1500); // 👈 delay here
});