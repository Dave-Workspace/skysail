document.addEventListener('DOMContentLoaded', function () {
    console.log('Responsive Website Loaded');

// 0️⃣ Pages to exclude
const excludePages = [
"immigration-calculator.html",
"clb-converter.html",
"citizenship-calculator.html"
];


// 1️⃣ PAGE → CATEGORY MAP
const pageCategoryMap = {
"ielts-celpip-preparation.html": ["study"],
"statement-of-purpose.html": ["study"],
"student-visa-application.html": ["study"],
"post-graduation-work-permit.html": ["study","work"],
"study-permit-extension.html": ["study"],
"temporary-resident-visa.html": ["study"],
"co-op-work-permit.html": ["study"],

"work-permit-application.html": ["work"],
"bridging-open-work-permit.html": ["work"],
"dependent-work-permit.html": ["work"],

"visitor-visa.html": ["visit"],
"convocation-visit-visa.html": ["visit"],
"visitor-visa-extension.html": ["visit"],
"super-visa.html": ["visit"],

"citizenship-application.html": ["settle"],
"dependent-pr-process.html": ["settle"],
"parents-grandparents-program.html": ["settle"],
"pr-card-renewal.html": ["settle"],
"express-entry-pr.html": ["settle"],
"permanent-resident-travel-document.html": ["settle"],

"atip-gcms-notes.html": ["other"],
"authorization-legal-documents.html": ["other"],
"request-fair-review.html": ["other"],
"process-fairness-letter.html": ["other"]
};


// 2️⃣ PAGE INFO
const currentPage = window.location.pathname.split("/").pop();
const params = new URLSearchParams(window.location.search);
const categoryFromUrl = params.get("cat");


// 3️⃣ CATEGORY DETECTION
let allowedCategories = pageCategoryMap[currentPage] || [];

let finalCategory = allowedCategories.length > 1
? (allowedCategories.includes(categoryFromUrl) ? categoryFromUrl : allowedCategories[0])
: allowedCategories[0] || null;


// 4️⃣ MENU HTML
const menus = {

study: `
<section class="service-nav-wrapper">
<div class="service-nav-header">
<h2 class="rcic-title">Other <span class="highlight-red">Study</span> Services</h2>
</div>
<div class="service-nav-outer"><div class="service-nav">
<a href="ielts-celpip-preparation.html">IELTS / CELPIP</a>
<a href="statement-of-purpose.html">SOP Writing</a>
<a href="student-visa-application.html">Student Visa</a>
<a href="post-graduation-work-permit.html">PGWP</a>
<a href="study-permit-extension.html">Permit Extension</a>
<a href="temporary-resident-visa.html">TRV</a>
<a href="atip-gcms-notes.html">ATIP / GCMS</a>
<a href="co-op-work-permit.html">Co-op Permit</a>
</div></div>
</section>`,

work: `
<section class="service-nav-wrapper">
<div class="service-nav-header">
<h2 class="rcic-title">Other <span class="highlight-red">Work</span> Services</h2>
</div>
<div class="service-nav-outer"><div class="service-nav">
<a href="work-permit-application.html">Work Permit</a>
<a href="post-graduation-work-permit.html">PGWP</a>
<a href="bridging-open-work-permit.html">BOWP</a>
<a href="dependent-work-permit.html">Dependent Work Permit</a>
</div></div>
</section>`,

visit: `
<section class="service-nav-wrapper">
<div class="service-nav-header">
<h2 class="rcic-title">Other <span class="highlight-red">Visit</span> Services</h2>
</div>
<div class="service-nav-outer"><div class="service-nav">
<a href="visitor-visa.html">Visitor Visa</a>
<a href="convocation-visit-visa.html">Convocation Visa</a>
<a href="visitor-visa-extension.html">Visa Extension</a>
<a href="super-visa.html">Super Visa</a>
</div></div>
</section>`,

settle: `
<section class="service-nav-wrapper">
<div class="service-nav-header">
<h2 class="rcic-title">Other <span class="highlight-red">Settle</span> Services</h2>
</div>
<div class="service-nav-outer"><div class="service-nav">
<a href="citizenship-application.html">Citizenship</a>
<a href="dependent-pr-process.html">Dependent PR</a>
<a href="parents-grandparents-program.html">PGP</a>
<a href="pr-card-renewal.html">PR Card Renewal</a>
<a href="express-entry-pr.html">Express Entry PR</a>
<a href="permanent-resident-travel-document.html">PRTD</a>
</div></div>
</section>`,

other: `
<section class="service-nav-wrapper">
<div class="service-nav-header">
<h2 class="rcic-title">Other <span class="highlight-red">Other</span> Services</h2>
</div>
<div class="service-nav-outer"><div class="service-nav">
<a href="atip-gcms-notes.html">ATIP / GCMS</a>
<a href="authorization-legal-documents.html">Legal Docs</a>
<a href="request-fair-review.html">Reconsideration</a>
<a href="process-fairness-letter.html">PFL</a>
</div></div>
</section>`
};


// 5️⃣ CREATE MENU CONTAINER
function createMenuContainer(position){

if(!position) return null;

const nav = document.createElement("div");
nav.className = "categoryNav";

//const outer = document.createElement("div");
//outer.className = "service-nav-outer";

//nav.appendChild(outer);
position.parentNode.insertBefore(nav, position);

return nav;

}


// 6️⃣ FIND REFERENCES
//const referenceElement =
//document.querySelector(".hero-section") ||
//document.querySelector(".announcement-inner");

const journeySection =
document.querySelector(".journey-section");


// 7️⃣ CREATE MENUS
//const topOuter =
//referenceElement ? createMenuContainer(referenceElement.nextSibling || referenceElement) : null;

const bottomOuter =
journeySection ? createMenuContainer(journeySection) : null;


// 8️⃣ RENDER MENU
function renderMenu(container){
        if(!container) return;

        const categoryNav = container.closest(".categoryNav");

        if(excludePages.includes(currentPage) || !pageCategoryMap[currentPage]){
            container.innerHTML = "";
            if(categoryNav) categoryNav.style.padding = "0";
            container.style.padding = "0"; // also padding 0 for service-nav-outer
            return;
        }

        container.innerHTML = menus[finalCategory] || "";
        if(categoryNav) categoryNav.style.padding = ""; // reset if menu exists
        container.style.padding = ""; // reset service-nav-outer padding
    }


// render both
//renderMenu(topOuter);
renderMenu(bottomOuter);


// 9️⃣ ACTIVE LINK + CAT PARAM
document.querySelectorAll(".categoryNav .service-nav a").forEach(link=>{

const cleanHref = link.getAttribute("href").split("?")[0];

if(finalCategory){
link.href = cleanHref + "?cat=" + finalCategory;
}

if(cleanHref === currentPage){
link.classList.add("active");
}

});






fetch('announcement.json')
  .then(res => res.json())
  .then(data => {
    const activeItems = data.filter(item => item.status === 'active');

    const announcementBar = document.querySelector('.announcement-bar');
    const marquee = document.querySelector('.announcement-marquee marquee');

    if (activeItems.length === 0) {
      // Hide the announcement bar if no active data
      announcementBar.style.display = 'none';
      return;
    }

    const html = activeItems
      .map(item => item.title)
      .join(' <span class="separator">|</span> ');

    marquee.innerHTML = html;
    announcementBar.style.display = 'block'; // ensure visible
  })
  .catch(err => {
    console.error('File read error:', err);
});





    // Generic typing animation helper for a target element and text
    function startTyping(el, fullText, charDelay = 90, loopDelay = 1800) {
        if (!el) return;
        let i = 0;
        function typeChar() {
            if (i < fullText.length) {
                el.textContent += fullText[i];
                i++;
                setTimeout(typeChar, charDelay);
            } else {
                setTimeout(() => {
                    // Keep line height by inserting a non-breaking space before restart
                    el.textContent = '\u00A0';
                    setTimeout(() => {
                        i = 0;
                        el.textContent = '';
                        typeChar();
                    }, 120);
                }, loopDelay);
            }
        }
        // start typing loop
        el.textContent = '';
        typeChar();
    }

    // Animate headings used across pages
    startTyping(document.getElementById('immigration-anim'), 'Canadian Immigration', 90, 1800);
    startTyping(document.getElementById('work-anim'), 'Work Services', 90, 1800);
    startTyping(document.getElementById('visit-anim'), 'Visit Services', 90, 1800);
    startTyping(document.getElementById('settle-services-anim'), 'Settle Services', 90, 1800);
    startTyping(document.getElementById('additional-anim'), 'Other Services', 90, 1800);
    startTyping(document.getElementById('study-anim'), 'Study Services', 90, 1800);
    startTyping(document.getElementById('citizen-cal-anim'), 'Citizenship Day Calculator', 90, 1800);
    startTyping(document.getElementById('clb-cal-anim'), 'CLB Skill Calculator', 90, 1800);
    startTyping(document.getElementById('supervisa-anim'), 'Super Visa', 90, 1800);
    startTyping(document.getElementById('travel-ins-anim'), 'Travel Insurance', 90, 1800);
    startTyping(document.getElementById('card-anim'), 'Pay only if your visa is approved....', 90, 1800);

    startTyping(document.getElementById('can-services-anim'), 'Sky Services', 90, 1800);
    startTyping(document.getElementById('RCIC-anim'), 'R.C.I.C.?', 90, 1800);
    startTyping(document.getElementById('RCIC-v2-anim'), 'R.C.I.C.', 90, 1800);
    startTyping(document.getElementById('exam-fees-anim'), 'Free Test Booking Serivce', 90, 1800);
    startTyping(document.getElementById('sop-fees-anim'), 'Free SOP Writting Service', 90, 1800);
    startTyping(document.getElementById('Sky-app'), 'SkySail APP', 90, 1800);
    startTyping(document.getElementById('Sky-work'), 'SkySail Work', 90, 1800);

    // Subtle cursor-direction-following motion for hero image boxes (index hero tiles) + Work hero floater
    (function initHeroParallax() {
        const items = [
            { el: document.querySelector('.hero-img-box-1'), amp: 12 },
            { el: document.querySelector('.hero-img-box-2'), amp: 10 },
            { el: document.querySelector('.hero-img-box-3'), amp: 11 },
            { el: document.querySelector('.hero-img-box-4'), amp: 9 },
            // Work page hero image: FURTHER REDUCED amp from 6 to 3 for minimal movement
            { el: document.querySelector('.work-hero-floater'), amp: 3, pre: 'translate(-50%, -50%)' }
        ].filter(x => !!x.el);

        if (!items.length) return;

        items.forEach(it => {
            it.pos = { x: 0, y: 0 }; // current offset
            it.vel = { x: 0, y: 0 }; // velocity influenced by pointer movement
            // Preserve any existing computed transform (e.g. translateY used in specific pages)
            if (!it.pre) {
                try {
                    const computed = window.getComputedStyle(it.el).transform;
                    it.pre = (computed && computed !== 'none') ? computed + ' ' : '';
                } catch (e) {
                    it.pre = '';
                }
            }
            it.el.style.willChange = 'transform';
        });

        const onMove = (e) => {
            const dx = (e.movementX || 0);
            const dy = (e.movementY || 0);
            items.forEach((it, idx) => {
                // FURTHER REDUCED baseGain from 0.08 to 0.04 for much slower response
                const baseGain = 0.04; // baseline sensitivity (was 0.08)
                const gain = Math.max(0.01, baseGain - idx * 0.005); // vary very slightly (was 0.03 and 0.01)
                it.vel.x += dx * gain;
                it.vel.y += dy * gain;
            });
        };

        window.addEventListener('mousemove', onMove, { passive: true });

        function frame() {
            items.forEach(it => {
                // FURTHER INCREASED friction from 0.95 to 0.97 for much slower, smoother movement
                it.vel.x *= 0.97; // friction (was 0.95)
                it.vel.y *= 0.97;
                // FURTHER REDUCED integration from 0.03 to 0.015 for even slower tracking
                it.pos.x += it.vel.x * 0.015; // integrate (was 0.03)
                it.pos.y += it.vel.y * 0.015;
                // clamp to amplitude
                it.pos.x = Math.max(-it.amp, Math.min(it.amp, it.pos.x));
                it.pos.y = Math.max(-it.amp, Math.min(it.amp, it.pos.y));
                const base = it.pre || '';
                // Append parallax translate to the preserved base transform so we don't wipe out CSS positioning
                it.el.style.transform = `${base}translate(${it.pos.x}px, ${it.pos.y}px)`;
            });
            requestAnimationFrame(frame);
        }
        frame();
    })();

    // Flip card behavior for why-copy-flip (scoped)
    (function () {
        const flipContainers = document.querySelectorAll('.why-copy-flip .flip-container');
        if (!flipContainers || !flipContainers.length) return;

        // Hover behavior for desktop: only one active at a time
        flipContainers.forEach(container => {
            container.addEventListener('mouseenter', () => {
                flipContainers.forEach(c => c.classList.remove('active'));
                container.classList.add('active');
            });
            container.addEventListener('mouseleave', () => {
                container.classList.remove('active');
            });
        });

        // Click/tap behavior for mobile: toggle active but keep only one
        flipContainers.forEach(container => {
            container.addEventListener('click', (e) => {
                e.stopPropagation();
                const already = container.classList.contains('active');
                flipContainers.forEach(c => c.classList.remove('active'));
                if (!already) container.classList.add('active');
            });
        });

        // Click outside closes all
        document.addEventListener('click', (e) => {
            if (![...flipContainers].some(c => c.contains(e.target))) {
                flipContainers.forEach(c => c.classList.remove('active'));
            }
        });
    })();

    // Navbar transparency toggle at top of page
    (function () {
        const header = document.querySelector('.sticky-header');
        if (!header) return;
        const apply = () => {
            if (window.scrollY <= 0) {
                header.classList.add('top-of-page');
                header.classList.remove('scrolled');
            } else {
                header.classList.remove('top-of-page');
                header.classList.add('scrolled');
            }
        };
        window.addEventListener('scroll', apply, { passive: true });
        window.addEventListener('load', apply);
        apply();
    })();

    // Animated floating sprites for the celebrate section - CONFINED MOVEMENT
    (function () {
        const sprites = document.querySelectorAll('.celebrate-sprite');
        if (!sprites || !sprites.length) return;

        // Set initial positions and create animation data for each sprite
        sprites.forEach(sprite => {
            // Get initial position from CSS (already set in stylesheet)
            const computedStyle = window.getComputedStyle(sprite);

            // Create animation data with confined movement
            sprite.animationData = {
                // Start at center of confined area (0,0 offset from CSS position)
                xPos: 0,
                yPos: 0,
                // Slower, gentler speeds for subtle movement
                xSpeed: (Math.random() - 0.5) * 0.3,
                ySpeed: (Math.random() - 0.5) * 0.3,
                // Rotation parameters
                rotation: Math.random() * 360, // Random starting rotation
                rotationSpeed: (Math.random() - 0.5) * 0.5, // Slow rotation speed
                // Wave motion parameters
                sinOffset: Math.random() * Math.PI * 2,
                amplitude: 3 + Math.random() * 7, // Smaller amplitude for confined movement
                frequency: 0.0008 + Math.random() * 0.0015, // Slower frequency
                // Boundaries - confine to small area (adjust these values to change confined area size)
                maxX: 30, // Maximum 30px left/right from initial position
                maxY: 30  // Maximum 30px up/down from initial position
            };
        });

        // Animation loop
        function animateSprites(timestamp) {
            sprites.forEach(sprite => {
                const data = sprite.animationData;

                // Update position with speed
                data.xPos += data.xSpeed;
                data.yPos += data.ySpeed;

                // Boundary checking - bounce back if hitting limits
                if (Math.abs(data.xPos) > data.maxX) {
                    data.xSpeed *= -1; // Reverse direction
                    data.xPos = Math.sign(data.xPos) * data.maxX; // Clamp to boundary
                }
                if (Math.abs(data.yPos) > data.maxY) {
                    data.ySpeed *= -1; // Reverse direction
                    data.yPos = Math.sign(data.yPos) * data.maxY; // Clamp to boundary
                }

                // Add gentle sin wave motion for organic feel
                const sinWaveX = Math.sin(timestamp * data.frequency + data.sinOffset) * data.amplitude;
                const sinWaveY = Math.cos(timestamp * data.frequency + data.sinOffset * 1.3) * data.amplitude;

                // Update rotation
                data.rotation += data.rotationSpeed;

                // Apply transform with confined position, wave motion, and rotation
                sprite.style.transform = `translate(${data.xPos + sinWaveX}px, ${data.yPos + sinWaveY}px) rotate(${data.rotation}deg)`;
            });

            // Continue animation
            requestAnimationFrame(animateSprites);
        }

        // Start animation
        requestAnimationFrame(animateSprites);
    })();

    // Settle page: Headline animation (letters + gradient arc)
    (function () {
        const container = document.getElementById('settle-anim-text');
        const path = document.querySelector('#settle-anim .arc-underline path');
        if (!container || !path) return;

        const text = 'Settle in Canada';
        // Animation timing parameters (in seconds)
        const delayPerLetter = 0.05;
        const animationDuration = 0.6;
        const pauseAfterAnimation = 1;

        const pathLength = 590;
        const steps = text.length;

        const totalTextTime = delayPerLetter * (steps - 1) + animationDuration;
        const halfIndex = Math.floor(steps / 2) - 1;
        const arcStartDelay = delayPerLetter * halfIndex + animationDuration;
        const arcDuration = totalTextTime - arcStartDelay;

        function createText() {
            container.innerHTML = '';
            text.split('').forEach((char, i) => {
                const span = document.createElement('span');
                span.classList.add('letter');
                if (char === ' ') {
                    span.innerHTML = '&nbsp;';
                } else {
                    span.textContent = char;
                }
                span.style.animationDelay = `${i * delayPerLetter}s`;
                container.appendChild(span);
            });
        }

        function animateArc() {
            path.style.strokeDashoffset = pathLength;
            setTimeout(() => {
                let startTime = null;
                function animate(time) {
                    if (!startTime) startTime = time;
                    const elapsed = (time - startTime) / 1000; // seconds
                    if (elapsed < arcDuration) {
                        const progress = elapsed / arcDuration;
                        path.style.strokeDashoffset = pathLength * (1 - progress);
                        requestAnimationFrame(animate);
                    } else {
                        path.style.strokeDashoffset = 0;
                    }
                }
                requestAnimationFrame(animate);
            }, arcStartDelay * 1000);
        }

        function startAnimation() {
            createText();
            animateArc();
        }

        function getTotalAnimationTimeMs() {
            return (totalTextTime + pauseAfterAnimation) * 1000;
        }

        startAnimation();
        setInterval(startAnimation, getTotalAnimationTimeMs());
    })();

    // Contact page: Form validation
    (function () {
        'use strict';
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (form.checkValidity()) {
                // Form is valid - you can add your submission logic here
                alert('Thank you for contacting us! We will get back to you soon.');
                form.reset();
                form.classList.remove('was-validated');
            } else {
                form.classList.add('was-validated');
            }
        }, false);
    })();


