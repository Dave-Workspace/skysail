(function () {

    "use strict";

    /* ================================
       MENU DATA
    ================================= */

    const skyMenus = {

        study: {
            kicker: "Study in Canada",
            title: "Start Your Canadian Study Journey",
            description: "Explore Canadian colleges and universities, language requirements, study permits, student visa services and post-graduation opportunities.",
            landing: "/study-in-canada.html",
            landingText: "Explore Study in Canada →",
            image: "https://www.skysailimmigration.com/Images/Study.png",

            services: [
                ["IELTS / CELPIP", "Language Tests & Scores", "/ielts-celpip-preparation.html", "amber", "book"],
                ["SOP Writing", "Statement of Purpose", "/statement-of-purpose.html", "cyan", "document"],
                ["Student Visa", "Application Support", "/student-visa-application.html", "pink", "education"],
                ["Post Graduation", "Work Permit / PGWP", "/post-graduation-work-permit.html", "purple", "info"],
                ["Study Permit", "New Applications", "/study-permit-extension.html", "amber", "permit"],
                ["TRV Application", "Temporary Resident Visa", "/temporary-resident-visa.html", "pink", "folder"],
                ["ATIP Notes", "Renew Study Status", "/atip-gcms-notes.html", "cyan", "refresh"],
                ["Co-op Permit", "Work Placement", "/co-op-work-permit.html", "purple", "work"],
                ["Language Coaching", "English & Communication Skills", "#", "cyan", "language"]
            ]
        },

        work: {
            kicker: "Work in Canada",
            title: "Build Your Canadian Work Journey",
            description: "Explore work permits, LMIA pathways, employer-supported applications and Canadian work opportunities.",
            landing: "/work-in-canada.html",
            landingText: "Explore Work in Canada →",
            image: "https://www.skysailimmigration.com/Images/Can_Work_1.png",

            services: [
                ["Work Permit", "Work in Canada", "/work-permit-application.html", "amber", "work"],
                ["LMIA", "Employer Supported Work", "/post-graduation-work-permit.html", "cyan", "building"],
                ["Open Work Permit", "Eligible Applicants", "/bridging-open-work-permit.html", "pink", "person"],
                ["Spousal Work Permit", "Family Work Options", "/dependent-work-permit.html", "purple", "heart"],
                ["Work Permit Extension", "Extend Your Status", "/work/extension", "amber", "refresh"],
                ["Employer Change", "Change Employment", "/work/employer-change", "cyan", "change"]
            ]
        },

        visit: {
            kicker: "Visit Canada",
            title: "Plan Your Visit to Canada",
            description: "Get support with visitor visas, family visits, invitations and temporary resident applications.",
            landing: "/visit-canada.html",
            landingText: "Explore Visit Canada →",
            image: "https://www.skysailimmigration.com/Images/Visit_Main.png",

            services: [
                ["Visitor Visa", "Temporary Resident Visa", "/visit/visitor-visa", "amber", "document"],
                ["Family Visit", "Visit Family in Canada", "/visit/family", "cyan", "family"],
                ["Super Visa", "Parents & Grandparents", "/visit/super-visa", "pink", "star"],
                ["Invitation Letter", "Visitor Documentation", "/visit/invitation", "purple", "mail"],
                ["Visa Extension", "Extend Your Stay", "/visit/extension", "amber", "refresh"],
                ["TRV", "Temporary Resident Visa", "/visit/trv", "cyan", "folder"]
            ]
        },

        settle: {
            kicker: "Settle in Canada",
            title: "Start Your Permanent Residency Journey",
            description: "Explore permanent residence pathways and find the right immigration program for your Canadian future.",
            landing: "/settle-in-canada.html",
            landingText: "Explore Settlement Options →",
            image: "https://www.skysailimmigration.com/Images/Settle_Main_3.png",

            services: [
                ["Express Entry", "Federal Skilled Programs", "/settle/express-entry", "amber", "arrow"],
                ["PNP", "Provincial Nominee Programs", "/settle/pnp", "cyan", "shield"],
                ["Family Sponsorship", "Sponsor Your Family", "/settle/family-sponsorship", "pink", "heart"],
                ["Atlantic Program", "Atlantic Immigration", "/settle/atlantic", "purple", "star"],
                ["Rural Programs", "Rural Immigration", "/settle/rural", "amber", "home"],
                ["PR Application", "Permanent Residence", "/settle/pr", "cyan", "document"]
            ]
        },

        other: {
            kicker: "Other Services",
            title: "More Canadian Immigration Solutions",
            description: "Explore additional immigration services, citizenship options and application support.",
            landing: "/immigration-services",
            landingText: "Explore All Services →",
            image: "https://www.skysailimmigration.com/Images/Other.png",

            services: [
                ["Citizenship", "Canadian Citizenship", "/other/citizenship", "amber", "shield"],
                ["PR Card", "PR Card Services", "/other/pr-card", "cyan", "card"],
                ["Citizenship Certificate", "Proof of Citizenship", "/other/certificate", "pink", "certificate"],
                ["Application Review", "Document Review", "/other/application-review", "purple", "review"],
                ["Refusal Support", "Application Assistance", "/other/refusal", "amber", "info"],
                ["Immigration Consultation", "Professional Guidance", "/other/consultation", "cyan", "language"]
            ]
        }

    };


    /* ================================
       ICONS
    ================================= */

    function skyIcon(type) {

        const paths = {

            book: "<path d='M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-10 14H3V6h8v12zm10 0h-8V6h8v12z'/>",

            document: "<path d='M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM15 9V3.5L18.5 9H15z'/>",

            education: "<path d='M12 3L1 9l11 6 9-4.91V17h2V9L12 3z'/>",

            info: "<path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'/>",

            permit: "<path d='M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z'/>",

            refresh: "<path d='M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8z'/>",

            folder: "<path d='M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z'/>",

            work: "<path d='M20 6h-4V4c0-1.1-.9-2-2-2h-4C8.9 2 8 2.9 8 4v2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 0h-4V4h4v2z'/>",

            building: "<path d='M12 2L2 7v2h20V7L12 2zm-8 9v9H2v2h20v-2h-2v-9h-2v9h-3v-9h-2v9H9v-9H7v9H4v-9z'/>",

            person: "<path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/>",

            heart: "<path d='M12 21s-7-4.35-9.33-8.28C.72 9.42 2.16 5 6.5 5c2.04 0 3.42 1.16 4.5 2.5C12.08 6.16 13.46 5 15.5 5c4.34 0 5.78 4.42 3.83 7.72C19 16.65 12 21 12 21z'/>",

            change: "<path d='M7 7h10v3l4-4-4-4v3H7v2zm10 10H7v-3l-4 4 4 4v-3h10v-2z'/>",

            family: "<path d='M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13z'/>",

            star: "<path d='M12 2l2.4 6.9H22l-6.1 4.4 2.3 6.9-6.2-4.2-6.2 4.2 2.3-6.9L2 8.9h7.6L12 2z'/>",

            mail: "<path d='M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'/>",

            arrow: "<path d='M4 17l5-5-5-5 1.4-1.4L11.8 12l-6.4 6.4L4 17zm8 0h8v2h-8v-2z'/>",

            shield: "<path d='M12 2l8 4v6c0 5-3.5 9.7-8 11-4.5-1.3-8-6-8-11V6l8-4zm0 4L7 8v4c0 3.5 2.3 6.9 5 8 2.7-1.1 5-4.5 5-8V8l-5-2z'/>",

            home: "<path d='M12 3l9 8h-3v9h-5v-6h-2v6H6v-9H3l9-8z'/>",

            card: "<path d='M4 5h16v14H4V5zm2 3v2h6V8H6zm0 4v2h4v-2H6zm8-4v6h4V8h-4z'/>",

            certificate: "<path d='M6 2h9l5 5v15H6V2zm8 2v5h5M9 13h6v2H9v-2zm0 4h6v2H9v-2z'/>",

            review: "<path d='M9 2h6v2h3c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h3V2zm0 8v2h6v-2H9zm0 4v2h6v-2H9z'/>",

            language: "<path d='M12 3C6.48 3 2 6.58 2 11c0 2.39 1.36 4.52 3.5 5.84L4 21l5.15-2.57c.91.36 1.87.57 2.85.57 5.52 0 10-3.58 10-8S17.52 3 12 3zm-4 4h8v2H8V7zm0 3h8v2H8v-2z'/>"
        };

        return `<svg viewBox="0 0 24 24" fill="currentColor">${paths[type] || paths.info}</svg>`;
    }


    /* ================================
       INITIALIZE
    ================================= */

    function skyInitMenu() {

        const skyOverlay = document.getElementById("skySubmenuOverlay");
        const skyGrid = document.getElementById("skyServiceGrid");
        const skyMobileMenu = document.getElementById("skyMobileMenu");

        const skyKicker = document.getElementById("skySubmenuKicker");
        const skyTitle = document.getElementById("skySubmenuTitle");
        const skyDescription = document.getElementById("skySubmenuDescription");
        const skyLanding = document.getElementById("skySubmenuLanding");
        const skyImage = document.getElementById("skySubmenuImage");
        const skyMobileTitle = document.getElementById("skyMobileMenuTitle");

        const skyMobileButton = document.getElementById("skyMobileButton");
        const skyClose = document.getElementById("skyCloseSubmenu");


        /* ================================
           OPEN SUBMENU
        ================================= */

        function skyOpenMenu(name) {

            const menu = skyMenus[name];

            if (!menu) {
                return;
            }

            if (skyKicker) {
                skyKicker.textContent = menu.kicker;
            }

            if (skyTitle) {
                skyTitle.textContent = menu.title;
            }

            if (skyDescription) {
                skyDescription.textContent = menu.description;
            }

            if (skyLanding) {
                skyLanding.href = menu.landing;
                skyLanding.textContent = menu.landingText;
            }

            if (skyImage) {
                skyImage.src = menu.image;
                skyImage.alt = menu.title;
            }

            if (skyMobileTitle) {
                skyMobileTitle.textContent = menu.kicker;
            }

            if (skyGrid) {

                skyGrid.innerHTML = "";

                menu.services.forEach(function (service) {

                    const card = document.createElement("a");

                    card.href = service[2];

                    card.className =
                        "sky-service-card sky-glow-" + service[3];

                    card.innerHTML = `
                        <div class="sky-icon">
                            ${skyIcon(service[4])}
                        </div>

                        <div class="sky-card-text">
                            <span class="sky-card-title">
                                ${service[0]}
                            </span>

                            <span class="sky-card-subtitle">
                                ${service[1]}
                            </span>
                        </div>
                    `;

                    skyGrid.appendChild(card);

                });
            }


            if (skyOverlay) {
                skyOverlay.classList.add("sky-open");
            }

            if (skyMobileMenu) {
                skyMobileMenu.classList.remove("sky-open");
            }


            document
                .querySelectorAll(".sky-nav-link")
                .forEach(function (button) {

                    button.classList.remove("sky-active");

                });


            const activeButton = document.querySelector(
                `.sky-nav-link[data-sky-menu="${name}"]`
            );

            if (activeButton) {
                activeButton.classList.add("sky-active");
            }

        }


        /* ================================
           CLOSE SUBMENU
        ================================= */

        function skyCloseMenu() {

            if (skyOverlay) {
                skyOverlay.classList.remove("sky-open");
            }

            document
                .querySelectorAll(".sky-nav-link")
                .forEach(function (button) {

                    button.classList.remove("sky-active");

                });

        }


        /* ================================
           MENU BUTTONS
        ================================= */

        document
            .querySelectorAll("[data-sky-menu]")
            .forEach(function (button) {

                button.addEventListener("click", function (event) {

                    /*
                     * If this is a link, prevent navigation
                     * so the submenu can open.
                     */
                    event.preventDefault();

                    skyOpenMenu(this.dataset.skyMenu);

                });

            });


        /* ================================
           MOBILE BUTTON
        ================================= */

        if (skyMobileButton && skyMobileMenu) {

            skyMobileButton.addEventListener("click", function (event) {

                event.preventDefault();

                skyMobileMenu.classList.toggle("sky-open");

            });

        }


        /* ================================
           CLOSE BUTTON
        ================================= */

        if (skyClose) {

            skyClose.addEventListener(
                "click",
                skyCloseMenu
            );

        }


        /* ================================
           OVERLAY CLICK
        ================================= */

        if (skyOverlay) {

            skyOverlay.addEventListener("click", function (event) {

                if (event.target === skyOverlay) {

                    skyCloseMenu();

                }

            });

        }


        /* ================================
           ESCAPE KEY
        ================================= */

        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {

                skyCloseMenu();

                if (skyMobileMenu) {

                    skyMobileMenu.classList.remove("sky-open");

                }

            }

        });

    }


    /* ================================
       START
    ================================= */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            skyInitMenu
        );

    } else {

        skyInitMenu();

    }

})();
