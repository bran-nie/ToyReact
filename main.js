import { ToyReact, Component } from './ToyReact';

class MyComponent extends Component {
    render() {
        return (
            <div>
                <span>Hello</span>
                <span> World!</span>
            </div>
        );
    }
}

let a = <MyComponent name="a" id="npc" />;
ToyReact.render(a, document.body);

// let b = (
//     <div name="b" id="test">
//         <span>1</span>
//         <span>2</span>
//         <span>3</span>
//     </div>
// );
// document.body.appendChild(b);
// console.log(b);
