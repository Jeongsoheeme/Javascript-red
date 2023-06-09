
// // 주소에 쿼리스트링 배열로 받기
// const inputHiddenList = queryString.getAll('input-hidden');
// const inputHidden = inputHiddenList[0];

// const todoList = 1;

let groceries;

const groceriesCreate = function(input) {
  console.log(input);
  const index = input.index;
  const uid = input.uid;
  const checked = input.checked;
  if (checked) {
    const url = 'https://javascript-red-jsh-default-rtdb.firebaseio.com/'+firebaseUser.uid+'/groceries/' + uid + '.json';
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
    groceriesDelete(uid);
  }
};

const groceriesRead = function(q, orderColumn, orderDirection) {
  axios.get('https://javascript-red-jsh-default-rtdb.firebaseio.com/'+firebaseUser.uid+'/groceries.json').then(function(response) {
    let groceries = [];
    
    for (let uid in response.data) {
      const grocery = response.data[uid];
      grocery.uid = uid;
      if(grocery.name.indexOf(q) >= 0){
        groceries.push(grocery);
      }
    }

    //함수가 실행될때 시간 확인 (0.5초부터 확인해봐야한다. 500ms)
    console.time('start');

    // 카운트
    let count = 0;
    for (let index in groceries) {
      const grocery = groceries[index];
      //만료 D-7일보다 작으면 카운트에 넣기
      if((moment().diff(moment(grocery.expire), 'days') - 1) >= -7){
        count++;
      }
    }

    //items와 비교해서 checkbox 체크하기
    if (document.location.pathname === '/items.html') {
      console.log('아이템 존재', items, groceries);
      let i = 0;
      for (let itemUid in items) {
        for(let j in groceries){
          const grocery = groceries[j];
          if(itemUid === grocery.uid){
            document.getElementsByName('items-grocery')[i].checked = true;
          }
        }
        i++;
      }
    }

    // 카운트 넣기
    document.getElementById('menu-groceries-counter').innerHTML = count;
    console.timeEnd('start');
    if (document.getElementsByName('groceries-sequence').length === 0) return;
    
    //정렬시키기
    groceries = _.orderBy( groceries, orderColumn, orderDirection);

    //화면 그리기
    const tagDivParent = document.getElementById('tag-tbody-parent');
    tagDivParent.innerHTML = '';
    const tagDivChild = document.getElementById('tag-tr-child');
    for (let index in groceries) {
      const grocery = groceries[index];
      const uid = groceries[index].uid;
      const newDivChild = tagDivChild.cloneNode(true);
      tagDivParent.appendChild(newDivChild);
      const groceriesSequenceObject = document.getElementsByName('groceries-sequence')[index];
      const groceriesNameObject = document.getElementsByName('groceries-name')[index];
      const groceriesEnterObject = document.getElementsByName('groceries-enter')[index];
      const groceriesExpireObject = document.getElementsByName('groceries-expire')[index];
      const groceriesDeleteObject = document.getElementsByName('groceries-delete')[index];
      const groceriesUpdateObject = document.getElementsByName('groceries-update')[index];
      groceriesSequenceObject.innerHTML = Number(index)+1;
      groceriesNameObject.innerHTML = grocery.name;
      groceriesEnterObject.innerHTML = grocery.enter;
      groceriesExpireObject.innerHTML = grocery.expire;
      groceriesExpireObject.index = index;
      groceriesExpireObject.uid = uid;
      groceriesDeleteObject.uid = uid;
      groceriesUpdateObject.uid = uid;
      groceriesUpdateObject.index = index;

    }

    console.log('Read', groceries);
  });
};

const groceriesDelete = function(uid, callback) {
  const url = 'https://javascript-red-jsh-default-rtdb.firebaseio.com/'+firebaseUser.uid+'/groceries/' + uid + '.json';
  axios.delete(url).then(function(){
    callback && callback();
  });
};

const groceriesUpdate = function(uid) {
  const url = 'https://javascript-red-jsh-default-rtdb.firebaseio.com/'+firebaseUser.uid+'/groceries/' + uid + '.json';
  const name = document.getElementsByName('grocery-name')[0].value;
  const enter = document.getElementsByName('grocery-enter')[0].value;
  const expire = document.getElementsByName('grocery-expire')[0].value;
  const grocery = {
    name: name,
    enter: enter,
    expire: expire
  };

  
  axios.patch(url, grocery).then(function(){
    modalToggle();
    firebaseAfterLogin();
  });

};