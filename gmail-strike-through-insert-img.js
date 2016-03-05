// Gmail Strikethrough button
// Copyright, benleevolk, 2013
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
// ==UserScript==
// @name           Gmail Strikethrough+insertImg Button
// @namespace      http://userscripts.org/scripts/show/57725
// @description    Adds strikethrough button and insert image button to Gmail rich text editor
// @include        http://mail.google.com/*
// @include        https://mail.google.com/*
// @grant          none
// ==/UserScript==
var gmailStrikeThroughButton = {
    // underlineButton: null,
    underlineButtons: null,
    imageButtons: null,
    activeButtonClassName: null,
    canvas_frame_document: null,
    text_editor: null,
    compose_method: '',
    button_exist: false,
    getIcon: function() {
        var icon = "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAngAAAJ4BIsvGAwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAHXSURBVEiJtdVLiI5hFAfw3zNjMoZJmEykmJAi7CzIekSiaDYWFqMsWJAFZcPGxsbCzjQlpawkJVnayMotJSXXhYXbQtE0HIvv+/R5v+e9KE79e2//5/zPOc95zpsiQpmllDZgCza1sREDeI1XeInpiHhS6iQieoARXEE0wE9cxeqsr4zzhXjY0Hk33mO0icDlCicf8bni+x2kUgGMYbaw6A0OYriLtwgnMZMR2VklcCCzYH+utm3+iQz/XDenr7DnyzJ98DzzrmOX2ll029Y/ngoR7S6p69qKLDZgPVZhKYaqSrRcq+1yG3gPR7CkTKxpm14sEehgBrdwCCN1Aql4klNKw5jC3Irad2wWd3E9It7mCAmDONa+/kv7jgsw6e9PbVNMpoiQUtrxPzKIiNs9e9DEUkr92IbTWJmh7IqIF+hp0wVYg+2YwIrKFmQIN/SWZk9Pm2Jzhnimts8Zz6w7lRsVj/GhkOpESmlOTcVy7fzt910hmmuZaM5XRD+odcKLa8bLRsW+DDlwU2tTF6NPa6TsxYMM9x0GqkbFdIlIBz9qvh+tm0Xz8KjGSRmmaoddW2QYZ/G1oeMvOI7+2mHXbSmlURzGOq3f6Rjm4xmeduF+RHzK+fgFbwOrO8xWLLUAAAAASUVORK5CYII=";
        return icon;
    },
    getInsertImgIcon: function() {
        var icon = "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAKWQAAClkBA3pzHgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAHSSURBVEiJ7dXfa45hGAfwzz3248CrtralpZRoDlaWIweKcOZA8h8YIUYp7QxlB+KAA07WUlqSOPUHUJTyY45oalLUiJr2ZqjtdvBeb56t931RdqLddfXcXc91fb/f+7qu57lTztlSrqYlRV8m+CcEKaVVKaXdKaXOgq8zpbQzpdT2W4acc13DZXxDxhwehs2F7wsuNcRoAL4dEziENRjA07ABrMVQEPX/FQFWYAcu4jjawt+M5tiXsBfjuP7HBGjF/VD2Jp6P0F6I6QjgO3iCm7hQJa9JEA3vxW2UsR9XcRCfcLIQewXT2IXvOIG3uBUYTQsIMBigOewwWvA8wI/hboHgI26E+tdYjQOF/DIGq7+hoZiKYfSjD63xshfv8Tkam8J+4Eg0vKdQ2r7AGA7MIZjEWINp6sK9UDaOo3iMa+hokDeGyaZQNKv+KoeIfXiHzXiAPfjaIG82sI1iqnrUGkrOB8m6gm+TSnPP1cnpU+ndKHRHnadwSmX+e9COrSpf8ukaIGdD5TZswHpswRl8CMzuYp1H8Arzfk1DxgusrEHQgpeLYucDYwRdOWdp8Y2WUiqFkpLKOE7knKdrFTml1I6NUYUZPMs5zyyIWb4y/3+Cn3hilj6+mS2wAAAAAElFTkSuQmCC";
        return icon;
    },
    getActiveButtonClassName: function() {
        this.activeButtonClassName = "J-Z-I-Jp";
    },
    setStrikeThrough: function() {
        gmailStrikeThroughButton.text_editor.execCommand("strikethrough", false, '');
        gmailStrikeThroughButton.checkForStrikes();
    },
    insertImg: function() {
        text = window.getSelection()
            // gmailStrikeThroughButton.text_editor.execCommand("insertImage", false, text);
        img = "<img width='60%'' height='auto' _moz_dirty='' src='" + text + "' style='margin-right: 0px;'>";
        gmailStrikeThroughButton.text_editor.execCommand("insertHtml", false, img);
    },
    addButton: function() {
        for (i = this.underlineButtons.snapshotLength - 1; i >= 0; i--) {
            console.log("in addButton", i);
            var underlineButton = this.underlineButtons.snapshotItem(i);
            // check if strike button already exist before adding
            if (underlineButton.nextSibling.getAttribute('command') === "+strikethrough") return
            var strikethroughButton = underlineButton.cloneNode(true);
            // strikethroughButton.setAttribute("title", "Strikethrough");
            strikethroughButton.setAttribute("data-tooltip", "Strikethrough");
            strikethroughButton.setAttribute("command", "+strikethrough");
            strikethroughButton.setAttribute("id", "strikethroughbutton");
            var bgImage = strikethroughButton.firstChild.firstChild.firstChild;
            bgImage.style.backgroundImage = "url(data:image/png;base64," + gmailStrikeThroughButton.getIcon() + ")";
            bgImage.style.backgroundRepeat = "no-repeat";
            bgImage.style.backgroundPosition = "4px 4px";
            // the actual attribute name is background-size
            bgImage.style.backgroundSize = "12px 12px";
            // on hidpi screen, there is a aaB attribute which will override the icon with a B
            bgImage.setAttribute("class", "fu aaA");
            strikethroughButton.addEventListener("click", gmailStrikeThroughButton.setStrikeThrough, false);
            underlineButton.parentNode.insertBefore(strikethroughButton, underlineButton.nextSibling);
        }
    },
    addImgButton: function() {
        // this.underlineButtonList
        console.log("in addImgButton");
        console.log(this.imageButtons);
        for (i = this.imageButtons.snapshotLength - 1; i >= 0; i--) {
            var imageButton = this.imageButtons.snapshotItem(i);
            // check if strike button already exist before adding
            if (imageButton.nextSibling.getAttribute('command') === "+image") return
            var insertImgButton = imageButton.cloneNode(true);
            console.log(insertImgButton)
            //insertImgButton.setAttribute("title", "Insert Image");
            insertImgButton.setAttribute("data-tooltip", "Insert Image Inline");
            insertImgButton.setAttribute("command", "+image");
            insertImgButton.setAttribute("id", "insertimgbutton");
            var bgImage = insertImgButton.firstChild.firstChild.firstChild;
            bgImage.style.backgroundImage = "url(data:image/png;base64," + gmailStrikeThroughButton.getInsertImgIcon() + ")";
            bgImage.style.backgroundRepeat = "no-repeat";
            bgImage.style.backgroundPosition = "0px 0px";
            // the actual attribute name is background-size
            bgImage.style.backgroundSize = "20px 20px";
            // on hidpi screen, there is a aaB attribute which will override the icon with a B
            bgImage.setAttribute("class", "fu aaA");
            insertImgButton.addEventListener("mousedown", gmailStrikeThroughButton.insertImg, false);
            imageButton.parentNode.insertBefore(insertImgButton, imageButton.nextSibling);
        }
    },
    checkForStrikes: function(e) {
        var classRegEx = new RegExp(" " + gmailStrikeThroughButton.activeButtonClassName, "g");
        // how to detect if the underlineButtons is in the window we clicked
        for (i = gmailStrikeThroughButton.underlineButtons.snapshotLength - 1; i >= 0; i--) {
            strikethroughButton = gmailStrikeThroughButton.underlineButtons.snapshotItem(i).nextSibling;
            compose_table = strikethroughButton.closest(".iN");
            if (!compose_table.contains(e.target)) {
                continue;
            }
            if (gmailStrikeThroughButton.text_editor.queryCommandState("strikethrough")) {
                if (!strikethroughButton.className.match(classRegEx)) {
                    strikethroughButton.className += " " + gmailStrikeThroughButton.activeButtonClassName; // add active state
                }
            } else {
                strikethroughButton.className = strikethroughButton.className.replace(classRegEx, ""); // remove active state
            }
        }
    },
    bindTextEditorEvents: function() {
        // gmailStrikeThroughButton.text_editor.addEventListener("click", gmailStrikeThroughButton.checkForStrikes, false);
        // gmailStrikeThroughButton.text_editor.addEventListener("keyup", gmailStrikeThroughButton.checkForStrikes, false);
        console.log('in bindTextEditorEvents:', i)
        gmailStrikeThroughButton.text_editor.addEventListener("click", function(e) {
            gmailStrikeThroughButton.checkForStrikes(e);
        }, false);
    },
    detectComponents: function(e) {
        var composing = false;
        var fix_width = false;
        var is_firefox = (navigator.userAgent.indexOf('Firefox') != -1);
        var is_chrome = (navigator.userAgent.indexOf('Chrome') != -1);
        if (e != null) {
            // old compose
            if (e.target.nodeName == 'IFRAME' && e.target.className.indexOf('editable') != -1) {
                // console.log("old firefox!");
                gmailStrikeThroughButton.compose_method = 'old';
                composing = true;
                gmailStrikeThroughButton.text_editor = e.target.contentDocument;
                gmailStrikeThroughButton.canvas_frame_document = e.target.ownerDocument;
                // new compose - firefox
            } else if (e.target.nodeName == 'IFRAME' && e.target.parentNode.className.indexOf('editable') != -1 && is_firefox) {
                // console.log("new firefox!");
                composing = true;
                fix_width = true;
                gmailStrikeThroughButton.compose_method = 'new_firefox';
                gmailStrikeThroughButton.text_editor = e.target.contentDocument;
                gmailStrikeThroughButton.canvas_frame_document = e.target.ownerDocument;
                // new compose - chrome
            } else if (e.target.innerHTML && e.target.innerHTML.indexOf('+underline') != -1 &&
                /*e.target.innerHTML.indexOf('+justifyLeft')==-1 */
                true && is_chrome) {
                // console.log("new_chrome 1");
                composing = true;
                fix_width = true;
                gmailStrikeThroughButton.compose_method = 'new_chrome';
                gmailStrikeThroughButton.text_editor = e.target.ownerDocument;
                gmailStrikeThroughButton.canvas_frame_document = e.target.ownerDocument;
            }
        } else if (e == null) {
            // console.log("new_chrome 2");
            composing = true;
            gmailStrikeThroughButton.compose_method = 'new_chrome';
            gmailStrikeThroughButton.text_editor = document;
            gmailStrikeThroughButton.canvas_frame_document = document;
        }
        if (composing) {
            // document.evaluate("//div[@command='+underline']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
            var xPathResult = gmailStrikeThroughButton.canvas_frame_document.evaluate("//div[@command='+underline']", gmailStrikeThroughButton.canvas_frame_document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
            var img_xPathResult = gmailStrikeThroughButton.canvas_frame_document.evaluate("//div[@command='image']", gmailStrikeThroughButton.canvas_frame_document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
            // if (gmailStrikeThroughButton.underlineButton = xPathResult.snapshotItem(0)) { // =!
            if (gmailStrikeThroughButton.underlineButtons = xPathResult) {
                gmailStrikeThroughButton.getActiveButtonClassName();
                gmailStrikeThroughButton.addButton();
                setTimeout(gmailStrikeThroughButton.bindTextEditorEvents);
            }
            if (gmailStrikeThroughButton.imageButtons = img_xPathResult) {
                gmailStrikeThroughButton.addImgButton();
            }
        }
    },
    init: function() {
        if (document.body.innerHTML.indexOf("+underline") != -1) {
            gmailStrikeThroughButton.detectComponents(null);
        }
        window.addEventListener("click", function() {
            // check if button exists already
            var underline_btn = document.querySelectorAll("div[command='+underline']");
            var strike_btn = document.querySelectorAll("div[command='+strikethrough']");
            // only add button if they don't exist
            if (underline_btn.length && strike_btn.length != underline_btn.length) {
                gmailStrikeThroughButton.detectComponents();
                console.log("yeah add!");
            }
        }, false);
    }
}
gmailStrikeThroughButton.init();
document.onreadystatechange = function() {
    if (document.readyState == "interactive") {
        alert("Ready!");
        gmailStrikeThroughButton.init();
    }
}