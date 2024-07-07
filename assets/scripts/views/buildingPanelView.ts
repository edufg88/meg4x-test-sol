import { _decorator, Component, Node, Vec3, tween, UITransform, view, Label, Prefab, instantiate, ToggleContainer, Toggle, game, Layout } from 'cc';
import { Subject } from 'rxjs';
import { HeroSpriteData } from '../heroSpriteData';
import { Building } from '../models/building';
import { GameState } from '../models/gameState';
import { Hero } from '../models/hero';
import { BuildingViewModel } from '../viewModels/buildingViewModel';
import { HeroCardView } from './heroCardView';
import { HeroHireButtonView } from './heroHireButtonView';
import { HeroHireSlotView } from './heroHireSlotView';
const { ccclass, property } = _decorator;

@ccclass('BuildingPanelView')
export class BuildingPanelView extends Component {

    @property(Label)
    private title: Label = null!;
    @property(Label)
    private description: Label = null!;
    @property(ToggleContainer)
    private toggleContainer: ToggleContainer = null!;
    @property(HeroHireButtonView)
    private heroHireButtonView: HeroHireButtonView = null!;
    @property(Node)
    private heroCardParent: Node = null!;
    @property(Node)
    private heroSlotsParent: Node = null!;
    @property(Layout)
    private heroSlotsLayout: Layout = null!;
    @property(Prefab)
    private heroCardPrefab: Prefab = null!;
    @property(Prefab)
    private heroHireSlotPrefab: Prefab = null!;
    @property(HeroSpriteData)
    private heroSpriteData: HeroSpriteData = null!;

    private toggleClickSubject = new Subject<[boolean, boolean, number]>();
    private showing: boolean = false;
    private hidePosition: Vec3 = new Vec3(0, 0, 0);
    private showPosition: Vec3 = new Vec3(0, 0, 0);
    private buildings: Building[] = [];
    private building?: Building;
    private currency: number = 0;
    private heroSlotViews: HeroHireSlotView[] = [];
    private hero?: Hero;
    private hireHeroCallbacks: ((hero: Hero, building: Building) => void)[] = [];
    private summonCompleteCallbacks: ((building: Building) => void)[] = [];

    get toggleClick$() {
        return this.toggleClickSubject.asObservable();
    }

    public init(buildingViewModel: BuildingViewModel) {
        this.hireHeroCallbacks.push((hero, building) => buildingViewModel.onHeroHire(hero, building));
        this.summonCompleteCallbacks.push(building => buildingViewModel.onSummonComplete(building));
        this.heroSlotViews = this.heroSlotsParent.getComponentsInChildren(HeroHireSlotView);
        this.heroHireButtonView.init(this.toggleClick$);
        this.heroHireButtonView.buttonClick$.subscribe(() => this.onHireButtonClick());
        buildingViewModel.buildingClick$.subscribe(buildingId => this.onTownBuildingClick(buildingId));
        buildingViewModel.buildings$.subscribe(buildings => this.onBuildingsUpdated(buildings));
        buildingViewModel.heroes$.subscribe(heroes => this.onHeroesUpdated(heroes));
        buildingViewModel.gameState$.subscribe(gameState => this.onGameStateUpdated(gameState));
        buildingViewModel.heroAddedToSlot$.subscribe(([hero, slotIdx]) => this.onHeroAddedToSlot(hero, slotIdx));
        buildingViewModel.heroStartSummoning$.subscribe(slotIdx => this.onHeroStartSummoning(slotIdx));
        const screenHeight = view.getVisibleSize().height;
        const panelHeight = this.node.getComponent(UITransform)?.height ?? 0;
        this.showPosition = new Vec3(0, -screenHeight * 0.5 + panelHeight, 0);
        this.hidePosition = new Vec3(0, -screenHeight * 0.5, 0);
        this.node.position = this.hidePosition;
    }

    private show() {
        this.showing = true;
        tween(this.node)
            .to(0.5, { position: this.showPosition }, { easing: 'backOut' })
            .start();
    }

    private hide() {
        this.showing = false;
        tween(this.node)
            .to(0.5, { position: this.hidePosition }, { easing: 'backOut' })
            .start();
    }

