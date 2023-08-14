var survey=JSON.parse(localStorage.getItem('formData'))


var names={};
var finished=[];

const readNames=(node)=>{

    if(node.uuid){
        if(finished.indexOf(node.uuid)>=0){
            return;
        }
        finished.push(node.uuid);
    }

    (node.nodes||[]).forEach((child)=>{
        readNames(child);
    });

    (node.items||[]).forEach((block)=>{
    
       if(block.nodes){
         
       }

       if(block.items){
        
            readNames(block);
            return;

       }

       if(block.fieldName&&block.label){
        var name=block.fieldName;

        // incase variable contains template variable

        name.split('{').join('_').split('}').join('_');
        names[block.fieldName]=block.label;
       }
    });

}

readNames(survey);
console.log(JSON.stringify(names, null, '   '));