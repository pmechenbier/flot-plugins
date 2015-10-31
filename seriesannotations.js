/*
  Flot plugin for marking specific points.
  Copyright (c) 2015 Patrick Mechenbier.
  Licensed under the MIT license.
*/

(function ($) {
    var options = {
        seriesannotations: {
            dataIndex: 3, // the position in the data array where the true/false is that tells the series annotation to draw
            color: "#00FFFF"
        }
    };

    function init(plot) {

        function drawAnnotations(plot, ctx, series) {
            var options = plot.getOptions();
            var plotOffset = plot.getPlotOffset();

            drawSeriesPoints(series);

            function drawSeriesPoints(series) {
                function plotPoints(data, datapoints, radius, fillStyle, offset, shadow, axisx, axisy, symbol) {
                    var points = datapoints.points, ps = datapoints.pointsize, drawPoint = false;

                    for (var i = 0; i < points.length; i += ps) {
                        var x = points[i], y = points[i + 1], drawPoint = false;
                        if (x == null || x < axisx.min || x > axisx.max || y < axisy.min || y > axisy.max) {
                            continue;
                        }
                        
                        for (var j = 0; j < data.length; ++j) {
                            if (data[j][0] === x) {
                                if (data[j][options.seriesannotations.dataIndex] === true) {
                                    drawPoint = true;
                                    break;
                                }
                            }
                        }

                        if (drawPoint) {
                            ctx.beginPath();
                            x = axisx.p2c(x);
                            y = axisy.p2c(y) + offset;
                            if (symbol == "circle")
                                ctx.arc(x, y, radius, 0, shadow ? Math.PI : Math.PI * 2, false);
                            else
                                symbol(ctx, x, y, radius, shadow);
                            ctx.closePath();

                            if (fillStyle) {
                                ctx.fillStyle = fillStyle;
                                ctx.fill();
                            }
                            ctx.stroke();
                        }
                    }
                }

                ctx.save();
                ctx.translate(plotOffset.left, plotOffset.top);

                var radius = series.points.radius,
                    symbol = series.points.symbol;

                ctx.strokeStyle = options.seriesannotations.color === null ? series.color : options.seriesannotations.color;
                var c = options.seriesannotations.color === null ? getFillStyle(series.points, series.color) : options.seriesannotations.color;
                plotPoints(series.data, series.datapoints, radius,
                           c, 0, false,
                           series.xaxis, series.yaxis, symbol);
                ctx.restore();
            }

            function getFillStyle(filloptions, seriesColor, bottom, top) {
                var fill = filloptions.fill;
                if (!fill)
                    return null;

                if (filloptions.fillColor)
                    return getColorOrGradient(filloptions.fillColor, bottom, top, seriesColor);

                var c = $.color.parse(seriesColor);
                c.a = typeof fill == "number" ? fill : 0.4;
                c.normalize();
                return c.toString();
            }
            function getColorOrGradient(spec, bottom, top, defaultColor) {
                if (typeof spec == "string")
                    return spec;
                else {
                    // assume this is a gradient spec; IE currently only
                    // supports a simple vertical gradient properly, so that's
                    // what we support too
                    var gradient = ctx.createLinearGradient(0, top, 0, bottom);

                    for (var i = 0, l = spec.colors.length; i < l; ++i) {
                        var c = spec.colors[i];
                        if (typeof c != "string") {
                            var co = $.color.parse(defaultColor);
                            if (c.brightness != null)
                                co = co.scale('rgb', c.brightness);
                            if (c.opacity != null)
                                co.a *= c.opacity;
                            c = co.toString();
                        }
                        gradient.addColorStop(i / (l - 1), c);
                    }

                    return gradient;
                }
            }
        }

        plot.hooks.drawSeries.push(function (plot, canvascontext, series) {
            drawAnnotations(plot, canvascontext, series);
        });
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'seriesannotation',
        version: '1.0'
    });
})(jQuery);