/*(function () {
    'use strict';

    const form = document.getElementById('PGPForm');
    if (!form) return;

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        const data = {
            name: form.name.value,
           
            contact: form.contact.value,
            email: form.email.value,
            age: form.age.value,
            notes: form.notes.value
        };

        fetch('sv_send_email.php', {  // your PHP backend
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res => {
            if (res.status === 'success') {
                alert('Enquiry submitted successfully! Our team will contact you soon.');
                form.reset();
                form.classList.remove('was-validated');
            } else {
                alert('Error: ' + (res.message || 'Unknown error'));
            }
        })
        .catch(err => {
            console.error(err);
            alert('Error submitting form. Please try again later.');
        });
    });
})();*/


/*(function () {
    'use strict';

    const form = document.getElementById('enquiryForm');
    if (!form) return;

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        return emailRegex.test(email);
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const level = form.level.value;
        const field = form.mainProgram.value;
        const program = form.program.value;
        const province = form.province.value;
        const city = form.city.value;
        const notes = form.comment.value.trim();

        // Basic validation
        if (!name || !email || !level || !field || !program || !province || !city) {
            alert("Please fill all required fields.");
            return;
        }

        if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        const data = {
            name,
            email,
            level,
            field,
            program,
            province,
            city,
            notes
        };

        fetch('course_send_email.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res => {
            if (res.status === 'success') {
                alert('Enquiry submitted successfully! Our team will contact you soon.');
                form.reset();
            } else {
                alert('Error: ' + (res.message || 'Something went wrong'));
            }
        })
        .catch(err => {
            console.error(err);
            alert('Server error. Please try again later.');
        });
    });

})();*/



