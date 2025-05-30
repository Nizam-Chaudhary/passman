# Passman Frontend

## Features TODO:

### Passman Web:

- [x] Implement auto refresh token after token is expired
- [ ] Implement multi select for passwords
    - [x] Delete multiple passwords at once
    - [ ] Move multiple passwords at once to another vault
- [x] Update image loading to load user's Initial from user name if no profile picture uploaded
- [x] Show password initial character as thumbnail if no favicon found
- [ ] Show text on hover of upload image to update the profile picture
- [x] Show Username initials as text when no profile picture upload
- [x] Add back button on settings
- [ ] Update Import Page to allow user to import passwords from different providers
    - [ ] allow user to select provider
    - [ ] select file then parse it and then store the passwords after encrypting them
- [ ] Export passwords in csv format similar to google chrome password exported for interoperability
- [ ] Vaults management
    - [ ] allow user to delete vault
    - [ ] allow user to add vault
    - [ ] allow user to move all passwords from one vault to another
    - [ ] above functionality should also work when deleting vaults to provide options of deleting all password with it or move existing passwords to another vault
    - [ ] rename vaults
- [ ] security
    - [ ] allow user to update login password
    - [ ] allow user to update master password
    - [ ] allow user to delete the acocunt
    - [ ] Implement 2FA for account (Not Urgent)
    - [ ] allow user to not ask master password every time and save it locally (unsafe &
    - [ ] not urgent)
- [ ] `UI Responsive for mobile and other screen sizes
- update settings to use the sidebar same as home page with the settings options and back button.

### Passman Extension:

- [ ] user login
- [ ] redirect to website for signup and registration process
- [ ] load all passwords and store it locally after login into index db using dixie
- [ ] allow user to view passwords from all, and vault wise
- [ ] allow user to search passwords
- [ ] allow user to update passwords
- [ ] allow user to add passwords
- [ ] allow user to delete passwords
- [ ] autofill passwords
- [ ] password generator for not registered account
- [ ] popup to save passwords when logging and password not saved
- [ ] redirect to web for further management
