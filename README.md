# flot-plugins #
Plugins for the jQuery plotting library Flot.

## Series Annotations ##
This plugin allows you to display specific points in a flot data set, instead of displaying all points in a data series. To display a points in a plot, the seriesannotation.js file must be included and an extra boolean field must be added to each data set:

```js
[ [x1, y1, bool], [x2, y2, bool], ... ]
```

E.g.
```js
[ [1, 3, false], [2, 14.01, true], [3.5, 3.14, true] ]
```

#### Customizing Series Annotations
The following options can be configured for the series annotation plugin:

```js
seriesannotations: {
    dataIndex: number (default of 2)
    color: color (default of #00FFFF)
}
```
If a `seriesannotations` is not defined in the plot options the plugin will fallback to its default configuration values (above). The plugin will use the shape defined in the series' `points.symbol` option.

`dataIndex` is the zero-based index of the boolean flag in the dataset.

`color` is the color of the marking. This can be either an rgb or hex color specification (e.g. `rgb(255, 100, 123)` or `#000000`).
