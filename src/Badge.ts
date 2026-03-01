import GObject from 'gi://GObject';
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import Storage from './Storage.js';
import { CreateTaskModal } from './modals/CreateTaskModal.js';

const DEFAULT_TEXT = 'Задач: 0';



class Badge extends PanelMenu.Button {
    declare private featureLabel: St.Label;
    declare private featureBadge: St.BoxLayout;
    declare private onBadgeClick: () => void;
    declare private unsubscribeStorage?: () => void;

    // override _init(params?: Partial<PanelMenu.Button.ConstructorProps>): void;
    // override _init(menuAlignment: number, nameText: string, dontCreateMenu?: boolean): void;
    // override _init(menuName: string, onAddRequest: () => void): void;
    override _init(...params: any[]
        // arg1: number | string | Partial<PanelMenu.Button.ConstructorProps> = 0.5,
        // arg2?: string | (() => void),
        // arg3 = false
    ) {
		const [arg1, arg2, arg3] = params;
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
		if(!this.featureBadge) this.create();
	}

	create() {
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

		this.unsubscribeStorage = Storage.subscribe(() => this.refreshText());
		this.connect('destroy', () => {
			this.unsubscribeStorage?.();
			this.unsubscribeStorage = undefined;
		});

		// Обработка нажатия
		this.initBadgeListeners();
	}

	refreshText() {
        this.ensureBadge();

		const count = Storage.count();
		const text = count > 0 ? `Задач: ${count}` : DEFAULT_TEXT;
		this.featureLabel.set_text(text);
	}

	showDialog() {
		const dialog = new CreateTaskModal();
		dialog.display();
		// dialog._entry.grab_key_focus();
    }

	private initBadgeListeners() {
		const onLeftMouseClick = () => {
			// this.onBadgeClick();
			this.showDialog();
			return Clutter.EVENT_STOP;
		};
		const onRightMouseClick = () => {
			const menu = this.menu as PopupMenu.PopupMenu;




			// menu.close();
			this.renderMenu();
			// menu.open();
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

	renderMenu() {
		const menu = this.menu as PopupMenu.PopupMenu;
		menu.removeAll();

		const addButton = new PopupMenu.PopupMenuItem('✚ Добавить задачу');
		addButton.connect('activate', () => {
			menu.close();
			this.showDialog();
		});
		menu.addMenuItem(addButton);
		menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

		menu.addMenuItem(
			new PopupMenu.PopupMenuItem('Мои задачи', { reactive: false })
		);
		menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

		const tasks = Storage.getAll();
		if (tasks.length === 0) {
			menu.addMenuItem(new PopupMenu.PopupMenuItem('Список пуст', { reactive: false }));
		} else {
			tasks.forEach((task, index) => {
				menu.addMenuItem(new PopupMenu.PopupMenuItem(`${index + 1}. ${task}`, {}));
			});
		}
	}
};

export const BaseBadge = GObject.registerClass(Badge) as unknown as {
	new (menuName: string): Badge;
};
