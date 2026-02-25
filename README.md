Шаблон TypeScript GNOME-расширения, поддерживающий intellisense completion. Сделанный по инструкции [TypeScript and LSP | GNOME Extension Guide](https://gjs.guide/extensions/development/typescript.html) 


> npm install

## Команды:
`make` - Собрать код (в папку dist). Он автоматически выполнит npm install.

`make pack` - Собрать билд в .zip архив для публикации. Далее его можно загрузить на extensions.gnome.org или передать кому-то для установки.

`make install` - Устанавливает расширение на компьютер, в папку `~/.local/share/gnome-shell/extensions/`.
- Затем `Alt+F2` ввести r для перезапуска (в Wayland не работает).
- `journalctl -f -o cat /usr/bin/gnome-shell` для просмотра логов

`make clean` - Очистить файлы компиляции (dist, dest)


> sudo apt install gnome-shell-extension-manager
>
> dbus-run-session -- env window_height=720 window_width=1280 gnome-shell --nested