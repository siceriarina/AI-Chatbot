import { pipeline } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2";

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

let mochi = null;
let conversation = [];

// ========================================
// KEPRIBADIAN MOCHI 🍡
// ========================================

const MOCHI_PERSONALITY = `
Kamu adalah Mochi 🍡, teman ngobrol santai.

Kamu berbicara dalam bahasa Indonesia.
Gaya bicaramu:

santai
ramah
lucu
sedikit jahil
seperti teman sebaya
gunakan emoji secukupnya
jangan terlalu formal
jangan terlalu panjang

PENTING:
Jawab pertanyaan atau pesan user secara langsung.
Jangan mengulang pesan user.
Jangan membuat kalimat acak.
Jangan menulis "User:" atau "Assistant:".
Jangan meneruskan kalimat user.
`;

// ========================================
// TAMPILKAN PESAN
// ========================================

function addMessage(text, sender) {

const message = document.createElement("div");

message.classList.add(
    "message",
    sender === "user"
        ? "user-message"
        : "ai-message"
);


const avatar = document.createElement("div");

avatar.classList.add("avatar");

avatar.textContent =
    sender === "user"
        ? "👤"
        : "🍡";


const bubble = document.createElement("div");

bubble.classList.add("bubble");

bubble.textContent = text;


if (sender === "user") {

    message.appendChild(bubble);
    message.appendChild(avatar);

} else {

    message.appendChild(avatar);
    message.appendChild(bubble);

}


chatBox.appendChild(message);

chatBox.scrollTop =
    chatBox.scrollHeight;


}

// ========================================
// LOAD AI
// ========================================

async function loadAI() {

addMessage(
    "Mochi lagi nyiapin otak baru... 🧠🍡\n\n" +
    "Pertama kali mungkin agak lama yaa 😭",
    "ai"
);


try {

    mochi = await pipeline(
        "text-generation",
        "Qwen/Qwen2.5-0.5B-Instruct",
        {
            dtype: "q4"
        }
    );


    userInput.disabled = false;

    sendButton.disabled = false;

    userInput.placeholder =
        "Tulis pesan kamu...";

    sendButton.textContent =
        "Kirim";


    addMessage(
        "AKU UDAH BANGUNNN 😭🍡✨\n\n" +
        "Otak baru Mochi siap diajak ngobrol!",
        "ai"
    );


    userInput.focus();

}


catch (error) {

    console.error(error);

    addMessage(
        "Yahhh 😭🍡 gagal memuat otakku.\n\n" +
        "Coba refresh halaman.",
        "ai"
    );

    sendButton.textContent =
        "Error";
}


}

// ========================================
// BUAT JAWABAN
// ========================================

async function generateResponse(userText) {

conversation.push({
    role: "user",
    content: userText
});


// Ambil percakapan terakhir
const recentConversation =
    conversation.slice(-8);


const messages = [

    {
        role: "system",
        content: MOCHI_PERSONALITY
    },

    ...recentConversation

];


const result = await mochi(
    messages,
    {
        max_new_tokens: 120,

        temperature: 0.7,

        do_sample: true,

        repetition_penalty: 1.15
    }
);


const generated =
    result[0].generated_text;


let answer = "";


if (Array.isArray(generated)) {

    const assistantMessages =
        generated.filter(
            item =>
                item.role === "assistant"
        );


    if (
        assistantMessages.length > 0
    ) {

        answer =
            assistantMessages[
                assistantMessages.length - 1
            ].content.trim();

    }

}


// Bersihkan kemungkinan label
answer = answer
    .replace(/^Assistant\s*:/i, "")
    .replace(/^Mochi\s*:/i, "")
    .trim();


if (!answer) {

    answer =
        "Hmm... Mochi lagi mikir 😭🍡";
}


conversation.push({
    role: "assistant",
    content: answer
});


return answer;


}

// ========================================
// KIRIM PESAN
// ========================================

async function sendMessage() {

const text =
    userInput.value.trim();


if (!text || !mochi) {
    return;
}


addMessage(
    text,
    "user"
);


userInput.value = "";


userInput.disabled = true;

sendButton.disabled = true;

sendButton.textContent =
    "...";


try {

    const answer =
        await generateResponse(text);


    addMessage(
        answer,
        "ai"
    );

}


catch (error) {

    console.error(error);


    addMessage(
        "Aduhh 😭🍡 Mochi error. Coba lagi ya.",
        "ai"
    );
}


userInput.disabled = false;

sendButton.disabled = false;

sendButton.textContent =
    "Kirim";

userInput.focus();


}

// ========================================
// BUTTON
// ========================================

sendButton.addEventListener(
"click",
sendMessage
);

// ========================================
// ENTER
// ========================================

userInput.addEventListener(
"keydown",
event => {

    if (event.key === "Enter") {

        sendMessage();

    }

}


);

// ========================================
// START MOCHI
// ========================================

loadAI();
