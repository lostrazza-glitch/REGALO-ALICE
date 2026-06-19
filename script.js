"use strict";

const STORAGE_KEY = "22-petali-progress-v1";

const riddles = [
  {
    title: "Primo petalo — Che tipo di regalo è?",
    riddle: `Per 22 anni hai ricevuto tante cose,
ma questa non potrai metterla su una mensola
e non potrà essere incartata davvero.

Per viverla serviranno una valigia,
un po’ di tempo libero
e due persone che abbiano voglia di stare insieme.

Durerà più di un giorno,
ci farà dormire lontano da casa
e, quando finirà, resteranno fotografie e ricordi.

Che cos’è?`,
    answers: ["vacanza", "viaggio", "esperienza", "weekend", "fuga romantica"],
    hint: "Non è un oggetto: è qualcosa che vivremo insieme.",
    success: `Prima peonia sbocciata.
Esatto: il tuo regalo non è una cosa, ma una piccola vacanza insieme.
E durerà due notti.`,
    image: "images/foto-1.jpg",
    alt: "Noi due insieme durante una passeggiata",
    objectPosition: "center 72%"
  },
  {
    title: "Secondo petalo — Dove andremo?",
    riddle: `Ventidue anni, due notti
e una destinazione stretta tra il mare e le montagne.

È una terra famosa per il pesto,
la focaccia, le case colorate
e una quantità di curve non sempre necessaria.

Il luogo preciso è nascosto dove comincia ogni riga:`,
    acrostic: [
      "Ventidue candeline da festeggiare",
      "Abbiamo due notti tutte per noi",
      "Rivedremo paesaggi che conosciamo già",
      "Andremo lontano dalla routine",
      "Zero lavoro",
      "Zero pensieri",
      "E una sorpresa ancora da scoprire"
    ],
    question: "Dove andremo?",
    answers: ["varazze"],
    hint: "Guarda con attenzione la prima lettera di ogni riga.",
    success: `Seconda peonia sbocciata.
Destinazione sbloccata: Varazze, in Liguria.

Il posto potrebbe sembrarti familiare,
ma questa volta ci andremo per vivere qualcosa di completamente nuovo.`,
    image: "images/foto-2.jpg",
    alt: "Un nostro selfie insieme",
    objectPosition: "center 42%",
    caption: "Qualcosa ti ricorda questo posto?"
  },
  {
    title: "Ultimo petalo — Qual è la vera sorpresa?",
    riddle: `Il 22 giugno festeggeremo te,
ma durante la nostra vacanza spereremo
che qualcun altro decida di farsi vedere.

Partiremo da Varazze,
ma per qualche ora lasceremo la terraferma.

Saliremo su una barca
e andremo in mare aperto,
senza una destinazione precisa da raggiungere.

Non andremo a pescare,
non cercheremo un’isola
e non sarà una semplice gita panoramica.

Osserveremo attentamente l’acqua,
sperando di incontrare animali liberi
che vivono nel Mediterraneo,
respirano aria
e possono comparire all’improvviso tra le onde.

Qual è il tuo regalo?`,
    answers: [
      "whale watching",
      "whalewatching",
      "whale-watching",
      "avvistamento balene",
      "avvistamento cetacei",
      "vedere le balene",
      "vedere i delfini"
    ],
    hint: "Pensa a un’attività in barca dedicata all’osservazione di grandi animali marini.",
    success: `Tutte le peonie sono sbocciate.
Hai scoperto il tuo regalo!`,
    image: "images/foto-3.jpg",
    alt: "Noi due in viaggio insieme",
    objectPosition: "center 47%"
  }
];

const wrongMessages = [
  "Risposta creativa, ma il regalo resta ancora sotto sequestro.",
  "La giuria delle peonie ha detto di no.",
  "Bel tentativo. Una peonia ha appena alzato un sopracciglio.",
  "Non ancora, ma sei sulla rotta giusta.",
  "Le balene non confermano questa risposta.",
  "Riprova: il tuo regalo non può restare segreto per sempre."
];

