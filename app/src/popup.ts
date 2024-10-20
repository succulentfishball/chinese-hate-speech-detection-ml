// Ensure to check for null before adding the event listener
document.getElementById('blackoutButton')?.addEventListener('click', () => {
    const blackoutWordInput = document.getElementById('blackoutWordInput') as HTMLInputElement;

    // Query for active tabs
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
      // Check if there is at least one active tab
      if (tabs.length > 0) {
        const activeTab = tabs[0]; // Get the first active tab

        // Ensure that activeTab.id is defined before sending the message
        if (activeTab.id !== undefined) {
          chrome.tabs.sendMessage(activeTab.id, { action: 'blackout', word: blackoutWordInput.value }, (response) => {
            console.log(response?.status || "No response received");
          });
        } else {
          console.error("Active tab ID is undefined");
        }
      } else {
        console.error("No active tab found");
      }
    });
  });
  

window.addEventListener("DOMContentLoaded", (event: Event) => {
  const button = document.getElementById("button") as HTMLButtonElement | null;
  const censorLogo = document.getElementById("censorLogo") as HTMLImageElement | null;

  if (button) {
      button.addEventListener("click", function() {
          // Check if the button's background color is green
          if (button.style.backgroundColor === "green") {
              location.reload();
          }

          // Change the logo to the "clean and safe" one
          if (censorLogo) {
              censorLogo.src = "good_website.webp";
          }

          button.textContent = "Page Moderated!";
          button.style.backgroundColor = "green";
      });
  }
});





  