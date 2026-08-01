window.addEventListener("beforeinstallprompt", (event) => {
    console.log("beforeinstallprompt event fired");
    event.preventDefault();
    deferredPrompt = event;

    const installButton = document.getElementById("install-button");
    if (installButton) {
        installButton.style.display = "block";
        console.log("Install button is now visible");

        // Make sure `prompt()` happens ONLY when the user clicks the button
        installButton.addEventListener("click", async () => {
            console.log("Install button clicked, prompting installation...");
            if (deferredPrompt) {
                await deferredPrompt.prompt();
                const choiceResult = await deferredPrompt.userChoice;
                console.log(`User ${choiceResult.outcome === "accepted" ? "accepted" : "dismissed"} the installation.`);
                deferredPrompt = null;
            } else {
                console.warn("No install prompt available.");
            }
        });
    }
});