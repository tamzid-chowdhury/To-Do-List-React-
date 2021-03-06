// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react';
import testData from './test/testData.json'
import jsTPS from './common/jsTPS'

// THESE ARE OUR REACT COMPONENTS
import Navbar from './components/Navbar'
import LeftSidebar from './components/LeftSidebar'
import Workspace from './components/Workspace'
import DeleteModal from './components/DeleteModal'


//THESE ARE OUR TRANSACTIONS
import AddNewItem_Transaction from './transactions/AddNewItem_Transaction'
import RemoveItem_Transaction from './transactions/RemoveItem_Transaction'
import MoveItemUp_Transaction from './transactions/MoveItemUp_Transaction'
import MoveItemDown_Transaction from './transactions/MoveItemDown_Transaction'
import EditTask_Transaction from './transactions/EditTask_Transaction'
import EditDueDate_Transaction from './transactions/EditDueDate_Transaction'
import EditStatus_Transaction from './transactions/EditStatus_Transaction'

{/*import ItemsListHeaderComponent from './components/ItemsListHeaderComponent'
import ItemsListComponent from './components/ItemsListComponent'
import ListsComponent from './components/ListsComponent'
*/}

class App extends Component {
  constructor(props) {
    // ALWAYS DO THIS FIRST
    super(props);

    // DISPLAY WHERE WE ARE
    console.log("App constructor");

    // MAKE OUR TRANSACTION PROCESSING SYSTEM
    this.tps = new jsTPS();

    // CHECK TO SEE IF THERE IS DATA IN LOCAL STORAGE FOR THIS APP
    let recentLists = localStorage.getItem("recentLists");
    console.log("recentLists: " + recentLists);
    if (!recentLists) {
      recentLists = JSON.stringify(testData.toDoLists);
      localStorage.setItem("toDoLists", recentLists);
    }
    recentLists = JSON.parse(recentLists);

    // FIND OUT WHAT THE HIGHEST ID NUMBERS ARE FOR LISTS
    let highListId = -1;
    let highListItemId = -1;
    for (let i = 0; i < recentLists.length; i++) {
      let toDoList = recentLists[i];
      if (toDoList.id > highListId) {
        highListId = toDoList.id;
      }
      for (let j = 0; j < toDoList.items.length; j++) {
        let toDoListItem = toDoList.items[j];
        if (toDoListItem.id > highListItemId)
        highListItemId = toDoListItem.id;
      }
    };

    // SETUP OUR APP STATE
    this.state = {
      toDoLists: recentLists,
      currentList: {items: []},
      nextListId: highListId+1,
      nextListItemId: highListItemId+1,
      useVerboseFeedback: true,
      currentlyEditing: false,
      deleteModalOpen: false
    }
  }


  // WILL LOAD THE SELECTED LIST
  loadToDoList = (toDoList) => {
    console.log("loading " + toDoList);

    // MAKE SURE toDoList IS AT THE TOP OF THE STACK BY REMOVING THEN PREPENDING
    const nextLists = this.state.toDoLists.filter(testList =>
      testList.id !== toDoList.id
    );
    nextLists.unshift(toDoList);

    this.setState({
      toDoLists: nextLists,
      currentList: toDoList,
      currentlyEditing: true
    });

    this.tps.clearAllTransactions()
  }

  addNewList = () => {
    let newToDoListInList = [this.makeNewToDoList()];
    let newToDoListsList = [...newToDoListInList, ...this.state.toDoLists];
    let newToDoList = newToDoListInList[0];

    // AND SET THE STATE, WHICH SHOULD FORCE A render
    this.setState({
      toDoLists: newToDoListsList,
      currentList: newToDoList,
      nextListId: this.state.nextListId+1,
      currentlyEditing: true
    }, this.afterToDoListsChangeComplete);
  }

  addListItem = () => {
    let newToDoListsList = this.state.toDoLists //make a new list of todolists 
    let newList = newToDoListsList.shift() //remove the first list and assign it to a varible

    let newItem = this.makeNewToDoListItem()
    newList.items.push(newItem)

    newToDoListsList.unshift(newList) //add it back into the list


    this.setState({
      toDoLists: newToDoListsList,
      currentList: newList
    },this.afterToDoListsChangeComplete)

    return newItem
  }    
  
  addListItemAtIndex = (listItem, index) => {
    let newToDoListsList = this.state.toDoLists //make a new list of todolists 
    let newList = newToDoListsList.shift() //remove the first list and assign it to a varible

    newList.items.splice(index,0,listItem)

    newToDoListsList.unshift(newList) //add it back into the list


    this.setState({
      toDoLists: newToDoListsList,
      currentList: newList
    },this.afterToDoListsChangeComplete)

  }    
  

