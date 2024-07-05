import { JsonAsset, resources } from "cc";
import { catchError, forkJoin, map, Observable, of } from "rxjs";
import { Building } from "./models/building";
import { defaultGameState, GameState } from "./models/gameState";
import { Hero } from "./models/hero";

export class GameDataLoader {
    private buildingsSettingsPath = 'settings/buildings';
    private heroesSettingsPath = 'settings/heroes';
    private gameStateSettingsPath = 'settings/initial_state';

    public buildings$: Observable<Building[]>;
    public heroes$: Observable<Hero[]>;
    public gameState$: Observable<GameState>;

    constructor() {
        this.buildings$ = this.loadJsonAsset(this.buildingsSettingsPath).pipe(
            map(jsonAsset => jsonAsset.json as Building[]),
            catchError(err => {
                console.error('Error loading buildings:', err);
                return [];
            })
        );

        this.heroes$ = this.loadJsonAsset(this.heroesSettingsPath).pipe(
            map(jsonAsset => jsonAsset.json as Hero[]),
            catchError(err => {
                console.error('Error loading heroes:', err);
                return [];
            })
        );

        this.gameState$ = this.loadJsonAsset(this.gameStateSettingsPath).pipe(
            map(jsonAsset => jsonAsset.json as GameState),
            catchError(err => {
                console.error('Error loading game state:', err);
                return of(defaultGameState);
            })
        );
    }

    private loadJsonAsset(path: string): Observable<JsonAsset> {
        return new Observable<JsonAsset>(observer => {
            resources.load(path, JsonAsset, (err, asset: JsonAsset) => {
                if (err) {
                    observer.error(err);
                    return;
                }
                observer.next(asset);
                observer.complete();
            });
        });
    }

    get allData$(): Observable<{ buildings: Building[], heroes: Hero[], gameState: GameState }> {
        return forkJoin({
            buildings: this.buildings$,
            heroes: this.heroes$,
            gameState: this.gameState$
        });
    }
}
