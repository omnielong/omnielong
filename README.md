# POS System - Sistema Punto Vendita Professionale

Una web app moderna e completa per la gestione del punto vendita, ottimizzata per PC, tablet e mobile.

## ✨ Caratteristiche Principali

### 🛍️ Gestione Vendite
- **Interfaccia touch-friendly** ottimizzata per tablet e touchscreen
- **Catalogo prodotti** con ricerca rapida per nome o barcode
- **Filtri per categoria** per navigazione veloce
- **Carrello interattivo** con gestione quantità in tempo reale
- **Checkout multi-pagamento** (contanti, carta, digitale)
- **Storico transazioni** completo con statistiche

### 💰 Sistema Sconti Avanzato
- **Sconti percentuali** (10%, 20%, 50%, ecc.)
- **Sconti a importo fisso** (€5, €10, ecc.)
- **Codici coupon** con validazione
- **Sconti per singolo prodotto** o globali
- **Combinazione sconti** (prodotto + globale + carta fedeltà)

### 💳 Carte Fedeltà
- **Livelli membership** (Bronze, Silver, Gold, Platinum)
- **Accumulo punti** automatico (1 punto ogni 10€)
- **Sconti dedicati** per livello
- **Storico utilizzo** e gestione clienti

### 👥 Gestione Operatori
- **Login con PIN** sicuro e veloce
- **Ruoli differenziati** (Admin, Manager, Cassiere)
- **Gestione turni** con apertura/chiusura cassa
- **Controllo fondo cassa** e conteggio finale

### 📊 Dashboard e Reporting
- **Statistiche in tempo reale** su vendite giornaliere
- **Analisi metodi di pagamento** (contanti, carta, digitale)
- **Prodotti più venduti** con grafici
- **Storico transazioni** dettagliato
- **Medie e trend** di vendita

### 🔌 Integrazione Database Esterni
- **API REST** per sincronizzazione con Zucchetti
- **Sincronizzazione automatica** di prodotti, operatori, carte fedeltà
- **Invio vendite** in tempo reale al gestionale
- **Aggiornamento punti** carte fedeltà bidirezionale
- **Configurazione flessibile** (API Key, Basic Auth)

### 📱 Progressive Web App (PWA)
- **Installabile** su desktop, tablet e mobile
- **Funzionamento offline** con cache locale
- **Aggiornamenti automatici**
- **Esperienza nativa** su tutti i dispositivi

## 🚀 Installazione e Avvio

### Requisiti
- Node.js 18+
- npm o yarn

### Setup Iniziale

```bash
# Installare le dipendenze
npm install

# Avviare in modalità sviluppo
npm run dev

# Build per produzione
npm run build

# Preview build di produzione
npm run preview
```

L'applicazione sarà disponibile su `http://localhost:5173`

## 🔐 Accesso al Sistema

### PIN di Test Predefiniti

| Ruolo | Nome | PIN |
|-------|------|-----|
| **Admin** | Mario Rossi | 1234 |
| **Cassiere** | Laura Bianchi | 5678 |
| **Manager** | Giuseppe Verdi | 9012 |

## 📖 Guida Utilizzo

### 1. Login e Apertura Turno
1. Inserire il PIN dell'operatore
2. Configurare il fondo cassa iniziale
3. Aprire il turno

### 2. Effettuare una Vendita
1. Selezionare i prodotti dal catalogo
2. Regolare le quantità nel carrello
3. Applicare eventuali sconti
4. Applicare carta fedeltà (opzionale)
5. Procedere al pagamento
6. Scegliere il metodo di pagamento
7. Completare la transazione

### 3. Applicare Sconti
- **Sconto su singolo prodotto**: Click su "Applica sconto" nel prodotto
- **Sconto globale**: Click su "Sconto Globale" nel carrello
- **Carta fedeltà**: Click su "Carta Fedeltà" e selezionare il cliente

### 4. Dashboard e Statistiche
- Accedere dalla sidebar laterale
- Visualizzare statistiche giornaliere
- Consultare prodotti più venduti
- Analizzare metodi di pagamento

### 5. Chiusura Turno
1. Dalla dashboard, chiudere tutte le vendite
2. Andare su "Turno" dalla sidebar
3. Inserire il contante effettivo in cassa
4. Chiudere il turno
5. Verificare eventuali differenze

## 🔗 Integrazione con Zucchetti

### Configurazione API

1. Accedere a **Impostazioni** dalla sidebar
2. Inserire i dati di connessione:
   - **URL Base API**: `https://api.zucchetti.it`
   - **API Key**: Chiave di autenticazione
   - **Username/Password**: Credenziali alternative
3. Testare la connessione
4. Salvare la configurazione

### Sincronizzazione Dati

Dal pannello Impostazioni è possibile:
- **Sincronizzare prodotti** dal gestionale
- **Sincronizzare carte fedeltà**
- **Sincronizzare operatori**
- **Inviare vendite** automaticamente

### API Endpoints Richiesti

