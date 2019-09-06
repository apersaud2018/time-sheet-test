import React from 'react';
import './App.css';
import { saveAs } from 'file-saver';

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

    let technicians = ['Grace Hopper', 'Stephen Hawking', 'Denis Klatt', 'Rita Mordio', 'Kanru Hua', 'Miku Hatsune', 'Eleanor Forte', 'Aki Glancy', 'Toby Fox', 'Tony Barrett', 'Uta Utane', 'Aiko Kikyuune'];

    let tableData = {};
    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].forEach(
      day => {
        tableData[day] = {from:0, to:0};
      }
    );

    this.state = {
      entryType:"regular",
      technicians:technicians,
      technician:"",
      setName:null,
      expirationDate:"",
      tableData:tableData,
      description:"",
      progress:0,
    };

    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.handleSelectName = this.handleSelectName.bind(this);
    this.handleDateSelect = this.handleDateSelect.bind(this);
    this.handleSetTime = this.handleSetTime.bind(this);
    this.handleSetDescription = this.handleSetDescription.bind(this);
    this.validateData = this.validateData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //Updates the entry type
  //Called by ToggleButtons
  handleToggleClick(newEntryType) {
    //console.log(newEntryType);
    this.setState({entryType:newEntryType});
    setTimeout(this.validateData, 100);
  }

  //Updates values when a name is selected
  //Called from SearchBar and NameList
  handleSelectName(newName) {
    this.setState({technician:newName});
    if (this.state.setName) {
      this.state.setName(newName);
    }
    //console.log(newName);
    setTimeout(this.validateData, 100);
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
    setTimeout(this.validateData, 100);
  }

  //Updates values when TimeTable is updated
  //Called from TimeTable
  handleSetTime(newTableData) {
    this.setState({tableData:newTableData});
    setTimeout(this.validateData, 100);
    //console.log(newTableData);
  }

  //Updates value when description is updated
  //Called from DescriptionEntry
  handleSetDescription(newdesc) {
    //console.log(newdesc);
    this.setState({description:newdesc})
    setTimeout(this.validateData, 100);
  }

  //Updates value when description is updated
  //Called from DescriptionEntry
  handleSubmit() {
    if (this.validateData(true)){
      console.log("Ready to submit");
      let output = {
        "ShiftType":this.state.entryType.charAt(0).toUpperCase() + this.state.entryType.substring(1),
        "TechLead":this.state.technician,
        "Description":this.state.description,
        "ShiftDetails": []
      };

      //order may be mixed up, hard coded key values to ensure order is preserved
      ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].forEach(
        day => {
          output.ShiftDetails.push(
            {
              "Day":day,
              "FromTime":(this.state.tableData[day].from+":00"),
              "EndTime":(this.state.tableData[day].to+":00")
            }
          )
        }
      );

    let file = new Blob([JSON.stringify(output)], {type: "application/json"}); //create new file from data
    saveAs(file, "entry.json");


    }
  }

  validateData(doListError = false){
    let errors = [];
    let count = 0;

    //Check name
    if (this.state.technician.length > 0){
      count++;
    } else {
      errors.push("Missing technician name");
    }

    //Check TimeTable
    let totalTime = 0;
    let validTimes = true;
    Object.keys(this.state.tableData).forEach(
      day => {
        if (this.state.tableData[day].from <= this.state.tableData[day].to){
          totalTime += this.state.tableData[day].to - this.state.tableData[day].from;
        } else {
          errors.push("Invalid times for "+day);
          validTimes = false
        }
      }
    );
    if (totalTime === 0){
      validTimes = false;
      errors.push("No time entered")
    }
    if (validTimes){
      count++;
    }

    //Check Description
    if (this.state.description.length > 0){
      count++;
    } else {
      errors.push("Missing description");
    }

    //Check Expiration Date
    //console.log(this.state.expirationDate + " " + this.state.expirationDate.length);
    if (this.state.expirationDate.length > 3){
      count++;
    } else {
      errors.push("Missing expiration date");
    }

    if (doListError &&  errors.length > 0){
      alert(errors.join("\n"));
    }

    this.setState({progress:count});

    //console.log(count);
    return count === 4;

  }

  render () {
    //Layout is handled via CSS
    return (
      <div className="grid-main">
      <ToggleButtons onToggleClick={this.handleToggleClick} />
      <SearchBar searchList={this.state.technicians} onSelect={this.handleSelectName} />
      <TimeTable onChange={this.handleSetTime}/>
      <NameEntry technician={this.state.technician} onSelect={this.handleSelectName} />
      <DateEntry onSelect={this.handleDateSelect} />
      <NameList nameList={this.state.technicians} onSelect={this.handleSelectName} />
      <DescriptionEntry onSelect={this.handleSetDescription}/>
      <ProgressBar progress={this.state.progress}/>
      <SubmitButton onClick={this.handleSubmit} />
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
  constructor(props){
    super(props)

    let tableData = {};
    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].forEach(
      day => {
        tableData[day] = {from:0, to:0};
      }
    );

    this.state = {tableData:tableData};

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, day, entry){
    //console.log(event.target.value + " " + day + " " + entry);
    let updateData = this.state.tableData;
    if (event.target.value){
      updateData[day][entry] = parseInt(event.target.value);
      this.setState({tableData:updateData});
      this.props.onChange(updateData);
    } else {
      updateData[day][entry] = 0;
      this.setState({tableData:updateData});
      this.props.onChange(updateData);
    }
  }

  render () {
    let tableStruct = [];
    Object.keys(this.state.tableData).forEach(
      key => {
          tableStruct.push(
            <tr key={key+"_row"}>
              <td className="table-format" key={key+"_name"}>{ this.state.tableData[key].from <= this.state.tableData[key].to ? key : <font color="red">{key}</font>}</td>
              <td className="table-format" key={key+"_from_col"}><input type="number" min="0" max="24" value={this.state.tableData[key].from} onChange={(event) => {this.handleChange(event, key, "from")}}/></td>
              <td className="table-format" key={key+"_to_col"}><input type="number" min="0" max="24" value={this.state.tableData[key].to} onChange={(event) => {this.handleChange(event, key, "to")}}/></td>
            </tr>
          );
      }
    );
    return (
      <div className="grid-item-time-table">
      <table className="max-fill table-format">
        <tbody>
          <tr>
            <th className="table-head"></th>
            <th className="table-head">From<font color="red"> <strong>*</strong></font></th>
            <th className="table-head">To<font color="red"> <strong>*</strong></font></th>
          </tr>
          {tableStruct}
        </tbody>
      </table>
      </div>
    );
  }
}