const defaultState = {
  screen: "intro",
  level: 0,
  solved: 0,
  attempts: [0, 0, 0],
  accepted: false
};

let state = loadState();
let lastFocusedElement = null;
const stage = document.querySelector("#game-stage");
const modal = document.querySelector("#modal");

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== "object") return { ...defaultState };

    return {
      ...defaultState,
      ...saved,
      attempts: Array.isArray(saved.attempts) ? saved.attempts.slice(0, 3) : [0, 0, 0]
    };
  } catch {
    return { ...defaultState };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Uniforma maiuscole, accenti, spazi, apostrofi e trattini prima del confronto.
function normalizeAnswer(value) {
  return value
    .toLocaleLowerCase("it")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’'`´-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isCorrectAnswer(value, acceptedAnswers) {
  const answer = normalizeAnswer(value);
  return acceptedAnswers.some((accepted) => normalizeAnswer(accepted) === answer);
}

function photoMarkup(src, alt, objectPosition = "center", priority = false) {
  return `
    <figure class="photo-frame" style="--photo-position: ${objectPosition}">
      <img
        src="${src}"
        alt="${alt}"
        ${priority ? "fetchpriority=\"high\"" : "loading=\"lazy\""}
        decoding="async"
        data-photo
      />
      <figcaption class="photo-fallback">Qui comparirà una nostra foto</figcaption>
    </figure>`;
}

function renderIntro() {
  stage.innerHTML = `
    <article class="game-card centered">
      <div class="card-content">
        <p class="eyebrow">22 giugno · Capitolo zero</p>
        <h1>22 petali <span class="title-accent">per 22 anni</span></h1>
        <p class="intro-copy">Il 22 giugno compirai 22 anni.
Una coincidenza così perfetta meritava un regalo un po’ più difficile da scoprire.

Davanti a te ci sono tre indovinelli.
Ogni risposta corretta farà sbocciare nuove peonie e ti porterà sempre più vicino al tuo regalo.

Sei pronta?</p>
        ${photoMarkup("images/foto-iniziale.jpg", "Noi due insieme, pronti per una nuova avventura", "center 52%", true)}
        <button class="primary-button intro-button" type="button" data-action="start">
          Fai sbocciare la prima peonia&nbsp; ❀
        </button>
      </div>
    </article>`;
}

function renderRiddle() {
  const riddle = riddles[state.level];
  const acrostic = riddle.acrostic
    ? `<div class="acrostic" aria-label="Versi dell'indizio">${riddle.acrostic
        .map((line) => `<span><b>${line[0]}</b>${line.slice(1)}</span>`)
        .join("")}</div><p>${riddle.question}</p>`
    : "";
  const showHint = state.attempts[state.level] >= 2;

  stage.innerHTML = `
    <article class="game-card">
      <div class="card-content">
        <p class="eyebrow">Indovinello ${state.level + 1} di 3</p>
        <h2>${riddle.title}</h2>
        <div class="riddle-box">${riddle.riddle}${acrostic}</div>
        <form class="answer-form" data-answer-form novalidate>
          <label for="answer">La tua risposta</label>
          <div class="answer-row">
            <input
              id="answer"
              class="answer-input"
              name="answer"
              type="text"
              inputmode="text"
              autocomplete="off"
              placeholder="Scrivi qui…"
              required
              aria-describedby="feedback"
            />
            <button class="primary-button" type="submit">Controlla la risposta</button>
          </div>
          <p id="feedback" class="feedback" role="status"></p>
          <button class="hint-button" type="button" data-action="hint" ${showHint ? "" : "hidden"}>
            Dammi un indizio
          </button>
          <div id="hint-box" class="hint-box" hidden></div>
        </form>
      </div>
    </article>`;

  requestAnimationFrame(() => document.querySelector("#answer")?.focus({ preventScroll: true }));
}

function renderSuccess() {
  const riddle = riddles[state.level];
  const isLast = state.level === riddles.length - 1;

  stage.innerHTML = `
    <article class="game-card centered">
      <div class="card-content">
        <div class="success-mark" aria-hidden="true">❀</div>
        <p class="eyebrow">Risposta esatta</p>
        <h2>${isLast ? "La sorpresa è tua" : "Un altro petalo si apre"}</h2>
        <p class="success-copy">${riddle.success}</p>
        ${photoMarkup(riddle.image, riddle.alt, riddle.objectPosition)}
        ${riddle.caption ? `<p class="photo-caption">${riddle.caption}</p>` : ""}
        <button class="primary-button" type="button" data-action="continue">
          ${isLast ? "Scopri il regalo" : "Continua verso il prossimo petalo"}&nbsp; →
        </button>
      </div>
    </article>`;
}

function renderFinal() {
  stage.innerHTML = `
    <article class="game-card final-card centered">
      <div class="card-content">
        <p class="eyebrow">Sorpresa sbloccata · 100%</p>
        <h1>22 anni, 22 giugno <span class="title-accent">e una nuova avventura insieme</span></h1>
        <p class="final-copy">Partiremo per <strong>Varazze</strong>,
dove resteremo per <strong>due notti</strong>.

Saliremo su una barca per fare <strong>whale watching</strong>,
alla ricerca di balene, delfini
e altri animali liberi nel Mediterraneo.

Non posso prometterti che una balena
si presenterà puntuale per il tuo compleanno.

Posso però prometterti il mare,
due giorni insieme, tante fotografie
e un nuovo ricordo da aggiungere ai nostri.

<span class="final-wish">Buon 22º compleanno, amore.</span></p>
        ${photoMarkup("images/foto-finale.jpg", "Noi due insieme nella fotografia finale", "center 40%", true)}
        <div id="final-peonies" class="peony-garden" aria-label="Ventidue peonie sbocciate"></div>
        <button class="primary-button" type="button" data-action="accept">Accetto il regalo&nbsp; ♡</button>
      </div>
    </article>`;

  createFinalPeonies();
}

function createFinalPeonies() {
  const garden = document.querySelector("#final-peonies");
  if (!garden) return;

  garden.innerHTML = Array.from({ length: 22 }, (_, index) => {
    const rotate = `${-14 + (index % 7) * 4}deg`;
    const delay = `${Math.min(index * 55, 900)}ms`;
    return `<svg class="garden-peony" style="--rotate:${rotate};--delay:${delay}" aria-hidden="true"><use href="#peony"></use></svg>`;
  }).join("");
}

function updateProgress() {
  const progress = state.screen === "intro" ? 0 : state.solved === 0 ? 0 : Math.round((state.solved / 3) * 100);
  const displayProgress = progress === 67 ? 66 : progress;
  const indicator = document.querySelector("#petal-indicator");
  const label = document.querySelector("#progress-label");
  const fill = document.querySelector("#progress-fill");
  const track = document.querySelector(".progress-track");

  indicator.textContent = state.screen === "intro"
    ? "La sorpresa comincia qui"
    : state.screen === "final"
      ? "Tutti i petali sono sbocciati"
      : `Petalo ${state.level + 1} di 3`;
  label.textContent = `${displayProgress}%`;
  fill.style.width = `${displayProgress}%`;
  track.setAttribute("aria-valuenow", String(displayProgress));
}

function render({ focusStage = false } = {}) {
  if (state.screen === "intro") renderIntro();
  if (state.screen === "riddle") renderRiddle();
  if (state.screen === "success") renderSuccess();
  if (state.screen === "final") renderFinal();

  updateProgress();
  setupPhotoFallbacks();

  if (focusStage && state.screen !== "riddle") {
    requestAnimationFrame(() => stage.focus({ preventScroll: true }));
  }
}

function transitionTo(next) {
  stage.classList.add("is-leaving");
  window.setTimeout(() => {
    next();
    saveState();
    render({ focusStage: true });
    stage.classList.remove("is-leaving");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 180);
}

function setupPhotoFallbacks() {
  document.querySelectorAll("[data-photo]").forEach((image) => {
    const markMissing = () => image.closest(".photo-frame")?.classList.add("is-missing");
    image.addEventListener("error", markMissing, { once: true });
    if (image.complete && image.naturalWidth === 0) markMissing();
  });
}

function releasePetals(amount = 16, slow = false) {
  const layer = document.querySelector("#petal-layer");
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < amount; i += 1) {
    const petal = document.createElement("i");
    petal.className = "falling-petal";
    petal.style.setProperty("--left", `${Math.random() * 100}%`);
    petal.style.setProperty("--size", `${9 + Math.random() * 11}px`);
    petal.style.setProperty("--duration", `${slow ? 7 : 3.4 + Math.random() * 2.2}s`);
    petal.style.setProperty("--delay", `${Math.random() * (slow ? 3 : 0.6)}s`);
    petal.style.setProperty("--drift", `${-80 + Math.random() * 160}px`);
    petal.style.setProperty("--spin", `${180 + Math.random() * 540}deg`);
    fragment.appendChild(petal);
    window.setTimeout(() => petal.remove(), slow ? 11000 : 6500);
  }

  layer.appendChild(fragment);
}

function checkAnswer(form) {
  const input = form.elements.answer;
  const feedback = form.querySelector("#feedback");
  const hintButton = form.querySelector("[data-action='hint']");
  const value = input.value;

  if (!normalizeAnswer(value)) {
    feedback.textContent = "Prima scrivi una risposta: le peonie sono pazienti, ma non telepatiche.";
    input.focus();
    return;
  }

  if (isCorrectAnswer(value, riddles[state.level].answers)) {
    state.solved = Math.max(state.solved, state.level + 1);
    state.screen = "success";
    saveState();
    releasePetals(state.level === 2 ? 28 : 18);
    render({ focusStage: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  state.attempts[state.level] += 1;
  saveState();
  feedback.textContent = wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
  input.setAttribute("aria-invalid", "true");
  input.select();

  if (state.attempts[state.level] >= 2) {
    hintButton.hidden = false;
  }
}

function showHint(button) {
  const box = button.parentElement.querySelector("#hint-box");
  box.textContent = riddles[state.level].hint;
  box.hidden = false;
  button.hidden = true;
}

function openModal(trigger) {
  lastFocusedElement = trigger;
  modal.hidden = false;
  state.accepted = true;
  saveState();
  releasePetals(30, true);
  document.body.style.overflow = "hidden";
  modal.querySelector(".modal__close").focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
  lastFocusedElement?.focus();
}

function restartGame() {
  const confirmed = window.confirm("Vuoi davvero far richiudere tutte le peonie e ricominciare?");
  if (!confirmed) return;

  state = { ...defaultState, attempts: [0, 0, 0] };
  saveState();
  transitionTo(() => {});
}

document.addEventListener("submit", (event) => {
  if (!event.target.matches("[data-answer-form]")) return;
  event.preventDefault();
  checkAnswer(event.target);
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  if (action === "start") {
    transitionTo(() => {
      state.screen = "riddle";
      state.level = 0;
    });
  }
  if (action === "continue") {
    transitionTo(() => {
      if (state.level === 2) {
        state.screen = "final";
        releasePetals(22, true);
      } else {
        state.level += 1;
        state.screen = "riddle";
      }
    });
  }
  if (action === "hint") showHint(button);
  if (action === "accept") openModal(button);
  if (action === "close-modal") closeModal();
  if (action === "restart") restartGame();
  if (action === "home") {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.target.matches(".answer-input")) {
    event.preventDefault();
    event.target.closest("form")?.requestSubmit();
    return;
  }

  if (event.key === "Escape" && !modal.hidden) closeModal();
  if (event.key !== "Tab" || modal.hidden) return;

  const focusable = [...modal.querySelectorAll("button:not([disabled])")];
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

render();
