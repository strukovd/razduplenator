import Clutter from 'gi://Clutter';
import GObject from 'gi://GObject';
import St from 'gi://St';
import * as ModalDialog from 'resource:///org/gnome/shell/ui/modalDialog.js';

// Интерфейс для колбэка
type ConfirmDialogModel = {
	title: string,
	onConfirm?: (...params: any) => void,
	onCancel?: (...params: any) => void
};

class Dialog extends ModalDialog.ModalDialog {
	declare public featureTextBox: St.Entry;
	declare private _title: string;
	declare private _onConfirm: (...params: any) => void;
	declare private _onCancel: (...params: any) => void;

	override _init(params?: any) {
		console.log(`Dialog::_init`);
		super._init({ styleClass: 'task-dialog' });
		this._title = params?.title ?? 'Новая задача';
		this._onConfirm = params?.onConfirm ?? (() => {});
		this._onCancel = params?.onCancel ?? (() => {});
		this.ensureDialog();
	}

	ensureDialog() {
		console.log(`Badge::ensureDialog`);
		if(!this.featureTextBox) this.create();
	}

	create() {
		console.log(`Dialog::create`);

		// Содержимое окна
		const layout = new St.BoxLayout({
			vertical: true,
			style: 'padding: 24px; spacing: 12px; background-color: #242424; border-radius: 12px;'
		});
		this.contentLayout.add_child(layout);

		// Заголовок окна
		layout.add_child(new St.Label({
			text: this._title,
			style: 'font-size: 16px; font-weight: bold; color: white;'
		}));

		// Поле ввода
		this.featureTextBox = new St.Entry({
			can_focus: true,
			style: 'width: 320px; padding: 8px; background: rgba(255,255,255,0.05); color: white; border-radius: 6px;'
		});

		// Работа с текстом
		const entryText = this.featureTextBox.get_clutter_text();

		// При нажатии Enter
		entryText.connect('activate', () => {
			this._onConfirm(this.featureTextBox.get_text().trim());
			this.close();
		});
		layout.add_child(this.featureTextBox);

		// Кнопки
		this.setButtons([
			{
				label: "Добавить",
				action: () => {
					this._onConfirm(this.featureTextBox.get_text().trim());
					this.close();
				},
				key: Clutter.KEY_Return
			} as any,
			{
				label: "Отмена",
				action: () => {
					this._onCancel();
					this.close();
				},
				key: Clutter.KEY_Escape
			} as any
		]);
	}

	present() {
		console.log(`Dialog::present`);
		this.ensureDialog();
		this.featureTextBox.set_text('');
		this.open();
		this.featureTextBox.grab_key_focus();
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

	// 	this.feature = new St.Entry({
	// 		can_focus: true,
	// 		style: 'width: 320px; padding: 8px; background: rgba(255,255,255,0.05); color: white; border-radius: 6px;'
	// 	});

	// 	const entryText = this.feature.get_clutter_text();
	// 	entryText.connect('activate', () => {
	// 		this._callback(this.feature.get_text());
	// 		this.close();
	// 	});

	// 	content.add_child(this.feature);

	// 	this.setButtons([{
	// 		label: "Добавить",
	// 		action: () => {
	// 			this._callback(this.feature.get_text());
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

export const ConfirmDialog = GObject.registerClass(Dialog) as unknown as {
    new (params: ConfirmDialogModel): Dialog;
};
