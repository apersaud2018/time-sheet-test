import React from 'react';
//import logo from './logo.svg';
import './App.css';

//This function is called from index.js to render the App
function App() {
  return (
    <TimeSheet />
  );
}

//This is the main program
class TimeSheet extends React.Component {
  constructor(props){
    super(props);

    let technicians = ['Grace Hopper', 'Stephen Hawking', 'Denis Klatt', 'Rita Mordio', 'Kanru Hua', 'Hatsune Miku', 'Eleanor Forte', 'Aki Glancy', 'Toby Fox', 'Tony Barrett', 'Uta Utane', 'Aiko Kikyuune'];

    this.state = {
      entryType:"regular",
      technicians:technicians,
      technician:"",
      setName:null,
      expirationDate:"",
    };

    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.handleSelectName = this.handleSelectName.bind(this);
    this.getSetName = this.getSetName.bind(this);
    this.handleDateSelect = this.handleDateSelect.bind(this);
  }

  //Updates the entry type
  //Called by ToggleButtons
  handleToggleClick(newEntryType) {
    //console.log(newEntryType);
    this.setState({entryType:newEntryType});
  }

  //Updates values when a name is selected
  //Called from SearchBar and NameList
  handleSelectName(newName) {
    this.setState({technician:newName});
    if (this.state.setName) {
      this.state.setName(newName);
    }
    console.log(newName);
  }

  //Used to get the setter function NameEntry
  //Called from NameList
  getSetName(func) {
    this.setState({setName:func});
  }

  //Updates and formats expiration date
  //Called from DateEntry
  handleDateSelect (date){
    let splitDate = date.split("-");
    let formatDate;
    if (splitDate.length === 3){
      formatDate = (splitDate[1].length === 1 ? "0"+splitDate[1] : splitDate[1]) + "/" + (splitDate[2].length === 1 ? "0"+splitDate[2] : splitDate[2]) + "/" + splitDate[0];
    }
    else {
      formatDate="";
    }
    this.setState({expirationDate:formatDate});
    //console.log(formatDate);
  }

  render () {
    //Layout is handled via CSS
    return (
      <div className="grid-main">
      <ToggleButtons onToggleClick={this.handleToggleClick} />
      <SearchBar searchList={this.state.technicians} onSelect={this.handleSelectName} />
      <TimeTable />
      <NameEntry registerSetName={this.getSetName} onSelect={this.handleSelectName} />
      <DateEntry onSelect={this.handleDateSelect} />
      <NameList nameList={this.state.technicians} onSelect={this.handleSelectName} />
      <DescriptionEntry />
      <ProgressBar />
      <SubmitButton />
      </div>
    );
  }
}


class ToggleButtons extends React.Component {
  constructor(props){
    super(props)

    this.state = {entryType:"regular", regularStyle:"tt-button-selected", extraStyle:"tt-button"};

    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle(caller){
    if (caller !== this.state.entryType){
      let updateRegular = caller === "regular" ? "tt-button-selected" : "tt-button";
      let updateExtra = caller === "extra" ? "tt-button-selected" : "tt-button";
      this.setState({entryType:caller, regularStyle:updateRegular, extraStyle:updateExtra})
      this.props.onToggleClick(caller);
    }
  }

  render () {
    return (
      <div className="grid-item-toggle-button">
      <button className={this.state.regularStyle} onClick = {() => {this.handleToggle("regular")}}>Regular</button>
      <button className={this.state.extraStyle} onClick = {() => {this.handleToggle("extra")}}>Extra</button>
      </div>
    );
  }
}

class SearchBar extends React.Component {
  constructor(props){
    super(props);

    let searchList = [];
     if (this.props.searchList){
       searchList = this.props.searchList.map(
         (tech, i) => {
           return <option key={"search_item_"+i} value={tech}/>;
         }
       );
     }

    this.state = {searchOptions:searchList, value: ''};

    //this.handleToggle = this.handleToggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    if (this.props.searchList.includes(event.target.value)){
      this.props.onSelect(event.target.value);
    }
  }


  render () {
    return (
      <div className="grid-item-search">
        <datalist id="searchList">
          {this.state.searchOptions}
        </datalist>
        <label>
          Search Technician <input type="search" list="searchList" placeholder="Search for Technician" value={this.state.value} onChange={this.handleChange}/>
        </label>
      </div>
    );
  }
}

class TimeTable extends React.Component {
  render () {
    return (
      <div className="grid-item-time-table">
      <h1> TimeTable </h1>
      </div>
    );
  }
}

class NameEntry extends React.Component {
  constructor(props){
    super(props);

    this.state = {value:""};

    this.handleChange = this.handleChange.bind(this);
    this.setName = this.setName.bind(this);

    this.props.registerSetName(this.setName)
  }

  setName(name) {
    this.setState({value:name});
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    this.props.onSelect(event.target.value);
  }

  render () {
    return (
      <div className="grid-item-name-entry">
      <label>
        Tech Lead <input type="text" placeholder="Full Name" value={this.state.value} onChange={this.handleChange} /> <font color="red"> <strong>*</strong></font>
      </label>
      </div>
    );
  }
}

class DateEntry extends React.Component {
  constructor(props){
    super(props);

    this.state = {value:""};

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    this.props.onSelect(event.target.value);
  }

  render () {
    return (
      <div className="grid-item-date-entry">
      <label>
        Expiration Date <input type="date" placeholder="Select Date" value={this.state.value} onChange={this.handleChange} /> <font color="red"> <strong>*</strong></font>
      </label>
      </div>
    );
  }
}

class NameList extends React.Component {
  constructor(props){
    super(props);

    let nameList = [];
     if (this.props.nameList){
       nameList = this.props.nameList.map(
         (tech, i) => {
           //console.log(tech);
           return <option key={"name_item_"+i} value={tech}>{tech}</option>;
         }
       );
     }

    this.state = {nameList:nameList, value: ''};

    //this.handleToggle = this.handleToggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange (event) {
    this.props.onSelect(event.target.value);
  }

  render () {
    return (
      <div className="grid-item-name-list">
      <h3> Technician List </h3>
      <select className="max-fill" onChange={this.handleChange} size="10">
        {this.state.nameList}
      </select>
      </div>
    );
  }
}

class DescriptionEntry extends React.Component {
  render () {
    return (
      <div className="grid-item-description-entry">
      <h1> DescriptionEntry </h1>
      </div>
    );
  }
}

class ProgressBar extends React.Component {
  render () {
    return (
      <div className="grid-item-progress-bar">
      <h1> ProgressBar </h1>
      </div>
    );
  }
}

class SubmitButton extends React.Component {
  render () {
    return (
      <div className="grid-item-submit-button">
      <h1> SubmitButton </h1>
      </div>
    );
  }
}

// function App_ref() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }


export default App;
