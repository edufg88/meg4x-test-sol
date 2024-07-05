import { _decorator, Component, Node, Vec3, tween, Widget, UITransform, view } from 'cc';
import { BuildingViewModel } from '../viewModels/buildingViewModel';
const { ccclass, property } = _decorator;

@ccclass('BuildingPanelView')
export class BuildingPanelView extends Component {

    private buildingViewModel: BuildingViewModel = null!;
    private showing: boolean = false;
    private hidePosition: Vec3 = new Vec3(0, 0, 0);
    private showPosition: Vec3 = new Vec3(0, 0, 0);

    public init(buildingViewModel: BuildingViewModel) {
        buildingViewModel.buildingClick$.subscribe(buildingId => this.onTownBuildingClick(buildingId));
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

    private onTownBuildingClick(buildingId: string) {
        if (this.showing) {
            this.hide();
        } else {
            this.show();
        }
    }
}
