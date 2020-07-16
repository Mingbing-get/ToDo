//根据key在localStorage中获取对应的数据，并根据对应的数据，进行修改（以id匹配）
module.exports.updateLocalStorage = function (key, data) {
    let event = this.getLocalStorage(key);
    let index = event.findIndex(function (value) {
        return value.id === data.id;
    })
    event.splice(index,1,data);

    localStorage.setItem(key, JSON.stringify(event));
}

//根据key在localStorage中获取对应的数据，并以json格式返回
module.exports.getLocalStorage = function (key) {
    let event = localStorage.getItem(key);
    if (!event)
        return [];
    return JSON.parse(event);
}

//根据key在localStorage中获取对应的数据，再根据id返回对应的数据
module.exports.getLocalStorageById = function (key, id) {
    let event = this.getLocalStorage(key);
    return event.find(function (value) {
        return value.id === id;
    })
}

//根据key在localStorage中获取对应的数据，并向其中添加数据
module.exports.addLocalStorage = function (key, data) {
    //向localSrorage中获取数据
    let event = localStorage.getItem(key);
    //如果其中有数据，则直接添加
    if (event){
        event = JSON.parse(event);
        event.push(data);
    }
    //如果没有数据，则创建一个数组用于保存
    else{
        event = [data];
    }
    //将数据存储到localStorage中
    localStorage.setItem(key, JSON.stringify(event));
}

//根据key在localStorage中获取对应的数据，并根据id删除对应的数据
module.exports.removeLocalStorage = function (key, id) {
    let event = this.getLocalStorage(key);
    let index = event.findIndex(function (value) {
        return value.id === id;
    })
    if (index === -1)
        return 0;
    event.splice(index,1);

    localStorage.setItem(key, JSON.stringify(event));
    return 1
}