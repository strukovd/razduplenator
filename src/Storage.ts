export default class Storage {
	static tasks: string[] = [];
	private static listeners = new Set<() => void>();

	static get(index?: number): string | undefined {
		const length = Storage.tasks.length;
		if(index !== undefined) return Storage.tasks[index] ?? undefined;
		else return Storage.tasks[length - 1];
	}

	static set(title: string): void {
		Storage.tasks.push(title);
		Storage.notify();
	}

	static subscribe(listener: () => void): () => void {
		Storage.listeners.add(listener);
		return () => Storage.listeners.delete(listener);
	}

	private static notify(): void {
		for (const listener of Storage.listeners)
			listener();
	}
}
