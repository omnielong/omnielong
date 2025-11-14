# 🔐 Credenziali di Test

## Utenti Disponibili

### 👤 Reseller (Rivenditore)
- **Email:** `admin@techpos.it`
- **Password:** `reseller123`
- **Accesso:** Gestione completa di tutti i business e negozi

### 🏢 Business Admin 1 - Eleganza Fashion Group
- **Email:** `info@eleganzafashion.it`
- **Password:** `fashion123`
- **Piano:** Professional
- **Negozi associati:** 2 punti vendita moda (max 5)

### 🏢 Business Admin 2 - Caffè Da Vinci
- **Email:** `gestione@caffedavinci.com`
- **Password:** `caffe123`
- **Piano:** Basic
- **Negozi associati:** 2 bar (max 3)

### 🏢 Business Admin 3 - Trattoria Toscana
- **Email:** `info@trattoriatoscana.it`
- **Password:** `toscana123`
- **Piano:** Professional
- **Negozi associati:** 1 ristorante (max 2)

### 🏢 Business Admin 4 - SportWear Italia
- **Email:** `amministrazione@sportwearitalia.it`
- **Password:** `sport123`
- **Piano:** Basic
- **Negozi associati:** 1 negozio sport (max 2)

### 🏢 Business Admin 5 - Dolce Vita Pasticceria
- **Email:** `info@dolcevitapasticceria.it`
- **Password:** `dolce123`
- **Piano:** Free
- **Negozi associati:** 1 pasticceria (max 1)

### 🏢 Business Admin 6 - Pizzeria Napoletana Tradizione
- **Email:** `pizzeria@tradizionenapoli.com`
- **Password:** `pizza123`
- **Piano:** Basic
- **Negozi associati:** 1 pizzeria (max 2)

### 🏢 Business Admin 7 - La Matita Magica
- **Email:** `info@lamatitamagica.it`
- **Password:** `matita123`
- **Piano:** Basic
- **Negozi associati:** 1 cartoleria (max 1)

### 👨‍💼 Operatori Punto Vendita (Login con PIN)
- **PIN 1234** - Mario Rossi (Store Admin)
- **PIN 5678** - Laura Bianchi (Cassiere)
- **PIN 9012** - Giuseppe Verdi (Manager)

---

## 🎯 Flussi di Test

### Flusso Reseller
1. Login con `admin@techpos.it` / `reseller123`
2. Visualizza dashboard con lista business
   - **Le credenziali sono visibili su ogni card business** (email + password)
   - Click sull'icona "Copia" per copiare la password
3. Click su "Dettagli" → Vedi info complete + sezione **Credenziali di Accesso**
   - Puoi visualizzare/nascondere la password
   - Puoi copiare la password negli appunti
   - Puoi modificare la password del cliente
4. Click su "Negozi" → Vedi lista negozi del business
5. Click su "Entra nel Punto Vendita" → Accedi come Manager virtuale
6. Apri turno → Usa il POS completo
7. Logout → Torna alla lista negozi

### Flusso Business Admin
1. Login con una delle email business (es. `info@eleganzafashion.it` / `fashion123`)
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
