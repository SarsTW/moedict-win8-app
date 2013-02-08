// For an introduction to the Navigation template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232506
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;

    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            WinJS.UI.processAll().done(function () {
                var wordList = document.getElementById('wordList').winControl;
                var wordBindingList = new WinJS.Binding.List();
                wordList.addEventListener("iteminvoked", onWordItemInvoked, false);

                WinJS.UI.setOptions(wordList, {
                    itemTemplate: document.querySelector('.wordItemTemplate'),
                    itemDataSource: wordBindingList.dataSource,
                    layout: {
                        type: WinJS.UI.ListLayout,
                    },
                    selectionMode: 'none',
                });

                document.getElementById('searchText').addEventListener('keyup', function (eventObj) {
                    if (eventObj.key === 'Enter') {
                        for (var i = 0, len = wordBindingList.length; i < len; ++i) {
                            wordBindingList.pop();
                        }

                        if (eventObj.srcElement.value) {
                            MoeDict.DBHelper.allAsync('SELECT * FROM entries WHERE title LIKE ?', [eventObj.srcElement.value + '%']).then(function (rows) {
                                for (var i = 0, len = rows.length; i < len; i++) {
                                    wordBindingList.push(rows[i]);
                                }
                            });
                        }
                    }
                });

                MoeDict.DBHelper.allAsync('SELECT * FROM entries WHERE title LIKE ?', ['萌%']).then(function (rows) {
                    for (var i = 0, len = rows.length; i < len; i++) {
                        wordBindingList.push(rows[i]);
                    }
                });
            });

            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }
            args.setPromise(WinJS.UI.processAll().then(function () {
                if (nav.location) {
                    nav.history.current.initialPlaceholder = true;
                    return nav.navigate(nav.location, nav.state);
                } else {
                    return nav.navigate(Application.navigator.home);
                }
            }));
        }
    });

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;
    };

    app.start();

    function onWordItemInvoked(eventObject) {
        eventObject.detail.itemPromise.done(function (invokedItem) {
            if (nav.history.current.state.id !== invokedItem.data.id) {
                document.getElementById('wordList').winControl.selection.set(invokedItem);
                WinJS.Navigation.navigate("/pages/home/home.html", invokedItem.data);
            }
        });
    }

})();
