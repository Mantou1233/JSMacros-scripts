type EventCallback<E extends keyof Events = keyof Events, R = void> = (
	event: Events[E],
	context: Context
) => R;
type Callback<R = any> = (...args: any[]) => R;

type Context = EventContainer;
type ClientPlayer = ClientPlayerEntityHelper;
type Pos2D = PositionCommon$Pos2D;
type Pos3D = PositionCommon$Pos3D;
type Vec2D = PositionCommon$Vec2D;
type Vec3D = PositionCommon$Vec3D;
