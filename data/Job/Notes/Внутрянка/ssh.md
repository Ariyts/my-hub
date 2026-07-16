---
id: "4y70ir5msmrnihb0d"
title: "ssh"
tags: []
isFavorite: false
order: 9
createdAt: "2026-07-16T12:54:55.741Z"
updatedAt: "2026-07-16T12:57:29.793Z"
---
# New Note
генерим свой ключ
```bash
ssh-keygen
```

Добавляем свой ключ в на таргет



```bash
mkdir -p ~/.ssh && echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPtQx6qutdkgKUJ84clyYoUhZDthLgSAZoGhPnP2seUn kali@kalitemplate" >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys
```