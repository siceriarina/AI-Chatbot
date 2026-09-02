import { pipeline } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2";

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

let mochi = null;
let messages = [];

const SYSTEM_PROMPT = `
Kamu adalah Mochi 🍡, teman ngobrol virtual yang santai, lucu, dan sedikit jahil.

Gunakan bahasa Indonesia yang santai seperti teman sebaya.
Gunakan emoji sesekali.
Jangan terlalu formal.
Jawaban biasanya pendek dan natural.
Kalau user bercerita, tanggapi ceritanya.
Jangan mengulang pesan user.
Jangan menulis nama "User:" atau "Mochi:" dalam jawaban.
`;

function addMessage(message, sender) {

const messageDiv = document.createElement("div");
messageDiv.classList.add("message");

const bubble = document.createElement("div");
bubble.classList.add("bubble");
bubble.textContent = message;

const avatar = document.createElement("div");
avatar.classList.add("avatar");

if (sender === "user") {

    messageDiv.classList.add("user-message");

    avatar.textContent = "👤";

    messageDiv.appendChild(bubble);
    messageDiv.appendChild(avatar);

} else {

    messageDiv.classList.add("ai-message");

    avatar.textContent = "🍡";

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(bubble);
}

chatBox.appendChild(messageDiv);
chatBox.scrollTop = chatBox.scrollHeight;


}

async function loadAI() {

addMessage(
    "Mochi lagi bangun dulu... 🥱🍡",
    "ai"
);

try {

    mochi = await pipeline(
        "text-generation",
        "HuggingFaceTB/SmolLM2-360M-Instruct",
        {
            dtype: "q4"
        }
    );

    userInput.disabled = false;
    sendButton.disabled = false;

    userInput.placeholder =
        "Tulis pesan kamu...";

    sendButton.textContent = "Kirim";

    addMessage(
        "AKU UDAH BANGUNNN 😭🍡✨",
        "ai"
    );

    userInput.focus();

} catch (error) {

    console.error(error);

    addMessage(
        "Mochi gagal bangun 😭🍡 Coba refresh halaman.",
        "ai"
    );

    sendButton.textContent = "Error";
}


}

async function getMochiResponse(userMessage) {

messages.push({
    role: "user",
    content: userMessage
});

const recentMessages = messages.slice(-6);

const prompt = [
    {
        role: "system",
        content: SYSTEM_PROMPT
    },
    ...recentMessages
];

const result = await mochi(prompt, {
    max_new_tokens: 80,
    temperature: 0.8,
    do_sample: true
});

const generated = result[0].generated_text;

let answer = "";

if (Array.isArray(generated)) {

    const assistantMessages =
        generated.filter(
            message =>
                message.role === "assistant"
        );

    if (assistantMessages.length > 0) {

        answer =
            assistantMessages[
                assistantMessages.length - 1
            ].content.trim();
    }
}


// Bersihkan kemungkinan model mengulang prompt
answer = answer
    .replace(/^Mochi\s*:\s*/i, "")
    .replace(/^Assistant\s*:\s*/i, "")
    .trim();


// Kalau kosong
if (!answer) {

    answer =
        "Hmm... Mochi lagi mikir keras 😭🍡";
}


messages.push({
    role: "assistant",
    content: answer
});

return answer;


}

async function sendMessage() {

const message = userInput.value.trim();

if (!message || !mochi) {
    return;
}

addMessage(message, "user");

userInput.value = "";

userInput.disabled = true;
sendButton.disabled = true;
sendButton.textContent = "...";

try {

    const response =
        await getMochiResponse(message);

    addMessage(
        response,
        "ai"
    );

} catch (error) {

    console.error(error);

    addMessage(
        "Aduhh 😭 otak Mochi error.",
        "ai"
    );
}

userInput.disabled = false;
sendButton.disabled = false;
sendButton.textContent = "Kirim";

userInput.focus();


}

sendButton.addEventListener(
"click",
sendMessage
);

userInput.addEventListener(
"keydown",
event => {

    if (event.key === "Enter") {
        sendMessage();
    }

}


);

loadAI();
