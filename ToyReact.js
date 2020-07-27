class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type);
    }
    setAttribute(name, value) {
        this.root.setAttribute(name, value);
    }
    appendChild(vchild) {
        vchild.mountTo(this.root);
    }
    mountTo(parent) {
        parent.appendChild(this.root);
    }
}

class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content);
    }
    mountTo(parent) {
        parent.appendChild(this.root);
    }
}

export class Component {
    setAttribute(name, value) {
        this[name] = value;
    }
    mountTo(parent) {
        let vdom = this.render();
        vdom.mountTo(parent);
    }
}

export const ToyReact = {
    createElement(type, attr, ...childrens) {
        let ele;
        if (typeof type === 'string') {
            ele = new ElementWrapper(type);
        } else {
            ele = new type();
        }

        for (let name in attr) {
            ele.setAttribute(name, attr[name]);
        }

        for (let child of childrens) {
            if (typeof child === 'string') {
                child = new TextWrapper(child);
            }
            ele.appendChild(child);
        }
        return ele;
    },
    render(vdom, ele) {
        vdom.mountTo(ele);
        // ele.appendChild(vdom);
    },
};
