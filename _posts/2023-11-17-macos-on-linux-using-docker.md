---
layout: post
author: henzo
title: How to run a MacOS VM using docker
date: 2023-11-17
tags: [MacOS, xcode, build, vnc, qemu]
categories: [Coding, Docker]
---

Included here are example docker commands for starting a macos instance. This can be used for xcode compalation or software testing. Commands were tested working at 18/11/23.

All commands are sourced from [Docker-OSX Github](https://github.com/sickcodes/Docker-OSX)

### Running Headless VM for arbitraty commands.
```shell
docker run -it \
    --device /dev/kvm \
    -p 50922:10022 \
    -e USERNAME=user \
    -e PASSWORD=alpine \
    -e TERMS_OF_USE=i_agree \
    sickcodes/docker-osx:auto
```

### Running Headless VM with specific command
```shell
docker run -it \
    --device /dev/kvm \
    -p 50922:10022 \
    -e USERNAME=user \
    -e PASSWORD=alpine \
    -e "OSX_COMMANDS=/bin/bash -c \"put your commands here\"" \
    -e TERMS_OF_USE=i_agree \
    sickcodes/docker-osx:auto
```

### Running VM with VNC open
```shell
docker run -i \
    --device /dev/kvm \
    -p 50922:10022 \
    -p 5999:5999 \
    -e USERNAME=user \
    -e PASSWORD=alpine \
    -v /tmp/.X11-unix:/tmp/.X11-unix \
    -e "DISPLAY=${DISPLAY:-:0.0}" \
    -e EXTRA="-display none -vnc 0.0.0.0:99,password=off" \
    sickcodes/docker-osx:auto
```
then connect to localhost:5999 using VNC
note: some qemu versions requier a password, set password to "on" in the above command and run this command from the docker terminal
```shell
change vnc password myvncusername
```

Further options are also available for mapping storage, secure vnc and usb passthrough
![MacOS VNC](/assets/img/2023-11-17-macos-on-linux-using-docker/macos-vnc.png)
