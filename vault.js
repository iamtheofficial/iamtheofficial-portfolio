const showcaseTracks = [
  {
    title: "Certified G - West Coast Type Beat",
    audio: "assets/audio/prod-by-iamtheofficial-certified-g.mp3",
  },
  {
    title: "Champion - Trap Type Beat",
    audio: "assets/audio/prod-by-iamtheofficial-champion.mp3",
  },
  {
    title: "Company - R&B Demo",
    audio: "assets/audio/prod-by-iamtheofficial-company-demo.mp3",
  },
  {
    title: "Doggy Dogg - West Coast Type Beat",
    audio: "assets/audio/prod-by-iamtheofficial-doggy-dogg.mp3",
  },
  {
    title: "Galactic Love - Pop Demo",
    audio: "assets/audio/prod-by-iamtheofficial-galactic-love.mp3",
  },
  {
    title: "I Put On - Boom Bap Type Beat",
    audio: "assets/audio/prod-by-iamtheofficial-i-put-on.mp3",
  },
  {
    title: "Justice - Hip-Hop Type Beat",
    audio: "assets/audio/prod-by-iamtheofficial-justice.mp3",
  },
  {
    title: "Nobody - Hip-Hop & R&B Type Beat",
    audio: "assets/audio/prod-by-iamtheofficial-nobody.mp3",
  },
  {
    title: "Your Eyes - Reggae Type Beat",
    audio: "assets/audio/prod-by-iamtheofficial-your-eyes.mp3",
  },
];

const playlist = document.querySelector("#playlist");
const audioPlayer = document.querySelector("#mainAudioPlayer");
const currentTitle = document.querySelector("#currentTitle");
const year = document.querySelector("#year");
const playPauseBtn = document.querySelector("#playPauseBtn");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const progressBar = document.querySelector("#progressBar");
const currentTimeEl = document.querySelector("#currentTime");
const durationEl = document.querySelector("#duration");

let currentTrackIndex = 0;
let titleAnimationTimer = null;

if (year) {
  year.textContent = new Date().getFullYear();
}

function formatTime(seconds = 0) {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function updatePlayButton(isPlaying) {
  playPauseBtn.textContent = isPlaying ? "⏸" : "▶";
  playPauseBtn.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
}

function updateActiveTrack(index) {
  document.querySelectorAll(".playlist-track").forEach((button) => {
    const isActive = Number(button.dataset.trackIndex) === index;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-current", isActive ? "true" : "false");
  });
}

async function loadTrack(index, autoplay = false) {
  const track = showcaseTracks[index];
  if (!track) return;

  clearTimeout(titleAnimationTimer);
  currentTitle.classList.add("track-changing");

  titleAnimationTimer = setTimeout(async () => {
    currentTrackIndex = index;
    currentTitle.textContent = track.title;
    audioPlayer.src = track.audio;
    audioPlayer.load();

    updateActiveTrack(index);
    progressBar.value = 0;
    currentTimeEl.textContent = "0:00";
    durationEl.textContent = "0:00";
    updatePlayButton(false);
    currentTitle.classList.remove("track-changing");

    if (autoplay) {
      try {
        await audioPlayer.play();
        updatePlayButton(true);
      } catch (error) {
        updatePlayButton(false);
      }
    }
  }, 180);
}

function getWrappedTrackIndex(offset) {
  return (currentTrackIndex + offset + showcaseTracks.length) % showcaseTracks.length;
}

async function togglePlayback() {
  if (audioPlayer.paused) {
    try {
      await audioPlayer.play();
      updatePlayButton(true);
    } catch (error) {
      updatePlayButton(false);
    }
  } else {
    audioPlayer.pause();
    updatePlayButton(false);
  }
}

function renderPlaylist() {
  if (!playlist) return;

  const playlistItems = showcaseTracks.map((track, index) => {
    const button = document.createElement("button");
    button.className = "playlist-track";
    button.type = "button";
    button.dataset.trackIndex = index;

    const number = document.createElement("span");
    number.className = "playlist-number";
    number.textContent = String(index + 1).padStart(2, "0");

    const info = document.createElement("span");
    info.className = "playlist-info";

    const title = document.createElement("strong");
    title.textContent = track.title;

    info.append(title);
    button.append(number, info);

    button.addEventListener("click", () => loadTrack(index, true));
    return button;
  });

  playlist.replaceChildren(...playlistItems);
}

playPauseBtn.addEventListener("click", togglePlayback);
nextBtn.addEventListener("click", () => loadTrack(getWrappedTrackIndex(1), true));
prevBtn.addEventListener("click", () => loadTrack(getWrappedTrackIndex(-1), true));

audioPlayer.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener("timeupdate", () => {
  if (!audioPlayer.duration) return;

  progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
});

progressBar.addEventListener("input", () => {
  if (!audioPlayer.duration) return;

  audioPlayer.currentTime = (Number(progressBar.value) / 100) * audioPlayer.duration;
});

audioPlayer.addEventListener("play", () => updatePlayButton(true));
audioPlayer.addEventListener("pause", () => updatePlayButton(false));
audioPlayer.addEventListener("ended", () => loadTrack(getWrappedTrackIndex(1), true));

renderPlaylist();
loadTrack(0, false);
