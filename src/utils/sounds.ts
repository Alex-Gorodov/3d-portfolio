const sounds = {
  woodScrape: new Audio("/sounds/woodScrape.ogg"),
  woodFall: new Audio("/sounds/woodFall.wav"),
  playerFall: new Audio("/sounds/falling.wav"),
};

let muted = false;

export function setMuted(value: boolean) {
  muted = value;
}

export function isMuted() {
  return muted;
}

export function playWoodScrape(volume = 0.02) {
  if (muted) return;
  sounds.woodScrape.currentTime = 0;
  sounds.woodScrape.volume = volume;

  sounds.woodScrape.play()
    .catch(() => {});
}


export function playWoodFall(volume = 0.02) {
  if (muted) return;
  sounds.woodFall.currentTime = 0;
  sounds.woodFall.volume = volume;

  sounds.woodFall.play()
    .catch(() => {});
}


export function playPlayerFall(volume = 0.12) {
  if (muted) return;
  sounds.playerFall.currentTime = 0;
  sounds.playerFall.volume = volume;

  sounds.playerFall.play()
    .catch(() => {});
}

export default sounds;
