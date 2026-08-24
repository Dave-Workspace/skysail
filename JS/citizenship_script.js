document.addEventListener("DOMContentLoaded", () => {


(function(){
  const s=document.createElement("script");
  s.src="https://cdn.jsdelivr.net/npm/flatpickr";
  s.onload=initPickers;
  document.body.appendChild(s);
})();

function initPickers(){
  const config={dateFormat:"Y-m-d", allowInput:false};

  flatpickr("#prDate", config);
  flatpickr("#applyDate", config);

  const origTemp=addTempRow;
  addTempRow=function(){
    origTemp();
    flatpickr(`#tempStart${tempCount}`, config);
    flatpickr(`#tempEnd${tempCount}`, config);
  };

  const origAbsent=addAbsentRow;
  addAbsentRow=function(){
    origAbsent();
    flatpickr(`#absentStart${absentCount}`, config);
    flatpickr(`#absentEnd${absentCount}`, config);
  };
}


const examSelect = document.getElementById("examSelect");
if (examSelect) {


/* ---------------- CLB CALCULATOR ---------------- */

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


const examSelect = document.getElementById("examSelect");
const skills = ["listening","reading","writing","speaking"];

Object.keys(languageTestMappings).forEach(t => examSelect.innerHTML += `<option value="${t}">${t}</option>`);

/*function populateSkillDropdowns(exam){
    skills.forEach(skill=>{
        const dropdown=document.getElementById(skill+"Select");
        dropdown.innerHTML = "";
        const mapping = languageTestMappings[exam][skill];

        Object.entries(mapping).forEach(([val,clb]) => {
            dropdown.innerHTML += `<option value="${val}" data-clb="${clb}">${val}</option>`;
        });
    });
    updateCLBOutputs();
}

function updateCLBOutputs(){
    let clbValues = [];
    skills.forEach(skill=>{
        const drop=document.getElementById(skill+"Select");
        const clb=Number(drop.options[drop.selectedIndex].dataset.clb);
        clbValues.push(clb);
        document.getElementById(skill+"CLB").textContent = "CLB: " + clb;
    });
    document.getElementById("overallCLB").textContent = "Overall CLB: " + Math.min(...clbValues);
}*/


function populateSkillDropdowns(exam) {
    skills.forEach(skill => {
        const dropdown = document.getElementById(skill + "Select");
        dropdown.innerHTML = "";

        const mapping = languageTestMappings[exam][skill];

        if (Array.isArray(mapping)) {
            // Array-based mappings (ranges)
            mapping.forEach(([min, max, clb]) => {
                dropdown.innerHTML += `<option value="${min}-${max}" data-clb="${clb}">${min}-${max}</option>`;
            });
        } else {
            // Object-based mappings (like IELTS/CELPIP)
            Object.entries(mapping).forEach(([val, clb]) => {
                dropdown.innerHTML += `<option value="${val}" data-clb="${clb}">${val}</option>`;
            });
        }
    });

    updateCLBOutputs();
}

function updateCLBOutputs() {
    let clbValues = [];
    skills.forEach(skill => {
        const drop = document.getElementById(skill + "Select");
        const clb = Number(drop.options[drop.selectedIndex].dataset.clb);
        clbValues.push(clb);
        document.getElementById(skill + "CLB").textContent = "CLB: " + clb;
    });
    document.getElementById("overallCLB").textContent = "Overall CLB: " + Math.min(...clbValues);
}



skills.forEach(s=>document.getElementById(s+"Select").addEventListener("change", updateCLBOutputs));
examSelect.addEventListener("change",()=>populateSkillDropdowns(examSelect.value));
populateSkillDropdowns(examSelect.value);
}

/* ---------------- CITIZENSHIP CALCULATOR ---------------- */

document.getElementById("addTempRow").addEventListener("click", addTempRow);
document.getElementById("addAbsentRow").addEventListener("click", addAbsentRow);

let tempCount=0, absentCount=0;

function parseDate(str){ return str ? new Date(str) : null; }

function addTempRow(){
    tempCount++;
    const div=document.createElement("div");
    div.className="citizen-row";
    div.id="tempRow"+tempCount;

    div.innerHTML = `
        <select id="tempType${tempCount}">
            <option value="">Select type</option>
            <option value="Visitor">Visitor</option>
            <option value="Student">Student</option>
            <option value="Worker">Worker</option>
            <option value="TRP">TRP</option>
            <option value="Protected">Protected</option>
        </select>
        <input type="date" id="tempStart${tempCount}" class="fp-date" readonly>
        <input type="date" id="tempEnd${tempCount}" class="fp-date" readonly>
        <button class="delete-btn" onclick="deleteRow('tempRow${tempCount}')">X</button>
    `;

    //div.querySelectorAll("input").forEach(x => x.addEventListener("change", calculateCitizenDays));
    div.querySelectorAll("input").forEach(x => x.addEventListener("change", () => {
    const type = document.getElementById(`tempType${tempCount}`).value;
    if(!type){
        alert("Please select a type for this temporary stay.");
        x.value = "";
        return;
    }
    calculateCitizenDays();
    }));


    const deleteBtn = div.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
        deleteRow(div.id);
    });



    document.getElementById("tempContainer").appendChild(div);

    // Initialize Flatpickr on the new inputs
    const config = { dateFormat: "Y-m-d", allowInput: false };
    flatpickr(`#tempStart${tempCount}`, config);
    flatpickr(`#tempEnd${tempCount}`, config);

    // Optional: add change listener to recalc
    div.querySelectorAll(".fp-date").forEach(x => x.addEventListener("change", calculateCitizenDays));
}

