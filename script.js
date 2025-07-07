document.addEventListener("DOMContentLoaded", function () {
  /* --- Existing Cake & Microphone Code --- */
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  let candles = [];
  let audioContext;
  let analyser;
  let microphone;
  const audio = document.getElementById("birthdayMusic");

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
    let average = dataArray.reduce((sum, val) => sum + val, 0) / bufferLength;
    return average > 50;
  }

  function blowOutCandles() {
    let blownOut = 0;
    if (candles.length > 0 && candles.some(c => !c.classList.contains("out"))) {
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
    setInterval(function () {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 1500);
  }

  /* --- New Envelope, Chibi Bounce, Hearts, and Sound --- */
  const envelope = document.getElementById("envelope");
  const chibi = document.querySelector(".chibi");
  const envelopeSound = document.getElementById("envelopeSound");
  const heartsContainer = document.getElementById("heartsContainer");

  envelope.addEventListener("click", function () {
    envelope.classList.toggle("open");

    // Toggle chibi bounce when envelope is open
    if (envelope.classList.contains("open")) {
      chibi.classList.add("bounce");
      // Play envelope sound
      envelopeSound.play();
      // Generate floating hearts
      spawnHearts(5);
    } else {
      chibi.classList.remove("bounce");
    }
  });

  // Function to spawn a number of hearts
  function spawnHearts(count) {
    for (let i = 0; i < count; i++) {
      const heart = document.createElement("div");
      heart.className = "heart-float";
      heart.style.left = Math.random() * 80 + "px";
      heart.textContent = "♥";
      heartsContainer.appendChild(heart);
      // Remove the heart after its animation (2 seconds)
      setTimeout(() => {
        heart.remove();
      }, 2000);
    }
  }
});
