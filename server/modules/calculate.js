function calculate(data) {
    let result = 0;
    let value1 = parseFloat(data.value1);
    let value2 = parseFloat(data.value2);
    if (data.action === "+") {
        result = value1 + value2;
    } else if (data.action === "-") {
        result = value1 - value2;
    } else if (data.action === "*") {
        result = value1 * value2;
    } else if (data.action === "/") {
        result = value1 / value2;
    }
    data.result = result;
    //dataStore.push(data);
    //console.log(dataStore);
    return data;
}

module.exports = calculate;