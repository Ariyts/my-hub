---
id: "xajnz7j44mq2jenx1"
title: "Скрипт парсинга massscan"
tags: []
isFavorite: false
order: 6
createdAt: "2026-06-06T15:58:00.085Z"
updatedAt: "2026-06-06T15:58:15.203Z"
---
#!/bin/bash

# ============================================================
# masscan_scan.sh — сканирование + парсинг результатов
# Использование: ./masscan_scan.sh scope.txt
# ============================================================

# Проверка аргумента
if [ -z "$1" ]; then
    echo "[-] Укажи файл со scope!"
    echo "    Использование: ./masscan_scan.sh scope.txt"
    exit 1
fi

SCOPE="$1"
OUTPUT="masscan_quick.txt"

# Проверка что файл scope существует
if [ ! -f "$SCOPE" ]; then
    echo "[-] Файл $SCOPE не найден!"
    exit 1
fi

# ============================================================
echo ""
echo "[*] Запускаем masscan по $SCOPE ..."
echo ""

masscan -iL "$SCOPE" \
    -p 445,139,88,389,636,3389,5985,5986,80,443,8080,8443,21,22,23,25,53,111,135,1433,3306,5432,6379,27017,9200,8000,8888,2049 \
    --rate 2000 \
    -oL "$OUTPUT"

echo ""
echo "[+] Masscan завершён. Парсим результаты..."
echo ""

# ============================================================
# Парсинг результатов
# ============================================================

grep "^open" "$OUTPUT" | awk '{print $4}' | sort -u > live_hosts.txt
echo "[+] live_hosts.txt        — $(wc -l < live_hosts.txt) хостов"

grep "^open" "$OUTPUT" | grep " 445 "  | awk '{print $4}' | sort -u > smb_hosts.txt
echo "[+] smb_hosts.txt         — $(wc -l < smb_hosts.txt) хостов"

grep "^open" "$OUTPUT" | grep " 88 "   | awk '{print $4}' | sort -u > kerberos_hosts.txt
echo "[+] kerberos_hosts.txt    — $(wc -l < kerberos_hosts.txt) хостов"

grep "^open" "$OUTPUT" | grep " 389 "  | awk '{print $4}' | sort -u > ldap_hosts.txt
echo "[+] ldap_hosts.txt        — $(wc -l < ldap_hosts.txt) хостов"

grep "^open" "$OUTPUT" | grep " 3389 " | awk '{print $4}' | sort -u > rdp_hosts.txt
echo "[+] rdp_hosts.txt         — $(wc -l < rdp_hosts.txt) хостов"

grep "^open" "$OUTPUT" | grep " 5985 " | awk '{print $4}' | sort -u > winrm_hosts.txt
echo "[+] winrm_hosts.txt       — $(wc -l < winrm_hosts.txt) хостов"

grep "^open" "$OUTPUT" | grep -E " (1433|3306|5432) " | awk '{print $4}' | sort -u > db_hosts.txt
echo "[+] db_hosts.txt          — $(wc -l < db_hosts.txt) хостов"

grep "^open" "$OUTPUT" | grep " 21 "   | awk '{print $4}' | sort -u > ftp_hosts.txt
echo "[+] ftp_hosts.txt         — $(wc -l < ftp_hosts.txt) хостов"

# Web — только IP (без порта)
grep "^open" "$OUTPUT" | grep -E " (80|443|8080|8443) " | awk '{print $4}' | sort -u > web_hosts.txt
echo "[+] web_hosts.txt         — $(wc -l < web_hosts.txt) хостов (только IP)"

# Web — с протоколом и портом (http://ip:port)
grep "^open" "$OUTPUT" | grep -E " (80|443|8080|8443) " | awk '{
    ip = $4; port = $3
    proto = (port == 443 || port == 8443) ? "https" : "http"
    print proto "://" ip ":" port
}' | sort -u > web_hosts_url.txt
echo "[+] web_hosts_url.txt     — $(wc -l < web_hosts_url.txt) URL (http://ip:port)"

# ============================================================
echo ""
echo "[*] Готово! Созданные файлы:"
echo ""
ls -lh *_hosts*.txt
echo ""
echo "[*] Превью web_hosts_url.txt:"
cat web_hosts_url.txt

Установка и запуск:

Bash

chmod +x masscan_scan.sh
./masscan_scan.sh scope.txt

Пример вывода:

text

[*] Запускаем masscan по scope.txt ...

[+] Masscan завершён. Парсим результаты...

[+] live_hosts.txt        — 142 хостов
[+] smb_hosts.txt         —  87 хостов
[+] kerberos_hosts.txt    —   3 хостов
[+] ldap_hosts.txt        —   3 хостов
[+] rdp_hosts.txt         —  45 хостов
[+] winrm_hosts.txt       —  12 хостов
[+] db_hosts.txt          —   8 хостов
[+] ftp_hosts.txt         —   5 хостов
[+] web_hosts.txt         —  23 хостов (только IP)
[+] web_hosts_url.txt     —  31 URL    (http://ip:port)

[*] Превью web_hosts_url.txt:
http://192.168.1.10:80
http://192.168.1.15:8080
https://192.168.1.20:443
https://192.168.1.25:8443