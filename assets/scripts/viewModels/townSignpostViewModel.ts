import { Observable, Subject } from "rxjs";
import { Building } from "../models/building";
import { GameState } from "../models/gameState";
import { Hero } from "../models/hero";

export class TownSignpostViewModel {

    private _townSignpostClick$: Observable<void> = null!;
    private summonedHeroesSubject: Subject<Hero[]> = new Subject<Hero[]>();
    private summonedHeroes: Hero[] = [];

    get townSignpostClick$() {
        return this._townSignpostClick$;
    }

    get summonedHeroesChange$() {
        return this.summonedHeroesSubject.asObservable();
    }

    constructor(townSignpostClick$: Observable<void>, gameState$: Observable<GameState>) {
        this._townSignpostClick$ = townSignpostClick$;
        gameState$.subscribe(gameState => {
            if (this.summonedHeroes.length !== gameState.heroes.length) {
                this.summonedHeroes = gameState.heroes;
                this.summonedHeroesSubject.next(gameState.heroes);
            }
        })
    }
}
