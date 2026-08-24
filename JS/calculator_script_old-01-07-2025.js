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
        const agricultureModal = document.getElementById("modal-agriculture");
        if (agricultureModal) initTable(agricultureModal);
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
            //const isMarried = maritalStatus === 'with';
            const isMarried = maritalStatus === 'with' && spouseCheckbox?.checked;

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

                //Spouse studied in Canada (2+ years)	5
                if (getInputValue('crs_spouse_education') >= 7) {
                    additionalPointFSW += 5;
                }


                //Spouse has CLB 4+ in all language abilities	5
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


                //Spouse worked in Canada (1+ year)	5
                if (getInputValue('crs_spouse_work') >= 5) {
                    additionalPointFSW += 5;
                }

            }

            //You studied in Canada (2+ years)	5
            if (isSelectedAtOrAbove("crs_can_edu", 3)) { additionalPointFSW += 5; }

            //You worked in Canada (1+ year)	10
            if (isSelectedAtOrAbove("crs_canWork", 3)) { additionalPointFSW += 10; }


            //Arranged employment in Canada	5
            const dropdownWork = document.getElementById("crs_canWork");
            // Make sure dropdown exists and something is selected
            if (dropdownWork && dropdownWork.selectedIndex >= 0) {
                // Check if "Valid Job Offer" is selected (index 1)
                if (dropdownWork.selectedIndex === 1) {
                    additionalPointFSW += 5;
                }
            }


            //You or spouse have a relative in Canada (18+, PR/citizen, close relative)	5
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

                if (isChecked("experience_agriculture")) {
                    appendEligibilityCard("Category‑based (Agriculture / Agri‑food)", "Agri", () => {
                        readAndRender("CRS", (row) => {
                            const col5 = row[4] ? row[4].toString() : "";
                            return col5.includes("Agri");
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
        function calculateOINPoints() {
            const stream = document.getElementById('oinp_stream').value;


            ['lng_oinp', 'wrk_oinp', 'edu_oinp', 'tot_oinp'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = 0;
                else console.log(`Element with ID "${id}" not found.`);
            });




            //const getRadioVal = name => {
            //  const el = document.querySelector(`input[name="${name}"]:checked`);
            //  return el ? parseInt(el.value) : 0;
            //};



            // Hide all sections first
            document.querySelectorAll('.oinp-section').forEach(sec => {
                sec.style.display = 'none';
            });
            // Show only those matching `data-for`
            if (stream) {
                document.querySelectorAll('.oinp-section').forEach(sec => {
                    const forAttr = sec.getAttribute('data-for');
                    if (forAttr && forAttr.split(' ').includes(stream)) {
                        sec.style.display = 'block';
                    }
                });
            }



            // If no stream, zero total
            if (!stream) {
                updateTotalBox(0, forms.oinp.maxPoints);
                return;
            }

            let total = 0;

            // Shared / overlapping fields
            if (isOINPSectionVisible('noc_teer')) {
                total += getVal('noc_teer');
                document.getElementById('wrk_oinp').textContent = (parseInt(document.getElementById('wrk_oinp').textContent) || 0) + getVal('noc_teer');

            }

            if (isOINPSectionVisible('broad_occup_cat')) {
                total += getVal('broad_occup_cat');
                document.getElementById('wrk_oinp').textContent = (parseInt(document.getElementById('wrk_oinp').textContent) || 0) + getVal('broad_occup_cat');

            }

            if (isOINPSectionVisible('job_offer_wage')) {

                total += getVal('job_offer_wage');
                document.getElementById('wrk_oinp').textContent = (parseInt(document.getElementById('wrk_oinp').textContent) || 0) + getVal('job_offer_wage');

            }


            if (isOINPSectionVisible('work_permit_status')) {

                total += getRadioVal('work_permit_status');
                document.getElementById('wrk_oinp').textContent = (parseInt(document.getElementById('wrk_oinp').textContent) || 0) + getRadioVal('work_permit_status');

            }

            if (isOINPSectionVisible('job_tenure')) {

                total += getRadioVal('job_tenure');
                document.getElementById('wrk_oinp').textContent = (parseInt(document.getElementById('wrk_oinp').textContent) || 0) + getRadioVal('job_tenure');

            }

            if (isOINPSectionVisible('earnings_history')) {
                total += getRadioVal('earnings_history');
                document.getElementById('wrk_oinp').textContent = (parseInt(document.getElementById('wrk_oinp').textContent) || 0) + getRadioVal('earnings_history');

            }

            document.getElementById('tot_oinp').textContent = total;


            if (isOINPSectionVisible('official_language_ability')) {
		if (stream !== 'in_demand_skills') {
                	total += getVal('official_language_ability');
                	document.getElementById('lng_oinp').textContent = (parseInt(document.getElementById('lng_oinp').textContent) || 0) + getVal('official_language_ability');
		}
            }

            if (isOINPSectionVisible('knowledge_official_languages')) {
		if (stream !== 'in_demand_skills') {
                	total += getVal('knowledge_official_languages');
                	document.getElementById('lng_oinp').textContent = (parseInt(document.getElementById('lng_oinp').textContent) || 0) + getVal('knowledge_official_languages');
		}
            }


            document.getElementById('tot_oinp').textContent = total;

            if (isOINPSectionVisible('job_location')) {

                total += getVal('job_location');
                document.getElementById('wrk_oinp').textContent = (parseInt(document.getElementById('wrk_oinp').textContent) || 0) + getVal('job_location');

            }

            document.getElementById('tot_oinp').textContent = total;

            if (isOINPSectionVisible('location_of_study')) {

                total += getVal('location_of_study');
                document.getElementById('edu_oinp').textContent = (parseInt(document.getElementById('edu_oinp').textContent) || 0) + getVal('location_of_study');

            }


            document.getElementById('tot_oinp').textContent = total;


            if (isOINPSectionVisible('highest_education')) {

                total += getVal('highest_education');
                document.getElementById('edu_oinp').textContent = (parseInt(document.getElementById('edu_oinp').textContent) || 0) + getVal('highest_education');
            }


            if (isOINPSectionVisible('field_of_study')) {

                total += getVal('field_of_study');
                document.getElementById('edu_oinp').textContent = (parseInt(document.getElementById('edu_oinp').textContent) || 0) + getVal('field_of_study');
            }


            if (isOINPSectionVisible('canadian_education_exp')) {

                total += getVal('canadian_education_exp');
                document.getElementById('edu_oinp').textContent = (parseInt(document.getElementById('edu_oinp').textContent) || 0) + getVal('canadian_education_exp');
            }



            /* // Stream-specific additions
             if (stream === 'foreign_worker' || stream === 'international_student') {
               total += getVal('highest_education');
               total += getVal('field_of_study');
               total += getVal('canadian_education_exp');
         
             }
         
             // For masters_graduate or phd_graduate, you may adjust which fields count
             if (stream === 'masters_graduate' || stream === 'phd_graduate') {
               // Some fields may not apply; you could subtract or omit them above
               total += getVal('highest_education');
               total += getVal('field_of_study');
               total += getVal('canadian_education_exp');
         
             }*/

            // Ensure we don’t exceed max
            const maxPts = forms.oinp.maxPoints;
            if (total > maxPts) total = maxPts;

            document.getElementById('tot_oinp').textContent = total;


            updateTotalBox(total);
        }


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
                divMarriedFactor.classList.remove('hidden');

                // Show spouse section only if checkbox is checked
                //spouseSection.style.display = spouseFactorCheckbox.checked ? 'block' : 'none';
                if (spouseFactorCheckbox.checked) {
                    spouseSection.classList.remove('hidden');
                } else {
                    spouseSection.classList.add('hidden');
                }
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
        document.querySelector('input[name="crs_maritalFactor"]').addEventListener('change', () => {
            toggleMaritalSections();
            calculateCRSPoints();
        });





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

