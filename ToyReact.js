const childrenSymbol = Symbol('children');
class ElementWrapper {
    constructor(type) {
        // this.root = document.createElement(type);
        this.type = type;
        this.props = Object.create(null);
        this[childrenSymbol] = [];
        this.children = [];
    }
    setAttribute(name, value) {
        /*if (name.match(/^on([\s\S]+)$/)) {
            let eventName = RegExp.$1.toLocaleLowerCase();
            this.root.addEventListener(eventName, value);
        }
        if (name === "className") {
            this.root.setAttribute("class", value);
        } else {
            this.root.setAttribute(name, value);
        }*/
        this.props[name] = value;
    }
    // get children() {
    //     return this[childrenSymbol].map((child) => child.vdom);
    // }
    appendChild(vchild) {
        this[childrenSymbol].push(vchild);
        this.children.push(vchild.vdom);
        // const range = document.createRange();
        // if (this.root.children.length) {
        //     range.setStartAfter(this.root.lastChild);
        //     range.setEndAfter(this.root.lastChild);
        // } else {
        //     range.setStart(this.root, 0);
        //     range.setEnd(this.root, 0);
        // }
        // vchild.mountTo(range);
    }
    get vdom() {
        return this;
        // return {
        //     type: this.type,
        //     props: this.props,
        //     children: this.children.map((child) => child.vdom),
        // };
    }
    mountTo(range) {
        this.range = range;
        const placeholder = document.createComment('placeholder');
        const endRange = document.createRange();
        endRange.setStart(range.endContainer, range.endOffset);
        endRange.setEnd(range.endContainer, range.endOffset);
        endRange.insertNode(placeholder);

        range.deleteContents();
        let ele = document.createElement(this.type);

        for (let name in this.props) {
            const value = this.props[name];
            if (name.match(/^on([\s\S]+)$/)) {
                let eventName = RegExp.$1.toLocaleLowerCase();
                ele.addEventListener(eventName, value);
            }
            if (name === 'className') {
                ele.setAttribute('class', value);
            } else {
                ele.setAttribute(name, value);
            }
        }
        for (let child of this.children) {
            const range = document.createRange();
            if (ele.children.length) {
                range.setStartAfter(ele.lastChild);
                range.setEndAfter(ele.lastChild);
            } else {
                range.setStart(ele, 0);
                range.setEnd(ele, 0);
            }
            child.mountTo(range);
        }
        range.insertNode(ele);
    }
}

class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content);
        this.type = '#text';
        this.children = [];
        this.props = Object.create(null);
    }
    mountTo(range) {
        this.range = range;
        range.deleteContents();
        range.insertNode(this.root);
    }
    get vdom() {
        return this;
        // return {
        //     type: "#text",
        //     props: this.props,
        //     children: [],
        // };
    }
}

export class Component {
    constructor() {
        this.children = [];
        this.props = Object.create(null);
    }
    get type() {
        return this.constructor.name;
    }
    setAttribute(name, value) {
        this.props[name] = value;
        this[name] = value;
    }
    mountTo(range) {
        this.range = range;
        this.update();
    }
    update() {
        let vdom = this.vdom;
        if (this.oldVdom) {
            const isSameNode = (node1, node2) => {
                if (node1.type !== node2.type) return false;
                for (let name in node1.props) {
                    if (
                        typeof node1.props[name] === 'function' &&
                        typeof node2.props[name] === 'function' &&
                        node1.props[name].toString() === node2.props[name].toString()
                    ) {
                        // continue;
                    }
                    if (
                        typeof node1.props[name] === 'object' &&
                        typeof node2.props[name] === 'object' &&
                        JSON.stringify(node1.props[name]) === JSON.stringify(node2.props[name].toString())
                    ) {
                        continue;
                    }
                    if (node1.props[name] !== node2.props[name]) return false;
                    if (Object.keys(node1.props).length !== Object.keys(node2.props).length) {
                        return false;
                    }
                }
                return true;
            };

            const isSameTree = (node1, node2) => {
                if (!isSameNode(node1, node2)) return false;
                if (node1.children.length !== node2.children.length) return false;
                for (let i = 0; i < node1.children.length; i++) {
                    if (!isSameTree(node1.children[i], node2.children[i])) return false;
                }
                return true;
            };

            const replaceTree = (newTree, oldTree, indent) => {
                // console.log(indent + "new: vdom", newTree);
                // console.log(indent + "old: vdom", oldTree);
                if (isSameTree(newTree, oldTree)) return;

                if (!isSameNode(newTree, oldTree)) {
                    newTree.mountTo(oldTree.range);
                } else {
                    for (let i = 0; i < newTree.children.length; i++) {
                        replaceTree(newTree.children[i], oldTree.children[i], '  ' + indent);
                    }
                }
            };
            replaceTree(vdom, this.oldVdom, '');
        } else {
            vdom.mountTo(this.range);
        }
        this.oldVdom = vdom;
    }
    get vdom() {
        return this.render().vdom;
    }
    appendChild(vchild) {
        this.children.push(vchild);
    }
    setState(state) {
        let merge = (oldState, newState) => {
            for (let p in newState) {
                if (typeof newState[p] === 'object' && newState[p] !== null) {
                    if (typeof oldState[p] !== 'object') {
                        if (newState[p] instanceof Array) {
                            oldState[p] = [];
                        } else {
                            oldState[p] = {};
                        }
                    }
                    merge(oldState[p], newState[p]);
                } else {
                    oldState[p] = newState[p];
                }
            }
        };
        if (!this.state && state) {
            this.state = {};
        }
        merge(this.state, state);
        this.update();
    }
}

export const ToyReact = {
    createElement(type, attr, ...children) {
        console.log(type, attr, children);
        let ele;
        if (typeof type === 'string') {
            ele = new ElementWrapper(type);
        } else {
            ele = new type();
        }

        for (let name in attr) {
            ele.setAttribute(name, attr[name]);
        }

        let insertChildren = (children) => {
            for (let child of children) {
                if (typeof child === 'object' && child instanceof Array) {
                    insertChildren(child);
                } else {
                    if (child === null || child === void 0) {
                        child = '';
                    }
                    if (
                        !(child instanceof Component) &&
                        !(child instanceof ElementWrapper) &&
                        !(child instanceof TextWrapper)
                    ) {
                        child = String(child);
                    }
                    if (typeof child === 'string') {
                        child = new TextWrapper(child);
                    }
                    ele.appendChild(child);
                }
            }
        };
        insertChildren(children);

        return ele;
    },
    render(vdom, ele) {
        const range = document.createRange();
        if (ele.children.length) {
            range.setStartAfter(ele.lastChild);
            range.setEndAfter(ele.lastChild);
        } else {
            range.setStart(ele, 0);
            range.setEnd(ele, 0);
        }
        vdom.mountTo(range);
        // ele.appendChild(vdom);
    },
};
