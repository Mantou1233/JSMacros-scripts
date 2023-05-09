export class LocalStorage {
	private readonly location = "../db.json";
	private fsHandler: Packages.xyz.wagyourtail.jsmacros.core.library.impl.classes.FileHandler;
	private data: any;
	constructor(file: string | void) {
		this.fsHandler = FS.open(file || this.location);

		this.data = $.js.safeParseJSON(this.read());

		this.write(this.data);
	}

	/**
	 * wrapper fn to write the data to file
	 */
	write(data: any = this.data) {
		this.fsHandler.write(JSON.stringify(data));
		return true;
	}

	/**
	 * wrapper fn to read the data from file
	 */
	read() {
		return this.fsHandler.read();
	}

	table(table = "default") {
		/**
		 * accessor for `this` in proxy ctx
		 */
		const thisAcc = this;
		if (!this.data[table]) {
			this.data[table] = {};
		}
		return new Proxy(this.data[table], {
			get(obj, key) {
				if (key == "save") return thisAcc.write.bind(thisAcc);
				else if (key == "ls") return thisAcc;
				// ?? null is used so it dont have undefines
				return thisAcc.data[table][key] ?? null;
			},
			set(obj, key, val) {
				if (key == "save" || key == "ls") return false;
				thisAcc.data[table][key] = val;
				return true;
			},
			ownKeys() {
				return Object.keys(thisAcc.data[table]);
			}
		}) as Table;
	}
}

type Table = { [key: string]: any } & { save(): void };
