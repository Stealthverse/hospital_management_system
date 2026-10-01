let patients = JSON.parse(localStorage.getItem('hms_patients')) || [
    { id: '#P-1001', name: 'Sarah Connor', age: 34, dept: 'Cardiology', status: 'Admitted', history: 'Blood Pressure: 120/80. Past ECG normal. Diagnosed with mild arrhythmia.' },
    { id: '#P-1002', name: 'John Doe', age: 45, dept: 'Neurology', status: 'Consultation', history: 'Complaints of chronic migraines. Prescribed initial neuroscan.' }
];

let appointments = JSON.parse(localStorage.getItem('hms_appointments')) || [
    { patient: 'Sarah Connor', doctor: 'Dr. Robert Smith (Cardiology)', time: 'Sept 8, 2026 - 10:30 AM', status: 'Confirmed' },
    { patient: 'John Doe', doctor: 'Dr. Gregory House (Diagnostics)', time: 'Sept 10, 2026 - 2:00 PM', status: 'Confirmed' }
];

let invoices = JSON.parse(localStorage.getItem('hms_invoices')) || [
    { id: '#INV-501', patient: 'Sarah Connor', items: 'ICU Room Stay (2 Days), Blood Test Panel, 12-Lead ECG', amount: 1250.00, status: 'Paid' },
    { id: '#INV-502', patient: 'John Doe', items: 'Specialist Consultation, Prescribed Anticonvulsants', amount: 180.00, status: 'Pending' }
];

function savePatients() {
    localStorage.setItem('hms_patients', JSON.stringify(patients));
}

function saveAppointments() {
    localStorage.setItem('hms_appointments', JSON.stringify(appointments));
}

function saveInvoices() {
    localStorage.setItem('hms_invoices', JSON.stringify(invoices));
}

function renderPatients() {
    const tableBody = document.getElementById('patientTableBody');
    if (!tableBody) return;
    tableBody.innerHTML = '';
    
    const role = localStorage.getItem('userRole');
    const currentUserName = localStorage.getItem('userName');

    let displayedPatients = patients;
    if (role === 'patient' && currentUserName) {
        displayedPatients = patients.filter(p => p.name.toLowerCase() === currentUserName.toLowerCase());
    }

    displayedPatients.forEach((p, index) => {
        const actualIndex = patients.findIndex(item => item.id === p.id);
        const row = document.createElement('tr');
        row.className = "border-b hover:bg-slate-50 transition";
        row.innerHTML = `
            <td class="p-3 font-mono text-xs text-slate-500">${p.id}</td>
            <td class="p-3 font-semibold text-slate-800">${p.name}</td>
            <td class="p-3">${p.age} yrs</td>
            <td class="p-3"><span class="bg-sky-50 text-sky-700 px-2.5 py-0.5 rounded-full text-xs font-medium">${p.dept}</span></td>
            <td class="p-3"><span class="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-semibold">${p.status}</span></td>
            <td class="p-3 space-x-2">
                <button onclick="viewHistory('${p.name}', '${p.dept}', '${p.history}')" class="text-sky-600 hover:underline font-medium text-xs bg-sky-50 px-2.5 py-1 rounded">EMR File</button>
                ${role !== 'patient' ? `<button onclick="deletePatient(${actualIndex})" class="text-rose-500 hover:text-rose-700 text-xs"><i class="fa-solid fa-trash"></i></button>` : ''}
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function renderAppointments() {
    const listEl = document.getElementById('appointmentsList');
    if (!listEl) return;
    listEl.innerHTML = '';

    const role = localStorage.getItem('userRole');
    const currentUserName = localStorage.getItem('userName');

    let displayedAppointments = appointments;
    if (role === 'patient' && currentUserName) {
        displayedAppointments = appointments.filter(appt => appt.patient.toLowerCase() === currentUserName.toLowerCase());
    }

    displayedAppointments.forEach((appt, index) => {
        const actualIndex = appointments.findIndex(item => item.patient === appt.patient && item.time === appt.time);
        const item = document.createElement('div');
        item.className = "p-4 border border-slate-100 rounded-xl flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 transition";
        item.innerHTML = `
            <div>
                <h4 class="font-bold text-slate-800">${appt.patient}</h4>
                <p class="text-sm text-slate-600 mt-0.5">Specialist: <span class="font-medium text-slate-700">${appt.doctor}</span></p>
                <p class="text-xs text-slate-400 mt-0.5"><i class="fa-regular fa-clock mr-1"></i>${appt.time}</p>
            </div>
            <div class="flex items-center space-x-3">
                <span class="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-xs font-semibold">${appt.status}</span>
                <button onclick="deleteAppointment(${actualIndex})" class="text-rose-400 hover:text-rose-600 text-sm p-2"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        listEl.appendChild(item);
    });
}

