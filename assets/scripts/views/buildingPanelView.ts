import { _decorator, Component, Node, Vec3, tween, Widget, UITransform, view, Label, Prefab, instantiate } from 'cc';
import { HeroSpriteData } from '../heroSpriteData';
import { Building } from '../models/building';
import { Hero } from '../models/hero';
import { BuildingViewModel } from '../viewModels/buildingViewModel';
import { HeroCardView } from './heroCardView';
const { ccclass, property } = _decorator;

@ccclass('BuildingPanelView')
export class BuildingPanelView extends Component {

    @property(Label)
    private title: Label = null!;
    @property(Label)
    private description: Label = null!;
    @property(Node)
    private heroCardParent: Node = null!;
    @property(Prefab)
    private heroCardPrefab: Prefab = null!;
    @property(HeroSpriteData)
    private heroSpriteData: HeroSpriteData = null!;

    private showing: boolean = false;
    private hidePosition: Vec3 = new Vec3(0, 0, 0);
    private showPosition: Vec3 = new Vec3(0, 0, 0);
    private buildings: Building[] = [];
    private currentBuildingId: string = '';

    public init(buildingViewModel: BuildingViewModel) {
        buildingViewModel.buildingClick$.subscribe(buildingId => this.onTownBuildingClick(buildingId));
        buildingViewModel.buildings$.subscribe(buildings => this.onBuildingsUpdated(buildings));
        buildingViewModel.heroes$.subscribe(heroes => this.onHeroesUpdated(heroes));
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
        // TODO: Load rest of things
    }

    private loadHeroes(heroes: Hero[]) {
        heroes.forEach(hero => {
            const heroCardNode = instantiate(this.heroCardPrefab);
            heroCardNode.parent = this.heroCardParent;
            const heroCardComponent = heroCardNode.getComponent(HeroCardView);
            heroCardComponent?.init(hero, this.heroSpriteData);
        });
    }

    private onBuildingsUpdated(buildings: Building[]) {
        this.buildings = buildings;
        if (this.currentBuildingId === '') {
            this.loadBuilding(buildings[0]);
        }
    }

    private onHeroesUpdated(heroes: Hero[]) {
        this.loadHeroes(heroes);
    }

    private onTownBuildingClick(buildingId: string) {
        if (this.showing) {
            this.hide();
        } else {
            this.show();
        }
    }
}
