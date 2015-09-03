import getAudioContext from "@mohayonao/web-audio-utils/getAudioContext";

function fetch(url) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();

    xhr.open("GET", url);
    xhr.responseType = "arraybuffer";

    xhr.onload = () => {
      resolve({
        text() {
          return xhr.response;
        },
        arrayBuffer() {
          return xhr.response;
        }
      });
    };

    xhr.onerror = reject;
    xhr.send();
  });
}

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
  "09.wav"
].forEach((filename, index) => {
  fetch(`./sounds/${filename}`).then((res) => {
    return res.arrayBuffer();
  }).then((arrayBuffer) => {
    return new Promise((resolve, reject) => {
      getAudioContext().decodeAudioData(arrayBuffer, resolve, reject);
    });
  }).then((audioBuffer) => {
    sounds[index] = audioBuffer;
  });
});

export default {
  get(index) {
    return sounds[index] || null;
  }
};
