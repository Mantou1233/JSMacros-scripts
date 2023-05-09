export const _commands: _javatypes.xyz.wagyourtail.jsmacros.client.api.classes.CommandBuilder[] =
	[];
export const _events: any[] = [];
export const _unloaders: Function[] = [];

function spwnMapper<T>(source: T[]): Mapper<T> {
	return {
		source,
		add: arg => void source.push(arg) ?? this,
		map: fn => source.map(fn)
	};
}

interface Mapper<T> {
	source: T[];
	add: (arg: T) => Mapper<T>;
	map<TLike>(fn: (arg: T, index: number, source: T[]) => TLike): TLike[];
}

const commands = spwnMapper(_commands);
const events = spwnMapper(_events);
const unloaders = spwnMapper(_unloaders);

export { commands, events, unloaders };
