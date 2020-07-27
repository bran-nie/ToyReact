export const ToyReact = {
    createElement(type, attr, ...childrens) {
        console.log(arguments);
        let ele = document.createElement(type);

        for (let name in attr) {
            ele.setAttribute(name, attr[name]);
        }

        for (let child of childrens) {
            if (typeof child === 'string') {
                child = document.createTextNode(child);
            }
            ele.appendChild(child);
        }
        return ele;
    },
};
