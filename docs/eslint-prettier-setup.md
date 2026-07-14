# Настройка ESLint + Prettier и рекомендаций VS Code

Дата: 2026-07-14

## Что было до

В корне уже лежали `eslint.config.js` (flat config под ESLint 9), `.prettierrc.json` и `.prettierignore`,
но **ни один из требуемых ими пакетов не был установлен** и не значился в `package.json`.
Запустить линтер или форматтер было невозможно — ни из терминала, ни из VS Code.
Папки `.vscode/` в проекте не было.

## Что сделано

### 1. Установлены devDependencies

Ровно тот набор, который импортирует существующий `eslint.config.js` и требует `.prettierrc.json`:

| Пакет                         | Версия  | Зачем                                         |
| ----------------------------- | ------- | --------------------------------------------- |
| `eslint`                      | ^9.39.5 | Ядро линтера                                  |
| `@eslint/js`                  | ^9.39.5 | Базовые правила JS (`js.configs.recommended`) |
| `typescript-eslint`           | ^8.64.0 | Парсер и правила для TS/TSX                   |
| `eslint-plugin-react-hooks`   | ^5.2.0  | Правила хуков React                           |
| `eslint-plugin-react-refresh` | ^0.5.3  | Проверки под Vite HMR                         |
| `eslint-config-prettier`      | ^10.1.8 | Отключает правила, конфликтующие с Prettier   |
| `globals`                     | ^17.7.0 | Наборы глобальных переменных (browser / node) |
| `prettier`                    | ^3.9.5  | Форматтер                                     |
| `prettier-plugin-tailwindcss` | ^0.8.0  | Сортировка Tailwind-классов                   |

**Почему ESLint 9, а не 10.** ESLint 10 уже вышел, но `eslint-plugin-react-hooks@5` его не поддерживает
(конфликт peer-зависимостей, установка падает). Поддерживающий ESLint 10 `eslint-plugin-react-hooks@7`
тянет за собой новые правила react-compiler, которые дали бы поток предупреждений на текущем коде.
Взят консервативный набор на ESLint 9 — именно под него написан ваш `eslint.config.js`.
Обновление до ESLint 10 + react-hooks 7 можно сделать отдельным шагом, если понадобится.

### 2. Скрипты в `package.json`

```json
"typecheck":    "tsc --noEmit",
"lint":         "eslint .",
"lint:fix":     "eslint . --fix",
"format":       "prettier --write .",
"format:check": "prettier --check ."
```

### 3. `.vscode/extensions.json`

Рекомендации расширений (VS Code предложит поставить их при открытии проекта):

- `dbaeumer.vscode-eslint` — ESLint
- `esbenp.prettier-vscode` — Prettier
- `bradlc.vscode-tailwindcss` — автодополнение Tailwind-классов
- `usernamehw.errorlens` — показ ошибок прямо в строке кода

### 4. `.vscode/settings.json`

- **Автоформат при сохранении выключен** (`editor.formatOnSave: false`) — по вашему выбору.
  Форматирование только вручную: `Shift+Alt+F` или `npm run format`.
- Prettier назначен форматтером по умолчанию для TS/TSX/JS/JSON/CSS/HTML/MD.
- `prettier.requireConfig: true` — Prettier работает только по `.prettierrc.json` проекта.
- `eslint.useFlatConfig: true` — ESLint 9 читает `eslint.config.js`.
- `tailwindCSS.experimental.configFile: "src/index.css"` — Tailwind v4 держит конфиг в CSS.
- `tailwindCSS.classFunctions` — подсказки классов внутри `clsx`, `cn`, `twMerge`, `cva`.
- `files.eol: "\n"` — согласовано с `endOfLine: "lf"` в `.prettierrc.json`.
- `typescript.tsdk` — TypeScript берётся из `node_modules` проекта.

## Как запускать

```bash
npm run lint          # проверить код
npm run lint:fix      # починить то, что чинится автоматически
npm run format        # отформатировать проект Prettier'ом
npm run format:check  # только проверить форматирование
npm run typecheck     # проверка типов TypeScript
```

## Текущее состояние кода (проверено, но НЕ исправлено)

Обе команды работают. На существующем коде они находят следующее.

**ESLint — 58 замечаний (24 ошибки, 34 предупреждения) в 14 файлах:**

