
import {
	QParser
} from './helpers/QParser.js';


export class JsonImporter {


	constructor(graph) {

		this._importable=graph;

	}

	loadFromObject(object){


		if(object.SurveyEntry){

			object=(new QParser()).parse(object);

		}


		this._importable.clear();
		this._importable.setData({nodes:[object]});

	}


}