L'integrazione richiede che il sistema esterno esponga le seguenti API REST:

```
GET  /api/v1/health                       - Test connessione
GET  /api/v1/products                     - Elenco prodotti
POST /api/v1/sales                        - Invio vendita
GET  /api/v1/loyalty-cards                - Elenco carte fedeltà
PUT  /api/v1/loyalty-cards/:id/points     - Aggiorna punti
GET  /api/v1/operators                    - Elenco operatori
```

### Formato Dati

Il sistema mappa automaticamente i dati tra il formato interno e quello del gestionale esterno. Vedere `src/services/api.ts` per i dettagli del mapping.

## 🏗️ Architettura Tecnica

### Stack Tecnologico
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool veloce
- **TailwindCSS** - Styling moderno e responsive
- **Zustand** - State management leggero
- **React Router** - Navigazione
- **date-fns** - Gestione date
- **Lucide React** - Icone moderne
- **Vite PWA Plugin** - Progressive Web App

### Struttura Progetto

```
src/
├── components/          # Componenti React riutilizzabili
│   ├── Cart.tsx        # Componente carrello
│   ├── Checkout.tsx    # Componente checkout
│   └── ProductGrid.tsx # Griglia prodotti
├── pages/              # Pagine dell'applicazione
│   ├── LoginPage.tsx   # Login operatore
│   ├── ShiftPage.tsx   # Gestione turno
│   ├── POSPage.tsx     # Interfaccia POS principale
│   ├── DashboardPage.tsx # Dashboard statistiche
│   └── SettingsPage.tsx  # Impostazioni e integrazione
├── store/              # State management
│   └── useStore.ts     # Zustand store globale
├── services/           # Servizi esterni
│   └── api.ts          # Integrazione API Zucchetti
├── types/              # TypeScript types
│   └── index.ts        # Definizioni tipi
├── utils/              # Utilities
│   └── mockData.ts     # Dati di esempio
├── App.tsx             # Componente principale
└── main.tsx            # Entry point
```

### State Management

L'applicazione usa **Zustand** per lo state management con persistenza locale:
- Dati persistiti: prodotti, categorie, vendite, carte fedeltà, operatori
- Dati di sessione: operatore corrente, turno, carrello

### Sicurezza

- Autenticazione basata su PIN
- Protezione route con guard
- Validazione input lato client
- Supporto HTTPS per API esterne
- Credenziali API criptate

## 📱 Installazione come PWA

### Desktop (Chrome/Edge)
1. Aprire l'app nel browser
2. Click sull'icona ➕ nella barra degli indirizzi
3. Selezionare "Installa"

### Mobile (iOS)
1. Aprire in Safari
2. Tap su "Condividi"
3. Selezionare "Aggiungi a Home"

### Mobile (Android)
1. Aprire in Chrome
2. Tap sul menu (⋮)
3. Selezionare "Aggiungi a Home"

## 🎨 Design e UX

- **Design moderno** con gradients e ombre
- **Responsive** per desktop, tablet e mobile
- **Touch-friendly** con pulsanti grandi
- **Feedback visivo** per tutte le azioni
- **Animazioni fluide** per migliore UX
- **Colori accessibili** e leggibili
- **Icone intuitive** per tutte le funzioni

## 🔧 Personalizzazione

### Modificare i Prodotti
Editare `src/utils/mockData.ts` - array `mockProducts`

### Modificare le Categorie
Editare `src/utils/mockData.ts` - array `mockCategories`

### Modificare gli Sconti
Editare `src/utils/mockData.ts` - array `mockDiscounts`

### Modificare i Colori
Editare `tailwind.config.js` - sezione `theme.extend.colors`

### Aggiungere Nuovi Operatori
Editare `src/utils/mockData.ts` - array `mockOperators`

## 🚀 Deploy in Produzione

### Build Ottimizzata

```bash
npm run build
```

I file ottimizzati saranno in `dist/`

### Deploy su Server

Caricare il contenuto della cartella `dist/` sul server web.

**Importante**: Configurare il server per servire `index.html` per tutte le route (per React Router).

### Esempio Nginx

```nginx
server {
    listen 80;
    server_name pos.tuodominio.it;
    root /var/www/pos/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Deploy su Netlify/Vercel

1. Connettere il repository GitHub
2. Configurare build command: `npm run build`
3. Configurare publish directory: `dist`
4. Deploy automatico ad ogni push

## 📝 Note di Sviluppo

### Ambiente di Sviluppo

```bash
# Hot reload
npm run dev

# Lint
npm run lint
```

### Dati Mock

L'applicazione include dati di esempio per:
- 12 prodotti in 6 categorie
- 3 operatori con ruoli diversi
- 6 tipi di sconto
- 3 carte fedeltà con livelli differenti

### Storage Locale

L'app usa `localStorage` tramite Zustand persist per:
- Mantenere prodotti tra sessioni
- Salvare storico vendite
- Persistere configurazioni

---

**Sviluppato con ❤️ per semplificare la vendita al banco**
