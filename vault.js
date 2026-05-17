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

if (year) {
  year.textContent = new Date().getFullYear();
}

function loadTrack(index, autoplay = false) {
  const track = showcaseTracks[index];

  currentTitle.classList.add("track-changing");

  setTimeout(() => {
    currentTrackIndex = index;
    currentTitle.textContent = track.title;
    audioPlayer.src = track.audio;

    document.querySelectorAll(".playlist-track").forEach((button) => {
      button.classList.remove("active");
    });

    const activeButton = document.querySelector(
      `[data-track-index="${index}"]`,
    );
    if (activeButton) {
      activeButton.classList.add("active");
    }

    progressBar.value = 0;
    currentTimeEl.textContent = "0:00";
    durationEl.textContent = "0:00";

    playPauseBtn.textContent = autoplay ? "⏸" : "▶";
    playPauseBtn.setAttribute("aria-label", autoplay ? "Pause" : "Play");

    currentTitle.classList.remove("track-changing");

    if (autoplay) {
      audioPlayer.play();
    }
  }, 180);
}

function formatTime(seconds) {
  if (Number.isNaN(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function playTrack() {
  audioPlayer.play();
  playPauseBtn.textContent = "⏸";
  playPauseBtn.setAttribute("aria-label", "Pause");
}

function pauseTrack() {
  audioPlayer.pause();
  playPauseBtn.textContent = "▶";
  playPauseBtn.setAttribute("aria-label", "Play");
}

function playNextTrack() {
  const nextIndex = currentTrackIndex + 1;

  if (nextIndex < showcaseTracks.length) {
    loadTrack(nextIndex, true);
  } else {
    loadTrack(0, true);
  }
}

function playPreviousTrack() {
  const previousIndex = currentTrackIndex - 1;

  if (previousIndex >= 0) {
    loadTrack(previousIndex, true);
  } else {
    loadTrack(showcaseTracks.length - 1, true);
  }
}

function renderPlaylist() {
  playlist.innerHTML = showcaseTracks
    .map(
      (track, index) => `
        <button class="playlist-track" data-track-index="${index}">
          <span class="playlist-number">${String(index + 1).padStart(2, "0")}</span>

          <span class="playlist-info">
            <strong>${track.title}</strong>
          </span>
        </button>
      `,
    )
    .join("");

  document.querySelectorAll(".playlist-track").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.trackIndex);
      loadTrack(index, true);
    });
  });
}

audioPlayer.addEventListener("ended", () => {
  const nextTrackIndex = currentTrackIndex + 1;

  if (nextTrackIndex < showcaseTracks.length) {
    loadTrack(nextTrackIndex, true);
  }
});

playPauseBtn.addEventListener("click", () => {
  if (audioPlayer.paused) {
    playTrack();
  } else {
    pauseTrack();
  }
});

nextBtn.addEventListener("click", playNextTrack);
prevBtn.addEventListener("click", playPreviousTrack);

audioPlayer.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener("timeupdate", () => {
  if (!audioPlayer.duration) return;

  const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  progressBar.value = progress;
  currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
});

progressBar.addEventListener("input", () => {
  if (!audioPlayer.duration) return;

  audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
});

audioPlayer.addEventListener("play", () => {
  playPauseBtn.textContent = "Pause";
});

audioPlayer.addEventListener("pause", () => {
  playPauseBtn.textContent = "Play";
});

audioPlayer.addEventListener("ended", playNextTrack);

renderPlaylist();
loadTrack(0, false);
