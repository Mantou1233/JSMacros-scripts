import {
	addItem,
	itemToNbtHelper,
	nbtHelperToString,
	updateItem
} from "./common";
import { BaseScreen } from "./BaseScreen";

const NbtCompound = Java.type("net.minecraft.class_2487");
const ItemStackHelper = Java.type(
	"xyz.wagyourtail.jsmacros.client.api.helpers.inventory.ItemStackHelper"
);

export class MainScreen extends BaseScreen {
	registries = Client.getRegistryManager();
	override init(
		screen: _javatypes.xyz.wagyourtail.jsmacros.client.api.sharedinterfaces.IScreen &
			_javatypes.xyz.wagyourtail.jsmacros.client.api.classes.ScriptScreen
	): void {
		super.init(screen);

		const sx = screen.getWidth(),
			sy = screen.getHeight(),
			cx = int(sx / 2),
			cy = int(sy / 2);

		let fieldsAmount = 0;
		this.renderStack(cx, 40);
		this.renderElements["idBar"] = screen.addTextInput(
			cx,
			25 + 30 * ++fieldsAmount,
			75,
			20,
			"",
			jfn(this.handleId.bind(this))
		);
		this.renderElements["idBar"].setMaxLength(200000);
		this.renderElements["idBar"].setText(this.stack.getItemId());
	}

	handleId(change: string, screen) {
		const ids = jf(this.registries.getItemIds()) as string[];
		const idBar = this.renderElements[
			"idBar"
		] as _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.TextFieldWidgetHelper;

		let success: boolean = false;
		let suggestion: string | undefined;
		for (let id of ids) {
			if (change == id) {
				success = true;
			} else if (
				id.startsWith(change) &&
				change.length > suggestion?.length
			)
				suggestion = change;
		}
		if (!success) {
			if (suggestion) idBar.setSuggestion(suggestion);
		} else {
			let compound = new NbtCompound();
			(mappings.remapClass(compound).invokeMethod as any)(
				"putString",
				"id",
				"change"
			);
			let stack = new ItemStackHelper(
				mappings
					.remapClass(this.stack.copy().getRaw())
					.invokeMethod("setNBT", compound as any)
			);
			this.updateStack();
		}
	}
}
