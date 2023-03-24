// // 주소에 쿼리스트링 받아오기
// const queryString = new URLSearchParams(window.location.search);
// const nameText = queryString.get('grocery-name');

// // html name에 접근
// const inputTextObjects = document.getElementsByName('grocery-name');
// inputTextObject = inputTextObjects[0];

// // input value 값 넣기
// inputTextObject.value = nameText;

// // 주소에 쿼리스트링 배열로 받기
// const inputHiddenList = queryString.getAll('input-hidden');
// const inputHidden = inputHiddenList[0];

// const todoList = 1;

// inputTextObject.focus();
// inputTextObject.blur();

let groceries;

const groceriesCreate = function(input) {
  console.log(input);
  const index = input.index;
  const uid = input.uid;
  const checked = input.checked;
  if (checked) {
    const url = 'https://javascript-red-jsh-default-rtdb.firebaseio.com/groceries/' + uid + '.json';
    const itemsNameObject = document.getElementsByName('items-name')[index];
    const itemsEnterObject = document.getElementsByName('items-enter')[index];
    const itemsExpireObject = document.getElementsByName('items-expire')[index];
    const grocery = {
      name: itemsNameObject.innerHTML,
      enter: itemsEnterObject.innerHTML,
      expire: itemsExpireObject.value
    };
  
    axios.put(url, grocery);
    //patch: 해당 항목만 수정하겠다(잘안쓴다) put: 싹 지우고 내가 가지고 있는것만 쓰겠다(많이쓴다)
  } else {
    // delete
    groceriesDelete(uid, 'items');
  }


};

const groceriesRead = function() {
  axios.get('https://javascript-red-jsh-default-rtdb.firebaseio.com/groceries.json').then(function(response) {
    groceries = response.data;
    const tagDivParent = document.getElementById('tag-tbody-parent');
    tagDivParent.innerHTML = '';
    const tagDivChild = document.getElementById('tag-tr-child');
    let index = 0;
    for (let uid in groceries) {
      const newDivChild = tagDivChild.cloneNode(true);
      tagDivParent.appendChild(newDivChild);
      const grocery = groceries[uid];
      const groceriesNameObject = document.getElementsByName('groceries-name')[index];
      const groceriesEnterObject = document.getElementsByName('groceries-enter')[index];
      const groceriesExpireObject = document.getElementsByName('groceries-expire')[index];
      const groceriesDeleteObject = document.getElementsByName('groceries-delete')[index];
      const groceriesGroceryObject = document.getElementsByName('items-grocery')[index];
      groceriesNameObject.innerHTML = grocery.name;
      groceriesEnterObject.innerHTML = grocery.enter;
      groceriesExpireObject.value = grocery.expire;
      groceriesExpireObject.index = index;
      groceriesExpireObject.uid = uid;
      groceriesDeleteObject.uid = uid;
      groceriesGroceryObject.uid = uid;
      groceriesGroceryObject.index = index;
      index += 1;
    }
    console.log('Read', groceries);
  });
};

// groceriesRead();

const groceriesDelete = function(uid, from) {
  const url = 'https://javascript-red-jsh-default-rtdb.firebaseio.com/groceries/' + uid + '.json';
  axios.delete(url).then(function(){
    from === 'groceries' && groceriesRead();
  });
};

const groceriesUpdate = function(index, uid) {
  const url = 'https://javascript-red-jsh-default-rtdb.firebaseio.com/groceries/' + uid + '.json';
  
  const name = document.getElementsByName('groceries-name')[index].innerHTML;
  const enter = document.getElementsByName('groceries-enter')[index].innerHTML;
  const expire = document.getElementsByName('groceries-expire')[index].value;
  const grocery = {
    name: name,
    enter: enter,
    expire: expire
  };
  
  axios.patch(url, grocery).then(function(){
    groceriesRead();
  });

};