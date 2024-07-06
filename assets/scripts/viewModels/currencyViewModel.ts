import { Observable, Subject } from "rxjs";
import { Building } from "../models/building";
import { GameState } from "../models/gameState";
import { Hero } from "../models/hero";

export class CurrencyViewModel {
    private _gameState$: Observable<GameState> = null!;
    private currencySpentSubject: Subject<number> = new Subject<number>();

    get gameState$() {
        return this._gameState$;
    }

    get currencySpent$() {
        return this.currencySpentSubject.asObservable();
    }

    constructor(gameState$: Observable<GameState>, heroHireObservable$: Observable<[Hero, Building]>) {
        this._gameState$ = gameState$;
        heroHireObservable$.subscribe(([hero, building]) => this.onHeroHire(hero, building));
    }

    private onHeroHire(hero: Hero, building: Building) {
        this.currencySpentSubject.next(hero.cost);
    }
}
