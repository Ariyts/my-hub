---
id: "khp3eazpsmvnz9qft"
title: "ssh"
tags: []
isFavorite: false
order: 9
createdAt: "2026-10-25T15:23:45.305Z"
updatedAt: "2026-10-25T15:24:03.415Z"
---

генерим свой ключ
```bash
ssh-keygen
```

Добавляем свой ключ в на таргет



```bash
mkdir -p ~/.ssh && echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPtQx6qutdkgKUJ84clyYoUhZDthLgSAZoGhPnP2seUn kali@kalitemplate" >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys
```