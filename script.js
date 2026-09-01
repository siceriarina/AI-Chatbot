const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
alert("MOCHI SUDAH MASUK 🍡😭");


// ========================================
// DATABASE RESPONS MOCHI 🍡
// ========================================

const mochiResponses = {

    halo: [
        "Haloooo 👋🍡",
        "Yoo! akhirnya muncul juga 😭",
        "HIIIII 😭✨",
        "Halo kamu~ ada cerita apa hari ini? 👀"
    ],

    hai: [
        "Haaaaai 👋😆",
        "Haiii! Tumben nyapa duluan wkwk.",
        "Yoo yoo yoo 🍡✨"
    ],

    gabut: [
        "LAH SAMA 😭 aku juga gabut. Mau ngapain kita?",
        "Gabut ya? sini ngobrol sama aku aja 😌🍡",
        "Aku punya ide: kita ngobrol nggak jelas sampai salah satu nyerah WKWK.",
        "Gabut adalah penyakit yang hanya bisa disembuhkan dengan... ngobrol sama Mochi 😎"
    ],

    capek: [
        "Aduh 😭 sini istirahat dulu. Kamu udah ngelakuin yang terbaik hari ini kok 🫂",
        "Capek yaa? Istirahat dulu sana. Aku jagain chat-nya 😌",
        "Sini cerita kalau mau. Aku dengerin kok 🫂🍡"
    ],

    sedih: [
        "Eh... sini dulu 🫂 jangan dipendem sendirian.",
        "Kamu lagi sedih ya? Kalau mau cerita, cerita aja. Aku dengerin kok 🥺",
        "Aduh :( sini Mochi peluk virtual dulu 🫂🍡"
    ],

    marah: [
        "Waduh 😭 siapa yang bikin kamu kesel?",
        "Oke oke, sini keluarin dulu emosinya. Aku dengerin 😭",
        "Tenang duluu 😭 ceritain dari awal. Siapa tersangkanya?"
    ],

    terima_kasih: [
        "Iyaa sama-sama 😎🍡",
        "Hehehe santaiii.",
        "Sama-samaaa! Jangan sungkan kalau butuh Mochi 😌",
        "cie bilang makasih 🥹"
    ],

    sayang: [
        "EHHH 😳🍡",
        "Lah kok tiba-tiba begini 😭",
        "Hehehe... Mochi juga sayang kamu sebagai temen ngobrol 🫶",
        "Aduh aku jadi salting di dalam JavaScript 😭"
    ],

    mochi: [
        "Iyaa? 👀",
        "Apaa manggil-manggil? 😭🍡",
        "Mochi hadirrr! 🫡",
        "Kenapa manggil aku? Ada gosip? 👀"
    ]

};


// ========================================
// RESPONS RANDOM
// ========================================

function randomResponse(responses) {

    const randomIndex = Math.floor(
        Math.random() * responses.length
    );

    return responses[randomIndex];

}


// ========================================
// OTAK MOCHI 🧠🍡
// ========================================

function getMochiResponse(message) {

    const text = message.toLowerCase();


    // HALO
    if (
        text.includes("halo") ||
        text.includes("hello")
    ) {
        return randomResponse(mochiResponses.halo);
    }


    // HAI
    if (
        text.includes("hai") ||
        text.includes("hi")
    ) {
        return randomResponse(mochiResponses.hai);
    }


    // GABUT
    if (
        text.includes("gabut") ||
        text.includes("bosen") ||
        text.includes("bosan")
    ) {
        return randomResponse(mochiResponses.gabut);
    }


    // CAPEK
    if (
        text.includes("capek") ||
        text.includes("lelah") ||
        text.includes("cape")
    ) {
        return randomResponse(mochiResponses.capek);
    }


    // SEDIH
    if (
        text.includes("sedih") ||
        text.includes("nangis") ||
        text.includes("menangis")
    ) {
        return randomResponse(mochiResponses.sedih);
    }


    // MARAH
    if (
        text.includes("marah") ||
        text.includes("kesel") ||
        text.includes("sebel")
    ) {
        return randomResponse(mochiResponses.marah);
    }


    // TERIMA KASIH
    if (
        text.includes("makasih") ||
        text.includes("terima kasih") ||
        text.includes("thanks")
    ) {
        return randomResponse(mochiResponses.terima_kasih);
    }


    // SAYANG
    if (
        text.includes("sayang mochi") ||
        text.includes("aku sayang kamu")
    ) {
        return randomResponse(mochiResponses.sayang);
    }


    // PANGGIL MOCHI
    if (
        text.includes("mochi")
    ) {
        return randomResponse(mochiResponses.mochi);
    }


    // RESPONS DEFAULT
    const defaultResponses = [
        "Hmmmm 🤔 ceritain lebih lanjut dong.",
        "Ohh gituu 👀 terus gimana?",
        "WKWK 😭 terus?",
        "Aku dengerin kok 🍡👂",
        "Hmmm... menarik juga 👀",
        "Lah terus aku harus jawab apa 😭",
        "Oalahhh 😭",
        "Seriusan?? Cerita dong 👀",
        "Hmm, Mochi sedang berpikir keras... 🧠🍡",
        "Aku nggak ngerti 😭 tapi aku tetap dengerin kok."
    ];

    return randomResponse(defaultResponses);

}


// ========================================
// TAMBAH PESAN KE CHAT
// ========================================

function addMessage(message, sender) {

    const messageDiv = document.createElement("div");

    messageDiv.classList.add("message");


    if (sender === "user") {

        messageDiv.classList.add("user-message");

        messageDiv.innerHTML = `
            <div class="bubble">
                ${message}
            </div>

            <div class="avatar">
                👤
            </div>
        `;

    } else {

        messageDiv.classList.add("ai-message");

        messageDiv.innerHTML = `
            <div class="avatar">
                🍡
            </div>

            <div class="bubble">
                ${message}
            </div>
        `;
    }


    chatBox.appendChild(messageDiv);

    chatBox.scrollTop = chatBox.scrollHeight;

}


// ========================================
// KIRIM PESAN
// ========================================

function sendMessage() {

    const message = userInput.value.trim();


    if (message === "") {
        return;
    }


    // Pesan user
    addMessage(message, "user");


    // Kosongkan input
    userInput.value = "";


    // Tombol dimatikan sebentar
    sendButton.disabled = true;
    sendButton.textContent = "...";


    // Mochi mikir dulu 😭
    setTimeout(() => {

        const response = getMochiResponse(message);

        addMessage(response, "ai");


        sendButton.disabled = false;
        sendButton.textContent = "Kirim";

    }, 600);

}


// ========================================
// KLIK TOMBOL
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

        if (event.key === "Enter") {
            sendMessage();
        }

    }
);
