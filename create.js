const setOptions = { //alguans fallas de ortografia 
	Parent: (Element) => {
		if (!Element.node) return;
		
		let Parent = Element.options.Parent;
		if (Parent instanceof CreateE) {
			Parent = Parent.node;
		} else if (typeof Parent === "string") {
			Parent = document.getElementById(Parent);
		}
		Parent.appendChild(Element.node);
		
	},
	
	ClassList: (Element) => {
		const Classes = Element.options.ClassList;
		const ActualType = ErrorManager({ typeOfValue: { expectedTypes: { 'array': true, 'string': true }, catch: Classes }, FunctionError: 'setOptions > ClassList() "Type of value Error"' })
		if (!ActualType.validation) return;
		
		console.log(Classes)
		if (Array.isArray(Classes)) {
			Classes.forEach((e) => {
				console.log(e)
				Element.node.classList.add(e);
			});
		} else {
			Element.node.classList.add(Classes)
		}
	},
	
	Styles: (Element) => {
		const ActualType = ErrorManager({ typeOfValue: { expectedTypes: { 'object': true }, catch: Element.options.Styles }, FunctionError: 'setOptions > Styles() "Type of value Error" ' })
		if (!ActualType.validation) return;
		
		const styles = Element.options.Styles;
		for (let s in Element.options.Styles) {
			Element.node.style[s] = styles[s]
		}
	},
	PropertyList: (Element) => {
		const Properties = Element.options.PropertyList;
		const ActualType = ErrorManager({ typeOfValue: { expectedTypes: { 'object': true, 'string': true }, catch: Properties }, FunctionError: 'setOptions > PropetyList() "Type of value Error" ' })
		if (!ActualType.validation) {
			return;
		}
		if (Properties instanceof Object) {
			for (let property in Properties) {
				Element.node.setAttribute(property, Properties[property]);
			}
		}
	},
	FromTemplate: (Element) => {
		const Properties = Element.options.FromTemplate;
		const ActualType = ErrorManager({ typeOfValue: { expectedTypes: { 'string': true }, catch: Properties }, FunctionError: 'setOptions > FromTemplate() "Type of value Error" ' })
		const isAScriptTag = /<\s*script\b[^>]*>([\s\S]*?)<\s*\/\s*script\s*>/gi;
		if (!ActualType.validation || isAScriptTag.test(Properties)) {
			return;
		}
		//const cleanHTML = DOMPurify.sanitize(Properties)
		let cleanHTML = Properties
		const template = document.createElement('template');
		template.innerHTML = cleanHTML;
		Element.node.appendChild(template.content.cloneNode(true))
	},
	
	EventList: (Element) => { //mejorar eventos 
		let eventList = Element.options.EventList;
		const ActualType = ErrorManager({ typeOfValue: { expectedTypes: { 'object': true }, catch: eventList }, FunctionError: 'setOptions > EventList() "Type of value Error" ' })
		if (!ActualType.validation) return;
		
		for (let event in eventList) {
			Element.node.addEventListener(event, eventList[event]);
		}
	},
	
	Children: (Element) => {
		
		const Children = Element.options.Children;
		if (!ErrorManager({ typeOfValue: { expectedTypes: { 'array': true, 'node': true, }, catch: Children }, FunctionError: 'setOptions > Children() "Type of value Error"' })) {
			return;
		}
		if (Children instanceof Array) {
			Children.forEach(function(child) {
				if (child instanceof CreateE) {
					child.options.Parent = Element;
					child.create();
				} else if (child instanceof Node) {
					Element.node.append(child);
				}
			});
		} else {
			Element.node.append(Children)
		}
	},
	
}
/**
 * @param {String} ElementTag
 * @param {String} ComponentName
 * @param {Object} typeOfValue - contiene el tipo de valor esperado, el valor recibido
 * @param {Object<String,Object>} PropertyList - Lista de propiedades del elemento (puede ser objeto o string)
 * @param {Object<String,Object>} EventList - Lista de eventos del objeto (puede ser array o string)
 * @param {Object<String,Array>} ClassList - Clase del elemento (puede ser array o string)
 * @param {Object<Node>} Parent - Padre del elemento
 * @param {Object<Array>} Children - Hijos del elemento (Array)
 */
