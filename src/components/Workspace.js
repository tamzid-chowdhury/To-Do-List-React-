// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react'
import ToDoItem from './ToDoItem'
import Undo from '@material-ui/icons/Undo';
import Redo from '@material-ui/icons/Redo';
import AddBox from '@material-ui/icons/AddBox';
import Delete from '@material-ui/icons/Delete';
import Close from '@material-ui/icons/Close';

class Workspace extends Component {
    constructor(props) {
        super(props);

    }

    handleDeleteCurrentList = () => {
        this.props.deleteCurrentListCallback();
    }

    handleCloseCurrentList = () => {
        this.props.closeCurrentListCallback(); 
    }

    handleAddListItem = () => {
        this.props.addListItemCallback();
    }

    handleUndo = () => {
        this.props.undoCallback();
    }

    handleRedo = () => { 
        this.props.redoCallback();
    }

    renderUndo() {
        if(this.props.hasTransactionToUndo()){
            return <Undo id="undo-button" className="list-item-control material-icons todo-button" onClick={this.handleUndo}/>
        }
        else{
            return <Undo id="undo-button-disable" className="material-icons"/>
        }

    }

    renderRedo() {
        if(this.props.hasTransactionToRedo()){
            return <Redo id="redo-button" className="list-item-control material-icons todo-button" onClick={this.handleRedo} />
        }
        else{
            return <Redo id="redo-button-disable" className="material-icons" />
        }
    }

    render() {
        return (
            <div id="workspace">
                <div id="todo-list-header-card">
                    <div id="task-col-header" className="item-col todo-button">Task</div>
                    <div id="date-col-header" className="item-col todo-button">Due Date</div>
                    <div id="status-col-header" className="item-col todo-button">Status</div>
                    <div className="item-col" id="todo-list-header-card-buttons">
                        {this.props.currentlyEditing ? 
                        <AddBox 
                            id="add-item-button" 
                            className="list-item-control material-icons todo-button" 
                            onClick={this.handleAddListItem} >  
                        </AddBox> : <div></div>}
                        {this.props.currentlyEditing ? 
                        <Delete 
                            id="delete-list-button" 
                            className="list-item-control material-icons todo-button"
                            onClick={this.handleDeleteCurrentList}>
                        </Delete> : <div></div>}
                        {this.props.currentlyEditing ? 
                        <Close 
                            id="close-list-button" 
                            className="list-item-control material-icons todo-button" 
                            onClick={this.handleCloseCurrentList}/> : <div></div>}
                        {this.props.currentlyEditing ? 
                        this.renderUndo() : <div></div>}
                        {this.props.currentlyEditing ? 
                        this.renderRedo() : <div></div>}
                    </div>
                </div>
                <div id="todo-list-items-div">
                    {
                        this.props.toDoListItems.map((toDoListItem) => (
                        <ToDoItem
                            key={toDoListItem.id}
                            toDoListItem={toDoListItem} 
                            toDoListItems={this.props.toDoListItems}
                            editTaskCallback={this.props.editTaskCallback} 
                            editDueDateCallback={this.props.editDueDateCallback} 
                            editStatusCallback={this.props.editStatusCallback} 
                            moveUpCallback={this.props.moveUpCallback}
                            moveDownCallback={this.props.moveDownCallback} 
                            deleteItemCallback={this.props.deleteItemCallback} // PASS THE ITEM TO THE CHILDREN
                        />))
                    }
                </div>
                <br />
            </div>
        );
    }
}

export default Workspace;