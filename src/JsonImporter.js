
export class JsonImporter {


	constructor(graph) {

		this._importable=graph;

	}

	loadFromObject(object){

		this._importable.clear();
		this._importable.setData({nodes:[object]});

	}


}