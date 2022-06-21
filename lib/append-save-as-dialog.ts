
import { assert, assert_for_review } from "./assert";

/* eslint-env browser */

// there can be only a single "Save As" dialog showing at one time.

// `appendSaveAsDialog(index, output)` simply adds an event listener
// for `contextmenu` (e.g., mouse right-click) events.

// That `contextmenu` listener does the hard work, every time
// there is a right-click event:
//
// 1. creates a popup menu (`div`) element 
// 2. sets `div` properties: {
//    className = 'wavedromMenu',
//    style.top = e.y.toString() +'px',
//    style.left = e.x.toString() + 'px',
//    }
// 3. creates unordered list (`ul`) with list items (`li`)
//    for both "Save as PNG" and "Save as SVG"
// 4. appends the unordered list to the 'div' element
// 5. appends the popup menu 'div' element to 'document.body'
// 6. adds event listener for 'click' to "Save as PNG" element
// 7. adds event listener for 'click' to "Save as SVG" element
// 8. adds event listener for 'contextMenu' to 'div' element which simply calls 'evt.preventDefault()'
// 9. adds event listener to 'document.body' for 'mousedown', which calls 'closeMenu'
// 10. calls 'evt.preventDefault()', so right-click isn't handled elsewhere

// What the listener for "Save as PNG" element does:
// 1. magic to get Base64-encoded SVG data
// 2. use `Image` and `document.createElement('canvas')` to draw the SVG as an image
// 3. use `canvas.toDataURL('image/png')` to create a URI for the image
// 4. create an '<a href=' link element with that URI
// 5. call `a.click()` on that URI to initiate the download of the SVG
// 6. remove the menu 'div' element from 'document.body'
// 7. remove the event listener 'closeMenu' for 'mousedown' event from 'document.body'

// What the listener for "Save as SVG" element does:
// 1. magic to get Base64-encoded SVG data
// 2. create an '<a href=' link element with Base64-encoded SVG data
// 3. ... nothing ... just for parity with save as png ...
// 4. ... nothing ... just for parity with save as png ...
// 5. call `a.click()` on that URI to initiate the download of the SVG
// 6. remove the menu 'div' element from 'document.body'
// 7. remove the event listener 'closeMenu' for 'mousedown' event from 'document.body'

// What closeMenu(evt) does:
// essentially, it cleans up when a click/touch is NOT on the newly-generated pop-up menu
// 1. Presumes evt has properties { x : number, y : number }
// 2. Gets the menu 'div' element's left/top (as number)
// 3. Gets the menu 'div' element's offsetWidth and offsetHeight (as number)
// 3. If evt.x not within menu 'div', return without doing anything
// 4. if evt.y not within menu 'div', return without doing anything
// 5. ... nothing ... just for parity with save as png / save as svg ...
// 6. remove the menu 'div' element from 'document.body'
// 7. remove the event listener 'closeMenu' for 'mousedown' event from 'document.body'

// BUGBUG -- what is the magic number 166?
const MAGIC_NUMBER_166 = 166;

