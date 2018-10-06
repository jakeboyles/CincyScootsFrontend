import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Map, TileLayer, Marker, Popup } from '../node_modules/react-leaflet/src';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      birds: []
    };
  }

  componentDidMount() {
    var url = 'http://localhost:8080/birds'
    fetch(url).then(
      response => response.json()
    ).then((birds)=>{
      this.setState({
        birds: birds.birds
      })
    }
    );
  }
  render() {
    const position = [39.108774, -84.511449]

    return (
      <div className="App">
      <Map center={position} zoom={this.state.zoom}>
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {this.state.birds.map(bird=>{
          return <Marker position={[bird.lat, bird.long]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        })}
      </Map>
      </div>
    );
  }
}

export default App;
