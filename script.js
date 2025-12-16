"use strict";

/**
 * all music information
 */
const musicData = [
  {
    backgroundImage: "./assets/images/poster1.jpg",
    posterUrl: "./assets/images/poster1.jpg",
    title: "Happy Moments (Master)",
    album: "No Spirit",
    year: 2022,
    artist: "No Spirit x Tonion",
    musicPath: "./assets/music/music-1.mp3",
  },
  {
    backgroundImage: "./assets/images/poster2.jpg",
    posterUrl: "./assets/images/poster2.jpg",
    title: "We Are Going To Be Ok (Master)",
    album: "No Spirit",
    year: 2022,
    artist: "No Spirit x Jhove",
    musicPath: "./assets/music/music-2.mp3",
  },
  {
    backgroundImage: "./assets/images/poster3.jpg",
    posterUrl: "./assets/images/poster3.jpg",
    title: "Winter Meadow",
    album: "No Spirit",
    year: 2022,
    artist: "No Spirit x  juniorodeo",
    musicPath: "./assets/music/music-3.mp3",
  },
  {
    backgroundImage: "./assets/images/poster4.jpg",
    posterUrl: "./assets/images/poster4.jpg",
    title: "From Where We Started",
    album: "No Spirit",
    year: 2022,
    artist: "No Spirit",
    musicPath: "./assets/music/music-4.mp3",
  },
  {
    backgroundImage: "./assets/images/poster5.jpg",
    posterUrl: "./assets/images/poster5.jpg",
    title: "Where I Found You",
    album: "No Spirit",
    year: 2022,
    artist: "No Spirit",
    musicPath: "./assets/music/music-5.mp3",
  },
];

/**
 * add eventListener on all elements that are passed
 */
const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
};

/**
 * PLAYLIST
 * add all music in playlist from musicData
 */
const playList = document.querySelector("[data-music-list]");

for (let i = 0, len = musicData.length; i < len; i++) {
  playList.innerHTML += `
  <li>
    <button
      class="music-item ${i == 0 ? "playing" : ""}"
      data-playlist-toggler
      data-playlist-item="${i}"
    >
      <img
        src="${musicData[i].posterUrl}"
        alt="${musicData[i].title} Album Poster"
        class="img-cover"
        width="800"
        height="800"
      />
      <div class="item-icon">
        <span class="material-symbols-rounded">equalizer</span>
      </div>
    </button>
  </li>
  `;
}

/**
 * PLAYLIST MODAL SIDEBAR TOGGLE
 * show playlist modal sidebar when click on playlist button in top app bar
 * and hide when click on overlay or any playlist-item
 */
const playListSideModal = document.querySelector("[data-playlist]");
const playListTogglers = document.querySelectorAll("[data-playlist-toggler]");
const overlay = document.querySelector("[data-overlay]");

const togglePlayList = function (event) {
  event.stopPropagation(); // Prevent document listener from firing
  playListSideModal.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("modalActive");
};

const closePlayList = function () {
  playListSideModal.classList.remove("active");
  overlay.classList.remove("active");
  document.body.classList.remove("modalActive");
};

// Click on playlist toggle button
addEventOnElements(playListTogglers, "click", togglePlayList);

// Click outside playlist to close
document.addEventListener("click", function (event) {
  const clickedInside = playListSideModal.contains(event.target);
  const clickedToggle = event.target.closest("[data-playlist-toggler]");

  if (
    playListSideModal.classList.contains("active") &&
    !clickedInside &&
    !clickedToggle
  ) {
    closePlayList();
  }
});

// Optional: click on overlay also closes
overlay.addEventListener("click", closePlayList);

/**
 * PLAYLIST ITEM
 *
 * Remove active state from last time played music
 * and add active state in clicked music
 */

const playlistItems = document.querySelectorAll("[data-playlist-item]");

let currentMusic = 0;
let lastPlayedMusic = 0;

const changePlayListItem = function () {
  playlistItems[lastPlayedMusic].classList.remove("playing");
  playlistItems[currentMusic].classList.add("playing");
};

addEventOnElements(playlistItems, "click", function () {
  lastPlayedMusic = currentMusic;
  currentMusic = Number(this.dataset.playlistItem);
  changePlayListItem();
});

/**
 * PLAYER
 *
 * Change all visual information on the player, based on current music
 */

// Player elements
const playerBanner = document.querySelector("[data-player-banner]");
const playerTitle = document.querySelector("[data-title]");
const playerAlbum = document.querySelector("[data-album]");
const playerYear = document.querySelector("[data-year]");
const playerArtist = document.querySelector("[data-artist]");

// Audio element
let audioSource = new Audio(musicData[currentMusic].musicPath);

// Function to update player visuals
const changePlayerInfo = function () {
  // Update album banner image
  playerBanner.src = musicData[currentMusic].posterUrl;
  playerBanner.alt = `${musicData[currentMusic].title} Album Poster`;

  // Update page background
  document.body.style.backgroundImage = `url(${musicData[currentMusic].backgroundImage})`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundRepeat = "no-repeat";

  // Update player text info
  playerTitle.textContent = musicData[currentMusic].title;
  playerAlbum.textContent = musicData[currentMusic].album;
  playerYear.textContent = musicData[currentMusic].year;
  playerArtist.textContent = musicData[currentMusic].artist;

  // Update audio source
  audioSource.src = musicData[currentMusic].musicPath;
  audioSource.play(); // automatically play selected music
};

