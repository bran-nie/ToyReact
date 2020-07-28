import { ToyReact, Component } from './ToyReact';

class MyComponent extends Component {
    render() {
        return (
            <div>
                <span>Hello</span>
                <span> World!</span>
                <div>
                    {true}
                    {this.children}
                </div>
            </div>
        );
    }
}

let a = (
    <MyComponent name="a" id="npc">
        <div>
            <h1>标题1</h1>
            <p class="content">这是有趣的内容</p>
        </div>
    </MyComponent>
);
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
