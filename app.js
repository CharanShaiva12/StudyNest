const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const panelOverlay = $("#panelOverlay");
const notificationDrawer = $("#notificationDrawer");
const chatDrawer = $("#chatDrawer");
const modalBackdrop = $("#modalBackdrop");
const callScreen = $("#callScreen");
const toast = $("#toast");
let toastTimer;

function showToast(title, message) {
  $("#toastTitle").textContent = title;
  $("#toastMessage").textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

function closePanels() {
  $$(".drawer").forEach(drawer => {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
  });
  $(".sidebar").classList.remove("open");
  panelOverlay.classList.remove("open");
}

function openDrawer(drawer) {
  closePanels();
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  panelOverlay.classList.add("open");
}

$("#notificationBtn").addEventListener("click", () => openDrawer(notificationDrawer));
panelOverlay.addEventListener("click", closePanels);
$$(".drawer-close").forEach(button => button.addEventListener("click", closePanels));

$("#mobileMenuBtn").addEventListener("click", () => {
  $(".sidebar").classList.add("open");
  panelOverlay.classList.add("open");
});

$(".mark-read").addEventListener("click", () => {
  $$(".notification-item.unread").forEach(item => item.classList.remove("unread"));
  $(".notification-button i").style.display = "none";
  showToast("You’re all caught up", "All notifications have been marked as read.");
});

$$(".notification-item").forEach(item => {
  item.addEventListener("click", () => item.classList.remove("unread"));
});

function openSessionModal() {
  modalBackdrop.classList.add("open");
  modalBackdrop.setAttribute("aria-hidden", "false");
  setTimeout(() => $("#sessionTitle").focus(), 180);
}

["#newSessionBtn", "#mobileCreateBtn"].forEach(id => $(id).addEventListener("click", openSessionModal));
$(".modal-close").addEventListener("click", () => {
  modalBackdrop.classList.remove("open");
  modalBackdrop.setAttribute("aria-hidden", "true");
});
modalBackdrop.addEventListener("click", event => {
  if (event.target === modalBackdrop) $(".modal-close").click();
});

$("#sessionForm").addEventListener("submit", event => {
  event.preventDefault();
  const title = $("#sessionTitle").value.trim();
  $(".modal-close").click();
  setTimeout(() => {
    showToast("Session room created", `${title} is ready. Your group has been notified.`);
    setTimeout(openCall, 700);
  }, 200);
});

function openCall() {
  closePanels();
  callScreen.classList.add("open");
  callScreen.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

$("#joinSessionBtn").addEventListener("click", openCall);
$("#endCallBtn").addEventListener("click", () => {
  callScreen.classList.remove("open");
  callScreen.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  showToast("Session paused", "Your 1 minute of focus time was saved.");
});

["#micToggle", "#videoToggle"].forEach(id => {
  $(id).addEventListener("click", event => {
    const button = event.currentTarget;
    button.classList.toggle("off");
    const isMic = id === "#micToggle";
    button.querySelector("span").textContent = button.classList.contains("off")
      ? (isMic ? "Unmute" : "Start video")
      : (isMic ? "Mute" : "Camera");
  });
});

$("#callChatBtn").addEventListener("click", () => openDrawer(chatDrawer));

$("#chatForm").addEventListener("submit", event => {
  event.preventDefault();
  const input = $("#chatInput");
  const text = input.value.trim();
  if (!text) return;
  const message = document.createElement("div");
  message.className = "message sent";
  const time = new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date());
  message.innerHTML = `<div><small>You · ${time}</small><p></p></div>`;
  message.querySelector("p").textContent = text;
  $("#chatMessages").append(message);
  input.value = "";
  $("#chatMessages").scrollTop = $("#chatMessages").scrollHeight;
});

$("#uploadBtn").addEventListener("click", () => $("#fileInput").click());
$("#fileInput").addEventListener("change", event => {
  const files = [...event.target.files];
  if (!files.length) return;
  files.reverse().forEach(file => {
    const row = document.createElement("button");
    row.className = "material-row";
    const extension = (file.name.split(".").pop() || "FILE").slice(0, 3).toUpperCase();
    row.innerHTML = `
      <span class="doc-icon doc-icon-blue">${extension}</span>
      <span class="material-name"><strong></strong><small>Biology Buddies · by you</small></span>
      <span class="material-date">Just now</span>
      <span class="collab-avatars"><i>AM</i></span>
      <span class="row-more"><svg><use href="#i-more"/></svg></span>`;
    row.querySelector("strong").textContent = file.name.replace(/\.[^/.]+$/, "");
    $("#materialsTable").prepend(row);
  });
  showToast("Upload complete", `${files.length} ${files.length === 1 ? "file is" : "files are"} synced with Biology Buddies.`);
  event.target.value = "";
});

$("#newGroupBtn").addEventListener("click", () => {
  showToast("Group creation", "The invite flow is ready for the next backend milestone.");
  closePanels();
});

$$(".material-row, .learning-card").forEach(item => {
  item.addEventListener("click", () => showToast("Opening material", "A cached copy is available for offline reading."));
});

const searchInput = $("#searchInput");
searchInput.addEventListener("input", () => {
  const term = searchInput.value.trim().toLowerCase();
  $$(".learning-card, .material-row, .group-link").forEach(item => {
    item.classList.toggle("search-hidden", term && !item.textContent.toLowerCase().includes(term));
  });
});

document.addEventListener("keydown", event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape") {
    closePanels();
    modalBackdrop.classList.remove("open");
  }
});

function setView(view) {
  $$(".nav-item[data-view], .mobile-nav [data-view]").forEach(button => {
    button.classList.toggle("active", button.dataset.view === view);
  });
  const labels = {
    dashboard: ["Good afternoon, Alex 👋", "You have a group session starting soon. Ready to focus?"],
    groups: ["Your study groups", "Three circles of curious people, all in one place."],
    library: ["Your learning library", "Every note and resource, synced and ready offline."],
    progress: ["Your progress", "Small, steady sessions are adding up beautifully."]
  };
  $(".greeting-row h1").textContent = labels[view][0];
  $(".greeting-row > div > p:last-child").textContent = labels[view][1];
  if (view !== "dashboard") showToast(`${labels[view][0]}`, "This prototype keeps the dashboard modules in view.");
  closePanels();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

$$("[data-view]").forEach(button => button.addEventListener("click", () => setView(button.dataset.view)));
$$("[data-view-link]").forEach(button => button.addEventListener("click", () => setView(button.dataset.viewLink)));

function updateConnectivity() {
  const offline = !navigator.onLine;
  $("#offlineBanner").classList.toggle("show", offline);
  $(".sync-status").innerHTML = offline
    ? "<span style='background:#df846d'></span> Working offline"
    : "<span></span> All changes saved";
}
window.addEventListener("online", () => {
  updateConnectivity();
  showToast("Back online", "Your offline changes are syncing now.");
});
window.addEventListener("offline", updateConnectivity);
updateConnectivity();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
