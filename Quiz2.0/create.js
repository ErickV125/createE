
let effect = null;
const followers = new Map();

function reactive(obj) {
	return new Proxy(obj, {
		get(target, prop) {
			if (effect) {
				if (!followers.has(prop)) { followers.set(prop, new Set()) }
				followers.get(prop).add(effect)
			}
			return target[prop]
		},
		set(target, prop, value) {
			target[prop] = value
			if (followers.has(prop)) {
				followers.get(prop).forEach(fn => fn())
			}
			return true
		}
	})
}
//Módulo de Drag and Drop
//Módulo de Lazy Loading Generalizado
//Módulo de Validación de Formularios
//Módulo de Animaciones
/**
* Módulo de Estado Local (Local State Management)
*	Propósito: Permitir que cada instancia de CreateE tenga un estado local 
*r	eactivo para gestionar datos específicos del componente, como formularios o contadores.
* Módulo de Internacionalización (i18n)
*	Propósito: Permitir que los elementos soporten múltiples idiomas, 
*	con traducción dinámica basada en un idioma seleccionado.
 */
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

		if (Array.isArray(Classes)) {
			Classes.forEach((e) => {
				
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
	React: (Element) => {
		const Properties = Element.options.React;
		const ActualType = ErrorManager({ typeOfValue: { expectedTypes: { 'function': true }, catch: Properties }, FunctionError: 'setOptions > PropetyList() "Type of value Error" ' })
		if (!ActualType.validation) {
			return;
		}
		effect = Properties;
		effect();
		effect = null;
	},
	FromTemplate: (Element) => {
		const Properties = Element.options.FromTemplate;
		const ActualType = ErrorManager({ typeOfValue: { expectedTypes: { 'string': true }, catch: Properties }, FunctionError: 'setOptions > FromTemplate() "Type of value Error" ' })
		const isAScriptTag = /<\s*script\b[^>]*>([\s\S]*?)<\s*\/\s*script\s*>/gi;
		if (!ActualType.validation || isAScriptTag.test(Properties)) {
			return;
		}
		const cleanHTML = DOMPurify.sanitize(Properties); //<script src="https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js"></script>
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
			Children.forEach(function (child) {
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
	autoGenWords:(Element) =>{
		const Properties = Element.options.autoGenWords;
		const ActualType = ErrorManager({ typeOfValue: { expectedTypes: { 'object': true }, catch: Properties }, FunctionError: 'setOptions > FromTemplate() "Type of value Error" ' })
		if (!ActualType.validation) {
			return;
		}
		const inInterval = Properties.time / Properties.string.length/1000;
		let i = 0
		let cad = ''
		const interval = setInterval(function(){
			Element.node.textContent='';
			cad+=Properties.string[i]  
			Element.node.textContent = cad + Properties.string[0]
			i++
			if(i == Properties.string.length){
				Element.node.textContent = cad;
				clearInterval(interval);
			}
		},inInterval)
	}
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
	static reactiveValues = reactive({})
	constructor(ElementTag, ComponentName, options = { ClassList: ["Example-class"], PropertyList: { Propety: 'value' }, EventList: { Event: () => { } }, Parent: Node, Children: [] }) {
		this.tag = ElementTag.toLowerCase();
		this.name = ComponentName;
		this.options = options;
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
		return this
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
const logs = true
function ErrorManager(ErrorObject) {

	const expectedTypes = ErrorObject.typeOfValue.expectedTypes;
	let actualType = GetType(ErrorObject.typeOfValue.catch);
	if (actualType in expectedTypes) {
		return { validation: true, type: actualType };
	}
	if (logs) {
		console.error(`\n❌ Tipo incorrecto en función: ${ErrorObject.FunctionError}
    	➡️ Tipos esperados: ${Object.keys(expectedTypes).join("  / ")}
    	❗ Tipo recibido: ${actualType}
    	🔎 Valor:`, ErrorObject.typeOfValue.catch);
	}
	return { validation: false, type: actualType };
}



/**
 *	StateManager
	Propósito: Gestionar el estado global de la aplicación, permitiendo compartir datos reactivos entre múltiples instancias de CreateE y otros componentes.
	Funcionalidad sugerida:
	Crear una clase que gestione un almacén de estado reactivo basado en el sistema reactive (usando Proxy) ya implementado en CreateE.
	Métodos para:
	setState(key, value): Actualizar el estado global.
	getState(key): Obtener valores del estado.
	subscribe(key, callback): Suscribir componentes a cambios en claves específicas.
	Sincronización automática con instancias de CreateE que usen CreateE.reactiveValues. 

	Router
	Propósito: Implementar un sistema de enrutamiento para aplicaciones de página única (SPA), permitiendo navegar entre vistas sin recargar la página.
	Funcionalidad sugerida:
	Gestionar rutas basadas en la URL (usando window.location o la API History).
	Métodos para:
	defineRoute(path, component): Asocia una ruta a una instancia de CreateE o una función que renderiza elementos.
	navigate(path): Cambia la ruta actual.
	getCurrentRoute(): Obtiene la ruta activa.
	Soporte para parámetros dinámicos (por ejemplo, /user/:id) y rutas anidadas.

	ComponentFactory
	Propósito: Simplificar la creación y gestión de componentes reutilizables, permitiendo definir plantillas de componentes con configuraciones predefinidas.
	Funcionalidad sugerida:

	Métodos para:

	defineComponent(name, config): Registra un componente con una configuración base.
	createComponent(name, overrides): Crea una instancia de CreateE basada en un componente registrado, con opciones sobrescritas.


	Almacenar componentes en un registro global (extensión de CreateE.components).


 */


