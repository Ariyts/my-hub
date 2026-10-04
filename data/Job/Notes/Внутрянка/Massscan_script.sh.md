---
id: "erwlap7zpmuto3gba"
title: "Massscan_script.sh"
tags: []
isFavorite: false
order: 9
createdAt: "2026-10-04T10:17:51.190Z"
updatedAt: "2026-10-04T10:18:09.231Z"
---
#!/bin/bash

# ============================================================
# Автоматическое сохранение вывода в лог-файл рядом со scope
# (без ANSI-кодов — чистый читаемый текст)
# ============================================================
if [ -z "$MASSCAN_LOGGED" ]; then
    export MASSCAN_LOGGED=1

    if [ -n "$1" ] && [ -f "$1" ]; then
        SCOPE_DIR=$(dirname "$(readlink -f "$1")")
        SCOPE_BASENAME=$(basename "$1" | sed 's/\.[^.]*$//')
    else
        SCOPE_DIR="$(pwd)"
        SCOPE_BASENAME="scan"
    fi

    LOGFILE="${SCOPE_DIR}/${SCOPE_BASENAME}_log_$(date +%Y%m%d_%H%M%S).txt"
    export LOGFILE
    exec "$0" "$@" | tee >(sed -r 's/\x1b\[[0-9;]*m//g' > "$LOGFILE")
    exit "${PIPESTATUS[0]}"
fi


# ============================================================
# masscan_scan.sh — сканирование + парсинг результатов
# Использование: ./masscan_scan.sh scope.txt
# ============================================================

set -o pipefail

# ============================================================
# Цвета для вывода
# ============================================================
RED=$'\033[0;31m'
GREEN=$'\033[0;32m'
YELLOW=$'\033[0;33m'
CYAN=$'\033[0;36m'
BOLD=$'\033[1m'
DIM=$'\033[2m'
RESET=$'\033[0m'

# --- Проверка аргумента ---
if [ -z "$1" ]; then
    echo "[-] Укажи файл со scope!"
    echo "    Использование: ./masscan_scan.sh scope.txt"
    exit 1
fi

SCOPE="$1"
OUTPUT="masscan_quick.txt"

# --- Проверка что файл scope существует ---
if [ ! -f "$SCOPE" ]; then
    echo "[-] Файл $SCOPE не найден!"
    exit 1
fi

# --- Проверка что запущено с root (нужно для masscan) ---
if [ "$EUID" -ne 0 ]; then
    echo "[-] Скрипт нужно запускать с sudo (masscan требует raw sockets)"
    exit 1
fi

# --- На всякий случай чистим возможные Windows-переводы строк в scope ---
sed -i 's/\r$//' "$SCOPE"

# ============================================================
# Автоопределение сетевого интерфейса
# ============================================================

FIRST_TARGET=$(grep -v '^#' "$SCOPE" | grep -v '^$' | head -n1 | cut -d'/' -f1)

if [ -z "$FIRST_TARGET" ]; then
    echo "[-] Не удалось определить ни одной цели в $SCOPE"
    exit 1
fi

IFACE=$(ip route get "$FIRST_TARGET" 2>/dev/null | grep -oP '(?<=dev )\S+' | head -n1)

if [ -z "$IFACE" ]; then
    echo "[-] Не удалось автоматически определить интерфейс!"
    echo "    Доступные интерфейсы:"
    ip -brief link show
    read -r -p "Введи интерфейс вручную: " IFACE
fi

echo -e "${CYAN}[*] Используем интерфейс:${RESET} $IFACE"

# ============================================================
# Автоопределение размера сети и рекомендуемых параметров
# ============================================================

