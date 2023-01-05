export class ContentBlock{


	constructor(container, data){

		this._element=container.appendChild(new Element('section', {
			"class":"content-item"
		}));

		this._data=data;

	}


	getData(){


		var data={};
		
		Object.keys(this._data).forEach((k)=>{
			data[k]=this._data[k]
		});

		data .items;
		

		return data;


	}


}