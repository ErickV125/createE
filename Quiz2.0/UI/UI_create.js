

const configQuestion = {

    title: (Data, instance) => {
        const title = Data;
        const ActualType = ErrorManager({ typeOfValue: { expectedTypes: { 'string': true }, catch: title }, FunctionError: 'configQuestion > title() "Type of value Error"' })
        if (!ActualType.validation) return;

        let num = new CreateE('h3', '', {
        });
        num.node.textContent = `${instance.id}`
        let NumQuestionDiv = new CreateE('div', '', {
            ClassList: ['num-question'],
            Children: [num]
        });
        let text = new CreateE('h3', '', {
        });
        text.node.textContent = title
        let titleDiv = new CreateE('div', '', {
            ClassList: ['title-question'],
            Children: [NumQuestionDiv, text],
            Parent: instance.ObjCreate
        });
        titleDiv.create();
        setTimeout(() => {
            titleDiv.node.classList.add('start_transition_entrance')
        }, 300 * instance.id)
    },
    codingText: (Data) => { },
    img: (Data, instance) => {
        const img = Data;
        const ActualType = ErrorManager({ typeOfValue: { expectedTypes: { 'string': true, 'array': true }, catch: img }, FunctionError: 'configQuestion > title() "Type of value Error"' })
        if (!ActualType.validation) return;
        let img_container = new CreateE('div', '', {
            ClassList: ['img-container'],
            Parent: instance.ObjCreate
        }).create();
        let img1 = undefined
        if (Data instanceof Array) {
            if (Data.length) {
                new CreateE('div', '', {
                    ClassList: ['btn', 'left'],
                    Parent: img_container
                }).create();
                new CreateE('div', '', {
                    ClassList: ['btn', 'right'],
                    Parent: img_container
                }).create();
            }
            img.forEach((src) => {
                let img1 = new CreateE('img', '', {
                    ClassList: ['img'],
                    PropertyList: { src: src },
                    Parent: img_container
                }).create();
            })
        } else {
            let img1 = new CreateE('img', '', {
                ClassList: ['img'],
                PropertyList: { src: Data },
                Parent: img_container
            }).create();
        }
        setTimeout(() => {
            img_container.node.classList.add('start_transition_entrance')
        }, 350)
    },
    table: (Data, instance) => {
        const tableData = Data;
        const ActualType = ErrorManager({ typeOfValue: { expectedTypes: { 'string': true, 'array': true }, catch: tableData }, FunctionError: 'configSummary > table() "Type of value Error"' })
        if (!ActualType.validation) return;
        const divSectionTable = new CreateE('div', '', {
            ClassList: ['divSectionTable'],
            Parent: instance.ObjCreate
        }).create();
        const table = new CreateE('table', '', {
            ClassList: ['table'],
            Parent: divSectionTable
        }).create();
        const tableBody = new CreateE('tbody', '', {
            ClassList: ['tableBody'],
            Parent: table
        }).create();
        tableData.forEach(row => {
            const tr = new CreateE('tr', '', {
                Parent: tableBody
            }).create();
            row.forEach(Text => {
                const td = new CreateE('td', '', {
                    Parent: tr
                }).create();
                const p = new CreateE('p', '', {
                    Parent: td
                }).create();
                p.node.textContent = Text
            })
        })
    },
    options: (Data, instance) => {
        const img = Data;
        const ActualType = ErrorManager({ typeOfValue: { expectedTypes: { 'object': true }, catch: img }, FunctionError: 'configQuestion > title() "Type of value Error"' })
        if (!ActualType.validation) return;
        let options_container = new CreateE('div', '', {
            ClassList: ['options-container'],
            Children: [],
            Parent: instance.ObjCreate,
        }).create();
        let options = [];
        let type = undefined
        if (Data.list instanceof Array) {
            type = 'radio'
            options = [...Data.list]
            instance.answer = [Data.correct];
        } else {
            type = 'checkbox'
            options = Object.keys(Data.list);
            instance.answer = Object.keys(Data.list).filter(key => Data.list[key])
        }

        options.forEach((option, i) => {
            let input = new CreateE('input', '', {
                PropertyList: { name: `question-${instance.id}`, id: `question-${instance.id}-option${i}`, value: option, type: type },
                Styles: { display: 'none' },
                Parent: options_container
            }).create();
            let CLASS = undefined
            if (instance.answer.includes(option)) {
                CLASS = 'true'
            } else {
                CLASS = 'false'
            }
            let label = new CreateE("label", "", {
                Parent: options_container,
                ClassList: ['option', CLASS],
                PropertyList: { for: `question-${instance.id}-option${i}` },
            }).create()
            let p = new CreateE("p", "", {
                Parent: label
            })
            p.node.textContent = option
            p.create()

        })
        setTimeout(() => {
            options_container.node.classList.add('start_transition_entrance')
        }, 350 * instance.id)
    },
    summary: (Data, instance) => {
        const summary = new Summary(Data, instance.ObjCreate)
        const btnsumarry = new CreateE('div', '', {
            ClassList: ['btnSumarry'],
            EventList: {
                click: () => {

                    if (summary.ObjCreate.node.classList.contains('none')) {
                        summary.ObjCreate.node.classList.remove('none')
                    } else {
                        summary.ObjCreate.node.classList.add('none')
                    }
                    setTimeout(() => { summary.ObjCreate.node.classList.toggle('open') }, 1)

                }
            },
            Parent: instance.ObjCreate
        }).create();
        btnsumarry.node.textContent = '...'
        summary.create()

        instance.summary = summary
    },
}
class Question {
    static id = 1;
    static allQuestions = []
    constructor(config) {
        this.id = Question.id
        this.config = config;
        this.sumarry = undefined;
        this.ObjCreate = new CreateE('div', '', {
            ClassList: ['Question-Container'],
            PropertyList: { id: `question-${Question.id}` },
            Children: [],
            Parent: 'Main'
        })
        this.answer = undefined;
        for (let func in configQuestion) {
            if (!Object.hasOwn(config, func)) { continue }
            for (let option in config) {
                if (option == func) {
                    configQuestion[func](config[option], this)
                }
            }
        }

        Question.allQuestions.push(this)
        Question.id++;
    }
    create() {
        this.ObjCreate.create();
        setTimeout(() => {
            this.ObjCreate.node.classList.add('start_transition_entrance')
        }, 50 * this.id)
    }
}
const configSummary = {
    title: (Data, instance) => {

        const title = Data;
        const ActualType = ErrorManager({ typeOfValue: { expectedTypes: { 'string': true, 'array': true }, catch: title }, FunctionError: 'configSummary > title() "Type of value Error"' })
        if (!ActualType.validation) return;
        const divSectionTitle = new CreateE('div', '', {
            ClassList: ['divSectionTitle'],
            Parent: instance.ObjCreate
        }).create();
        const textTitle = new CreateE('h3', '', {
            Parent: divSectionTitle
        }).create();
        textTitle.node.textContent = Data
    },
    text: (Data, instance) => {
        const text = Data;
        const ActualType = ErrorManager({ typeOfValue: { expectedTypes: { 'string': true, 'array': true }, catch: text }, FunctionError: 'configSummary > text() "Type of value Error"' })
        if (!ActualType.validation) return;
        const divSectionText = new CreateE('div', '', {
            ClassList: ['divSectionText'],
            Parent: instance.ObjCreate
        }).create();
        function createParagraph(textToWrite) {
            const p = new CreateE('p', '', {
                Parent: divSectionText
            }).create();
            p.node.textContent = textToWrite;
        }
        if (text instanceof Array) {
            text.forEach(p => createParagraph(p));
        } else {
            createParagraph(text);
        }
    },
    img: (Data, instance) => {
        const img = Data;
        const ActualType = ErrorManager({ typeOfValue: { expectedTypes: { 'string': true, 'array': true }, catch: img }, FunctionError: 'configSummary > img() "Type of value Error"' })
        if (!ActualType.validation) return;
        let img_container = new CreateE('div', '', {
            ClassList: ['img-container'],
            Parent: instance.ObjCreate
        }).create();
        function createImg(src) {
            new CreateE('img', '', {
                ClassList: ['img'],
                PropertyList: { src: src },
                Parent: img_container
            }).create();
        }
        if (Data instanceof Array) {
            new CreateE('div', '', {
                ClassList: ['btn', 'left'],
                Parent: img_container
            });
            new CreateE('div', '', {
                ClassList: ['btn', 'right'],
                Parent: img_container
            });
            img.forEach((src) => {
                createImg(src)
            })
        } else {
            createImg(img)
        }
    },
    table: (Data, instance) => {
        const tableData = Data;
        const ActualType = ErrorManager({ typeOfValue: { expectedTypes: { 'string': true, 'array': true }, catch: tableData }, FunctionError: 'configSummary > table() "Type of value Error"' })
        if (!ActualType.validation) return;
        const divSectionTable = new CreateE('div', '', {
            ClassList: ['divSectionTable'],
            Parent: instance.ObjCreate
        }).create();
        const table = new CreateE('table', '', {
            ClassList: ['table'],
            Parent: divSectionTable
        }).create();
        const tableBody = new CreateE('tbody', '', {
            ClassList: ['tableBody'],
            Parent: table
        }).create();
        tableData.forEach(row => {
            const tr = new CreateE('tr', '', {
                Parent: tableBody
            }).create();
            row.forEach(Text => {
                const td = new CreateE('td', '', {
                    Parent: tr
                }).create();
                const p = new CreateE('p', '', {
                    Parent: td
                }).create();
                p.node.textContent = Text
            })
        })
    },
}
class Summary {
    constructor(config, parent) {
        this.config = config;
        this.ObjCreate = new CreateE('div', '', {
            ClassList: ['Summary-block', 'none'],
            Children: [],

            Parent: parent
        });
        config.forEach(index => {

            for (let func in index) {
                if (Object.hasOwn(configSummary, func)) {
                    configSummary[func](index[func], this)
                }
            }
        })
    }
    create() {
        this.ObjCreate.create()
    }
}

