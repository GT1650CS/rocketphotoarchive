document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll('button[role="tab"]');
    const panels = document.querySelectorAll('article[role="tabpanel"]');

    function showPanel(id) {
        // hide all panels
        panels.forEach(p => p.hidden = true);

        // unhide the one we want
        const panel = document.getElementById(id);
        if (panel) panel.hidden = false;

        // mark active tab (for styling)
        tabs.forEach(t => t.setAttribute("aria-selected", "false"));
        const activeTab = [...tabs].find(t => t.dataset.target === id);
        if (activeTab) activeTab.setAttribute("aria-selected", "true");
    }

    // route clicks
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            showPanel(tab.dataset.target);
        });
    });

    // set initial active tab's ui
    showPanel(tabs[0].dataset.target);
});