count_total_hosts() {
    local total=0
    while IFS= read -r line; do
        line="${line%%#*}"              # убираем комментарии в конце строки
        line="$(echo "$line" | xargs)"  # trim пробелов
        [ -z "$line" ] && continue

        if [[ "$line" == */* ]]; then
            prefix="${line#*/}"
            if [[ "$prefix" =~ ^[0-9]+$ ]] && [ "$prefix" -ge 0 ] && [ "$prefix" -le 32 ]; then
                hosts=$(( 2 ** (32 - prefix) ))
                total=$(( total + hosts ))
            else
                total=$(( total + 1 ))
            fi
        else
            total=$(( total + 1 ))
        fi
    done < "$SCOPE"
    echo "$total"
}

TOTAL_HOSTS=$(count_total_hosts)

if [ "$TOTAL_HOSTS" -le 256 ]; then
    SIZE_LABEL="~/24 (маленькая сеть)"
    REC_RATE=1500; REC_RETRIES=2; REC_WAIT=3
elif [ "$TOTAL_HOSTS" -le 512 ]; then
    SIZE_LABEL="~/23"
    REC_RATE=2500; REC_RETRIES=2; REC_WAIT=4
elif [ "$TOTAL_HOSTS" -le 70000 ]; then
    SIZE_LABEL="~/16 или меньше"
    REC_RATE=8000; REC_RETRIES=1; REC_WAIT=8
else
    SIZE_LABEL="очень большая сеть (>/16)"
    REC_RATE=10000; REC_RETRIES=1; REC_WAIT=10
fi

echo ""
echo "[*] Обнаружено целей в scope: ~$TOTAL_HOSTS ($SIZE_LABEL)"
echo "[*] Рекомендуемые настройки: --rate $REC_RATE --retries $REC_RETRIES --wait $REC_WAIT"
echo ""
read -r -p "Использовать рекомендованные настройки? [Y/n] " USE_REC

case "$USE_REC" in
    [nN]*)
        read -r -p "Введи --rate [по умолчанию $REC_RATE]: " RATE
        RATE=${RATE:-$REC_RATE}
        read -r -p "Введи --retries [по умолчанию $REC_RETRIES]: " RETRIES
        RETRIES=${RETRIES:-$REC_RETRIES}
        read -r -p "Введи --wait [по умолчанию $REC_WAIT]: " WAIT
        WAIT=${WAIT:-$REC_WAIT}
        ;;
    *)
        RATE=$REC_RATE
        RETRIES=$REC_RETRIES
        WAIT=$REC_WAIT
        ;;
esac

echo ""
echo "[*] Используем: --rate $RATE --retries $RETRIES --wait $WAIT"

# ============================================================
# Запуск masscan
# ============================================================

echo ""
echo -e "${YELLOW}[*] Запускаем masscan по $SCOPE ...${RESET}"
echo ""

PORTS="445,139,88,389,636,3389,5985,5986,80,443,8080,8443,21,22,23,25,53,111,135,1433,3306,5432,6379,27017,9200,8000,8888,2049,5900,5901,5902,5903,1521,11211,2375,2376,6443,10250,5601,9090,3000,5000,7001,8081,8444,9000,9443"

masscan -iL "$SCOPE" \
    -p "$PORTS" \
    --rate "$RATE" \
    --retries "$RETRIES" \
    -e "$IFACE" \
    --wait "$WAIT" \
    -oL "$OUTPUT"

MASSCAN_EXIT=$?

if [ $MASSCAN_EXIT -ne 0 ]; then
    echo "[-] Masscan завершился с ошибкой (код $MASSCAN_EXIT)"
    exit 1
fi

if [ ! -s "$OUTPUT" ]; then
    echo "[-] Masscan не вернул результатов!"
    echo "    Проверь: доступность целей, интерфейс, rate, firewall."
    exit 1
fi

echo ""
echo -e "${GREEN}[+] Masscan завершён. Парсим результаты...${RESET}"
echo ""

# --- Функция вывода счётчика с подсветкой ---
print_count() {
    local file="$1"
    local label="$2"
    local count=0
    [ -f "$file" ] && count=$(wc -l < "$file")

    if [ "$count" -gt 0 ]; then
        printf "${GREEN}[+]${RESET} %-22s ${BOLD}${GREEN}%s${RESET} хостов\n" "$label" "$count"
    else
        printf "${DIM}[ ] %-22s %s хостов${RESET}\n" "$label" "$count"
    fi
}


# ============================================================
# Парсинг результатов
# ============================================================

# --- Все живые хосты ---
grep "^open" "$OUTPUT" | awk '{print $4}' | sort -u > live_hosts.txt
print_count live_hosts.txt "live_hosts.txt"

# --- SMB ---
grep "^open" "$OUTPUT" | grep " 445 " | awk '{print $4}' | sort -u > smb_hosts.txt
print_count smb_hosts.txt "smb_hosts.txt"

# --- NetBIOS ---
grep "^open" "$OUTPUT" | grep " 139 " | awk '{print $4}' | sort -u > netbios_hosts.txt
print_count netbios_hosts.txt "netbios_hosts.txt"

