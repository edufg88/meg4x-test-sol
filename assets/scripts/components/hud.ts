import { _decorator, Component, Node } from 'cc';
import { Observable, Subject } from 'rxjs';
import { Building } from '../models/building';
import { GameState } from '../models/gameState';
import { Hero } from '../models/hero';
import { BuildingViewModel } from '../viewModels/buildingViewModel';
import { CurrencyViewModel } from '../viewModels/currencyViewModel';
import { TownSignpostViewModel } from '../viewModels/townSignpostViewModel';
import { BuildingPanelView } from '../views/buildingPanelView';
import { CurrencyView } from '../views/currencyView';
import { TownSignpostPanelView } from '../views/townSignpostPanelView';
import { TownSignpostView } from '../views/townSignpostView';
import { TownBuilding } from './townBuilding';
const { ccclass, property } = _decorator;

@ccclass('Hud')
export class Hud extends Component {

    @property(CurrencyView)
    private currencyView: CurrencyView = null!;
    @property(BuildingPanelView)
    private buildingPanelView: BuildingPanelView = null!;
    @property(TownSignpostView)
    private townSignpostView: TownSignpostView = null!;
    @property(TownSignpostPanelView)
    private townSignpostPanelView : TownSignpostPanelView = null!;

    private currencyViewModel: CurrencyViewModel = null!;
    private buildingViewModel: BuildingViewModel = null!;
    private townSignpostViewModel: TownSignpostViewModel = null!;
    private heroHireSubject = new Subject<[Hero, Building]>();

    get heroHire$() {
        return this.heroHireSubject.asObservable();
    }

    public init(townBuildings: TownBuilding[], buildings$: Observable<Building[]>, heroes$: Observable<Hero[]>, gameState$: Observable<GameState>) {
        this.buildingPanelView.addHireHeroCallback((hero, building) => this.heroHireSubject.next([hero, building]));
        this.currencyViewModel = new CurrencyViewModel(gameState$, this.heroHireSubject.asObservable());
        this.buildingViewModel = new BuildingViewModel(townBuildings, buildings$, heroes$, gameState$);
        this.townSignpostViewModel = new TownSignpostViewModel();
        this.currencyView.init(this.currencyViewModel);
        this.buildingPanelView.init(this.buildingViewModel);
        this.townSignpostView.init(this.townSignpostViewModel);
        this.townSignpostPanelView.init(this.townSignpostViewModel);
        townBuildings.forEach(building => building.init());
    }
}

