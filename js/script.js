/*
    Author: Sam Deering 2012
    Copyright: jquery4u.com
    Licence: MIT.
*/
(function($)
{

    $(document).ready(function()
    {

        //loading image for ajax request
        var $loading = $('#galoading');
        $.ajaxSetup(
        {
            start: function()
            {
                $loading.show();
            },
            complete: function()
            {
                $loading.hide();
            }
        });

        $.getJSON('data.php', function(data)
        {
            // console.log(data);
            if (data)
            {
                $('#results').show();

                //raw data
                $('#gadata').html(JSON.stringify(data));

                //mini graph
                var miniGraphData = new Array();
                $.each(data, function(i,v)
                {
                     miniGraphData.push([v["visits"], v["pageviews"]]);
                });
                // console.log(miniGraphData);
                $('#minigraph').sparkline(miniGraphData, { type: 'bar' });

                //get graph data
                var xAxisLabels = new Array(),
                    dPageviews = new Array(),
                    dVisits = new Array();
                $.each(data, function(i,v)
                {
                     xAxisLabels.push(v["date_day"]+'/'+v["date_month"]+'/'+v["date_year"]);
                     dPageviews.push(parseInt(v["pageviews"]));
                     dVisits.push(parseInt(v["visits"]));
                });
                console.log(xAxisLabels);
                console.log(dPageviews);
                console.log(dVisits);

                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'graph',
                        type: 'line',
                        marginRight: 130,
                        marginBottom: 25
                    },
                    title: {
                        text: 'jQuery4u Blog Traffic Stats',
                        x: -20 //center
                    },
                    subtitle: {
                        text: 'Source: Google Analytics API',
                        x: -20
                    },
                    xAxis: {
                        categories: xAxisLabels
                    },
                    yAxis: {
                        title: {
                            text: 'Pageviews'
                        },
                        plotLines: [{
                            value: 0,
                            width: 5,
                            color: '#FF4A0B'
                        }]
                    },
                    tooltip: {
                        formatter: function() {
                                return '<b>'+ this.series.name +'</b><br/>'+
                                this.x +': '+ this.y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +' pageviews';
                        }
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        x: -10,
                        y: 100,
                        borderWidth: 0
                    },
                    series: [
                    {
                        name: 'pageviews',
                        data: dPageviews
                    },
                    {
                        name: 'visits',
                        data: dVisits
                    }]
                });


            }
            else
            {
                $('#results').html('error?!?!').show();
            }
        });

    });

})(jQuery);



/* Author: Sam Deering 2012
*/


     // function appendResults(text) {
     //    var results = document.getElementById('results');
     //    results.appendChild(document.createElement('P'));
     //    results.appendChild(document.createTextNode(text));
     //  }

     //  function makeRequest() {
     //    var request = gapi.client.urlshortener.url.get({
     //      'shortUrl': 'http://goo.gl/fbsS'
     //    });
     //    request.execute(function(response) {
     //      appendResults(response.longUrl);
     //    });
     //  }

     //  function load() {
     //    gapi.client.setApiKey('AIzaSyDYRLMz_pLJLb5iwMS8ogmJjTmug7JdEFI');
     //    gapi.client.load('urlshortener', 'v1', makeRequest);
     //  }
