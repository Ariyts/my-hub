# Дизайн-система — краткий гайд

Статус: вводится в рамках Задачи 0 (Фундамент). Источник токенов — `src/index.css`.

## Как устроено

Единый источник цвета — CSS-переменные (токены). Тема переключается атрибутом
`data-theme="dark"` на `<html>` (ставит `App.tsx`), и токены меняются каскадом.
Захардкоженные hex и тернарники `isDarkTheme ? "#..." : "#..."` постепенно
заменяются на токены/утилиты (миграция — шаг 0.B.4 и далее).

Слои в `src/index.css`:

1. **Сырые токены** — секции «ДИЗАЙН-ТОКЕНЫ ЦВЕТА» и «ТОКЕНЫ ШРИФТА И ТАЙМИНГА».
   `:root` — светлая тема, `:root[data-theme="dark"]` — тёмная.
2. **Мост в Tailwind** — `@theme inline` (цвета) и `@theme` (шрифты) в начале файла.
   Генерирует утилиты и связывает их с сырыми токенами.
3. **Вариант `dark:`** — `@custom-variant dark` привязан к `data-theme`, а не к
   системной `prefers-color-scheme`.

## Токены цвета → как использовать

| Назначение | CSS-переменная | Tailwind-утилиты |
| --- | --- | --- |
| Фон страницы | `--bg` | `bg-background` |
| Приподнятая поверхность | `--bg-elevated` | `bg-surface` |
| Утопленная зона / hover | `--bg-sunken` | `bg-sunken` |
| Граница | `--border` | `border-border` |
| Мягкая граница | `--border-subtle` | `border-border-subtle` |
| Текст основной | `--text` | `text-foreground` |
| Текст вторичный | `--text-muted` | `text-muted` |
| Текст третичный | `--text-subtle` | `text-subtle` |
| Акцент: Notes | `--accent-notes` | `text-notes` / `bg-notes` |
| Акцент: Commands | `--accent-commands` | `text-commands` |
| Акцент: Links | `--accent-links` | `text-links` |
| Акцент: Prompts | `--accent-prompts` | `text-prompts` |
| Акцент: Playbooks | `--accent-playbooks` | `text-playbooks` |
| Бренд | `--primary` | `text-primary` / `bg-primary` |
| Ошибка / успех / внимание | `--danger` / `--success` / `--warning` | `text-danger` и т.п. |

Утилиты работают со всеми префиксами Tailwind: `bg-*`, `text-*`, `border-*`,
`hover:*`, `dark:*`, с прозрачностью (`bg-surface/50`).

Пример перевода компонента:

```diff
- style={{ background: isDarkTheme ? "#1e293b" : "#f1f5f9",
-          color: isDarkTheme ? "#e2e8f0" : "#1e293b" }}
+ className="bg-surface text-foreground"
```

В редких местах, где нужен именно inline-стиль, ссылайтесь на переменную:
`style={{ background: "var(--bg-elevated)" }}`.

## Шрифты

- `font-ui` — интерфейсный шрифт (`--font-ui`).
- `font-code` — моноширинный (`--font-code`); значение подставляется из
  `settings.codeFont` (App.tsx).
- Размер интерфейса — `--app-font-size` из `settings.fontSize` (App.tsx).

## Радиусы, тени, кегль, интерлиньяж

**Не заводим свои токены** — используем встроенную шкалу Tailwind: `rounded-lg`,
`shadow`, `text-sm`, `leading-normal` и т.д. Переопределять `--radius-*`,
`--shadow-*`, `--text-*`, `--leading-*` в `:root` **нельзя** — это меняет
существующие утилиты во всём приложении.

Тайминг для ручного CSS: `--duration` (0.15s) и `--ease` (ease-out).

## Правила

1. Новый код — на токенах/утилитах, без сырых hex.
2. Не переопределять неймспейсы Tailwind (`--radius-*`, `--shadow-*`, `--text-*`,
   `--leading-*`, `--color-*`, `--font-weight-*`) в обычном `:root`.
3. Тему определяет только `data-theme` — не завязывайтесь на `prefers-color-scheme`.