/*(function () {
    'use strict';

    const form = document.getElementById('VVIForm');
    if (!form) return;

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        const data = {
            name: form.name.value,
           
            contact: form.contact.value,
            email: form.email.value,
            age: form.age.value,
            notes: form.notes.value
        };

        fetch('vvi_send_email.php', {  // your PHP backend
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res => {
            if (res.status === 'success') {
                alert('Enquiry submitted successfully! Our team will contact you soon.');
                form.reset();
                form.classList.remove('was-validated');
            } else {
                alert('Error: ' + (res.message || 'Unknown error'));
            }
        })
        .catch(err => {
            console.error(err);
            alert('Error submitting form. Please try again later.');
        });
    });
})();*/





    // Contact page: Animate contact form image when section is in view
    (function () {
        const formImage = document.querySelector('.contact-form-image');
        const formSection = document.querySelector('.contact-form-section');

        if (!formImage || !formSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    formImage.classList.add('animate');
                    observer.unobserve(formSection); // Only animate once
                }
            });
        }, {
            threshold: 0.3 // Trigger when 30% of the section is visible
        });

        observer.observe(formSection);
    })();

    // Our Story page: History image switching on accordion click and accent handling
    (function () {
        const historyImage = document.getElementById('historyImage');
        const accordionButtons = document.querySelectorAll('.history-accordion .accordion-button');

        if (!accordionButtons || !accordionButtons.length) return;

        accordionButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                const newImage = this.getAttribute('data-image');
                if (newImage && historyImage) {
                    historyImage.src = newImage;
                }

                // Prevent closing if this item is already active
                const targetId = this.getAttribute('data-bs-target');
                const targetCollapse = document.querySelector(targetId);
                if (targetCollapse && targetCollapse.classList.contains('show')) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            });
        });

        const historyAccordion = document.getElementById('historyAccordion');
        if (!historyAccordion) return;

        // When a collapse starts showing, mark its parent item as active and clear others immediately
        historyAccordion.addEventListener('show.bs.collapse', function (e) {
            const items = historyAccordion.querySelectorAll('.history-item');
            items.forEach(i => i.classList.remove('is-active'));
            const showingCollapse = e.target;
            const item = showingCollapse.closest('.history-item');
            if (item) item.classList.add('is-active');
        });

        // Initialize active class for any panel already open on load
        const initiallyOpen = historyAccordion.querySelector('.accordion-collapse.show');
        if (initiallyOpen) {
            const parent = initiallyOpen.closest('.history-item');
            if (parent) parent.classList.add('is-active');
        }
    })();

});

