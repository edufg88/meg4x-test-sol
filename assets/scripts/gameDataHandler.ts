import { JsonAsset, resources } from "cc";
import { BehaviorSubject, catchError, map, Observable, of } from "rxjs";
import { Building } from "./models/building";
import { defaultGameState, GameState } from "./models/gameState";
import { Hero } from "./models/hero";

export class GameDataHandler {
    private buildingsSettingsPath = 'settings/buildings';
    private heroesSettingsPath = 'settings/heroes';
    private gameStateSettingsPath = 'settings/initial_state';

    private _buildings$: BehaviorSubject<Building[]> = new BehaviorSubject<Building[]>([]);
    private _heroes$: BehaviorSubject<Hero[]> = new BehaviorSubject<Hero[]>([]);
    private _gameState$: BehaviorSubject<GameState> = new BehaviorSubject<GameState>(defaultGameState);

    get buildings$(): Observable<Building[]> {
        return this._buildings$.asObservable();
    }

    get heroes$(): Observable<Hero[]> {
        return this._heroes$.asObservable();
    }

    get gameState$(): Observable<GameState> {
        return this._gameState$.asObservable();
    }

    constructor() {
        this.loadJsonAsset(this.buildingsSettingsPath).pipe(
            map(jsonAsset => this.mapJsonToBuildings(jsonAsset.json)),
            catchError(err => {
                console.error('Error loading buildings:', err);
                return of([]);
            })
        ).subscribe(buildings => this._buildings$.next(buildings));

        this.loadJsonAsset(this.heroesSettingsPath).pipe(
            map(jsonAsset => jsonAsset.json?.heroes as Hero[]),
            catchError(err => {
                console.error('Error loading heroes:', err);
                return of([]);
            })
        ).subscribe(heroes => this._heroes$.next(heroes));

        this.loadJsonAsset(this.gameStateSettingsPath).pipe(
            map(jsonAsset => this.mapJsonToGameState(jsonAsset.json)),
            catchError(err => {
                console.error('Error loading game state:', err);
                return of(defaultGameState);
            })
        ).subscribe(gameState => this._gameState$.next(gameState));
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

    public decreaseCurrency(value: number) {
        const currentState = this._gameState$.value;
        if (currentState) {
            const updatedState = { ...currentState, currency: currentState.currency - value };
            this._gameState$.next(updatedState);
        }
    }

    public pushHeroToBuilding(hero: Hero, building: Building) {
        let buildings = this._buildings$.value;
        buildings.forEach(b => {
            if (b.id === building.id) {
                b.summoningQueue.push(hero);
            }
        })
        this.updateBuildings(buildings);
    }

    public shiftHeroFromBuilding(building: Building) {
        let buildings = this._buildings$.value;
        buildings.forEach(b => {
            if (b.id === building.id) {
                b.summoningQueue.shift();
            }
        })
        this.updateBuildings(buildings);
    }

    public updateBuildings(newBuildings: Building[]) {
        this._buildings$.next(newBuildings);
    }

    public updateHeroes(newHeroes: Hero[]) {
        this._heroes$.next(newHeroes);
    }

    public updateBuilding(buildingId: string, updatedBuilding: Partial<Building>) {
        const currentBuildings = this._buildings$.value;
        const buildingIndex = currentBuildings.findIndex(b => b.id === buildingId);
        if (buildingIndex !== -1) {
            currentBuildings[buildingIndex] = { ...currentBuildings[buildingIndex], ...updatedBuilding };
            this._buildings$.next([...currentBuildings]);
        }
    }
}