class NameEntry extends React.Component {
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
      <div className="grid-item-name-entry">
      <label>
        {this.props.technician.length > 0 ? "Tech Lead" : <font color="red">Tech Lead</font>} <input type="text" placeholder="Full Name" value={this.props.technician} onChange={this.handleChange} /> <font color="red"> <strong>*</strong></font>
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
        {this.state.value.length > 0 ? "Expiration Date" : <font color="red">Expiration Date</font>} <input type="date" placeholder="Select Date" value={this.state.value} onChange={this.handleChange} /> <font color="red"> <strong>*</strong></font>
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
  constructor(props){
    super(props);
    this.state = {value: ''};

    //this.handleToggle = this.handleToggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    this.props.onSelect(event.target.value);
  }

  render () {
    return (
      <div className="grid-item-description-entry">
      <label>
        {this.state.value.length > 0 ? "Description" : <font color="red">Description</font>} <font color="red"> <strong>*</strong></font>
      </label>
      <textarea className="desc-fill" placeholder="Enter description" onChange={this.handleChange}></textarea>
      </div>
    );
  }
}

class ProgressBar extends React.Component {
  render () {
    return (
      <div className="grid-item-progress-bar">
      <progress className="prog-fill" value={this.props.progress} max="4"/>
      </div>
    );
  }
}

class SubmitButton extends React.Component {
  render () {
    return (
      <div className="grid-item-submit-button">
        <button onClick={this.props.onClick}>Submit</button>
      </div>
    );
  }
}

export default App;
