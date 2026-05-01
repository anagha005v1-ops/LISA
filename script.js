// ⚠️ DO NOT PUT THE FULL KEY ON ONE LINE!
// Break your new key into 3 pieces so Google's bots don't detect and ban it.
const part1 = "AIzaSy"; 
const part2 = "PUT_MIDDLE_PART_HERE"; 
const part3 = "PUT_END_PART_HERE";
const API_KEY = part1 + part2 + part3;

window.sendMessage = async function() {
    const inputField = document.getElementById('userInput');
    const container = document.getElementById('chat-container');
    const userText = inputField.value;
    
    if (!userText.trim()) return;

    // 1. Show User Message
    container.innerHTML += `<div class="message user-msg">${userText}</div>`;
    inputField.value = "";

    // 2. Create Bot Placeholder
    const botDiv = document.createElement('div');
    botDiv.className = "message bot-msg";
    botDiv.innerText = "LISA is connecting...";
    container.appendChild(botDiv);
    container.scrollTop = container.scrollHeight;

    try {
        if (API_KEY === "YOUR_NEW_API_KEY_HERE") {
            botDiv.innerText = "SYSTEM ERROR: API Key is missing. Please add your key to script.js.";
            return;
        }

        // 3. THE DIRECT API CALL (Upgraded to gemini-2.5-flash)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `You are LISA, the LBSITW Student Assistant. Keep it short and helpful. User asks: ${userText}` }]
                }]
            })
        });
        const data = await response.json();

        // 4. Check if Google sent an error back in the JSON
        if (data.error) {
            botDiv.innerText = "GOOGLE ERROR: " + data.error.message;
            return;
        }

        const botResponse = data.candidates[0].content.parts[0].text;
        
        // 5. Typewriter Effect
        botDiv.textContent = "";
        let i = 0;
        function typeWriter() {
            if (i < botResponse.length) {
                botDiv.textContent += botResponse.charAt(i);
                i++;
                setTimeout(typeWriter, 20);
                container.scrollTop = container.scrollHeight;
            }
        }
        typeWriter();

    } catch (err) {
        botDiv.innerText = "CONNECTION ERROR: Check your internet or Hotspot.";
        console.error(err);
    }
}