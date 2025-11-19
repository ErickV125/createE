function menu(parent,arrayTexts,arrayListenersFuncs) {
    const UILista = new CreateE("div", "UI-lista", {
        ClassList: ["UI-lista"],
        Parent: parent,
        Children: [],
    });
    arrayTexts.forEach((t, i) => {
        let child = new CreateE("div", "", {
            Children: [
                
            ],
            
            Parent: UILista
        }).create()
        setTimeout(()=>{
            child.node.classList.add('start_transition_entrance')
            new CreateE("div", "", {ClassList: "block",Parent:child}).create()
            new CreateE("p", "",{autoGenWords: {
                string: t,
                time: 370 * (i+1)
            },Parent:child}).create()
            
        },(i+1) * 250)
    })
    UILista.create();
}
menu(document.body,['Iniciar','Ajustes','Salir'])