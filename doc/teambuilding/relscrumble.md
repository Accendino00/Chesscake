<!---
Date: 23-10-2023
Informatica, Università di Bologna
Igegneria del software AA 2023-2024

Team: 
    - Petru Marcel Marincas
    - Davide Donati
    - Giuseppe Forciniti
    - Saad Farqad Medhat
    - Rafid Fardeen Hoque
    - Vlad Alexandru Stefanuca
-->


# Relazione Scrumble

## Abstract

Scrumble è un gioco dedicato al team building. Abbiamo seguito le indicazioni presenti sul manuale del [sito ufficiale](http://scrumble.pyxis-tech.com/) e abbiamo giocato ad una partita.

## 1 ⋅ Preambolo del gioco

### 1.1 ⋅ Creazione delle user stories

Abbiamo deciso di creare noi stessi delle user stories.

In questa prima fase abbiamo creato delle user stories piuttosto semplici e intuitive, in modo da poter iniziare velocemente a giocare, relative al progetto che dobbiamo realizzare, affinché non facciamo qualcosa completamente assestante.

Della creazione delle user stories se ne è occupato il PO (specificato in seguito), ma anche il team ha comunque dato un leggero contributo per ottimizzare i tempi.

Abbiamo quindi creato 15 user stories, che abbiamo trascritto su taiga (in modo da famigliarizzarci con questo ambiente ed evitare di sprecare carta). L'ordine che abbiamo seguito per la loro creazione è:
1. Suddivedere il progetto in diverse componenti, capendo chi vorrebbe usarle e perché.
2. Trascrivere questo con il formato delle user stories
3. Assegnare un valore di importanza a ciascuna user story (da 1 a 5 *stelle*)
4. Assegnare il valore di complessità a ciascuna user story
   1. Questo è stato fatto in collaborazione con il team di developer
5. Capire quali erano le dipendenze tra di loro, ovvero le user stories che dovevano essere completate prima di altre.

Le 15 user stories sono presenti in questo [file](./user_stories.md).

### 1.2 ⋅ Ruoli delle persone

Il nostro team è composto da 6 persone e abbiamo deciso di suddividerci i ruoli nel seguente modo:
- **Scrum Master** 
  - Petru Marcel Marincas
- **Product Owner**
  - Saad Farqad Medhat
- **Team** 
  - Davide Donati
  - Giuseppe Forciniti
  - Rafid Fardeen Hoque
  - Vlad Alexandru Stefanuca

### 1.3 ⋅ Setup del gioco

Lo scrum master si è occupato della spiegazione del gioco, del setup e della gestione del tempo, oltreché interfacciarsi con i giocatori per rendere la partita fluida e divertente. Il product owner si è occupato di creare le user stories e di spiegarle al team. Il team si è occupato di giocare e di fare le stime di complessità delle user stories.

Il gioco è stato giocato da uno dei calcolatori e usando random number generator per simulare il lancio dei dadi e la scelta delle carte.

In generale, l'intera parte di setup è stata piuttosto lunga, almeno rispetto alle nostre aspettative iniziali. Ci abbiamo badato circa 1 oretta e mezza per impostare il tutto e ben spiegare il funzionamento del gioco.

Abbiamo scelto di trascrivere le cose con priprità 4-5 come alta, 3 come media e 1-2 come bassa. Questa tabella l'abbiamo compilato all'interno del foglio excel.

### 1.4 ⋅ Scelte del gioco

In quanto non abbiamo trovato precise indicazioni su come bisogna muovere le pedine e quali rappresentano gli obbiettivi abbiamo fatto queste scelte:
- I Player, ovvero le pedine con le persone, rappresentano lo sviluppo fatto dai team
  - Quando si tira il dado, la persona sta in un progetto particolare nel quale, muovendo la pedina delle persone
- Le user stories sono rappresentate dalle carte
  - Quando un player raggiungere una user story, essa è terminata

Uno stesso team non può avere 2 user story.

Quando un problema parla del debito si aggiunge a tutto il team, quando no si aggiunge solo al player che ha tirato il dado.

## 2 ⋅ Svolgimento del gioco

### 2.1 - Sprint 0

##### 2.1.1 - Sprint planning

All'inizio dobbiamo scegliere 3 user stories. Abbiamo scelto quelle più importanti e che risolvono la maggior parte delle dipendenze, ovvero:
- **US01** - XL - 80 task
- **US12** - S - 32 task
- **US14** - M - 48 task

La scelta è stata resa difficile per causa delle dipendenze, e ci si è anche iniziati a preoccupare degli sprint successivi

Ci siamo trascritti le task per ognuna delle user stories, ed abbiamo iniziato a giocare.

Il debito tecnico inizia con 15, quindi un handicap del 0% sulla quantità di task da fare. 

US01 era svolto da 2, US12 da 1 e US14 da 1.


##### 2.1.2 - Sprint

###### Giorno 1

Il primo turno è durato piuttosto tanto visto che abbiamo dovuto formalizzare tutte le regole e capire come funzionava il gioco.

E' stato pescato un problema (**15**) in quanto qualcuno ha tirato il dado e ottenuto sei, è stato preso un problema. Questo ha aggiunto **20% al debito**. Quindi il nostro debito è passato a 18.

Abbiamo tutti scelto, durante la prima giornata di gioco, di andare avanti con le task.

###### Giorno 2

Abbiamo trovato la carta *daily* **8**. Questo ci ha dato un immunità per i test. Quindi se le prossime carte problema avessero avuto a che fare con i test, non avremmo dovuto considerarle.

Abbiamo continuato con i task.

###### Giorno 3

Abbiamo trovato la carta *daily* **17**. Abbiamo guadagnato 2 task che potevamo scegliere in che user story investire. Abbiamo scelto di metterle in US01, in quanto proporzionalmente era quello più indietro (task / task totali). La decisione è stata presa dal PO, oltreché dal team.

Quest'oggi uno del team ha deciso di risanare il debito tecnico piuttosto che andare avanti, mentre il resto hanno proseguito con le task.

Abbiamo anche avuto un *problema*, la numero 16. Abbiamo dovuto fare una scelta tra accumulare debiti oppure diminuire le task. Visto che accumulare 3 debiti ci mandava in "positivo" comunque rispetto alla giornata, in quanto li avevamo mossi indietro di 5, abbiamo fatto questa scelta.

###### Giorno 4

Abbiamo trovato la carta *daily* **20**. Il prossimo problema viene annullato oppure il prossimo bonus della daily viene raddoppiato. Lo abbiamo usato per annullare il problema, in quanto abbiamo rollato 6.

Abbiamo continuato tutti con le task.

###### Giorno 5

Abbiamo trovato la carta *daily* **31**. Abbiamo perso 3 debiti, ed ora siamo a 13. Problem **22**: abbiamo perso 2 task, tolte al team della persona che l'ha pescato.

Tutti hanno progredito con le task.

###### Giorno 6

Abbiamo trovato la carta *daily* **1**. Abbiamo guadagnato 1 task per membro, quindi ogni team si è mosso di 1 task e quello giallo si è mosso di 2. Problem **13**, ma è un test quindi lo abbiamo saltato in quanto avevamo l'immunità.

Tutti hanno progredito con le task.

###### Giorno 7

Abbiamo trovato la carta *daily* **25**. Ci fa perdere 2 di debito, ma anche di perdere 6 task. Siamo andati indietro con task di US09 e da US12, ciascuno con 3. Abbiamo anche trovato un *problem* **23**, con la quale abbiamo guadagnato dei debiti. Inoltre c'è stato un secondo *problem*, il **35**, che ti fa perdere 1 task.

Abbiamo continuato a progredire con le task.

###### Giorno 8

Abbiamo trovato la carta *daily* **36**, che ce ne fa prendere altre 3, ovvero la **39** (ogni US costa 3 less), **19** (annulliamo problema o duplichiamo daily), **37** (perdiamo 2 di debito, duplicato da quella di prima, quindi si perde 4 e siamo a debito 9, finalmente con debito basso).
E' stato incontrato un *problem*, **42**, che ci fa perdere 1 task. E poi un secondo problema, **36**, e il debito è stato automentato di 1.

Tutti sono andati avanti con le task. 

In questo giorno è stata completa la prima task, ovvero la: **US12 - S**.

###### Giorno 9

Abbiamo trovato la carta *daily* **32**, e si hanno perso 3 debiti, quindi si è arrivati a 7. C'è stato un problema: la numero **26**, ma non possiamo fallire i test quindi è stata annullata. 

E' stata anche completata la task **US09 - M**. Ed anche la **US01 - XL**. E ci è anche rimasto 1 tiro di dado in più. Abbiamo quindi scelto, in quanto non avevamo più task, di iniziare la **US13 - M**. Questa è una task che ci risulta in 36 di task. Abbiamo tirato il dado e abbiamo ottenuto 4, quindi abbiamo fatto 4 delle task, quindi ne sono rimaste 32.

#### 2.1.3 - Sprint review

Abbiamo finito con 1 user story da 32 task rimanenti. Pertanto il nostro debito aumenterà, per il prossimo sprint, di $\frac{32}{5}\tilde= \ 6$. Abbiamo pesacato la carta review **13**. 

Non solo abbiamo finito tutte le US, abbiamo deciso di iniziarne altre, in quanto abbiamo capito che avremmo massimizzato le task completate per il piccolo sacrificio del debito in più.

### 2.2 - Sprint 1

##### 2.2.1 - Sprint planning

Nella fase di planning abbiamo innanzitutto capito che la precedenza di alcune user stories non era correttamente attribuita durante la prima fase. Abbiamo quindi aumentato la priorità della **US-05**, in quanto questa era richiesta da molte altre user stories.

Inoltre abbiamo ridimensionato le priorità delle user stories degli altri tipi di scacchi possibili, in quanto abbiamo completato la **US-01**, ovvero realizzare una versione di scacchi, quindi la **US-02**, **US-03** e **US-04** non sono più così importanti (ovvero realizzare le altre versioni di scacchi).

Questo ci ha permesso di concentrarci meglio sul ricercare il valore più alto. Non ci siamo impegnati nel riadattare le altre user stories per raggiungere la somma totale di 45, in modo da non modificare troppo le nostre conoscenze del gioco.

Abbiamo quindi fatto la scelta di prendere le user stories:
- **US-05** - XL - 60 task
- **US-14** - M - 36 task
- **US-10** - M - 36 task
  - In quanto c'è debito basso e possiamo rischiare di fare qualcosa extra che non ha molta priorità.
  - Non necessariamente corretto, ma è per sfruttare il fatto di avere poco debito tecnico e quindi iniziare con meno task.

Inoltre abbiamo la **US-13** che è rimasta incompleta dallo sprint precedente, quindi abbiamo deciso di continuare con quella. Quella ha ancora 32 task da fare.

##### 2.2.2 - Sprint

###### Giorno 1

Siamo tutti andati avanti nelle task, senza incontrare problemi.

###### Giorno 2

Abbiamo trovato la carta *daily* **40**. Guadagnamo tante task quanto il dice roll. Abbiamo guadagnato 1 task, tristemente.

Abbiamo continuato con le task, ma abbiamo incontrato 1 problema, ovvero **42**, che ci fa perdere 1 task.

###### Giorno 3

Abbiamo trovato la carta *daily* **26**, che ci ha fatto perdere 1 task in quanto "i post-it dello scrum sono misteriosamente scomparsi".

Abbiamo incontrato il problema **9**, che ci fa aumentare il debito tecnico di 3, in quanto abbiamo trovato del debito, e il problema **34**, perdendo 1 task.

Tutti continuando con le task.

###### Giorno 4

Daily **24**, diminuiamo il debito tecnico di 1 e guadagnamo 3 task, che distribuiamo tra tutti i team.

Tutti procedono con le task e oggi senza problemi.

###### Giorno 5

Daily **35**, e in quanto non hanno risposto correttamente alle attività che si svolgono nel "daily scrum" il debito tecnico è aumentato di 5, adesso a 13, quindi tornando nella soglia del "basso" e non più del "nullo".

Tutti procedono con le task senza problemi.

###### Giorno 6

Daily **21**, dove lo scrum master ha spiegato il daily scrum e chi ci partecipa, risanando 3 di debito tecnico.

Tutti procedono con le task senza problemi.

###### Giorno 7

Daily **5**, con la quale abbiamo 1 debito tecnico in meno.

Tutti procedono con le task senza problemi.

###### Giorno 8

Daily **28**, con la quale si guadagna 3 task. Con queste siamo riuscite a completare **US-05**!

E' stata completata la **US-14** con un tiro di dado di 4, e poi la **US-10** si è avvicinato di molto alla fine, e con l'aiuto dei membri dei team che hanno finito le proprie task sono riusciti a finire anch'essa.

Abbiamo trovato un problema, **12** il quale ci fa perdere 1 task.

A questo punto le 3 task che si erano imposti i team sono state completate, e manca soltato la **US-10**. Tutti si sono uniti per cercare di completarla nell'ultimo giorno, o comunque diminuire il suo impatto sul debito tecnico.

###### Giorno 9

Daily **34**, la quale ci fa skippare il turno a tutti!

E' qua che si è concluso lo sprint, con la **US-10** che non è stata completata, alla quale mancano 34 task.

#### 2.2.3 - Sprint review

Abbiamo finito con un user story in più, dovuto al fatto che abbiamo sopravvalutato la quantità di task fattibili visto il nostro debito tecnico.

Abbiamo imparato pertanto che vanno considerate un po' meglio le "problematiche" che possono sorgere durante lo sprint in modo inaspettato, e che non bisogna sopravvalutare la quantità di task che si possono fare.

Questo ci ha quindi anche aumentato il debito di 7, pertanto ora siamo a 17.

Abbiamo preso la review card **27**, la quale ci fa risanare 5 di debito tecnico, che ci mantiene comunque dentro "low" e non "nullo". 

### 3 ⋅ Conclusioni

Innanzitutto il gioco ci è stato utile: ci ha fatto porre domande più specifiche sulla struttura di scrum e quindi ci ha aiutato a capire meglio e più approfonditamente il suo funzionamento e l'approccio che dobbiamo avere nella sua adozione. Se prima era un concetto piuttosto astratto, è stato come fare una pratica accellerata di un progetto reale e pertanto siamo entrati nell'ottica.

Il gioco di per se è semplice, ma abbiamo notato che alcune delle regole sono intuitive e facili da capire, mentre per altre è stato necessario rileggere più volte in manuale e, in alcuni casi, ci sono spiegazioni incomplete, o anche mancanti, di come giocare.

I ruoli che ci siamo assegnati non si sono tradotti uno ad uno con i ruoli che poi abbiamo voluto assumere nel progetto reale, determinandoli sia in base a preferenze che a competenze pregresse. Il gioco ha sottolineato la rilevanza di ciascun ruolo all'interno di scrum, nonché come si interfacciano tra di loro.

La scelta di creare user stories si è rivelata particolarmente prolissa, ma ci ha dato un vantaggio nel poi riuscire a creare le effettive user stories che abbiamo definito in questa prima fase. Inoltre ci ha aiutato a capire meglio come funzionano le user stories e come si devono creare.

Infine, il gioco ci ha fatto riflettere sull'imprevedibilità di un progetto e come sia necessario avere un approccio più conservativo nella stima delle task fattibili, andando ad unire le informazioni ottenute dagli sprint prededenti alle nuove stime.