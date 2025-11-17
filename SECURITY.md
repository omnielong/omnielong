# Security Policy

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### 1. **DO NOT** open a public GitHub issue

Security vulnerabilities should not be disclosed publicly until they have been addressed.

### 2. Report privately

Send an email to: **security@omnielong.example.com**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### 3. Response Time

- **Initial Response**: Within 48 hours
- **Status Update**: Every 7 days
- **Fix Timeline**: Depends on severity (see below)

### 4. Severity Levels

| Severity | Response Time | Example |
|----------|--------------|---------|
| **Critical** | 24-48 hours | Authentication bypass, SQL injection |
| **High** | 7 days | XSS, privilege escalation |
| **Medium** | 30 days | Information disclosure |
| **Low** | 90 days | Minor issues |

## Security Measures

### Authentication & Authorization

#### PIN Security
- ✅ **Hashed with bcrypt** (10 salt rounds)
- ✅ **Never stored in plain text**
- ✅ **4-6 digit validation**
- ⚠️ **No rate limiting** (to be implemented)
- ⚠️ **No account lockout** (to be implemented)

**Recommendations for Production:**
```typescript
// Implement rate limiting
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// Track failed attempts
const loginAttempts = new Map<string, number>();
```

#### Session Management
- ✅ Session stored in memory (Zustand)
- ✅ Cleared on logout
- ✅ No persistent session tokens
- ⚠️ **No session timeout** (to be implemented)

**Recommendation:**
```typescript
// Auto-logout after inactivity
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
```

### Data Encryption

#### API Keys
- ✅ Encrypted using XOR + Base64
- ✅ Never logged or exposed
- ⚠️ **Basic encryption** (upgrade recommended)

**Production Recommendation:**
```bash
# Use proper encryption library
npm install crypto-js
```

#### Sensitive Data
- ✅ Environment variables for secrets
- ✅ .env files gitignored
- ✅ Example file (.env.example) provided

### Input Validation

#### Client-Side
- ✅ **Zod schemas** for all data types
- ✅ **Input sanitization** utility
- ✅ **Length validation**
- ✅ **Type checking**

```typescript
// Example validation
import { sanitizeInput, isValidLength } from './utils/security';

const userInput = sanitizeInput(rawInput);
if (!isValidLength(userInput, 1000)) {
  throw new Error('Input too long');
}
```

#### Server-Side
⚠️ **Not implemented** (client-side only)

**TODO**: Implement backend API with server-side validation

### Cross-Site Scripting (XSS)

#### Protection Measures
- ✅ React escapes values by default
- ✅ Input sanitization (`sanitizeInput()`)
- ✅ CSP headers in nginx config
- ⚠️ **dangerouslySetInnerHTML not used**

#### Content Security Policy
```nginx
Content-Security-Policy:
  default-src 'self' https:;
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;
  style-src 'self' 'unsafe-inline' https:;
```

### Cross-Site Request Forgery (CSRF)

⚠️ **Not implemented** (no backend API)

**TODO**: When implementing backend:
```typescript
// Add CSRF token to all state-changing requests
headers: {
  'X-CSRF-Token': csrfToken
}
```

### SQL Injection

✅ **Not applicable** (no SQL database, localStorage only)

**Future**: When migrating to PostgreSQL, use parameterized queries:
```typescript
// Good - parameterized query
db.query('SELECT * FROM users WHERE id = $1', [userId]);

// Bad - string concatenation
db.query(`SELECT * FROM users WHERE id = '${userId}'`);
```

### Security Headers

Nginx configuration includes:

```nginx
# Prevent clickjacking
add_header X-Frame-Options "SAMEORIGIN" always;

# Prevent MIME type sniffing
add_header X-Content-Type-Options "nosniff" always;

# XSS protection
add_header X-XSS-Protection "1; mode=block" always;

# Referrer policy
add_header Referrer-Policy "no-referrer-when-downgrade" always;

# Content Security Policy
add_header Content-Security-Policy "..." always;
```

### HTTPS/TLS

⚠️ **Not enforced in development**

**Production Requirements:**
- ✅ Use HTTPS only
- ✅ TLS 1.2+ minimum
- ✅ Valid SSL certificate
- ✅ HTTP to HTTPS redirect

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    return 301 https://$host$request_uri;
}
```

### Data Storage

#### LocalStorage
- ⚠️ **Unencrypted** (browser security model)
- ✅ No sensitive credentials stored
- ✅ PIN hashed before storage

**Risks:**
- XSS can access localStorage
- No encryption at rest

**Mitigation:**
- Implement encryption for sensitive data
- Migrate to httpOnly cookies (backend required)

#### Session Storage
- Not currently used
- Consider for temporary data

### Dependency Security

#### Automated Scanning
- ✅ npm audit in CI/CD
- ✅ Dependabot alerts enabled
- ✅ CodeQL security scanning

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Force fix (breaking changes)
npm audit fix --force
```

#### Update Policy
- Minor/patch updates: Monthly
- Security updates: Immediately
- Major updates: Quarterly (with testing)

### Error Handling

#### Client-Side
- ✅ Sentry error tracking
- ✅ Error boundaries
- ✅ Structured logging
- ⚠️ **Some sensitive info in logs** (review needed)

