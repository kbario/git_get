  export const getNameFromPath = (path: string) => {
    const arr = path?.trim().split('/')
    return arr[arr.length - 1] === "" ? arr[arr.length - 2] : arr[arr.length - 1]
  };
