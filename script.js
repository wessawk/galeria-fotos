const messageCanvas = document.getElementById('messageCanvas');
const scratchCanvas = document.getElementById('scratchCanvas');
const msgCtx = messageCanvas.getContext('2d');
const scratchCtx = scratchCanvas.getContext('2d');

// Mensagem romântica
const messageLines = [
  "Meu amor,",
  "Você é a luz da minha vida.",
  "Contigo, os dias são melhores.",
  "Obrigado por cada sorriso,",
  "cada abraço e cada momento.",
  
];

// Desenhar mensagem no canvas de baixo
msgCtx.fillStyle = "#fff";
msgCtx.fillRect(0, 0, messageCanvas.width, messageCanvas.height);
msgCtx.font = "18px Pacifico, cursive";
msgCtx.fillStyle = "#ff3366";
msgCtx.textAlign = "center";

messageLines.forEach((line, i) => {
  msgCtx.fillText(line, messageCanvas.width / 2, 40 + i * 30);
});

// Preencher o canvas de cima com cinza
scratchCtx.fillStyle = "#ccc";
scratchCtx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

// Raspagem
let isDrawing = false;

function getPos(e, canvas) {
  const rect = canvas.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
  return { x, y };
}

function draw(pos) {
  scratchCtx.globalCompositeOperation = 'destination-out';
  scratchCtx.beginPath();
  scratchCtx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
  scratchCtx.fill();
  scratchCtx.globalCompositeOperation = 'source-over';
}

// Eventos mouse
scratchCanvas.addEventListener('mousedown', () => isDrawing = true);
scratchCanvas.addEventListener('mouseup', () => isDrawing = false);
scratchCanvas.addEventListener('mousemove', e => {
  if (isDrawing) draw(getPos(e, scratchCanvas));
});

// Eventos touch
scratchCanvas.addEventListener('touchstart', e => {
  e.preventDefault();
  isDrawing = true;
  draw(getPos(e, scratchCanvas));
}, { passive: false });

scratchCanvas.addEventListener('touchmove', e => {
  e.preventDefault();
  if (isDrawing) draw(getPos(e, scratchCanvas));
}, { passive: false });


// Verificar porcentagem raspada
function getScratchedPercent() {
  const imageData = scratchCtx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
  let cleared = 0;
  for (let i = 0; i < imageData.data.length; i += 4) {
    if (imageData.data[i + 3] === 0) cleared++;
  }
  return cleared / (imageData.data.length / 4) * 100;
}

let revealed = false;

function checkReveal() {
  if (revealed) return;
  const percent = getScratchedPercent();
  if (percent > 65) {
    revealed = true;
    showFinalMessage();
  }
}

scratchCanvas.addEventListener('mouseup', checkReveal);
scratchCanvas.addEventListener('touchend', checkReveal);

// Mostrar animação final
function showFinalMessage() {
  // Remover camada cinza (opcional)
  scratchCtx.clearRect(0, 0, scratchCanvas.width, scratchCanvas.height);

  // Criar texto animado
  const msg = document.createElement('div');
  msg.textContent = '❤️💕 Eu te amo pra sempre! 💕❤️';
  msg.className = 'final-message';
  document.querySelector('.scratch-section').appendChild(msg);

  // Corações em festa
  for (let i = 0; i < 20; i++) {
    setTimeout(() => createHeartBurst(), i * 100);
  }
}

// Corações em explosão
function createHeartBurst() {
  const heart = document.createElement('div');
  heart.className = 'heart-burst';
  heart.textContent = '💖';
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.top = (50 + Math.random() * 20) + 'vh';
  heart.style.animationDuration = (1 + Math.random()) + 's';
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 2000);
}

const music = document.getElementById('backgroundMusic');
const playButton = document.getElementById('playButton');
let isPlaying = false;

playButton.addEventListener('click', () => {
  if (!isPlaying) {
    music.play();
    playButton.textContent = '⏸️ Pausar Música';
  } else {
    music.pause();
    playButton.textContent = '❤️ Tocar Nossa Música';
  }
  isPlaying = !isPlaying;
});

// Detectar quando fotos entram na tela e adicionar efeito
const photos = document.querySelectorAll('.gallery-photo');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('photo-visible');
    }
  });
}, { threshold: 0.3 });

photos.forEach(photo => {
  observer.observe(photo);

  // Animação ao clicar
  photo.addEventListener('click', () => {
    photo.classList.remove('clicked'); // reset
    void photo.offsetWidth; // força reflow
    photo.classList.add('clicked');
  });
});