**Best Practices:**
```typescript
// Good - sanitized error
logger.error('Authentication failed', new Error('Invalid credentials'));

// Bad - exposes sensitive data
logger.error('Login failed', { pin: '1234', userId: 'admin' });
```

### Logging & Monitoring

#### What We Log
- ✅ Authentication events (login/logout)
- ✅ Sales transactions
- ✅ API requests
- ✅ Errors and exceptions

#### What We DON'T Log
- ❌ PINs or passwords
- ❌ Full API keys
- ❌ Customer payment details
- ❌ Sensitive personal data

```typescript
// Redact sensitive data before logging
const safeUser = {
  ...user,
  pin: '[REDACTED]',
  apiKey: apiKey?.substring(0, 8) + '...'
};
logger.info('User created', safeUser);
```

### Third-Party Integrations

#### Sentry (Error Tracking)
- ✅ Data sanitization configured
- ✅ PII filtering
- ✅ Secure transmission (HTTPS)

```typescript
beforeBreadcrumb(breadcrumb) {
  if (breadcrumb.message?.toLowerCase().includes('pin')) {
    return null; // Don't log PINs
  }
  return breadcrumb;
}
```

#### External APIs
- ✅ API keys encrypted
- ✅ HTTPS only
- ✅ Timeout configured (30s)
- ⚠️ **No retry logic with backoff**

### Backup & Recovery

#### Data Backup
- ✅ Manual export to JSON
- ✅ Manual export to CSV
- ✅ Import functionality implemented
- ⚠️ **No automatic backups**
- ⚠️ **Backups not encrypted**

**Recommendations:**
```typescript
// Encrypt backups
import { encrypt } from './utils/security';

const encryptedBackup = encrypt(JSON.stringify(data));
```

## Security Checklist for Production

### Before Deployment

- [ ] Enable HTTPS/TLS
- [ ] Configure CSP headers
- [ ] Enable HSTS
- [ ] Set secure cookie flags (when using cookies)
- [ ] Implement rate limiting
- [ ] Add session timeout
- [ ] Enable CORS restrictions
- [ ] Review and minimize API permissions
- [ ] Encrypt sensitive localStorage data
- [ ] Configure production Sentry DSN
- [ ] Review all environment variables
- [ ] Disable debug mode
- [ ] Remove console.log statements
- [ ] Implement audit logging
- [ ] Set up monitoring alerts
- [ ] Configure database backups
- [ ] Test disaster recovery plan

### Ongoing Security

- [ ] Monthly dependency updates
- [ ] Quarterly security audits
- [ ] Regular penetration testing
- [ ] Review access logs
- [ ] Monitor Sentry for anomalies
- [ ] Update SSL certificates
- [ ] Review user permissions
- [ ] Security training for team

## Known Limitations

### Current Version (1.0.0)

1. **No Backend API**
   - All data in localStorage
   - No server-side validation
   - No session management

2. **Authentication**
   - Basic PIN authentication
   - No 2FA
   - No rate limiting
   - No account lockout

3. **Encryption**
   - Basic XOR encryption (not cryptographically secure)
   - No end-to-end encryption

4. **Data Storage**
   - localStorage unencrypted
   - No data isolation between browser tabs
   - Data loss if browser storage cleared

### Planned Improvements

#### Version 1.1
- [ ] Session timeout
- [ ] Rate limiting
- [ ] Enhanced PIN encryption

#### Version 2.0
- [ ] Backend API
- [ ] PostgreSQL database
- [ ] Server-side validation
- [ ] JWT authentication
- [ ] 2FA support

#### Version 3.0
- [ ] End-to-end encryption
- [ ] Audit logging service
- [ ] Advanced threat detection

## Security Best Practices

### For Developers

1. **Never commit secrets**
   ```bash
   # Use .gitignore
   .env
   .env.local
   .env.production
   ```

2. **Validate all inputs**
   ```typescript
   const validated = ProductSchema.parse(userInput);
   ```

3. **Sanitize outputs**
   ```typescript
   const safe = sanitizeInput(userInput);
   ```

4. **Use HTTPS in production**
5. **Keep dependencies updated**
6. **Review security advisories**
7. **Use linters and security scanners**

### For Operators

1. **Use strong PINs** (avoid 1234, 0000)
2. **Don't share PINs**
3. **Logout when leaving terminal**
4. **Report suspicious activity**
5. **Keep browser updated**
6. **Use secure networks** (avoid public WiFi)

### For Administrators

1. **Limit admin access**
2. **Regularly review operator permissions**
3. **Monitor access logs**
4. **Perform regular backups**
5. **Test disaster recovery**
6. **Keep system updated**
7. **Use firewall rules**
8. **Restrict network access**

## Compliance

### GDPR (if applicable)

- [ ] Data protection by design
- [ ] User consent management
- [ ] Right to erasure
- [ ] Data portability
- [ ] Breach notification (72 hours)

### PCI DSS (if handling cards)

⚠️ **Not currently compliant**

**Requirements:**
- Secure network
- Protect cardholder data
- Vulnerability management
- Access control
- Regular monitoring
- Information security policy

## Security Contact

For security concerns:
- **Email**: security@omnielong.example.com
- **PGP Key**: [Link to public key]

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-01-17 | Initial release |

---

**Last Updated**: 2025-01-17
**Review Cycle**: Quarterly
