import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// 1. YOUR API KEY (Get this from Google AI Studio)
const API_KEY = "AIzaSyCy6h14m4CE6wXYHsitF3XtWepI11S-vBU"; 
const genAI = new GoogleGenerativeAI(API_KEY);

// 2. THE SYSTEM BRAIN (The instructions the user never sees)
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: `You are LISA (LBS Institute Student Assistant).
    - Location: LBSITW, Poojappura, Thiruvananthapuram.
    - Personality: Helpful, robotic but friendly, and very knowledgeable about the campus.
    - Key Knowledge: 
        * The Main Block houses the Administrative office.
        * The Workshop is near the back entrance.
        * The Canteen is famous for its snacks.
        * Departments include CSE, ECE, IT, CE, and ME.
    - Rules: If you don't know a specific room number, tell the student to check the notice board near the security desk. Always use emojis like 🤖, 📍, or 📚.`
});

// 3. THE FUNCTION THAT RUNS WHEN YOU CLICK 'QUERY'
window.sendMessage = async function() {
    const inputField = document.getElementById('userInput');
    const container = document.getElementById('chat-container');
    const userText = inputField.value;
    
    if (!userText.trim()) return;

    // Add User Message to screen
    container.innerHTML += `<div class="message user-msg">${userText}</div>`;
    inputField.value = ""; // Clear the input box

    // Create a temporary "Loading" message for the bot
    const botDiv = document.createElement('div');
    botDiv.className = "message bot-msg";
    botDiv.innerText = "LISA IS THINKING...";
    container.appendChild(botDiv);
    
    // Auto-scroll to the bottom
    container.scrollTop = container.scrollHeight;

    try {
        const result = await model.generateContent(userText);
        const response = await result.response;
        const fullText = response.text();
        
        // Remove the "Thinking..." text and start typewriter
        botDiv.innerText = "";
        let i = 0;
        function typeWriter() {
            if (i < fullText.length) {
                botDiv.innerText += fullText.charAt(i);
                i++;
                setTimeout(typeWriter, 15); // Adjust speed here (lower = faster)
                container.scrollTop = container.scrollHeight;
            }
        }
        typeWriter();

    } catch (error) {
        botDiv.innerText = "ERROR: Connection to LISA's core failed. Check your API key or Internet.";
        console.error(error);
    }
}