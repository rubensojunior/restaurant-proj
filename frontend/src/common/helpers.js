function isEmptyOrSpaces(str){
    return str == null || str.match(/^ *$/) !== null;
}

export {isEmptyOrSpaces}