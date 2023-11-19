---
layout: post
title: Port fowarding behind dynamic hosts
date: 2023-11-19 12:47 +1000
categories: [Networking, Port Fowarding]
tags: [Networking, Ngrock, NAT-PMP, Service]
author: henzo
---
Can be used to open and foward ports behind hosts that cant be controlled manually.
# The Hard Way
Using NAT-PMP directly ports can be opened. Check if it is supported by your gateway using the following. In this case it is `10.2.0.1` but it will probably be different. Use commands such as `ip addr` and `wg` to find the appropriate gateway.
```shell
natpmpc -g 10.2.0.1
```
If it returns sucess NAT-PMP is supported. \
Thing to keep in mind about NAT-PMP is that in most cases the external port number will be assigned randomly, and will only be preseved for a set amount of time or until the connection is closed. This command will open an external port on the gateway and foward it to the the local port `8080` for 60 seconds.
```shell
natpmpc -a 0 8080 tcp 60 -g 10.2.0.1
```
This can be looped to keep the port open using this shell script.
```shell
while true ; do date ; natpmpc -a 0 8080 tcp 60 -g 10.2.0.1 || { echo -e "ERROR with natpmpc command \a" ; break ; } ; sleep 45 ; done
```
Running this as a service, extracting the reported public ip and port can be sent to domain routing services such as cloudflare to keep open.
Sourced from [ProtonVPN Docs](https://protonvpn.com/support/port-forwarding-manual-setup/)

# Ngrok
Expensive and limited but very easy. Free plan is very limited allow only one static http-only tunnel, and no other tunnelling but can use unlimited tcp fowarding, with similar limitations to basic NAT-PMP above.
## Installing
Go to <https://ngrok.com/download> and follow relevant steps. \
Then add the auth token using this command.
```shell
ngrok config add-authtoken <your_token>
```

## Service
To make tunnels persistent is is a good idea to make a service. Below is an example that will load from a config file and open all tunnels. Create file `/etc/systemd/system/ngrok.service`
```shell
[Unit]
Description=ngrok
After=network.target

[Service]
ExecStart=/usr/local/bin/ngrok start --all --config /opt/ngrok/ngrok.yml
ExecReload=/bin/kill -HUP $MAINPID
KillMode=process
IgnoreSIGPIPE=true
Restart=always
RestartSec=3
Type=simple
User=ngrok

[Install]
WantedBy=multi-user.target
```

## Ngrok config
This is an example config, refer to [Ngrok Docs](https://ngrok.com/docs/) for more info.
```yaml
version: 2
authtoken: <your_token>
tunnels:
  my_server:
    proto: http
    hostname: mature-flamingo-freely.ngrok-free.app
    addr: 127.0.0.1:443
    schemes:
      - https
```


