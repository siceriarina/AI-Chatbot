import { pipeline } from
"https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2";

// ========================================
// ELEMENT HTML
// ========================================

const chatBox =
document.getElementById("chat-box");

const userInput =
document.getElementById("user-input");

const sendButton =
document.getElementById("send-button");

// ========================================
// VARIABEL AI
// ========================================

let mochi = null;

let messages = [];

// ========================================
// KEPRIBADIAN MOCHI 🍡
// ========================================

const SYSTEM_PROMPT = `
Kamu adalah Mochi 🍡.

Kamu adalah teman ngobrol virtual yang
santai, lucu, ramah, dan sedikit jahil.

Kepribadian:

Bicara seperti teman sebaya.
Gunakan bahasa Indonesia santai.
Sering menggunakan emoji.
Suka bercanda.
Jangan terlalu formal.
Jangan memberikan jawaban terlalu panjang.
Kalau user sedang sedih, dengarkan dan beri dukungan.
Kalau user sedang gabut, ajak ngobrol.
Jangan selalu menjawab dengan pertanyaan.
Ingat konteks percakapan sebelumnya jika tersedia.

Kamu bukan asisten formal.

Kamu adalah teman ngobrol bernama Mochi.
`;

// ========================================
// TAMBAH PESAN
// ========================================

function addMessage(message, sender) {

const messageDiv =
    document.createElement("div");

messageDiv.classList.add("message");


const bubble =
    document.createElement("div");

bubble.classList.add("bubble");

bubble.textContent = message;


const avatar =
    document.createElement("div");

avatar.classList.add("avatar");


// USER
if (sender === "user") {

    messageDiv.classList.add(
        "user-message"
    );

    avatar.textContent = "👤";

    messageDiv.appendChild(bubble);

    messageDiv.appendChild(avatar);

}


// AI
else {

    messageDiv.classList.add(
        "ai-message"
    );

    avatar.textContent = "🍡";

    messageDiv.appendChild(avatar);

    messageDiv.appendChild(bubble);

}


chatBox.appendChild(messageDiv);


// Scroll otomatis ke bawah
chatBox.scrollTop =
    chatBox.scrollHeight;


}

// ========================================
// LOAD MODEL AI
// ========================================

async function loadAI() {

try {

    addMessage(
        "Mochi lagi download otak dulu... 🧠🍡\n\n" +
        "Kalau ini pertama kali, prosesnya " +
        "bisa agak lama. Jangan panik 😭",
        "ai"
    );


    mochi = await pipeline(
        "text-generation",
        "HuggingFaceTB/SmolLM2-360M-Instruct",
        {
            dtype: "q4"
        }
    );


    // Aktifkan input
    userInput.disabled = false;

    sendButton.disabled = false;

    sendButton.textContent =
        "Kirim";

    userInput.placeholder =
        "Tulis pesan kamu...";


    addMessage(
        "AKU UDAH BANGUNNN 😭🍡✨\n\n" +
        "Ayo ngobrol. Kamu lagi ngapain?",
        "ai"
    );


    userInput.focus();

}


catch (error) {

    console.error(error);


    addMessage(
        "Yahhh 😭🍡 Mochi gagal bangun.\n\n" +
        "Coba refresh halaman dan pastikan " +
        "internet kamu aktif.",
        "ai"
    );

    sendButton.textContent =
        "Gagal 😭";
}


}

// ========================================
// OTAK MOCHI 🧠
// ========================================

async function getMochiResponse(
userMessage
) {

// Simpan pesan user
messages.push({
    role: "user",
    content: userMessage
});


// Ambil beberapa pesan terakhir
const recentMessages =
    messages.slice(-6);


const prompt = [

    {
        role: "system",
        content: SYSTEM_PROMPT
    },

    ...recentMessages

];


// Generate jawaban
const result =
    await mochi(
        prompt,
        {
            max_new_tokens: 100,

            temperature: 0.8,

            do_sample: true
        }
    );


let answer = "";


const generated =
    result[0].generated_text;


// Kalau hasil berupa percakapan
if (Array.isArray(generated)) {

    const last =
        generated[generated.length - 1];


    if (
        last &&
        last.content
    ) {

        answer =
            last.content.trim();

    }

}


// Fallback
if (!answer) {

    answer =
        "Hmm... otakku nge-lag 😭🍡";
}


// Simpan jawaban AI
messages.push({
    role: "assistant",
    content: answer
});


return answer;


}

// ========================================
// KIRIM PESAN
// ========================================

async function sendMessage() {

const message =
    userInput.value.trim();


if (
    message === "" ||
    !mochi
) {

    return;
}


// Tampilkan pesan user
addMessage(
    message,
    "user"
);


// Kosongkan input
userInput.value = "";


// Disable sementara
userInput.disabled = true;

sendButton.disabled = true;

sendButton.textContent =
    "...";


try {

    const response =
        await getMochiResponse(
            message
        );


    addMessage(
        response,
        "ai"
    );

}


catch (error) {

    console.error(error);


    addMessage(
        "Aduhh 😭🍡 otak Mochi error. " +
        "Coba kirim lagi yaa.",
        "ai"
    );
}


// Aktifkan kembali
userInput.disabled = false;

sendButton.disabled = false;

sendButton.textContent =
    "Kirim";

userInput.focus();


}

// ========================================
// EVENT BUTTON
// ========================================

sendButton.addEventListener(
"click",
sendMessage
);

// ========================================
// EVENT ENTER
// ========================================

userInput.addEventListener(
"keydown",
function(event) {

    if (event.key === "Enter") {

        sendMessage();

    }

}


);

// ========================================
// JALANKAN MOCHI
// ========================================

loadAI();
