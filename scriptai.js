/* ==========================================
   Vanguard AI Assistant Logic
   ========================================== */
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

    // Append User Message
    const userMsg = document.createElement('div');
    userMsg.className = "flex justify-end";
    userMsg.innerHTML = `<div class="chat-bubble-user px-4 py-2.5 rounded-2xl text-xs max-w-[80%] shadow-xs">${text}</div>`;
    container.appendChild(userMsg);

    if (!customText) input.value = '';
    container.scrollTop = container.scrollHeight;

    // Simulate AI Thinking & Response
    setTimeout(() => {
        const aiMsg = document.createElement('div');
        aiMsg.className = "flex justify-start items-start space-x-2";
        
        let response = "I'm your Vanguard AI assistant. How can I help you navigate hospital services or clinical records today?";

        const lower = text.toLowerCase();
        if (lower.includes('doctor') || lower.includes('cardiology') || lower.includes('appointment')) {
            response = "We have top specialists available. You can book a consultation instantly using the 'Appointments' tab or click 'Book Consultation' above!";
        } else if (lower.includes('emr') || lower.includes('patient') || lower.includes('record')) {
            response = "Patient electronic medical records (EMR) are fully encrypted and accessible under the 'Patients Directory' tab for authorized personnel.";
        } else if (lower.includes('emergency') || lower.includes('ambulance') || lower.includes('911')) {
            response = "⚠️ For immediate life-threatening emergencies, please dial 911 or call our 24/7 Trauma Hotline at +1 (800) 555-VANGUARD.";
        } else if (lower.includes('bill') || lower.includes('invoice')) {
            response = "You can view itemized service invoices, payment statuses, and print billing statements in the 'Billing & Finance' tab.";
        }

        aiMsg.innerHTML = `
            <div class="bg-sky-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-1"><i class="fa-solid fa-robot"></i></div>
            <div class="chat-bubble-ai px-4 py-2.5 rounded-2xl text-xs max-w-[80%] shadow-xs leading-relaxed">${response}</div>
        `;
        container.appendChild(aiMsg);
        container.scrollTop = container.scrollHeight;
    }, 600);
}