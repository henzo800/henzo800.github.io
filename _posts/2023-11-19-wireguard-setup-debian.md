---
layout: post
title: Wireguard setup Debian
date: 2023-11-19 10:56 +1000
categories: [Networking, Wireguard]
tags: [Wireguard, wg-quick, Tunnels, ufw, Firewall]
author: henzo
---

# Setting up config files
Put a config file in `/etc/wireguard` and it should be named after the name of the network interface you want to create. In most cases this can be **wg0** but it can also be set to the name of the tunnel if there are alot of connections.
Then run to start the tunnel
```shell
sudo wg-quick up wg0
```
Check it is running with 
```shell
sudo wg
```
Stop the tunnel
```shell
sudo wg-quick down wg0
```
To make it run at startup enable it and start it as a service. Make sure to stop the manually started tunnel before starting the service.
```shell 
sudo systemctl enable wg-quick@wg0
sudo systemctl start wg-quick@wg0
```
At this point the tunnel should be working and it can be tested by.
```shell
curl ip.me
```
Will return the regular ip

```shell
curl --interface wg0 ip.me
```
Will return the ip through the vpn \
Sourced from [ProtonVPN Docs](https://protonvpn.com/support/wireguard-manual-linux/)

# Firewall rules
In some cases the os will automatically route all traffic through the vpn but often firewall rules will need to be set to force it to connect through it.
Below is an example config using ufw. This essentially works as a kill switch.
```
Status: active
Logging: on (low)
Default: deny (incoming), deny (outgoing), deny (routed)
New profiles: skip

To                         Action      From
--                         ------      ----
Anywhere on wg0    ALLOW IN    Anywhere
Anywhere on wlo1           ALLOW IN    192.168.0.0/24
Anywhere (v6) on wg0 ALLOW IN    Anywhere (v6)

Anywhere                   ALLOW OUT   Anywhere on wg0
Anywhere                   ALLOW OUT   192.168.0.0/24 on wlo1
Anywhere (v6)              ALLOW OUT   Anywhere (v6) on wg0
```

The v6 rules were added automatically and should be removed in alot of vpn configurations. The rules including `192.168.0.0/24` can be removed to also block lan traffic.

# Disabling IPV6
Alot of VPNS will also drop or block ipv6 so it should be disabled, if connecting to internet hosts takes a really long time or times out this is probably why. On Debian edit the sysctl
```shell
sudo nano /etc/sysctl.conf
```
Add These lines or enable them
```
net.ipv6.conf.all.disable_ipv6 = 1 
net.ipv6.conf.default.disable_ipv6 = 1 
net.ipv6.conf.lo.disable_ipv6 = 1 
net.ipv6.conf.tun0.disable_ipv6 = 1
```
Then reload
```shell
sudo sysctl -p
```
Souced from [ProtonVPN Docs](https://protonvpn.com/support/disable-ipv6-protocol-linux/) \
Some software may ignore this option but will usually specify and option to force ipv4.
This is an example for wget
```shell
wget --inet4-only https://ftp.gnu.org/gnu/wget/wget-latest.tar.gz
```

If the above are done correctly all internet traffic should be routed over your vpn.