"use strict";


function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
};

function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 50000, //< Default Max Timout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function () {
            if ((new Date().getTime() - start < maxtimeOutMillis) && !condition) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof (testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if (!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    //console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof (onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 250); //< repeat check every 250ms
};


var page = require('webpage').create();

page.settings.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:67.0) Gecko/20100101 Firefox/67.0";

// Open Twitter on 'sencha' profile and, onPageLoad, do...
page.open("http://speedtest.mybroadband.co.za/", function (status) {
    // Check for page load success
    if (status !== "success") {
        console.log("Unable to access network");
    } else {
        console.log("Waiting a bit before doing anything");
        sleep(5000);
        // Wait for 'start' to be visible
        waitFor(function () {
            // Check in the page if a specific element is now visible
            return page.evaluate(function () {
                return $("#start").is(":visible");
            });
        }, function () {
            console.log("The sign-in dialog should be visible now.");
            console.log("Clicking start test");
            page.evaluate(function () {
                $("#start").click()
            });
            sleep(5000);
            waitFor(function () {
                return page.evaluate(function () {
                    return $("#start").is(":visible");
                })
            }, function () {
                console.log("Test is done");
                var ping = page.evaluate(function () {
                    return $("#ping").children(":visible").text();
                });
                console.log(ping);
                var download = page.evaluate(function () {
                    return $("#download").children(":visible").text();
                });
                console.log(download);
                var upload = page.evaluate(function () {
                    return $("#upload").children(":visible").text();
                });
                console.log(upload);
                page.render('speedtest.png');
                phantom.exit();
            });
        });
    }
});
