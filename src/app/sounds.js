import getAudioContext from "@mohayonao/web-audio-utils/getAudioContext";
import fetchAudioBuffer from "@mohayonao/web-audio-utils/fetchAudioBuffer";

let audioContext = getAudioContext();
let sounds = [];

[
  "01.wav",
  "02.wav",
  "03.wav",
  "04.wav",
  "05.wav",
  "06.wav",
  "07.wav",
  "08.wav",
  "09.wav",
].forEach((filename, index) => {
  fetchAudioBuffer(`./assets/sounds/${filename}`, audioContext).then((audioBuffer) => {
    sounds[index] = audioBuffer;
  });
});

export default {
  get(index) {
    return sounds[index] || null;
  }
};
