const defaultAwesomeFunction = name => {
  const returnStr = `I am the Default Awesome Function, fellow comrade 2! - ${name}`;
  return returnStr;
};

const awesomeFunction = () => "I am just an Awesome Function";

export default defaultAwesomeFunction;

export { awesomeFunction };
