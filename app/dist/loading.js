"use strict";
document.addEventListener("DOMContentLoaded", function () {
    const loadingBarContainer = document.getElementById("loadingBarContainer");
    const mainContent = document.getElementById("mainContent");
    if (loadingBarContainer && mainContent) {
        // Simulate a loading process
        setTimeout(() => {
            loadingBarContainer.style.display = "none";
            mainContent.style.display = "block";
        }, 5000); // Adjust the time as needed
    }
    else {
        console.error("Loading bar container or main content not found.");
    }
});
