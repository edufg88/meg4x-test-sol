import { JsonAsset, resources } from "cc";
import { catchError, map, Observable, of } from "rxjs";
import { Building } from "./models/building";
import { defaultGameState, GameState } from "./models/gameState";
import { Hero } from "./models/hero";

export class GameDataLoader {
    private buildingsSettingsPath = 'settings/buildings';
    private heroesSettingsPath = 'settings/heroes';
    private gameStateSettingsPath = 'settings/initial_state';

    private _buildings$: Observable<Building[]> = null!;
    private _heroes$: Observable<Hero[]> = null!;
    private _gameState$: Observable<GameState> = null!;

    get buildings$() {
        return this._buildings$;
    }

    get heroes$() {
        return this._heroes$;
    }

    get gameState$() {
        return this._gameState$;
    }

    constructor() {
        this._buildings$ = this.loadJsonAsset(this.buildingsSettingsPath).pipe(
            map(jsonAsset => this.mapJsonToBuildings(jsonAsset.json)),
            catchError(err => {
                console.error('Error loading buildings:', err);
                return [];
            })
        );

        this._heroes$ = this.loadJsonAsset(this.heroesSettingsPath).pipe(
            map(jsonAsset => jsonAsset.json?.heroes as Hero[]),
            catchError(err => {
                console.error('Error loading heroes:', err);
                return [];
            })
        );

        this._gameState$ = this.loadJsonAsset(this.gameStateSettingsPath).pipe(
            map(jsonAsset => this.mapJsonToGameState(jsonAsset.json)),
            catchError(err => {
                console.error('Error loading game state:', err);
                return of(defaultGameState);
            })
        );
    }

    private mapJsonToGameState(json: any): GameState {
        return {
            currency: json.state.currency,
            buildings: json.state.buildings,
            heroes: json.state.heroes
        };
    }

    private mapJsonToBuildings(json: any): Building[] {
        return json.buildings.map((building: any) => ({
            id: building.id,
            name: building.name,
            description: building.description,
            cost: building.cost,
            hireSlots: building.settings.hireSlots,
            summoningQueue: []
        }));
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
}