function renderBilling() {
    const tableBody = document.getElementById('billingTableBody');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    const role = localStorage.getItem('userRole');
    const currentUserName = localStorage.getItem('userName');

    let displayedInvoices = invoices;
    if (role === 'patient' && currentUserName) {
        displayedInvoices = invoices.filter(inv => inv.patient.toLowerCase() === currentUserName.toLowerCase());
    }

    displayedInvoices.forEach((inv) => {
        let statusBadge = inv.status === 'Paid' 
            ? '<span class="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-bold">Paid</span>' 
            : '<span class="bg-rose-100 text-rose-700 px-2.5 py-1 rounded-full text-xs font-bold">Pending</span>';

        const row = document.createElement('tr');
        row.className = "border-b border-slate-100 hover:bg-slate-50";
        row.innerHTML = `
            <td class="p-3 font-semibold font-mono text-xs text-slate-500">${inv.id}</td>
            <td class="p-3 font-semibold text-slate-800">${inv.patient}</td>
            <td class="p-3 text-slate-600">${inv.items}</td>
            <td class="p-3 font-bold text-slate-900">$${inv.amount.toFixed(2)}</td>
            <td class="p-3">${statusBadge}</td>
            <td class="p-3"><button onclick="viewBill('${inv.id}', '${inv.patient}', '${inv.items}', ${inv.amount}, '${inv.status}')" class="text-sky-600 hover:underline font-semibold text-xs bg-sky-50 px-2.5 py-1 rounded">View Invoice</button></td>
        `;
        tableBody.appendChild(row);
    });
}

window.onload = function() {
    renderPatients();
    renderAppointments();
    renderBilling();
    
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');
    
    const profileNameEl = document.getElementById('userProfileName');
    const profileRoleEl = document.getElementById('userProfileRole');
    const profileIcon = document.getElementById('userProfileIcon');

    if (role === 'patient') {
        if (profileNameEl) profileNameEl.innerText = name || 'Patient User';
        if (profileRoleEl) profileRoleEl.innerText = 'Patient Portal';
        if (profileIcon) profileIcon.className = 'fa-solid fa-user-injured';
        applyPatientRestrictions();
    } else {
        if (profileNameEl) profileNameEl.innerText = name || 'Dr. Robert Smith';
        if (profileRoleEl) profileRoleEl.innerText = 'Cardiologist';
        if (profileIcon) profileIcon.className = 'fa-solid fa-user-doctor';
    }
};

function applyPatientRestrictions() {
    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.innerText = "Patient Portal & Services";
    
    // Hide Emergency Dispatch Card for patients
    const emergencyCard = document.getElementById('emergencyCard');
    if (emergencyCard) {
        emergencyCard.style.display = 'none';
    }
    
    const navLinks = document.querySelectorAll('.tab-link');
    navLinks.forEach(link => {
        const text = link.innerText.toLowerCase();
        if (text.includes('dashboard') || text.includes('patients directory') || text.includes('staff')) {
            link.style.display = 'none';
        }
    });

    switchTab('home');
}

function logoutUser() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    alert('Logged out successfully.');
    window.location.href = 'patient-login.html';
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    const targetTab = document.getElementById('tab-' + tabId);
    if (targetTab) targetTab.classList.remove('hidden');
    
    document.querySelectorAll('.tab-link').forEach(el => {
        if (el.style.display !== 'none') {
            el.classList.remove('bg-sky-600', 'text-white', 'shadow-sm');
            el.classList.add('text-slate-300', 'hover:bg-slate-800');
        }
    });
    const clickedTab = event ? event.currentTarget : document.querySelector(`[onclick*="${tabId}"]`);
    if (clickedTab && clickedTab.style.display !== 'none') {
        clickedTab.classList.add('bg-sky-600', 'text-white', 'shadow-sm');
        clickedTab.classList.remove('text-slate-300', 'hover:bg-slate-800');
    }

    const titles = {
        'home': 'Patient Portal & Services',
        'dashboard': 'Clinical Control Center',
        'patients': 'Patient Management & EMR',
        'appointments': 'Consultation & Scheduling',
        'billing': 'Financial Billing & Invoices',
        'resources': 'Hospital Resources & Staff Roster'
    };
    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.innerText = titles[tabId] || 'Hospital Portal';
}

function handleAdmission(e) {
    e.preventDefault();
    const name = document.getElementById('patName').value;
    const age = document.getElementById('patAge').value;
    const dept = document.getElementById('patDept').value;
    
    const newPatient = {
        id: '#P-' + (1000 + patients.length + 1),
        name: name,
        age: age,
        dept: dept,
        status: 'Admitted',
        history: 'Newly admitted to ' + dept + ' department. Initial vitals stable.'
    };

    patients.push(newPatient);
    savePatients();
    renderPatients();
    
    alert('Patient ' + name + ' successfully admitted!');
    e.target.reset();
}

