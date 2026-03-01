import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { BaseBadge } from './Badge.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';


export default class MyExtension extends Extension {
	// Создаем дескриптор беджа
    private badge: InstanceType<typeof BaseBadge> | null = null;


    override enable() {
		this.badge = new BaseBadge(this.metadata.name);
		this.badge.refreshText();

        Main.panel.addToStatusArea(this.uuid, this.badge);
    }


    override disable() {
        this.badge?.destroy();
        this.badge = null;
    }
}
