import Clutter from 'gi://Clutter';
import St from 'gi://St';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import { BaseDialog } from './Dialog.js';

import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';


export default class MyExtension extends Extension {
    private _indicator: PanelMenu.Button | null = null;
    private _box: St.Bin | null = null;
    private _tasks: string[] = [];

    enable() {
        // В 2026 году PanelMenu.Button принимает (alignment, name, dontCreateMenu)
        this._indicator = new PanelMenu.Button(0.5, this.metadata.name, false);

        this._box = new St.Bin({
            style: 'background-color: #4A90E2; border-radius: 6px; margin: 4px; padding: 2px 10px;',
            reactive: true,
            track_hover: true,
            child: new St.Label({
                text: 'Задач: 0',
                y_align: Clutter.ActorAlign.CENTER,
                style: 'color: white; font-weight: bold;'
            })
        });

        this._box.connect('button-press-event', () => {
            this._showDialog();
            return Clutter.EVENT_STOP;
        });

        this._indicator.add_child(this._box);
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    _showDialog() {
        // Чтобы избежать конфликта типов в конструкторе GObject,
        // приводим класс к any или используем корректный вызов _init.
        const dialog = new BaseDialog({callback: (text: string) => {
            if (text && text.trim() !== "") {
                this._tasks.push(text.trim());
                this._updateLabel();
            }
        }});
        dialog.open();
        dialog._entry.grab_key_focus();
    }

    _updateLabel() {
        if (!this._box) return;

        const label = this._box.get_child() as St.Label;
        const lastTask = this._tasks[this._tasks.length - 1];
        const displayTask = lastTask.length > 12 ? lastTask.substring(0, 12) + '...' : lastTask;

        label.set_text(`${displayTask} [${this._tasks.length}]`);
        this._box.set_style('background-color: #2E7D32; border-radius: 6px; margin: 4px; padding: 2px 10px;');
    }

    disable() {
        this._indicator?.destroy();
        this._indicator = null;
        this._box = null;
        this._tasks = [];
    }
}
