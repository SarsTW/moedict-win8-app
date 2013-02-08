(function () {
    "use strict";

    var dbHandle;

    var DBHelper = WinJS.Class.define(
            function DBHelper(element, options) {
                SQLite3JS.openAsync('dict-revised.sqlite3').then(function (db) {
                    dbHandle = db;
                });

                //MoeDict.DBHelper = this;
            }, {
                allAsync: function (sql, args) {
                    return dbHandle.allAsync(sql, args);
                },
            }
        );

    WinJS.Namespace.define("MoeDict", {
        DBHelper: new DBHelper(),
    });
})();