  closeCurrentList = () => {
    this.setState({
      currentList: {items: []},
      currentlyEditing: false
    });
  }

  deleteCurrentList = () => {
    let listToDelete = this.state.currentList; 

    //delete the current list by filtering it out using id 
    const newToDoListsList = this.state.toDoLists.filter(testList =>
      testList.id !== listToDelete.id
    );

    this.setState({
      toDoLists: newToDoListsList,
      currentList: {items: []},
      deleteModalOpen: false,
      currentlyEditing: false
    }, this.afterToDoListsChangeComplete);

  }


  openDeleteModal = () => {
    this.setState({
      deleteModalOpen: true
    })
  }

  closeDeleteModal = () => {
    this.setState({
      deleteModalOpen: false
    })
  }

  editListName = (toDoList,newName) => {


    let newToDoListsList = this.state.toDoLists //make a new list of todolists 
    let newList = newToDoListsList.shift() //remove the first list and assign it to a varible
    newList.name = newName //change the lists name 
    newToDoListsList.unshift(newList) //add it back into the list

    this.setState({
      toDoLists: newToDoListsList,
      currentList: newList
    },this.afterToDoListsChangeComplete)
  }

  makeNewToDoList = () => {
    let newToDoList = {
      id: this.state.nextListId,
      name: 'Untitled',
      items: []
    };
    return newToDoList;
  }

  makeNewToDoListItem = () =>  {
    let newToDoListItem = {
      description: "No Description",
      due_date: "0000-00-00",
      status: "incomplete"
    };
    return newToDoListItem;
  }

  editTask = (listItem, newTask) => {
    let newToDoListsList = this.state.toDoLists //make a new list of todolists 
    let newList = newToDoListsList.shift() //remove the first list and assign it to a varible

    for(let i = 0; i < newList.items.length; i++){
      if(newList.items[i] == listItem){
        newList.items[i].description = newTask
      }
    }

    newToDoListsList.unshift(newList) //add it back into the list


    this.setState({
      toDoLists: newToDoListsList,
      currentList: newList
    },this.afterToDoListsChangeComplete)
  }

  editDueDate = (listItem, newDueDate) => {
    let newToDoListsList = this.state.toDoLists //make a new list of todolists 
    let newList = newToDoListsList.shift() //remove the first list and assign it to a varible

    for(let i = 0; i < newList.items.length; i++){
      if(newList.items[i] == listItem){
        newList.items[i].due_date = newDueDate
      }
    }

    newToDoListsList.unshift(newList) //add it back into the list


    this.setState({
      toDoLists: newToDoListsList,
      currentList: newList
    },this.afterToDoListsChangeComplete)
  }

  editStatus = (listItem, newStatus) => {
    let newToDoListsList = this.state.toDoLists //make a new list of todolists 
    let newList = newToDoListsList.shift() //remove the first list and assign it to a varible

    for(let i = 0; i < newList.items.length; i++){
      if(newList.items[i] == listItem){
        newList.items[i].status = newStatus
      }
    }

    newToDoListsList.unshift(newList) //add it back into the list


    this.setState({
      toDoLists: newToDoListsList,
      currentList: newList
    },this.afterToDoListsChangeComplete)
  }

  moveItemUp = (listItem) => {
    let newToDoListsList = this.state.toDoLists //make a new list of todolists 
    let newList = newToDoListsList.shift() //remove the first list and assign it to a varible

    for(let i = 0; i < newList.items.length; i++){
      if(newList.items[i] == listItem){
        let temp = newList.items[i]
        newList.items[i] = newList.items[i-1]
        newList.items[i-1] = temp
        break
      }
    }

    newToDoListsList.unshift(newList) //add it back into the list


    this.setState({
      toDoLists: newToDoListsList,
      currentList: newList
    },this.afterToDoListsChangeComplete)

  }

  moveItemDown = (listItem) => {
    let newToDoListsList = this.state.toDoLists //make a new list of todolists 
    let newList = newToDoListsList.shift() //remove the first list and assign it to a varible

    for(let i = 0; i < newList.items.length; i++){
      if(newList.items[i] == listItem){
        let temp = newList.items[i]
        newList.items[i] = newList.items[i+1]
        newList.items[i+1] = temp
        break
      }
    }

    newToDoListsList.unshift(newList) //add it back into the list


    this.setState({
      toDoLists: newToDoListsList,
      currentList: newList
    },this.afterToDoListsChangeComplete)
  }