    private loadBuilding(building: Building) {
        this.title.string = building.name;
        this.description.string = building.description;

        /* TODO: I was using this code to instantiate dynamically but eventhough 
        everything seemed ok (positions, nodes active etc) only 1 was showing.
        For the test purpose I will preinstantiate 5 nodes.

        for (let i = 0; i < building.hireSlots; ++i) {
            let heroSlotNode = instantiate(this.heroHireSlotPrefab);
            heroSlotNode.parent = this.heroSlotsParent;            
            let heroSlotView = heroSlotNode.getComponent(HeroHireSlotView);
            if (heroSlotView) {
                this.heroSlotViews.push(heroSlotView);
            }
        }
        this.heroSlotsLayout.updateLayout(true);
        */
    }

    private updateBuilding(building: Building) {
        console.log('buildings changed VIEW', building.summoningQueue.length)
        this.building = building;
        let i = 0;
        for (; i < building.summoningQueue.length; ++i) {
            this.heroSlotViews[i].init(building.summoningQueue[i], this.heroSpriteData);
        }
        for (; i < this.heroSlotViews.length; ++i) {
            this.heroSlotViews[i].clear();
        }
        // TODO: we could probably do this on the VM to be more correct
        if (building.summoningQueue.length > 0) {
            if (!this.heroSlotViews[0].isSummoning) {
                this.onHeroStartSummoning(0);
            }
        };
    }

    private loadHeroes(heroes: Hero[]) {
        heroes.forEach(hero => {
            const heroCardNode = instantiate(this.heroCardPrefab);
            heroCardNode.parent = this.heroCardParent;
            const heroCardComponent = heroCardNode.getComponent(HeroCardView);
            heroCardComponent?.init(hero, this.heroSpriteData);
            const heroToggle = heroCardNode.getComponent(Toggle);
            if (heroToggle) {
                heroToggle.isChecked = false;
                heroToggle.node.on('toggle', (toggle: Toggle) => this.onToggleChanged(toggle, hero), this);
            }
        });
    }

    private onToggleChanged(toggle: Toggle, hero: Hero) {
        this.hero = toggle.isChecked ? hero : undefined;
        const canHire =
            this.building != null &&
            this.building.hireSlots > this.building.summoningQueue.length &&
            this.currency > hero.cost;
        this.toggleClickSubject.next([toggle.isChecked, canHire, hero.cost]);
    }

    private onBuildingsUpdated(buildings: Building[]) {
        if (buildings.length === 0) {
            return;
        }
        this.buildings = buildings;
        if (!this.building) {
            this.building = buildings[0];
            this.loadBuilding(this.building);
        } else {
            // TODO: Should find appropriate building
            this.updateBuilding(buildings[0]);
        }
    }

    private onHeroesUpdated(heroes: Hero[]) {
        this.loadHeroes(heroes);
    }

    private onGameStateUpdated(gameState: GameState) {
        this.currency = gameState.currency;
    }

    private onHeroAddedToSlot(hero: Hero, slotIdx: number) {
        const slot = this.heroSlotViews[slotIdx];
        if (hero) {
            slot.init(hero, this.heroSpriteData);
        }
    }

    private onHeroStartSummoning(slotIdx: number) {
        let subscription = this.heroSlotViews[slotIdx].summonProgress$.subscribe(() => {
            this.summonCompleteCallbacks.forEach(callback => {
                if (this.building) {
                    callback(this.building);
                }
            })
            subscription.unsubscribe();
        });
        this.heroSlotViews[slotIdx].startProgress();
    }

    private onTownBuildingClick(buildingId: string) {
        if (this.showing) {
            this.hide();
        } else {
            this.show();
        }
    }

    private onHireButtonClick() {
        // TODO: Move this logic to the VM and
        // 1. Find a slot
        // 2. Notify back to the view that it was added to the slot
        // 3. Notify back to the view if it should start progress
        // 4. When progress is done notify the VM to update the queue and update history of heroes
        // 4.1 Update should include remove from the queue and start progress on next

        this.hireHeroCallbacks.forEach(callback => {
            if (this.hero && this.building) {
                callback(this.hero, this.building);
            }
        });
    }
}
