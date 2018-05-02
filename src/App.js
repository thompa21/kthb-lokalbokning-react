import React, { Component } from 'react';

import excelcsvlogo from './images/csv-and-excel.jpeg'
import './App.css';
import KthHeader from './components/KthHeader';
import { getEventsData, checkJWT } from './utils/lokalbokning-api';
import { getCookie } from './utils/cookies';
import DatePicker from 'react-datepicker';
import moment from 'moment/min/moment-with-locales'
import 'react-datepicker/dist/react-datepicker.css'

class App extends Component {

  constructor () {
    super()
    this.state = {
      events: [],
      loading: false,
      isLoggedIn: false,
      startDate: moment(),
      endDate: moment()
    }
    this.getLokalbokningar = this.getLokalbokningar.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    //Finns det en JWT-token?
    var kthb_jwt = getCookie("kthb_jwt");
    if(kthb_jwt !== "") {
      //Är JWT-token giltig?
      checkJWT()
        .then((response) => {
          this.setState({isLoggedIn: true});
        })
        .catch((error) => {
          this.setState({isLoggedIn: false});
        });
    } else {
      this.setState({isLoggedIn: false});
    }
  }
  
  handleChange = ({ startDate, endDate }) => {
    startDate = startDate || this.state.startDate
    endDate = endDate || this.state.endDate
    if (startDate.isAfter(endDate)) {
      endDate = startDate
    }
    this.setState({ startDate, endDate })
  }

  handleChangeStart = (startDate) => this.handleChange({ startDate })
  handleChangeEnd = (endDate) => this.handleChange({ endDate })

  /* Funktion som hämtar lokalbokningar via API och sen skapar en csv-fil */
  getLokalbokningar() {
    //Är JWT-token giltig?
    checkJWT()
      .then((response) => {
        this.setState({isLoggedIn: true});
      })
      .catch((error) => {
        this.setState({isLoggedIn: false});
      });
    if(this.state.isLoggedIn) {
      this.setState({ loading: true }, () => {
      getEventsData(this.state.startDate.format("YYYY-MM-DD"), this.state.endDate.format("YYYY-MM-DD"))
        .then((response) => {
          this.setState(() => ({
            loading: false,
            events: response.data
          }));
          var items = response.data
          const replacer = (key, value) => value === null ? '' : value
          const header = Object.keys(items[0])
          let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'))
          csv.unshift(header.join(';'))
          csv = csv.join('\r\n')
          var blob = new Blob(["\ufeff", csv]);
          //för IE(11)
          if (navigator.appVersion.toString().indexOf('.NET') > 0)
            window.navigator.msSaveBlob(blob, "Lokalbokningar.csv");
          else
          {
            var downloadLink = document.createElement("a");
            var url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = "Lokalbokningar.csv";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          }
        })
        .catch((error) => {
          this.setState(() => ({ events: error.response.data}));
        });
      })
    } else {
      //TODO visa meddelande om att sessionen upphört
    }
  }

  render() {
    const { isLoggedIn} = this.state;

    return (
      <div className="App">
        <div className="App-intro">
          <KthHeader isLoggedIn={isLoggedIn}></KthHeader>
          {isLoggedIn ? (
            <div className="kthheader">
              <div className="kthlead">
                Välj för vilket datumintervall du vill ladda ner bokningar.
              </div>
              <div className="flexcontainer">
                <div className="flex10 centeralignselfflex">Från:</div>
                <div className="flex90">
                  <DatePicker className="flex10"
                    dateFormat="YYYY-MM-DD"
                    locale="sv"
                    selected={this.state.startDate}
                    selectsStart
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    onChange={this.handleChangeStart} />
                </div>
              </div>
              <div className="flexcontainer">
                <div className="flex10 centeralignselfflex">Till:</div>
                <div className="flex90">
                  <DatePicker
                    dateFormat="YYYY-MM-DD"
                    locale="sv"
                    selected={this.state.endDate}
                    selectsEnd
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    onChange={this.handleChangeEnd} />
                </div>
              </div>
              <button className="button pointercursor width80px" onClick={this.getLokalbokningar}>
                <img className="width100percent" alt="" src={excelcsvlogo}/>
                <div className="">
                  Ladda ner
                </div>
              </button>
            </div>
          ) : (
            <div className="kthheader">
              <div className="kthlead">
                Logga in med ditt KTH-konto för att kunna ladda ner bokningar
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