  deleteItem = (listItem) => {
    let newToDoListsList = this.state.toDoLists //make a new list of todolists 
    let newList = newToDoListsList.shift() //remove the first list and assign it to a varible
    let indexOfDeletion = -1

    for(let i = 0; i < newList.items.length; i++){
      if(newList.items[i] == listItem){
        indexOfDeletion = i
        newList.items.splice(i,1)
      }
    }

    newToDoListsList.unshift(newList) //add it back into the list


    this.setState({
      toDoLists: newToDoListsList,
      currentList: newList
    },this.afterToDoListsChangeComplete)

    return indexOfDeletion
  }

  // THIS IS A CALLBACK FUNCTION FOR AFTER AN EDIT TO A LIST
  afterToDoListsChangeComplete = () => {
    console.log("App updated currentToDoList: " + this.state.currentList);

    // WILL THIS WORK? @todo
    let toDoListsString = JSON.stringify(this.state.toDoLists);
    localStorage.setItem("recentLists", toDoListsString);
  }

  undo = () => {
    if (this.tps.hasTransactionToUndo()) {
        this.tps.undoTransaction();
    }
  }

  redo = () => {
    if (this.tps.hasTransactionToRedo()) {
        this.tps.doTransaction();
    }
  }

  addNewItemTransaction = () => { 
    let transaction = new AddNewItem_Transaction(this);
    this.tps.addTransaction(transaction);
  }

  removeItemTransaction = (listItem) => { 
    let transaction = new RemoveItem_Transaction(this,listItem);
    this.tps.addTransaction(transaction);
  }

  moveItemUpTransaction = (listItem) => { 
    let transaction = new MoveItemUp_Transaction(this,listItem);
    this.tps.addTransaction(transaction);
  }

  moveItemDownTransaction = (listItem) => { 
    let transaction = new MoveItemDown_Transaction(this,listItem);
    this.tps.addTransaction(transaction);
  }

  editTaskTransaction = (listItem,newTask) => { 
    let transaction = new EditTask_Transaction(this,listItem,newTask);
    this.tps.addTransaction(transaction);
  }

  editDueDateTransaction = (listItem,newDueDate) => { 
    let transaction = new EditDueDate_Transaction(this,listItem,newDueDate);
    this.tps.addTransaction(transaction);
  }

  editStatusTransaction = (listItem,newStatus) => { 
    let transaction = new EditStatus_Transaction(this,listItem,newStatus);
    this.tps.addTransaction(transaction);
  }

  hasTransactionToUndo = () => {
    return this.tps.hasTransactionToUndo();
  }


  hasTransactionToRedo = () => {
    return this.tps.hasTransactionToRedo();
  }

  handleKeyDown = (event) => {
    console.log(event.ctrlKey)
    if(event.ctrlKey && event.key === 'z'){
      this.undo()
    }
    if(event.ctrlKey && event.key === 'y'){
      this.redo()
    }
  }

  render() {
    let items = this.state.currentList.items;
    return (
      <div id="root" onKeyDown={this.handleKeyDown} tabIndex="0">
        <Navbar />
        <LeftSidebar 
          currentList={this.state.currentList}
          toDoLists={this.state.toDoLists}
          loadToDoListCallback={this.loadToDoList}
          addNewListCallback={this.addNewList}
          editListNameCallback={this.editListName}
          currentlyEditing={this.state.currentlyEditing}
        />

        <Workspace 
        toDoListItems={items} 
        deleteCurrentListCallback={this.openDeleteModal}
        closeCurrentListCallback={this.closeCurrentList}
        editTaskCallback={this.editTaskTransaction}
        editDueDateCallback={this.editDueDateTransaction}
        editStatusCallback={this.editStatusTransaction}
        moveUpCallback={this.moveItemUpTransaction}
        moveDownCallback={this.moveItemDownTransaction}
        deleteItemCallback={this.removeItemTransaction}
        addListItemCallback={this.addNewItemTransaction}
        undoCallback={this.undo}
        redoCallback={this.redo}
        hasTransactionToUndo={this.hasTransactionToUndo}
        hasTransactionToRedo={this.hasTransactionToRedo}
        currentlyEditing={this.state.currentlyEditing}
        />

        <DeleteModal 
        deleteModalOpen={this.state.deleteModalOpen}
        closeDeleteModal={this.closeDeleteModal}
        deleteListCallback={this.deleteCurrentList}/>
      </div>
    );
  }
}

export default App;