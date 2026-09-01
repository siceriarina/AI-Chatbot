const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");


// ===============================
// FUNGSI MENAMBAHKAN PESAN
// ===============================

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
                🤖
            </div>

            <div class="bubble">
                ${message}
            </div>
        `;
    }

    chatBox.appendChild(messageDiv);

    // Scroll otomatis ke pesan terbaru
    chatBox.scrollTop = chatBox.scrollHeight;
}


// ===============================
// FUNGSI MENGIRIM PESAN
// ===============================

function sendMessage() {

    const message = userInput.value.trim();

    // Jangan kirim kalau kosong
    if (message === "") {
        return;
    }

    // Tampilkan pesan user
    addMessage(message, "user");

    // Kosongkan input
    userInput.value = "";

    // Nonaktifkan tombol sementara
    sendButton.disabled = true;

    // Simulasi AI berpikir
    setTimeout(() => {

        addMessage(
            "Aku menerima pesan kamu! 🤖<br><br>" +
            "Nanti kita sambungkan aku ke AI sungguhan ya 😎",
            "ai"
        );

        sendButton.disabled = false;

    }, 800);
}


// ===============================
// TOMBOL KIRIM
// ===============================

sendButton.addEventListener("click", sendMessage);


// ===============================
// TEKAN ENTER UNTUK MENGIRIM
// ===============================

userInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        sendMessage();
    }

});
