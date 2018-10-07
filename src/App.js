import React, { Component } from 'react';
import './App.css';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import moment from 'moment'
import Logo from './logo.png'


const MyMapComponent = withGoogleMap((props) =>
    <GoogleMap
      defaultZoom={13}
      defaultCenter={{ lat: 39.108774, lng: -84.511449 }}
    >

    {props.state.birds.map(bird=>{
      return <Marker position={{ lat:Number(bird.lat), lng: Number(bird.long) }} />
    })}
  </GoogleMap>
)

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      birds: [],
      runs: [],
      currentAnimationDate: false,
    };
  }

  async doTimeSequence() {

    for(const run of this.state.runs) {
      this.setState({
        currentAnimationDate: run.time
      })
      await this.changeRun(false, run._id);
    }
  }

  async changeRun(e, runId){
    let id = runId;
    if(e.target) id=e.target.value;
    var url = `https://whispering-headland-84040.herokuapp.com/birds/${id}`;
    await fetch(url).then(
      response => response.json()
    ).then((birds)=>{
       this.setState({
        birds:birds.birds
      })
    })
  }

  componentDidMount() {
    var url = 'https://whispering-headland-84040.herokuapp.com/runs'
    fetch(url).then(
      response => response.json()
    ).then((runs)=>{
      this.setState({
        runs,
        currentAnimationDate: runs[0].time
      })
      this.changeRun(false, runs[0]._id)
    }
    );
  }
  render() {
    const animating = ()=>{
      return (
        <div className="time">
          <h2>Date/Time Shown</h2>
          <h3>{moment(this.state.currentAnimationDate).format('MMMM Do YYYY, h:mm a')}</h3>
        </div>
      )
    }
    return (
      <div className="App">
        <div class="runs">
        <img src={Logo} />
        <h2>Date and Time</h2>
          <select onChange={this.changeRun.bind(this)} name="runs" id="">
          {this.state.runs.map((run)=> {
            return <option value={run._id}>
              {moment(run.time).format('MMMM Do YYYY, h:mm a')}
            </option>
          })}
          </select>

          <button onClick={this.doTimeSequence.bind(this)}>Animate</button>

          {animating()}
        </div>
        <MyMapComponent 
        containerElement={<div style={{ height: `900px` }} />}
        state= {this.state}
        mapElement={<div style={{ height: `100%` }} />}
        isMarkerShown 
        />
      </div>
    );
  }
}

export default App;
