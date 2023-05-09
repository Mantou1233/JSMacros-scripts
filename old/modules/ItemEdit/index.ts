import { onKey } from "../../services/jsMacroAddition";
import { handleGui } from "./EditNBTScreen";
import { MainScreen } from "./MainScreen";

onKey(
	0,
	"key.keyboard.n",
	handleGui
	// /* handleGui */ () => {
	// 	Hud.openScreen(new MainScreen(Player.getPlayer().getMainHand()).screen);
	// }
);
