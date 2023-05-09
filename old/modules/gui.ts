import { onKey, onTick } from "../services/jsMacroAddition";
import * as TestMap from "../services/testMap";

const t = TestMap["MinecraftClient"];

const screen = Hud.createScreen(" ", false) as ReturnType<
  typeof Hud.getOpenScreen
> &
  ReturnType<typeof Hud.createScreen>;
screen.setOnInit(
  jfn((s: typeof screen) => {
    const sw = screen.getWidth(),
      sh = screen.getHeight();
    ngCutX(s.addText("Test screen applicable", 0, 5, 0xcff2ff, true), sw / 2);
    ngCutX(s.addText("warps", 0, 20, 0xcff2ff, true), sw / 2);
    ngCutX(
      s.addButton(
        0,
        40,
        80,
        20,
        "spawn",
        jfn(() => Chat.say("/spawn"))
      ),
      sw / 2
    );
    ngCutX(
      s.addButton(
        0,
        40,
        80,
        20,
        "slime",
        jfn(() => Chat.say("/travel hills"))
      ),
      sw / 2 - sw / 6
    );
    ngCutX(
      s.addButton(
        0,
        40,
        80,
        20,
        "market",
        jfn(() => Chat.say("/travel market"))
      ),
      sw / 2 + sw / 6
    );
    ngCutX(
      s.addButton(
        0,
        70,
        80,
        20,
        "end",
        jfn(() => Chat.say("/travel end"))
      ),
      sw / 2
    );
    ngCutX(
      s.addButton(
        0,
        70,
        80,
        20,
        "nether",
        jfn(() => Chat.say("/travel nether"))
      ),
      sw / 2 - sw / 6
    );
    ngCutX(
      s.addButton(
        0,
        70,
        80,
        20,
        "ice",
        jfn(() => Chat.say("/travel ice"))
      ),
      sw / 2 + sw / 6
    );
  })
);
onKey(0, "key.keyboard.x", () => {
  Hud.openScreen(screen);
});

interface ElementHelper {
  getWidth(): number;
  getHeight(): number;
  getX(): number;
  getY(): number;
  setPos(x, y): any;
}
function ngCutX(ele: ElementHelper, x: number, ng: number = -1) {
  ele.setPos(int(x + (ele.getWidth() / 2) * ng), ele.getY());
  return ele;
}
