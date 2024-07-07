import { Observable, Subject } from "rxjs";
import { TownBuilding } from "../components/townBuilding";
import { Building } from "../models/building";
import { GameState } from "../models/gameState";
import { Hero } from "../models/hero";

export class BuildingViewModel {
    private buildingClickSubject = new Subject<string>();
    private _buildings$: Observable<Building[]> = null!;
    private _heroes$: Observable<Hero[]> = null!;
    private _gameState$: Observable<GameState> = null!;

    private heroHireSubject = new Subject<[Hero, Building]>();
    private heroAddedToSlotSubject = new Subject<[Hero, number]>();
    private heroStartSummoningSubject = new Subject<number>();
    private buildingFinishedSummoningSubject = new Subject<Building>();
    private buildingPanelStateChangeSubject = new Subject<[boolean, boolean]>();

    get buildingClick$() {
        return this.buildingClickSubject.asObservable();
    }

    get buildings$() {
        return this._buildings$;
    }

    get heroes$() {
        return this._heroes$;
    }

    get gameState$() {
        return this._gameState$;
    }

    get heroHire$() {
        return this.heroHireSubject.asObservable();
    }

    get heroAddedToSlot$() {
        return this.heroAddedToSlotSubject.asObservable();
    }

    get heroStartSummoning$() {
        return this.heroStartSummoningSubject.asObservable();
    }

    get buildingFinishedSummoning$() {
        return this.buildingFinishedSummoningSubject.asObservable();
    }

    get buildingPanelStateChange$() {
        return this.buildingPanelStateChangeSubject.asObservable();
    }

    constructor(townBuildings: TownBuilding[], buildings$: Observable<Building[]>, heroes$: Observable<Hero[]>, gameState$: Observable<GameState>) {
        this._buildings$ = buildings$;
        this._heroes$ = heroes$;
        this._gameState$ = gameState$;
        townBuildings.forEach(building => {
            building.buttonClick$.subscribe(buildingId => this.onTownBuildingClick(buildingId));
        });
    }

    private onTownBuildingClick(buildingId: string) {
        this.buildingClickSubject.next(buildingId);
    }

    public onHeroHire(hero: Hero, building: Building) {
        if (building) {
            if (building.summoningQueue.length === building.hireSlots) {
                console.error('Error queue is full');
            }
            else {
                const slotIdx = building.summoningQueue.length;
                this.heroAddedToSlotSubject.next([hero, slotIdx]);
                if (slotIdx === 0) {
                    this.heroStartSummoningSubject.next(slotIdx);
                }
                this.heroHireSubject.next([hero, building]);
            }
        }
    }

    public onSummonComplete(building: Building) {
        this.buildingFinishedSummoningSubject.next(building);
    }

    public panelStateChange(visible: boolean, processing: boolean) {
        console.log('Building panel state: ', visible, processing);
        this.buildingPanelStateChangeSubject.next([visible, processing]);
    }
}