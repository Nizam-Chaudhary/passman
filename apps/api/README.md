# Passman BE

## Features List

- [x] resend otp
- [x] expire otp
- [x] forgot login password
- [x] forgot master password
- [ ] settings page
    - [ ] update user name
    - [ ] manage vault
    - [ ] delete vault
    - [ ] add vault
    - [ ] migrate vault
    - [ ] reset password
    - [x] reset master password
    - [ ] import multiple passwords from chrome or firefox
    - [ ] add more providers to import from
    - [ ] delete account
- [ ] multiple delete of passwords
- [ ] multiple moving of passwords from one vault to another by selecting multiple at once
- [ ] Animations

### generate openssl tls certificate

```bash
openssl req -x509 -newkey rsa:4096 -keyout certs/key.pem -out certs/cert.pem -days 365 -nodes
```