function deletePatient(index) {
    if(confirm('Are you sure you want to discharge or remove this record?')) {
        patients.splice(index, 1);
        savePatients();
        renderPatients();
    }
}

function filterPatients() {
    const query = document.getElementById('searchPatient').value.toLowerCase();
    const rows = document.getElementById('patientTableBody').getElementsByTagName('tr');
    for(let row of rows) {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
    }
}

function toggleAppointmentModal(show) {
    const modal = document.getElementById('appointmentModal');
    if(show) modal.classList.remove('hidden');
    else modal.classList.add('hidden');
}

function handleNewAppointment(e) {
    e.preventDefault();
    const patient = document.getElementById('apptPatient').value;
    const doctor = document.getElementById('apptDoctor').value;
    const rawTime = document.getElementById('apptTime').value;

    const formattedTime = new Date(rawTime).toLocaleString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true 
    });

    appointments.push({
        patient: patient,
        doctor: doctor,
        time: formattedTime,
        status: 'Confirmed'
    });

    saveAppointments();
    renderAppointments();
    toggleAppointmentModal(false);
    alert('Appointment booked successfully for ' + patient + '!');
    e.target.reset();
}

function deleteAppointment(index) {
    if(confirm('Cancel and remove this appointment?')) {
        appointments.splice(index, 1);
        saveAppointments();
        renderAppointments();
    }
}

function viewHistory(name, dept, history) {
    document.getElementById('historyModalTitle').innerText = "EMR File: " + name;
    document.getElementById('historyModalContent').innerHTML = `
        <div class="p-4 bg-sky-50 border border-sky-100 rounded-xl space-y-2">
            <p class="font-semibold text-sky-900"><i class="fa-solid fa-hospital-user mr-2"></i>Department: ${dept}</p>
            <p class="mt-2 text-slate-700 leading-relaxed"><strong>Clinical Notes:</strong><br>${history}</p>
        </div>
    `;
    document.getElementById('historyModal').classList.remove('hidden');
}

function viewBill(invoiceId, patientName, items, amount, status) {
    document.getElementById('billModalTitle').innerText = "Invoice " + invoiceId;
    let statusBadge = status === 'Paid' ? '<span class="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">PAID IN FULL</span>' : '<span class="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-bold">BALANCE DUE</span>';
    
    document.getElementById('billModalContent').innerHTML = `
        <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div class="flex justify-between text-sm"><strong>Patient Name:</strong> <span class="font-medium text-slate-800">${patientName}</span></div>
            <div class="flex justify-between text-sm"><strong>Services:</strong> <span class="text-right text-slate-600">${items}</span></div>
            <div class="flex justify-between border-t border-slate-200 pt-3 font-bold text-lg text-slate-900"><span>Total Charge:</span> <span>$${amount.toFixed(2)}</span></div>
            <div class="flex justify-between items-center pt-1"><strong>Status:</strong> <span>${statusBadge}</span></div>
        </div>
    `;
    document.getElementById('billingModal').classList.remove('hidden');
}

function openEmergencySelection() {
    const selectEl = document.getElementById('emergencyPatientSelect');
    if (!selectEl) return;
    
    selectEl.innerHTML = '';
    
    if (patients.length === 0) {
        alert('No patients available in the system.');
        return;
    }

    patients.forEach((p, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.text = `${p.name} (${p.id} - ${p.dept} [${p.status}])`;
        selectEl.appendChild(option);
    });

    document.getElementById('emergencySelectModal').classList.remove('hidden');
}

