document.addEventListener("DOMContentLoaded", function () {
  /* --- Cake and Microphone Candle Logic --- */
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  const audio = document.getElementById("birthdayMusic");
  let candles = [];
  let audioContext, analyser, microphone;

  function updateCandleCount() {
    const activeCandles = candles.filter(c => !c.classList.contains("out")).length;
    candleCountDisplay.textContent = activeCandles;
  }

  function addCandle(left, top) {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = left + "px";
    candle.style.top = top + "px";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
    candles.push(candle);
    updateCandleCount();
  }

  cake.addEventListener("click", function (event) {
    const rect = cake.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;
    addCandle(left, top);
  });

  function isBlowing() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);
    const average = dataArray.reduce((sum, val) => sum + val, 0) / bufferLength;
    return average > 50;
  }

  function blowOutCandles() {
    let blownOut = 0;
    if (candles.some(c => !c.classList.contains("out"))) {
      if (isBlowing()) {
        candles.forEach(c => {
          if (!c.classList.contains("out") && Math.random() > 0.5) {
            c.classList.add("out");
            blownOut++;
          }
        });
      }
      if (blownOut > 0) updateCandleCount();
      if (candles.every(c => c.classList.contains("out"))) {
        setTimeout(() => {
          confetti();
          endlessConfetti();
          audio.play();
        }, 300);
      }
    }
  }

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        setInterval(blowOutCandles, 200);
      })
      .catch(function (err) {
        console.log("Unable to access microphone: " + err);
      });
  }

  function endlessConfetti() {
    setInterval(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 1500);
  }

  /* --- Envelope Animation & Hearts --- */
  const envelope = document.getElementById("envelope");
  const chibi = document.querySelector(".chibi");
  const envelopeSound = document.getElementById("envelopeSound");
  const heartsContainer = document.getElementById("heartsContainer");

  envelope.addEventListener("click", function () {
    const isOpen = envelope.classList.toggle("open");

    if (isOpen) {
      chibi.classList.add("bounce");
      envelopeSound.play();
      spawnHearts(7);
    } else {
      chibi.classList.remove("bounce");
    }
  });

  function spawnHearts(count) {
    for (let i = 0; i < count; i++) {
      const heart = document.createElement("div");
      heart.className = "heart-float";
      heart.style.left = Math.random() * 100 + "%";
      heart.textContent = "♥";
      heartsContainer.appendChild(heart);
      setTimeout(() => heart.remove(), 2000);
    }
  }
});
