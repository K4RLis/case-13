# Сайт на годовщину

`index.html` — страница с паролем. Всё содержимое (текст и фото) зашифровано паролем
(AES-256-GCM, ключ из PBKDF2), поэтому даже в публичном репозитории без пароля его не увидеть.
Пароль не хранится в репозитории. Регистр, пробелы и «ё/е» при вводе не важны.

## Как поменять пароль, фото или текст

1. Положи фото в `anniversary/photos/1.jpg` … `20.jpg` (можно `.png`) (эта папка в `.gitignore` и не коммитится).
2. Текст правится в `anniversary/src/content.html`.
3. Собери: `node anniversary/build.mjs "новый пароль"` и закоммить `anniversary/index.html`.

## Публикация

GitHub → Settings → Pages → Source: *Deploy from a branch*, ветка с этим кодом, папка `/ (root)`.
Адрес сайта: `https://<логин>.github.io/case-13/anniversary/`
