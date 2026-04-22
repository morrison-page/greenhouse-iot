# ESP32 Setup

- Connect ESP32 to same local network as host machine
- Add a portproxy to host using PowerShell as Admin like so `netsh interface portproxy add v4tov4 listenport=1883 listenaddress=0.0.0.0 connectport=1883 connectaddress=172.22.101.29`
- Also turn off device firewall
- This allows the ESP to establish its TCP connection to the MQTT broker 
- To remove the proxy same terminal window add this `netsh interface portproxy delete v4tov4 listenport=1883 listenaddress=0.0.0.0`