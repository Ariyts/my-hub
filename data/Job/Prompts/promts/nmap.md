---
id: "50tibsgeompn0q3en"
title: "nmap"
category: "General"
tags: []
order: "1"
createdAt: "2026-05-26T19:18:28.031Z"
updatedAt: "2026-10-22T19:00:15.351Z"
---

## nmap plan
<!-- section: {"id":"fhv7eiy6smvjwmy4d","order":0,"collapsed":false} -->

### Nmap результаты, с ИИ
_NMAP_

```
Вот список открытых сервисов из Nmap (IP и хосты удалены, unauthenticated only, no credentials):

22/tcp open ssh OpenSSH 8.9
80/tcp open http Apache 2.4.41
443/tcp open https
445/tcp open microsoft-ds
3389/tcp open ms-wbt-server
...

Задача: 
- Я без кредов (black-box / unauthenticated).
- Для каждого сервиса дай:
  1. Что именно проверять в первую очередь (enumeration + vuln checks)
  2. Какие инструменты/команды (nmap scripts, nuclei, httpx, smbmap, etc.)
  3. На что смотреть в результатах (интересные findings)
  4. Типичные high/critical уязвимости 2024-2026 для этих версий
  5. Приоритет (Critical/High/Medium)
  6. Что можно получить (RCE, info leak, creds, pivot и т.д.)

Сгруппируй по сервисам, сделай краткий actionable checklist.
```
<!-- prompt: {"id":"y56jelyoimvjwo39q","sectionId":"fhv7eiy6smvjwmy4d"} -->
