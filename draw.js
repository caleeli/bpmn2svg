var page = new WebPage()
var fs = require('fs');
var system = require('system');
var args = system.args;

function getFileUrl(str) {
    var pathName = fs.absolute(str).replace(/\\/g, '/');
    // Windows drive letter must be prefixed with a slash
    if (pathName[0] !== "/") {
        pathName = "/" + pathName;
    }
    return encodeURI("file://" + pathName);
};

var path = args[1];
if (!path) {
    console.log("An input bpmn file is required. Ex.");
    console.log("phantomjs " + args[0] + " process.bpmn > process.svg");
    phantom.exit();
}

var xml = fs.read(path, "utf8");

page.onCallback = function (data) {
    console.log(data);
    phantom.exit();
};

page.open(getFileUrl("draw.html"), function () {
    var title = page.evaluate(function (xml) {
        window.viewer.importXML(xml, function (err) {
            if (err) {
                window.callPhantom('error rendering');
            } else {
                var div = document.createElement("div");
                var diagram = document.getElementsByTagName("svg")[0];
                diagram.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                div.appendChild(diagram);
                var svg = div.innerHTML;
                window.callPhantom(svg);
            }
        });
        return document.body.innerHTML;
    }, xml);

});
