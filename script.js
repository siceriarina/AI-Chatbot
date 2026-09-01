const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");


// ===============================
// MENAMBAHKAN PESAN KE CHAT
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

    // Scroll ke pesan terbaru
    chatBox.scrollTop = chatBox.scrollHeight;
}


// ===============================
// MENGIRIM PESAN KE AI
// ===============================

async function sendMessage() {

    const message = userInput.value.trim();

    if (message === "") {
        return;
    }

    // Tampilkan pesan user
    addMessage(message, "user");

    // Kosongkan input
    userInput.value = "";

    // Matikan tombol sementara
    sendButton.disabled = true;
    sendButton.textContent = "...";


    // Tampilkan AI sedang berpikir
    addMessage("Sedang berpikir... 🤔", "ai");


    try {

        const response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });


        const data = await response.json();


        // Hapus pesan "Sedang berpikir..."
        const messages = document.querySelectorAll(".ai-message");

        if (messages.length > 0) {
            messages[messages.length - 1].remove();
        }


        if (data.reply) {

            addMessage(data.reply, "ai");

        } else {

            addMessage(
                "Maaf, AI mengalami masalah 😭",
                "ai"
            );

        }

    } catch (error) {

        console.error(error);

        // Hapus "Sedang berpikir..."
        const messages = document.querySelectorAll(".ai-message");

        if (messages.length > 0) {
            messages[messages.length - 1].remove();
        }

        addMessage(
            "Waduh, aku gagal terhubung ke server 😭",
            "ai"
        );

    }


    // Aktifkan tombol lagi
    sendButton.disabled = false;
    sendButton.textContent = "Kirim";
}


// ===============================
// TOMBOL KIRIM
// ===============================

sendButton.addEventListener("click", sendMessage);


// ===============================
// ENTER UNTUK MENGIRIM
// ===============================

userInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        sendMessage();
    }

});
