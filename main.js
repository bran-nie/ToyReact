import { ToyReact } from './ToyReact';

// class MyComponent {}
// console.log('test');

// let a = <MyComponent name="a" />;

let b = (
    <div name="b" id="test">
        <span>1</span>
        <span>2</span>
        <span>3</span>
    </div>
);
document.body.appendChild(b);
console.log(b);
