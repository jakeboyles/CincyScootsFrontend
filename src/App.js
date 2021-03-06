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

  // Animating the time sequence
  async doTimeSequence() {

    for(const run of this.state.runs) {
      this.setState({
        currentAnimationDate: run.time
      })
      await this.changeRun(false, run._id);
    }
  }

  // Change the run based on an event or just a run id.
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

  // Toggle the position of the sidebar
  toggle() {
    const runs = document.querySelector('.runs');
    if(runs.classList.contains('hide')) {
      document.querySelector('.runs').classList.remove('hide');
    } else {
      document.querySelector('.runs').classList.add('hide');
    }
  }

  // Get all our runs and set the inital date.
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
        <div className="runs">
          <img alt="logo" src={Logo} />
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

          <div onClick={this.toggle.bind(this)} className="showHide">
            <span>Toggle</span>
          </div>

          <span class="attr">A <a target="_blank" href="http://www.twitter.com/jakeboyles">@JakeBoyles</a> Project</span>
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
