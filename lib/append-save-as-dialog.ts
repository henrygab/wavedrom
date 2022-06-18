
import { assert_for_review } from "./assert";

// BUGBUG -- how to get equivalent results in ESLint for Typescript?
// Something similar to: import * from "lib.dom.d.ts" ????
/* eslint-env browser */



// there can be only a single "Save As" dialog showing at one time.
let state : SaveAsDialog | null = null;

class SaveAsDialogEventHandler implements EventListenerObject{

    private constructor(readonly index: number, readonly output: string) {
    }
    // TODO: Determine if this leaks memory, if generating new WaveDrom images... 
    //       It might, if those images already take a reference to the event handler object
    //       Keeping these references here, because concerned about garbage collection
    //       free'ing the object, while the event handler is registered.
    private static handlers : SaveAsDialogEventHandler[] = [];

    public static Attach(index: number, output:string) {
        const elementId : string = output + index;
        const div = document.getElementById(elementId);
        assert_for_review(div !== null, "Unable to find element " + elementId);

        const tmp = new SaveAsDialogEventHandler(index, output);
        this.handlers.push(tmp);
        div.childNodes[0].addEventListener('contextmenu', tmp, false);
    }

    handleEvent(evt: Event): void {
        throw new Error("Method not implemented.");
        const mouseEvt : MouseEvent = evt as MouseEvent; // cannot directly define the parameter as this type?!
        if ((mouseEvt !== null)) { // a mouse event ... this is the only type handled
            if (state !== null) {
                // explicitly remove the old one (does this occur when right-click "off" the current menu?)
                state.cleanup();
                state = null; // clear old state?  should we explicitly call closeMenu?
            }
            assert_for_review(state === null);
            state = new SaveAsDialog(this.index, this.output, mouseEvt.x, mouseEvt.y);
            mouseEvt.preventDefault();
        }
    }
}
class SaveAsDialog {
    // BUGBUG -- what is the magic number 166?
    static MAGIC_NUMBER_166 = 166;

    readonly index : number;
    readonly output : string;
    readonly elementId : string;
    readonly presumedDiv : HTMLElement; // This was not guaranteed to be HTMLDivElement by prior code
    readonly menu : HTMLDivElement;
    readonly parentNode : ParentNode;
    readonly left : number;
    readonly top : number;

    public constructor(index : number, output : string, x : number, y : number) {
        const elementId = output + index;
        const presumedDiv = document.getElementById(elementId);
        assert_for_review(presumedDiv !== null);
    
        const menu = document.createElement('div');
        menu.className = 'wavedromMenu';
        menu.style.top = '' + y + 'px';
        menu.style.left = '' + x + 'px';

        const list = document.createElement('ul');
        const savePng = document.createElement('li');
        savePng.innerHTML = 'Save as PNG';
        list.appendChild(savePng);

        const saveSvg = document.createElement('li');
        saveSvg.innerHTML = 'Save as SVG';
        list.appendChild(saveSvg);
        menu.appendChild(list);

        document.body.appendChild(menu); // this gives the parent node...
        const parentNode = menu.parentNode;
        assert_for_review(parentNode !== null);

        // store all the state...
        this.index = index;
        this.output = output;
        this.elementId = elementId;
        this.presumedDiv = presumedDiv;
        this.menu = menu;
        this.parentNode = parentNode;
        this.left = x;
        this.top = y;

        // add menu-specific listeners
        savePng.addEventListener('click', clickSaveAsPng, false);
        saveSvg.addEventListener('click', clickSaveAsSvg, false);        
        menu.addEventListener('contextmenu', justPreventDefault, false);
        // add document-wide listener (to catch all mousedown events)
        document.body.addEventListener('mousedown', closeMenu, false);
    }

    public cleanup() : void {
        this.parentNode.removeChild(this.menu);
        document.body.removeEventListener('mousedown', closeMenu, false);
    }

    public isOutsideBounds(x: number, y: number): boolean {
        return (
            (x < this.left) ||
            (y < this.top)  ||
            (x > this.left + this.menu.offsetWidth) ||
            (y > this.top + this.menu.offsetHeight)
        );
    }

    public getBase64EncodedSvg() : string {
        let html = '';
        if (this.index !== 0) {
            // WaveDrom includes some information only in the first instance
            // Second and later instances refer to that data in the first instance
            // This ensures all data from MAGIC_NUMBER_166 through the start
            // of '<g id="waves_0">' is included in the SVG data, which ensures
            // the SVG data is fully self-contained.
            const firstDiv = document.getElementById(this.output + 0);
            assert_for_review(firstDiv !== null);
            html += firstDiv.innerHTML.substring(SaveAsDialog.MAGIC_NUMBER_166, firstDiv.innerHTML.indexOf('<g id="waves_0">'));
        }
        assert_for_review(this.presumedDiv !== null);
        html = [
            this.presumedDiv.innerHTML.slice(0, SaveAsDialog.MAGIC_NUMBER_166),
            html, // when not index 0, this includes items from first WaveDrom segment
            this.presumedDiv.innerHTML.slice(SaveAsDialog.MAGIC_NUMBER_166)]
            .join('');
    
        return 'data:image/svg+xml;base64,' + btoa(html);
    }

    static GlobalState : SaveAsDialog | null = null;

}

function justPreventDefault(evt: MouseEvent) : void {
    evt.preventDefault();
}
// function closeMenu(_evt: MouseEvent) : void {
function closeMenu() : void {
    // when the mouse event is NOT within the bounds of the menu, then remove the menu
    // and remove this event handler from the global document.
    assert_for_review(state !== null);
    if (state.isOutsideBounds(evt.x, evt.y)) {
        state.cleanup();
        state = null;
        // TODO: Verify it was intentional to **NOT** call _evt.preventDefault()?
    }
}
// function clickSaveAsPng(_evt: MouseEvent) : void {
function clickSaveAsPng() : void {
    assert_for_review(state !== null);

    const svgdata = state.getBase64EncodedSvg();

    // BEGIN variable part between PNG/SVG
    const img = new Image();
    img.src = svgdata;
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const context = canvas.getContext('2d');
    assert_for_review(context !== null);
    context.drawImage(img, 0, 0);

    const pngdata = canvas.toDataURL('image/png');

    const a = document.createElement('a');
    a.href = pngdata;
    a.download = 'wavedrom.png';
    // END variable part between PNG/SVG

    a.click();
    state.cleanup();
    state = null;
}
// function clickSaveAsSvg(_evt: MouseEvent) : void {
function clickSaveAsSvg() : void { 
    assert_for_review(state !== null);

    const svgdata = state.getBase64EncodedSvg();

    // BEGIN variable part between PNG/SVG
    const a = document.createElement('a');
    a.href = svgdata;
    a.download = 'wavedrom.svg';
    // END variable part between PNG/SVG

    a.click();
    state.cleanup();
    state = null;
}

function appendSaveAsDialog (index: number, output: string) {
    SaveAsDialogEventHandler.Attach(index, output);
}

module.exports = appendSaveAsDialog;

