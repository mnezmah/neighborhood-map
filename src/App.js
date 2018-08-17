import React, { Component } from 'react';
import MyMap from './MyMap.js';
import './App.css';
import * as AllLocations from './MyLocations.json';
import Locations from'./Locations.js';
import escapeRegExp from 'escape-string-regexp';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myLocations: AllLocations,
      query: '',
      showInfoWindow: false, 
      selectedPlace: {},
      filterPlaces: [],
      infoWindowPlace: {},
      activeMarker: {},
      showPlaces: true,
      error: false
    };
  }

  componentDidMount() {
    const venues = this.state.myLocations;
    venues.map((location) =>  {
      return fetch(`https://api.foursquare.com/v2/venues/search?ll=${location.location.lat},${location.location.lng}&client_id=FXQZVA0L3WZBMWFSP5WRH0ZZAEHRGAQC2O5UXF2F5QCTIMXV&client_secret=KZSUCZ0SPSDVEVO1CQKH0KXOETY2ISR4JHAUGWFPFH3YAGMM&v=20180731`)
      .then(response => response.json())
      .then((data) => {
        location.name = data.response.venues[0].name
        location.type = data.response.venues[0].categories[0].name;
        location.address = data.response.venues[0].location.address;
      this.setState({ venues })
      })
      .catch(error => {
        this.setState({ error: true });
      });
    });
    
    window.gm_authFailure = () => this.setState({ error: true });
    if (window.google === undefined) {
      this.setState({ error: true });
    }
  }

  renderMarkers = [];
  addMarker = marker => {
    if (marker) {
      this.renderMarkers.push(marker);
    }
  };

  removeAnimation = () => {
    this.renderMarkers.map(item => {
      return item.marker.setAnimation(null);
    });
  };

  onMarkerClick = (props, marker) => {
    this.removeAnimation();
    this.setState({
      selectedPlace: props,
      showInfoWindow: true,
      infoWindowPlace: props.position,
      activeMarker: marker
    });
    this.state.activeMarker.setAnimation(1);
  };

  onMapclicked = props =>  {
    this.removeAnimation();
    if (this.state.showInfoWindow) {
      this.setState({
        showInfoWindow: false,
        infoWindowPlace: {}
      });
    }
  };

  onItemClick = (location, props, renderMarkers) =>  {
     this.removeAnimation();
     let newInstance;
     this.renderMarkers.map(item => {
      if (item.marker.title === location.key) {
      newInstance = item.marker;
      }
      return newInstance;
    });

    this.setState({
      showInfoWindow: true,
      selectedPlace: location,
      infoWindowPlace: location.location,
      activeMarker: this.renderMarkers[0].marker
    });
    newInstance.setAnimation(1);
  };

  closeInfoWindow = () => {
    this.removeAnimation();
  };

  filterPlaces = (query) => {
    this.setState({
      query: query, 
      infoWindowPlace: {},
      showInfoWindow: false
    });
  };

  toggleNavbar = () => {
    document.querySelector('.plces-list').classList.toggle('hidden')
  };

  render() {
    let filteredLocations;
    const {query, myLocations} = this.state;
    if(query)  {
      const match = new RegExp (escapeRegExp(query), 'i');
      filteredLocations = myLocations.filter((location) => match.test(location.name))
    } else {
      filteredLocations = myLocations;
      }

    const showPlaces = this.state.showPlaces;
    const errorFree = !this.state.error;

    return(
  
      <div className="App" role="Main">
        <header className="App-header">
          <a className="menu" 
             tabIndex="0"
             onClick={this.toggleNavbar}>
            <svg className="hamburger" 
               xmlns="http://www.w3.org/2000/svg" 
               viewBox="0 0 24 24">
              <path d="M2 6h20v3H2zm0 5h20v3H2zm0 5h20v3H2z"/>
            </svg>
          </a>
          <h1 className="App-title"
              tabIndex="0"
              role="Heading"
          >Mountain huts on Mountain Medvednica
          </h1>
        </header>
        {errorFree ? (
          <div className="container">
            {showPlaces && (
              <Locations
                className="plces-list"
                role="List"
                locations={this.state.MyLocations}
                filteredLocations={filteredLocations}
                query={this.state.query}
                filterPlaces={this.filterPlaces}
                onItemClick={this.onItemClick}
                showPlaces={this.state.showPlaces}
              />
            )}        
            <div role="application">
              <MyMap
                google={window.google}   
                locations={filteredLocations}
                toggleNavbar={this.toggleNavbar}
                selectedPlace={this.state.selectedPlace}
                showInfoWindow={this.state.showInfoWindow}
                onMarkerClick={this.onMarkerClick}
                infoWindowPlace={this.state.infoWindowPlace}
                closeInfoWindow={this.closeInfoWindow}
                onMapclicked={this.onMapclicked}
                activeMarker={this.state.activeMarker}
                addMarker={this.addMarker}
                info={this.state.info}
                error={this.state.error}
              />
            </div> 
            <footer className="footer">
              <p className="sources">
              Powered by Google Maps API and foursquare
              </p>
            </footer>
          </div>
            ) : (
            <div className="error">
              <p className="errorMsg">
                Fetching data from third party API failed. Please try again!
              </p>
              <p className="errorMsg">
                Please check the console for possible solution!
              </p>
            </div>// error
            )}
      </div>
    );
  }
}

export default App;