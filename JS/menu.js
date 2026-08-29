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
            image: "Images/Study.png",

            services: [
                ["IELTS / CELPIP", "Test Booking & Preparation", "/ielts-celpip-preparation.html", "amber", "ielts"],
                ["SOP Writing", "Statement of Purpose", "/statement-of-purpose.html", "cyan", "sop"],
                ["Student Visa", "Application Support", "/student-visa-application.html", "pink", "studentVisa"],
                ["PGWP", "Post Graduation Work Permit / PGWP", "/post-graduation-work-permit.html", "purple", "pgwp"],
                ["Study Permit Extension", "Extend Your Study Permit", "/study-permit-extension.html", "amber", "permitExtension"],
                ["TRV Application", "Temporary Resident Visa", "/temporary-resident-visa.html", "cyan", "studyTrv"],
                ["ATIP / GCMS Notes", "Application Information", "/atip-gcms-notes.html", "pink", "folder"],
                ["Co-op Permit", "Work Permit", "/co-op-work-permit.html", "purple", "coop"],
                ["Language Coaching", "English & Communication Skills", "#", "cyan", "languageCoaching"]
            ]
        },

        work: {
            kicker: "Work in Canada",
            title: "Build Your Canadian Work Journey",
            description: "Explore work permits, LMIA pathways, employer-supported applications and Canadian work opportunities.",
            landing: "/work-in-canada.html",
            landingText: "Explore Work in Canada →",
            image: "Images/Can_Work_1.png",

            services: [
                ["Work Permit Extension", "Extend Your Status", "/work-permit-application.html", "amber", "workPermit"],
                ["PGWP", "Post Graduation Work Permit", "/post-graduation-work-permit.html", "cyan", "pgwp"],
                ["Bridging Open Work Permit", "BOWP Application", "/bridging-open-work-permit.html", "pink", "workExtension"],
                ["Dependent Work Permit", "Spouse & Family Work Permit", "/dependent-work-permit.html", "purple", "spousalWorkPermit"]               
            ]
        },

        visit: {
            kicker: "Visit Canada",
            title: "Plan Your Visit to Canada",
            description: "Get support with visitor visas, family visits, invitations and temporary resident applications.",
            landing: "/visit-canada.html",
            landingText: "Explore Visit Canada →",
            image: "Images/Visit_Main.png",

            services: [
                ["Visitor Visa", "Tourism & Family Visits", "/visitor-visa.html", "amber", "visitorVisa"],
                ["Convention Visit", "Attend Graduation Ceremonies", "/convocation-visit-visa.html", "cyan", "familyVisit"],
                ["Visa Extension", "Extend Your Stay", "/visitor-visa-extension.html", "pink", "visaExtension"],
                ["Super Visa", "Parents & Grandparents", "/super-visa.html", "purple", "superVisa"]
            ]
        },

        settle: {
            kicker: "Settle in Canada",
            title: "Start Your Permanent Residency Journey",
            description: "Explore permanent residence pathways and find the right immigration program for your Canadian future.",
            landing: "/settle-in-canada.html",
            landingText: "Explore Settlement Options →",
            image: "Images/Settle_Main_3.png",

            services: [
                ["Citizenship", "Canadian Citizenship", "/citizenship-application.html", "amber", "citizenship"],
                ["Dependent PR", "Family Sponsorship Support", "/dependent-pr-process.html", "cyan", "peopleRoof"],
                ["PGP", "Parent & Grandparent PR", "/parents-grandparents-program.html", "pink", "peopleArrows"],
                ["PR Card", "Renewal / Replacement", "/pr-card-renewal.html", "purple", "prCard"],
                ["Express Entry", "FSW / CEC / FSTP", "/express-entry-pr.html", "cyan", "expressEntry"],
                ["PR Travel Document", "PRTD Application", "/permanent-resident-travel-document.html", "pink", "permit"]
            ]
        },

        other: {
            kicker: "Other Services",
            title: "More Canadian Immigration Solutions",
            description: "Explore additional immigration services, citizenship options and application support.",
            landing: "/immigration-services",
            landingText: "Explore All Services →",
            image: "Images/Other_Main.png",

            services: [
                ["ATIP / GCMS Notes", "Request Application Notes", "/atip-gcms-notes.html", "amber", "folder"],
                ["Amendment of Legal Documents", "Correct or Update Documents", "/authorization-legal-documents.html", "cyan", "fileSignature"],
                ["Reconsideration Request", "Review a Refused Application", "/request-fair-review.html", "pink", "magnifyingGlass"],
                ["Procedural Fairness Letter", "PFL Response Support", "/process-fairness-letter.html", "purple", "scaleBalanced"]
            ]
        }

    };


    /* ================================
       ICONS
    ================================= */

   function skyIcon(type) {

    const icons = {

        /* =================================
           STUDY IN CANADA
        ================================= */

        ielts:
            "fa-solid fa-language",

        sop:
            "fa-solid fa-file-pen",

        studentVisa:
            "fa-solid fa-passport",

        pgwp:
            "fa-solid fa-graduation-cap",

        permitExtension:
            "fa-solid fa-arrows-rotate",

        studyTrv:
            "fa-solid fa-passport",

        folder:
            "fa-solid fa-folder-open",

        coop:
            "fa-solid fa-briefcase",

        languageCoaching:
            "fa-solid fa-comments",


        /* =================================
           WORK IN CANADA
        ================================= */

        workPermit:
            "fa-solid fa-id-card",

        workExtension:
            "fa-solid fa-arrows-rotate",

        spousalWorkPermit:
            "fa-solid fa-people-roof",

        employerChange:
            "fa-solid fa-right-left",


        /* =================================
           VISIT CANADA
        ================================= */

        visitorVisa:
            "fa-solid fa-passport",

        familyVisit:
            "fa-solid fa-people-group",

        superVisa:
            "fa-solid fa-users",

        invitation:
            "fa-solid fa-envelope-open-text",

        visaExtension:
            "fa-solid fa-calendar-plus",

        visitTrv:
            "fa-solid fa-passport",


        /* =================================
           PERMANENT RESIDENCY
        ================================= */

        citizenship:
            "fa-solid fa-flag",

        peopleRoof:
            "fa-solid fa-people-roof",

        peopleArrows:
            "fa-solid fa-people-arrows",

        prCard:
            "fa-solid fa-address-card",

        expressEntry:
            "fa-solid fa-arrow-right-to-bracket",

        permit:
            "fa-solid fa-file-signature",


        /* =================================
           OTHER / LEGAL
        ================================= */

        fileSignature:
            "fa-solid fa-file-signature",

        magnifyingGlass:
            "fa-solid fa-magnifying-glass",

        scaleBalanced:
            "fa-solid fa-scale-balanced",

        review:
            "fa-solid fa-file-circle-check",

        certificate:
            "fa-solid fa-certificate",

        document:
            "fa-solid fa-file-lines",

        info:
            "fa-solid fa-circle-info"

    };

    return `
        <i
            class="${icons[type] || 'fa-solid fa-circle-info'}"
            aria-hidden="true">
        </i>
    `;
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
