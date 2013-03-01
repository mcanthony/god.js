/**
 * Created with JetBrains WebStorm.
 * User: Will
 * Date: 3/1/13
 * Time: 10:57 AM
 * To change this template use File | Settings | File Templates.
 */

function Religion(religionName, scriptureLocation, iconLocation) {
    this.name = religionName;
    this.scriptureLocation = scriptureLocation;
    this.scripture = new Object({
        text : undefined,
        script : undefined
    });
    this.iconLocation = iconLocation;
    this.active = false;

    this.fetchScripture = function() {
        /* Loads scripture from this.scriptureLocation into this.scriptureText as a string, then calls the interpreter
         * and the loading script.
         *
         * Right now this uses one of my (Will Brand's) servers, beatrixruf.com, as a proxy, to avoid cross-domain
         * sandboxing issues.
         */

        if(this.scriptureText == undefined || this.scriptureText == "") {
            var fuckYouScopeIssuesThisIsTheReligion = this
            $.ajax({url: "".concat("http://beatrixruf.com/fetch.php?script=", this.scriptureLocation),
                success: function(data) {
                    fuckYouScopeIssuesThisIsTheReligion.scripture.text = data;
                    fuckYouScopeIssuesThisIsTheReligion.interpretScripture();
                    fuckYouScopeIssuesThisIsTheReligion.load(); },
                complete: function(data) {
                    console.log(data);
                }
            })
        }
    }

    this.interpretScripture = function () {
        if(this.scripture.text == undefined || this.scripture.text == "") {
            this.fetchScripture();
        }
        else {
            this.scripture.script = interpretScripture(this.scripture.text);
            return this.scripture.script;
        }
    }

    this.load = function () {
        if(this.scripture.script == undefined || this.scripture.script == "") {
            this.fetchScripture();
        }
        else {
            /*
                I have no idea why, but it seems like this doesn't create functions within the eval'd code. Maybe
                just run it twice? TODO: Something less stupid.
             */
            chrome.tabs.executeScript(null,
                                        {code:this.scripture.script});
        }
    }

    this.unload = function() {

    }
}