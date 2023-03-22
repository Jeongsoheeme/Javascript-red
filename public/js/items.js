// // 주소에 쿼리스트링 받아오기
// const queryString = new URLSearchParams(window.location.search);
// const nameText = queryString.get('item-name');

// // html name에 접근
// const inputTextObjects = document.getElementsByName('item-name');
// inputTextObject = inputTextObjects[0];

// // input value 값 넣기
// inputTextObject.value = nameText;

// // 주소에 쿼리스트링 배열로 받기
// const inputHiddenList = queryString.getAll('input-hidden');
// const inputHidden = inputHiddenList[0];

// const todoList = 1;

// inputTextObject.focus();
// inputTextObject.blur();

let items;

const ajax = function(method, url, data, callback) {
  const xhrObject = new XMLHttpRequest();
  xhrObject.onreadystatechange = function() {
    if (xhrObject.readyState !== 4) return;
    if (xhrObject.status === 200) {
      callback(xhrObject);
    } else {
      const error = {
        status: xhrObject.status,
        statusText: xhrObject.statusText,
        responseText: xhrObject.responseText
      }
      console.error(error);
    }
  };
  xhrObject.open(method, url);
  xhrObject.setRequestHeader('Content-Type', 'application/json');
  xhrObject.send(JSON.stringify(data));
};

const itemsCreate = function(form) {
  const itemNameObject = form['item-name'];
  const item = {
    name: itemNameObject.value,
    enter: '2023-03-22',
    expire: '2023-03-29'
  };

  axios.post('https://javascript-red-jsh-default-rtdb.firebaseio.com/items.json', item).then(function(response) {
    itemNameObject.value = '';
    itemsRead();
  });

};

const itemsRead = function() {
  axios.get('https://javascript-red-jsh-default-rtdb.firebaseio.com/items.json').then(function(response) {
    items = response.data;
    const tagDivParent = document.getElementById('tag-tbody-parent');
    tagDivParent.innerHTML = '';
    const tagDivChild = document.getElementById('tag-tr-child');
    let index = 0;
    for (let uid in items) {
      const newDivChild = tagDivChild.cloneNode(true);
      tagDivParent.appendChild(newDivChild);
      const item = items[uid];
      const itemsNameObject = document.getElementsByName('items-name')[index];
      const itemsEnterObject = document.getElementsByName('items-enter')[index];
      const itemsExpireObject = document.getElementsByName('items-expire')[index];
      const itemsDeleteObject = document.getElementsByName('items-delete')[index];
      itemsNameObject.innerHTML = item.name;
      itemsEnterObject.innerHTML = item.enter;
      itemsExpireObject.value = item.expire;
      itemsDeleteObject.index = index;
      index += 1;
    }
    console.log('Read', items);
  });
};

itemsRead();

const itemsDelete = function(index) {
  const url = 'http://localhost:3100/api/v1/items/' + index;
  axios.delete(url).then(function(){
    itemsRead();
  });
};

const itemsUpdate = function(index) {
  const url = 'http://localhost:3100/api/v1/items/' + index;
  
  const name = document.getElementsByName('items-name')[index].value;
  const age = document.getElementsByName('items-age')[index].value;
  const item = {
    name: name,
    age: age
  };
  
  axios.patch(url, item).then(function(){
    itemsRead();
  });

};