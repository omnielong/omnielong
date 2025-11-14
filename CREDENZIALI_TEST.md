# 🔐 Credenziali di Test

## Utenti Disponibili

### 👤 Reseller (Rivenditore)
- **Email:** `admin@techpos.it`
- **Password:** `reseller123`
- **Accesso:** Gestione completa di tutti i business e negozi

### 🏢 Business Admin 1 - Eleganza Fashion Group
- **Email:** `admin@eleganzafashion.it`
- **Password:** `business123`
- **Negozi associati:** 2 punti vendita moda
  - Eleganza Milano Montenapoleone
  - Eleganza Roma Via Condotti

### 🏢 Business Admin 2 - Caffè Da Vinci
- **Email:** `admin@caffedavinci.com`
- **Password:** `business123`
- **Negozi associati:** 2 bar
  - Caffè Da Vinci Navona
  - Caffè Da Vinci Trastevere

### 👨‍💼 Operatori Punto Vendita (Login con PIN)
- **PIN 1234** - Mario Rossi (Store Admin)
- **PIN 5678** - Laura Bianchi (Cassiere)
- **PIN 9012** - Giuseppe Verdi (Manager)

---

## 🎯 Flussi di Test

### Flusso Reseller
1. Login con `admin@techpos.it` / `reseller123`
2. Visualizza dashboard con lista business
3. Click su "Negozi" di un business → Vedi lista negozi del business
4. Click su "Entra nel Punto Vendita" → Accedi come Manager virtuale
5. Apri turno → Usa il POS completo
6. Logout → Torna alla lista negozi

### Flusso Business Admin
1. Login con `admin@eleganzafashion.it` / `business123`
2. Visualizza dashboard con i TUOI negozi (solo quelli del tuo business)
3. Click su "Dettagli" → Vedi informazioni complete negozio
4. Click su "Modifica" → Modifica configurazione negozio
5. Click su "Operatori" → Gestisci operatori del business

### Flusso Operatore (Store Manager/Cassiere)
1. Dalla pagina login, seleziona tab "Operatore"
2. Inserisci PIN (es. 1234)
3. Apri turno con saldo iniziale
4. Usa il POS per vendite
5. Chiudi turno

---

## 📊 Dati Mock Disponibili

### Negozi per Business
- **bus-1** (Eleganza Fashion): 2 negozi moda
- **bus-2** (Caffè Da Vinci): 2 bar
- **bus-3** (Trattoria Toscana): 1 ristorante
- **bus-4** (SportWear Italia): 1 negozio sport
- **bus-5** (Dolce Vita): 1 pasticceria
- **bus-6** (Pizzeria): 1 ristorante
- **bus-7** (La Matita Magica): 1 negozio generico

### Note
- Ogni negozio ha orari di apertura configurati
- Gli operatori sono già associati a store-1
- I prodotti e categorie sono condivisi tra tutti i negozi
