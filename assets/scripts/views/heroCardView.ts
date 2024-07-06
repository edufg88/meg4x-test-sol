import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
import { HeroSpriteData } from '../heroSpriteData';
import { Hero } from '../models/hero';
const { ccclass, property } = _decorator;

@ccclass('HeroCardView')
export class HeroCardView extends Component {
    @property(Sprite)
    private heroSprite: Sprite = null!;
    @property(Sprite)
    private rankSprite: Sprite = null!;
    @property(Sprite)
    private typeSprite: Sprite = null!;

    public init(hero: Hero, heroSpriteData: HeroSpriteData) {
        this.heroSprite.spriteFrame = heroSpriteData.getHeroSpriteFrame(hero.id);
        this.rankSprite.spriteFrame = heroSpriteData.getRankSpriteFrame(hero.rank);
        this.typeSprite.spriteFrame = heroSpriteData.getTypeSpriteFrame(hero.type);
    }
}

