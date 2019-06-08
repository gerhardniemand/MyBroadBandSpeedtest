var casper = require('casper').create();

var webpage = "http://speedtest.mybroadband.co.za";

casper.start(webpage);
casper.userAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:67.0) Gecko/20100101 Firefox/67.0");
casper.options.waitTimeout = 600000;

casper.then(function (){
    console.log("Waiting a bit before doing anything");
    casper.wait(2000, function () {
        console.log("Done waiting");
    })
});

casper.then(function () {
   console.log("Clicking the button");
   casper.waitUntilVisible("#start", function (){
    casper.click("#start");
    casper.wait(10000, function() {
        console.log("Waiting for the test to complete");
    })
   });
});

casper.then(function() {
   casper.waitUntilVisible("#start", function() {
     console.log("Looks like the test is done. Extracting results");
   });
});

casper.then(function() {
    var mbpsRegex = /\S+(?=Mbps)/;
    var msRegex = /\S+(?=ms)/;

    var downloadString = casper.getElementInfo("#download").text;
    var uploadString = casper.getElementInfo("#upload").text;
    var pingString = casper.getElementInfo("#ping").text;

    var download = mbpsRegex.exec(downloadString);
    var upload = mbpsRegex.exec(uploadString);
    var ping = msRegex.exec(pingString);

    console.log("Download Speed: " + download + "Mbps");
    console.log("Upload Speed: " + upload + "Mbps");
    console.log("Ping: " + ping + "ms");
    console.log("Done");
});

casper.run();