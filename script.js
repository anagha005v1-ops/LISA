const API_KEY = "AIzaSyCutWOFETQ_8C18OXKSU6e0ki-JnlyIpL8"; // Put your new key here

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
        // 3. THE DIRECT API CALL (Bypasses the SDK)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
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
        botDiv.innerText = "";
        let i = 0;
        function typeWriter() {
            if (i < botResponse.length) {
                botDiv.innerText += botResponse.charAt(i);
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