(function () {
    "use strict";

    var pageElement;

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            pageElement = element;

            if (!options) {
                options = { 'title': '萌', 'id': 124133 };
                WinJS.Navigation.history.current.state = options;
            }

            document.querySelector('.pagetitle').innerText = options.title;

            MoeDict.DBHelper.allAsync('SELECT * FROM heteronyms WHERE entry_id = ?', [options.id]).then(function (rows) {
                for (var i = 0, len = rows.length; i < len; i++) {
                    queryDefinition(rows[i]);
                }
            });
        }
    });

    function queryDefinition(heteronym) {
        var heteronymDiv = document.createElement('div');
        heteronymDiv.className = 'heteronymDiv';
        heteronymDiv.innerHTML = '<div><span>注音：</span><span class="bopomofo"></span></div><div><span>拼音：</span><span class="bopomofo2"></span></div>';
        heteronymDiv.querySelector('.bopomofo').innerText = heteronym.bopomofo;
        heteronymDiv.querySelector('.bopomofo2').innerText = heteronym.bopomofo2;

        var definitionDiv = document.createElement('div');
        definitionDiv.className = 'definitionDiv';

        heteronymDiv.appendChild(definitionDiv);
        pageElement.querySelector('.content').appendChild(heteronymDiv);
        pageElement.querySelector('.content').appendChild(document.createElement('hr'));

        MoeDict.DBHelper.allAsync('SELECT * FROM definitions WHERE heteronym_id = ?', [heteronym.id]).then(function (defs) {
            var defObj = {};
            for (var j = 0, lenj = defs.length; j < lenj; j++) {
                !defObj[defs[j].type] && (defObj[defs[j].type] = []);
                defObj[defs[j].type].push(defs[j]);
            }

            for (var partOfSpeech in defObj) {
                var partOfSpeechDiv = document.createElement('div');
                partOfSpeechDiv.innerHTML = '<span class="partOfSpeech"></span><ol class="orderlistClass"></ol>';
                if (partOfSpeech && partOfSpeech !== 'null') {
                    partOfSpeechDiv.querySelector('.partOfSpeech').innerText = partOfSpeech;
                } else {
                    WinJS.Utilities.addClass(partOfSpeechDiv.querySelector('.partOfSpeech'), 'displayNone');
                }

                for (var k = 0, lenk = defObj[partOfSpeech].length; k < lenk; k++) {
                    var listItem = document.createElement('li');
                    var contentArray = [];
                    defObj[partOfSpeech][k].def && (contentArray.push(defObj[partOfSpeech][k].def));
                    defObj[partOfSpeech][k].example && (contentArray.push(defObj[partOfSpeech][k].example));
                    defObj[partOfSpeech][k].quote && (contentArray.push(defObj[partOfSpeech][k].quote));
                    defObj[partOfSpeech][k].link && (contentArray.push(defObj[partOfSpeech][k].link));

                    listItem.innerHTML = contentArray.join('<br />');
                    partOfSpeechDiv.querySelector('.orderlistClass').appendChild(listItem);
                }

                definitionDiv.appendChild(partOfSpeechDiv);
            }
        });
    }
})();
