// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const adminBtn = document.getElementById("adminBtn");

const loginModal = document.getElementById("loginModal");
const registerModal = document.getElementById("registerModal");

const loginClose = document.getElementById("loginClose");
const registerClose = document.getElementById("registerClose");

const loginSubmit = document.getElementById("loginSubmit");
const registerSubmit = document.getElementById("registerSubmit");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");

const loginError = document.getElementById("loginError");
const registerError = document.getElementById("registerError");

const channelsContainer = document.getElementById("channelsContainer");
const searchInput = document.getElementById("searchInput");

const playerSection = document.getElementById("playerSection");
const playerTitle = document.getElementById("playerTitle");
const videoPlayer = document.getElementById("videoPlayer");
const closePlayerBtn = document.getElementById("closePlayerBtn");

let channelsData = {};

function renderChannels(filter="") {
  channelsContainer.innerHTML = "";
  const keys = Object.keys(channelsData);
  keys.forEach(key => {
    const ch = channelsData[key];
    if(filter && !ch.name.toLowerCase().includes(filter.toLowerCase())) return;
    const card = document.createElement("div");
    card.className = "channel-card";
    card.innerHTML = `
      <img src="${ch.logo || 'https://via.placeholder.com/150?text=No+Logo'}" alt="${ch.name}" class="channel-logo" />
      <div class="channel-title">${ch.name}</div>
    `;
    card.onclick = () => {
      openPlayer(ch);
    };
    channelsContainer.appendChild(card);
  });
}

function openPlayer(channel) {
  playerTitle.textContent = channel.name;
  videoPlayer.src = channel.streamUrl;
  playerSection.style.display = "block";
  window.scrollTo(0, playerSection.offsetTop);
}

closePlayerBtn.onclick = () => {
  playerSection.style.display = "none";
  videoPlayer.pause();
  videoPlayer.src = "";
}

searchInput.addEventListener("input", e => {
  renderChannels(e.target.value);
});

// Auth state change
auth.onAuthStateChanged(user => {
  if(user){
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    // Show admin if user email ends with @admin.com for demo (change as needed)
    if(user.email.endsWith("@admin.com")){
      adminBtn.style.display = "inline-block";
    } else {
      adminBtn.style.display = "none";
    }
  } else {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    adminBtn.style.display = "none";
  }
});

// Login modal
loginBtn.onclick = () => {
  loginModal.style.display = "block";
  loginError.textContent = "";
}

loginClose.onclick = () => {
  loginModal.style.display = "none";
}

registerClose.onclick = () => {
  registerModal.style.display = "none";
}

document.getElementById("showRegister").onclick = () => {
  loginModal.style.display = "none";
  registerModal.style.display = "block";
}

// Login submit
loginSubmit.onclick = () => {
  const email = loginEmail.value;
  const pass = loginPassword.value;
  loginError.textContent = "";
  auth.signInWithEmailAndPassword(email, pass)
    .then(() => {
      loginModal.style.display = "none";
      loginEmail.value = "";
      loginPassword.value = "";
    })
    .catch(e => {
      loginError.textContent = e.message;
    });
}

// Register submit
registerSubmit.onclick = () => {
  const email = registerEmail.value;
  const pass = registerPassword.value;
  registerError.textContent = "";
  auth.createUserWithEmailAndPassword(email, pass)
    .then(() => {
      registerModal.style.display = "none";
      registerEmail.value = "";
      registerPassword.value = "";
    })
    .catch(e => {
      registerError.textContent = e.message;
    });
}

logoutBtn.onclick = () => {
  auth.signOut();
}

// Fetch channels data from Firebase DB
function fetchChannels() {
  db.ref("channels").on("value", snapshot => {
    channelsData = snapshot.val() || {};
    renderChannels(searchInput.value);
  });
}

fetchChannels();

// Admin Panel button redirect (placeholder)
adminBtn.onclick = () => {
  alert("Admin panel is under construction. You can add it later.");
  }
