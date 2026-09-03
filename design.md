# Design — Cargo lift (лаб. 1)

Промпт для генерации UI в **Figma AI / Figma Make**.  
Источник правды: шаблоны в `templates/` и стили в `static/css/style.css`.  
Референс бренда: [Wolffkran Products](https://www.wolffkran.com/website/en/de/products).

Существующий файл: [Cargo lift — лаб. 1 Vibes](https://www.figma.com/design/496UaCcAEp6IhNJ7QhoNvs)

---

## Промпт (скопировать целиком)

Создай мобильный UI-дизайн (3 экрана) для учебного веб-приложения «Лента подъёма грузов башенным краном WOLFF».

Стиль: industrial / minimal, как у Wolffkran. Portrait mobile. **Без скруглений** (`border-radius: 0` везде). Язык интерфейса — русский. Не используй Material Design и iOS UI Kit.

### Формат

- 3 фрейма **390×844 px**, в ряд на одной странице Figma
- Названия фреймов: `01 Каталог`, `02 Лента`, `03 Добавление`
- Внутри — белая «рамка телефона» (max-width 430px), фон `#FFFFFF`
- Фон вокруг телефона на артборде: `#ECECEC`
- На всех экранах — фиксированная нижняя панель вкладок высотой **64px**

### Цвета (Color Styles)

| Token | HEX |
|---|---|
| Wolff Red | `#E30613` |
| Coal Black | `#1D1D1D` |
| White | `#FFFFFF` |
| Gray Text | `#6B6B6B` |
| Button Border | `#E5E5E5` |
| Button Fill | `#F2F2F2` |
| Button Hover | `#DCDCDC` |
| Frame Background | `#ECECEC` |
| Image Placeholder | `#CFD8E0` |
| Minio Preview BG | `#D9E2EA` |
| Feed text muted | `#E8E8E8` |
| Feed description | `#D4D4D4` |
| Feed label | `#B8B8B8` |

### Типографика

- Семейство: **Helvetica Neue / Helvetica / Arial** (не Inter)
- Заголовки экрана: 22px, weight 700, `#1D1D1D` (на ленте — белый)
- Подписи вкладок: 10px, uppercase, letter-spacing 0.04em, weight 600
- Бейдж WOLFF: 11px, weight 800, letter-spacing 0.14em
- Метки полей / фильтра: 11–12px, uppercase, weight 700, `#6B6B6B`

### Компонент: Tab Bar

Горизонтальный auto-layout, 3 равные колонки. Фон `#FFFFFF`, верхняя граница 1px `#E5E5E5`.

Каждая вкладка: иконка 22×22 (stroke 1.8, без fill) + подпись снизу.

Слева направо:

1. **Лента** — play в прямоугольнике
2. **Добавление** — плюс
3. **Каталог** — сетка 2×2 (четыре квадрата)

Неактивная: `#6B6B6B`. Активная: `#E30613`.

### Компонент: бейдж WOLFF

Плашка `#E30613`, текст «WOLFF» белый, padding 5×9, без скругления.

### Компоненты для переиспользования

Tab Bar, WOLFF Badge, Cargo Card, Filter Slider Block, Minio Media Block, Primary Button (красная), Secondary Button (серая `#F2F2F2` + border `#E5E5E5`), Disabled Button.

---

### Экран 01 — Каталог грузов

Активная вкладка: **Каталог**.

1. Header (padding 16): бейдж WOLFF + H1 «Каталог грузов»
2. Подсказка 12px `#6B6B6B`: «Фильтр по массе груза, т. Значение 0 — все опубликованные. Число справа обновится после «Отобрать».»
3. Блок фильтра (padding 12, фон `#F2F2F2`, border `#E5E5E5`):
   - Слева label «МАССА, Т», справа значение **4.0** (18px weight 700)
   - Ползунок 0–10, step 0.1: track 4px `#E5E5E5`, thumb 20×20 квадрат `#E30613` с белой обводкой 2px
   - Метки «0» и «10» под ползунком
   - Кнопка на всю ширину «ОТОБРАТЬ»: fill `#E30613`, белый текст, 11px uppercase weight 700
4. Сетка карточек 2 колонки, gap 10:
   - Border `#E5E5E5`, без radius
   - Фото height 110, placeholder `#CFD8E0`
   - Тело padding 10: название 13px weight 700; низ — «Интерес **N**» и «Масса **N т**» (11px)

Данные карточек:

1. Панель перекрытия ПБ 62.12-8 — Интерес 3, Масса 4 т  
2. Балка железобетонная Б-1 60 — Интерес 5, Масса 7 т  
3. Фундаментный блок ФБС 24.6.6 — Интерес 2, Масса 2 т  

---

### Экран 02 — Лента подъёма

Активная вкладка: **Лента**. Полноэкранный тёмный фон `#1D1D1D`.

1. На весь экран — фото стройки / подъёма груза (object-fit cover) + полупрозрачная иконка ▶ по центру  
   (в Figma **не вставлять видео** — только постер + play)
2. Нижний градиент ~58% высоты: от `rgba(29,29,29,0.92)` внизу до transparent вверху
3. Контент поверх градиента (над Tab Bar, padding ≈ 20/18/16):
   - Бейдж WOLFF
   - H1 «Панель перекрытия ПБ 62.12-8» — 22px weight 700 белый
   - «Описание груза» 13px `#E8E8E8`, слово «больше» цветом `#E30613`
   - Текст описания: «Подъём ЖБ-панели башенным краном WOLFF 7032 Clear. Строповка за монтажные петли.» — `#D4D4D4`
   - Две колонки:
     - «МАССА ГРУЗА» → **4 т**
     - «ВЫЛЕТ СТРЕЛЫ» → **35 м**  
     (label 10px uppercase `#B8B8B8`, значение 15px weight 700 белый)
   - Ряд действий:
     - Красное сердце 28×28 + число **3** под ним
     - Кнопка «Следующий груз >» (flex-1): fill `#F2F2F2`, border `#E5E5E5`, текст `#1D1D1D` 13px weight 600

---

### Экран 03 — Добавление груза

Активная вкладка: **Добавление**. Белый скролл-экран, padding 16.

1. Header: WOLFF + H1 «Добавление груза» + бейдж статуса **draft** (11px uppercase `#6B6B6B`, border `#E5E5E5`, padding 4×8)
2. Блок «Изображение Minio»:
   - Заголовок-плашка uppercase 12px `#6B6B6B` на фоне `#F2F2F2`
   - Превью height 160, фон `#D9E2EA`
   - Строка выбора файла с border-top
3. Блок «Видео цикла Minio» — то же, превью видео
4. Поля формы (labels uppercase 11px `#6B6B6B`):
   - Наименование: «Панель стеновая ПС 30.15»
   - Описание (textarea): «Черновик: не публиковать в ленте и каталоге.»
   - Масса груза, т: **3**
   - Вылет стрелы, м: **30**
5. Disabled-кнопка на всю ширину: «Сохранение в лабораторной 1 недоступно» — fill `#F2F2F2`, border `#E5E5E5`, текст `#6B6B6B`

---

### Правила

- Все углы прямые — никаких pills / rounded cards
- Фото: placeholder стройки / ЖБ-панелей, не абстрактные градиенты как основной визуал
- Один job на экран: каталог / лента / форма черновика
- Иконки outline (stroke), кроме заполненного сердца на ленте

---

## Короткая версия (если лимит символов)

> 3 mobile frames 390×844, Wolffkran industrial (#E30613, #1D1D1D, #FFFFFF, no border-radius, Helvetica/Arial). Bottom tabs: Лента / Добавление / Каталог. 01 Catalog: mass slider 0–10 + 2-col cargo cards. 02 Feed: full-bleed poster + dark gradient, cargo info, heart 3, Next. 03 Addition: draft form, Minio image/video blocks, disabled save. Russian UI, WOLFF red badge, 64px tab bar.

---

## Соответствие коду

| Экран | Шаблон | CSS |
|---|---|---|
| Каталог | `templates/index.html` | `.forma-massy`, `.setka-gruzov`, `.kartochka-gruza` |
| Лента | `templates/lenta-podyoma.html` | `.ekran-lenty`, `.sloi-dannyh`, `.panel-vkladok-podyoma` |
| Добавление | `templates/cargo_addition.html` | `.blok-minio`, `.pole-gruza`, `.knopka-bez-sohraneniya` |
