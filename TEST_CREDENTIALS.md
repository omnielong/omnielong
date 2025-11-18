# 🔐 Credenziali di Test

## Accessi Disponibili

### 👤 Rivenditore (Reseller)
**Email:** `admin@techpos.it`
**Password:** `reseller123`

**Cosa può fare:**
- ✅ Visualizzare tutti i clienti business
- ✅ Creare e modificare clienti business
- ✅ Visualizzare e gestire i negozi dei clienti
- ❌ NON può accedere al POS (è solo un amministratore)

---

### 🏢 Cliente Business
**Email:** `admin@fashionstore.it`
**Password:** `business123`

**Cosa può fare:**
- ✅ Visualizzare i propri negozi
- ✅ Creare e modificare negozi
- ✅ Gestire gli operatori dei propri negozi
- ❌ NON può accedere al POS (deve creare operatori)

---

### 💼 Operatore POS
**PIN:** `1234` (Mario Rossi - Cassiere)
**PIN:** `1111` (Luca Verdi - Manager)
**PIN:** `2222` (Anna Neri - Cassiere)

**Cosa può fare:**
- ✅ Aprire turni
- ✅ Accedere al POS
- ✅ Effettuare vendite
- ✅ Gestire prodotti (se ha i permessi)

---

## 🧪 Come Testare

### Test 1: Login Reseller
1. Vai su http://localhost:5173/
2. Seleziona tab "Reseller"
3. Email: `admin@techpos.it`
4. Password: `reseller123`
5. ✅ Dovresti vedere la dashboard rivenditore con tutti i clienti

### Test 2: Login Business
1. Vai su http://localhost:5173/
2. Seleziona tab "Business"
3. Email: `admin@fashionstore.it`
4. Password: `business123`
5. ✅ Dovresti vedere i tuoi 2 negozi e gli operatori

### Test 3: Login Operatore POS
1. Vai su http://localhost:5173/
2. Seleziona tab "Operatore"
3. PIN: `1234`
4. ✅ Dovresti entrare nel turno e poi nel POS

---

## ⚠️ Note Importanti

### Campo Password Non Visibile?
Se non vedi il campo password nella gestione clienti:
1. **Svuota cache browser**: `Ctrl + Shift + Delete` (Win) o `Cmd + Shift + Delete` (Mac)
2. **Hard refresh**: `Ctrl + Shift + R` o `Cmd + Shift + R`
3. **Oppure usa modalità incognito**: `Ctrl + Shift + N`

### Reseller Non Può Vendere
Il reseller è un **amministratore** che gestisce i clienti, non un operatore di cassa.
- ❌ Non può accedere al POS
- ✅ Può creare business e negozi per loro
- ✅ I clienti creano i propri operatori POS

### Business Non Può Vendere
Il business admin è un **proprietario** che gestisce negozi e operatori.
- ❌ Non può accedere al POS direttamente
- ✅ Deve creare operatori con PIN
- ✅ Gli operatori accedono al POS con il PIN

---

## 🔄 Reset Completo

Se vuoi ricominciare da zero:

```bash
# Ferma il server
Ctrl + C

# Cancella il localStorage del browser
# Apri Console (F12) e scrivi:
localStorage.clear()

# Riavvia il server
npm run dev

# Ricarica la pagina
Ctrl + Shift + R
```

---

## 📝 Gerarchia Accessi

```
Reseller (admin@techpos.it)
└── Business 1 (admin@fashionstore.it)
    ├── Negozio 1 (Milano Centro)
    │   ├── Operatore: Mario (PIN: 1234)
    │   └── Operatore: Luca (PIN: 1111)
    └── Negozio 2 (Milano Sempione)
        └── Operatore: Anna (PIN: 2222)
```

---

## 🐛 Problemi Comuni

**Problema:** "Non vedo i miei negozi come business"
**Soluzione:** Ricarica la pagina con `Ctrl + Shift + R`

**Problema:** "La lista operatori è vuota"
**Soluzione:** Ricarica la pagina, i dati mock dovrebbero caricarsi

**Problema:** "Non riesco ad accedere al POS"
**Soluzione:** Solo gli operatori con PIN possono accedere al POS, non reseller o business admin

**Problema:** "Password campo non appare"
**Soluzione:** Svuota cache browser o usa modalità incognito
