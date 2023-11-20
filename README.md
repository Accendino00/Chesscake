# ChessCake

*Università di Bologna, Ingegneria del Software AA 2023-2024*


## Team

Il nostro team è composto da:

<table>
    <tr>
        <td><b>Nome</b></td>
        <td><b>Matricola</b></td>
        <td><b>Ruolo Scrum</b></td>
    </tr>
    <tr>
        <td>Petru Marcel Marincas</td>
        <td>0001021679</td>
        <td>Product Owner</td>
    </tr>
    <tr>
        <td>Davide Donati</td>
        <td>0001019487</td>
        <td>Scrum Master</td>
    </tr>
    <tr>
        <td>Giuseppe Forciniti</td>
        <td>0001019464</td>
        <td>Developer</td>
    </tr>
    <tr>
        <td>Saad Farqad Medhat</td>
        <td>0001027683</td>
        <td>Developer</td>
    </tr>
    <tr>
        <td>Rafid Fardeen Hoque</td>
        <td>0001027503</td>
        <td>Developer</td>
    </tr>
    <tr>
        <td>Vlad Alexandru Stefanuca</td>
        <td>0001027092</td>
        <td>Developer</td>
    </tr>
</table>

## Sistema da realizzare

<!--- Dobbiamo descrivere il sistema che dobbiamo realizzare in poche parole, in modo da far capire che abbiamo capito -->

Dobbiamo creare una web application con la quale poter giocare ad una o più varianti di scacchi non ortodossi. Le varianti implementabili sono:
- Really Bad Chess
- Dark Chess
- Scacchi Reconnaisance Blind
- Scacchi invisibili (Kriegspiel)

All'interno di questa applicazione deve essere possibile giocare online, in modalità umano contro computer oppure  umano contro umano (in locale).

I giocatori si possono trovare e sfidarsi, possono concordare la modalità (la variante di scacchi) e i tempi di gioco, giocare la partita e salvarla.

Infine, possono scegliere di vedere i propri risultati in una classifica generale.

---

Questo prodotto dovrà essere collegato, in un modo a scelta, ad un qualche social network (X, Facebook, ...) e ciò deve dare l'accesso a diverse possibilità:
- Commentare le partite (in tempo reale oppure commentare una partita salvata)
- Cercare persone con cui giocare (magari con un post che include un link di invito, oppure che promuove il proprio nome utente o altro ancora)
- Giocare in modalità "mob" (far sì che il voto di più persone all'interno di un social decida la mossa successiva da fare)

---

Un'ultima feature che si può / deve implementare è l'integrazione o l'uso, in un qualche modo, di un LLM (es. ChatGPT).

Il LLM può essere usato per diversi scopi, ovvero:
- Supporto allo sviluppo (aiutare a scrivere User Stories o parte del codice)
- Supporto a funzionalità (commentare una partita)

L'uso di ChatGPT va documentato nel report finale con almeno i prompt utilizzati.

## Note

Per la *modalità di comunicazione* abbiamo in primis fatto dal vivo e con l'uso di WhatsApp e, dopo esserci organizzati, siamo passati a **Mattermost**.

Per le *daily scrum* ci veniva molto scomodo realizzarle dal vivo per incompatibilità sul trovarci tutti nello stesso luogo allo stesso tempo (in quanto abitiamo  tutti piuttosto distanti), quindi le abbiamo fatte prevalentemente in call, cercando di seguire il protocollo proposto da Scrum, usando **Discord**. Questo non esclude meeting dal vivo, ma ci aiuta a rimanere quanto più costanti e produttivi possibile.

La scelta della tecnologia da usare è stata fatta in modo democratico, in quanto tutti i membri del team hanno espresso la propria opinione e abbiamo deciso di usare:
- *React* per il frontend
  - In quanto lo stile di **Material-UI** è molto piacevole e facile da usare e ci velocizza il lavoro di creare un frontend
- *NodeJS* e *ExpressJS* per il backend
  - Motivato sia da una maggior familiarità con il linguaggio e il framework, sia dal fatto che ci permette di avere un backend molto leggero e veloce da sviluppare
- *MySQL* come DBMS
  - Anch'esso molto popolare e con cui diversi di noi hanno esperienza. Sicuramente richiede più attenzioni di *MongoDB* in quanto è relazionale, ma ci permette di avere una struttura più rigida e coerente dei dati.
  - Pianifichiamo anche di usare *phpMyAdmin* per aiutarci nella gestione del database.

Usiamo tutti **Visual Studio Code**, in quanto è flessibile, grazie alle estensioni, e ci permette di lavorare con facilità in gruppo. Non abbiamo quindi scelto un IDE specifico, ma abbiamo deciso di usare questo editor di testo.

Cerchiamo di integrare l'uso di ChatGPT con il nostro development per migliorare sopratutto la nostra velocità nella scrittura di cose semplici o che sono talmente chiare che l'unica cosa che manca è trascriverle in modo formale (che questo sia codice o testo). In ogni caso viene tutti *controllato e revisionato* prima di essere inserito nel progetto.

## Analisi dei rischi

I rischi che abbiamo identificato sono:
- **Nessuna dipendenza da Terze Parti**
  - Poiché il progetto non può avere dipendenze da servizi esterni, ci potrebbero essere limitazioni nelle funzionalità o nelle integrazioni.
- **Uso di API di social network oppure LLM**
  - L'uso delle API spesso è accompagnato da un prezzo, quindi potrebbe essere necessario un budget per il progetto.
  - In caso siano gratis, spesso vengono messi limiti, anch'essi da considerare.
  - Bisogna basarsi su un servizio che sia affidabile e che non vada offline o che non cambi le proprie API.
- **Adesione al vincolo di avere tutto sui server DISI**
  - Assicurarsi che tutti i dati e servizi risiedano sui server DISI potrebbe richiedere ulteriori risorse e attenzione, oppure una scelta delle tecnologie usata in base a ciò che è presente e ciò che possiamo installare.
- **Feedback e Iterazioni con il Requirement Owner**
  - La necessità di concordare regolarmente il backlog e le specifiche con il Requirement Owner potrebbe comportare ritardi o cambiamenti nel ciclo di sviluppo.