document.addEventListener('DOMContentLoaded', function () {
    const footerLinks = document.querySelectorAll('#site-footer .footer-link, #site-footer .footer-bottom a');

    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', function () {
            this.classList.remove('exit');
        });

        link.addEventListener('mouseleave', function () {
            this.classList.add('exit');
        });
    });
});

const footer = document.getElementById('site-footer');
const footerContent = document.getElementById('footer-content');
const spacer = document.getElementById('footer-spacer');

function updateFooter() {
    const scrollY = window.scrollY;
    const docHeight = document.body.scrollHeight;
    const winHeight = window.innerHeight;

    const distanceFromBottom = docHeight - (scrollY + winHeight);
    const totalHeight = footerContent.scrollHeight;

    // Calculate visible footer height
    let visibleHeight = (totalHeight - distanceFromBottom);
    visibleHeight = Math.max(0, Math.min(visibleHeight, totalHeight));

    footer.style.height = visibleHeight + "px";

    // Dynamically set spacer height to footer's full content height
    spacer.style.height = totalHeight + "px";
}

window.addEventListener('scroll', updateFooter);
window.addEventListener('resize', updateFooter);
window.addEventListener('load', () => {
    footer.style.height = "0px";
    updateFooter();
});

// Journey Section Animation
(function () {
    const journeySection = document.querySelector('.journey-section');
    if (!journeySection) return;

    const title = journeySection.querySelector('.journey-title');
    const desc = journeySection.querySelector('.journey-desc');
    const ctaWrapper = journeySection.querySelector('.journey-cta-wrapper');
    const image = journeySection.querySelector('.journey-main-image');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Animate text elements
                    if (title) {
                        setTimeout(() => {
                            title.classList.add('animate-in');
                        }, 100);
                    }
                    if (desc) {
                        setTimeout(() => {
                            desc.classList.add('animate-in');
                        }, 300);
                    }
                    if (ctaWrapper) {
                        setTimeout(() => {
                            ctaWrapper.classList.add('animate-in');
                        }, 500);
                    }
                    // Animate image
                    if (image) {
                        setTimeout(() => {
                            image.classList.add('animate-in');
                        }, 200);
                    }

                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    observer.observe(journeySection);
})();

(function () {
    const container = document.querySelector('.pl1234x-timeline-container');
    const base = document.querySelector('.pl1234x-timeline-base');
    const progress = document.querySelector('.pl1234x-timeline-progress');
    const dots = Array.from(document.querySelectorAll('.pl1234x-node-dot'));

    function alignLine() {
        if (!container || !base || !progress || dots.length < 2) return;
        const crect = container.getBoundingClientRect();
        const first = dots[0].getBoundingClientRect();
        const last = dots[dots.length - 1].getBoundingClientRect();
        const start = (first.left + first.right) / 2 - crect.left;
        const end = (last.left + last.right) / 2 - crect.left;
        const width = Math.max(0, end - start);
        base.style.left = `${start}px`;
        base.style.width = `${width}px`;
        progress.style.left = `${start}px`;
        // height stays fixed for horizontal layout
        base.style.height = '4px';
        progress.style.height = '4px';
        // notify listeners to recompute progress width
        window.dispatchEvent(new Event('pl1234x-line-aligned'));
    }

    window.addEventListener('resize', alignLine);
    window.addEventListener('load', alignLine);
    document.fonts?.ready?.then(alignLine);
    alignLine();
})();

