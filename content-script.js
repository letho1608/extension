// Function to detect page load
function onPageLoad() {
    // This content script now only needs to exist for future features
    // All cookie handling is done in service-worker-loader.js
    console.log('Page loaded: ' + window.location.hostname);
}

// Run when page loads
onPageLoad();