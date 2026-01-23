import Clutter from 'gi://Clutter';
import GObject from 'gi://GObject';
import St from 'gi://St';
import * as ModalDialog from 'resource:///org/gnome/shell/ui/modalDialog.js';

// Интерфейс для колбэка
type TaskCallback = (text: string) => void;

class Dialog extends ModalDialog.ModalDialog {
	// Используем "!" чтобы сказать TS, что они будут инициализированы в _init
	private _callback!: TaskCallback;
	public _entry!: St.Entry;


	// В GObject сигнатура _init должна принимать объект параметров,
	// но мы можем добавить свои аргументы после него или передать их через объект.
	    _init(params: any) {
        // Вызываем родительский _init. В 2026 году можно передать пустой объект или стили.
        super._init({ styleClass: 'task-dialog' });

        // Извлекаем наш колбэк из переданного объекта параметров
        this._callback = params.callback;

        const content = new St.BoxLayout({
            vertical: true,
            style: 'padding: 24px; spacing: 12px; background-color: #242424; border-radius: 12px;'
        });

        this.contentLayout.add_child(content);

        content.add_child(new St.Label({
            text: "Новая задача (2026)",
            style: 'font-size: 16px; font-weight: bold; color: white;'
        }));

        this._entry = new St.Entry({
            can_focus: true,
            style: 'width: 320px; padding: 8px; background: rgba(255,255,255,0.05); color: white; border-radius: 6px;'
        });

        // Работа с текстом
        const entryText = this._entry.get_clutter_text();
        entryText.connect('activate', () => {
            if (this._callback) this._callback(this._entry.get_text());
            this.close();
        });

        content.add_child(this._entry);

        // Кнопки. Используем "as any" для каждого объекта кнопки,
        // чтобы не воевать с внутренними интерфейсами GNOME.
        this.setButtons([
            {
                label: "Добавить",
                action: () => {
                    this._callback(this._entry.get_text());
                    this.close();
                },
                key: Clutter.KEY_Return
            } as any,
            {
                label: "Отмена",
                action: () => this.close(),
                key: Clutter.KEY_Escape
            } as any
        ]);
    }
	// _init(callback: TaskCallback) {
	// 	super._init({ styleClass: 'task-dialog' });
	// 	this._callback = callback;

	// 	const content = new St.BoxLayout({
	// 		vertical: true,
	// 		style: 'padding: 24px; spacing: 12px; background-color: #242424; border-radius: 12px;'
	// 	});
	// 	this.contentLayout.add_child(content);

	// 	content.add_child(new St.Label({
	// 		text: "Новая задача (2026)",
	// 		style: 'font-size: 16px; font-weight: bold; color: white;'
	// 	}));

	// 	this._entry = new St.Entry({
	// 		can_focus: true,
	// 		style: 'width: 320px; padding: 8px; background: rgba(255,255,255,0.05); color: white; border-radius: 6px;'
	// 	});

	// 	const entryText = this._entry.get_clutter_text();
	// 	entryText.connect('activate', () => {
	// 		this._callback(this._entry.get_text());
	// 		this.close();
	// 	});

	// 	content.add_child(this._entry);

	// 	this.setButtons([{
	// 		label: "Добавить",
	// 		action: () => {
	// 			this._callback(this._entry.get_text());
	// 			this.close();
	// 		},
	// 		key: Clutter.KEY_Return
	// 	}, {
	// 		label: "Отмена",
	// 		action: () => this.close(),
	// 		key: Clutter.KEY_Escape
	// 	}]);
	// }
};

export const BaseDialog = GObject.registerClass(Dialog) as unknown as {
    new (params: any): Dialog;
};
