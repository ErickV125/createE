const ConfigOptions = {//alguans fallas de ortografia 
	Parent: (Element) => {
		if (!Element.element) {
			return;
		}
		let Parent = Element.ElementConfigObject.Parent;
		if (Parent instanceof CreateE) {
			Parent = Parent.element;
		} else if (typeof Parent === "string") {
			Parent = document.getElementById(Parent);
		}
		Parent.appendChild(Element.element);

	},
	ClassList: (Element) => {
		const Classes = Element.ElementConfigObject.ClassList;
		const ActualType = ErrorManager({ typeOfValue: { expectedTypes: { 'array': true, 'string': true }, catch: Classes }, FunctionError: 'ConfigOptions > ClassList() "Type of value Error"' })
		if (!ActualType.validation) {
			return;
		}
		if (Array.isArray(Classes)) {
			Classes.forEach(function (e) {
				Element.element.classList.add(e);
			});
		} else {
			Element.element.classList.add(Classes)
		}

	},
	PropertyList: (Element) => {
		const Properties = Element.ElementConfigObject.PropertyList;
		const ActualType = ErrorManager({ typeOfValue: { expectedTypes: { 'object': true, 'string': true }, catch: Properties }, FunctionError: 'ConfigOptions > PropetyList() "Type of value Error" ' })
		if (!ActualType.validation) {
			return;
		}
		if (Properties instanceof Object) {
			for (let Propety in Properties) {
				Element.element.setAttribute(Propety, Properties[Propety]);
			}
		}
	},

	EventList: (Element) => { //mejorar eventos 
		let eventList = Element.ElementConfigObject.EventList;
		const ActualType = ErrorManager({ typeOfValue: { expectedTypes: { 'object': true }, catch: eventList }, FunctionError: 'ConfigOptions > EventList() "Type of value Error" ' })
		if (!ActualType.validation) {
			return;
		}
		for (let event in eventList) {
			Element.element.addEventListener(event, eventList[event]);
		}
	},



	Children: (Element) => {

		const Children = Element.ElementConfigObject.Children;
		if (!ErrorManager({ typeOfValue: { expectedTypes: { 'array': true, 'node': true, }, catch: Children }, FunctionError: 'ConfigOptions > Children() "Type of value Error"' })) {
			return;
		}
		if (Children instanceof Array) {
			Children.forEach(function (child) {
				if (child instanceof CreateE) {
					child.ElementConfigObject.Parent = Element;
					child.create();
				} else if (child instanceof Node) {
					Element.element.append(child);
				}
			});
		} else {
			Element.element.append(Children)
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
	static  allElements = []; 
	static components = {//mejorable
		"card": "card",
		"button": "button",
		"input": "input",
		"img": "img",
		"titleBox": "titleBox"
	};
	constructor(ElementTag, ComponentName, ElementConfigObject = { ClassList: ["Example-class"], PropertyList: { Propety: 'value' }, EventList: { Event: () => { } }, Parent: Node, Children: [] }) {
		this.ElementTag = ElementTag.toLowerCase();
		this.ComponentName = ComponentName;
		this.ElementConfigObject = ElementConfigObject;
		this.element = document.createElement(this.ElementTag);
		this.internalId = CreateE.id;
		CreateE.id++;
		CreateE.allElements.push(this);
	}
	create() {
		if (this.ComponentName in CreateE.components) {
			if (!Array.isArray(this.ElementConfigObject.ClassList)) {
				this.ElementConfigObject.ClassList = [];
			}
			this.ElementConfigObject.ClassList.unshift(this.ComponentName);
		}
		for (let config in this.ElementConfigObject) {
			if (Object.hasOwn(this.ElementConfigObject, config) && config in ConfigOptions) {
				ConfigOptions[config](this);
			}
		}

	}
	add(NewConfig) {
		//falta re hacer este código, tiene muchas responsabilidades...
		//if(Object.hasOwn(this.ElementConfigObject,config)){}
		for (let config in NewConfig) {
			if (!(config in this.ElementConfigObject)) {
				this.ElementConfigObject[config] = (Array.isArray(NewConfig[config])) ? [] : {};
			}
			if (Array.isArray(this.ElementConfigObject[config])) {
				NewConfig[config].forEach((ValueOfConfig) => {
					if (!this.ElementConfigObject[config].find((element) => element === ValueOfConfig)) {
						this.ElementConfigObject[config].push(ValueOfConfig)
					}
				})
			} else if (typeof this.ElementConfigObject[config] === "object") {
				for (let ValueOfConfig in NewConfig[config]) {
					this.ElementConfigObject[config][ValueOfConfig] = NewConfig[config][ValueOfConfig]
				}
			} else if (typeof this.ElementConfigObject[config] === "string") {
				this.ElementConfigObject[config] = NewConfig[config];
			}
			if (Object.prototype.hasOwnProperty.call(this.ElementConfigObject, config) && config in ConfigOptions) {
				ConfigOptions[config](this);

			}
		}
	}
	update(ReConfigurationObject, IsReplace) {
		//Remplazara o cambiara los valores existntes de ElementConfigObject por ReConfigurationObject.
		//si IsReplace es falso, solo cambiaran valores, y si hay valores extra, los añadirá 
		let ECO = this.ElementConfigObject
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
		for (let config in this.ElementConfigObject) {
			if (config in ConfigOptions) {
				ConfigOptions[config](this);
			}
		}
	}
}
function GetType(type) {
	if (Array.isArray(type)) return 'array';
	if (type === null) return 'null'
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