// Update player when a playlist item is clicked
addEventOnElements(playlistItems, "click", function () {
  lastPlayedMusic = currentMusic;
  currentMusic = Number(this.dataset.playlistItem);
  changePlayListItem();
  changePlayerInfo();
});

/** update player duration */
const playerDuration = document.querySelector("[data-duration]");
const playerSeekRange = document.querySelector("[data-seek]");

/** pass seconds and get timecode format */
const getTimecode = function (duration) {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration - minutes * 60); // use floor for accuracy
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

/** update duration label and seek max */
const updateDuration = function () {
  playerSeekRange.max = Math.floor(audioSource.duration);
  playerDuration.textContent = getTimecode(playerSeekRange.max);
};

// Listen for metadata loaded to update duration
audioSource.addEventListener("loadedmetadata", updateDuration);

/**
 * PLAY MUSIC
 *
 * play and pause music when click on play button
 */

const playBtn = document.querySelector("[data-play-btn]");

let playInterval;

const playMusic = function () {
  if (audioSource.paused) {
    audioSource.play();
    playBtn.classList.add("active");
    playInterval = setInterval(updateRunningTime, 500);
  } else {
    audioSource.pause();
    playBtn.classList.remove("active");
    clearInterval(playInterval);
  }
};

playBtn.addEventListener("click", playMusic);

/** update running time while playing music */

const playerRunningTime = document.querySelector("[data-running-time");

const updateRunningTime = function () {
  playerSeekRange.value = audioSource.currentTime;
  playerRunningTime.textContent = getTimecode(audioSource.currentTime);

  updateRangeFill();
  isMusicEnd();
};

/**
 * RANGE FILL WIDTH
 *
 * change 'rangeFill' width, while changing range value
 */

const ranges = document.querySelectorAll("[data-range]");
const rangeFill = document.querySelector("[data-range-fill]");

const updateRangeFill = function () {
  let element = this || ranges[0];

  const rangeValue = (element.value / element.max) * 100;
  element.nextElementSibling.style.width = `${rangeValue}%`;
};

addEventOnElements(ranges, "input", updateRangeFill);

/**
 * SEEK MUSIC
 *
 * seek music while changing player seek range
 */

const seek = function () {
  audioSource.currentTime = playerSeekRange.value;
  playerRunningTime.textContent = getTimecode(playerSeekRange.value);
};

playerSeekRange.addEventListener("input", seek);

/**
 * END MUSIC
 */

const isMusicEnd = function () {
  if (audioSource.ended) {
    playBtn.classList.remove("active");
    audioSource.currentTime = 0;
    playerSeekRange.value = audioSource.currentTime;
    playerRunningTime.textContent = getTimecode(audioSource.currentTime);
    updateRangeFill();
  }
};

/**
 * SKIP TO NEXT MUSIC
 */

const playerSkipNextBtn = document.querySelector("[data-skip-next]");

const skipNext = function () {
  lastPlayedMusic = currentMusic;

  if (isShuffled) {
    shuffleMusic();
  } else {
    currentMusic >= musicData.length - 1 ? (currentMusic = 0) : currentMusic++;
  }

  changePlayerInfo();
  changePlaylistItem();
};

playerSkipNextBtn.addEventListener("click", skipNext);

/**
 * SKIP TO PREVIOUS MUSIC
 */

const playerSkipPrevBtn = document.querySelector("[data-skip-prev]");

const skipPrev = function () {
  lastPlayedMusic = currentMusic;

  if (isShuffled) {
    shuffleMusic();
  } else {
    currentMusic <= 0 ? (currentMusic = musicData.length - 1) : currentMusic--;
  }

  changePlayerInfo();
  changePlaylistItem();
};

playerSkipPrevBtn.addEventListener("click", skipPrev);

/**
 * SHUFFLE MUSIC
 */

/** get random number for shuffle */
const getRandomMusic = () => Math.floor(Math.random() * musicData.length);

const shuffleMusic = () => (currentMusic = getRandomMusic());

const playerShuffleBtn = document.querySelector("[data-shuffle]");
let isShuffled = false;

const shuffle = function () {
  playerShuffleBtn.classList.toggle("active");

  isShuffled = isShuffled ? false : true;
};

playerShuffleBtn.addEventListener("click", shuffle);

/**
 * REPEAT MUSIC
 */

const playerRepeatBtn = document.querySelector("[data-repeat]");

const repeat = function () {
  if (!audioSource.loop) {
    audioSource.loop = true;
    this.classList.add("active");
  } else {
    audioSource.loop = false;
    this.classList.remove("active");
  }
};

playerRepeatBtn.addEventListener("click", repeat);

/**
 * MUSIC VOLUME
 *
 * increase or decrease music volume when change the volume range
 */

const playerVolumeRange = document.querySelector("[data-volume]");
const playerVolumeBtn = document.querySelector("[data-volume-btn]");

const changeVolume = function () {
  audioSource.volume = playerVolumeRange.value;
  audioSource.muted = false;

  if (audioSource.volume <= 0.1) {
    playerVolumeBtn.children[0].textContent = "volume_mute";
  } else if (audioSource.volume <= 0.5) {
    playerVolumeBtn.children[0].textContent = "volume_down";
  } else {
    playerVolumeBtn.children[0].textContent = "volume_up";
  }
};

playerVolumeRange.addEventListener("input", changeVolume);

/**
 * MUTE MUSIC
 */

const muteVolume = function () {
  if (!audioSource.muted) {
    audioSource.muted = true;
    playerVolumeBtn.children[0].textContent = "volume_off";
  } else {
    changeVolume();
  }
};

playerVolumeBtn.addEventListener("click", muteVolume);