function addAbsentRow(){
    absentCount++;
    const div=document.createElement("div");
    div.className="citizen-row";
    div.id="absentRow"+absentCount;

    div.innerHTML = `
        <input type="date" id="absentStart${absentCount}" class="fp-date" readonly>
        <input type="date" id="absentEnd${absentCount}" class="fp-date" readonly>
        <button class="delete-btn" >X</button>
    `;

    div.querySelectorAll("input").forEach(x => x.addEventListener("change", calculateCitizenDays));

    const deleteBtn = div.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
        deleteRow(div.id);
    });

    document.getElementById("absentContainer").appendChild(div);

    // Initialize Flatpickr on the new inputs
    const config = { dateFormat: "Y-m-d", allowInput: false };
    flatpickr(`#absentStart${absentCount}`, config);
    flatpickr(`#absentEnd${absentCount}`, config);

    // Optional: add change listener to recalc
    div.querySelectorAll(".fp-date").forEach(x => x.addEventListener("change", calculateCitizenDays));

}

function deleteRow(id){
    const row=document.getElementById(id);
    if(row) row.remove();
    calculateCitizenDays();
}

function calculateCitizenDays(){
    const prInput = document.getElementById("prDate");
    const applyInput = document.getElementById("applyDate");

    const pr = parseDate(prInput.value);
    const apply = parseDate(applyInput.value);

    if(!pr || !apply) return;

    /* --------------- RULE: PR MUST BE <= APPLICATION (Option A) --------------- */
    if(pr > apply){
        alert("PR Date cannot be later than the Application Date.");
        prInput.value = "";
        return;
    }

    /* --------------- PR Days --------------- */
    const prDays = Math.floor((apply - pr) / (1000*60*60*24)) + 1;

    let tempTotal = 0, absentTotal = 0;

    /* --------------- TEMPORARY STAYS VALIDATION --------------- */
    for(let i=1; i<=tempCount; i++){
        const s = document.getElementById("tempStart"+i);
        const e = document.getElementById("tempEnd"+i);
        if(!s || !e) continue;

        let start = parseDate(s.value);
        let end = parseDate(e.value);
        if(!start || !end) continue;

        // Rule 1: Start ≤ End
        if(start > end){
            alert("Temporary stay start date cannot be after end date.");
            s.value = ""; e.value = "";
            continue;
        }

        // Rule 2: TR dates cannot exceed PR Start
        if(start > pr || end > pr){
            alert("Temporary resident dates must NOT exceed your PR start date.");
            s.value = ""; e.value = "";
            continue;
        }

        // Count TR days (0.5/day)
        const days = ((end - start) / (1000*60*60*24) + 1) * 0.5;
        tempTotal += days;
    }

    /* --------------- ABSENT DAYS (No PR Limit) --------------- */
    for(let i=1;i<=absentCount;i++){
        const s=document.getElementById("absentStart"+i);
        const e=document.getElementById("absentEnd"+i);
        if(!s || !e) continue;

        let start=parseDate(s.value), end=parseDate(e.value);
        if(!start || !end) continue;

        if(start > end){
            alert("Absence start date cannot be after end date.");
            s.value=""; e.value="";
            continue;
        }

        const days=((end-start)/(1000*60*60*24)+1);
        absentTotal+=days;
    }

    const total=Math.max(0, prDays + tempTotal - absentTotal);

    document.getElementById("prDays").textContent = prDays;
    document.getElementById("tempDays").textContent = tempTotal.toFixed(1);
    document.getElementById("absentDays").textContent = absentTotal;
    document.getElementById("totalDays").textContent = total;

    // Progress bar: 1095 days requirement
    let progress = Math.min(100, (total/1095)*100);
    const bar = document.getElementById("citizenProgress");
    bar.style.width = progress+"%";
    //bar.textContent = Math.round(progress)+"%";
    bar.textContent = progress.toFixed(2) + "%"; // 2 decimals

    // Congratulation message
const msg = document.getElementById("congratsMessage");
if(progress === 100){
  bar.style.background = "#309f29"; 
    msg.innerHTML = `<span class="party-pop">🎉 Congratulations! You are eligible for citizenship! 🎉</span>`;
} else {
   bar.style.background = "#3498db"; // default blue
    msg.textContent = "";
}


}

document.getElementById("prDate").addEventListener("change", calculateCitizenDays);
document.getElementById("applyDate").addEventListener("change", calculateCitizenDays);

});

