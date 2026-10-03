# INFORMATION SECURITY & VULNERABILITY DISCLOSURE POLICY

**Security Lead:** Harris Group Security & IT Operations  
**Policy Status:** Active & Strictly Enforced  

---

### 1. ACCESS CONTROL & REPOSITORY SECURITY
1. Access to this codebase is governed by the Principle of Least Privilege (PoLP).
2. Two-Factor Authentication (2FA) is strictly mandatory for all GitHub accounts with write access.
3. No production secrets, API credentials, private tokens, or database passwords may ever be committed to git history. Environment variables must remain strictly in uncommitted `.env` files.

### 2. REPORTING A VULNERABILITY
If you discover a suspected security vulnerability or unintended exposure of information relating to Harris Lodges web infrastructure:
- **Do not disclose publicly.**
- Send a private, encrypted report to: `harrislodges1@gmail.com` with the subject `[SECURITY VULNERABILITY DISCLOSURE]`.
- Include reproducible technical steps and impact analysis.
- The IT security team will acknowledge receipt within 24 hours.
