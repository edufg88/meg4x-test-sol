import { GameDataHandler } from "../gameDataHandler";

import { _decorator, Component } from 'cc';
import { Hud } from "./hud";
import { TownBuilding } from "./townBuilding";
import { map, timer } from "rxjs";

const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {

    @property(Hud)
    private hud: Hud = null!;
    @property(TownBuilding)
    private townBuildings: TownBuilding[] = [];

    private dataLoader: GameDataHandler = null!;

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
        this.dataLoader = new GameDataHandler();
        this.hud.init(this.townBuildings, this.buildings$, this.heroes$, this.gameState$);
        this.hud.heroHire$.subscribe(hero => this.decreaseCurrency(hero.cost));
    }

    private decreaseCurrency(value: number) {
        this.dataLoader.decreaseCurrency(value);
    }
}

