import { GameDataLoader } from "../gameDataLoader";

import { _decorator, Component } from 'cc';
import { Hud } from "./hud";
import { TownBuilding } from "./townBuilding";

const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {

    @property(Hud)
    private hud: Hud = null!;
    @property(TownBuilding)
    private townBuildings: TownBuilding[] = [];

    private dataLoader: GameDataLoader = null!;

    get buildings$() {
        return this.dataLoader.buildings$;
    }

    get heroes$() {
        return this.dataLoader.heroes$;
    }

    get gameState$() {
        return this.dataLoader.gameState$;
    }

    start() {
        this.dataLoader = new GameDataLoader();
        this.hud.init(this.townBuildings, this.buildings$, this.heroes$, this.gameState$);
    }
}

