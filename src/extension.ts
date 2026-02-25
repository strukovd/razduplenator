import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import GLib from 'gi://GLib';
import { BaseBadge } from './Badge.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import Storage from './Storage.js';
// import { ConfirmDialog } from './Dialog.js';


export default class MyExtension extends Extension {
    private badge: InstanceType<typeof BaseBadge> | null = null;
    // private dialog: InstanceType<typeof ConfirmDialog> | null = null;
    // private openDialogSourceId: number | null = null;

    override enable() {
		console.log(`enable`);

		// this.dialog = new ConfirmDialog({
		// 	title: 'Добавить задачу',
		// 	onConfirm: (text: string) => {
		// 		if (text && text.trim() !== "") {
		// 			Storage.set(text.trim());
		// 			this.badge?.refreshText();
		// 		}
		// 	},
		// 	onCancel: () => {}
		// });

		// const onBadgeClick = () => {
		// 	console.log(`badge was clicked`);
		// 	// if (this.openDialogSourceId !== null) return;

		// 	// this.openDialogSourceId = GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
		// 	// 	this.openDialogSourceId = null;
		// 	// 	this.dialog?.present();
		// 	// 	return GLib.SOURCE_REMOVE;
		// 	// });
		// };

		this.badge = new BaseBadge(this.metadata.name);
		this.badge.refreshText();

        Main.panel.addToStatusArea(this.uuid, this.badge);
    }

	/*
    _showDialog() {
		const dialog = new BaseDialog({callback: (text: string) => {
            if (text && text.trim() !== "") {
                // this._tasks.push(text.trim());
                this._updateLabel();
            }
        }});
        dialog.open();
        dialog._entry.grab_key_focus();
    }
	*/

    override disable() {
		console.log(`disable`);

		// if (this.openDialogSourceId !== null) {
		// 	GLib.Source.remove(this.openDialogSourceId);
		// 	this.openDialogSourceId = null;
		// }

		// this.dialog?.destroy();
		// this.dialog = null;
        this.badge?.destroy();
        this.badge = null;
    }
}
