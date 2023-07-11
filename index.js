import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js'
import { getDatabase, ref, push, onValue, remove } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js'
const appSettings = {
    databaseURL: "https://cart-playground-34b8b-default-rtdb.europe-west1.firebasedatabase.app/"
}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDb = ref(database, "shoppingList")
const inputFieldEl = document.getElementById('input-field')
const addButtonEl = document.getElementById('add-button')
const shoppingListEl = document.getElementById('shopping-list')

addButtonEl.addEventListener('click', ()=>{
    let inputValue = inputFieldEl.value
    if(inputValue === ' ' || inputValue === ''){
        inputFieldEl.value = "";
        return inputFieldEl.placeholder = "Enter an item";
    }
    push(shoppingListInDb, inputValue)
    clearInputFieldEl()
})
onValue(shoppingListInDb, function(snapshot) {
    if(snapshot.exists()){
        let shoppingItemsArray = Object.entries(snapshot.val())
        clearShoppingList()
        for (let q = 0; q < shoppingItemsArray.length; q++) {
            let currentItem = shoppingItemsArray[q];
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            appendItemToShoppingListEl(currentItem)
        }
    }else{
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

function clearShoppingList(){
    shoppingListEl.innerHTML = ""
}
function clearInputFieldEl(){
    inputFieldEl.value = "";
}
function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    let newEl = document.createElement("li")
    newEl.textContent = itemValue
    newEl.addEventListener('click', ()=>{
        let exactLocationOfItemInDb = ref(database, `shoppingList/${itemID}`)
        remove(exactLocationOfItemInDb)
    })
    shoppingListEl.append(newEl)

}