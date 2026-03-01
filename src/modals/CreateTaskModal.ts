import Clutter from 'gi://Clutter';
import GObject from 'gi://GObject';
import St from 'gi://St';
import * as ModalDialog from 'resource:///org/gnome/shell/ui/modalDialog.js';
import Storage from '../Storage.js';


class Modal extends ModalDialog.ModalDialog {
	declare public template: St.BoxLayout;
	declare private title: string;
	declare private pTextBox: St.Entry;

	// constructor
	override _init(...params: any) {
		super._init({ styleClass: 'task-dialog' });

		this.title = 'Новая задача';
		this.ensureDialog();
	}

	ensureDialog() {
		if(!this.template) this.create();
	}

	create() {
		// Содержимое окна
		// const layout = new St.BoxLayout({
		// 	vertical: true,
		// 	style: 'padding: 24px; spacing: 12px; background-color: #242424; border-radius: 12px;'
		// });
		// this.contentLayout.add_child(layout);

		// Заголовок окна
		// layout.add_child(new St.Label({
		// 	text: this._title,
		// 	style: 'font-size: 16px; font-weight: bold; color: white;'
		// }));

		// Поле ввода
		// this.featureTextBox = new St.Entry({
		// 	can_focus: true,
		// 	style: 'width: 320px; padding: 8px; background: rgba(255,255,255,0.05); color: white; border-radius: 6px;'
		// });

		// Работа с текстом
		// const entryText = this.featureTextBox.get_clutter_text();

		// При нажатии Enter
		// entryText.connect('activate', () => {
		// 	this._onConfirm(this.featureTextBox.get_text().trim());
		// 	this.close();
		// });
		// layout.add_child(this.featureTextBox);

		this.template = this.generateTemplate();
		this.contentLayout.add_child(this.template);

		// Добавление кнопок
		this.setButtons([
			{
				label: "Добавить",
				action: () => {
					this.onConfirm();
					this.close();
				},
				key: Clutter.KEY_Return
			} as any,
			{
				label: "Отмена",
				action: () => {
					this.onCancel();
					this.close();
				},
				key: Clutter.KEY_Escape
			} as any
		]);
	}

	generateTemplate() {
		// Wrapper окна
		const div = new St.BoxLayout({
			vertical: true,
			style: 'padding: 24px; spacing: 12px; background-color: #242424; border-radius: 12px;'
		});

		// Заголовок окна
		const title = new St.Label({
			name: 'window-title',
			text: this.title,
			style: 'font-size: 16px; font-weight: bold; color: white;'
		});

		// Поле ввода
		const textBox = this.pTextBox = new St.Entry({
			name: 'task-name',
			can_focus: true,
			style: 'width: 320px; padding: 8px; background: rgba(255,255,255,0.05); color: white; border-radius: 6px;'
		});
		// Событие при нажатии Enter
		textBox.get_clutter_text()
			.connect('activate', (text) => {
				this.onConfirm();
				this.close();
			});

		div.add_child(title);
		div.add_child(textBox);
		return div;
	}

	display() {
		this.ensureDialog();
		this.open();
		this.pTextBox.grab_key_focus();
	}

	onConfirm() {
		const text = this.pTextBox.get_text().trim(); // get_clutter_text().get_text();
		if (text !== "") {
			Storage.set(text);
			// this.refreshText();
		}
	}

	onCancel() {

	}
};

export const CreateTaskModal = GObject.registerClass(Modal) as unknown as {
    new (): Modal;
};
