var osm = new ol.layer.Tile({
	visible: true,
	title: 'OpenStreetMap',
	type: 'base',
	source: new ol.source.OSM()
});

var bingRoads = new ol.layer.Tile({
	title: 'Bing Maps—Roads',
	type: 'base',
	visible: false,
	source: new ol.source.BingMaps({
		key: 'AvAJCKT8k6JEmGXYGm1pKjBKQQV1JpzBMTnNs0DqxsLflyldbN6GpMBOZHiq7tXh',
		imagerySet: 'Road'
	})
});
var bingAerial = new ol.layer.Tile({
	title: 'Bing Maps—Aerial',
	type: 'base',
	visible: false,
	source: new ol.source.BingMaps({
		key: 'AvAJCKT8k6JEmGXYGm1pKjBKQQV1JpzBMTnNs0DqxsLflyldbN6GpMBOZHiq7tXh',
		imagerySet: 'Aerial'
	})
});
var bingAerialWithLabels = new ol.layer.Tile({
	title: 'Bing Maps—Aerial with Labels',
	type: 'base',
	visible: false,
	source: new ol.source.BingMaps({
		key: 'AvAJCKT8k6JEmGXYGm1pKjBKQQV1JpzBMTnNs0DqxsLflyldbN6GpMBOZHiq7tXh',
		imagerySet: 'AerialWithLabels'
	})
});
var stamenWatercolor = new ol.layer.Tile({
	title: 'Stamen Watercolor',
	type: 'base',
	visible: false,
	source: new ol.source.Stamen({
		layer: 'watercolor'
	})
});
var stamenTerrain = new ol.layer.Tile({
	title: 'Stamen Terrain',
	type: 'base',
	visible: false,
	source: new ol.source.Stamen({
		layer: 'terrain'
	})
});
var stamenToner = new ol.layer.Tile({
	title: 'Stamen Toner',
	type: 'base',
	visible: false,
	source: new ol.source.Stamen({
		layer: 'toner'
})
});

/* Step (1) Layers */
var GHS_final = new ol.layer.Image({
	title: 'GHS_intercomp_int',
	source: new ol.source.ImageWMS({
		url: 'http://localhost:8080/geoserver/wms',
		params: {'LAYERS': 'GIS_secondCall:ghs_intercomp_final'}
	})
});
var WPop_final = new ol.layer.Image({
	title: 'WorldPop_intercomp_int',
	visible: false,
	source: new ol.source.ImageWMS({
		url: 'http://localhost:8080/geoserver/wms',
		params: {'LAYERS': 'GIS_secondCall:worldpop_intercomp_final'}
	})
});

/* Map of differences */

var difference_3Scenarios_int = new ol.layer.Image({
	title: 'Different_Scenarios',
	source: new ol.source.ImageWMS({
		url: 'http://localhost:8080/geoserver/wms',
		params: {'LAYERS': 'GIS_secondCall:diff_3_Scenarios_int'}
	}),
	opacity: 1
});

var map = new ol.Map({
	target: document.getElementById('map'),
	layers: [
	new ol.layer.Group({
		title: 'Base Maps',
		layers: [stamenToner, stamenWatercolor, stamenTerrain, bingAerialWithLabels, bingAerial, bingRoads, osm]
	}),
	new ol.layer.Group({
		title: 'Intercomparison Layers',
		layers: [WPop_final, GHS_final, difference_3Scenarios_int]
	}),
	/* 
	new ol.layer.Group({
		title: 'Validation Layers',
		layers: [ difference_3Scenarios_int, GHS_Reclassify_int, WPop_Reclassify_int, Sampled_ClassifiedMerged, scenariosWFS]
	}) */
	],
	view: new ol.View({
		center: ol.proj.fromLonLat([-75, -8]),
		zoom: 2
	}),

	controls: ol.control.defaults().extend([
		new ol.control.ScaleLine(),
		new ol.control.FullScreen(),
		new ol.control.OverviewMap(), /*{
			layers:[
			new ol.layer.Tile({
				source: new ol.source.OSM()
			    })
			]
		}), */
		new ol.control.MousePosition({
			coordinateFormat: ol.coordinate.createStringXY(4),
			projection: 'EPSG:4326'
		})
	])
});

var layerSwitcher = new ol.control.LayerSwitcher({});
map.addControl(layerSwitcher);


//popup

var elementPopup = document.getElementById('popup');
var popup = new ol.Overlay({
	element:elementPopup
});
map.addOverlay(popup); 

/* Drag Box */

var dragBox = new ol.interaction.DragBox({})


dragBox.on('boxstart', function(event){
	console.log('Box event started!');
})

/* zoom to box extent at the end of the drag */
dragBox.on('boxend', function(event){
	console.log('box ended!');
	map.getView().fit(dragBox.getGeometry().getExtent() , map.getSize());
})

//map.addInteraction(dragBox)



/* Drag & Drop Interaction */

var dragSource = new ol.source.Vector()

var dragLayer = new ol.layer.Vector({
	source:dragSource
})

map.addLayer(dragLayer)
var dragnDrop = new ol.interaction.DragAndDrop({
	formatConstructors:[ol.format.GeoJSON],
	source:dragSource
})

dragnDrop.on('addFeatures', function(event){
	console.log('added new feature')
})
//map.addInteraction(dragnDrop);

// Draw interaction

var drawSource = new ol.source.Vector()

var drawLayer = new ol.layer.Vector({
	source:drawSource
})

var draw = new ol.interaction.Draw({
	source:drawSource,
	type:'Polygon',
	minPoints: 3,
	//freehand: true
})

draw.on('drawEnd', function(event){
	drawSource.clear()
})
map.addInteraction(draw)