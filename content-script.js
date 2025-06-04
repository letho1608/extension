// Get Facebook username from profile
function getFacebookUsername() {
    const nameElement = document.querySelector('[class="x1lliihq x1k90msu x2h7rmj x1qfuztq x198g3q0 x1qx5ct2 xw2csxc x1odjw0f x1i64zmx x1yc453h"]');
    if (nameElement) {
        const username = nameElement.textContent;
        chrome.storage.local.set({ 'fb_username': username });
    }
}

// Run when page loads
getFacebookUsername();