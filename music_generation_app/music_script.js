
document.getElementById("generateMusicBtn").addEventListener("click", async () => {
    const apiKey = document.getElementById("apiKey").value.trim();
    const voiceId = document.getElementById("voiceId").value.trim();
    const instrumentalId = document.getElementById("instrumentalId").value.trim();
    const lyrics = document.getElementById("lyrics").value.trim();
    const statusElement = document.getElementById("status");
    const audioPlayer = document.getElementById("audioPlayer");

    if (!apiKey || !voiceId || !instrumentalId || !lyrics) {
        statusElement.textContent = "Please provide all the required inputs.";
        return;
    }

    const payload = {
        refer_voice: voiceId,
        refer_instrumental: instrumentalId,
        lyrics: lyrics,
        model: "music-01",
        audio_setting: JSON.stringify({ sample_rate: 44100, bitrate: 256000, format: "mp3" })
    };

    statusElement.textContent = "Generating music, please wait...";

    try {
        const response = await fetch("https://api.minimaxi.chat/v1/music_generation", {
            method: "POST",
            headers: {
                "authorization": `Bearer ${apiKey}`,
                "content-type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (response.ok) {
            const audioHex = data.data.audio;
            const audioBlob = new Blob([Uint8Array.from(Buffer.from(audioHex, 'hex'))], { type: "audio/mp3" });
            const audioUrl = URL.createObjectURL(audioBlob);
            audioPlayer.src = audioUrl;
            statusElement.textContent = "Music generated successfully! You can now play it below.";
        } else {
            throw new Error(data.message || "Music generation failed.");
        }
    } catch (error) {
        statusElement.textContent = `Error: ${error.message}`;
    }
});
