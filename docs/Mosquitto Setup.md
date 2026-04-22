# Mosquitto Setup

- Cd into the projects root first
- Ensure that the pwfile is owned by root and if not run `sudo chmod root:root /path/to/pwfile`
- Execute compose file with `docker compose up -d` (Launches the MQTT Broker)
- Enter an interactive session in the mosquitto with `docker componse exec mosquitto sh`
- Setup link to password file with `mosquitto_passwd -c /mosquitto/config/pwfile greenhouse-broker`
- Enter in the password for the account (same as the username) `greenhouse-broker`
- Exit the container with `exit`
- Restart the container with `docker compose restart mosquitto` (now on your host machine)
