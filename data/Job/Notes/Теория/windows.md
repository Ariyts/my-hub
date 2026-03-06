---
id: "33emghs2bmmes1ewy"
title: "windows"
tags: []
isFavorite: false
order: 2
createdAt: "2026-03-06T10:54:03.202Z"
updatedAt: "2026-03-06T10:54:18.556Z"
---
  WINDOWS PRIVILEGE ESCALATION CHECKLIST               
                                                                 
  1. КТО Я?                                                      
     whoami /all                      ← Полная информация        
     whoami /priv                     ← Привилегии!              
     whoami /groups                   ← Группы                   
                                                                 
  2. ЧТО ЗА СИСТЕМА?                                            
     systeminfo                                                  
     hostname                                                    
     wmic os get osarchitecture                                 
                                                                 
  3. ПОЛЬЗОВАТЕЛИ И ГРУППЫ                                      
     net user                                                    
     net localgroup Administrators                               
     query user                       ← Кто залогинен            
                                                                 
  4. СЕТЬ                                                        
     ipconfig /all                                               
     netstat -ano                                                
     route print                                                 
                                                                 
  5. CREDENTIALS                                                 
     cmdkey /list                     ← Сохранённые credentials  
     reg query "HKLM\..\Winlogon"     ← AutoLogon                
     dir /s *pass* *cred* *vnc* *.config 2>nul                  
     findstr /si password *.xml *.ini *.txt *.config            
                                                                 
  6. СЛУЖБЫ                                                      
     sc query                                                    
     wmic service get name,pathname,startmode                   
     # Unquoted paths, weak permissions                          
                                                                 
  7. SCHEDULED TASKS                                             
❓
 ВОПРОСЫ ДЛЯ САМОПРОВЕРКИ
Уровень 1: Базовое понимание
Уровень 2: Применение
     schtasks /query /fo LIST /v                                
     # Writable scripts, paths                                   
                                                                 
  8. УСТАНОВЛЕННОЕ ПО                                           
     wmic product get name,version                              
     # Известные уязвимости                                      
                                                                 
  9. EXPLOIT SUGGESTER                                          
     systeminfo > systeminfo.txt                                
     windows-exploit-suggester.py --systeminfo systeminfo.txt   
                                                                 
  10. АВТОМАТИЗАЦИЯ                                             
      winPEAS.exe                                                
      Seatbelt.exe -group=all                                   
      PowerUp.ps1                        