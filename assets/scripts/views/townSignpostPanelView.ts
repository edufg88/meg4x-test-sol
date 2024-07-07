import { _decorator, Component, Node, Button, Prefab, instantiate } from 'cc';
import { HeroSpriteData } from '../heroSpriteData';
import { Hero } from '../models/hero';
import { TownSignpostViewModel } from '../viewModels/townSignpostViewModel';
import { SummonedHeroCardView } from './summonedHeroCardView';
const { ccclass, property } = _decorator;

@ccclass('TownSignpostPanelView')
export class TownSignpostPanelView extends Component {
    @property(Button)
    private closeButton: Button = null!;
    @property(Prefab)
    private summonedHeroCardPrefab: Prefab = null!;
    @property(Node)
    private summonedHeroesParent: Node = null!;
    @property(HeroSpriteData)
    private heroSpriteData: HeroSpriteData = null!;

    private summonedHeroCardViews: SummonedHeroCardView[] = [];

    public init(townSignpostViewModel: TownSignpostViewModel) {
        this.closeButton.node.on(Button.EventType.CLICK, () => {
            this.togglePanel();
        })
        townSignpostViewModel.townSignpostClick$.subscribe(() => {
            this.togglePanel();
        });
        townSignpostViewModel.summonedHeroesChange$.subscribe(heroes => this.updateHeroes(heroes));
    }

    private isVisible(): boolean {
        return this.node.active;
    }

    private togglePanel() {
        this.node.active = !this.isVisible();
    }

    private updateHeroes(heroes: Hero[]) {
        if (heroes.length > this.summonedHeroCardViews.length) {
            for (let i = this.summonedHeroCardViews.length; i < heroes.length; ++i) {
                let heroCard = instantiate(this.summonedHeroCardPrefab);
                heroCard.parent = this.summonedHeroesParent;
                let heroCardView = heroCard.getComponent(SummonedHeroCardView);
                if (heroCardView) {
                    heroCardView.init(heroes[i], this.heroSpriteData);
                    this.summonedHeroCardViews.push(heroCardView);
                }
            }
        }
    }
}