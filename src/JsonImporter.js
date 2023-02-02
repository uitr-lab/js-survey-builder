
import {
	QParser
} from './helpers/QParser.js';

import {
	Graph
} from './Graph.js'

export class JsonImporter {


	constructor(graph) {

		this._importable=graph;

	}

	loadFromObject(object){


		if(object.SurveyEntry){

			object=(new QParser()).parse(object);

		}


		if(this._importable instanceof Graph){

			this._importable.clear();
			this._importable.setData({nodes:[object]});
			return;

		}

		this._importable.clear();
		this._importable.setData(object);

	}


}