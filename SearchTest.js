/** 
@NApiVersion 2.0
@NScriptType UserEventScript
@NModuleScope Public
*/

define(['N/log', 'N/search'], function (log, search) {
    function beforeSubmit() {
        var name = 'Cade Weiskopf';
        var email = 'cweiskopf@thisiscsg.com';
        var phone = '(804) 767-0999';
        phone = phone.replace(/\D/g, '');

        var mySearch = search.create({
            type: 'contact',
            filters: [
                ['entityid', 'is', 'Cade Weiskopf']
            ],
            columns: [
                search.createColumn({name: 'entityid', label: 'entityid'}),
                search.createColumn({name: 'email', label: 'email'}),
                search.createColumn({name: 'phone', label: 'phone'}),
                search.createColumn({name: 'internalid', label: 'internalid'})
            ]
        });

        var results = mySearch.run().getRange({
            start: 0,
            end: 1000
        });

        var isDuplicate = true;
        if (results.length == 0) {
            isDuplicate = false;
        } else {
            var existingContactId;
            for (var i = 0; i < results.length; i++) {
                isDuplicate = true;
                
                results[i].columns.forEach(function (col) {
                    // compare column values

                    log.debug({
                        title: 'search result ' + i,
                        details: col.name + '=' + results[i].getValue(col)
                    });
    
                    if (col.name.indexOf('entityid') > -1) {
                        if (results[i].getValue(col) != name) {
                            isDuplicate = false;
                        }
                    } else if (col.name.indexOf('email') > -1) {
                        if (results[i].getValue(col) != email) {
                            isDuplicate = false;
                        }
                    } else if (col.name.indexOf('phone') > -1) {
                        var testPhone = results[i].getValue(col).replace(/\D/g, '');
                        if (testPhone != phone) {
                            isDuplicate = false;
                        }
                    } else if (col.name.indexOf('internalid') > -1) {
                        if (isDuplicate) {
                            existingContactId = results[i].getValue(col);
                        }
                    }
                });

                if (isDuplicate) {
                    break;
                }
            }

            log.debug({
                title: 'Existing Contact ID',
                details: '=' + existingContactId
            });
        }
    }

    return {
        beforeSubmit: beforeSubmit
    }
});