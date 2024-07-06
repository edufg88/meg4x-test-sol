import { _decorator, Component, Node, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HeroSpriteData')
export class HeroSpriteData extends Component {
    @property(SpriteFrame)
    private heroSpriteFrames: SpriteFrame[] = [];
    @property(SpriteFrame)
    private rankSpriteFrames: SpriteFrame[] = [];
    @property(SpriteFrame)
    private typeSpriteFrames: SpriteFrame[] = [];

    public getHeroSpriteFrame(heroId: string): SpriteFrame {
        for (let spriteFrame of this.heroSpriteFrames) {
            if (spriteFrame.name.includes(heroId)) {
                return spriteFrame;
            }
        }
        console.error('Error loading hero sprite with id: ', heroId);
        return this.heroSpriteFrames[0];
    }

    public getRankSpriteFrame(rankId: string): SpriteFrame {
        for (let spriteFrame of this.rankSpriteFrames) {
            if (spriteFrame.name.includes(rankId)) {
                return spriteFrame;
            }
        }
        console.error('Error loading rank sprite with id: ', rankId);
        return this.rankSpriteFrames[0];
    }

    public getTypeSpriteFrame(typeId: string): SpriteFrame {
        for (let spriteFrame of this.typeSpriteFrames) {
            if (spriteFrame.name.includes(typeId)) {
                return spriteFrame;
            }
        }
        console.error('Error loading type sprite with id: ', typeId);
        return this.typeSpriteFrames[0];
    }
}

