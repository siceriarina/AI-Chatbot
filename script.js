import { pipeline } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2";

// ========================================
// ELEMENT HTML
// ========================================

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

// ========================================
// AI
// ========================================

let mochi = null;

let conversation = [];

// ========================================
// KEPRIBADIAN MOCHI 🍡
// ========================================

const MOCHI_PROMPT = `
Kamu adalah Mochi 🍡.

Kamu adalah teman ngobrol virtual dari Indonesia.

Kepribadianmu:

lucu
santai
ramah
sedikit jahil
seperti teman sebaya
tidak formal
suka menggunakan emoji secukupnya

Aturan:

Selalu jawab dalam bahasa Indonesia.
Jawab pesan user secara langsung.
Jangan mengulang pesan user.
Jangan menyalin pesan user.
Jangan membuat kata-kata acak.
Jangan menulis "User:".
Jangan menulis "Assistant:".
Jangan meneruskan kalimat user.
Kalau user bercerita, tanggapi ceritanya.
Kalau user bertanya, jawab pertanyaannya.
Kalau user sedang sedih, jadilah teman yang mendengarkan.
Jangan terlalu panjang.
`;

// ========================================
// MENAMPILKAN PESAN
// ========================================

function addMessage(text, sender) {

const messageDiv =
    document.createElement("div");

messageDiv.classList.add("message");


const avatar =
    document.createElement("div");

avatar.classList.add("avatar");


const bubble =
    document.createElement("div");

bubble.classList.add("bubble");

bubble.textContent = text;


// USER
if (sender === "user") {

    messageDiv.classList.add(
        "user-message"
    );

    avatar.textContent = "👤";

    messageDiv.appendChild(bubble);

    messageDiv.appendChild(avatar);

}


// MOCHI
else {

    messageDiv.classList.add(
        "ai-message"
    );

    avatar.textContent = "🍡";

    messageDiv.appendChild(avatar);

    messageDiv.appendChild(bubble);

}


chatBox.appendChild(messageDiv);

chatBox.scrollTop =
    chatBox.scrollHeight;


}

// ========================================
// LOAD MODEL 🧠
// ========================================

async function loadAI() {

addMessage(
    "Mochi lagi bangun... 🥱🍡\n\n" +
    "Otak baru lagi disiapin. " +
    "Pertama kali memang bisa agak lama 😭",
    "ai"
);


try {

    mochi = await pipeline(
        "text-generation",
        "onnx-community/Qwen2.5-0.5B-Instruct",
        {
            dtype: "q4"
        }
    );


    // Aktifkan input
    userInput.disabled = false;

    sendButton.disabled = false;

    userInput.placeholder =
        "Tulis pesan kamu...";

    sendButton.textContent =
        "Kirim";


    addMessage(
        "AKU UDAH BANGUNNN 😭🍡✨\n\n" +
        "Sini ngobrol sama Mochi!",
        "ai"
    );


    userInput.focus();

}


catch (error) {

    console.error(
        "MOCHI ERROR:",
        error
    );


    addMessage(
        "Yahhh 😭🍡 Mochi gagal bangun.\n\n" +
        "Coba refresh halaman sekali lagi.",
        "ai"
    );


    sendButton.textContent =
        "Error 😭";
}


}

// ========================================
// GENERATE JAWABAN 🧠
// ========================================

async function getMochiResponse(
userText
) {

// Simpan pesan user
conversation.push({

    role: "user",

    content: userText

});


// Ambil percakapan terakhir
const recentConversation =
    conversation.slice(-8);


// Gabungkan system + percakapan
const messages = [

    {
        role: "system",

        content: MOCHI_PROMPT
    },

    ...recentConversation

];


// Jalankan model
const result =
    await mochi(
        messages,
        {
            max_new_tokens: 100,

            temperature: 0.7,

            do_sample: true,

            repetition_penalty: 1.15
        }
    );


const generated =
    result[0].generated_text;


let answer = "";


// Ambil pesan assistant terakhir
if (Array.isArray(generated)) {

    for (
        let i = generated.length - 1;
        i >= 0;
        i--
    ) {

        if (
            generated[i].role ===
            "assistant"
        ) {

            answer =
                generated[i]
                    .content
                    .trim();

            break;
        }
    }
}


// Bersihkan label yang mungkin muncul
answer = answer
    .replace(
        /^Assistant\s*:\s*/i,
        ""
    )
    .replace(
        /^Mochi\s*:\s*/i,
        ""
    )
    .trim();


// Kalau jawabannya kosong
if (!answer) {

    answer =
        "Hmm... Mochi lagi mikir 😭🍡";
}


// Simpan jawaban
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


// Jangan kirim kalau kosong
if (text === "") {
    return;
}


// Jangan kirim kalau AI belum siap
if (!mochi) {
    return;
}


// Tampilkan pesan user
addMessage(
    text,
    "user"
);


// Bersihkan input
userInput.value = "";


// Matikan input sementara
userInput.disabled = true;

sendButton.disabled = true;

sendButton.textContent =
    "...";


try {

    const answer =
        await getMochiResponse(
            text
        );


    // Tampilkan jawaban
    addMessage(
        answer,
        "ai"
    );

}


catch (error) {

    console.error(
        "CHAT ERROR:",
        error
    );


    addMessage(
        "Aduhh 😭🍡 otak Mochi error.",
        "ai"
    );
}


// Hidupkan lagi
userInput.disabled = false;

sendButton.disabled = false;

sendButton.textContent =
    "Kirim";

userInput.focus();


}

// ========================================
// KLIK KIRIM
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
function(event) {

    if (
        event.key === "Enter"
    ) {

        sendMessage();

    }

}


);

// ========================================
// JALANKAN MOCHI
// ========================================

loadAI();