# --- Kerberos ---
grep "^open" "$OUTPUT" | grep " 88 " | awk '{print $4}' | sort -u > kerberos_hosts.txt
print_count kerberos_hosts.txt "kerberos_hosts.txt"

# --- LDAP / LDAPS ---
grep "^open" "$OUTPUT" | grep -E " (389|636) " | awk '{print $4}' | sort -u > ldap_hosts.txt
print_count ldap_hosts.txt "ldap_hosts.txt"

# --- RDP ---
grep "^open" "$OUTPUT" | grep " 3389 " | awk '{print $4}' | sort -u > rdp_hosts.txt
print_count rdp_hosts.txt "rdp_hosts.txt"

# --- WinRM (HTTP + HTTPS) ---
grep "^open" "$OUTPUT" | grep -E " (5985|5986) " | awk '{print $4}' | sort -u > winrm_hosts.txt
print_count winrm_hosts.txt "winrm_hosts.txt"

# --- Базы данных (MSSQL, MySQL, PostgreSQL, Redis, MongoDB) ---
grep "^open" "$OUTPUT" | grep -E " (1433|3306|5432|6379|27017) " | awk '{print $4}' | sort -u > db_hosts.txt
print_count db_hosts.txt "db_hosts.txt"

# --- Разбивка по типам СУБД (отдельные файлы) ---
grep "^open" "$OUTPUT" | grep " 1433 "  | awk '{print $4}' | sort -u > mssql_hosts.txt
grep "^open" "$OUTPUT" | grep " 3306 "  | awk '{print $4}' | sort -u > mysql_hosts.txt
grep "^open" "$OUTPUT" | grep " 5432 "  | awk '{print $4}' | sort -u > postgres_hosts.txt
grep "^open" "$OUTPUT" | grep " 6379 "  | awk '{print $4}' | sort -u > redis_hosts.txt
grep "^open" "$OUTPUT" | grep " 27017 " | awk '{print $4}' | sort -u > mongodb_hosts.txt

if [ -s db_hosts.txt ]; then
    [ -s mssql_hosts.txt ]    && echo -e "      ${CYAN}— MSSQL    (1433):${RESET}  $(wc -l < mssql_hosts.txt) хостов"
    [ -s mysql_hosts.txt ]    && echo -e "      ${CYAN}— MySQL    (3306):${RESET}  $(wc -l < mysql_hosts.txt) хостов"
    [ -s postgres_hosts.txt ] && echo -e "      ${CYAN}— Postgres (5432):${RESET}  $(wc -l < postgres_hosts.txt) хостов"
    [ -s redis_hosts.txt ]    && echo -e "      ${CYAN}— Redis    (6379):${RESET}  $(wc -l < redis_hosts.txt) хостов"
    [ -s mongodb_hosts.txt ]  && echo -e "      ${CYAN}— MongoDB  (27017):${RESET} $(wc -l < mongodb_hosts.txt) хостов"
fi

# --- FTP ---
grep "^open" "$OUTPUT" | grep " 21 " | awk '{print $4}' | sort -u > ftp_hosts.txt
print_count ftp_hosts.txt "ftp_hosts.txt"

# --- SSH ---
grep "^open" "$OUTPUT" | grep " 22 " | awk '{print $4}' | sort -u > ssh_hosts.txt
print_count ssh_hosts.txt "ssh_hosts.txt"

# --- Telnet ---
grep "^open" "$OUTPUT" | grep " 23 " | awk '{print $4}' | sort -u > telnet_hosts.txt
print_count telnet_hosts.txt "telnet_hosts.txt"

# --- SMTP ---
grep "^open" "$OUTPUT" | grep " 25 " | awk '{print $4}' | sort -u > smtp_hosts.txt
print_count smtp_hosts.txt "smtp_hosts.txt"

# --- DNS ---
grep "^open" "$OUTPUT" | grep " 53 " | awk '{print $4}' | sort -u > dns_hosts.txt
print_count dns_hosts.txt "dns_hosts.txt"

# --- RPC (portmapper + MS-RPC) ---
grep "^open" "$OUTPUT" | grep -E " (111|135) " | awk '{print $4}' | sort -u > rpc_hosts.txt
print_count rpc_hosts.txt "rpc_hosts.txt"

# --- Elasticsearch ---
grep "^open" "$OUTPUT" | grep " 9200 " | awk '{print $4}' | sort -u > elastic_hosts.txt
print_count elastic_hosts.txt "elastic_hosts.txt"

