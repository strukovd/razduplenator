export default class Storage {
	static tasks: string[] = [];

	static get(index?: number): string | undefined {
		const length = Storage.tasks.length;
		if(index !== undefined) return Storage.tasks[index] ?? undefined;
		else return Storage.tasks[length - 1];
	}

	static set(title: string): void {
		Storage.tasks.push(title);
	}
}
