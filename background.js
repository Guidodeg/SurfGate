let blockedSites = [];

chrome.storage.sync.get("blockedSites", (data) => {
    if (data.blockedSites) {
        blockedSites = data.blockedSites;
    }
});

chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        const url = new URL(details.url);
        if (blockedSites.includes(url.hostname)) {
            return { cancel: true };
        }
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleBlock") {
        const siteIndex = blockedSites.indexOf(request.site);
        if (siteIndex > -1) {
            blockedSites.splice(siteIndex, 1);
        } else {
            blockedSites.push(request.site);
        }
        chrome.storage.sync.set({ blockedSites });
    }
});
