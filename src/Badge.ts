import GObject from 'gi://GObject';
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import Storage from './Storage.js';
import { ConfirmDialog } from './Dialog.js';

const DEFAULT_TEXT = 'Задач: 0';



class Badge extends PanelMenu.Button {
    declare private featureLabel: St.Label;
    declare private featureBadge: St.BoxLayout;
    declare private onBadgeClick: () => void;

    // override _init(params?: Partial<PanelMenu.Button.ConstructorProps>): void;
    // override _init(menuAlignment: number, nameText: string, dontCreateMenu?: boolean): void;
    // override _init(menuName: string, onAddRequest: () => void): void;
    override _init(...params: any[]
        // arg1: number | string | Partial<PanelMenu.Button.ConstructorProps> = 0.5,
        // arg2?: string | (() => void),
        // arg3 = false
    ) {
		const [arg1, arg2, arg3] = params;
		console.log(`Badge::_init`);
		console.log(`arg1: ${arg1}`);

		params.forEach(param => {
			console.log(`param: ${param}`);
		});


        if (typeof arg1 === 'string') {
            super._init(100, arg1, false);
        } else if (typeof arg1 === 'number') {
            super._init(arg1, typeof arg2 === 'string' ? arg2 : '', arg3);
        } else {
            super._init(arg1);
        }

		this.ensureBadge();
    }

	ensureBadge() {
		console.log(`Badge::ensureBadge`);
		if(!this.featureBadge) this.create();
	}

	create() {
		console.log(`Badge::create`);

		// Текст бейджа
		this.featureLabel = new St.Label({
			text: DEFAULT_TEXT,
			y_align: Clutter.ActorAlign.CENTER,
			style: 'color: white; font-weight: bold;'
		});
		// Контейнер бейджа
        this.featureBadge = new St.BoxLayout({
            style: 'background-color: #4A90E2; border-radius: 6px; margin: 4px; padding: 2px 10px;',
        });
        this.featureBadge.add_child(this.featureLabel);
        this.add_child(this.featureBadge);

		// Обработка нажатия
		this.initBadgeListeners();

        // const menu = this.menu as PopupMenu.PopupMenu;
        // menu.connect('open-state-changed', (_menu, open): boolean | undefined => {
        //     if (open) this.renderMenu();
        //     return undefined;
        // });
	}

	refreshText() {
		console.log(`Badge::refreshText`);
        this.ensureBadge();

		// Показываем последнюю задачу
		const text = Storage.get() ?? DEFAULT_TEXT;
		this.featureLabel.set_text(text);
	}

	showDialog() {
		const dialog = new ConfirmDialog({
			title: 'Добавить задачу',
			onCancel: () => {},
			onConfirm: (text: string) => {
				if (text && text.trim() !== "") {
					Storage.set(text.trim());
					this.refreshText();
				}
			},
		});
		dialog.present();
		// dialog._entry.grab_key_focus();
    }

	private initBadgeListeners() {
		const onLeftMouseClick = () => {
			// this.onBadgeClick();
			this.showDialog();
			return Clutter.EVENT_STOP;
		};
		const onRightMouseClick = () => {
			this.menu.toggle();
			return Clutter.EVENT_STOP;
		};

        this.connect('button-press-event', (_actor: Clutter.Actor, event: Clutter.Event) => {
			const button = event.get_button();
			switch (button) {
				case 1:
					return onLeftMouseClick();

				case 3:
					return onRightMouseClick();
			}

            return Clutter.EVENT_PROPAGATE;
        });
	}


	// renderMenu() {
	// 	console.log(`Dialog::renderMenu`);

	// 	const menu = this.menu as PopupMenu.PopupMenu;
	// 	menu.removeAll();

	// 	const title = new PopupMenu.PopupMenuItem('Мои Задачи', { reactive: false });
	// 	menu.addMenuItem(title);
	// 	menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

	// 	if (Storage.tasks.length === 0) {
	// 		menu.addMenuItem(new PopupMenu.PopupMenuItem('Список пуст', { reactive: false }));
	// 	} else {
	// 		Storage.tasks.forEach((task, i) => {
	// 			const item = new PopupMenu.PopupMenuItem(`${i + 1}. ${task}`);
	// 			menu.addMenuItem(item);
	// 		});
	// 	}

	// 	menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

	// 	const addBtn = new PopupMenu.PopupMenuItem('✚ Добавить задачу');
	// 	addBtn.connect('activate', () => this.onBadgeClick());
	// 	menu.addMenuItem(addBtn);
	// }
};

export const BaseBadge = GObject.registerClass(Badge) as unknown as {
	new (menuName: string): Badge;
};
