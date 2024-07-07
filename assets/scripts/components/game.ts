import { GameDataHandler } from "../gameDataHandler";
import { _decorator, Component } from 'cc';
import { Hud } from "./hud";
import { TownBuilding } from "./townBuilding";
import { Hero } from "../models/hero";
import { Building } from "../models/building";

const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {

    @property(Hud)
    private hud: Hud = null!;
    @property(TownBuilding)
    private townBuildings: TownBuilding[] = [];

    private dataHandler: GameDataHandler = null!;

    get buildings$() {
        return this.dataHandler.buildings$;
    }

    get heroes$() {
        return this.dataHandler.heroes$;
    }

    get gameState$() {
        return this.dataHandler.gameState$;
    }

    start() {
        this.dataHandler = new GameDataHandler();
        this.hud.init(this.townBuildings, this.buildings$, this.heroes$, this.gameState$);
        this.hud.heroHire$.subscribe(([hero, building]) => {
            this.addHeroToBuilding(hero, building);
            this.decreaseCurrency(hero.cost);
        });
        this.hud.buildingFinishedSummoning$.subscribe(building => {
            console.log('building finished summoning', building.id);
            this.addLastHeroToHistory(building);
            this.removeLastHeroFromBuilding(building);
        })
    }

    private addHeroToBuilding(hero: Hero, building: Building) {
        this.dataHandler.pushHeroToBuilding(hero, building);
    }

    private addLastHeroToHistory(building : Building) {
        this.dataHandler.addHeroToHistory(building.summoningQueue[0]);    
    }

    private removeLastHeroFromBuilding(building: Building) {
        this.dataHandler.shiftHeroFromBuilding(building);
    }

    private decreaseCurrency(value: number) {
        this.dataHandler.decreaseCurrency(value);
    }
}