# --- NFS ---
grep "^open" "$OUTPUT" | grep " 2049 " | awk '{print $4}' | sort -u > nfs_hosts.txt
print_count nfs_hosts.txt "nfs_hosts.txt"

# --- Web (только IP) ---
grep "^open" "$OUTPUT" | grep -E " (80|443|8080|8443|8000|8888) " | awk '{print $4}' | sort -u > web_hosts.txt
print_count web_hosts.txt "web_hosts.txt"

# --- VNC ---
grep "^open" "$OUTPUT" | grep -E " (5900|5901|5902|5903) " | awk '{print $4}' | sort -u > vnc_hosts.txt
print_count vnc_hosts.txt "vnc_hosts.txt"

grep "^open" "$OUTPUT" | grep " 5900 " | awk '{print $4}' | sort -u > vnc5900_hosts.txt
grep "^open" "$OUTPUT" | grep " 5901 " | awk '{print $4}' | sort -u > vnc5901_hosts.txt
grep "^open" "$OUTPUT" | grep " 5902 " | awk '{print $4}' | sort -u > vnc5902_hosts.txt
grep "^open" "$OUTPUT" | grep " 5903 " | awk '{print $4}' | sort -u > vnc5903_hosts.txt

if [ -s vnc_hosts.txt ]; then
    [ -s vnc5900_hosts.txt ] && echo -e "      ${CYAN}— VNC (5900):${RESET} $(wc -l < vnc5900_hosts.txt) хостов"
    [ -s vnc5901_hosts.txt ] && echo -e "      ${CYAN}— VNC (5901):${RESET} $(wc -l < vnc5901_hosts.txt) хостов"
    [ -s vnc5902_hosts.txt ] && echo -e "      ${CYAN}— VNC (5902):${RESET} $(wc -l < vnc5902_hosts.txt) хостов"
    [ -s vnc5903_hosts.txt ] && echo -e "      ${CYAN}— VNC (5903):${RESET} $(wc -l < vnc5903_hosts.txt) хостов"
fi

# --- Oracle ---
grep "^open" "$OUTPUT" | grep " 1521 " | awk '{print $4}' | sort -u > oracle_hosts.txt
print_count oracle_hosts.txt "oracle_hosts.txt"

# --- Memcached ---
grep "^open" "$OUTPUT" | grep " 11211 " | awk '{print $4}' | sort -u > memcached_hosts.txt
print_count memcached_hosts.txt "memcached_hosts.txt"

# --- Docker API ---
grep "^open" "$OUTPUT" | grep -E " (2375|2376) " | awk '{print $4}' | sort -u > docker_hosts.txt
print_count docker_hosts.txt "docker_hosts.txt"

grep "^open" "$OUTPUT" | grep " 2375 " | awk '{print $4}' | sort -u > docker2375_hosts.txt
grep "^open" "$OUTPUT" | grep " 2376 " | awk '{print $4}' | sort -u > docker2376_hosts.txt

if [ -s docker_hosts.txt ]; then
    [ -s docker2375_hosts.txt ] && echo "      — Docker HTTP  (2375): $(wc -l < docker2375_hosts.txt) хостов"
    [ -s docker2376_hosts.txt ] && echo "      — Docker HTTPS (2376): $(wc -l < docker2376_hosts.txt) хостов"
fi

# --- Kubernetes (API + kubelet) ---
grep "^open" "$OUTPUT" | grep -E " (6443|10250) " | awk '{print $4}' | sort -u > k8s_hosts.txt
print_count k8s_hosts.txt "k8s_hosts.txt"

grep "^open" "$OUTPUT" | grep " 6443 " | awk '{print $4}' | sort -u > k8sapi_hosts.txt
grep "^open" "$OUTPUT" | grep " 10250 " | awk '{print $4}' | sort -u > kubelet_hosts.txt

if [ -s k8s_hosts.txt ]; then
    [ -s k8sapi_hosts.txt ]  && echo "      — K8s API (6443):   $(wc -l < k8sapi_hosts.txt) хостов"
    [ -s kubelet_hosts.txt ] && echo "      — kubelet (10250):  $(wc -l < kubelet_hosts.txt) хостов"
fi

# --- Kibana ---
grep "^open" "$OUTPUT" | grep " 5601 " | awk '{print $4}' | sort -u > kibana_hosts.txt
print_count kibana_hosts.txt "kibana_hosts.txt"