class CreateE { //Estudiar getters y setters y aplicar. estudiar la mutabilidad y aplicar
	static id = 1
	static allElements = [];
	static components = { //mejorable
		"card": "card",
		"button": "button",
		"input": "input",
		"img": "img",
		"titleBox": "titleBox"
	};
	ElementTag
	constructor(ElementTag, ComponentName, ElementConfigObject = { ClassList: ["Example-class"], PropertyList: { Propety: 'value' }, EventList: { Event: () => {} }, Parent: Node, Children: [] }) {
		this.tag = ElementTag.toLowerCase();
		this.name = ComponentName;
		this.options = ElementConfigObject;
		this.node = document.createElement(this.tag);
		this.internalId = CreateE.id;
		CreateE.id++;
		CreateE.allElements.push(this);
	}
	create() {
		if (this.name in CreateE.components) {
			if (!Array.isArray(this.options.ClassList)) {
				this.options.ClassList = [];
			}
			this.options.ClassList.unshift(this.name);
		}
		for (let config in this.options) {
			if (Object.hasOwn(this.options, config) && config in setOptions) {
				setOptions[config](this);
			}
		}
		
	}
	add(NewConfig) {
		//falta re hacer este código, tiene muchas responsabilidades...
		//if(Object.hasOwn(this.ElementConfigObject,config)){}
		for (let config in NewConfig) {
			if (!(config in this.options)) {
				this.options[config] = (Array.isArray(NewConfig[config])) ? [] : {};
			}
			if (Array.isArray(this.options[config])) {
				NewConfig[config].forEach((ValueOfConfig) => {
					if (!this.options[config].find((element) => element === ValueOfConfig)) {
						this.options[config].push(ValueOfConfig)
					}
				})
			} else if (typeof this.options[config] === "object") {
				for (let ValueOfConfig in NewConfig[config]) {
					this.options[config][ValueOfConfig] = NewConfig[config][ValueOfConfig]
				}
			} else if (typeof this.options[config] === "string") {
				this.options[config] = NewConfig[config];
			}
			if (Object.prototype.hasOwnProperty.call(this.options, config) && config in setOptions) {
				setOptions[config](this);
				
			}
		}
	}
	update(ReConfigurationObject, IsReplace) {
		//Remplazara o cambiara los valores existntes de ElementConfigObject por ReConfigurationObject.
		//si IsReplace es falso, solo cambiaran valores, y si hay valores extra, los añadirá 
		let ECO = this.options
		if (IsReplace) {
			Replace(ReConfigurationObject)
		} else {
			ReUpdate(ReConfigurationObject)
		}
		
		function Replace(RCO) {
			ECO = structuredClone(RCO)
		}
		
		function ReUpdate(RCO) {
			for (let key in RCO) {
				
				if (!(Object.prototype.hasOwnProperty.call(ECO, key))) { ECO = RCO[key]; continue; }
				//tres casos posibles; array, objeto o string
				if (GetType(ECO[key]) === "array") {
					//en este caso, de momento por simplicidad remplazare el array
					ECO[key] = RCO[key]
				} else if (GetType(ECO[key]) === "string") {
					//tambien se remplazara los tipo sting
					ECO[key] = RCO[key]
				} else if (GetType(ECO[key]) === "object") {
					//en esta seccion llega lo mas complejo: buscar las keys que ya existen y remplazar su value
					// si no existe la key, se crea y se asigna
					for (let ObjKys in RCO[key]) {
						ECO[key][ObjKys] = RCO[key][ObjKys]
					}
					
				} else { console.error(`Error en valores de configuración para clave "${key}", tipo: ${GetType(this.ElementConfigObject[key])}`); }
			}
		}
		for (let config in this.options) {
			if (config in setOptions) {
				setOptions[config](this);
			}
		}
	}
}

function GetType(type) {
	if (Array.isArray(type)) return 'array';
	if (type === null) return 'null';
	if (type === undefined) return 'undefined';
	return typeof type;
}
/**
 * @param {{typeOfValue:{expectedTypes:{type:true},catch:value} - FunctionError:string}} ErrorObject - objeto configuracion de parametros 
 * @param {Object} typeOfValue - contiene el tipo de valor esperado, el valor recibido
 * @param {Object} FunctionError - nombre de la funcion del error
 * @param {Object<string,boolean>} expectedTypes - tipo de valor esperado 
 * @param {Object} catch - valor recibido 
 * @returns {{validation:boolean, type:'string'}}
 */
function ErrorManager(ErrorObject) {
	const expectedTypes = ErrorObject.typeOfValue.expectedTypes;
	let actualType = GetType(ErrorObject.typeOfValue.catch);
	if (actualType in expectedTypes) {
		return { validation: true, type: actualType };
	}
	console.error(`\n❌ Tipo incorrecto en función: ${ErrorObject.FunctionError}
    ➡️ Tipos esperados: ${Object.keys(expectedTypes).join("  / ")}
    ❗ Tipo recibido: ${actualType}
    🔎 Valor:`, ErrorObject.typeOfValue.catch);
	return { validation: false, type: actualType };
				  }