| Правило                              | Кол-во | Severity |
| ------------------------------------ | ------ | -------- |
| `@typescript-eslint/no-explicit-any` | 29     | warning  |
| `@typescript-eslint/no-unused-vars`  | 14     | error    |
| `prefer-const`                       | 10     | error    |
| `react-hooks/exhaustive-deps`        | 5      | warning  |

Из них 10 ошибок чинятся автоматически через `npm run lint:fix`.
Остальные (неиспользуемые переменные, `any`, зависимости хуков) требуют ручного решения:
`exhaustive-deps` в частности нельзя править вслепую — можно изменить поведение компонентов.

**Prettier — 48 файлов не соответствуют стилю.** Это ожидаемо: код писался до появления
конфига форматтера. `npm run format` приведёт их в порядок, но затронет почти все файлы
проекта — это большой diff, поэтому запуск оставлен на ваше усмотрение.

## Что предлагается дальше (жду решения)

1. Прогнать `npm run format` — единый разовый коммит «форматирование», отдельно от смысловых правок.
2. Прогнать `npm run lint:fix` — уберёт 10 ошибок `prefer-const` автоматически.
3. Разобрать вручную оставшиеся ошибки `no-unused-vars` и предупреждения `exhaustive-deps`.

## Переработка .gitignore

### Проблема

После установки пакетов в git появилось ~2955 изменённых файлов. Причина: **папка `node_modules`
была под контролем версий** — старый `.gitignore` исключал только `node_modules/.cache/` и
`node_modules/.bin/`, но не саму папку. Установка ESLint/Prettier добавила туда транзитивные
зависимости, и все они показались как новые файлы. Код в `src/` при этом не менялся.

### Почему `node_modules` можно убрать без риска для сайта

Проверено по `.github/workflows/rebuild.yml`:

1. `checkout` — забирает репозиторий
2. `node scripts/convert-md-to-json.cjs` — запускается **до** установки зависимостей, но использует
   только встроенные модули Node (`fs`, `path`) — проверено, npm-пакеты ему не нужны
3. `npm ci` — **удаляет** `node_modules` и ставит всё заново из `package-lock.json`
   (проверено `npm ci --dry-run` — lock-файл согласован с `package.json`)
4. `npm run build` → `vite build`
5. деплой `dist` на GitHub Pages (`force_orphan`, ветка gh-pages)

Шаг 3 стирает всё, что пришло из репозитория, — закоммиченная `node_modules` на CI не используется.

### Новый `.gitignore`

| Что игнорируем                                       | Почему                                |
| ---------------------------------------------------- | ------------------------------------- |
| `node_modules/`                                      | ставится через `npm ci` из lock-файла |
| `dist/`, `dist-ssr/`                                 | результат сборки, CI собирает сам     |
| `src/data_backup_*.json`, `src/settings-backup.json` | локальные бэкапы                      |
| логи, `.eslintcache`, `.vite/`, `*.tsbuildinfo`      | кэш инструментов                      |
| `.env*`                                              | секреты и локальное окружение         |
| `.idea/`, `*.swp`                                    | IDE                                   |
| `.claude/settings.local.json`, `CLAUDE.md`           | локальное для Claude Code             |
| `.DS_Store`, `Thumbs.db`, `desktop.ini`              | мусор ОС                              |

**Убраны из игнора** (теперь попадут в репозиторий): `eslint.config.js`, `.prettierrc.json`,
`.prettierignore` — без них `npm run lint` у свежего клона упал бы, хотя пакеты в `package.json` есть.

**Оставлены под контролем версий:** `src/data.json` (по решению — чтобы свежий клон запускался через
`npm run dev` без предварительной генерации), папка `.vscode/` целиком (общие настройки проекта).

### Требуется одна команда от вас

`.gitignore` не убирает из git то, что уже закоммичено. Чтобы 2955 изменений исчезли:

```bash
git rm -r --cached node_modules dist
```

`--cached` = убрать только из индекса git, файлы на диске остаются. Переустанавливать ничего не нужно.

## Файлы, изменённые на этом шаге

- `package.json` — добавлены devDependencies и 5 скриптов
- `package-lock.json` — обновлён npm'ом при установке
- `.vscode/extensions.json` — создан
- `.vscode/settings.json` — создан
- `.gitignore` — переписан под текущий проект
- `docs/eslint-prettier-setup.md` — этот отчёт
