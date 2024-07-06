import { _decorator, Component, Node, Vec3, tween, Widget, UITransform, view, Label, Prefab, instantiate, ToggleContainer, Toggle, game, Layout } from 'cc';
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
    private hireHeroCallBacks: ((arg: Hero) => void)[] = [];

    get toggleClick$() {
        return this.toggleClickSubject.asObservable();
    }

    public init(buildingViewModel: BuildingViewModel) {
        this.hireHeroCallBacks.push(buildingViewModel.onHeroHire)
        this.heroSlotViews = this.heroSlotsParent.getComponentsInChildren(HeroHireSlotView);
        this.heroHireButtonView.init(this.toggleClick$);
        this.heroHireButtonView.buttonClick$.subscribe(() => this.onHireButtonClick());
        buildingViewModel.buildingClick$.subscribe(buildingId => this.onTownBuildingClick(buildingId));
        buildingViewModel.buildings$.subscribe(buildings => this.onBuildingsUpdated(buildings));
        buildingViewModel.heroes$.subscribe(heroes => this.onHeroesUpdated(heroes));
        buildingViewModel.gameState$.subscribe(gameState => this.onGameStateUpdated(gameState));
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
        console.log('Toggle changed: ', toggle.isChecked, hero.id);
        this.hero = toggle.isChecked ? hero : undefined;
        const canHire =
            this.building != null &&
            this.building.hireSlots > this.building.summoningQueue.length &&
            this.currency > hero.cost;
        this.toggleClickSubject.next([toggle.isChecked, canHire, hero.cost]);
    }

    private onBuildingsUpdated(buildings: Building[]) {
        this.buildings = buildings;
        if (!this.building) {
            this.building = buildings[0];
            this.loadBuilding(this.building);
        }
    }

    private onHeroesUpdated(heroes: Hero[]) {
        this.loadHeroes(heroes);
    }

    private onGameStateUpdated(gameState: GameState) {
        this.currency = gameState.currency;
    }

    private onTownBuildingClick(buildingId: string) {
        if (this.showing) {
            this.hide();
        } else {
            this.show();
        }
    }

    private onHireButtonClick() {
        if (this.building) {
            if (this.building.summoningQueue.length == this.building.hireSlots) {
                console.error('Error queue is full');
            }
            else {
                console.log('Index: ', this.building.summoningQueue.length);
                const slotIdx = this.building.summoningQueue.length;
                const slot = this.heroSlotViews[slotIdx];
                if (this.hero) {
                    slot.init(this.hero, this.heroSpriteData);
                    this.hireHeroCallBacks.forEach(callback => {
                        if (this.hero) {
                            callback(this.hero);
                        }
                    });
                }
            }
        }
    }

    public addHireHeroCallback(callback: (arg: Hero) => void) {
        this.hireHeroCallBacks.push(callback);
    }
}
