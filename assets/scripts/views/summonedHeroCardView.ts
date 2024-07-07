import { _decorator, Component, Node, Label } from 'cc';
import { HeroSpriteData } from '../heroSpriteData';
import { Hero } from '../models/hero';
import { HeroCardView } from './heroCardView';
const { ccclass, property } = _decorator;

@ccclass('SummonedHeroCardView')
export class SummonedHeroCardView extends Component {
    @property(HeroCardView)
    private heroCardView: HeroCardView = null!;
    @property(Label)
    private heroName: Label = null!;
    @property(Label)
    private heroDescription: Label = null!;
    @property(Label)
    private heroRank: Label = null!;
    @property(Label)
    private heroCost: Label = null!;
    @property(Label)
    private heroType: Label = null!;
    @property(Label)
    private heroSummonTime: Label = null!;

    public init(hero: Hero, heroSpriteData: HeroSpriteData) {
        this.heroCardView.init(hero, heroSpriteData);
        this.heroName.string = hero.name;
        this.heroDescription.string = hero.description;
        this.heroRank.string = hero.rank;
        this.heroCost.string = hero.cost.toString();
        this.heroType.string = hero.type;
        this.heroSummonTime.string = hero.summonCooldown.toString();
    }
}

