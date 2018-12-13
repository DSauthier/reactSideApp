import React, { Component } from 'react';
import "../App.css";
import Axios from 'axios';
import { Route, Switch, Link } from 'react-router-dom';

import AddNewItem from './AddNewItem';


class ItemIndex extends Component {
  state = {
    allTheItems: [],
    editing: false
  };
  componentWillMount() {
    this.fetchItems();
  }
  fetchItems = () => {
    
    Axios.get("http://localhost:5000/api/items",
    {withCredentials: true})
      .then(responseFromApi => {
        console.log("9090909090",responseFromApi);
        this.setState({ allTheItems: responseFromApi.data.reverse() });
      })
      .catch(err => {});
  };
  showAllItems = () => {
    //this.fetchItems()
    const allTheItems = this.state.allTheItems;
    console.log("==========",allTheItems)

    return allTheItems.map(eachItem => {
      // console.log(eachItem.quantity);
      return <div key={eachItem._id} className="eachItem">
        <h3>{eachItem.name}</h3>
        <h3 className="descriptionBox">{eachItem.description}</h3>
        <h3> {eachItem.itemCost}</h3>
        <h3> {eachItem.retailPrice}</h3>
        <h3>
          <button onClick={() => this.changeQuanity(-1, eachItem)}>-</button>
          {eachItem.quantity}
          <button onClick={() => this.changeQuanity(1, eachItem)}>+</button>
          {/* why is it being called before of the click action? how to make it add on the back end aswell!?  */}
        </h3>
        <button>
          <Link to={`/items/details/${eachItem._id}`}>Edit Item</Link>
        </button>
      </div>;
    });
  };
  changeQuanity = (num, item) => {

    // console.log("something")
    

    //+1 or -1 &&& the id of the box
    // console.log(num, item)
    let editedItems = [...this.state.allTheItems];
    // console.log("-=-=-=",editedItems)
    // console.log("+++++++",this.state.allTheItems)
    editedItems.map((eachItem) => {
      if(item._id === eachItem._id){ //Found the item that we want to edit
        eachItem.quantity+=num
        // console.log(eachItem.quantity)
        // return eachItem.quantity
        Axios.post(
          "http://localhost:5000/api/items/edit/" + eachItem._id,
          {
            theTitle: eachItem.name,
            theDescription: eachItem.description,
            itemCost: eachItem.cost,
            retailPrice: eachItem.retailPrice,
            quantity: eachItem.quantity
          }
        )
          .then(() => {
            console.log("hello");
            this.setState({ allItems: editedItems });
          })
          .catch(() => {});
        }
    })
  }



  addItemToState = item => {
    // console.log(item);
    let allItems = [...this.state.allTheItems];
    allItems.unshift(item.data);
    this.setState({ allTheItems: allItems });
  };

  render() {
    // console.log(this.props)

    return (
      <div>
        <div>
          <div className="eachItem">
            <h3>Name</h3>
            <h3 className="descriptionBox">Description</h3>
            <h3>Cost in U$</h3>
            <h3>Retail Price in U$</h3>
            <h3>Amount in Stock</h3>
            <h3>See Details </h3>
          </div>
          <h3>{this.showAllItems()}</h3>
        </div>

        {/* <div>
          {this.showAllItems()}
        </div> */}
        <div>
          <AddNewItem addItemToState={this.addItemToState} />
        </div>
      </div>
    );
  }
}
export default ItemIndex;