function getUserAnswers(question) {
    const selector = `input[name="question-${question.id}"]`;
    const inputs = document.querySelectorAll(selector);
    inputs.forEach(input => {

        input.setAttribute('disabled', 'true')
    })
    if (!inputs.length) return [];
    // radio → solo uno
    if (inputs[0].type === "radio") {
        const checked = Array.from(inputs).find(i => i.checked);
        return checked ? [checked.value] : [];
    }
    // checkbox → varios
    if (inputs[0].type === "checkbox") {
        return Array.from(inputs)
            .filter(i => i.checked)
            .map(i => i.value);
    }
}
function gradeQuiz() {
    let correct = 0;

    Question.allQuestions.forEach(question => {
        const user = getUserAnswers(question);
        const correctAns = question.answer;

        // ordenar para comparar arrays sin importar el orden
        const u = [...user].sort().join(",");
        const c = [...correctAns].sort().join(",");

        if (u === c) correct++;
    });

    return {
        correct,
        total: Question.allQuestions.length,
        score: Math.round(correct / Question.allQuestions.length * 100)
    };
}
function resultsBlock(correct, total, score) {
    const container = new CreateE('div', '', {
        Parent:'resultsSection',
        ClassList: "containerResults",
    });
    const result = new CreateE('div', '', {
        Parent: container,
        ClassList: "result",
    }).create();
     const p = new CreateE('p', '', {
        Parent: result,
        autoGenWords: {string: `${correct} / ${total} : ${score}%`, time:10}
    }).create();
    const btn = new CreateE('button', '', {
        Parent: container,
        ClassList: "BTNFINISH",
        EventList:{'click':()=>{
            location.reload();
        }}
    }).create();
    let progress = 0

    let intevalo = setInterval(()=>{
        document.documentElement.style.setProperty('--progress', `${progress}%`);
        if(progress >= score){
            clearInterval(intevalo)
        }
        progress++
    },16)
    btn.node.textContent = 'Intentar de nuevo'
    container.create()
}

