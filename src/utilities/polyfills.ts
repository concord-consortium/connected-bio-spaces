declare interface ObjectConstructor {
  entries<T>(o: { [s: string]: T }): Array<[string, T]>;
}

if (!Object.entries) {
  Object.entries = (obj) => {
    const ownProps = Object.keys(obj);
    let i = ownProps.length;
    const resArray = new Array(i);
    while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]];
    return resArray;
  };
}

declare interface Array<T> {
  includes(searchElement: T): boolean;
}

// add polyfill
