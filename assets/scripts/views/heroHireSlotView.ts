import { _decorator, Component, Node, Sprite, ProgressBar, tween, Tween } from 'cc';
import { Subject } from 'rxjs';
import { HeroSpriteData } from '../heroSpriteData';
import { Hero } from '../models/hero';
const { ccclass, property } = _decorator;

@ccclass('HeroHireSlotView')
export class HeroHireSlotView extends Component {
    @property(Sprite)
    private heroSprite: Sprite = null!;
    @property(Sprite)
    private rankSprite: Sprite = null!;
    @property(Sprite)
    private typeSprite: Sprite = null!;
    @property(ProgressBar)
    private progressBar: ProgressBar = null!;

    private summonProgressSubject = new Subject<void>();
    private hero?: Hero;
    private summoning: boolean = false;

    get isSummoning() {
        return this.summoning;
    }

    get summonProgress$() {
        return this.summonProgressSubject.asObservable();
    }

    private enableElements(enable: boolean) {
        this.heroSprite.node.active = enable;
        this.rankSprite.node.active = enable;
        this.typeSprite.node.active = enable;
        this.progressBar.node.active = enable;
        this.progressBar.progress = 0;
    }

    public init(hero: Hero, heroSpriteData: HeroSpriteData) {
        if (hero === this.hero) {
            console.log('Already initialized with hero: ', hero.id);
            return;
        }
        this.enableElements(true);
        this.heroSprite.spriteFrame = heroSpriteData.getHeroSpriteFrame(hero.id);
        this.rankSprite.spriteFrame = heroSpriteData.getRankSpriteFrame(hero.rank);
        this.typeSprite.spriteFrame = heroSpriteData.getTypeSpriteFrame(hero.type);
        this.progressBar.progress = 0;
        this.hero = hero;
    }

    public clear() {
        this.enableElements(false);
    }

    public startProgress() {
        this.summoning = true;
        Tween.stopAllByTarget(this.progressBar);
        this.progressBar.progress = 0;
        if (this.hero) {
            tween(this.progressBar)
                .to(this.hero.summonCooldown, { progress: 1 })
                .call(() => this.onSummonComplete())
                .start();
        }
    }

    private onSummonComplete() {
        this.summoning = false;
        this.summonProgressSubject.next();        
    }
}
