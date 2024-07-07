import { _decorator, Component, Node, Button } from 'cc';
import { TownSignpostViewModel } from '../viewModels/townSignpostViewModel';
const { ccclass, property } = _decorator;

@ccclass('TownSignpostPanelView')
export class TownSignpostPanelView extends Component {
    @property(Button)
    private closeButton: Button = null!;

    public init(townSignpostViewModel: TownSignpostViewModel) {
        this.closeButton.node.on(Button.EventType.CLICK, () => {
            this.togglePanel();
        })
        townSignpostViewModel.townSignpostClick$.subscribe(() => {
            this.togglePanel();
        });
    }

    private isVisible(): boolean {
        return this.node.active;
    }

    private togglePanel() {
        this.node.active = !this.isVisible();
    }
}