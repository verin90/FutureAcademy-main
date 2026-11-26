# ХОД Future Academy

## Локальный запуск

Из папки проекта с Node.js 24 выполните:

```powershell
npm.cmd ci --prefix backend
npm.cmd ci --prefix frontend/vite-project
npm.cmd run build --prefix frontend/vite-project
npm.cmd start --prefix backend
```

Откройте [http://127.0.0.1:3001](http://127.0.0.1:3001). Сервер раздаёт собранные страницы и API. Для разработки можно параллельно запустить `npm.cmd run dev --prefix frontend/vite-project` и открыть [http://localhost:5174](http://localhost:5174).

Сервер создаёт базу SQLite в `backend/data`. Для отдельной базы при тестировании задайте `FUTURE_DATA_DIR`. Порт API можно изменить через `PORT`. При работе через Vite на нестандартном порту API задайте `FUTURE_API_TARGET` перед запуском фронтенда.

## Заявки и содержание

Пользователь видит заявки, которые отправил после входа. Гостевые заявки сохраняются в той же базе и доступны оператору из папки проекта:

```powershell
npm.cmd run applications --prefix backend
```

Команда выводит JSON с контактами, оставленными в заявках. Запускайте её с тем же `FUTURE_DATA_DIR`, если сервер использует нестандартный каталог.

Программы, статьи, форматы мероприятий и направления работы редактируются в `frontend/vite-project/src/content.js`. Это начальное наполнение на основе проекта и макетов. Даты мероприятий уточняются по заявкам.

## Проверки

```powershell
npm.cmd test --prefix backend
npm.cmd run lint --prefix frontend/vite-project
npm.cmd run build --prefix frontend/vite-project
```
