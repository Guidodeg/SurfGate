document.addEventListener("DOMContentLoaded", () => {
    const toggleBlock = document.getElementById("toggleBlock");
    const refreshPage = document.getElementById("refreshPage");

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentSite = new URL(tabs[0].url).hostname;
        const currentTabId = tabs[0].id;

        chrome.storage.sync.get("blockedSites", (data) => {
            if (data.blockedSites && data.blockedSites.includes(currentSite)) {
                toggleBlock.textContent = "Unblock this site";
            } else {
                toggleBlock.textContent = "Block this site";
            }
        });

        toggleBlock.addEventListener("click", () => {
            chrome.runtime.sendMessage(
                { action: "toggleBlock", site: currentSite },
                () => {
                    window.close();
                }
            );
            chrome.tabs.reload(currentTabId);
        });
    });
});