# --- Admin/Dev Web панели (Grafana, Flask, WebLogic, Cockpit, Prometheus и т.д.) ---
grep "^open" "$OUTPUT" | grep -E " (9090|3000|5000|7001|8081|8444|9000|9443) " | awk '{print $4}' | sort -u > admin_web_hosts.txt
print_count admin_web_hosts.txt "admin_web_hosts.txt"

# --- Web (обычные веб-порты, с протоколом) ---
grep "^open" "$OUTPUT" | grep -E " (80|443|8080|8443|8000|8888) " | awk '{
    ip = $4; port = $3
    proto = (port == 443) ? "https" : "http"
    print proto "://" ip ":" port
}' | sort -u > web_hosts_url.txt

# --- Admin/Dev веб-панели (с протоколом) ---
grep "^open" "$OUTPUT" | grep -E " (5601|9090|3000|5000|7001|8081|8444|9000|9443) " | awk '{
    ip = $4; port = $3
    proto = (port == 443) ? "https" : "http"
    print proto "://" ip ":" port
}' | sort -u > admin_web_hosts_url.txt

# ============================================================
# Чистим пустые файлы — не захламляем директорию
# ============================================================

find . -maxdepth 1 -name "*_hosts*.txt" -empty -delete

# ============================================================
# Критичные находки — выводим отдельно, чтобы не пропустить
# ============================================================

echo ""
echo -e "${BOLD}${RED}================================================${RESET}"
echo -e "${BOLD}${RED}  ⚠  КРИТИЧНЫЕ НАХОДКИ — смотри сюда в первую очередь${RESET}"
echo -e "${BOLD}${RED}================================================${RESET}"

CRIT_ORDER=(
    "vnc_hosts.txt|VNC (часто без пароля!)"
    "docker_hosts.txt|Docker API (риск RCE!)"
    "k8s_hosts.txt|Kubernetes API/kubelet"
    "memcached_hosts.txt|Memcached (unauth dump)"
    "oracle_hosts.txt|Oracle DB"
    "elastic_hosts.txt|Elasticsearch (часто без auth)"
    "admin_web_hosts.txt|Admin/Dev панели (Grafana/Prometheus/etc)"
)

FOUND_CRITICAL=0

for entry in "${CRIT_ORDER[@]}"; do
    file="${entry%%|*}"
    label="${entry#*|}"
    if [ -s "$file" ]; then
        FOUND_CRITICAL=1
        count=$(wc -l < "$file")
        echo -e "${RED}${BOLD}  !! ${label}${RESET} — ${BOLD}${count}${RESET} хостов  (файл: ${file})"
        head -n 3 "$file" | sed "s/^/        → /"
    fi
done

if [ "$FOUND_CRITICAL" -eq 0 ]; then
    echo -e "${DIM}  Критичных сервисов не обнаружено.${RESET}"
fi
echo ""
echo -e "${CYAN}[*] Готово! Созданные файлы:${RESET}"
echo ""
ls -lh *_hosts*.txt 2>/dev/null

if [ -f web_hosts_url.txt ]; then
    TOTAL=$(wc -l < web_hosts_url.txt)
    echo ""
    echo -e "${CYAN}[*] Превью web_hosts_url.txt (первые 5 из $TOTAL):${RESET}"
    head -n 5 web_hosts_url.txt | sed "s/^/  ${GREEN}→${RESET} /"
    [ "$TOTAL" -gt 5 ] && echo -e "${DIM}      ... и ещё $((TOTAL-5)) (см. файл целиком)${RESET}"
fi

if [ -f admin_web_hosts_url.txt ]; then
    TOTAL_ADMIN=$(wc -l < admin_web_hosts_url.txt)
    echo ""
    echo -e "${CYAN}[*] Превью admin_web_hosts_url.txt (первые 5 из $TOTAL_ADMIN):${RESET}"
    head -n 5 admin_web_hosts_url.txt | sed "s/^/  ${GREEN}→${RESET} /"
    [ "$TOTAL_ADMIN" -gt 5 ] && echo -e "${DIM}      ... и ещё $((TOTAL_ADMIN-5)) (см. файл целиком)${RESET}"
fi

if [ -n "$LOGFILE" ]; then
    echo ""
    echo -e "${CYAN}[*] Полный лог сохранён:${RESET} $LOGFILE"
fi
