import { commands } from "../services/loader";

const NIGHT_VISION_EFF = (<any>Java.type("net.minecraft.class_1294"))
	.field_5925; // net.minecraft.entity.effect.StatusEffect.HASTE
const StatusEffectInstance = <any>Java.type("net.minecraft.class_1293");

const command = Chat.createCommandBuilder("/nightvision")
	.executes(jafn(ctx => addNightVision()))
	.intArg("time")
	.executes(jafn(ctx => addNightVision(ctx.getArg("time"))))
	.or(1)
	.literalArg("remove")
	.executes(
		jafn(ctx => {
			const player = Player.getPlayer().getRaw();
			if (!player[trMapping.hasStatusEffect](NIGHT_VISION_EFF))
				return Chat.log("dont hv");
			player[trMapping.removeStatusEffect](NIGHT_VISION_EFF);
			Chat.log("done!");
		})
	);
commands.add(command);

function addNightVision(time = 1000000) {
	const player = Player.getPlayer().getRaw();

	if (player[trMapping.hasStatusEffect](NIGHT_VISION_EFF))
		return Chat.log("you already have night vision!");
	player[trMapping.addStatusEffect](
		new StatusEffectInstance(
			NIGHT_VISION_EFF,
			time || 0,
			0,
			false,
			false,
			false
		),
		null
	);
	Chat.log("added night vision!");
}

const trMapping = {
	hasStatusEffect: "method_6059",
	getStatusEffect: "method_6112",
	addStatusEffect: "method_37222",
	removeStatusEffect: "method_6016"
} as const;
