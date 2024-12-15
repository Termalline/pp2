
// https://forum.freecodecamp.org/t/newline-in-react-string-solved/68484
export const Newline = (props) => {
    const text = props.text;
    if (text != undefined){
    return text.split('\n').map((item, i) => <p key={i}>{item}</p>);
    }
  }