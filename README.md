# 22 petali per 22 anni

Un piccolo gioco romantico per smartphone e desktop, realizzato soltanto con HTML, CSS e JavaScript. Non richiede installazioni, account o dipendenze esterne.

## 1. Inserire o sostituire le fotografie

Le fotografie si trovano nella cartella `images`. Per sostituirle, usa file JPG mantenendo esattamente questi nomi:

- `foto-iniziale.jpg` — schermata iniziale;
- `foto-1.jpg` — dopo il primo indovinello;
- `foto-2.jpg` — dopo il secondo indovinello;
- `foto-3.jpg` — dopo il terzo indovinello;
- `foto-finale.jpg` — schermata del regalo.

Se una foto manca o non può essere caricata, il gioco mostra automaticamente un riquadro floreale al suo posto.

## 2. Avviare il gioco

Il modo più semplice è aprire `index.html` con un browser moderno.

Per provarlo tramite un piccolo server locale, apri il terminale nella cartella del progetto e usa:

```bash
python3 -m http.server 8000
```

Poi visita `http://localhost:8000`.

## 3. Modificare testi e risposte

- I testi introduttivi e finali sono in `script.js`, nelle funzioni `renderIntro()` e `renderFinal()`.
- Indovinelli, risposte accettate, indizi e messaggi di successo sono all'inizio di `script.js`, dentro l'elenco `riddles`.
- Colori, dimensioni e aspetto grafico sono in `style.css`.

Per aggiungere una risposta valida, inseriscila nell'elenco `answers` del livello interessato. Il controllo ignora maiuscole, accenti, spazi doppi, apostrofi e trattini.

## 4. Pubblicare gratuitamente con GitHub Pages

1. Crea un nuovo repository su GitHub.
2. Carica `index.html`, `style.css`, `script.js`, `README.md` e la cartella `images`.
3. Nel repository apri **Settings → Pages**.
4. In **Build and deployment**, scegli **Deploy from a branch**.
5. Seleziona il branch `main`, la cartella `/ (root)` e premi **Save**.

Dopo qualche minuto GitHub mostrerà l'indirizzo pubblico del gioco. Prima di condividerlo, aprilo da smartphone e completa i tre indovinelli una volta.

## Note

Il progresso viene salvato automaticamente nel browser tramite `localStorage`. Il pulsante **Ricomincia il gioco** cancella il percorso salvato e riparte dalla schermata iniziale.