/* 1234x   RCIC-like behavior, 4 nodes, unique names */
(function () {
    if (window.__pl1234xInitDone) {
        return;
    }
    window.__pl1234xInitDone = true;

    const nodes = Array.from(document.querySelectorAll('.pl1234x-timeline-node'));
    const progressEl = document.getElementById('pl1234xTimelineProgress');
    const baseEl = document.querySelector('.pl1234x-timeline-base');
    const container = document.querySelector('.pl1234x-timeline-container');

    // Bail out if the timeline isn t present on this page
    if (!nodes.length || !progressEl || !baseEl || !container) {
        return;
    }

    let currentStep = 0;
    let autoPlayInterval;

    const isMobile = () => window.innerWidth <= 768;

    const nodeImageData = nodes.map(n => {
        const img = n.querySelector('.pl1234x-node-img');
        const pngSrc = img?.src || '';
        const gifSrc = pngSrc.endsWith('.png') ? pngSrc.replace('.png', '.gif') : pngSrc;
        return { img, pngSrc, gifSrc, animating: false };
    });

    function getLineMetrics() {
        if (!container || !baseEl) return { left: 0, width: container?.clientWidth || 0 };
        const c = container.getBoundingClientRect();
        const b = baseEl.getBoundingClientRect();
        return { left: b.left - c.left, width: b.width };
    }

    function playNodeAnimation(stepIndex) {
        const data = nodeImageData[stepIndex];
        if (!data || !data.img || !data.gifSrc || data.animating) return;

        data.animating = true;
        const img = data.img;
        img.classList.add('is-gif');
        img.src = data.gifSrc;

        setTimeout(() => {
            img.classList.remove('is-gif');
            img.src = data.pngSrc;
            data.animating = false;
        }, 2000);
    }

    function updateTimeline(stepIndex, instant = false) {
        currentStep = stepIndex;

        nodes.forEach((node, i) => {
            node.classList.toggle('active', i <= stepIndex);
        });

        playNodeAnimation(stepIndex);

        const total = nodes.length;
        const ratio = (total > 1) ? (stepIndex / (total - 1)) : 0;

        if (instant) {
            progressEl.style.transition = 'none';
        } else {
            progressEl.style.transition = 'width 0.6s ease-in-out, height 0.6s ease-in-out';
        }

        if (isMobile()) {
            progressEl.style.width = '4px';
            progressEl.style.height = `${ratio * 100}%`;
        } else {
            const { left, width } = getLineMetrics();
            const progressWidth = width * ratio;
            progressEl.style.left = `${left}px`;
            progressEl.style.width = `${progressWidth}px`;
            progressEl.style.height = '4px';
        }

        if (instant) {
            void progressEl.offsetWidth;
            progressEl.style.transition = 'width 0.6s ease-in-out, height 0.6s ease-in-out';
        }
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(() => {
            currentStep = (currentStep + 1) % nodes.length;
            updateTimeline(currentStep);
        }, 3000);
    }
    function stopAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
    }

    nodes.forEach((node, i) => {
        node.addEventListener('click', () => {
            stopAutoPlay();
            updateTimeline(i);
            setTimeout(startAutoPlay, 5000);
        });
    });

    window.addEventListener('pl1234x-line-aligned', () => updateTimeline(currentStep, true));

    updateTimeline(0, true);
    startAutoPlay();
    window.addEventListener('resize', () => updateTimeline(currentStep, true));
})();


