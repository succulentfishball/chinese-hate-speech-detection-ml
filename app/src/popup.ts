let blackoutButton = document.getElementById('blackoutButton') as HTMLButtonElement | null;
let blackoutWordInput = document.getElementById('blackoutWordInput') as HTMLInputElement | null;

blackoutButton?.addEventListener('click', (event: MouseEvent) => {
    event.preventDefault();
    
    // Query for active tabs
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
        // Check if there is at least one active tab
        if (tabs.length > 0) {
            const activeTab = tabs[0]; // Get the first active tab
            // Ensure that activeTab.id is defined before sending the message
            if (activeTab.id !== undefined) {
                chrome.tabs.sendMessage(activeTab.id, { action: 'blackout', word: blackoutWordInput?.value }, (response) => {
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

const buttonId = "submit";

// Function to save the button state to storage
const saveButtonState = (text: string, color: string) => {
    chrome.storage.local.set({ buttonState: { text, color } }, () => {
        console.log("Button state saved:", { text, color });
    });
};

// Function to load the button state from storage
const loadButtonState = () => {
    chrome.storage.local.get("buttonState", (data) => {
        if (data.buttonState) {
            const { text, color } = data.buttonState;
            const button = document.getElementById(buttonId) as HTMLButtonElement | null;
            if (button) {
                button.textContent = text;
                button.style.backgroundColor = color;
            }
        }
    });
};

// Set up the button event listener when the DOM is fully loaded
window.addEventListener("DOMContentLoaded", (event: Event) => {
    event.preventDefault();
    
    // Load the button state from storage
    loadButtonState();

    const button = document.getElementById(buttonId) as HTMLButtonElement | null;

    if (button) {
        button.addEventListener("click", () => {
              if (button.style.backgroundColor === "green") {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                  // Check if there is at least one active tab
                  if (tabs.length > 0) {
                      const activeTab = tabs[0]; // Get the first active tab
                      // Reload the active tab
                      chrome.tabs.reload(activeTab.id!); // Use non-null assertion since we checked above
                  }
                });
                button.textContent = "Click to Moderate Page";
                button.style.backgroundColor = "red";
            } else {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                  if (tabs.length > 0) {
                      const activeTab = tabs[0]; // Get the first active tab
                      // Ensure that activeTab.id is defined before sending the message
                      if (activeTab.id !== undefined) {
                          // Send a message to the content script
                          chrome.tabs.sendMessage(activeTab.id, { action: 'runFunction' }, (response) => {
                          });
                      }
                  }
                });
                button.textContent = "Page Moderated";
                button.style.backgroundColor = "green";
            }
            // Save the current state after changing it
            saveButtonState(button.textContent || "", button.style.backgroundColor);
        });
    }
});