function confirmEmergencyDispatch() {
    const selectEl = document.getElementById('emergencyPatientSelect');
    if (!selectEl) return;
    
    const selectedIndex = selectEl.value;
    const emergencyPatient = patients[selectedIndex];

    if (!emergencyPatient) {
        alert('Please select a valid patient.');
        return;
    }

    closeModal('emergencySelectModal');

    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Emergency Dispatch - ${emergencyPatient.name}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        </head>
        <body class="bg-slate-950 text-slate-100 font-sans p-8 antialiased">
            <div class="max-w-2xl mx-auto space-y-6">
                <div class="bg-rose-900/40 border border-rose-500/50 p-6 rounded-3xl flex items-center justify-between shadow-2xl">
                    <div class="flex items-center space-x-4">
                        <div class="bg-rose-600 text-white p-4 rounded-2xl animate-pulse text-2xl"><i class="fa-solid fa-truck-medical"></i></div>
                        <div>
                            <span class="text-xs font-bold tracking-widest text-rose-400 uppercase">Priority 1 Dispatch Active</span>
                            <h1 class="text-2xl font-black text-white mt-0.5">Emergency Response Unit</h1>
                        </div>
                    </div>
                    <span class="bg-rose-500/20 text-rose-300 border border-rose-400/30 px-3 py-1.5 rounded-xl text-xs font-mono font-bold">DISPATCH #ED-904</span>
                </div>

                <div class="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
                    <div class="flex justify-between items-center border-b border-slate-800 pb-4">
                        <h2 class="text-lg font-bold text-slate-200"><i class="fa-solid fa-user-injured text-sky-400 mr-2"></i> Assigned Patient Profile</h2>
                        <span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold">${emergencyPatient.status}</span>
                    </div>

                    <div class="grid grid-cols-2 gap-6 text-sm">
                        <div class="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                            <span class="text-xs text-slate-400 block font-semibold uppercase">Patient Name</span>
                            <span class="text-base font-bold text-white mt-1 block">${emergencyPatient.name}</span>
                        </div>
                        <div class="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                            <span class="text-xs text-slate-400 block font-semibold uppercase">Patient ID</span>
                            <span class="text-base font-bold font-mono text-sky-400 mt-1 block">${emergencyPatient.id}</span>
                        </div>
                        <div class="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                            <span class="text-xs text-slate-400 block font-semibold uppercase">Age</span>
                            <span class="text-base font-bold text-white mt-1 block">${emergencyPatient.age} Years</span>
                        </div>
                        <div class="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                            <span class="text-xs text-slate-400 block font-semibold uppercase">Department</span>
                            <span class="text-base font-bold text-teal-300 mt-1 block">${emergencyPatient.dept}</span>
                        </div>
                    </div>

                    <div class="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 space-y-2">
                        <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Clinical EMR Notes / Vitals</span>
                        <p class="text-sm text-slate-300 leading-relaxed">${emergencyPatient.history}</p>
                    </div>
                </div>

                <div class="flex justify-end space-x-4">
                    <button onclick="window.print()" class="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition"><i class="fa-solid fa-print mr-1"></i> Print Dispatch Sheet</button>
                    <button onclick="window.close()" class="bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition">Close Dispatch Window</button>
                </div>
            </div>
        </body>
        </html>
    `);
    newWindow.document.close();
}

function toggleAdminModal(show) {
    const modal = document.getElementById('adminModal');
    if(show) modal.classList.remove('hidden');
    else modal.classList.add('hidden');
}

function verifyAdmin() {
    const pin = document.getElementById('adminPass').value;
    if(pin === '1234' || pin === 'admin') {
        const liveBadge = document.getElementById('liveBadge');
        if(liveBadge) liveBadge.innerText = "Portal Unlocked";
        toggleAdminModal(false);
        alert('Administrator access granted.');
    } else {
        alert('Incorrect PIN. Try "1234".');
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function printBill() {
    window.print();
}

function toggleAiAssistant() {
    const modal = document.getElementById('aiAssistantModal');
    if (modal) {
        modal.classList.toggle('hidden');
    }
}

function sendAiMessage(customText = null) {
    const input = document.getElementById('aiUserInput');
    const container = document.getElementById('aiChatMessages');
    const text = customText || input.value.trim();

    if (!text) return;

    const userMsg = document.createElement('div');
    userMsg.className = "flex justify-end";
    userMsg.innerHTML = `<div class="chat-bubble-user px-4 py-2.5 rounded-2xl text-xs max-w-[80%] shadow-xs">${text}</div>`;
    container.appendChild(userMsg);

    if (!customText) input.value = '';
    container.scrollTop = container.scrollHeight;

    setTimeout(() => {
        const aiMsg = document.createElement('div');
        aiMsg.className = "flex justify-start items-start space-x-2";
        
        let response = "I'm your Helix AI assistant. How can I help you today?";
        const lower = text.toLowerCase();
        if (lower.includes('doctor') || lower.includes('cardiology') || lower.includes('appointment')) {
            response = "You can book appointments easily using the 'Appointments' tab in the portal.";
        } else if (lower.includes('emergency') || lower.includes('ambulance') || lower.includes('911')) {
            response = "⚠️ For life-threatening emergencies, please dial 911 immediately.";
        } else if (lower.includes('bill') || lower.includes('invoice')) {
            response = "You can view your itemized billing and invoices under the 'Billing & Finance' tab.";
        }

        aiMsg.innerHTML = `
            <div class="bg-sky-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-1"><i class="fa-solid fa-robot"></i></div>
            <div class="chat-bubble-ai px-4 py-2.5 rounded-2xl text-xs max-w-[80%] shadow-xs leading-relaxed">${response}</div>
        `;
        container.appendChild(aiMsg);
        container.scrollTop = container.scrollHeight;
    }, 600);
}