(function () {
    const wrapper = document.getElementById('newsWrapper');
    if (!wrapper) return;

    function replaceButton(id) {
        const old = document.getElementById(id);
        if (!old) return null;
        const clone = old.cloneNode(true);
        old.parentNode.replaceChild(clone, old);
        return clone;
    }
    const leftBtn = replaceButton('scrollLeft');
    const rightBtn = replaceButton('scrollRight');
    const dotsContainer = document.getElementById('newsDots');
    if (!dotsContainer) return;

    function getGap() {
        const style = window.getComputedStyle(wrapper);
        return parseFloat(style.columnGap || style.gap || 0) || 0;
    }

    function getCardWidth() {
        const card = wrapper.querySelector('.news-card');
        if (!card) return wrapper.clientWidth;
        return card.getBoundingClientRect().width;
    }

    function getVisibleCount(cardWidth, gap) {
        // account for fractional pixels and small layout differences with an epsilon
        const total = cardWidth + gap;
        if (!total || total <= 0) return 1;
        const visible = Math.floor((wrapper.clientWidth + gap + 0.5) / total);
        return Math.max(1, visible);
    }

    function clampScroll(x) {
        const max = Math.max(0, wrapper.scrollWidth - wrapper.clientWidth);
        return Math.max(0, Math.min(x, max));
    }

    function buildDots() {
        const cards = wrapper.querySelectorAll('.news-card');
        // If there are no cards, clear and hide
        if (!cards.length) {
            dotsContainer.innerHTML = '';
            dotsContainer.style.display = 'none';
            if (leftBtn) leftBtn.disabled = true;
            if (rightBtn) rightBtn.disabled = true;
            return;
        }

        // If there's no horizontal overflow, hide dots and disable arrows
        // (use a small tolerance to avoid off-by-one from fractional pixels)
        if (wrapper.scrollWidth <= wrapper.clientWidth + 1) {
            dotsContainer.innerHTML = '';
            dotsContainer.style.display = 'none';
            if (leftBtn) leftBtn.disabled = true;
            if (rightBtn) rightBtn.disabled = true;
            return;
        } else {
            dotsContainer.style.display = '';
        }

        const cardWidth = getCardWidth();
        const gap = getGap();
        const visibleCount = getVisibleCount(cardWidth, gap);
        const pages = Math.max(1, Math.ceil(cards.length / visibleCount));

        // Rebuild dots
        dotsContainer.innerHTML = '';
        for (let i = 0; i < pages; i++) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'news-dot';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Show page ${i + 1} of ${pages}`);
            dot.dataset.page = i;
            dot.addEventListener('click', () => {
                const target = clampScroll(i * visibleCount * (cardWidth + gap));
                wrapper.scrollTo({ left: target, behavior: 'smooth' });
            });
            dotsContainer.appendChild(dot);
        }

        updateActiveDot();
    }

    let rafPending = false;
    function updateActiveDot() {
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(() => {
            const dots = dotsContainer.querySelectorAll('.news-dot');
            // No dots => nothing to update
            if (!dots.length) {
                // Ensure arrows reflect no-scroll state
                if (leftBtn) leftBtn.disabled = true;
                if (rightBtn) rightBtn.disabled = true;
                rafPending = false;
                return;
            }

            const cardWidth = getCardWidth();
            const gap = getGap();
            const visibleCount = getVisibleCount(cardWidth, gap);
            const pages = Math.max(1, Math.ceil(wrapper.querySelectorAll('.news-card').length / visibleCount));
            const pageWidth = visibleCount * (cardWidth + gap) || wrapper.clientWidth;

            // Use center-based rounding so partial scroll selects nearest page
            const raw = pageWidth ? (wrapper.scrollLeft + pageWidth / 2) / pageWidth : 0;
            const pageIndex = Math.min(pages - 1, Math.max(0, Math.floor(raw)));

            dots.forEach((d, idx) => {
                d.classList.toggle('active', idx === pageIndex);
                d.setAttribute('aria-selected', idx === pageIndex ? 'true' : 'false');
            });

            if (leftBtn) leftBtn.disabled = wrapper.scrollLeft <= 5;
            if (rightBtn) {
                const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
                rightBtn.disabled = wrapper.scrollLeft + 5 >= maxScroll;
            }

            rafPending = false;
        });
    }

    function scrollByPage(direction = 1) {
        const cardWidth = getCardWidth();
        const gap = getGap();
        const visibleCount = getVisibleCount(cardWidth, gap);
        const delta = visibleCount * (cardWidth + gap) * direction;
        const target = clampScroll(wrapper.scrollLeft + delta);
        wrapper.scrollTo({ left: target, behavior: 'smooth' });
    }

    if (leftBtn) leftBtn.addEventListener('click', () => scrollByPage(-1));
    if (rightBtn) rightBtn.addEventListener('click', () => scrollByPage(1));
    wrapper.addEventListener('scroll', updateActiveDot, { passive: true });

    let resizeDebounce;
    window.addEventListener('resize', () => {
        clearTimeout(resizeDebounce);
        resizeDebounce = setTimeout(buildDots, 120);
    });

    const mo = new MutationObserver(() => buildDots());
    mo.observe(wrapper, { childList: true, subtree: true });

    // Init
    buildDots();
})();



// Aspiria Style Progress Steps Section
(function () {
    const progressSection = document.querySelector('.aspiria-progress-section');
    if (!progressSection) {
        console.log('Progress section not found');
        return;
    }

    const progressBarFill = document.getElementById('aspiriaProgressFill');
    const progressBarSticky = progressSection.querySelector('.progress-bar-sticky');
    const cardWrappers = document.querySelectorAll('.aspiria-card-wrapper');
    const aspiriaCards = document.querySelectorAll('.aspiria-card-content');

    if (!progressBarFill || !cardWrappers.length || !aspiriaCards.length) return;

    const totalCards = aspiriaCards.length;
    // Different sticky top values for each card (from CSS)
    const stickyTops = [180, 200, 220]; // Card 1: 130px, Card 2: 160px, Card 3: 190px

    function updateProgress() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        let activeCardIndex = 0;
        let highestStickyIndex = -1;

        // Get section boundaries for progress calculation
        const sectionRect = progressSection.getBoundingClientRect();
        const sectionTop = progressSection.offsetTop;
        const sectionHeight = progressSection.offsetHeight;
        const sectionBottom = sectionTop + sectionHeight;
        const headerHeight = 140;

        // Progress bar is now always sticky via CSS, no need to toggle fixed class

        // Determine which cards are sticky (one by one as you scroll)
        const stickyCards = [];
        cardWrappers.forEach((wrapper, index) => {
            const wrapperRect = wrapper.getBoundingClientRect();
            const wrapperTop = wrapperRect.top;
            const wrapperBottom = wrapperRect.bottom;
            const cardStickyTop = stickyTops[index] || stickyTops[0];

            // Card is sticky when its wrapper has scrolled enough that the card would stick
            // Check if the wrapper's top has reached or passed the sticky position
            // The card becomes sticky when wrapper top <= sticky position
            const hasReachedSticky = wrapperTop <= cardStickyTop;
            // Check if wrapper is still in viewport (hasn't scrolled completely past)
            const isStillInView = wrapperBottom > cardStickyTop;
            const isSticky = hasReachedSticky && isStillInView;

            if (isSticky) {
                stickyCards.push(index);
                if (index > highestStickyIndex) {
                    highestStickyIndex = index;
                }
            }
        });

        // Calculate smooth progress bar fill based on card positions
        let progressPercentage = 0;
        const progressPerCard = 100 / totalCards; // 33.33% per card

        // Check if we're before the section
        if (scrollY < sectionTop - 100) {
            progressPercentage = 0;
        }
        // Within the section - smooth progress calculation
        else {
            if (highestStickyIndex >= 0) {
                // A card is sticky - base progress
                const baseProgress = ((highestStickyIndex + 1) / totalCards) * 100;

                // Add smooth interpolation if next card is approaching
                if (highestStickyIndex < totalCards - 1) {
                    const nextCardIndex = highestStickyIndex + 1;
                    const nextWrapper = cardWrappers[nextCardIndex];
                    if (nextWrapper) {
                        const nextWrapperRect = nextWrapper.getBoundingClientRect();
                        const nextWrapperTop = nextWrapperRect.top;
                        const nextCardStickyTop = stickyTops[nextCardIndex] || stickyTops[0];

                        // Calculate how close the next card is to becoming sticky
                        const distanceToSticky = nextCardStickyTop - nextWrapperTop;
                        const interpolationRange = 200; // Smooth transition over 200px

                        if (distanceToSticky > 0 && distanceToSticky < interpolationRange) {
                            // Smoothly interpolate between current and next card progress
                            const interpolationFactor = 1 - (distanceToSticky / interpolationRange);
                            const nextProgress = ((nextCardIndex + 1) / totalCards) * 100;
                            progressPercentage = baseProgress + (nextProgress - baseProgress) * interpolationFactor;
                        } else {
                            progressPercentage = baseProgress;
                        }
                    } else {
                        progressPercentage = baseProgress;
                    }
                } else {
                    // Last card is sticky - show 100%
                    progressPercentage = 100;
                }
            } else {
                // No card is sticky yet - calculate progress based on first card approach
                const firstWrapper = cardWrappers[0];
                if (firstWrapper) {
                    const firstWrapperRect = firstWrapper.getBoundingClientRect();
                    const firstWrapperTop = firstWrapperRect.top;
                    const firstCardStickyTop = stickyTops[0];
                    const distanceToSticky = firstCardStickyTop - firstWrapperTop;
                    const approachRange = 300;

                    if (distanceToSticky > 0 && distanceToSticky < approachRange) {
                        // Smoothly fill as approaching first card
                        const approachFactor = 1 - (distanceToSticky / approachRange);
                        progressPercentage = progressPerCard * approachFactor;
                    } else {
                        progressPercentage = 0;
                    }
                }
            }
        }

        // Clamp between 0 and 100
        progressPercentage = Math.max(0, Math.min(100, progressPercentage));

        // Apply progress bar fill with smooth transition
        progressBarFill.style.width = progressPercentage + '%';
    }

    // Throttle scroll events
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateProgress();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateProgress);

    // Initial update (will set progress bar based on visible card)
    setTimeout(() => {
        updateProgress();
    }, 100);

    // Also update on load
    window.addEventListener('load', () => {
        updateProgress();
    });
})();

// Special Services Boxes Sticky Cards (RENAMED COPY)
(function () {
    const specialServicesBoxesStickyCardsSection = document.querySelector('.special-services-boxes-sticky-cards-section');
    if (!specialServicesBoxesStickyCardsSection) {
        console.log('Special services boxes sticky cards section not found');
        return;
    }

    const specialServicesBoxesStickyCardsProgressFill = document.getElementById('specialServicesBoxesStickyCardsProgressFill');
    const specialServicesBoxesStickyCardsProgressBarSticky = specialServicesBoxesStickyCardsSection.querySelector('.special-services-boxes-sticky-cards-progress-bar-sticky');
    const specialServicesBoxesStickyCardsCardWrappers = document.querySelectorAll('.special-services-boxes-sticky-cards-card-wrapper');
    const specialServicesBoxesStickyCardsCardContents = document.querySelectorAll('.special-services-boxes-sticky-cards-card-content');

    if (!specialServicesBoxesStickyCardsProgressFill || !specialServicesBoxesStickyCardsCardWrappers.length || !specialServicesBoxesStickyCardsCardContents.length) return;

    const specialServicesBoxesStickyCardsTotalCards = specialServicesBoxesStickyCardsCardContents.length;
    const specialServicesBoxesStickyCardsStickyTops = [180, 200];

    function specialServicesBoxesStickyCardsUpdateProgress() {
        const specialServicesBoxesStickyCardsScrollY = window.scrollY;
        let specialServicesBoxesStickyCardsHighestStickyIndex = -1;

        const specialServicesBoxesStickyCardsSectionTop = specialServicesBoxesStickyCardsSection.offsetTop;
        const specialServicesBoxesStickyCardsSectionHeight = specialServicesBoxesStickyCardsSection.offsetHeight;

        specialServicesBoxesStickyCardsCardWrappers.forEach((specialServicesBoxesStickyCardsWrapper, specialServicesBoxesStickyCardsIndex) => {
            const specialServicesBoxesStickyCardsWrapperRect = specialServicesBoxesStickyCardsWrapper.getBoundingClientRect();
            const specialServicesBoxesStickyCardsWrapperTop = specialServicesBoxesStickyCardsWrapperRect.top;
            const specialServicesBoxesStickyCardsWrapperBottom = specialServicesBoxesStickyCardsWrapperRect.bottom;

            const specialServicesBoxesStickyCardsCardStickyTop =
                specialServicesBoxesStickyCardsStickyTops[specialServicesBoxesStickyCardsIndex] || specialServicesBoxesStickyCardsStickyTops[0];

            const specialServicesBoxesStickyCardsHasReachedSticky = specialServicesBoxesStickyCardsWrapperTop <= specialServicesBoxesStickyCardsCardStickyTop;
            const specialServicesBoxesStickyCardsIsStillInView = specialServicesBoxesStickyCardsWrapperBottom > specialServicesBoxesStickyCardsCardStickyTop;
            const specialServicesBoxesStickyCardsIsSticky = specialServicesBoxesStickyCardsHasReachedSticky && specialServicesBoxesStickyCardsIsStillInView;

            if (specialServicesBoxesStickyCardsIsSticky && specialServicesBoxesStickyCardsIndex > specialServicesBoxesStickyCardsHighestStickyIndex) {
                specialServicesBoxesStickyCardsHighestStickyIndex = specialServicesBoxesStickyCardsIndex;
            }
        });

        let specialServicesBoxesStickyCardsProgressPercentage = 0;

        if (specialServicesBoxesStickyCardsScrollY < specialServicesBoxesStickyCardsSectionTop - 100) {
            specialServicesBoxesStickyCardsProgressPercentage = 0;
        } else {
            if (specialServicesBoxesStickyCardsHighestStickyIndex >= 0) {
                const specialServicesBoxesStickyCardsBaseProgress =
                    ((specialServicesBoxesStickyCardsHighestStickyIndex + 1) / specialServicesBoxesStickyCardsTotalCards) * 100;

                if (specialServicesBoxesStickyCardsHighestStickyIndex < specialServicesBoxesStickyCardsTotalCards - 1) {
                    const specialServicesBoxesStickyCardsNextCardIndex = specialServicesBoxesStickyCardsHighestStickyIndex + 1;
                    const specialServicesBoxesStickyCardsNextWrapper = specialServicesBoxesStickyCardsCardWrappers[specialServicesBoxesStickyCardsNextCardIndex];

                    if (specialServicesBoxesStickyCardsNextWrapper) {
                        const specialServicesBoxesStickyCardsNextWrapperTop = specialServicesBoxesStickyCardsNextWrapper.getBoundingClientRect().top;
                        const specialServicesBoxesStickyCardsNextCardStickyTop =
                            specialServicesBoxesStickyCardsStickyTops[specialServicesBoxesStickyCardsNextCardIndex] || specialServicesBoxesStickyCardsStickyTops[0];

                        const specialServicesBoxesStickyCardsDistanceToSticky = specialServicesBoxesStickyCardsNextCardStickyTop - specialServicesBoxesStickyCardsNextWrapperTop;
                        const specialServicesBoxesStickyCardsInterpolationRange = 200;

                        if (specialServicesBoxesStickyCardsDistanceToSticky > 0 && specialServicesBoxesStickyCardsDistanceToSticky < specialServicesBoxesStickyCardsInterpolationRange) {
                            const specialServicesBoxesStickyCardsInterpolationFactor =
                                1 - (specialServicesBoxesStickyCardsDistanceToSticky / specialServicesBoxesStickyCardsInterpolationRange);

                            const specialServicesBoxesStickyCardsNextProgress =
                                ((specialServicesBoxesStickyCardsNextCardIndex + 1) / specialServicesBoxesStickyCardsTotalCards) * 100;

                            specialServicesBoxesStickyCardsProgressPercentage =
                                specialServicesBoxesStickyCardsBaseProgress + (specialServicesBoxesStickyCardsNextProgress - specialServicesBoxesStickyCardsBaseProgress) * specialServicesBoxesStickyCardsInterpolationFactor;
                        } else {
                            specialServicesBoxesStickyCardsProgressPercentage = specialServicesBoxesStickyCardsBaseProgress;
                        }
                    } else {
                        specialServicesBoxesStickyCardsProgressPercentage = specialServicesBoxesStickyCardsBaseProgress;
                    }
                } else {
                    specialServicesBoxesStickyCardsProgressPercentage = 100;
                }
            } else {
                const specialServicesBoxesStickyCardsFirstWrapper = specialServicesBoxesStickyCardsCardWrappers[0];
                if (specialServicesBoxesStickyCardsFirstWrapper) {
                    const specialServicesBoxesStickyCardsFirstWrapperTop = specialServicesBoxesStickyCardsFirstWrapper.getBoundingClientRect().top;
                    const specialServicesBoxesStickyCardsFirstCardStickyTop = specialServicesBoxesStickyCardsStickyTops[0];
                    const specialServicesBoxesStickyCardsDistanceToSticky = specialServicesBoxesStickyCardsFirstCardStickyTop - specialServicesBoxesStickyCardsFirstWrapperTop;
                    const specialServicesBoxesStickyCardsApproachRange = 300;

                    if (specialServicesBoxesStickyCardsDistanceToSticky > 0 && specialServicesBoxesStickyCardsDistanceToSticky < specialServicesBoxesStickyCardsApproachRange) {
                        const specialServicesBoxesStickyCardsApproachFactor =
                            1 - (specialServicesBoxesStickyCardsDistanceToSticky / specialServicesBoxesStickyCardsApproachRange);

                        specialServicesBoxesStickyCardsProgressPercentage =
                            (100 / specialServicesBoxesStickyCardsTotalCards) * specialServicesBoxesStickyCardsApproachFactor;
                    }
                }
            }
        }

        specialServicesBoxesStickyCardsProgressPercentage = Math.max(0, Math.min(100, specialServicesBoxesStickyCardsProgressPercentage));
        specialServicesBoxesStickyCardsProgressFill.style.width = specialServicesBoxesStickyCardsProgressPercentage + '%';
    }

    let specialServicesBoxesStickyCardsTicking = false;

    function specialServicesBoxesStickyCardsOnScroll() {
        if (!specialServicesBoxesStickyCardsTicking) {
            window.requestAnimationFrame(() => {
                specialServicesBoxesStickyCardsUpdateProgress();
                specialServicesBoxesStickyCardsTicking = false;
            });
            specialServicesBoxesStickyCardsTicking = true;
        }
    }

    window.addEventListener('scroll', specialServicesBoxesStickyCardsOnScroll, { passive: true });
    window.addEventListener('resize', specialServicesBoxesStickyCardsUpdateProgress);

    setTimeout(() => {
        specialServicesBoxesStickyCardsUpdateProgress();
    }, 100);

    window.addEventListener('load', () => {
        specialServicesBoxesStickyCardsUpdateProgress();
    });
})();

// Load posts by category and display in a container

function loadCategoryPosts(categoryName, limit = 10){

    fetch('/api/public/posts.php')
        .then(r => r.json())
        .then(d => {

            if(!d || !Array.isArray(d.posts)){
                console.error('Invalid API response');
                return;
            }

            renderSingleCategoryFAQ(d.posts, categoryName, limit);

        })
        .catch(err => {
            console.error('Failed loading posts:', err);
        });
}

function renderSingleCategoryFAQ(posts, categoryName, limit = 10){

    const content = document.getElementById('posts');
    content.innerHTML = '';

    /* Filter posts for this category */
    const matchedPosts = posts.filter(p =>
        p.categories.some(c =>
            c.name.toLowerCase() === categoryName.toLowerCase()
        )
    );

    const visiblePosts = matchedPosts.slice(0, limit);

    const questionsHtml = visiblePosts.map(q => `
        <div class="faq-item">
            <button class="faq-question">
                <span>${q.title}</span>
                <span class="chevron">⌄</span>
            </button>

            <div class="faq-answer">
                ${q.answers.map(a => `<p>${a.content}</p>`).join('')}
            </div>
        </div>
    `).join('');

    const section = document.createElement('div');
    section.className = 'category-section';

    // section.innerHTML = `
    //     <div class="category-header">
    //         <h2>${categoryName}</h2>
    //         <span>${matchedPosts.length} questions</span>
    //     </div>

    //     <div class="category-box">
    //         ${questionsHtml}
    //     </div>
    // `;

    section.innerHTML = `
        <div class="category-box">
            ${questionsHtml}
        </div>
    `;

    content.appendChild(section);

    bindAccordion(); // only accordion needed
}


function bindAccordion(){
    document.querySelectorAll('.faq-question').forEach(btn=>{
        btn.onclick = ()=>{
            const answer = btn.nextElementSibling;
            const open = answer.style.display === 'block';
            answer.style.display = open ? 'none' : 'block';
        };
    });
}

// Load posts by category ID (alternative to name-based loading)

function loadCategoryPostsById(categoryId, limit = 10, containerId = "posts") {

    const container = document.getElementById(containerId);

    fetch('/api/public/posts.php')
        .then(r => r.json())
        .then(data => {

            const filtered = data.posts.filter(p =>
                p.categories.some(c => c.id == categoryId)
            );

            const posts = filtered.slice(0, limit);

            container.innerHTML = '';

            posts.forEach(p => {

                const div = document.createElement('div');
                div.className = "post";

                div.innerHTML = `
                    <h4>${p.title}</h4>
                    <p>${p.content}</p>
                `;

                p.answers.forEach(a => {
                    div.innerHTML += `<div class="reply">${a.content}</div>`;
                });

                container.appendChild(div);
            });

        });
}

















/* =========================================================
   SKYSAIL APP CARD ANIMATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const cards = document.querySelectorAll(
        ".skysail-app-card"
    );


    if (!cards.length) {
        return;
    }


    /* =====================================================
       SCROLL REVEAL
       ===================================================== */

    const observer = new IntersectionObserver(
        function (entries, observerInstance) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "is-visible"
                    );

                    observerInstance.unobserve(
                        entry.target
                    );
                }

            });

        },
        {
            threshold: 0.18,

            rootMargin:
                "0px 0px -40px 0px"
        }
    );


    /* =====================================================
       OBSERVE CARDS
       ===================================================== */

    cards.forEach(function (card) {

        observer.observe(card);

    });

});

/* Testimonial JS Start */
(() => {
    // This function executes safely without creating global conflicts
    const initializeScopedReadMore = () => {
        // Strictly look for buttons inside your specific news-section component
        const buttons = document.querySelectorAll(".news-section .read-more-btn");

        buttons.forEach(button => {
            button.addEventListener("click", function(event) {
                // Prevent any background click events or slider interruptions
                event.stopPropagation(); 
                
                const quote = this.previousElementSibling; 
                
                // Confirm the target element exists and belongs to this component scope
                if (quote && quote.classList.contains("news-quote")) {
                    quote.classList.toggle("expanded");
                    
                    if (quote.classList.contains("expanded")) {
                        this.textContent = "Read Less";
                    } else {
                        this.textContent = "Read More";
                    }
                }
            });
        });
    };

    // Initialize safely depending on your page load state
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeScopedReadMore);
    } else {
        initializeScopedReadMore();
    }
})();

/* Testiminial JS End */
