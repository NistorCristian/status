---
title: Mobile Release Schedule
comments: false
---
Our release process: [Mobile App Release Process @ status-react](https://github.com/status-im/status-react/blob/develop/doc/decisions/0009-release-process-mobile.md)

<script src="https://cdnjs.cloudflare.com/ajax/libs/raphael/2.2.7/raphael.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/chronoline/0.1.6/chronoline.js"></script>
<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/chronoline/0.1.6/chronoline.min.css"></link>



<div style="display:block; width: 600px;" id="timesheet"></div>

<!-- EDIT RELEASES HERE -->

<script type="text/javascript">
var releases = [
    {
        dates: [new Date(2019, 2, 26)],
        title: "Release 0.11.0",
    },
    {
        dates: [new Date(2019, 3, 9)],
        title: "Release 0.12.0",
    },
    {
        dates: [new Date(2019, 3, 23)],
        title: "Release 0.13.0",
    },
    {
        dates: [new Date(2019, 4, 7)],
        title: "Release 0.14.0",
    },
];
</script>

<!-- END OF RELEASES DECLARATION -->


<script type="text/javascript">

function featureFreezeStart(releaseDate) {
    return new Date(releaseDate.getTime() - 6*24*3600*1000);
}

function formatDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var dt = date.getDate();

    if (dt < 10) {
      dt = '0' + dt;
    }
    if (month < 10) {
      month = '0' + month;
    }

    return year + "-" + month + "-" + dt;
}

function toFeatureFreeze(event) {
    var releaseDate = event.dates[0];
    var featureFreezeBeginDate = featureFreezeStart(releaseDate);
    return {
        dates: [featureFreezeBeginDate, releaseDate],
        title: event.title + " Feature Freeze",
        section: 0,
        attrs: {fill: "#FFDE00"}
    };
}


var begin = new Date();
begin.setDate(begin.getDate() - 2);

var sections = releases.map(toFeatureFreeze);

// creating the timeline
var timeline = new Chronoline(
    document.getElementById("timesheet"), 
    releases,
    { sections: sections, defaultStartDate: begin, sectionLabelsOnHover: false});

// printing out the releases
releases.forEach(function(event) {
    document.write("<h2>" + event.title + "</h2>");
    document.write("<p>Planned date: " + formatDate(event.dates[0]) + "</p>");
    document.write("<p>Feature freeze: " + formatDate(featureFreezeStart(event.dates[0])) + "</p>");
});

</script>