export function appendSaveAsDialog(index: number, output: string) {

    // menu will be created and destroyed dynamically
    let   menu : HTMLDivElement | null = null;
    const presumedDiv = document.getElementById(output + index.toString());
    assert_for_review(presumedDiv !== null, "appendSaveAsDialog() could not find the requested element");

    // use arrow functions, to give access to the enclosing
    // scope's instance variables.
    // (e.g., access to parameters index, output, and
    //        to local variables 'menu' and 'div')

    // function to unconditionally remove menu
    const removeMenu = () : void => {
        if (null === menu) { return; }
        if (null === presumedDiv ) { return; }
        menu.parentNode?.removeChild(menu);
        document.body.removeEventListener('mousedown', closeMenu, false);
        menu = null;
    }
    const closeMenu = (evt : MouseEvent) : void => {
        if (null === menu)         { return; }
        if (null === presumedDiv ) { return; }
        const left = parseInt(menu.style.left, 10);
        const top  = parseInt(menu.style.top,  10);
        if ((evt.x < left) ||
            (evt.y < top ) ||
            (evt.x > (left + menu.offsetWidth)) ||
            (evt.y > (top  + menu.offsetHeight)) ) {
            // mousedown event occured outside the popup menu,
            // so remove the context menu
            removeMenu();
        }
    }
    
    // Gets stand-alone SVG data for the wavedrom object
    const getBase64EncodedSvg = () : string => {
        let html = '';
        if (index !== 0) {
            // WaveDrom includes some information only in the first instance
            // Second and later instances refer to that data in the first instance
            // This ensures all data from MAGIC_NUMBER_166 through the start
            // of '<g id="waves_0">' is included in the SVG data, which ensures
            // the SVG data is fully self-contained.
            const firstDiv = document.getElementById(output + '0');
            assert_for_review(firstDiv !== null, 'Code presumes element with id "${output}0" exists');
            html += firstDiv.innerHTML.substring(MAGIC_NUMBER_166, firstDiv.innerHTML.indexOf('<g id="waves_0">'));
        }
        assert_for_review(presumedDiv !== null);
        html = [
            presumedDiv.innerHTML.slice(0, MAGIC_NUMBER_166),
            html, // when not index 0, this includes items from first WaveDrom segment
            presumedDiv.innerHTML.slice(MAGIC_NUMBER_166)]
            .join('');
        return 'data:image/svg+xml;base64,' + btoa(html);
    }
    const saveAsPngHandler = (evt : MouseEvent) : void => {
        assert(evt !== null, 'SaveAsPngHandler -- parameter was null?!');
        const svgdata = getBase64EncodedSvg();
    
        // BEGIN variable part between PNG/SVG
        const img = new Image();
        img.src = svgdata;
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext('2d');
        assert_for_review(context !== null, "Support for 2D canvas context is required, but returned NULL?");
        context.drawImage(img, 0, 0);
        const pngdata = canvas.toDataURL('image/png');
    
        const a = document.createElement('a');
        a.href = pngdata;
        a.download = 'wavedrom.png';
        // END variable part between PNG/SVG
    
        a.click();
        removeMenu();
    }
    const saveAsSvgHandler = (evt : MouseEvent) : void => {
        assert(evt !== null, 'SaveAsPngHandler -- parameter was null?!');
        const svgdata = getBase64EncodedSvg();

        // BEGIN variable part between PNG/SVG
        const a = document.createElement('a');
        a.href = svgdata;
        a.download = 'wavedrom.svg';
        // END variable part between PNG/SVG
    
        a.click();
        removeMenu();
    }

    const contextMenuHandler = (evt : MouseEvent) => {
        menu = document.createElement('div');
        menu.className    = 'wavedromMenu';
        menu.style.top    = evt.x.toString() + 'px';
        menu.style.left   = evt.y.toString() + 'px';
        const list        = document.createElement('ul');
        const savePNG     = document.createElement('li');
        const saveSVG     = document.createElement('li');
        savePNG.innerHTML = 'Save as PNG'
        saveSVG.innerHTML = 'Save as SVG';
        list.appendChild(savePNG);
        list.appendChild(saveSVG);
        menu.appendChild(list);
        document.body.appendChild(menu);

        savePNG.addEventListener('click', saveAsPngHandler, false);
        saveSVG.addEventListener('click', saveAsSvgHandler, false);
        menu.addEventListener('contextmenu', evt => evt.preventDefault(), false);
        document.body.addEventListener('mousedown', closeMenu, false);
        evt.preventDefault();
    }

    const firstChild = presumedDiv.childNodes[0];
    assert_for_review(
        firstChild instanceof HTMLElement,
        "div.childNodes[0] expected to be instance of HTMLElement, was ${firstChild.nodeName}"
        );
    firstChild.addEventListener('contextmenu', contextMenuHandler, false);
}

/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
module.exports = appendSaveAsDialog;

